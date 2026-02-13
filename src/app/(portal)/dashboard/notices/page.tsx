'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Card, CardBody, Select, Modal, Input, Textarea, Alert } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { Bell, Plus, Eye, Megaphone, Pin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Notice, Batch } from '@/types/portal';

interface NoticeWithBatch extends Notice {
  batches?: { name: string };
  users?: { first_name: string; last_name: string };
}

export default function NoticesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [notices, setNotices] = useState<NoticeWithBatch[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.institute_id) return;

      // Fetch batches
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

      // Fetch notices
      let noticesQuery = supabase
        .from('notices')
        .select('*, batches(name), users(first_name, last_name)')
        .eq('institute_id', user.institute_id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (filterBatch !== 'all') {
        noticesQuery = noticesQuery.eq('batch_id', filterBatch);
      }

      const { data: noticesData } = await noticesQuery;
      setNotices(noticesData || []);
      setLoading(false);
    }

    fetchData();
  }, [supabase, user, filterBatch]);

  const togglePin = async (notice: NoticeWithBatch) => {
    const { error } = await supabase
      .from('notices')
      .update({ is_pinned: !notice.is_pinned })
      .eq('id', notice.id);

    if (!error) {
      setNotices((prev) =>
        prev.map((n) => (n.id === notice.id ? { ...n, is_pinned: !n.is_pinned } : n))
      );
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'title',
      header: 'Notice',
      render: (notice: NoticeWithBatch) => (
        <div className="flex items-start gap-3">
          {notice.is_pinned && (
            <Pin className="h-4 w-4 text-primary-600 mt-1 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium text-gray-900">{notice.title}</p>
            <p className="text-sm text-gray-500 truncate max-w-md">{notice.content}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'target',
      header: 'Target Audience',
      render: (notice: NoticeWithBatch) => (
        <Badge variant={notice.batch_id ? 'default' : 'info'}>
          {notice.batches?.name || 'All Students'}
        </Badge>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (notice: NoticeWithBatch) => (
        <Badge
          variant={
            notice.priority === 'urgent'
              ? 'danger'
              : notice.priority === 'important'
              ? 'warning'
              : 'default'
          }
        >
          {notice.priority || 'normal'}
        </Badge>
      ),
    },
    {
      key: 'created_by',
      header: 'Posted By',
      render: (notice: NoticeWithBatch) =>
        notice.users ? `${notice.users.first_name} ${notice.users.last_name}` : '-',
    },
    {
      key: 'created_at',
      header: 'Posted',
      render: (notice: NoticeWithBatch) => formatDate(notice.created_at),
    },
    {
      key: 'actions',
      header: '',
      render: (notice: NoticeWithBatch) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePin(notice);
          }}
          className={`p-2 rounded-lg transition-colors ${
            notice.is_pinned ? 'text-primary-600 bg-primary-50' : 'text-gray-400 hover:bg-gray-100'
          }`}
          title={notice.is_pinned ? 'Unpin' : 'Pin'}
        >
          <Pin className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Notices</h1>
          <p className="page-subtitle">{notices.length} notices published</p>
        </div>
        <Link href="/dashboard/notices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Notice
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <Megaphone className="h-5 w-5 text-gray-400" />
            <Select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              options={[
                { value: 'all', label: 'All Notices' },
                ...batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <DataTable
        data={notices}
        columns={columns}
        searchable
        searchPlaceholder="Search notices..."
        onRowClick={(notice) => router.push(`/dashboard/notices/${notice.id}`)}
        emptyMessage="No notices found"
      />
    </div>
  );
}
