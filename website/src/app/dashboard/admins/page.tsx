'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Avatar } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Admin {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  institute_id: string;
  institutes?: {
    name: string;
  };
}

export default function AdminsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchAdmins() {
      const { data, error } = await supabase
        .from('users')
        .select('*, institutes(name)')
        .eq('role', 'coaching_admin')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setAdmins(data);
      }
      setLoading(false);
    }

    fetchAdmins();
  }, [supabase, user, router]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'name',
      header: 'Admin',
      render: (admin: Admin) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${admin.first_name || ''} ${admin.last_name || ''}`} size="md" />
          <div>
            <p className="font-medium text-gray-900">
              {admin.first_name && admin.last_name
                ? `${admin.first_name} ${admin.last_name}`
                : 'Not Set'}
            </p>
            <p className="text-sm text-gray-500">{admin.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'institute',
      header: 'Institute',
      render: (admin: Admin) => admin.institutes?.name || 'Not Assigned',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (admin: Admin) => (
        <Badge variant={admin.is_active ? 'success' : 'danger'}>
          {admin.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (admin: Admin) => formatDate(admin.created_at),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Admins</h1>
          <p className="page-subtitle">Manage coaching institute administrators</p>
        </div>
        <Link href="/dashboard/admins/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        </Link>
      </div>

      <DataTable
        data={admins}
        columns={columns}
        searchable
        searchPlaceholder="Search admins..."
        onRowClick={(admin) => router.push(`/dashboard/admins/${admin.id}`)}
        emptyMessage="No admins found"
      />
    </div>
  );
}
