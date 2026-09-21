import React from 'react';

/**
 * RiskIndicator Component
 * 
 * Visual score bar and badge (0-100) indicating pre-delivery calculated threat score.
 */
export function RiskIndicator({ score, confidence, showBar = true, size = 'medium', className = '' }) {
  const isScorePresent = score !== undefined && score !== null && !isNaN(score);
  const numericScore = isScorePresent ? Math.min(100, Math.max(0, Number(score))) : 0;

  let levelClass = 'risk-low';
  let levelText = 'LOW';

  if (!isScorePresent) {
    levelClass = 'risk-unknown';
    levelText = 'ANALYSIS PENDING';
  } else if (numericScore > 85) {
    levelClass = 'risk-critical';
    levelText = 'CRITICAL';
  } else if (numericScore > 60) {
    levelClass = 'risk-high';
    levelText = 'HIGH';
  } else if (numericScore > 30) {
    levelClass = 'risk-moderate';
    levelText = 'MODERATE';
  } else {
    levelClass = 'risk-low';
    levelText = 'LOW';
  }

  return (
    <div className={`risk-indicator risk-indicator-${size} ${levelClass} ${className}`}>
      <div className="risk-indicator-header">
        <span className="risk-score-value">
          <strong>{isScorePresent ? numericScore : 'N/A'}</strong>
          {isScorePresent && <span className="risk-score-max">/100</span>}
        </span>
        <span className={`risk-level-badge ${levelClass}`}>{levelText}</span>
      </div>

      {showBar && isScorePresent && (
        <div className="risk-bar-track">
          <div 
            className={`risk-bar-fill ${levelClass}`} 
            style={{ width: `${numericScore}%` }} 
          />
        </div>
      )}

      {confidence !== undefined && confidence !== null && !isNaN(confidence) ? (
        <div className="risk-confidence">
          Confidence: <strong>{(Number(confidence) * 100).toFixed(0)}%</strong>
        </div>
      ) : (
        <div className="risk-confidence" style={{ color: 'var(--text-muted)' }}>
          Confidence: <strong>Pending</strong>
        </div>
      )}
    </div>
  );
}

export default RiskIndicator;
