// Mobile App Integration Helper for Razorpay Subscriptions
// This file contains utilities for integrating with the mobile app

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for mobile app
const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Types for mobile app integration
export interface CreateSubscriptionParams {
  instituteId: string;
  customerId: string;
  planId?: string;
  trialDays?: number;
  totalCycles?: number;
}

export interface SubscriptionStatus {
  instituteId: string;
  status: 'active' | 'trialing' | 'cancelled' | 'expired' | 'failed' | 'paused' | 'completed';
  trialEndDate?: string;
  nextBillingDate?: string;
  subscriptionId?: string;
  planType?: string;
  isActive: boolean;
}

// Create Razorpay subscription with webhook integration
export async function createRazorpaySubscription(params: CreateSubscriptionParams) {
  const {
    instituteId,
    customerId,
    planId = 'plan_RQboAK7SPK2ZnF', // Default trial plan
    trialDays = 7,
    totalCycles = 12
  } = params;

  // Calculate dates
  const now = Math.floor(Date.now() / 1000);
  const trialEndTime = now + (trialDays * 24 * 60 * 60);

  const subscriptionParams = {
    plan_id: planId,
    customer_id: customerId,
    total_count: totalCycles,
    customer_notify: 1,
    start_at: now,
    expire_by: trialEndTime,
    notes: {
      institute_id: instituteId,
      trial_type: 'Free trial for coaching management',
      billing_cycles: totalCycles.toString(),
      trial_days: trialDays.toString(),
      webhook_url: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datorque.com') + '/api/webhooks/razorpay'
    }
  };

  // In a real implementation, you would call Razorpay API here
  // For now, we'll return the parameters that should be sent to Razorpay
  return {
    success: true,
    subscriptionParams,
    webhookUrl: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datorque.com') + '/api/webhooks/razorpay',
    instructions: {
      step1: 'Use these parameters to create subscription via Razorpay API',
      step2: 'Configure webhook URL in Razorpay dashboard',
      step3: 'Webhook will automatically update database when events occur'
    }
  };
}

// Get subscription status for mobile app
export async function getSubscriptionStatus(instituteId: string): Promise<SubscriptionStatus | null> {
  try {
    const { data, error } = await supabase
      .from('institutes')
      .select(`
        id,
        subscription_status,
        plan_type,
        trial_end_date,
        next_billing_date,
        subscription_id
      `)
      .eq('id', instituteId)
      .single();

    if (error) {
      console.error('Error getting subscription status:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    const now = new Date();
    const trialEndDate = data.trial_end_date ? new Date(data.trial_end_date) : null;

    // Determine if subscription is active
    const isActive = (
      data.subscription_status === 'active' ||
      (data.subscription_status === 'trialing' && 
       trialEndDate && trialEndDate > now)
    );

    return {
      instituteId: data.id,
      status: data.subscription_status as 'active' | 'trialing' | 'cancelled' | 'expired' | 'failed' | 'paused' | 'completed',
      trialEndDate: data.trial_end_date,
      nextBillingDate: data.next_billing_date,
      subscriptionId: data.subscription_id,
      planType: data.plan_type,
      isActive: !!isActive
    };
  } catch (error) {
    console.error('Error in getSubscriptionStatus:', error);
    return null;
  }
}

// Check if institute has access to premium features
export async function hasPremiumAccess(instituteId: string): Promise<boolean> {
  try {
    const subscriptionStatus = await getSubscriptionStatus(instituteId);
    return subscriptionStatus?.isActive || false;
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

// Get subscription details for mobile app
export async function getSubscriptionDetails(instituteId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_institute_subscription', { p_institute_id: instituteId });

    if (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }

    const subscription = data?.[0];
    if (!subscription) {
      return null;
    }

    // Get payment history
    const { data: payments, error: paymentError } = await supabase
      .rpc('get_subscription_payments', { p_subscription_id: subscription.subscription_id });

    if (paymentError) {
      console.error('Error getting payment history:', paymentError);
    }

    return {
      subscription,
      payments: payments || [],
      status: await getSubscriptionStatus(instituteId)
    };
  } catch (error) {
    console.error('Error in getSubscriptionDetails:', error);
    return null;
  }
}

// Update mobile app subscription status (called by webhook)
export async function updateMobileAppSubscription(
  instituteId: string,
  status: string,
  additionalData?: Record<string, unknown>
) {
  try {
    // This would typically send a push notification or update to the mobile app
    // For now, we'll just log the update
    console.log(`Mobile app subscription update for institute ${instituteId}:`, {
      status,
      additionalData,
      timestamp: new Date().toISOString()
    });

    // In a real implementation, you might:
    // 1. Send push notification
    // 2. Update real-time database
    // 3. Send email notification
    // 4. Update mobile app state

    return { success: true };
  } catch (error) {
    console.error('Error updating mobile app subscription:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Get webhook configuration for mobile app setup
export function getWebhookConfiguration() {
  return {
    webhookUrl: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datorque.com') + '/api/webhooks/razorpay',
    supportedEvents: [
      'subscription.activated',
      'subscription.charged',
      'subscription.halted',
      'subscription.cancelled',
      'subscription.completed',
      'subscription.expired',
      'subscription.failed',
      'subscription.trial_will_end'
    ],
    instructions: {
      step1: 'Configure webhook URL in Razorpay dashboard',
      step2: 'Select all supported events',
      step3: 'Test webhook using the test endpoint',
      step4: 'Monitor webhook events in the dashboard'
    }
  };
}

// Validate subscription before processing
export function validateSubscriptionData(subscription: Record<string, unknown>): boolean {
  const requiredFields = ['id', 'plan_id', 'status', 'notes'];
  const hasRequiredFields = requiredFields.every(field => subscription[field]);
  
  const notes = subscription.notes as Record<string, unknown> | undefined;
  const hasInstituteId = !!notes?.institute_id;
  
  return hasRequiredFields && hasInstituteId;
}

// Format subscription data for mobile app
export function formatSubscriptionForMobile(subscription: Record<string, unknown>) {
  const notes = subscription.notes as Record<string, unknown> | undefined;
  return {
    id: subscription.id,
    status: subscription.status,
    planId: subscription.plan_id,
    instituteId: notes?.institute_id,
    trialEndDate: subscription.expire_by ? new Date((subscription.expire_by as number) * 1000) : null,
    nextBillingDate: subscription.charge_at ? new Date((subscription.charge_at as number) * 1000) : null,
    totalCycles: subscription.total_count,
    paidCycles: subscription.paid_count,
    remainingCycles: subscription.remaining_count,
    amount: subscription.amount,
    currency: subscription.currency
  };
}
