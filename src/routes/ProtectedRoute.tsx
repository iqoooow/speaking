import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requirePremium?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requirePremium = false 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-navy-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-base border-t-transparent"></div>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Onboarding not completed -> Force redirect to assessment
  // (unless they are already on onboarding routes)
  const isOnboardingRoute = 
    location.pathname === '/mini-assessment' || 
    location.pathname === '/personalized-path';

  if (profile && !profile.onboarding_completed && !isOnboardingRoute) {
    return <Navigate to="/mini-assessment" replace />;
  }

  // 3. Onboarding is completed -> Block visiting onboarding pages again
  if (profile && profile.onboarding_completed && isOnboardingRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Admin page requested, but user is not admin
  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 5. Premium feature requested, but user does not have premium status (and is not admin)
  if (requirePremium && !profile?.premium_status && profile?.role !== 'admin') {
    return <Navigate to="/billing" replace />;
  }

  return <>{children}</>;
};
