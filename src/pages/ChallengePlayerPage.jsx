import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AudioRecorder } from '../components/AudioRecorder';
import { HelpCircle, ChevronLeft, Award, CheckCircle, Keyboard, FileText, Sparkles, RefreshCw, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ChallengePlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { challenges, submitChallenge } = useApp();

  const challenge = challenges.find(c => c.id === id);

  // Core state management
  const [activeSkeletonIdx, setActiveSkeletonIdx] = useState(0);
  const [useTextFallback, setUseTextFallback] = useState(false);
  const [textResponse, setTextResponse] = useState('');
  const [audioRecording, setAudioRecording] = useState(null);
  
  // Checking off phrases manually during practice
  const [checkedPhrases, setCheckedPhrases] = useState([]);
  
  // Feedback results
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Guards
  if (!challenge) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-brand-error">Mashq topilmadi.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-secondary mt-4 py-1.5 px-4 text-xs">
          Ortga qaytish
        </button>
      </div>
    );
  }

  const togglePhrase = (phraseText) => {
    setCheckedPhrases(prev => 
      prev.includes(phraseText) 
        ? prev.filter(p => p !== phraseText) 
        : [...prev, phraseText]
    );
  };

  const handleAudioStop = (blob, url) => {
    setAudioRecording({ blob, url });
  };

  // Automatically check off phrases if user is typing them in the textbox
  const handleTextChange = (e) => {
    const val = e.target.value;
    setTextResponse(val);

    challenge.phraseBank.forEach(p => {
      if (val.toLowerCase().includes(p.phrase.toLowerCase())) {
        if (!checkedPhrases.includes(p.phrase)) {
          setCheckedPhrases(prev => [...prev, p.phrase]);
        }
      }
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const record = await submitChallenge(challenge.id, textResponse, audioRecording?.url || null);
      setEvaluationResult(record.analysis_metadata);
      setIsSubmitted(true);
      
      // Trigger canvas confetti for nice micro-animation
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.8 }
      });
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setIsSubmitted(false);
    setEvaluationResult(null);
    setTextResponse('');
    setAudioRecording(null);
    setCheckedPhrases([]);
    setActiveSkeletonIdx(0);
  };

  return (
    <div className="space-y-5 pb-8 animate-fade-in text-brand-neutral-white">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-3">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-1 text-xs text-brand-neutral-textMuted hover:text-brand-neutral-white"
        >
          <ChevronLeft className="h-4 w-4" /> Chiqish
        </button>
        <span className="text-xs font-bold font-display text-brand-purple-light bg-brand-purple-base/5 px-2 py-0.5 border border-brand-purple-base/10 rounded">
          Mavzu: {challenge.topicUz}
        </span>
      </div>

      {/* Main Question Card */}
      <div className="glass-card p-4 border-brand-navy-light/40 bg-brand-navy-dark/40">
        <span className="text-[10px] text-brand-purple-light font-display font-bold uppercase tracking-wider block mb-1">
          Speaking Prompt ({challenge.difficulty})
        </span>
        <h2 className="text-base font-bold font-display leading-snug text-brand-neutral-white">
          {challenge.question}
        </h2>
        <div className="border-t border-brand-navy-light/40 pt-2 mt-2">
          <p className="text-[11px] text-brand-neutral-textMuted italic">
            Tarjimasi: {challenge.questionUz}
          </p>
        </div>
      </div>

      {!isSubmitted ? (
        <>
          {/* Skeleton Scaffolder Steps */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-2.5 flex items-center gap-1.5">
              <BookmarkCheck className="h-4 w-4 text-brand-purple-light" /> Answer Skeleton (Gapirish Andozasi)
            </h3>
            
            <div className="space-y-2">
              {challenge.skeleton.map((skel, idx) => {
                const isOpen = activeSkeletonIdx === idx;
                return (
                  <div 
                    key={idx}
                    className={`glass-card border-brand-navy-light/40 overflow-hidden transition-all duration-300 ${
                      isOpen ? 'border-brand-purple-base/30 bg-brand-purple-glow' : 'bg-brand-navy-dark/25'
                    }`}
                  >
                    <button
                      onClick={() => setActiveSkeletonIdx(idx)}
                      className="w-full text-left px-4 py-2.5 flex justify-between items-center text-xs font-bold text-brand-neutral-grayLight font-display"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] ${
                          isOpen ? 'bg-brand-purple-base text-brand-neutral-white' : 'bg-brand-navy-light text-brand-neutral-textMuted'
                        }`}>
                          {idx + 1}
                        </span>
                        {skel.stage}
                      </span>
                      <span className="text-[9px] font-normal text-brand-neutral-textMuted uppercase">
                        {isOpen ? 'Yopish' : 'Ko\'rish'}
                      </span>
                    </button>
 
                    {isOpen && (
                      <div className="px-4 pb-3 pt-1 border-t border-brand-navy-light/20 space-y-2.5 text-xs animate-scale-in">
                        <div className="bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
                          <p className="text-[10px] font-bold font-display text-brand-purple-light uppercase tracking-widest mb-1">
                            Uzbek tavsiya:
                          </p>
                          <p className="text-brand-neutral-grayLight leading-relaxed">{skel.tipUz}</p>
                          <p className="text-brand-neutral-textMuted italic mt-1 text-[10px]">{skel.tipEn}</p>
                        </div>
                        <div className="bg-brand-purple-base/5 p-2.5 rounded-lg border border-brand-purple-base/10">
                          <p className="text-[10px] font-bold font-display text-brand-purple-light uppercase tracking-widest mb-1">
                            Gap boshlovchi namuna:
                          </p>
                          <p className="font-mono text-brand-neutral-grayLight select-all cursor-pointer hover:text-brand-purple-light transition-colors">
                            {skel.template}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phrase Bank Checklist */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted mb-2.5 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-brand-success" /> Phrase Bank (Connectorlar)
            </h3>
            
            <div className="glass-card p-3 border-brand-navy-light/40">
              <p className="text-[10px] text-brand-neutral-textMuted leading-normal mb-3">
                Nutqingizda quyidagi bog'lovchilarni ishlatishga harakat qiling. Ularni ishlatganingizda ustiga bosing:
              </p>
              
              <div className="flex flex-wrap gap-2">
                {challenge.phraseBank.map((p, idx) => {
                  const isChecked = checkedPhrases.includes(p.phrase);
                  return (
                    <button
                      key={idx}
                      onClick={() => togglePhrase(p.phrase)}
                      className={`text-[10px] font-semibold py-1.5 px-3 rounded-full border transition-all duration-200 flex items-center gap-1 ${
                        isChecked
                          ? 'bg-brand-success/15 border-brand-success/40 text-brand-success'
                          : 'bg-brand-navy-base border-brand-navy-light/40 text-brand-neutral-textMuted hover:border-brand-navy-light'
                      }`}
                    >
                      <span>{p.phrase}</span>
                      <span className="text-[8px] text-brand-neutral-textMuted">({p.translation})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Input Panel */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted">
                Sizning javobingiz
              </h3>
              <button
                onClick={() => setUseTextFallback(!useTextFallback)}
                className="text-[10px] text-brand-purple-light flex items-center gap-1"
              >
                {useTextFallback ? (
                  <><Keyboard className="h-3.5 w-3.5" /> Audio Mashqqa o'tish</>
                ) : (
                  <><FileText className="h-3.5 w-3.5" /> Matn yozib topshirish</>
                )}
              </button>
            </div>

            {useTextFallback ? (
              <div className="space-y-2 animate-scale-in">
                <textarea
                  rows={4}
                  placeholder="Javobingizni ingliz tilida yozing. Matnda bog'lovchilardan foydalansangiz, ular avtomatik ravishda tasdiqlanadi..."
                  value={textResponse}
                  onChange={handleTextChange}
                  className="w-full glass-input text-xs"
                />
                <p className="text-[10px] text-brand-neutral-textMuted text-right">
                  {textResponse.trim().split(/\s+/).filter(Boolean).length} so'z
                </p>
              </div>
            ) : (
              <AudioRecorder onStopRecording={handleAudioStop} />
            )}
          </div>

          {/* Action buttons */}
          <button
            onClick={handleSubmit}
            disabled={submitting || (!textResponse && !audioRecording)}
            className={`w-full btn-primary py-3 flex items-center justify-center gap-1.5 font-bold ${
              submitting || (!textResponse && !audioRecording) ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Yuborilmoqda...' : 'Javobni yakunlash va tekshirish'}
          </button>
        </>
      ) : (
        /* Evaluation Feedback Report Section */
        <div className="space-y-6 animate-scale-in">
          <div className="glass-card p-5 border-brand-success/20 bg-brand-success/5 text-center">
            <Award className="h-10 w-10 text-brand-success mx-auto mb-2" />
            <h3 className="font-bold font-display text-lg text-brand-neutral-white">Mashq yakunlandi!</h3>
            <div className="mt-3 flex justify-center items-baseline gap-1 text-brand-neutral-grayLight">
              <span className="text-3xl font-extrabold font-mono text-brand-success">
                {evaluationResult?.score}%
              </span>
              <span className="text-xs">umumiy ball</span>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="glass-card p-4 border-brand-navy-light/40 space-y-4 text-xs">
            <h4 className="font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2">
              Batafsil natijalar
            </h4>

            {/* Word length */}
            <div className="flex justify-between items-center">
              <span className="text-brand-neutral-textMuted">So'zlar soni:</span>
              <span className="font-mono font-bold text-brand-neutral-grayLight">{evaluationResult?.word_count} ta</span>
            </div>

            {/* Fluency rating */}
            <div className="flex justify-between items-center">
              <span className="text-brand-neutral-textMuted">Ravonlik darajasi (Fluency):</span>
              <span className="font-bold text-brand-purple-light">{evaluationResult?.fluency_rating}</span>
            </div>

            {/* Connector checks */}
            <div className="space-y-2 border-t border-brand-navy-light/40 pt-3">
              <span className="text-[10px] text-brand-neutral-textMuted font-bold font-display uppercase tracking-wider block">
                Ishlatilgan bog'lovchilar:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {challenge.phraseBank.map((p, idx) => {
                  const wasUsed = evaluationResult?.used_phrases.includes(p.phrase);
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-center gap-1.5 py-1 px-2 rounded-lg border text-[10px] ${
                        wasUsed 
                          ? 'bg-brand-success/5 border-brand-success/20 text-brand-success' 
                          : 'bg-brand-navy-base border-brand-navy-light/40 text-brand-neutral-textMuted'
                      }`}
                    >
                      <CheckCircle className={`h-3 w-3 shrink-0 ${wasUsed ? 'text-brand-success' : 'text-brand-neutral-textMuted'}`} />
                      <span className="truncate">{p.phrase}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Navigation */}
          <div className="flex gap-3">
            <button
              onClick={handleRetry}
              className="flex-1 btn-secondary py-3 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-4 w-4" /> Qayta urinish
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-primary py-3"
            >
              Mashqlarga qaytish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
