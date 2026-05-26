import { supabase } from '../lib/supabase';

export interface UserProfile {
  id?: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin';
  premium_status: boolean;
  current_cefr_level: string | null;
  onboarding_completed: boolean;
  created_at?: string;
}

export const profileService = {
  /**
   * Fetch a user profile by auth user id
   */
  async getUserProfile(authUserId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('users_profile')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Single row not found
        return null;
      }
      throw error;
    }

    return data as UserProfile;
  },

  /**
   * Create a new user profile row in users_profile table
   */
  async createUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users_profile')
      .insert([
        {
          auth_user_id: profile.auth_user_id,
          full_name: profile.full_name,
          email: profile.email,
          role: profile.role || 'user',
          premium_status: profile.premium_status || false,
          current_cefr_level: profile.current_cefr_level || null,
          onboarding_completed: profile.onboarding_completed || false,
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as UserProfile;
  },

  /**
   * Update a user profile by auth user id
   */
  async updateUserProfile(authUserId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('users_profile')
      .update(updates)
      .eq('auth_user_id', authUserId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as UserProfile;
  }
};
