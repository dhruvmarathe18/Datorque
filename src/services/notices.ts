/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export async function fetchNoticeDetails(noticeId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notices')
    .select('*, batches(name), users:created_by(first_name, last_name), notice_attachments(*)')
    .eq('id', noticeId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchNoticeViews(noticeId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('notice_views')
    .select('*, students(first_name, last_name, student_id)')
    .eq('notice_id', noticeId)
    .order('viewed_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchNoticeAnalytics(noticeId: string, batchId?: string, instituteId?: string) {
  const views = await fetchNoticeViews(noticeId);
  const totalViews = views.length;
  const uniqueViewers = new Set(views.map((v: any) => v.student_id));

  // Get total target audience
  let targetCount = 0;
  if (batchId && instituteId) {
    const supabase = getSupabaseClient();
    const { count } = await supabase
      .from('student_batches')
      .select('*', { count: 'exact', head: true })
      .eq('batch_id', batchId)
      .eq('is_active', true);
    targetCount = count || 0;
  } else if (instituteId) {
    const supabase = getSupabaseClient();
    const { count } = await supabase
      .from('students')
      .select('*', { count: 'exact', head: true })
      .eq('institute_id', instituteId)
      .eq('is_active', true);
    targetCount = count || 0;
  }

  const viewRate = targetCount > 0 ? Math.round((uniqueViewers.size / targetCount) * 100) : 0;

  // Views over time
  const viewsByDay = new Map<string, number>();
  views.forEach((v: any) => {
    const day = v.viewed_at?.split('T')[0] || 'unknown';
    viewsByDay.set(day, (viewsByDay.get(day) || 0) + 1);
  });

  const viewsTrend = Array.from(viewsByDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalViews,
    uniqueViewers: uniqueViewers.size,
    targetCount,
    viewRate,
    viewsTrend,
    viewers: views,
  };
}

export async function updateNotice(noticeId: string, updates: any) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from('notices').update(updates).eq('id', noticeId);
  if (error) throw error;
}

export async function deleteNotice(noticeId: string) {
  const supabase = getSupabaseClient();
  await supabase.from('notice_views').delete().eq('notice_id', noticeId);
  await supabase.from('notice_attachments').delete().eq('notice_id', noticeId);
  const { error } = await supabase.from('notices').delete().eq('id', noticeId);
  if (error) throw error;
}
