'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Alert } from '@/components/ui';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Batch } from '@/types';

export default function NewHomeworkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    batch_id: '',
    due_date: '',
    attachment_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;

      let query = supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true)
        .order('name');

      // If staff, only get assigned batches
      if (user.role === 'staff' || user.role === 'teacher') {
        const { data: assignments } = await supabase
          .from('batch_staff')
          .select('batch_id')
          .eq('staff_id', user.id);

        if (assignments && assignments.length > 0) {
          query = query.in('id', assignments.map((a) => a.batch_id));
        }
      }

      const { data } = await query;
      setBatches(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, batch_id: data[0].id }));
      }
    }

    fetchBatches();
  }, [supabase, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('homework').insert([{
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        batch_id: formData.batch_id,
        due_date: formData.due_date,
        attachment_url: formData.attachment_url || null,
        institute_id: user?.institute_id,
        created_by: user?.id,
      }]);

      if (insertError) throw insertError;

      setSuccess('Homework assigned successfully!');
      setTimeout(() => router.push('/dashboard/homework'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to assign homework');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/homework" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Assign Homework</h1>
          <p className="page-subtitle">Create a new homework assignment</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Homework Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Chapter 5 Practice Problems"
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide detailed instructions for the homework..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics"
                required
              />

              <Select
                label="Batch *"
                value={formData.batch_id}
                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="input"
                  required
                />
              </div>

              <Input
                label="Attachment URL"
                value={formData.attachment_url}
                onChange={(e) => setFormData({ ...formData, attachment_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/homework">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Assign Homework</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
