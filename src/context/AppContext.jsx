import React, { createContext, useContext, useState, useEffect } from 'react';
import challengesData from '../data/challenges.json';
import mockExamsData from '../data/mockExams.json';
import { useAuth } from './AuthContext';
import { profileService } from '../services/profileService';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Supabase Auth Context Integration
  const { user: supabaseUser, profile, loading: authLoading, login: supabaseLogin, signup: supabaseSignup, logout: supabaseLogout, refreshProfile } = useAuth();

  // Local storage lists acting as local mock database for MVP
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem('speakora_completed_challenges');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedExams, setCompletedExams] = useState(() => {
    const saved = localStorage.getItem('speakora_completed_exams');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('speakora_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [allUsers, setAllUsers] = useState(() => {
    const saved = localStorage.getItem('speakora_all_users');
    // Seed with a default admin account and some mock users
    return saved ? JSON.parse(saved) : [
      { id: 'admin-id', email: 'admin@speakora.uz', full_name: 'Admin Speakora', role: 'admin', subscription_status: 'premium' },
      { id: 'mock-user-1', email: 'student@speakora.uz', full_name: 'Jasur Alimov', role: 'user', subscription_status: 'free' }
    ];
  });

  // Derive user object for backward compatibility with existing views/routes
  const user = React.useMemo(() => {
    if (!profile) return null;
    return {
      id: profile.auth_user_id,
      email: profile.email,
      full_name: profile.full_name,
      role: profile.role,
      subscription_status: profile.premium_status ? 'premium' : (payments.find(p => p.user_id === profile.auth_user_id && p.status === 'pending') ? 'pending' : 'free')
    };
  }, [profile, payments]);

  // Sync derived user to allUsers list & localStorage for backward compatibility
  useEffect(() => {
    if (user) {
      localStorage.setItem('speakora_user', JSON.stringify(user));
      setAllUsers(prev => {
        const index = prev.findIndex(u => u.id === user.id);
        if (index === -1) {
          return [...prev, user];
        } else {
          const copy = [...prev];
          copy[index] = { ...copy[index], ...user };
          return copy;
        }
      });
    } else {
      localStorage.removeItem('speakora_user');
    }
  }, [user]);

  // Synchronized setter for updating user status/role in Supabase
  const setUser = async (updatedUser) => {
    if (profile && updatedUser) {
      try {
        const premium_status = updatedUser.subscription_status === 'premium';
        await profileService.updateUserProfile(profile.auth_user_id, {
          premium_status,
          role: updatedUser.role
        });
        await refreshProfile();
      } catch (err) {
        console.error("Failed to update user profile in setUser wrapper:", err);
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('speakora_completed_challenges', JSON.stringify(completedChallenges));
  }, [completedChallenges]);

  useEffect(() => {
    localStorage.setItem('speakora_completed_exams', JSON.stringify(completedExams));
  }, [completedExams]);

  useEffect(() => {
    localStorage.setItem('speakora_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('speakora_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Auth Operations mapped directly to Supabase client
  const login = async (email, password) => {
    const res = await supabaseLogin(email, password);
    if (res.success) {
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  const signup = async (email, password, fullName) => {
    const res = await supabaseSignup(email, password, fullName);
    if (res.success) {
      return { success: true };
    } else {
      return { success: false, error: res.error };
    }
  };

  const logout = async () => {
    await supabaseLogout();
  };

  // Payment Operations
  const submitPayment = async (receiptBase64) => {
    if (!user) return { success: false, error: 'Tizimga kiring' };
    
    const newPayment = {
      id: 'pay_' + Date.now(),
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name,
      receipt_url: receiptBase64, // local mock storage uses base64 or placeholder url
      status: 'pending',
      created_at: new Date().toISOString()
    };

    setPayments(prev => [newPayment, ...prev]);
    
    // Update user local status to pending
    const updatedUser = { ...user, subscription_status: 'pending' };
    setUser(updatedUser);
    
    return { success: true };
  };

  const approvePayment = async (paymentId) => {
    // Admin only
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        // Upgrade corresponding user
        setAllUsers(users => users.map(u => {
          if (u.id === p.user_id) {
            const updated = { ...u, subscription_status: 'premium' };
            // If the active user is the approved one, update active session
            if (user && user.id === u.id) {
              setUser(updated);
            }
            return updated;
          }
          return u;
        }));
        return { ...p, status: 'approved', reviewed_at: new Date().toISOString() };
      }
      return p;
    }));
    return { success: true };
  };

  const rejectPayment = async (paymentId, reason) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        setAllUsers(users => users.map(u => {
          if (u.id === p.user_id) {
            const updated = { ...u, subscription_status: 'free' };
            if (user && user.id === u.id) {
              setUser(updated);
            }
            return updated;
          }
          return u;
        }));
        return { ...p, status: 'rejected', rejection_reason: reason, reviewed_at: new Date().toISOString() };
      }
      return p;
    }));
    return { success: true };
  };

  // Challenge Submissions
  const submitChallenge = async (challengeId, textResponse, audioBlobUrl) => {
    if (!user) return;
    
    const challenge = challengesData.find(c => c.id === challengeId);
    
    // Quick heuristic analyzer
    const words = textResponse ? textResponse.trim().split(/\s+/).length : 50; // Mock word count if audio only
    const usedPhrases = challenge.phraseBank.filter(p => 
      textResponse ? textResponse.toLowerCase().includes(p.phrase.toLowerCase()) : Math.random() > 0.4
    );

    const scorePct = Math.min(100, Math.round((usedPhrases.length / challenge.phraseBank.length) * 50 + Math.min(words, 100)));

    const record = {
      id: 'uc_' + Date.now(),
      user_id: user.id,
      challenge_id: challengeId,
      user_text_response: textResponse,
      audio_url: audioBlobUrl,
      analysis_metadata: {
        word_count: words,
        used_phrases: usedPhrases.map(p => p.phrase),
        score: scorePct,
        fluency_rating: scorePct > 80 ? 'Excellent' : scorePct > 60 ? 'Good' : 'Needs Practice'
      },
      completed_at: new Date().toISOString()
    };

    setCompletedChallenges(prev => [...prev, record]);
    return record;
  };

  // Exam Submissions
  const submitExam = async (examId, audioUrls, targetScore, feedbackDetails) => {
    if (!user) return;

    const record = {
      id: 'ue_' + Date.now(),
      user_id: user.id,
      exam_id: examId,
      audio_urls: audioUrls,
      target_score: targetScore,
      feedback_details: feedbackDetails,
      completed_at: new Date().toISOString()
    };

    setCompletedExams(prev => [...prev, record]);
    return record;
  };

  return (
    <AppContext.Provider value={{
      user,
      authLoading,
      challenges: challengesData,
      mockExams: mockExamsData,
      completedChallenges,
      completedExams,
      payments,
      allUsers,
      login,
      signup,
      logout,
      submitPayment,
      approvePayment,
      rejectPayment,
      submitChallenge,
      submitExam,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  );
};
