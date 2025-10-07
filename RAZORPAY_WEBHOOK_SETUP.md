# Razorpay Webhook System Setup Guide

This guide will help you set up a comprehensive Razorpay webhook system for your Coaching Management System's trial autopay feature.

## 📋 Prerequisites

- Next.js 15+ application
- Supabase database
- Razorpay account with API access
- Environment variables configured

## 🚀 Quick Setup

### 1. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard

# Database Configuration
DATABASE_URL=your_supabase_database_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=https://www.datorque.com
```

### 2. Database Setup

Run the SQL script in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database/setup-razorpay-webhooks.sql
```

This will create:
- Required database tables
- Functions for subscription management
- Indexes for performance
- Row Level Security policies

### 3. Webhook Endpoint

The webhook endpoint is already created at:
```
POST https://www.datorque.com/api/webhooks/razorpay
```

### 4. Razorpay Dashboard Configuration

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://www.datorque.com/api/webhooks/razorpay`
3. Select these events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.halted`
   - `subscription.cancelled`
   - `subscription.completed`
   - `subscription.expired`
   - `subscription.failed`
   - `subscription.trial_will_end`
4. Copy the webhook secret and add it to your environment variables

## 🔧 Testing

### Test Webhook System

Visit the test endpoint to verify everything is working:
```
GET https://www.datorque.com/api/webhooks/razorpay/test
```

### Test with Sample Data

Send a POST request to test the webhook:
```bash
curl -X POST https://www.datorque.com/api/webhooks/razorpay/test \
  -H "Content-Type: application/json" \
  -d '{
    "eventType": "subscription.activated",
    "instituteId": "your-institute-id",
    "subscriptionId": "sub_test123"
  }'
```

## 📱 Mobile App Integration

### 1. Update Subscription Creation

In your mobile app's `createRazorpaySubscription.ts`:

```typescript
const subscriptionParams = {
  plan_id: 'plan_RQboAK7SPK2ZnF',
  customer_id: customerId,
  total_count: 12,
  customer_notify: 1,
  start_at: Math.floor(Date.now() / 1000),
  expire_by: Math.floor((Date.now() / 1000) + (7 * 24 * 60 * 60)),
  notes: {
    institute_id: instituteId, // This is crucial for webhook processing
    trial_type: 'Free trial for coaching management',
    billing_cycles: '12',
    trial_days: '7'
  }
};
```

### 2. Real-time Status Updates

The mobile app will automatically get updated subscription status through the existing `useSubscriptionAccess` hook, which queries the database that the webhook updates.

## 🗄️ Database Schema

### Tables Created

1. **institutes** (updated with subscription columns)
2. **subscriptions** - Stores Razorpay subscription data
3. **subscription_payments** - Tracks payment history
4. **webhook_events** - Logs all webhook events for debugging

### Key Functions

- `update_institute_subscription_status()` - Updates institute subscription status
- `create_subscription_record()` - Creates new subscription record
- `get_institute_subscription()` - Gets subscription details
- `has_active_subscription()` - Checks if institute has active subscription

## 🔒 Security Features

### 1. Signature Verification
All webhook requests are verified using HMAC-SHA256 signature verification.

### 2. Row Level Security
Database tables have RLS policies to ensure data security.

### 3. Error Handling
Comprehensive error handling and logging for debugging.

## 📊 Monitoring

### Webhook Events Dashboard

Access the test endpoint to monitor webhook events:
```
GET https://www.datorque.com/api/webhooks/razorpay/test
```

### Database Queries

Check subscription status:
```sql
SELECT * FROM subscription_dashboard WHERE institute_id = 'your-institute-id';
```

Check webhook events:
```sql
SELECT * FROM webhook_events ORDER BY created_at DESC LIMIT 10;
```

## 🚨 Troubleshooting

### Common Issues

1. **Webhook not receiving events**
   - Check webhook URL in Razorpay dashboard
   - Verify webhook secret in environment variables
   - Check server logs for errors

2. **Signature verification failed**
   - Ensure webhook secret is correct
   - Check if request body is being modified

3. **Database errors**
   - Verify Supabase connection
   - Check if all required tables exist
   - Verify RLS policies

### Debug Steps

1. Check webhook events table:
   ```sql
   SELECT * FROM webhook_events WHERE processed = false;
   ```

2. Check institute subscription status:
   ```sql
   SELECT * FROM institutes WHERE id = 'your-institute-id';
   ```

3. Check subscription records:
   ```sql
   SELECT * FROM subscriptions WHERE institute_id = 'your-institute-id';
   ```

## 📈 Performance Optimization

### Database Indexes
The setup includes optimized indexes for:
- `subscriptions.institute_id`
- `subscriptions.razorpay_subscription_id`
- `subscriptions.status`
- `webhook_events.event_id`
- `webhook_events.processed`

### Caching
Consider implementing Redis caching for frequently accessed subscription data.

## 🔄 Webhook Event Flow

1. **Subscription Created** → Mobile app creates subscription
2. **Webhook Received** → Razorpay sends event to webhook endpoint
3. **Signature Verified** → Webhook verifies request authenticity
4. **Event Logged** → Event stored in webhook_events table
5. **Event Processed** → Appropriate handler processes the event
6. **Database Updated** → Institute and subscription data updated
7. **Status Marked** → Event marked as processed

## 📞 Support

For issues or questions:
1. Check the test endpoint for system status
2. Review webhook events table for failed events
3. Check server logs for detailed error messages
4. Verify all environment variables are set correctly

## 🎯 Next Steps

1. Configure webhook in Razorpay dashboard
2. Test with sample data
3. Monitor webhook events
4. Update mobile app integration
5. Deploy to production

The webhook system is now ready to handle all Razorpay subscription events automatically!
