import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading threat intelligence signals...' }) {
  return (
    <div className="state-container">
      <Loader2 className="spinner state-icon" size={32} style={{ color: 'var(--accent-cyan)' }} />
      <p className="state-description">{message}</p>
    </div>
  );
}

export default LoadingState;
