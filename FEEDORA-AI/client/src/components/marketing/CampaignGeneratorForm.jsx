import React, { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';

export const CampaignGeneratorForm = ({ business, onGenerate, generating }) => {
  const [platform, setPlatform] = useState('Instagram');
  const [language, setLanguage] = useState('English');
  const [tone, setTone] = useState('Warm & Engaging');
  const [objective, setObjective] = useState('Drive Weekend Family Diners');
  const [selectedInsight, setSelectedInsight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({
      businessId: business._id || business.id,
      platform,
      language,
      tone,
      objective,
      selectedInsight
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 shadow-card space-y-4 relative">
      <div className="flex items-center gap-2.5 pb-3 border-b border-surface-border">
        <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Campaign Creative Engine</h3>
          <p className="text-xs text-text-secondary">AI marketing copy generated strictly from real customer reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Platform */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">Target Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="Instagram">Instagram (Post & Caption)</option>
            <option value="WhatsApp">WhatsApp (Direct Broadcast)</option>
            <option value="Facebook">Facebook (Community Update)</option>
            <option value="Reels">Reels / Shorts (Video Script Hook)</option>
          </select>
        </div>

        {/* Language */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">Audience Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Hinglish">Hinglish (Natural Conversational)</option>
            <option value="Hindi">Hindi (Devanagari Authentic)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tone */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">Brand Voice & Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="Warm & Engaging">Warm & Engaging</option>
            <option value="Playful & Trendy">Playful & Trendy</option>
            <option value="Premium & Sophisticated">Premium & Sophisticated</option>
            <option value="Urgent Limited Offer">Urgent Limited Offer</option>
            <option value="Apologetic & Reassuring">Apologetic & Reassuring (Post-Friction)</option>
          </select>
        </div>

        {/* Campaign Objective */}
        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">Campaign Objective</label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. Promote weekend special menu..."
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-primary mb-1">
          Anchor Customer Praise or Demand Signal (Optional)
        </label>
        <input
          type="text"
          value={selectedInsight}
          onChange={(e) => setSelectedInsight(e.target.value)}
          placeholder="e.g. Customer praise for authentic Dal Makhani, or request for Iced Matcha Latte"
          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={generating}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-white" />}
          <span>{generating ? 'Crafting Marketing Campaign...' : 'Generate Grounded Campaign'}</span>
        </button>
      </div>
    </form>
  );
};

export default CampaignGeneratorForm;
