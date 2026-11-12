import React, { useState, useEffect, useRef } from 'react';
import {
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Play,
  Pause,
  Route,
  Sparkles,
  Info,
  Layers,
  X,
  ExternalLink
} from 'lucide-react';
import { api } from '../services/api';

export default function GraphVisualization({ graphData, onNavigate, showToast }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  // Transform state (zoom & pan)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Physics simulation state
  const [physicsEnabled, setPhysicsEnabled] = useState(true);

  // BFS Highlight state
  const [highlightPath, setHighlightPath] = useState([]);
  const [pathSource, setPathSource] = useState('u01');
  const [pathTarget, setPathTarget] = useState('u05');

  // Dragging state
  const draggedNodeRef = useRef(null);
  const animFrameRef = useRef(null);

  // Community color palette (Whitish theme friendly)
  const communityColors = {
    1: '#2563EB', // Blue 600
    2: '#059669', // Emerald 600
    3: '#D97706', // Amber 600
    4: '#DB2777', // Pink 600
    5: '#7C3AED', // Purple 600
  };

  // Initialize node layout from graphData
  useEffect(() => {
    if (!graphData?.users || graphData.users.length === 0) return;

    const userCommMap = graphData.communities?.user_community_map || {};
    const width = 800;
    const height = 600;

    // Component centers so different components cluster naturally in different areas
    const componentCenters = {
      1: { x: width * 0.35, y: height * 0.45 },
      2: { x: width * 0.72, y: height * 0.40 },
      3: { x: width * 0.55, y: height * 0.80 },
    };

    const initialNodes = graphData.users.map((u, i) => {
      const commId = userCommMap[u.id]?.community_id || 1;
      const center = componentCenters[commId] || { x: width * 0.5, y: height * 0.5 };
      const angle = (i * (2 * Math.PI)) / graphData.users.length;
      const radius = 60 + (i % 3) * 20;

      return {
        id: u.id,
        name: u.name,
        degree: u.degree,
        friends: u.friends || [],
        community_id: commId,
        color: communityColors[commId] || '#4F46E5',
        x: center.x + Math.cos(angle) * radius + (Math.random() - 0.5) * 40,
        y: center.y + Math.sin(angle) * radius + (Math.random() - 0.5) * 40,
        vx: 0,
        vy: 0,
        radius: 24,
      };
    });

    const initialEdges = graphData.friendships.map((f) => ({
      source: f.source,
      target: f.target,
      source_name: f.source_name,
      target_name: f.target_name,
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [graphData]);

  // Spring physics simulation
  useEffect(() => {
    let running = true;

    const stepSimulation = () => {
      if (!physicsEnabled) {
        animFrameRef.current = requestAnimationFrame(stepSimulation);
        return;
      }

      setNodes((prevNodes) => {
        if (!prevNodes || prevNodes.length === 0) return prevNodes;

        const nextNodes = prevNodes.map((n) => ({ ...n }));
        const nodeMap = {};
        nextNodes.forEach((n) => (nodeMap[n.id] = n));

        // 1. Repulsion between all node pairs (Coulomb's Law)
        for (let i = 0; i < nextNodes.length; i++) {
          for (let j = i + 1; j < nextNodes.length; j++) {
            const n1 = nextNodes[i];
            const n2 = nextNodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = 110;

            if (dist < 320) {
              const force = (minDist * minDist) / (dist * dist);
              const fx = (dx / dist) * force * 1.8;
              const fy = (dy / dist) * force * 1.8;

              if (draggedNodeRef.current !== n1.id) {
                n1.vx -= fx;
                n1.vy -= fy;
              }
              if (draggedNodeRef.current !== n2.id) {
                n2.vx += fx;
                n2.vy += fy;
              }
            }
          }
        }

        // 2. Attraction along edges (Hooke's Law)
        edges.forEach((edge) => {
          const n1 = nodeMap[edge.source];
          const n2 = nodeMap[edge.target];
          if (!n1 || !n2) return;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const targetDist = 120;
          const force = (dist - targetDist) * 0.04;

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          if (draggedNodeRef.current !== n1.id) {
            n1.vx += fx;
            n1.vy += fy;
          }
          if (draggedNodeRef.current !== n2.id) {
            n2.vx -= fx;
            n2.vy -= fy;
          }
        });

        // 3. Component cluster gravity
        const compCenters = {
          1: { x: 300, y: 280 },
          2: { x: 620, y: 240 },
          3: { x: 460, y: 480 },
        };

        nextNodes.forEach((n) => {
          if (draggedNodeRef.current === n.id) return;

          const center = compCenters[n.community_id] || { x: 450, y: 350 };
          const cdx = center.x - n.x;
          const cdy = center.y - n.y;
          n.vx += cdx * 0.008;
          n.vy += cdy * 0.008;

          // Damping
          n.vx *= 0.85;
          n.vy *= 0.85;

          // Position update
          n.x += n.vx;
          n.y += n.vy;
        });

        return nextNodes;
      });

      if (running) {
        animFrameRef.current = requestAnimationFrame(stepSimulation);
      }
    };

    animFrameRef.current = requestAnimationFrame(stepSimulation);

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [edges, physicsEnabled]);

  // Handle BFS Highlight
  const handleHighlightBFS = async () => {
    if (!pathSource || !pathTarget) return;
    try {
      const res = await api.getShortestPath(pathSource, pathTarget);
      if (res.connected) {
        setHighlightPath(res.path);
        showToast(`Shortest path highlighted: ${res.path.join(' → ')} (${res.distance} edges)`, 'success');
      } else {
        setHighlightPath([]);
        showToast('No connection exists between selected users.', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleClearHighlight = () => {
    setHighlightPath([]);
  };

  // Reset View / Layout
  const handleResetLayout = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setHoveredNode(null);
    setHighlightPath([]);
  };

  // Zoom helpers
  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.4));

  // Canvas Mouse Events
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    // Check if clicked on a node
    const clicked = nodes.find((n) => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= n.radius + 8;
    });

    if (clicked) {
      draggedNodeRef.current = clicked.id;
      setSelectedNode(clicked);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      setSelectedNode(null);
    }
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    if (draggedNodeRef.current) {
      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === draggedNodeRef.current) {
            return { ...n, x: mouseX, y: mouseY, vx: 0, vy: 0 };
          }
          return n;
        })
      );
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // Hover detection
    const hovered = nodes.find((n) => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= n.radius + 6;
    });
    setHoveredNode(hovered || null);
  };

  const handleMouseUp = () => {
    draggedNodeRef.current = null;
    setIsPanning(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((z) => Math.min(Math.max(z * zoomFactor, 0.4), 2.5));
  };

  const isEdgeInPath = (u1, u2) => {
    if (!highlightPath || highlightPath.length < 2) return false;
    for (let i = 0; i < highlightPath.length - 1; i++) {
      const p1 = highlightPath[i];
      const p2 = highlightPath[i + 1];
      if ((p1 === u1 && p2 === u2) || (p1 === u2 && p2 === u1)) {
        return true;
      }
    }
    return false;
  };

  const stats = graphData?.stats || {
    num_users: 9,
    num_friendships: 9,
    num_components: 3,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar (Whitish shade) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Graph Statistics */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-slate-500">Users:</span>
            <strong className="font-mono text-slate-900 text-sm font-bold">{stats.num_users}</strong>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Friendships:</span>
            <strong className="font-mono text-slate-900 text-sm font-bold">{stats.num_friendships}</strong>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Communities:</span>
            <strong className="font-mono text-slate-900 text-sm font-bold">{stats.num_components || 3}</strong>
          </div>
        </div>

        {/* Shortest Path Overlay Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-600 font-bold hidden sm:inline">Highlight Path:</span>
          <select
            value={pathSource}
            onChange={(e) => setPathSource(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} ({n.name})
              </option>
            ))}
          </select>
          <span className="text-slate-400 text-xs">→</span>
          <select
            value={pathTarget}
            onChange={(e) => setPathTarget(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:border-indigo-500"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} ({n.name})
              </option>
            ))}
          </select>

          <button
            onClick={handleHighlightBFS}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
          >
            <Route className="w-3.5 h-3.5" />
            Show BFS Path
          </button>

          {highlightPath.length > 0 && (
            <button
              onClick={handleClearHighlight}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
              title="Clear highlighted path"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPhysicsEnabled(!physicsEnabled)}
            title={physicsEnabled ? 'Pause Physics' : 'Resume Physics'}
            className={`p-2 rounded-lg border text-xs transition ${
              physicsEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {physicsEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            onClick={handleResetLayout}
            title="Reset View"
            className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area (Whitish canvas) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[640px] bg-slate-50/80 rounded-3xl border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-sm"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #cbd5e1 1.2px, transparent 1.2px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* Legend */}
        <div className="absolute top-4 left-4 z-20 p-3.5 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md shadow-lg text-xs space-y-2 pointer-events-auto">
          <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
            Graph Legend
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shadow-xs" />
              <span className="text-slate-700 font-medium">Community 1 (u01 - u05)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600 shadow-xs" />
              <span className="text-slate-700 font-medium">Community 2 (u06 - u08)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-600 shadow-xs" />
              <span className="text-slate-700 font-medium">Community 3 (u09 Vivaan)</span>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <span className="w-4 h-0.5 bg-slate-400 rounded" />
              <span className="text-slate-600">Friendship (Undirected Edge)</span>
            </div>
            {highlightPath.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-amber-500 rounded shadow-xs" />
                <span className="text-amber-700 font-bold">BFS Shortest Path</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions banner */}
        <div className="absolute bottom-4 left-4 z-20 text-[11px] text-slate-600 bg-white/90 px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-xs pointer-events-none hidden md:block font-medium">
          Click & drag nodes • Drag canvas to pan • Scroll to zoom • Click node to inspect details
        </div>

        {/* SVG Drawing Layer */}
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Edges */}
          <g className="edges">
            {edges.map((edge, idx) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = isEdgeInPath(edge.source, edge.target);

              return (
                <line
                  key={`${edge.source}-${edge.target}-${idx}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isHighlighted ? '#D97706' : '#94A3B8'}
                  strokeWidth={isHighlighted ? 4 : 2}
                  strokeDasharray={isHighlighted ? '6 3' : 'none'}
                  className={isHighlighted ? 'animate-pulse' : 'transition-colors'}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isInPath = highlightPath.includes(node.id);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer transition-transform"
                >
                  {/* Glowing selection / path ring */}
                  {(isSelected || isInPath) && (
                    <circle
                      r={node.radius + 8}
                      fill="none"
                      stroke={isInPath ? '#D97706' : '#4F46E5'}
                      strokeWidth={3}
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Outer circle with whitish fill and vibrant community border */}
                  <circle
                    r={node.radius}
                    fill="#FFFFFF"
                    stroke={isInPath ? '#D97706' : node.color}
                    strokeWidth={isSelected || isHovered ? 4 : 2.8}
                    className="transition-all duration-150"
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.12))"
                  />

                  {/* Node ID label */}
                  <text
                    textAnchor="middle"
                    dy="-3"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {node.id}
                  </text>

                  {/* Node Name label */}
                  <text
                    textAnchor="middle"
                    dy="11"
                    fill="#475569"
                    fontSize="9"
                    fontWeight="600"
                    pointerEvents="none"
                  >
                    {node.name}
                  </text>

                  {/* Degree badge */}
                  <circle
                    cx={node.radius * 0.75}
                    cy={-node.radius * 0.75}
                    r={8}
                    fill={node.color}
                    className="shadow-xs"
                  />
                  <text
                    x={node.radius * 0.75}
                    y={-node.radius * 0.75 + 3}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    pointerEvents="none"
                  >
                    {node.degree}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-80 p-5 rounded-2xl bg-white/95 border border-slate-200 backdrop-blur-md shadow-2xl text-xs space-y-4 animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: selectedNode.color }}
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedNode.name}</h4>
                  <span className="font-mono text-[11px] text-indigo-600 font-bold">
                    {selectedNode.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Community:</span>
                <span className="font-bold text-slate-900">Community {selectedNode.community_id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Degree (Friends):</span>
                <span className="font-mono font-bold text-emerald-600">{selectedNode.degree}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Adjacent Friends
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.friends?.length > 0 ? (
                  selectedNode.friends.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[11px] border border-slate-200 font-semibold"
                    >
                      {f}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No connections</span>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => {
                  setPathSource(selectedNode.id);
                  showToast(`Set ${selectedNode.id} as BFS source`, 'success');
                }}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-semibold transition"
              >
                Set as Source
              </button>
              <button
                onClick={() => {
                  setPathTarget(selectedNode.id);
                  showToast(`Set ${selectedNode.id} as BFS destination`, 'success');
                }}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-semibold transition"
              >
                Set as Target
              </button>
            </div>
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredNode && !selectedNode && (
          <div
            className="absolute z-30 pointer-events-none p-2.5 rounded-xl bg-slate-900/90 text-white border border-slate-800 backdrop-blur-md shadow-xl text-xs space-y-0.5"
            style={{
              left: `${hoveredNode.x * zoom + pan.x + 25}px`,
              top: `${hoveredNode.y * zoom + pan.y - 30}px`,
            }}
          >
            <div className="font-bold flex items-center gap-1.5">
              <span>{hoveredNode.name}</span>
              <span className="font-mono text-indigo-300 text-[10px]">({hoveredNode.id})</span>
            </div>
            <div className="text-[11px] text-slate-300">
              Community {hoveredNode.community_id} • {hoveredNode.degree} friends
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
