'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, PageLoader, Alert, Modal, Input, Select } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Building2, Edit, Trash2, Users, GraduationCap, Layers } from 'lucide-react';
import Link from 'next/link';
import { Institute } from '@/types';

export default function InstituteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [institute, setInstitute] = useState<Institute | null>(null);
  const [stats, setStats] = useState({ students: 0, batches: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Institute>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      router.push('/dashboard');
      return;
    }

    async function fetchInstituteDetails() {
      const { data, error } = await supabase
        .from('institutes')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        router.push('/dashboard/institutes');
        return;
      }

      setInstitute(data);
      setEditForm(data);

      // Fetch stats
      const [studentsRes, batchesRes, adminsRes] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('institute_id', params.id),
        supabase.from('batches').select('*', { count: 'exact', head: true }).eq('institute_id', params.id),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('institute_id', params.id).eq('role', 'coaching_admin'),
      ]);

      setStats({
        students: studentsRes.count || 0,
        batches: batchesRes.count || 0,
        admins: adminsRes.count || 0,
      });

      setLoading(false);
    }

    fetchInstituteDetails();
  }, [params.id, supabase, user, router]);

  const handleUpdate = async () => {
    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('institutes')
        .update({
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          contact_person: editForm.contact_person,
          subscription_status: editForm.subscription_status,
        })
        .eq('id', params.id);

      if (updateError) throw updateError;

      setInstitute({ ...institute!, ...editForm });
      setEditModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to update institute');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('institutes').delete().eq('id', params.id);
      if (error) throw error;
      router.push('/dashboard/institutes');
    } catch (err: any) {
      setError(err.message || 'Failed to delete institute');
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!institute) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/institutes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="page-title">{institute.name}</h1>
            <p className="page-subtitle">Institute details and management</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <GraduationCap className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
              <p className="text-sm text-gray-500">Students</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Layers className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.batches}</p>
              <p className="text-sm text-gray-500">Batches</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.admins}</p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Institute Information</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{institute.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{institute.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact Person</p>
              <p className="font-medium">{institute.contact_person}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscription Status</p>
              <Badge
                variant={
                  institute.subscription_status === 'active'
                    ? 'success'
                    : institute.subscription_status === 'trial'
                    ? 'info'
                    : 'warning'
                }
              >
                {institute.subscription_status}
              </Badge>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{institute.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="font-medium">{formatDate(institute.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{formatDate(institute.updated_at)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Institute" size="lg">
        <div className="space-y-4">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}
          <Input
            label="Institute Name"
            value={editForm.name || ''}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={editForm.email || ''}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
          <Input
            label="Phone"
            value={editForm.phone || ''}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
          />
          <Input
            label="Contact Person"
            value={editForm.contact_person || ''}
            onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
          />
          <Input
            label="Address"
            value={editForm.address || ''}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
          />
          <Select
            label="Subscription Status"
            value={editForm.subscription_status || ''}
            onChange={(e) => setEditForm({ ...editForm, subscription_status: e.target.value as any })}
            options={[
              { value: 'trial', label: 'Trial' },
              { value: 'active', label: 'Active' },
              { value: 'suspended', label: 'Suspended' },
              { value: 'expired', label: 'Expired' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} loading={saving}>Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Delete Institute" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{institute.name}</strong>? This action cannot be undone and will remove all associated data.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} loading={saving}>Delete Institute</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
