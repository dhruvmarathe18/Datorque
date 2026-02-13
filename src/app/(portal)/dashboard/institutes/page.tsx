'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader } from '@/components/portal/ui';
import { formatDate, getSubscriptionStatusColor } from '@/lib/utils';
import { Plus, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Institute } from '@/types/portal';

export default function InstitutesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchInstitutes() {
      const { data, error } = await supabase
        .from('institutes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setInstitutes(data);
      }
      setLoading(false);
    }

    fetchInstitutes();
  }, [supabase, user, router]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'name',
      header: 'Institute Name',
      sortable: true,
      render: (institute: Institute) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Building2 className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{institute.name}</p>
            <p className="text-sm text-gray-500">{institute.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact_person',
      header: 'Contact Person',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'subscription_status',
      header: 'Status',
      render: (institute: Institute) => (
        <Badge
          variant={
            institute.subscription_status === 'active'
              ? 'success'
              : institute.subscription_status === 'trial'
              ? 'info'
              : institute.subscription_status === 'suspended'
              ? 'warning'
              : 'danger'
          }
        >
          {institute.subscription_status}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (institute: Institute) => formatDate(institute.created_at),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Institutes</h1>
          <p className="page-subtitle">Manage all coaching institutes</p>
        </div>
        <Link href="/dashboard/institutes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Institute
          </Button>
        </Link>
      </div>

      <DataTable
        data={institutes}
        columns={columns}
        searchable
        searchPlaceholder="Search institutes..."
        onRowClick={(institute) => router.push(`/dashboard/institutes/${institute.id}`)}
        emptyMessage="No institutes found"
      />
    </div>
  );
}
