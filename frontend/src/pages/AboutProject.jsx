import React from 'react';
import {
  Share2,
  Users,
  CheckCircle2,
  GraduationCap,
  BookOpen,
  Code2,
  Layers,
  Award,
  Sparkles
} from 'lucide-react';

export default function AboutProject() {
  const teamMembers = [
    {
      name: 'Ziya Ullah Khan',
      role: 'Project Contributor',
    },
    {
      name: 'Pawni Jain',
      role: 'Project Contributor',
    },
    {
      name: 'Gaurav Purushotam Tajne',
      role: 'Project Contributor',
    },
  ];

  const coreConcepts = [
    { title: 'Graph Representation', desc: 'Modeling social relationships as undirected vertices and edges.' },
    { title: 'Adjacency Lists', desc: 'Efficient O(V + E) dynamic neighbor mapping using hash sets.' },
    { title: 'Hashing', desc: 'O(1) average lookup and duplicate prevention for vertices and edges.' },
    { title: 'Set Operations', desc: 'Dynamic set intersection Friends(A) ∩ Friends(B) in O(min(deg A, deg B)).' },
    { title: 'Breadth-First Search', desc: 'FIFO queue traversal guaranteeing unweighted shortest paths with parent backpointers.' },
    { title: 'Depth-First Search', desc: 'LIFO stack traversal systematically discovering maximal connected subgraphs.' },
    { title: 'Connected Components', desc: 'Partitioning disjoint social communities without heuristic clustering.' },
    { title: 'Graph Visualization', desc: 'Interactive physics-based force simulation with component coloring and path overlays.' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="p-8 md:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          Design and Analysis of Algorithms (DAA) • Mini Project
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          FriendConnect
          <span className="block text-indigo-600 text-2xl md:text-3xl font-bold mt-1">
            Social Network Graph Analysis
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          An academic graph algorithms platform developed to expose the inner workings,
          time complexities, and data structures behind social network computations.
        </p>
      </div>

      {/* Project Team */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Project Team</h3>
            <p className="text-xs text-slate-500">Authors & Contributors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition flex items-center gap-4 shadow-xs"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
                {member.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                <p className="text-xs text-indigo-600 font-semibold">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core DAA Concepts Covered */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Academic Concepts Demonstrated</h3>
            <p className="text-xs text-slate-500">Algorithms curriculum requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coreConcepts.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture & Tech Stack Details */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Technology Stack & Architecture</h3>
            <p className="text-xs text-slate-500">Modular separation of concerns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Backend Engine</span>
            <div className="text-sm font-bold text-slate-900">Python 3 + FastAPI</div>
            <p className="text-slate-600">Pure graph algorithms without external black-box graph libraries.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Frontend Interface</span>
            <div className="text-sm font-bold text-slate-900">React.js + Tailwind CSS</div>
            <p className="text-slate-600">Component architecture with Lucide React iconography.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Network Visualization</span>
            <div className="text-sm font-bold text-slate-900">Custom Force Physics</div>
            <p className="text-slate-600">Coulomb repulsion, Hooke springs, component coloring, zoom & pan.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Persistence</span>
            <div className="text-sm font-bold text-slate-900">JSON File Store</div>
            <p className="text-slate-600">Atomic JSON serialization with sample dataset reset capability.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
