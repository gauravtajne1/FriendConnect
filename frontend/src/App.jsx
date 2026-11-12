import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Toast from './components/Toast';

import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Friendships from './pages/Friendships';
import MutualFriends from './pages/MutualFriends';
import Suggestions from './pages/Suggestions';
import ShortestPath from './pages/ShortestPath';
import Communities from './pages/Communities';
import GraphVisualization from './pages/GraphVisualization';
import AlgorithmAnalysis from './pages/AlgorithmAnalysis';
import AboutProject from './pages/AboutProject';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadGraphData = async () => {
    setLoading(true);
    try {
      const data = await api.getGraph();
      setGraphData(data);
    } catch (err) {
      showToast(`Failed to load graph: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGraphData();
  }, []);

  // Reset Graph to default 9-node sample
  const handleResetGraph = async () => {
    if (!window.confirm('Reset graph to the default canonical 9-user sample network?')) {
      return;
    }
    setLoading(true);
    try {
      const res = await api.resetGraph();
      showToast(res.message || 'Graph successfully reset to default sample network!', 'success');
      await loadGraphData();
    } catch (err) {
      showToast(`Reset failed: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabTitles = {
    dashboard: 'Dashboard & Graph Overview',
    users: 'User Management (Vertices |V|)',
    friendships: 'Friendship Management (Edges |E|)',
    mutual: 'Mutual Friends (Set Intersection)',
    suggestions: 'Friend Suggestions (Common-Neighbour Ranking)',
    'shortest-path': 'Shortest Connection (Breadth-First Search)',
    communities: 'Communities (DFS Connected Components)',
    'graph-viz': 'Interactive Graph Visualization',
    analysis: 'DAA Algorithm Complexity Analysis',
    about: 'About Project & Team',
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={graphData?.stats}
        onResetGraph={handleResetGraph}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        <Header
          activeTabTitle={tabTitles[activeTab] || 'FriendConnect'}
          stats={graphData?.stats}
          loading={loading}
          onRefresh={loadGraphData}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard graphData={graphData} onNavigate={setActiveTab} />
          )}

          {activeTab === 'users' && (
            <Users
              users={graphData?.users || []}
              onRefresh={loadGraphData}
              showToast={showToast}
            />
          )}

          {activeTab === 'friendships' && (
            <Friendships
              users={graphData?.users || []}
              friendships={graphData?.friendships || []}
              adjacencyList={graphData?.adjacency_list || {}}
              onRefresh={loadGraphData}
              showToast={showToast}
            />
          )}

          {activeTab === 'mutual' && (
            <MutualFriends
              users={graphData?.users || []}
              showToast={showToast}
            />
          )}

          {activeTab === 'suggestions' && (
            <Suggestions
              users={graphData?.users || []}
              showToast={showToast}
            />
          )}

          {activeTab === 'shortest-path' && (
            <ShortestPath
              users={graphData?.users || []}
              showToast={showToast}
            />
          )}

          {activeTab === 'communities' && (
            <Communities
              onNavigate={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'graph-viz' && (
            <GraphVisualization
              graphData={graphData}
              onNavigate={setActiveTab}
              showToast={showToast}
            />
          )}

          {activeTab === 'analysis' && (
            <AlgorithmAnalysis showToast={showToast} />
          )}

          {activeTab === 'about' && (
            <AboutProject />
          )}
        </main>

        <footer className="py-6 px-8 border-t border-slate-200 text-center text-xs text-slate-500 bg-white/70">
          FriendConnect — Social Network Graph Analysis • DAA Mini-Project
        </footer>
      </div>

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
