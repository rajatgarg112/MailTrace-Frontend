/**
 * Mock Backend Data Contracts for Fono User Dashboard
 * 
 * IMPORTANT SECURITY RULE:
 * The frontend NEVER calculates or determines classification, risk score, confidence,
 * security tags, findings, or delivery action.
 * All of these data objects represent authoritative outputs returned from the backend API.
 */

export const MOCK_FONO_EMAILS = [
  // 1. SAFE Email
  {
    id: 'fono-safe-101',
    subject: 'Q4 Product Roadmap and Sprint Milestones',
    sender: 'alex.product@company.org',
    senderName: 'Alex Mercer (Product Lead)',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-20T10:15:00Z',
    displayTime: '10:15 AM',
    classification: 'SAFE',
    action: 'INBOX',
    unread: true,
    riskScore: 5,
    confidence: 0.99,
    tags: ['First-Time-Sender', 'DMARC-Pass'],
    provenance: 'VERIFIED_EVIDENCE',
    bodyHtml: `<p>Hi Team,</p><p>Please review the updated Q4 product roadmap. All milestones for the pre-delivery security gateway integration are on track.</p><p>Best regards,<br/>Alex Mercer</p>`,
    attachments: [
      { name: 'roadmap_q4.pdf', size: '1.2 MB', type: 'application/pdf', safe: true }
    ],
    authResults: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
  },

  // 2. SPAM Email - Marketing Category
  {
    id: 'fono-spam-201',
    subject: 'Special Offer: Upgrade your Cloud Infrastructure with 50% Off',
    sender: 'promotions@clouddeals-marketing.com',
    senderName: 'CloudDeals Marketing',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-20T08:30:00Z',
    displayTime: '08:30 AM',
    classification: 'SPAM',
    action: 'SPAM',
    category: 'Marketing',
    unread: false,
    riskScore: 28,
    confidence: 0.92,
    tags: ['First-Time-Sender', 'New-Domain'],
    provenance: 'DERIVED_ANALYSIS',
    bodyHtml: `<p>Unsubscribe at any time. Get 50% off enterprise cloud nodes today only!</p>`,
    attachments: [],
    authResults: { spf: 'PASS', dkim: 'NONE', dmarc: 'PASS' },
  },

  // 3. SPAM Email - Phishing Presentation Category
  {
    id: 'fono-spam-202',
    subject: 'Weekly Digest: Top Tech News & Industry Updates',
    sender: 'newsletter@techdigest-daily.net',
    senderName: 'Tech Digest Daily',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-19T18:00:00Z',
    displayTime: 'Yesterday',
    classification: 'SPAM',
    action: 'SPAM',
    category: 'Social / Notifications',
    unread: false,
    riskScore: 32,
    confidence: 0.88,
    tags: ['First-Time-Sender'],
    provenance: 'DERIVED_ANALYSIS',
    bodyHtml: `<p>Here is your daily summary of tech stories...</p>`,
    attachments: [],
    authResults: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
  },

  // 4. SUSPICIOUS Email - Warning Access
  {
    id: 'fono-warn-301',
    subject: 'Action Required: Confirm your account security routing details',
    sender: 'security-notify@account-update-portal.net',
    senderName: 'Account Security Portal',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-20T09:45:00Z',
    displayTime: '09:45 AM',
    classification: 'SUSPICIOUS',
    action: 'WARN',
    unread: true,
    riskScore: 72,
    confidence: 0.84,
    tags: ['First-Time-Sender', 'New-Domain', 'Credential-Request', 'Suspicious-URL'],
    provenance: 'MODEL_PREDICTION',
    warningReason: 'Domain account-update-portal.net registered 2 days ago. Form requests login credentials over an unverified URL pattern.',
    bodyHtml: `<p>Dear user, please click the link below to confirm your login credentials immediately to avoid suspension.</p><p><a href="http://account-update-portal.net/login">http://account-update-portal.net/login</a></p>`,
    attachments: [],
    authResults: { spf: 'FAIL', dkim: 'NONE', dmarc: 'FAIL' },
    urlFindings: [
      { url: 'http://account-update-portal.net/login', risk: 'HIGH', category: 'Credential Harvesting' }
    ],
  },

  // 5. MALICIOUS / HIGH RISK Email - Quarantined
  {
    id: 'fono-quar-401',
    subject: 'URGENT: Executive Board Direct Wire Transfer Request',
    sender: 'ceo-office@microsft-security-verify.org',
    senderName: 'CEO Office (Impersonated)',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-20T07:15:00Z',
    displayTime: '07:15 AM',
    classification: 'MALICIOUS',
    action: 'QUARANTINE',
    unread: true,
    riskScore: 95,
    confidence: 0.97,
    tags: ['First-Time-Sender', 'New-Domain', 'DMARC-Fail', 'Credential-Request', 'Phishing'],
    provenance: 'DERIVED_ANALYSIS',
    warningReason: 'High-confidence BEC / Phishing threat. Header spoofing microsft-security-verify.org with fake executive wire request.',
    // Original body suppressed by gateway policy
    bodyHtml: null,
    attachments: [
      { name: 'wire_authorization_invoice.exe', size: '4.8 MB', type: 'application/x-msdownload', safe: false, threat: 'Trojan.Win32.Heuristic' }
    ],
    authResults: { spf: 'FAIL', dkim: 'FAIL', dmarc: 'FAIL' },
    urlFindings: [
      { url: 'http://microsft-security-verify.org/fake-login', risk: 'CRITICAL', category: 'Malicious Phishing' }
    ],
    attachmentFindings: [
      { filename: 'wire_authorization_invoice.exe', verdict: 'MALICIOUS', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' }
    ],
    forensicSummary: 'Originating IP 198.51.100.42 failed DMARC alignment. Lookalike domain registered 1 day prior. Contains executable payload disguised as invoice PDF.',
    evidenceId: 'ev-quar-9901',
  },

  // 6. UNKNOWN Email
  {
    id: 'fono-unk-501',
    subject: 'Internal System Notification: Relay Route Diagnostics',
    sender: 'sysadmin@internal-relay-hop-94.net',
    senderName: 'Relay Hop Diagnostics',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-20T06:00:00Z',
    displayTime: '06:00 AM',
    classification: 'UNKNOWN',
    action: 'HOLD',
    unread: false,
    riskScore: 45,
    confidence: 0.50,
    tags: ['First-Time-Sender'],
    provenance: 'APPROXIMATE_INFO',
    warningReason: 'Unknown classification state from backend inspection. Sender reputation data insufficient.',
    bodyHtml: `<p>Diagnostics payload generated from hop 192.0.2.89.</p>`,
    attachments: [],
    authResults: { spf: 'NONE', dkim: 'NONE', dmarc: 'NONE' },
  },

  // 7. Edge Case: Extremely Long Subject Line
  {
    id: 'fono-edge-601',
    subject: 'IMPORTANT NOTICE REGARDING YOUR ANNUAL GLOBAL COMPLIANCE AUDIT AND DATA PRIVACY GOVERNANCE POLICY UPDATE FOR CALENDAR YEAR 2026 AND BEYOND - PLEASE REVIEW ALL ATTACHMENTS IMMEDIATELY',
    sender: 'compliance-committee-notifications@enterprise-global-audit-services.org',
    senderName: 'Global Enterprise Compliance Committee',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-19T14:20:00Z',
    displayTime: 'Yesterday',
    classification: 'SAFE',
    action: 'INBOX',
    unread: false,
    riskScore: 12,
    confidence: 0.94,
    tags: ['DMARC-Pass'],
    provenance: 'VERIFIED_EVIDENCE',
    bodyHtml: `<p>Please see the compliance documentation below.</p>`,
    attachments: [],
    authResults: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
  },

  // 8. Edge Case: Missing Optional Values (No Tags, 0 Attachments, Null Confidence)
  {
    id: 'fono-edge-603',
    subject: 'Quick Coffee Catchup',
    sender: 'colleague@company.org',
    senderName: 'Colleague',
    recipient: 'user@mailtrace.ai',
    timestamp: '2026-09-19T11:10:00Z',
    displayTime: 'Yesterday',
    classification: 'SAFE',
    action: 'INBOX',
    unread: false,
    riskScore: 0,
    confidence: null,
    tags: [],
    provenance: 'VERIFIED_EVIDENCE',
    bodyHtml: `<p>Hey, let us grab coffee at 3 PM today!</p>`,
    attachments: [],
    authResults: { spf: 'PASS', dkim: 'PASS', dmarc: 'PASS' },
  }
];

export const SPAM_CATEGORIES = [
  'All',
  'Marketing',
  'Education',
  'Social / Notifications',
  'Bulk',
  'Scam',
  'Fraud',
  'Phishing',
  'Suspicious',
  'Other',
];

export function getFonoEmailById(id) {
  return MOCK_FONO_EMAILS.find((e) => e.id === id) || MOCK_FONO_EMAILS[0];
}

export function getInboxEmails() {
  return MOCK_FONO_EMAILS.filter((e) => e.action === 'INBOX');
}

export function getSpamEmails(category = 'All') {
  const spamItems = MOCK_FONO_EMAILS.filter((e) => e.action === 'SPAM' || e.classification === 'SPAM');
  if (category === 'All') return spamItems;
  return spamItems.filter((e) => e.category === category);
}

export function getWarningEmails() {
  return MOCK_FONO_EMAILS.filter((e) => e.action === 'WARN' || e.action === 'HOLD' || e.classification === 'SUSPICIOUS' || e.classification === 'UNKNOWN');
}

export function getQuarantineEmails() {
  return MOCK_FONO_EMAILS.filter((e) => e.action === 'QUARANTINE' || e.classification === 'MALICIOUS');
}

export function getOverviewStats() {
  return {
    totalInspected: MOCK_FONO_EMAILS.length,
    inboxClean: getInboxEmails().length,
    unreadInbox: MOCK_FONO_EMAILS.filter((e) => e.action === 'INBOX' && e.unread).length,
    spamCount: MOCK_FONO_EMAILS.filter((e) => e.action === 'SPAM' || e.classification === 'SPAM').length,
    warningCount: getWarningEmails().length,
    quarantineCount: getQuarantineEmails().length,
  };
}
