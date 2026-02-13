'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DataTable, Button, Badge, PageLoader, Card, CardBody, Select, Modal, Input, Textarea, Alert } from '@/components/ui';
import { formatDate, formatFileSize } from '@/lib/utils';
import { FileText, Plus, Download, Eye, Upload, Book } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudyMaterial, Batch } from '@/types';

interface StudyMaterialWithBatch extends StudyMaterial {
  batches?: { name: string };
  users?: { first_name: string; last_name: string };
}

export default function StudyMaterialsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [materials, setMaterials] = useState<StudyMaterialWithBatch[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [filterBatch, setFilterBatch] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.institute_id) return;

      // Fetch batches (respecting role)
      let batchQuery = supabase
        .from('batches')
        .select('*')
        .eq('institute_id', user.institute_id)
        .eq('is_active', true);

      if (user.role === 'staff' || user.role === 'teacher') {
        const { data: assignments } = await supabase
          .from('batch_staff')
          .select('batch_id')
          .eq('staff_id', user.id);

        if (assignments && assignments.length > 0) {
          batchQuery = batchQuery.in('id', assignments.map((a) => a.batch_id));
        }
      }

      const { data: batchesData } = await batchQuery;
      setBatches(batchesData || []);

      // Fetch study materials
      let materialsQuery = supabase
        .from('study_materials')
        .select('*, batches(name), users(first_name, last_name)')
        .eq('institute_id', user.institute_id)
        .order('created_at', { ascending: false });

      if (filterBatch !== 'all') {
        materialsQuery = materialsQuery.eq('batch_id', filterBatch);
      } else if (user.role === 'staff' || user.role === 'teacher') {
        if (batchesData && batchesData.length > 0) {
          materialsQuery = materialsQuery.in('batch_id', batchesData.map((b) => b.id));
        }
      }

      const { data: materialsData } = await materialsQuery;
      setMaterials(materialsData || []);
      setLoading(false);
    }

    fetchData();
  }, [supabase, user, filterBatch]);

  const getFileTypeIcon = (fileType: string | null) => {
    if (!fileType) return 'file';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊';
    return '📁';
  };

  if (loading) {
    return <PageLoader />;
  }

  const columns = [
    {
      key: 'title',
      header: 'Material',
      render: (material: StudyMaterialWithBatch) => (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getFileTypeIcon(material.file_type)}</span>
          <div>
            <p className="font-medium text-gray-900">{material.title}</p>
            <p className="text-sm text-gray-500 truncate max-w-xs">{material.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      render: (material: StudyMaterialWithBatch) => (
        <Badge variant="secondary">{material.subject || 'General'}</Badge>
      ),
    },
    {
      key: 'batch',
      header: 'Batch',
      render: (material: StudyMaterialWithBatch) => material.batches?.name || '-',
    },
    {
      key: 'file_size',
      header: 'Size',
      render: (material: StudyMaterialWithBatch) => 
        material.file_size ? formatFileSize(material.file_size) : '-',
    },
    {
      key: 'created_by',
      header: 'Uploaded By',
      render: (material: StudyMaterialWithBatch) =>
        material.users ? `${material.users.first_name} ${material.users.last_name}` : '-',
    },
    {
      key: 'created_at',
      header: 'Uploaded',
      render: (material: StudyMaterialWithBatch) => formatDate(material.created_at),
    },
    {
      key: 'actions',
      header: '',
      render: (material: StudyMaterialWithBatch) => (
        <div className="flex items-center gap-2">
          {material.file_url && (
            <a
              href={material.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-4 w-4 text-gray-600" />
            </a>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">{materials.length} materials uploaded</p>
        </div>
        <Link href="/dashboard/study-materials/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Material
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <Book className="h-5 w-5 text-gray-400" />
            <Select
              value={filterBatch}
              onChange={(e) => setFilterBatch(e.target.value)}
              options={[
                { value: 'all', label: 'All Batches' },
                ...batches.map((b) => ({ value: b.id, label: b.name })),
              ]}
            />
          </div>
        </CardBody>
      </Card>

      <DataTable
        data={materials}
        columns={columns}
        searchable
        searchPlaceholder="Search materials..."
        onRowClick={(material) => router.push(`/dashboard/study-materials/${material.id}`)}
        emptyMessage="No study materials found"
      />
    </div>
  );
}
