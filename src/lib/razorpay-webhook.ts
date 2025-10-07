import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types for webhook events
export interface RazorpayWebhookEvent {
  id: string;
  event: string;
  contains: string[];
  created_at: number;
  entity: RazorpaySubscription;
}

export interface RazorpaySubscription {
  id: string;
  entity: string;
  plan_id: string;
  status: string;
  current_start: number;
  current_end: number;
  ended_at: number | null;
  quantity: number;
  notes: Record<string, any>;
  charge_at: number;
  start_at: number;
  end_at: number;
  auth_attempts: number;
  total_count: number;
  paid_count: number;
  customer_notify: boolean;
  created_at: number;
  expire_by: number;
  short_url: string;
  has_scheduled_changes: boolean;
  change_scheduled_at: number | null;
  source: string;
  offer_id: string | null;
  remaining_count: number;
  amount: number;
  currency: string;
}

export interface WebhookEventLog {
  event_id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  payload: any;
  signature?: string;
  processed: boolean;
  processing_error?: string;
}

// Log webhook event
export async function logWebhookEvent(event: RazorpayWebhookEvent): Promise<void> {
  try {
    const { error } = await supabase
      .from('webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.event,
        entity_type: event.entity,
        entity_id: event.entity.id,
        payload: event,
        processed: false
      });

    if (error) {
      console.error('Error logging webhook event:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in logWebhookEvent:', error);
    throw error;
  }
}

// Mark webhook event as processed
export async function markWebhookEventProcessed(
  eventId: string, 
  error?: string
): Promise<void> {
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
      throw updateError;
    }
  } catch (error) {
    console.error('Error in markWebhookEventProcessed:', error);
    throw error;
  }
}

// Get institute subscription details
export async function getInstituteSubscription(instituteId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_institute_subscription', { p_institute_id: instituteId });

    if (error) {
      console.error('Error getting institute subscription:', error);
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error in getInstituteSubscription:', error);
    throw error;
  }
}

// Check if institute has active subscription
export async function hasActiveSubscription(instituteId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('has_active_subscription', { p_institute_id: instituteId });

    if (error) {
      console.error('Error checking active subscription:', error);
      throw error;
    }

    return data || false;
  } catch (error) {
    console.error('Error in hasActiveSubscription:', error);
    throw error;
  }
}

// Get subscription payment history
export async function getSubscriptionPayments(subscriptionId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_subscription_payments', { p_subscription_id: subscriptionId });

    if (error) {
      console.error('Error getting subscription payments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSubscriptionPayments:', error);
    throw error;
  }
}

// Create subscription record
export async function createSubscriptionRecord(
  instituteId: string,
  razorpaySubscriptionId: string,
  planId: string,
  status: string,
  startDate: Date,
  endDate: Date,
  trialStartDate: Date,
  trialEndDate: Date,
  totalCount: number,
  paidCount: number = 0,
  remainingCount: number,
  nextChargeAt: Date,
  shortUrl?: string,
  notes?: Record<string, any>
): Promise<string> {
  try {
    const { data, error } = await supabase
      .rpc('create_subscription_record', {
        p_institute_id: instituteId,
        p_razorpay_subscription_id: razorpaySubscriptionId,
        p_plan_id: planId,
        p_status: status,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
        p_trial_start_date: trialStartDate.toISOString(),
        p_trial_end_date: trialEndDate.toISOString(),
        p_total_count: totalCount,
        p_paid_count: paidCount,
        p_remaining_count: remainingCount,
        p_next_charge_at: nextChargeAt.toISOString(),
        p_short_url: shortUrl,
        p_notes: notes
      });

    if (error) {
      console.error('Error creating subscription record:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createSubscriptionRecord:', error);
    throw error;
  }
}

// Update institute subscription status
export async function updateInstituteSubscriptionStatus(
  instituteId: string,
  status: string,
  subscriptionId?: string,
  trialEndDate?: Date,
  nextBillingDate?: Date
): Promise<void> {
  try {
    const { error } = await supabase
      .rpc('update_institute_subscription_status', {
        p_institute_id: instituteId,
        p_status: status,
        p_subscription_id: subscriptionId,
        p_trial_end_date: trialEndDate?.toISOString(),
        p_next_billing_date: nextBillingDate?.toISOString()
      });

    if (error) {
      console.error('Error updating institute subscription status:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in updateInstituteSubscriptionStatus:', error);
    throw error;
  }
}

// Record subscription payment
export async function recordSubscriptionPayment(
  subscriptionId: string,
  razorpayPaymentId: string,
  amount: number,
  currency: string = 'INR',
  status: string,
  paymentMethod?: string,
  failureReason?: string,
  paidAt?: Date
): Promise<void> {
  try {
    const { error } = await supabase
      .from('subscription_payments')
      .insert({
        subscription_id: subscriptionId,
        razorpay_payment_id: razorpayPaymentId,
        amount,
        currency,
        status,
        payment_method: paymentMethod,
        failure_reason: failureReason,
        paid_at: paidAt?.toISOString()
      });

    if (error) {
      console.error('Error recording subscription payment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in recordSubscriptionPayment:', error);
    throw error;
  }
}

// Get webhook events for debugging
export async function getWebhookEvents(
  limit: number = 50,
  processed?: boolean
): Promise<WebhookEventLog[]> {
  try {
    let query = supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (processed !== undefined) {
      query = query.eq('processed', processed);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error getting webhook events:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getWebhookEvents:', error);
    throw error;
  }
}

// Get subscription dashboard data
export async function getSubscriptionDashboard() {
  try {
    const { data, error } = await supabase
      .from('subscription_dashboard')
      .select('*')
      .order('subscription_created_at', { ascending: false });

    if (error) {
      console.error('Error getting subscription dashboard:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSubscriptionDashboard:', error);
    throw error;
  }
}

// Utility function to convert Razorpay timestamp to Date
export function razorpayTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}

// Utility function to get subscription status from Razorpay status
export function mapRazorpayStatusToInternal(razorpayStatus: string): string {
  const statusMap: Record<string, string> = {
    'created': 'created',
    'authenticated': 'authenticated',
    'active': 'active',
    'paused': 'paused',
    'halted': 'paused',
    'cancelled': 'cancelled',
    'completed': 'completed',
    'expired': 'expired',
    'failed': 'failed'
  };

  return statusMap[razorpayStatus] || 'unknown';
}

// Utility function to validate webhook event
export function validateWebhookEvent(event: any): boolean {
  return !!(
    event &&
    event.id &&
    event.event &&
    event.contains &&
    event.entity &&
    event.entity.id
  );
}
