import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Award, PlayCircle, BookOpen, AlertCircle, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export default function ExamReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completedExams, challenges } = useApp();

  const attempt = completedExams.find(ce => ce.id === id);

  if (!attempt) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-brand-error">Hisobot topilmadi.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4 py-1.5 px-4 text-xs">
          Dashboardga qaytish
        </button>
      </div>
    );
  }

  // Map estimated target score indices to CEFR levels
  const cefrLevels = {
    8: 'C1 (Advanced) - High Fluency',
    7: 'B2+ (Vantage) - Good Structure',
    6: 'B2 (Vantage) - Intermediate Pass',
    5: 'B1 (Threshold) - Needs Practice'
  };

  const scoreText = cefrLevels[attempt.target_score] || 'B2 (Intermediate)';

  // Helper to map daily challenges by keyword to give clickable recovery routes
  const getChallengeByKeyword = (keyword) => {
    return challenges.find(c => 
      c.questionUz.toLowerCase().includes(keyword.toLowerCase()) || 
      c.topicEn.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in text-brand-neutral-white">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-3">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-1 text-xs text-brand-neutral-textMuted hover:text-brand-neutral-white"
        >
          <ChevronLeft className="h-4 w-4" /> Dashboardga qaytish
        </button>
        <span className="text-xs text-brand-neutral-textMuted font-display">Mock Hisoboti</span>
      </div>

      {/* Main Score Banner */}
      <div className="glass-card p-5 border-brand-purple-base/20 bg-brand-purple-glow text-center">
        <Award className="h-12 w-12 text-brand-purple-light mx-auto mb-2 animate-pulse-slow" />
        <span className="text-[10px] text-brand-purple-light font-display font-bold uppercase tracking-widest">Baholash Natijasi</span>
        <h2 className="text-2xl font-extrabold font-display text-brand-neutral-white mt-1">CEFR Speaking Level</h2>
        <div className="text-lg font-bold font-mono mt-2 bg-brand-navy-base inline-block px-4 py-1.5 rounded-xl border border-brand-navy-light/40 text-brand-success shadow-goldGlow">
          {scoreText}
        </div>
      </div>

      {/* Structured feedback details */}
      <div className="glass-card p-4 border-brand-navy-light/40 space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2">
          Nutq tahlili
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-bold text-brand-neutral-grayLight block">1. Struktura (Skeletons):</span>
            <p className="text-brand-neutral-textMuted mt-0.5 leading-relaxed">{attempt.feedback_details?.structure}</p>
          </div>
          <div>
            <span className="font-bold text-brand-neutral-grayLight block">2. Ravonlik va Bog'liqlik (Fluency & Coherence):</span>
            <p className="text-brand-neutral-textMuted mt-0.5 leading-relaxed">{attempt.feedback_details?.fluency}</p>
          </div>
        </div>
      </div>

      {/* Recovery Plan (Actionable links) */}
      <div className="glass-card p-4 border-brand-gold-base/20 bg-brand-gold-base/5 space-y-4 glass-card-hover">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-gold-base border-b border-brand-gold-base/10 pb-2 flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-brand-gold-base animate-pulse" /> Recovery Plan (O'sish yo'riqnomasi)
        </h3>

        <p className="text-[10px] text-brand-neutral-textMuted leading-normal">
          Xatolaringizni to'g'rilash va keyingi mock imtihonida yuqoriroq ball olish uchun quyidagi kunlik mashqlarni qayta topshirish tavsiya etiladi:
        </p>

        <div className="space-y-3">
          {/* Recovery Item 1 */}
          <div 
            onClick={() => navigate('/challenge/challenge_001')}
            className="bg-brand-navy-base p-3 rounded-xl border border-brand-navy-light/40 hover:border-brand-gold-base/30 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="space-y-0.5 pr-2 flex-1">
              <span className="text-[9px] font-bold text-brand-gold-base uppercase tracking-widest">Solishtirish mashqi</span>
              <h4 className="text-xs font-bold text-brand-neutral-grayLight group-hover:text-brand-gold-base transition-colors">
                Solo vs Group Study comparing prompts
              </h4>
            </div>
            <ArrowRight className="h-4 w-4 text-brand-neutral-textMuted group-hover:text-brand-gold-base group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>

          {/* Recovery Item 2 */}
          <div 
            onClick={() => navigate('/challenge/challenge_003')}
            className="bg-brand-navy-base p-3 rounded-xl border border-brand-navy-light/40 hover:border-brand-gold-base/30 flex items-center justify-between cursor-pointer group transition-all"
          >
            <div className="space-y-0.5 pr-2 flex-1">
              <span className="text-[9px] font-bold text-brand-gold-base uppercase tracking-widest">Debat andozalari</span>
              <h4 className="text-xs font-bold text-brand-neutral-grayLight group-hover:text-brand-gold-base transition-colors">
                Debating statements & FOR/AGAINST lists
              </h4>
            </div>
            <ArrowRight className="h-4 w-4 text-brand-neutral-textMuted group-hover:text-brand-gold-base group-hover:translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>

      {/* Voice Review Section */}
      <div className="glass-card p-4 border-brand-navy-light/40 space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2 flex items-center gap-1.5">
          <Volume2 className="h-4 w-4 text-brand-purple-light" /> O'z ovozingizni tinglang
        </h3>

        <div className="space-y-3.5 text-xs">
          {Object.entries(attempt.audio_urls).map(([questionId, audioUrl]) => {
            let label = 'Imtihon qismi';
            if (questionId === 'p1_q1') label = 'Part 1.1 - Savol 1';
            if (questionId === 'p1_q2') label = 'Part 1.1 - Savol 2';
            if (questionId === 'p1_q3') label = 'Part 1.1 - Savol 3';
            if (questionId === 'p1_2') label = 'Part 1.2 - Rasmlar solishtirish';
            if (questionId === 'p2') label = 'Part 2 - Mavzu taqdimoti';
            if (questionId === 'p3') label = 'Part 3 - Munozara (Debat)';

            return (
              <div key={questionId} className="space-y-1 bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
                <span className="font-bold text-brand-neutral-grayLight block">{label}</span>
                <audio src={audioUrl} controls className="w-full mt-1.5 h-7 bg-brand-navy-dark rounded" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
