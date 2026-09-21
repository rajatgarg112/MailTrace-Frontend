import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, AlertCircle, ArrowLeft, Server } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityInfrastructureDetail() {
  const { id = 'thr-8901' } = useParams();
  const fetchInfra = useCallback(() => api.getInfrastructureById(id), [id]);
  const { data: infra, loading, error, refetch } = useApi(fetchInfra, [id]);

  if (loading) {
    return <LoadingState message={`Fetching infrastructure context for [${id}] from REST API...`} />;
  }

  if (error || !infra) {
    return (
      <ErrorState
        title="Infrastructure Data Unavailable"
        description={error?.message || `Failed to retrieve infrastructure hop map for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/security/threats" className="ui-btn ui-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Threat Queue</span>
        </Link>
      </div>

      <PageHeader
        title={`Infrastructure & Hop Map: ${id}`}
        subtitle="SMTP origin IP context, BGP ASN lookup, ISP provider details, and relay chain hops."
        icon={Globe}
        badge={<ProvenanceBadge provenance="APPROXIMATE_INFO" size="medium" />}
      />

      {/* MANDATORY GEOLOCATION DISCLAIMER RULE */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 8,
        padding: '0.85rem 1.15rem',
        fontSize: '0.85rem',
        color: '#b45309',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <AlertCircle size={20} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <strong>Approximate Infrastructure Location Disclaimer:</strong> {infra.disclaimer}
        </div>
      </div>

      {/* VISUAL GEOLOCATION THREAT MAP */}
      <Card title="Live Infrastructure Geolocation Map" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              📍 {infra.approximateRegion || 'Brandenburg an der Havel, Germany'}
            </span>
            {infra.isVpnOrTor && (
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
                🚨 TOR EXIT NODE DETECTED
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <code style={{ background: 'var(--bg-primary)', padding: '0.2rem 0.5rem', borderRadius: 4, border: '1px solid var(--border-color)', color: 'var(--accent-cyan)' }}>
              Lat: {infra.mapMarker?.latitude || 52.6171}°, Lon: {infra.mapMarker?.longitude || 13.1207}°
            </code>
            <a 
              href={`https://www.openstreetmap.org/?mlat=${infra.mapMarker?.latitude || 52.6171}&mlon=${infra.mapMarker?.longitude || 13.1207}#map=12/${infra.mapMarker?.latitude || 52.6171}/${infra.mapMarker?.longitude || 13.1207}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ui-btn ui-btn-outline"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem' }}
            >
              Full Screen Map ↗
            </a>
          </div>
        </div>

        {/* Embedded Interactive Map Frame */}
        <div style={{
          width: '100%',
          height: '340px',
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-primary)',
          position: 'relative'
        }}>
          <iframe
            title="Infrastructure Threat Geolocation Map"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${(infra.mapMarker?.longitude || 13.1207) - 0.08}%2C${(infra.mapMarker?.latitude || 52.6171) - 0.05}%2C${(infra.mapMarker?.longitude || 13.1207) + 0.08}%2C${(infra.mapMarker?.latitude || 52.6171) + 0.05}&layer=mapnik&marker=${infra.mapMarker?.latitude || 52.6171}%2C${infra.mapMarker?.longitude || 13.1207}`}
            style={{ border: 0, filter: 'brightness(0.9) contrast(1.1)' }}
          />
        </div>
      </Card>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <Card title="Origin Network Metadata">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Origin IP Address:</span>
              <code style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{infra.originIp}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>ASN (Autonomous System):</span>
              <code style={{ color: 'var(--text-primary)' }}>{infra.asn}</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>ISP Provider:</span>
              <span>{infra.isp}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Approximate Infrastructure Region:</span>
              <span style={{ fontWeight: 600 }}>{infra.approximateRegion}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Data Provenance:</span>
              <ProvenanceBadge provenance={infra.provenance} size="small" />
            </div>
          </div>
        </Card>

        <Card title="Relay Hop Chain Tracing">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {(infra.networkHops || []).map((h, i) => (
              <div key={i} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span>Hop #{h.hop}: <code style={{ color: 'var(--accent-cyan)' }}>{h.ip}</code></span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{h.host}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default SecurityInfrastructureDetail;
