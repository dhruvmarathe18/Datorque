'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Alert } from '@/components/portal/ui';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { generatePassword } from '@/lib/utils';
import { Batch } from '@/types/portal';

export default function NewStudentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    date_of_birth: '',
    gender: 'male',
    batch_ids: [] as string[],
  });
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

  const generateStudentId = () => {
    const prefix = 'STU';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const studentId = generateStudentId();

      // Create auth user for student
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: generatedPassword,
      });

      if (authError) throw authError;

      // Create student record
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .insert([{
          student_id: studentId,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          parent_name: formData.parent_name,
          parent_phone: formData.parent_phone,
          parent_email: formData.parent_email,
          date_of_birth: formData.date_of_birth || null,
          gender: formData.gender,
          institute_id: user?.institute_id,
          is_active: true,
          generated_password: generatedPassword,
        }])
        .select()
        .single();

      if (studentError) throw studentError;

      // Create user record
      if (authData.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('users') as any).insert([{
          id: authData.user.id,
          email: formData.email,
          role: 'student',
          institute_id: user?.institute_id,
          is_active: true,
        }]);
      }

      // Assign to batches
      if (formData.batch_ids.length > 0 && studentData) {
        const batchAssignments = formData.batch_ids.map((batchId) => ({
          student_id: studentData.id,
          batch_id: batchId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('student_batches') as any).insert(batchAssignments);
      }

      setSuccess(`Student created successfully! ID: ${studentId}, Password: ${generatedPassword}`);
      setTimeout(() => router.push('/dashboard/students'), 3000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Add New Student</h1>
          <p className="page-subtitle">Enroll a new student</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Student Information</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            {/* Personal Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Personal Details</h3>
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
                  label="Date of Birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                />
                <Select
                  label="Gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Parent/Guardian Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Parent Name *"
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  required
                />
                <Input
                  label="Parent Phone *"
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  required
                />
                <Input
                  label="Parent Email"
                  type="email"
                  value={formData.parent_email}
                  onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Batch Assignment</h3>
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
                {batches.length === 0 && (
                  <p className="text-sm text-gray-500">No batches available. Create a batch first.</p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Generated Password:</strong> {generatedPassword}
                <br />
                Share this password with the student for mobile app login.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/students">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Create Student</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
