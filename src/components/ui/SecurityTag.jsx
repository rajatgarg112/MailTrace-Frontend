import React from 'react';
import { Tag } from 'lucide-react';

/**
 * SecurityTag Component
 * 
 * Renders short security explanations visually separate from:
 * - raw features
 * - risk score
 * - threat classification
 * - delivery action
 */
export function SecurityTag({ tag, tags, showIcon = true, size = 'medium', className = '', ...props }) {
  if (Array.isArray(tags) || Array.isArray(tag)) {
    return <SecurityTagList tags={tags || tag} size={size} className={className} {...props} />;
  }
  // Normalize tag display string (e.g., 'DMARC_FAIL' -> 'DMARC-Fail')
  const formattedTag = typeof tag === 'string' 
    ? tag.replace(/_/g, '-')
    : (tag || '');

  return (
    <span 
      className={`security-tag security-tag-${size} ${className}`} 
      title={`Security Explanation Tag: ${formattedTag}`} 
      {...props}
    >
      {showIcon && <Tag size={11} className="security-tag-icon" />}
      <span className="security-tag-label">{formattedTag}</span>
    </span>
  );
}

export function SecurityTagList({ tags = [], size = 'medium', limit, showEmptyFallback = false, className = '' }) {
  if (!tags || tags.length === 0) {
    if (showEmptyFallback) {
      return <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None (No security flags)</span>;
    }
    return null;
  }

  const displayTags = limit ? tags.slice(0, limit) : tags;
  const remainingCount = tags.length - displayTags.length;

  return (
    <div className={`security-tag-list ${className}`}>
      {displayTags.map((tag, idx) => (
        <SecurityTag key={`${tag}-${idx}`} tag={tag} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className="security-tag-more">+{remainingCount} more</span>
      )}
    </div>
  );
}

export default function SecurityTagListOrTag(props) {
  if (Array.isArray(props?.tags) || Array.isArray(props?.tag)) {
    return <SecurityTagList {...props} tags={props.tags || props.tag} />;
  }
  return <SecurityTag {...props} />;
}
