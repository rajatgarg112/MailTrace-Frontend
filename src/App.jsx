import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import FonoLayout from './layouts/FonoLayout';
import SecurityLayout from './layouts/SecurityLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Fono Pages
import FonoOverview from './pages/fono/FonoOverview';
import FonoInbox from './pages/fono/FonoInbox';
import FonoSent from './pages/fono/FonoSent';
import FonoSpam from './pages/fono/FonoSpam';
import FonoWarnings from './pages/fono/FonoWarnings';
import FonoQuarantine from './pages/fono/FonoQuarantine';
import FonoEmailDetail from './pages/fono/FonoEmailDetail';
import FonoProfile from './pages/fono/FonoProfile';

// Security Pages
import SecurityOverview from './pages/security/SecurityOverview';
import SecurityThreats from './pages/security/SecurityThreats';
import SecurityInvestigationDetail from './pages/security/SecurityInvestigationDetail';
import SecurityEvidenceDetail from './pages/security/SecurityEvidenceDetail';
import SecurityTimelineDetail from './pages/security/SecurityTimelineDetail';
import SecurityInfrastructureDetail from './pages/security/SecurityInfrastructureDetail';
import SecurityCaseDetail from './pages/security/SecurityCaseDetail';

import { IS_SECURITY_APP, ROUTES } from './utils/constants';

export function App() {
  return (
    <Routes>
      {/* Landing & Public Auth */}
      <Route path="/" element={<Navigate to={IS_SECURITY_APP ? ROUTES.SECURITY.OVERVIEW : ROUTES.FONO.OVERVIEW} replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Fono User Dashboard Layout Shell */}
      <Route path="/fono" element={<FonoLayout />}>
        <Route index element={<FonoOverview />} />
        <Route path="inbox" element={<FonoInbox />} />
        <Route path="sent" element={<FonoSent />} />
        <Route path="spam" element={<FonoSpam />} />
        <Route path="warnings" element={<FonoWarnings />} />
        <Route path="quarantine" element={<FonoQuarantine />} />
        <Route path="email/:id" element={<FonoEmailDetail />} />
        <Route path="profile" element={<FonoProfile />} />
      </Route>

      {/* Security SOC Intelligence Layout Shell */}
      <Route path="/security" element={<SecurityLayout />}>
        <Route index element={<SecurityOverview />} />
        <Route path="threats" element={<SecurityThreats />} />
        
        {/* Security Navigation Base & Detail Routes */}
        <Route path="investigation" element={<SecurityInvestigationDetail />} />
        <Route path="investigation/:id" element={<SecurityInvestigationDetail />} />
        
        <Route path="evidence" element={<SecurityEvidenceDetail />} />
        <Route path="evidence/:id" element={<SecurityEvidenceDetail />} />
        
        <Route path="timeline" element={<SecurityTimelineDetail />} />
        <Route path="timeline/:id" element={<SecurityTimelineDetail />} />
        
        <Route path="infrastructure" element={<SecurityInfrastructureDetail />} />
        <Route path="infrastructure/:id" element={<SecurityInfrastructureDetail />} />
        
        <Route path="cases" element={<SecurityCaseDetail />} />
        <Route path="cases/:id" element={<SecurityCaseDetail />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;

