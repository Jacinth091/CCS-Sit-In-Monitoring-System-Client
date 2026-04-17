import React from 'react';

const Skeleton = ({ className = '', circle = false }) => {
  return (
    <div className={`
      bg-gradient-to-r from-bg-secondary via-fill-tertiary to-bg-secondary 
      bg-[length:200%_100%] animate-shimmer 
      ${circle ? 'rounded-full' : 'rounded-sm'}
      ${className}
    `} />
  );
};

export default Skeleton;
