import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { StateProvider } from './context/StateContext';
import { fetchSolvedChallenges } from './store/slices/ecosystemSlice';
import { fetchCurrentUser } from './store/slices/authSlice';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingScreen from './components/common/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import CommunityPage from './pages/CommunityPage';
import GovernmentPage from './pages/GovernmentPage';
import UniversityPage from './pages/UniversityPage';
import IndustryPage from './pages/IndustryPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';

function AppRouter() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. fetchSolvedChallenges(6) -> GET /api/problems?resolutionStatus=solved&limit=6
    // 2. fetchCurrentUser() -> Check HTTP-Only cookie session on /api/auth/me
    const initializeAppData = async () => {
      try {
        await Promise.allSettled([
          dispatch(fetchSolvedChallenges(6)),
          dispatch(fetchCurrentUser())
        ]);
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAppData();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Landing / Overview */}
          <Route index element={<LandingPage />} />

          {/* Unified Community & PRI Panchayat Portal */}
          <Route path="community" element={<CommunityPage />} />

          {/* Backward compatibility redirects */}
          <Route path="citizen" element={<Navigate to="/community" replace />} />
          <Route path="panchayat" element={<Navigate to="/community" replace />} />

          {/* Government Command Center & AI Triage */}
          <Route path="dashboard" element={<GovernmentPage />} />

          {/* University R&D & Team Proposal Hub */}
          <Route path="university" element={<UniversityPage />} />

          {/* Industry CSR Marketplace & Grants */}
          <Route path="industry" element={<IndustryPage />} />

          {/* 24-District GIS Map */}
          <Route path="map" element={<MapPage />} />

          {/* Authentication (Login / Register) */}
          <Route path="auth" element={<AuthPage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <StateProvider>
        <AppRouter />
      </StateProvider>
    </ErrorBoundary>
  );
}
