import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, Inbox, Archive, PauseCircle, ShieldAlert, XCircle } from 'lucide-react';

/**
 * StatusBadge Component
 * 
 * Visually distinguishes:
 * 1. Threat Classification (SAFE, SPAM, SUSPICIOUS, MALICIOUS, UNKNOWN)
 * 2. Delivery Action (INBOX, SPAM, WARN, HOLD, QUARANTINE, REJECT)
 * 
 * CRITICAL RULE: UNKNOWN must remain UNKNOWN and never default to SAFE.
 */
export function StatusBadge({ type = 'classification', value = 'UNKNOWN', showIcon = true, className = '', ...props }) {
  const normalizedValue = (value || 'UNKNOWN').toUpperCase();

  if (type === 'classification') {
    let styleClass = 'status-classification-unknown';
    let IconComponent = HelpCircle;
    let label = 'UNKNOWN';

    switch (normalizedValue) {
      case 'SAFE':
        styleClass = 'status-classification-safe';
        IconComponent = ShieldCheck;
        label = 'SAFE';
        break;
      case 'SPAM':
        styleClass = 'status-classification-spam';
        IconComponent = Archive;
        label = 'SPAM';
        break;
      case 'SUSPICIOUS':
        styleClass = 'status-classification-suspicious';
        IconComponent = AlertTriangle;
        label = 'SUSPICIOUS';
        break;
      case 'MALICIOUS':
        styleClass = 'status-classification-malicious';
        IconComponent = AlertOctagon;
        label = 'MALICIOUS';
        break;
      case 'UNKNOWN':
      default:
        styleClass = 'status-classification-unknown';
        IconComponent = HelpCircle;
        label = 'UNKNOWN';
        break;
    }

    return (
      <span className={`status-badge status-badge-classification ${styleClass} ${className}`} title={`Threat Classification: ${label}`} {...props}>
        {showIcon && <IconComponent size={13} className="status-badge-icon" />}
        <span className="status-badge-text">{label}</span>
      </span>
    );
  }

  // Delivery Action
  let actionStyleClass = 'status-action-hold';
  let ActionIcon = PauseCircle;
  let actionLabel = 'HOLD';

  switch (normalizedValue) {
    case 'INBOX':
      actionStyleClass = 'status-action-inbox';
      ActionIcon = Inbox;
      actionLabel = 'ACTION: INBOX';
      break;
    case 'SPAM':
      actionStyleClass = 'status-action-spam';
      ActionIcon = Archive;
      actionLabel = 'ACTION: SPAM';
      break;
    case 'WARN':
      actionStyleClass = 'status-action-warn';
      ActionIcon = AlertTriangle;
      actionLabel = 'ACTION: WARN';
      break;
    case 'HOLD':
      actionStyleClass = 'status-action-hold';
      ActionIcon = PauseCircle;
      actionLabel = 'ACTION: HOLD';
      break;
    case 'QUARANTINE':
      actionStyleClass = 'status-action-quarantine';
      ActionIcon = ShieldAlert;
      actionLabel = 'ACTION: QUARANTINE';
      break;
    case 'REJECT':
      actionStyleClass = 'status-action-reject';
      ActionIcon = XCircle;
      actionLabel = 'ACTION: REJECT';
      break;
    default:
      actionStyleClass = 'status-action-hold';
      ActionIcon = PauseCircle;
      actionLabel = `ACTION: ${normalizedValue}`;
      break;
  }

  return (
    <span className={`status-badge status-badge-action ${actionStyleClass} ${className}`} title={`Delivery Action: ${actionLabel}`} {...props}>
      {showIcon && <ActionIcon size={13} className="status-badge-icon" />}
      <span className="status-badge-text">{actionLabel}</span>
    </span>
  );
}

export default StatusBadge;
