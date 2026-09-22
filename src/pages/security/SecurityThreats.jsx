import React, { useState, useCallback } from 'react';
import { Activity, ArrowUpRight, Filter, Search, Zap, Check, Ban, ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import RiskIndicator from '../../components/ui/RiskIndicator';
import DataTable from '../../components/ui/DataTable';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ComposeModal from '../../components/email/ComposeModal';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityThreats() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchThreats = useCallback(() => {
    return api.getSecurityThreats({ status: statusFilter });
  }, [statusFilter]);

  const { data, loading, error, refetch } = useApi(fetchThreats, [statusFilter]);

  const handleApproveRow = async (e, row) => {
    e.stopPropagation();
    const targetId = row.emailId || row.id;
    setActionLoadingId(targetId);
    try {
      await api.releaseQuarantinedEmail(targetId);
      setActionMsg({
        type: 'success',
        text: `Approved: "${row.subject}" released by SOC Admin and delivered to recipient inbox.`,
      });
      refetch();
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: `Failed to approve "${row.subject}": ${err.message || 'Unknown error'}`,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleBlockRow = async (e, row) => {
    e.stopPropagation();
    const targetId = row.emailId || row.id;
    setActionLoadingId(targetId);
    try {
      await api.blockQuarantinedEmail(targetId);
      setActionMsg({
        type: 'danger',
        text: `Threat Blocked: "${row.subject}" permanently rejected at security gateway.`,
      });
      refetch();
    } catch (err) {
      setActionMsg({
        type: 'error',
        text: `Failed to block "${row.subject}": ${err.message || 'Unknown error'}`,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns = [
    {
      header: 'Queue ID / Subject',
      key: 'subject',
      render: (val, row) => (
        <div style={{ maxWidth: 280 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.subject}>
            {row.subject}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ID: {row.id} • Ref: {row.emailId}
          </div>
        </div>
      ),
    },
    {
      header: 'Sender',
      key: 'sender',
      render: (val, row) => (
        <div style={{ maxWidth: 200 }}>
          <div style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.senderName || row.sender}>
            {row.senderName || row.sender}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.sender}>
            {row.sender}
          </div>
        </div>
      ),
    },
    {
      header: 'Verdict',
      key: 'classification',
      render: (val) => <StatusBadge type="classification" value={val} />,
    },
    {
      header: 'Delivery Action',
      key: 'action',
      render: (val) => <StatusBadge type="action" value={val} />,
    },
    {
      header: 'Risk Score & Confidence',
      key: 'riskScore',
      render: (val, row) => (
        <div style={{ width: 130 }}>
          <RiskIndicator score={val} confidence={row.confidence} size="small" />
        </div>
      ),
    },
    {
      header: 'Security Tags',
      key: 'tags',
      render: (tags) => <SecurityTagList tags={tags} limit={2} size="small" />,
    },
    {
      header: 'Status',
      key: 'investigationStatus',
      render: (status) => (
        <span style={{
          fontSize: '0.725rem',
          fontWeight: 700,
          padding: '0.2rem 0.55rem',
          borderRadius: 4,
          fontFamily: 'var(--font-mono)',
          background: status === 'OPEN' ? 'rgba(239, 68, 68, 0.15)' : status === 'IN_REVIEW' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: status === 'OPEN' ? '#ef4444' : status === 'IN_REVIEW' ? '#f59e0b' : '#10b981',
          border: `1px solid ${status === 'OPEN' ? 'rgba(239, 68, 68, 0.3)' : status === 'IN_REVIEW' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
        }}>
          {status}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      key: 'displayTime',
      render: (t) => <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t}</span>,
    },
    {
      header: 'Actions / Inspect',
      key: 'id',
      align: 'right',
      render: (id, row) => {
        const isActionLoading = actionLoadingId === (row.emailId || row.id);
        const isUnderReview = row.investigationStatus === 'IN_REVIEW';

        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
            {isUnderReview && (
              <>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={(e) => handleApproveRow(e, row)}
                  title="Approve & Deliver to Recipient"
                  style={{
                    background: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: isActionLoading ? 'not-allowed' : 'pointer',
                    opacity: isActionLoading ? 0.7 : 1,
                  }}
                >
                  <Check size={12} />
                  <span>Approve</span>
                </button>
                <button
                  type="button"
                  disabled={isActionLoading}
                  onClick={(e) => handleBlockRow(e, row)}
                  title="Confirm Threat & Block"
                  style={{
                    background: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    cursor: isActionLoading ? 'not-allowed' : 'pointer',
                    opacity: isActionLoading ? 0.7 : 1,
                  }}
                >
                  <Ban size={12} />
                  <span>Block</span>
                </button>
              </>
            )}

            <Link
              to={`/security/investigation/${id}`}
              className="ui-btn ui-btn-outline"
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              <span>Inspect</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title="Security Threat Queue Matrix"
        subtitle="Security events requiring analyst investigation, ML signals, security tags, and policy actions."
        icon={Activity}
        badge={<ProvenanceBadge provenance="DERIVED_ANALYSIS" />}
      />

      <ComposeModal
        isOpen={isSimulateOpen}
        onClose={() => {
          setIsSimulateOpen(false);
          refetch();
        }}
      />

      {/* Filter Bar & Attack Simulator Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'OPEN', 'IN_REVIEW', 'RESOLVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`ui-btn ${statusFilter === st ? 'ui-btn-primary' : 'ui-btn-secondary'}`}
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-full)' }}
            >
              {st === 'ALL' ? 'All Events' : st}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsSimulateOpen(true)}
          className="ui-btn ui-btn-primary"
          style={{
            fontSize: '0.8rem',
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#dc2626',
            borderColor: '#dc2626',
            fontWeight: 600,
          }}
        >
          <Zap size={14} />
          <span>+ Simulate / Inject Threat Attack</span>
        </button>
      </div>

      {/* SOC Admin Table-Level Action Feedback Banner */}
      {actionMsg && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 8,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          fontWeight: 600,
          background: actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: actionMsg.type === 'success' ? '#059669' : '#dc2626',
          border: `1px solid ${actionMsg.type === 'success' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {actionMsg.type === 'success' ? <Check size={16} /> : <Ban size={16} />}
            <span>{actionMsg.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMsg(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 2 }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {loading ? (
        <LoadingState message={`Fetching threat queue events (${statusFilter}) from REST API...`} />
      ) : error ? (
        <ErrorState
          title="Failed to Load Threat Queue"
          description={error.message || 'Error occurred contacting FastAPI threat queue endpoint.'}
          onRetry={refetch}
        />
      ) : (
        <Card title={`Authoritative Threat Queue (${statusFilter})`}>
          <DataTable
            columns={columns}
            data={data || []}
            emptyTitle="Threat Queue Empty"
            emptyDescription={`No security events matching status ${statusFilter}.`}
          />
        </Card>
      )}
    </div>
  );
}

export default SecurityThreats;
