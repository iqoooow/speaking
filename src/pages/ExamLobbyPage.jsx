import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Volume2, ShieldCheck, PlayCircle, Mic, AlertCircle, Headphones } from 'lucide-react';

export default function ExamLobbyPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  // Mic check state
  const [micAccessGranted, setMicAccessGranted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [recordedPlayUrl, setRecordedPlayUrl] = useState('');
  const [isTestRecording, setIsTestRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const testChunksRef = useRef([]);

  // Guard: premium user check
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    const premiumActive = user.subscription_status === 'premium' || user.role === 'admin';
    if (!premiumActive) {
      navigate('/billing');
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      cleanupMicCheck();
    };
  }, []);

  const cleanupMicCheck = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  const startMicCheck = async () => {
    setErrorMsg('');
    setChecking(true);
    setRecordedPlayUrl('');
    testChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setMicAccessGranted(true);

      // Setup audio analyzer
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);

      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      // Start decibel level indicator loop
      drawMeter();

      // Record a quick sample
      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          testChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(testChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        setRecordedPlayUrl(URL.createObjectURL(audioBlob));
        setIsTestRecording(false);
      };

      recorder.start();
      setIsTestRecording(true);

      // Stop test recording automatically after 3 seconds
      setTimeout(() => {
        if (recorder && recorder.state === 'recording') {
          recorder.stop();
        }
        cleanupMicCheck();
        setChecking(false);
      }, 3000);

    } catch (err) {
      console.error(err);
      setChecking(false);
      setMicAccessGranted(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Mikrofonga ruxsat berilmadi. Iltimos, brauzer sozlamalaridan faollashtiring.');
      } else {
        setErrorMsg('Ulanishda xatolik: ' + err.message);
      }
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
    const scaled = Math.min(100, Math.round((avg / 128) * 100));
    
    setVolumeLevel(scaled);
    animationFrameRef.current = requestAnimationFrame(drawMeter);
  };

  const handleStartExam = () => {
    // Go to fullscreen player
    navigate('/exam/player');
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in text-brand-neutral-white">
      {/* Header */}
      <div className="flex items-center gap-1 border-b border-brand-navy-light/40 pb-3">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-0.5 text-xs text-brand-neutral-textMuted hover:text-brand-neutral-white"
        >
          <ChevronLeft className="h-4 w-4" /> Chiqish
        </button>
      </div>

      {/* Intro Card */}
      <div className="glass-card p-5 border-brand-navy-light/40 bg-brand-navy-dark/40 text-center">
        <Headphones className="h-10 w-10 text-brand-purple-light mx-auto mb-3" />
        <h2 className="text-xl font-bold font-display">Imtihon Xonasi (Lobby)</h2>
        <p className="text-xs text-brand-neutral-textMuted mt-2 leading-relaxed max-w-sm mx-auto">
          Ushbu mock testi rasmiy CEFR Speaking formatida o'tkaziladi. Ovoz yozish to'liq avtomatlashtirilgan. Boshlashdan oldin mikrofoni tekshirib oling.
        </p>
      </div>

      {/* Structure details */}
      <div className="glass-card p-4 border-brand-navy-light/40 space-y-3">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2">
          Imtihon tarkibi
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
            <span className="font-bold font-display text-brand-purple-light block">Part 1.1: Personal</span>
            <span className="text-brand-neutral-textMuted mt-0.5 block">3 ta qisqa savol</span>
          </div>
          <div className="bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
            <span className="font-bold font-display text-brand-purple-light block">Part 1.2: Pictures</span>
            <span className="text-brand-neutral-textMuted mt-0.5 block">2 ta rasmni solishtirish</span>
          </div>
          <div className="bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
            <span className="font-bold font-display text-brand-purple-light block">Part 2: Long Speaking</span>
            <span className="text-brand-neutral-textMuted mt-0.5 block">1 ta mavzu taqdimoti</span>
          </div>
          <div className="bg-brand-navy-base p-2.5 rounded-lg border border-brand-navy-light/40">
            <span className="font-bold font-display text-brand-purple-light block">Part 3: Debate</span>
            <span className="text-brand-neutral-textMuted mt-0.5 block">FOR/AGAINST tezisi</span>
          </div>
        </div>
      </div>

      {/* Technical check panel */}
      <div className="glass-card p-5 border-brand-navy-light/40 space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2 flex items-center gap-1.5">
          <Volume2 className="h-4 w-4 text-brand-purple-light" /> Texnik sinov (Mic Check)
        </h3>

        {errorMsg && (
          <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Volume levels or loader */}
        {checking && (
          <div className="space-y-2 text-center animate-pulse">
            <Mic className="h-6 w-6 text-brand-error mx-auto animate-bounce" />
            <span className="text-[10px] text-brand-error font-bold font-display uppercase tracking-widest block">
              Gapiring (3 soniya yozilmoqda)...
            </span>
            {/* Real decibel bar */}
            <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden mt-1">
              <div 
                style={{ width: `${volumeLevel}%` }} 
                className="h-full bg-brand-error rounded-full transition-all duration-75"
              />
            </div>
          </div>
        )}

        {!checking && recordedPlayUrl && (
          <div className="space-y-3 bg-brand-navy-base/60 p-3 rounded-xl border border-brand-navy-light/40 animate-scale-in">
            <span className="text-[10px] text-brand-success font-semibold flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-brand-success animate-pulse" /> Mikrofon ishlamoqda! O'z ovozingizni eshiting:
            </span>
            <audio src={recordedPlayUrl} controls className="w-full h-8 bg-brand-navy-dark rounded-lg" />
          </div>
        )}

        {!checking && !recordedPlayUrl && (
          <button
            onClick={startMicCheck}
            className="w-full btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            <Mic className="h-4 w-4 text-brand-purple-light" /> Mikrofonni tekshirish
          </button>
        )}

        {recordedPlayUrl && (
          <button
            onClick={startMicCheck}
            className="w-full btn-secondary py-2.5 text-xs flex items-center justify-center gap-1.5"
          >
            Qayta tekshirish
          </button>
        )}
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartExam}
        disabled={!recordedPlayUrl}
        className={`w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-bold text-sm ${
          !recordedPlayUrl ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        <PlayCircle className="h-5 w-5" /> Imtihonni boshlash
      </button>

      {!recordedPlayUrl && (
        <p className="text-[10px] text-brand-neutral-textMuted text-center leading-normal">
          Imtihonni boshlash uchun avval mikrofon sinovini yakunlang.
        </p>
      )}
    </div>
  );
}
