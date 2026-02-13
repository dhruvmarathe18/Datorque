/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export interface Test {
  id: string;
  name: string;
  subject: string;
  batch_id: string;
  batch_name?: string;
  test_date: string;
  duration: number;
  max_marks: number;
  instructions?: string;
  status: 'draft' | 'scheduled' | 'completed' | 'published';
  institute_id: string;
  created_by?: string;
  created_at: string;
  batches?: { name: string };
}

export interface TestResult {
  id: string;
  test_id: string;
  student_id: string;
  marks_obtained: number;
  attendance: 'present' | 'absent';
  remarks?: string;
  institute_id: string;
  created_at: string;
  students?: { first_name: string; last_name: string; student_id: string };
  tests?: { name: string; max_marks: number; subject: string; batch_id: string };
}

export interface TestAnalytics {
  overallStats: {
    totalTests: number;
    totalStudents: number;
    averageScore: number;
    passRate: number;
  };
  subjectPerformance: Array<{ subject: string; averageScore: number; totalTests: number }>;
  batchPerformance: Array<{ batchName: string; averageScore: number; totalStudents: number }>;
  scoreDistribution: Array<{ range: string; count: number; percentage: number }>;
}

export async function fetchTests(instituteId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tests')
    .select('*, batches(name)')
    .eq('institute_id', instituteId)
    .order('test_date', { ascending: false });
  if (error) throw error;
  return (data || []).map((t: any) => ({ ...t, batch_name: t.batches?.name }));
}

export async function fetchTestById(testId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tests')
    .select('*, batches(name)')
    .eq('id', testId)
    .single();
  if (error) throw error;
  return { ...data, batch_name: data.batches?.name };
}

export async function createTest(test: Partial<Test>) {
  const supabase = getSupabaseClient();
  const { data, error } = await (supabase.from('tests') as any).insert([test]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTest(testId: string, updates: Partial<Test>) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('tests')
    .update(updates)
    .eq('id', testId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTest(testId: string) {
  const supabase = getSupabaseClient();
  // Delete results first
  await supabase.from('test_results').delete().eq('test_id', testId);
  const { error } = await supabase.from('tests').delete().eq('id', testId);
  if (error) throw error;
}

export async function fetchTestResults(testId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('test_results')
    .select('*, students(first_name, last_name, student_id), tests(name, max_marks, subject, batch_id)')
    .eq('test_id', testId)
    .order('marks_obtained', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchBatchStudentsForTest(batchId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('student_batches')
    .select('student_id, students(id, first_name, last_name, student_id)')
    .eq('batch_id', batchId)
    .eq('is_active', true);
  if (error) throw error;
  return (data || []).map((sb: any) => sb.students).filter(Boolean);
}

export async function saveTestResults(
  testId: string,
  instituteId: string,
  results: Array<{ student_id: string; marks_obtained: number; attendance: string; remarks?: string }>
) {
  const supabase = getSupabaseClient();
  // Delete existing results for this test
  await supabase.from('test_results').delete().eq('test_id', testId);

  const records = results.map((r) => ({
    test_id: testId,
    student_id: r.student_id,
    marks_obtained: r.marks_obtained,
    attendance: r.attendance,
    remarks: r.remarks || null,
    institute_id: instituteId,
  }));

  const { error } = await (supabase.from('test_results') as any).insert(records);
  if (error) throw error;
}

export async function fetchTestAnalytics(instituteId: string): Promise<TestAnalytics> {
  const supabase = getSupabaseClient();

  // Get all tests
  const { data: tests } = await supabase
    .from('tests')
    .select('id, name, subject, batch_id, max_marks, batches(name)')
    .eq('institute_id', instituteId);

  // Get all results
  const { data: results } = await supabase
    .from('test_results')
    .select('*, tests(name, max_marks, subject, batch_id, batches(name))')
    .eq('institute_id', instituteId)
    .eq('attendance', 'present');

  const allTests = tests || [];
  const allResults = results || [];

  // Overall stats
  const totalTests = allTests.length;
  const uniqueStudents = new Set(allResults.map((r: any) => r.student_id));
  const totalStudents = uniqueStudents.size;

  const percentages = allResults.map((r: any) => {
    const maxMarks = r.tests?.max_marks || 100;
    return (r.marks_obtained / maxMarks) * 100;
  });

  const averageScore = percentages.length > 0
    ? Math.round(percentages.reduce((a: number, b: number) => a + b, 0) / percentages.length)
    : 0;

  const passRate = percentages.length > 0
    ? Math.round((percentages.filter((p: number) => p >= 35).length / percentages.length) * 100)
    : 0;

  // Subject performance
  const subjectMap = new Map<string, { total: number; count: number; tests: Set<string> }>();
  allResults.forEach((r: any) => {
    const subject = r.tests?.subject || 'Unknown';
    const pct = (r.marks_obtained / (r.tests?.max_marks || 100)) * 100;
    const existing = subjectMap.get(subject) || { total: 0, count: 0, tests: new Set() };
    existing.total += pct;
    existing.count++;
    existing.tests.add(r.test_id);
    subjectMap.set(subject, existing);
  });

  const subjectPerformance = Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    averageScore: Math.round(data.total / data.count),
    totalTests: data.tests.size,
  }));

  // Batch performance
  const batchMap = new Map<string, { total: number; count: number; students: Set<string>; name: string }>();
  allResults.forEach((r: any) => {
    const batchId = r.tests?.batch_id;
    const batchName = r.tests?.batches?.name || 'Unknown';
    if (!batchId) return;
    const pct = (r.marks_obtained / (r.tests?.max_marks || 100)) * 100;
    const existing = batchMap.get(batchId) || { total: 0, count: 0, students: new Set(), name: batchName };
    existing.total += pct;
    existing.count++;
    existing.students.add(r.student_id);
    batchMap.set(batchId, existing);
  });

  const batchPerformance = Array.from(batchMap.entries()).map(([, data]) => ({
    batchName: data.name,
    averageScore: Math.round(data.total / data.count),
    totalStudents: data.students.size,
  }));

  // Score distribution
  const ranges = [
    { range: '0-20%', min: 0, max: 20 },
    { range: '21-40%', min: 21, max: 40 },
    { range: '41-60%', min: 41, max: 60 },
    { range: '61-80%', min: 61, max: 80 },
    { range: '81-100%', min: 81, max: 100 },
  ];

  const scoreDistribution = ranges.map(({ range, min, max }) => {
    const count = percentages.filter((p: number) => p >= min && p <= max).length;
    return {
      range,
      count,
      percentage: percentages.length > 0 ? Math.round((count / percentages.length) * 100) : 0,
    };
  });

  return {
    overallStats: { totalTests, totalStudents, averageScore, passRate },
    subjectPerformance,
    batchPerformance,
    scoreDistribution,
  };
}
