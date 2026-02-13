/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  attendanceRate: number;
  totalBatches: number;
  activeBatches: number;
}

export interface BatchAttendanceInfo {
  id: string;
  name: string;
  subjects: string[];
  student_count: number;
  is_active: boolean;
  attendance_rate: number;
  today_present: number;
  today_absent: number;
  today_late: number;
  today_total: number;
}

export interface AttendanceAnalyticsData {
  dailyTrend: Array<{ date: string; present: number; absent: number; late: number; total: number; rate: number }>;
  batchComparison: Array<{ name: string; rate: number; present: number; total: number }>;
  weekdayDistribution: Array<{ day: string; avgRate: number }>;
  monthlyOverview: Array<{ month: string; rate: number; total: number }>;
}

export async function fetchAttendanceDashboard(
  instituteId: string,
  date: string
): Promise<{ stats: AttendanceStats; batches: BatchAttendanceInfo[] }> {
  const supabase = getSupabaseClient();

  // Fetch batches with student counts
  const { data: batchesData } = await supabase
    .from('batches')
    .select('id, name, subjects, is_active')
    .eq('institute_id', instituteId)
    .order('name');

  const batches = batchesData || [];

  // Get student counts per batch
  const batchStudentCounts = await Promise.all(
    batches.map(async (b: any) => {
      const { count } = await supabase
        .from('student_batches')
        .select('*', { count: 'exact', head: true })
        .eq('batch_id', b.id)
        .eq('is_active', true);
      return { batchId: b.id, count: count || 0 };
    })
  );

  // Fetch attendance for the selected date
  const { data: attendanceData } = await supabase
    .from('attendance')
    .select('student_id, batch_id, status')
    .eq('institute_id', instituteId)
    .eq('date', date);

  const attendance = attendanceData || [];

  // Build batch attendance info
  const batchAttendance: BatchAttendanceInfo[] = batches.map((b: any) => {
    const studentCount = batchStudentCounts.find((c) => c.batchId === b.id)?.count || 0;
    const batchRecords = attendance.filter((a: any) => a.batch_id === b.id);
    const present = batchRecords.filter((a: any) => a.status === 'present').length;
    const absent = batchRecords.filter((a: any) => a.status === 'absent').length;
    const late = batchRecords.filter((a: any) => a.status === 'late').length;
    const total = batchRecords.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    return {
      id: b.id,
      name: b.name,
      subjects: b.subjects || [],
      student_count: studentCount,
      is_active: b.is_active,
      attendance_rate: rate,
      today_present: present,
      today_absent: absent,
      today_late: late,
      today_total: total,
    };
  });

  const totalPresent = attendance.filter((a: any) => a.status === 'present').length;
  const totalAbsent = attendance.filter((a: any) => a.status === 'absent').length;
  const totalLate = attendance.filter((a: any) => a.status === 'late').length;
  const totalRecords = attendance.length;
  const rate = totalRecords > 0 ? Math.round(((totalPresent + totalLate) / totalRecords) * 100) : 0;

  return {
    stats: {
      totalStudents: batchStudentCounts.reduce((s, c) => s + c.count, 0),
      presentToday: totalPresent,
      absentToday: totalAbsent,
      lateToday: totalLate,
      attendanceRate: rate,
      totalBatches: batches.length,
      activeBatches: batches.filter((b: any) => b.is_active).length,
    },
    batches: batchAttendance,
  };
}

export async function fetchAttendanceAnalytics(
  instituteId: string,
  days: number = 30,
  batchId?: string
): Promise<AttendanceAnalyticsData> {
  const supabase = getSupabaseClient();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  let query = supabase
    .from('attendance')
    .select('date, status, batch_id, batches(name)')
    .eq('institute_id', instituteId)
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date');

  if (batchId) {
    query = query.eq('batch_id', batchId);
  }

  const { data } = await query;
  const records = data || [];

  // Daily trend
  const dailyMap = new Map<string, { present: number; absent: number; late: number; total: number }>();
  records.forEach((r: any) => {
    const existing = dailyMap.get(r.date) || { present: 0, absent: 0, late: 0, total: 0 };
    if (r.status === 'present') existing.present++;
    else if (r.status === 'absent') existing.absent++;
    else if (r.status === 'late') existing.late++;
    existing.total++;
    dailyMap.set(r.date, existing);
  });

  const dailyTrend = Array.from(dailyMap.entries())
    .map(([date, d]) => ({
      date,
      ...d,
      rate: d.total > 0 ? Math.round(((d.present + d.late) / d.total) * 100) : 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Batch comparison
  const batchMap = new Map<string, { name: string; present: number; total: number }>();
  records.forEach((r: any) => {
    const name = r.batches?.name || 'Unknown';
    const existing = batchMap.get(r.batch_id) || { name, present: 0, total: 0 };
    if (r.status === 'present' || r.status === 'late') existing.present++;
    existing.total++;
    batchMap.set(r.batch_id, existing);
  });

  const batchComparison = Array.from(batchMap.values()).map((b) => ({
    name: b.name,
    present: b.present,
    total: b.total,
    rate: b.total > 0 ? Math.round((b.present / b.total) * 100) : 0,
  }));

  // Weekday distribution
  const weekdayMap = new Map<number, { total: number; present: number; count: number }>();
  records.forEach((r: any) => {
    const dayOfWeek = new Date(r.date).getDay();
    const existing = weekdayMap.get(dayOfWeek) || { total: 0, present: 0, count: 0 };
    existing.total++;
    if (r.status === 'present' || r.status === 'late') existing.present++;
    weekdayMap.set(dayOfWeek, existing);
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayDistribution = dayNames.map((day, i) => {
    const d = weekdayMap.get(i);
    return { day, avgRate: d && d.total > 0 ? Math.round((d.present / d.total) * 100) : 0 };
  });

  // Monthly overview
  const monthMap = new Map<string, { total: number; present: number }>();
  records.forEach((r: any) => {
    const month = r.date.slice(0, 7);
    const existing = monthMap.get(month) || { total: 0, present: 0 };
    existing.total++;
    if (r.status === 'present' || r.status === 'late') existing.present++;
    monthMap.set(month, existing);
  });

  const monthlyOverview = Array.from(monthMap.entries())
    .map(([month, d]) => ({
      month,
      total: d.total,
      rate: d.total > 0 ? Math.round((d.present / d.total) * 100) : 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return { dailyTrend, batchComparison, weekdayDistribution, monthlyOverview };
}

export async function exportAttendanceCSV(
  instituteId: string,
  batchId: string,
  startDate: string,
  endDate: string
): Promise<string> {
  const supabase = getSupabaseClient();

  const { data } = await supabase
    .from('attendance')
    .select('date, status, remarks, students(first_name, last_name, student_id), batches(name)')
    .eq('institute_id', instituteId)
    .eq('batch_id', batchId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('student_id');

  const records = data || [];
  const rows = [['Date', 'Student ID', 'Student Name', 'Batch', 'Status', 'Remarks']];

  records.forEach((r: any) => {
    rows.push([
      r.date,
      r.students?.student_id || '',
      `${r.students?.first_name || ''} ${r.students?.last_name || ''}`,
      r.batches?.name || '',
      r.status,
      r.remarks || '',
    ]);
  });

  return rows.map((row) => row.join(',')).join('\n');
}
