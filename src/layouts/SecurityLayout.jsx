import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/navigation/Topbar';
import Sidebar from '../components/navigation/Sidebar';
import { SECURITY_NAV_ITEMS } from '../utils/constants';
import { Lock } from 'lucide-react';

export function SecurityLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="layout-main">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="layout-body">
          <Sidebar 
            items={SECURITY_NAV_ITEMS} 
            mode="security" 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="layout-content">
            <div className="security-authoritative-banner banner-security-soc">
              <Lock size={16} />
              <span>
                <strong>SOC Threat Intelligence Mode:</strong> Presenting correlation analysis, headers, forensic evidence, and ML classifications.
              </span>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default SecurityLayout;
