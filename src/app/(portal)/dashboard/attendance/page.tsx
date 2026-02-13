'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, Button, Badge, Select, PageLoader, Alert } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { ClipboardList, Calendar, Check, X, Clock, Users, Download, TrendingUp, BarChart3, Search } from 'lucide-react';
import { fetchAttendanceDashboard, fetchAttendanceAnalytics, exportAttendanceCSV, AttendanceStats, BatchAttendanceInfo, AttendanceAnalyticsData } from '@/services/attendance';
import { downloadCSV } from '@/services/reports';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Batch, Student } from '@/types/portal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface StudentWithAttendance extends Student {
  attendance_status?: 'present' | 'absent' | 'late' | null;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [activeView, setActiveView] = useState<'dashboard' | 'mark' | 'analytics'>('dashboard');
  const [dashStats, setDashStats] = useState<AttendanceStats | null>(null);
  const [dashBatches, setDashBatches] = useState<BatchAttendanceInfo[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [markDate, setMarkDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [analytics, setAnalytics] = useState<AttendanceAnalyticsData | null>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30');
  const [analyticsBatch, setAnalyticsBatch] = useState('all');

  useEffect(() => {
    if (activeView === 'dashboard' && user?.institute_id) loadDashboard();
  }, [user?.institute_id, selectedDate, activeView]);

  useEffect(() => {
    if (activeView === 'mark' && user?.institute_id) loadBatches();
  }, [user?.institute_id, activeView]);

  useEffect(() => {
    if (activeView === 'mark' && selectedBatch && user?.institute_id) loadStudents();
  }, [selectedBatch, markDate, activeView]);

  useEffect(() => {
    if (activeView === 'analytics' && user?.institute_id) loadAnalytics();
  }, [user?.institute_id, activeView, analyticsPeriod, analyticsBatch]);

  const loadDashboard = async () => {
    if (!user?.institute_id) return;
    setLoading(true);
    try {
      const data = await fetchAttendanceDashboard(user.institute_id, selectedDate);
      setDashStats(data.stats);
      setDashBatches(data.batches);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadBatches = async () => {
    if (!user?.institute_id) return;
    let query = supabase.from('batches').select('*').eq('institute_id', user.institute_id).eq('is_active', true).order('name');
    if (user.role === 'staff' || user.role === 'teacher') {
      const { data: assignments } = await supabase.from('batch_staff').select('batch_id').eq('staff_id', user.id);
      if (assignments?.length) query = query.in('id', assignments.map((a: any) => a.batch_id));
    }
    const { data } = await query;
    setBatches(data || []);
    if (data?.length && !selectedBatch) setSelectedBatch(data[0].id);
    setLoading(false);
  };

  const loadStudents = async () => {
    if (!selectedBatch || !user?.institute_id) return;
    setLoading(true);
    const { data: sb } = await supabase.from('student_batches').select('student_id, students(*)').eq('batch_id', selectedBatch);
    const studentsData = sb?.map((s: any) => s.students).filter(Boolean) || [];
    const { data: att } = await supabase.from('attendance').select('*').eq('batch_id', selectedBatch).eq('date', markDate).eq('institute_id', user.institute_id);
    setStudents(studentsData.map((s: any) => ({ ...s, attendance_status: att?.find((a: any) => a.student_id === s.id)?.status || null })));
    setLoading(false);
  };

  const loadAnalytics = async () => {
    if (!user?.institute_id) return;
    setLoading(true);
    try {
      const data = await fetchAttendanceAnalytics(user.institute_id, Number(analyticsPeriod), analyticsBatch !== 'all' ? analyticsBatch : undefined);
      setAnalytics(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, attendance_status: status } : s)));
  };

  const markAllAs = (status: 'present' | 'absent' | 'late') => {
    setStudents((prev) => prev.map((s) => ({ ...s, attendance_status: status })));
  };

  const saveAttendance = async () => {
    if (!user?.institute_id) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      await supabase.from('attendance').delete().eq('batch_id', selectedBatch).eq('date', markDate).eq('institute_id', user.institute_id);
      const records = students.filter((s) => s.attendance_status).map((s) => ({
        student_id: s.id, batch_id: selectedBatch, date: markDate, status: s.attendance_status, institute_id: user.institute_id, remarks: null,
      }));
      if (records.length) {
        const { error: e } = await (supabase.from('attendance') as any).insert(records);
        if (e) throw e;
      }
      setSuccess('Attendance saved successfully!');
    } catch (err: any) { setError(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleExportCSV = async () => {
    if (!user?.institute_id || !selectedBatch) return;
    const d = new Date(); d.setDate(d.getDate() - 30);
    const csv = await exportAttendanceCSV(user.institute_id, selectedBatch, d.toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
    downloadCSV(csv, 'attendance-export.csv');
  };

  const presentCount = students.filter((s) => s.attendance_status === 'present').length;
  const absentCount = students.filter((s) => s.attendance_status === 'absent').length;
  const lateCount = students.filter((s) => s.attendance_status === 'late').length;
  const markedCount = students.filter((s) => s.attendance_status).length;
  const filteredBatches = dashBatches.filter((b) => !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="page-title">Attendance</h1><p className="page-subtitle">Track and manage student attendance</p></div>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}><Download className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {([
          { key: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { key: 'mark', label: 'Mark Attendance', icon: ClipboardList },
          { key: 'analytics', label: 'Analytics', icon: TrendingUp },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveView(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeView === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* DASHBOARD */}
      {activeView === 'dashboard' && (
        <>
          <Card><CardBody><div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input type="date" className="input max-w-xs" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={new Date().toISOString().split('T')[0]} />
          </div></CardBody></Card>

          {loading ? <PageLoader /> : dashStats && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', val: dashStats.totalStudents, icon: Users, color: 'blue' },
                  { label: 'Present', val: dashStats.presentToday, icon: Check, color: 'green' },
                  { label: 'Absent', val: dashStats.absentToday, icon: X, color: 'red' },
                  { label: 'Late', val: dashStats.lateToday, icon: Clock, color: 'yellow' },
                ].map((s) => (
                  <Card key={s.label} className="p-4"><div className="flex items-center gap-3">
                    <div className={`p-2 bg-${s.color}-100 rounded-lg`}><s.icon className={`h-5 w-5 text-${s.color}-600`} /></div>
                    <div><p className={`text-2xl font-bold ${s.color !== 'blue' ? `text-${s.color}-600` : ''}`}>{s.val}</p><p className="text-xs text-gray-500">{s.label}</p></div>
                  </div></Card>
                ))}
              </div>

              <Card><CardBody><div className="flex items-center justify-center gap-8">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90"><circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                    <circle cx="64" cy="64" r="56" stroke="#22c55e" strokeWidth="10" fill="none" strokeLinecap="round" strokeDasharray={`${(dashStats.attendanceRate / 100) * 352} 352`} /></svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold">{dashStats.attendanceRate}%</span><span className="text-xs text-gray-500">Rate</span></div>
                </div>
                <div className="text-sm space-y-2"><p><span className="font-semibold">{dashStats.activeBatches}</span> active batches</p>
                  <p><span className="font-semibold">{dashStats.presentToday + dashStats.lateToday}</span> present today</p></div>
              </div></CardBody></Card>

              <Card>
                <CardHeader className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Batch-wise Attendance</h2>
                  <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10 w-48" /></div>
                </CardHeader>
                <CardBody className="p-0"><div className="divide-y divide-gray-100">
                  {filteredBatches.map((batch) => (
                    <div key={batch.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div><p className="font-medium text-gray-900">{batch.name}</p><p className="text-sm text-gray-500">{batch.student_count} students</p></div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-600 font-medium">{batch.today_present}P</span>
                            <span className="text-red-600 font-medium">{batch.today_absent}A</span>
                            <span className="text-yellow-600 font-medium">{batch.today_late}L</span>
                          </div>
                          <Badge variant={batch.attendance_rate >= 75 ? 'success' : batch.attendance_rate >= 50 ? 'warning' : 'danger'}>{batch.attendance_rate}%</Badge>
                        </div>
                      </div>
                      {batch.today_total > 0 && <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${batch.attendance_rate}%` }} /></div>}
                    </div>
                  ))}
                  {filteredBatches.length === 0 && <p className="text-center text-gray-500 py-8">No batches found</p>}
                </div></CardBody>
              </Card>
            </>
          )}
        </>
      )}

      {/* MARK ATTENDANCE */}
      {activeView === 'mark' && (
        <>
          <Card><CardBody><div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1"><Select label="Select Batch" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} options={batches.map((b) => ({ value: b.id, label: b.name }))} /></div>
            <div className="flex-1"><label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" value={markDate} onChange={(e) => setMarkDate(e.target.value)} className="input" max={new Date().toISOString().split('T')[0]} /></div>
          </div></CardBody></Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[{ l: 'Total', v: students.length, c: 'gray' }, { l: 'Present', v: presentCount, c: 'green' }, { l: 'Absent', v: absentCount, c: 'red' }, { l: 'Late', v: lateCount, c: 'yellow' }].map((s) => (
              <Card key={s.l} className="p-4"><div className="text-center"><p className={`text-2xl font-bold ${s.c !== 'gray' ? `text-${s.c}-600` : ''}`}>{s.v}</p><p className="text-xs text-gray-500">{s.l}</p></div></Card>
            ))}
          </div>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Students</h2>
              <div className="flex gap-2"><Button size="sm" variant="success" onClick={() => markAllAs('present')}>All Present</Button><Button size="sm" variant="danger" onClick={() => markAllAs('absent')}>All Absent</Button></div>
            </CardHeader>
            <CardBody className="p-0">
              {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> :
               students.length === 0 ? <div className="p-8 text-center text-gray-500">No students</div> :
              <div className="divide-y divide-gray-100">{students.map((student) => (
                <div key={student.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"><span className="text-primary-700 font-semibold text-sm">{student.first_name.charAt(0)}{student.last_name.charAt(0)}</span></div>
                    <div><p className="font-medium text-gray-900">{student.first_name} {student.last_name}</p><p className="text-sm text-gray-500">ID: {student.student_id}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(['present', 'absent', 'late'] as const).map((st) => (
                      <button key={st} onClick={() => updateStudentStatus(student.id, st)}
                        className={`p-2 rounded-lg transition-colors ${student.attendance_status === st ? (st === 'present' ? 'bg-green-500 text-white' : st === 'absent' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white') : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {st === 'present' ? <Check className="h-5 w-5" /> : st === 'absent' ? <X className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                      </button>))}
                  </div>
                </div>
              ))}</div>}
            </CardBody>
          </Card>
          {students.length > 0 && <div className="flex justify-end"><Button onClick={saveAttendance} loading={saving} disabled={markedCount === 0}>Save Attendance ({markedCount}/{students.length})</Button></div>}
        </>
      )}

      {/* ANALYTICS */}
      {activeView === 'analytics' && (
        <>
          <Card><CardBody><div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1"><Select label="Period" value={analyticsPeriod} onChange={(e) => setAnalyticsPeriod(e.target.value)} options={[{ value: '7', label: 'Last 7 Days' }, { value: '30', label: 'Last 30 Days' }, { value: '90', label: 'Last 3 Months' }]} /></div>
            <div className="flex-1"><Select label="Batch" value={analyticsBatch} onChange={(e) => setAnalyticsBatch(e.target.value)} options={[{ value: 'all', label: 'All Batches' }, ...dashBatches.map((b) => ({ value: b.id, label: b.name }))]} /></div>
          </div></CardBody></Card>

          {loading ? <PageLoader /> : analytics && (
            <div className="space-y-6">
              <Card><CardHeader><h2 className="text-lg font-semibold">Daily Trend</h2></CardHeader><CardBody>
                {analytics.dailyTrend.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.dailyTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} fontSize={12} />
                      <YAxis domain={[0, 100]} unit="%" fontSize={12} /><Tooltip formatter={(v: number) => [`${v}%`, 'Rate']} labelFormatter={(l) => formatDate(l)} />
                      <Line type="monotone" dataKey="rate" stroke="#4F46E5" strokeWidth={2} dot={false} /></LineChart>
                  </ResponsiveContainer>
                ) : <p className="text-center text-gray-500 py-8">No data</p>}
              </CardBody></Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><CardHeader><h2 className="text-lg font-semibold">Batch Comparison</h2></CardHeader><CardBody>
                  {analytics.batchComparison.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics.batchComparison}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" fontSize={12} />
                        <YAxis domain={[0, 100]} unit="%" fontSize={12} /><Tooltip formatter={(v: number) => [`${v}%`, 'Rate']} />
                        <Bar dataKey="rate" fill="#4F46E5" radius={[4, 4, 0, 0]} /></BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-center text-gray-500 py-8">No data</p>}
                </CardBody></Card>

                <Card><CardHeader><h2 className="text-lg font-semibold">Weekday Distribution</h2></CardHeader><CardBody>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.weekdayDistribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" fontSize={12} />
                      <YAxis domain={[0, 100]} unit="%" fontSize={12} /><Tooltip formatter={(v: number) => [`${v}%`, 'Avg Rate']} />
                      <Bar dataKey="avgRate" fill="#22c55e" radius={[4, 4, 0, 0]} /></BarChart>
                  </ResponsiveContainer>
                </CardBody></Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
