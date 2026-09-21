import React from 'react';
import { Star } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import SecurityTagList from '../ui/SecurityTag';

/**
 * EmailListItem Component
 * 
 * Gmail-inspired compact email row layout:
 * [Checkbox] [Star] Sender Name | Subject + Snippet Preview | Security Badge | Timestamp
 */
export function EmailListItem({ 
  email, 
  onSelect, 
  isStarred = false, 
  onToggleStar, 
  isSelected = false, 
  showCategoryBadge = false 
}) {
  if (!email) return null;

  const senderDisplayName = email.senderName || email.sender || 'Unknown Sender';
  const snippetText = email.bodySnippet || email.warningReason || email.subject || '';

  const handleRowClick = (e) => {
    if (onSelect) {
      onSelect(email);
    }
  };

  const handleStarClick = (e) => {
    e.stopPropagation();
    if (onToggleStar) {
      onToggleStar(email.id);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={handleRowClick}
      className={`email-list-row ${email.unread ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
    >
      {/* Controls: Checkbox & Star */}
      <div className="email-row-controls" onClick={(e) => e.stopPropagation()}>
        <input 
          type="checkbox" 
          className="email-checkbox" 
          onClick={handleCheckboxClick}
          aria-label={`Select ${email.subject}`}
        />
        <button 
          type="button"
          onClick={handleStarClick}
          className={`email-star-btn ${isStarred ? 'starred' : ''}`}
          aria-label={isStarred ? "Unstar email" : "Star email"}
        >
          <Star size={16} fill={isStarred ? '#f59e0b' : 'none'} color={isStarred ? '#f59e0b' : '#94a3b8'} />
        </button>
      </div>

      {/* Sender Column */}
      <div className="email-row-sender" title={email.sender}>
        {email.unread && <span className="email-unread-dot" />}
        <span className="email-sender-name">{senderDisplayName}</span>
      </div>

      {/* Subject & Preview Snippet */}
      <div className="email-row-content">
        <span className="email-subject-text">{email.subject}</span>
        <span className="email-snippet-text"> — {snippetText}</span>
      </div>

      {/* Security Status Badge & Tags */}
      <div className="email-row-badges">
        {showCategoryBadge && email.category && (
          <span className="email-category-chip">{email.category}</span>
        )}
        <StatusBadge type="classification" value={email.classification} showIcon={true} />
      </div>

      {/* Timestamp */}
      <div className="email-row-time">
        {email.displayTime || email.timestamp || ''}
      </div>
    </div>
  );
}

export default EmailListItem;
