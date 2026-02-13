'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Avatar } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { Plus, GraduationCap, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Student } from '@/types';

export default function StudentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    if (!user?.institute_id && user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchStudents() {
      let query = supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (user?.institute_id) {
        query = query.eq('institute_id', user.institute_id);
      }

      const { data, error } = await query;

      if (!error && data) {
        setStudents(data);
      }
      setLoading(false);
    }

    fetchStudents();
  }, [supabase, user, router]);

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${student.first_name} ${student.last_name}`} size="md" />
          <div>
            <p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p>
            <p className="text-sm text-gray-500">ID: {student.student_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
    {
      key: 'phone',
      header: 'Phone',
    },
    {
      key: 'parent_name',
      header: 'Parent',
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (student: Student) => (
        <Badge variant={student.is_active ? 'success' : 'danger'}>
          {student.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Joined',
      sortable: true,
      render: (student: Student) => formatDate(student.created_at),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} students enrolled</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {(user?.role === 'coaching_admin') && (
            <Link href="/dashboard/students/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </Link>
          )}
        </div>
      </div>

      <DataTable
        data={students}
        columns={columns}
        searchable
        searchPlaceholder="Search students by name, ID, email..."
        onRowClick={(student) => router.push(`/dashboard/students/${student.id}`)}
        emptyMessage="No students found"
      />
    </div>
  );
}
