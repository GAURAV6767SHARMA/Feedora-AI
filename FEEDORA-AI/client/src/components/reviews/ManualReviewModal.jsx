import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Star, Loader2 } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

export const ManualReviewModal = ({ isOpen, onClose, businessId, onReviewAdded, onReviewCreated }) => {
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState('Google');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error('Review text is required');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.createReview({
        businessId,
        reviewText: reviewText.trim(),
        rating,
        source,
        date: new Date()
      });
      toast.success('Review added successfully!');
      setReviewText('');
      setRating(5);
      if (onReviewAdded) onReviewAdded();
      if (onReviewCreated) onReviewCreated();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer Review Manually">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">Rating (1 to 5 Stars)</label>
          <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:scale-110 active:scale-95"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-3 text-xs font-semibold text-amber-600 font-tabular">{rating}.0 / 5.0</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">Customer Review Feedback</label>
          <textarea
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Type customer review or transcribed comment..."
            className="w-full p-3 rounded-xl border border-stone-200 bg-white text-xs text-text-primary placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none leading-relaxed"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1.5">Review Channel / Source</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
          >
            <option value="Google">Google Reviews</option>
            <option value="Swiggy">Swiggy Order Feedback</option>
            <option value="Zomato">Zomato Dining Review</option>
            <option value="Instagram">Instagram DM / Comment</option>
            <option value="Walk-in">Walk-in Direct Feedback</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{submitting ? 'Adding...' : 'Save Review'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ManualReviewModal;
