import React, { useState } from 'react';
import Badge from '../common/Badge';
import {
  TrendingUp,
  Minus,
  HelpCircle,
  Users,
  Quote,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DemandExperimentModal from './DemandExperimentModal';

export const DemandSignalCard = ({ signal, rank, businessId, onExperimentLaunched }) => {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const trendIcon = {
    Rising: <TrendingUp className="w-3.5 h-3.5 text-secondary" />,
    Declining: <Minus className="w-3.5 h-3.5 text-danger" />,
    Stable: <Minus className="w-3.5 h-3.5 text-primary" />,
    'Insufficient history': <HelpCircle className="w-3.5 h-3.5 text-text-muted" />
  }[signal.trend] || <Minus className="w-3.5 h-3.5 text-text-muted" />;

  const trendVariant = {
    Rising: 'positive',
    Declining: 'negative',
    Stable: 'info',
    'Insufficient history': 'neutral'
  }[signal.trend] || 'neutral';

  return (
    <div className="bg-white rounded-2xl border border-surface-border hover:border-primary/50 p-6 shadow-card hover:bg-stone-50/40 transition-all duration-200 flex flex-col justify-between group relative">
      <div>
        {/* Header: Rank + Demand Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center justify-center font-tabular shadow-sm">
              #{rank}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
                {signal.title}
              </h3>
              <p className="text-xs text-text-secondary">Customer-Identified Opportunity</p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-primary font-tabular">
                {signal.demandScore}
              </span>
              <span className="text-xs font-semibold text-text-muted">/100</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
              Opportunity
            </span>
          </div>
        </div>

        {/* Badges Bar: Trend, Category & Confidence */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={trendVariant} size="sm">
            <span className="flex items-center gap-1 font-semibold">
              {trendIcon}
              Trend: {signal.trend}
            </span>
          </Badge>

          {signal.category && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {signal.category}
            </span>
          )}

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            Confidence: {signal.confidence}
          </span>
        </div>

        {/* Commercial Viability & Financial Modeling Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 mb-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Est. Revenue</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-tabular text-xs sm:text-sm block mt-0.5">
              {signal.estimatedRevenue || '₹50,000 / mo'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Gross Margin</span>
            <span className="font-bold text-text-primary font-tabular text-xs sm:text-sm block mt-0.5">
              {signal.grossMargin || '70%'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Pilot CapEx</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 font-tabular text-xs sm:text-sm block mt-0.5">
              {signal.pilotCost || '₹7,500'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Payback</span>
            <span className="font-bold text-primary font-tabular text-xs sm:text-sm block mt-0.5">
              {signal.paybackHorizon || '14 Days'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-canvas-subtle border border-surface-border mb-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase text-stone-500 tracking-wider">Unique Reviewers</span>
            <div className="text-xs font-bold text-text-primary font-tabular mt-0.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-primary" />
              <span>{signal.uniqueReviews} customers</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-stone-500 tracking-wider">Review Mentions</span>
            <div className="text-xs font-bold text-text-primary font-tabular mt-0.5">
              {signal.totalMentions} times
            </div>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-stone-500 tracking-wider">Local Blindspot</span>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-tabular mt-0.5">
              {signal.competitorGap || '78% Gap'}
            </div>
          </div>
        </div>

        {/* Suggested Experiment Box */}
        {signal.suggestedExperiment && (
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
              <span>Suggested 14-Day Pilot</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {signal.suggestedExperiment}
            </p>
          </div>
        )}

        {/* Supporting Reviews Evidence Accordion */}
        {signal.supportingReviews && signal.supportingReviews.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 hover:text-stone-900 py-1 transition-colors"
            >
              <span>{signal.supportingReviews.length} Supporting Customer Quotes</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expanded && (
              <div className="mt-2 space-y-2 animate-fadeIn duration-150">
                {signal.supportingReviews.map((rev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <p className="text-stone-700 italic mb-1.5 flex items-start gap-1.5 leading-relaxed">
                      <Quote className="w-3.5 h-3.5 text-primary/70 flex-shrink-0 mt-0.5" />
                      <span>"{rev.text}"</span>
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200">
                      <span className="text-amber-600 font-semibold font-tabular">{rev.rating}.0 ★</span>
                      <span className="font-mono text-stone-400">ID: {rev.reviewId?.slice(0, 10)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer CTA Buttons */}
      <div className="pt-4 border-t border-stone-200 flex items-center gap-2">
        <button
          onClick={() => setModalOpen(true)}
          className="flex-1 py-2 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
        >
          <Rocket className="w-3.5 h-3.5 text-white" />
          <span>Simulate ROI & Pilot</span>
        </button>

        <button
          onClick={() => navigate('/advisor')}
          className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors shadow-sm"
          title="View in Business Advisor"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <DemandExperimentModal
          signal={signal}
          businessId={businessId}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onLaunched={() => {
            if (onExperimentLaunched) onExperimentLaunched();
            setModalOpen(false);
          }}
        />
      </div>
    </div>
  );
};

export default DemandSignalCard;
