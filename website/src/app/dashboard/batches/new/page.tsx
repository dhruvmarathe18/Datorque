'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Textarea, Alert } from '@/components/ui';
import { ArrowLeft, Layers, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewBatchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    start_date: '',
  });
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'coaching_admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

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
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('batches').insert([{
        name: formData.name,
        description: formData.description,
        subjects: formData.subjects,
        start_date: formData.start_date,
        institute_id: user?.institute_id,
        is_active: true,
        monthly_fee: 0, // Default value for database constraint
      }]);

      if (insertError) throw insertError;

      router.push('/dashboard/batches');
    } catch (err: any) {
      setError(err.message || 'Failed to create batch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/batches" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Create New Batch</h1>
          <p className="page-subtitle">Set up a new batch for your institute</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Layers className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Batch Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            <Input
              label="Batch Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Class 10 - Science"
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of this batch"
              rows={3}
            />

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/batches">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Create Batch</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
