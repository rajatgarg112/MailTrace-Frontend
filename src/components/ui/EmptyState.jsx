import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There are currently no records or events to display.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
}) {
  return (
    <div className="state-container">
      <Icon className="state-icon" size={40} />
      <h3 className="state-title">{title}</h3>
      <p className="state-description">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
