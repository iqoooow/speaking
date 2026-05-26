import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const ProtectedRoute = ({ children, requireAdmin = false, requirePremium = false }) => {
  const { user, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-navy-base">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple-base border-t-transparent"></div>
      </div>
    );
  }

  // User not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Admin page requested, but user is not admin
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Premium feature requested, but user is free/pending (and not admin, who gets auto-access)
  if (requirePremium && user.subscription_status !== 'premium' && user.role !== 'admin') {
    return <Navigate to="/billing" replace />;
  }

  return children;
};
