import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { StateProvider } from './context/StateContext';
import { fetchSolvedChallenges } from './store/slices/ecosystemSlice';
import { fetchCurrentUser } from './store/slices/authSlice';

import ErrorBoundary from './components/common/ErrorBoundary';

// Layout & Pages
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import CitizenPage from './pages/CitizenPage';
import PanchayatPage from './pages/PanchayatPage';
import GovernmentPage from './pages/GovernmentPage';
import UniversityPage from './pages/UniversityPage';
import IndustryPage from './pages/IndustryPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';

function AppRouter() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Call ONLY 2 APIs on initial landing page load:
    // 1. fetchSolvedChallenges(6) -> GET /api/problems?resolutionStatus=solved&limit=6
    // 2. fetchCurrentUser() -> GET /api/auth/me
    dispatch(fetchSolvedChallenges(6));
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Landing / Overview */}
          <Route index element={<LandingPage />} />

          {/* Citizen & Community Portal */}
          <Route path="citizen" element={<CitizenPage />} />

          {/* Panchayati Raj & ULB Portal */}
          <Route path="panchayat" element={<PanchayatPage />} />

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
