import React, { useState } from 'react';
import Badge from '../common/Badge';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Coins,
  Check
} from 'lucide-react';
import { advisorService } from '../../services/advisorService';
import toast from 'react-hot-toast';

export const RecommendationCard = ({ recommendation, onStatusChange }) => {
  const [status, setStatus] = useState(recommendation.status || 'pending');
  const [updating, setUpdating] = useState(false);
  const [sopExpanded, setSopExpanded] = useState(false);

  const priorityVariant = {
    high: 'negative',
    medium: 'warning',
    low: 'info'
  }[recommendation.priority] || 'neutral';

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === status) return;
    setUpdating(true);
    try {
      await advisorService.updateStatus(recommendation._id || recommendation.id, newStatus);
      setStatus(newStatus);
      toast.success(`Recommendation marked as ${newStatus}`);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-card transition-all duration-200 flex flex-col justify-between relative group ${
      status === 'completed' ? 'border-emerald-300 bg-emerald-50/20' : 'border-stone-200 bg-white hover:border-primary/40'
    }`}>
      <div>
        {/* Strategic Pillar & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={priorityVariant} size="xs" className="uppercase font-semibold tracking-wider">
              {recommendation.priority} Priority
            </Badge>

            {recommendation.pillar && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                {recommendation.pillar}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => handleStatusUpdate('pending')}
              disabled={updating}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                status === 'pending'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleStatusUpdate('in-progress')}
              disabled={updating}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                status === 'in-progress'
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={updating}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all ${
                status === 'completed'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Title & Core Action */}
        <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors mb-2 leading-snug">
          {recommendation.title}
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {recommendation.action}
        </p>

        {/* Financial Modeling & Business Impact Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 mb-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Projected Impact</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-tabular text-xs block mt-0.5">
              {recommendation.financialImpact || '+₹35,000 / mo'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">CapEx Required</span>
            <span className="font-bold text-amber-700 dark:text-amber-400 font-tabular text-xs block mt-0.5">
              {recommendation.capitalRequired || '₹5,000'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Payback Window</span>
            <span className="font-bold text-primary font-tabular text-xs block mt-0.5">
              {recommendation.paybackHorizon || '14 Days'}
            </span>
          </div>
        </div>

        {/* Expected Measurable Outcome Box */}
        {recommendation.expectedOutcome && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 mb-1 block">
              Target Measurable Outcome:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {recommendation.expectedOutcome}
            </p>
          </div>
        )}

        {/* Step-by-Step SOP Roadmap Accordion */}
        {recommendation.sopSteps && recommendation.sopSteps.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setSopExpanded(!sopExpanded)}
              className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 hover:text-stone-900 py-1 transition-colors"
            >
              <span>{recommendation.sopSteps.length}-Step Execution SOP</span>
              {sopExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {sopExpanded && (
              <div className="mt-2 p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2 animate-fadeIn duration-150">
                {recommendation.sopSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Limitations & Constraints Disclosure */}
        {recommendation.limitations && (
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1 mb-1">
              <ShieldAlert className="w-3 h-3 text-amber-700" /> Operational Constraints:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed">
              {recommendation.limitations}
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 mt-auto">
        <span className="font-tabular font-medium text-stone-600">{recommendation.confidence}</span>
        <span className="font-semibold text-primary">
          {recommendation.effort || 'Strategic Initiative'}
        </span>
      </div>
    </div>
  );
};

export default RecommendationCard;
