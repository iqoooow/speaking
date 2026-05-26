import React from 'react';
import { Play, BookOpen, Clock, AlertTriangle, ChevronRight } from 'lucide-react';

interface ChallengeData {
  id: string;
  topic: string;
  topicUz: string;
  question: string;
  difficulty: string;
  estimatedTime?: string; // e.g. "3 daqiqa"
}

interface DailyChallengePreviewProps {
  challenge: ChallengeData | null;
  onStart: (id: string) => void;
}

export default function DailyChallengePreview({ 
  challenge, 
  onStart 
}: DailyChallengePreviewProps) {
  
  // High-reliability fallback if challenge is loading or empty
  const activeChallenge = challenge || {
    id: 'ch_1',
    topic: 'Family',
    topicUz: 'Oila va qarindoshlar',
    question: 'How do you usually spend time with your family on weekends?',
    difficulty: 'B1',
    estimatedTime: '3 min'
  };

  return (
    <div className="glass-card glass-card-hover p-5 border-brand-navy-light/50 bg-brand-navy-dark/95 shadow-xl space-y-4">
      
      {/* Title block */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-brand-purple-light" /> Bugungi Kunlik Challenge
        </h3>
        <span className="text-[9px] font-extrabold bg-brand-purple-base/15 border border-brand-purple-base/30 text-brand-purple-light px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Daily Structure
        </span>
      </div>

      {/* Main card details */}
      <div className="bg-[#0b101c]/60 border border-brand-navy-light/40 rounded-xl p-4 space-y-3 relative">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold bg-brand-gold-base/10 border border-brand-gold-base/20 text-brand-gold-base px-2 py-0.5 rounded uppercase">
            {activeChallenge.difficulty}
          </span>
          <span className="text-[11px] font-bold font-display text-brand-purple-light">
            Mavzu: {activeChallenge.topicUz} ({activeChallenge.topic})
          </span>
        </div>

        <h4 className="text-xs font-bold font-display text-brand-neutral-white leading-relaxed line-clamp-2">
          "{activeChallenge.question}"
        </h4>

        {/* Challenge specifications */}
        <div className="flex items-center gap-4 pt-1.5 border-t border-brand-navy-light/30">
          <div className="flex items-center gap-1 text-[10px] text-brand-neutral-textMuted">
            <Clock className="h-3.5 w-3.5" />
            <span>Kutish vaqti: <strong>{activeChallenge.estimatedTime || '3 daqiqa'}</strong></span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-brand-neutral-textMuted">
            <Play className="h-3.5 w-3.5 text-brand-success shrink-0" />
            <span>Format: <strong>Audio / Yozma</strong></span>
          </div>
        </div>
      </div>

      {/* Launcher Action CTA */}
      <button
        onClick={() => onStart(activeChallenge.id)}
        className="w-full btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider hover:bg-brand-purple-base hover:text-brand-neutral-white hover:border-brand-purple-base hover:shadow-purpleGlow"
      >
        <span>Challenge'ni boshlash</span>
        <ChevronRight className="h-4 w-4" />
      </button>

    </div>
  );
}
