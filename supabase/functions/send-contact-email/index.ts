/**
 * Send Contact Email - Supabase Edge Function
 *
 * Receives contact form data and sends email via Resend.
 * Emails go to: osamah96@gmail.com
 *
 * Deploy with:
 *   supabase functions deploy send-contact-email --no-verify-jwt
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// ==================
// CORS HEADERS
// ==================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ==================
// TYPES
// ==================

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// ==================
// MAIN HANDLER
// ==================

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse request body
    const { name, email, message }: ContactFormData = await req.json();

    // Validate inputs
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Halulu Contact <onboarding@resend.dev>',
        to: ['osamah96@gmail.com'],
        reply_to: email,
        subject: `[Halulu Contact] Message from ${name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FF6B6B;">New Contact Form Message</h2>

            <div style="background: #FFF8F0; padding: 20px; border-radius: 12px; border: 2px solid #1a1a2e; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${name}</p>
              <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            </div>

            <div style="background: #fff; padding: 20px; border-radius: 12px; border: 2px solid #1a1a2e;">
              <p style="margin: 0 0 10px 0;"><strong>Message:</strong></p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <p style="color: #6B7280; font-size: 12px; margin-top: 20px;">
              This message was sent via the Halulu is Hungry contact form.
            </p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('Resend API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resendData = await resendResponse.json();
    console.log('Email sent successfully:', resendData.id);

    return new Response(
      JSON.stringify({ success: true, messageId: resendData.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
