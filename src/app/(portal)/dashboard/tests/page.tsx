'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable, Button, Badge, PageLoader, Card, CardBody, CardHeader, Select } from '@/components/portal/ui';
import { formatDate } from '@/lib/utils';
import { Plus, FileText, BarChart3, Calendar, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchTests, fetchTestAnalytics, Test, TestAnalytics } from '@/services/tests';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function TestsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [tests, setTests] = useState<Test[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<TestAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'tests' | 'analytics'>('tests');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.institute_id) return;
      try {
        const [testsData, batchesRes] = await Promise.all([
          fetchTests(user.institute_id),
          supabase.from('batches').select('id, name').eq('institute_id', user.institute_id).eq('is_active', true),
        ]);
        setTests(testsData);
        setBatches(batchesRes.data || []);

        if (activeTab === 'analytics') {
          const analyticsData = await fetchTestAnalytics(user.institute_id);
          setAnalytics(analyticsData);
        }
      } catch (err) {
        console.error('Error loading tests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.institute_id, activeTab, supabase]);

  const filteredTests = tests.filter((t) => {
    if (filterBatch !== 'all' && t.batch_id !== filterBatch) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    return true;
  });

  if (loading) return <PageLoader />;

  const columns = [
    {
      key: 'name',
      header: 'Test',
      render: (test: Test) => (
        <div>
          <p className="font-medium text-gray-900">{test.name}</p>
          <p className="text-sm text-gray-500">{test.subject}</p>
        </div>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      render: (test: Test) => test.batch_name || test.batches?.name || '-',
    },
    {
      key: 'test_date',
      header: 'Date',
      sortable: true,
      render: (test: Test) => formatDate(test.test_date),
    },
    {
      key: 'max_marks',
      header: 'Max Marks',
      render: (test: Test) => test.max_marks,
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (test: Test) => `${test.duration} min`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (test: Test) => (
        <Badge variant={
          test.status === 'published' ? 'success' :
          test.status === 'completed' ? 'info' :
          test.status === 'scheduled' ? 'warning' : 'default'
        }>
          {test.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Tests & Results</h1>
          <p className="page-subtitle">{tests.length} tests created</p>
        </div>
        <Link href="/dashboard/tests/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Test
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'tests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />
          Tests
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'analytics' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {activeTab === 'tests' ? (
        <>
          {/* Filters */}
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Select
                    value={filterBatch}
                    onChange={(e) => setFilterBatch(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Batches' },
                      ...batches.map((b: any) => ({ value: b.id, label: b.name })),
                    ]}
                  />
                </div>
                <div className="flex-1">
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'published', label: 'Published' },
                      { value: 'scheduled', label: 'Scheduled' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'draft', label: 'Draft' },
                    ]}
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          <DataTable
            data={filteredTests}
            columns={columns}
            searchable
            searchPlaceholder="Search tests..."
            onRowClick={(test) => router.push(`/dashboard/tests/${test.id}`)}
            emptyMessage="No tests found. Create your first test!"
          />
        </>
      ) : (
        /* Analytics Tab */
        analytics ? (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.overallStats.totalTests}</p>
                    <p className="text-sm text-gray-500">Total Tests</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.overallStats.averageScore}%</p>
                    <p className="text-sm text-gray-500">Average Score</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.overallStats.passRate}%</p>
                    <p className="text-sm text-gray-500">Pass Rate</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.overallStats.totalStudents}</p>
                    <p className="text-sm text-gray-500">Students Tested</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Subject Performance</h2>
              </CardHeader>
              <CardBody>
                {analytics.subjectPerformance.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.subjectPerformance.map((sp) => (
                      <div key={sp.subject} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-medium text-gray-700 truncate">{sp.subject}</div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full transition-all"
                              style={{ width: `${sp.averageScore}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm font-semibold">{sp.averageScore}%</span>
                          <span className="text-xs text-gray-400 ml-1">({sp.totalTests})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Score Distribution */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Score Distribution</h2>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-5 gap-2">
                  {analytics.scoreDistribution.map((sd) => (
                    <div key={sd.range} className="text-center">
                      <div className="h-32 flex items-end justify-center mb-2">
                        <div
                          className="w-full max-w-[3rem] bg-primary-400 rounded-t-lg transition-all"
                          style={{ height: `${Math.max(sd.percentage, 5)}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-600">{sd.range}</p>
                      <p className="text-sm font-bold text-gray-900">{sd.count}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Batch Performance */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Batch Performance</h2>
              </CardHeader>
              <CardBody>
                {analytics.batchPerformance.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No data available</p>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {analytics.batchPerformance.map((bp) => (
                      <div key={bp.batchName} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-gray-900">{bp.batchName}</p>
                          <p className="text-sm text-gray-500">{bp.totalStudents} students</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={bp.averageScore >= 60 ? 'success' : bp.averageScore >= 35 ? 'warning' : 'danger'}>
                            {bp.averageScore}% avg
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">Loading analytics...</div>
        )
      )}
    </div>
  );
}
