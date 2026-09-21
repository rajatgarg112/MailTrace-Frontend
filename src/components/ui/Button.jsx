import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = `ui-btn-${variant}`;
  
  return (
    <button
      type={type}
      className={`ui-btn ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="spinner" size={16} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
