'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  BookOpen,
  Calendar,
  IndianRupee,
  Bell,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  Layers,
  ClipboardList,
  BarChart3,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
}

const navigationItems: NavItem[] = [
  // Super Admin Navigation
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['super_admin', 'coaching_admin', 'staff', 'teacher'] },
  { name: 'Institutes', href: '/dashboard/institutes', icon: Building2, roles: ['super_admin'] },
  { name: 'Admins', href: '/dashboard/admins', icon: Users, roles: ['super_admin'] },
  
  // Coaching Admin & Staff Navigation
  { name: 'Students', href: '/dashboard/students', icon: GraduationCap, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Batches', href: '/dashboard/batches', icon: Layers, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Staff', href: '/dashboard/staff', icon: Users, roles: ['coaching_admin'] },
  { name: 'Attendance', href: '/dashboard/attendance', icon: ClipboardList, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Fees', href: '/dashboard/fees', icon: IndianRupee, roles: ['coaching_admin'] },
  { name: 'Homework', href: '/dashboard/homework', icon: BookOpen, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Tests', href: '/dashboard/tests', icon: FileText, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Study Materials', href: '/dashboard/study-materials', icon: FileText, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Notices', href: '/dashboard/notices', icon: Bell, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Chat', href: '/dashboard/chat', icon: MessageSquare, roles: ['coaching_admin', 'staff', 'teacher'] },
  { name: 'Reports', href: '/dashboard/reports', icon: BarChart3, roles: ['coaching_admin'] },
  
  // Common
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['super_admin', 'coaching_admin'] },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredNavItems = navigationItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'coaching_admin':
        return 'Institute Admin';
      case 'staff':
      case 'teacher':
        return 'Staff';
      default:
        return role;
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Coaching CMS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn('sidebar-item', isActive && 'active')}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-100 p-4">
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {getInitials(user?.first_name, user?.last_name)}
              </span>
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.email}
              </div>
              <div className="text-xs text-gray-500">{getRoleLabel(user?.role || '')}</div>
            </div>
            <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isProfileOpen && 'rotate-180')} />
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-fade-in">
              <Link
                href="/dashboard/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <UserCircle className="h-4 w-4" />
                My Profile
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Coaching CMS</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
