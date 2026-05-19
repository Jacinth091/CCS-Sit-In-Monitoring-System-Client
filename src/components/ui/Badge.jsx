import React from 'react';

const Badge = ({ 
  children, 
  variant = 'info', 
  className = '' 
}) => {
  const variants = {
    primary: "bg-primary/5 text-primary border-primary/10",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    error: "bg-red-50 text-red-600 border-red-100",
    info: "bg-primary/5 text-primary-light border-primary/10",
    secondary: "bg-bg-secondary text-primary-light border-border",
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-bold border capitalize
      ${variants[variant]} ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
