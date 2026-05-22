import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function stripeRequest(secretKey: string, path: string, body: URLSearchParams) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Stripe error ${res.status}: ${err}`)
  }
  return res.json()
}

function flattenParams(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const k = prefix ? `${prefix}[${key}]` : key
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item, i) => {
          if (typeof item === 'object') {
            Object.assign(result, flattenParams(item as Record<string, unknown>, `${k}[${i}]`))
          } else {
            result[`${k}[${i}]`] = String(item)
          }
        })
      } else if (typeof value === 'object') {
        Object.assign(result, flattenParams(value as Record<string, unknown>, k))
      } else {
        result[k] = String(value)
      }
    }
  }
  return result
}

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

    const { service_id, amount, client_name, client_email, client_phone, booking_date, booking_time } = await req.json()

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
