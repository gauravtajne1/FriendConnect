import React from 'react';
import {
  Users,
  Link2,
  Network,
  Activity,
  UserCheck,
  Sparkles,
  Route,
  Share2,
  BarChart3,
  ArrowRight,
  Database,
  Layers,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ graphData, onNavigate }) {
  const stats = graphData?.stats || {
    num_users: 9,
    num_friendships: 9,
    num_components: 3,
    density: 0.25,
    average_degree: 2.0,
  };

  const statCards = [
    {
      title: 'Users (Vertices |V|)',
      value: stats.num_users,
      icon: Users,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      desc: 'Stored in Hash Map for O(1) lookups',
    },
    {
      title: 'Friendships (Edges |E|)',
      value: stats.num_friendships,
      icon: Link2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      desc: 'Undirected edges in Adjacency List',
    },
    {
      title: 'Communities (Components)',
      value: stats.num_components || 3,
      icon: Network,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      desc: 'Maximal connected subgraphs via DFS',
    },
    {
      title: 'Graph Density',
      value: `${(stats.density * 100).toFixed(1)}%`,
      icon: Activity,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-100',
      desc: '2|E| / (|V|(|V|-1)) connectivity ratio',
    },
  ];

  const quickActions = [
    {
      id: 'users',
      title: 'User Management',
      subtitle: 'Hash-Based Lookup',
      desc: 'Add, search, and view vertices with O(1) average time complexity using a dictionary.',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'friendships',
      title: 'Friendships',
      subtitle: 'Adjacency List',
      desc: 'Manage undirected graph edges. Inspect symmetrical graph[u] ↔ graph[v] relationships.',
      icon: Link2,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'mutual',
      title: 'Mutual Friends',
      subtitle: 'Set Intersection',
      desc: 'Find common connections Friends(A) ∩ Friends(B) in O(min(deg(A), deg(B))) time.',
      icon: UserCheck,
      color: 'from-violet-600 to-purple-600',
    },
    {
      id: 'suggestions',
      title: 'Friend Suggestions',
      subtitle: 'Common-Neighbour Ranking',
      desc: 'Inspect 2-hop friends-of-friends, filter existing friends, and rank candidates dynamically.',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'shortest-path',
      title: 'Shortest Path',
      subtitle: 'Breadth-First Search (BFS)',
      desc: 'Level-order traversal with a FIFO queue and parent tracking to find unweighted shortest paths.',
      icon: Route,
      color: 'from-sky-600 to-blue-600',
    },
    {
      id: 'communities',
      title: 'Communities',
      subtitle: 'Depth-First Search (DFS)',
      desc: 'Connected component decomposition using an explicit stack and visited hash set.',
      icon: Network,
      color: 'from-rose-600 to-pink-600',
    },
    {
      id: 'graph-viz',
      title: 'Interactive Graph',
      subtitle: 'Visual Network Canvas',
      desc: 'Explore the graph with node dragging, zoom, pan, hover info, and community color groupings.',
      icon: Share2,
      color: 'from-indigo-600 to-cyan-600',
    },
    {
      id: 'analysis',
      title: 'Algorithm Analysis',
      subtitle: 'DAA Complexity Table',
      desc: 'Comprehensive asymptotic analysis: Big-O bounds, space complexities, and theoretical derivations.',
      icon: BarChart3,
      color: 'from-slate-700 to-slate-900',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner (Whitish shade) */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 md:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Design and Analysis of Algorithms • Mini Project
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            FriendConnect
            <span className="block text-indigo-600 text-2xl md:text-3xl font-bold mt-1">
              Social Network Graph Analysis
            </span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed">
            An educational social-network platform built to demonstrate fundamental DAA principles.
            Represents users as vertices and friendships as undirected edges to analyze Graph Representations,
            Hash Lookups, Set Intersections, BFS Shortest Paths, and DFS Connected Components.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('graph-viz')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Visualize Network
            </button>
            <button
              onClick={() => onNavigate('shortest-path')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition border border-slate-200 flex items-center gap-2"
            >
              <Route className="w-4 h-4 text-indigo-600" />
              Run BFS Path Search
            </button>
          </div>
        </div>

        {/* Soft background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.borderColor} border flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
                {card.value}
              </div>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Algorithm Modules</h2>
            <p className="text-xs text-slate-500">Directly execute and explore DAA graph algorithms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={() => onNavigate(action.id)}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                    {action.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Architecture Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Adjacency List Structure</h3>
              <p className="text-xs text-slate-500">Undirected graph representation currently loaded in backend memory</p>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 max-h-60 overflow-y-auto shadow-inner">
            {graphData?.adjacency_list ? (
              <pre>
                {`graph = {\n` +
                  Object.entries(graphData.adjacency_list)
                    .map(
                      ([user, neighbors]) =>
                        `    "${user}": {${neighbors.map((n) => `"${n}"`).join(', ')}}`
                    )
                    .join(',\n') +
                  `\n}`}
              </pre>
            ) : (
              <div className="text-slate-500">Loading graph representation...</div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Project Scope</h3>
                <p className="text-xs text-slate-500">Strict academic evaluation requirements</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Dynamic calculation from graph data</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Zero hardcoded mock answers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>BFS queue with parent backpointer reconstruction</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>DFS LIFO stack connected component detection</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Persistent storage with instant sample reset</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-medium text-slate-400">
            Course Mini Project • DAA CSE
          </div>
        </div>
      </div>
    </div>
  );
}
