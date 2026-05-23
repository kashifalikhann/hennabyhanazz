import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, stripeRequest, flattenParams } from '../_shared/stripe.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:4321'

    if (!stripeKey || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { service_id, amount, client_name, client_email, client_phone, booking_date, booking_time, notes } = await req.json()

    if (!service_id || !amount || !client_name || !client_email || !booking_date || !booking_time) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single()

    if (serviceError || !service) {
      return new Response(JSON.stringify({ error: 'Service not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const minDeposit = Math.round(service.price * 0.3)
    if (amount < service.price && amount < minDeposit) {
      return new Response(JSON.stringify({ error: `Amount must be at least €${(minDeposit / 100).toFixed(2)} (30% deposit) or the full €${(service.price / 100).toFixed(2)}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const params = {
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${service.name_en} — ${client_name}`,
            description: `${service.description_en || ''} | ${booking_date} at ${booking_time}`,
          },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      }],
      customer_email: client_email,
      metadata: {
        type: 'booking',
        service_id,
        client_name,
        client_email,
        client_phone: client_phone || '',
        booking_date,
        booking_time,
        notes: notes || '',
        total_amount: String(service.price),
        deposit_amount: amount < service.price ? String(amount) : '0',
      },
      success_url: `${siteUrl}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/booking/cancelled`,
    }

    const body = new URLSearchParams()
    for (const [key, value] of Object.entries(flattenParams(params as Record<string, unknown>))) {
      body.append(key, value)
    }

    const session = await stripeRequest(stripeKey, '/checkout/sessions', body)

    return new Response(JSON.stringify({ session_url: session.url, session_id: session.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('create-checkout-session error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
