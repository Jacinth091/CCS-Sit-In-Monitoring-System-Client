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
          className="text-[9px] font-black tracking-[0.15em] uppercase text-primary-light ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          id={id}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm 
            font-bold text-primary appearance-none cursor-pointer
            transition-all duration-200 focus:bg-white focus:outline-none 
            focus:ring-4 focus:ring-primary/5
            ${error ? 'border-red-400 focus:ring-red-400/5' : ''}
          `}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-light/40 group-focus-within:text-primary-hover transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error ? (
        <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>
      ) : helperText ? (
        <span className="text-[10px] text-primary-light/60 font-bold ml-1 tracking-tight">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Select;
