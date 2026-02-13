'use client';

import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboard } from '@/components/portal/dashboards/SuperAdminDashboard';
import { CoachingAdminDashboard } from '@/components/portal/dashboards/CoachingAdminDashboard';
import { StaffDashboard } from '@/components/portal/dashboards/StaffDashboard';
import { PageLoader } from '@/components/portal/ui';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'coaching_admin':
      return <CoachingAdminDashboard />;
    case 'staff':
    case 'teacher':
      return <StaffDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-500 mt-2">You don&apos;t have permission to access this page.</p>
        </div>
      );
  }
}
