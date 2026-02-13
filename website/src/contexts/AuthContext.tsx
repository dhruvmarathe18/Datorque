'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { User, UserRole, WEB_ALLOWED_ROLES } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  isAllowedRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ success: false }),
  signOut: async () => {},
  isAllowedRole: () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = getSupabaseClient();

  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, institute_id, is_active, first_name, last_name, phone, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        return null;
      }

      // Block students and parents from web
      if (data.role === 'student' || data.role === 'parent') {
        router.push('/not-allowed');
        return null;
      }

      // Block inactive users
      if (!data.is_active) {
        router.push('/not-allowed');
        return null;
      }

      const userData: User = {
        id: data.id,
        email: data.email,
        role: data.role,
        institute_id: data.institute_id,
        is_active: data.is_active,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        created_at: data.created_at,
      };

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUser(null);
      return null;
    }
  }, [supabase, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchUserData, router]);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userData = await fetchUserData(data.user.id);
        
        if (!userData) {
          await supabase.auth.signOut();
          return { success: false, error: 'Access denied. Students can only use the mobile app.' };
        }

        // Check if role is allowed for web
        if (!WEB_ALLOWED_ROLES.includes(userData.role)) {
          await supabase.auth.signOut();
          return { success: false, error: 'Access denied. Your role is not allowed to access the web portal.' };
        }

        return { success: true };
      }

      return { success: false, error: 'An unexpected error occurred' };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const isAllowedRole = (role: UserRole): boolean => {
    return WEB_ALLOWED_ROLES.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAllowedRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
