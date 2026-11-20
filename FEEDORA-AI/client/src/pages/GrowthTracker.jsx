import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { growthService } from '../services/growthService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import {
  TrendingUp,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

export const GrowthTracker = () => {
  const { currentBusiness, refreshTrigger } = useBusiness();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrowth = async () => {
      if (!currentBusiness?._id && !currentBusiness?.id) return;
      const businessId = currentBusiness._id || currentBusiness.id;
      setLoading(true);
      try {
        const res = await growthService.getGrowthData(businessId);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load growth tracking:', err);
        toast.error('Could not load growth data');
      } finally {
        setLoading(false);
      }
    };

    fetchGrowth();
  }, [currentBusiness, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton lines={2} className="w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-card rounded-2xl border border-surface-border animate-pulse p-4" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const comparison = data?.periodComparison || {};
  const sampleSizes = data?.sampleSizes || {};
  const complaints = data?.complaintComparison || [];
  const actionHistory = data?.actionHistory || [];

  return (
    <div className="space-y-6 animate-fadeIn duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Growth & Action Tracker</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Impact Analytics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Compare earlier vs recent customer sentiment, track complaint resolution, and monitor action execution
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="font-tabular font-medium">Total Sample: {sampleSizes.totalReviews || 0} reviews</span>
        </div>
      </div>

      {/* Observational Methodology Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-stone-700 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-amber-900">Observational Correlation Methodology:</span>
          <p className="leading-relaxed text-stone-600">
            {data?.scientificDisclaimer || 'Period-over-period sentiment deltas represent chronological shifts in review samples. While actions are designed to eliminate friction points, improvement should not be claimed as solely caused by implemented recommendations without controlled testing.'}
          </p>
        </div>
      </div>

      {/* Top Metric Cards: Implementation Progress */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Execution Rate</span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-stone-900 font-tabular">
            {metrics.completionRate}%
          </div>
          <p className="text-xs text-stone-500 mt-1">{metrics.completedCount} of {metrics.totalRecommendations} actions done</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Completed</span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-700 font-tabular">
            {metrics.completedCount}
          </div>
          <p className="text-xs text-stone-500 mt-1">Operational fixes deployed</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">In Progress</span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-primary font-tabular">
            {metrics.inProgressCount}
          </div>
          <p className="text-xs text-stone-500 mt-1">Actively being implemented</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-card">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Pending Backlog</span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-amber-700 font-tabular">
            {metrics.pendingCount}
          </div>
          <p className="text-xs text-stone-500 mt-1">Identified prescriptions</p>
        </div>
      </div>

      {/* Period-Over-Period Sentiment Comparison */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card relative">
        <h3 className="text-sm font-semibold text-text-primary mb-1 tracking-tight">Period-Over-Period Sentiment Comparison</h3>
        <p className="text-xs text-text-secondary mb-6">
          Comparing earlier {sampleSizes.earlierPeriodReviews} reviews against recent {sampleSizes.recentPeriodReviews} reviews
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Average Rating Delta */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary font-medium">Average Rating Shift</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-stone-900 font-tabular">
                  {comparison.recentRating || 0} ★
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  from {comparison.earlierRating || 0} ★
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              comparison.ratingDelta >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {comparison.ratingDelta >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {comparison.ratingDelta > 0 ? `+${comparison.ratingDelta}` : comparison.ratingDelta}
            </div>
          </div>

          {/* Positive Sentiment Delta */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary font-medium">Positive Sentiment Ratio</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-stone-900 font-tabular">
                  {comparison.recentPositivePct || 0}%
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  from {comparison.earlierPositivePct || 0}%
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              comparison.positiveDelta >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {comparison.positiveDelta >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {comparison.positiveDelta > 0 ? `+${comparison.positiveDelta}%` : `${comparison.positiveDelta}%`}
            </div>
          </div>

          {/* Negative Sentiment Delta */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-text-secondary font-medium">Negative Sentiment Ratio</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-stone-900 font-tabular">
                  {comparison.recentNegativePct || 0}%
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  from {comparison.earlierNegativePct || 0}%
                </span>
              </div>
            </div>
            <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              comparison.negativeDelta <= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {comparison.negativeDelta <= 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              {comparison.negativeDelta > 0 ? `+${comparison.negativeDelta}%` : `${comparison.negativeDelta}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Complaint Evolution Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card">
        <h3 className="text-sm font-semibold text-text-primary mb-1 tracking-tight">Complaint Resolution Evolution</h3>
        <p className="text-xs text-text-secondary mb-4">
          Tracking mention frequencies of identified friction points over time
        </p>

        {complaints.length === 0 ? (
          <p className="text-xs text-text-muted italic py-6 text-center">No recurring complaints to track across periods.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-700 border-b border-stone-200 font-semibold">
                <tr>
                  <th className="py-3 px-3">Complaint Category</th>
                  <th className="py-3 px-3">Earlier Period</th>
                  <th className="py-3 px-3">Recent Period</th>
                  <th className="py-3 px-3">Trend Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {complaints.map((c, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-3 font-semibold text-text-primary">{c.category}</td>
                    <td className="py-3 px-3 font-tabular text-stone-600">{c.earlierPeriodCount} mentions</td>
                    <td className="py-3 px-3 font-tabular text-text-primary font-semibold">{c.recentPeriodCount} mentions</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        c.trend === 'reduced'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : c.trend === 'increased'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {c.trend === 'reduced' && '↓ Reduced'}
                        {c.trend === 'increased' && '↑ Increased'}
                        {c.trend === 'unchanged' && '— Unchanged'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action History Log */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card">
        <h3 className="text-sm font-semibold text-text-primary mb-1 tracking-tight">Operational Action Execution Log</h3>
        <p className="text-xs text-text-secondary mb-4">
          Chronological audit of recommendations and their execution lifecycle
        </p>

        {actionHistory.length === 0 ? (
          <p className="text-xs text-text-muted italic py-6 text-center">No actions recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {actionHistory.map((act) => (
              <div key={act.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      act.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : act.status === 'in-progress'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {act.status}
                    </span>
                    <span className="font-semibold text-text-primary">{act.title}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{act.action}</p>
                </div>

                <div className="text-[11px] text-stone-500 whitespace-nowrap font-tabular">
                  {act.completedAt ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Completed {new Date(act.completedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span>Created {new Date(act.createdAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthTracker;
