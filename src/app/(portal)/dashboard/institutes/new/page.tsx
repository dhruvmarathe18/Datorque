'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Alert } from '@/components/portal/ui';
import { ArrowLeft, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function NewInstitutePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    contact_person: '',
    subscription_status: 'trial',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user?.role !== 'super_admin') {
    router.push('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from('institutes') as any).insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          contact_person: formData.contact_person,
          subscription_status: formData.subscription_status,
        },
      ]);

      if (insertError) throw insertError;

      router.push('/dashboard/institutes');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create institute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/institutes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Add New Institute</h1>
          <p className="page-subtitle">Create a new coaching institute</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Institute Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Institute Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter institute name"
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="institute@example.com"
                required
              />
              <Input
                label="Phone *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
                required
              />
              <Input
                label="Contact Person *"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Full name"
                required
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Address *"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address"
                  rows={3}
                  required
                />
              </div>
              <Select
                label="Subscription Status"
                value={formData.subscription_status}
                onChange={(e) => setFormData({ ...formData, subscription_status: e.target.value })}
                options={[
                  { value: 'trial', label: 'Trial' },
                  { value: 'active', label: 'Active' },
                  { value: 'suspended', label: 'Suspended' },
                  { value: 'expired', label: 'Expired' },
                ]}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/institutes">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" loading={loading}>
                Create Institute
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
