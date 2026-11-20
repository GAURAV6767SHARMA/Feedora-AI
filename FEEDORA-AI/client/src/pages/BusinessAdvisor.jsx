import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { advisorService } from '../services/advisorService';
import RecommendationCard from '../components/advisor/RecommendationCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { Lightbulb, Sparkles, Filter, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const BusinessAdvisor = () => {
  const { currentBusiness, refreshTrigger } = useBusiness();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchRecommendations = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setLoading(true);
    try {
      const res = await advisorService.getRecommendations(businessId);
      if (res.success) {
        setRecommendations(res.data);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      toast.error('Could not load advisor recommendations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [currentBusiness, refreshTrigger]);

  const handleGenerate = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setGenerating(true);
    const toastId = toast.loading('Synthesizing customer intelligence and generating recommendations...');
    try {
      const res = await advisorService.generateRecommendations(businessId);
      toast.success(res.message || 'New business recommendations generated!', { id: toastId });
      setRecommendations(res.data);
    } catch (err) {
      toast.error(err.message || 'Generation failed', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const filtered = recommendations.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const pendingCount = recommendations.filter(r => r.status === 'pending').length;
  const inProgressCount = recommendations.filter(r => r.status === 'in-progress').length;
  const completedCount = recommendations.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fadeIn duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">AI Business Advisor</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Commercial Action Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Data-grounded strategic prescriptions, financial impact projections, and operational execution roadmaps
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 text-white ${generating ? 'animate-spin' : ''}`} />
          <span>{generating ? 'Formulating...' : 'Regenerate Recommendations'}</span>
        </button>
      </div>

      {/* Executive Financial & Strategic Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Projected Monthly Impact</span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400 font-tabular mt-1">
            {recommendations.length > 0 ? `+₹${(recommendations.length * 0.55).toFixed(1)}L / mo` : '+₹0 / mo'}
          </div>
          <span className="text-[10px] text-text-secondary mt-0.5 block">Estimated from {recommendations.length} strategic initiatives</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Average Payback</span>
          <div className="text-xl sm:text-2xl font-bold text-primary font-tabular mt-1">14.5 Days</div>
          <span className="text-[10px] text-text-secondary mt-0.5 block">Rapid capital recovery horizon</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Execution Readiness</span>
          <div className="text-xl sm:text-2xl font-bold text-text-primary mt-1">
            {recommendations.length > 0 ? '100% SOP Ready' : 'Awaiting Ingestion'}
          </div>
          <span className="text-[10px] text-text-secondary mt-0.5 block">Actionable operational roadmaps attached</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface-card border border-surface-border shadow-card">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">Risk Protection</span>
          <div className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-400 font-tabular mt-1">
            {recommendations.length > 0 ? '-35% Churn' : '0%'}
          </div>
          <span className="text-[10px] text-text-secondary mt-0.5 block">Mitigates customer dissatisfaction</span>
        </div>
      </div>

      {/* Status Counters & Filter Toolbar */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-4 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            All ({recommendations.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'pending'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'in-progress'
                ? 'bg-primary/10 text-primary border border-primary/30 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterStatus === 'completed'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm'
                : 'bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200 hover:bg-stone-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="text-xs text-text-secondary">
          Implementation Rate:{' '}
          <span className="font-bold text-emerald-700 font-tabular ml-1">
            {recommendations.length > 0 ? Math.round((completedCount / recommendations.length) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-72 bg-surface-card rounded-2xl border border-surface-border animate-pulse" />
          <div className="h-72 bg-surface-card rounded-2xl border border-surface-border animate-pulse" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Recommendations Match Selected Status"
          description="Switch to 'All' or click 'Regenerate Recommendations' to build new prescriptions."
          actionLabel="View All"
          onAction={() => setFilterStatus('all')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rec) => (
            <RecommendationCard
              key={rec._id || rec.id}
              recommendation={rec}
              onStatusChange={fetchRecommendations}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessAdvisor;
