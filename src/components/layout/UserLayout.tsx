import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileBottomNav from './MobileBottomNav';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  FileText, 
  CreditCard, 
  User, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export default function UserLayout() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Challenge', path: '/dashboard#challenges', icon: BookOpen },
    { label: 'Mock Exam', path: '/exam/lobby', icon: Award },
    { label: 'Hisobotlar', path: '/dashboard#reports', icon: FileText },
    { label: 'Premium', path: '/billing', icon: CreditCard },
    { label: 'Profil', path: '/dashboard#profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      const [basePath, hash] = path.split('#');
      return location.pathname === basePath && location.hash === `#${hash}`;
    }
    return location.pathname === path && !location.hash;
  };

  const isPremium = profile?.premium_status || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-brand-navy-base text-brand-neutral-white flex flex-col md:flex-row relative">
      
      {/* 1. Desktop Sidebar Layout (Hidden on Mobile) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-brand-navy-dark/90 md:border-r md:border-brand-navy-light/30 z-30">
        {/* Brand logo */}
        <div className="p-6 flex items-center gap-3 border-b border-brand-navy-light/30">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-xl shadow-md shadow-brand-gold-glow">
            S
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-neutral-white to-brand-gold-base bg-clip-text text-transparent">
            Speakora
          </span>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path.includes('#')) {
                    const [basePath, hash] = item.path.split('#');
                    navigate(basePath);
                    setTimeout(() => {
                      window.location.hash = hash;
                    }, 50);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-semibold ${
                  active 
                    ? 'text-brand-gold-base bg-brand-gold-base/10 border border-brand-gold-base/20 shadow-goldGlow' 
                    : 'text-brand-neutral-textMuted hover:text-brand-neutral-white hover:bg-brand-navy-light/30'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-brand-gold-base' : 'text-brand-neutral-textMuted'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-brand-navy-light/30 bg-[#0d1424]/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="h-8.5 w-8.5 rounded-full bg-brand-purple-base/20 border border-brand-purple-base/30 flex items-center justify-center font-display font-bold text-brand-purple-light text-sm shrink-0">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-[11px] font-bold font-display text-brand-neutral-white truncate">
                  {profile?.full_name || 'Foydalanuvchi'}
                </p>
                <p className="text-[9px] text-brand-neutral-textMuted truncate">
                  {profile?.email || user?.email}
                </p>
              </div>
            </div>

            {/* Badge Indicator */}
            {isPremium ? (
              <span className="flex items-center gap-0.5 rounded bg-brand-success/15 px-1.5 py-0.5 text-[8px] font-extrabold text-brand-success border border-brand-success/25 uppercase">
                PRO
              </span>
            ) : (
              <span className="rounded bg-brand-navy-light px-1.5 py-0.5 text-[8px] font-bold text-brand-neutral-textMuted uppercase">
                FREE
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand-error/5 hover:bg-brand-error/15 border border-brand-error/15 text-brand-error text-[10px] font-bold tracking-wider uppercase transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Chiqish
          </button>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Mobile Header Bar (Sticky on top of mobile views) */}
        <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-brand-navy-light/45 bg-brand-navy-dark/85 px-4 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold-base text-brand-navy-base font-display font-extrabold text-lg shadow-md shadow-brand-gold-glow">
              S
            </div>
            <span className="font-display font-bold text-base tracking-wide bg-gradient-to-r from-brand-neutral-white via-brand-neutral-grayLight to-brand-gold-base bg-clip-text text-transparent">
              Speakora
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isPremium ? (
              <span className="flex items-center gap-1 rounded-full bg-brand-success/10 px-2.5 py-0.5 text-[9px] font-bold text-brand-success border border-brand-success/25 uppercase">
                <Sparkles className="h-2.5 w-2.5" /> PRO
              </span>
            ) : profile?.premium_status === false && profile?.role === 'user' ? (
              <span className="rounded-full bg-brand-navy-light/60 px-2.5 py-0.5 text-[9px] font-semibold text-brand-neutral-textMuted border border-brand-navy-light/40 uppercase">
                BEPUL
              </span>
            ) : null}

            <button
              onClick={handleLogout}
              className="rounded-lg p-1.5 text-brand-neutral-textMuted hover:bg-brand-navy-light hover:text-brand-error transition-colors"
              title="Chiqish"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Panel Area */}
        <main className="flex-grow overflow-y-auto px-4 pb-24 md:pb-12 pt-5 max-w-md mx-auto w-full md:max-w-3xl md:px-8">
          <Outlet />
        </main>

        {/* Mobile bottom nav container */}
        <MobileBottomNav />
      </div>

    </div>
  );
}
