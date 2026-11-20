import React, { useState, useEffect } from 'react';
import { Copy, Check, Bookmark, Share2, Sparkles, MessageCircle, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { marketingService } from '../../services/marketingService';

export const CampaignPreviewCard = ({ campaign, businessId, onSaved }) => {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editableCaption, setEditableCaption] = useState(campaign?.caption || '');

  // Synchronize caption when new campaign is generated
  useEffect(() => {
    setEditableCaption(campaign?.caption || '');
  }, [campaign?.caption]);

  const handleCopy = () => {
    const fullText = `${editableCaption}\n\n${(campaign.hashtags || []).join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Campaign copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await marketingService.saveCampaign({
        businessId,
        platform: campaign.platform || 'Instagram',
        language: campaign.language || 'English',
        tone: campaign.tone || 'Warm & Engaging',
        objective: campaign.objective || 'Social Awareness',
        caption: editableCaption,
        hashtags: campaign.hashtags || [],
        campaignIdea: campaign.campaignIdea || '',
        callToAction: campaign.callToAction || '',
        contentRationale: campaign.contentRationale || '',
        status: 'saved'
      });
      toast.success('Campaign saved to library!');
      if (onSaved) onSaved();
    } catch (err) {
      toast.error('Failed to save campaign');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4 relative">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-surface-border">
        <div className="flex items-center gap-2.5">
          {campaign.platform === 'WhatsApp' ? (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <MessageCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
              <Instagram className="w-4 h-4" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-semibold text-text-primary">{campaign.platform} Creative Preview</h4>
            <span className="text-[10px] text-stone-500 font-medium">
              {campaign.language} • {campaign.tone}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-xs font-semibold transition-colors shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 active:scale-95"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save to Library'}</span>
          </button>
        </div>
      </div>

      {/* Big Strategic Concept */}
      {campaign.campaignIdea && (
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <span className="text-[10px] uppercase font-semibold text-amber-800 tracking-wider block mb-1">
            Creative Strategic Hook
          </span>
          <p className="text-xs text-stone-700 leading-relaxed">
            {campaign.campaignIdea}
          </p>
        </div>
      )}

      {/* Editable Caption Area */}
      <div>
        <label className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider block mb-1">
          Post Copy & Caption (Editable)
        </label>
        <textarea
          value={editableCaption}
          onChange={(e) => setEditableCaption(e.target.value)}
          rows={6}
          className="w-full p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none font-sans"
        />
      </div>

      {/* Hashtags */}
      {Array.isArray(campaign.hashtags) && campaign.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {campaign.hashtags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
        </div>
      )}

      {/* Grounding Explanation */}
      {campaign.contentRationale && (
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
          <span className="font-semibold text-primary inline-block">Customer Grounding: </span>
          <span className="ml-1 text-stone-600">{campaign.contentRationale}</span>
        </div>
      )}
    </div>
  );
};

export default CampaignPreviewCard;
