import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-canvas text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/25 mb-4 shadow-card">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-5xl font-black text-text-primary tracking-tight font-tabular">404</h1>
      <h2 className="text-base font-bold text-text-primary mt-2">Page Not Found</h2>
      <p className="text-xs text-text-secondary mt-1 max-w-sm mb-6 leading-relaxed">
        The customer intelligence view you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-card shadow-primary/20 transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
