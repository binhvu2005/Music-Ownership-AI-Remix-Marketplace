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

export default function SongDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const songId = resolvedParams.id;

  const [song, setSong] = useState<SongDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [stemStates, setStemStates] = useState<Array<{ type: string; active: boolean }>>([]);

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
        </div>
      </div>
    </div>
  );
}
