import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Users as UsersIcon,
  Trash2,
  CheckCircle,
  AlertCircle,
  Hash,
  Clock,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import AlgorithmCard from '../components/AlgorithmCard';
import { api } from '../services/api';

export default function Users({ users, onRefresh, showToast }) {
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchTime, setSearchTime] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const idTrimmed = newId.trim();
    const nameTrimmed = newName.trim();

    if (!idTrimmed) {
      showToast('User ID cannot be empty.', 'error');
      return;
    }
    if (!nameTrimmed) {
      showToast('User Name cannot be empty.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.createUser(idTrimmed, nameTrimmed);
      showToast(res.message || `User ${nameTrimmed} created successfully!`, 'success');
      setNewId('');
      setNewName('');
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hash-based user lookup
  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) {
      setSearchResult(null);
      setSearchTime(null);
      return;
    }

    setIsSearching(true);
    const start = performance.now();
    try {
      const res = await api.getUserById(q);
      const elapsed = (performance.now() - start).toFixed(2);
      setSearchResult(res.user);
      setSearchTime(elapsed);
      showToast(`User found in ${elapsed} ms via hash lookup!`, 'success');
    } catch (err) {
      setSearchResult(null);
      setSearchTime(null);
      showToast(`User '${q}' not found in hash table.`, 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you want to remove user '${userId}'? All incident friendships will be removed.`)) {
      return;
    }
    try {
      const res = await api.deleteUser(userId);
      showToast(res.message, 'success');
      if (searchResult && searchResult.id === userId) {
        setSearchResult(null);
      }
      onRefresh();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Algorithm Concept Explanation */}
      <AlgorithmCard
        title="Hash-Based User Lookup & Vertex Management"
        timeComplexity="O(1) Average"
        spaceComplexity="O(V)"
        dataStructures="Hash Map (Python dict) & Hash Set (set)"
        explanation="Users are represented as vertices in an in-memory Hash Table keyed by their unique User ID. Looking up any user by ID occurs in O(1) expected time via direct hash bucket indexing, while each vertex maintains an adjacency set of neighbor IDs."
        steps={[
          "User ID is hashed using the built-in hash function to resolve its memory address bucket.",
          "In O(1) average time, the vertex metadata (Name, Friend Set) is retrieved or inserted.",
          "Duplicate IDs are instantly checked in O(1) time: if key in users -> reject duplicate.",
          "Upon vertex deletion, all incident edges in its neighbours' adjacency sets are removed in O(deg(u)) time."
        ]}
        pseudocode={`# Hash-based Lookup & Add
users_dict = {}       # Hash table for O(1) retrieval
adj_list = {}         # Adjacency list: user_id -> set of neighbours

def add_user(user_id, name):
    if user_id in users_dict:     # O(1) hash check
        raise DuplicateError()
    users_dict[user_id] = {"name": name}
    adj_list[user_id] = set()

def search_user(user_id):
    return users_dict.get(user_id) # O(1) hash lookup`}
        defaultOpen={false}
      />

      {/* Grid: Create User Form + Instant Hash Lookup */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create User Form */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New User</h3>
              <p className="text-xs text-slate-500">Insert a new vertex into the graph</p>
            </div>
          </div>

          <form onSubmit={handleAddUser} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                User ID <span className="text-indigo-600 font-mono">(Unique Identifier)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. u10"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-sm font-mono transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-sm transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {isSubmitting ? 'Adding Vertex...' : 'Add User Vertex (O(1))'}
            </button>
          </form>
        </div>

        {/* Hash-based User Search */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hash-Based User Lookup</h3>
                <p className="text-xs text-slate-500">Test direct key hashing in O(1) time</p>
              </div>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Enter User ID (e.g. u01)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 text-sm font-mono transition"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition flex items-center gap-2 shadow-sm"
              >
                <Search className="w-4 h-4" />
                Lookup
              </button>
            </form>

            {/* Search Result Display */}
            {searchResult && (
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 animate-in fade-in duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                      {searchResult.id}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{searchResult.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                    <Clock className="w-3 h-3" />
                    <span>{searchTime} ms • O(1)</span>
                  </div>
                </div>

                <div className="text-xs text-slate-700 mt-2">
                  <span className="text-slate-500">Degree: </span>
                  <strong className="text-emerald-700">{searchResult.degree} friends</strong>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {searchResult.friends?.length > 0 ? (
                    searchResult.friends.map((fid) => (
                      <span key={fid} className="px-2 py-0.5 rounded-md bg-white text-slate-700 text-[11px] font-mono border border-slate-200 shadow-xs">
                        {fid}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">No connections (isolated vertex)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-100">
            Hash map lookup performs a key hash computation to find the target vertex directly in average <code className="text-emerald-700 font-bold">O(1)</code> time without scanning through the entire list.
          </div>
        </div>
      </div>

      {/* Users Table / Directory */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UsersIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">All Graph Vertices</h3>
              <p className="text-xs text-slate-500">Total Users: {users?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">User ID</th>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Degree (Friends Count)</th>
                <th className="px-6 py-3.5">Friends (Adjacency Set)</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-6 py-3.5 font-mono text-xs font-bold text-indigo-600">
                      {user.id}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">
                      deg = <span className="font-bold text-emerald-600">{user.degree}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {user.friends && user.friends.length > 0 ? (
                          user.friends.map((fid) => (
                            <span
                              key={fid}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200 font-medium"
                            >
                              <LinkIcon className="w-2.5 h-2.5 text-indigo-500" />
                              {fid}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        title={`Delete vertex ${user.id}`}
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
                    No users found in the graph.
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
