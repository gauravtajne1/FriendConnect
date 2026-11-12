import React from "react";
import {
  LayoutDashboard,
  Users,
  Link2,
  UserCheck,
  Sparkles,
  Route,
  Network,
  Share2,
  BarChart3,
  Info,
  RotateCcw,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { id: "overview", label: "Project Overview", icon: Info, badge: null },
  { id: "users", label: "Users", icon: Users, badge: "O(1)" },
  { id: "friendships", label: "Friendships", icon: Link2, badge: "Edges" },
  { id: "mutual", label: "Mutual Friends", icon: UserCheck, badge: "Set ∩" },
  { id: "suggestions", label: "Suggestions", icon: Sparkles, badge: "2-Hop" },
  { id: "shortest-path", label: "Shortest Path", icon: Route, badge: "BFS" },
  { id: "communities", label: "Communities", icon: Network, badge: "DFS" },
  { id: "manager", label: "Network Manager", icon: Network, badge: null },
  { id: "hashtable", label: "Hash Table Search", icon: Share2, badge: null },
  {
    id: "bfsdfs",
    label: "BFS/DFS Visualisation",
    icon: RotateCcw,
    badge: null,
  },
  { id: "benchmarks", label: "Benchmarks", icon: BarChart3, badge: null },
  {
    id: "graph-viz",
    label: "Graph Visualization",
    icon: Share2,
    badge: "Interactive",
  },
  {
    id: "analysis",
    label: "Algorithm Analysis",
    icon: BarChart3,
    badge: "DAA",
  },
  { id: "about", label: "About Project", icon: Info, badge: null },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  stats,
  onResetGraph,
  isMobileOpen,
  setIsMobileOpen,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-sm ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* App Branding */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                FriendConnect
              </h1>
              <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                Graph Algorithm Analysis
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            DAA Algorithm Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? "bg-indigo-700/80 text-white"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Graph Quick Info & Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 space-y-3">
          {stats && (
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-600 space-y-1.5 shadow-sm">
              <div className="flex justify-between">
                <span>Vertices (Users):</span>
                <span className="font-mono text-indigo-600 font-bold">
                  {stats.num_users}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Edges (Friendships):</span>
                <span className="font-mono text-emerald-600 font-bold">
                  {stats.num_friendships}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Communities:</span>
                <span className="font-mono text-amber-600 font-bold">
                  {stats.num_components || 3}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onResetGraph}
              title="Reset graph to default 9-user sample network"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              Reset Dataset
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] font-medium text-slate-400">
              DAA Mini-Project • B.Tech CSE
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
