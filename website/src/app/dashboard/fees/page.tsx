'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Card, CardHeader, CardBody, Select, Modal, Input, Alert } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { IndianRupee, Plus, Download, Filter } from 'lucide-react';
import { FeePayment, Student, Batch } from '@/types';

interface FeeWithDetails extends FeePayment {
  students?: { first_name: string; last_name: string; student_id: string };
  batches?: { name: string };
}

export default function FeesPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();

  const [fees, setFees] = useState<FeeWithDetails[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeWithDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.role !== 'coaching_admin') return;

    async function fetchData() {
      // Fetch fees
      let query = supabase
        .from('fee_payments')
        .select('*, students(first_name, last_name, student_id), batches(name)')
        .eq('institute_id', user?.institute_id)
        .order('due_date', { ascending: true });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data: feesData } = await query;
      setFees(feesData || []);

      // Fetch students for creating new fee
      const { data: studentsData } = await supabase
        .from('students')
        .select('*')
        .eq('institute_id', user?.institute_id)
        .eq('is_active', true);
      setStudents(studentsData || []);

      // Fetch batches
      const { data: batchesData } = await supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user?.institute_id)
        .eq('is_active', true);
      setBatches(batchesData || []);

      setLoading(false);
    }

    fetchData();
  }, [supabase, user, filterStatus]);

  const handleCollectPayment = async () => {
    if (!selectedFee) return;

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('fee_payments')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          payment_method: paymentMethod,
        })
        .eq('id', selectedFee.id);

      if (updateError) throw updateError;

      // Update local state
      setFees((prev) =>
        prev.map((f) =>
          f.id === selectedFee.id
            ? { ...f, status: 'paid', paid_date: new Date().toISOString(), payment_method: paymentMethod }
            : f
        )
      );

      setSuccess('Payment collected successfully!');
      setCollectModalOpen(false);
      setSelectedFee(null);
    } catch (err: any) {
      setError(err.message || 'Failed to collect payment');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  const totalPending = fees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalCollected = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (fee: FeeWithDetails) => (
        <div>
          <p className="font-medium text-gray-900">
            {fee.students?.first_name} {fee.students?.last_name}
          </p>
          <p className="text-sm text-gray-500">ID: {fee.students?.student_id}</p>
        </div>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      render: (fee: FeeWithDetails) => fee.batches?.name || '-',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (fee: FeeWithDetails) => (
        <span className="font-semibold">{formatCurrency(fee.amount)}</span>
      ),
    },
    {
      key: 'due_date',
      header: 'Due Date',
      sortable: true,
      render: (fee: FeeWithDetails) => formatDate(fee.due_date),
    },
    {
      key: 'status',
      header: 'Status',
      render: (fee: FeeWithDetails) => (
        <Badge
          variant={
            fee.status === 'paid' ? 'success' : fee.status === 'overdue' ? 'danger' : 'warning'
          }
        >
          {fee.status}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (fee: FeeWithDetails) =>
        fee.status !== 'paid' ? (
          <Button
            size="sm"
            variant="success"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFee(fee);
              setCollectModalOpen(true);
            }}
          >
            Collect
          </Button>
        ) : (
          <span className="text-sm text-gray-500">{formatDate(fee.paid_date!)}</span>
        ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track and collect student fees</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <IndianRupee className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPending)}</p>
              <p className="text-sm text-gray-500">Pending Collection</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <IndianRupee className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCollected)}</p>
              <p className="text-sm text-gray-500">Collected</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <IndianRupee className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{fees.length}</p>
              <p className="text-sm text-gray-500">Total Records</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'overdue', label: 'Overdue' },
                { value: 'paid', label: 'Paid' },
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {/* Fees Table */}
      <DataTable
        data={fees}
        columns={columns}
        searchable
        searchPlaceholder="Search by student name..."
        emptyMessage="No fee records found"
      />

      {/* Collect Payment Modal */}
      <Modal
        isOpen={collectModalOpen}
        onClose={() => {
          setCollectModalOpen(false);
          setSelectedFee(null);
          setError('');
        }}
        title="Collect Payment"
      >
        {selectedFee && (
          <div className="space-y-4">
            {error && <Alert type="error" message={error} />}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Student</span>
                <span className="font-medium">
                  {selectedFee.students?.first_name} {selectedFee.students?.last_name}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Batch</span>
                <span className="font-medium">{selectedFee.batches?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-lg">{formatCurrency(selectedFee.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium">{formatDate(selectedFee.due_date)}</span>
              </div>
            </div>

            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'upi', label: 'UPI' },
                { value: 'card', label: 'Card' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'cheque', label: 'Cheque' },
              ]}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setCollectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleCollectPayment} loading={saving}>
                Confirm Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
