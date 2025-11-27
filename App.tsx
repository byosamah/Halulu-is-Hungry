/**
 * App.tsx
 *
 * Main application component that handles routing between pages.
 *
 * Routes:
 * - / (root): Landing page with hero, story, and CTA
 * - /app: Main search and results page
 *
 * Language Support:
 * - LanguageProvider wraps the entire app for i18n
 * - Supports English (en) and Arabic (ar) with RTL
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          {/* Landing page - the main entry point */}
          <Route path="/" element={<LandingPage />} />

          {/* App page - search and results */}
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
