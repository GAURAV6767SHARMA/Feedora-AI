import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    positive: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    negative: 'bg-rose-50 text-rose-800 border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    teal: 'bg-teal-50 text-teal-800 border-teal-200',
    coral: 'bg-primary-light text-primary border-primary/20',
    purple: 'bg-stone-100 text-stone-800 border-stone-200'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] font-semibold tracking-wide',
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
