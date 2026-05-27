"use client";

import React, { useState, useRef } from "react";
import { useLanguage } from "../../../context/LanguageContext";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadPage() {
  const { t } = useLanguage();
  
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
      
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const parts = [];
      
      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const partNumber = i + 1;
        
        const urlRes = await fetch(`${API_URL}/music/upload/${sessionId}/url?partNumber=${partNumber}`);
        if (!urlRes.ok) throw new Error(`Failed to authorize chunk ${partNumber}`);
        const { url } = await urlRes.json();
        
        const uploadChunkRes = await fetch(url, { method: 'PUT', body: chunk });
        if (!uploadChunkRes.ok) throw new Error(`Failed to upload binary chunk ${partNumber}`);
        
        const eTag = uploadChunkRes.headers.get('ETag');
        if (!eTag) throw new Error(`Cloudflare R2 did not return ETag for chunk ${partNumber}`);
        
        parts.push({ PartNumber: partNumber, ETag: eTag });
        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
      
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
    <div className="min-h-screen bg-background text-text-primary p-8 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto mt-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">
            {t('upload.title')}
          </h1>
          <p className="text-text-secondary text-sm">{t('upload.drag_drop_full')}</p>
        </header>

        <div className="bg-surface border border-glass-border rounded-3xl p-8 shadow-xl relative overflow-hidden transition-colors duration-300">
          {status === "success" ? (
            <div className="text-center py-16 space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30 shadow-lg shadow-primary/20">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold">{t('common.success')}!</h2>
              <p className="text-text-secondary max-w-md mx-auto">
                Your track is securely stored and is now being processed by our AI Engine for tempo, key detection, and waveform extraction.
              </p>
              <button 
                onClick={() => { setFile(null); setStatus("idle"); setProgress(0); }}
                className="mt-6 px-8 py-3 bg-primary hover:bg-primary-hover text-white dark:text-background font-bold rounded-xl transition shadow-lg shadow-primary/20"
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
                  file ? 'border-primary bg-primary/5' : 'border-glass-border hover:border-text-muted hover:bg-glass-bg'
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
                    <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
                      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm12-3c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold">{file.name}</p>
                    <p className="text-xs text-text-muted font-mono">{(file.size / (1024 * 1024)).toFixed(2)} MB • Audio Track</p>
                    {status !== 'uploading' && (
                      <button onClick={() => setFile(null)} className="text-xs text-error hover:opacity-80 underline mt-2 block mx-auto transition">
                        Remove File
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-glass-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-glass-border">
                      <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-text-primary font-medium">{t('upload.drag_drop_full')}</p>
                    <p className="text-text-muted text-xs font-mono">WAV, MP3, FLAC (Max 500MB)</p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 px-6 py-2.5 bg-glass-bg hover:bg-glass-border border border-glass-border rounded-xl text-sm font-semibold transition shadow-sm"
                    >
                      Browse Local Files
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-4 bg-error-bg/10 border border-error-bg/20 rounded-xl text-error text-sm animate-in slide-in-from-top-2">
                  {errorMsg}
                </div>
              )}

              {/* Metadata Form */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{t('upload.song_title')}</label>
                  <input 
                    type="text" 
                    value={metadata.title}
                    onChange={e => setMetadata({...metadata, title: e.target.value})}
                    disabled={status === 'uploading'}
                    className="w-full bg-glass-bg border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl p-4 text-text-primary transition disabled:opacity-50"
                    placeholder="Enter track name..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">{t('upload.genre')}</label>
                    <select 
                      value={metadata.genre}
                      onChange={e => setMetadata({...metadata, genre: e.target.value})}
                      disabled={status === 'uploading'}
                      className="w-full bg-glass-bg border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl p-4 text-text-primary appearance-none disabled:opacity-50"
                    >
                      <option value="pop">Pop</option>
                      <option value="electronic">Electronic / EDM</option>
                      <option value="hiphop">Hip Hop / Rap</option>
                      <option value="rock">Rock / Alternative</option>
                      <option value="rnb">R&B / Soul</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">License Rights</label>
                    <select 
                      value={metadata.licenseType}
                      onChange={e => setMetadata({...metadata, licenseType: e.target.value})}
                      disabled={status === 'uploading'}
                      className="w-full bg-glass-bg border border-glass-border focus:border-primary focus:ring-1 focus:ring-primary outline-none rounded-xl p-4 text-text-primary appearance-none disabled:opacity-50"
                    >
                      <option value="remix">{t('upload.allow_remix')}</option>
                      <option value="standard">Standard Distribution</option>
                      <option value="exclusive">Exclusive Sale</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload Button & Progress */}
              <div className="pt-6 border-t border-glass-border">
                {status === 'uploading' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-mono">
                      <span className="text-text-secondary">Syncing chunks with Cloudflare R2...</span>
                      <span className="text-primary font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-glass-bg rounded-full overflow-hidden border border-glass-border shadow-inner">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-300 ease-out shadow-lg shadow-primary/50"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleUpload}
                    disabled={!file}
                    className="w-full py-4 rounded-2xl font-bold tracking-wider transition-all duration-300 flex justify-center items-center gap-3 bg-primary hover:bg-primary-hover text-white dark:text-background shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {t('upload.publish_btn')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
