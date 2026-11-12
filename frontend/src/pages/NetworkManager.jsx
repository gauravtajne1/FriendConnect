import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import GraphVisualization from "./GraphVisualization";

// Page to manage users and friendships and view the current network
export default function NetworkManager() {
  const [graph, setGraph] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [friendship, setFriendship] = useState({ a: "", b: "" });
  const [loading, setLoading] = useState(false);

  const loadGraph = async () => {
    setLoading(true);
    try {
      const data = await api.getGraph();
      setGraph(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraph();
  }, []);

  const handleAddUser = async () => {
    if (!newUser) return;
    await api.addUser({ name: newUser }); // assumes backend endpoint
    setNewUser("");
    loadGraph();
  };

  const handleAddFriendship = async () => {
    const { a, b } = friendship;
    if (!a || !b) return;
    await api.addFriendship({ user_a: a, user_b: b }); // assumes backend endpoint
    setFriendship({ a: "", b: "" });
    loadGraph();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Network Manager</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Add User</h2>
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="User name"
            value={newUser}
            onChange={(e) => setNewUser(e.target.value)}
          />
          <button
            className="bg-indigo-600 text-white rounded px-3 py-1"
            onClick={handleAddUser}
          >
            Add
          </button>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Add Friendship</h2>
        <div className="flex items-center gap-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="User A"
            value={friendship.a}
            onChange={(e) =>
              setFriendship({ ...friendship, a: e.target.value })
            }
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="User B"
            value={friendship.b}
            onChange={(e) =>
              setFriendship({ ...friendship, b: e.target.value })
            }
          />
          <button
            className="bg-indigo-600 text-white rounded px-3 py-1"
            onClick={handleAddFriendship}
          >
            Add
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Current Network</h2>
        {loading ? (
          <p>Loading graph…</p>
        ) : graph ? (
          <GraphVisualization graphData={graph} />
        ) : (
          <p>No graph data.</p>
        )}
      </section>
    </div>
  );
}
