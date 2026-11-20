import React from 'react';
import { AlertCircle, ThumbsUp, Quote } from 'lucide-react';

export const ComplaintsAndPreferences = ({ complaints = [], preferences = [] }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Complaints Card */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-card flex flex-col relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60 shadow-sm">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-tight">Top Customer Complaints</h3>
            <p className="text-xs text-text-secondary">Primary friction points requiring operational attention</p>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {complaints.length === 0 ? (
            <p className="text-xs text-text-muted italic py-6 text-center">No recurring complaints detected.</p>
          ) : (
            complaints.slice(0, 5).map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-rose-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-primary">{c.category}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-tabular">
                    {c.count} mentions
                  </span>
                </div>
                {c.sampleEvidence && c.sampleEvidence[0] && (
                  <p className="text-xs text-text-secondary flex items-start gap-2 italic line-clamp-2 leading-relaxed">
                    <Quote className="w-3.5 h-3.5 text-rose-500/70 flex-shrink-0 mt-0.5" />
                    <span>"{c.sampleEvidence[0]}"</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Customer Preferences Card */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-card flex flex-col relative">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-tight">Customer Favorites & Strengths</h3>
            <p className="text-xs text-text-secondary">Signature aspects driving positive word of mouth</p>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          {preferences.length === 0 ? (
            <p className="text-xs text-text-muted italic py-6 text-center">No top preferences aggregated yet.</p>
          ) : (
            preferences.slice(0, 5).map((p, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-emerald-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-text-primary">{p.item}</span>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-tabular">
                    {p.count} praises
                  </span>
                </div>
                {p.sampleEvidence && p.sampleEvidence[0] && (
                  <p className="text-xs text-text-secondary flex items-start gap-2 italic line-clamp-2 leading-relaxed">
                    <Quote className="w-3.5 h-3.5 text-emerald-600/70 flex-shrink-0 mt-0.5" />
                    <span>"{p.sampleEvidence[0]}"</span>
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsAndPreferences;
