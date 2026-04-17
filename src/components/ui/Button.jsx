import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  loading = false, 
  disabled = false, 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold tracking-tight uppercase transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-transparent text-primary border border-primary hover:bg-bg-secondary",
    ghost: "bg-transparent text-primary hover:bg-bg-secondary",
    danger: "bg-error text-white hover:opacity-90",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs rounded-md",
    md: "h-11 px-6 text-sm rounded-md",
    lg: "h-13 px-8 text-base rounded-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2">◌</span>
      ) : icon ? (
        <span className="w-4 h-4">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
