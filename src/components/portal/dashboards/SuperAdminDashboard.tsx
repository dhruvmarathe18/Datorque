'use client';

import { useEffect, useState } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StatCard, Card, CardHeader, CardBody, Badge, PageLoader } from '@/components/portal/ui';
import { formatCurrency, formatDate, getSubscriptionStatusColor } from '@/lib/utils';
import { Building2, Users, GraduationCap, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  totalInstitutes: number;
  activeInstitutes: number;
  trialInstitutes: number;
  totalAdmins: number;
  totalStudents: number;
  monthlyRevenue: number;
}

interface RecentInstitute {
  id: string;
  name: string;
  subscription_status: string;
  created_at: string;
}

export function SuperAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInstitutes, setRecentInstitutes] = useState<RecentInstitute[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseClient();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch institutes count
        const { count: totalInstitutes } = await supabase
          .from('institutes')
          .select('*', { count: 'exact', head: true });

        const { count: activeInstitutes } = await supabase
          .from('institutes')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'active');

        const { count: trialInstitutes } = await supabase
          .from('institutes')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'trial');

        // Fetch admins count
        const { count: totalAdmins } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'coaching_admin');

        // Fetch total students
        const { count: totalStudents } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true });

        // Fetch recent institutes
        const { data: institutes } = await supabase
          .from('institutes')
          .select('id, name, subscription_status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalInstitutes: totalInstitutes || 0,
          activeInstitutes: activeInstitutes || 0,
          trialInstitutes: trialInstitutes || 0,
          totalAdmins: totalAdmins || 0,
          totalStudents: totalStudents || 0,
          monthlyRevenue: 0, // Would need fee tracking
        });

        setRecentInstitutes(institutes || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [supabase]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Super Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the entire platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Institutes"
          value={stats?.totalInstitutes || 0}
          icon={<Building2 className="h-6 w-6" />}
        />
        <StatCard
          title="Active Institutes"
          value={stats?.activeInstitutes || 0}
          icon={<CheckCircle className="h-6 w-6" />}
          change={`${stats?.trialInstitutes || 0} on trial`}
          changeType="neutral"
        />
        <StatCard
          title="Total Admins"
          value={stats?.totalAdmins || 0}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Students"
          value={stats?.totalStudents?.toLocaleString() || 0}
          icon={<GraduationCap className="h-6 w-6" />}
        />
      </div>

      {/* Quick Actions & Recent Institutes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/dashboard/institutes/new"
                className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors group"
              >
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <Building2 className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Institute</p>
                  <p className="text-sm text-gray-500">Add a coaching center</p>
                </div>
              </Link>
              <Link
                href="/dashboard/admins/new"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Admin</p>
                  <p className="text-sm text-gray-500">Create admin account</p>
                </div>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* Recent Institutes */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Institutes</h2>
            <Link href="/dashboard/institutes" className="text-sm text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-gray-100">
              {recentInstitutes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No institutes yet</p>
              ) : (
                recentInstitutes.map((institute) => (
                  <Link
                    key={institute.id}
                    href={`/dashboard/institutes/${institute.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{institute.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(institute.created_at)}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        institute.subscription_status === 'active'
                          ? 'success'
                          : institute.subscription_status === 'trial'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {institute.subscription_status}
                    </Badge>
                  </Link>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
