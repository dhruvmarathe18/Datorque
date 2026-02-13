'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Modal, Input, Select, Alert, Avatar } from '@/components/ui';
import { formatDate, formatCurrency, calculateAttendancePercentage } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, User, Phone, Mail, Calendar, CreditCard, BookOpen, ClipboardList, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Student, Batch, FeePayment, AttendanceRecord } from '@/types';

interface StudentWithDetails extends Student {
  batches?: Batch[];
  fee_payments?: FeePayment[];
  attendance?: AttendanceRecord[];
}

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [student, setStudent] = useState<StudentWithDetails | null>(null);
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
    parent_phone: '',
    address: '',
    batch_ids: [] as string[],
  });

  useEffect(() => {
    async function fetchStudent() {
      if (!params.id || !user?.institute_id) return;

      // Fetch student
      const { data: studentData } = await supabase
        .from('students')
        .select('*')
        .eq('id', params.id)
        .eq('institute_id', user.institute_id)
        .single();

      if (!studentData) {
        router.push('/dashboard/students');
        return;
      }

      // Fetch student's batches
      const { data: studentBatches } = await supabase
        .from('student_batches')
        .select('batch_id, batches(*)')
        .eq('student_id', params.id);

      // Fetch fee payments
      const { data: feePayments } = await supabase
        .from('fee_payments')
        .select('*')
        .eq('student_id', params.id)
        .order('due_date', { ascending: false })
        .limit(5);

      // Fetch attendance
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', params.id)
        .order('date', { ascending: false })
        .limit(30);

      // Fetch all batches for edit
      const { data: allBatchesData } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);

      const enrichedStudent: StudentWithDetails = {
        ...studentData,
        batches: studentBatches?.map((sb) => sb.batches).filter(Boolean) as Batch[],
        fee_payments: feePayments || [],
        attendance: attendance || [],
      };

      setStudent(enrichedStudent);
      setAllBatches(allBatchesData || []);
      setEditForm({
        first_name: studentData.first_name || '',
        last_name: studentData.last_name || '',
        phone: studentData.phone || '',
        parent_phone: studentData.parent_phone || '',
        address: studentData.address || '',
        batch_ids: studentBatches?.map((sb) => sb.batch_id) || [],
      });
      setLoading(false);
    }

    fetchStudent();
  }, [params.id, supabase, user, router]);

  const handleEdit = async () => {
    if (!student) return;
    setSaving(true);
    setError('');

    try {
      // Update student
      const { error: updateError } = await supabase
        .from('students')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          parent_phone: editForm.parent_phone,
          address: editForm.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', student.id);

      if (updateError) throw updateError;

      // Update batch assignments
      await supabase.from('student_batches').delete().eq('student_id', student.id);
      if (editForm.batch_ids.length > 0) {
        await supabase.from('student_batches').insert(
          editForm.batch_ids.map((batchId) => ({
            student_id: student.id,
            batch_id: batchId,
          }))
        );
      }

      setSuccess('Student updated successfully!');
      setEditModalOpen(false);
      
      // Refresh data
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;
    setSaving(true);
    setError('');

    try {
      // Delete student batches
      await supabase.from('student_batches').delete().eq('student_id', student.id);
      
      // Delete student
      const { error: deleteError } = await supabase
        .from('students')
        .delete()
        .eq('id', student.id);

      if (deleteError) throw deleteError;

      router.push('/dashboard/students');
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!student) {
    return null;
  }

  const presentCount = student.attendance?.filter((a) => a.status === 'present').length || 0;
  const totalAttendance = student.attendance?.length || 0;
  const attendancePercentage = calculateAttendancePercentage(presentCount, totalAttendance);

  const pendingFees = student.fee_payments?.filter((f) => f.status === 'pending' || f.status === 'overdue') || [];
  const totalPendingAmount = pendingFees.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="page-title">{student.first_name} {student.last_name}</h1>
            <p className="page-subtitle">Student ID: {student.student_id}</p>
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
          <div className="flex items-center gap-4">
            <Avatar name={`${student.first_name} ${student.last_name}`} size="xl" />
            <div>
              <Badge variant={student.is_active ? 'success' : 'danger'}>
                {student.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">Joined {formatDate(student.created_at)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{student.batches?.length || 0}</p>
              <p className="text-sm text-gray-500">Batches Enrolled</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClipboardList className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{attendancePercentage}%</p>
              <p className="text-sm text-gray-500">Attendance (Last 30 days)</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${totalPendingAmount > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <CreditCard className={`h-5 w-5 ${totalPendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${totalPendingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(totalPendingAmount)}
              </p>
              <p className="text-sm text-gray-500">Pending Fees</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <p className="font-medium">{student.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{student.phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Parent Phone</p>
                <p className="font-medium">{student.parent_phone || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{student.address || '-'}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Enrolled Batches */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Enrolled Batches</h2>
          </CardHeader>
          <CardBody>
            {student.batches && student.batches.length > 0 ? (
              <div className="space-y-3">
                {student.batches.map((batch) => (
                  <Link
                    key={batch.id}
                    href={`/dashboard/batches/${batch.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{batch.name}</p>
                    <p className="text-sm text-gray-500">{batch.subjects?.join(', ')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Not enrolled in any batch</p>
            )}
          </CardBody>
        </Card>

        {/* Recent Fee Payments */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Fee Payments</h2>
          </CardHeader>
          <CardBody>
            {student.fee_payments && student.fee_payments.length > 0 ? (
              <div className="space-y-3">
                {student.fee_payments.slice(0, 5).map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{formatCurrency(fee.amount)}</p>
                      <p className="text-sm text-gray-500">Due: {formatDate(fee.due_date)}</p>
                    </div>
                    <Badge
                      variant={fee.status === 'paid' ? 'success' : fee.status === 'overdue' ? 'danger' : 'warning'}
                    >
                      {fee.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No fee records</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Student"
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
              label="Parent Phone"
              value={editForm.parent_phone}
              onChange={(e) => setEditForm({ ...editForm, parent_phone: e.target.value })}
            />
          </div>

          <Input
            label="Address"
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Batches</label>
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
        title="Delete Student"
      >
        <div className="space-y-4">
          {error && <Alert type="error" message={error} />}
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{student.first_name} {student.last_name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Student</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
