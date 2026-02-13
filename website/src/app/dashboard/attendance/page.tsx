'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Badge, Select, PageLoader, Alert } from '@/components/ui';
import { formatDate, calculateAttendancePercentage } from '@/lib/utils';
import { ClipboardList, Calendar, Check, X, Clock, Users, Download } from 'lucide-react';
import { Batch, Student, AttendanceRecord } from '@/types';

interface StudentWithAttendance extends Student {
  attendance_status?: 'present' | 'absent' | 'late' | null;
}

export default function AttendancePage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [existingRecords, setExistingRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch batches on mount
  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;

      let query = supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true)
        .order('name');

      // If staff, only fetch assigned batches
      if (user.role === 'staff' || user.role === 'teacher') {
        const { data: assignments } = await supabase
          .from('batch_staff')
          .select('batch_id')
          .eq('staff_id', user.id);
        
        if (assignments && assignments.length > 0) {
          const batchIds = assignments.map((a) => a.batch_id);
          query = query.in('id', batchIds);
        }
      }

      const { data } = await query;
      setBatches(data || []);
      if (data && data.length > 0) {
        setSelectedBatch(data[0].id);
      }
      setLoading(false);
    }

    fetchBatches();
  }, [supabase, user]);

  // Fetch students and attendance when batch/date changes
  useEffect(() => {
    async function fetchAttendanceData() {
      if (!selectedBatch || !user?.institute_id) return;

      setLoading(true);
      
      // Get students in batch
      const { data: studentBatches } = await supabase
        .from('student_batches')
        .select('student_id, students(*)')
        .eq('batch_id', selectedBatch);

      const studentsData = studentBatches?.map((sb) => sb.students).filter(Boolean) as Student[] || [];

      // Get existing attendance records
      const { data: attendance } = await supabase
        .from('attendance')
        .select('*')
        .eq('batch_id', selectedBatch)
        .eq('date', selectedDate)
        .eq('institute_id', user.institute_id);

      setExistingRecords(attendance || []);

      // Merge students with attendance
      const studentsWithAttendance: StudentWithAttendance[] = studentsData.map((student) => {
        const record = attendance?.find((a) => a.student_id === student.id);
        return {
          ...student,
          attendance_status: record?.status || null,
        };
      });

      setStudents(studentsWithAttendance);
      setLoading(false);
    }

    fetchAttendanceData();
  }, [selectedBatch, selectedDate, supabase, user?.institute_id]);

  const updateStudentStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, attendance_status: status } : s))
    );
  };

  const markAllAs = (status: 'present' | 'absent' | 'late') => {
    setStudents((prev) => prev.map((s) => ({ ...s, attendance_status: status })));
  };

  const saveAttendance = async () => {
    if (!user?.institute_id) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const studentsToSave = students.filter((s) => s.attendance_status);

      // Delete existing records for this batch/date
      await supabase
        .from('attendance')
        .delete()
        .eq('batch_id', selectedBatch)
        .eq('date', selectedDate)
        .eq('institute_id', user.institute_id);

      // Insert new records
      const records = studentsToSave.map((student) => ({
        student_id: student.id,
        batch_id: selectedBatch,
        date: selectedDate,
        status: student.attendance_status,
        institute_id: user.institute_id,
        remarks: null,
      }));

      if (records.length > 0) {
        const { error: insertError } = await supabase.from('attendance').insert(records);
        if (insertError) throw insertError;
      }

      setSuccess('Attendance saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const presentCount = students.filter((s) => s.attendance_status === 'present').length;
  const absentCount = students.filter((s) => s.attendance_status === 'absent').length;
  const lateCount = students.filter((s) => s.attendance_status === 'late').length;
  const markedCount = students.filter((s) => s.attendance_status).length;

  if (loading && batches.length === 0) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Mark and manage student attendance</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                label="Select Batch"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Users className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{students.length}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-xs text-gray-500">Present</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{lateCount}</p>
              <p className="text-xs text-gray-500">Late</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Student List */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Students</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="success" onClick={() => markAllAs('present')}>
              All Present
            </Button>
            <Button size="sm" variant="danger" onClick={() => markAllAs('absent')}>
              All Absent
            </Button>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No students in this batch</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold text-sm">
                        {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-500">ID: {student.student_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStudentStatus(student.id, 'present')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.attendance_status === 'present'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                      }`}
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateStudentStatus(student.id, 'absent')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.attendance_status === 'absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateStudentStatus(student.id, 'late')}
                      className={`p-2 rounded-lg transition-colors ${
                        student.attendance_status === 'late'
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-yellow-100'
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Save Button */}
      {students.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={saveAttendance} loading={saving} disabled={markedCount === 0}>
            Save Attendance ({markedCount}/{students.length} marked)
          </Button>
        </div>
      )}
    </div>
  );
}
