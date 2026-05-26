import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { profileService, UserProfile } from '../services/profileService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (uid: string, userEmail: string, userFullName?: string) => {
    try {
      let userProfile = await profileService.getUserProfile(uid);
      
      // Auto-create profile if missing (self-healing architecture)
      if (!userProfile) {
        userProfile = await profileService.createUserProfile({
          auth_user_id: uid,
          full_name: userFullName || userEmail.split('@')[0] || 'Nomzod',
          email: userEmail,
          role: 'user',
          premium_status: false,
          onboarding_completed: false
        });
      }
      
      setProfile(userProfile);
    } catch (err) {
      console.error('Failed to fetch/create user profile:', err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!isMounted) return;
      
      setSession(initialSession);
      setUser(initialSession?.user || null);
      
      if (initialSession?.user) {
        fetchProfile(
          initialSession.user.id, 
          initialSession.user.email || '',
          initialSession.user.user_metadata?.full_name
        ).finally(() => {
          if (isMounted) setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;
      
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        setLoading(true);
        await fetchProfile(
          currentSession.user.id, 
          currentSession.user.email || '',
          currentSession.user.user_metadata?.full_name
        );
        if (isMounted) setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email || '');
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Kirishda xatolik yuz berdi.' };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Explicitly create user profile immediately to avoid latency issues
        const newProfile = await profileService.createUserProfile({
          auth_user_id: data.user.id,
          full_name: fullName,
          email: email,
          role: 'user',
          premium_status: false,
          onboarding_completed: false
        });
        setProfile(newProfile);
      }
      
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Ro\'yxatdan o\'tishda xatolik yuz berdi.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login'
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Parolni tiklash so\'rovida xatolik yuz berdi.' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      login,
      signup,
      logout,
      resetPassword,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
