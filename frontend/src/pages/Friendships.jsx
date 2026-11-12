import React, { useState } from 'react';
import {
  Link2,
  Trash2,
  UserPlus,
  ArrowLeftRight,
  Database,
  Code2,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function Friendships({ users, friendships, adjacencyList, onRefresh, showToast }) {
  const [user1, setUser1] = useState('');
  const [user2, setUser2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Create Friendship
  const handleAddFriendship = async (e) => {
    e.preventDefault();

    if (!user1 || !user2) {
      showToast('Please select both users.', 'error');
      return;
    }
    if (user1 === user2) {
      showToast('A user cannot be friends with themselves (no self-loops).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createFriendship(user1, user2);
      showToast(res.message, 'success');
      setUser1('');
      setUser2('');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Friendship
  const handleDeleteFriendship = async (u1, u2) => {
    if (!window.confirm(`Remove undirected edge between '${u1}' and '${u2}'?`)) {
      return;
    }
    try {
      const res = await api.deleteFriendship(u1, u2);
      showToast(res.message, 'success');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleCopyAdjacency = () => {
    if (!adjacencyList) return;
    const text = JSON.stringify(adjacencyList, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Adjacency List & Undirected Edge Representation"
        timeComplexity="O(1) Edge Insertion"
        spaceComplexity="O(V + 2E) = O(V + E)"
        dataStructures="Adjacency List: dict[str, set[str]]"
        explanation="In an undirected social graph, friendship is an unoriented bidirectional relation. Adding an edge (u, v) inserts v into u's adjacency set and symmetrically inserts u into v's adjacency set. Using Hash Sets ensures edge lookups and duplicate checks run in O(1) average time."
        steps={[
          "Validate both endpoints exist in the vertex hash map.",
          "Verify u != v to prevent self-loops.",
          "Check in O(1) time if v is already present in graph[u] to prevent duplicate edges.",
          "Execute symmetrical insertion: graph[u].add(v) and graph[v].add(u).",
          "Space complexity is O(V + E), which is significantly more memory-efficient than an O(V^2) adjacency matrix for sparse social networks."
        ]}
        pseudocode={`# Symmetrical Undirected Edge Addition
def add_friendship(u1, u2):
    if u1 not in graph or u2 not in graph:
        raise ValueError("Vertices must exist")
    if u1 == u2:
        raise ValueError("No self-loops")
    if u2 in graph[u1]:
        raise ValueError("Edge already exists")

    # Undirected symmetrical insertion:
    graph[u1].add(u2)   # u1 -> u2
    graph[u2].add(u1)   # u2 -> u1`}
        defaultOpen={false}
      />

      {/* Grid: Create Friendship Form + Adjacency List Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Edge Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Friendship (Edge)</h3>
              <p className="text-xs text-slate-500">Connect two existing vertices with an undirected edge</p>
            </div>
          </div>

          <form onSubmit={handleAddFriendship} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                User 1 (Endpoint A)
              </label>
              <select
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 text-sm transition"
              >
                <option value="">Select User 1...</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.id} — {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center -my-1">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                User 2 (Endpoint B)
              </label>
              <select
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-500 text-sm transition"
              >
                <option value="">Select User 2...</option>
                {users?.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.id} — {u.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm transition shadow-sm shadow-emerald-200 flex items-center justify-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              {isSubmitting ? 'Connecting...' : 'Add Undirected Edge (A ↔ B)'}
            </button>
          </form>
        </div>

        {/* Live Adjacency List Inspector */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Live Adjacency Representation</h3>
                  <p className="text-xs text-slate-500">Dynamic graph dictionary in Python memory</p>
                </div>
              </div>

              <button
                onClick={handleCopyAdjacency}
                className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 transition text-xs flex items-center gap-1.5 border border-slate-200 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 max-h-56 overflow-y-auto shadow-inner">
              {adjacencyList ? (
                <pre>
                  {`graph = {\n` +
                    Object.entries(adjacencyList)
                      .map(([u, list]) => `  "${u}": {${list.map((n) => `"${n}"`).join(', ')}}`)
                      .join(',\n') +
                    `\n}`}
                </pre>
              ) : (
                <span className="text-slate-500">Loading adjacency list...</span>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            Each vertex <code className="text-indigo-600 font-bold">u</code> maps to a hash set containing its immediate degree neighbours.
          </div>
        </div>
      </div>

      {/* Friendships List Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Active Undirected Edges</h3>
              <p className="text-xs text-slate-500">Total Unique Friendships: {friendships?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">#</th>
                <th className="px-6 py-3.5">User A</th>
                <th className="px-6 py-3.5 text-center">Relationship</th>
                <th className="px-6 py-3.5">User B</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {friendships && friendships.length > 0 ? (
                friendships.map((edge, idx) => (
                  <tr key={`${edge.source}-${edge.target}`} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          {edge.source}
                        </span>
                        <span className="font-semibold text-slate-900">{edge.source_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ArrowLeftRight className="w-3 h-3 text-emerald-600" />
                        Undirected
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                          {edge.target}
                        </span>
                        <span className="font-semibold text-slate-900">{edge.target_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteFriendship(edge.source, edge.target)}
                        title="Remove friendship"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-400 text-sm">
                    No friendships currently recorded in the graph.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
