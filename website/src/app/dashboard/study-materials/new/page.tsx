'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Alert } from '@/components/ui';
import { ArrowLeft, FileText, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Batch } from '@/types';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';

export default function NewStudyMaterialPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [batches, setBatches] = useState<Batch[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    batch_id: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    async function fetchBatches() {
      if (!user?.institute_id) return;

      let query = supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true)
        .order('name');

      if (user.role === 'staff' || user.role === 'teacher') {
        const { data: assignments } = await supabase
          .from('batch_staff')
          .select('batch_id')
          .eq('staff_id', user.id);

        if (assignments && assignments.length > 0) {
          query = query.in('id', assignments.map((a) => a.batch_id));
        }
      }

      const { data } = await query;
      setBatches(data || []);
      if (data && data.length > 0) {
        setFormData((prev) => ({ ...prev, batch_id: data[0].id }));
      }
    }

    fetchBatches();
  }, [supabase, user]);

  const uploadToCloudinary = async (file: File): Promise<{ url: string; size: number; type: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', `study_materials/${user?.institute_id}`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
      { method: 'POST', body: formData }
    );

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      size: data.bytes,
      type: data.format || file.type,
    };
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Max 50MB
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      if (!formData.title) {
        setFormData((prev) => ({ ...prev, title: selectedFile.name.replace(/\.[^/.]+$/, '') }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let fileData = { url: '', size: 0, type: '' };

      if (file) {
        setUploading(true);
        fileData = await uploadToCloudinary(file);
        setUploading(false);
      }

      const { error: insertError } = await supabase.from('study_materials').insert([{
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        batch_id: formData.batch_id,
        file_url: fileData.url || null,
        file_size: fileData.size || null,
        file_type: fileData.type || null,
        institute_id: user?.institute_id,
        uploaded_by: user?.id,
      }]);

      if (insertError) throw insertError;

      setSuccess('Study material uploaded successfully!');
      setTimeout(() => router.push('/dashboard/study-materials'), 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to upload study material');
      setUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/study-materials" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="page-title">Upload Study Material</h1>
          <p className="page-subtitle">Share learning resources with students</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="h-5 w-5 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold">Material Details</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  file ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, DOC, PPT, Images, Videos (max 50MB)</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
              />
            </div>

            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Chapter 5 Notes"
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the material..."
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Physics"
              />

              <Select
                label="Batch *"
                value={formData.batch_id}
                onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
                options={batches.map((b) => ({ value: b.id, label: b.name }))}
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Link href="/dashboard/study-materials">
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button type="submit" loading={loading || uploading} disabled={!formData.title || !formData.batch_id}>
                {uploading ? 'Uploading...' : 'Upload Material'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
