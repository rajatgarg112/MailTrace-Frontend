import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Failed to load security data',
  message = 'An unexpected error occurred while communicating with the backend analysis engine.',
  onRetry,
}) {
  return (
    <div className="state-container" style={{ borderColor: 'var(--color-quarantine-border)' }}>
      <AlertOctagon className="state-icon" size={40} style={{ color: '#ef4444' }} />
      <h3 className="state-title" style={{ color: '#fca5a5' }}>{title}</h3>
      <p className="state-description">{message}</p>
      {onRetry && (
        <Button variant="danger" onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
