import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Play, Shield, Volume2, ArrowRight, Lock, 
  HelpCircle, X, ChevronDown, Award, Star, Compass, BookOpen, Layers, 
  Mic, Clock, Check, BarChart2, ShieldAlert, Zap, Quote, GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const { login, signup, user } = useApp();
  const navigate = useNavigate();

  // If already logged in, offer quick navigation to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // General Interactive States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup'); // 'login' | 'signup'
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  
  // Section 4: Interactive Product Preview State
  const [activePreviewTab, setActivePreviewTab] = useState('part1'); // 'part1' | 'part2' | 'part3' | 'report'

  // Section 5: Daily Challenge Playground State
  const [activeSkeletonStage, setActiveSkeletonStage] = useState(0);
  const [checkedPhrases, setCheckedPhrases] = useState([]);
  
  // Section 6: Mock Exam Lobby State
  const [micLevel, setMicLevel] = useState(15);
  const [micActive, setMicActive] = useState(false);

  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Animate volume bar in section 6 to look realistic
  useEffect(() => {
    let interval;
    if (micActive) {
      interval = setInterval(() => {
        setMicLevel(Math.floor(Math.random() * 70) + 15);
      }, 250);
    } else {
      setMicLevel(5);
    }
    return () => clearInterval(interval);
  }, [micActive]);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (!email || !password) {
      setAuthError('Barcha maydonlarni to\'ldiring!');
      setAuthLoading(false);
      return;
    }

    if (authMode === 'signup' && !fullName) {
      setAuthError('Ismingizni kiriting!');
      setAuthLoading(false);
      return;
    }

    try {
      const res = authMode === 'login'
        ? await login(email, password)
        : await signup(email, password, fullName);

      if (res.success) {
        setIsAuthModalOpen(false);
        navigate('/dashboard');
      } else {
        setAuthError(res.error || 'Xatolik yuz berdi. Qayta urinib ko\'ring.');
      }
    } catch (err) {
      setAuthError('Ulanishda xatolik: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  const handlePhraseToggle = (phrase) => {
    if (checkedPhrases.includes(phrase)) {
      setCheckedPhrases(checkedPhrases.filter(p => p !== phrase));
    } else {
      setCheckedPhrases([...checkedPhrases, phrase]);
    }
  };

  // Static content to make code clean
  const painPoints = [
    {
      title: "Mavzu berilganda qotib qolish (Freezing)",
      description: "Taymer ishga tushganda fikringiz butunlay o'chib qoladi, qayerdan gap boshlashni bilmaysiz."
    },
    {
      title: "Tayyor javoblarni yodlash (Memorization Trap)",
      description: "Minglab tayyor matnlarni yodlaysiz, lekin imtihonda kichik o'zgarish bo'lsa, butunlay adashib ketasiz."
    },
    {
      title: "Kuchli stress va vahima (Exam Anxiety)",
      description: "Vaqt cheklovini ko'rib, fikrlaringiz chalkashib ketadi va gapirayotgan narsangizning ma'nosini yo'qotasiz."
    },
    {
      title: "Juda qisqa va quruq javoblar (Short Answers)",
      description: "Mavzu yuzasidan atigi 30-40 soniya gapirib, qolgan vaqtda nima deyishni bilmay jim qolasiz."
    },
    {
      title: "Nutq ishonchsizligi (Lack of Fluency)",
      description: "Grammatikani bilsangiz ham, talaffuzingiz va so'zlarni tanlash tezligingizdan qo'rqib gapira olmaysiz."
    }
  ];

  const skeletons = [
    {
      stage: "1. Kirish (Introduction)",
      uzDescription: "Mavzuni tasdiqlang va o'z nuqtai nazaringizni 3 soniyada chiroyli boshlang.",
      template: "Well, when it comes to the matter of [topic], in my view, the most prominent factor is..."
    },
    {
      stage: "2. Birinchi afzallik (Main Point)",
      uzDescription: "Asosiy fikringizni bayon eting va unga aniq hayotiy misol keltiring.",
      template: "First and foremost, it is undeniable that [point 1]. For instance, recent studies show that..."
    },
    {
      stage: "3. Solishtirish (Contrast)",
      uzDescription: "Qarama-qarshi tomonni ko'rsatib, nutqingizga chuqurlik bering (CEFR B2/C1 darajasi).",
      template: "On the flip side, some might argue that [opposite point], whereas in reality, it only leads to..."
    },
    {
      stage: "4. Yakunlash (Conclusion)",
      uzDescription: "Barcha aytilganlarni jamlab, 1 ta kuchli jumla bilan yakunlang.",
      template: "Taking everything into account, while there are two sides to this, I strongly believe..."
    }
  ];

  const phraseBank = [
    "First and foremost",
    "On the flip side",
    "It is undeniable that",
    "Taking everything into account",
    "Particularly in terms of",
    "A typical illustration of this is"
  ];

  const testimonials = [
    {
      name: "Sardorbek Kamolov",
      role: "CEFR B2 Oluvchi",
      scoreChange: "B1 dan B2 ga (2 haftada)",
      text: "Speakora mening eng katta muammom — timer boshlanganda qotib qolishni hal qildi. Skeletons andozalari yordamida har qanday savolga 3 soniyada reja tuzib gapirishni o'rgandim."
    },
    {
      name: "Dilnoza Mansurova",
      role: "CEFR B2 Oluvchi",
      scoreChange: "Grammatika past edi → B2 Oldi",
      text: "Haqiqiy imtihon simulyatsiyasi (Mock Exam) juda ishonarli ishlangan. Haqiqiy imtihonga kirganimda stress bo'lmadi, chunki Speakora dasturida bu muhitga o'rganib qolgandim."
    },
    {
      name: "Farrux Rahmatullayev",
      role: "CEFR C1 Oluvchi",
      scoreChange: "Fluency 5.5 dan 7.5 ga",
      text: "Bog'lovchi iboralar (Phrase Bank) nutqimni butunlay o'zgartirdi. Har kuni qisqa Challenge bajarish orqali mustaqil fikrlab gapirish ko'nikmasiga ega bo'ldim. Tavsiya qilaman!"
    }
  ];

  const faqs = [
    {
      q: "Bu platforma faqat CEFR imtihoni topshiruvchilar uchunmi?",
      a: "Ha, barcha mavzular, vaqtlar va baholash mezonlari aynan CEFR Speaking imtihoni andozalari va talablari asosida shakllantirilgan."
    },
    {
      q: "Ingliz tili darajasi past bo'lganlar (beginners) ishlatsa bo'ladimi?",
      a: "Albatta. Platformada gapirish mashqlaridan tashqari yozma andoza rejimi (Text Fallback) bor, bu sizga dastlab fikrlarni yozma shakllantirib, keyin gapirishga o'tish imkonini beradi."
    },
    {
      q: "Gapirish (microphone) majburiymi yoki faqat yozma mashqlar bormi?",
      a: "Tizimning asosiy maqsadi gapirish ko'nikmasini oshirish, shuning uchun mikrofonda gapirish tavsiya etiladi. Biroq, boshlovchilar uchun andozalarni yozma mashq qilish imkoniyati ham to'liq yaratilgan."
    },
    {
      q: "Tizimni sotib olishdan oldin bepul sinab ko'rish mumkinmi?",
      a: "Ha, ro'yxatdan o'tish bepul va sizga 3 daqiqalik to'liq diagnostika testi hamda har kuni bittadan Daily Challenge mutlaqo bepul taqdim etiladi."
    },
    {
      q: "Speakora boshqa ingliz tili o'rganish saytlaridan nimasi bilan farq qiladi?",
      a: "Biz shunchaki so'zlar yoki grammatika o'rgatmaymiz. Biz sizga real imtihon vaqti va bosimi ostida qotib qolmasdan, chiroyli va akademik andozalar (skeletons) yordamida o'z fikringizni ifoda etishni o'rgatamiz."
    }
  ];

  return (
    <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white font-sans antialiased selection:bg-brand-purple-base/30 selection:text-brand-neutral-white">
      
      {/* GLOBAL HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy-base/80 backdrop-blur-md border-b border-brand-navy-light/40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-xl shadow-lg shadow-brand-gold-glow">
              S
            </div>
            <div>
              <span className="font-display font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-neutral-white to-brand-gold-base bg-clip-text text-transparent">
                Speakora
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-brand-purple-light font-medium">CEFR Confidence</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-neutral-textMuted">
            <a href="#metodika" className="hover:text-brand-neutral-white transition-colors">Metodika</a>
            <a href="#preview" className="hover:text-brand-neutral-white transition-colors">Mahsulot</a>
            <a href="#mock" className="hover:text-brand-neutral-white transition-colors">Mock Imtihon</a>
            <a href="#pricing" className="hover:text-brand-neutral-white transition-colors">Narxlar</a>
            <a href="#faq" className="hover:text-brand-neutral-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenAuth('login')}
              className="text-sm font-semibold text-brand-neutral-textMuted hover:text-brand-neutral-white px-4 py-2 transition-colors"
            >
              Kirish
            </button>
            <button 
              onClick={() => handleOpenAuth('signup')}
              className="btn-primary py-2 px-5 text-sm shadow-md"
            >
              Bepul boshlash
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 1 — HERO */}
      <section className="py-24 pt-36 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-[-10%] left-[5%] w-[500px] h-[500px] bg-brand-purple-base/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-brand-gold-base/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: Headline & Copy */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <span className="inline-flex items-center gap-2 bg-brand-purple-base/10 border border-brand-purple-base/30 text-brand-purple-light text-xs font-bold py-1.5 px-4 rounded-full uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold-base animate-pulse" /> CEFR SPEAKING CONFIDENCE PLATFORM
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1] text-brand-neutral-white">
                Stop Freezing in <br />
                <span className="bg-gradient-to-r from-brand-purple-light to-brand-gold-base bg-clip-text text-transparent">
                  Speaking Exams.
                </span> <br />
                Start Speaking with Confidence.
              </h1>
              
              <p className="text-brand-neutral-textMuted text-lg md:text-xl font-normal leading-relaxed max-w-xl">
                Speakora teaches you how to THINK, STRUCTURE, and SPEAK naturally for real CEFR speaking exams.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button 
                  onClick={() => navigate('/assessment')}
                  className="btn-primary py-4 px-8 text-base shadow-xl flex items-center justify-center gap-2 group"
                >
                  🔥 Start Free Challenge
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => handleOpenAuth('signup')}
                  className="btn-secondary py-4 px-8 text-base flex items-center justify-center gap-2"
                >
                  👑 Try Mock Exam Preview
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-brand-navy-light/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-brand-neutral-white/90">
                  <span className="text-brand-gold-base font-extrabold">✔</span> Real exam simulation
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-neutral-white/90">
                  <span className="text-brand-gold-base font-extrabold">✔</span> AI-powered feedback
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-neutral-white/90">
                  <span className="text-brand-gold-base font-extrabold">✔</span> Built for CEFR students
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Premium Product Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none group">
                {/* Glowing Aura back */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-purple-base to-brand-gold-base rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                
                {/* Main Dashboard Mockup */}
                <div className="relative glass-card border-brand-navy-light/60 p-6 bg-[#0a0f1d]/90 shadow-2xl rounded-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between border-b border-brand-navy-light/60 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500/80" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                      <div className="h-3 w-3 rounded-full bg-green-500/80" />
                      <span className="text-xs text-brand-neutral-textMuted ml-2 font-mono">dashboard.speakora.uz</span>
                    </div>
                    <div className="bg-brand-purple-base/10 text-brand-purple-light border border-brand-purple-base/20 rounded-md px-2.5 py-0.5 text-[10px] font-bold">
                      ACTIVE PATH: B2 PREP
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Mock Profile Card */}
                    <div className="flex items-center justify-between bg-brand-navy-dark p-3.5 rounded-xl border border-brand-navy-light/30">
                      <div>
                        <div className="text-xs text-brand-neutral-textMuted">Tizim foydalanuvchisi</div>
                        <div className="font-bold text-sm font-display text-brand-neutral-white mt-0.5">Jasur Alimov</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-brand-neutral-textMuted uppercase">CEFR Diagnostic</div>
                        <div className="text-brand-gold-base font-extrabold text-sm font-display">B2 LEVEL TARGET</div>
                      </div>
                    </div>

                    {/* Progress Bar & Stat Preview */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/20 text-center">
                        <div className="text-[10px] text-brand-neutral-textMuted uppercase">Challenge</div>
                        <div className="font-bold font-display text-base text-brand-purple-light mt-1">12 / 30</div>
                      </div>
                      <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/20 text-center">
                        <div className="text-[10px] text-brand-neutral-textMuted uppercase">Mock Score</div>
                        <div className="font-bold font-display text-base text-brand-gold-base mt-1">B2 (68%)</div>
                      </div>
                      <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/20 text-center">
                        <div className="text-[10px] text-brand-neutral-textMuted uppercase">Grammar</div>
                        <div className="font-bold font-display text-base text-brand-success mt-1">74%</div>
                      </div>
                    </div>

                    {/* Interactive Exam player snippet inside */}
                    <div className="bg-brand-navy-dark border border-brand-purple-base/20 rounded-xl p-4 relative overflow-hidden">
                      <div className="flex justify-between items-center text-[10px] text-brand-neutral-textMuted mb-2">
                        <span className="text-brand-purple-light font-bold flex items-center gap-1">
                          <Mic className="h-3 w-3" /> AUDIO PRACTICE ACTIVE
                        </span>
                        <span>0:24 / 0:45</span>
                      </div>
                      <p className="text-xs font-semibold text-brand-neutral-white mb-2 leading-relaxed">
                        &quot;...First and foremost, a typical illustration of solo traveling is...&quot;
                      </p>
                      
                      {/* Fake animated audio waveform */}
                      <div className="h-6 flex items-center gap-1.5 mt-3 justify-center">
                        <div className="w-1 bg-brand-gold-base rounded-full h-3 animate-soundwave" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-5 animate-soundwave" style={{ animationDelay: '0.3s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-4 animate-soundwave" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-6 animate-soundwave" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-2 animate-soundwave" style={{ animationDelay: '0.4s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-4 animate-soundwave" style={{ animationDelay: '0.6s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-5 animate-soundwave" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-brand-gold-base rounded-full h-3 animate-soundwave" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2 — THE REAL PROBLEM */}
      <section className="py-24 bg-brand-navy-dark border-y border-brand-navy-light/20 relative" id="problem">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <span className="text-xs uppercase tracking-widest text-brand-gold-base font-bold font-display">
            IMTIHON MAVHUMIYATI
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mt-3 mb-6 max-w-4xl mx-auto">
            You Don’t Fail Because You Don’t Know English. <br />
            <span className="text-brand-error drop-shadow-md">
              You Fail Because You Don’t Know What to Say.
            </span>
          </h2>
          <p className="text-brand-neutral-textMuted text-base md:text-lg max-w-2xl mx-auto mb-16">
            CEFR gapirish imtihonida eng katta to'siq ingliz tilining yetishmasligi emas, balki stress ostida fikrni tezda to'plab, javobni chiroyli va akademik boshlay olmaslikdir.
          </p>

          {/* Pain points grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {painPoints.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-card p-6 border-brand-error/10 hover:border-brand-error/30 hover:bg-brand-error/5 relative group transition-all duration-300 rounded-2xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-error/10 flex items-center justify-center text-brand-error font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold font-display text-brand-neutral-white group-hover:text-brand-error transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-brand-neutral-textMuted leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="border-t border-brand-navy-light/30 pt-3 mt-4 text-[11px] text-brand-error/80 uppercase font-mono tracking-wider">
                  ⚠️ Balingizni keskin pasaytiradi
                </div>
              </div>
            ))}

            {/* Special Callout in place of a 6th card */}
            <div className="glass-card p-6 border-brand-gold-base/20 bg-brand-gold-base/5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-brand-gold-base/10 flex items-center justify-center text-brand-gold-base">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold font-display text-brand-neutral-white">
                  Yechim bormi?
                </h3>
                <p className="text-xs text-brand-neutral-textMuted leading-relaxed">
                  Imtihon taymeriga qarshi yodlash orqali emas, balki fikrlash tizimini shakllantiruvchi <strong>skelet andozalar</strong> va <strong>bog'lovchilar</strong> yordamida tayyorlanish kerak.
                </p>
              </div>
              <button 
                onClick={() => navigate('/assessment')}
                className="text-xs text-brand-gold-base font-bold flex items-center gap-1 hover:underline mt-4 uppercase tracking-wider"
              >
                O'z darajangizni aniqlang <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3 — THE SPEAKORA METHOD */}
      <section className="py-24 relative overflow-hidden" id="metodika">
        {/* Glow */}
        <div className="absolute top-[30%] left-[-10%] w-[300px] h-[300px] bg-brand-purple-base/5 rounded-full blur-[80px]" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-purple-light font-bold font-display">
              XALQARO METODIKA
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mt-3 mb-6">
              Yodlashni to&apos;xtating. <br />
              <span className="bg-gradient-to-r from-brand-purple-light to-brand-gold-base bg-clip-text text-transparent">
                Struktura bilan gapiring.
              </span>
            </h2>
            <p className="text-brand-neutral-textMuted text-base">
              Har qanday tasodifiy mavzuni CEFR mezonlariga mos holatda akademik, ravon va uzluksiz gapirish uslubi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            {/* The Memorization Trap */}
            <div className="glass-card border-brand-error/20 bg-brand-navy-dark/60 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 bg-brand-error/5 rounded-bl-full flex items-center justify-center font-bold text-brand-error/30 text-xl font-mono">
                X
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-brand-error border-b border-brand-navy-light/40 pb-4 mb-6 flex items-center gap-2">
                  ❌ Memorize → Forget → Freeze
                </h3>
                <ul className="space-y-4 text-brand-neutral-grayMed text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-error mt-0.5 font-bold">✕</span>
                    <span>Qolipli tayyor javoblarni so'zma-so'z yodlash stress paytida xotiradan butunlay chiqib ketadi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-error mt-0.5 font-bold">✕</span>
                    <span>Imtihon oluvchi (examiner) yodlangan jumlalarni darhol aniqlaydi va balingizni pasaytiradi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-error mt-0.5 font-bold">✕</span>
                    <span>Savolda kichik o'zgarish bo'lsa, javobni qayta moslashtira olmaslik va qotib qolish (freeze) yuz beradi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-error mt-0.5 font-bold">✕</span>
                    <span>Faqat muayyan mavzulargagina tayyorlanish, notanish mavzularda butunlay ojiz qolish.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-brand-error/5 border border-brand-error/20 rounded-xl p-3.5 mt-8 text-xs text-brand-error/85 text-center font-medium">
                Natija: Nutq ravon emas, fikrlar to'xtab qoladi, ball 5.0 - 5.5 atrofida.
              </div>
            </div>

            {/* The Speakora Method */}
            <div className="glass-card border-brand-gold-base/30 bg-brand-purple-base/5 p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden shadow-purpleGlow">
              <div className="absolute top-0 right-0 h-20 w-20 bg-brand-gold-base/5 rounded-bl-full flex items-center justify-center font-bold text-brand-gold-base/30 text-xl font-mono">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-brand-gold-base border-b border-brand-navy-light/40 pb-4 mb-6 flex items-center gap-2">
                  ✅ Structure → Practice → Confidence
                </h3>
                <ul className="space-y-4 text-brand-neutral-grayMed text-sm">
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold-base mt-0.5 font-bold">✓</span>
                    <span><strong>Answer Skeletons (Nutq karkaslari):</strong> Har qanday savolni 4 ta universal mantiqiy blokga ajratib gapirish.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold-base mt-0.5 font-bold">✓</span>
                    <span><strong>Connector Phrase Banks (Iboralar kutubxonasi):</strong> Nutqni ravon bog'lovchi va C1 darajasiga mos akademik iboralar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold-base mt-0.5 font-bold">✓</span>
                    <span><strong>Active Flow Practice:</strong> Doimiy taymer bilan ishlash, gapirish tezligi va ishonchini oshirish.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-brand-gold-base mt-0.5 font-bold">✓</span>
                    <span><strong>Heuristic Feedback:</strong> Qaysi bog'lovchilarni ishlatganingizni va xatolaringizni tizimli tahlil qilish.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-brand-gold-base/10 border border-brand-gold-base/20 rounded-xl p-3.5 mt-8 text-xs text-brand-gold-hover text-center font-medium">
                Natija: Har qanday notanish savolda ham ishonchli gapirish, ball 7.0 - 7.5+.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — PRODUCT PREVIEW */}
      <section className="py-24 bg-brand-navy-dark border-t border-brand-navy-light/30 relative" id="preview">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-brand-gold-base font-bold font-display">
              MAHSULOT INTERFEYSI
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mt-2 mb-4">
              Real Tizim Simulyatori
            </h2>
            <p className="text-brand-neutral-textMuted text-sm">
              Quyidagi interaktiv tablarni bosib, Speakora platformasining asosiy bo'limlari qanday ko'rinishda bo'lishini ko'rishingiz mumkin.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab switch buttons */}
            <div className="flex flex-wrap md:flex-nowrap border-b border-brand-navy-light/60 pb-1 mb-8 gap-2">
              <button 
                onClick={() => setActivePreviewTab('part1')}
                className={`flex-1 min-w-[100px] text-center font-display font-bold py-3 text-xs md:text-sm transition-all border-b-2 ${
                  activePreviewTab === 'part1' ? 'text-brand-gold-base border-brand-gold-base' : 'text-brand-neutral-textMuted border-transparent hover:text-brand-neutral-white'
                }`}
              >
                Part 1: Shaxsiy savol
              </button>
              <button 
                onClick={() => setActivePreviewTab('part2')}
                className={`flex-1 min-w-[100px] text-center font-display font-bold py-3 text-xs md:text-sm transition-all border-b-2 ${
                  activePreviewTab === 'part2' ? 'text-brand-gold-base border-brand-gold-base' : 'text-brand-neutral-textMuted border-transparent hover:text-brand-neutral-white'
                }`}
              >
                Part 2: Mavzu taqdimoti
              </button>
              <button 
                onClick={() => setActivePreviewTab('part3')}
                className={`flex-1 min-w-[100px] text-center font-display font-bold py-3 text-xs md:text-sm transition-all border-b-2 ${
                  activePreviewTab === 'part3' ? 'text-brand-gold-base border-brand-gold-base' : 'text-brand-neutral-textMuted border-transparent hover:text-brand-neutral-white'
                }`}
              >
                Part 3: Bahs-Munozara
              </button>
              <button 
                onClick={() => setActivePreviewTab('report')}
                className={`flex-1 min-w-[100px] text-center font-display font-bold py-3 text-xs md:text-sm transition-all border-b-2 ${
                  activePreviewTab === 'report' ? 'text-brand-gold-base border-brand-gold-base' : 'text-brand-neutral-textMuted border-transparent hover:text-brand-neutral-white'
                }`}
              >
                Premium Natija Tahlili
              </button>
            </div>

            {/* Display Screen Frame */}
            <div className="glass-card border-brand-navy-light/80 bg-brand-navy-base p-6 rounded-2xl min-h-[380px] shadow-2xl relative">
              
              {/* Tab Content 1: Part 1 */}
              {activePreviewTab === 'part1' && (
                <div className="space-y-6 animate-scale-in">
                  <div className="flex justify-between items-center text-xs border-b border-brand-navy-light/40 pb-3">
                    <span className="font-bold text-brand-purple-light font-display">CEFR Speaking Part 1.1</span>
                    <span className="text-brand-neutral-textMuted font-mono">Timer: 45s</span>
                  </div>

                  <div className="bg-[#0b1220] p-4.5 rounded-xl border border-brand-purple-base/20">
                    <span className="text-[10px] text-brand-purple-light font-bold uppercase tracking-wider block mb-1">Personal Question</span>
                    <h3 className="text-base font-bold font-display text-brand-neutral-white">
                      &quot;How do you usually spend your free time on weekends?&quot;
                    </h3>
                    <p className="text-[11px] text-brand-neutral-textMuted italic mt-1.5 border-t border-brand-navy-light/20 pt-1.5">
                      Tarjimasi: Dam olish kunlari bo'sh vaqtingizni odatda qanday o'tkazasiz?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-brand-navy-dark p-4 rounded-xl border border-brand-navy-light/30 text-center space-y-3">
                      <div className="h-10 w-10 rounded-full bg-brand-purple-base/20 text-brand-purple-light flex items-center justify-center mx-auto animate-pulse">
                        <Mic className="h-5 w-5" />
                      </div>
                      <div className="text-xs font-semibold text-brand-neutral-white">Ovoz yozilmoqda...</div>
                      {/* Wave visualizer */}
                      <div className="h-4 flex items-center gap-1 justify-center">
                        <div className="w-1 bg-brand-purple-light rounded-full h-2 animate-soundwave" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 bg-brand-purple-light rounded-full h-3 animate-soundwave" style={{ animationDelay: '0.4s' }} />
                        <div className="w-1 bg-brand-purple-light rounded-full h-4 animate-soundwave" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 bg-brand-purple-light rounded-full h-1 animate-soundwave" style={{ animationDelay: '0.5s' }} />
                        <div className="w-1 bg-brand-purple-light rounded-full h-3 animate-soundwave" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Part 2 */}
              {activePreviewTab === 'part2' && (
                <div className="space-y-6 animate-scale-in">
                  <div className="flex justify-between items-center text-xs border-b border-brand-navy-light/40 pb-3">
                    <span className="font-bold text-brand-purple-light font-display">CEFR Speaking Part 1.2 — Picture Comparison</span>
                    <span className="text-brand-neutral-textMuted font-mono">Prep: 60s / Speak: 90s</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Mock Image Box 1 */}
                    <div className="bg-brand-navy-dark rounded-xl overflow-hidden border border-brand-navy-light/40 relative aspect-video flex flex-col justify-center items-center text-center p-3">
                      <div className="absolute top-2 left-2 bg-brand-navy-base/80 px-2 py-0.5 rounded text-[9px] text-brand-neutral-textMuted border border-brand-navy-light/40">
                        PICTURE A
                      </div>
                      <BookOpen className="h-8 w-8 text-brand-purple-light mb-1.5 opacity-60" />
                      <span className="text-[10px] text-brand-neutral-textMuted font-semibold">Studying alone in a quiet room</span>
                    </div>

                    {/* Mock Image Box 2 */}
                    <div className="bg-brand-navy-dark rounded-xl overflow-hidden border border-brand-navy-light/40 relative aspect-video flex flex-col justify-center items-center text-center p-3">
                      <div className="absolute top-2 left-2 bg-brand-navy-base/80 px-2 py-0.5 rounded text-[9px] text-brand-neutral-textMuted border border-brand-navy-light/40">
                        PICTURE B
                      </div>
                      <GraduationCap className="h-8 w-8 text-brand-gold-base mb-1.5 opacity-60" />
                      <span className="text-[10px] text-brand-neutral-textMuted font-semibold">Studying with friends in a group</span>
                    </div>
                  </div>

                  <div className="bg-[#0b1220] p-4 rounded-xl border border-brand-navy-light/40">
                    <h4 className="text-xs font-bold text-brand-neutral-white mb-1.5">Task Description:</h4>
                    <p className="text-xs text-brand-neutral-textMuted leading-relaxed">
                      Soliishtiring va farqlarini tushuntiring. Nima uchun odamlar yakka yoki guruh bo&apos;lib o&apos;qishni tanlashlarini izohlang.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content 3: Part 3 */}
              {activePreviewTab === 'part3' && (
                <div className="space-y-6 animate-scale-in">
                  <div className="flex justify-between items-center text-xs border-b border-brand-navy-light/40 pb-3">
                    <span className="font-bold text-brand-purple-light font-display">CEFR Speaking Part 3 — Debate</span>
                    <span className="text-brand-neutral-textMuted font-mono">Speak: 120s</span>
                  </div>

                  <div className="bg-[#0b1220] p-4 rounded-xl border border-brand-purple-base/15">
                    <span className="text-[10px] text-brand-gold-base font-bold uppercase tracking-wider block mb-1">Debate Statement</span>
                    <h3 className="text-sm md:text-base font-bold text-brand-neutral-white">
                      &quot;Online education will completely replace traditional universities in the future.&quot;
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* FOR column */}
                    <div className="bg-brand-navy-dark border border-brand-success/20 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-brand-success uppercase tracking-wider block mb-2">FOR (Qo&apos;llab-quvvatlash):</span>
                      <ul className="text-xs text-brand-neutral-textMuted space-y-2 list-disc list-inside">
                        <li>Flexibility and study anytime.</li>
                        <li>No travel or campus cost.</li>
                      </ul>
                    </div>

                    {/* AGAINST column */}
                    <div className="bg-brand-navy-dark border border-brand-error/20 rounded-xl p-3.5">
                      <span className="text-[10px] font-bold text-brand-error uppercase tracking-wider block mb-2">AGAINST (Qarshi):</span>
                      <ul className="text-xs text-brand-neutral-textMuted space-y-2 list-disc list-inside">
                        <li>Lack of social skill development.</li>
                        <li>Practical subjects need campus.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 4: Report */}
              {activePreviewTab === 'report' && (
                <div className="space-y-5 animate-scale-in">
                  <div className="flex justify-between items-center text-xs border-b border-brand-navy-light/40 pb-3">
                    <span className="font-bold text-brand-purple-light font-display">AI Performance Analyzer Report</span>
                    <span className="text-brand-success font-bold flex items-center gap-1">✓ DIAGNOSTIC COMPLETED</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* CEFR Circle Gauge */}
                    <div className="md:col-span-4 text-center space-y-1">
                      <div className="h-20 w-20 rounded-full border-4 border-brand-gold-base flex flex-col items-center justify-center mx-auto shadow-goldGlow bg-brand-gold-base/5">
                        <span className="text-2xl font-extrabold font-display text-brand-neutral-white">B2</span>
                        <span className="text-[8px] text-brand-gold-base uppercase font-bold">estimated</span>
                      </div>
                      <h4 className="text-xs font-bold text-brand-neutral-white mt-2">Overall Level</h4>
                    </div>

                    {/* Score sliders */}
                    <div className="md:col-span-8 space-y-2.5">
                      {/* Item 1 */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-0.5">
                          <span className="text-brand-neutral-grayMed">Nutq tarkibi (Structure)</span>
                          <span className="text-brand-purple-light font-bold">82%</span>
                        </div>
                        <div className="h-1.5 w-full bg-brand-navy-dark rounded-full overflow-hidden">
                          <div className="h-full bg-brand-purple-base rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-0.5">
                          <span className="text-brand-neutral-grayMed">Ravonlik (Fluency)</span>
                          <span className="text-brand-gold-base font-bold">76%</span>
                        </div>
                        <div className="h-1.5 w-full bg-brand-navy-dark rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold-base rounded-full" style={{ width: '76%' }}></div>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-0.5">
                          <span className="text-brand-neutral-grayMed">Leksika (Vocabulary)</span>
                          <span className="text-brand-success font-bold">68%</span>
                        </div>
                        <div className="h-1.5 w-full bg-brand-navy-dark rounded-full overflow-hidden">
                          <div className="h-full bg-brand-success rounded-full" style={{ width: '68%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/40 flex items-start gap-2 text-xs">
                    <Sparkles className="h-4 w-4 text-brand-gold-base shrink-0 mt-0.5" />
                    <p className="text-brand-neutral-textMuted leading-relaxed">
                      <strong>AI Tavsiyasi:</strong> Nutq strukturasi yaxshi, ammo gapni boshlashda yodlangan bir jinsli iboralardan voz keching. Kunlik <strong>Phrase Bank</strong> mashqlarini bajarish orqali ballni tezda oshirish mumkin.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom conversion tip inside card preview */}
              <div className="absolute bottom-3 right-6 flex items-center gap-1.5 text-[10px] text-brand-neutral-textMuted bg-[#0c1220]/95 px-3 py-1.5 rounded-lg border border-brand-navy-light/40">
                <span className="h-2 w-2 rounded-full bg-brand-success animate-ping"></span>
                <span>Haqiqiy imtihon andozasi</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — DAILY STRUCTURE CHALLENGE */}
      <section className="py-24 relative overflow-hidden" id="challenge">
        {/* Glow */}
        <div className="absolute bottom-[-10%] left-[5%] w-[400px] h-[400px] bg-brand-gold-base/5 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: Copy info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="inline-flex items-center gap-1.5 bg-brand-gold-base/10 border border-brand-gold-base/30 text-brand-gold-base text-xs font-bold py-1 px-3.5 rounded-full uppercase tracking-wider">
                <Zap className="h-3 w-3" /> DAILY CHALLENGE SYSTEM
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-brand-neutral-white">
                Kunlik Gapirish Mashqlari (Skeletons)
              </h2>
              <p className="text-brand-neutral-textMuted leading-relaxed">
                Speakora tizimida har kuni yangi bitta <strong>Daily Challenge</strong> (mavzu va savol) bepul taqdim etiladi. Mashg&apos;ulot davomida sizga savolni tushunish uchun karkaslar va faol iboralar beriladi.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-brand-purple-base/20 text-brand-purple-light flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-neutral-white">Hech qanday yodlash yo&apos;q</h4>
                    <p className="text-xs text-brand-neutral-textMuted mt-0.5">Fikringizni bosqichma-bosqich qanday tuzish andozasini ko&apos;rib o&apos;rganasiz.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-brand-purple-base/20 text-brand-purple-light flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-neutral-white">Iboralar integratsiyasi</h4>
                    <p className="text-xs text-brand-neutral-textMuted mt-0.5">Kerakli kalit iboralarni gapirayotganda ishlatib, ularni xotirangizda mustahkamaysiz.</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/assessment')}
                className="btn-primary py-3 px-6 text-sm flex items-center gap-2 mt-4"
              >
                Bepul sinab ko&apos;rish <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* RIGHT SIDE: Interactive UI Playground */}
            <div className="lg:col-span-7">
              <div className="glass-card border-brand-navy-light/60 p-6 bg-brand-navy-dark/70 rounded-2xl shadow-xl space-y-5">
                
                {/* Topic Header inside box */}
                <div className="flex justify-between items-center border-b border-brand-navy-light/40 pb-3">
                  <div>
                    <span className="text-[10px] text-brand-neutral-textMuted uppercase font-mono">Topic: Travel & Tourism</span>
                    <h4 className="text-sm font-bold font-display text-brand-neutral-white">Solo Traveling vs Group Traveling</h4>
                  </div>
                  <span className="bg-brand-purple-base/20 border border-brand-purple-base/30 text-brand-purple-light text-[10px] px-2 py-0.5 rounded font-bold">
                    B2 Difficulty
                  </span>
                </div>

                {/* Skeletons block */}
                <div className="space-y-3">
                  <span className="text-[11px] text-brand-neutral-textMuted uppercase font-bold block">
                    Answer Skeleton (Nutq karkasi):
                  </span>
                  
                  <div className="grid grid-cols-4 gap-2">
                    {skeletons.map((sk, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveSkeletonStage(idx)}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          activeSkeletonStage === idx 
                            ? 'bg-brand-purple-base/20 border-brand-purple-base text-brand-purple-light font-semibold' 
                            : 'bg-brand-navy-base border-brand-navy-light/40 text-brand-neutral-textMuted hover:border-brand-navy-light'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-mono">Step 0{idx + 1}</div>
                        <div className="text-[11px] mt-0.5 truncate">{sk.stage.split(' ')[1]}</div>
                      </button>
                    ))}
                  </div>

                  {/* Active Skeleton Template display */}
                  <div className="bg-[#0b1220] p-4 rounded-xl border border-brand-navy-light/40 space-y-2 animate-scale-in">
                    <span className="text-[10px] text-brand-gold-base font-bold uppercase tracking-wider block">
                      {skeletons[activeSkeletonStage].stage} karkasi:
                    </span>
                    <p className="text-xs text-brand-neutral-white leading-relaxed font-semibold">
                      &quot;{skeletons[activeSkeletonStage].template}&quot;
                    </p>
                    <p className="text-[11px] text-brand-neutral-textMuted italic border-t border-brand-navy-light/20 pt-2 mt-2">
                      Yo&apos;riqnoma: {skeletons[activeSkeletonStage].uzDescription}
                    </p>
                  </div>
                </div>

                {/* Connector phrase bank selector */}
                <div className="space-y-2.5">
                  <span className="text-[11px] text-brand-neutral-textMuted uppercase font-bold block">
                    Phrase Bank (Bog&apos;lovchilar kutubxonasi — Bosib tekshiring):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {phraseBank.map((phrase, idx) => {
                      const isChecked = checkedPhrases.includes(phrase);
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePhraseToggle(phrase)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                            isChecked
                              ? 'bg-brand-success/15 border-brand-success text-brand-success shadow-sm'
                              : 'bg-brand-navy-base border-brand-navy-light/50 text-brand-neutral-textMuted hover:text-brand-neutral-white hover:border-brand-navy-light'
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3" />}
                          {phrase}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6 — FULL MOCK EXAM */}
      <section className="py-24 bg-brand-navy-dark border-t border-brand-navy-light/30 relative" id="mock">
        {/* Glow */}
        <div className="absolute top-[20%] right-[-10%] w-[350px] h-[350px] bg-brand-gold-base/5 rounded-full blur-[90px]" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <span className="text-xs uppercase tracking-widest text-brand-purple-light font-bold font-display">
            REALISTIC SIMULATION
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display mt-3 mb-6">
            Haqiqiy Imtihon Muhitini Hiss Eting
          </h2>
          <p className="text-brand-neutral-textMuted text-base max-w-2xl mx-auto mb-16">
            Speakora Mock Exam moduli sizni mikrofondan foydalanish, cheklangan tayyorgarlik vaqti va rasmiy CEFR talablariga muvofiq to&apos;liq 4 qismli simulyatsiyadan o&apos;tkazadi.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
            
            {/* LEFT: Lobby status list */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 border-brand-navy-light/60 bg-[#090f1c] rounded-2xl space-y-4">
                <h3 className="text-lg font-bold font-display text-brand-neutral-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-gold-base" /> Imtihon shartlari
                </h3>
                
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-brand-purple-base/20 flex items-center justify-center text-brand-purple-light text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <span className="text-xs text-brand-neutral-textMuted leading-relaxed">
                      <strong>Texnik nazorat:</strong> Imtihon oldidan mikrofoningiz tekshiriladi va ovoz balandligi sozlanadi.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-brand-purple-base/20 flex items-center justify-center text-brand-purple-light text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <span className="text-xs text-brand-neutral-textMuted leading-relaxed">
                      <strong>To&apos;xtatib bo&apos;lmaydigan taymer:</strong> Haqiqiy imtihon kabi tayyorgarlik va gapirish vaqti tugashi bilan avtomatik keyingi savolga o&apos;tiladi.
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="h-5 w-5 rounded-full bg-brand-purple-base/20 flex items-center justify-center text-brand-purple-light text-xs font-bold shrink-0 mt-0.5">✓</div>
                    <span className="text-xs text-brand-neutral-textMuted leading-relaxed">
                      <strong>To&apos;liq format:</strong> 1. Shaxsiy savollar, 2. Rasm taqqoslash, 3. Mavzu taqdimoti va 4. Debat savollari ketma-ketligi.
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuth('signup')}
                className="w-full btn-primary py-3.5 text-sm flex items-center justify-center gap-2"
              >
                👑 Premium Mock Imtihonni Boshlash
              </button>
            </div>

            {/* RIGHT: Tech check widget preview */}
            <div className="lg:col-span-7">
              <div className="glass-card border-brand-navy-light/60 p-6 bg-brand-navy-base rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-brand-navy-light/40 pb-3">
                  <span className="text-xs text-brand-neutral-white font-bold font-display">Lobby: Texnik sozlash (Tech Check)</span>
                  <span className="text-[10px] text-brand-gold-base font-bold bg-brand-gold-base/10 border border-brand-gold-base/30 px-2 py-0.5 rounded">REQUIRED</span>
                </div>

                <div className="bg-[#0b1220] p-4.5 rounded-xl border border-brand-navy-light/40 space-y-3.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-brand-neutral-white">Mikrofon sezgirligini tekshirish</span>
                    <span className="text-brand-neutral-textMuted">Ovoz darajasi: {micActive ? micLevel + '%' : 'Kutilmoqda'}</span>
                  </div>
                  
                  {/* Visual equalizer slider */}
                  <div className="h-4 bg-brand-navy-base rounded-lg overflow-hidden border border-brand-navy-light/40 p-0.5 flex gap-0.5">
                    <div className="h-full bg-brand-gold-base transition-all duration-200 rounded-sm" style={{ width: `${micActive ? micLevel : 0}%` }}></div>
                  </div>

                  <p className="text-[11px] text-brand-neutral-textMuted leading-relaxed">
                    Mikrofoningiz to&apos;g&apos;ri ishlayotganiga ishonch hosil qilish uchun quyidagi tugmani bosing va mikrofoningizga biror narsa gapiring.
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setMicActive(!micActive)}
                      className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition-colors ${
                        micActive 
                          ? 'bg-brand-error/20 border border-brand-error text-brand-error hover:bg-brand-error/30'
                          : 'bg-brand-purple-base text-brand-neutral-white hover:bg-brand-purple-light'
                      }`}
                    >
                      {micActive ? 'Mikrofonni o&apos;chirish' : 'Mikrofonni sinash (Start Test)'}
                    </button>
                    <div className="bg-brand-navy-base border border-brand-navy-light/60 px-3 py-2 rounded-lg text-xs font-semibold text-brand-neutral-textMuted flex items-center justify-center">
                      {micActive ? '🔊 Ishlamoqda' : '🔇 Kutish...'}
                    </div>
                  </div>
                </div>

                <div className="border border-brand-purple-base/20 rounded-xl p-3 bg-brand-purple-glow text-center text-xs text-brand-purple-light">
                  🔒 Imtihon davomida barcha yozilgan ovozlar tahlil qilinib, shaxsiy hisobingizga yuklanadi.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7 — REPORT SYSTEM & LOCKUPS */}
      <section className="py-24 relative overflow-hidden" id="report">
        {/* Glow */}
        <div className="absolute top-[30%] left-[-5%] w-[350px] h-[350px] bg-brand-purple-base/5 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT SIDE: Visual mock report with frosted lock overlay */}
            <div className="lg:col-span-7 relative">
              <div className="relative glass-card border-brand-navy-light/80 bg-brand-navy-dark/95 p-6 rounded-2xl shadow-2xl space-y-6">
                
                {/* Header info */}
                <div className="flex justify-between items-center border-b border-brand-navy-light/40 pb-4">
                  <div>
                    <h3 className="font-bold font-display text-base text-brand-neutral-white">
                      CEFR Speaking Report Card
                    </h3>
                    <span className="text-[10px] text-brand-neutral-textMuted uppercase font-mono">Exam ID: set_a_0949</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-brand-gold-base/15 border border-brand-gold-base/30 text-brand-gold-base flex items-center justify-center font-bold text-base">
                    B2
                  </div>
                </div>

                {/* Score breakdown metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/30">
                    <span className="text-[9px] text-brand-neutral-textMuted uppercase">Grammar</span>
                    <div className="font-display font-extrabold text-base text-brand-neutral-white mt-0.5">74%</div>
                  </div>
                  <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/30">
                    <span className="text-[9px] text-brand-neutral-textMuted uppercase">Fluency</span>
                    <div className="font-display font-extrabold text-base text-brand-neutral-white mt-0.5">82%</div>
                  </div>
                  <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/30">
                    <span className="text-[9px] text-brand-neutral-textMuted uppercase">Vocabulary</span>
                    <div className="font-display font-extrabold text-base text-brand-neutral-white mt-0.5">68%</div>
                  </div>
                  <div className="bg-[#0b1220] p-3 rounded-xl border border-brand-navy-light/30">
                    <span className="text-[9px] text-brand-neutral-textMuted uppercase">Confidence</span>
                    <div className="font-display font-extrabold text-base text-brand-neutral-white mt-0.5">85%</div>
                  </div>
                </div>

                {/* Frosted blurred Lock Container */}
                <div className="relative bg-[#0c1221] border border-brand-gold-base/15 rounded-xl p-5 overflow-hidden">
                  
                  {/* Blurry layer */}
                  <div className="absolute inset-0 bg-[#0c1221]/80 backdrop-blur-[3.5px] z-10 flex flex-col items-center justify-center text-center p-4">
                    <Lock className="h-6 w-6 text-brand-gold-base mb-2 animate-bounce" />
                    <span className="text-xs font-bold text-brand-neutral-white uppercase tracking-wider">
                      Premium tahlil yopiq
                    </span>
                    <span className="text-[10px] text-brand-neutral-textMuted max-w-xs mt-1">
                      Barcha xatolar tahlili, tuzatish tavsiyalari va CEFR prognozini ko&apos;rish uchun premiumga o&apos;ting.
                    </span>
                  </div>

                  <div className="space-y-3 opacity-20">
                    <div className="h-3 w-1/3 bg-brand-neutral-white/50 rounded"></div>
                    <div className="h-2 w-full bg-brand-neutral-white/30 rounded"></div>
                    <div className="h-2 w-full bg-brand-neutral-white/30 rounded"></div>
                    <div className="h-2.5 w-1/2 bg-brand-neutral-white/40 rounded mt-4"></div>
                    <div className="h-2 w-full bg-brand-neutral-white/30 rounded"></div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE: Copy info */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="inline-flex items-center gap-1 bg-brand-purple-base/10 border border-brand-purple-base/30 text-brand-purple-light text-xs font-bold py-1 px-3 rounded-full uppercase tracking-wider">
                <BarChart2 className="h-3 w-3 text-brand-purple-light" /> AI SCORES & ROADMAP
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold font-display leading-tight text-brand-neutral-white">
                Nutqning Tizimli va Chuqur Tahlili
              </h2>
              <p className="text-brand-neutral-textMuted leading-relaxed">
                Tizim shunchaki ball chiqarib bermaydi, balki grammatik xatolaringiz, ravonlik mezonlari va gapirish ishonchingizni tahlil qilib beradi.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-brand-gold-base/10 text-brand-gold-base flex items-center justify-center text-[10px] font-bold mt-0.5">🔒</div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-neutral-white">Grammatical Correction (Xatolar tahlili)</h4>
                    <p className="text-xs text-brand-neutral-textMuted mt-0.5">Javobingiz davomidagi barcha grammatik xatolar ro&apos;yxati va qanday aytish to&apos;g&apos;ri bo&apos;lishi bo&apos;yicha takliflar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-brand-gold-base/10 text-brand-gold-base flex items-center justify-center text-[10px] font-bold mt-0.5">🔒</div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-neutral-white">Recovery Roadmap (Tuzatish rejasi)</h4>
                    <p className="text-xs text-brand-neutral-textMuted mt-0.5">Siz yo&apos;l qo&apos;ygan xatolarga mos ravishda qaysi skeleton va andozalarni qayta mashq qilishingiz kerakligi bo&apos;yicha yo&apos;llanma.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-brand-gold-base/10 text-brand-gold-base flex items-center justify-center text-[10px] font-bold mt-0.5">🔒</div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-brand-neutral-white">Pass Prediction (Imtihondan o&apos;tish ehtimoli)</h4>
                    <p className="text-xs text-brand-neutral-textMuted mt-0.5">Real CEFR Speaking imtihonida B2 yoki C1 ballarini olish ehtimolingizning foizdagi ko&apos;rsatkichi.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenAuth('signup')}
                className="btn-primary py-3 px-6 text-sm flex items-center gap-2 mt-4"
              >
                Tahlilni ochish (Unlock Full Report) <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 8 — PRICING */}
      <section className="py-24 bg-brand-navy-dark border-y border-brand-navy-light/20 relative" id="pricing">
        {/* Decorative elements */}
        <div className="absolute top-[40%] right-[-10%] w-[300px] h-[300px] bg-brand-gold-base/5 rounded-full blur-[80px]" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <span className="text-xs uppercase tracking-widest text-brand-gold-base font-bold font-display">
            HAYOTIY NARXLAR
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold font-display leading-tight mt-3 mb-6">
            Katta Natijalarga Kichik Sarmoya
          </h2>
          <p className="text-brand-neutral-textMuted text-base max-w-2xl mx-auto mb-16">
            CEFR Speaking ballingizni oshirish uchun qimmat repetitorlar kerak emas. O&apos;zingizga mos tarifni tanlang va hoziroq mashqlarni boshlang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            
            {/* FREE PLAN */}
            <div className="glass-card bg-[#090f1d] border-brand-navy-light/60 p-8 rounded-3xl flex flex-col justify-between text-left transition-all duration-300">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-brand-neutral-white">Bepul sinov (Free Trial)</h3>
                  <p className="text-xs text-brand-neutral-textMuted mt-1">Sizga karkas va bog&apos;lovchilar bilan ishlashni tushunish imkonini beradi.</p>
                </div>

                <div className="border-y border-brand-navy-light/40 py-4">
                  <span className="text-4xl font-extrabold font-display text-brand-neutral-white">0 UZS</span>
                  <span className="text-xs text-brand-neutral-textMuted font-mono"> / umrbod</span>
                </div>

                <ul className="space-y-3.5 text-xs text-brand-neutral-grayMed">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-purple-light font-extrabold">✓</span> 1 ta Kunlik Challenge (bepul)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-purple-light font-extrabold">✓</span> Boshlang&apos;ich karkas andozalari (Skeletons)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-purple-light font-extrabold">✓</span> Text fallback input yordamida yozma ishlash
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-purple-light font-extrabold">✓</span> Diagnostik ball hisoblash (boshlang&apos;ich)
                  </li>
                  <li className="text-brand-neutral-textMuted/60 line-through flex items-center gap-2">
                    <span className="text-brand-neutral-textMuted/40">✕</span> To&apos;liq Mock imtihon simulyatsiyasi (4 qismli)
                  </li>
                  <li className="text-brand-neutral-textMuted/60 line-through flex items-center gap-2">
                    <span className="text-brand-neutral-textMuted/40">✕</span> AI orqali grammatika va ravonlik tahlili
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/assessment')}
                className="w-full btn-secondary py-3 text-xs mt-8"
              >
                Diagnostikadan o&apos;tish (Bepul)
              </button>
            </div>

            {/* PREMIUM PLAN */}
            <div className="glass-card bg-[#0b1220]/95 border-2 border-brand-gold-base/80 p-8 rounded-3xl flex flex-col justify-between text-left relative shadow-purpleGlow transform hover:-translate-y-1 transition-all duration-300">
              {/* Most Popular Badge */}
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-[10px] uppercase py-1.5 px-4 rounded-full shadow-lg shadow-brand-gold-glow flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> 🔥 ENG MASHHUR (MOST POPULAR)
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold font-display text-brand-neutral-white">Premium a&apos;zolik (Premium Club)</h3>
                  <p className="text-xs text-brand-neutral-textMuted mt-1">Haqiqiy imtihon simulyatsiyasi va shaxsiy o&apos;quv yo&apos;l xaritasi bilan tayyorlanish.</p>
                </div>

                <div className="border-y border-brand-navy-light/40 py-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-display text-brand-gold-base">29,000 UZS</span>
                  <span className="text-xs text-brand-neutral-textMuted font-mono"> / oyiga</span>
                </div>

                <ul className="space-y-3.5 text-xs text-brand-neutral-grayMed">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> Cheksiz Kunlik Daily Challenges
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> <strong>To&apos;liq Mock Exam Player (4 qism)</strong>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> Premium AI Speaking Performance Report
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> Grammatical error correction & pronunciation tip
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> Shaxsiy Recovery Plan (xatolar ustida ishlash)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-gold-base font-extrabold">✓</span> Tezkor manual to&apos;lovni tasdiqlash (screenshot yuklash)
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenAuth('signup')}
                className="w-full btn-primary py-3.5 text-xs mt-8 font-extrabold uppercase tracking-wider animate-pulse-slow shadow-lg shadow-brand-gold-glow"
              >
                Hoziroq Premiumga Ulanish
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9 — SOCIAL PROOF */}
      <section className="py-24 relative overflow-hidden" id="testimonials">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <span className="text-xs uppercase tracking-widest text-brand-purple-light font-bold font-display">
            FOYDALANUVCHILAR NATIJALARI
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display mt-3 mb-6">
            O&apos;quvchilarimiz Erishgan Natijalar
          </h2>
          <p className="text-brand-neutral-textMuted text-base max-w-2xl mx-auto mb-16">
            Imtihon topshirgan va Speakora skeletons andozalaridan foydalangan CEFR nomzodlarining samimiy fikrlari.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {testimonials.map((testi, idx) => (
              <div 
                key={idx}
                className="glass-card p-6 border-brand-navy-light/60 bg-brand-navy-dark/40 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:border-brand-purple-base/30"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-1 text-brand-gold-base">
                      <Star className="h-4 w-4 fill-brand-gold-base" />
                      <Star className="h-4 w-4 fill-brand-gold-base" />
                      <Star className="h-4 w-4 fill-brand-gold-base" />
                      <Star className="h-4 w-4 fill-brand-gold-base" />
                      <Star className="h-4 w-4 fill-brand-gold-base" />
                    </div>
                    <span className="bg-brand-success/10 border border-brand-success/20 text-brand-success text-[10px] font-bold py-0.5 px-2.5 rounded-full font-mono uppercase">
                      {testi.scoreChange}
                    </span>
                  </div>
                  
                  <p className="text-xs md:text-sm text-brand-neutral-grayMed italic leading-relaxed">
                    &quot;{testi.text}&quot;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 border-t border-brand-navy-light/30 pt-4 mt-6">
                  <div className="h-9 w-9 rounded-full bg-brand-purple-base/20 text-brand-purple-light flex items-center justify-center font-bold text-xs uppercase font-display border border-brand-purple-base/30">
                    {testi.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-brand-neutral-white font-display">{testi.name}</h4>
                    <span className="text-[10px] text-brand-neutral-textMuted uppercase font-medium">{testi.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-brand-purple-base/5 border border-brand-purple-base/20 rounded-2xl p-6 max-w-xl mx-auto mt-12 flex flex-col sm:flex-row items-center gap-4 text-left">
            <Quote className="h-8 w-8 text-brand-purple-light shrink-0 opacity-40" />
            <p className="text-xs text-brand-neutral-grayMed leading-relaxed">
              <strong>Eslatma:</strong> Barcha fikrlar va yutuqlar faqat Speakora tizimidan unumli va doimiy foydalanib, skeletons andozalarini chuqur mashq qilgan real foydalanuvchilarimizga tegishlidir.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 10 — FAQ */}
      <section className="py-24 bg-brand-navy-dark border-t border-brand-navy-light/30 relative" id="faq">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-brand-gold-base font-bold font-display">
              TEZ-TEZ SO&apos;RALADIGAN SAVOLLAR
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mt-3">
              FAQ: Savollaringizga Javoblar
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx}
                  className="glass-card border-brand-navy-light/50 bg-[#090f1d] rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-display font-bold text-sm md:text-base text-brand-neutral-white hover:text-brand-gold-base transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-brand-neutral-textMuted transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-gold-base' : ''
                    }`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-brand-neutral-textMuted border-t border-brand-navy-light/20 leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 11 — FINAL CTA */}
      <section className="py-24 relative overflow-hidden" id="cta">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-brand-purple-base/10 rounded-full blur-[110px]" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="glass-card border-2 border-brand-purple-base/30 bg-[#0c1221]/90 p-12 rounded-3xl shadow-2xl space-y-8 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-brand-gold-base/5 rounded-bl-full pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 bg-brand-purple-base/15 border border-brand-purple-base/30 text-brand-purple-light text-xs font-bold py-1 px-3.5 rounded-full uppercase tracking-wider">
              🔥 BOOTSTRAP YOUR SPEAKING NOW
            </span>

            <h2 className="text-3.5xl md:text-5xl font-extrabold font-display leading-[1.1] text-brand-neutral-white max-w-3xl mx-auto">
              Your Speaking Will Not Improve by Waiting.
            </h2>
            
            <p className="text-brand-neutral-textMuted text-base md:text-lg max-w-xl mx-auto">
              Skeletons andozalari yordamida bugunoq gapirishni boshlang va CEFR Speaking bo&apos;limida B2/C1 ballini kafolatlang!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/assessment')}
                className="btn-primary py-4 px-8 text-base shadow-xl flex items-center justify-center gap-2 group font-display font-bold"
              >
                Start Free Today
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleOpenAuth('signup')}
                className="btn-secondary py-4 px-8 text-base text-brand-purple-light hover:text-brand-neutral-white"
              >
                Try Mock Exam Preview
              </button>
            </div>

            <div className="pt-6 border-t border-brand-navy-light/30 flex flex-wrap justify-center gap-8 text-xs text-brand-neutral-textMuted">
              <div>✔ Ro&apos;yxatdan o&apos;tish bepul</div>
              <div>✔ Karta bog&apos;lash so&apos;ralmaydi</div>
              <div>✔ Istalgan brauzerda ishlaydi</div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-brand-navy-dark border-t border-brand-navy-light/40 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-base">
                  S
                </div>
                <span className="font-display font-extrabold text-xl tracking-tight text-brand-neutral-white">
                  Speakora
                </span>
              </div>
              <p className="text-xs text-brand-neutral-textMuted leading-relaxed max-w-xs">
                Uzbek CEFR talabalari uchun gapga chechanlik va ishonchni oshirish maqsadida yaratilgan professional platforma.
              </p>
            </div>
            
            <div>
              <h4 className="font-display font-bold text-xs text-brand-neutral-white uppercase tracking-wider mb-4">Metodologiya</h4>
              <ul className="space-y-2 text-xs text-brand-neutral-textMuted">
                <li><a href="#metodika" className="hover:text-brand-neutral-white transition-colors">Answer Skeletons</a></li>
                <li><a href="#metodika" className="hover:text-brand-neutral-white transition-colors">Phrase Banks</a></li>
                <li><a href="#challenge" className="hover:text-brand-neutral-white transition-colors">Daily Skeletons</a></li>
                <li><a href="#mock" className="hover:text-brand-neutral-white transition-colors">Timed Practice</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-brand-neutral-white uppercase tracking-wider mb-4">Mahsulot</h4>
              <ul className="space-y-2 text-xs text-brand-neutral-textMuted">
                <li><a href="#preview" className="hover:text-brand-neutral-white transition-colors">Mock Exam Player</a></li>
                <li><a href="#report" className="hover:text-brand-neutral-white transition-colors">AI Score Reports</a></li>
                <li><a href="#pricing" className="hover:text-brand-neutral-white transition-colors">Pricing & Plans</a></li>
                <li><span className="opacity-50">Supabase DB Sync</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-xs text-brand-neutral-white uppercase tracking-wider mb-4">Litsenziya & Aloqa</h4>
              <ul className="space-y-2 text-xs text-brand-neutral-textMuted">
                <li><span>Qo&apos;llab-quvvatlash: @speakora_support</span></li>
                <li><span>Telefon: +998 (90) 123-45-67</span></li>
                <li><span>© {new Date().getFullYear()} Speakora. Barcha huquqlar himoyalangan.</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-brand-navy-light/30 mt-10 pt-6 text-center text-[10px] text-brand-neutral-textMuted">
            Dastur Antigravity AI tomonidan maxsus ishlab chiqildi. CEFR imtihon simulyatsiyasi rasmiy CEFR baholash mezonlariga tayanadi.
          </div>
        </div>
      </footer>


      {/* PREMIUM AUTHENTICATION MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy-base/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-brand-navy-dark border border-brand-purple-base/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-scale-in">
            
            {/* Close button */}
            <button 
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-brand-neutral-textMuted hover:text-brand-neutral-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Logo / Header */}
            <div className="text-center space-y-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-xl mx-auto shadow-md mb-2">
                S
              </div>
              <h3 className="text-lg font-bold font-display text-brand-neutral-white">
                {authMode === 'login' ? 'Hisobingizga kirish' : 'Bepul hisob yaratish'}
              </h3>
              <p className="text-xs text-brand-neutral-textMuted">
                {authMode === 'login' 
                  ? 'Diagnostika va kunlik mashqlaringizni davom ettiring' 
                  : 'Fikrni andozalar yordamida tez gapirishni boshlang'}
              </p>
            </div>

            {/* Error Notification */}
            {authError && (
              <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-lg p-2.5 text-center font-medium">
                {authError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                    To&apos;liq ismingiz
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Jasur Alimov"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full glass-input text-xs py-2.5"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                  Elektron pochta (Email)
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input text-xs py-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                  Parol
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input text-xs py-2.5"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full btn-primary py-3 mt-2 text-xs flex items-center justify-center font-bold"
              >
                {authLoading ? (
                  <span className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-brand-navy-base border-t-transparent"></span>
                ) : authMode === 'login' ? (
                  'Hisobga kirish'
                ) : (
                  'Ro&apos;yxatdan o&apos;tish & Boshlash'
                )}
              </button>
            </form>

            {/* Mode toggle link */}
            <div className="text-center pt-2 border-t border-brand-navy-light/40">
              <span className="text-xs text-brand-neutral-textMuted">
                {authMode === 'login' ? 'Hisobingiz yo&apos;qmi?' : 'Avval ro&apos;yxatdan o&apos;tganmisiz?'}
              </span>
              <button
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'signup' : 'login');
                  setAuthError('');
                }}
                className="text-xs text-brand-gold-base hover:underline font-bold ml-1.5"
              >
                {authMode === 'login' ? 'Ro&apos;yxatdan o&apos;ting' : 'Kirish bo&apos;limiga o&apos;tish'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
