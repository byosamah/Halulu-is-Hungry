// ===========================================
// VERCEL API ROUTE: /api/contact/send
// Sends contact form emails via Resend API
// Replaces the Supabase Edge Function
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[CONTACT] Send request at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
      console.log('[CONTACT] Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('[CONTACT] Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log(`[CONTACT] Sending email from: ${name} <${email}>`);

    // Get Resend API key
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('[CONTACT] Missing RESEND_API_KEY');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    // Send email via Resend API
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
      console.error('[CONTACT] Resend API error:', errorText);
      return res.status(500).json({ error: 'Failed to send email' });
    }

    const resendData = await resendResponse.json();
    console.log(`[CONTACT] Email sent successfully: ${resendData.id}`);

    return res.status(200).json({ success: true, messageId: resendData.id });

  } catch (error: any) {
    console.error('[CONTACT] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
