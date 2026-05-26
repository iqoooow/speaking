import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  AlertCircle, 
  Calendar, 
  Zap, 
  Award, 
  Compass, 
  Volume2, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    field: 'exam_date',
    title: 'Imtihon topshirish vaqti',
    question: 'Qachon CEFR yoki IELTS imtihonini topshirishni rejalashtiryapsiz?',
    icon: Calendar,
    options: [
      { value: 'shu_oyda', label: 'Shu oyda (Juda yaqin)', desc: 'Tezkor tayyorgarlik va intensiv andozalar kerak.' },
      { value: 'keyingi_2_oyda', label: 'Keyingi 2 oy ichida', desc: 'Tizimli reja va har kungi gapirish amaliyoti.' },
      { value: '3_6_oyda', label: '3-6 oydan keyin', desc: 'Noldan boshlab mustahkam poydevor qurish.' },
      { value: 'professional', label: 'Faqat erkin gapirish uchun', desc: 'Imtihonsiz, shaxsiy va professional rivojlanish.' }
    ]
  },
  {
    id: 2,
    field: 'biggest_problem',
    title: 'Eng katta to\'siq',
    question: 'Ingliz tilida gapirishda sizga eng katta muammo nima?',
    icon: AlertCircle,
    options: [
      { value: 'freezing', label: 'Mavzuni qanday boshlashni bilmay qolaman (Freezing)', desc: 'Speakora Skeletons (andozalar) aynan shu uchun yaratilgan.' },
      { value: 'vocabulary', label: 'Kerakli so\'zlar esga kelmaydi (Vocabulary)', desc: 'So\'z yodlash o\'rniga tayyor bog\'lovchi iboralarni o\'rganish.' },
      { value: 'grammar', label: 'Grammatik xatolardan qo\'rqaman (Grammar)', desc: 'Xatolarsiz gapirish andozalarini avtomatik nutqqa aylantirish.' },
      { value: 'fluency', label: 'Nutqim ravon emas, tez to\'xtab qolaman (Fluency)', desc: 'Tezlik va ravonlikni oshiruvchi kunlik qisqa mashqlar.' }
    ]
  },
  {
    id: 3,
    field: 'hardest_part',
    title: 'Eng qiyin bo\'lim',
    question: 'CEFR / IELTS Speaking bo\'limlaridan qaysi biri siz uchun eng qiyini?',
    icon: HelpCircle,
    options: [
      { value: 'part1', label: 'Part 1: Shaxsiy va sodda savollar', desc: 'Kundalik hayot, oila va qiziqishlar haqidagi mavzular.' },
      { value: 'part2', label: 'Part 2: Cue Card (2 daqiqalik nutq)', desc: 'Rejasiz, to\'xtovsiz 2 daqiqa gapirib berish topshirig\'i.' },
      { value: 'part3', label: 'Part 3: Analitik va chuqurroq savollar', desc: 'Fikrni kengaytirish, solishtirish va sabablarini isbotlash.' },
      { value: 'all', label: 'Barcha qismlari birdek qiyin', desc: 'Nutqni boshidan boshlab har tomonlama ishonchli rivojlantirish.' }
    ]
  },
  {
    id: 4,
    field: 'confidence_level',
    title: 'Ishonch darajasi',
    question: 'Ingliz tilida gapirishda o\'z ishonchingizni 1 dan 10 gacha baholang:',
    icon: Volume2,
    isRating: true
  },
  {
    id: 5,
    field: 'main_goal',
    title: 'Asosiy maqsad',
    question: 'Speakora platformasidagi asosiy maqsadingiz nima?',
    icon: Zap,
    options: [
      { value: 'cefr_level', label: 'CEFR / IELTS imtihonidan yuqori ball olish', desc: 'B2 / C1 maqsadli va maqsadli struktura mashqlari.' },
      { value: 'university', label: 'Universitetga kirish yoki sertifikat', desc: 'Akademik va rasmiy suhbatlarda erkin fikrlash.' },
      { value: 'speaking_fluency', label: 'Chet elliklar bilan erkin muloqot qilish', desc: 'Jonli va tabiiy gaplashish ko\'nikmasini shakllantirish.' },
      { value: 'school_lessons', label: 'Darslarda va ishimda eng zo\'ri bo\'lish', desc: 'Speaking mahoratini eng yuqori darajaga olib chiqish.' }
    ]
  }
];

export default function MiniAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({
    exam_date: '',
    biggest_problem: '',
    hardest_part: '',
    confidence_level: null,
    main_goal: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const step = QUESTIONS[currentStepIdx];
  const isLastStep = currentStepIdx === QUESTIONS.length - 1;
  const progressPercent = Math.round(((currentStepIdx + 1) / QUESTIONS.length) * 100);

  const handleSelectOption = (value: string) => {
    setAnswers(prev => ({ ...prev, [step.field]: value }));
    setError('');
  };

  const handleSelectRating = (rating: number) => {
    setAnswers(prev => ({ ...prev, [step.field]: rating }));
    setError('');
  };

  const handleNext = async () => {
    // Validation
    if (!answers[step.field]) {
      setError('Iltimos, ushbu bosqichni to\'ldirish uchun javobni tanlang.');
      return;
    }

    if (currentStepIdx < QUESTIONS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setError('');
    } else {
      // Final submission
      if (!user) {
        setError('Tizimda foydalanuvchi aniqlanmadi. Qayta kirib ko\'ring.');
        return;
      }

      setSaving(true);
      setError('');

      try {
        // Calculate recommended path steps dynamically based on their answers
        const path: string[] = [];
        
        // 1. Core recommendation based on their biggest problem
        if (answers.biggest_problem === 'freezing') {
          path.push('Starter Skeletons (Mavzuni boshlash andozalari)');
        } else if (answers.biggest_problem === 'vocabulary') {
          path.push('High-scoring Phrase Banks (Qimmatbaho bog\'lovchilar)');
        } else if (answers.biggest_problem === 'grammar') {
          path.push('Grammar Templates (Xatosiz gapirish andozalari)');
        } else {
          path.push('Fluency & Speed Boosters (Tezkor fikrlash mashqlari)');
        }

        // 2. Section recommendations
        if (answers.hardest_part === 'part2') {
          path.push('Part 2 Cue Card Skeletons (2 daqiqalik fikr tizimi)');
        } else if (answers.hardest_part === 'part3') {
          path.push('Part 3 Analytical Anchors (Chuqur tahliliy skeletlar)');
        } else {
          path.push('General Speaking Templates (Barcha qismlar uchun)');
        }

        // 3. Goal-based recommendation
        if (answers.main_goal === 'cefr_level') {
          path.push('CEFR B2/C1 Mock Exam Simulyatori');
        } else {
          path.push('Daily Speaking Habits tracker (Har kunlik odat)');
        }

        path.push('Premium Speaking Feedback & Scoring (Baholash)');

        const result = {
          user_id: user.id,
          exam_date: answers.exam_date,
          biggest_problem: answers.biggest_problem,
          hardest_part: answers.hardest_part,
          confidence_level: Number(answers.confidence_level),
          main_goal: answers.main_goal,
          recommended_path: path
        };

        // Save result
        await assessmentService.saveAssessmentResult(result);

        // Store temporarily in session storage to present in PersonalizedPath without fetching latency
        sessionStorage.setItem('speakora_assessment_results', JSON.stringify({
          structureScore: answers.biggest_problem === 'freezing' ? 35 : 65,
          confidenceScore: answers.confidence_level * 10,
          vocabularyScore: answers.biggest_problem === 'vocabulary' ? 40 : 70,
          recommended_path: path,
          exam_date: answers.exam_date,
          biggest_problem: answers.biggest_problem,
          hardest_part: answers.hardest_part,
          confidence_level: answers.confidence_level,
          main_goal: answers.main_goal
        }));

        navigate('/personalized-path');
      } catch (err: any) {
        console.error('Failed to save assessment:', err);
        setError('Natijani saqlashda ulanish xatoligi yuz berdi. Qayta urinib ko\'ring.');
      } finally {
        setSaving(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
      setError('');
    }
  };

  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white flex flex-col justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background radial effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-purple-base/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-gold-base/5 rounded-full blur-[65px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto space-y-6 relative z-10">
        
        {/* Onboarding Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-lg shadow-md shadow-brand-gold-glow">
              S
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-neutral-white to-brand-gold-base bg-clip-text text-transparent">
              Speakora
            </span>
          </div>
          <span className="text-[11px] bg-brand-navy-light text-brand-purple-light px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Savol {step.id} / 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-brand-navy-light/60 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-purple-base to-brand-purple-light transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 bg-brand-navy-dark/95 border-brand-navy-light/50 shadow-2xl relative">
          
          {/* Question title & Icon */}
          <div className="flex items-start gap-3 mb-6">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-purple-base/20 border border-brand-purple-base/30 flex items-center justify-center text-brand-purple-light">
              <StepIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[9px] uppercase font-bold text-brand-purple-light tracking-widest block mb-0.5">
                {step.title}
              </span>
              <h2 className="text-base font-bold font-display text-brand-neutral-white leading-snug">
                {step.question}
              </h2>
            </div>
          </div>

          {error && (
            <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 mb-4 text-center font-medium">
              {error}
            </div>
          )}

          {/* Render Options list */}
          {!step.isRating ? (
            <div className="space-y-3">
              {step.options?.map((option) => {
                const isSelected = answers[step.field] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleSelectOption(option.value)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-start gap-3 relative group ${
                      isSelected 
                        ? 'border-brand-purple-base bg-brand-purple-base/10 shadow-purpleGlow'
                        : 'border-brand-navy-light/50 bg-[#0d1424]/40 hover:border-brand-purple-base/30 hover:bg-brand-navy-light/20'
                    }`}
                  >
                    <div className={`h-4.5 w-4.5 shrink-0 rounded-full border flex items-center justify-center mt-0.5 transition-all ${
                      isSelected 
                        ? 'border-brand-purple-base bg-brand-purple-base text-brand-neutral-white' 
                        : 'border-brand-neutral-textMuted group-hover:border-brand-purple-light'
                    }`}>
                      {isSelected && <CheckCircle className="h-4.5 w-4.5" />}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-bold font-display ${isSelected ? 'text-brand-purple-light' : 'text-brand-neutral-white'}`}>
                        {option.label}
                      </p>
                      <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                        {option.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Render 1-10 interactive confidence grid */
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
                  const isSelected = answers[step.field] === num;
                  return (
                    <button
                      key={num}
                      onClick={() => handleSelectRating(num)}
                      className={`h-12 rounded-xl font-display font-extrabold text-sm border flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-brand-gold-base bg-brand-gold-base/10 text-brand-gold-base shadow-goldGlow scale-105'
                          : 'border-brand-navy-light/60 bg-[#0d1424]/40 hover:border-brand-purple-base/40 text-brand-neutral-textMuted hover:text-brand-neutral-white'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Confidence helper texts */}
              <div className="flex justify-between text-[9px] font-bold text-brand-neutral-textMuted uppercase tracking-wider px-1">
                <span className="text-brand-error/80">1 - Mutlaqo ishonchim yo'q</span>
                <span className="text-brand-success/80">10 - Juda ishonchliman</span>
              </div>

              <div className="bg-brand-purple-glow rounded-xl p-3 border border-brand-purple-base/10 flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-brand-purple-light shrink-0 mt-0.5" />
                <p className="text-[10px] text-brand-neutral-textMuted leading-relaxed">
                  <strong>Nima uchun muhim?</strong> Platformadagi andozalar aynan sizning nutq ishonchingizni oshirib, freezing holatidan qutqarishga yordam beradigan darajadan boshlanadi.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-brand-navy-light/40 flex items-center justify-between">
            {currentStepIdx > 0 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="text-xs text-brand-neutral-textMuted hover:text-brand-neutral-white font-bold flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Orqaga
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={saving}
              className="btn-primary py-2.5 px-5 text-xs flex items-center gap-1.5 font-bold uppercase tracking-wider min-w-[120px] justify-center"
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-navy-base border-t-transparent"></span>
              ) : (
                <>
                  {isLastStep ? 'Natijani tuzish' : 'Keyingisi'}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

        </div>

        {/* Small motivational quote */}
        <p className="text-center text-[10px] text-brand-neutral-textMuted">
          "Speakora yordamida yodlashni to'xtating va gapirishni boshlang!"
        </p>

      </div>
    </div>
  );
}
