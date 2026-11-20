import React, { useState } from 'react';
import Modal from '../common/Modal';
import { Calculator, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import { experimentService } from '../../services/experimentService';
import toast from 'react-hot-toast';

export const DemandExperimentModal = ({ signal, businessId, isOpen, onClose, onLaunched }) => {
  const [sellingPrice, setSellingPrice] = useState(250);
  const [unitCost, setUnitCost] = useState(80);
  const [dailyVolume, setDailyVolume] = useState(15);
  const [durationDays, setDurationDays] = useState(14);
  const [launching, setLaunching] = useState(false);

  if (!signal) return null;

  const unitProfit = Math.max(0, sellingPrice - unitCost);
  const monthlyRevenue = dailyVolume * sellingPrice * 30;
  const monthlyProfit = dailyVolume * unitProfit * 30;
  const marginPct = sellingPrice > 0 ? Math.round((unitProfit / sellingPrice) * 100) : 0;
  const pilotRevenue = dailyVolume * sellingPrice * durationDays;

  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await experimentService.createExperiment({
        businessId,
        demandSignalTitle: signal.title,
        hypothesis: `Piloting ${signal.title} for ${durationDays} days based on ${signal.uniqueReviews} customer review requests.`,
        projectedCost: dailyVolume * unitCost * durationDays,
        projectedRevenue: pilotRevenue,
        durationDays
      });
      toast.success(`14-Day Pilot for "${signal.title}" launched successfully!`);
      if (onLaunched) onLaunched();
      onClose();
    } catch (err) {
      toast.error('Failed to launch experiment: ' + err.message);
    } finally {
      setLaunching(false);
    }
  };

  const applyPreset = (price, cost, vol) => {
    setSellingPrice(price);
    setUnitCost(cost);
    setDailyVolume(vol);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Demand Radar™ — ROI Simulator & Pilot Launcher">
      <div className="space-y-5">
        {/* Signal Header */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-800">Target Demand Signal</span>
            <span className="text-xs font-bold text-amber-900 font-tabular">Opportunity Score: {signal.demandScore}/100</span>
          </div>
          <h4 className="text-sm font-semibold text-text-primary">{signal.title}</h4>
          <p className="text-xs text-stone-600 mt-1">
            Backed by {signal.uniqueReviews} unique reviewers ({signal.totalMentions} mentions) across customer feedback.
          </p>
        </div>

        {/* Quick Industry Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-semibold text-stone-500 uppercase">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(250, 80, 15)}
            className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors shadow-sm"
          >
            F&B / Cafe
          </button>
          <button
            type="button"
            onClick={() => applyPreset(150, 45, 25)}
            className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors shadow-sm"
          >
            Grocery / Market
          </button>
          <button
            type="button"
            onClick={() => applyPreset(2500, 600, 3)}
            className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors shadow-sm"
          >
            Salon / Spa
          </button>
          <button
            type="button"
            onClick={() => applyPreset(1200, 500, 5)}
            className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-medium transition-colors shadow-sm"
          >
            Boutique Retail
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1">Selling Price (₹)</label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary font-tabular"
              min={1}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1">Cost Per Unit (₹)</label>
            <input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary font-tabular"
              min={0}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-text-secondary mb-1">Est. Daily Units</label>
            <input
              type="number"
              value={dailyVolume}
              onChange={(e) => setDailyVolume(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-900 focus:outline-none focus:ring-1 focus:ring-primary font-tabular"
              min={1}
            />
          </div>
        </div>

        {/* Live Projections Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-stone-700 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-primary" /> Commercial Opportunity Model
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-tabular">
              {marginPct}% Gross Margin
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-stone-500 font-semibold block uppercase tracking-wider">{durationDays}-Day Pilot Revenue</span>
              <span className="text-xl font-bold text-stone-900 font-tabular">
                ₹{pilotRevenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 font-semibold block uppercase tracking-wider">Projected Monthly Net Profit</span>
              <span className="text-xl font-bold text-emerald-700 font-tabular">
                ₹{monthlyProfit.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-2 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            disabled={launching}
            className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4 text-white" />
            <span>{launching ? 'Launching...' : `Launch ${durationDays}-Day Pilot`}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DemandExperimentModal;
