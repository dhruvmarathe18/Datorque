'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Modal, Input, Textarea, Alert, Avatar, DataTable } from '@/components/ui';
import { formatDate, formatTime } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, Users, Clock, Calendar, BookOpen, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Batch, Student, Staff } from '@/types';

interface BatchWithDetails extends Batch {
  students?: Student[];
  staff?: Staff[];
}

export default function BatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [batch, setBatch] = useState<BatchWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    subjects: [] as string[],
    start_time: '',
    end_time: '',
    days: [] as string[],
  });
  const [newSubject, setNewSubject] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    async function fetchBatch() {
      if (!params.id || !user?.institute_id) return;

      // Fetch batch
      const { data: batchData } = await supabase
        .from('batches')
        .select('*')
        .eq('id', params.id)
        .eq('institute_id', user.institute_id)
        .single();

      if (!batchData) {
        router.push('/dashboard/batches');
        return;
      }

      // Fetch students in batch
      const { data: studentBatches } = await supabase
        .from('student_batches')
        .select('students(*)')
        .eq('batch_id', params.id);

      // Fetch staff assigned to batch
      const { data: batchStaff } = await supabase
        .from('batch_staff')
        .select('staff_id')
        .eq('batch_id', params.id);

      let staffData: Staff[] = [];
      if (batchStaff && batchStaff.length > 0) {
        const { data: staffUsers } = await supabase
          .from('users')
          .select('*')
          .in('id', batchStaff.map((bs) => bs.staff_id));
        staffData = staffUsers || [];
      }

      const enrichedBatch: BatchWithDetails = {
        ...batchData,
        students: studentBatches?.map((sb) => sb.students).filter(Boolean) as Student[],
        staff: staffData,
      };

      setBatch(enrichedBatch);
      setEditForm({
        name: batchData.name || '',
        description: batchData.description || '',
        subjects: batchData.subjects || [],
        start_time: batchData.start_time || '',
        end_time: batchData.end_time || '',
        days: batchData.days || [],
      });
      setLoading(false);
    }

    fetchBatch();
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

  const toggleDay = (day: string) => {
    if (editForm.days.includes(day)) {
      setEditForm({ ...editForm, days: editForm.days.filter((d) => d !== day) });
    } else {
      setEditForm({ ...editForm, days: [...editForm.days, day] });
    }
  };

  const handleEdit = async () => {
    if (!batch) return;
    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('batches')
        .update({
          name: editForm.name,
          description: editForm.description,
          subjects: editForm.subjects,
          start_time: editForm.start_time,
          end_time: editForm.end_time,
          days: editForm.days,
          updated_at: new Date().toISOString(),
        })
        .eq('id', batch.id);

      if (updateError) throw updateError;

      setSuccess('Batch updated successfully!');
      setEditModalOpen(false);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update batch');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!batch) return;
    setSaving(true);
    setError('');

    try {
      // Delete batch assignments
      await supabase.from('student_batches').delete().eq('batch_id', batch.id);
      await supabase.from('batch_staff').delete().eq('batch_id', batch.id);

      // Delete batch
      const { error: deleteError } = await supabase
        .from('batches')
        .delete()
        .eq('id', batch.id);

      if (deleteError) throw deleteError;

      router.push('/dashboard/batches');
    } catch (err: any) {
      setError(err.message || 'Failed to delete batch');
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!batch) {
    return null;
  }

  const studentColumns = [
    {
      key: 'name',
      header: 'Student',
      render: (student: Student) => (
        <div className="flex items-center gap-3">
          <Avatar name={`${student.first_name} ${student.last_name}`} size="sm" />
          <div>
            <p className="font-medium">{student.first_name} {student.last_name}</p>
            <p className="text-sm text-gray-500">ID: {student.student_id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (student: Student) => student.phone || '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (student: Student) => (
        <Badge variant={student.is_active ? 'success' : 'danger'}>
          {student.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/batches" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="page-title">{batch.name}</h1>
            <p className="page-subtitle">{batch.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Users className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{batch.students?.length || 0}</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{batch.subjects?.length || 0}</p>
              <p className="text-sm text-gray-500">Subjects</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold">
                {batch.start_time && batch.end_time 
                  ? `${batch.start_time} - ${batch.end_time}`
                  : 'Not Set'}
              </p>
              <p className="text-sm text-gray-500">Schedule</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold">{batch.days?.length || 0} Days</p>
              <p className="text-sm text-gray-500 truncate">{batch.days?.join(', ') || 'Not Set'}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Subjects</h2>
          </CardHeader>
          <CardBody>
            {batch.subjects && batch.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {batch.subjects.map((subject) => (
                  <Badge key={subject} variant="secondary" className="text-sm">
                    {subject}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No subjects added</p>
            )}
          </CardBody>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Schedule</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">
                {batch.start_time && batch.end_time
                  ? `${batch.start_time} - ${batch.end_time}`
                  : 'Not scheduled'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Days</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {daysOfWeek.map((day) => (
                  <span
                    key={day}
                    className={`px-2 py-1 rounded text-xs ${
                      batch.days?.includes(day)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Assigned Staff */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Assigned Staff</h2>
          </CardHeader>
          <CardBody>
            {batch.staff && batch.staff.length > 0 ? (
              <div className="space-y-3">
                {batch.staff.map((staff) => (
                  <div key={staff.id} className="flex items-center gap-3">
                    <Avatar name={`${staff.first_name || ''} ${staff.last_name || ''}`} size="sm" />
                    <div>
                      <p className="font-medium">{staff.first_name} {staff.last_name}</p>
                      <p className="text-sm text-gray-500">{staff.designation || staff.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No staff assigned</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Students ({batch.students?.length || 0})</h2>
        </CardHeader>
        <CardBody className="p-0">
          <DataTable
            data={batch.students || []}
            columns={studentColumns}
            searchable
            searchPlaceholder="Search students..."
            onRowClick={(student) => router.push(`/dashboard/students/${student.id}`)}
            emptyMessage="No students enrolled in this batch"
          />
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Batch"
        size="lg"
      >
        <div className="space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <Input
            label="Batch Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            rows={2}
          />

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

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={editForm.start_time}
                onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={editForm.end_time}
                onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                    editForm.days.includes(day)
                      ? 'bg-primary-50 border-primary-300 text-primary-700'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
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
        title="Delete Batch"
      >
        <div className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{batch.name}</strong>? 
            This will also remove all student enrollments in this batch.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Batch</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
