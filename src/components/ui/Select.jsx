import React from 'react';

const Select = ({
  label,
  error,
  helperText,
  className = '',
  id,
  children,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-[10px] font-bold tracking-widest uppercase text-primary/60 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={id}
          className={`
            w-full px-4 py-3.5 bg-bg-primary border border-border-strong rounded-md text-sm 
            font-medium text-label-primary appearance-none cursor-pointer
            transition-all duration-150 focus:outline-none 
            focus:border-primary focus:ring-1 focus:ring-primary
            ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-label-secondary group-focus-within:text-primary-light">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error ? (
        <span className="text-xs text-error font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-label-secondary font-medium">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Select;
