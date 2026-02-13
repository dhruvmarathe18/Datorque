'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Alert, Modal, Input, Textarea, Select } from '@/components/portal/ui';
import { formatDate, formatFileSize, formatRelativeTime } from '@/lib/utils';
import { ArrowLeft, FileText, Download, Trash2, Edit, File, Image, Video, Music, Eye } from 'lucide-react';
import Link from 'next/link';

const fileTypeIcon = (type: string) => {
  if (type?.startsWith('image')) return <Image className="h-5 w-5 text-blue-500" />;
  if (type?.startsWith('video')) return <Video className="h-5 w-5 text-purple-500" />;
  if (type?.startsWith('audio')) return <Music className="h-5 w-5 text-green-500" />;
  if (type?.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />;
  return <File className="h-5 w-5 text-gray-500" />;
};

export default function StudyMaterialDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [material, setMaterial] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '', subject: '' });

  useEffect(() => {
    loadMaterial();
  }, [id]);

  const loadMaterial = async () => {
    try {
      const { data, error: e } = await supabase
        .from('study_materials')
        .select('*, batches(name), users(first_name, last_name), study_material_attachments(*)')
        .eq('id', id)
        .single();
      if (e) throw e;
      setMaterial(data);
      setEditForm({ title: data.title, description: data.description || '', subject: data.subject || '' });
    } catch (err) { setError('Failed to load study material'); }
    finally { setLoading(false); }
  };

  const handleUpdate = async () => {
    setSaving(true); setError('');
    try {
      const { error: e } = await supabase.from('study_materials').update({
        title: editForm.title, description: editForm.description, subject: editForm.subject || null,
      }).eq('id', id);
      if (e) throw e;
      setMaterial((prev: any) => ({ ...prev, ...editForm }));
      setEditModalOpen(false);
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const { error: e } = await supabase.from('study_materials').delete().eq('id', id);
      if (e) throw e;
      router.push('/dashboard/study-materials');
    } catch (err: any) { setError(err.message); setDeleting(false); }
  };

  if (loading) return <PageLoader />;
  if (!material) return <div className="text-center py-12"><p className="text-gray-500">Study material not found</p><Link href="/dashboard/study-materials" className="text-primary-600">Back</Link></div>;

  const attachments = material.study_material_attachments || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/study-materials"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
        <div className="flex-1"><h1 className="page-title">{material.title}</h1>
          <p className="page-subtitle">Uploaded {formatRelativeTime(material.created_at)}</p></div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setEditModalOpen(true)}><Edit className="h-4 w-4 mr-1" /> Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card><CardHeader><h2 className="text-lg font-semibold">Description</h2></CardHeader>
            <CardBody><p className="text-gray-700 whitespace-pre-wrap">{material.description || 'No description provided'}</p></CardBody></Card>

          <Card><CardHeader><h2 className="text-lg font-semibold">Attachments ({attachments.length})</h2></CardHeader>
            <CardBody className="p-0">
              {attachments.length === 0 ? <p className="text-center text-gray-500 py-8">No attachments</p> :
                <div className="divide-y divide-gray-100">{attachments.map((att: any) => (
                  <div key={att.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {fileTypeIcon(att.file_type)}
                      <div><p className="font-medium text-gray-900">{att.file_name}</p>
                        <p className="text-sm text-gray-500">{att.file_type} {att.file_size ? `• ${formatFileSize(att.file_size)}` : ''}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={att.file_url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-1" /> View</Button></a>
                      <a href={att.file_url} download><Button variant="ghost" size="sm"><Download className="h-4 w-4 mr-1" /> Download</Button></a>
                    </div>
                  </div>
                ))}</div>}
            </CardBody></Card>
        </div>

        <div className="space-y-6">
          <Card><CardHeader><h2 className="text-lg font-semibold">Info</h2></CardHeader>
            <CardBody><div className="space-y-4">
              {material.subject && <div className="flex justify-between"><span className="text-gray-500">Subject</span><Badge>{material.subject}</Badge></div>}
              <div className="flex justify-between"><span className="text-gray-500">Batch</span><span className="font-medium">{material.batches?.name || 'All'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Uploaded By</span><span className="font-medium">{material.users?.first_name} {material.users?.last_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{formatDate(material.created_at)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Files</span><span className="font-medium">{attachments.length}</span></div>
            </div></CardBody></Card>
        </div>
      </div>

      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Study Material">
        <div className="space-y-4">
          <Input label="Title" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
          <Input label="Subject" value={editForm.subject} onChange={(e) => setEditForm((p) => ({ ...p, subject: e.target.value }))} />
          <Textarea label="Description" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={4} />
          <div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button><Button onClick={handleUpdate} loading={saving}>Save</Button></div>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Study Material">
        <p className="text-gray-600 mb-4">Are you sure you want to delete &quot;{material.title}&quot;?</p>
        <div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={handleDelete} loading={deleting}>Delete</Button></div>
      </Modal>
    </div>
  );
}
