import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

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
