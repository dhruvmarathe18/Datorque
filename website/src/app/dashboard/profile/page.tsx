'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Alert, Avatar } from '@/components/ui';
import { User, Mail, Phone, Building, Save, Camera, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const supabase = getSupabaseClient();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setSuccess('Profile updated successfully!');
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setPasswordSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    coaching_admin: 'Coaching Admin',
    staff: 'Staff',
    teacher: 'Teacher',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account settings</p>
      </div>

      {/* Profile Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar
                name={`${user?.first_name || ''} ${user?.last_name || ''}`}
                size="xl"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-2">
                  {roleLabels[user?.role || ''] || user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                leftIcon={<User className="h-4 w-4" />}
              />
              <Input
                label="Last Name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                leftIcon={<User className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                value={user?.email || ''}
                disabled
                leftIcon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </div>

            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              leftIcon={<Building className="h-4 w-4" />}
            />

            <div className="flex justify-end">
              <Button type="submit" loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 rounded-lg">
              <Lock className="h-5 w-5 text-warning-600" />
            </div>
            <h2 className="text-lg font-semibold">Change Password</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            {passwordError && <Alert type="error" message={passwordError} onClose={() => setPasswordError('')} />}
            {passwordSuccess && <Alert type="success" message={passwordSuccess} onClose={() => setPasswordSuccess('')} />}

            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Enter new password"
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              required
            />

            <div className="flex justify-end">
              <Button type="submit" variant="warning" loading={changingPassword}>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
