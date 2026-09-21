import React from 'react';
import Card from './Card';

/**
 * StatCard Component
 * 
 * Reusable metric card with value, trend/subtitle, icon, and optional badge or color accents.
 */
export function StatCard({ title, value, subtitle, icon: Icon, badge, accentColor = 'cyan', className = '', ...props }) {
  return (
    <Card className={`stat-card stat-card-accent-${accentColor} ${className}`} {...props}>
      <div className="stat-card-top">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className={`stat-card-icon-wrapper stat-card-icon-${accentColor}`}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div className="stat-card-value-container">
        <span className="stat-card-value">{value}</span>
        {badge && <div className="stat-card-badge">{badge}</div>}
      </div>

      {subtitle && <div className="stat-card-subtitle">{subtitle}</div>}
    </Card>
  );
}

export default StatCard;
