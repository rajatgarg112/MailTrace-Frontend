import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ShieldCheck, Zap, AlertOctagon, ArrowLeft, Cpu, Globe, Lock } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ThreatSwitcher from '../../components/security/ThreatSwitcher';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityTimelineDetail() {
  const { id = 'thr-8901' } = useParams();
  const fetchTimeline = useCallback(() => api.getTimelineById(id), [id]);
  const { data: timelineEvents, loading, error, refetch } = useApi(fetchTimeline, [id]);

  if (loading) {
    return <LoadingState message={`Fetching attack sequence timeline for [${id}] from REST API...`} />;
  }

  if (error || !timelineEvents) {
    return (
      <ErrorState
        title="Timeline Audit Log Unavailable"
        description={error?.message || `Failed to retrieve gateway audit timeline for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <ThreatSwitcher currentId={id} basePath="/security/timeline" />

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/security/threats" className="ui-btn ui-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Threat Queue</span>
        </Link>
      </div>

      <PageHeader
        title={`Attack Sequence Timeline: ${id}`}
        subtitle="Chronological gateway execution log from SMTP reception to final policy enforcement."
        icon={Clock}
        badge={<ProvenanceBadge provenance="DERIVED_ANALYSIS" size="medium" />}
      />

      <Card title="Chronological Pre-Delivery Gateway Audit Log">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
          {timelineEvents.map((evt, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'var(--bg-primary)',
                border: '2px solid var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                fontSize: '0.75rem',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1, background: 'var(--bg-primary)', padding: '1rem', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {evt.time} • Event #{idx + 1}
                  </span>
                  <ProvenanceBadge provenance={evt.provenance} size="small" />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {evt.event}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default SecurityTimelineDetail;
