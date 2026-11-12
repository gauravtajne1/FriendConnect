import React, { useState, useEffect } from 'react';
import {
  Network,
  Users,
  Layers,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Share2,
  Database,
  CheckCircle2,
  ListTree
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function Communities({ onNavigate, showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const res = await api.getCommunities();
      setData(res);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Connected Components / Community Detection via DFS"
        timeComplexity="O(V + E)"
        spaceComplexity="O(V)"
        dataStructures="LIFO Stack (or Recursion) + Visited Hash Set"
        explanation="Connected component decomposition partitions an undirected graph into maximal sets of mutually reachable vertices. A global visited set is maintained while iterating over all vertices in V. Whenever an unvisited vertex is encountered, it triggers a Depth-First Search (DFS) using a LIFO stack to discover and label every vertex in that connected component."
        steps={[
          "Initialize an empty visited hash set and an empty components list.",
          "Iterate through every vertex u in the graph's vertex directory.",
          "If u is not in visited: start a new connected component with u as root.",
          "Push u onto the LIFO stack and add u to visited.",
          "While stack is not empty: pop vertex curr; for each unvisited neighbour in graph[curr], push onto stack and mark visited.",
          "Upon stack exhaustion, the current connected component is complete. Repeat until all V vertices are partitioned."
        ]}
        pseudocode={`def find_connected_components():
    visited = set()
    components = []

    for vertex in graph.keys():
        if vertex not in visited:
            component = []
            stack = [vertex]  # Explicit LIFO stack
            visited.add(vertex)

            while stack:
                curr = stack.pop()
                component.append(curr)
                for neighbor in graph[curr]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        stack.append(neighbor)

            components.append(component)
    return components`}
        defaultOpen={false}
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Connected Components
            </span>
            <Network className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {data?.num_components || 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maximal disconnected subgraphs
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Largest Component Size
            </span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {data?.components ? Math.max(...data.components.map((c) => c.size), 0) : 0} vertices
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Community 1 (Aarav, Diya, Kabir, Meera, Ishaan)
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Isolated Vertices (deg = 0)
            </span>
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {data?.components ? data.components.filter((c) => c.size === 1).length : 0}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Single-node components (e.g. u09 Vivaan)
          </p>
        </div>
      </div>

      {/* Components Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Discovered Connected Components</h3>
            <p className="text-xs text-slate-500">
              Each component represents an independent subgraph isolated from other clusters
            </p>
          </div>
          <button
            onClick={() => onNavigate('graph-viz')}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold transition border border-slate-200 shadow-xs flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            View in Graph Visualizer
          </button>
        </div>

        {data?.components && data.components.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.components.map((comp) => (
              <div
                key={comp.community_id}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: comp.color }}
                      />
                      <h4 className="text-base font-bold text-slate-900">{comp.name}</h4>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                      {comp.size} Member{comp.size !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-4 flex items-center justify-between pb-3 border-b border-slate-100">
                    <span>Internal Edges:</span>
                    <strong className="font-mono text-indigo-600 font-bold">{comp.edge_count}</strong>
                  </div>

                  {/* Member pills */}
                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Component Members
                    </span>
                    <div className="space-y-1.5">
                      {comp.member_details.map((m) => (
                        <div
                          key={m.id}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600">{m.id}</span>
                            <span className="font-semibold text-slate-800">{m.name}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">
                            deg: {m.degree}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  DFS Order: {comp.traversal_trace?.join(' → ') || comp.members.join(', ')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm">
            Loading connected components...
          </div>
        )}
      </div>
    </div>
  );
}
