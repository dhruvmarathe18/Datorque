'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Alert } from '@/components/portal/ui';
import { ArrowLeft, Megaphone, Pin } from 'lucide-react';
import Link from 'next/link';
import { Batch } from '@/types/portal';

export default function NewNoticePage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    batch_id: '',
    priority: 'normal',
    is_pinned: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;

      const { data } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true)
        .order('name');

      setBatches(data || []);
    }

    fetchBatches();
  }, [supabase, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase.from('notices') as any).insert([{
        title: formData.title,
        content: formData.content,
        batch_id: formData.batch_id || null,
        priority: formData.priority,
        is_pinned: formData.is_pinned,
        institute_id: user?.institute_id,
        created_by: user?.id,
      }]);

      if (insertError) throw insertError;

      setSuccess('Notice published successfully!');
      setTimeout(() => router.push('/dashboard/notices'), 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notices" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Create Notice</h1>
          <p className="page-subtitle">Publish an announcement</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Megaphone className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Notice Details</h2>
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
              placeholder="e.g., Holiday Announcement"
              required
            />

            <Textarea
              label="Content *"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your notice content here..."
              rows={6}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Target Audience"
                value={formData.batch_id}
                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                options={[
                  { value: '', label: 'All Students' },
                  ...batches.map((b) => ({ value: b.id, label: b.name })),
                ]}
              />

              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'normal', label: 'Normal' },
                  { value: 'high', label: 'High' },
                ]}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center gap-2">
                <Pin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Pin this notice</span>
              </div>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/notices">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading}>Publish Notice</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
