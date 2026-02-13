'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardBody, CardHeader, Button, Badge, Modal, Textarea, Alert, PageLoader } from '@/components/portal/ui';
import { formatDate, formatFileSize } from '@/lib/utils';
import { ArrowLeft, Download, Trash2, Eye, Check, RotateCcw, FileText, Paperclip, Users, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchHomeworkDetails, fetchHomeworkSubmissions, updateSubmissionStatus, deleteHomework } from '@/services/homework';

interface Submission {
  id: string;
  homework_id: string;
  student_id: string;
  submission_text: string | null;
  submitted_at: string;
  status: 'submitted' | 'checked' | 'returned';
  feedback: string | null;
  checked_at: string | null;
  students?: { first_name: string; last_name: string; student_id: string };
  submission_attachments?: Array<{ id: string; file_name: string; file_url: string; file_type: string; file_size: number }>;
}

export default function HomeworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();

  const [homework, setHomework] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'submissions'>('details');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Review modal
  const [reviewModal, setReviewModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [reviewAction, setReviewAction] = useState<'checked' | 'returned'>('checked');
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [hw, subs] = await Promise.all([
        fetchHomeworkDetails(id),
        fetchHomeworkSubmissions(id),
      ]);
      setHomework(hw);
      setSubmissions(subs);
    } catch (err) {
      console.error('Error loading homework:', err);
      setError('Failed to load homework details');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedSubmission || !user?.id) return;
    setSaving(true);
    try {
      await updateSubmissionStatus(selectedSubmission.id, reviewAction, feedbackText, user.id);
      setSuccess(`Submission ${reviewAction === 'checked' ? 'approved' : 'returned'} successfully!`);
      setReviewModal(false);
      setSelectedSubmission(null);
      setFeedbackText('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to update submission');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHomework(id);
      router.push('/dashboard/homework');
    } catch (err: any) {
      setError(err.message || 'Failed to delete homework');
    }
  };

  if (loading) return <PageLoader />;
  if (!homework) return <div className="text-center py-12 text-gray-500">Homework not found</div>;

  const submittedCount = submissions.length;
  const checkedCount = submissions.filter((s) => s.status === 'checked').length;
  const returnedCount = submissions.filter((s) => s.status === 'returned').length;
  const pendingCount = submissions.filter((s) => s.status === 'submitted').length;
  const isOverdue = new Date(homework.due_date) < new Date();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/homework">
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="page-title">{homework.title}</h1>
            <p className="page-subtitle">
              {homework.subject} • {homework.batches?.name || 'Individual'} • Due: {formatDate(homework.due_date)}
              {isOverdue && <Badge variant="danger" className="ml-2">Overdue</Badge>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/homework/edit/${id}`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{submittedCount}</p>
              <p className="text-xs text-gray-500">Submitted</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><Check className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold text-green-600">{checkedCount}</p>
              <p className="text-xs text-gray-500">Checked</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg"><RotateCcw className="h-5 w-5 text-orange-600" /></div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{returnedCount}</p>
              <p className="text-xs text-gray-500">Returned</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
              <p className="text-xs text-gray-500">Pending Review</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'details' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
          }`}
        >
          <BookOpen className="h-4 w-4 inline mr-2" />Details
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'submissions' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
          }`}
        >
          <FileText className="h-4 w-4 inline mr-2" />Submissions ({submittedCount})
        </button>
      </div>

      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><h2 className="text-lg font-semibold">Assignment Details</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{homework.description || 'No description'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <p className="text-gray-900 mt-1">{homework.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Batch</label>
                  <p className="text-gray-900 mt-1">{homework.batches?.name || 'Individual'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Due Date</label>
                  <p className="text-gray-900 mt-1">{formatDate(homework.due_date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Assigned By</label>
                  <p className="text-gray-900 mt-1">
                    {homework.users?.first_name} {homework.users?.last_name}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Attachments */}
          <Card>
            <CardHeader><h2 className="text-lg font-semibold">Attachments</h2></CardHeader>
            <CardBody>
              {homework.homework_attachments?.length > 0 ? (
                <div className="space-y-3">
                  {homework.homework_attachments.map((att: any) => (
                    <a
                      key={att.id}
                      href={att.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Paperclip className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{att.file_name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(att.file_size)}</p>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No attachments</p>
              )}
            </CardBody>
          </Card>
        </div>
      ) : (
        /* Submissions */
        <Card>
          <CardBody className="p-0">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium">No submissions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-semibold text-sm">
                            {sub.students?.first_name?.charAt(0)}{sub.students?.last_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {sub.students?.first_name} {sub.students?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {sub.students?.student_id} • Submitted: {formatDate(sub.submitted_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          sub.status === 'checked' ? 'success' :
                          sub.status === 'returned' ? 'warning' : 'info'
                        }>
                          {sub.status}
                        </Badge>
                        {sub.status === 'submitted' && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setFeedbackText('');
                              setReviewModal(true);
                            }}
                          >
                            Review
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Submission content */}
                    {sub.submission_text && (
                      <div className="mt-3 ml-13 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{sub.submission_text}</p>
                      </div>
                    )}

                    {/* Submission attachments */}
                    {sub.submission_attachments && sub.submission_attachments.length > 0 && (
                      <div className="mt-2 ml-13 flex flex-wrap gap-2">
                        {sub.submission_attachments.map((att: any) => (
                          <a
                            key={att.id}
                            href={att.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg text-sm text-blue-700 hover:bg-blue-100"
                          >
                            <Paperclip className="h-3.5 w-3.5" />
                            {att.file_name}
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Feedback */}
                    {sub.feedback && (
                      <div className="mt-2 ml-13 p-3 bg-green-50 rounded-lg">
                        <p className="text-xs font-medium text-green-700 mb-1">Feedback:</p>
                        <p className="text-sm text-green-800">{sub.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Review Modal */}
      <Modal isOpen={reviewModal} onClose={() => setReviewModal(false)} title="Review Submission">
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-900">
                {selectedSubmission.students?.first_name} {selectedSubmission.students?.last_name}
              </p>
              {selectedSubmission.submission_text && (
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{selectedSubmission.submission_text}</p>
              )}
            </div>

            <Textarea
              label="Feedback"
              placeholder="Enter your feedback for the student..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={3}
            />

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setReviewModal(false)}>Cancel</Button>
              <Button
                variant="warning"
                onClick={() => { setReviewAction('returned'); handleReview(); }}
                loading={saving && reviewAction === 'returned'}
              >
                <RotateCcw className="h-4 w-4 mr-1" /> Return
              </Button>
              <Button
                variant="success"
                onClick={() => { setReviewAction('checked'); handleReview(); }}
                loading={saving && reviewAction === 'checked'}
              >
                <Check className="h-4 w-4 mr-1" /> Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Homework">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete &quot;{homework.title}&quot;? This will also delete all submissions.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
