'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Card, CardBody, Button, Input, Avatar, PageLoader, Alert } from '@/components/ui';
import { formatDate, formatTime } from '@/lib/utils';
import { Send, Search, Users, ArrowLeft, Paperclip, Image, X, Loader2 } from 'lucide-react';
import { Chat, User } from '@/types';
import { CLOUDINARY_CONFIG } from '@/lib/cloudinary';

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'image' | 'file';
  file_url?: string;
  file_name?: string;
  created_at: string;
  sender?: User;
}

interface ChatWithDetails extends Chat {
  last_message?: string;
  last_message_at?: string;
  other_user?: User;
  unread_count?: number;
}

export default function ChatPage() {
  const { user } = useAuth();
  const supabase = getSupabaseClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatWithDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Fetch chats
  useEffect(() => {
    async function fetchChats() {
      if (!user) return;

      // Fetch chats where user is a participant
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .contains('participant_ids', [user.id])
        .order('updated_at', { ascending: false });

      if (chatError) {
        console.error('Error fetching chats:', chatError);
        setLoading(false);
        return;
      }

      // Enrich chats with other user info
      const enrichedChats = await Promise.all(
        (chatData || []).map(async (chat) => {
          const otherUserId = chat.participant_ids?.find((id: string) => id !== user.id);
          let otherUser = null;

          if (otherUserId && !chat.is_group) {
            const { data: userData } = await supabase
              .from('users')
              .select('id, first_name, last_name, email, role')
              .eq('id', otherUserId)
              .single();
            otherUser = userData;
          }

          return {
            ...chat,
            other_user: otherUser,
          };
        })
      );

      setChats(enrichedChats);
      setLoading(false);
    }

    fetchChats();
  }, [supabase, user]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    async function fetchMessages() {
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('*, sender:users(id, first_name, last_name, email, role)')
        .eq('chat_id', selectedChat.id)
        .order('created_at', { ascending: true });

      setMessages(messagesData || []);
    }

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${selectedChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `chat_id=eq.${selectedChat.id}`,
        },
        async (payload) => {
          // Fetch sender info
          const { data: sender } = await supabase
            .from('users')
            .select('id, first_name, last_name, email, role')
            .eq('id', payload.new.sender_id)
            .single();

          setMessages((prev) => [...prev, { ...payload.new, sender } as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat, supabase]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string, contentType: 'text' | 'image' | 'file' = 'text', fileUrl?: string, fileName?: string) => {
    if (!selectedChat || !user || (!content.trim() && !fileUrl)) return;

    setSendingMessage(true);
    setError('');

    try {
      const { error: sendError } = await supabase.from('chat_messages').insert([{
        chat_id: selectedChat.id,
        sender_id: user.id,
        content: content || (contentType === 'image' ? '📷 Image' : '📎 File'),
        content_type: contentType,
        file_url: fileUrl,
        file_name: fileName,
      }]);

      if (sendError) throw sendError;

      // Update chat's updated_at
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setNewMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', 'chat_files');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const isImage = file.type.startsWith('image/');
      
      await sendMessage('', isImage ? 'image' : 'file', data.secure_url, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    if (chat.is_group) {
      return chat.group_name?.toLowerCase().includes(searchLower);
    }
    return (
      chat.other_user?.first_name?.toLowerCase().includes(searchLower) ||
      chat.other_user?.last_name?.toLowerCase().includes(searchLower) ||
      chat.other_user?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="h-[calc(100vh-8rem)] animate-fade-in">
      <div className="flex h-full gap-4">
        {/* Chat List */}
        <div className={`w-full md:w-80 flex-shrink-0 ${selectedChat ? 'hidden md:flex' : 'flex'} flex-col`}>
          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold mb-3">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No conversations found</div>
              ) : (
                filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b ${
                      selectedChat?.id === chat.id ? 'bg-primary-50' : ''
                    }`}
                  >
                    {chat.is_group ? (
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary-600" />
                      </div>
                    ) : (
                      <Avatar
                        name={`${chat.other_user?.first_name || ''} ${chat.other_user?.last_name || ''}`}
                        size="lg"
                      />
                    )}
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {chat.is_group
                          ? chat.group_name
                          : `${chat.other_user?.first_name || ''} ${chat.other_user?.last_name || ''}`}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{chat.last_message || 'No messages yet'}</p>
                    </div>
                    {chat.last_message_at && (
                      <span className="text-xs text-gray-400">{formatTime(chat.last_message_at)}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className={`flex-1 ${!selectedChat ? 'hidden md:flex' : 'flex'} flex-col`}>
          {selectedChat ? (
            <Card className="flex-1 flex flex-col overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                {selectedChat.is_group ? (
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                ) : (
                  <Avatar
                    name={`${selectedChat.other_user?.first_name || ''} ${selectedChat.other_user?.last_name || ''}`}
                    size="md"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedChat.is_group
                      ? selectedChat.group_name
                      : `${selectedChat.other_user?.first_name || ''} ${selectedChat.other_user?.last_name || ''}`}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {selectedChat.other_user?.role || 'Group Chat'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((message) => {
                    const isOwnMessage = message.sender_id === user?.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-primary-600 text-white rounded-br-md'
                              : 'bg-gray-100 text-gray-900 rounded-bl-md'
                          }`}
                        >
                          {!isOwnMessage && selectedChat.is_group && (
                            <p className="text-xs font-medium mb-1 opacity-75">
                              {message.sender?.first_name} {message.sender?.last_name}
                            </p>
                          )}
                          {message.content_type === 'image' && message.file_url ? (
                            <a href={message.file_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={message.file_url}
                                alt="Shared image"
                                className="max-w-full rounded-lg"
                              />
                            </a>
                          ) : message.content_type === 'file' && message.file_url ? (
                            <a
                              href={message.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 ${isOwnMessage ? 'text-white' : 'text-primary-600'}`}
                            >
                              <Paperclip className="h-4 w-4" />
                              <span className="underline">{message.file_name || 'Download File'}</span>
                            </a>
                          ) : (
                            <p>{message.content}</p>
                          )}
                          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-400'}`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <Paperclip className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(newMessage)}
                    placeholder="Type a message..."
                    className="flex-1 input"
                    disabled={sendingMessage || uploading}
                  />
                  <Button
                    onClick={() => sendMessage(newMessage)}
                    disabled={!newMessage.trim() || sendingMessage || uploading}
                    loading={sendingMessage}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">Select a conversation</p>
                <p className="text-sm">Choose a chat from the list to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
