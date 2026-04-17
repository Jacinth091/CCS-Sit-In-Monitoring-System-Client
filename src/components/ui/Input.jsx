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
          className="text-[10px] font-bold tracking-widest uppercase text-primary/60 ml-1"
        >
          {label}
        </label>
      )}
      <div className="relative group">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-label-secondary group-focus-within:text-primary-light transition-colors">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={`
            w-full py-3.5 bg-bg-primary border border-border-strong rounded-md text-sm 
            font-medium text-label-primary placeholder:text-label-tertiary
            transition-all duration-150 focus:outline-none 
            focus:border-primary focus:ring-1 focus:ring-primary
            ${leftIcon ? 'pl-12' : 'pl-4'}
            ${rightIcon ? 'pr-12' : 'pr-4'}
            ${error ? 'border-error focus:border-error focus:ring-error' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <span className="text-xs text-error font-medium">{error}</span>
      ) : helperText ? (
        <span className="text-xs text-label-secondary font-medium">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Input;
