import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify Razorpay webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return expectedSignature === signature;
}

// Log webhook event for debugging and audit
async function logWebhookEvent(event: any) {
  try {
    const { data, error } = await supabase
      .from('webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.event,
        entity_type: event.entity,
        entity_id: event.entity_id,
        payload: event,
        signature: event.signature || null,
        processed: false
      });

    if (error) {
      console.error('Error logging webhook event:', error);
    }
  } catch (error) {
    console.error('Error in logWebhookEvent:', error);
  }
}

// Update webhook event as processed
async function markWebhookEventProcessed(eventId: string, error?: string) {
  try {
    const { error: updateError } = await supabase
      .from('webhook_events')
      .update({
        processed: true,
        processing_error: error || null
      })
      .eq('event_id', eventId);

    if (updateError) {
      console.error('Error updating webhook event status:', updateError);
    }
  } catch (error) {
    console.error('Error in markWebhookEventProcessed:', error);
  }
}

// Handle subscription activated event
async function handleSubscriptionActivated(subscription: any, instituteId: string) {
  try {
    // Update institute status to trialing
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'trialing',
      p_subscription_id: subscription.id,
      p_trial_end_date: subscription.expire_by ? new Date(subscription.expire_by * 1000).toISOString() : null,
      p_next_billing_date: subscription.next_charge_at ? new Date(subscription.next_charge_at * 1000).toISOString() : null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Update subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'trialing',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription activated for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionActivated:', error);
    throw error;
  }
}

// Handle subscription charged event
async function handleSubscriptionCharged(subscription: any, instituteId: string) {
  try {
    // Update institute status to active
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'active',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: subscription.next_charge_at ? new Date(subscription.next_charge_at * 1000).toISOString() : null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Record payment
    const { error: paymentError } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.id,
        razorpay_payment_id: subscription.id,
        amount: subscription.amount || 0,
        currency: 'INR',
        status: 'captured',
        paid_at: new Date().toISOString()
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      throw paymentError;
    }

    // Update subscription paid count
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        paid_count: subscription.paid_count || 0,
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (updateError) {
      console.error('Error updating subscription paid count:', updateError);
    }

    console.log(`Payment charged for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionCharged:', error);
    throw error;
  }
}

// Handle subscription failed event
async function handleSubscriptionFailed(subscription: any, instituteId: string) {
  try {
    // Update institute status to failed
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'failed',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Record failed payment
    const { error: paymentError } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscription.id,
        razorpay_payment_id: subscription.id,
        amount: subscription.amount || 0,
        currency: 'INR',
        status: 'failed',
        failure_reason: 'Payment failed'
      });

    if (paymentError) {
      console.error('Error recording failed payment:', paymentError);
      throw paymentError;
    }

    console.log(`Payment failed for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionFailed:', error);
    throw error;
  }
}

// Handle subscription cancelled event
async function handleSubscriptionCancelled(subscription: any, instituteId: string) {
  try {
    // Update institute status to cancelled
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'cancelled',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription cancelled for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionCancelled:', error);
    throw error;
  }
}

// Handle subscription expired event
async function handleSubscriptionExpired(subscription: any, instituteId: string) {
  try {
    // Update institute status to expired
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'expired',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription expired for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionExpired:', error);
    throw error;
  }
}

// Handle subscription halted event
async function handleSubscriptionHalted(subscription: any, instituteId: string) {
  try {
    // Update institute status to paused
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'paused',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'paused',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription halted for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionHalted:', error);
    throw error;
  }
}

// Handle subscription completed event
async function handleSubscriptionCompleted(subscription: any, instituteId: string) {
  try {
    // Update institute status to completed
    const { error: instituteError } = await supabase.rpc('update_institute_subscription_status', {
      p_institute_id: instituteId,
      p_status: 'completed',
      p_subscription_id: null,
      p_trial_end_date: null,
      p_next_billing_date: null
    });

    if (instituteError) {
      console.error('Error updating institute status:', instituteError);
      throw instituteError;
    }

    // Update subscription status
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('razorpay_subscription_id', subscription.id);

    if (subscriptionError) {
      console.error('Error updating subscription status:', subscriptionError);
      throw subscriptionError;
    }

    console.log(`Subscription completed for institute ${instituteId}`);
  } catch (error) {
    console.error('Error in handleSubscriptionCompleted:', error);
    throw error;
  }
}

// Process webhook event based on event type
async function processWebhookEvent(event: any) {
  const { event: eventType, contains } = event;
  const subscription = event.entity;

  // Only process subscription events
  if (!contains.includes('subscription')) {
    console.log('Not a subscription event, skipping...');
    return;
  }

  // Extract institute_id from subscription notes
  const instituteId = subscription.notes?.institute_id;
  if (!instituteId) {
    console.error('No institute_id found in subscription notes');
    throw new Error('No institute_id found in subscription notes');
  }

  console.log(`Processing ${eventType} for institute ${instituteId}`);

  switch (eventType) {
    case 'subscription.activated':
      await handleSubscriptionActivated(subscription, instituteId);
      break;
      
    case 'subscription.charged':
      await handleSubscriptionCharged(subscription, instituteId);
      break;
      
    case 'subscription.halted':
      await handleSubscriptionHalted(subscription, instituteId);
      break;
      
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(subscription, instituteId);
      break;
      
    case 'subscription.completed':
      await handleSubscriptionCompleted(subscription, instituteId);
      break;
      
    case 'subscription.expired':
      await handleSubscriptionExpired(subscription, instituteId);
      break;
      
    case 'subscription.failed':
      await handleSubscriptionFailed(subscription, instituteId);
      break;
      
    case 'subscription.trial_will_end':
      // Handle trial ending notification
      console.log(`Trial will end for institute ${instituteId}`);
      break;
      
    default:
      console.log(`Unhandled event: ${eventType}`);
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Get the raw body and signature
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    
    if (!signature) {
      console.error('No signature found in request headers');
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the event
    const event = JSON.parse(body);
    console.log(`Received webhook event: ${event.event}`);

    // Log the webhook event
    await logWebhookEvent(event);

    // Process the event
    await processWebhookEvent(event);

    // Mark event as processed
    await markWebhookEventProcessed(event.id);

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Try to mark the event as failed if we have the event ID
    try {
      const body = await request.text();
      const event = JSON.parse(body);
      await markWebhookEventProcessed(event.id, error instanceof Error ? error.message : 'Unknown error');
    } catch (logError) {
      console.error('Error logging failed webhook:', logError);
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-razorpay-signature',
    },
  });
}
