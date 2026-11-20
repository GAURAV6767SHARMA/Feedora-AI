import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sparkles,
  title = 'No data available',
  description = 'Get started by importing reviews or running an AI analysis.',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface-card rounded-2xl border border-surface-border">
      <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/25 mb-4 shadow-card">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-text-primary tracking-tight">{title}</h3>
      <p className="mt-1.5 text-xs text-text-secondary max-w-sm leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all duration-150 active:scale-95 shadow-card shadow-primary/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
