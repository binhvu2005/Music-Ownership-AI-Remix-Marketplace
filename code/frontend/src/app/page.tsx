'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [remixPrompt, setRemixPrompt] = useState('');
  
  // Mock data for songs
  const trendingSongs = [
    { id: '1', title: 'Summer Breeze', creator: 'Original Creator', bpm: 110, key: 'Am', genre: 'Synthwave', likes: 142 },
    { id: '2', title: 'Neon Shadows', creator: 'Cyber Synth', bpm: 124, key: 'C#m', genre: 'Cyberpunk', likes: 98 },
    { id: '3', title: 'Echoes of Time', creator: 'Acoustic Nomad', bpm: 85, key: 'G major', genre: 'Lofi', likes: 210 },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] font-sans selection:bg-[#8B5CF6]/30">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold tracking-wider text-[#8B5CF6]">
          <span>🎵 StemVerse</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-400">
          <Link href="/songs" className="hover:text-white transition">Explore</Link>
          <Link href="/studio" className="hover:text-white transition">AI Remix Studio</Link>
          <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
          <Link href="/wallet" className="hover:text-white transition">Wallet</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium hover:text-white transition">Sign In</Link>
          <Link href="/upload" className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/20 transition">
            Upload
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 md:py-32 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] pointer-events-none" />
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          The <span className="text-[#8B5CF6]">GitHub + Spotify</span> for Music Creators
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Upload your original tracks, separate them into stems automatically with AI, license them for remixes, and track derivative ownership with automatic royalty splits.
        </p>

        {/* Quick AI Remix Prompt Box */}
        <div className="w-full max-w-xl bg-gray-900/60 backdrop-blur-md border border-gray-800 p-2 rounded-2xl flex items-center space-x-2 shadow-2xl">
          <input
            type="text"
            placeholder="Remix 'Summer Breeze' into dark phonk..."
            value={remixPrompt}
            onChange={(e) => setRemixPrompt(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none text-white placeholder-gray-500"
          />
          <Link
            href={`/studio?prompt=${encodeURIComponent(remixPrompt)}`}
            className="bg-[#10B981] hover:bg-[#059669] text-black font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-emerald-500/10 transition"
          >
            Remix
          </Link>
        </div>
      </section>

      {/* Trending Songs Section */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Trending Original Tracks</h2>
            <p className="text-gray-400 text-sm">Open for AI remixing & licensing</p>
          </div>
          <Link href="/songs" className="text-sm font-semibold text-[#8B5CF6] hover:text-[#7C3AED] transition">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trendingSongs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-900/40 backdrop-blur-md border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-[#8B5CF6] font-bold text-xl">
                    📻
                  </div>
                  <span className="text-xs bg-[#8B5CF6]/10 text-[#8B5CF6] px-2.5 py-1 rounded-full font-medium">
                    {song.genre}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1">{song.title}</h3>
                <p className="text-sm text-gray-400 mb-4">by {song.creator}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-4 text-xs font-mono text-gray-500">
                <div className="flex space-x-3">
                  <span>⏱ {song.bpm} BPM</span>
                  <span>🎹 {song.key}</span>
                </div>
                <Link
                  href={`/song/${song.id}`}
                  className="text-[#10B981] hover:underline flex items-center space-x-1"
                >
                  <span>Listen</span>
                  <span>▶</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500 bg-[#0B0F19]">
        <p>© {new Date().getFullYear()} StemVerse. All rights reserved.</p>
      </footer>
    </div>
  );
}
