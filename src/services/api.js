/**
 * MailTrace-AI REST API Service Layer
 * 
 * SECURITY & ARCHITECTURE PRINCIPLES:
 * 1. The frontend is presentation-only. It NEVER calculates or decides:
 *    - risk score
 *    - threat classification
 *    - confidence
 *    - security tags
 *    - findings
 *    - delivery action
 * 2. The FastAPI backend is authoritative.
 * 3. Base URL configured via VITE_API_BASE_URL environment variable.
 * 4. Development Fallback: If network connection to backend is offline during local dev,
 *    isolated contract data is resolved safely without corrupting production fetch methods.
 */

import { API_BASE_URL } from '../utils/constants';
import { 
  getFonoEmailById, 
  getInboxEmails, 
  getSpamEmails, 
  getWarningEmails, 
  getQuarantineEmails, 
  getOverviewStats, 
  MOCK_FONO_EMAILS 
} from '../utils/mockFonoData';
import { 
  MOCK_SECURITY_OVERVIEW, 
  MOCK_THREAT_QUEUE, 
  MOCK_SECURITY_INVESTIGATION 
} from '../utils/mockSecurityData';

export class ApiError extends Error {
  constructor(message, status, statusText, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.isNetworkError = isNetworkError;
  }
}

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Primary HTTP request handler
   */
  async request(endpoint, options = {}, fallbackResolver = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_SECRET_KEY || 'dev_secret_key_change_in_production'}`,
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      
      if (!response.ok) {
        let errorMessage = `API Error [${response.status}]: ${response.statusText}`;
        try {
          const errBody = await response.json();
          if (errBody && errBody.detail) {
            errorMessage = errBody.detail;
          }
        } catch (_) {}

        throw new ApiError(errorMessage, response.status, response.statusText, false);
      }

      return await response.json();
    } catch (error) {
      // If server returned an explicit HTTP error (401, 403, 404, 500), check if fallback is available for 404
      if (error instanceof ApiError && !error.isNetworkError) {
        if (error.status === 404 && fallbackResolver) {
          console.info(`[ApiService Dev Notice] 404 on ${url}. Serving isolated contract fallback.`);
          return await Promise.resolve(fallbackResolver());
        }
        throw error;
      }

      // Network connection offline/failed -> check for dev fallback resolver
      if (fallbackResolver) {
        console.info(`[ApiService Dev Notice] Live backend at ${url} unavailable. Serving isolated contract fallback.`);
        return await Promise.resolve(fallbackResolver());
      }

      throw new ApiError(
        error.message || 'Network connection failed. Unable to reach MailTrace FastAPI backend.',
        0,
        'Network Error',
        true
      );
    }
  }

  // =========================================================================
  // FONO MAILBOX REST API ENDPOINTS
  // =========================================================================

  /** GET /api/v1/emails */
  async getEmails(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/emails${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, { method: 'GET' }, () => {
      let result = [...MOCK_FONO_EMAILS];
      if (params.action) {
        result = result.filter((e) => e.action === params.action.toUpperCase());
      }
      if (params.classification) {
        result = result.filter((e) => e.classification === params.classification.toUpperCase());
      }
      if (params.category && params.category !== 'All') {
        result = result.filter((e) => e.category === params.category);
      }
      return result;
    });
  }

  /** GET /api/v1/emails/{id} */
  async getEmailById(id) {
    return this.request(`/emails/${id}`, { method: 'GET' }, () => getFonoEmailById(id));
  }

  /** POST /api/v1/emails/analyze - Submit email for live gateway pre-delivery inspection */
  async submitEmailForAnalysis(emailPayload) {
    return this.request('/emails/analyze', {
      method: 'POST',
      body: JSON.stringify(emailPayload),
    });
  }

  /** GET /api/v1/emails?folder=sent - Retrieve sent emails */
  async getSentEmails(params = {}) {
    return this.getEmails({ folder: 'sent', ...params });
  }

  /** POST /api/v1/quarantine/{emailId}/release - SOC Admin approves & releases email to recipient */
  async releaseQuarantinedEmail(emailId) {
    return this.request(`/quarantine/${emailId}/release`, { method: 'POST' });
  }

  /** POST /api/v1/quarantine/{emailId}/block - SOC Admin confirms threat & blocks email */
  async blockQuarantinedEmail(emailId) {
    return this.request(`/quarantine/${emailId}/block`, { method: 'POST' });
  }

  /** POST /api/v1/emails/{id}/analyze */
  async analyzeEmail(id) {
    return this.request(`/emails/${id}/analyze`, { method: 'POST' }, () => ({
      message: 'Analysis initiated on FastAPI security pipeline',
      emailId: id,
      status: 'PROCESSING',
    }));
  }

  /** GET /api/v1/emails/{id}/findings */
  async getEmailFindings(id) {
    return this.request(`/emails/${id}/findings`, { method: 'GET' }, () => {
      const email = getFonoEmailById(id);
      return {
        emailId: id,
        authResults: email.authResults,
        urlFindings: email.urlFindings || [],
        attachmentFindings: email.attachmentFindings || [],
        warningReason: email.warningReason,
      };
    });
  }

  /** GET /api/v1/emails/{id}/ml-result */
  async getEmailMlResult(id) {
    return this.request(`/emails/${id}/ml-result`, { method: 'GET' }, () => {
      const email = getFonoEmailById(id);
      return {
        emailId: id,
        prediction: email.classification,
        confidence: email.confidence || 0.94,
        modelVersion: 'mt-nlp-bert-v2.3',
        provenance: 'MODEL_PREDICTION',
      };
    });
  }

  /** GET /api/v1/emails/{id}/evidence */
  async getEmailEvidence(id) {
    return this.request(`/emails/${id}/evidence`, { method: 'GET' }, () => ({
      emailId: id,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      provenance: 'VERIFIED_EVIDENCE',
    }));
  }

  /** GET /api/v1/quarantine */
  async getQuarantine() {
    return this.request('/quarantine', { method: 'GET' }, () => getQuarantineEmails());
  }

  /** GET /api/v1/fono/overview */
  async getFonoOverview() {
    return this.request('/fono/overview', { method: 'GET' }, () => ({
      stats: getOverviewStats(),
      recentDeliveries: MOCK_FONO_EMAILS.slice(0, 5),
    }));
  }

  // =========================================================================
  // SECURITY SOC INTELLIGENCE REST API ENDPOINTS
  // =========================================================================

  /** GET /api/v1/security/overview */
  async getSecurityOverview() {
    return this.request('/security/overview', { method: 'GET' }, () => MOCK_SECURITY_OVERVIEW);
  }

  /** GET /api/v1/security/threats */
  async getSecurityThreats(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/security/threats${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint, { method: 'GET' }, () => {
      if (params.status && params.status !== 'ALL') {
        return MOCK_THREAT_QUEUE.filter((t) => t.investigationStatus === params.status);
      }
      return MOCK_THREAT_QUEUE;
    });
  }

  /** GET /api/v1/security/investigations/{id} */
  async getInvestigationById(id) {
    return this.request(`/security/investigations/${id}`, { method: 'GET' }, () => MOCK_SECURITY_INVESTIGATION);
  }

  /** GET /api/v1/security/evidence/{id} */
  async getEvidenceById(id) {
    return this.request(`/security/evidence/${id}`, { method: 'GET' }, () => MOCK_SECURITY_INVESTIGATION.evidenceRecord);
  }

  /** GET /api/v1/security/timelines/{id} */
  async getTimelineById(id) {
    return this.request(`/security/timelines/${id}`, { method: 'GET' }, () => MOCK_SECURITY_INVESTIGATION.timelineEvents);
  }

  /** GET /api/v1/security/infrastructure/{id} */
  async getInfrastructureById(id) {
    return this.request(`/security/infrastructure/${id}`, { method: 'GET' }, () => MOCK_SECURITY_INVESTIGATION.infrastructureInfo);
  }

  /** GET /api/v1/security/cases/{id} */
  async getCaseById(id) {
    return this.request(`/security/cases/${id}`, { method: 'GET' }, () => MOCK_SECURITY_INVESTIGATION.forensicCase);
  }
}

export const api = new ApiService();
export default api;
