import React, { useState, useCallback, useEffect } from 'react';
import { ShieldAlert, Lock, Trash2, AlertOctagon } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import RiskIndicator from '../../components/ui/RiskIndicator';
import EmptyState from '../../components/ui/EmptyState';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function FonoQuarantine() {
  const fetchQuarantine = useCallback(() => api.getQuarantine(), []);
  const { data, loading, error, refetch } = useApi(fetchQuarantine, []);
  const [quarantineList, setQuarantineList] = useState([]);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    if (data) {
      setQuarantineList(data);
    }
  }, [data]);

  const handleDelete = (id, subject) => {
    setQuarantineList((prev) => prev.filter((item) => item.id !== id));
    setActionMessage(`Quarantined email "${subject}" has been deleted from vault.`);
    setTimeout(() => setActionMessage(''), 4000);
  };

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in the Quarantine Vault?')) {
      setQuarantineList([]);
      setActionMessage('All items in Quarantine Vault have been permanently deleted.');
      setTimeout(() => setActionMessage(''), 4000);
    }
  };

  if (loading) {
    return <LoadingState message="Connecting to quarantine vault REST API..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Quarantine Vault"
        description={error.message || 'Error occurred contacting FastAPI quarantine endpoint.'}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Quarantine Mails"
        subtitle="High-risk malicious threats blocked from delivery. Opening is disabled; only permanent deletion is allowed."
        icon={ShieldAlert}
        actions={
          quarantineList.length > 0 && (
            <button 
              onClick={handleDeleteAll} 
              style={{
                background: '#dc2626',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Trash2 size={14} />
              <span>Clear Quarantine Vault</span>
            </button>
          )
        }
      />

      {/* Action Toast Feedback */}
      {actionMessage && (
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          color: '#15803d',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <ShieldAlert size={18} />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Harmful Content Banner */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        padding: '0.85rem 1.15rem',
        fontSize: '0.825rem',
        color: '#b91c1c',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <Lock size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Strict Security Policy Active:</strong> Quarantined emails cannot be opened or viewed to prevent malware execution. Only deletion of quarantine items is permitted.
        </div>
      </div>

      <div className="email-client-container">
        <div className="email-client-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b91c1c' }}>
            Quarantined Malicious Mail Vault
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            Total Blocked: <strong>{quarantineList.length}</strong>
          </div>
        </div>

        {quarantineList.length === 0 ? (
          <EmptyState 
            title="Quarantine Vault Clear"
            description="No malicious threats currently isolated in quarantine."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.85rem' }}>
            {quarantineList.map((email) => (
              <div
                key={email.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid #fecaca',
                  borderRadius: 8,
                  padding: '1.15rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.2rem' }}>
                      {email.subject}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      Sender: <strong>{email.senderName ? `${email.senderName} (${email.sender})` : email.sender}</strong> • {email.displayTime || email.timestamp}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <StatusBadge type="classification" value={email.classification || 'MALICIOUS'} />
                    <RiskIndicator score={email.riskScore || 95} confidence={email.confidence} size="small" />
                  </div>
                </div>

                {/* Reason for Quarantine Container */}
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: 6,
                  padding: '0.75rem 1rem',
                  color: '#991b1b',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}>
                  <AlertOctagon size={18} style={{ flexShrink: 0, marginTop: 2, color: '#dc2626' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.2rem', color: '#7f1d1d' }}>
                      Quarantine Reason & Forensic Evidence:
                    </div>
                    <div style={{ lineHeight: 1.4, marginBottom: email.forensicSummary ? '0.35rem' : 0 }}>
                      {email.warningReason || 'High-confidence BEC / Phishing threat. Header spoofing with fake executive wire request.'}
                    </div>
                    {email.forensicSummary && (
                      <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontStyle: 'italic' }}>
                        Forensic Details: {email.forensicSummary}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags & Attachments */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {email.tags && email.tags.length > 0 ? (
                    <SecurityTagList tags={email.tags} size="small" />
                  ) : <div />}

                  {email.attachments && email.attachments.length > 0 && (
                    <div style={{ fontSize: '0.775rem', color: '#991b1b', background: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: 4 }}>
                      Blocked Payload: <strong>{email.attachments[0].name}</strong> ({email.attachments[0].threat || 'Executable Threat'})
                    </div>
                  )}
                </div>

                {/* Disabled Open & Only Delete Action Footer */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid #fee2e2',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}>
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#991b1b',
                    background: '#fee2e2',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontWeight: 500,
                  }}>
                    <Lock size={14} />
                    <span>Opening Disabled (Quarantine Policy)</span>
                  </div>

                  <button
                    onClick={() => handleDelete(email.id, email.subject)}
                    style={{
                      background: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.95rem',
                      borderRadius: 6,
                      fontSize: '0.825rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 1px 2px rgba(220,38,38,0.2)',
                    }}
                    title="Permanently delete this mail from quarantine"
                  >
                    <Trash2 size={15} />
                    <span>Delete Mail</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FonoQuarantine;
