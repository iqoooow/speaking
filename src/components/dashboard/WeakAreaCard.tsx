import React from 'react';
import { AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';

interface WeakAreaCardProps {
  hardestPart: string | null;
  biggestProblem: string | null;
}

export default function WeakAreaCard({ hardestPart, biggestProblem }: WeakAreaCardProps) {
  const hasData = !!hardestPart;

  const partLabels: Record<string, string> = {
    part1: 'Part 1: Shaxsiy va sodda savollar',
    part2: 'Part 2: Cue Card (2 daqiqalik nutq)',
    part3: 'Part 3: Analitik va chuqurroq savollar',
    all: 'Barcha speaking qismlari'
  };

  const getCustomSuggestion = () => {
    if (!hardestPart) return '';

    switch (hardestPart) {
      case 'part1':
        return 'Kundalik shaxsiy savollarga andozalar orqali tez va qotib qolmasdan javob berishni maslahat beramiz. 3-soniya qoidasidan foydalaning.';
      case 'part2':
        return 'Rejasiz, to\'xtovsiz 2 daqiqa gapirib berish andozalari ustida ishlang. Fikrlaringizni 4 bosqichli skeletal zanjir bo\'yicha bog\'lang.';
      case 'part3':
        return 'Fikringizni kengaytirish, qarama-qarshi fikrlarni ulash va isbot keltirish andozalarini Phrase Bank bo\'limidan o\'rganing.';
      case 'all':
      default:
        return 'Kunlik sodda mashqlardan boshlab, avval 15 soniyalik, so\'ngra 1 daqiqalik nutq ishonchini bosqichma-bosqich shakllantiring.';
    }
  };

  return (
    <div className="glass-card p-5 border-brand-navy-light/50 bg-brand-navy-dark/95 shadow-xl space-y-4">
      
      {/* Title */}
      <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted flex items-center gap-1.5 border-b border-brand-navy-light/45 pb-2.5">
        <AlertTriangle className="h-4 w-4 text-brand-warning shrink-0" /> Nutq Kamchiliklari (Weak Areas)
      </h3>

      {hasData ? (
        /* Data Present View */
        <div className="space-y-3.5 text-left">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-brand-warning tracking-wider block">
              Siz uchun eng qiyin bo'lim:
            </span>
            <h4 className="text-xs font-extrabold font-display text-brand-neutral-white">
              {partLabels[hardestPart] || hardestPart}
            </h4>
          </div>

          <div className="bg-brand-navy-base border border-brand-navy-light/40 rounded-xl p-3.5 flex items-start gap-2.5">
            <Sparkles className="h-4.5 w-4.5 text-brand-gold-base shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-brand-neutral-textMuted leading-relaxed">
              <strong>Tavsiya:</strong> {getCustomSuggestion()}
            </p>
          </div>
        </div>
      ) : (
        /* Empty State View */
        <div className="text-center py-4 space-y-2">
          <AlertCircle className="h-8 w-8 text-brand-neutral-textMuted mx-auto mb-1 opacity-70" />
          <h4 className="text-xs font-bold font-display text-brand-neutral-white">
            Hali ma'lumot yetarli emas
          </h4>
          <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed max-w-xs mx-auto">
            Challenge natijalaringiz va speaking urinishlaringizdan keyin bu yerda sizning eng zaif bo'limingiz aniqlanadi.
          </p>
        </div>
      )}

    </div>
  );
}
