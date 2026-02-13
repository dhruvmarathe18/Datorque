'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Select, PageLoader, Alert } from '@/components/portal/ui';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, Users, IndianRupee, ClipboardList, Download, FileText, TrendingUp, Printer } from 'lucide-react';
import { Batch } from '@/types/portal';
import { fetchReportData, generateCSV, downloadCSV, downloadHTML, printHTML } from '@/services/reports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

function formatReport(type: string, rawData: any[]): any {
  if (!rawData?.length) return { chartData: [], distributionData: [], headers: [], rows: [] };

  switch (type) {
    case 'attendance': {
      // Group by date for trend
      const byDate: Record<string, { present: number; total: number }> = {};
      rawData.forEach((r: any) => {
        if (!byDate[r.date]) byDate[r.date] = { present: 0, total: 0 };
        byDate[r.date].total++;
        if (r.status === 'present') byDate[r.date].present++;
      });
      const chartData = Object.entries(byDate).sort().slice(-30).map(([d, v]) => ({ label: d.slice(5), value: Math.round((v.present / v.total) * 100) }));
      // Status distribution
      const statusCount: Record<string, number> = {};
      rawData.forEach((r: any) => { statusCount[r.status] = (statusCount[r.status] || 0) + 1; });
      const distributionData = Object.entries(statusCount).map(([k, v]) => ({ label: k, value: v }));
      const headers = ['Date', 'Student', 'Batch', 'Status'];
      const rows = rawData.slice(0, 200).map((r: any) => [r.date, `${r.students?.first_name || ''} ${r.students?.last_name || ''}`, r.batches?.name || '-', r.status]);
      return { chartData, distributionData, headers, rows };
    }
    case 'fees': {
      const byMonth: Record<string, { paid: number; pending: number }> = {};
      rawData.forEach((r: any) => {
        const m = (r.created_at || r.due_date || '').slice(0, 7);
        if (!byMonth[m]) byMonth[m] = { paid: 0, pending: 0 };
        if (r.status === 'paid') byMonth[m].paid += r.amount; else byMonth[m].pending += r.amount;
      });
      const chartData = Object.entries(byMonth).sort().map(([m, v]) => ({ label: m, value: v.paid }));
      const statusCount: Record<string, number> = {};
      rawData.forEach((r: any) => { statusCount[r.status] = (statusCount[r.status] || 0) + 1; });
      const distributionData = Object.entries(statusCount).map(([k, v]) => ({ label: k, value: v }));
      const headers = ['Student', 'Batch', 'Amount', 'Due Date', 'Status'];
      const rows = rawData.slice(0, 200).map((r: any) => [`${r.students?.first_name || ''} ${r.students?.last_name || ''}`, r.batches?.name || '-', r.amount, r.due_date, r.status]);
      return { chartData, distributionData, headers, rows };
    }
    case 'students': {
      const headers = ['Name', 'Student ID', 'Active', 'Batches'];
      const rows = rawData.map((r: any) => [`${r.first_name} ${r.last_name}`, r.student_id, r.is_active ? 'Yes' : 'No', r.student_batches?.map((sb: any) => sb.batches?.name).filter(Boolean).join(', ') || '-']);
      return { chartData: [], distributionData: [], headers, rows };
    }
    case 'tests': {
      const headers = ['Student', 'Test', 'Subject', 'Marks', 'Max Marks', 'Percentage'];
      const rows = rawData.map((r: any) => [`${r.students?.first_name || ''} ${r.students?.last_name || ''}`, r.tests?.name || '-', r.tests?.subject || '-', r.marks_obtained, r.tests?.max_marks || '-', r.tests?.max_marks ? `${Math.round((r.marks_obtained / r.tests.max_marks) * 100)}%` : '-']);
      const bySubject: Record<string, { total: number; count: number }> = {};
      rawData.forEach((r: any) => {
        const s = r.tests?.subject || 'Unknown';
        if (!bySubject[s]) bySubject[s] = { total: 0, count: 0 };
        if (r.tests?.max_marks) { bySubject[s].total += (r.marks_obtained / r.tests.max_marks) * 100; bySubject[s].count++; }
      });
      const distributionData = Object.entries(bySubject).map(([k, v]) => ({ label: k, value: Math.round(v.total / v.count) }));
      return { chartData: [], distributionData, headers, rows };
    }
    case 'batch': {
      const headers = ['Batch', 'Students', 'Attendance Rate', 'Status'];
      const rows = rawData.map((r: any) => [r.name, r.student_count, `${r.attendance_rate}%`, r.is_active ? 'Active' : 'Inactive']);
      const distributionData = rawData.map((r: any) => ({ label: r.name, value: r.attendance_rate }));
      return { chartData: [], distributionData, headers, rows };
    }
    default: return { chartData: [], distributionData: [], headers: [], rows: [] };
  }
}

export default function ReportsPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState<'attendance' | 'fees' | 'students' | 'tests' | 'batch'>('attendance');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<any>(null);
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState({ totalStudents: 0, activeStudents: 0, totalFeeCollected: 0, pendingFees: 0, avgAttendance: 0, totalHomework: 0 });

  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;
      const { data } = await supabase.from('batches').select('*').eq('institute_id', user.institute_id).eq('is_active', true);
      setBatches(data || []);
    }
    fetchBatches();
  }, [user?.institute_id]);

  useEffect(() => {
    loadData();
  }, [user?.institute_id, selectedBatch, dateRange, reportType]);

  const loadData = async () => {
    if (!user?.institute_id) return;
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date();
      if (dateRange === 'week') startDate.setDate(now.getDate() - 7);
      else if (dateRange === 'month') startDate.setMonth(now.getMonth() - 1);
      else if (dateRange === 'quarter') startDate.setMonth(now.getMonth() - 3);
      else startDate.setFullYear(now.getFullYear() - 1);

      // Fetch overview stats
      const { count: totalStudents } = await supabase.from('students').select('*', { count: 'exact', head: true }).eq('institute_id', user.institute_id);
      const { data: allStudents } = await supabase.from('students').select('is_active').eq('institute_id', user.institute_id);
      const activeStudents = allStudents?.filter((s: any) => s.is_active).length || 0;

      const { data: fees } = await supabase.from('fee_payments').select('amount, status').eq('institute_id', user.institute_id);
      const totalFeeCollected = fees?.filter((f: any) => f.status === 'paid').reduce((s: number, f: any) => s + f.amount, 0) || 0;
      const pendingFees = fees?.filter((f: any) => f.status !== 'paid').reduce((s: number, f: any) => s + f.amount, 0) || 0;

      const { data: att } = await supabase.from('attendance').select('status').eq('institute_id', user.institute_id).gte('date', startDate.toISOString().split('T')[0]);
      const presentCount = att?.filter((a: any) => a.status === 'present').length || 0;
      const avgAttendance = att?.length ? Math.round((presentCount / att.length) * 100) : 0;

      const { count: homeworkCount } = await supabase.from('homework').select('id', { count: 'exact', head: true }).eq('institute_id', user.institute_id).gte('created_at', startDate.toISOString());
      setStats({ totalStudents: totalStudents || 0, activeStudents, totalFeeCollected, pendingFees, avgAttendance, totalHomework: homeworkCount || 0 });

      // Fetch report-specific data
      const rawData = await fetchReportData(user.institute_id, reportType, { startDate: startDate.toISOString().split('T')[0], endDate: now.toISOString().split('T')[0], batchId: selectedBatch !== 'all' ? selectedBatch : undefined });
      setReportData(formatReport(reportType, rawData));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleExport = async (format: 'csv' | 'print') => {
    if (!reportData?.rows?.length) return;
    setExporting(true);
    try {
      if (format === 'csv') {
        const csv = generateCSV(reportData.headers, reportData.rows);
        downloadCSV(csv, `${reportType}-report.csv`);
      } else {
        const html = `<html><head><title>${reportType} Report</title><style>body{font-family:sans-serif;padding:20px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f3f4f6}h1{color:#1E1B4B}</style></head><body><h1>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h1><table><thead><tr>${reportData.headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${reportData.rows.map((r: any[]) => `<tr>${r.map((c: any) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`;
        printHTML(html);
      }
    } catch (err) { console.error(err); }
    finally { setExporting(false); }
  };

  const reportCards = [
    { title: 'Total Students', value: stats.totalStudents, subtitle: `${stats.activeStudents} active`, icon: Users, color: 'blue' },
    { title: 'Fee Collected', value: formatCurrency(stats.totalFeeCollected), subtitle: `${formatCurrency(stats.pendingFees)} pending`, icon: IndianRupee, color: 'green' },
    { title: 'Avg Attendance', value: `${stats.avgAttendance}%`, subtitle: 'Present rate', icon: ClipboardList, color: 'purple' },
    { title: 'Homework', value: stats.totalHomework, subtitle: 'In selected period', icon: FileText, color: 'orange' },
  ];

  const colorClasses: Record<string, string> = { blue: 'bg-blue-100 text-blue-600', green: 'bg-green-100 text-green-600', purple: 'bg-purple-100 text-purple-600', orange: 'bg-orange-100 text-orange-600' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Overview of your institute&apos;s performance</p></div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleExport('csv')} disabled={exporting}><Download className="h-4 w-4 mr-1" /> CSV</Button>
          <Button variant="secondary" size="sm" onClick={() => handleExport('print')} disabled={exporting}><Printer className="h-4 w-4 mr-1" /> Print</Button>
        </div>
      </div>

      {/* Filters */}
      <Card><CardBody><div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1"><Select label="Report Type" value={reportType} onChange={(e) => setReportType(e.target.value as any)} options={[{ value: 'attendance', label: 'Attendance Report' }, { value: 'fees', label: 'Fee Report' }, { value: 'students', label: 'Student Report' }, { value: 'tests', label: 'Test Report' }, { value: 'batch', label: 'Batch Report' }]} /></div>
        <div className="flex-1"><Select label="Batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} options={[{ value: 'all', label: 'All Batches' }, ...batches.map((b) => ({ value: b.id, label: b.name }))]} /></div>
        <div className="flex-1"><Select label="Time Period" value={dateRange} onChange={(e) => setDateRange(e.target.value)} options={[{ value: 'week', label: 'Last 7 Days' }, { value: 'month', label: 'Last 30 Days' }, { value: 'quarter', label: 'Last 3 Months' }, { value: 'year', label: 'Last Year' }]} /></div>
      </div></CardBody></Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportCards.map((card) => (
          <Card key={card.title} className="p-6"><div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${colorClasses[card.color]}`}><card.icon className="h-6 w-6" /></div>
            <div><p className="text-2xl font-bold">{card.value}</p><p className="text-sm text-gray-500">{card.title}</p><p className="text-xs text-gray-400">{card.subtitle}</p></div>
          </div></Card>
        ))}
      </div>

      {loading ? <PageLoader /> : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportData?.chartData && (
              <Card><CardHeader><div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-gray-400" /><h2 className="text-lg font-semibold">Trend</h2></div></CardHeader><CardBody>
                {reportData.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={reportData.chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" fontSize={12} /><YAxis fontSize={12} />
                      <Tooltip /><Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} dot={false} /></LineChart>
                  </ResponsiveContainer>
                ) : <div className="h-64 flex items-center justify-center text-gray-500">No trend data available</div>}
              </CardBody></Card>
            )}

            {reportData?.distributionData && (
              <Card><CardHeader><div className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-gray-400" /><h2 className="text-lg font-semibold">Distribution</h2></div></CardHeader><CardBody>
                {reportData.distributionData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reportData.distributionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" fontSize={12} /><YAxis fontSize={12} />
                      <Tooltip /><Bar dataKey="value" radius={[4, 4, 0, 0]}>{reportData.distributionData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart>
                  </ResponsiveContainer>
                ) : <div className="h-64 flex items-center justify-center text-gray-500">No distribution data</div>}
              </CardBody></Card>
            )}
          </div>

          {/* Data Table */}
          {reportData?.rows && reportData.rows.length > 0 && (
            <Card><CardHeader><h2 className="text-lg font-semibold">Report Data ({reportData.rows.length} records)</h2></CardHeader>
              <CardBody className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50">{reportData.headers.map((h: string, i: number) => <th key={i} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">{reportData.rows.slice(0, 50).map((row: any[], ri: number) => (
                    <tr key={ri} className="hover:bg-gray-50">{row.map((cell: any, ci: number) => <td key={ci} className="px-4 py-3 text-gray-900">{cell}</td>)}</tr>
                  ))}</tbody>
                </table>
                {reportData.rows.length > 50 && <p className="text-center text-sm text-gray-500 py-3">Showing 50 of {reportData.rows.length} records. Export CSV for full data.</p>}
              </CardBody>
            </Card>
          )}

          {/* Quick Reports */}
          <Card><CardHeader><h2 className="text-lg font-semibold">Quick Reports</h2></CardHeader><CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { type: 'attendance' as const, label: 'Attendance Report', desc: 'Export attendance records', icon: ClipboardList, color: 'primary' },
                { type: 'fees' as const, label: 'Fee Report', desc: 'Export fee collection data', icon: IndianRupee, color: 'green' },
                { type: 'students' as const, label: 'Student Report', desc: 'Export student list', icon: Users, color: 'blue' },
              ].map((r) => (
                <button key={r.type} onClick={() => setReportType(r.type)} className={`p-4 rounded-lg transition-colors text-left ${reportType === r.type ? 'bg-primary-50 border-2 border-primary-200' : 'bg-gray-50 hover:bg-gray-100'}`}>
                  <r.icon className={`h-8 w-8 text-${r.color}-600 mb-2`} />
                  <p className="font-medium">{r.label}</p>
                  <p className="text-sm text-gray-500">{r.desc}</p>
                </button>
              ))}
            </div>
          </CardBody></Card>
        </>
      )}
    </div>
  );
}
