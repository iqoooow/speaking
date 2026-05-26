import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { dashboardService } from '../services/dashboardService';
import LevelCard from '../components/dashboard/LevelCard';
import DailyChallengePreview from '../components/dashboard/DailyChallengePreview';
import PersonalizedPathCard from '../components/dashboard/PersonalizedPathCard';
import PremiumMockCard from '../components/dashboard/PremiumMockCard';
import WeakAreaCard from '../components/dashboard/WeakAreaCard';
import WeeklyProgressCard from '../components/dashboard/WeeklyProgressCard';
import { 
  Flame, 
  Sparkles, 
  BookOpen, 
  Award, 
  FileText, 
  CreditCard, 
  Settings,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface AssessmentData {
  id: string;
  user_id: string;
  exam_date: string;
  biggest_problem: string;
  hardest_part: string;
  confidence_level: number;
  main_goal: string;
  recommended_path: string[];
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const { challenges } = useApp(); // contains challenge bank from JSON seed
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  
  // Progress attempt counts
  const [completedChallengesCount, setCompletedChallengesCount] = useState(0);
  const [speakingAttemptsCount, setSpeakingAttemptsCount] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [mockExamsCount, setMockExamsCount] = useState(0);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');

    try {
      // 1. Fetch diagnostic assessment
      const assessData = await dashboardService.getAssessmentResult(user.id);
      if (assessData) {
        setAssessment(assessData as AssessmentData);
      }

      // 2. Fetch future statistics metrics safely
      const metrics = await dashboardService.getFutureMetrics(user.id);
      
      // Update states with real/empty metrics
      setSpeakingAttemptsCount(metrics.speakingAttempts.length);
      setMockExamsCount(metrics.mockAttempts.length);
      
      // Calculate challenge counts based on challenges user has finished
      // For fallback/MVP we can read standard mock variables or count records
      const savedCompleted = localStorage.getItem('speakora_completed_challenges');
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        const count = Array.isArray(parsed) ? parsed.filter((c: any) => c.user_id === user.id).length : 0;
        setCompletedChallengesCount(count);
        
        // Dynamic streak calculation: if completed challenges exist, mock a 3-day streak to motivate them, or use 0
        setStreakDays(count > 0 ? 3 : 0);
      } else {
        setCompletedChallengesCount(0);
        setStreakDays(0);
      }

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError('Ma\'lumotlarni yuklashda ulanish xatoligi yuz berdi. Internet aloqasini tekshiring.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleStartOnboarding = () => {
    navigate('/mini-assessment');
  };

  const handleStartChallenge = (id: string) => {
    navigate(`/challenge/${id}`);
  };

  const handleStartMock = () => {
    navigate('/exam/lobby');
  };

  const handleOpenBilling = () => {
    navigate('/billing');
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="h-14 bg-brand-navy-light/45 rounded-2xl w-3/4 mb-4" />
        
        {/* Cards skeletons */}
        <div className="h-56 bg-brand-navy-light/45 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-44 bg-brand-navy-light/45 rounded-2xl" />
          <div className="h-44 bg-brand-navy-light/45 rounded-2xl" />
        </div>
        <div className="h-48 bg-brand-navy-light/45 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 border-brand-error/30 bg-brand-error/5 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 text-brand-error mx-auto animate-bounce" />
        <div className="space-y-1">
          <h3 className="text-base font-bold font-display text-brand-neutral-white">
            Xatolik yuz berdi
          </h3>
          <p className="text-xs text-brand-neutral-textMuted max-w-xs mx-auto leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn-secondary py-2 px-6 text-xs flex items-center gap-1.5 mx-auto font-bold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Qayta yuklash
        </button>
      </div>
    );
  }

  // Derive estimated level for LevelCard
  const level = profile?.current_cefr_level || (assessment ? (assessment.biggest_problem === 'freezing' ? 'B1' : 'B2') : null);
  const confidence = assessment ? assessment.confidence_level * 10 : null;
  const isPremium = profile?.premium_status || profile?.role === 'admin';
  const isPending = !isPremium && localStorage.getItem('speakora_payments')?.includes(user?.id || 'none') || false;

  // Get daily challenge from seed data
  const dailyChallenge = challenges && challenges.length > 0 ? challenges[0] : null;

  return (
    <div className="space-y-6 pb-6 animate-fade-in text-brand-neutral-white text-left">
      
      {/* SECTION 1 — WELCOME HEADER */}
      <div className="flex items-start justify-between bg-[#0b101c]/40 border border-brand-navy-light/30 rounded-2xl p-4.5 relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-purple-base/10 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 pr-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold font-display leading-tight">
              Xush kelibsiz, {profile?.full_name || 'Talaba'}! 👋
            </h2>
          </div>
          <p className="text-[10px] text-brand-neutral-textMuted font-medium leading-relaxed">
            Bugun speaking confidence’ni oshiramiz va ravon muloqot qilamiz!
          </p>
        </div>

        {/* Quick streak and tier badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {streakDays > 0 ? (
            <span className="flex items-center gap-1 rounded-full bg-brand-warning/15 px-2.5 py-0.5 text-[9px] font-extrabold text-brand-warning border border-brand-warning/25 shadow-inner">
              <Flame className="h-3 w-3 fill-current" /> {streakDays} KUN STREAK
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-brand-navy-light/50 px-2.5 py-0.5 text-[9px] font-bold text-brand-neutral-textMuted border border-brand-navy-light/30">
              Muntazam amaliyot
            </span>
          )}

          {isPremium ? (
            <span className="flex items-center gap-0.5 rounded-full bg-brand-success/15 px-2.5 py-0.5 text-[8px] font-extrabold text-brand-success border border-brand-success/25 uppercase">
              <Sparkles className="h-2.5 w-2.5 animate-pulse" /> PREMIUM PRO
            </span>
          ) : (
            <span className="rounded-full bg-brand-navy-light px-2.5 py-0.5 text-[8px] font-bold text-brand-neutral-textMuted border border-brand-navy-light/40 uppercase">
              BEPUL AZO
            </span>
          )}
        </div>
      </div>

      {/* SECTION 2 — CURRENT CEFR LEVEL CARD */}
      <LevelCard
        cefrLevel={level}
        confidenceScore={confidence}
        lastUpdated={assessment ? assessment.exam_date : null}
        onStartChallenge={handleStartOnboarding}
      />

      {/* Grid wrapper for responsive layouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* SECTION 3 — TODAY’S DAILY CHALLENGE */}
        <DailyChallengePreview
          challenge={dailyChallenge}
          onStart={handleStartChallenge}
        />

        {/* SECTION 6 — WEAK AREA CARD */}
        <WeakAreaCard
          hardestPart={assessment ? assessment.hardest_part : null}
          biggestProblem={assessment ? assessment.biggest_problem : null}
        />

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* SECTION 4 — PERSONALIZED PATH */}
        <PersonalizedPathCard assessment={assessment} />

        {/* SECTION 7 — WEEKLY PROGRESS */}
        <WeeklyProgressCard
          completedChallengesCount={completedChallengesCount}
          speakingAttemptsCount={speakingAttemptsCount}
          streakDays={streakDays}
          mockExamsCount={mockExamsCount}
        />

      </div>

      {/* SECTION 5 — PREMIUM MOCK EXAM CARD */}
      <PremiumMockCard
        isPremium={isPremium}
        isPending={isPending}
        onOpenBilling={handleOpenBilling}
        onStartMock={handleStartMock}
      />

      {/* SECTION 8 — QUICK ACTIONS */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider block">
          Tezkor Havolalar
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => navigate('/dashboard#challenges')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-all text-center gap-1.5"
          >
            <BookOpen className="h-4.5 w-4.5 text-brand-purple-light" />
            <span className="text-[9px] font-bold">Daily Challenge</span>
          </button>
          
          <button
            onClick={() => navigate('/exam/lobby')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-all text-center gap-1.5"
          >
            <Award className="h-4.5 w-4.5 text-brand-gold-base" />
            <span className="text-[9px] font-bold">Mock Exam</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard#reports')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-all text-center gap-1.5"
          >
            <FileText className="h-4.5 w-4.5 text-brand-success" />
            <span className="text-[9px] font-bold">Hisobotlar</span>
          </button>
          
          <button
            onClick={() => navigate('/billing')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-all text-center gap-1.5"
          >
            <CreditCard className="h-4.5 w-4.5 text-brand-warning" />
            <span className="text-[9px] font-bold">Premium</span>
          </button>
          
          <button
            onClick={() => navigate('/dashboard#profile')}
            className="flex flex-col items-center justify-center p-3 rounded-xl border border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-all text-center gap-1.5"
          >
            <Settings className="h-4.5 w-4.5 text-brand-neutral-textMuted" />
            <span className="text-[9px] font-bold">Sozlamalar</span>
          </button>
        </div>
      </div>

    </div>
  );
}
