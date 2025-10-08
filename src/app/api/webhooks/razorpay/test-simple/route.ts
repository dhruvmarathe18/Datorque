import { NextResponse } from 'next/server';
import { getWebhookEvents, getSubscriptionDashboard } from '@/lib/razorpay-webhook';

// Simple test endpoint that doesn't require Razorpay keys
export async function GET() {
  try {
    // Get recent webhook events
    const recentEvents = await getWebhookEvents(10);
    
    // Get subscription dashboard data
    const dashboardData = await getSubscriptionDashboard();
    
    // Get processing statistics
    const processedEvents = recentEvents.filter(event => event.processed);
    const failedEvents = recentEvents.filter(event => !event.processed && event.processing_error);
    
    return NextResponse.json({
      success: true,
      message: 'Webhook system is working! (Razorpay keys not required for this test)',
      data: {
        configuration: {
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
          note: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables for full functionality'
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
        })),
        instructions: {
          step1: 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables',
          step2: 'Configure webhook URL in Razorpay dashboard',
          step3: 'Test with real webhook events',
          step4: 'Monitor webhook processing in this endpoint'
        }
      }
    });

  } catch (error) {
    console.error('Simple test endpoint error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
