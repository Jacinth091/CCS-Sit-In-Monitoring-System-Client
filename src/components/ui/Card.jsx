import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`
      bg-bg-tertiary rounded-lg p-6 border border-border shadow-sm
      transition-colors duration-150
      ${className}
    `}>
      {children}
    </div>
  );
};

const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-xl font-bold text-label-primary tracking-tight">{title}</h3>}
      {subtitle && <p className="text-sm text-label-secondary">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

const CardBody = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-separator ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
