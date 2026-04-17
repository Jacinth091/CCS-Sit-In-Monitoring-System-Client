import React from 'react';

const Badge = ({ 
  children, 
  variant = 'info', 
  className = '' 
}) => {
  const variants = {
    primary: "bg-primary-muted text-primary border-primary/20",
    success: "bg-success-light text-success border-success/20",
    warning: "bg-warning-light text-warning border-warning/20",
    error: "bg-error-light text-error border-error/20",
    info: "bg-info-light text-info border-info/20",
    secondary: "bg-bg-secondary text-label-secondary border-border",
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider border 
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
