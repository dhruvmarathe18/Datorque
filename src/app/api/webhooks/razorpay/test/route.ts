import { NextRequest, NextResponse } from 'next/server';
import { getWebhookEvents, getSubscriptionDashboard } from '@/lib/razorpay-webhook';
import { validateConfig } from '@/config/razorpay-webhook';

// Test endpoint to verify webhook system
export async function GET(request: NextRequest) {
  try {
    // Validate configuration
    const configValidation = validateConfig();
    if (!configValidation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Configuration invalid',
        missingVars: configValidation.missingVars
      }, { status: 500 });
    }

    // Get recent webhook events
    const recentEvents = await getWebhookEvents(10);
    
    // Get subscription dashboard data
    const dashboardData = await getSubscriptionDashboard();
    
    // Get processing statistics
    const processedEvents = recentEvents.filter(event => event.processed);
    const failedEvents = recentEvents.filter(event => !event.processed && event.processing_error);
    
    return NextResponse.json({
      success: true,
      data: {
        configuration: {
          isValid: true,
          webhookUrl: process.env.NEXT_PUBLIC_BASE_URL + '/api/webhooks/razorpay',
          supportedEvents: [
            'subscription.activated',
            'subscription.charged',
            'subscription.halted',
            'subscription.cancelled',
            'subscription.completed',
            'subscription.expired',
            'subscription.failed',
            'subscription.trial_will_end'
          ]
        },
        statistics: {
          totalEvents: recentEvents.length,
          processedEvents: processedEvents.length,
          failedEvents: failedEvents.length,
          successRate: recentEvents.length > 0 ? 
            (processedEvents.length / recentEvents.length * 100).toFixed(2) + '%' : 'N/A'
        },
        recentEvents: recentEvents.map(event => ({
          id: event.event_id,
          type: event.event_type,
          entity: event.entity_type,
          processed: event.processed,
          error: event.processing_error,
          createdAt: event.created_at
        })),
        subscriptions: dashboardData.map(sub => ({
          instituteId: sub.institute_id,
          instituteName: sub.institute_name,
          status: sub.current_status,
          subscriptionId: sub.razorpay_subscription_id,
          trialEndDate: sub.trial_end_date,
          nextBillingDate: sub.next_billing_date
        }))
      }
    });

  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Test webhook with sample data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, instituteId, subscriptionId } = body;

    // Create a test webhook event
    const testEvent = {
      id: `test_${Date.now()}`,
      event: eventType || 'subscription.activated',
      contains: ['subscription'],
      created_at: Math.floor(Date.now() / 1000),
      entity: {
        id: subscriptionId || 'sub_test123',
        entity: 'subscription',
        plan_id: 'plan_RQboAK7SPK2ZnF',
        status: 'active',
        current_start: Math.floor(Date.now() / 1000),
        current_end: Math.floor((Date.now() + 30 * 24 * 60 * 60) / 1000),
        ended_at: null,
        quantity: 1,
        notes: {
          institute_id: instituteId || 'test-institute-id',
          trial_type: 'Free trial for coaching management'
        },
        charge_at: Math.floor((Date.now() + 7 * 24 * 60 * 60) / 1000),
        start_at: Math.floor(Date.now() / 1000),
        end_at: Math.floor((Date.now() + 365 * 24 * 60 * 60) / 1000),
        auth_attempts: 0,
        total_count: 12,
        paid_count: 0,
        customer_notify: true,
        created_at: Math.floor(Date.now() / 1000),
        expire_by: Math.floor((Date.now() + 7 * 24 * 60 * 60) / 1000),
        short_url: 'https://rzp.io/test',
        has_scheduled_changes: false,
        change_scheduled_at: null,
        source: 'api',
        offer_id: null,
        remaining_count: 12,
        amount: 0,
        currency: 'INR'
      }
    };

    // Process the test event
    const webhookUrl = process.env.NEXT_PUBLIC_BASE_URL + '/api/webhooks/razorpay';
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-razorpay-signature': 'test_signature' // This will fail signature verification
      },
      body: JSON.stringify(testEvent)
    });

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent',
      testEvent,
      response: result
    });

  } catch (error) {
    console.error('Test webhook error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
