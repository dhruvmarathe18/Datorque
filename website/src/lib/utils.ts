import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  return format(d, 'MMM dd, yyyy hh:mm a');
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  const d = new Date(date);
  
  if (isToday(d)) {
    return format(d, 'hh:mm a');
  }
  if (isYesterday(d)) {
    return 'Yesterday';
  }
  return format(d, 'MMM dd');
}

export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return '-';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return '-';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return first + last || '??';
}

export function generatePassword(length: number = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
    case 'present':
    case 'paid':
    case 'checked':
      return 'text-green-600 bg-green-50';
    case 'inactive':
    case 'absent':
    case 'overdue':
      return 'text-red-600 bg-red-50';
    case 'pending':
    case 'late':
    case 'trial':
      return 'text-yellow-600 bg-yellow-50';
    case 'suspended':
    case 'expired':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

export function getSubscriptionStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'trial':
      return 'bg-blue-100 text-blue-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'important':
      return 'bg-orange-100 text-orange-800';
    case 'normal':
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function calculateAttendancePercentage(present: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}
