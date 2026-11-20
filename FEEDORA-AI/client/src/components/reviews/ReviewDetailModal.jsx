import React, { useState } from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import {
  Star,
  AlertCircle,
  ThumbsUp,
  Sparkles,
  Hash,
  Copy,
  Check,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

export const ReviewDetailModal = ({ review, isOpen, onClose, onReplySaved }) => {
  const [drafting, setDrafting] = useState(false);
  const [replyText, setReplyText] = useState(review?.ownerReply || '');
  const [selectedTone, setSelectedTone] = useState(
    review?.rating <= 2 ? 'Empathetic & Solution-Oriented' : 'Warm & Grateful'
  );
  const [copied, setCopied] = useState(false);
  const [savingReply, setSavingReply] = useState(false);

  // Sync state when review changes
  React.useEffect(() => {
    if (review) {
      setReplyText(review.ownerReply || '');
      setSelectedTone(review.rating <= 2 ? 'Empathetic & Solution-Oriented' : 'Warm & Grateful');
      setCopied(false);
    }
  }, [review]);

  if (!review) return null;

  const sentimentVariant = {
    positive: 'positive',
    negative: 'negative',
    neutral: 'teal',
    mixed: 'purple',
    unprocessed: 'neutral'
  }[review.sentiment] || 'neutral';

  const handleDraftReply = async () => {
    setDrafting(true);
    const toastId = toast.loading('Drafting tailored owner reply with Gemini AI...');
    try {
      const res = await reviewService.draftReply(review._id || review.id, selectedTone);
      if (res.success && res.data.replyText) {
        setReplyText(res.data.replyText);
        toast.success('AI reply drafted! Review or edit before copying.', { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to draft reply', { id: toastId });
    } finally {
      setDrafting(false);
    }
  };

  const handleCopyReply = () => {
    if (!replyText) return;
    navigator.clipboard.writeText(replyText);
    setCopied(true);
    toast.success('Owner reply copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveReply = async () => {
    if (!replyText.trim()) return;
    setSavingReply(true);
    try {
      const res = await reviewService.saveReply(review._id || review.id, replyText);
      if (res.success) {
        toast.success('Reply saved to review record!');
        if (onReplySaved) onReplySaved();
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save reply');
    } finally {
      setSavingReply(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Customer Review Intelligence & Action Center" maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Top Summary Card */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1E1E28] border border-stone-200 dark:border-[#2C2C3A] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= (review.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300 dark:text-stone-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-text-primary dark:text-stone-100 font-tabular">
                {review.rating ? `${review.rating}.0` : '5.0'} Rating
              </span>
              {review.customerName && (
                <span className="text-xs text-text-secondary dark:text-stone-400 font-medium ml-1">
                  • {review.customerName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={sentimentVariant} size="sm" className="capitalize">
                {review.sentiment || 'Positive'}
              </Badge>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium">
                {review.source || 'Direct Verified'}
              </span>
            </div>
          </div>

          {/* Original Customer Review Text */}
          <div className="pt-2 border-t border-stone-200/70 dark:border-[#2C2C3A]">
            <label className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider block mb-1">
              Customer Feedback
            </label>
            <p className="text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-relaxed font-serif italic bg-white dark:bg-[#161620] p-3.5 rounded-lg border border-stone-200/80 dark:border-stone-800">
              "{review.reviewText || review.text || review.comment || 'Detailed customer feedback recorded in system.'}"
            </p>
          </div>
        </div>

        {/* AI Extracted Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Complaints */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20">
            <h5 className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1.5 mb-2">
              <AlertCircle className="w-3.5 h-3.5" /> Detected Complaints
            </h5>
            {Array.isArray(review.complaints) && review.complaints.length > 0 ? (
              <ul className="space-y-1">
                {review.complaints.map((c, i) => (
                  <li key={i} className="text-xs text-stone-800 dark:text-stone-200 font-medium list-disc list-inside">
                    {c}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 italic">No operational friction points or complaints identified.</p>
            )}
          </div>

          {/* Preferences */}
          <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/20">
            <h5 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-2">
              <ThumbsUp className="w-3.5 h-3.5" /> Customer Preferences & Praise
            </h5>
            {Array.isArray(review.preferences) && review.preferences.length > 0 ? (
              <ul className="space-y-1">
                {review.preferences.map((p, i) => (
                  <li key={i} className="text-xs text-stone-800 dark:text-stone-200 font-medium list-disc list-inside">
                    {p}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-stone-500 dark:text-stone-400 italic">Positive general experience recorded.</p>
            )}
          </div>
        </div>

        {/* AI Feature Requests & Demands */}
        {Array.isArray(review.featureRequests) && review.featureRequests.length > 0 && (
          <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/20">
            <h5 className="text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Customer Desires & Emerging Demands
            </h5>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {review.featureRequests.map((req, i) => (
                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-md bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300">
                  {req}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Reply Generator Section */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#1E1E28] border border-stone-200 dark:border-[#2C2C3A] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs font-semibold text-text-primary dark:text-stone-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> AI Owner Reply Generator
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-text-primary dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="Empathetic & Solution-Oriented">Empathetic & Solution-Oriented</option>
                <option value="Warm & Grateful">Warm & Grateful</option>
                <option value="Professional & Courteous">Professional & Courteous</option>
                <option value="Enthusiastic & Promotional">Enthusiastic & Promotional</option>
              </select>

              <button
                onClick={handleDraftReply}
                disabled={drafting}
                className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
              >
                {drafting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-white" />}
                Draft Reply
              </button>
            </div>
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="AI-generated owner response will appear here for review and editing..."
            rows={3}
            className="w-full p-3 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-[#161620] text-xs text-text-primary dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none leading-relaxed"
          />

          {replyText && (
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={handleCopyReply}
                className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                {copied ? 'Copied' : 'Copy Response'}
              </button>

              <button
                onClick={handleSaveReply}
                disabled={savingReply}
                className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 active:scale-95"
              >
                {savingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Save to Review
              </button>
            </div>
          )}
        </div>

        {/* Audit Hash Footer */}
        {review.reviewHash && (
          <div className="flex items-center justify-between text-[10px] text-stone-500 dark:text-stone-400 pt-2 border-t border-stone-200 dark:border-stone-800">
            <span className="flex items-center gap-1 font-mono">
              <Hash className="w-3 h-3 text-stone-400" /> SHA-256 Ground Truth: {review.reviewHash.slice(0, 16)}...
            </span>
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verifiable Customer Data
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
