/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export interface HealthScoreData {
  overallScore: number;
  attendance: { score: number; rate: number; trend: string };
  fees: { score: number; collectionRate: number; pendingAmount: number };
  tests: { score: number; averageScore: number; participationRate: number };
  homework: { score: number; submissionRate: number; onTimeRate: number };
  batchUtilization: { score: number; activeRate: number; avgStudentsPerBatch: number };
  staffEngagement: { score: number; activeStaff: number; totalStaff: number };
}

export async function calculateHealthScore(instituteId: string): Promise<HealthScoreData> {
  const supabase = getSupabaseClient();
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const dateStr = thirtyDaysAgo.toISOString().split('T')[0];

  // Fetch all data in parallel
  const [
    { data: attendance },
    { data: feesPaid },
    { data: feesAll },
    { data: testResults },
    { data: tests },
    { data: submissions },
    { data: homeworks },
    { data: batches },
    { data: students },
    { count: staffCount },
    { count: activeStaffCount },
  ] = await Promise.all([
    supabase.from('attendance').select('status').eq('institute_id', instituteId).gte('date', dateStr),
    supabase.from('fee_payments').select('amount').eq('institute_id', instituteId).eq('status', 'paid').gte('paid_date', dateStr),
    supabase.from('fee_payments').select('amount, status').eq('institute_id', instituteId),
    supabase.from('test_results').select('marks_obtained, attendance, tests(max_marks)').eq('institute_id', instituteId).gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('tests').select('id').eq('institute_id', instituteId).gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('homework_submissions').select('status, submitted_at, homework:homework_id(due_date)').eq('institute_id', instituteId).gte('submitted_at', thirtyDaysAgo.toISOString()),
    supabase.from('homework').select('id').eq('institute_id', instituteId).gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('batches').select('id, is_active, student_count').eq('institute_id', instituteId),
    supabase.from('students').select('id').eq('institute_id', instituteId).eq('is_active', true),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('institute_id', instituteId).in('role', ['staff', 'teacher']),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('institute_id', instituteId).in('role', ['staff', 'teacher']).eq('is_active', true),
  ]);

  // Attendance score (weight: 30%)
  const totalAttendance = attendance?.length || 0;
  const presentCount = attendance?.filter((a: any) => a.status === 'present' || a.status === 'late').length || 0;
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;
  const attendanceScore = Math.min(100, attendanceRate * 1.1); // Boost slightly

  // Fees score (weight: 25%)
  const totalPaid = feesPaid?.reduce((s: number, f: any) => s + (f.amount || 0), 0) || 0;
  const totalPending = feesAll?.filter((f: any) => f.status === 'pending' || f.status === 'overdue').reduce((s: number, f: any) => s + (f.amount || 0), 0) || 0;
  const totalFees = totalPaid + totalPending;
  const feeCollectionRate = totalFees > 0 ? (totalPaid / totalFees) * 100 : 100;
  const feesScore = Math.min(100, feeCollectionRate);

  // Tests score (weight: 15%)
  const testPresent = testResults?.filter((r: any) => r.attendance === 'present') || [];
  const testParticipation = testResults?.length || 0;
  const testTotal = (tests?.length || 0) * (students?.length || 1);
  const testParticipationRate = testTotal > 0 ? (testParticipation / testTotal) * 100 : 0;
  const avgTestScore = testPresent.length > 0
    ? testPresent.reduce((s: number, r: any) => s + ((r.marks_obtained / (r.tests?.max_marks || 100)) * 100), 0) / testPresent.length
    : 0;
  const testsScore = Math.min(100, (avgTestScore * 0.6 + testParticipationRate * 0.4));

  // Homework score (weight: 15%)
  const totalHomeworks = homeworks?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  const expectedSubmissions = totalHomeworks * (students?.length || 1);
  const submissionRate = expectedSubmissions > 0 ? (totalSubmissions / expectedSubmissions) * 100 : 0;
  const onTimeSubmissions = submissions?.filter((s: any) => {
    if (!s.homework?.due_date || !s.submitted_at) return false;
    return new Date(s.submitted_at) <= new Date(s.homework.due_date);
  }).length || 0;
  const onTimeRate = totalSubmissions > 0 ? (onTimeSubmissions / totalSubmissions) * 100 : 0;
  const homeworkScore = Math.min(100, (submissionRate * 0.6 + onTimeRate * 0.4));

  // Batch utilization (weight: 10%)
  const totalBatches = batches?.length || 0;
  const activeBatches = batches?.filter((b: any) => b.is_active).length || 0;
  const batchActiveRate = totalBatches > 0 ? (activeBatches / totalBatches) * 100 : 0;
  const avgStudentsPerBatch = activeBatches > 0
    ? (students?.length || 0) / activeBatches
    : 0;
  const batchScore = Math.min(100, batchActiveRate * 0.6 + Math.min(100, avgStudentsPerBatch * 5) * 0.4);

  // Staff engagement (weight: 5%)
  const totalStaff = staffCount || 0;
  const activeStaff = activeStaffCount || 0;
  const staffRate = totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;
  const staffScore = Math.min(100, staffRate);

  // Overall weighted score
  const overallScore = Math.round(
    attendanceScore * 0.30 +
    feesScore * 0.25 +
    testsScore * 0.15 +
    homeworkScore * 0.15 +
    batchScore * 0.10 +
    staffScore * 0.05
  );

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    attendance: { score: Math.round(attendanceScore), rate: Math.round(attendanceRate), trend: attendanceRate >= 75 ? 'up' : 'down' },
    fees: { score: Math.round(feesScore), collectionRate: Math.round(feeCollectionRate), pendingAmount: totalPending },
    tests: { score: Math.round(testsScore), averageScore: Math.round(avgTestScore), participationRate: Math.round(testParticipationRate) },
    homework: { score: Math.round(homeworkScore), submissionRate: Math.round(submissionRate), onTimeRate: Math.round(onTimeRate) },
    batchUtilization: { score: Math.round(batchScore), activeRate: Math.round(batchActiveRate), avgStudentsPerBatch: Math.round(avgStudentsPerBatch) },
    staffEngagement: { score: Math.round(staffScore), activeStaff, totalStaff },
  };
}
