import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Database,
  Clock,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function AlgorithmAnalysis({ showToast }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getComplexity()
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        showToast(err.message, 'error');
        setLoading(false);
      });
  }, []);

  const complexityTable = [
    {
      operation: 'Search User',
      timeAvg: 'O(1) average',
      timeWorst: 'O(V)',
      space: 'O(1)',
      ds: 'Hash Table (Python dict)',
      description: 'Hash key lookup directly addresses memory bucket in expected constant time.',
    },
    {
      operation: 'Add User',
      timeAvg: 'O(1) average',
      timeWorst: 'O(V)',
      space: 'O(1)',
      ds: 'Hash Table + Adjacency Set',
      description: 'Inserts vertex record into user dict and initializes empty neighbor set.',
    },
    {
      operation: 'Add Friendship',
      timeAvg: 'O(1) average',
      timeWorst: 'O(1)',
      space: 'O(1)',
      ds: 'Adjacency List (Hash Sets)',
      description: 'Symmetrically inserts u into graph[v] and v into graph[u] (undirected graph).',
    },
    {
      operation: 'Mutual Friends',
      timeAvg: 'O(min(deg(u), deg(v)))',
      timeWorst: 'O(min(deg(u), deg(v)))',
      space: 'O(min(deg(u), deg(v)))',
      ds: 'Set Intersection (Hash Sets)',
      description: 'Iterates through the smaller vertex neighborhood and checks hash membership in larger set.',
    },
    {
      operation: 'BFS Shortest Path',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      ds: 'FIFO Queue (deque) + Parent Dict',
      description: 'Level-order traversal discovering minimum edge path between source and target.',
    },
    {
      operation: 'DFS Communities',
      timeAvg: 'O(V + E)',
      timeWorst: 'O(V + E)',
      space: 'O(V)',
      ds: 'LIFO Stack + Visited Hash Set',
      description: 'Exhaustive depth traversal identifying all maximal connected subgraphs.',
    },
    {
      operation: 'Friend Suggestions',
      timeAvg: 'O(W + C log C)',
      timeWorst: 'O(V² + V log V)',
      space: 'O(C)',
      ds: '2-Hop Traversal + Frequency Map + Sorting',
      description: 'Inspects 2-hop friends-of-friends, filters direct connections, and sorts candidates.',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <BarChart3 className="w-3.5 h-3.5" />
          Theoretical Complexity Matrix
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
          Design & Analysis of Algorithms — Complexity Study
        </h2>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive asymptotic complexity analysis for all data structures and graph algorithms
          implemented in the FriendConnect social network architecture.
        </p>
      </div>

      {/* Main Complexity Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Algorithm Operations vs Asymptotic Bounds</h3>
              <p className="text-xs text-slate-500">Time and space complexities with underlying data structures</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Operation</th>
                <th className="px-6 py-4">Time Complexity (Avg)</th>
                <th className="px-6 py-4">Worst Case</th>
                <th className="px-6 py-4">Space Complexity</th>
                <th className="px-6 py-4">Data Structure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {complexityTable.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {row.operation}
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">
                      {row.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">
                    {row.timeAvg}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    {row.timeWorst}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-600">
                    {row.space}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700">
                    {row.ds}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep-Dive Architectural Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adjacency List vs Adjacency Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Adjacency List vs Matrix</h3>
              <p className="text-xs text-slate-500">Space & traversal efficiency trade-offs</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              In real-world social networks, graphs are heavily <strong>sparse</strong> ($|E| \ll |V|^2$).
              An Adjacency Matrix allocates $O(V^2)$ contiguous memory, which for 100,000 users requires 10 billion entries.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-indigo-700">
                <span>Adjacency List Space:</span>
                <strong>O(V + E) [Optimal]</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Adjacency Matrix Space:</span>
                <strong>O(V²) [Wasteful]</strong>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Neighbor Iteration:</span>
                <strong>O(deg(u)) vs O(V)</strong>
              </div>
            </div>
            <p>
              FriendConnect implements Adjacency Lists via Python <code>dict[str, set[str]]</code>, providing
              $O(1)$ average neighbor existence checks while maintaining optimal $O(V + E)$ space.
            </p>
          </div>
        </div>

        {/* BFS vs DFS in Social Graphs */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">BFS vs DFS in Social Analysis</h3>
              <p className="text-xs text-slate-500">Queue vs Stack algorithmic invariants</p>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
            <p>
              Both BFS and DFS exhibit $O(V + E)$ time complexity and $O(V)$ space complexity, but their data structures enforce fundamentally different graph exploration invariants:
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs">
              <div className="text-sky-700 font-bold">
                <span>BFS (FIFO Queue):</span>
                <p className="text-[11px] text-slate-600 font-sans mt-0.5 font-normal">
                  Guarantees shortest unweighted hop count. Ideal for degrees-of-separation and routing.
                </p>
              </div>
              <div className="text-rose-700 font-bold pt-2 border-t border-slate-200">
                <span>DFS (LIFO Stack):</span>
                <p className="text-[11px] text-slate-600 font-sans mt-0.5 font-normal">
                  Deeply visits branches before backtracking. Ideal for connected components, cycles, and topological sorting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
