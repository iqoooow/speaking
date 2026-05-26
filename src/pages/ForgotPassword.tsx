import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Iltimos, elektron pochtangizni kiriting.');
      setLoading(false);
      return;
    }

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setSuccess('Parolni tiklash havolasi elektron pochtangizga yuborildi. Pochtangizni tekshiring.');
        setEmail('');
      } else {
        setError(res.error || 'Parolni tiklash so\'rovida xatolik yuz berdi.');
      }
    } catch (err: any) {
      setError(err.message || 'Tizimda kutilmagan xatolik yuz berdi.');
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
          <h2 className="text-xl font-bold font-display text-center mb-2 text-brand-neutral-white">
            Parolni tiklash
          </h2>
          <p className="text-xs text-brand-neutral-textMuted text-center mb-6 leading-relaxed">
            Parolingizni tiklash uchun tizimda ro'yxatdan o'tgan email manzilingizni kiriting. Biz sizga havola yuboramiz.
          </p>

          {error && (
            <div className="bg-brand-error/10 border border-brand-error/30 text-brand-error text-xs rounded-xl p-3 mb-5 text-center font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-brand-success/10 border border-brand-success/30 text-brand-success text-xs rounded-xl p-3.5 mb-5 text-center font-medium leading-relaxed">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
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
                  Havola yuborish <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Toggle Mode */}
        <div className="text-center">
          <Link
            to="/login"
            className="text-xs text-brand-gold-base hover:underline font-bold"
          >
            Orqaga qaytish (Login)
          </Link>
        </div>

      </div>
    </div>
  );
}
