'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, Button, Input, Select, Textarea, Alert } from '@/components/portal/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTest } from '@/services/tests';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function CreateTestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    subject: '',
    batch_id: '',
    test_date: new Date().toISOString().split('T')[0],
    duration: 90,
    max_marks: 100,
    instructions: '',
    status: 'published' as const,
  });

  useEffect(() => {
    async function loadBatches() {
      if (!user?.institute_id) return;
      const { data } = await supabase
        .from('batches')
        .select('id, name, subjects')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);
      setBatches(data || []);
    }
    loadBatches();
  }, [user?.institute_id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.institute_id) return;
    if (!form.name || !form.subject || !form.batch_id) {
      setError('Please fill all required fields');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createTest({
        ...form,
        institute_id: user.institute_id,
        created_by: user.id,
      });
      router.push('/dashboard/tests');
    } catch (err: any) {
      setError(err.message || 'Failed to create test');
    } finally {
      setSaving(false);
    }
  };

  // Get subjects from selected batch
  const selectedBatch = batches.find((b: any) => b.id === form.batch_id);
  const subjects = selectedBatch?.subjects || [];

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tests">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="page-title">Create Test</h1>
          <p className="page-subtitle">Schedule a new test for a batch</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Test Details</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Test Name *"
              placeholder="e.g. Unit Test 1 - Mathematics"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <Select
              label="Batch *"
              value={form.batch_id}
              onChange={(e) => setForm({ ...form, batch_id: e.target.value, subject: '' })}
              options={[
                { value: '', label: 'Select Batch' },
                ...batches.map((b: any) => ({ value: b.id, label: b.name })),
              ]}
            />

            {subjects.length > 0 ? (
              <Select
                label="Subject *"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                options={[
                  { value: '', label: 'Select Subject' },
                  ...subjects.map((s: string) => ({ value: s, label: s })),
                ]}
              />
            ) : (
              <Input
                label="Subject *"
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Test Date *</label>
                <input
                  type="date"
                  className="input"
                  value={form.test_date}
                  onChange={(e) => setForm({ ...form, test_date: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Duration (minutes) *"
                type="number"
                value={String(form.duration)}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                min="1"
              />
              <Input
                label="Max Marks *"
                type="number"
                value={String(form.max_marks)}
                onChange={(e) => setForm({ ...form, max_marks: Number(e.target.value) })}
                min="1"
              />
            </div>

            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as any })}
              options={[
                { value: 'published', label: 'Published' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'draft', label: 'Draft' },
              ]}
            />

            <Textarea
              label="Instructions"
              placeholder="Enter test instructions..."
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              rows={3}
            />
          </CardBody>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <Link href="/dashboard/tests">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" loading={saving}>
            Create Test
          </Button>
        </div>
      </form>
    </div>
  );
}
