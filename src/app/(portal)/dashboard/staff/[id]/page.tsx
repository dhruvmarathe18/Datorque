'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Modal, Input, Alert, Avatar } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, User, Phone, Mail, Briefcase, BookOpen, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Staff, Batch } from '@/types/portal';

interface StaffWithDetails extends Staff {
  batches?: Batch[];
}

export default function StaffDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [staff, setStaff] = useState<StaffWithDetails | null>(null);
  const [allBatches, setAllBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    designation: '',
    subjects: [] as string[],
    batch_ids: [] as string[],
  });
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    async function fetchStaff() {
      if (!params.id || !user?.institute_id) return;

      // Fetch staff user
      const { data: staffData } = await supabase
        .from('users')
        .select('*')
        .eq('id', params.id)
        .eq('institute_id', user.institute_id)
        .in('role', ['staff', 'teacher'])
        .single();

      if (!staffData) {
        router.push('/dashboard/staff');
        return;
      }

      // Fetch assigned batches
      const { data: batchStaff } = await supabase
        .from('batch_staff')
        .select('batch_id, batches(*)')
        .eq('staff_id', params.id);

      // Fetch all batches for edit
      const { data: allBatchesData } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);

      const enrichedStaff: StaffWithDetails = {
        ...staffData,
        batches: batchStaff?.map((bs: any) => bs.batches).filter(Boolean) as Batch[],
      };

      setStaff(enrichedStaff);
      setAllBatches(allBatchesData || []);
      setEditForm({
        first_name: staffData.first_name || '',
        last_name: staffData.last_name || '',
        phone: staffData.phone || '',
        designation: staffData.designation || '',
        subjects: staffData.subjects || [],
        batch_ids: batchStaff?.map((bs: any) => bs.batch_id) || [],
      });
      setLoading(false);
    }

    fetchStaff();
  }, [params.id, supabase, user, router]);

  const addSubject = () => {
    if (newSubject.trim() && !editForm.subjects.includes(newSubject.trim())) {
      setEditForm({ ...editForm, subjects: [...editForm.subjects, newSubject.trim()] });
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setEditForm({ ...editForm, subjects: editForm.subjects.filter((s) => s !== subject) });
  };

  const handleEdit = async () => {
    if (!staff) return;
    setSaving(true);
    setError('');

    try {
      // Update staff user
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          designation: editForm.designation,
          subjects: editForm.subjects,
          updated_at: new Date().toISOString(),
        })
        .eq('id', staff.id);

      if (updateError) throw updateError;

      // Update batch assignments
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('batch_staff') as any).delete().eq('staff_id', staff.id);
      if (editForm.batch_ids.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('batch_staff') as any).insert(
          editForm.batch_ids.map((batchId) => ({
            staff_id: staff.id,
            batch_id: batchId,
          }))
        );
      }

      setSuccess('Staff updated successfully!');
      setEditModalOpen(false);
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to update staff');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!staff) return;
    setSaving(true);
    setError('');

    try {
      // Delete batch assignments
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('batch_staff') as any).delete().eq('staff_id', staff.id);

      // Delete user
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: deleteError } = await (supabase.from('users') as any).delete().eq('id', staff.id);

      if (deleteError) throw deleteError;

      router.push('/dashboard/staff');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'Failed to delete staff');
      setSaving(false);
    }
  };

  const toggleStatus = async () => {
    if (!staff) return;
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_active: !staff.is_active })
        .eq('id', staff.id);

      if (updateError) throw updateError;

      setStaff({ ...staff, is_active: !staff.is_active });
      setSuccess(`Staff ${staff.is_active ? 'deactivated' : 'activated'} successfully!`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!staff) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/staff" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="page-title">{staff.first_name} {staff.last_name}</h1>
            <p className="page-subtitle">{staff.designation || staff.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={staff.is_active ? 'warning' : 'success'} 
            onClick={toggleStatus}
            loading={saving}
          >
            {staff.is_active ? 'Deactivate' : 'Activate'}
          </Button>
          <Button variant="secondary" onClick={() => setEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardBody className="text-center py-8">
            <Avatar name={`${staff.first_name} ${staff.last_name}`} size="xl" className="mx-auto mb-4" />
            <h2 className="text-xl font-semibold">{staff.first_name} {staff.last_name}</h2>
            <p className="text-gray-500">{staff.designation || staff.role}</p>
            <div className="mt-4">
              <Badge variant={staff.is_active ? 'success' : 'danger'} className="text-sm">
                {staff.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-sm text-gray-400 mt-4">Joined {formatDate(staff.created_at)}</p>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Contact Information</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{staff.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{staff.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Designation</p>
                <p className="font-medium">{staff.designation || '-'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Subjects */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Subjects</h2>
          </CardHeader>
          <CardBody>
            {staff.subjects && staff.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {staff.subjects.map((subject: string) => (
                  <Badge key={subject} variant="default" className="text-sm">
                    {subject}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No subjects assigned</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Assigned Batches */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Assigned Batches</h2>
        </CardHeader>
        <CardBody>
          {staff.batches && staff.batches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.batches.map((batch) => (
                <Link
                  key={batch.id}
                  href={`/dashboard/batches/${batch.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <BookOpen className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{batch.name}</p>
                      <p className="text-sm text-gray-500">{batch.subjects?.join(', ') || 'No subjects'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No batches assigned</p>
          )}
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff"
        size="lg"
      >
        <div className="space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={editForm.first_name}
              onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
            />
            <Input
              label="Last Name"
              value={editForm.last_name}
              onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            />
            <Input
              label="Designation"
              value={editForm.designation}
              onChange={(e) => setEditForm({ ...editForm, designation: e.target.value })}
            />
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subjects</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Add subject"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())}
              />
              <Button type="button" variant="secondary" onClick={addSubject}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editForm.subjects.map((subject) => (
                <span
                  key={subject}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {subject}
                  <button type="button" onClick={() => removeSubject(subject)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Batch Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Batches</label>
            <div className="flex flex-wrap gap-2">
              {allBatches.map((batch) => (
                <label
                  key={batch.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    editForm.batch_ids.includes(batch.id)
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={editForm.batch_ids.includes(batch.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditForm({ ...editForm, batch_ids: [...editForm.batch_ids, batch.id] });
                      } else {
                        setEditForm({ ...editForm, batch_ids: editForm.batch_ids.filter((id) => id !== batch.id) });
                      }
                    }}
                    className="hidden"
                  />
                  <span className="text-sm">{batch.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit} loading={saving}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Staff"
      >
        <div className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{staff.first_name} {staff.last_name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Staff</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
