import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquareText,
  Radar,
  Lightbulb,
  Megaphone,
  TrendingUp,
  Settings,
  Store,
  ChevronRight,
  Sparkles,
  Compass
} from 'lucide-react';
import { useBusiness } from '../../context/BusinessContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { currentBusiness } = useBusiness();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Review Intelligence', path: '/reviews', icon: MessageSquareText },
    { name: 'Demand Radar', path: '/demand', icon: Radar, badge: 'Intelligence' },
    { name: 'Business Advisor', path: '/advisor', icon: Lightbulb },
    { name: 'Marketing Studio', path: '/marketing', icon: Megaphone },
    { name: 'Growth Tracker', path: '/growth', icon: TrendingUp },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          aria-label="Close mobile navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-sm lg:hidden transition-opacity duration-200"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-surface-border text-text-primary flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-surface-border bg-white dark:bg-[#16161D]">
          <div className="flex items-center gap-2.5">
            <img src="/feedora-icon.png" alt="Feedora AI" className="w-8 h-8 object-contain rounded-lg shadow-sm" />
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight text-text-primary dark:text-[#F4F2ED] flex items-center gap-1.5">
                <span>Feedora</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary-light text-primary border border-primary/20 font-mono">
                  AI
                </span>
              </div>
              <div className="text-[11px] text-text-secondary dark:text-stone-400 font-medium truncate">
                Customer Intelligence
              </div>
            </div>
          </div>
        </div>

        {/* Active Business Banner */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-canvas-subtle border border-surface-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-surface-border text-primary flex items-center justify-center flex-shrink-0 shadow-subtle">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-text-primary truncate">
                {currentBusiness?.name || 'Feedora Partner'}
              </div>
              <div className="text-[11px] text-text-secondary capitalize truncate">
                {currentBusiness?.category || 'restaurant'} • {currentBusiness?.location || 'Bangalore'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Workspace
        </div>
        <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-primary-light text-primary font-semibold border border-primary/20 shadow-subtle'
                      : 'text-text-secondary hover:text-text-primary hover:bg-canvas-subtle border border-transparent transition-colors'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-transform duration-150 group-hover:scale-105 ${
                        isActive ? 'text-primary' : 'text-text-muted group-hover:text-text-primary'
                      }`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Engine Indicator */}
        <div className="p-3 border-t border-surface-border bg-white">
          <div className="bg-canvas-subtle rounded-xl p-3 border border-surface-border">
            <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Engine Active</span>
              </span>
              <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-white border border-primary/20">
                Gemini 1.5
              </span>
            </div>
            <p className="mt-1.5 text-[11px] text-text-secondary leading-relaxed">
              Transforming raw reviews into revenue growth for independent merchants.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
