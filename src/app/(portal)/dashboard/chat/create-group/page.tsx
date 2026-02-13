'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardBody, Button, Input, Textarea, Alert, Select, PageLoader } from '@/components/portal/ui';
import { ArrowLeft, Users, Search, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Batch } from '@/types/portal';

interface SelectableUser {
  id: string;
  first_name: string;
  last_name: string;
  role: string;
  selected: boolean;
}

export default function CreateChatGroupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = getSupabaseClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [batchId, setBatchId] = useState('');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [autoAdd, setAutoAdd] = useState<'none' | 'batch' | 'all'>('none');

  useEffect(() => {
    async function fetchData() {
      if (!user?.institute_id) return;

      const { data: batchesData } = await supabase.from('batches').select('*').eq('institute_id', user.institute_id).eq('is_active', true).order('name');
      setBatches(batchesData || []);

      const { data: staffData } = await supabase.from('users').select('id, first_name, last_name, role').eq('institute_id', user.institute_id).in('role', ['staff', 'teacher', 'coaching_admin']);
      setUsers((staffData || []).map((u: any) => ({ ...u, selected: false })));
      setLoading(false);
    }
    fetchData();
  }, [user?.institute_id]);

  const toggleUser = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, selected: !u.selected } : u));
  };

  const selectAll = () => setUsers((prev) => prev.map((u) => ({ ...u, selected: true })));
  const deselectAll = () => setUsers((prev) => prev.map((u) => ({ ...u, selected: false })));

  const handleCreate = async () => {
    if (!user?.institute_id || !name.trim()) { setError('Group name is required'); return; }
    setSaving(true); setError('');
    try {
      const { data: chat, error: e1 } = await (supabase.from('chats') as any).insert({
        name: name.trim(), description: description.trim() || null, type: 'group',
        institute_id: user.institute_id, batch_id: batchId || null, created_by: user.id,
      }).select().single();
      if (e1) throw e1;

      // Add creator as participant
      const participants: any[] = [{ chat_id: chat.id, user_id: user.id, role: 'admin' }];

      // Add selected users
      const selectedUsers = users.filter((u) => u.selected && u.id !== user.id);
      selectedUsers.forEach((u) => participants.push({ chat_id: chat.id, user_id: u.id, role: 'member' }));

      if (participants.length > 0) {
        const { error: e2 } = await (supabase.from('chat_participants') as any).insert(participants);
        if (e2) throw e2;
      }

      router.push('/dashboard/chat');
    } catch (err: any) { setError(err.message || 'Failed to create group'); }
    finally { setSaving(false); }
  };

  const filteredUsers = users.filter((u) =>
    !searchQuery || `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount = users.filter((u) => u.selected).length;

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/chat"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button></Link>
        <div><h1 className="page-title">Create Group Chat</h1><p className="page-subtitle">Set up a new chat group</p></div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card><CardHeader><h2 className="text-lg font-semibold">Group Details</h2></CardHeader>
            <CardBody><div className="space-y-4">
              <Input label="Group Name *" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Batch A Discussion" />
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe this group..." rows={3} />
              <Select label="Link to Batch (Optional)" value={batchId} onChange={(e) => setBatchId(e.target.value)} options={[{ value: '', label: 'No batch' }, ...batches.map((b) => ({ value: b.id, label: b.name }))]} />
            </div></CardBody></Card>
        </div>

        <div className="space-y-6">
          <Card><CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Add Members ({selectedCount})</h2>
            <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={selectAll}>All</Button><Button size="sm" variant="ghost" onClick={deselectAll}>None</Button></div>
          </CardHeader>
            <CardBody>
              <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search members..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-10" /></div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {filteredUsers.map((u) => (
                  <button key={u.id} onClick={() => toggleUser(u.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${u.selected ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'}`}>
                    <div className={`w-6 h-6 rounded border flex items-center justify-center ${u.selected ? 'bg-primary-600 border-primary-600 text-white' : 'border-gray-300'}`}>
                      {u.selected && <Check className="h-4 w-4" />}
                    </div>
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center"><span className="text-primary-600 text-xs font-semibold">{u.first_name[0]}{u.last_name[0]}</span></div>
                    <div><p className="text-sm font-medium">{u.first_name} {u.last_name}</p><p className="text-xs text-gray-500 capitalize">{u.role.replace('_', ' ')}</p></div>
                  </button>
                ))}
                {filteredUsers.length === 0 && <p className="text-center text-gray-500 py-4">No members found</p>}
              </div>
            </CardBody></Card>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link href="/dashboard/chat"><Button variant="secondary">Cancel</Button></Link>
        <Button onClick={handleCreate} loading={saving} disabled={!name.trim()}>
          <Users className="h-4 w-4 mr-2" /> Create Group
        </Button>
      </div>
    </div>
  );
}
