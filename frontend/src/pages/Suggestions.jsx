import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  UserPlus,
  ArrowRight,
  Clock,
  Network,
  Share2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function Suggestions({ users, showToast }) {
  const [selectedUser, setSelectedUser] = useState('u01');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (userId = selectedUser) => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await api.getSuggestions(userId);
      setResult(data);
    } catch (err) {
      showToast(err.message, 'error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchSuggestions(selectedUser);
    }
  }, [selectedUser]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Friend Suggestions via Common-Neighbour Ranking"
        timeComplexity="O(W + C log C) Expected"
        spaceComplexity="O(C)"
        dataStructures="2-Hop Graph Traversal + Hash Map + Sorting"
        explanation="Friend recommendation is based on the Triadic Closure principle in network theory: two people with common mutual friends are much more likely to know each other. The algorithm performs a 2-hop traversal around the target user, filters out already connected direct friends and the user themselves, tallies the mutual friend count for every candidate, and sorts them in descending order."
        steps={[
          "Retrieve the target user's direct friends set N(u).",
          "For each friend f in N(u), explore their neighbor set N(f) (friends-of-friends).",
          "Filter out candidates: ignore if candidate is u itself or candidate is already in N(u).",
          "Increment the mutual friends score for valid candidate: candidates[cand] += 1.",
          "Sort the resulting candidate list descending by mutual friend count in O(C log C) time."
        ]}
        pseudocode={`def recommend_friends(user_id):
    direct_friends = graph[user_id]
    candidate_scores = {}

    for friend in direct_friends:
        for fof in graph[friend]:
            # Exclude self and direct friends
            if fof != user_id and fof not in direct_friends:
                candidate_scores[fof] = candidate_scores.get(fof, 0) + 1

    # Sort descending by mutual friend count
    return sorted(candidate_scores.items(), key=lambda x: -x[1])`}
        defaultOpen={false}
      />

      {/* Preset Evaluation Quick Buttons */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-800">Evaluation Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedUser('u01')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              selectedUser === 'u01'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
            }`}
          >
            u01 — Aarav (Demonstration Target)
          </button>
          <button
            onClick={() => setSelectedUser('u06')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              selectedUser === 'u06'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
            }`}
          >
            u06 — Anaya (Component 2)
          </button>
          <button
            onClick={() => setSelectedUser('u09')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-xs ${
              selectedUser === 'u09'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
            }`}
          >
            u09 — Vivaan (Isolated Node)
          </button>
        </div>
      </div>

      {/* User Selection */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Select User for Recommendations</h3>
            <p className="text-xs text-slate-500">Compute 2-hop common connections dynamically</p>
          </div>
        </div>

        <div className="max-w-md">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 text-sm transition"
          >
            <option value="">Select a user...</option>
            {users?.map((u) => (
              <option key={u.id} value={u.id}>
                {u.id} — {u.name} (Direct friends: {u.degree})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendation Results */}
      {result && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-amber-600 uppercase tracking-wider">
                Recommendation Output
              </span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Friend Suggestions for {result.user.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold border border-slate-200">
                  {result.user.id}
                </span>
              </h3>
            </div>

            <div className="text-xs text-slate-600">
              Direct Friends:{' '}
              <span className="font-mono font-bold text-indigo-600">
                {result.direct_friends_count}
              </span>{' '}
              ({result.direct_friends.join(', ') || 'None'})
            </div>
          </div>

          {result.suggestions && result.suggestions.length > 0 ? (
            <div className="space-y-3">
              {result.suggestions.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-mono font-bold flex items-center justify-center text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">{item.name}</span>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.id}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                        <span>Connected via:</span>
                        {item.mutual_friends.map((mf) => (
                          <span
                            key={mf.id}
                            className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-indigo-700 font-mono text-[11px] font-semibold"
                          >
                            {mf.name} ({mf.id})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold font-mono">
                      {item.mutual_count} mutual friend{item.mutual_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-sm space-y-1">
              <p className="font-medium text-slate-700">No friend suggestions found for {result.user.name}.</p>
              <p className="text-xs text-slate-500">
                (This occurs if the user is isolated or all 2-hop neighbors are already direct friends.)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
