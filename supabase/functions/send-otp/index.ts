import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MINUTES = 60;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const body = await req.json();
    const { email, action, otp, token } = body;

    // ✅ restrict access in test mode (Resend onboarding sender only allows one recipient)
    const ALLOWED_TEST_EMAIL = "raunakkumarpandit0011@gmail.com";
    if (email !== ALLOWED_TEST_EMAIL) {
      return new Response(
        JSON.stringify({
          error: `In test mode, OTP can only be sent to ${ALLOWED_TEST_EMAIL}. Please use this email or verify a domain at resend.com/domains and update the 'from' address.`,
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const OTP_SECRET = Deno.env.get("OTP_SECRET");

    if (!RESEND_API_KEY || !OTP_SECRET) {
      throw new Error("Missing required environment variables");
    }

    // -----------------------------
    // 🔹 SEND OTP
    // -----------------------------
    if (action === "send") {
      // Check rate limiting
      const { data: existingLimit } = await supabaseClient
        .from('otp_rate_limits')
        .select('*')
        .eq('email', email)
        .single();

      const now = new Date();
      
      if (existingLimit) {
        const lastAttempt = new Date(existingLimit.last_attempt);
        const minutesSinceLastAttempt = (now.getTime() - lastAttempt.getTime()) / (1000 * 60);
        
        if (minutesSinceLastAttempt < RATE_LIMIT_WINDOW_MINUTES) {
          if (existingLimit.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
            return new Response(
              JSON.stringify({ error: "Too many requests. Please try again later." }),
              { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          
          // Update attempts
          await supabaseClient
            .from('otp_rate_limits')
            .update({ 
              attempts: existingLimit.attempts + 1,
              last_attempt: now.toISOString()
            })
            .eq('email', email);
        } else {
          // Reset if outside window
          await supabaseClient
            .from('otp_rate_limits')
            .update({ 
              attempts: 1,
              last_attempt: now.toISOString()
            })
            .eq('email', email);
        }
      } else {
        // Create new rate limit record
        await supabaseClient
          .from('otp_rate_limits')
          .insert({ email, attempts: 1, last_attempt: now.toISOString() });
      }

      const otp = Math.floor(10000 + Math.random() * 90000).toString();
      const timestamp = Math.floor(Date.now() / 1000);
      const message = `${email}:${otp}:${timestamp}`;

      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(OTP_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
      const token = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // ✅ Send OTP email via Resend
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Private Account Acsess <onboarding@resend.dev>", // Verified sender by Resend
          to: [email],
          subject: "Security Code 6 Digit",
          html: `
            <h2>Your OTP Code Here</h2>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
              ${otp}
            </p>
            <p>This code is valid for 5 minutes. Do Not Share This OTP </p>
            <p>Regards,<br>Raunak Kumar</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errJson = await emailResponse.json().catch(() => ({} as any));
        console.error("[Internal] Email service error:", emailResponse.status, errJson);
        return new Response(
          JSON.stringify({ error: "Failed to send email. Please try again later." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          token: `${timestamp}:${token}`,
          message: "OTP sent successfully",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // -----------------------------
    // 🔹 VERIFY OTP
    // -----------------------------
    if (action === "verify") {
      if (!otp || !token) {
        return new Response(
          JSON.stringify({ error: "OTP and token required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const [timestampStr, receivedToken] = token.split(":");
      const timestamp = parseInt(timestampStr);
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime - timestamp > 300) {
        return new Response(
          JSON.stringify({ error: "OTP expired" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const message = `${email}:${otp}:${timestamp}`;
      const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(OTP_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
      const expectedToken = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (expectedToken !== receivedToken) {
        return new Response(
          JSON.stringify({ error: "Invalid OTP" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, message: "OTP verified successfully" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Internal] OTP function error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
