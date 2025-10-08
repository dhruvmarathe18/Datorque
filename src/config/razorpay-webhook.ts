// Razorpay Webhook Configuration
// Make sure to set these environment variables in your deployment

export const razorpayConfig = {
  // Webhook endpoint URL
  webhookUrl: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datorque.com') + '/api/webhooks/razorpay',
  
  // Razorpay credentials
  keyId: process.env.RAZORPAY_KEY_ID,
  keySecret: process.env.RAZORPAY_KEY_SECRET,
  webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  
  // Database configuration
  databaseUrl: process.env.DATABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Webhook events to handle
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
  
  // Subscription plan configuration
  plans: {
    trial: {
      planId: 'plan_RQboAK7SPK2ZnF', // Replace with your actual plan ID
      trialDays: 7,
      totalCycles: 12,
      amount: 0 // Trial amount
    },
    standard: {
      planId: 'plan_standard', // Replace with your actual plan ID
      amount: 999 // Monthly amount in paise
    }
  },
  
  // Retry configuration
  retry: {
    maxAttempts: 3,
    delayMs: 1000
  },
  
  // Logging configuration
  logging: {
    enabled: true,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug'
  }
};

// Validate required environment variables
export function validateConfig(): { isValid: boolean; missingVars: string[] } {
  const requiredVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'DATABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  return {
    isValid: missingVars.length === 0,
    missingVars
  };
}

// Get webhook URL for Razorpay dashboard configuration
export function getWebhookUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.datorque.com') + '/api/webhooks/razorpay';
}

// Get supported events for Razorpay webhook configuration
export function getSupportedEvents(): string[] {
  return razorpayConfig.supportedEvents;
}
