import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  // TODO: Restrict to specific production domain(s) instead of '*'
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

async function verifyStripeSignature(payload: string, signature: string, secret: string): Promise<unknown> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  )

  const parts = signature.split(',')
  const timestampPart = parts.find((p) => p.startsWith('t='))
  const sigPart = parts.find((p) => p.startsWith('v1='))
  if (!timestampPart || !sigPart) throw new Error('Invalid signature format')

  const timestamp = timestampPart.slice(2)
  const sig = sigPart.slice(3)
  const signedPayload = `${timestamp}.${payload}`
  const sigBytes = hexToBytes(sig)

  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(signedPayload))
  if (!valid) throw new Error('Invalid signature')

  return JSON.parse(payload)
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const payload = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('Missing stripe-signature header')
    }

    const event = await verifyStripeSignature(payload, signature, webhookSecret)

    const tMatch = signature.match(/(?:^|,)t=(\d+)/)
    if (tMatch) {
      const eventTimeMs = parseInt(tMatch[1], 10) * 1000
      if (Date.now() - eventTimeMs > 300_000) {
        return new Response(JSON.stringify({ error: 'Event timestamp too old' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const metadata = session.metadata || {}

        if (metadata.type === 'booking') {
          const { data: existingBooking } = await supabase
            .from('bookings')
            .select('id')
            .eq('stripe_session_id', session.id)
            .maybeSingle()
          if (existingBooking) {
            console.log('Duplicate booking event, skipping')
            break
          }

          const depositAmount = metadata.deposit_amount && metadata.deposit_amount !== '0'
            ? parseFloat(metadata.deposit_amount)
            : null

          const { error: bookingError } = await supabase.from('bookings').insert({
            service_id: metadata.service_id,
            client_name: metadata.client_name,
            client_email: metadata.client_email,
            client_phone: metadata.client_phone || null,
            booking_date: metadata.booking_date,
            booking_time: metadata.booking_time,
            status: 'confirmed',
            payment_status: depositAmount ? 'partial' : 'paid',
            total_amount: parseFloat(metadata.total_amount || '0'),
            deposit_amount: depositAmount,
            stripe_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent || null,
          })

          if (bookingError) {
            console.error('Failed to insert booking:', bookingError)
            throw bookingError
          }
        } else if (metadata.type === 'gift') {
          const { data: existingGift } = await supabase
            .from('gift_certificates')
            .select('id')
            .eq('stripe_session_id', session.id)
            .maybeSingle()
          if (existingGift) {
            console.log('Duplicate gift event, skipping')
            break
          }

          const { error: giftError } = await supabase.from('gift_certificates').insert({
            buyer_name: metadata.buyer_name,
            buyer_email: metadata.buyer_email,
            recipient_name: metadata.recipient_name || null,
            recipient_email: metadata.recipient_email || null,
            message: metadata.message || null,
            amount: parseFloat(metadata.amount || '0'),
            stripe_session_id: session.id,
            status: 'active',
          })

          if (giftError) {
            console.error('Failed to insert gift certificate:', giftError)
            throw giftError
          }
        }
        break
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object
        const { error: piError } = await supabase
          .from('bookings')
          .update({ payment_status: 'paid', stripe_payment_intent_id: pi.id })
          .eq('stripe_payment_intent_id', pi.id)

        if (piError) {
          console.error('Failed to update booking payment:', piError)
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object
        const metadata = session.metadata || {}
        if (metadata.type === 'gift') {
          const { error: expireError } = await supabase
            .from('gift_certificates')
            .update({ status: 'expired' })
            .eq('stripe_session_id', session.id)

          if (expireError) {
            console.error('Failed to expire gift certificate:', expireError)
          }
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('stripe-webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
