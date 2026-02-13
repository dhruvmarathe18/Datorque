'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, Button, Badge, Modal, Input, Alert, PageLoader } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Trash2, Download, Save, Users, Trophy, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchTestById, fetchTestResults, fetchBatchStudentsForTest, saveTestResults, deleteTest, updateTest, TestResult } from '@/services/tests';
import { downloadCSV, generateCSV } from '@/services/reports';

interface StudentMark {
  student_id: string;
  first_name: string;
  last_name: string;
  student_id_num: string;
  marks_obtained: number;
  attendance: 'present' | 'absent';
  remarks: string;
}

export default function TestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'results' | 'enter-marks'>('results');
  const [studentMarks, setStudentMarks] = useState<StudentMark[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [testData, resultsData] = await Promise.all([
          fetchTestById(id),
          fetchTestResults(id),
        ]);
        setTest(testData);
        setResults(resultsData);

        // Load students for marks entry
        if (testData?.batch_id) {
          const students = await fetchBatchStudentsForTest(testData.batch_id);
          const marks: StudentMark[] = students.map((s: any) => {
            const existingResult = resultsData.find((r: any) => r.student_id === s.id);
            return {
              student_id: s.id,
              first_name: s.first_name,
              last_name: s.last_name,
              student_id_num: s.student_id,
              marks_obtained: existingResult?.marks_obtained || 0,
              attendance: existingResult?.attendance || 'present',
              remarks: existingResult?.remarks || '',
            };
          });
          setStudentMarks(marks);
        }
      } catch (err) {
        console.error('Error loading test:', err);
        setError('Failed to load test details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleSaveMarks = async () => {
    if (!user?.institute_id) return;
    setSaving(true);
    setError('');
    try {
      await saveTestResults(id, user.institute_id, studentMarks);
      const updatedResults = await fetchTestResults(id);
      setResults(updatedResults);
      setSuccess('Marks saved successfully!');
      setActiveTab('results');
    } catch (err: any) {
      setError(err.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTest(id);
      router.push('/dashboard/tests');
    } catch (err: any) {
      setError(err.message || 'Failed to delete test');
    }
  };

  const handleExport = () => {
    if (!test || results.length === 0) return;
    const csv = generateCSV(results, [
      { key: 'student', header: 'Student Name', render: (r: any) => `${r.students?.first_name || ''} ${r.students?.last_name || ''}` },
      { key: 'student_id', header: 'Student ID', render: (r: any) => r.students?.student_id || '' },
      { key: 'marks_obtained', header: 'Marks Obtained' },
      { key: 'max', header: 'Max Marks', render: () => String(test.max_marks) },
      { key: 'percentage', header: 'Percentage', render: (r: any) => `${Math.round((r.marks_obtained / test.max_marks) * 100)}%` },
      { key: 'attendance', header: 'Attendance' },
      { key: 'remarks', header: 'Remarks', render: (r: any) => r.remarks || '' },
    ]);
    downloadCSV(csv, `${test.name}-results.csv`);
  };

  const updateMark = (studentId: string, field: keyof StudentMark, value: any) => {
    setStudentMarks((prev) =>
      prev.map((m) => (m.student_id === studentId ? { ...m, [field]: value } : m))
    );
  };

  const filteredMarks = studentMarks.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.first_name.toLowerCase().includes(q) || m.last_name.toLowerCase().includes(q) || m.student_id_num.toLowerCase().includes(q);
  });

  if (loading) return <PageLoader />;
  if (!test) return <div className="text-center py-12 text-gray-500">Test not found</div>;

  // Calculate stats
  const presentResults = results.filter((r: any) => r.attendance === 'present');
  const avgMarks = presentResults.length > 0
    ? Math.round(presentResults.reduce((s: number, r: any) => s + r.marks_obtained, 0) / presentResults.length)
    : 0;
  const avgPercentage = test.max_marks > 0 ? Math.round((avgMarks / test.max_marks) * 100) : 0;
  const passCount = presentResults.filter((r: any) => (r.marks_obtained / test.max_marks) * 100 >= 35).length;
  const highestMarks = presentResults.length > 0 ? Math.max(...presentResults.map((r: any) => r.marks_obtained)) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/tests">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="page-title">{test.name}</h1>
            <p className="page-subtitle">{test.subject} • {test.batch_name} • {formatDate(test.test_date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport} disabled={results.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Test Info + Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{results.length}</p>
              <p className="text-xs text-gray-500">Results</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{avgPercentage}%</p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highestMarks}/{test.max_marks}</p>
              <p className="text-xs text-gray-500">Highest</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{passCount}/{presentResults.length}</p>
              <p className="text-xs text-gray-500">Passed</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'results' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
          }`}
        >
          Results ({results.length})
        </button>
        <button
          onClick={() => setActiveTab('enter-marks')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'enter-marks' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
          }`}
        >
          Enter/Edit Marks
        </button>
      </div>

      {activeTab === 'results' ? (
        <Card>
          <CardBody className="p-0">
            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No results yet</p>
                <p className="text-sm">Switch to &quot;Enter/Edit Marks&quot; to add results</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">#</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Student</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Marks</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Percentage</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Attendance</th>
                      <th className="text-left text-sm font-medium text-gray-500 px-6 py-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results.map((result: any, idx: number) => {
                      const pct = Math.round((result.marks_obtained / test.max_marks) * 100);
                      const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 35 ? 'D' : 'F';
                      return (
                        <tr key={result.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 text-sm text-gray-500">{idx + 1}</td>
                          <td className="px-6 py-3">
                            <p className="font-medium text-gray-900">
                              {result.students?.first_name} {result.students?.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{result.students?.student_id}</p>
                          </td>
                          <td className="px-6 py-3 font-semibold">{result.attendance === 'absent' ? '-' : `${result.marks_obtained}/${test.max_marks}`}</td>
                          <td className="px-6 py-3">
                            {result.attendance === 'absent' ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className={pct >= 60 ? 'text-green-600 font-semibold' : pct >= 35 ? 'text-yellow-600' : 'text-red-600 font-semibold'}>
                                {pct}%
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-3">
                            <Badge variant={result.attendance === 'present' ? 'success' : 'danger'}>
                              {result.attendance}
                            </Badge>
                          </td>
                          <td className="px-6 py-3">
                            {result.attendance === 'absent' ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <Badge variant={grade === 'F' ? 'danger' : grade.startsWith('A') ? 'success' : 'warning'}>
                                {grade}
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        /* Enter/Edit Marks */
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Enter Marks</h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input w-48"
              />
              <Button onClick={handleSaveMarks} loading={saving}>
                <Save className="h-4 w-4 mr-1" />
                Save Marks
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Student</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-4 py-3 w-32">Marks (/{test.max_marks})</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-4 py-3 w-32">Attendance</th>
                    <th className="text-left text-sm font-medium text-gray-500 px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMarks.map((m) => (
                    <tr key={m.student_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{m.first_name} {m.last_name}</p>
                        <p className="text-xs text-gray-500">{m.student_id_num}</p>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="input w-24"
                          value={m.marks_obtained}
                          onChange={(e) => updateMark(m.student_id, 'marks_obtained', Number(e.target.value))}
                          min={0}
                          max={test.max_marks}
                          disabled={m.attendance === 'absent'}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="input w-28"
                          value={m.attendance}
                          onChange={(e) => updateMark(m.student_id, 'attendance', e.target.value)}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          className="input"
                          placeholder="Optional remarks"
                          value={m.remarks}
                          onChange={(e) => updateMark(m.student_id, 'remarks', e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Test">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;{test.name}&quot;? This will also delete all results. This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Test</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
