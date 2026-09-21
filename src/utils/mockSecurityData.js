/**
 * Mock Backend Data Contracts for Security SOC Intelligence Dashboard
 * 
 * IMPORTANT SECURITY RULE:
 * The frontend NEVER calculates or determines classification, risk score, confidence,
 * security tags, findings, or delivery action.
 * All of these data objects represent authoritative outputs returned from the FastAPI backend.
 */

export const MOCK_SECURITY_OVERVIEW = {
  activeThreatsCount: 18,
  scannedCount: 1420,
  quarantinedCount: 7,
  openCasesCount: 3,
  
  // Threat Classification Distribution
  classificationsBreakdown: {
    MALICIOUS: 7,
    SUSPICIOUS: 11,
    SPAM: 45,
    SAFE: 1350,
    UNKNOWN: 7,
  },

  // Risk Score Distribution
  riskDistribution: [
    { label: 'Low (0-30)', count: 1350, color: '#10b981' },
    { label: 'Moderate (31-60)', count: 45, color: '#f59e0b' },
    { label: 'High (61-85)', count: 11, color: '#f97316' },
    { label: 'Critical (86-100)', count: 14, color: '#ef4444' },
  ],

  // Analysis Engine Status
  engineStatuses: [
    { engine: 'Header & Authentication Engine', status: 'HEALTHY', latency: '12ms' },
    { engine: 'Domain & Reputation Engine', status: 'HEALTHY', latency: '24ms' },
    { engine: 'URL & Link Inspection Engine', status: 'HEALTHY', latency: '42ms' },
    { engine: 'Attachment & QR Scanner', status: 'HEALTHY', latency: '65ms' },
    { engine: 'ML NLP Phishing Model (v2.3)', status: 'HEALTHY', latency: '35ms' },
    { engine: 'Threat Intelligence Correlator', status: 'HEALTHY', latency: '18ms' },
  ],

  // Quarantine Activity
  recentQuarantineActivity: [
    { id: 'quar-901', subject: 'URGENT: Executive Wire Transfer Authorization', sender: 'ceo-office@microsft-security-verify.org', time: '12 mins ago', risk: 95 },
    { id: 'quar-902', subject: 'Invoice Payment Overdue Notice', sender: 'billing@spoofed-vendor-portal.net', time: '45 mins ago', risk: 91 },
    { id: 'quar-903', subject: 'Password Reset Required Immediately', sender: 'security@login-credential-update.com', time: '2 hours ago', risk: 96 },
  ],

  // Recent Security Events Feed
  recentEvents: [
    { id: 'evt-101', type: 'DMARC_REJECT_ENFORCED', detail: 'Envelope from microsft-security-verify.org failed DMARC policy (p=reject)', timestamp: '5 mins ago', severity: 'HIGH' },
    { id: 'evt-102', type: 'ML_HIGH_CONFIDENCE_PHISH', detail: 'NLP model flagged credential harvesting language with 0.96 confidence', timestamp: '18 mins ago', severity: 'HIGH' },
    { id: 'evt-103', type: 'TYPOSQUAT_DOMAIN_DETECTED', detail: 'Domain microsft-verify.com matches target brand Microsoft', timestamp: '34 mins ago', severity: 'MEDIUM' },
    { id: 'evt-104', type: 'QR_CODE_PAYLOAD_EXTRACTED', detail: 'Embedded QR code resolved to external login portal link', timestamp: '1 hour ago', severity: 'HIGH' },
  ]
};

export const MOCK_THREAT_QUEUE = [
  {
    id: 'thr-8901',
    emailId: 'fono-quar-401',
    subject: 'URGENT: Executive Board Direct Wire Transfer Request',
    sender: 'ceo-office@microsft-security-verify.org',
    senderName: 'CEO Office (Impersonated)',
    recipient: 'user@mailtrace.ai',
    classification: 'MALICIOUS',
    action: 'QUARANTINE',
    riskScore: 95,
    confidence: 0.97,
    tags: ['First-Time-Sender', 'New-Domain', 'DMARC-Fail', 'Credential-Request', 'Phishing'],
    provenance: 'DERIVED_ANALYSIS',
    timestamp: '2026-09-20T07:15:00Z',
    displayTime: '15 mins ago',
    investigationStatus: 'OPEN',
  },
  {
    id: 'thr-8902',
    emailId: 'fono-warn-301',
    subject: 'Action Required: Confirm your account security routing details',
    sender: 'security-notify@account-update-portal.net',
    senderName: 'Account Security Portal',
    recipient: 'user@mailtrace.ai',
    classification: 'SUSPICIOUS',
    action: 'WARN',
    riskScore: 72,
    confidence: 0.84,
    tags: ['First-Time-Sender', 'New-Domain', 'Credential-Request', 'Suspicious-URL'],
    provenance: 'MODEL_PREDICTION',
    timestamp: '2026-09-20T09:45:00Z',
    displayTime: '45 mins ago',
    investigationStatus: 'IN_REVIEW',
  },
  {
    id: 'thr-8903',
    emailId: 'fono-unk-501',
    subject: 'Internal System Notification: Relay Route Diagnostics',
    sender: 'sysadmin@internal-relay-hop-94.net',
    senderName: 'Relay Hop Diagnostics',
    recipient: 'user@mailtrace.ai',
    classification: 'UNKNOWN',
    action: 'HOLD',
    riskScore: 45,
    confidence: 0.50,
    tags: ['First-Time-Sender'],
    provenance: 'APPROXIMATE_INFO',
    timestamp: '2026-09-20T06:00:00Z',
    displayTime: '2 hours ago',
    investigationStatus: 'OPEN',
  },
  {
    id: 'thr-8904',
    emailId: 'fono-spam-201',
    subject: 'Special Offer: Upgrade your Cloud Infrastructure with 50% Off',
    sender: 'promotions@clouddeals-marketing.com',
    senderName: 'CloudDeals Marketing',
    recipient: 'user@mailtrace.ai',
    classification: 'SPAM',
    action: 'SPAM',
    riskScore: 28,
    confidence: 0.92,
    tags: ['First-Time-Sender', 'New-Domain'],
    provenance: 'DERIVED_ANALYSIS',
    timestamp: '2026-09-20T08:30:00Z',
    displayTime: '3 hours ago',
    investigationStatus: 'RESOLVED',
  },
];

export const MOCK_SECURITY_INVESTIGATION = {
  id: 'thr-8901',
  emailId: 'fono-quar-401',
  subject: 'URGENT: Executive Board Direct Wire Transfer Request',
  sender: 'ceo-office@microsft-security-verify.org',
  senderName: 'CEO Office (Impersonated)',
  recipient: 'finance-lead@company.org',
  timestamp: '2026-09-20T07:15:00Z',

  // Authoritative Risk Verdict
  riskInfo: {
    score: 95,
    confidence: 0.97,
    classification: 'MALICIOUS',
    action: 'QUARANTINE',
    verdictSummary: 'Authoritative backend decision: High-confidence BEC Phishing attack with malicious executable attachment and lookalike domain spoofing.',
  },

  // Authoritative Security Tags
  securityTags: [
    'First-Time-Sender',
    'New-Domain',
    'DMARC-Fail',
    'Credential-Request',
    'Suspicious-URL',
    'Phishing',
  ],

  // 1. Authentication Findings
  authFindings: {
    spf: { status: 'FAIL', detail: 'Sender IP 198.51.100.42 not included in SPF record for microsft-security-verify.org', provenance: 'VERIFIED_EVIDENCE' },
    dkim: { status: 'FAIL', detail: 'DKIM signature missing or invalid header alignment', provenance: 'VERIFIED_EVIDENCE' },
    dmarc: { status: 'FAIL', detail: 'DMARC alignment failed (Policy = reject, Action = Quarantine)', provenance: 'VERIFIED_EVIDENCE' },
  },

  // 2. Sender / Domain Findings
  domainFindings: {
    senderIdentity: 'unverified-external-relay',
    displayNameMismatch: true,
    displayNameDetail: 'Display Name "CEO Office" mismatches actual envelope domain microsft-security-verify.org',
    lookalikeDomain: true,
    lookalikeDetail: 'Domain microsft-security-verify.org is a visual lookalike of brand "Microsoft"',
    typosquatting: true,
    domainAge: '1 day (Created 2026-09-19)',
    domainReputationScore: 12,
    provenance: 'DERIVED_ANALYSIS',
  },

  // 3. URL Findings
  urlFindings: [
    {
      url: 'http://microsft-security-verify.org/login-portal',
      redirects: ['http://bit.ly/3x89q', 'http://microsft-security-verify.org/login-portal'],
      isShortUrl: true,
      isEncoded: false,
      reputation: 'MALICIOUS',
      domainMismatch: true,
      category: 'Credential Harvesting',
      provenance: 'DERIVED_ANALYSIS',
    }
  ],

  // 4. Attachment Findings
  attachmentFindings: [
    {
      filename: 'wire_authorization_invoice.exe',
      fileType: 'Win32 Executable (.exe)',
      fileSize: '4.8 MB',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      malwareVerdict: 'MALICIOUS',
      threatName: 'Trojan.Win32.Heuristic.PhishDrop',
      provenance: 'VERIFIED_EVIDENCE',
    }
  ],

  // 5. QR / Image Findings
  qrFindings: {
    qrDetected: true,
    extractedUrl: 'http://microsft-security-verify.org/qr-auth',
    imageSecurityFinding: 'Embedded QR code decodes to unverified external login endpoint.',
    provenance: 'DERIVED_ANALYSIS',
  },

  // 6. Behavioral & Contextual Findings
  behavioralFindings: {
    unusualBehavior: true,
    becIndicators: ['Urgency Language', 'Direct Financial Request', 'Executive Impersonation'],
    impersonationTarget: 'CEO / Executive Board',
    contextualNotes: 'Sender IP has 0 prior communication history with recipient finance-lead@company.org.',
    provenance: 'DERIVED_ANALYSIS',
  },

  // 7. Threat Intelligence Findings
  threatIntelFindings: {
    providerMatches: [
      { provider: 'VirusTotal TI Feed', reputation: 'MALICIOUS', matchDetails: '14/70 engines flagged URL as phishing' },
      { provider: 'AbuseIPDB Network Intelligence', reputation: 'SUSPICIOUS', matchDetails: 'IP 198.51.100.42 flagged 8 times in past 24h' }
    ],
    provenance: 'DERIVED_ANALYSIS',
  },

  // 8. ML Findings (PROBABILISTIC MODEL PREDICTIONS)
  mlFindings: {
    predictionLabel: 'PHISHING',
    confidenceScore: 0.97,
    modelVersion: 'mt-nlp-bert-v2.3 (Transformer Baseline)',
    derivedFeatures: [
      'High attention weight on financial transfer verbs ("wire", "urgent")',
      'NLP sentiment analysis returned elevated urgency & pressure metrics',
      'Structural HTML similarity match (94%) with known Microsoft phish template'
    ],
    provenance: 'MODEL_PREDICTION',
  },

  // 9. Preserved Evidence & Raw Records
  evidenceRecord: {
    evidenceId: 'ev-quar-9901',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    rawHeaderSnippet: `Received: from mail-out-4.suspicious-relay.net ([198.51.100.42]) by mx.mailtrace.gateway id mt-9823104; Sat, 20 Sep 2026 07:15:00 +0000\nAuthentication-Results: mx.mailtrace.gateway; dkim=fail; spf=fail; dmarc=fail (p=reject)`,
    provenance: 'VERIFIED_EVIDENCE',
  },

  // 10. Chronological Event Sequence
  timelineEvents: [
    { time: 'T+0ms', event: 'Email received at MailTrace SMTP Gateway', provenance: 'VERIFIED_EVIDENCE' },
    { time: 'T+12ms', event: 'Evidence captured & SHA-256 hash sealed', provenance: 'VERIFIED_EVIDENCE' },
    { time: 'T+24ms', event: 'Email body and headers normalized', provenance: 'DERIVED_ANALYSIS' },
    { time: 'T+38ms', event: 'Authentication analyzed (SPF FAIL, DKIM FAIL, DMARC FAIL)', provenance: 'VERIFIED_EVIDENCE' },
    { time: 'T+55ms', event: 'Domain analyzed (Lookalike brand match detected)', provenance: 'DERIVED_ANALYSIS' },
    { time: 'T+78ms', event: 'URL & QR code payload extracted and checked', provenance: 'DERIVED_ANALYSIS' },
    { time: 'T+92ms', event: 'Attachment sandbox scan completed (Malware Trojan detected)', provenance: 'VERIFIED_EVIDENCE' },
    { time: 'T+115ms', event: 'ML NLP model inference completed (Confidence: 0.97)', provenance: 'MODEL_PREDICTION' },
    { time: 'T+140ms', event: 'Security correlation engine generated Risk Score 95', provenance: 'DERIVED_ANALYSIS' },
    { time: 'T+155ms', event: 'Delivery Policy decision generated: QUARANTINE', provenance: 'DERIVED_ANALYSIS' },
    { time: 'T+160ms', event: 'Quarantine vault isolated message pre-delivery', provenance: 'VERIFIED_EVIDENCE' },
  ],

  // 11. Infrastructure Hop Information
  infrastructureInfo: {
    originIp: '198.51.100.42',
    asn: 'AS13335 (Cloudflare / Hosting Provider)',
    isp: 'Hosting Provider Networks',
    approximateRegion: 'Frankfurt Region, Germany',
    networkHops: [
      { hop: 1, ip: '198.51.100.42', host: 'mail-out-4.suspicious-relay.net' },
      { hop: 2, ip: '192.0.2.89', host: 'edge-hop-02.intermediate-node.org' },
    ],
    disclaimer: 'Approximate infrastructure location derived from available network/header evidence. It does not constitute proof of exact physical attacker location, sender identity, or criminal attribution.',
    provenance: 'APPROXIMATE_INFO',
  },

  // 12. Forensic Case Details
  forensicCase: {
    caseId: 'case-1092',
    status: 'OPEN',
    assignedAnalyst: 'SOC Lead Analyst (analyst@mailtrace.ai)',
    severity: 'CRITICAL',
    title: 'Executive Impersonation & Malicious Executable Campaign',
    createdTime: '2026-09-20T07:20:00Z',
    summary: 'Spear phishing attempt targeting finance department with lookalike domain spoofing and Trojan payload.',
  }
};

export function getSecurityInvestigation(id) {
  return MOCK_SECURITY_INVESTIGATION;
}
