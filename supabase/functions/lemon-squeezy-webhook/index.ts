/**
 * Lemon Squeezy Webhook Handler
 *
 * Supabase Edge Function that handles webhooks from Lemon Squeezy.
 * Updates user subscription status in the profiles table.
 *
 * Events handled:
 * - subscription_created → Set is_premium = true
 * - subscription_updated → Update subscription details
 * - subscription_cancelled → Mark for expiry (keep access until ends_at)
 * - subscription_resumed → Restore is_premium = true
 * - subscription_expired → Set is_premium = false
 *
 * Security:
 * - Verifies webhook signature using HMAC-SHA256
 * - Implements idempotency using webhook_events table
 *
 * Deploy with:
 *   supabase functions deploy lemon-squeezy-webhook
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
      urls?: {
        update_payment_method: string;
        customer_portal: string;
      };
    };
  };
}

// ==================
// SIGNATURE VERIFICATION
// ==================

async function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  if (!signature) return false;

  // Create HMAC-SHA256 hash
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(rawBody)
  );

  // Convert to hex
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Compare (constant-time comparison would be better, but this is sufficient)
  return hashHex === signature;
}

// ==================
// MAIN HANDLER
// ==================

serve(async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get raw body and signature
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');

    // Get secrets from environment
    const webhookSecret = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!webhookSecret) {
      console.error('Missing LEMON_SQUEEZY_WEBHOOK_SECRET');
      return new Response(
        JSON.stringify({ error: 'Webhook secret not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature
    const isValid = await verifySignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse the verified body
    const payload: WebhookPayload = JSON.parse(rawBody);
    const { meta, data } = payload;
    const eventName = meta.event_name;
    const userId = meta.custom_data?.user_id;
    const attributes = data.attributes;

    console.log(`Processing webhook: ${eventName}`, { userId, subscriptionId: data.id });

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: { persistSession: false },
    });

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
      console.log('Webhook already processed:', eventId);
      return new Response(
        JSON.stringify({ received: true, message: 'Already processed' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Record the webhook event
    await supabase.from('webhook_events').insert({
      event_id: eventId,
      event_name: eventName,
      payload: payload,
      processed: false,
    });

    // ==================
    // HANDLE EVENTS
    // ==================

    // If no user_id in custom_data, try to find by email
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
      console.error('Could not find user for webhook:', { email: attributes.user_email });
      // Mark as processed but with error
      await supabase
        .from('webhook_events')
        .update({ processed: true })
        .eq('event_id', eventId);

      return new Response(
        JSON.stringify({ received: true, warning: 'User not found' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Process based on event type
    switch (eventName) {
      // ==================
      // SUBSCRIPTION CREATED
      // ==================
      case 'subscription_created': {
        console.log('Granting premium access to user:', targetUserId);

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

        break;
      }

      // ==================
      // SUBSCRIPTION UPDATED
      // ==================
      case 'subscription_updated': {
        console.log('Updating subscription for user:', targetUserId);

        const status = attributes.cancelled ? 'cancelled' : attributes.status;
        const isPremium = ['active', 'on_trial', 'past_due'].includes(attributes.status);

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

      // ==================
      // SUBSCRIPTION CANCELLED
      // ==================
      case 'subscription_cancelled': {
        console.log('Subscription cancelled for user:', targetUserId);
        console.log('Access until:', attributes.ends_at);

        // Keep is_premium = true until ends_at
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

      // ==================
      // SUBSCRIPTION RESUMED
      // ==================
      case 'subscription_resumed': {
        console.log('Subscription resumed for user:', targetUserId);

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

      // ==================
      // SUBSCRIPTION EXPIRED
      // ==================
      case 'subscription_expired': {
        console.log('Subscription expired for user:', targetUserId);

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

      // ==================
      // PAYMENT EVENTS
      // ==================
      case 'subscription_payment_success': {
        console.log('Payment success for user:', targetUserId);
        // Could send a receipt email here
        break;
      }

      case 'subscription_payment_failed': {
        console.log('Payment failed for user:', targetUserId);
        // Could send a payment reminder email here

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
        console.log('Unhandled event:', eventName);
    }

    // Mark webhook as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true })
      .eq('event_id', eventId);

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
