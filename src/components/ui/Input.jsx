import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  leftIcon,
  rightIcon,
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
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light/40 group-focus-within:text-primary-hover transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full px-4 py-2.5 rounded-xl border border-border bg-bg-secondary/30 text-sm 
            font-bold text-primary placeholder:text-primary-light/30
            transition-all duration-200 focus:bg-white focus:outline-none 
            focus:ring-4 focus:ring-primary/5
            ${leftIcon ? 'pl-11' : 'pl-4'}
            ${rightIcon ? 'pr-11' : 'pr-4'}
            ${error ? 'border-red-400 focus:ring-red-400/5' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-light/40">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-[10px] text-red-500 font-bold ml-1">{error}</span>
      ) : helperText ? (
        <span className="text-[10px] text-primary-light/60 font-bold ml-1 tracking-tight">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Input;
