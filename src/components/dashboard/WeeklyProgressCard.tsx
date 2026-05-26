import React from 'react';
import { BarChart2, Flame, CheckCircle, Mic, Award, Sparkles } from 'lucide-react';

interface WeeklyProgressCardProps {
  completedChallengesCount: number;
  speakingAttemptsCount: number;
  streakDays: number;
  mockExamsCount: number;
}

export default function WeeklyProgressCard({
  completedChallengesCount,
  speakingAttemptsCount,
  streakDays,
  mockExamsCount
}: WeeklyProgressCardProps) {
  
  const hasAttempts = speakingAttemptsCount > 0 || completedChallengesCount > 0;

  const statItems = [
    { label: 'Streak kuni', value: streakDays, icon: Flame, color: 'text-brand-warning bg-brand-warning/10 border-brand-warning/20' },
    { label: 'Challenges', value: completedChallengesCount, icon: CheckCircle, color: 'text-brand-purple-light bg-brand-purple-base/10 border-brand-purple-base/20' },
    { label: 'Urinishlar', value: speakingAttemptsCount, icon: Mic, color: 'text-brand-success bg-brand-success/10 border-brand-success/20' },
    { label: 'Mock Testlar', value: mockExamsCount, icon: Award, color: 'text-brand-gold-base bg-brand-gold-base/10 border-brand-gold-base/20' }
  ];

  return (
    <div className="glass-card p-5 border-brand-navy-light/50 bg-brand-navy-dark/95 shadow-xl space-y-4">
      
      {/* Title */}
      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted flex items-center gap-1.5 border-b border-brand-navy-light/45 pb-2.5">
        <BarChart2 className="h-4 w-4 text-brand-purple-light" /> Haftalik Rivojlanish (Progress)
      </h3>

      {/* Grid of four indicators */}
      <div className="grid grid-cols-2 gap-3.5">
        {statItems.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#0b101c]/60 border border-brand-navy-light/35 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 text-left relative"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-brand-neutral-textMuted leading-tight">
                  {stat.label}
                </span>
                <div className={`h-7 w-7 rounded-lg border flex items-center justify-center ${stat.color} shrink-0`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              
              <span className="text-2xl font-extrabold font-mono text-brand-neutral-white leading-none">
                {stat.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Motivational message or Empty State Help */}
      {!hasAttempts ? (
        <div className="bg-[#121927]/60 border border-brand-navy-light/30 rounded-xl p-3 flex items-start gap-2.5">
          <Sparkles className="h-4.5 w-4.5 text-brand-purple-light shrink-0 mt-0.5" />
          <p className="text-[9.5px] text-brand-neutral-textMuted leading-relaxed text-left">
            <strong>Boshlashga tayyormisiz?</strong> Hali gapirish mashqlarini bajarmadingiz. Kunlik birinchi bepul challenge orqali o'z streak kunlaringizni boshlang!
          </p>
        </div>
      ) : (
        <div className="bg-brand-success/5 border border-brand-success/20 rounded-xl p-3 flex items-start gap-2.5">
          <Sparkles className="h-4.5 w-4.5 text-brand-success shrink-0 mt-0.5 animate-pulse" />
          <p className="text-[9.5px] text-brand-neutral-textMuted leading-relaxed text-left">
            <strong>Ajoyib natija!</strong> Har kungi muntazam mashqlar gapirish confidence'ingizni oshiradi. Ertangi streakni boy bermang!
          </p>
        </div>
      )}

    </div>
  );
}
