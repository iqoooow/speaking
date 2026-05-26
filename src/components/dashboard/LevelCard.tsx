import React from 'react';
import { Sparkles, ArrowRight, Award, AlertCircle } from 'lucide-react';

interface LevelCardProps {
  cefrLevel: string | null;
  confidenceScore: number | null;
  lastUpdated: string | null;
  onStartChallenge: () => void;
}

export default function LevelCard({ 
  cefrLevel, 
  confidenceScore, 
  lastUpdated, 
  onStartChallenge 
}: LevelCardProps) {
  const hasScore = !!cefrLevel;

  // Derive next tier
  const nextLevelMap: Record<string, string> = {
    'A1': 'A2',
    'A2': 'B1',
    'B1': 'B2',
    'B2': 'C1',
    'C1': 'C2',
  };
  const nextLevel = cefrLevel ? (nextLevelMap[cefrLevel] || 'C1') : 'B1';

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-brand-purple-base/15 to-brand-navy-dark/95 border-brand-purple-base/30 shadow-2xl relative overflow-hidden">
      
      {/* Visual background glow */}
      <div className="absolute top-[-50%] right-[-30%] w-56 h-56 bg-brand-purple-base/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-[-50%] left-[-20%] w-48 h-48 bg-brand-gold-base/5 rounded-full blur-[50px] pointer-events-none" />

      {hasScore ? (
        /* 1. Score Present View */
        <div className="space-y-5 relative z-10">
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-brand-purple-light font-display font-bold uppercase tracking-widest block">
              Joriy Speaking Darajangiz
            </span>
            <span className="inline-flex items-center gap-1 bg-brand-gold-base/10 border border-brand-gold-base/20 text-brand-gold-base text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse-slow">
              <Sparkles className="h-3 w-3" /> CEFR Tahlili
            </span>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-0.5">
              <span className="text-4xl font-extrabold font-display bg-gradient-to-r from-brand-neutral-white to-brand-gold-base bg-clip-text text-transparent">
                {cefrLevel}
              </span>
              <p className="text-[10px] text-brand-neutral-textMuted font-medium">
                Nutq ravonligi & andozalar asosida
              </p>
            </div>
            
            {/* Visual badge representation */}
            <div className="h-14 w-14 rounded-2xl bg-brand-gold-base/10 border border-brand-gold-base/30 flex flex-col items-center justify-center text-brand-gold-base shadow-lg shadow-brand-gold-glow/5 shrink-0">
              <Award className="h-6 w-6" />
              <span className="text-[8px] font-extrabold font-display uppercase tracking-widest mt-0.5">Active</span>
            </div>
          </div>

          {/* Level progression bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
              <span>Hozirgi: {cefrLevel}</span>
              <span className="text-brand-purple-light">Maqsad: {nextLevel}</span>
            </div>
            <div className="h-2 w-full bg-[#080d19]/90 border border-brand-navy-light/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand-purple-base to-brand-gold-base rounded-full"
                style={{ width: '60%' }} // mockup progress to next CEFR stage
              />
            </div>
          </div>

          {/* Additional details grid */}
          <div className="grid grid-cols-2 gap-4 border-t border-brand-navy-light/45 pt-3.5 mt-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-brand-neutral-textMuted uppercase tracking-wider block">
                Ishonch Ko'rsatkichi
              </span>
              <span className="text-xs font-extrabold font-mono text-brand-success">
                {confidenceScore ? `${confidenceScore}%` : 'Noma\'lum'}
              </span>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-brand-neutral-textMuted uppercase tracking-wider block">
                Oxirgi Mashg'ulot
              </span>
              <span className="text-xs font-semibold text-brand-neutral-white">
                {lastUpdated ? new Date(lastUpdated).toLocaleDateString('uz-UZ') : 'Hozir'}
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* 2. Empty State View */
        <div className="space-y-5 relative z-10 text-center py-4">
          <div className="h-12 w-12 rounded-2xl bg-brand-purple-base/15 border border-brand-purple-base/30 flex items-center justify-center text-brand-purple-light mx-auto mb-2 shadow-purpleGlow">
            <AlertCircle className="h-6 w-6" />
          </div>
          
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-brand-neutral-white">
              Boshlang'ich baholash kerak
            </h3>
            <p className="text-xs text-brand-neutral-textMuted max-w-xs mx-auto leading-relaxed">
              Hali gapirish darajangiz aniqlanmadi. Birinchi challenge orqali speaking darajangiz va shaxsiy rejangizni oling.
            </p>
          </div>

          <button
            onClick={onStartChallenge}
            className="w-full btn-primary py-3 flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider mt-4"
          >
            <span>Birinchi challenge'ni boshlash</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
