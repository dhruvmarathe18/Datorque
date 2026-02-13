/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export async function fetchHomeworkDetails(homeworkId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('homework')
    .select('*, batches(name, subjects), students(first_name, last_name, student_id), homework_attachments(*), users:assigned_by(first_name, last_name)')
    .eq('id', homeworkId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchHomeworkSubmissions(homeworkId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('homework_submissions')
    .select('*, students(first_name, last_name, student_id)')
    .eq('homework_id', homeworkId)
    .order('submitted_at', { ascending: false });
  if (error) throw error;

  // Fetch attachments for each submission
  const submissionsWithAttachments = await Promise.all(
    (data || []).map(async (submission: any) => {
      const { data: attachments } = await supabase
        .from('homework_submission_attachments')
        .select('*')
        .eq('submission_id', submission.id);
      return { ...submission, submission_attachments: attachments || [] };
    })
  );

  return submissionsWithAttachments;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'checked' | 'returned',
  feedback: string,
  checkedBy: string
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('homework_submissions')
    .update({
      status,
      feedback,
      checked_at: new Date().toISOString(),
      checked_by: checkedBy,
    })
    .eq('id', submissionId);
  if (error) throw error;
}

export async function updateHomework(homeworkId: string, updates: any) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('homework')
    .update(updates)
    .eq('id', homeworkId);
  if (error) throw error;
}

export async function deleteHomework(homeworkId: string) {
  const supabase = getSupabaseClient();
  // Delete submissions attachments -> submissions -> attachments -> homework
  const { data: submissions } = await supabase
    .from('homework_submissions')
    .select('id')
    .eq('homework_id', homeworkId);
  
  if (submissions?.length) {
    const subIds = submissions.map((s: any) => s.id);
    await supabase.from('homework_submission_attachments').delete().in('submission_id', subIds);
    await supabase.from('homework_submissions').delete().eq('homework_id', homeworkId);
  }

  await supabase.from('homework_attachments').delete().eq('homework_id', homeworkId);
  const { error } = await supabase.from('homework').delete().eq('id', homeworkId);
  if (error) throw error;
}

export async function fetchBatchStudentsForHomework(batchId: string): Promise<any[]> {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('student_batches')
    .select('students(id, first_name, last_name, student_id)')
    .eq('batch_id', batchId)
    .eq('is_active', true);
  return (data || []).map((sb: any) => sb.students).filter(Boolean);
}
