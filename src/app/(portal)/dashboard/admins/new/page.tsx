'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Alert } from '@/components/portal/ui';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { generatePassword } from '@/lib/utils';
import { Institute } from '@/types/portal';

export default function NewAdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    institute_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchInstitutes() {
      const { data } = await supabase
        .from('institutes')
        .select('id, name')
        .order('name');
      setInstitutes(data || []);
    }

    fetchInstitutes();

    // Generate initial password
    setFormData((prev) => ({ ...prev, password: generatePassword(10) }));
  }, [supabase, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: userError } = await (supabase.from('users') as any).insert([
          {
            id: authData.user.id,
            email: formData.email,
            role: 'coaching_admin',
            institute_id: formData.institute_id || null,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone,
            is_active: true,
          },
        ]);

        if (userError) throw userError;

        setSuccess(`Admin created successfully! Password: ${formData.password}`);
        setTimeout(() => router.push('/dashboard/admins'), 3000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admins" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Add New Admin</h1>
          <p className="page-subtitle">Create a coaching admin account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Admin Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="First Name *"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="First name"
                required
              />
              <Input
                label="Last Name *"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Last name"
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                required
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XXXXX XXXXX"
              />
              <Input
                label="Password *"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Password"
                required
              />
              <Select
                label="Assign to Institute"
                value={formData.institute_id}
                onChange={(e) => setFormData({ ...formData, institute_id: e.target.value })}
                options={[
                  { value: '', label: 'Select Institute' },
                  ...institutes.map((inst) => ({ value: inst.id, label: inst.name })),
                ]}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Make sure to share the password with the admin securely.
                They can change it after logging in.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/admins">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Create Admin</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
