import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { businessService } from '../services/businessService';
import {
  Settings as SettingsIcon,
  Store,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  Scissors,
  Shirt,
  ShieldCheck,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { currentBusiness, refreshBusinesses, loadDemoDataset } = useBusiness();
  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurant',
    location: '',
    preferredLanguage: 'English',
    description: ''
  });
  const [saving, setSaving] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    if (currentBusiness) {
      setFormData({
        name: currentBusiness.name || '',
        category: currentBusiness.category || 'restaurant',
        location: currentBusiness.location || '',
        preferredLanguage: currentBusiness.preferredLanguage || 'English',
        description: currentBusiness.description || ''
      });
    }
  }, [currentBusiness]);

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await businessService.getHealth();
      setHealthStatus(res);
    } catch (err) {
      console.error('Health check failed:', err);
      setHealthStatus({ status: 'error', error: err.message });
    } finally {
      setCheckingHealth(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentBusiness?._id && !currentBusiness?.id) return;
    const businessId = currentBusiness._id || currentBusiness.id;
    setSaving(true);
    try {
      await businessService.updateBusiness(businessId, formData);
      toast.success('Business profile updated successfully!');
      refreshBusinesses();
    } catch (err) {
      toast.error('Failed to update business profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Are you sure you want to reset demo data? This will restore fresh synthetic records.')) {
      return;
    }
    const toastId = toast.loading('Resetting workspace to clean demo baseline...');
    try {
      await businessService.resetDemo();
      toast.success('Demo data restored successfully!', { id: toastId });
      refreshBusinesses();
    } catch (err) {
      toast.error('Failed to reset demo data', { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fadeIn duration-200">
      {/* Header */}
      <div className="pb-2 border-b border-surface-border/60">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">System & Business Settings</h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage business profile attributes, inspect AI engine connectivity, and load synthetic benchmark datasets
        </p>
      </div>

      {/* Business Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card space-y-4 relative">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-200">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary tracking-tight">Business Profile Details</h3>
            <p className="text-xs text-text-secondary">Core metadata used for tailoring AI advisor recommendations and marketing copy</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Business Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="restaurant">Restaurant / Dining</option>
              <option value="salon">Salon & Wellness Spa</option>
              <option value="clothing">Clothing & Fashion Boutique</option>
              <option value="cafe">Cafe / Bakery</option>
              <option value="retail">General Retail</option>
              <option value="services">Local Services</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Indiranagar, Bangalore"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Preferred Language</label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-primary mb-1">Business Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your specialties, target customers, and atmosphere..."
            className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* Synthetic Benchmark Datasets Loader */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card space-y-4">
        <div className="pb-3 border-b border-stone-200">
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">One-Click Synthetic Demo Datasets</h3>
          <p className="text-xs text-text-secondary mt-0.5">Instant multi-industry testing with pre-loaded realistic reviews, complaints, and demand signals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => loadDemoDataset('restaurant')}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-primary/50 hover:bg-white text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                <UtensilsCrossed className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-text-primary">The Spice Garden Bistro</div>
                <div className="text-[10px] text-stone-500">Restaurant (102 Reviews)</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Includes delivery delays, AC cooling issues, vegan dessert demand, and morning breakfast requests.
            </p>
          </button>

          <button
            type="button"
            onClick={() => loadDemoDataset('salon')}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-primary/50 hover:bg-white text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                <Scissors className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-text-primary">Luxe Aura Hair & Spa</div>
                <div className="text-[10px] text-stone-500">Salon & Wellness (52 Reviews)</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Features appointment punctuality feedback, upselling complaints, and chemical-free organic hair spa requests.
            </p>
          </button>

          <button
            type="button"
            onClick={() => loadDemoDataset('clothing')}
            className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:border-primary/50 hover:bg-white text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-lg bg-stone-100 text-stone-800 border border-stone-200">
                <Shirt className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-text-primary">Vastra Heritage Boutique</div>
                <div className="text-[10px] text-stone-500">Apparel & Boutique (52 Reviews)</div>
              </div>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Highlights trial room queues, return policy friction, pure organic linen requests, and plus-size demand.
            </p>
          </button>
        </div>
      </div>

      {/* Backend & Engine Diagnostics Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-100 text-stone-800 border border-stone-200">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">Engine Health & API Status</h3>
              <p className="text-xs text-text-secondary">Real-time status of backend, database, and AI inference</p>
            </div>
          </div>

          <button
            onClick={checkHealth}
            disabled={checkingHealth}
            className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingHealth ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-semibold uppercase text-stone-500 block mb-1">Backend Server</span>
            <div className="flex items-center gap-1.5 font-semibold text-text-primary">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{healthStatus?.status === 'ok' ? 'Online (v1.0.0)' : 'Online / Standby'}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-semibold uppercase text-stone-500 block mb-1">Database Provider</span>
            <div className="font-semibold text-text-primary truncate" title={healthStatus?.database?.provider}>
              {healthStatus?.database?.provider || 'Dual Store Active'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-semibold uppercase text-stone-500 block mb-1">AI Engine</span>
            <div className="font-semibold text-primary truncate">
              {healthStatus?.aiProvider || 'Google Gemini 1.5 Flash'}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone: Workspace Reset */}
      <div className="bg-rose-50/50 rounded-2xl border border-rose-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-rose-800">Reset Demo Workspace</h4>
          <p className="text-xs text-stone-600 mt-0.5">
            Wipes all custom changes and restores the initial clean demo state for judging
          </p>
        </div>
        <button
          onClick={handleResetDemo}
          className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors whitespace-nowrap active:scale-95 shadow-sm"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};

export default Settings;
