import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Lock,
  ChevronRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PathData {
  structureScore: number;
  confidenceScore: number;
  vocabularyScore: number;
  recommended_path: string[];
  exam_date: string;
  biggest_problem: string;
  hardest_part: string;
  confidence_level: number;
  main_goal: string;
}

export default function PersonalizedPath() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [pathData, setPathData] = useState<PathData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Read results from session storage
    const saved = sessionStorage.getItem('speakora_assessment_results');
    if (saved) {
      const parsed = JSON.parse(saved) as PathData;
      setPathData(parsed);

      // Instantly trigger celebration confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#7c3aed', '#a78bfa', '#d4af37', '#ffffff']
      });
    } else {
      // Fallback
      navigate('/mini-assessment');
    }
  }, [navigate]);

  const handleStartPlatform = async () => {
    if (!user) return;

    setUpdating(true);
    setError('');

    try {
      // 1. Update onboarding_completed state in Supabase profile
      await profileService.updateUserProfile(user.id, {
        onboarding_completed: true,
        current_cefr_level: (pathData?.structureScore || 50) + (pathData?.confidenceScore || 50) > 110 ? 'B2' : 'B1'
      });

      // 2. Refresh Auth profile context so protected routes permit dashboard access
      await refreshProfile();

      // 3. Clear session storage
      sessionStorage.removeItem('speakora_assessment_results');

      // 4. Redirect to user dashboard
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err);
      setError('Tizim sozlamalarini saqlashda xatolik yuz berdi. Qayta urinib ko\'ring.');
    } finally {
      setUpdating(false);
    }
  };

  if (!pathData) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-navy-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-base border-t-transparent"></div>
      </div>
    );
  }

  // Diagnosis helpers
  const problemLabels: Record<string, string> = {
    freezing: 'Nutq to\'xtab qolishi (Freezing)',
    vocabulary: 'So\'z boyligi yetishmovchiligi (Vocabulary)',
    grammar: 'Grammatik xatolardan qo\'rquv (Grammar)',
    fluency: 'Nutq ravonligi pastligi (Fluency)'
  };

  const currentCEFR = pathData.structureScore + pathData.confidenceScore + pathData.vocabularyScore > 180 ? 'B2' : 'B1';

  return (
    <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white flex flex-col px-4 py-8 relative overflow-x-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-[10%] left-[-20%] w-72 h-72 bg-brand-purple-base/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-20%] w-72 h-72 bg-brand-gold-base/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        
        {/* Header bar */}
        <div className="text-center space-y-2 mb-2">
          <span className="inline-flex items-center gap-1.5 bg-brand-success/15 border border-brand-success/30 text-brand-success text-[10px] font-bold py-1 px-3.5 rounded-full uppercase tracking-wider animate-bounce">
            <Sparkles className="h-3.5 w-3.5" /> Shaxsiy reja tayyor!
          </span>
          <h1 className="text-2xl font-bold font-display text-brand-neutral-white tracking-tight">
            Sizning CEFR O'sish Yo'lingiz
          </h1>
          <p className="text-xs text-brand-neutral-textMuted max-w-xs mx-auto">
            Diagnostik tahlillar asosida shakllantirilgan shaxsiy o'quv dasturi
          </p>
        </div>

        {error && (
          <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 text-center font-medium">
            {error}
          </div>
        )}

        {/* Diagnosis / Metric analysis card */}
        <div className="glass-card p-5 border-brand-navy-light/60 bg-brand-navy-dark/95 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-brand-navy-light/40 pb-2.5">
            <span className="text-[11px] font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted">
              Nutq tahlili (Diagnostic Metrics)
            </span>
            <span className="text-xs font-bold font-display text-brand-gold-base bg-brand-gold-base/10 px-2 py-0.5 rounded border border-brand-gold-base/20">
              Taxminiy daraja: {currentCEFR}
            </span>
          </div>

          {/* Metric list */}
          <div className="space-y-3">
            {/* Structure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-brand-neutral-white">Struktura va andozalar (Skeletons)</span>
                <span className="text-brand-purple-light font-bold">{pathData.structureScore}%</span>
              </div>
              <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden border border-brand-navy-light/40">
                <div 
                  className="h-full bg-gradient-to-r from-brand-purple-base to-brand-purple-light rounded-full transition-all duration-1000"
                  style={{ width: `${pathData.structureScore}%` }}
                />
              </div>
            </div>

            {/* Confidence */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-brand-neutral-white">Nutq ishonchi (Confidence)</span>
                <span className="text-brand-success font-bold">{pathData.confidenceScore}%</span>
              </div>
              <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden border border-brand-navy-light/40">
                <div 
                  className="h-full bg-brand-success rounded-full transition-all duration-1000"
                  style={{ width: `${pathData.confidenceScore}%` }}
                />
              </div>
            </div>

            {/* Vocabulary */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-brand-neutral-white">Lug'at va Ravonlik (Fluency)</span>
                <span className="text-brand-warning font-bold">{pathData.vocabularyScore}%</span>
              </div>
              <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden border border-brand-navy-light/40">
                <div 
                  className="h-full bg-brand-warning rounded-full transition-all duration-1000"
                  style={{ width: `${pathData.vocabularyScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Expert diagnosis text */}
          <div className="bg-brand-purple-glow/40 border border-brand-purple-base/15 rounded-xl p-3.5 flex items-start gap-2.5 mt-2">
            <TrendingUp className="h-4.5 w-4.5 text-brand-purple-light shrink-0 mt-0.5" />
            <div className="text-[11px] text-brand-neutral-grayMed leading-relaxed">
              <strong>Tahlil natijasi:</strong> Sizning asosiy qiyinchiligingiz — <strong>{problemLabels[pathData.biggest_problem] || pathData.biggest_problem}</strong>. Fikringizni tezkor boshlash va andozalar ustida ishlash uchun kunlik <strong>Skeletons Amaliyoti</strong> juda muhim.
            </div>
          </div>
        </div>

        {/* 30-Day Step Timeline roadmap */}
        <div className="glass-card p-5 border-brand-navy-light/60 bg-brand-navy-dark/95 shadow-xl space-y-4">
          <h3 className="text-[11px] font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2.5 flex items-center gap-1.5">
            <Flame className="h-4.5 w-4.5 text-brand-gold-base" /> 30 Kunlik O'quv Rejasi
          </h3>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-6.5 w-6.5 rounded-full bg-brand-purple-base/15 border border-brand-purple-base/40 text-brand-purple-light font-display font-extrabold text-xs flex items-center justify-center">
                  1
                </div>
                <div className="w-[1.5px] flex-grow bg-brand-navy-light/50 my-1" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-display text-brand-neutral-white">
                  1-10 kun: Freezingdan qutulish
                </h4>
                <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                  Har kuni <strong>Daily Challenges</strong> yordamida nutqni qotib qolmasdan, 3 xil usulda tez va ishonchli boshlash andozalarini o'rganasiz.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-6.5 w-6.5 rounded-full bg-brand-purple-base/15 border border-brand-purple-base/40 text-brand-purple-light font-display font-extrabold text-xs flex items-center justify-center">
                  2
                </div>
                <div className="w-[1.5px] flex-grow bg-brand-navy-light/50 my-1" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-display text-brand-neutral-white">
                  11-20 kun: So'z zaxirasini mustahkamlash
                </h4>
                <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                  So'z yodlashni to'xtatib, bog'lovchi gap andozalari — <strong>Phrase Bank</strong> orqali fikrlaringizni o'zaro ulashni o'zlashtirasiz.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-6.5 w-6.5 rounded-full bg-brand-purple-base/15 border border-brand-purple-base/40 text-brand-purple-light font-display font-extrabold text-xs flex items-center justify-center">
                  3
                </div>
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold font-display text-brand-neutral-white">
                  21-30 kun: Imtihon simulyatsiyasi
                </h4>
                <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                  Cheklangan vaqt va real sharoitda <strong>Premium Mock Exam</strong> topshirasiz va AI yordamida aniq CEFR balingizni olasiz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Locked Feature summary / path items */}
        <div className="glass-card p-4 border-brand-purple-base/20 bg-brand-purple-base/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8.5 w-8.5 rounded-xl bg-brand-purple-base/20 flex items-center justify-center text-brand-purple-light shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold font-display text-brand-neutral-white">
                Platforma funksiyalari ochildi
              </p>
              <p className="text-[10px] text-brand-neutral-textMuted">
                Shaxsiy reja bo'yicha mashg'ulotlar tayyor.
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-brand-purple-light" />
        </div>

        {/* Submit CTA action */}
        <div className="space-y-3">
          <button
            onClick={handleStartPlatform}
            disabled={updating}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-xl shadow-brand-gold-glow"
          >
            {updating ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-navy-base border-t-transparent"></span>
            ) : (
              <span className="flex items-center gap-1.5">
                Dashboardga o'tish <ArrowRight className="h-4.5 w-4.5 animate-pulse" />
              </span>
            )}
          </button>

          <p className="text-[9px] text-brand-neutral-textMuted text-center">
            Dashboardga o'tib, kunlik birinchi bepul Speaking topshirig'ini boshlang!
          </p>
        </div>

      </div>
    </div>
  );
}
