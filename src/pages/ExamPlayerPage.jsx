import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertCircle, Timer, Mic, Volume2, HelpCircle, ArrowRight, Loader } from 'lucide-react';

export default function ExamPlayerPage() {
  const navigate = useNavigate();
  const { mockExams, submitExam, user } = useApp();

  const exam = mockExams[0]; // Set A

  // Setup exam steps loop
  const examSteps = [
    {
      id: 'p1_q1',
      part: 'p1_1',
      title: 'Part 1.1 - Shaxsiy Savol (1/3)',
      question: exam.parts.part_1_1.questions[0].text,
      instructions: exam.parts.part_1_1.instructionsUz,
      prepTime: exam.parts.part_1_1.questions[0].prepTime,
      speakTime: exam.parts.part_1_1.questions[0].speakTime
    },
    {
      id: 'p1_q2',
      part: 'p1_1',
      title: 'Part 1.1 - Shaxsiy Savol (2/3)',
      question: exam.parts.part_1_1.questions[1].text,
      instructions: exam.parts.part_1_1.instructionsUz,
      prepTime: exam.parts.part_1_1.questions[1].prepTime,
      speakTime: exam.parts.part_1_1.questions[1].speakTime
    },
    {
      id: 'p1_q3',
      part: 'p1_1',
      title: 'Part 1.1 - Shaxsiy Savol (3/3)',
      question: exam.parts.part_1_1.questions[2].text,
      instructions: exam.parts.part_1_1.instructionsUz,
      prepTime: exam.parts.part_1_1.questions[2].prepTime,
      speakTime: exam.parts.part_1_1.questions[2].speakTime
    },
    {
      id: 'p1_2',
      part: 'p1_2',
      title: 'Part 1.2 - Rasmlarni Solishtirish',
      instructions: exam.parts.part_1_2.instructionsUz,
      image1Url: exam.parts.part_1_2.image1Url,
      image2Url: exam.parts.part_1_2.image2Url,
      prepTime: exam.parts.part_1_2.prepTime,
      speakTime: exam.parts.part_1_2.speakTime
    },
    {
      id: 'p2',
      part: 'p2',
      title: 'Part 2 - Mavzu Taqdimoti (Long Speaking)',
      instructions: exam.parts.part_2.instructionsUz,
      imageUrl: exam.parts.part_2.imageUrl,
      topic: exam.parts.part_2.topic,
      guidingQuestions: exam.parts.part_2.guidingQuestions,
      prepTime: exam.parts.part_2.prepTime,
      speakTime: exam.parts.part_2.speakTime
    },
    {
      id: 'p3',
      part: 'p3',
      title: 'Part 3 - Munozara (Debate)',
      instructions: exam.parts.part_3.instructionsUz,
      statement: exam.parts.part_3.statement,
      pointsFor: exam.parts.part_3.pointsFor,
      pointsAgainst: exam.parts.part_3.pointsAgainst,
      prepTime: exam.parts.part_3.prepTime,
      speakTime: exam.parts.part_3.speakTime
    }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [timerState, setTimerState] = useState('prep'); // 'prep' | 'speak' | 'saving'
  const [timeRemaining, setTimeRemaining] = useState(examSteps[0].prepTime);
  const [recordedAudios, setRecordedAudios] = useState({}); // { id: blobUrl }
  const [micStream, setMicStream] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);

  const activeStep = examSteps[currentStepIdx];

  // Request Mic on load
  useEffect(() => {
    initMicrophone();
    return () => {
      stopTimers();
      cleanupAudioNodes();
    };
  }, []);

  // Monitor steps change to reset timer
  useEffect(() => {
    if (timerState !== 'saving') {
      setTimeRemaining(timerState === 'prep' ? activeStep.prepTime : activeStep.speakTime);
      
      if (timerState === 'speak') {
        startRecording();
      }
    }
  }, [currentStepIdx, timerState]);

  // Main countdown ticking logic
  useEffect(() => {
    if (timerState === 'saving') return;

    if (timeRemaining > 0) {
      timerIntervalRef.current = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else {
      if (timerState === 'prep') {
        // Transition prep -> speak
        setTimerState('speak');
      } else if (timerState === 'speak') {
        // Transition speak -> next step
        stopRecordingAndAdvance();
      }
    }

    return () => {
      if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
    };
  }, [timeRemaining, timerState]);

  const initMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);

      // Setup audio levels meter
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
      drawMeter();
    } catch (err) {
      console.error(err);
      alert('Mikrofon topilmadi yoki ruxsat etilmadi. Lobby-ga qaytib tekshiring.');
      navigate('/exam/lobby');
    }
  };

  const drawMeter = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const avg = sum / dataArrayRef.current.length;
    setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
    animationFrameRef.current = requestAnimationFrame(drawMeter);
  };

  const startRecording = () => {
    if (!micStream) return;
    audioChunksRef.current = [];

    let recorder;
    try {
      recorder = new MediaRecorder(micStream, { mimeType: 'audio/webm' });
    } catch (e) {
      recorder = new MediaRecorder(micStream);
    }

    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
      const url = URL.createObjectURL(audioBlob);
      
      setRecordedAudios(prev => {
        const copy = { ...prev, [activeStep.id]: url };
        
        // If this was the last step, finalize the exam record
        if (currentStepIdx === examSteps.length - 1) {
          finalizeExam(copy);
        } else {
          // Otherwise, go to next step and set to prep
          setCurrentStepIdx(idx => idx + 1);
          setTimerState('prep');
        }
        return copy;
      });
    };

    recorder.start(250);
  };

  const stopRecordingAndAdvance = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback if mic was blocked
      if (currentStepIdx === examSteps.length - 1) {
        finalizeExam(recordedAudios);
      } else {
        setCurrentStepIdx(idx => idx + 1);
        setTimerState('prep');
      }
    }
  };

  const skipPrep = () => {
    if (timerState === 'prep') {
      setTimerState('speak');
    }
  };

  const finalizeExam = async (audios) => {
    setTimerState('saving');
    stopTimers();
    cleanupAudioNodes();

    // Mock analysis calculation
    const scores = [6.5, 7.0, 7.5, 8.0];
    const scoreIdx = Math.floor(Math.random() * scores.length);
    const mockScoreText = scores[scoreIdx].toFixed(1); // Estimated CEFR Level index

    const feedback = {
      overall_band: mockScoreText,
      structure: scoreIdx > 2 ? "A'lo" : "Yaxshi. Kirish va xulosa qismlarida andozalar to'liq ishlatildi.",
      fluency: scoreIdx > 2 ? "Ravon nutq, pauzalar kam." : "Tezlik yaxshi, biroz ikkilanishlar bor.",
      recovery_plan: [
        "Daily Challenge 1: Solishtirish mashqlari (On the flip side, whereas bog'lovchilari ustida ishlash).",
        "Daily Challenge 3: Debate qarshi fikr bildirish andozalarini takrorlash."
      ]
    };

    try {
      const record = await submitExam(exam.id, audios, Math.floor(scores[scoreIdx]), feedback);
      setTimeout(() => {
        navigate(`/exam/report/${record.id}`);
      }, 1500);
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    }
  };

  const stopTimers = () => {
    if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current);
  };

  const cleanupAudioNodes = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
    }
  };

  // Skip entire exam option (for debugging or quick user skip)
  const forceExit = () => {
    if (window.confirm("Haqiqatan ham imtihondan chiqmoqchisiz? Barcha yozuvlar o'chib ketadi.")) {
      navigate('/dashboard');
    }
  };

  if (timerState === 'saving') {
    return (
      <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white flex flex-col items-center justify-center px-6 text-center">
        <Loader className="h-10 w-10 text-brand-purple-light animate-spin mb-3" />
        <h3 className="text-lg font-bold font-display">Imtihon yakunlandi</h3>
        <p className="text-xs text-brand-neutral-textMuted mt-1">Ovozli javoblar tahlil qilinib, shaxsiy hisobot tayyorlanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-brand-navy-base text-brand-neutral-white px-4 py-6 justify-between select-none">
      
      {/* Top Status Area */}
      <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-3">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold font-display text-brand-neutral-textMuted uppercase tracking-widest">Speakora Immersive Exam</span>
          <span className="text-xs font-bold font-display text-brand-purple-light">{activeStep.title}</span>
        </div>
        <button
          onClick={forceExit}
          className="text-[10px] text-brand-neutral-textMuted hover:text-brand-neutral-white font-semibold border border-brand-navy-light/40 rounded px-2 py-0.5"
        >
          Imtihonni yakunlash
        </button>
      </div>

      {/* Progress Line */}
      <div className="w-full flex gap-1 mt-3">
        {examSteps.map((s, idx) => (
          <div 
            key={s.id} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              idx === currentStepIdx 
                ? (timerState === 'speak' ? 'bg-brand-error animate-pulse' : 'bg-brand-warning') 
                : idx < currentStepIdx ? 'bg-brand-purple-base' : 'bg-brand-navy-light'
            }`} 
          />
        ))}
      </div>

      {/* Timer and Recording status banner */}
      <div className="my-6">
        <div className="glass-card p-4 border-brand-navy-light/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {timerState === 'prep' ? (
              <div className="relative h-12 w-12 rounded-full border-2 border-brand-warning flex items-center justify-center shrink-0">
                <span className="text-base font-bold font-mono text-brand-warning">{timeRemaining}</span>
              </div>
            ) : (
              <div className="relative h-12 w-12 rounded-full border-2 border-brand-error flex items-center justify-center shrink-0 bg-brand-error/10">
                <span className="text-base font-bold font-mono text-brand-error">{timeRemaining}</span>
              </div>
            )}
            
            <div>
              <h4 className={`text-xs font-bold font-display ${timerState === 'prep' ? 'text-brand-warning' : 'text-brand-error'}`}>
                {timerState === 'prep' ? 'TAYYORGARLIK' : 'JAVOB BERISH'}
              </h4>
              <p className="text-[10px] text-brand-neutral-textMuted mt-0.5 leading-tight">
                {timerState === 'prep' 
                  ? 'Savolga tayyorlanib, eslatmalar yozib oling.' 
                  : 'Fikrlaringizni andozalar asosida baland ovozda yozib qoldiring.'
                }
              </p>
            </div>
          </div>

          {timerState === 'prep' ? (
            <button
              onClick={skipPrep}
              className="btn-secondary py-1.5 px-3 text-[10px] font-bold"
            >
              Tayyorlanishni o'tkazish
            </button>
          ) : (
            <div className="flex items-end gap-1 h-6">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  style={{ height: `${Math.max(10, Math.min(100, volumeLevel * (0.3 + Math.sin(i) * 0.5)))}%` }}
                  className="w-1 bg-brand-error rounded-full transition-all duration-75"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area (Dynamic based on part) */}
      <div className="flex-1 flex flex-col justify-center my-2 overflow-y-auto max-h-[50vh]">
        {/* Instructions */}
        <p className="text-[10px] text-brand-neutral-textMuted italic mb-3 bg-brand-navy-base p-2 rounded border border-brand-navy-light/20 leading-normal">
          Yo'riqnoma: {activeStep.instructions}
        </p>

        {/* Render Part 1.1 (Short Text Question) */}
        {activeStep.part === 'p1_1' && (
          <div className="glass-card p-5 border-brand-navy-light/40 text-center bg-brand-navy-dark/40">
            <span className="text-[10px] text-brand-neutral-textMuted uppercase font-semibold">Qisqa shaxsiy savol</span>
            <p className="text-lg font-bold text-brand-neutral-white mt-2 leading-relaxed">
              "{activeStep.question}"
            </p>
          </div>
        )}

        {/* Render Part 1.2 (Picture Comparison) */}
        {activeStep.part === 'p1_2' && (
          <div className="space-y-3">
            <span className="text-[10px] text-brand-neutral-textMuted uppercase font-semibold text-center block">Ikki rasmni solishtiring</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="glass-card overflow-hidden border-brand-navy-light/40 flex flex-col">
                <img src={activeStep.image1Url} alt="1-rasm" className="h-32 w-full object-cover" />
                <span className="text-[9px] text-brand-neutral-textMuted p-2 text-center bg-brand-navy-base">Rasm A</span>
              </div>
              <div className="glass-card overflow-hidden border-brand-navy-light/40 flex flex-col">
                <img src={activeStep.image2Url} alt="2-rasm" className="h-32 w-full object-cover" />
                <span className="text-[9px] text-brand-neutral-textMuted p-2 text-center bg-brand-navy-base">Rasm B</span>
              </div>
            </div>
          </div>
        )}

        {/* Render Part 2 (Topic presentation with guided bullets) */}
        {activeStep.part === 'p2' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <img src={activeStep.imageUrl} alt="Mavzu rasmi" className="w-24 h-24 rounded-xl object-cover border border-brand-navy-light/40" />
              <div className="flex-1">
                <span className="text-[10px] text-brand-neutral-textMuted uppercase font-semibold">Mavzu taqdimoti</span>
                <h3 className="font-bold text-sm text-brand-neutral-grayLight mt-0.5">{activeStep.topic}</h3>
                <p className="text-[9px] text-brand-neutral-textMuted mt-1">Ushbu mavzu yuzasidan 2 daqiqa gapiring.</p>
              </div>
            </div>

            <div className="bg-brand-navy-base p-3.5 rounded-xl border border-brand-navy-light/40">
              <span className="text-[9px] text-brand-purple-light font-bold font-display uppercase tracking-wider block mb-1">
                Quyidagilarga to'xtaling:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-brand-neutral-grayLight">
                {activeStep.guidingQuestions.map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Render Part 3 (Debate tables) */}
        {activeStep.part === 'p3' && (
          <div className="space-y-3">
            <div className="bg-brand-purple-glow p-3 rounded-xl border border-brand-purple-base/20">
              <span className="text-[9px] text-brand-purple-light font-bold font-display block mb-1">Munozara tezisi:</span>
              <p className="text-xs font-bold leading-normal text-brand-neutral-white">
                "{activeStep.statement}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[9px] leading-relaxed">
              <div className="bg-brand-success/5 p-3 rounded-lg border border-brand-success/10">
                <span className="font-bold font-display text-brand-success block mb-1">FOR (Qo'llab-quvvatlash)</span>
                <ul className="list-disc pl-3 space-y-1 text-brand-neutral-grayLight">
                  {activeStep.pointsFor.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-brand-error/5 p-3 rounded-lg border border-brand-error/10">
                <span className="font-bold font-display text-brand-error block mb-1">AGAINST (Qarshi fikr)</span>
                <ul className="list-disc pl-3 space-y-1 text-brand-neutral-grayLight">
                  {activeStep.pointsAgainst.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mic sound level bar footer */}
      <div className="border-t border-brand-navy-light/40 pt-4 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10px] text-brand-neutral-textMuted bg-brand-navy-base px-3 py-1 rounded-full border border-brand-navy-light/40">
          <Mic className={`h-3 w-3 ${timerState === 'speak' ? 'text-brand-error animate-pulse' : 'text-brand-neutral-textMuted'}`} />
          <span>Mikrofoningiz faol</span>
        </div>
      </div>

    </div>
  );
}
