'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Alert, Modal } from '@/components/portal/ui';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { ArrowLeft, Bell, Pin, Trash2, Edit, Eye, Users, Clock, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { fetchNoticeDetails, fetchNoticeViews, fetchNoticeAnalytics, deleteNotice } from '@/services/notices';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [notice, setNotice] = useState<any>(null);
  const [views, setViews] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'views' | 'analytics'>('details');
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotice();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'views' && notice) loadViews();
    if (activeTab === 'analytics' && notice) loadAnalytics();
  }, [activeTab, notice]);

  const loadNotice = async () => {
    try {
      const data = await fetchNoticeDetails(id as string);
      setNotice(data);
    } catch (err) { setError('Failed to load notice'); }
    finally { setLoading(false); }
  };

  const loadViews = async () => {
    try {
      const data = await fetchNoticeViews(id as string);
      setViews(data || []);
    } catch (err) { console.error(err); }
  };

  const loadAnalytics = async () => {
    if (!notice?.institute_id) return;
    try {
      const data = await fetchNoticeAnalytics(id as string, notice.institute_id);
      setAnalytics(data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteNotice(id as string);
      router.push('/dashboard/notices');
    } catch (err: any) { setError(err.message || 'Failed to delete'); setDeleting(false); }
  };

  if (loading) return <PageLoader />;
  if (!notice) return <div className="text-center py-12"><p className="text-gray-500">Notice not found</p><Link href="/dashboard/notices" className="text-primary-600 mt-2 inline-block">Back to Notices</Link></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/notices"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
        <div className="flex-1"><h1 className="page-title">{notice.title}</h1>
          <p className="page-subtitle">Posted {formatRelativeTime(notice.created_at)}</p></div>
        <div className="flex items-center gap-2">
          <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex gap-2 border-b border-gray-200">
        {([
          { key: 'details', label: 'Details', icon: Bell },
          { key: 'views', label: 'Views', icon: Eye },
          { key: 'analytics', label: 'Analytics', icon: BarChart3 },
        ] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card><CardHeader><h2 className="text-lg font-semibold">Content</h2></CardHeader>
              <CardBody><div className="prose prose-sm max-w-none whitespace-pre-wrap">{notice.content}</div></CardBody></Card>
            {notice.notice_attachments?.length > 0 && (
              <Card><CardHeader><h2 className="text-lg font-semibold">Attachments</h2></CardHeader>
                <CardBody><div className="space-y-2">{notice.notice_attachments.map((att: any) => (
                  <a key={att.id} href={att.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="text-sm"><p className="font-medium text-primary-600">{att.file_name}</p><p className="text-gray-500">{att.file_type}</p></div>
                  </a>
                ))}</div></CardBody></Card>
            )}
          </div>
          <div className="space-y-6">
            <Card><CardHeader><h2 className="text-lg font-semibold">Info</h2></CardHeader>
              <CardBody><div className="space-y-4">
                <div className="flex justify-between"><span className="text-gray-500">Priority</span>
                  <Badge variant={notice.priority === 'urgent' ? 'danger' : notice.priority === 'important' ? 'warning' : 'default'}>{notice.priority || 'normal'}</Badge></div>
                <div className="flex justify-between"><span className="text-gray-500">Target</span>
                  <span className="font-medium">{notice.batches?.name || 'All Students'}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Posted By</span>
                  <span className="font-medium">{notice.users?.first_name} {notice.users?.last_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(notice.created_at)}</span></div>
                {notice.is_pinned && <div className="flex items-center gap-2 text-primary-600"><Pin className="h-4 w-4" /> Pinned</div>}
              </div></CardBody></Card>
          </div>
        </div>
      )}

      {activeTab === 'views' && (
        <Card>
          <CardHeader><h2 className="text-lg font-semibold">View History ({views.length} views)</h2></CardHeader>
          <CardBody className="p-0">
            {views.length === 0 ? <p className="text-center text-gray-500 py-8">No views yet</p> :
              <div className="divide-y divide-gray-100">{views.map((view: any) => (
                <div key={view.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-sm">{(view.users?.first_name || '?')[0]}{(view.users?.last_name || '?')[0]}</span>
                    </div>
                    <div><p className="font-medium">{view.users?.first_name} {view.users?.last_name}</p><p className="text-sm text-gray-500">{view.users?.role}</p></div>
                  </div>
                  <span className="text-sm text-gray-500">{formatRelativeTime(view.viewed_at || view.created_at)}</span>
                </div>
              ))}</div>}
          </CardBody>
        </Card>
      )}

      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6"><div className="text-center">
              <p className="text-3xl font-bold text-primary-600">{analytics.totalViews}</p><p className="text-sm text-gray-500">Total Views</p></div></Card>
            <Card className="p-6"><div className="text-center">
              <p className="text-3xl font-bold text-green-600">{analytics.uniqueViewers}</p><p className="text-sm text-gray-500">Unique Viewers</p></div></Card>
            <Card className="p-6"><div className="text-center">
              <p className="text-3xl font-bold">{analytics.viewRate}%</p><p className="text-sm text-gray-500">View Rate</p></div></Card>
          </div>
          {analytics.viewsTrend?.length > 0 && (
            <Card><CardHeader><h2 className="text-lg font-semibold">Views Over Time</h2></CardHeader><CardBody>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.viewsTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} /><Tooltip /><Bar dataKey="views" fill="#4F46E5" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            </CardBody></Card>
          )}
        </div>
      )}

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Notice">
        <p className="text-gray-600 mb-4">Are you sure you want to delete &quot;{notice.title}&quot;? This action cannot be undone.</p>
        <div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button></div>
      </Modal>
    </div>
  );
}
