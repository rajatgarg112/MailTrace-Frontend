import React, { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, ShieldAlert, Cpu, Lock, Globe, Clock, FileCode, FolderLock, 
  Paperclip, QrCode, AlertOctagon, CheckCircle, XCircle, ArrowUpRight, Zap
} from 'lucide-react';
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

export function SecurityInvestigationDetail() {
  const { id = 'thr-8901' } = useParams();
  const fetchInv = useCallback(() => api.getInvestigationById(id), [id]);
  const { data: inv, loading, error, refetch } = useApi(fetchInv, [id]);

  if (loading) {
    return <LoadingState message={`Fetching SOC investigation workspace [${id}] from REST API...`} />;
  }

  if (error || !inv) {
    return (
      <ErrorState
        title="Investigation Workspace Unavailable"
        description={error?.message || `Failed to fetch investigation workspace data for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/security/threats" className="ui-btn ui-btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
          ← Back to Threat Queue
        </Link>
      </div>

      <PageHeader
        title={`SOC Investigation Workspace: ${inv.id}`}
        subtitle={`Subject: ${inv.subject}`}
        icon={Search}
        badge={<ProvenanceBadge provenance="DERIVED_ANALYSIS" size="medium" />}
      />

      {/* Safety Notice Banner */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        padding: '0.85rem 1.15rem',
        color: '#b91c1c',
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      }}>
        <Lock size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Malicious Content Safety:</strong> Original body HTML, attachments, and URLs are isolated. Auto-execution and remote resource fetching are disabled by pre-delivery gateway policy.
        </div>
      </div>

      {/* Section 1 & 2: Email Info & Authoritative Risk Verdict */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <Card title="1. Email Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subject:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{inv.subject}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sender:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{inv.sender}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Recipient:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{inv.recipient}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Timestamp:</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>{inv.timestamp}</span>
            </div>
          </div>
        </Card>

        <Card title="2. Authoritative Risk Verdict & Policy">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Threat Verdict:</span>
              <StatusBadge type="classification" value={inv.riskInfo?.classification} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Policy:</span>
              <StatusBadge type="action" value={inv.riskInfo?.action} />
            </div>
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
              <RiskIndicator score={inv.riskInfo?.score} confidence={inv.riskInfo?.confidence} size="medium" />
            </div>
          </div>
        </Card>
      </div>

      {/* Section 3: Authoritative Security Tags */}
      <Card title="3. Authoritative Security Tags" style={{ marginBottom: '1.75rem' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Short security explanations visually separate from raw features and delivery actions:
        </p>
        <SecurityTagList tags={inv.securityTags || []} size="medium" />
      </Card>

      {/* Section 4: Comprehensive Security Findings */}
      <Card title="4. Comprehensive Security Findings" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* A. Authentication */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>A. Email Authentication (SPF / DKIM / DMARC)</div>
              <ProvenanceBadge provenance="VERIFIED_EVIDENCE" size="small" />
            </div>
            <div className="grid-3">
              <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: 4, fontSize: '0.8rem' }}>
                <div>SPF Status: <strong style={{ color: '#ef4444' }}>{inv.authFindings?.spf?.status}</strong></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{inv.authFindings?.spf?.detail}</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: 4, fontSize: '0.8rem' }}>
                <div>DKIM Status: <strong style={{ color: '#ef4444' }}>{inv.authFindings?.dkim?.status}</strong></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{inv.authFindings?.dkim?.detail}</div>
              </div>
              <div style={{ padding: '0.5rem', background: 'var(--bg-surface)', borderRadius: 4, fontSize: '0.8rem' }}>
                <div>DMARC Status: <strong style={{ color: '#ef4444' }}>{inv.authFindings?.dmarc?.status}</strong></div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{inv.authFindings?.dmarc?.detail}</div>
              </div>
            </div>
          </div>

          {/* B. Sender / Domain Findings */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>B. Sender & Domain Intelligence</div>
              <ProvenanceBadge provenance={inv.domainFindings?.provenance || 'DERIVED_ANALYSIS'} size="small" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div>Display Name Mismatch: <strong style={{ color: '#ef4444' }}>YES</strong> ({inv.domainFindings?.displayNameDetail})</div>
              <div>Lookalike Brand Spoofing: <strong style={{ color: '#ef4444' }}>YES</strong> ({inv.domainFindings?.lookalikeDetail})</div>
              <div>Typosquatting Flag: <strong style={{ color: '#ef4444' }}>DETECTED</strong></div>
              <div>Domain Registration Age: <strong>{inv.domainFindings?.domainAge}</strong></div>
            </div>
          </div>

          {/* C. URL Findings */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>C. URL & Link Findings (Not Auto-Opened)</div>
              <ProvenanceBadge provenance="DERIVED_ANALYSIS" size="small" />
            </div>
            {(inv.urlFindings || []).map((u, idx) => (
              <div key={idx} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', color: '#f87171', fontWeight: 600 }}>{u.url}</div>
                <div style={{ marginTop: '0.35rem', color: 'var(--text-muted)' }}>
                  Short URL: {u.isShortUrl ? 'YES' : 'NO'} | Category: {u.category} | Reputation: <strong style={{ color: '#ef4444' }}>{u.reputation}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* D. Attachment Findings */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>D. Attachment Findings (Execution Blocked)</div>
              <ProvenanceBadge provenance="VERIFIED_EVIDENCE" size="small" />
            </div>
            {(inv.attachmentFindings || []).map((att, idx) => (
              <div key={idx} style={{ padding: '0.65rem 0.85rem', background: 'var(--bg-surface)', borderRadius: 6, border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#fca5a5', fontSize: '0.85rem' }}>{att.filename} ({att.fileType})</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>SHA-256: {att.sha256}</div>
                </div>
                <span className="ui-badge ui-badge-quarantine">{att.threatName}</span>
              </div>
            ))}
          </div>

          {/* E. QR & Image Findings */}
          <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-cyan)' }}>E. QR Code & Image Security Findings</div>
              <ProvenanceBadge provenance="DERIVED_ANALYSIS" size="small" />
            </div>
            <div style={{ fontSize: '0.825rem' }}>
              <div>QR Code Detected: <strong>YES</strong></div>
              <div>Extracted QR Payload URL: <code style={{ color: '#f87171' }}>{inv.qrFindings?.extractedUrl}</code></div>
              <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{inv.qrFindings?.imageSecurityFinding}</div>
            </div>
          </div>

          {/* F. Behavioral & Threat Intel */}
          <div className="grid-2">
            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>F. Behavioral & Contextual Signals</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                BEC Indicators: {(inv.behavioralFindings?.becIndicators || []).join(', ')}<br />
                Target: {inv.behavioralFindings?.impersonationTarget}<br />
                {inv.behavioralFindings?.contextualNotes}
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>G. Threat Intelligence Matches</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {(inv.threatIntelFindings?.providerMatches || []).map((m, i) => (
                  <div key={i} style={{ marginBottom: 4 }}>
                    <strong>{m.provider}:</strong> <span style={{ color: '#ef4444' }}>{m.reputation}</span> ({m.matchDetails})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 5: ML Findings (MODEL PREDICTION) */}
      <Card title="5. ML Model Predictions (PROBABILISTIC INFERENCE)" style={{ marginBottom: '1.75rem' }}>
        <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8, padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#6d28d9' }}>
              <Cpu size={18} />
              <span>Model Prediction: {inv.mlFindings?.predictionLabel}</span>
            </div>
            <ProvenanceBadge provenance="MODEL_PREDICTION" size="medium" />
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
            Model Confidence: <strong>{((inv.mlFindings?.confidenceScore || 0) * 100).toFixed(0)}%</strong> | Engine Version: <code>{inv.mlFindings?.modelVersion}</code>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Model-Derived Features (Inference Outputs):</strong>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.35rem' }}>
              {(inv.mlFindings?.derivedFeatures || []).map((feat, idx) => (
                <li key={idx} style={{ marginBottom: 2 }}>{feat}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Section 6, 7, 8, 9: Links to Evidence, Timeline, Infrastructure, Case */}
      <div className="grid-4">
        <Link to={`/security/evidence/${inv.id}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', height: '100%' }}>
          <FileCode size={20} style={{ color: 'var(--accent-cyan)', marginBottom: 6 }} />
          <strong style={{ fontSize: '0.875rem' }}>Evidence Vault</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>View raw hashes & immutable headers</span>
        </Link>

        <Link to={`/security/timeline/${inv.id}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', height: '100%' }}>
          <Clock size={20} style={{ color: '#f59e0b', marginBottom: 6 }} />
          <strong style={{ fontSize: '0.875rem' }}>Attack Timeline</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Chronological gateway audit sequence</span>
        </Link>

        <Link to={`/security/infrastructure/${inv.id}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', height: '100%' }}>
          <Globe size={20} style={{ color: '#38bdf8', marginBottom: 6 }} />
          <strong style={{ fontSize: '0.875rem' }}>Infrastructure Context</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Origin IP & approximate region</span>
        </Link>

        <Link to={`/security/cases/${inv.forensicCase?.caseId || 'case-1092'}`} className="ui-btn ui-btn-outline" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '1rem', height: '100%' }}>
          <FolderLock size={20} style={{ color: '#8b5cf6', marginBottom: 6 }} />
          <strong style={{ fontSize: '0.875rem' }}>Forensic Case File</strong>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Incident response case #{inv.forensicCase?.caseId || 'case-1092'}</span>
        </Link>
      </div>
    </div>
  );
}

export default SecurityInvestigationDetail;
