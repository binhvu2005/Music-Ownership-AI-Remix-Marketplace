'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';

export default function SongDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const songId = resolvedParams.id;
  
  // Mock song details
  const song = {
    id: songId,
    title: 'Summer Breeze',
    creator: 'Original Creator',
    bpm: 110,
    key: 'Am',
    genre: 'Synthwave',
    license: 'remix',
    stems: [
      { type: 'vocals', active: true },
      { type: 'drums', active: true },
      { type: 'bass', active: true },
      { type: 'melody', active: true },
    ],
  };

  const [stemStates, setStemStates] = useState(song.stems);

  const toggleStem = (index: number) => {
    const updated = [...stemStates];
    updated[index].active = !updated[index].active;
    setStemStates(updated);
  };

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
                <p className="text-gray-400">by {song.creator}</p>
                <div className="flex space-x-2 mt-2 text-xs font-mono text-gray-500">
                  <span className="bg-gray-800 px-2 py-0.5 rounded">{song.bpm} BPM</span>
                  <span className="bg-gray-800 px-2 py-0.5 rounded">{song.key}</span>
                  <span className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-2 py-0.5 rounded">{song.genre}</span>
                </div>
              </div>
            </div>
            
            <Link
              href={`/studio?songId=${song.id}`}
              className="bg-[#10B981] hover:bg-[#059669] text-black font-bold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 text-center transition"
            >
              Open in AI Remix Studio
            </Link>
          </div>

          {/* Waveform Visualization Mock */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>0:00</span>
              <span>3:00</span>
            </div>
            <div className="h-20 bg-gray-950/60 rounded-xl border border-gray-800 flex items-center justify-evenly px-4 overflow-hidden">
              {[...Array(60)].map((_, i) => {
                const height = Math.abs(Math.sin(i * 0.15)) * 48 + 4;
                return (
                  <div
                    key={i}
                    style={{ height: `${height}px` }}
                    className="w-1.5 bg-[#8B5CF6]/60 rounded-full"
                  />
                );
              })}
            </div>
          </div>

          {/* Stems Separation Section */}
          <div>
            <h2 className="text-lg font-bold mb-4">Stem Controls (Audio Demucs separated)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stemStates.map((stem, index) => (
                <div
                  key={stem.type}
                  className={`border p-4 rounded-xl flex flex-col justify-between h-28 transition ${
                    stem.active ? 'bg-gray-900 border-[#8B5CF6]' : 'bg-gray-950 border-gray-800 opacity-60'
                  }`}
                >
                  <span className="text-xs uppercase tracking-wider text-gray-500 font-bold">{stem.type}</span>
                  <button
                    onClick={() => toggleStem(index)}
                    className={`mt-4 py-1.5 rounded-lg text-xs font-semibold ${
                      stem.active ? 'bg-[#8B5CF6] text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {stem.active ? 'MUTE' : 'UNMUTE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
