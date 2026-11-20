import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BusinessProvider } from './context/BusinessContext';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReviewIntelligence from './pages/ReviewIntelligence';
import DemandRadar from './pages/DemandRadar';
import BusinessAdvisor from './pages/BusinessAdvisor';
import MarketingStudio from './pages/MarketingStudio';
import GrowthTracker from './pages/GrowthTracker';
import Settings from './pages/Settings';
import PublicFeedback from './pages/PublicFeedback';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <BusinessProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />

          {/* Public Feedback Form */}
          <Route path="/feedback/:businessId" element={<PublicFeedback />} />

          {/* Authenticated / Demo Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reviews" element={<ReviewIntelligence />} />
            <Route path="/demand" element={<DemandRadar />} />
            <Route path="/advisor" element={<BusinessAdvisor />} />
            <Route path="/marketing" element={<MarketingStudio />} />
            <Route path="/growth" element={<GrowthTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BusinessProvider>
    </BrowserRouter>
  );
}

export default App;
