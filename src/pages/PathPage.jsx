import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, BookOpen, AlertCircle, ArrowRight, UserCheck, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PathPage() {
  const navigate = useNavigate();
  const { signup, user } = useApp();
  
  const [results, setResults] = useState(null);
  
  // Registration form for unauthenticated users
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456'); // default easy pass
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read diagnostic results from session storage
    const saved = sessionStorage.getItem('speakora_assessment_results');
    if (saved) {
      const parsed = JSON.parse(saved);
      setResults(parsed);
      
      // Trigger confetti celebration on successful generation
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      // Direct redirect if no diagnostic data
      navigate('/');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email) {
      setError('Iltimos, ismingiz va emailingizni kiriting!');
      setLoading(false);
      return;
    }

    try {
      const res = await signup(email, password, fullName);
      if (res.success) {
        // Upgrade temporary registration
        navigate('/dashboard');
      } else {
        setError(res.error || 'Tizimga kirishda xatolik. Qayta urinib ko\'ring.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!results) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-navy-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-base border-t-transparent"></div>
      </div>
    );
  }

  const { structureScore, confidenceScore, vocabularyScore } = results;
  const overallCEFR = structureScore + confidenceScore + vocabularyScore > 200 ? 'B2' : 'B1';

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col bg-brand-navy-base text-brand-neutral-white px-4 py-8 relative">
      {/* Background radial effects */}
      <div className="absolute top-[20%] left-[-20%] w-64 h-64 bg-brand-purple-base/10 rounded-full blur-[80px]" />

      {/* Path Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1 bg-brand-success/10 border border-brand-success/20 text-brand-success text-[10px] font-bold py-1 px-3 rounded-full uppercase tracking-wider mb-2">
          <Sparkles className="h-3 w-3" /> Yo'l xaritangiz tayyor!
        </span>
        <h2 className="text-2xl font-bold font-display text-brand-neutral-white">Shaxsiy CEFR Rejangiz</h2>
        <p className="text-xs text-brand-neutral-textMuted mt-1">Diagnostika natijasida tuzilgan o'quv dasturi</p>
      </div>

      {/* Score Grid Cards */}
      <div className="glass-card p-4 border-brand-navy-light/40 mb-6 space-y-4">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2">
          Gapirish parametrlari tahlili
        </h3>

        {/* Structure */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Struktura (Skeletons)</span>
            <span className="text-brand-purple-light">{structureScore}%</span>
          </div>
          <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden">
            <div style={{ width: `${structureScore}%` }} className="h-full bg-brand-purple-base rounded-full" />
          </div>
        </div>

        {/* Confidence */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>Nutq ishonchi (Confidence)</span>
            <span className="text-brand-success">{confidenceScore}%</span>
          </div>
          <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden">
            <div style={{ width: `${confidenceScore}%` }} className="h-full bg-brand-success rounded-full" />
          </div>
        </div>

        {/* Vocabulary */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold">
            <span>So'z boyligi va tezlik (Fluency)</span>
            <span className="text-brand-warning">{vocabularyScore}%</span>
          </div>
          <div className="h-2 w-full bg-brand-navy-base rounded-full overflow-hidden">
            <div style={{ width: `${vocabularyScore}%` }} className="h-full bg-brand-warning rounded-full" />
          </div>
        </div>

        <div className="bg-brand-purple-glow rounded-xl p-3 border border-brand-purple-base/10 flex items-start gap-2.5 mt-3">
          <AlertCircle className="h-4.5 w-4.5 text-brand-purple-light shrink-0 mt-0.5" />
          <div className="text-[11px] text-brand-neutral-grayLight leading-relaxed">
            <strong>Tavsiya:</strong> Sizda taxminiy gapirish darajasi <strong className="text-brand-purple-light font-display">{overallCEFR}</strong>. Fikringizni yodlangan andozasiz boshlashda biroz qiyinchilik bor. Sizga kunlik <strong>Daily Structure Challenges</strong> orqali andozalar (skeletons) bilan ishlash tavsiya etiladi.
          </div>
        </div>
      </div>

      {/* Target Timeline */}
      <div className="glass-card p-4 border-brand-navy-light/40 mb-8">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-brand-neutral-textMuted border-b border-brand-navy-light/40 pb-2 mb-4">
          30 Kunlik O'sish Yo'li
        </h3>

        <div className="space-y-4">
          {/* Phase 1 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-brand-purple-base/10 text-brand-purple-light text-xs font-bold flex items-center justify-center border border-brand-purple-base/30">
                1
              </div>
              <div className="w-[1px] flex-1 bg-brand-navy-light/40" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display text-brand-neutral-white">1-10 Kun: Strukturani shakllantirish</h4>
              <p className="text-[10px] text-brand-neutral-textMuted mt-0.5 leading-relaxed">
                Kunlik bepul <strong>Daily challenges</strong> orqali gapni andozalar yordamida qotib qolmasdan tez boshlash ko'nikmasini oshirasiz.
              </p>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-brand-purple-base/10 text-brand-purple-light text-xs font-bold flex items-center justify-center border border-brand-purple-base/30">
                2
              </div>
              <div className="w-[1px] flex-1 bg-brand-navy-light/40" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-display text-brand-neutral-white">11-20 Kun: So'z birikmalari (Phrase Bank)</h4>
              <p className="text-[10px] text-brand-neutral-textMuted mt-0.5 leading-relaxed">
                Qo'shimcha bog'lovchi so'zlar yordamida fikrlarni o'zaro bog'lashni va nutq ravonligini ta'minlashni o'rganasiz.
              </p>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 rounded-full bg-brand-purple-base/10 text-brand-purple-light text-xs font-bold flex items-center justify-center border border-brand-purple-base/30">
                3
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold font-display text-brand-neutral-white">21-30 Kun: Imtihon simulyatsiyasi</h4>
              <p className="text-[10px] text-brand-neutral-textMuted mt-0.5 leading-relaxed">
                To'liq va cheklangan vaqt sharoitida 4-qismli <strong>Premium Mock Exam</strong> orqali o'z darajangizni hisoblaysiz.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form or Redirect Action */}
      {user ? (
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2"
        >
          Dashboardga o'tish <ArrowRight className="h-4.5 w-4.5" />
        </button>
      ) : (
        <div className="glass-card p-5 border-brand-purple-base/30 bg-brand-purple-glow">
          <h3 className="font-bold font-display text-sm text-center mb-1 text-brand-neutral-white">
            Yo'l xaritasini saqlash
          </h3>
          <p className="text-[10px] text-brand-neutral-textMuted text-center mb-4 leading-relaxed">
            Hozir bepul ro'yxatdan o'ting, natijalaringiz saqlanadi va kunlik mashqlarni boshlashingiz mumkin.
          </p>

          {error && (
            <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-lg p-2 mb-3 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="Ismingiz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full glass-input text-xs py-2 px-3"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Emailingiz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input text-xs py-2 px-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 text-xs flex items-center justify-center gap-1.5 font-bold"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-navy-base border-t-transparent"></span>
              ) : (
                <><UserCheck className="h-4 w-4" /> Ro'yxatdan o'tish & Boshlash</>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
