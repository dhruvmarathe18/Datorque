'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Alert } from '@/components/portal/ui';
import { Settings, Save, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [institute, setInstitute] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    logo_url: '',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
  });
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchInstitute() {
      if (!user?.institute_id || user.role !== 'coaching_admin') return;

      const { data } = await supabase
        .from('institutes')
        .select('*')
        .eq('id', user.institute_id)
        .single();

      if (data) {
        setInstitute(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          address: data.address || '',
          website: data.website || '',
          logo_url: data.logo_url || '',
          timezone: data.timezone || 'Asia/Kolkata',
          currency: data.currency || 'INR',
        });
      }
    }

    fetchInstitute();
  }, [supabase, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.institute_id || user.role !== 'coaching_admin') return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('institutes')
        .update({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          website: formData.website,
          logo_url: formData.logo_url,
          timezone: formData.timezone,
          currency: formData.currency,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.institute_id);

      if (updateError) throw updateError;

      setSuccess('Settings saved successfully!');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Super admin doesn't have institute settings
  if (user?.role === 'super_admin') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Platform preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Bell className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Email Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.email_notifications}
                  onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Push Notifications</span>
                <input
                  type="checkbox"
                  checked={notifications.push_notifications}
                  onChange={(e) => setNotifications({ ...notifications, push_notifications: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Shield className="h-5 w-5 text-gray-600" />
              </div>
              <h2 className="text-lg font-semibold">Platform Information</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Environment</span>
                <span className="font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your institute settings</p>
      </div>

      {/* Institute Settings - Only for coaching_admin */}
      {user?.role === 'coaching_admin' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Settings className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Institute Settings</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

              <Input
                label="Institute Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://"
                />
                <Input
                  label="Logo URL"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="https://"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Timezone"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  options={[
                    { value: 'Asia/Kolkata', label: 'India (IST)' },
                    { value: 'UTC', label: 'UTC' },
                    { value: 'America/New_York', label: 'US Eastern' },
                    { value: 'America/Los_Angeles', label: 'US Pacific' },
                    { value: 'Europe/London', label: 'UK (GMT)' },
                  ]}
                />
                <Select
                  label="Currency"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  options={[
                    { value: 'INR', label: '₹ INR (Indian Rupee)' },
                    { value: 'USD', label: '$ USD (US Dollar)' },
                    { value: 'EUR', label: '€ EUR (Euro)' },
                    { value: 'GBP', label: '£ GBP (British Pound)' },
                  ]}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" loading={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Bell className="h-5 w-5 text-warning-600" />
            </div>
            <h2 className="text-lg font-semibold">Notification Preferences</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium text-gray-700">Email Notifications</span>
                <p className="text-sm text-gray-500">Receive updates via email</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email_notifications}
                onChange={(e) => setNotifications({ ...notifications, email_notifications: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium text-gray-700">SMS Notifications</span>
                <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.sms_notifications}
                onChange={(e) => setNotifications({ ...notifications, sms_notifications: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-medium text-gray-700">Push Notifications</span>
                <p className="text-sm text-gray-500">Browser push notifications</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push_notifications}
                onChange={(e) => setNotifications({ ...notifications, push_notifications: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
