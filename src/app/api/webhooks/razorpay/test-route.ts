import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.DATABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// TEMPORARY TEST VERSION - NO SIGNATURE VERIFICATION
// Use this only for testing, NOT for production!

export async function POST(request: NextRequest) {
  try {
    console.log('🚨 TEST WEBHOOK - NO SIGNATURE VERIFICATION');
    
    // Get the raw body
    const body = await request.text();
    const event = JSON.parse(body);
    
    console.log(`Received test webhook event: ${event.event}`);
    
    // Log the webhook event
    const { error: logError } = await supabase
      .from('webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.event,
        entity_type: event.entity,
        entity_id: event.entity.id,
        payload: event,
        signature: 'TEST_MODE_NO_VERIFICATION',
        processed: false
      });

    if (logError) {
      console.error('Error logging webhook event:', logError);
    }

    // Process the event (simplified version)
    const subscription = event.entity;
    const instituteId = subscription.notes?.institute_id;
    
    if (!instituteId) {
      console.error('No institute_id found in subscription notes');
      return NextResponse.json({ error: 'No institute_id found' }, { status: 400 });
    }

    console.log(`Processing ${event.event} for institute ${instituteId}`);

    // Update institute status based on event
    let status = 'active';
    switch (event.event) {
      case 'subscription.activated':
        status = 'trialing';
        break;
      case 'subscription.charged':
        status = 'active';
        break;
      case 'subscription.cancelled':
        status = 'cancelled';
        break;
      case 'subscription.expired':
        status = 'expired';
        break;
      case 'subscription.failed':
        status = 'failed';
        break;
      case 'subscription.halted':
        status = 'paused';
        break;
      case 'subscription.completed':
        status = 'completed';
        break;
    }

    // Update institute status
    const { error: updateError } = await supabase
      .from('institutes')
      .update({ 
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', instituteId);

    if (updateError) {
      console.error('Error updating institute status:', updateError);
      throw updateError;
    }

    // Mark event as processed
    await supabase
      .from('webhook_events')
      .update({ processed: true })
      .eq('event_id', event.id);

    console.log(`✅ Test webhook processed successfully for institute ${instituteId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Test webhook processed successfully (NO SIGNATURE VERIFICATION)',
      warning: 'This is a test version - add webhook secret for production!'
    });

  } catch (error) {
    console.error('Test webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-razorpay-signature',
    },
  });
}
