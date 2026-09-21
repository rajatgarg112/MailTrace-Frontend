import React from 'react';

export function Card({ children, title, action, hoverable = false, className = '', ...props }) {
  return (
    <div className={`ui-card ${hoverable ? 'hoverable' : ''} ${className}`} {...props}>
      {title && (
        <div className="ui-card-header">
          <h3 className="ui-card-title">{title}</h3>
          {action && <div className="ui-card-action">{action}</div>}
        </div>
      )}
      <div className="ui-card-body">{children}</div>
    </div>
  );
}

export default Card;
