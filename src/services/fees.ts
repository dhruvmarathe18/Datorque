/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSupabaseClient } from '@/lib/supabase/client';

export interface FeeStats {
  totalRevenue: number;
  pendingAmount: number;
  paidAmount: number;
  overdueAmount: number;
  totalPayments: number;
  pendingCount: number;
  paidCount: number;
  overdueCount: number;
  collectionRate: number;
  averagePayment: number;
}

export interface MonthlyFeeData {
  month: string;
  collected: number;
  pending: number;
  overdue: number;
  total: number;
  count: number;
}

export function calculateFeeStats(payments: any[]): FeeStats {
  const paid = payments.filter((p: any) => p.status === 'paid');
  const pending = payments.filter((p: any) => p.status === 'pending');
  const overdue = payments.filter((p: any) => p.status === 'overdue');

  const paidAmount = paid.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const pendingAmount = pending.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const overdueAmount = overdue.reduce((s: number, p: any) => s + (p.amount || 0), 0);
  const totalRevenue = paidAmount + pendingAmount + overdueAmount;

  return {
    totalRevenue,
    paidAmount,
    pendingAmount,
    overdueAmount,
    totalPayments: payments.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    overdueCount: overdue.length,
    collectionRate: totalRevenue > 0 ? Math.round((paidAmount / totalRevenue) * 100) : 0,
    averagePayment: paid.length > 0 ? Math.round(paidAmount / paid.length) : 0,
  };
}

export function calculateMonthlyData(payments: any[]): MonthlyFeeData[] {
  const monthMap = new Map<string, MonthlyFeeData>();

  payments.forEach((p: any) => {
    const date = p.paid_date || p.due_date || p.created_at;
    if (!date) return;
    const month = date.slice(0, 7);
    const existing = monthMap.get(month) || { month, collected: 0, pending: 0, overdue: 0, total: 0, count: 0 };

    if (p.status === 'paid') existing.collected += p.amount || 0;
    else if (p.status === 'pending') existing.pending += p.amount || 0;
    else if (p.status === 'overdue') existing.overdue += p.amount || 0;

    existing.total += p.amount || 0;
    existing.count++;
    monthMap.set(month, existing);
  });

  return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
}

export function generatePaymentReceiptHTML(payment: any, institute: any): string {
  const student = payment.students || {};
  const batch = payment.batches || {};
  const paidDate = payment.paid_date ? new Date(payment.paid_date).toLocaleDateString('en-IN') : '-';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 800px; margin: auto; }
        .header { text-align: center; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #1E1B4B; margin: 0; font-size: 28px; }
        .header p { color: #6B7280; margin: 5px 0; }
        .receipt-title { text-align: center; font-size: 20px; font-weight: bold; color: #4F46E5; margin: 20px 0; }
        .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .detail-item { padding: 10px; background: #F9FAFB; border-radius: 8px; }
        .detail-item label { display: block; font-size: 12px; color: #6B7280; margin-bottom: 4px; }
        .detail-item span { font-size: 14px; font-weight: 600; color: #111827; }
        .amount-box { text-align: center; background: #EEF2FF; padding: 20px; border-radius: 12px; margin: 30px 0; }
        .amount-box .amount { font-size: 36px; font-weight: bold; color: #4F46E5; }
        .amount-box .label { color: #6B7280; font-size: 14px; }
        .status { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status.paid { background: #D1FAE5; color: #065F46; }
        .status.pending { background: #FEF3C7; color: #92400E; }
        .status.overdue { background: #FEE2E2; color: #991B1B; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #9CA3AF; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${institute?.name || 'Institute'}</h1>
        <p>${institute?.address || ''}</p>
        <p>${institute?.phone || ''} | ${institute?.email || ''}</p>
      </div>
      <div class="receipt-title">PAYMENT RECEIPT</div>
      <div class="details">
        <div class="detail-item">
          <label>Receipt No</label>
          <span>${payment.id?.slice(0, 8).toUpperCase() || '-'}</span>
        </div>
        <div class="detail-item">
          <label>Date</label>
          <span>${paidDate}</span>
        </div>
        <div class="detail-item">
          <label>Student Name</label>
          <span>${student.first_name || ''} ${student.last_name || ''}</span>
        </div>
        <div class="detail-item">
          <label>Student ID</label>
          <span>${student.student_id || '-'}</span>
        </div>
        <div class="detail-item">
          <label>Batch</label>
          <span>${batch.name || '-'}</span>
        </div>
        <div class="detail-item">
          <label>Payment Method</label>
          <span>${(payment.payment_method || 'Cash').toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <label>Fee Type</label>
          <span>${(payment.fee_type || 'Tuition').replace('_', ' ').toUpperCase()}</span>
        </div>
        <div class="detail-item">
          <label>Status</label>
          <span class="status ${payment.status}">${payment.status.toUpperCase()}</span>
        </div>
      </div>
      <div class="amount-box">
        <div class="label">Amount Paid</div>
        <div class="amount">₹${(payment.amount || 0).toLocaleString('en-IN')}</div>
      </div>
      ${payment.transaction_id ? `<p style="text-align:center;color:#6B7280;">Transaction ID: ${payment.transaction_id}</p>` : ''}
      <div class="footer">
        <p>This is a computer-generated receipt and does not require a signature.</p>
        <p>Generated on ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}</p>
      </div>
    </body>
    </html>
  `;
}

export async function fetchInstituteDetails(instituteId: string) {
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('institutes')
    .select('*')
    .eq('id', instituteId)
    .single();
  return data;
}

export async function createFeePayment(payment: {
  student_id: string;
  batch_id?: string;
  amount: number;
  due_date: string;
  fee_type?: string;
  description?: string;
  institute_id: string;
}) {
  const supabase = getSupabaseClient();
  const { data, error } = await (supabase.from('fee_payments') as any).insert([{
    ...payment,
    status: 'pending',
  }]).select().single();
  if (error) throw error;
  return data;
}
