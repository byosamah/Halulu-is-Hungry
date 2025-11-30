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
    // Get raw body - Vercel parses it, we need to stringify for signature verification
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-signature'] as string | undefined;

    // Get secrets
    const webhookSecret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!webhookSecret) {
      console.error('[WEBHOOK] Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // Verify signature
    const isValid = verifySignature(rawBody, signature || null, webhookSecret);
    if (!isValid) {
      console.error('[WEBHOOK] Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Parse payload
    const payload: WebhookPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
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

// Disable body parsing so we can access raw body for signature verification
export const config = {
  api: {
    bodyParser: true, // Vercel handles this differently than Next.js
  },
};
