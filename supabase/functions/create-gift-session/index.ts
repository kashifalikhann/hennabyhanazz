import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { corsHeaders, stripeRequest, flattenParams } from '../_shared/stripe.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const siteUrl = Deno.env.get('PUBLIC_SITE_URL') || 'http://localhost:4321'

    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not set')
    }

    const { amount, buyer_name, buyer_email, recipient_name, recipient_email, message } = await req.json()

    if (!amount || !buyer_name || !buyer_email) {
      return new Response(JSON.stringify({ error: 'Missing required fields: amount, buyer_name, buyer_email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (amount <= 0 || amount > 10000) {
      return new Response(JSON.stringify({ error: 'Amount must be between €0.01 and €10,000' }), {
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
            name: 'Henna By Hanazz — Gift Certificate',
            description: `Gift certificate purchased by ${buyer_name}${recipient_name ? ` for ${recipient_name}` : ''}`,
          },
          unit_amount: Math.round(amount),
        },
        quantity: 1,
      }],
      customer_email: buyer_email,
      metadata: {
        type: 'gift',
        buyer_name,
        buyer_email,
        recipient_name: recipient_name || '',
        recipient_email: recipient_email || '',
        message: message || '',
        amount: String(amount),
      },
      success_url: `${siteUrl}/gift/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/gift/cancelled`,
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
    console.error('create-gift-session error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
