// ===========================================
// VERCEL API ROUTE: /api/webhooks/lemon-squeezy
// Handles Lemon Squeezy payment webhooks
// Replaces the Supabase Edge Function
// ===========================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ==================
// TYPES
// ==================

interface WebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      store_id: number;
      customer_id: number;
      product_id: number;
      variant_id: number;
      product_name: string;
      variant_name: string;
      user_email: string;
      status: string;
      cancelled: boolean;
      renews_at: string | null;
      ends_at: string | null;
      created_at: string;
      updated_at: string;
      test_mode: boolean;
    };
  };
}

// ==================
// RAW BODY READER
// ==================

/**
 * Read the raw request body from the stream
 * This is CRITICAL for webhook signature verification
 * Lemon Squeezy signs the exact raw body string
 */
async function getRawBody(req: VercelRequest): Promise<string> {
  // If body is already a string, return it
  if (typeof req.body === 'string') {
    return req.body;
  }

  // If body was already parsed, we need to read from the stream
  // But Vercel may have already consumed it, so try buffer first
  if (Buffer.isBuffer(req.body)) {
    return req.body.toString('utf8');
  }

  // Try reading from stream
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf8'));
    });
    req.on('error', reject);

    // If no data comes in 100ms, body was already consumed
    // Fall back to stringifying the parsed body
    setTimeout(() => {
      if (chunks.length === 0 && req.body) {
        resolve(JSON.stringify(req.body));
      }
    }, 100);
  });
}

// ==================
// SIGNATURE VERIFICATION
// ==================

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const computedSignature = hmac.digest('hex');

  console.log(`[WEBHOOK] Computed signature: ${computedSignature.substring(0, 20)}...`);
  console.log(`[WEBHOOK] Received signature: ${signature.substring(0, 20)}...`);

  return timingSafeEqual(computedSignature, signature);
}

// ==================
// MAIN HANDLER
// ==================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[WEBHOOK] Lemon Squeezy webhook received at ${new Date().toISOString()}`);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get signature from headers
    const signature = req.headers['x-signature'] as string | undefined;
    console.log(`[WEBHOOK] Has signature: ${!!signature}`);

    // Get secrets
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!webhookSecret) {
      console.error('[WEBHOOK] Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Read raw body for signature verification
    const rawBody = await getRawBody(req);
    console.log(`[WEBHOOK] Raw body length: ${rawBody.length}`);

    // Verify signature
    const isValid = verifySignature(rawBody, signature || null, webhookSecret);
    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      console.error('[WEBHOOK] Body preview:', rawBody.substring(0, 100));
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('[WEBHOOK] Signature verified successfully');

    // Parse the raw body as JSON
    const payload: WebhookPayload = JSON.parse(rawBody);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const userId = meta.custom_data?.user_id;
    const attributes = data.attributes;

    console.log(`[WEBHOOK] Processing: ${eventName}`, {
      userId,
      email: attributes.user_email,
      subscriptionId: data.id
    });

    // Initialize Supabase
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // ==================
    // IDEMPOTENCY CHECK
    // ==================
    const eventId = `${eventName}-${data.id}-${attributes.updated_at}`;

    const { data: existingEvent } = await supabase
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (existingEvent) {
      console.log('[WEBHOOK] Already processed:', eventId);
      return res.status(200).json({ received: true, message: 'Already processed' });
    }

    // Record the webhook event
    await supabase.from('webhook_events').insert({
      event_id: eventId,
      event_name: eventName,
      payload: payload,
      processed: false,
    });

    // ==================
    // FIND USER
    // ==================
    let targetUserId = userId;
    if (!targetUserId && attributes.user_email) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', attributes.user_email)
        .single();

      if (profile) {
        targetUserId = profile.id;
      }
    }

    if (!targetUserId) {
      console.error('[WEBHOOK] User not found:', { email: attributes.user_email });
      await supabase
        .from('webhook_events')
        .update({ processed: true })
        .eq('event_id', eventId);

      return res.status(200).json({ received: true, warning: 'User not found' });
    }

    // ==================
    // HANDLE EVENTS
    // ==================
    switch (eventName) {
      case 'subscription_created': {
        console.log(`[WEBHOOK] Granting premium to user: ${targetUserId}`);

        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            subscription_status: 'active',
            subscription_id: data.id,
            subscription_variant: attributes.variant_name.toLowerCase(),
            subscription_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        // Reset search count
        const currentMonth = new Date().toISOString().slice(0, 7);
        await supabase
          .from('search_usage')
          .upsert(
            {
              user_id: targetUserId,
              month_year: currentMonth,
              search_count: 0,
              last_search_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,month_year' }
          );

        console.log(`[WEBHOOK] Search count reset for user: ${targetUserId}`);
        break;
      }

      case 'subscription_updated': {
        console.log(`[WEBHOOK] Updating subscription for user: ${targetUserId}`);

        const status = attributes.cancelled ? 'cancelled' : attributes.status;
        let isPremium: boolean;

        if (['active', 'on_trial', 'past_due'].includes(attributes.status)) {
          isPremium = true;
        } else if (attributes.cancelled && attributes.ends_at) {
          const endsAt = new Date(attributes.ends_at);
          isPremium = endsAt > new Date();
          console.log(`[WEBHOOK] Cancelled, access until: ${attributes.ends_at}, isPremium: ${isPremium}`);
        } else {
          isPremium = false;
        }

        await supabase
          .from('profiles')
          .update({
            is_premium: isPremium,
            subscription_status: status,
            subscription_variant: attributes.variant_name.toLowerCase(),
            subscription_ends_at: attributes.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        break;
      }

      case 'subscription_cancelled': {
        console.log(`[WEBHOOK] Subscription cancelled for user: ${targetUserId}`);
        console.log(`[WEBHOOK] Access until: ${attributes.ends_at}`);

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            subscription_ends_at: attributes.ends_at,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        break;
      }

      case 'subscription_resumed': {
        console.log(`[WEBHOOK] Subscription resumed for user: ${targetUserId}`);

        await supabase
          .from('profiles')
          .update({
            is_premium: true,
            subscription_status: 'active',
            subscription_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        break;
      }

      case 'subscription_expired': {
        console.log(`[WEBHOOK] Subscription expired for user: ${targetUserId}`);

        await supabase
          .from('profiles')
          .update({
            is_premium: false,
            subscription_status: 'expired',
            subscription_id: null,
            subscription_variant: null,
            subscription_ends_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        break;
      }

      case 'subscription_payment_success': {
        console.log(`[WEBHOOK] Payment success for user: ${targetUserId}`);
        break;
      }

      case 'subscription_payment_failed': {
        console.log(`[WEBHOOK] Payment failed for user: ${targetUserId}`);

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetUserId);

        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event: ${eventName}`);
    }

    // Mark as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true })
      .eq('event_id', eventId);

    console.log(`[WEBHOOK] Successfully processed: ${eventName}`);
    return res.status(200).json({ received: true });

  } catch (error: any) {
    console.error('[WEBHOOK] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
