/**
 * App.tsx
 *
 * Main application component that handles routing between pages.
 *
 * Routes:
 * - / (root): Landing page with hero, story, and CTA
 * - /app: Main search and results page
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Landing page - the main entry point */}
        <Route path="/" element={<LandingPage />} />

        {/* App page - search and results */}
        <Route path="/app" element={<AppPage />} />
      </Routes>
    </Router>
  );
};

export default App;
