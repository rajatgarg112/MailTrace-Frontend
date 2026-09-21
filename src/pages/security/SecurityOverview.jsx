import React, { useCallback } from 'react';
import { ShieldCheck, Activity, AlertTriangle, ShieldAlert, FolderLock, ArrowUpRight, Cpu, Server, Lock, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import RiskIndicator from '../../components/ui/RiskIndicator';
import DataTable from '../../components/ui/DataTable';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityOverview() {
  const fetchSecurityOverview = useCallback(() => api.getSecurityOverview(), []);
  const { data, loading, error, refetch } = useApi(fetchSecurityOverview, []);

  if (loading) {
    return <LoadingState message="Fetching SOC intelligence metrics from REST API..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Failed to Load Security Overview"
        description={error?.message || 'Error occurred contacting FastAPI security intelligence endpoint.'}
        onRetry={refetch}
      />
    );
  }

  const threatQueueColumns = [
    {
      header: 'Threat ID / Subject',
      key: 'subject',
      render: (val, row) => (
        <div style={{ maxWidth: 300 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={row.subject}>
            {row.subject}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {row.id} • {row.sender}
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
      header: 'Delivery Policy',
      key: 'action',
      render: (val) => <StatusBadge type="action" value={val} />,
    },
    {
      header: 'Risk Score',
      key: 'riskScore',
      render: (val, row) => (
        <div style={{ width: 120 }}>
          <RiskIndicator score={val} confidence={row.confidence} showBar={false} size="small" />
        </div>
      ),
    },
    {
      header: 'Security Tags',
      key: 'tags',
      render: (tags) => <SecurityTagList tags={tags} limit={2} size="small" />,
    },
    {
      header: 'Provenance',
      key: 'provenance',
      render: (prov) => <ProvenanceBadge provenance={prov} size="small" />,
    },
    {
      header: 'Inspect',
      key: 'id',
      align: 'right',
      render: (id) => (
        <Link to={`/security/investigation/${id}`} className="ui-btn ui-btn-outline" style={{ padding: '0.25rem 0.55rem', fontSize: '0.775rem' }}>
          <span>Inspect</span>
          <ArrowUpRight size={13} />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Security SOC Intelligence Overview"
        subtitle="Real-time pre-delivery security correlation engine status, threat queues, risk distributions, and forensic events."
        icon={ShieldCheck}
        badge={<ProvenanceBadge provenance="VERIFIED_EVIDENCE" />}
      />

      {/* Top Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Active Correlated Threats"
          value={data.activeThreatsCount || 0}
          subtitle="Pre-delivery high/critical threats"
          icon={AlertTriangle}
          accentColor="orange"
        />

        <StatCard
          title="Inspected Streams"
          value={(data.scannedCount || 0).toLocaleString()}
          subtitle="Pre-delivery SMTP traffic"
          icon={Activity}
          accentColor="cyan"
        />

        <StatCard
          title="Quarantine Activity"
          value={data.quarantinedCount || 0}
          subtitle="Isolated from user delivery"
          icon={ShieldAlert}
          accentColor="red"
        />

        <StatCard
          title="Open Forensic Cases"
          value={data.openCasesCount || 0}
          subtitle="Active SOC investigations"
          icon={FolderLock}
          accentColor="purple"
        />
      </div>

      {/* Grid: Threat Classification & Risk Distribution */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <Card title="Threat Classification Breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge type="classification" value="MALICIOUS" />
                <span style={{ fontSize: '0.85rem' }}>Malicious / High Risk</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#ef4444' }}>{data.classificationsBreakdown?.MALICIOUS || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge type="classification" value="SUSPICIOUS" />
                <span style={{ fontSize: '0.85rem' }}>Suspicious / Warned</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#f97316' }}>{data.classificationsBreakdown?.SUSPICIOUS || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge type="classification" value="SPAM" />
                <span style={{ fontSize: '0.85rem' }}>Spam / Unwanted</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{data.classificationsBreakdown?.SPAM || 0}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <StatusBadge type="classification" value="UNKNOWN" />
                <span style={{ fontSize: '0.85rem' }}>UNKNOWN (Neutral Hold)</span>
              </div>
              <strong style={{ fontFamily: 'var(--font-mono)', color: '#9ca3af' }}>{data.classificationsBreakdown?.UNKNOWN || 0}</strong>
            </div>
          </div>
        </Card>

        <Card title="Risk Score Distribution (0-100)">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(data.riskDistribution || []).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.count} emails</span>
                </div>
                <div style={{ width: '100%', height: 8, background: 'var(--bg-primary)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (item.count / (data.scannedCount || 1)) * 100 * 5 + 5)}%`, height: '100%', background: item.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Grid: Analysis Engines & Recent Security Events */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <Card title="Backend Analysis Engine Status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(data.engineStatuses || []).map((eng, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cpu size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontWeight: 500 }}>{eng.engine}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{eng.latency}</span>
                  <span className="ui-badge ui-badge-safe">{eng.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Security Events Feed">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(data.recentEvents || []).map((evt) => (
              <div key={evt.id} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: evt.severity === 'HIGH' ? '#ef4444' : '#f97316' }}>
                    {evt.type}
                  </span>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{evt.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {evt.detail}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Investigations Table */}
      <Card 
        title="Active Threat Queue & Recent Investigations"
        action={
          <Link to="/security/threats" className="ui-btn ui-btn-outline" style={{ fontSize: '0.8rem', padding: '0.3rem 0.65rem' }}>
            View Full Threat Queue
          </Link>
        }
      >
        <DataTable
          columns={threatQueueColumns}
          data={data.threatQueue || []}
          emptyTitle="Threat Queue Ready"
          emptyDescription="No unhandled pre-delivery threat queues at this moment."
        />
      </Card>
    </div>
  );
}

export default SecurityOverview;
