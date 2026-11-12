import React, { useState, useEffect } from 'react';
import {
  Route,
  ArrowRight,
  Clock,
  Database,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  HelpCircle
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function ShortestPath({ users, showToast }) {
  const [source, setSource] = useState('u01');
  const [destination, setDestination] = useState('u05');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runBFS = async (src = source, dst = destination) => {
    if (!src || !dst) {
      showToast('Please select both source and destination users.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getShortestPath(src, dst);
      setResult(data);
    } catch (err) {
      showToast(err.message, 'error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (source && destination) {
      runBFS(source, destination);
    }
  }, [source, destination]);

  const loadPreset = (src, dst) => {
    setSource(src);
    setDestination(dst);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Breadth-First Search (BFS) Shortest Path"
        timeComplexity="O(V + E)"
        spaceComplexity="O(V)"
        dataStructures="FIFO Queue (collections.deque) + Predecessor/Parent Dict"
        explanation="BFS is an unweighted shortest path algorithm that explores vertices in increasing order of their distance from the source. By maintaining a First-In-First-Out (FIFO) queue and a predecessor dictionary parent[v] = u, BFS guarantees that the first time the destination vertex is dequeued, the shortest path in terms of edge count has been found."
        steps={[
          "Initialize queue with the source vertex: queue.append(source).",
          "Mark source as visited: visited.add(source), parent[source] = None.",
          "While queue is not empty: dequeue current vertex u = queue.popleft().",
          "If u == destination, stop exploration immediately.",
          "For each unvisited neighbour v in graph[u]: mark visited, set parent[v] = u, enqueue v.",
          "Backtrack from destination to source using parent map to reconstruct the exact path."
        ]}
        pseudocode={`def bfs_shortest_path(source, target):
    queue = deque([source])
    visited = {source}
    parent = {source: None}

    while queue:
        curr = queue.popleft()
        if curr == target:
            break
        for neighbor in graph[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = curr
                queue.append(neighbor)

    # Reconstruct path via parent pointers:
    path = []
    curr = target
    while curr is not None:
        path.append(curr)
        curr = parent.get(curr)
    return path[::-1]`}
        defaultOpen={false}
      />

      {/* Preset Scenarios from Requirements */}
      <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-800">Evaluation Test Cases:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadPreset('u01', 'u05')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              source === 'u01' && destination === 'u05'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400'
            }`}
          >
            Connected: u01 (Aarav) → u05 (Ishaan) [Distance: 2]
          </button>
          <button
            onClick={() => loadPreset('u01', 'u07')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              source === 'u01' && destination === 'u07'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400'
            }`}
          >
            Disconnected: u01 (Aarav) → u07 (Rohan) [No Connection]
          </button>
          <button
            onClick={() => loadPreset('u01', 'u09')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              source === 'u01' && destination === 'u09'
                ? 'bg-sky-600 text-white border-sky-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400'
            }`}
          >
            Isolated Node: u01 → u09 (Vivaan)
          </button>
        </div>
      </div>

      {/* Selection Box */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Select Path Endpoints</h3>
            <p className="text-xs text-slate-500">Run FIFO queue level-order search</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Source Vertex
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 text-sm transition"
            >
              <option value="">Select source...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} — {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Destination Vertex
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-sky-500 text-sm transition"
            >
              <option value="">Select destination...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} — {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Result Display */}
      {result && (
        <div className="space-y-6">
          {result.connected ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-wider">
                    Shortest Connection Found
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Path: {result.source.name} → {result.destination.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold font-mono">
                    Distance: {result.distance} edge{result.distance !== 1 ? 's' : ''}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-mono font-bold">
                    Time: O(V + E)
                  </span>
                </div>
              </div>

              {/* Visual Path Flow */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 overflow-x-auto">
                <div className="flex items-center gap-3 min-w-max">
                  {result.path_details.map((node, index) => (
                    <React.Fragment key={node.id}>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-mono font-bold text-sm border-2 shadow-xs transition-transform hover:scale-105 bg-white ${
                            index === 0
                              ? 'border-emerald-400 text-emerald-700'
                              : index === result.path_details.length - 1
                              ? 'border-sky-400 text-sky-700'
                              : 'border-indigo-300 text-indigo-700'
                          }`}
                        >
                          <span className="text-[10px] opacity-70">
                            {index === 0 ? 'START' : index === result.path_details.length - 1 ? 'END' : `HOP ${index}`}
                          </span>
                          <span>{node.id}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-1.5">{node.name}</span>
                      </div>

                      {index < result.path_details.length - 1 && (
                        <div className="flex items-center text-sky-600 px-1">
                          <ArrowRight className="w-5 h-5 animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-xs font-mono text-slate-600">
                  Shortest Path Representation:{' '}
                  <strong className="text-sky-700 font-bold">{result.path.join(' → ')}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-rose-700">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <h3 className="text-lg font-bold text-slate-900">
                  No Connection Exists Between Selected Users
                </h3>
              </div>
              <p className="text-sm text-slate-700">
                BFS search queue emptied without encountering destination user{' '}
                <strong className="text-slate-900">{result.destination.name}</strong> ({result.destination.id}).
                The source and destination belong to two distinct connected components.
              </p>
              <div className="text-xs font-mono text-slate-700 bg-white p-3 rounded-xl border border-rose-200">
                Vertices explored in component: {result.traversal_order.join(', ') || 'None'}
              </div>
            </div>
          )}

          {/* Detailed BFS Queue Execution Trace */}
          {result.steps && result.steps.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <ListOrdered className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">BFS Execution Trace (FIFO Queue Progression)</h3>
                  <p className="text-xs text-slate-500">Step-by-step state of queue and visited set</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs font-mono text-slate-700">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="px-4 py-3">Step</th>
                      <th className="px-4 py-3">Dequeued Node</th>
                      <th className="px-4 py-3">Action / Neighbors Discovered</th>
                      <th className="px-4 py-3">Queue State [FIFO]</th>
                      <th className="px-4 py-3">Visited Set</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {result.steps.map((st) => (
                      <tr key={st.step} className="hover:bg-slate-50/70 transition">
                        <td className="px-4 py-2.5 text-indigo-600 font-bold">
                          #{st.step}
                        </td>
                        <td className="px-4 py-2.5 text-slate-900 font-bold">
                          {st.current || '—'}
                        </td>
                        <td className="px-4 py-2.5 font-sans text-xs text-slate-700">
                          {st.action}
                        </td>
                        <td className="px-4 py-2.5 text-sky-700 font-bold">
                          [{st.queue_state?.join(', ')}]
                        </td>
                        <td className="px-4 py-2.5 text-emerald-700 font-bold">
                          {'{'}{st.visited?.join(', ')}{'}'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
