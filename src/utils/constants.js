/**
 * MailTrace-AI Constants & Route Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const APP_MODE = import.meta.env.VITE_APP_MODE || 'user';
export const IS_USER_APP = APP_MODE === 'user';
export const IS_SECURITY_APP = APP_MODE === 'security';
export const USER_APP_URL = import.meta.env.VITE_USER_APP_URL || 'http://localhost:5173';
export const SECURITY_APP_URL = import.meta.env.VITE_SECURITY_APP_URL || 'http://localhost:5174';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  
  // Fono User Dashboard
  FONO: {
    OVERVIEW: '/fono',
    INBOX: '/fono/inbox',
    SPAM: '/fono/spam',
    WARNINGS: '/fono/warnings',
    QUARANTINE: '/fono/quarantine',
    EMAIL_DETAIL: (id = ':id') => `/fono/email/${id}`,
    PROFILE: '/fono/profile',
  },

  // Security SOC Dashboard
  SECURITY: {
    OVERVIEW: '/security',
    THREAT_QUEUE: '/security/threats',
    INVESTIGATION: '/security/investigation',
    INVESTIGATION_DETAIL: (id = ':id') => `/security/investigation/${id}`,
    EVIDENCE: '/security/evidence',
    EVIDENCE_DETAIL: (id = ':id') => `/security/evidence/${id}`,
    TIMELINE: '/security/timeline',
    TIMELINE_DETAIL: (id = ':id') => `/security/timeline/${id}`,
    INFRASTRUCTURE: '/security/infrastructure',
    INFRASTRUCTURE_DETAIL: (id = ':id') => `/security/infrastructure/${id}`,
    FORENSIC_CASES: '/security/cases',
    CASE_DETAIL: (id = ':id') => `/security/cases/${id}`,
  },
};

export const THREAT_CLASSIFICATIONS = {
  SAFE: 'SAFE',
  SPAM: 'SPAM',
  SUSPICIOUS: 'SUSPICIOUS',
  MALICIOUS: 'MALICIOUS',
  UNKNOWN: 'UNKNOWN',
};

export const DELIVERY_ACTIONS = {
  INBOX: 'INBOX',
  SPAM: 'SPAM',
  WARN: 'WARN',
  HOLD: 'HOLD',
  QUARANTINE: 'QUARANTINE',
  REJECT: 'REJECT',
};

export const DATA_PROVENANCE = {
  VERIFIED_EVIDENCE: 'Verified Evidence',
  DERIVED_ANALYSIS: 'Derived Analysis',
  APPROXIMATE_INFO: 'Approximate Information',
  MODEL_PREDICTION: 'Model Prediction',
};

export const SECURITY_TAGS = [
  'First-Time-Sender',
  'New-Domain',
  'DMARC-Fail',
  'Credential-Request',
  'Suspicious-URL',
  'Phishing',
];

export const FONO_NAV_ITEMS = [
  { label: 'Overview', path: ROUTES.FONO.OVERVIEW, icon: 'LayoutDashboard' },
  { label: 'Inbox', path: ROUTES.FONO.INBOX, icon: 'Inbox' },
  { label: 'Spam', path: ROUTES.FONO.SPAM, icon: 'Archive' },
  { label: 'Warnings', path: ROUTES.FONO.WARNINGS, icon: 'AlertTriangle' },
  { label: 'Quarantine', path: ROUTES.FONO.QUARANTINE, icon: 'ShieldAlert' },
  { label: 'Profile', path: ROUTES.FONO.PROFILE, icon: 'User' },
];

export const SECURITY_NAV_ITEMS = [
  { label: 'Overview', path: ROUTES.SECURITY.OVERVIEW, icon: 'ShieldCheck' },
  { label: 'Threat Queue', path: ROUTES.SECURITY.THREAT_QUEUE, icon: 'Activity' },
  { label: 'Investigation', path: ROUTES.SECURITY.INVESTIGATION, icon: 'Search' },
  { label: 'Evidence', path: ROUTES.SECURITY.EVIDENCE, icon: 'FileCode' },
  { label: 'Timeline', path: ROUTES.SECURITY.TIMELINE, icon: 'Clock' },
  { label: 'Infrastructure', path: ROUTES.SECURITY.INFRASTRUCTURE, icon: 'Globe' },
  { label: 'Forensic Cases', path: ROUTES.SECURITY.FORENSIC_CASES, icon: 'FolderLock' },
];

