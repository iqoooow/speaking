import { supabase } from '../lib/supabase';

export interface AssessmentResult {
  id?: string;
  user_id: string; // references auth_user_id
  exam_date: string;
  biggest_problem: string;
  hardest_part: string;
  confidence_level: number;
  main_goal: string;
  recommended_path: string[];
  created_at?: string;
}

export const assessmentService = {
  /**
   * Save mini assessment results to the database
   */
  async saveAssessmentResult(result: AssessmentResult): Promise<AssessmentResult> {
    const { data, error } = await supabase
      .from('mini_assessment_results')
      .insert([
        {
          user_id: result.user_id,
          exam_date: result.exam_date,
          biggest_problem: result.biggest_problem,
          hardest_part: result.hardest_part,
          confidence_level: result.confidence_level,
          main_goal: result.main_goal,
          recommended_path: result.recommended_path
        }
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as AssessmentResult;
  },

  /**
   * Fetch assessment results for a specific user
   */
  async getAssessmentResult(userId: string): Promise<AssessmentResult | null> {
    const { data, error } = await supabase
      .from('mini_assessment_results')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data as AssessmentResult;
  }
};
