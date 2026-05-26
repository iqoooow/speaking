import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import UserLayout from './components/layout/UserLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import MiniAssessment from './pages/MiniAssessment';
import PersonalizedPath from './pages/PersonalizedPath';
import Dashboard from './pages/Dashboard';
import ChallengePlayerPage from './pages/ChallengePlayerPage';
import ExamLobbyPage from './pages/ExamLobbyPage';
import ExamPlayerPage from './pages/ExamPlayerPage';
import ExamReportPage from './pages/ExamReportPage';
import BillingPage from './pages/BillingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Landing Route */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Gated First-Time User Onboarding Routes */}
            <Route 
              path="/mini-assessment" 
              element={
                <ProtectedRoute>
                  <MiniAssessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/assessment" 
              element={
                <ProtectedRoute>
                  <MiniAssessment />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/personalized-path" 
              element={
                <ProtectedRoute>
                  <PersonalizedPath />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/path" 
              element={
                <ProtectedRoute>
                  <PersonalizedPath />
                </ProtectedRoute>
              } 
            />

            {/* User Portal Layout Routes */}
            <Route element={<UserLayout />}>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/challenge/:id" 
                element={
                  <ProtectedRoute>
                    <ChallengePlayerPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exam/lobby" 
                element={
                  <ProtectedRoute requirePremium={true}>
                    <ExamLobbyPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/exam/report/:id" 
                element={
                  <ProtectedRoute requirePremium={true}>
                    <ExamReportPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/billing" 
                element={
                  <ProtectedRoute>
                    <BillingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
            </Route>

            {/* Full Screen Immersive Exam Player (No shared layouts/nav bars) */}
            <Route 
              path="/exam/player" 
              element={
                <ProtectedRoute requirePremium={true}>
                  <ExamPlayerPage />
                </ProtectedRoute>
              } 
            />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
