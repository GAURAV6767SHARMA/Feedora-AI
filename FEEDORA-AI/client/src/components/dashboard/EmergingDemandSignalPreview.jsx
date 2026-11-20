import React from 'react';
import { Link } from 'react-router-dom';
import { Radar, ArrowUpRight } from 'lucide-react';
import Badge from '../common/Badge';

export const EmergingDemandSignalPreview = ({ signals = [] }) => {
  return (
    <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-card relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 shadow-sm">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                Emerging Demand Signals
              </h3>
              <Badge variant="amber" size="xs">Demand Radar™</Badge>
            </div>
            <p className="text-xs text-text-secondary">Unmet customer requests ranked by predictive opportunity score</p>
          </div>
        </div>
        <Link
          to="/demand"
          className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 group transition-colors"
        >
          <span>Open Full Radar</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {signals.length === 0 ? (
          <div className="col-span-3 py-8 text-center text-xs text-text-muted">
            Run AI review analysis to discover emerging customer requests.
          </div>
        ) : (
          signals.slice(0, 3).map((sig, i) => (
            <div key={i} className="p-4 rounded-xl border border-stone-200/80 hover:border-amber-300 bg-stone-50/80 flex flex-col justify-between transition-all duration-200 group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">Signal #{i + 1}</span>
                  <Badge variant={sig.trend === 'Rising' ? 'positive' : 'info'} size="xs">
                    {sig.trend}
                  </Badge>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-text-primary mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {sig.title}
                </h4>
                <p className="text-xs text-text-secondary mb-3">
                  {sig.uniqueReviews} unique customers • {sig.totalMentions} mentions
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-text-muted font-medium">Opportunity Score</span>
                <span className="text-base font-bold text-primary font-tabular">
                  {sig.demandScore}<span className="text-xs font-normal text-stone-500">/100</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmergingDemandSignalPreview;
