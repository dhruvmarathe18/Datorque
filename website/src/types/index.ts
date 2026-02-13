// User Roles
export type UserRole = 'super_admin' | 'coaching_admin' | 'staff' | 'student' | 'teacher';

// Allowed roles for web portal
export const WEB_ALLOWED_ROLES: UserRole[] = ['super_admin', 'coaching_admin', 'staff', 'teacher'];

export interface User {
  id: string;
  email: string;
  role: UserRole;
  institute_id: string | null;
  is_active: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

export interface Institute {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  contact_person: string;
  subscription_status: 'active' | 'inactive' | 'trial' | 'suspended' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  email: string;
  role: string;
  institute_id: string | null;
  is_active: boolean;
  created_at: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  designation?: string;
  subjects?: string[];
  salary?: number;
  joining_date?: string;
  generated_password?: string;
  batches?: Batch[];
}

export interface Student {
  id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  parent_name: string;
  parent_phone: string;
  parent_email: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  institute_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  generated_password?: string;
  batches?: Batch[];
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  start_date: string;
  end_date: string | null;
  institute_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  student_count?: number;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  remarks: string | null;
  institute_id: string;
  created_at: string;
  updated_at?: string;
  students?: {
    first_name: string;
    last_name: string;
    student_id: string;
  };
  batches?: {
    name: string;
  };
}

export interface FeePayment {
  id: string;
  student_id: string;
  batch_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  paid_date: string | null;
  payment_method: string | null;
  institute_id: string;
  created_at: string;
  updated_at: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  batch_id: string | null;
  student_id: string | null;
  institute_id: string;
  assigned_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  homework_attachments?: HomeworkAttachment[];
  homework_submissions?: HomeworkSubmission[];
  batches?: {
    name: string;
  };
  students?: {
    first_name: string;
    last_name: string;
    student_id: string;
  };
}

export interface HomeworkAttachment {
  id: string;
  homework_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface HomeworkSubmission {
  id: string;
  homework_id: string;
  student_id: string;
  submission_text: string | null;
  attachments: HomeworkSubmissionAttachment[];
  submitted_at: string;
  status: 'submitted' | 'checked' | 'returned';
  feedback: string | null;
  checked_at: string | null;
  checked_by: string | null;
  students?: {
    first_name: string;
    last_name: string;
    student_id: string;
  };
}

export interface HomeworkSubmissionAttachment {
  id: string;
  submission_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  subject: string;
  priority: 'normal' | 'important' | 'urgent';
  type: 'general' | 'academic' | 'fee' | 'event' | 'emergency';
  attachments: NoticeAttachment[];
  audience_type: 'all' | 'batch' | 'individual';
  audience_ids: string[];
  start_date: string;
  end_date: string;
  institute_id: string;
  created_by: string;
  is_active: boolean;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  view_count?: number;
}

export interface NoticeAttachment {
  id: string;
  notice_id: string;
  file_name: string;
  file_url: string;
  file_type: 'pdf' | 'doc' | 'docx' | 'image' | 'other';
  file_size: number;
  cloudinary_public_id: string;
  created_at: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  category: 'notes' | 'video' | 'document' | 'presentation' | 'other';
  batch_id: string | null;
  student_id: string | null;
  institute_id: string;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  study_material_attachments?: StudyMaterialAttachment[];
  batches?: {
    name: string;
  };
}

export interface StudyMaterialAttachment {
  id: string;
  study_material_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Chat {
  id: string;
  name: string;
  type: 'personal' | 'group';
  description?: string;
  institute_id: string;
  created_by: string;
  is_active: boolean;
  is_muted: boolean;
  allow_replies: boolean;
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
  unread_count?: number;
  participants?: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message_type: 'text' | 'file' | 'announcement';
  content: string;
  file_attachments?: ChatFileAttachment[];
  is_announcement: boolean;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  sender?: {
    id: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface ChatFileAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: 'pdf' | 'doc' | 'docx' | 'image' | 'video' | 'audio' | 'other';
  file_size: number;
  cloudinary_public_id: string;
  created_at: string;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  student_id?: string;
  role: 'admin' | 'member';
  joined_at: string;
  last_read_at?: string;
  is_muted: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    first_name?: string;
    last_name?: string;
  };
  student?: {
    id: string;
    first_name: string;
    last_name: string;
    student_id: string;
  };
}

export interface DashboardStats {
  totalStudents: number;
  activeBatches: number;
  todayAttendance: number;
  pendingFees: number;
  monthlyRevenue: number;
  recentActivity: number;
}

export interface SuperAdminDashboardStats {
  totalInstitutes: number;
  activeInstitutes: number;
  totalAdmins: number;
  totalStudents: number;
  monthlyRevenue: number;
  trialInstitutes: number;
}
