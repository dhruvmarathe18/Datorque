'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Select, PageLoader } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, IndianRupee, ClipboardList, Download, Calendar, FileText } from 'lucide-react';
import { Batch } from '@/types';

export default function ReportsPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalFeeCollected: 0,
    pendingFees: 0,
    avgAttendance: 0,
    totalHomework: 0,
  });

  useEffect(() => {
    async function fetchData() {
      if (!user?.institute_id) return;

      // Fetch batches
      const { data: batchesData } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);
      setBatches(batchesData || []);

      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      if (dateRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(now.getMonth() - 1);
      } else if (dateRange === 'quarter') {
        startDate.setMonth(now.getMonth() - 3);
      } else if (dateRange === 'year') {
        startDate.setFullYear(now.getFullYear() - 1);
      }

      // Fetch students count
      let studentsQuery = supabase
        .from('students')
        .select('id, is_active', { count: 'exact' })
        .eq('institute_id', user.institute_id);

      if (selectedBatch !== 'all') {
        const { data: studentBatches } = await supabase
          .from('student_batches')
          .select('student_id')
          .eq('batch_id', selectedBatch);
        if (studentBatches) {
          studentsQuery = studentsQuery.in('id', studentBatches.map((sb) => sb.student_id));
        }
      }

      const { data: students, count: totalStudents } = await studentsQuery;
      const activeStudents = students?.filter((s) => s.is_active).length || 0;

      // Fetch fee stats
      let feeQuery = supabase
        .from('fee_payments')
        .select('amount, status')
        .eq('institute_id', user.institute_id);

      if (selectedBatch !== 'all') {
        feeQuery = feeQuery.eq('batch_id', selectedBatch);
      }

      const { data: fees } = await feeQuery;
      const totalFeeCollected = fees?.filter((f) => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0) || 0;
      const pendingFees = fees?.filter((f) => f.status === 'pending' || f.status === 'overdue').reduce((sum, f) => sum + f.amount, 0) || 0;

      // Fetch attendance stats
      let attendanceQuery = supabase
        .from('attendance')
        .select('status')
        .eq('institute_id', user.institute_id)
        .gte('date', startDate.toISOString().split('T')[0]);

      if (selectedBatch !== 'all') {
        attendanceQuery = attendanceQuery.eq('batch_id', selectedBatch);
      }

      const { data: attendance } = await attendanceQuery;
      const presentCount = attendance?.filter((a) => a.status === 'present').length || 0;
      const totalAttendance = attendance?.length || 0;
      const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      // Fetch homework count
      let homeworkQuery = supabase
        .from('homework')
        .select('id', { count: 'exact' })
        .eq('institute_id', user.institute_id)
        .gte('created_at', startDate.toISOString());

      if (selectedBatch !== 'all') {
        homeworkQuery = homeworkQuery.eq('batch_id', selectedBatch);
      }

      const { count: homeworkCount } = await homeworkQuery;

      setStats({
        totalStudents: totalStudents || 0,
        activeStudents,
        totalFeeCollected,
        pendingFees,
        avgAttendance,
        totalHomework: homeworkCount || 0,
      });

      setLoading(false);
    }

    fetchData();
  }, [supabase, user, selectedBatch, dateRange]);

  if (loading) {
    return <PageLoader />;
  }

  const reportCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: `${stats.activeStudents} active`,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Fee Collected',
      value: formatCurrency(stats.totalFeeCollected),
      subtitle: `${formatCurrency(stats.pendingFees)} pending`,
      icon: IndianRupee,
      color: 'green',
    },
    {
      title: 'Average Attendance',
      value: `${stats.avgAttendance}%`,
      subtitle: 'Present rate',
      icon: ClipboardList,
      color: 'purple',
    },
    {
      title: 'Homework Assigned',
      value: stats.totalHomework,
      subtitle: 'In selected period',
      icon: FileText,
      color: 'orange',
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Overview of your institute's performance</p>
        </div>
        <Button variant="secondary">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="Batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                options={[
                  { value: 'all', label: 'All Batches' },
                  ...batches.map((b) => ({ value: b.id, label: b.name })),
                ]}
              />
            </div>
            <div className="flex-1">
              <Select
                label="Time Period"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                options={[
                  { value: 'week', label: 'Last 7 Days' },
                  { value: 'month', label: 'Last 30 Days' },
                  { value: 'quarter', label: 'Last 3 Months' },
                  { value: 'year', label: 'Last Year' },
                ]}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">Attendance Trend</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Chart visualization coming soon</p>
                <p className="text-sm">Average: {stats.avgAttendance}%</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Fee Collection Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-semibold">Fee Collection</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Chart visualization coming soon</p>
                <p className="text-sm">Collected: {formatCurrency(stats.totalFeeCollected)}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Quick Reports */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Quick Reports</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <FileText className="h-8 w-8 text-primary-600 mb-2" />
              <p className="font-medium">Attendance Report</p>
              <p className="text-sm text-gray-500">Export attendance records</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <IndianRupee className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium">Fee Report</p>
              <p className="text-sm text-gray-500">Export fee collection data</p>
            </button>
            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium">Student Report</p>
              <p className="text-sm text-gray-500">Export student list</p>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
