'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StatCard, Card, CardHeader, CardBody, Badge, PageLoader } from '@/components/portal/ui';
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
  Heart,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { calculateHealthScore, HealthScoreData } from '@/services/healthScore';

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
  const [healthScore, setHealthScore] = useState<HealthScoreData | null>(null);
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

        const pendingFees = pendingFeesData?.reduce((sum: any, fee: any) => sum + fee.amount, 0) || 0;

        // Fetch today's attendance
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status')
          .eq('institute_id', user.institute_id)
          .eq('date', today);

        const presentCount = attendanceData?.filter((a: any) => a.status === 'present').length || 0;
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

        // Fetch health score
        try {
          const hs = await calculateHealthScore(user.institute_id);
          setHealthScore(hs);
        } catch (e) { console.error('Health score error:', e); }
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

      {/* Institute Health Score */}
      {healthScore && (
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Institute Health Score</h2>
            </div>
            <Badge variant={healthScore.overallScore >= 75 ? 'success' : healthScore.overallScore >= 50 ? 'warning' : 'danger'}>
              {healthScore.overallScore >= 75 ? 'Excellent' : healthScore.overallScore >= 50 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative w-32 h-32 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke={healthScore.overallScore >= 75 ? '#22c55e' : healthScore.overallScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${(healthScore.overallScore / 100) * 352} 352`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{healthScore.overallScore}</span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'Attendance', value: healthScore.attendance.score, color: '#4F46E5' },
                  { label: 'Fee Collection', value: healthScore.fees.score, color: '#22c55e' },
                  { label: 'Test Performance', value: healthScore.tests.score, color: '#f59e0b' },
                  { label: 'Homework', value: healthScore.homework.score, color: '#8b5cf6' },
                  { label: 'Batch Utilization', value: healthScore.batchUtilization.score, color: '#06b6d4' },
                  { label: 'Staff Engagement', value: healthScore.staffEngagement.score, color: '#ec4899' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm"><span className="text-gray-500">{item.label}</span><span className="font-semibold">{item.value}%</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      )}

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
