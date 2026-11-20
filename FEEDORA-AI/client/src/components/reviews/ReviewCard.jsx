import React from 'react';
import { Star, AlertCircle, ThumbsUp, Sparkles, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';

export const ReviewCard = ({ review, onSelect }) => {
  const sentimentVariant = {
    positive: 'positive',
    negative: 'negative',
    neutral: 'teal',
    mixed: 'purple',
    unprocessed: 'neutral'
  }[review.sentiment] || 'neutral';

  const formattedDate = review.date ? new Date(review.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Recent';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Inspect review by ${review.customerName || 'customer'}, rating ${review.rating || 5} stars`}
      onClick={() => onSelect(review)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(review);
        }
      }}
      className="bg-white rounded-2xl border border-surface-border hover:border-primary/50 hover:bg-stone-50/50 p-5 shadow-card transition-all duration-200 cursor-pointer flex flex-col justify-between group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= (review.rating || 0)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-text-primary font-tabular ml-1">
              {review.rating}.0
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-stone-600 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 font-medium">
              {review.source || 'Direct'}
            </span>
            <Badge variant={sentimentVariant} size="xs" className="capitalize">
              {review.sentiment || 'Pending'}
            </Badge>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-xs text-text-primary/90 leading-relaxed mb-3 line-clamp-3 group-hover:text-text-primary transition-colors">
          "{review.reviewText}"
        </p>

        {/* Extracted AI Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {Array.isArray(review.topics) && review.topics.slice(0, 3).map((t, idx) => (
            <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700">
              {t.name}
            </span>
          ))}
          {Array.isArray(review.complaints) && review.complaints.length > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              {review.complaints[0]}
            </span>
          )}
          {Array.isArray(review.preferences) && review.preferences.length > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ThumbsUp className="w-2.5 h-2.5" />
              {review.preferences[0]}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata and Action */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-text-muted mt-auto">
        <span className="font-tabular">{formattedDate}</span>
        <div className="flex items-center gap-1 text-primary font-semibold group-hover:translate-x-0.5 transition-transform duration-150">
          <span>Inspect</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
