import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Build the email content
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #1a1a1a;">Reservation Confirmed!</h2>
        <p>Hi ${record.name},</p>
        <p>Your table at <strong>CoLab Coffee</strong> has been successfully booked.</p>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${record.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${record.time}</p>
          <p style="margin: 5px 0;"><strong>Guests:</strong> ${record.guests}</p>
          <p style="margin: 5px 0;"><strong>Reference:</strong> ${record.reference_id || 'N/A'}</p>
        </div>

        <p>If you need to change or cancel your reservation, please use our website or contact us directly.</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">
          CoLab Coffee Calcutta <br/>
          Follow us on Instagram @colabcoffeecalcutta
        </p>
      </div>
    `

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'CoLab Coffee <notifications@resend.dev>',
        to: [record.email],
        subject: `Reservation Confirmed - ${record.date}`,
        html: emailHtml,
      }),
    })

    const data = await res.json()
    console.log('Email sent successfully:', data)

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
