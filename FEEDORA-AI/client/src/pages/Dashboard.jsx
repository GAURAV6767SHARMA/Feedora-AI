import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { analysisService } from '../services/analysisService';
import { advisorService } from '../services/advisorService';
import MetricsGrid from '../components/dashboard/MetricsGrid';
import SentimentDistributionChart from '../components/dashboard/SentimentDistributionChart';
import TrendLineChart from '../components/dashboard/TrendLineChart';
import ComplaintsAndPreferences from '../components/dashboard/ComplaintsAndPreferences';
import EmergingDemandSignalPreview from '../components/dashboard/EmergingDemandSignalPreview';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Sparkles, ArrowRight, Lightbulb, Activity, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { currentBusiness, refreshTrigger } = useBusiness();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentBusiness?._id && !currentBusiness?.id) return;
      const businessId = currentBusiness._id || currentBusiness.id;
      setLoading(true);
      try {
        const [sumRes, trendRes, recRes] = await Promise.all([
          analysisService.getSummary(businessId),
          analysisService.getTrends(businessId),
          advisorService.getRecommendations(businessId)
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (trendRes.success) setTrends(trendRes.data.trends || []);
        if (recRes.success) setRecommendations(recRes.data || []);
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentBusiness, refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton lines={2} className="w-1/2" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-card rounded-2xl border border-surface-border animate-pulse p-4" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-surface-card rounded-2xl border border-surface-border animate-pulse" />
          <div className="lg:col-span-1 h-72 bg-surface-card rounded-2xl border border-surface-border animate-pulse" />
        </div>
      </div>
    );
  }

  if (!summary || summary.total === 0) {
    return (
      <EmptyState
        title="No Reviews Found for this Business"
        description="Get started by uploading a CSV file with reviews or loading one of our pre-built synthetic datasets."
        actionLabel="Go to Review Intelligence"
        onAction={() => window.location.href = '/reviews'}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn duration-200">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Customer Intelligence Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Real-time sentiment and revenue signals for <span className="font-semibold text-primary">{currentBusiness?.name}</span> ({currentBusiness?.category})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active Feedback Intelligence
          </span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <MetricsGrid summary={summary} />

      {/* Charts Grid: Volume Trend + Sentiment Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendLineChart trends={trends} />
        </div>
        <div className="lg:col-span-1">
          <SentimentDistributionChart sentimentSummary={summary.sentimentSummary} />
        </div>
      </div>

      {/* Demand Radar Emerging Signals Preview */}
      <EmergingDemandSignalPreview signals={summary.demandSignals || []} />

      {/* Complaints and Customer Favorites */}
      <ComplaintsAndPreferences
        complaints={summary.topComplaints || []}
        preferences={summary.topPreferences || []}
      />

      {/* Latest AI Recommendations Preview Card */}
      {recommendations.length > 0 && (
        <div className="bg-surface-card rounded-2xl border border-surface-border p-6 shadow-card relative group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60 shadow-sm">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-text-primary tracking-tight">
                  High-Priority Operational Recommendations
                </h3>
                <p className="text-xs text-text-secondary">AI-synthesized interventions based on customer feedback trends</p>
              </div>
            </div>

            <Link
              to="/advisor"
              className="text-xs font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1 group transition-colors"
            >
              <span>View All ({recommendations.length})</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="p-4 rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-amber-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                      {rec.priority || 'High'} Priority
                    </span>
                    <span className="text-[11px] text-text-muted capitalize">{rec.category}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-text-primary mb-1 line-clamp-2">
                    {rec.title}
                  </h4>
                  <p className="text-xs text-text-secondary line-clamp-2 mb-3">
                    {rec.rationale}
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-stone-700 pt-2 border-t border-stone-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Est. Impact: {rec.estimatedImpact || 'High ROI'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
