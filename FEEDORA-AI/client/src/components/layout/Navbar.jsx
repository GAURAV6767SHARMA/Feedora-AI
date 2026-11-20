import React, { useState } from 'react';
import {
  Menu,
  ChevronDown,
  Sparkles,
  UtensilsCrossed,
  Scissors,
  Shirt,
  Store,
  Check
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';
import { analysisService } from '../../services/analysisService';
import { DarkModeToggle } from '../common/DarkModeToggle';
import { useDarkMode } from '../../hooks/useDarkMode';
import toast from 'react-hot-toast';

export const Navbar = ({ setMobileOpen }) => {
  const { currentBusiness, businesses, switchBusiness, triggerRefresh, loadDemoDataset } = useBusiness();
  const [analyzing, setAnalyzing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useDarkMode();

  const handleRunAnalysis = async () => {
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setAnalyzing(true);
    const loadingToast = toast.loading('Running Gemini AI Review Analysis & Demand Scoring...');
    try {
      const res = await analysisService.runAnalysis(businessId, true);
      toast.success(res.message || 'AI Review Analysis Complete!', { id: loadingToast });
      triggerRefresh();
    } catch (err) {
      toast.error(`Analysis failed: ${err.message}`, { id: loadingToast });
    } finally {
      setAnalyzing(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'salon':
        return <Scissors className="w-3.5 h-3.5 text-stone-600" />;
      case 'clothing':
      case 'boutique':
        return <Shirt className="w-3.5 h-3.5 text-stone-600" />;
      default:
        return <UtensilsCrossed className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-surface-border px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Business Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-canvas-subtle lg:hidden transition-colors focus-glow"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Business Selector Dropdown */}
        <div className="relative">
          <button
            aria-label="Switch business"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-surface-border bg-white hover:bg-canvas-subtle hover:border-stone-300 transition-all text-left shadow-subtle group"
          >
            <div className="w-6 h-6 rounded-md bg-primary-light border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <Store className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                <span className="truncate max-w-[130px] sm:max-w-[200px]">{currentBusiness?.name || 'Select Business'}</span>
                <ChevronDown className="w-3 h-3 text-text-muted group-hover:text-text-primary transition-colors" />
              </div>
              <div className="text-[10px] text-text-secondary capitalize truncate">
                {currentBusiness?.location || 'Bangalore'} • {currentBusiness?.category || 'restaurant'}
              </div>
            </div>
          </button>

          {dropdownOpen && (
            <>
              <div
                aria-label="Close business selector"
                className="fixed inset-0 z-20"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-elevated border border-surface-border py-1.5 z-30 animate-scaleIn duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-surface-border">
                  Switch Active Business
                </div>
                <div className="py-1 max-h-64 overflow-y-auto">
                  {businesses.map((b) => {
                    const isSelected = (currentBusiness?._id || currentBusiness?.id) === (b._id || b.id);
                    return (
                      <button
                        key={b._id || b.id}
                        onClick={() => {
                          switchBusiness(b._id || b.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-canvas-subtle transition-colors ${
                          isSelected
                            ? 'font-bold text-primary bg-primary-light'
                            : 'text-text-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getCategoryIcon(b.category)}
                          <div className="truncate">
                            <div className="truncate font-semibold text-text-primary">{b.name}</div>
                            <div className="text-[10px] text-text-muted capitalize">{b.location} • {b.category}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />

        {/* Quick Demo Dataset Switcher Buttons */}
        <div className="hidden md:flex items-center gap-1 bg-canvas-subtle p-1 rounded-lg border border-surface-border text-xs">
          <span className="text-[10px] font-bold text-text-muted px-2 uppercase tracking-wider">Presets:</span>
          <button
            onClick={() => loadDemoDataset('restaurant')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-stone-50 text-text-secondary hover:text-text-primary border border-surface-border transition-all text-xs font-medium shadow-subtle"
            title="Load Restaurant Demo Dataset"
          >
            <UtensilsCrossed className="w-3 h-3 text-stone-600" />
            <span>Bistro</span>
          </button>
          <button
            onClick={() => loadDemoDataset('salon')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-stone-50 text-text-secondary hover:text-text-primary border border-surface-border transition-all text-xs font-medium shadow-subtle"
            title="Load Salon Demo Dataset"
          >
            <Scissors className="w-3 h-3 text-stone-600" />
            <span>Salon</span>
          </button>
          <button
            onClick={() => loadDemoDataset('clothing')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white hover:bg-stone-50 text-text-secondary hover:text-text-primary border border-surface-border transition-all text-xs font-medium shadow-subtle"
            title="Load Clothing Demo Dataset"
          >
            <Shirt className="w-3 h-3 text-stone-600" />
            <span>Apparel</span>
          </button>
        </div>

        {/* Run AI Analysis CTA */}
        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-subtle active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Sparkles className={`w-3.5 h-3.5 text-white ${analyzing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{analyzing ? 'Analyzing Reviews...' : 'Run AI Analysis'}</span>
          <span className="sm:hidden">{analyzing ? '...' : 'Analyze'}</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
