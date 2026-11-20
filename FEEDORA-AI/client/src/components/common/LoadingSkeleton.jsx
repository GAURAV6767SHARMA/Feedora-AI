import React from 'react';

export const LoadingSkeleton = ({ lines = 4, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse ${className}`} aria-busy="true">
      <div className="h-4 bg-surface-raised rounded-lg w-1/3 border border-surface-border/50"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 bg-surface-raised/80 rounded-lg border border-surface-border/40"
          style={{ width: `${85 - (i % 3) * 15}%` }}
        ></div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
