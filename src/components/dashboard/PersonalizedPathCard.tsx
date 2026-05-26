import React from 'react';
import { Compass, Sparkles, CheckCircle2, Star } from 'lucide-react';

interface AssessmentData {
  biggest_problem: string;
  hardest_part: string;
  confidence_level: number;
  main_goal: string;
  recommended_path: string[];
}

interface PersonalizedPathCardProps {
  assessment: AssessmentData | null;
}

interface PathStep {
  title: string;
  desc: string;
}

export default function PersonalizedPathCard({ assessment }: PersonalizedPathCardProps) {
  const hasAssessment = !!assessment;

  // Generate highly personalized learning steps based on their biggest problem
  const getPersonalizedSteps = (): { planTitle: string; steps: PathStep[] } => {
    if (!hasAssessment) {
      return {
        planTitle: 'Umumiy Speaking Yo\'nalishi',
        steps: [
          { title: 'Kunlik Skeletons Challenge', desc: 'Gapni qotib qolmasdan tez boshlash uchun andozalar mashqi.' },
          { title: 'Phrase Bank mashqlari', desc: 'Gaplarni bir-biriga ulash uchun tayyor akademik iboralar.' },
          { title: 'Weekly Mock Exam', desc: 'Har haftalik real vaqt chekloviga ega imtihon simulyatsiyasi.' },
          { title: 'Shaxsiy o\'sish hisoboti', desc: 'Kamchiliklarni to\'ldirish uchun shaxsiy tuzatish rejasi.' }
        ]
      };
    }

    const problem = assessment.biggest_problem;

    switch (problem) {
      case 'freezing':
        return {
          planTitle: 'Freezing (Nutq to\'xtashi)ga qarshi Reja',
          steps: [
            { title: 'Starter Skeletons Amaliyoti', desc: 'Savol berilishi bilan 3 soniya ichida gapni andoza bilan boshlash ko\'nikmasi.' },
            { title: 'Part 2 Cue Card andozalari', desc: '2 daqiqa davomida rejasiz va to\'xtab qolmasdan gapirish skeletlari.' },
            { title: 'Haftalik Mock Simulyatsiyasi', desc: 'Imtihon bosimi ostida freezing holatini nazorat qilish.' },
            { title: 'AI Recovery & Tuzatish rejasi', desc: 'Tahlillar asosida qaysi savollarda qotib qolganingizni aniqlash.' }
          ]
        };
      case 'vocabulary':
        return {
          planTitle: 'Lug\'at zaxirasi & Bog\'lovchilar Rejasi',
          steps: [
            { title: 'Yuqori balli Phrase Bank check-in', desc: 'Oddiy so\'zlar o\'rniga akademik bog\'lovchi va kirish iboralarini faollashtirish.' },
            { title: 'Mavzuli iboralar mashqi', desc: 'Oilaviy, ijtimoiy yoki shaxsiy savollarga mos lug\'atlarni nutqqa kiritish.' },
            { title: 'Part 3 Analitik nutq iboralari', desc: 'Fikrlarni kengaytirish va qarama-qarshi fikrlarni ulash andozalari.' },
            { title: 'Premium Vocab mock tahlili', desc: 'AI yordamida nutqda ishlatilgan qimmatli iboralar ulushini hisoblash.' }
          ]
        };
      case 'grammar':
        return {
          planTitle: 'Grammatik Xatolarni Bartaraf Etish Rejasi',
          steps: [
            { title: 'Avtomatlashtirilgan Grammatika Skeletons', desc: 'Xato qilishdan qo\'rqmasdan, grammatik to\'g\'ri andozalar ustida ishlash.' },
            { title: 'Xavfsiz andozalar (Safe Templates)', desc: 'Xatolarsiz va silliq gapirishni ta\'minlovchi tayyor iboralar banki.' },
            { title: 'Part 1 & Part 2 aniqlik mashqlari', desc: 'Nutqda zamonlar va kelishiklar mosligini mustahkamlash.' },
            { title: 'AI Grammatika diagnostikasi', desc: 'Siz eng ko\'p yo\'l qo\'yadigan tizimli grammatik xatolar tahlili.' }
          ]
        };
      case 'fluency':
      default:
        return {
          planTitle: 'Nutq Ravonligi & Tezligi Rejasi',
          steps: [
            { title: 'Daily Speed Challenges', desc: 'Tezkor fikrlash va fikrni oqimga solish uchun kunlik qisqa amaliyot.' },
            { title: 'Cue Card to\'xtovsiz ravonlik', desc: 'Rejasiz, bir nafasda gaplarni bog\'lovchi iboralar bilan davom ettirish.' },
            { title: 'Pressure-mode Mock Exam', desc: 'Real imtihon vaqt cheklovlari sharoitida ravonlikni ushlab qolish.' },
            { title: 'Pass Prediction monitoring', desc: 'Haftalik ravonlik darajasining o\'sish dinamikasini baholash.' }
          ]
        };
    }
  };

  const { planTitle, steps } = getPersonalizedSteps();

  return (
    <div className="glass-card p-5 border-brand-navy-light/50 bg-brand-navy-dark/95 shadow-xl space-y-4">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-2.5">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-brand-purple-light animate-spin-slow" /> Shaxsiy Rivojlanish Yo'lingiz
        </h3>
        <span className="inline-flex items-center gap-1 bg-brand-success/15 border border-brand-success/35 text-brand-success text-[8px] font-extrabold px-2 py-0.5 rounded uppercase">
          <Star className="h-2 w-2" /> Sozlandi
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-brand-purple-base animate-ping" />
          <h4 className="text-xs font-extrabold font-display text-brand-purple-light">
            {planTitle}
          </h4>
        </div>

        {/* Steps Timeline */}
        <div className="space-y-4 pt-1.5">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-[#0a0f1d] border border-brand-purple-base/30 text-brand-neutral-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-[1.5px] flex-grow bg-brand-navy-light/40 my-1" />
                )}
              </div>
              <div className="space-y-0.5 text-left">
                <h5 className="text-[11px] font-bold font-display text-brand-neutral-white">
                  {step.title}
                </h5>
                <p className="text-[9.5px] text-brand-neutral-textMuted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
