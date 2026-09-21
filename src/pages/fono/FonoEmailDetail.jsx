import React, { useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Archive, Trash2, Mail, Star, Reply, ReplyAll, Forward, 
  ShieldCheck, ShieldAlert, AlertTriangle, Lock, Eye, EyeOff, Paperclip, 
  ChevronDown, ChevronUp, AlertOctagon, HelpCircle, CheckCircle2, Shield
} from 'lucide-react';
import StatusBadge from '../../components/ui/StatusBadge';
import SecurityTagList from '../../components/ui/SecurityTag';
import ProvenanceBadge from '../../components/ui/ProvenanceBadge';
import RiskIndicator from '../../components/ui/RiskIndicator';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { api } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export function FonoEmailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchDetail = useCallback(() => api.getEmailById(id), [id]);
  const { data: email, loading, error, refetch } = useApi(fetchDetail, [id]);

  // State for Controlled View toggle on SUSPICIOUS emails
  const [revealControlledView, setRevealControlledView] = useState(false);
  // State for toggling security metadata panel
  const [showSecurityMeta, setShowSecurityMeta] = useState(false);
  // Starred state
  const [isStarred, setIsStarred] = useState(false);

  if (loading) {
    return <LoadingState message={`Loading email message [${id}]...`} />;
  }

  if (error || !email) {
    return (
      <ErrorState
        title="Email Loading Failed"
        description={error?.message || `Failed to fetch email payload for ID ${id}.`}
        onRetry={refetch}
      />
    );
  }

  const classification = (email.classification || 'UNKNOWN').toUpperCase();
  const isMalicious = classification === 'MALICIOUS' || email.action === 'QUARANTINE' || email.riskScore > 85;
  const isSuspicious = classification === 'SUSPICIOUS' || email.action === 'WARN';
  const isSpam = classification === 'SPAM' || email.action === 'SPAM';
  const isUnknown = classification === 'UNKNOWN';
  const isSafe = classification === 'SAFE' && email.action === 'INBOX';

  const sanitizedBody = sanitizeHtml(email.bodyHtml || email.bodyText || '');

  // Helper for sender initials avatar
  const senderDisplayName = email.senderName || email.sender || 'Unknown';
  const getInitials = (name) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div className="email-detail-toolbar" style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0.65rem 0.5rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            onClick={() => navigate('/fono/inbox')} 
            className="ui-btn ui-btn-ghost" 
            style={{ fontSize: '0.85rem', padding: '0.35rem 0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Inbox</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button className="email-action-btn" title="Archive" onClick={() => alert('Email archived')}>
            <Archive size={16} />
          </button>
          <button className="email-action-btn" title="Delete" onClick={() => { alert('Email deleted'); navigate('/fono/inbox'); }}>
            <Trash2 size={16} />
          </button>
          <button className="email-action-btn" title="Mark Unread" onClick={() => alert('Marked as unread')}>
            <Mail size={16} />
          </button>
          <button 
            className="email-action-btn" 
            title={isStarred ? 'Unstar' : 'Star'} 
            onClick={() => setIsStarred(!isStarred)}
          >
            <Star size={16} style={{ color: isStarred ? '#eab308' : 'currentColor', fill: isStarred ? '#eab308' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Email Subject Line & Badges */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.3 }}>
            {email.subject}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <StatusBadge type="classification" value={email.classification} />
          <StatusBadge type="action" value={email.action} />
          <ProvenanceBadge provenance={email.provenance} size="medium" />
        </div>
      </div>

      {/* Sender Header Box */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: '1rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            {getInitials(senderDisplayName)}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                {email.senderName || senderDisplayName}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                &lt;{email.sender}&gt;
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              To: {email.recipient || 'me'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {email.timestamp || email.displayTime}
          </span>
          <button 
            onClick={() => setShowSecurityMeta(!showSecurityMeta)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 6,
              padding: '0.35rem 0.65rem',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: 'var(--accent-blue)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Shield size={14} />
            <span>{showSecurityMeta ? 'Hide Security Info' : 'Security Analysis'}</span>
            {showSecurityMeta ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Security Banner / Protection Alert */}
      {isMalicious && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          color: '#991b1b',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            <Lock size={18} />
            <span>Harmful Content Protection: Original Body & Media Suppressed</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5, margin: 0, color: '#991b1b' }}>
            This email was classified as <strong>MALICIOUS</strong> by the pre-delivery gateway engine. Original HTML content, remote images, and dangerous attachments have been suppressed to protect your system.
          </p>
        </div>
      )}

      {isSuspicious && (
        <div style={{
          background: '#fff7ed',
          border: '1px solid #fed7aa',
          borderRadius: 8,
          padding: '1rem 1.25rem',
          color: '#c2410c',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                <AlertTriangle size={18} />
                <span>Security Warning: Suspicious Email Access Restricted</span>
              </div>
              <p style={{ fontSize: '0.825rem', margin: 0, color: '#9a3412' }}>
                Reason: {email.warningReason || 'Domain registered recently with unverified links.'}
              </p>
            </div>
            <button
              onClick={() => setRevealControlledView(!revealControlledView)}
              className="ui-btn ui-btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              {revealControlledView ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{revealControlledView ? 'Hide Controlled View' : 'Proceed to Controlled View'}</span>
            </button>
          </div>
        </div>
      )}

      {isSpam && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 8,
          padding: '0.85rem 1.15rem',
          color: '#b45309',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ fontSize: '0.85rem' }}>
            <strong>Spam Notice:</strong> Categorized as <strong>{email.category || 'Marketing'}</strong> spam.
          </div>
          <button onClick={() => alert('Marked as Not Spam')} className="ui-btn ui-btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            Mark Not Spam
          </button>
        </div>
      )}

      {isSafe && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.06)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: 8,
          padding: '0.65rem 1rem',
          fontSize: '0.8rem',
          color: '#059669',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} />
          <span>Verified Safe by MailTrace Pre-Delivery Security Gateway</span>
        </div>
      )}

      {/* Collapsible Security Analysis Metadata Panel */}
      {showSecurityMeta && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--accent-blue)',
          borderRadius: 8,
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} style={{ color: 'var(--accent-blue)' }} />
            <span>MailTrace Pre-Delivery Security Analysis Details</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Threat Verdict</div>
              <StatusBadge type="classification" value={email.classification} />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Delivery Action</div>
              <StatusBadge type="action" value={email.action} />
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Risk Score</div>
              <RiskIndicator score={email.riskScore} confidence={email.confidence} size="small" />
            </div>
          </div>

          {/* Security Tags */}
          {email.tags && email.tags.length > 0 && (
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Security Tags:</div>
              <SecurityTagList tags={email.tags} size="small" />
            </div>
          )}

          {/* Authentication Flags */}
          <div style={{ padding: '0.75rem', background: 'var(--bg-primary)', borderRadius: 6, border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
            <strong>Authentication Verification:</strong> SPF: <span style={{ color: email.authResults?.spf === 'PASS' ? '#10b981' : '#ef4444' }}>{email.authResults?.spf || 'NONE'}</span> | DKIM: <span style={{ color: email.authResults?.dkim === 'PASS' ? '#10b981' : '#f59e0b' }}>{email.authResults?.dkim || 'NONE'}</span> | DMARC: <span style={{ color: email.authResults?.dmarc === 'PASS' ? '#10b981' : '#ef4444' }}>{email.authResults?.dmarc || 'NONE'}</span>
          </div>
        </div>
      )}

      {/* Main Email Body Card (Primary Focus) */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 8,
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        minHeight: '280px',
      }}>
        {isMalicious ? (
          /* Sanitized Security Report for Malicious Emails */
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Sanitized Security Report
            </div>

            <div style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              <p><strong>Forensic Evidence Summary:</strong> {email.forensicSummary || 'Preserved evidence log mt-quar-payload registered by gateway.'}</p>

              {email.urlFindings && email.urlFindings.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Blocked Malicious URLs:</strong>
                  <ul style={{ marginTop: '0.35rem', paddingLeft: '1.25rem' }}>
                    {email.urlFindings.map((u, idx) => (
                      <li key={idx} style={{ color: '#ef4444', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {u.url} ({u.category})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : isSuspicious && !revealControlledView ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Lock size={32} style={{ color: '#f97316', marginBottom: '0.75rem' }} />
            <p style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>Controlled Access Mode Active. Message body is hidden for security.</p>
            <button
              onClick={() => setRevealControlledView(true)}
              className="ui-btn ui-btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Reveal Controlled View
            </button>
          </div>
        ) : (
          /* Clean / Controlled Body View */
          <div 
            style={{ 
              fontSize: '0.925rem', 
              lineHeight: 1.65, 
              color: 'var(--text-primary)',
              wordBreak: 'break-word',
            }}
            dangerouslySetInnerHTML={{ __html: sanitizedBody || '<p>No body content available.</p>' }}
          />
        )}
      </div>

      {/* Attachments Section */}
      {email.attachments && email.attachments.length > 0 && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 8,
          padding: '1.25rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Paperclip size={16} />
            <span>Attachments ({email.attachments.length})</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {email.attachments.map((att, idx) => (
              <div 
                key={idx} 
                style={{
                  padding: '0.75rem',
                  background: 'var(--bg-primary)',
                  borderRadius: 6,
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                }}
              >
                <Paperclip size={18} style={{ color: isMalicious ? '#ef4444' : 'var(--accent-blue)', flexShrink: 0 }} />
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {att.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {att.size} {isMalicious && <span style={{ color: '#ef4444', fontWeight: 600 }}>• BLOCKED</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Quick Reply / Forward Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => alert('Reply dialog opened')} 
          className="ui-btn ui-btn-outline" 
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Reply size={15} />
          <span>Reply</span>
        </button>

        <button 
          onClick={() => alert('Reply All dialog opened')} 
          className="ui-btn ui-btn-outline" 
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ReplyAll size={15} />
          <span>Reply All</span>
        </button>

        <button 
          onClick={() => alert('Forward dialog opened')} 
          className="ui-btn ui-btn-outline" 
          style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Forward size={15} />
          <span>Forward</span>
        </button>
      </div>
    </div>
  );
}

export default FonoEmailDetail;

