---
title: Frontend Architecture
author: Solo Developer
created: 2026-05-26
status: Approved
tags:
  - architecture
  - frontend
  - nextjs
---

# Frontend Architecture — StemVerse

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State (global) | Zustand |
| Data Fetching | TanStack Query (React Query) |
| Forms | React Hook Form + Zod |
| Audio Player | Wavesurfer.js |
| Ownership Graph | D3.js |
| WebSocket | Socket.IO Client |
| Icons | Lucide React |
| Fonts | Google Fonts (Inter) |

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public routes (no auth)
│   │   ├── page.tsx              # Landing page
│   │   ├── explore/              # Browse tracks
│   │   ├── track/[id]/           # Track detail
│   │   └── creator/[id]/         # Creator profile
│   │
│   ├── (auth)/                   # Auth routes
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   │
│   ├── (app)/                    # Protected routes
│   │   ├── dashboard/            # Creator dashboard
│   │   ├── upload/               # Upload music
│   │   ├── remix/[songId]/       # Remix Studio
│   │   ├── ownership/[songId]/   # Ownership Graph view
│   │   ├── licenses/             # My licenses
│   │   ├── wallet/               # Royalty wallet
│   │   ├── marketplace/          # Browse/sell assets
│   │   └── settings/             # Profile settings
│   │
│   ├── admin/                    # Admin panel (admin only)
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── dmca/
│   │   └── disputes/
│   │
│   ├── api/                      # Next.js API routes (BFF)
│   │   └── auth/[...nextauth]/   # OAuth callbacks
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                       # Base components (Button, Input, Modal, ...)
│   ├── layout/                   # Header, Footer, Sidebar, Nav
│   ├── audio/                    # AudioPlayer, Waveform, StemVisualizer
│   ├── track/                    # TrackCard, TrackDetail, TrackGrid
│   ├── remix/                    # RemixStudio, PromptInput, FXPanel
│   ├── ownership/                # OwnershipGraph (D3.js)
│   ├── marketplace/              # AssetCard, AssetGrid
│   ├── upload/                   # UploadDropzone, UploadProgress
│   └── wallet/                   # WalletCard, RoyaltyChart
│
├── features/                     # Feature-specific logic
│   ├── auth/
│   ├── track/
│   ├── remix/
│   ├── ownership/
│   ├── licensing/
│   ├── royalty/
│   └── marketplace/
│
├── lib/
│   ├── api.ts                    # API client (axios/fetch)
│   ├── auth.ts                   # Auth helpers
│   ├── audio.ts                  # Audio processing helpers
│   └── utils.ts                  # General utilities
│
├── hooks/
│   ├── useAudio.ts               # Audio player hook
│   ├── useRemix.ts               # Remix job polling
│   ├── useWebSocket.ts           # Socket.IO hook
│   └── useOwnershipGraph.ts      # D3.js graph hook
│
├── stores/                       # Zustand stores
│   ├── audioStore.ts             # Current playing audio
│   ├── authStore.ts              # Auth state
│   └── remixStore.ts             # Remix job state
│
├── types/
│   ├── song.ts
│   ├── user.ts
│   ├── remix.ts
│   └── ownership.ts
│
└── validations/                  # Zod schemas
    ├── upload.ts
    ├── remix.ts
    └── auth.ts
```

## Key UI Components

### AudioPlayer
- Wavesurfer.js integration
- Timeline with chorus markers
- Stem mute/solo toggles
- BPM, Key display

### RemixStudio
- Left: Original waveform + stems
- Center: AI Prompt input + options
- Right: FX panel
- Bottom: Preview + publish

### OwnershipGraph
- D3.js force-directed graph
- Nodes: songs (colored by type: original/remix)
- Edges: ownership % labels
- Click node: show track detail

## Performance Strategy

| Strategy | Implementation |
|----------|---------------|
| Code splitting | Next.js automatic + dynamic() |
| Image opt | next/image |
| Font opt | next/font (Google Fonts) |
| Audio lazy load | Load waveform on demand |
| Infinite scroll | TanStack Query infinite queries |
| Server Components | Static pages (explore, landing) |
| Client Components | Interactive (player, remix studio) |

## Related

- [[System-Architecture]]
- [[ADR-001-NextJS-Frontend]]
- [[SRS-AI-Remix-Engine]]
- [[SRS-Ownership-Graph]]
