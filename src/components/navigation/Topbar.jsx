import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, IS_SECURITY_APP, USER_APP_URL, SECURITY_APP_URL } from '../../utils/constants';

export function Topbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isSecurity = IS_SECURITY_APP;

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="topbar-menu-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <Link to={isSecurity ? ROUTES.SECURITY.OVERVIEW : ROUTES.FONO.OVERVIEW} className="topbar-brand">
          <Shield size={22} style={{ color: isSecurity ? '#4f46e5' : 'var(--accent-cyan)' }} />
          <span>MailTrace-AI</span>
          <span className={`topbar-badge ${isSecurity ? 'topbar-badge-security' : 'topbar-badge-fono'}`}>
            {isSecurity ? 'SOC DASHBOARD' : 'FONO MAIL'}
          </span>
        </Link>
      </div>

      {/* Center Search Bar */}
      {!isSecurity && (
        <div className="header-search-container">
          <Search size={16} style={{ color: '#94a3b8' }} />
          <input 
            type="text"
            className="header-search-input"
            placeholder="Search emails, senders, or security tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <div className="topbar-actions">
        {/* Quick Portal Switcher Button */}
        {isSecurity ? (
          <a
            href="http://localhost:5173/fono"
            target="mailtrace_fono_mailbox"
            onClick={() => {
              try {
                const win = window.open('http://localhost:5173/fono', 'mailtrace_fono_mailbox');
                if (win) win.focus();
              } catch (_) {}
            }}
            className="ui-btn ui-btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              textDecoration: 'none',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.08)',
              fontWeight: 600
            }}
          >
            <Mail size={15} />
            <span>📬 Open User Mailbox (5173)</span>
          </a>
        ) : (
          <a
            href="http://localhost:5174/security"
            target="mailtrace_security_soc"
            onClick={() => {
              try {
                const win = window.open('http://localhost:5174/security', 'mailtrace_security_soc');
                if (win) win.focus();
              } catch (_) {}
            }}
            className="ui-btn ui-btn-outline"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              textDecoration: 'none',
              border: '1px solid #818cf8',
              color: '#818cf8',
              background: 'rgba(129, 140, 248, 0.08)',
              fontWeight: 600
            }}
          >
            <Lock size={15} />
            <span>🛡️ Open Security SOC Portal (5174)</span>
          </a>
        )}

        <div className="topbar-user-profile">
          <button onClick={handleLogout} className="ui-btn ui-btn-ghost topbar-logout-btn" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
