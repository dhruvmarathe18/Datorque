'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Card, CardBody, Select, Modal, Input, Textarea, Alert } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { BookOpen, Plus, Eye, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Homework, Batch } from '@/types/portal';

interface HomeworkWithBatch extends Homework {
  batches?: { name: string };
  users?: { first_name: string; last_name: string };
}

export default function HomeworkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [homework, setHomework] = useState<HomeworkWithBatch[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.institute_id) return;

      // Fetch batches (respecting role)
      let batchQuery = supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);

      if (user.role === 'staff' || user.role === 'teacher') {
        const { data: assignments } = await supabase
          .from('batch_staff')
          .select('batch_id')
          .eq('staff_id', user.id);

        if (assignments && assignments.length > 0) {
          batchQuery = batchQuery.in('id', assignments.map((a: any) => a.batch_id));
        }
      }

      const { data: batchesData } = await batchQuery;
      setBatches(batchesData || []);

      // Fetch homework
      let homeworkQuery = supabase
        .from('homework')
        .select('*, batches(name), users(first_name, last_name)')
        .eq('institute_id', user.institute_id)
        .order('created_at', { ascending: false });

      if (filterBatch !== 'all') {
        homeworkQuery = homeworkQuery.eq('batch_id', filterBatch);
      } else if (user.role === 'staff' || user.role === 'teacher') {
        if (batchesData && batchesData.length > 0) {
          homeworkQuery = homeworkQuery.in('batch_id', batchesData.map((b: any) => b.id));
        }
      }

      const { data: homeworkData } = await homeworkQuery;
      setHomework(homeworkData || []);
      setLoading(false);
    }

    fetchData();
  }, [supabase, user, filterBatch]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'title',
      header: 'Homework',
      render: (hw: HomeworkWithBatch) => (
        <div>
          <p className="font-medium text-gray-900">{hw.title}</p>
          <p className="text-sm text-gray-500 truncate max-w-xs">{hw.description}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (hw: HomeworkWithBatch) => (
        <Badge variant="default">{hw.subject}</Badge>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      render: (hw: HomeworkWithBatch) => hw.batches?.name || '-',
    },
    {
      key: 'due_date',
      header: 'Due Date',
      sortable: true,
      render: (hw: HomeworkWithBatch) => {
        const isOverdue = new Date(hw.due_date) < new Date();
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {formatDate(hw.due_date)}
          </span>
        );
      },
    },
    {
      key: 'created_by',
      header: 'Created By',
      render: (hw: HomeworkWithBatch) =>
        hw.users ? `${hw.users.first_name} ${hw.users.last_name}` : '-',
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (hw: HomeworkWithBatch) => formatDate(hw.created_at),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Homework</h1>
          <p className="page-subtitle">{homework.length} assignments</p>
        </div>
        <Link href="/dashboard/homework/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Assign Homework
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <BookOpen className="h-5 w-5 text-gray-400" />
            <Select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              options={[
                { value: 'all', label: 'All Batches' },
                ...batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <DataTable
        data={homework}
        columns={columns}
        searchable
        searchPlaceholder="Search homework..."
        onRowClick={(hw) => router.push(`/dashboard/homework/${hw.id}`)}
        emptyMessage="No homework found"
      />
    </div>
  );
}
