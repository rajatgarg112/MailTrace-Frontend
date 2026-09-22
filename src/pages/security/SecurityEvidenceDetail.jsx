import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileCode, ShieldCheck, Cpu, Compass, Sparkles, ArrowLeft } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ThreatSwitcher from '../../components/security/ThreatSwitcher';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityEvidenceDetail() {
  const { id = 'thr-8901' } = useParams();
  const fetchEvidence = useCallback(() => api.getEvidenceById(id), [id]);
  const { data: evidenceRecord, loading, error, refetch } = useApi(fetchEvidence, [id]);

  if (loading) {
    return <LoadingState message={`Fetching cryptographic evidence record for [${id}] from REST API...`} />;
  }

  if (error || !evidenceRecord) {
    return (
      <ErrorState
        title="Evidence Record Unavailable"
        description={error?.message || `Failed to retrieve evidence vault data for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <ThreatSwitcher currentId={id} basePath="/security/evidence" />

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/security/threats" className="ui-btn ui-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Threat Queue</span>
        </Link>
      </div>

      <PageHeader
        title={`Evidence Vault Interface: ${id}`}
        subtitle="Cryptographic chain-of-custody, raw SMTP envelope logs, and strict provenance category classification."
        icon={FileCode}
        badge={<ProvenanceBadge provenance="VERIFIED_EVIDENCE" size="medium" />}
      />

      {/* Grid: 4 Provenance Categories Explained */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#15803d', fontSize: '0.85rem', marginBottom: 4 }}>
            <ShieldCheck size={16} />
            <span>1. Verified Evidence</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Immutable cryptographic hashes, SPF/DKIM/DMARC headers, and raw SMTP envelope logs.
          </p>
        </div>

        <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#1d4ed8', fontSize: '0.85rem', marginBottom: 4 }}>
            <Cpu size={16} />
            <span>2. Derived Analysis</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Heuristic outputs, domain age calculations, URL redirect expansion, and security tag generation.
          </p>
        </div>

        <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#b45309', fontSize: '0.85rem', marginBottom: 4 }}>
            <Compass size={16} />
            <span>3. Approximate Information</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Origin IP geolocation, ASN host lookup, and estimated network relay context.
          </p>
        </div>

        <div style={{ padding: '1rem', background: '#f5f3ff', borderRadius: 8, border: '1px solid #ddd6fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#6d28d9', fontSize: '0.85rem', marginBottom: 4 }}>
            <Sparkles size={16} />
            <span>4. Model Prediction</span>
          </div>
          <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Probabilistic ML/NLP model inferences, phishing sentiment weights, and confidence scores.
          </p>
        </div>
      </div>

      {/* Main Evidence Record */}
      <Card title="Preserved Cryptographic Evidence Record" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence Record ID</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>{evidenceRecord.evidenceId || id}</div>
            </div>
            <ProvenanceBadge provenance="VERIFIED_EVIDENCE" />
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>SHA-256 Payload Cryptographic Seal</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', background: 'var(--bg-primary)', padding: '0.65rem 0.85rem', borderRadius: 6, border: '1px solid var(--border-color)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              {evidenceRecord.sha256Hash}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Raw Gateway SMTP Envelope Record</div>
            <pre style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: '0.825rem', color: 'var(--accent-cyan)', overflowX: 'auto', fontFamily: 'var(--font-mono)' }}>
              {evidenceRecord.rawHeaderSnippet}
            </pre>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SecurityEvidenceDetail;
