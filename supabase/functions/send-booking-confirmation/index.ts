import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'hanazz@hennabyhanazz.com'

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const { booking_id } = await req.json()
    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'Missing booking_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, services(name_en, name_es)')
      .eq('id', booking_id)
      .single()

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ error: 'Booking not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const subject = `Booking Confirmed — Henna By Hanazz (${booking.booking_code})`
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="color: #8B4513;">Henna By Hanazz</h1>
        <h2>Booking Confirmed</h2>
        <p>Hi <strong>${booking.client_name}</strong>,</p>
        <p>Your booking has been confirmed!</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Service</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.services?.name_en || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Date</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.booking_date}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Time</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.booking_time}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Total</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${booking.total_amount.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Booking Code</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${booking.booking_code}</td>
          </tr>
        </table>
        <p>If you have any questions, reply to this email or call us.</p>
        <p>See you soon!<br>— Hanazz</p>
      </div>
    `

    if (resendApiKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: booking.client_email,
          subject,
          html,
        }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(`Resend error ${res.status}: ${err}`)
      }
    } else {
      console.log('RESEND_API_KEY not set — email not sent. Would have sent:')
      console.log('  To:', booking.client_email)
      console.log('  Subject:', subject)
      console.log('  HTML:', html)
    }

    return new Response(JSON.stringify({ sent: true, booking_code: booking.booking_code }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('send-booking-confirmation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
