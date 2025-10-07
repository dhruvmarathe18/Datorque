-- Razorpay Webhook System Database Setup
-- Run this script in your Supabase SQL editor

-- 1. Add subscription-related columns to institutes table
ALTER TABLE institutes 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS trial_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS subscription_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS trial_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255);

-- 2. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institute_id UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
  razorpay_subscription_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'created',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  total_count INTEGER,
  current_count INTEGER,
  paid_count INTEGER,
  charge_at TIMESTAMP WITH TIME ZONE,
  start_at TIMESTAMP WITH TIME ZONE,
  end_at TIMESTAMP WITH TIME ZONE,
  auth_attempts INTEGER DEFAULT 0,
  next_charge_at TIMESTAMP WITH TIME ZONE,
  expire_by TIMESTAMP WITH TIME ZONE,
  short_url TEXT,
  has_scheduled_changes BOOLEAN DEFAULT false,
  change_scheduled_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(50) DEFAULT 'api',
  offer_id VARCHAR(255),
  remaining_count INTEGER,
  notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create subscription payments table
CREATE TABLE IF NOT EXISTS subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  razorpay_payment_id VARCHAR(255) UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  failure_reason TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create webhook events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id VARCHAR(255) UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  payload JSONB NOT NULL,
  signature VARCHAR(255),
  processed BOOLEAN DEFAULT false,
  processing_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_institute_id ON subscriptions(institute_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_razorpay_id ON subscriptions(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription_id ON subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_razorpay_id ON subscription_payments(razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX IF NOT EXISTS idx_institutes_subscription_status ON institutes(subscription_status);
CREATE INDEX IF NOT EXISTS idx_institutes_subscription_id ON institutes(subscription_id);

-- 6. Function to update institute subscription status
CREATE OR REPLACE FUNCTION update_institute_subscription_status(
  p_institute_id UUID,
  p_status VARCHAR(50),
  p_subscription_id VARCHAR(255) DEFAULT NULL,
  p_trial_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_next_billing_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE institutes 
  SET 
    subscription_status = p_status,
    subscription_id = COALESCE(p_subscription_id, subscription_id),
    trial_end_date = COALESCE(p_trial_end_date, trial_end_date),
    next_billing_date = COALESCE(p_next_billing_date, next_billing_date),
    updated_at = NOW()
  WHERE id = p_institute_id;
  
  -- Log the update
  INSERT INTO webhook_events (event_type, entity_type, entity_id, payload)
  VALUES (
    'institute.subscription_status_updated',
    'institute',
    p_institute_id::text,
    jsonb_build_object(
      'institute_id', p_institute_id,
      'new_status', p_status,
      'subscription_id', p_subscription_id,
      'trial_end_date', p_trial_end_date,
      'next_billing_date', p_next_billing_date,
      'updated_at', NOW()
    )
  );
END;
$$ LANGUAGE plpgsql;

-- 7. Function to create subscription record
CREATE OR REPLACE FUNCTION create_subscription_record(
  p_institute_id UUID,
  p_razorpay_subscription_id VARCHAR(255),
  p_plan_id VARCHAR(255),
  p_status VARCHAR(50),
  p_start_date TIMESTAMP WITH TIME ZONE,
  p_end_date TIMESTAMP WITH TIME ZONE,
  p_trial_start_date TIMESTAMP WITH TIME ZONE,
  p_trial_end_date TIMESTAMP WITH TIME ZONE,
  p_total_count INTEGER,
  p_paid_count INTEGER DEFAULT 0,
  p_remaining_count INTEGER,
  p_next_charge_at TIMESTAMP WITH TIME ZONE,
  p_short_url TEXT DEFAULT NULL,
  p_notes JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  subscription_id UUID;
BEGIN
  INSERT INTO subscriptions (
    institute_id, razorpay_subscription_id, plan_id, status,
    start_date, end_date, trial_start_date, trial_end_date,
    total_count, paid_count, remaining_count, next_charge_at,
    short_url, notes
  ) VALUES (
    p_institute_id, p_razorpay_subscription_id, p_plan_id, p_status,
    p_start_date, p_end_date, p_trial_start_date, p_trial_end_date,
    p_total_count, p_paid_count, p_remaining_count, p_next_charge_at,
    p_short_url, p_notes
  ) RETURNING id INTO subscription_id;
  
  -- Log the creation
  INSERT INTO webhook_events (event_type, entity_type, entity_id, payload)
  VALUES (
    'subscription.created',
    'subscription',
    p_razorpay_subscription_id,
    jsonb_build_object(
      'subscription_id', subscription_id,
      'institute_id', p_institute_id,
      'razorpay_subscription_id', p_razorpay_subscription_id,
      'status', p_status,
      'created_at', NOW()
    )
  );
  
  RETURN subscription_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Function to get subscription details by institute
CREATE OR REPLACE FUNCTION get_institute_subscription(p_institute_id UUID)
RETURNS TABLE (
  subscription_id UUID,
  razorpay_subscription_id VARCHAR(255),
  status VARCHAR(50),
  plan_id VARCHAR(255),
  trial_end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  total_count INTEGER,
  paid_count INTEGER,
  remaining_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.razorpay_subscription_id,
    s.status,
    s.plan_id,
    s.trial_end_date,
    s.next_charge_at,
    s.total_count,
    s.paid_count,
    s.remaining_count,
    s.created_at
  FROM subscriptions s
  WHERE s.institute_id = p_institute_id
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 9. Function to get subscription payment history
CREATE OR REPLACE FUNCTION get_subscription_payments(p_subscription_id UUID)
RETURNS TABLE (
  payment_id UUID,
  razorpay_payment_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  status VARCHAR(50),
  payment_method VARCHAR(50),
  failure_reason TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.id,
    sp.razorpay_payment_id,
    sp.amount,
    sp.currency,
    sp.status,
    sp.payment_method,
    sp.failure_reason,
    sp.paid_at,
    sp.created_at
  FROM subscription_payments sp
  WHERE sp.subscription_id = p_subscription_id
  ORDER BY sp.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- 10. Function to check if institute has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(p_institute_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO active_count
  FROM institutes i
  WHERE i.id = p_institute_id
    AND i.subscription_status IN ('active', 'trialing')
    AND (i.trial_end_date IS NULL OR i.trial_end_date > NOW())
    AND (i.next_billing_date IS NULL OR i.next_billing_date > NOW());
  
  RETURN active_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 11. Create RLS policies for security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Policy for subscriptions - institutes can only see their own subscriptions
CREATE POLICY "Institutes can view their own subscriptions" ON subscriptions
  FOR SELECT USING (
    institute_id IN (
      SELECT id FROM institutes WHERE id = auth.uid()
    )
  );

-- Policy for subscription payments - institutes can only see payments for their subscriptions
CREATE POLICY "Institutes can view their subscription payments" ON subscription_payments
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM subscriptions WHERE institute_id IN (
        SELECT id FROM institutes WHERE id = auth.uid()
      )
    )
  );

-- Policy for webhook events - only service role can access
CREATE POLICY "Service role can access webhook events" ON webhook_events
  FOR ALL USING (auth.role() = 'service_role');

-- 12. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Create view for subscription dashboard
CREATE OR REPLACE VIEW subscription_dashboard AS
SELECT 
  i.id as institute_id,
  i.name as institute_name,
  i.email as institute_email,
  i.subscription_status,
  i.plan_type,
  i.trial_end_date,
  i.next_billing_date,
  s.id as subscription_id,
  s.razorpay_subscription_id,
  s.status as subscription_status_detail,
  s.plan_id,
  s.total_count,
  s.paid_count,
  s.remaining_count,
  s.created_at as subscription_created_at,
  CASE 
    WHEN i.subscription_status = 'trialing' AND i.trial_end_date < NOW() THEN 'trial_expired'
    WHEN i.subscription_status = 'active' AND i.next_billing_date < NOW() THEN 'payment_due'
    WHEN i.subscription_status = 'failed' THEN 'payment_failed'
    ELSE i.subscription_status
  END as current_status
FROM institutes i
LEFT JOIN subscriptions s ON i.id = s.institute_id
WHERE i.subscription_id IS NOT NULL;

-- 14. Grant necessary permissions
GRANT SELECT ON subscription_dashboard TO authenticated;
GRANT EXECUTE ON FUNCTION get_institute_subscription(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_subscription_payments(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION has_active_subscription(UUID) TO authenticated;

-- 15. Insert sample data for testing (optional - remove in production)
-- INSERT INTO institutes (id, name, email, subscription_status) 
-- VALUES (gen_random_uuid(), 'Test Institute', 'test@example.com', 'active')
-- ON CONFLICT DO NOTHING;

COMMIT;
