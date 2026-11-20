import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, CheckCircle2, Sparkles, UtensilsCrossed, Send, Loader2, ArrowLeft } from 'lucide-react';
import { businessService } from '../services/businessService';
import { reviewService } from '../services/reviewService';
import toast, { Toaster } from 'react-hot-toast';

export const PublicFeedback = () => {
  const { businessId } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchBiz = async () => {
      setLoading(true);
      try {
        const res = await businessService.getBusinessById(businessId || 'demo-restaurant-1');
        if (res.success) {
          setBusiness(res.data);
        }
      } catch (err) {
        console.error('Failed to load business info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBiz();
  }, [businessId]);

  const ratingLabels = {
    1: 'Disappointed 😞',
    2: 'Could Be Better 😕',
    3: 'Average / Fair 😐',
    4: 'Great Experience 😊',
    5: 'Outstanding Experience! 🌟'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error('Please share a few words about your visit');
      return;
    }

    setSubmitting(true);
    try {
      await reviewService.submitPublicReview({
        businessId: businessId || 'demo-restaurant-1',
        customerName: customerName.trim() || 'Guest',
        rating,
        reviewText: reviewText.trim()
      });
      setSubmitted(true);
      toast.success('Thank you! Your feedback has been received.');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-primary/20 selection:text-primary">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#FFFFFF',
            color: '#1C1917',
            border: '1px solid #EAE8E4',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.08)'
          }
        }}
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Top Back Link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>

        {/* Brand Banner Card */}
        <div className="bg-white rounded-3xl shadow-card border border-surface-border p-6 sm:p-8 relative">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
              <UtensilsCrossed className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-text-primary tracking-tight">
              {business?.name || 'Feedora AI Partner'}
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              {business?.location || 'Neighborhood Store'} • Guest Feedback
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-semibold text-text-primary text-center mb-2">
                  How was your experience today?
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 active:scale-95 transition-all focus:outline-none"
                    >
                      <Star
                        className={`w-9 h-9 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-stone-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-center mt-2 text-xs font-bold text-primary font-tabular">
                  {ratingLabels[rating]}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul S."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary bg-stone-50"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Your Feedback & Suggestions
                </label>
                <textarea
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us what you loved or how we can improve (e.g. food taste, wait time, items you'd love to see on the menu)..."
                  className="w-full p-3.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary resize-none bg-stone-50 leading-relaxed"
                  required
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{submitting ? 'Submitting Feedback...' : 'Send Feedback to Management'}</span>
              </button>

              <div className="text-center text-[11px] text-stone-500">
                Direct feedback sent to store manager • Powered by Feedora AI
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-scaleIn duration-150">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">Thank You for Your Review!</h3>
                <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto leading-relaxed">
                  Your feedback has been securely delivered directly to {business?.name}'s management dashboard for real-time review.
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setReviewText('');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-colors"
                >
                  Submit Another Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicFeedback;
