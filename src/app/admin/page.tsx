'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Download,
  RefreshCw,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

interface RegistrationStats {
  total: number;
  today: number;
  thisWeek: number;
  collegeStats: Record<string, number>;
  recentRegistrations: Array<{
    registrationNumber: number;
    name: string;
    email: string;
    phone: string;
    college: string;
    timestamp: string;
    source: string;
  }>;
}

export default function AdminPage() {
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/webinar-registration');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const downloadCSV = () => {
    if (!stats) return;
    
    const csvContent = [
      ['Registration Number', 'Name', 'Email', 'Phone', 'College', 'Timestamp', 'Source'],
      ...stats.recentRegistrations.map(reg => [
        reg.registrationNumber.toString(),
        reg.name,
        reg.email,
        reg.phone,
        reg.college,
        reg.timestamp,
        reg.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webinar-registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white">Loading registration data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Webinar Registrations</h1>
            <p className="text-gray-300">Manage and view student registrations</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={fetchStats}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Registrations</p>
                <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Today</p>
                <p className="text-3xl font-bold text-white">{stats?.today || 0}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">This Week</p>
                <p className="text-3xl font-bold text-white">{stats?.thisWeek || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* College Stats */}
        {stats?.collegeStats && Object.keys(stats.collegeStats).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Registrations by College
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(stats.collegeStats)
                .sort(([,a], [,b]) => b - a)
                .map(([college, count]) => (
                  <div key={college} className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm">{college}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Recent Registrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Recent Registrations</h3>
          
          {stats?.recentRegistrations && stats.recentRegistrations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-gray-300 py-3 px-4">#</th>
                    <th className="text-left text-gray-300 py-3 px-4">Name</th>
                    <th className="text-left text-gray-300 py-3 px-4">Email</th>
                    <th className="text-left text-gray-300 py-3 px-4">Phone</th>
                    <th className="text-left text-gray-300 py-3 px-4">College</th>
                    <th className="text-left text-gray-300 py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRegistrations.map((reg, index) => (
                    <tr key={reg.registrationNumber} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3 px-4 text-blue-400 font-mono">
                        #{reg.registrationNumber}
                      </td>
                      <td className="py-3 px-4 text-white font-medium">
                        {reg.name}
                      </td>
                      <td className="py-3 px-4 text-gray-300 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {reg.email}
                      </td>
                      <td className="py-3 px-4 text-gray-300 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {reg.phone}
                      </td>
                      <td className="py-3 px-4 text-gray-300">
                        {reg.college}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(reg.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No registrations yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
