'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StatCard, Card, CardHeader, CardBody, Badge, PageLoader } from '@/components/ui';
import { formatCurrency, formatDate, calculateAttendancePercentage } from '@/lib/utils';
import {
  GraduationCap,
  Layers,
  Users,
  IndianRupee,
  ClipboardList,
  TrendingUp,
  Calendar,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalStudents: number;
  activeBatches: number;
  totalStaff: number;
  pendingFees: number;
  todayAttendance: number;
  totalAttendanceToday: number;
}

interface RecentStudent {
  id: string;
  first_name: string;
  last_name: string;
  student_id: string;
  created_at: string;
}

interface UpcomingDue {
  id: string;
  student_id: string;
  amount: number;
  due_date: string;
  students?: {
    first_name: string;
    last_name: string;
  };
}

export function CoachingAdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [upcomingDues, setUpcomingDues] = useState<UpcomingDue[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.institute_id) return;

      try {
        const today = new Date().toISOString().split('T')[0];

        // Fetch students count
        const { count: totalStudents } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('institute_id', user.institute_id)
          .eq('is_active', true);

        // Fetch active batches count
        const { count: activeBatches } = await supabase
          .from('batches')
          .select('*', { count: 'exact', head: true })
          .eq('institute_id', user.institute_id)
          .eq('is_active', true);

        // Fetch staff count
        const { count: totalStaff } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('institute_id', user.institute_id)
          .in('role', ['staff', 'teacher']);

        // Fetch pending fees total
        const { data: pendingFeesData } = await supabase
          .from('fee_payments')
          .select('amount')
          .eq('institute_id', user.institute_id)
          .in('status', ['pending', 'overdue']);

        const pendingFees = pendingFeesData?.reduce((sum, fee) => sum + fee.amount, 0) || 0;

        // Fetch today's attendance
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status')
          .eq('institute_id', user.institute_id)
          .eq('date', today);

        const presentCount = attendanceData?.filter((a) => a.status === 'present').length || 0;
        const totalAttendance = attendanceData?.length || 0;

        // Fetch recent students
        const { data: students } = await supabase
          .from('students')
          .select('id, first_name, last_name, student_id, created_at')
          .eq('institute_id', user.institute_id)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch upcoming fee dues
        const { data: dues } = await supabase
          .from('fee_payments')
          .select('id, student_id, amount, due_date, students(first_name, last_name)')
          .eq('institute_id', user.institute_id)
          .in('status', ['pending', 'overdue'])
          .order('due_date', { ascending: true })
          .limit(5);

        setStats({
          totalStudents: totalStudents || 0,
          activeBatches: activeBatches || 0,
          totalStaff: totalStaff || 0,
          pendingFees,
          todayAttendance: presentCount,
          totalAttendanceToday: totalAttendance,
        });

        setRecentStudents(students || []);
        setUpcomingDues(dues || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase, user?.institute_id]);

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
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here&apos;s your institute overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<GraduationCap className="h-6 w-6" />}
        />
        <StatCard
          title="Active Batches"
          value={stats?.activeBatches || 0}
          icon={<Layers className="h-6 w-6" />}
        />
        <StatCard
          title="Staff Members"
          value={stats?.totalStaff || 0}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Pending Fees"
          value={formatCurrency(stats?.pendingFees || 0)}
          icon={<IndianRupee className="h-6 w-6" />}
          change="View details"
          changeType="neutral"
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
              href="/dashboard/students/new"
              className="flex flex-col items-center gap-2 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors"
            >
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-sm font-medium text-gray-900">Add Student</span>
            </Link>
            <Link
              href="/dashboard/batches/new"
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Layers className="h-8 w-8 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Create Batch</span>
            </Link>
            <Link
              href="/dashboard/attendance"
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
            >
              <ClipboardList className="h-8 w-8 text-orange-600" />
              <span className="text-sm font-medium text-gray-900">Mark Attendance</span>
            </Link>
            <Link
              href="/dashboard/homework/new"
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <BookOpen className="h-8 w-8 text-purple-600" />
              <span className="text-sm font-medium text-gray-900">Create Homework</span>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Today's Attendance & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Attendance</h2>
            <Link href="/dashboard/attendance" className="text-sm text-primary-600 hover:text-primary-700">
              View details
            </Link>
          </CardHeader>
          <CardBody>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#22c55e"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(attendancePercentage / 100) * 440} 440`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{attendancePercentage}%</span>
                  <span className="text-sm text-gray-500">Present</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats?.todayAttendance}</p>
                <p className="text-gray-500">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {(stats?.totalAttendanceToday || 0) - (stats?.todayAttendance || 0)}
                </p>
                <p className="text-gray-500">Absent</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Recent Students */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Students</h2>
            <Link href="/dashboard/students" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No students yet</p>
              ) : (
                recentStudents.map((student) => (
                  <Link
                    key={student.id}
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-semibold text-sm">
                          {student.first_name.charAt(0)}
                          {student.last_name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(student.created_at)}</span>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Fee Dues */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Fee Dues</h2>
          <Link href="/dashboard/fees" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-gray-100">
            {upcomingDues.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No pending fees</p>
            ) : (
              upcomingDues.map((due) => (
                <div
                  key={due.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {due.students?.first_name} {due.students?.last_name}
                      </p>
                      <p className="text-sm text-gray-500">Due: {formatDate(due.due_date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(due.amount)}</p>
                    <Badge variant={new Date(due.due_date) < new Date() ? 'danger' : 'warning'}>
                      {new Date(due.due_date) < new Date() ? 'Overdue' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
