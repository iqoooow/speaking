import React from 'react';
import { Award, Lock, Sparkles, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface PremiumMockCardProps {
  isPremium: boolean;
  isPending: boolean;
  onOpenBilling: () => void;
  onStartMock: () => void;
}

export default function PremiumMockCard({
  isPremium,
  isPending,
  onOpenBilling,
  onStartMock
}: PremiumMockCardProps) {
  
  const mockFeatures = [
    'Part 1.1: Oddiy shaxsiy muloqot savollari',
    'Part 1.2: Rasm tanlash & solishtirish mashqi',
    'Part 2: Cue Card (To\'xtovsiz 2 daqiqalik nutq)',
    'Part 3: Analitik savollar & fikr bahsi',
    'Full Report: AI orqali har tomonlama tahlil',
    'Recovery Plan: Xatolar ustida ishlash yo\'llanmasi'
  ];

  return (
    <div className="glass-card p-5 border-brand-navy-light/50 bg-brand-navy-dark/95 shadow-xl space-y-4 relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute top-[-30%] left-[-20%] w-48 h-48 bg-brand-gold-base/10 rounded-full blur-[50px] pointer-events-none" />

      {/* Header bar */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-[10px] font-bold bg-brand-gold-base/10 border border-brand-gold-base/20 text-brand-gold-base px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Real vaqt bosimi
          </span>
          <h4 className="text-sm font-bold font-display text-brand-neutral-white mt-1.5">
            Full CEFR Speaking Mock Exam
          </h4>
        </div>

        {!isPremium && (
          <div className="bg-brand-navy-base border border-brand-navy-light/40 rounded-xl p-2 text-brand-neutral-textMuted shadow-inner shrink-0">
            <Lock className="h-4.5 w-4.5 text-brand-gold-base animate-pulse-slow" />
          </div>
        )}
      </div>

      <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
        Personal short question, picture comparison, long topic discussion hamda analytical debate qismlarini o'z ichiga olgan to'liq imtihon simulyatsiyasi.
      </p>

      {/* Mock Exam Core Features checklist */}
      <div className="space-y-2 pt-1 border-t border-brand-navy-light/35">
        <span className="text-[9px] font-bold text-brand-neutral-textMuted uppercase tracking-wider block">
          Imtihon tarkibi
        </span>
        <div className="grid grid-cols-1 gap-2.5">
          {mockFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2 text-left">
              <CheckCircle2 className="h-4 w-4 text-brand-success shrink-0 mt-0.5" />
              <span className="text-[10px] text-brand-neutral-grayMed font-medium leading-tight">
                {feat}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Free Users Overlay & CTA Action */}
      {!isPremium ? (
        <div className="space-y-3 pt-3 border-t border-brand-navy-light/35">
          {isPending ? (
            <div className="bg-brand-warning/10 border border-brand-warning/35 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-brand-warning shrink-0 mt-0.5" />
              <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                <strong>To'lov tekshirilmoqda:</strong> Chekingiz qabul qilindi va tekshirilmoqda. Admin tasdiqlashi bilan to'liq mock testlar ochiladi.
              </p>
            </div>
          ) : null}

          <button
            onClick={onOpenBilling}
            className="w-full btn-primary py-3 flex items-center justify-center gap-1.5 font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-gold-glow/20"
          >
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            <span>{isPending ? 'To\'lov Holatini Ko\'rish' : 'Premiumni ochish (29 000 UZS)'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        /* Premium Users Launch Button */
        <div className="pt-3 border-t border-brand-navy-light/35">
          <button
            onClick={onStartMock}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-gold-glow animate-pulse-slow"
          >
            <Award className="h-4 w-4 animate-bounce" />
            <span>Mock Exam boshlash</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

    </div>
  );
}
