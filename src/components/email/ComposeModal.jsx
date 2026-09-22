import React, { useState } from 'react';
import { 
  X, Send, ShieldAlert, CheckCircle2, AlertTriangle, 
  ArrowUpRight, Sparkles, Terminal, Globe, Paperclip, Link2, RefreshCw 
} from 'lucide-react';
import { api } from '../../services/api';

const DEMO_PRESETS = [
  {
    id: 'tor-phish',
    label: '🛑 Tor Phishing Attack',
    badge: 'Tor Exit Node • Critical',
    data: {
      from: 'PayPal Security <security-team@paypa1-verify.de>',
      to: 'raghav@mailtrace.ai',
      subject: 'URGENT: PayPal Account Restricted - Verify Identity Immediately',
      body: 'Dear Customer,\n\nWe detected unauthorized login attempts from an untrusted device. Your account has been temporarily restricted.\n\nPlease verify your login credentials within 24 hours at http://185.220.101.5/auth/verify to avoid permanent suspension.\n\nPayPal Security Operations',
      url: 'http://185.220.101.5/auth/verify',
      attachment: '',
      ip: '185.220.101.5',
      auth: 'spf=fail dkim=fail dmarc=fail',
    },
  },
  {
    id: 'ceo-bec',
    label: '💼 CEO Wire Fraud (BEC)',
    badge: 'Impersonation • Urgent',
    data: {
      from: 'Satya Nadella <ceo-office@microsoft-corporate-portal.is>',
      to: 'finance-lead@mailtrace.ai',
      subject: 'Confidential Request: Wire Transfer Authorization ($48,500)',
      body: 'Hi Raghav,\n\nI am currently attending an off-site confidential acquisition committee meeting. We need an urgent wire transfer of $48,500 settled before end-of-day.\n\nPlease process funds immediately to the beneficiary account. Do not call my cell phone as I cannot take calls during the session.\n\nRegards,\nSatya Nadella',
      url: '',
      attachment: '',
      ip: '194.26.29.112',
      auth: 'spf=fail dkim=none dmarc=fail',
    },
  },
  {
    id: 'ransomware',
    label: '☣️ Ransomware Invoice',
    badge: 'Malware Payload • Critical',
    data: {
      from: 'Cloud Billing <billing-dept@spoofed-host-relay.nl>',
      to: 'accounts-payable@mailtrace.ai',
      subject: 'FINAL NOTICE: Overdue Cloud Infrastructure Invoice #99218',
      body: 'Your enterprise cloud cluster has overdue unpaid invoices totaling $12,450. Please find the attached itemized bill.\n\nFailure to resolve this by end-of-week will result in immediate termination of all virtual instances.\n\nAccounts Receivable',
      url: '',
      attachment: 'overdue_invoice_oct2026.pdf.exe',
      ip: '193.142.146.33',
      auth: 'spf=none dkim=none dmarc=none',
    },
  },
  {
    id: 'safe-corporate',
    label: '✅ Clean Business Mail',
    badge: 'Safe • Pass',
    data: {
      from: 'Raghav Sharma <raghav@mailtrace.ai>',
      to: 'evaluators@hackathon-sih.gov.in',
      subject: 'MailTrace-AI System Architecture & Pre-Delivery Forensics Specification',
      body: 'Hi Technical Evaluation Committee,\n\nPlease find our submission overview for SIH 2026 (PS 26106). MailTrace-AI implements 6 parallel analyzer engines, pre-delivery policy enforcement, SHA-256 evidence sealing, and live interactive infrastructure mapping.\n\nBest regards,\nRaghav Sharma\nLead Architect, MailTrace-AI',
      url: '',
      attachment: 'MailTrace_Architecture_v1.0.pdf',
      ip: '103.21.244.0',
      auth: 'spf=pass dkim=pass dmarc=pass',
    },
  },
];

export function ComposeModal({ isOpen, onClose, onEmailSent }) {
  const [activePreset, setActivePreset] = useState(null);
  const [formData, setFormData] = useState({
    from: 'raghav@mailtrace.ai',
    to: '',
    subject: '',
    body: '',
    url: '',
    attachment: '',
    ip: '127.0.0.1',
    auth: 'spf=pass dkim=pass dmarc=pass',
  });

  const [scanStep, setScanStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset) => {
    setActivePreset(preset.id);
    setFormData(preset.data);
    setScanResult(null);
    setErrorMsg(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.to || !formData.subject) {
      setErrorMsg('Please specify recipient and subject.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);
    setScanStep(1);

    const emailPayload = {
      message_id: `eml-live-${Date.now()}`,
      subject: formData.subject,
      sender: {
        address: formData.from.includes('<') 
          ? formData.from.split('<')[1].replace('>', '').trim() 
          : formData.from.trim(),
        name: formData.from.includes('<') 
          ? formData.from.split('<')[0].trim() 
          : formData.from.trim(),
      },
      recipients: [{ address: formData.to.trim(), name: 'Recipient' }],
      body_text_preview: formData.body,
      headers: {
        From: formData.from,
        To: formData.to,
        Subject: formData.subject,
        'Authentication-Results': formData.auth,
        Received: `from client-relay.net ([${formData.ip}]) by gateway.mailtrace.ai`,
        'X-MailTrace-Source': 'fono-compose',
      },
      mailbox_id: 'inbox',
      attachments: formData.attachment 
        ? [{ filename: formData.attachment, size_bytes: 2048, content_type: 'application/octet-stream' }] 
        : [],
      urls: formData.url ? [{ url: formData.url }] : [],
      received_hops: [
        { by: 'gateway.mailtrace.ai', from_host: 'client-relay.net', ip: formData.ip }
      ],
    };

    // Simulated stepped animation for realistic gateway inspection
    setTimeout(() => setScanStep(2), 350);
    setTimeout(() => setScanStep(3), 700);
    setTimeout(() => setScanStep(4), 1050);

    try {
      const response = await api.submitEmailForAnalysis(emailPayload);
      setTimeout(() => {
        setIsScanning(false);
        setScanResult({
          ...response,
          payload: emailPayload,
        });
        if (onEmailSent) {
          onEmailSent(response);
        }
      }, 1400);
    } catch (err) {
      setTimeout(() => {
        setIsScanning(false);
        setErrorMsg(err.message || 'Failed to submit email to gateway analysis engine.');
      }, 1200);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setIsScanning(false);
    setActivePreset(null);
    setFormData({
      from: 'raghav@mailtrace.ai',
      to: '',
      subject: '',
      body: '',
      url: '',
      attachment: '',
      ip: '127.0.0.1',
      auth: 'spf=pass dkim=pass dmarc=pass',
    });
  };

  return (
    <div className="compose-modal-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg-surface, #ffffff)',
        borderRadius: 12,
        width: '100%',
        maxWidth: 720,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        border: '1px solid var(--border-color, #e2e8f0)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-secondary, #f8fafc)',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan, #0284c7)'
            }}>
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Compose & Pre-Delivery Inspection Gateway
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                All outgoing and inbound emails are inspected in real time by 6 parallel AI engines.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="ui-btn ui-btn-ghost" 
            style={{ padding: '0.35rem', borderRadius: 6 }}
            aria-label="Close compose modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '1.25rem' }}>
          {/* Attack Presets Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ⚡ 1-Click Simulation Presets (SIH Demo):
              </span>
              {activePreset && (
                <button onClick={handleReset} style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Clear Preset
                </button>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    textAlign: 'left',
                    borderRadius: 8,
                    border: activePreset === preset.id ? '2px solid var(--accent-cyan, #0284c7)' : '1px solid var(--border-color, #e2e8f0)',
                    background: activePreset === preset.id ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg-primary, #ffffff)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {preset.label}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {preset.badge}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Scanning Animation Progress */}
          {isScanning && (
            <div style={{
              background: '#0f172a',
              borderRadius: 8,
              padding: '1.25rem',
              color: '#f8fafc',
              marginBottom: '1rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.8rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                <RefreshCw size={16} className="ui-spin" />
                <span>MailTrace Pre-Delivery Inspection Pipeline Active...</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ color: scanStep >= 1 ? '#4ade80' : '#64748b' }}>
                  {scanStep >= 1 ? '✓' : '○'} Step 1: Normalizing RFC 5322 Headers & Preserving SHA-256 Digest
                </div>
                <div style={{ color: scanStep >= 2 ? '#4ade80' : '#64748b' }}>
                  {scanStep >= 2 ? '✓' : '○'} Step 2: Evaluating SPF, DKIM, DMARC Authentication Records
                </div>
                <div style={{ color: scanStep >= 3 ? '#4ade80' : '#64748b' }}>
                  {scanStep >= 3 ? '✓' : '○'} Step 3: Querying GeoMapper BGP ASN & Tor Exit Node Database
                </div>
                <div style={{ color: scanStep >= 4 ? '#4ade80' : '#64748b' }}>
                  {scanStep >= 4 ? '✓' : '○'} Step 4: Running NLP BERT Intent Model & Heuristic Signal Correlator
                </div>
              </div>
            </div>
          )}

          {/* Result Alert Window */}
          {scanResult && (
            <div style={{
              padding: '1.25rem',
              borderRadius: 8,
              marginBottom: '1rem',
              background: scanResult.decision?.action === 'INBOX' || scanResult.classification === 'SAFE' 
                ? 'rgba(16, 185, 129, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${scanResult.decision?.action === 'INBOX' || scanResult.classification === 'SAFE' ? '#10b981' : '#ef4444'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {scanResult.decision?.action === 'INBOX' || scanResult.classification === 'SAFE' ? (
                    <CheckCircle2 size={24} style={{ color: '#10b981', flexShrink: 0 }} />
                  ) : (
                    <ShieldAlert size={24} style={{ color: '#ef4444', flexShrink: 0 }} />
                  )}
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {scanResult.decision?.action === 'INBOX' || scanResult.classification === 'SAFE'
                        ? '✅ Gateway Verdict: Cleared for Safe Delivery'
                        : '🚨 Pre-Delivery Gateway Intercepted Email!'}
                    </h4>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {scanResult.decision?.reason || 'Analysis complete.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 4,
                    background: scanResult.classification === 'SAFE' ? '#10b981' : '#ef4444',
                    color: '#ffffff',
                  }}>
                    {scanResult.classification} • Risk {scanResult.risk?.overall_risk_score || 0}/100
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 4,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                  }}>
                    ACTION: {scanResult.decision?.action || 'HOLD'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '0.75rem', flexWrap: 'wrap' }}>
                {scanResult.decision?.action !== 'INBOX' ? (
                  <a
                    href="http://localhost:5174/security/threats"
                    className="ui-btn ui-btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#4f46e5' }}
                  >
                    <span>Inspect Threat in Security SOC Portal (Port 5174)</span>
                    <ArrowUpRight size={14} />
                  </a>
                ) : (
                  <a
                    href="http://localhost:5173/fono/sent"
                    className="ui-btn ui-btn-primary"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#10b981', borderColor: '#10b981' }}
                  >
                    <CheckCircle2 size={14} />
                    <span>Delivered: View in Sent Mailbox</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="ui-btn ui-btn-outline"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '0.75rem', borderRadius: 6, background: '#fee2e2', color: '#b91c1c', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          {!scanResult && (
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    From (Sender):
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 6,
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.825rem',
                      background: 'var(--bg-primary, #ffffff)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    To (Recipient):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. target@company.com"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 6,
                      border: '1px solid var(--border-color, #cbd5e1)',
                      fontSize: '0.825rem',
                      background: 'var(--bg-primary, #ffffff)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Subject Line:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Subject of the email"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 6,
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '0.825rem',
                    background: 'var(--bg-primary, #ffffff)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  Email Message Body:
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type email body content..."
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: 6,
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '0.825rem',
                    background: 'var(--bg-primary, #ffffff)',
                    color: 'var(--text-primary)',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Advanced Threat Options Row */}
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                borderRadius: 6,
                padding: '0.75rem',
                border: '1px solid var(--border-color, #e2e8f0)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
              }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    <Globe size={13} /> Origin IP / Geolocation Simulation:
                  </label>
                  <input
                    type="text"
                    value={formData.ip}
                    onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: '0.775rem', fontFamily: 'monospace' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    <Link2 size={13} /> Embedded Suspicious Link (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="http://phishing-domain.com"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: '0.775rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.725rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                    <Paperclip size={13} /> Attachment Simulation (Optional):
                  </label>
                  <input
                    type="text"
                    placeholder="invoice_oct2026.pdf.exe"
                    value={formData.attachment}
                    onChange={(e) => setFormData({ ...formData, attachment: e.target.value })}
                    style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: '0.775rem' }}
                  />
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  className="ui-btn ui-btn-ghost"
                  style={{ fontSize: '0.825rem', padding: '0.45rem 0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScanning}
                  className="ui-btn ui-btn-primary"
                  style={{ fontSize: '0.825rem', padding: '0.45rem 1.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Send size={15} />
                  <span>{isScanning ? 'Inspecting...' : 'Send & Inspect through Gateway'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComposeModal;
