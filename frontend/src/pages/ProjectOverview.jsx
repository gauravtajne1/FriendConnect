import React from 'react';
import { api } from '../services/api';
import { useEffect, useState } from 'react';
import GraphVisualization from './GraphVisualization';

// Simple overview page that shows a short description and a sample network visualisation.
export default function ProjectOverview() {
  const [sampleGraph, setSampleGraph] = useState(null);

  useEffect(() => {
    // Load a small static sample graph (we can reuse the existing API endpoint that returns a default 9‑node graph)
    api.getGraph().then(setSampleGraph).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">FriendConnect – Project Overview</h1>
      <p>
        FriendConnect is a social‑network analysis demo built with a FastAPI backend and a React
        frontend. It demonstrates classic graph algorithms (BFS, DFS, connected components) and
        provides an interactive UI for managing users, friendships, and visualising the network.
      </p>
      <section>
        <h2 className="text-xl font-semibold mb-2">Sample Network</h2>
        {sampleGraph ? (
          <GraphVisualization graphData={sampleGraph} />
        ) : (
          <p>Loading sample network…</p>
        )}
      </section>
    </div>
  );
}
