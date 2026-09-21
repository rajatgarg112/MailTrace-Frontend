import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', maxWidth: 680, marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '0.35rem 0.85rem', borderRadius: 999, color: '#0284c7', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Shield size={16} />
          <span>MailTrace-AI Platform Foundation</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2 }}>
          Pre-Delivery Email Threat Detection & Geolocation Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5 }}>
          Select a workspace portal below to access user mail views or SOC threat investigation dashboards.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem', width: '100%', maxWidth: 740 }}>
        <div className="ui-card hoverable" style={{ padding: '2.25rem' }}>
          <div style={{ background: '#e0f2fe', width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', marginBottom: '1.25rem' }}>
            <Mail size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>User Mail</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            User mail client interface displaying inbox, spam partitions, threat warnings, and quarantine vault.
          </p>
          <Link to={ROUTES.FONO.OVERVIEW} className="ui-btn ui-btn-primary" style={{ width: '100%' }}>
            <span>Enter User Portal</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="ui-card hoverable" style={{ padding: '2.25rem' }}>
          <div style={{ background: '#e0e7ff', width: 48, height: 48, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', marginBottom: '1.25rem' }}>
            <Lock size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Security SOC Dashboard</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Security analyst dashboard for threat correlation, forensic timelines, infrastructure maps, and cases.
          </p>
          <Link to={ROUTES.SECURITY.OVERVIEW} className="ui-btn ui-btn-secondary" style={{ width: '100%', borderColor: '#c7d2fe', color: '#4338ca' }}>
            <span>Enter Security SOC</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
