import React from 'react';
import { User, ShieldCheck, Lock, Bell, Mail } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import { useAuth } from '../../context/AuthContext';

export function FonoProfile() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="User Mail Profile & Settings"
        subtitle="Active user identity, mailbox quota status, and pre-delivery threat screening preferences."
        icon={User}
        badge={<ProvenanceBadge provenance="VERIFIED_EVIDENCE" size="medium" />}
      />

      <div className="grid-2">
        <Card title="Account Identity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Full Name:</span>
              <span style={{ fontWeight: 600 }}>{user?.name || 'Security Analyst'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mail Address:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{user?.email || 'analyst@mailtrace.ai'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Role:</span>
              <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{user?.role || 'SOC Analyst'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Mailbox Tenant:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>MailTrace Enterprise Demo</span>
            </div>
          </div>
        </Card>

        <Card title="Pre-Delivery Gateway Policy Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <ShieldCheck size={18} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Pre-Delivery Email Inspection</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All incoming mail streams filtered before local delivery.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <Lock size={18} style={{ color: '#8b5cf6' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Quarantine Auto-Isolate Vault</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Malicious emails automatically blocked without body execution.</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <Bell size={18} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div style={{ fontWeight: 600 }}>Security Warning Banners</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Suspicious messages require explicit controlled access.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default FonoProfile;
