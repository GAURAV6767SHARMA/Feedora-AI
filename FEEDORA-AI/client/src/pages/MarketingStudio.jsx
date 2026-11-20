import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { marketingService } from '../services/marketingService';
import CampaignGeneratorForm from '../components/marketing/CampaignGeneratorForm';
import CampaignPreviewCard from '../components/marketing/CampaignPreviewCard';
import EmptyState from '../components/common/EmptyState';
import {
  Megaphone,
  Bookmark,
  Instagram,
  MessageCircle,
  Copy,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export const MarketingStudio = () => {
  const { currentBusiness } = useBusiness();
  const [generating, setGenerating] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'saved'

  const fetchSavedCampaigns = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setLoadingSaved(true);
    try {
      const res = await marketingService.getCampaigns(businessId);
      if (res.success) {
        setSavedCampaigns(res.data);
      }
    } catch (err) {
      console.error('Failed to load saved campaigns:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    fetchSavedCampaigns();
  }, [currentBusiness]);

  const handleGenerate = async (formData) => {
    setGenerating(true);
    const toastId = toast.loading('Generating authentic campaign copy with Gemini AI...');
    try {
      const res = await marketingService.generateCampaign(formData);
      if (res.success) {
        setCurrentCampaign(res.data);
        toast.success('Campaign generated successfully!', { id: toastId });
      }
    } catch (err) {
      toast.error(err.message || 'Generation failed', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">AI Marketing Studio</h1>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              Multilingual Creative
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Generate authentic social copy in English, Hindi, and Hinglish grounded in real customer quotes
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'generator'
                ? 'bg-primary text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Studio Generator
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-primary text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Campaigns ({savedCampaigns.length})
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CampaignGeneratorForm
            business={currentBusiness}
            onGenerate={handleGenerate}
            generating={generating}
          />

          <div>
            {currentCampaign ? (
              <CampaignPreviewCard
                campaign={currentCampaign}
                businessId={currentBusiness?._id || currentBusiness?.id}
                onSaved={fetchSavedCampaigns}
              />
            ) : (
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center p-8 bg-surface-card rounded-2xl border border-dashed border-surface-border">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/25 flex items-center justify-center mb-3 shadow-card">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-text-primary">Live Campaign Canvas</h4>
                <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
                  Select your platform, language, and campaign objective to generate promotional content rooted in real reviews.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          {savedCampaigns.length === 0 ? (
            <EmptyState
              title="No Saved Campaigns"
              description="Generated campaigns saved to your library will appear here for easy publishing."
              actionLabel="Go to Campaign Generator"
              onAction={() => setActiveTab('generator')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCampaigns.map((camp) => (
                <div
                  key={camp._id || camp.id}
                  className="bg-surface-card rounded-2xl border border-surface-border p-5 shadow-card hover:border-surface-border-light transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-surface-border/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {camp.platform}
                      </span>
                      <span className="text-[10px] text-text-secondary px-2 py-0.5 rounded-full bg-surface-subtle border border-surface-border font-medium">
                        {camp.language}
                      </span>
                    </div>
                    <p className="text-xs text-text-primary line-clamp-4 leading-relaxed mb-3">
                      "{camp.caption}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs text-text-secondary">
                    <span>{camp.tone}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(camp.caption);
                        toast.success('Caption copied!');
                      }}
                      className="text-primary hover:text-primary-hover font-semibold transition-colors"
                    >
                      Copy Caption
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MarketingStudio;
