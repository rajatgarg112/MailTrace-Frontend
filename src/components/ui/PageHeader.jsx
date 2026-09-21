import React from 'react';

export function PageHeader({ title, subtitle, actions, badge, icon: Icon }) {
  return (
    <div className="page-header-container">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {Icon && <Icon size={24} style={{ color: 'var(--accent-cyan)' }} />}
          <h1 className="page-title">{title}</h1>
          {badge && <span style={{ marginLeft: '0.25rem' }}>{badge}</span>}
        </div>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}

export default PageHeader;
