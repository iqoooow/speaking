import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Play, Trash2, AlertCircle, RefreshCw } from 'lucide-react';

export const AudioRecorder = ({ onStopRecording, maxDuration, isDisabled = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationFrameRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up timers and audio nodes on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  const cleanupAudio = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    // Stop tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  // Monitor max duration
  useEffect(() => {
    if (maxDuration && timeElapsed >= maxDuration && isRecording) {
      stopRecording();
    }
  }, [timeElapsed, maxDuration, isRecording]);

  const startRecording = async () => {
    setErrorMsg('');
    setAudioUrl('');
    audioChunksRef.current = [];
    setTimeElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder brauzer tomonidan qo\'llab-quvvatlanmaydi.');
      }

      // Setup recorder
      const options = { mimeType: 'audio/webm' };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        // Fallback for Safari/iOS
        recorder = new MediaRecorder(stream);
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
        setAudioUrl(url);
        if (onStopRecording) {
          onStopRecording(audioBlob, url);
        }
      };

      // Web Audio API for volume meter
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        
        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        
        // Start meter drawing loop
        drawMeter();
      } catch (audioApiErr) {
        console.warn('Volume meter could not be initialized:', audioApiErr);
      }

      // Start actual recording
      recorder.start(250); // Slice every 250ms
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Mic Access Error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Mikrofonga ruxsat berilmadi. Iltimos, brauzer sozlamalarida mikrofonga ruxsat bering.');
      } else {
        setErrorMsg('Mikrofonni faollashtirib bo\'lmadi: ' + err.message);
      }
    }
  };

  const drawMeter = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    
    // Average volume calculation
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const average = sum / dataArrayRef.current.length;
    
    // Scale average (0-255) to 0-100
    const scaled = Math.min(100, Math.round((average / 128) * 100));
    setVolumeLevel(scaled);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      animationFrameRef.current = requestAnimationFrame(drawMeter);
    } else {
      setVolumeLevel(0);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    cleanupAudio();
    setIsRecording(false);
  };

  const resetRecorder = () => {
    cleanupAudio();
    setIsRecording(false);
    setTimeElapsed(0);
    setAudioUrl('');
    setVolumeLevel(0);
    setErrorMsg('');
    audioChunksRef.current = [];
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      {errorMsg && (
        <div className="w-full bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 mb-4 flex items-start gap-2 animate-scale-in">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="w-full glass-card p-4 flex flex-col items-center justify-center border-brand-navy-light/40">
        {/* Visual Feedback States */}
        {!isRecording && !audioUrl && (
          <div className="text-center py-4">
            <p className="text-xs text-brand-neutral-textMuted">Javobni audio shaklida yozib oling</p>
            <p className="text-[10px] text-brand-purple-light mt-1 font-display">Tayyor bo'lganingizda mikrofonga bosing</p>
          </div>
        )}

        {isRecording && (
          <div className="w-full flex flex-col items-center py-2">
            <span className="text-xs font-semibold text-brand-error flex items-center gap-1.5 animate-pulse-slow">
              <span className="h-2 w-2 rounded-full bg-brand-error"></span> Yozilmoqda
            </span>
            <span className="text-2xl font-bold font-mono mt-1 text-brand-neutral-white">
              {formatTime(timeElapsed)}
              {maxDuration && <span className="text-xs text-brand-neutral-textMuted font-normal"> / {formatTime(maxDuration)}</span>}
            </span>

            {/* Sound Level Bars (Mock wave) */}
            <div className="flex items-end gap-1 h-8 mt-3">
              {[...Array(12)].map((_, i) => {
                // Generate a styled pseudo-frequency bar
                const waveHeight = isRecording 
                  ? Math.max(12, Math.min(100, volumeLevel * (0.4 + Math.sin(i * 0.5) * 0.4 + Math.random() * 0.3))) 
                  : 10;
                return (
                  <div
                    key={i}
                    style={{ height: `${waveHeight}%` }}
                    className="audio-wave-bar"
                  />
                );
              })}
            </div>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="w-full flex flex-col items-center py-2 animate-scale-in">
            <span className="text-xs font-semibold text-brand-success">Audio muvaffaqiyatli yozildi</span>
            
            {/* Audio player */}
            <audio src={audioUrl} controls className="w-full mt-3 h-8 bg-brand-navy-base rounded-lg" />
          </div>
        )}

        {/* Buttons Controls */}
        <div className="flex items-center gap-4 mt-4">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              disabled={isDisabled}
              className={`h-12 w-12 rounded-full flex items-center justify-center bg-brand-purple-base hover:bg-brand-purple-base/90 text-brand-neutral-white shadow-lg shadow-purpleGlow transition-transform active:scale-95 ${
                isDisabled ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="h-12 w-12 rounded-full flex items-center justify-center bg-brand-error hover:bg-brand-error/90 text-brand-neutral-white shadow-lg animate-pulse"
            >
              <Square className="h-4 w-4" />
            </button>
          )}

          {audioUrl && !isRecording && (
            <div className="flex gap-3">
              <button
                onClick={resetRecorder}
                className="btn-secondary py-2 px-3 text-xs flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" /> Qayta urinish
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
