'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Select, Alert, PageLoader } from '@/components/portal/ui';
import { ArrowLeft, Upload, Download, FileText, Check, X, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Batch } from '@/types/portal';
import { useEffect } from 'react';

interface ParsedStudent {
  row: number;
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
  phone: string;
  parent_name: string;
  parent_phone: string;
  address: string;
  errors: string[];
  valid: boolean;
}

export default function BulkStudentUploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [parsedStudents, setParsedStudents] = useState<ParsedStudent[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState({ success: 0, failed: 0, errors: [] as string[] });
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;
      const { data } = await supabase.from('batches').select('*').eq('institute_id', user.institute_id).eq('is_active', true).order('name');
      setBatches(data || []);
    }
    fetchBatches();
  }, [user?.institute_id]);

  const downloadTemplate = () => {
    const headers = 'first_name,last_name,student_id,email,phone,parent_name,parent_phone,address';
    const sample = 'John,Doe,STU001,john@example.com,9876543210,Mr. Doe,9876543211,123 Main St';
    const csv = `${headers}\n${sample}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'student-upload-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ParsedStudent[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
    const students: ParsedStudent[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/['"]/g, ''));
      const row: any = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

      const errors: string[] = [];
      if (!row.first_name) errors.push('First name is required');
      if (!row.last_name) errors.push('Last name is required');
      if (!row.student_id) errors.push('Student ID is required');
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) errors.push('Invalid email');
      if (row.phone && !/^\d{10}$/.test(row.phone.replace(/[^0-9]/g, ''))) errors.push('Invalid phone (10 digits)');

      students.push({
        row: i + 1,
        first_name: row.first_name || '',
        last_name: row.last_name || '',
        student_id: row.student_id || '',
        email: row.email || '',
        phone: row.phone || '',
        parent_name: row.parent_name || '',
        parent_phone: row.parent_phone || '',
        address: row.address || '',
        errors,
        valid: errors.length === 0,
      });
    }
    return students;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { setError('Please upload a CSV file'); return; }
    setFileName(file.name);
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const students = parseCSV(text);
      if (students.length === 0) { setError('No valid data found in CSV'); return; }
      setParsedStudents(students);
      setStep('preview');
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!user?.institute_id) return;
    const validStudents = parsedStudents.filter((s) => s.valid);
    if (validStudents.length === 0) { setError('No valid students to upload'); return; }

    setUploading(true); setError('');
    let success = 0, failed = 0;
    const errors: string[] = [];

    for (const student of validStudents) {
      try {
        const { data, error: e } = await (supabase.from('students') as any).insert({
          first_name: student.first_name, last_name: student.last_name, student_id: student.student_id,
          email: student.email || null, phone: student.phone || null, parent_name: student.parent_name || null,
          parent_phone: student.parent_phone || null, address: student.address || null,
          institute_id: user.institute_id, is_active: true,
        }).select().single();
        if (e) throw e;

        if (selectedBatch && data) {
          await (supabase.from('student_batches') as any).insert({ student_id: data.id, batch_id: selectedBatch });
        }
        success++;
      } catch (err: any) {
        failed++;
        errors.push(`Row ${student.row} (${student.first_name} ${student.last_name}): ${err.message || 'Unknown error'}`);
      }
    }

    setUploadResult({ success, failed, errors });
    setStep('result');
    setUploading(false);
  };

  const validCount = parsedStudents.filter((s) => s.valid).length;
  const invalidCount = parsedStudents.filter((s) => !s.valid).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/students"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
        <div><h1 className="page-title">Bulk Student Upload</h1><p className="page-subtitle">Upload multiple students via CSV</p></div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Steps indicator */}
      <div className="flex items-center gap-4 justify-center">
        {['Upload CSV', 'Preview & Validate', 'Result'].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i === ['upload', 'preview', 'result'].indexOf(step) ? 'bg-primary-600 text-white' : i < ['upload', 'preview', 'result'].indexOf(step) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{i < ['upload', 'preview', 'result'].indexOf(step) ? <Check className="h-4 w-4" /> : i + 1}</div>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">{label}</span>
            {i < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <div className="max-w-xl mx-auto space-y-6">
          <Card><CardBody className="text-center py-8">
            <Button variant="secondary" onClick={downloadTemplate}><Download className="h-4 w-4 mr-2" /> Download CSV Template</Button>
            <p className="text-sm text-gray-500 mt-2">Download and fill the template with student data</p>
          </CardBody></Card>

          <Card><CardBody>
            <Select label="Assign to Batch (Optional)" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} options={[{ value: '', label: 'No batch assignment' }, ...batches.map((b) => ({ value: b.id, label: b.name }))]} />
          </CardBody></Card>

          <Card>
            <CardBody>
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900">Click to upload CSV</p>
                <p className="text-sm text-gray-500 mt-1">or drag and drop your file here</p>
                {fileName && <p className="text-sm text-primary-600 mt-2">{fileName}</p>}
              </div>
              <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
            </CardBody>
          </Card>
        </div>
      )}

      {step === 'preview' && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4"><div className="text-center"><p className="text-2xl font-bold">{parsedStudents.length}</p><p className="text-xs text-gray-500">Total Rows</p></div></Card>
            <Card className="p-4"><div className="text-center"><p className="text-2xl font-bold text-green-600">{validCount}</p><p className="text-xs text-gray-500">Valid</p></div></Card>
            <Card className="p-4"><div className="text-center"><p className="text-2xl font-bold text-red-600">{invalidCount}</p><p className="text-xs text-gray-500">Invalid</p></div></Card>
          </div>

          <Card><CardBody className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50"><th className="px-4 py-3 text-left">Row</th><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Student ID</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
              <tbody className="divide-y divide-gray-100">{parsedStudents.map((s) => (
                <tr key={s.row} className={`hover:bg-gray-50 ${!s.valid ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3">{s.row}</td>
                  <td className="px-4 py-3 font-medium">{s.first_name} {s.last_name}</td>
                  <td className="px-4 py-3">{s.student_id}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.phone}</td>
                  <td className="px-4 py-3">{s.valid ? <span className="text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> Valid</span> : <div><span className="text-red-600 flex items-center gap-1"><X className="h-4 w-4" /> Invalid</span><p className="text-xs text-red-500">{s.errors.join(', ')}</p></div>}</td>
                </tr>
              ))}</tbody>
            </table>
          </CardBody></Card>

          <div className="flex justify-between">
            <Button variant="secondary" onClick={() => { setStep('upload'); setParsedStudents([]); }}>Back</Button>
            <Button onClick={handleUpload} loading={uploading} disabled={validCount === 0}>Upload {validCount} Students</Button>
          </div>
        </>
      )}

      {step === 'result' && (
        <div className="max-w-xl mx-auto space-y-6">
          <Card><CardBody className="text-center py-8">
            {uploadResult.failed === 0 ? (
              <><div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="h-8 w-8 text-green-600" /></div>
                <h2 className="text-xl font-bold text-green-600">Upload Successful!</h2><p className="text-gray-500 mt-2">{uploadResult.success} students added successfully</p></>
            ) : (
              <><div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="h-8 w-8 text-yellow-600" /></div>
                <h2 className="text-xl font-bold">Upload Completed with Errors</h2><p className="text-green-600 mt-2">{uploadResult.success} succeeded</p><p className="text-red-600">{uploadResult.failed} failed</p></>
            )}
          </CardBody></Card>
          {uploadResult.errors.length > 0 && (
            <Card><CardHeader><h2 className="text-lg font-semibold text-red-600">Errors</h2></CardHeader><CardBody>
              <div className="space-y-1 max-h-60 overflow-y-auto">{uploadResult.errors.map((e, i) => <p key={i} className="text-sm text-red-600">{e}</p>)}</div>
            </CardBody></Card>
          )}
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => { setStep('upload'); setParsedStudents([]); setUploadResult({ success: 0, failed: 0, errors: [] }); }}>Upload More</Button>
            <Link href="/dashboard/students"><Button>View Students</Button></Link>
          </div>
        </div>
      )}
    </div>
  );
}
