import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { X, Shield, Lock, Zap } from 'lucide-react';
import ComposeModal from '../email/ComposeModal';

export function Sidebar({ items = [], mode = 'fono', isOpen = false, onClose }) {
  const isSecurity = mode === 'security';
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <ComposeModal 
        isOpen={isComposeOpen} 
        onClose={() => setIsComposeOpen(false)} 
      />

      {/* Backdrop for mobile screen overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-section-title">
            {isSecurity ? 'SOC Intelligence Navigation' : 'Fono Mailbox Navigation'}
          </div>
          {onClose && (
            <button className="sidebar-mobile-close" onClick={onClose} aria-label="Close navigation">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Action Button: Compose in Fono, Inject Simulation in Security */}
        <div style={{ padding: '0 0.25rem 0.5rem 0.25rem' }}>
          {isSecurity ? (
            <button 
              type="button" 
              onClick={() => setIsComposeOpen(true)}
              className="ui-btn ui-btn-primary"
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: '#4f46e5',
                borderRadius: 'var(--radius-md, 8px)'
              }}
            >
              <Zap size={16} />
              <span>Inject & Test Threat</span>
            </button>
          ) : (
            <button 
              type="button" 
              onClick={() => setIsComposeOpen(true)}
              className="sidebar-compose-btn"
            >
              <Icons.Plus size={18} />
              <span>Compose</span>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const IconComponent = Icons[item.icon] || Icons.Circle;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/fono' || item.path === '/security'}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `sidebar-nav-item ${isActive ? (isSecurity ? 'active-security' : 'active') : ''}`
                }
              >
                <IconComponent size={18} className="sidebar-nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}>
          {isSecurity ? (
            <a
              href="http://localhost:5173/fono"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.775rem',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Shield size={14} style={{ color: 'var(--accent-cyan)' }} />
              <span>Switch to User Mailbox</span>
            </a>
          ) : (
            <a
              href="http://localhost:5174/security"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.775rem',
                padding: '0.45rem 0.65rem',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <Lock size={14} style={{ color: '#818cf8' }} />
              <span>Switch to Security SOC</span>
            </a>
          )}
        </div>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.725rem', color: 'var(--text-muted)' }}>
            {isSecurity ? <Lock size={12} style={{ color: '#8b5cf6' }} /> : <Shield size={12} style={{ color: 'var(--accent-cyan)' }} />}
            <span>MailTrace-AI v1.0 • Pre-Delivery</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
