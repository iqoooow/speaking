import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  FileText, 
  CreditCard, 
  User 
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<any>;
}

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
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

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-brand-navy-light/45 bg-brand-navy-dark/95 px-2 py-2.5 backdrop-blur-lg flex justify-around items-center">
      {navItems.map((item) => {
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
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 flex-1 ${
              active
                ? 'text-brand-gold-base bg-brand-gold-base/10 font-bold scale-105'
                : 'text-brand-neutral-textMuted hover:text-brand-neutral-white'
            }`}
          >
            <Icon className={`h-5 w-5 mb-0.5 ${active ? 'text-brand-gold-base animate-pulse-slow' : ''}`} />
            <span className="text-[9px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
