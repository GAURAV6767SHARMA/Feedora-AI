import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { reviewService } from '../services/reviewService';
import { analysisService } from '../services/analysisService';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewUploadModal from '../components/reviews/ReviewUploadModal';
import ManualReviewModal from '../components/reviews/ManualReviewModal';
import ReviewDetailModal from '../components/reviews/ReviewDetailModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import {
  Search,
  Upload,
  Plus,
  Sparkles,
  Filter,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

export const ReviewIntelligence = () => {
  const { currentBusiness, refreshTrigger, triggerRefresh } = useBusiness();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [sentiment, setSentiment] = useState('all');
  const [source, setSource] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 12 });

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const fetchReviews = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setLoading(true);
    try {
      const res = await reviewService.getReviews({
        businessId,
        search,
        sentiment,
        source,
        sort,
        page,
        limit: 12
      });

      if (res.success) {
        setReviews(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentBusiness, search, sentiment, source, sort, page, refreshTrigger]);

  const handleRunAnalysis = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setAnalyzing(true);
    const toastId = toast.loading('Running Gemini AI Review Ingestion & Extraction...');
    try {
      const res = await analysisService.runAnalysis(businessId, true);
      toast.success(res.message || 'AI Review Analysis Complete!', { id: toastId });
      triggerRefresh();
    } catch (err) {
      toast.error(err.message || 'Analysis failed', { id: toastId });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn duration-200">
      {/* Header and Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">Review Intelligence</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Ingest, search, filter and inspect deep AI extractions across all customer channels
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setManualOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Review</span>
          </button>

          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-all shadow-sm active:scale-95"
          >
            <Upload className="w-4 h-4 text-stone-600" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 active:scale-95"
          >
            <Sparkles className={`w-3.5 h-3.5 text-white ${analyzing ? 'animate-spin' : ''}`} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Reviews'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-4 shadow-card flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search keywords, items, evidence..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Sentiment Filter */}
          <select
            value={sentiment}
            onChange={(e) => {
              setSentiment(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary bg-stone-50 font-medium cursor-pointer"
          >
            <option value="all">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="negative">Negative</option>
            <option value="neutral">Neutral</option>
            <option value="mixed">Mixed</option>
          </select>

          {/* Source Filter */}
          <select
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary bg-stone-50 font-medium cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="Google">Google</option>
            <option value="Swiggy">Swiggy</option>
            <option value="Zomato">Zomato</option>
            <option value="Instagram">Instagram</option>
            <option value="Walk-in">Walk-in</option>
          </select>

          {/* Sort Order */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-primary bg-stone-50 font-medium cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Review Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-surface-card rounded-2xl border border-surface-border animate-pulse p-4" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No Reviews Match Your Criteria"
          description="Try broadening your search or sentiment filters, or upload more customer feedback."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSentiment('all');
            setSource('all');
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviews.map((rev) => (
              <ReviewCard
                key={rev._id || rev.id}
                review={rev}
                onSelect={(r) => setSelectedReview(r)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-surface-border/60 text-xs text-text-secondary">
              <div>
                Showing page <span className="font-bold text-text-primary font-tabular">{pagination.page}</span> of{' '}
                <span className="font-bold text-text-primary font-tabular">{pagination.totalPages}</span> ({pagination.total} reviews)
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-raised disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 text-text-secondary" />
                </button>
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-raised disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ReviewDetailModal
        review={selectedReview}
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        onReplySaved={() => fetchReviews()}
      />

      <ReviewUploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        businessId={currentBusiness?._id || currentBusiness?.id}
        onUploadSuccess={() => fetchReviews()}
      />

      <ManualReviewModal
        isOpen={manualOpen}
        onClose={() => setManualOpen(false)}
        businessId={currentBusiness?._id || currentBusiness?.id}
        onReviewAdded={() => fetchReviews()}
        onReviewCreated={() => fetchReviews()}
      />
    </div>
  );
};

export default ReviewIntelligence;
