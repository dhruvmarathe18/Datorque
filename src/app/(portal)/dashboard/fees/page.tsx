'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Card, CardHeader, CardBody, Select, Modal, Input, Alert } from '@/components/portal/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import { IndianRupee, Plus, Download, Filter, TrendingUp, Printer, BarChart3, Receipt } from 'lucide-react';
import { FeePayment, Student, Batch } from '@/types/portal';
import { calculateFeeStats, calculateMonthlyData, generatePaymentReceiptHTML, createFeePayment, FeeStats, MonthlyFeeData } from '@/services/fees';
import { printHTML, downloadCSV } from '@/services/reports';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

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
  const [activeView, setActiveView] = useState<'table' | 'analytics'>('table');
  const [feeStats, setFeeStats] = useState<FeeStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyFeeData[]>([]);

  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeWithDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newFee, setNewFee] = useState({ student_id: '', batch_id: '', amount: '', description: '', due_date: '' });

  useEffect(() => {
    if (user?.role !== 'coaching_admin') return;
    fetchData();
  }, [user, filterStatus]);

  const fetchData = async () => {
    if (!user?.institute_id) return;
    let query = supabase.from('fee_payments').select('*, students(first_name, last_name, student_id), batches(name)').eq('institute_id', user.institute_id).order('due_date', { ascending: true });
    if (filterStatus !== 'all') query = query.eq('status', filterStatus);
    const { data: feesData } = await query;
    setFees(feesData || []);

    const { data: studentsData } = await supabase.from('students').select('*').eq('institute_id', user.institute_id).eq('is_active', true);
    setStudents(studentsData || []);

    const { data: batchesData } = await supabase.from('batches').select('*').eq('institute_id', user.institute_id).eq('is_active', true);
    setBatches(batchesData || []);

    // Calculate stats
    const allFees = feesData || [];
    const stats = calculateFeeStats(allFees);
    setFeeStats(stats);
    const monthly = calculateMonthlyData(allFees);
    setMonthlyData(monthly);

    setLoading(false);
  };

  const handleCollectPayment = async () => {
    if (!selectedFee) return;
    setSaving(true); setError('');
    try {
      const { error: e } = await supabase.from('fee_payments').update({ status: 'paid', paid_date: new Date().toISOString(), payment_method: paymentMethod }).eq('id', selectedFee.id);
      if (e) throw e;
      setFees((prev) => prev.map((f) => f.id === selectedFee.id ? { ...f, status: 'paid', paid_date: new Date().toISOString(), payment_method: paymentMethod } : f));
      setSuccess('Payment collected successfully!');
      setCollectModalOpen(false); setSelectedFee(null);
    } catch (err: any) { setError(err.message || 'Failed to collect'); }
    finally { setSaving(false); }
  };

  const handleCreateFee = async () => {
    if (!user?.institute_id || !newFee.student_id || !newFee.amount || !newFee.due_date) { setError('Please fill all required fields'); return; }
    setSaving(true); setError('');
    try {
      await createFeePayment({ student_id: newFee.student_id, batch_id: newFee.batch_id || undefined, amount: Number(newFee.amount), description: newFee.description, due_date: newFee.due_date, institute_id: user.institute_id });
      setSuccess('Fee created successfully!');
      setCreateModalOpen(false);
      setNewFee({ student_id: '', batch_id: '', amount: '', description: '', due_date: '' });
      fetchData();
    } catch (err: any) { setError(err.message || 'Failed to create fee'); }
    finally { setSaving(false); }
  };

  const handlePrintReceipt = async (fee: FeeWithDetails) => {
    if (!user?.institute_id) return;
    const html = await generatePaymentReceiptHTML(fee, user.institute_id);
    printHTML(html);
  };

  const handleExport = () => {
    const headers = ['Student', 'Batch', 'Amount', 'Due Date', 'Status', 'Paid Date', 'Method'];
    const rows = fees.map((f) => [
      `${f.students?.first_name || ''} ${f.students?.last_name || ''}`,
      f.batches?.name || '-', String(f.amount), f.due_date, f.status,
      f.paid_date || '-', f.payment_method || '-',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');
    downloadCSV(csv, 'fees-report.csv');
  };

  if (loading) return <PageLoader />;

  const columns = [
    { key: 'student', header: 'Student', render: (fee: FeeWithDetails) => (<div><p className="font-medium text-gray-900">{fee.students?.first_name} {fee.students?.last_name}</p><p className="text-sm text-gray-500">ID: {fee.students?.student_id}</p></div>) },
    { key: 'batch', header: 'Batch', render: (fee: FeeWithDetails) => fee.batches?.name || '-' },
    { key: 'amount', header: 'Amount', render: (fee: FeeWithDetails) => <span className="font-semibold">{formatCurrency(fee.amount)}</span> },
    { key: 'due_date', header: 'Due Date', sortable: true, render: (fee: FeeWithDetails) => formatDate(fee.due_date) },
    { key: 'status', header: 'Status', render: (fee: FeeWithDetails) => <Badge variant={fee.status === 'paid' ? 'success' : fee.status === 'overdue' ? 'danger' : 'warning'}>{fee.status}</Badge> },
    { key: 'actions', header: 'Actions', render: (fee: FeeWithDetails) => (
      <div className="flex items-center gap-2">
        {fee.status !== 'paid' ? (
          <Button size="sm" variant="success" onClick={(e) => { e.stopPropagation(); setSelectedFee(fee); setCollectModalOpen(true); }}>Collect</Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handlePrintReceipt(fee); }}><Receipt className="h-4 w-4" /></Button>
        )}
      </div>
    ) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="page-title">Fee Management</h1><p className="page-subtitle">Track and collect student fees</p></div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" /> Export</Button>
          <Button size="sm" onClick={() => setCreateModalOpen(true)}><Plus className="h-4 w-4 mr-1" /> Create Fee</Button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="flex gap-2 border-b border-gray-200">
        {([{ key: 'table', label: 'Fees Table', icon: IndianRupee }, { key: 'analytics', label: 'Analytics', icon: BarChart3 }] as const).map((tab) => (
          <button key={tab.key} onClick={() => setActiveView(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${activeView === tab.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {feeStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-5"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><IndianRupee className="h-5 w-5 text-green-600" /></div>
            <div><p className="text-xl font-bold text-green-600">{formatCurrency(feeStats.paidAmount)}</p><p className="text-xs text-gray-500">Collected</p></div></div></Card>
          <Card className="p-5"><div className="flex items-center gap-3"><div className="p-2 bg-red-100 rounded-lg"><IndianRupee className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-xl font-bold text-red-600">{formatCurrency(feeStats.pendingAmount)}</p><p className="text-xs text-gray-500">Pending</p></div></div></Card>
          <Card className="p-5"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><IndianRupee className="h-5 w-5 text-orange-600" /></div>
            <div><p className="text-xl font-bold text-orange-600">{formatCurrency(feeStats.overdueAmount)}</p><p className="text-xs text-gray-500">Overdue</p></div></div></Card>
          <Card className="p-5"><div className="flex items-center gap-3"><div className="p-2 bg-primary-100 rounded-lg"><TrendingUp className="h-5 w-5 text-primary-600" /></div>
            <div><p className="text-xl font-bold">{feeStats.collectionRate}%</p><p className="text-xs text-gray-500">Collection Rate</p></div></div></Card>
        </div>
      )}

      {activeView === 'table' && (
        <>
          <Card><CardBody><div className="flex items-center gap-4"><Filter className="h-5 w-5 text-gray-400" />
            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} options={[{ value: 'all', label: 'All Status' }, { value: 'pending', label: 'Pending' }, { value: 'overdue', label: 'Overdue' }, { value: 'paid', label: 'Paid' }]} /></div></CardBody></Card>
          <DataTable data={fees} columns={columns} searchable searchPlaceholder="Search by student name..." emptyMessage="No fee records found" />
        </>
      )}

      {activeView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card><CardHeader><h2 className="text-lg font-semibold">Monthly Collection Trend</h2></CardHeader><CardBody>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} /><Legend />
                  <Bar dataKey="collected" name="Collected" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500 py-8">No data</p>}
          </CardBody></Card>

          <Card><CardHeader><h2 className="text-lg font-semibold">Collection Over Time</h2></CardHeader><CardBody>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Line type="monotone" dataKey="collected" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pending" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} /></LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center text-gray-500 py-8">No data</p>}
          </CardBody></Card>

          {feeStats && (
            <Card className="lg:col-span-2"><CardHeader><h2 className="text-lg font-semibold">Fee Summary</h2></CardHeader><CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center"><p className="text-3xl font-bold">{feeStats.totalPayments}</p><p className="text-sm text-gray-500">Total Records</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-green-600">{feeStats.paidCount}</p><p className="text-sm text-gray-500">Paid</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-yellow-600">{feeStats.pendingCount}</p><p className="text-sm text-gray-500">Pending</p></div>
                <div className="text-center"><p className="text-3xl font-bold text-red-600">{feeStats.overdueCount}</p><p className="text-sm text-gray-500">Overdue</p></div>
              </div>
            </CardBody></Card>
          )}
        </div>
      )}

      {/* Collect Payment Modal */}
      <Modal isOpen={collectModalOpen} onClose={() => { setCollectModalOpen(false); setSelectedFee(null); setError(''); }} title="Collect Payment">
        {selectedFee && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between"><span className="text-gray-500">Student</span><span className="font-medium">{selectedFee.students?.first_name} {selectedFee.students?.last_name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold text-lg">{formatCurrency(selectedFee.amount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Due Date</span><span>{formatDate(selectedFee.due_date)}</span></div>
            </div>
            <Select label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} options={[{ value: 'cash', label: 'Cash' }, { value: 'upi', label: 'UPI' }, { value: 'card', label: 'Card' }, { value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'cheque', label: 'Cheque' }]} />
            <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setCollectModalOpen(false)}>Cancel</Button><Button variant="success" onClick={handleCollectPayment} loading={saving}>Confirm Payment</Button></div>
          </div>
        )}
      </Modal>

      {/* Create Fee Modal */}
      <Modal isOpen={createModalOpen} onClose={() => { setCreateModalOpen(false); setError(''); }} title="Create Fee">
        <div className="space-y-4">
          <Select label="Student *" value={newFee.student_id} onChange={(e) => setNewFee((p) => ({ ...p, student_id: e.target.value }))} options={students.map((s) => ({ value: s.id, label: `${s.first_name} ${s.last_name}` }))} />
          <Select label="Batch" value={newFee.batch_id} onChange={(e) => setNewFee((p) => ({ ...p, batch_id: e.target.value }))} options={[{ value: '', label: 'Select Batch' }, ...batches.map((b) => ({ value: b.id, label: b.name }))]} />
          <Input label="Amount *" type="number" value={newFee.amount} onChange={(e) => setNewFee((p) => ({ ...p, amount: e.target.value }))} placeholder="Enter amount" />
          <Input label="Description" value={newFee.description} onChange={(e) => setNewFee((p) => ({ ...p, description: e.target.value }))} placeholder="e.g., Monthly tuition fee" />
          <Input label="Due Date *" type="date" value={newFee.due_date} onChange={(e) => setNewFee((p) => ({ ...p, due_date: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-4"><Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancel</Button><Button onClick={handleCreateFee} loading={saving}>Create Fee</Button></div>
        </div>
      </Modal>
    </div>
  );
}
