'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { io } from 'socket.io-client';

interface SongDetails {
  id: string;
  title: string;
  genre: string;
  bpm: number | null;
  key: string | null;
  duration: number | null;
  processingStatus: 'queued' | 'processing' | 'done' | 'failed';
  fileUrl: string;
  owner: {
    displayName: string | null;
    email: string;
  };
  stems: Array<{
    id: string;
    type: string;
    fileUrl: string;
    duration: number | null;
  }>;
  analysis: {
    bpm: number | null;
    key: string | null;
    waveform: number[] | null;
  } | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TreeNode {
  id: string;
  title: string;
  owner: string;
  ownerId: string;
  type: string;
  x?: number;
  y?: number;
  children?: TreeNode[];
}

function buildAndLayoutTree(nodes: any[], links: any[]): { nodes: TreeNode[]; connections: any[] } {
  const nodesMap = new Map<string, TreeNode>();
  for (const n of nodes) {
    nodesMap.set(n.id, { ...n, children: [] });
  }

  const childToParent = new Map<string, string>();
  const parentToChildren = new Map<string, { target: string; split: number }[]>();

  for (const l of links) {
    const parentId = typeof l.source === 'object' ? l.source.id : l.source;
    const childId = typeof l.target === 'object' ? l.target.id : l.target;

    childToParent.set(childId, parentId);
    
    if (!parentToChildren.has(parentId)) {
      parentToChildren.set(parentId, []);
    }
    parentToChildren.get(parentId)!.push({ target: childId, split: l.split });
  }

  let rootId = nodes[0]?.id;
  for (const n of nodes) {
    if (!childToParent.has(n.id)) {
      rootId = n.id;
      break;
    }
  }

  if (!rootId) return { nodes: [], connections: [] };

  const rootNode = nodesMap.get(rootId)!;
  
  function assemble(node: TreeNode) {
    const childrenRelations = parentToChildren.get(node.id) || [];
    for (const rel of childrenRelations) {
      const childNode = nodesMap.get(rel.target);
      if (childNode) {
        node.children!.push(childNode);
        assemble(childNode);
      }
    }
  }
  assemble(rootNode);

  const DX = 260;
  const DY = 120;
  let nextY = 40;

  const positionedNodes: TreeNode[] = [];
  const connections: any[] = [];

  function layout(node: TreeNode, depth: number) {
    node.x = depth * DX + 50;

    if (!node.children || node.children.length === 0) {
      node.y = nextY;
      nextY += DY;
    } else {
      for (const child of node.children) {
        layout(child, depth + 1);
      }
      
      const firstChildY = node.children[0].y!;
      const lastChildY = node.children[node.children.length - 1].y!;
      node.y = (firstChildY + lastChildY) / 2;
    }

    positionedNodes.push(node);
  }

  layout(rootNode, 0);

  for (const l of links) {
    const parentId = typeof l.source === 'object' ? l.source.id : l.source;
    const childId = typeof l.target === 'object' ? l.target.id : l.target;

    const parent = nodesMap.get(parentId);
    const child = nodesMap.get(childId);

    if (parent && child && parent.x !== undefined && parent.y !== undefined && child.x !== undefined && child.y !== undefined) {
      connections.push({
        id: `${parentId}-${childId}`,
        parentX: parent.x,
        parentY: parent.y,
        childX: child.x,
        childY: child.y,
        split: l.split,
      });
    }
  }

  return { nodes: positionedNodes, connections };
}

export default function SongDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const songId = resolvedParams.id;

  const [song, setSong] = useState<SongDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [stemStates, setStemStates] = useState<Array<{ type: string; active: boolean }>>([]);
  const [activeTab, setActiveTab] = useState<'stems' | 'ownership'>('stems');
  const [graphData, setGraphData] = useState<{ nodes: any[]; links: any[] } | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);

  // Fetch song details
  useEffect(() => {
    const fetchSongDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/music/songs/${songId}`);
        if (!res.ok) {
          throw new Error(`Failed to load song details: ${res.status}`);
        }
        const data: SongDetails = await res.json();
        setSong(data);
        
        // Initialize stem active states
        if (data.stems) {
          setStemStates(data.stems.map(s => ({ type: s.type, active: true })));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMsg(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songId]);

  const processingStatus = song?.processingStatus;

  // WebSocket connection for real-time processing updates
  useEffect(() => {
    if (!processingStatus || processingStatus === 'done' || processingStatus === 'failed') return;

    const socket = io(`${API_URL}/music`, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log(`Connected to WebSocket Music gateway for song details: ${songId}`);
      socket.emit('subscribeToSong', { songId });
    });

    socket.on('song:status-updated', (data) => {
      console.log('Received real-time update in song details page:', data);
      if (data.songId === songId) {
        if (data.status === 'done') {
          setSong(prev => prev ? {
            ...prev,
            processingStatus: 'done',
            bpm: data.song.bpm,
            key: data.song.key,
            duration: data.song.duration,
            stems: data.stems,
            analysis: data.analysis
          } : null);
          setStemStates(data.stems.map((s: { type: string }) => ({ type: s.type, active: true })));
        } else if (data.status === 'failed') {
          setSong(prev => prev ? { ...prev, processingStatus: 'failed' } : null);
          setErrorMsg(data.error || 'AI separation failed.');
        } else if (data.status === 'processing') {
          setSong(prev => prev ? { ...prev, processingStatus: 'processing' } : null);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [processingStatus, songId]);

  const toggleStem = (index: number) => {
    const updated = [...stemStates];
    updated[index].active = !updated[index].active;
    setStemStates(updated);
  };

  // Fetch ownership graph data
  useEffect(() => {
    if (activeTab === 'ownership') {
      const fetchGraph = async () => {
        setGraphLoading(true);
        try {
          const res = await fetch(`${API_URL}/music/ownership/${songId}/graph`);
          if (res.ok) {
            const data = await res.json();
            setGraphData(data);
          }
        } catch (err) {
          console.error('Failed to fetch ownership graph:', err);
        } finally {
          setGraphLoading(false);
        }
      };
      fetchGraph();
    }
  }, [activeTab, songId]);

  const renderOwnershipGraph = () => {
    if (graphLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-400 text-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#8B5CF6] border-t-transparent mb-3"></div>
          <span>Loading ownership graph data...</span>
        </div>
      );
    }

    if (!graphData || graphData.nodes.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-950/60 rounded-2xl border border-gray-800 text-gray-500 text-sm">
          No ownership data available for this song.
        </div>
      );
    }

    const maxDepth = Math.max(...graphData.nodes.map(n => {
      let depth = 0;
      let curr = n.id;
      const parentMap = new Map(graphData.links.map(l => [typeof l.target === 'object' ? l.target.id : l.target, typeof l.source === 'object' ? l.source.id : l.source]));
      while (parentMap.has(curr)) {
        depth++;
        curr = parentMap.get(curr)!;
      }
      return depth;
    }));

    const { nodes: positionedNodes, connections } = buildAndLayoutTree(graphData.nodes, graphData.links);

    const svgWidth = Math.max(760, (maxDepth + 1) * 280 + 100);
    const svgHeight = Math.max(320, Math.max(...positionedNodes.map(n => n.y || 0)) + 120);

    return (
      <div className="w-full overflow-x-auto bg-gray-950/40 border border-gray-800/80 rounded-2xl p-6">
        <div style={{ width: `${svgWidth}px`, height: `${svgHeight}px` }} className="relative mx-auto">
          <svg width={svgWidth} height={svgHeight} className="absolute inset-0">
            {/* Draw Links */}
            {connections.map((c) => {
              const parentBoxRightX = c.parentX + 220;
              const parentBoxCenterY = c.parentY + 35;
              const childBoxLeftX = c.childX;
              const childBoxCenterY = c.childY + 35;
              
              const cp1x = parentBoxRightX + 30;
              const cp1y = parentBoxCenterY;
              const cp2x = childBoxLeftX - 30;
              const cp2y = childBoxCenterY;
              
              const pathD = `M ${parentBoxRightX} ${parentBoxCenterY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${childBoxLeftX} ${childBoxCenterY}`;
              
              return (
                <g key={c.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#4B5563"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="opacity-60"
                  />
                  <foreignObject
                    x={(parentBoxRightX + childBoxLeftX) / 2 - 25}
                    y={(parentBoxCenterY + childBoxCenterY) / 2 - 10}
                    width={50}
                    height={20}
                  >
                    <div className="bg-gray-800 text-[#10B981] border border-gray-700 text-[9px] font-bold font-mono rounded-full flex items-center justify-center h-full shadow">
                      {c.split}%
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {positionedNodes.map((node) => {
              const isCurrent = node.id === songId;
              
              return (
                <foreignObject
                  key={node.id}
                  x={node.x}
                  y={node.y}
                  width={220}
                  height={70}
                >
                  <Link
                    href={`/song/${node.id}`}
                    className={`block h-full border rounded-xl p-3 select-none transition duration-200 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#8B5CF6]/25 border-[#8B5CF6] shadow-lg shadow-purple-500/10'
                        : 'bg-gray-900/90 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900'
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[130px]" title={node.title}>
                          {node.title}
                        </span>
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          node.type === 'original' 
                            ? 'bg-purple-950/80 text-[#A78BFA] border border-purple-800/30'
                            : 'bg-emerald-950/80 text-[#34D399] border border-emerald-800/30'
                        }`}>
                          {node.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                          👤 {node.owner}
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] font-bold text-[#8B5CF6] bg-[#8B5CF6]/10 px-1 py-0.5 rounded">
                            CURRENT
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </foreignObject>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  if (errorMsg && !song) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] p-8 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8 bg-gray-900 border border-gray-800 rounded-3xl shadow-xl">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p className="text-gray-400 text-sm mb-6">{errorMsg}</p>
          <Link href="/songs" className="text-[#8B5CF6] hover:underline">Back to Explore</Link>
        </div>
      </div>
    );
  }

  if (!song) return null;

  const displayCreator = song.owner.displayName || song.owner.email.split('@')[0];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/songs" className="text-sm text-gray-400 hover:text-white transition mb-6 inline-block">
          ← Back to Explore
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 p-8 rounded-3xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-[#8B5CF6] text-4xl">
                📻
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{song.title}</h1>
                <p className="text-gray-400">by {displayCreator}</p>
                <div className="flex space-x-2 mt-2 text-xs font-mono text-gray-500">
                  <span className="bg-gray-800 px-2 py-0.5 rounded">
                    {song.bpm ? `${song.bpm} BPM` : 'BPM pending'}
                  </span>
                  <span className="bg-gray-800 px-2 py-0.5 rounded">
                    {song.key || 'Key pending'}
                  </span>
                  <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded uppercase">
                    {song.genre}
                  </span>
                </div>
              </div>
            </div>
            
            {song.processingStatus === 'done' && (
              <Link
                href={`/studio?songId=${song.id}`}
                className="bg-[#10B981] hover:bg-[#059669] text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 text-center transition"
              >
                Open in AI Remix Studio
              </Link>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-800 mb-6">
            <button
              onClick={() => setActiveTab('stems')}
              className={`py-2 px-6 font-semibold text-sm border-b-2 transition ${
                activeTab === 'stems'
                  ? 'border-[#8B5CF6] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Stems & Player
            </button>
            <button
              onClick={() => setActiveTab('ownership')}
              className={`py-2 px-6 font-semibold text-sm border-b-2 transition ${
                activeTab === 'ownership'
                  ? 'border-[#8B5CF6] text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Ownership Graph
            </button>
          </div>

          {activeTab === 'stems' ? (
            <>
              {/* Waveform Visualization */}
              <div className="mb-8">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>0:00</span>
                  <span>{song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : '--:--'}</span>
                </div>
                <div className="h-24 bg-gray-950/60 rounded-xl border border-gray-800 flex items-center justify-evenly px-4 overflow-hidden">
                  {song.processingStatus === 'done' && song.analysis?.waveform ? (
                    // Render real waveform values from backend API
                    song.analysis.waveform.slice(0, 80).map((val, i) => {
                      const height = val * 70 + 4; // Normalize heights to container size
                      return (
                        <div
                          key={i}
                          style={{ height: `${height}px` }}
                          className="w-1.5 bg-[#8B5CF6]/60 rounded-full hover:bg-[#8B5CF6] transition duration-200"
                        />
                      );
                    })
                  ) : song.processingStatus === 'failed' ? (
                    <div className="text-error text-sm font-semibold">❌ Audio analysis failed to generate waveform.</div>
                  ) : (
                    // Processing Stepper placeholder
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-400 text-sm">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#8B5CF6] border-t-transparent"></div>
                      <span>AI generating waveform & analysis points... ({song.processingStatus})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stems Separation Section */}
              <div>
                <h2 className="text-lg font-bold mb-4">Stem Controls (Audio Demucs separated)</h2>
                {song.processingStatus === 'done' ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stemStates.map((stem, index) => (
                      <div
                        key={stem.type}
                        className={`border p-4 rounded-xl flex flex-col justify-between h-28 transition ${
                          stem.active ? 'bg-gray-900 border-[#8B5CF6]' : 'bg-gray-950 border-gray-800 opacity-60'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">{stem.type}</span>
                        
                        {/* Display R2 stem audio preview links */}
                        <span className="text-[10px] text-gray-500 truncate font-mono mt-1">
                          {song.stems[index]?.fileUrl.split('/').pop()}
                        </span>

                        <button
                          onClick={() => toggleStem(index)}
                          className={`mt-3 py-1.5 rounded-lg text-xs font-semibold ${
                            stem.active ? 'bg-[#8B5CF6] text-white' : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {stem.active ? 'MUTE' : 'UNMUTE'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : song.processingStatus === 'failed' ? (
                  <div className="text-center p-6 bg-red-950/20 border border-red-900/30 rounded-2xl text-error text-sm">
                    AI stem separation failed to process this track. Stems are unavailable.
                  </div>
                ) : (
                  <div className="p-8 text-center bg-gray-950/60 rounded-2xl border border-gray-800 text-gray-500 text-sm flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent"></div>
                    <span>Stems are being separated by FastAPI AI Worker. They will display here automatically when ready.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-lg font-bold mb-4 font-sans tracking-wide">Ownership Genealogy Tree</h2>
              {renderOwnershipGraph()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
