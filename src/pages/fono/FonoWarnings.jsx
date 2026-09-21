import React, { useState, useCallback } from 'react';
import { AlertTriangle, Lock, RefreshCw, CheckSquare, Square, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import RiskIndicator from '../../components/ui/RiskIndicator';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function FonoWarnings() {
  const fetchWarnings = useCallback(() => api.getEmails({ action: 'WARN' }), []);
  const { data: warningEmails, loading, error, refetch } = useApi(fetchWarnings, []);

  const [selectedIds, setSelectedIds] = useState([]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <LoadingState message="Fetching security warning messages from REST API..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Warnings"
        description={error.message || 'Error occurred while contacting FastAPI warning endpoint.'}
        onRetry={refetch}
      />
    );
  }

  const emailList = warningEmails || [];
  const allSelected = emailList.length > 0 && selectedIds.length === emailList.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(emailList.map((e) => e.id));
    }
  };

  return (
    <div>
      <PageHeader
        title="Security Warnings & Restricted Access"
        subtitle="Suspicious emails requiring controlled user interaction, warning explanations, and policy-controlled actions."
        icon={AlertTriangle}
      />

      {/* Warning Notice Banner */}
      <div style={{
        background: 'rgba(249, 115, 22, 0.08)',
        border: '1px solid rgba(249, 115, 22, 0.25)',
        borderRadius: 8,
        padding: '0.85rem 1.15rem',
        fontSize: '0.85rem',
        color: '#c2410c',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <Lock size={20} style={{ flexShrink: 0, color: '#f97316' }} />
        <div>
          <strong>Pre-Delivery Security Restriction:</strong> Access to suspicious messages is restricted by gateway policy. Inspect backend warning reasons and security flags below.
        </div>
      </div>

      {/* Email List Container */}
      <div className="email-list-container">
        {/* Email Toolbar */}
        <div className="email-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleSelectAll}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--text-secondary)',
                padding: 0,
              }}
              title={allSelected ? 'Deselect All' : 'Select All'}
            >
              {allSelected ? <CheckSquare size={18} style={{ color: 'var(--accent-blue)' }} /> : <Square size={18} />}
            </button>

            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : `${emailList.length} warning items`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={refetch} className="email-action-btn" title="Refresh List">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Warning Mail Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '0.75rem' }}>
          {emailList.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              There are currently no restricted warning messages in your queue.
            </div>
          ) : (
            emailList.map((item) => (
              <div 
                key={item.id} 
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid #fed7aa',
                  borderRadius: 8,
                  padding: '1rem 1.25rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                {/* Header Row: Subject, Sender, Time, Badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      {item.subject}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      From: <strong>{item.senderName ? `${item.senderName} (${item.sender})` : item.sender}</strong> • {item.displayTime || item.timestamp}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <StatusBadge type="classification" value={item.classification} />
                    <RiskIndicator score={item.riskScore} confidence={item.confidence} size="small" />
                  </div>
                </div>

                {/* Warning Reason Box */}
                <div style={{
                  background: '#fff7ed',
                  border: '1px solid #ffedd5',
                  borderRadius: 6,
                  padding: '0.75rem 1rem',
                  color: '#c2410c',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                }}>
                  <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2, color: '#ea580c' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: '#9a3412' }}>
                      Security Warning Reason:
                    </div>
                    <div>
                      {item.warningReason || 'Domain registered recently with unverified links. Form requests login credentials over an unverified URL pattern.'}
                    </div>
                  </div>
                </div>

                {/* Security Tags & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {item.tags && item.tags.length > 0 ? (
                    <SecurityTagList tags={item.tags} size="small" />
                  ) : <div />}

                  <Link 
                    to={`/fono/email/${item.id}`} 
                    className="ui-btn ui-btn-outline" 
                    style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderColor: '#fdba74', color: '#c2410c' }}
                  >
                    <Eye size={14} />
                    <span>Inspect Controlled View</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FonoWarnings;
