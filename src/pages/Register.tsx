import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function Register() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!fullName || !email || !password) {
      setError('Barcha maydonlarni to\'ldiring.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi shart.');
      setLoading(false);
      return;
    }

    try {
      const res = await signup(email, password, fullName);
      if (res.success) {
        // Sign up automatically signs in, redirect to diagnostic onboarding
        navigate('/mini-assessment');
      } else {
        setError(res.error || 'Hisob yaratishda xatolik yuz berdi. Pochta allaqachon ro\'yxatdan o\'tgan bo\'lishi mumkin.');
      }
    } catch (err: any) {
      setError(err.message || 'Tizimda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white flex flex-col justify-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-80 h-80 bg-brand-purple-base/15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-brand-gold-base/5 rounded-full blur-[65px] pointer-events-none" />

      <div className="w-full max-w-md mx-auto space-y-8 relative z-10">
        
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-2xl shadow-xl shadow-brand-gold-glow">
              S
            </div>
            <span className="font-display font-extrabold text-3xl tracking-tight bg-gradient-to-r from-brand-neutral-white to-brand-gold-base bg-clip-text text-transparent">
              Speakora
            </span>
          </Link>
          <p className="text-brand-purple-light text-xs font-display font-bold uppercase tracking-widest pt-1">
            CEFR Speaking Platform
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 md:p-8 bg-brand-navy-dark/90 shadow-2xl border-brand-navy-light/40">
          <h2 className="text-xl font-bold font-display text-center mb-6 text-brand-neutral-white">
            Ro'yxatdan o'tish
          </h2>

          {error && (
            <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 mb-5 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                To'liq ismingiz (Ism-Familiya)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-neutral-textMuted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Jasur Alimov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full glass-input pl-10 text-sm py-3"
                />
              </div>
            </div>

            {/* Email input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                Elektron pochta (Email)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-neutral-textMuted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 text-sm py-3"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-brand-neutral-textMuted uppercase tracking-wider">
                Parol (kamida 6 ta belgi)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-neutral-textMuted">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm py-3"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center font-bold text-xs uppercase tracking-wider"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand-navy-base border-t-transparent"></span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Ro'yxatdan o'tish <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Toggle Mode */}
        <div className="text-center">
          <span className="text-xs text-brand-neutral-textMuted">
            Hisobingiz bormi?
          </span>
          <Link
            to="/login"
            className="text-xs text-brand-gold-base hover:underline font-bold ml-1.5"
          >
            Kirish bo'limiga o'ting
          </Link>
        </div>

      </div>
    </div>
  );
}
