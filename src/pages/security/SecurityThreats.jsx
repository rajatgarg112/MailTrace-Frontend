import React, { useState, useCallback } from 'react';
import { Activity, ArrowUpRight, Filter, Search } from 'lucide-react';
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
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityThreats() {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchThreats = useCallback(() => {
    return api.getSecurityThreats({ status: statusFilter });
  }, [statusFilter]);

  const { data, loading, error, refetch } = useApi(fetchThreats, [statusFilter]);

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
      header: 'Investigate',
      key: 'id',
      align: 'right',
      render: (id) => (
        <Link to={`/security/investigation/${id}`} className="ui-btn ui-btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.775rem' }}>
          <span>Inspect Workspace</span>
          <ArrowUpRight size={13} />
        </Link>
      ),
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

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
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
