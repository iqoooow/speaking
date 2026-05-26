import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BookOpen, Award, CreditCard, ShieldAlert, LogOut, Sparkles } from 'lucide-react';

export const AppLayout = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app-container">
      {/* App Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-navy-light/40 bg-brand-navy-dark/80 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-lg shadow-md shadow-brand-gold-glow">
            S
          </div>
          <span className="font-display font-bold text-lg tracking-wide bg-gradient-to-r from-brand-neutral-white via-brand-neutral-grayLight to-brand-gold-base bg-clip-text text-transparent">
            Speakora
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            {user.subscription_status === 'premium' ? (
              <span className="flex items-center gap-1 rounded-full bg-brand-success/10 px-2.5 py-0.5 text-xs font-bold text-brand-success border border-brand-success/25">
                <Sparkles className="h-3 w-3 animate-pulse" /> PRO
              </span>
            ) : user.subscription_status === 'pending' ? (
              <span className="rounded-full bg-brand-warning/10 px-2.5 py-0.5 text-xs font-semibold text-brand-warning border border-brand-warning/25">
                Kutilmoqda
              </span>
            ) : (
              <span className="rounded-full bg-brand-navy-light/60 px-2.5 py-0.5 text-xs font-semibold text-brand-neutral-textMuted border border-brand-navy-light/40">
                BEPUL
              </span>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-brand-neutral-textMuted hover:bg-brand-navy-light hover:text-brand-error transition-colors"
              title="Chiqish"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
      </header>

      {/* Main Content scrollable area */}
      <main className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <Outlet />
      </main>

      {/* Bottom Navigation (Only visible when user is logged in) */}
      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-brand-navy-light/40 bg-brand-navy-dark/95 px-2 py-2.5 backdrop-blur-lg flex justify-around items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${
              isActive('/dashboard') || location.pathname.startsWith('/challenge')
                ? 'text-brand-gold-base bg-brand-gold-base/10 font-medium'
                : 'text-brand-neutral-textMuted hover:text-brand-neutral-white'
            }`}
          >
            <BookOpen className="h-5 w-5 mb-0.5" />
            <span className="text-[10px]">Mashqlar</span>
          </button>

          <button
            onClick={() => navigate('/exam/lobby')}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${
              isActive('/exam/lobby') || location.pathname.startsWith('/exam/player') || location.pathname.startsWith('/exam/report')
                ? 'text-brand-gold-base bg-brand-gold-base/10 font-medium'
                : 'text-brand-neutral-textMuted hover:text-brand-neutral-white'
            }`}
          >
            <Award className="h-5 w-5 mb-0.5" />
            <span className="text-[10px]">Mock Imtihon</span>
          </button>

          <button
            onClick={() => navigate('/billing')}
            className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${
              isActive('/billing')
                ? 'text-brand-gold-base bg-brand-gold-base/10 font-medium'
                : 'text-brand-neutral-textMuted hover:text-brand-neutral-white'
            }`}
          >
            <CreditCard className="h-5 w-5 mb-0.5" />
            <span className="text-[10px]">Premium</span>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all duration-200 ${
                isActive('/admin/dashboard')
                  ? 'text-brand-error bg-brand-error/10 font-medium'
                  : 'text-brand-neutral-textMuted hover:text-brand-neutral-white'
              }`}
            >
              <ShieldAlert className="h-5 w-5 mb-0.5" />
              <span className="text-[10px]">Admin</span>
            </button>
          )}
        </nav>
      )}
    </div>
  );
};
