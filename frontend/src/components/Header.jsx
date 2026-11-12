import React from 'react';
import { Menu, Share2, Sparkles, RefreshCw } from 'lucide-react';

export default function Header({
  activeTabTitle,
  stats,
  loading,
  onRefresh,
  setIsMobileOpen
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold">
              <span>DAA Mini Project</span>
              <span className="text-slate-300">/</span>
              <span className="text-slate-500 font-normal">Undirected Social Graph</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {activeTabTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden sm:flex items-center gap-2.5 bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-xs">
              <span>V: <strong className="text-indigo-600 font-mono font-bold">{stats.num_users}</strong></span>
              <span className="text-slate-300">|</span>
              <span>E: <strong className="text-emerald-600 font-mono font-bold">{stats.num_friendships}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Components: <strong className="text-amber-600 font-mono font-bold">{stats.num_components || 3}</strong></span>
            </div>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            title="Refresh graph data from backend"
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 transition border border-slate-200 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
