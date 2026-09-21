import React, { useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderLock, ArrowLeft, ShieldAlert, FileCode, Clock, Globe, Cpu } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import RiskIndicator from '../../components/ui/RiskIndicator';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';

export function SecurityCaseDetail() {
  const { id = 'case-1092' } = useParams();
  const fetchCase = useCallback(() => api.getCaseById(id), [id]);
  const { data: caseData, loading, error, refetch } = useApi(fetchCase, [id]);

  if (loading) {
    return <LoadingState message={`Fetching forensic case record [${id}] from REST API...`} />;
  }

  if (error || !caseData) {
    return (
      <ErrorState
        title="Forensic Case Record Unavailable"
        description={error?.message || `Failed to retrieve forensic case file for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/security" className="ui-btn ui-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
          <ArrowLeft size={14} />
          <span>Back to SOC Overview</span>
        </Link>
      </div>

      <PageHeader
        title={`Forensic Case Workspace: ${caseData.caseId || id}`}
        subtitle={caseData.title || 'Security Incident Investigation'}
        icon={FolderLock}
        badge={<ProvenanceBadge provenance="VERIFIED_EVIDENCE" size="medium" />}
      />

      {/* Case Status & Related Email */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <Card title="1. Case File Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Case Status:</span>
              <span className="ui-badge ui-badge-quarantine">{caseData.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Severity:</span>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>{caseData.severity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Assigned Analyst:</span>
              <span style={{ fontWeight: 600 }}>{caseData.assignedAnalyst}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Case Creation Time:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{caseData.createdTime}</span>
            </div>
          </div>
        </Card>

        <Card title="2. Related Email Metadata">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
              <span style={{ fontWeight: 600 }}>{caseData.subject || 'Urgent: Verify Your Corporate Access Credentials'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sender:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{caseData.sender || 'security-alert@micros0ft-verify.com'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Classification & Action:</span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <StatusBadge type="classification" value={caseData.classification || 'MALICIOUS'} />
                <StatusBadge type="action" value={caseData.action || 'QUARANTINE'} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Case Findings & Analysis Results */}
      <Card title="3. Case Findings & Analysis Results" style={{ marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
          <strong>Summary:</strong> {caseData.summary}
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Correlated Security Tags:</div>
          <SecurityTagList tags={caseData.tags || ['SPF_FAIL', 'DISPLAY_NAME_MISMATCH', 'LOOKALIKE_DOMAIN', 'TYPOSQUATTING']} size="medium" />
        </div>

        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <RiskIndicator score={caseData.riskScore || 92} confidence={caseData.confidence || 0.98} size="medium" />
        </div>
      </Card>

      {/* Case Evidence, Timeline & Infrastructure Shortcuts */}
      <div className="grid-3">
        <Link to={`/security/evidence/${caseData.emailId || 'thr-8901'}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}>
          <FileCode size={18} style={{ color: 'var(--accent-cyan)', marginBottom: 4 }} />
          <strong>Case Evidence Vault</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SHA-256 payload log seal verified</span>
        </Link>

        <Link to={`/security/timeline/${caseData.emailId || 'thr-8901'}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}>
          <Clock size={18} style={{ color: '#f59e0b', marginBottom: 4 }} />
          <strong>Case Event Sequence</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chronological audit log sequence</span>
        </Link>

        <Link to={`/security/infrastructure/${caseData.emailId || 'thr-8901'}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem' }}>
          <Globe size={18} style={{ color: '#38bdf8', marginBottom: 4 }} />
          <strong>Approximate Infrastructure</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Origin IP hop map context</span>
        </Link>
      </div>
    </div>
  );
}

export default SecurityCaseDetail;
