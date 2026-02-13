'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StatCard, Card, CardHeader, CardBody, Badge, PageLoader } from '@/components/portal/ui';
import { formatDate, calculateAttendancePercentage } from '@/lib/utils';
import {
  GraduationCap,
  Layers,
  ClipboardList,
  BookOpen,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  assignedBatches: number;
  totalStudents: number;
  todayAttendance: number;
  totalAttendanceToday: number;
  pendingHomework: number;
}

interface AssignedBatch {
  id: string;
  name: string;
  student_count?: number;
}

interface RecentHomework {
  id: string;
  title: string;
  subject: string;
  due_date: string;
  batches?: {
    name: string;
  };
}

export function StaffDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [assignedBatches, setAssignedBatches] = useState<AssignedBatch[]>([]);
  const [recentHomework, setRecentHomework] = useState<RecentHomework[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id || !user?.institute_id) return;

      try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch assigned batches for staff
        const { data: batchAssignments } = await supabase
          .from('batch_staff')
          .select('batch_id, batches(id, name)')
          .eq('staff_id', user.id);

        const batchIds = batchAssignments?.map((ba: any) => ba.batch_id) || [];

        // Get student count for assigned batches
        let totalStudents = 0;
        const batchesWithCount: AssignedBatch[] = [];

        if (batchIds.length > 0) {
          for (const ba of batchAssignments || []) {
            const { count } = await supabase
              .from('student_batches')
              .select('*', { count: 'exact', head: true })
              .eq('batch_id', ba.batch_id);

            batchesWithCount.push({
              id: ba.batch_id,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name: (ba.batches as any)?.name || 'Unknown',
              student_count: count || 0,
            });
            totalStudents += count || 0;
          }
        }

        // Fetch today's attendance for assigned batches
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let attendanceData: any[] = [];
        if (batchIds.length > 0) {
          const { data } = await supabase
            .from('attendance')
            .select('status')
            .eq('institute_id', user.institute_id)
            .eq('date', today)
            .in('batch_id', batchIds);
          attendanceData = data || [];
        }

        const presentCount = attendanceData.filter((a) => a.status === 'present').length;
        const totalAttendance = attendanceData.length;

        // Fetch homework assigned by this staff
        const { data: homework } = await supabase
          .from('homework')
          .select('id, title, subject, due_date, batches(name)')
          .eq('assigned_by', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(5);

        // Count pending homework submissions
        const { count: pendingHomework } = await supabase
          .from('homework_submissions')
          .select('*, homework!inner(*)', { count: 'exact', head: true })
          .eq('homework.assigned_by', user.id)
          .eq('status', 'submitted');

        setStats({
          assignedBatches: batchIds.length,
          totalStudents,
          todayAttendance: presentCount,
          totalAttendanceToday: totalAttendance,
          pendingHomework: pendingHomework || 0,
        });

        setAssignedBatches(batchesWithCount);
        setRecentHomework(homework || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase, user?.id, user?.institute_id]);

  if (loading) {
    return <PageLoader />;
  }

  const attendancePercentage = calculateAttendancePercentage(
    stats?.todayAttendance || 0,
    stats?.totalAttendanceToday || 0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Staff Dashboard</h1>
        <p className="page-subtitle">Manage your assigned batches and students</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Batches"
          value={stats?.assignedBatches || 0}
          icon={<Layers className="h-6 w-6" />}
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<GraduationCap className="h-6 w-6" />}
        />
        <StatCard
          title="Today's Attendance"
          value={`${attendancePercentage}%`}
          icon={<ClipboardList className="h-6 w-6" />}
          change={`${stats?.todayAttendance || 0} present`}
          changeType="positive"
        />
        <StatCard
          title="Pending Reviews"
          value={stats?.pendingHomework || 0}
          icon={<BookOpen className="h-6 w-6" />}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/attendance"
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Mark Attendance</span>
            </Link>
            <Link
              href="/dashboard/homework"
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">View Homework</span>
            </Link>
            <Link
              href="/dashboard/students"
              className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">View Students</span>
            </Link>
            <Link
              href="/dashboard/notices"
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium text-gray-900">View Notices</span>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Assigned Batches & Recent Homework */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assigned Batches */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Batches</h2>
            <Link href="/dashboard/batches" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {assignedBatches.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No batches assigned</p>
              ) : (
                assignedBatches.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/dashboard/batches/${batch.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Layers className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{batch.name}</p>
                        <p className="text-sm text-gray-500">{batch.student_count} students</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>

        {/* Recent Homework */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Homework</h2>
            <Link href="/dashboard/homework" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentHomework.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No homework assigned</p>
              ) : (
                recentHomework.map((hw) => (
                  <Link
                    key={hw.id}
                    href={`/dashboard/homework/${hw.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{hw.title}</p>
                        <p className="text-sm text-gray-500">
                          {hw.subject} • {hw.batches?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Due</p>
                      <p className="text-sm font-medium">{formatDate(hw.due_date)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
