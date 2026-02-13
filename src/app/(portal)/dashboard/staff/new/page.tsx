'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Alert } from '@/components/portal/ui';
import { ArrowLeft, Users, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { generatePassword } from '@/lib/utils';
import { Batch } from '@/types/portal';

export default function NewStaffPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    designation: '',
    subjects: [] as string[],
    batch_ids: [] as string[],
  });
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    if (user?.role !== 'coaching_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchBatches() {
      const { data } = await supabase
        .from('batches')
        .select('id, name')
        .eq('institute_id', user?.institute_id)
        .eq('is_active', true)
        .order('name');
      setBatches(data || []);
    }

    fetchBatches();
    setGeneratedPassword(generatePassword(10));
  }, [supabase, user, router]);

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData({ ...formData, subjects: [...formData.subjects, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData({ ...formData, subjects: formData.subjects.filter((s) => s !== subject) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: generatedPassword,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create user record
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: userError } = await (supabase.from('users') as any).insert([{
          id: authData.user.id,
          email: formData.email,
          role: 'staff',
          institute_id: user?.institute_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          designation: formData.designation,
          subjects: formData.subjects,
          is_active: true,
          generated_password: generatedPassword,
        }]);

        if (userError) throw userError;

        // Assign to batches
        if (formData.batch_ids.length > 0) {
          const batchAssignments = formData.batch_ids.map((batchId) => ({
            staff_id: authData.user!.id,
            batch_id: batchId,
          }));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase.from('batch_staff') as any).insert(batchAssignments);
        }

        setSuccess(`Staff member created successfully! Password: ${generatedPassword}`);
        setTimeout(() => router.push('/dashboard/staff'), 3000);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/staff" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Add New Staff</h1>
          <p className="page-subtitle">Create a staff member account</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Staff Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
              <Input
                label="Last Name *"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
              <Input
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="Designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g., Teacher, Assistant"
              />
            </div>

            {/* Subjects */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a subject"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
                />
                <Button type="button" variant="secondary" onClick={addSubject}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {subject}
                    <button type="button" onClick={() => removeSubject(subject)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Batch Assignment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Batches</label>
              <div className="flex flex-wrap gap-2">
                {batches.map((batch) => (
                  <label
                    key={batch.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                      formData.batch_ids.includes(batch.id)
                        ? 'bg-primary-50 border-primary-300 text-primary-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.batch_ids.includes(batch.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, batch_ids: [...formData.batch_ids, batch.id] });
                        } else {
                          setFormData({ ...formData, batch_ids: formData.batch_ids.filter((id) => id !== batch.id) });
                        }
                      }}
                      className="hidden"
                    />
                    <span className="text-sm font-medium">{batch.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Generated Password:</strong> {generatedPassword}
                <br />
                Share this password with the staff member for web/mobile app login.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/staff">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Create Staff</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
