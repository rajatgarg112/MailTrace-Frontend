import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/navigation/Topbar';
import Sidebar from '../components/navigation/Sidebar';
import { FONO_NAV_ITEMS } from '../utils/constants';
import { ShieldCheck } from 'lucide-react';

export function FonoLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="layout-main">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="layout-body">
          <Sidebar 
            items={FONO_NAV_ITEMS} 
            mode="fono" 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="layout-content">
            <div className="security-authoritative-banner">
              <ShieldCheck size={16} />
              <span>
                <strong>MailTrace Gateway Active:</strong> All emails inspected pre-delivery. Verdicts and risk calculations are authoritative from the backend.
              </span>
            </div>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default FonoLayout;
