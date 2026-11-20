import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Radar,
  MessageSquareText,
  Lightbulb,
  Megaphone,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  UtensilsCrossed,
  Store,
  Zap,
  Users,
  Quote,
  Star,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { DarkModeToggle } from '../components/common/DarkModeToggle';
import { useDarkMode } from '../hooks/useDarkMode';

export const Landing = () => {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <div className="min-h-screen bg-canvas text-text-primary selection:bg-primary/20 selection:text-primary font-sans">
      {/* Top Editorial Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/feedora-icon.png" alt="Feedora AI" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-text-primary">Feedora</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200 font-mono">
                AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-stone-600">
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors">How It Works</a>
            <a href="#demand-radar" className="hover:text-stone-900 transition-colors">Demand Radar™</a>
            <a href="#features" className="hover:text-stone-900 transition-colors">Platform Capabilities</a>
            <a href="#comparison" className="hover:text-stone-900 transition-colors">Why Star Ratings Fail</a>
          </nav>

          <div className="flex items-center gap-3">
            <DarkModeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all duration-150 flex items-center gap-1.5 group active:scale-95"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Customer Intelligence for Independent Commerce</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-text-primary tracking-tight leading-[1.12]">
            Turn customer feedback into <br className="hidden sm:inline" />
            <span className="font-editorial italic font-normal text-primary">measurable commercial growth.</span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Feedora AI deconstructs messy reviews into actionable sentiment trends, predicts emerging customer demand before competitors notice, and drafts grounded multilingual marketing campaigns.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-sm transition-all duration-150 flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Explore Interactive Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/reviews"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 hover:text-stone-900 transition-all duration-150 shadow-sm"
            >
              Inspect Ingested Reviews
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Grounded in verbatim customer words
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Restaurant, Salon & Boutique datasets
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Zero hallucination SHA-256 verification
            </span>
          </div>
        </div>

        {/* Hero Visual: Editorial Photography & Live Intelligence Teaser */}
        <div className="max-w-6xl mx-auto px-6 mt-16">
          <div className="relative rounded-3xl bg-white border border-surface-border p-4 sm:p-6 shadow-elevated overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Curated Editorial Photography */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[16/10] bg-stone-100 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                  alt="Independent artisan cafe and roastery interior"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded bg-black/40 backdrop-blur-md border border-white/20">
                      Live Case Study
                    </span>
                    <h4 className="text-lg font-bold mt-2 font-editorial italic">The Spice Garden Bistro & Roastery</h4>
                    <p className="text-xs text-stone-200 mt-0.5">102 Reviews Analyzed • Indiranagar, Bangalore</p>
                  </div>
                </div>
              </div>

              {/* Feedora AI Live Intelligence Card Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                    Live Feedback Ingestion
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-tabular">
                    94% High Confidence
                  </span>
                </div>

                {/* Simulated Real Extraction */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-400">
                      {'★'.repeat(4)}{'☆'}
                    </div>
                    <span className="text-[10px] text-stone-500 font-mono">Google Reviews</span>
                  </div>
                  <p className="text-stone-700 italic leading-relaxed mb-3">
                    "The dal makhani and cold brew were spectacular, but the 45-minute wait on Saturday was frustrating. Please add oat milk lattes!"
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-200 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      + Dal Makhani (Praise)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                      − 45m Wait Time (Friction)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                      ⚡ Oat Milk Latte (Demand Signal)
                    </span>
                  </div>
                </div>

                {/* Resulting Demand Radar Score */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-stone-500 uppercase">Predicted Opportunity</span>
                    <h5 className="text-sm font-semibold text-text-primary mt-0.5">Plant-Based Oat Milk Menu</h5>
                    <p className="text-xs text-stone-500">18 mentions • Rising trend</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary font-tabular">88</span>
                    <span className="text-xs text-stone-400 block font-semibold">/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof: Independent Business Categories */}
      <section className="py-12 border-y border-surface-border bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-6">
            Engineered for physical, neighborhood retail and hospitality
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-stone-600 text-sm font-medium">
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-primary" /> Artisanal Bistros & Cafes
            </span>
            <span className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" /> Specialty Salons & Spas
            </span>
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" /> Independent Fashion Boutiques
            </span>
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Neighborhood Service Studios
            </span>
          </div>
        </div>
      </section>

      {/* The Problem & Solution Comparison */}
      <section id="comparison" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">The Flawed Paradigm</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
            Why Star Ratings Fail Independent Owners
          </h2>
          <p className="mt-3 text-sm text-stone-600 leading-relaxed">
            Star averages flatten complex customer experiences into a meaningless single digit. A 3-star review tells you someone wasn't thrilled, but conceals the operational cause.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Flawed Approach */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-card">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700 px-2.5 py-1 rounded bg-rose-50 border border-rose-200">
              Traditional Star Rating Dashboards
            </span>
            <h3 className="text-xl font-bold text-text-primary mt-4 mb-4">Guesswork & Disconnected Metrics</h3>
            <ul className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span><strong>Blunt aggregate scores:</strong> A 4.1 rating obscures whether customers love the atmosphere but hate the weekend parking bottleneck.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span><strong>Unmet revenue buried in text:</strong> Repeated customer requests for vegan choices, weekend brunch, or linen fabrics remain unnoticed.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✕</span>
                <span><strong>Copywriter fatigue:</strong> Small business owners lack the hours to craft engaging promotional captions in Hindi, Hinglish, and English every week.</span>
              </li>
            </ul>
          </div>

          {/* Feedora AI Solution */}
          <div className="p-8 rounded-3xl bg-white border border-stone-200 shadow-card relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200">
                The Feedora AI System
              </span>
              <span className="text-xs font-semibold text-primary font-tabular">Direct Impact</span>
            </div>
            <h3 className="text-xl font-bold text-text-primary mt-4 mb-4">Grounded Intelligence & Automated Action</h3>
            <ul className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span><strong>Deconstructs multi-faceted sentiment:</strong> Isolates exact complaints and praised signature items with original quoted customer evidence.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span><strong>Demand Radar™:</strong> Groups repeated customer requests and ranks them using an empirical formula (<code className="px-1 py-0.5 rounded bg-stone-100 border border-stone-200 text-stone-800 font-mono">0.4F + 0.3G + 0.3N</code>) for ROI simulation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 font-bold text-xs mt-0.5">✓</span>
                <span><strong>Authentic Multilingual Studio:</strong> Generates WhatsApp broadcasts and Instagram copy in natural Hindi, Hinglish, and English anchored to verified customer reviews.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Platform Modules Grid */}
      <section id="features" className="py-20 bg-stone-50/70 border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Core Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1.5">
              Comprehensive Intelligence for Modern Commerce
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mb-5">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">Review Ingestion & Sentiment</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Ingest CSV review datasets or receive live feedback. Automated Gemini AI tagging classifies positive, negative, neutral, and mixed customer sentiments.
              </p>
            </div>

            {/* Feature 2: Demand Radar */}
            <div id="demand-radar" className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200 relative">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center mb-5">
                <Radar className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-text-primary">Demand Radar™</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Differentiator
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Detects repeated customer desires (vegan desserts, chemical-free spa treatments, plus size collections) and calculates normalized 0–100 opportunity scores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mb-5">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">AI Business Advisor</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generates concrete operational prescriptions derived from real customer quotes with projected outcomes and operational constraint disclosures.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-5">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">Multilingual Marketing Studio</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Generate authentic social captions and WhatsApp broadcasts in English, Hindi, and Hinglish grounded directly in real customer reviews.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-5">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">Growth & Action Tracker</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Track implemented recommendations against before-and-after sentiment deltas and complaint resolution metrics over time.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-stone-200 shadow-card hover:border-primary/50 transition-all duration-200">
              <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">SHA-256 Verifiable Ground Truth</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Every insight, quote, and sentiment trend is cryptographically anchored to original customer words to prevent AI hallucinations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-white border-t border-surface-border">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-text-primary tracking-tight">
            Ready to experience Feedora AI?
          </h2>
          <p className="mt-4 text-base text-stone-600 max-w-xl mx-auto leading-relaxed">
            Test the live demo with pre-loaded restaurant, salon, and boutique datasets. No signups or setup required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-sm transition-all duration-150 flex items-center gap-2 group active:scale-95"
            >
              <span>Launch Demo Workspace</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-surface-border py-10 bg-canvas text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">Feedora AI</span>
            <span>• Customer Intelligence for Local Commerce</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/demand" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Demand Radar™
            </Link>
            <Link to="/advisor" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Business Advisor
            </Link>
            <Link to="/marketing" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Marketing Studio
            </Link>
            <Link to="/settings" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Settings & Datasets
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;