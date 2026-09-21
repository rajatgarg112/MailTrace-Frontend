import React from 'react';

export function Badge({ children, variant = 'info', className = '', ...props }) {
  const variantClass = `ui-badge-${variant.toLowerCase()}`;
  return (
    <span className={`ui-badge ${variantClass} ${className}`} {...props}>
      {children}
    </span>
  );
}

export default Badge;
