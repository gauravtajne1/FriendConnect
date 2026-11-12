import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle,
  HelpCircle,
  ArrowLeftRight,
  Clock,
  Layers
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function MutualFriends({ users, showToast }) {
  const [userA, setUserA] = useState('u01');
  const [userB, setUserB] = useState('u04');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically run mutual friends check when both users are selected
  const handleCalculate = async (ua = userA, ub = userB) => {
    if (!ua || !ub) {
      showToast('Please select both users.', 'error');
      return;
    }
    if (ua === ub) {
      showToast('Please select two distinct users.', 'error');
      return;
    }

    setLoading(true);
    try {
      const data = await api.getMutualFriends(ua, ub);
      setResult(data);
    } catch (err) {
      showToast(err.message, 'error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userA && userB && userA !== userB) {
      handleCalculate(userA, userB);
    }
  }, [userA, userB]);

  const loadPreset = (a, b) => {
    setUserA(a);
    setUserB(b);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Mutual Friends via Set Intersection"
        timeComplexity="O(min(deg(A), deg(B))) Expected"
        spaceComplexity="O(min(deg(A), deg(B)))"
        dataStructures="Hash Sets (Python set.intersection)"
        explanation="Given two vertices A and B with adjacency sets Friends(A) and Friends(B), mutual friends are calculated dynamically as the set intersection Friends(A) ∩ Friends(B). In Python, set intersection iterates over the smaller set of size min(deg(A), deg(B)) and performs an O(1) hash table membership lookup in the larger set."
        steps={[
          "Retrieve adjacency set Friends(A) from graph[user_a].",
          "Retrieve adjacency set Friends(B) from graph[user_b].",
          "Identify the smaller set between Friends(A) and Friends(B).",
          "Iterate through elements of the smaller set, checking presence in the larger set's hash table in O(1) average time.",
          "Yield the intersection set representing all shared neighbours."
        ]}
        pseudocode={`def find_mutual_friends(user_a, user_b):
    set_a = graph[user_a]   # Adjacency set
    set_b = graph[user_b]   # Adjacency set

    # Set intersection: O(min(deg(a), deg(b)))
    mutual_set = set_a.intersection(set_b)
    return [users[uid] for uid in mutual_set]`}
        defaultOpen={false}
      />

      {/* Preset Test Scenarios */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800">DAA Evaluation Presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadPreset('u01', 'u04')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-xs"
          >
            u01 (Aarav) & u04 (Meera) → Diya
          </button>
          <button
            onClick={() => loadPreset('u02', 'u05')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-xs"
          >
            u02 (Diya) & u05 (Ishaan) → Kabir, Meera
          </button>
          <button
            onClick={() => loadPreset('u06', 'u07')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition shadow-xs"
          >
            u06 (Anaya) & u07 (Rohan) → Sara
          </button>
        </div>
      </div>

      {/* Selection Form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Select Two Users</h3>
            <p className="text-xs text-slate-500">Calculate common neighbours dynamically</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              User A
            </label>
            <select
              value={userA}
              onChange={(e) => setUserA(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-violet-500 text-sm transition"
            >
              <option value="">Select User A...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} — {u.name} (deg: {u.degree})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              User B
            </label>
            <select
              value={userB}
              onChange={(e) => setUserB(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-none focus:border-violet-500 text-sm transition"
            >
              <option value="">Select User B...</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.id} — {u.name} (deg: {u.degree})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-violet-600 uppercase tracking-wider">
                Calculation Output
              </span>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Mutual Friends between {result.user_a.name} and {result.user_b.name}</span>
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold font-mono">
                {result.mutual_count} Mutual Friend{result.mutual_count !== 1 ? 's' : ''}
              </span>
              {result.is_direct_friends && (
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  Direct Friends
                </span>
              )}
            </div>
          </div>

          {/* Mathematical Set Operation Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-xs text-slate-700">
            <div>
              Friends({result.user_a.name}) = {'{'}
              <span className="text-indigo-600 font-bold">
                {result.friends_a.map((f) => `"${f}"`).join(', ') || '∅'}
              </span>
              {'}'} (deg: {result.user_a.degree})
            </div>
            <div>
              Friends({result.user_b.name}) = {'{'}
              <span className="text-indigo-600 font-bold">
                {result.friends_b.map((f) => `"${f}"`).join(', ') || '∅'}
              </span>
              {'}'} (deg: {result.user_b.degree})
            </div>
            <div className="pt-2 border-t border-slate-200 text-violet-700 font-bold">
              Intersection (Friends(A) ∩ Friends(B)) = {'{'}
              <span className="text-emerald-700">
                {result.mutual_friends.map((m) => `"${m.id}" (${m.name})`).join(', ') || '∅ (None)'}
              </span>
              {'}'}
            </div>
          </div>

          {/* List of Mutual Friends Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Common Friends List
            </h4>
            {result.mutual_friends.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {result.mutual_friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="p-4 rounded-xl bg-white border border-violet-200 shadow-xs flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 font-mono font-bold flex items-center justify-center text-sm border border-violet-200">
                      {friend.id}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{friend.name}</div>
                      <div className="text-[11px] font-medium text-violet-600">Shared Connection</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-sm">
                No mutual friends found between {result.user_a.name} and {result.user_b.name}.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
