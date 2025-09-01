import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

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
          from: "Lovable OTP <onboarding@resend.dev>", // Verified sender by Resend
          to: [email],
          subject: "Your OTP Code",
          html: `
            <h2>Your OTP Code</h2>
            <p style="font-size: 24px; font-weight: bold; color: #2563eb;">
              ${otp}
            </p>
            <p>This code is valid for 5 minutes.</p>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errJson = await emailResponse.json().catch(() => ({} as any));
        console.error("Resend send error:", emailResponse.status, errJson);
        return new Response(
          JSON.stringify({
            error: errJson?.error?.message || errJson?.message || errJson?.error || "Failed to send email",
            status: emailResponse.status,
          }),
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
