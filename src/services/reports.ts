/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export async function fetchReportData(
  instituteId: string,
  reportType: 'attendance' | 'fees' | 'students' | 'tests' | 'batch',
  options: { batchId?: string; startDate?: string; endDate?: string } = {}
) {
  const supabase = getSupabaseClient();
  const { batchId, startDate, endDate } = options;

  switch (reportType) {
    case 'attendance': {
      let query = supabase
        .from('attendance')
        .select('date, status, students(first_name, last_name, student_id), batches(name)')
        .eq('institute_id', instituteId);
      if (batchId) query = query.eq('batch_id', batchId);
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      const { data } = await query.order('date', { ascending: false });
      return data || [];
    }
    case 'fees': {
      let query = supabase
        .from('fee_payments')
        .select('*, students(first_name, last_name, student_id), batches(name)')
        .eq('institute_id', instituteId);
      if (batchId) query = query.eq('batch_id', batchId);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);
      const { data } = await query.order('created_at', { ascending: false });
      return data || [];
    }
    case 'students': {
      const query = supabase
        .from('students')
        .select('*, student_batches(batch_id, batches(name))')
        .eq('institute_id', instituteId);
      const { data } = await query.order('first_name');
      return data || [];
    }
    case 'tests': {
      let query = supabase
        .from('test_results')
        .select('*, students(first_name, last_name, student_id), tests(name, subject, max_marks, test_date, batches(name))')
        .eq('institute_id', instituteId);
      if (startDate) query = query.gte('created_at', startDate);
      if (endDate) query = query.lte('created_at', endDate);
      const { data } = await query.order('created_at', { ascending: false });
      return data || [];
    }
    case 'batch': {
      const { data: batches } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', instituteId)
        .order('name');

      const batchData = await Promise.all(
        (batches || []).map(async (batch: any) => {
          const { count: studentCount } = await supabase
            .from('student_batches')
            .select('*', { count: 'exact', head: true })
            .eq('batch_id', batch.id)
            .eq('is_active', true);

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { data: attendance } = await supabase
            .from('attendance')
            .select('status')
            .eq('batch_id', batch.id)
            .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

          const present = attendance?.filter((a: any) => a.status === 'present' || a.status === 'late').length || 0;
          const total = attendance?.length || 0;

          return {
            ...batch,
            student_count: studentCount || 0,
            attendance_rate: total > 0 ? Math.round((present / total) * 100) : 0,
          };
        })
      );

      return batchData;
    }
    default:
      return [];
  }
}

export function generateCSV(data: any[], columns: { key: string; header: string; render?: (item: any) => string }[]): string {
  const headers = columns.map((c) => c.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      if (col.render) return `"${col.render(item)}"`;
      const val = item[col.key];
      return val != null ? `"${String(val).replace(/"/g, '""')}"` : '""';
    })
  );
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadHTML(html: string, filename: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function printHTML(html: string) {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}
