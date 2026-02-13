'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Avatar } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { Plus, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Staff } from '@/types';

export default function StaffPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (user?.role !== 'coaching_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchStaff() {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('institute_id', user?.institute_id)
        .in('role', ['staff', 'teacher'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setStaff(data);
      }
      setLoading(false);
    }

    fetchStaff();
  }, [supabase, user, router]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (member: Staff) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${member.first_name || ''} ${member.last_name || ''}`} size="md" />
          <div>
            <p className="font-medium text-gray-900">
              {member.first_name && member.last_name
                ? `${member.first_name} ${member.last_name}`
                : 'Not Set'}
            </p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'designation',
      header: 'Designation',
      render: (member: Staff) => member.designation || '-',
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (member: Staff) => member.phone || '-',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (member: Staff) => (
        <Badge variant={member.is_active ? 'success' : 'danger'}>
          {member.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (member: Staff) => formatDate(member.created_at),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Staff</h1>
          <p className="page-subtitle">{staff.length} staff members</p>
        </div>
        <Link href="/dashboard/staff/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </Link>
      </div>

      <DataTable
        data={staff}
        columns={columns}
        searchable
        searchPlaceholder="Search staff..."
        onRowClick={(member) => router.push(`/dashboard/staff/${member.id}`)}
        emptyMessage="No staff members found"
      />
    </div>
  );
}
