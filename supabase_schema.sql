-- Create helper function to check admin status bypassing RLS (SECURITY DEFINER)
-- This avoids the infinite recursion issue on self-referential SELECT/UPDATE checks.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users_profile
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- 1. Create Profiles Table (users_profile)
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    premium_status BOOLEAN NOT NULL DEFAULT false,
    current_cefr_level TEXT DEFAULT NULL,
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile." 
    ON public.users_profile FOR SELECT 
    USING (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "Users can update their own profile fields." 
    ON public.users_profile FOR UPDATE 
    USING (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "Auth trigger / signup flow can insert profile." 
    ON public.users_profile FOR INSERT 
    WITH CHECK (auth.uid() = auth_user_id);

-- 2. Create Mini Assessment Results Table
CREATE TABLE IF NOT EXISTS public.mini_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    exam_date TEXT NOT NULL,
    biggest_problem TEXT NOT NULL,
    hardest_part TEXT NOT NULL,
    confidence_level INTEGER NOT NULL CHECK (confidence_level >= 1 AND confidence_level <= 10),
    main_goal TEXT NOT NULL,
    recommended_path JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Assessment Results
ALTER TABLE public.mini_assessment_results ENABLE ROW LEVEL SECURITY;

-- Assessment Results Policies
CREATE POLICY "Users can only select their own assessment results." 
    ON public.mini_assessment_results FOR SELECT 
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can only insert their own assessment results." 
    ON public.mini_assessment_results FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
