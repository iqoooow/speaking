import { supabase } from '../lib/supabase';

export interface SpeakingAttempt {
  id: string;
  user_id: string;
  challenge_id: string;
  user_text_response?: string;
  audio_url?: string;
  completed_at: string;
  score?: number;
}

export interface MockExamAttempt {
  id: string;
  user_id: string;
  exam_id: string;
  target_score: string;
  completed_at: string;
}

export interface AIFeedbackReport {
  id: string;
  attempt_id: string;
  fluency_score: number;
  grammar_score: number;
  vocab_score: number;
  overall_score: number;
}

export const dashboardService = {
  /**
   * Fetch assessment results for a specific user.
   */
  async getAssessmentResult(userId: string) {
    const { data, error } = await supabase
      .from('mini_assessment_results')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No results found
        return null;
      }
      throw error;
    }

    return data;
  },

  /**
   * Safe fetch for cumulative student metrics from future tables.
   * If tables don't exist yet, it catches the error and returns mock/fallback structures 
   * so the dashboard never breaks.
   */
  async getFutureMetrics(userId: string) {
    let speakingAttempts: SpeakingAttempt[] = [];
    let mockAttempts: MockExamAttempt[] = [];
    let feedbackReports: AIFeedbackReport[] = [];

    // 1. Safe fetch speaking_attempts
    try {
      const { data, error } = await supabase
        .from('speaking_attempts')
        .select('*')
        .eq('user_id', userId);
      
      if (!error && data) {
        speakingAttempts = data as SpeakingAttempt[];
      }
    } catch (e) {
      console.warn("Future table 'speaking_attempts' not queryable yet. Using empty fallback.");
    }

    // 2. Safe fetch mock_exam_attempts
    try {
      const { data, error } = await supabase
        .from('mock_exam_attempts')
        .select('*')
        .eq('user_id', userId);
      
      if (!error && data) {
        mockAttempts = data as MockExamAttempt[];
      }
    } catch (e) {
      console.warn("Future table 'mock_exam_attempts' not queryable yet. Using empty fallback.");
    }

    // 3. Safe fetch ai_feedback_reports
    try {
      const { data, error } = await supabase
        .from('ai_feedback_reports')
        .select('*');
      
      if (!error && data) {
        feedbackReports = data as AIFeedbackReport[];
      }
    } catch (e) {
      console.warn("Future table 'ai_feedback_reports' not queryable yet. Using empty fallback.");
    }

    return {
      speakingAttempts,
      mockAttempts,
      feedbackReports
    };
  }
};
