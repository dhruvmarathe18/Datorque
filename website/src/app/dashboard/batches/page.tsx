'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Plus, Layers } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Batch } from '@/types';

export default function BatchesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [batches, setBatches] = useState<(Batch & { student_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!user?.institute_id && user?.role !== 'super_admin') {
      return;
    }

    async function fetchBatches() {
      let query = supabase
        .from('batches')
        .select('*')
        .order('created_at', { ascending: false });

      if (user?.institute_id) {
        query = query.eq('institute_id', user.institute_id);
      }

      const { data, error } = await query;

      if (!error && data) {
        // Get student counts for each batch
        const batchesWithCounts = await Promise.all(
          data.map(async (batch) => {
            const { count } = await supabase
              .from('student_batches')
              .select('*', { count: 'exact', head: true })
              .eq('batch_id', batch.id);
            return { ...batch, student_count: count || 0 };
          })
        );
        setBatches(batchesWithCounts);
      }
      setLoading(false);
    }

    fetchBatches();
  }, [supabase, user]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'name',
      header: 'Batch Name',
      sortable: true,
      render: (batch: Batch & { student_count: number }) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Layers className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{batch.name}</p>
            <p className="text-sm text-gray-500">{batch.subjects?.join(', ')}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'student_count',
      header: 'Students',
      render: (batch: Batch & { student_count: number }) => (
        <span className="font-medium">{batch.student_count}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (batch: Batch) => (
        <Badge variant={batch.is_active ? 'success' : 'danger'}>
          {batch.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'start_date',
      header: 'Started',
      sortable: true,
      render: (batch: Batch) => formatDate(batch.start_date),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Batches</h1>
          <p className="page-subtitle">{batches.length} batches</p>
        </div>
        {user?.role === 'coaching_admin' && (
          <Link href="/dashboard/batches/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Batch
            </Button>
          </Link>
        )}
      </div>

      <DataTable
        data={batches}
        columns={columns}
        searchable
        searchPlaceholder="Search batches..."
        onRowClick={(batch) => router.push(`/dashboard/batches/${batch.id}`)}
        emptyMessage="No batches found"
      />
    </div>
  );
}
