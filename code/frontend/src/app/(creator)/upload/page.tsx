"use client";

import React, { useState, useRef } from "react";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    genre: "pop",
    licenseType: "remix",
  });
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('audio/')) {
        setErrorMsg("Please upload an audio file (.mp3, .wav, .flac)");
        return;
      }
      setFile(selectedFile);
      setMetadata(prev => ({ ...prev, title: selectedFile.name.split('.')[0] }));
      setErrorMsg("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('audio/')) {
        setErrorMsg("Please upload an audio file (.mp3, .wav, .flac)");
        return;
      }
      setFile(droppedFile);
      setMetadata(prev => ({ ...prev, title: droppedFile.name.split('.')[0] }));
      setErrorMsg("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // Step 1: Init Upload Session on NestJS Backend
      const initRes = await fetch(`${API_URL}/music/upload/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: metadata.title,
          genre: metadata.genre,
          filename: file.name,
          fileSize: file.size,
          licenseType: metadata.licenseType
        })
      });
      
      if (!initRes.ok) throw new Error("Failed to initialize secure upload session.");
      
      const { sessionId, uploadId, key, songId } = await initRes.json();
      
      // Step 2: Slice file and upload Chunks directly to Cloudflare R2
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const parts = [];
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;
        
        // 2a. Request Presigned URL for this specific chunk
        const urlRes = await fetch(`${API_URL}/music/upload/${sessionId}/url?partNumber=${partNumber}`);
        if (!urlRes.ok) throw new Error(`Failed to authorize chunk ${partNumber}`);
        const { url } = await urlRes.json();
        
        // 2b. PUT binary chunk directly to Cloudflare R2
        const uploadChunkRes = await fetch(url, {
          method: 'PUT',
          body: chunk,
        });
        
        if (!uploadChunkRes.ok) throw new Error(`Failed to upload binary chunk ${partNumber}`);
        
        // 2c. Extract ETag returned by R2 to reconstruct file later
        const eTag = uploadChunkRes.headers.get('ETag');
        if (!eTag) throw new Error(`Cloudflare R2 did not return ETag for chunk ${partNumber}`);
        
        parts.push({ PartNumber: partNumber, ETag: eTag });
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
      
      // Step 3: Complete Upload to trigger AI processing
      const completeRes = await fetch(`${API_URL}/music/upload/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parts, songId })
      });
      
      if (!completeRes.ok) throw new Error("Failed to finalize upload and enqueue AI task.");
      
      setStatus("success");
      
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus("error");
      setErrorMsg(err.message || "An unexpected error occurred during the upload process.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] p-8 font-sans">
      <div className="max-w-3xl mx-auto mt-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#3B82F6]">
            Upload Your Stem
          </h1>
          <p className="text-gray-400 text-sm">Upload raw stems or full tracks for AI Analysis and Remixing.</p>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl shadow-emerald-900/10 relative overflow-hidden">
          {/* Status Display */}
          {status === "success" ? (
            <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <svg className="w-12 h-12 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Upload Complete!</h2>
              <p className="text-gray-400 max-w-md mx-auto">Your track is securely stored and is now being processed by our AI Engine for tempo, key detection, and waveform extraction.</p>
              <button 
                onClick={() => { setFile(null); setStatus("idle"); setProgress(0); }}
                className="mt-6 px-8 py-3 bg-[#10B981] hover:bg-[#059669] text-black font-bold rounded-xl transition shadow-lg shadow-emerald-500/20"
              >
                Upload Another Track
              </button>
            </div>
          ) : (
            <div className="space-y-8 relative z-10">
              {/* Drag and Drop Zone */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                  file ? 'border-[#10B981] bg-emerald-500/5' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="audio/mp3, audio/wav, audio/flac"
                  className="hidden" 
                />
                
                {file ? (
                  <div className="space-y-3 animate-in fade-in">
                    <div className="w-16 h-16 bg-[#10B981]/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#10B981]/30">
                      <svg className="w-8 h-8 text-[#10B981]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12-3c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-white">{file.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB • Audio Track</p>
                    {status !== 'uploading' && (
                      <button onClick={() => setFile(null)} className="text-xs text-red-400 hover:text-red-300 underline mt-2 block mx-auto transition">
                        Remove File
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-gray-300 font-medium">Drag and drop your audio file here</p>
                    <p className="text-gray-500 text-xs font-mono">WAV, MP3, FLAC (Max 500MB)</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-semibold transition shadow-sm"
                    >
                      Browse Local Files
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in slide-in-from-top-2">
                  {errorMsg}
                </div>
              )}

              {/* Metadata Form */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Track Title</label>
                  <input 
                    type="text" 
                    value={metadata.title}
                    onChange={e => setMetadata({...metadata, title: e.target.value})}
                    disabled={status === 'uploading'}
                    className="w-full bg-gray-950/50 border border-gray-800 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none rounded-xl p-4 text-white transition disabled:opacity-50"
                    placeholder="Enter track name..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Genre</label>
                    <select 
                      value={metadata.genre}
                      onChange={e => setMetadata({...metadata, genre: e.target.value})}
                      disabled={status === 'uploading'}
                      className="w-full bg-gray-950/50 border border-gray-800 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none rounded-xl p-4 text-white appearance-none disabled:opacity-50"
                    >
                      <option value="pop">Pop</option>
                      <option value="electronic">Electronic / EDM</option>
                      <option value="hiphop">Hip Hop / Rap</option>
                      <option value="rock">Rock / Alternative</option>
                      <option value="rnb">R&B / Soul</option>
                      <option value="ambient">Ambient / Chill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">License Rights</label>
                    <select 
                      value={metadata.licenseType}
                      onChange={e => setMetadata({...metadata, licenseType: e.target.value})}
                      disabled={status === 'uploading'}
                      className="w-full bg-gray-950/50 border border-gray-800 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none rounded-xl p-4 text-white appearance-none disabled:opacity-50"
                    >
                      <option value="remix">Allow AI Remixing (70/20/10 Split)</option>
                      <option value="standard">Standard Distribution</option>
                      <option value="exclusive">Exclusive Sale</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Button & Progress */}
              <div className="pt-6 border-t border-gray-800/80">
                {status === 'uploading' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-gray-400">Syncing chunks with Cloudflare R2...</span>
                      <span className="text-[#10B981] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-950 rounded-full overflow-hidden border border-gray-800/60 shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-[#10B981] to-[#3B82F6] transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleUpload}
                    disabled={!file}
                    className="w-full py-4 rounded-2xl font-bold tracking-wider transition-all duration-300 flex justify-center items-center gap-3 bg-[#10B981] hover:bg-[#059669] text-black shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    UPLOAD TO STEMVERSE
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 max-w-xl mx-auto leading-relaxed">
          By uploading, you agree to StemVerse's Terms of Service. If you select <span className="text-gray-400">"Allow AI Remixing"</span>, derivative works generated by other users will automatically trigger smart contract royalty splits.
        </div>
      </div>
    </div>
  );
}
