import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioRecorder } from '../components/AudioRecorder';
import { Sparkles, ArrowRight, HelpCircle, FileText, Keyboard, AlertCircle, Timer } from 'lucide-react';

const ASSESSMENT_STEPS = [
  {
    id: 1,
    title: "1-savol: Shaxsiy savol (Personal)",
    question: "How do you usually spend your free time on weekends?",
    questionUz: "Dam olish kunlari bo'sh vaqtingizni odatda qanday o'tkazasiz?",
    prepTime: 15,
    speakTime: 30
  },
  {
    id: 2,
    title: "2-savol: Rasm tanlash (Comparison)",
    question: "Do you prefer studying alone in a quiet room or studying with friends in a group? Why?",
    questionUz: "Yolg'iz sokin xonada o'qishni afzal ko'rasizmi yoki do'stlaringiz bilan guruhdami? Nima uchun?",
    prepTime: 20,
    speakTime: 40
  },
  {
    id: 3,
    title: "3-savol: Shaxsiy fikr (Opinion)",
    question: "Should mobile phones be banned inside school classrooms? Give reasons.",
    questionUz: "Maktab sinfxonalarida uyali telefonlardan foydalanish taqiqlanishi kerakmi? Sabablarini keltiring.",
    prepTime: 20,
    speakTime: 45
  }
];

export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(ASSESSMENT_STEPS[0].prepTime);
  const [speakTimeRemaining, setSpeakTimeRemaining] = useState(ASSESSMENT_STEPS[0].speakTime);
  const [timerState, setTimerState] = useState('idle'); // 'idle' | 'prep' | 'speak' | 'completed'
  const [useTextFallback, setUseTextFallback] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [audioRecording, setAudioRecording] = useState(null);
  
  // Accumulated data for path generation
  const [answers, setAnswers] = useState([]);

  const timerIntervalRef = useRef(null);
  const step = ASSESSMENT_STEPS[currentStepIdx];

  // Initialize timer for current step
  useEffect(() => {
    resetStepStates();
  }, [currentStepIdx]);

  // Handle timer progression
  useEffect(() => {
    if (timerState === 'prep') {
      if (prepTimeRemaining > 0) {
        timerIntervalRef.current = setTimeout(() => {
          setPrepTimeRemaining(prev => prev - 1);
        }, 1000);
      } else {
        startSpeaking();
      }
    } else if (timerState === 'speak') {
      if (speakTimeRemaining > 0) {
        timerIntervalRef.current = setTimeout(() => {
          setSpeakTimeRemaining(prev => prev - 1);
        }, 1000);
      } else {
        // Auto-complete speaking time
        finishSpeaking();
      }
    }

    return () => {
      if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
    };
  }, [timerState, prepTimeRemaining, speakTimeRemaining]);

  const resetStepStates = () => {
    if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
    const activeStep = ASSESSMENT_STEPS[currentStepIdx];
    setPrepTimeRemaining(activeStep.prepTime);
    setSpeakTimeRemaining(activeStep.speakTime);
    setTimerState('idle');
    setTextResponse('');
    setAudioRecording(null);
  };

  const startPrep = () => {
    setTimerState('prep');
  };

  const startSpeaking = () => {
    if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
    setTimerState('speak');
  };

  const finishSpeaking = () => {
    if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
    setTimerState('completed');
  };

  const handleAudioStop = (blob, url) => {
    setAudioRecording({ blob, url });
    finishSpeaking();
  };

  const handleNextStep = () => {
    // Record current answer metadata
    const wordCount = textResponse ? textResponse.trim().split(/\s+/).length : (audioRecording ? Math.floor(Math.random() * 20) + 15 : 0);
    const currentAnswer = {
      stepId: step.id,
      wordCount,
      hasAudio: !!audioRecording,
      text: textResponse
    };
    
    const updatedAnswers = [...answers, currentAnswer];
    setAnswers(updatedAnswers);

    if (currentStepIdx < ASSESSMENT_STEPS.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      // Finished all 3 steps. Calculate score mock metrics and navigate to path view
      
      // Calculate scores
      let avgWords = 0;
      let audioCount = 0;
      updatedAnswers.forEach(ans => {
        avgWords += ans.wordCount;
        if (ans.hasAudio) audioCount++;
      });
      avgWords = avgWords / updatedAnswers.length;

      // Simple heuristic ranges
      const structureScore = avgWords > 30 ? 70 : avgWords > 15 ? 50 : 30;
      const confidenceScore = Math.round((audioCount / 3) * 100);
      const vocabularyScore = avgWords > 40 ? 75 : avgWords > 20 ? 55 : 35;

      const pathData = {
        structureScore,
        confidenceScore,
        vocabularyScore,
        answers: updatedAnswers
      };

      // Store in session storage so `/path` can pick it up
      sessionStorage.setItem('speakora_assessment_results', JSON.stringify(pathData));
      navigate('/path');
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-brand-navy-base text-brand-neutral-white px-4 py-6">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-3 mb-5">
        <span className="text-sm font-semibold font-display text-brand-purple-light">Diagnostic Assessment</span>
        <span className="text-xs text-brand-neutral-textMuted">Savol {step.id} / 3</span>
      </div>

      {/* Progress line */}
      <div className="w-full flex gap-1 mb-6">
        {ASSESSMENT_STEPS.map((s, idx) => (
          <div 
            key={s.id} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx <= currentStepIdx ? 'bg-brand-purple-base' : 'bg-brand-navy-light'
            }`} 
          />
        ))}
      </div>

      {/* Step Container */}
      <div className="flex-1 flex flex-col justify-start">
        <div className="glass-card p-5 border-brand-purple-base/20 mb-6 bg-brand-purple-glow">
          <span className="text-[10px] uppercase font-bold font-display tracking-wider text-brand-purple-light block mb-1">
            {step.title}
          </span>
          <h2 className="text-xl font-bold font-display leading-snug mb-3 text-brand-neutral-white">
            {step.question}
          </h2>
          <div className="border-t border-brand-navy-light/40 pt-2.5 mt-2">
            <p className="text-xs text-brand-neutral-textMuted italic">
              Tarjimasi: {step.questionUz}
            </p>
          </div>
        </div>

        {/* Timer status panel */}
        {timerState === 'idle' && (
          <div className="glass-card p-5 text-center border-brand-navy-light/40 mb-6 animate-scale-in">
            <Timer className="h-8 w-8 text-brand-purple-light mx-auto mb-2" />
            <h4 className="font-bold font-display text-sm">Savolga tayyorgarlik</h4>
            <p className="text-xs text-brand-neutral-textMuted mt-1 max-w-xs mx-auto">
              Tayyor bo'lganingizda vaqtni boshlang. Sizda {step.prepTime} soniya tayyorgarlik va {step.speakTime} soniya javob berish vaqti bo'ladi.
            </p>
            <button
              onClick={startPrep}
              className="btn-primary mt-4 py-2 px-6 text-xs"
            >
              Tayyorgarlikni boshlash
            </button>
          </div>
        )}

        {timerState === 'prep' && (
          <div className="glass-card p-5 text-center border-brand-warning/30 bg-brand-warning/5 mb-6 animate-scale-in">
            <div className="relative h-12 w-12 rounded-full border-2 border-brand-warning flex items-center justify-center mx-auto mb-2">
              <span className="text-lg font-bold font-mono text-brand-warning">{prepTimeRemaining}</span>
            </div>
            <h4 className="font-bold font-display text-sm text-brand-warning">Fikrni shakllantiring...</h4>
            <p className="text-xs text-brand-neutral-textMuted mt-1">
              Savol tarjimasiga qarang va nima deyishni rejalashtiring.
            </p>
            <button
              onClick={startSpeaking}
              className="btn-secondary mt-4 py-1.5 px-4 text-xs"
            >
              Kutmasdan gapirishni boshlash
            </button>
          </div>
        )}

        {(timerState === 'speak' || timerState === 'completed') && (
          <div className="space-y-6 animate-scale-in">
            {/* Input toggle switcher */}
            <div className="flex justify-end gap-2 mb-2">
              <button
                onClick={() => setUseTextFallback(!useTextFallback)}
                className="text-[10px] text-brand-purple-light flex items-center gap-1 hover:underline"
              >
                {useTextFallback ? (
                  <><Keyboard className="h-3 w-3" /> Audio formatga o'tish</>
                ) : (
                  <><FileText className="h-3 w-3" /> Yozma formatda topshirish</>
                )}
              </button>
            </div>

            {useTextFallback ? (
              <div className="space-y-3">
                <textarea
                  rows={4}
                  placeholder="Javobingizni bu yerga ingliz tilida yozing..."
                  value={textResponse}
                  onChange={(e) => setTextResponse(e.target.value)}
                  className="w-full glass-input text-sm focus:border-brand-purple-base"
                />
                <div className="flex justify-between items-center text-[10px] text-brand-neutral-textMuted">
                  <span>Ingliz tilida yozilishi shart</span>
                  <span>{textResponse.trim().split(/\s+/).filter(Boolean).length} so'z</span>
                </div>
              </div>
            ) : (
              <AudioRecorder
                onStopRecording={handleAudioStop}
                maxDuration={step.speakTime}
                isDisabled={timerState === 'completed'}
              />
            )}

            {/* Speaking timer count */}
            {timerState === 'speak' && (
              <div className="flex items-center justify-center gap-2 text-xs text-brand-neutral-textMuted py-1 bg-brand-navy-base rounded-lg">
                <span className="h-2 w-2 rounded-full bg-brand-purple-base animate-ping"></span>
                <span>Tavsiya etilgan gapirish vaqti: <strong className="font-mono text-brand-neutral-white">{speakTimeRemaining} soniya</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Buttons */}
      <div className="mt-8 border-t border-brand-navy-light/40 pt-4 flex justify-between items-center">
        <button
          onClick={() => {
            if (currentStepIdx > 0) {
              setCurrentStepIdx(prev => prev - 1);
            } else {
              navigate('/');
            }
          }}
          className="text-xs text-brand-neutral-textMuted hover:text-brand-neutral-white"
        >
          Orqaga
        </button>

        <button
          onClick={handleNextStep}
          disabled={timerState === 'idle' || timerState === 'prep'}
          className={`btn-primary py-2 px-5 text-xs flex items-center gap-1.5 ${
            timerState === 'idle' || timerState === 'prep' ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          {currentStepIdx === ASSESSMENT_STEPS.length - 1 ? 'Natijani ko\'rish' : 'Keyingi savol'}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
