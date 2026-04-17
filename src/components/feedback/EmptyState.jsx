import React from 'react';
import Button from '../ui/Button';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 gap-4 ${className}`}>
      {icon && <div className="text-5xl opacity-50 mb-4">{icon}</div>}
      {title && <h3 className="text-xl font-extrabold text-primary uppercase tracking-wider">{title}</h3>}
      {description && <p className="text-sm text-primary-light max-w-xs uppercase tracking-wider mt-1">{description}</p>}
      {action && (
        <div className="mt-2">
          {typeof action === 'string' ? (
            <Button>{action}</Button>
          ) : action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
