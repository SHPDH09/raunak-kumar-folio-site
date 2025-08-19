import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/crypto.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Function called with method:', req.method)
    const { email, action } = await req.json()
    console.log('Request body parsed:', { email, action })

    // Only allow specific email
    if (email !== 'rk331159@gmail.com') {
      console.log('Unauthorized email attempted:', email)
      return new Response(
        JSON.stringify({ error: 'Email not authorized' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const OTP_SECRET = Deno.env.get('OTP_SECRET')
    console.log('Environment variables check:', { 
      hasResendKey: !!RESEND_API_KEY, 
      hasOtpSecret: !!OTP_SECRET 
    })

    if (!RESEND_API_KEY || !OTP_SECRET) {
      console.error('Missing environment variables')
      throw new Error('Missing required environment variables')
    }

    if (action === 'send') {
      // Generate 5-digit OTP
      const otp = Math.floor(10000 + Math.random() * 90000).toString()
      
      // Create HMAC with timestamp (valid for 5 minutes)
      const timestamp = Math.floor(Date.now() / 1000)
      const message = `${email}:${otp}:${timestamp}`
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(OTP_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
      const token = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')

      // Send email via Resend
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [email],
          subject: 'Your OTP Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Your OTP Code</h2>
              <p>Your 5-digit OTP code is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px; text-align: center; margin: 20px 0;">
                ${otp}
              </div>
              <p>This code is valid for 5 minutes.</p>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email')
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          token: `${timestamp}:${token}`,
          message: 'OTP sent successfully' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify') {
      const { otp, token } = await req.json()
      
      if (!otp || !token) {
        return new Response(
          JSON.stringify({ error: 'OTP and token required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const [timestampStr, receivedToken] = token.split(':')
      const timestamp = parseInt(timestampStr)
      const currentTime = Math.floor(Date.now() / 1000)

      // Check if token is expired (5 minutes)
      if (currentTime - timestamp > 300) {
        return new Response(
          JSON.stringify({ error: 'OTP expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify HMAC
      const message = `${email}:${otp}:${timestamp}`
      const key = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(OTP_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      )
      const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
      const expectedToken = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('')

      if (expectedToken !== receivedToken) {
        return new Response(
          JSON.stringify({ error: 'Invalid OTP' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'OTP verified successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
