import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'coral' }) => {
  const colorStyles = {
    coral: 'bg-primary-light text-primary border-primary/20',
    blue: 'bg-sky-50 text-sky-700 border-sky-200',
    indigo: 'bg-stone-100 text-stone-700 border-stone-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    navy: 'bg-stone-50 text-stone-700 border-stone-200'
  };

  return (
    <div className="bg-white rounded-xl border border-surface-border p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{title}</span>
          {Icon && (
            <div className={`p-2 rounded-lg border ${colorStyles[color] || colorStyles.coral} transition-transform duration-200 group-hover:scale-105`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold text-text-primary font-tabular tracking-tight">
            {value}
          </span>
          {trend && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              trend.isPositive
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : 'text-rose-700 bg-rose-50 border-rose-200'
            }`}>
              {trend.text}
            </span>
          )}
        </div>
      </div>

      {subtitle && <p className="mt-2 text-xs text-text-secondary leading-relaxed font-normal">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
