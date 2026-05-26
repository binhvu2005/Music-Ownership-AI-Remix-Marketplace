---
name: StemVerse
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3b3742'
  surface-container-lowest: '#0f0d15'
  surface-container-low: '#1d1a23'
  surface-container: '#211e27'
  surface-container-high: '#2c2832'
  surface-container-highest: '#37333d'
  on-surface: '#e7e0ed'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e7e0ed'
  inverse-on-surface: '#322f39'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#15121b'
  on-background: '#e7e0ed'
  surface-variant: '#37333d'
typography:
  headline-display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 32px
  gutter: 24px
  sidebar-width: 280px
  player-height: 96px
---

## Brand & Style
The design system embodies a "High-Tech Audio Infrastructure" aesthetic. It targets music producers, developers, and audiophiles who demand precision and a premium experience. The visual language bridges the gap between a consumer-facing streaming platform and a professional-grade developer environment.

The style is defined by **Glassmorphism** and **Corporate Modern** aesthetics. It utilizes deep slate surfaces, razor-thin borders, and vibrant neon accents to create a sense of depth and technical sophistication. The emotional response is one of focus, power, and futuristic reliability.

## Colors
The palette is rooted in a "Deep Slate" environment to minimize eye strain during long sessions. 
- **Primary Purple:** Used for the most critical actions, active navigation states, and brand-heavy moments. It features a neon glow effect when used on dark backgrounds.
- **Emerald Green:** Reserved specifically for "Success," "Active Playback," and "Live" indicators, drawing inspiration from high-end audio hardware LEDs.
- **Surface Strategy:** Layers are built using incremental slate tones. The background is near-black (#0B0F19), while interactive surfaces use #1F2937 to pop from the canvas.

## Typography
The typography system uses a dual-sans serif approach to achieve a "Tech-Pro" feel.
- **Hanken Grotesk** is used for headlines. Its contemporary, sharp geometry provides a modern, clean look for tracks, albums, and section headers.
- **Geist** is used for body text, metadata, and labels. Its technical, monospaced-influenced proportions ensure legibility in data-heavy views (like track durations, file sizes, or stem lists).
- **Hierarchy:** High-contrast white (#F9FAFB) is used for primary headers. Secondary gray (#9CA3AF) is used for body copy and metadata to create a clear visual stack.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. 
- **The Sidebar:** A fixed width of 280px, utilizing a glassmorphic background blur (Backdrop Filter: 20px) to separate it from the main canvas.
- **The Grid:** A 12-column system is used within the main content area. Content spans 2, 3, 4, or 6 columns depending on the device size.
- **The Player:** A persistent bottom bar (#0B0F19 at 80% opacity) with a top-border of 1px in #2D3748.
- **Breakpoints:** 
  - Mobile (<768px): Sidebar hides into a hamburger menu; margins reduce to 16px.
  - Tablet (768px - 1024px): 8-column grid; 24px margins.
  - Desktop (>1024px): Full 12-column grid; 32px margins.

## Elevation & Depth
Depth is created through "Tonal Stacking" and "Luminous Accents" rather than traditional shadows.
- **Level 0 (Canvas):** #0B0F19.
- **Level 1 (Cards/Containers):** #1F2937 with a 1px border of #2D3748.
- **Level 2 (Modals/Popovers):** #1F2937 with a Backdrop Filter (blur 12px) and a subtle 0 0 20px rgba(139, 92, 246, 0.1) primary glow.
- **The "Glass" Effect:** Semi-transparent surfaces should use a 60-80% opacity fill and a high-contrast 1px border to maintain structural integrity against the dark background.

## Shapes
The shape language is consistently rounded to soften the technical edge of the slate-and-neon palette.
- **Base Components:** 0.5rem (8px) for buttons, inputs, and small chips.
- **Large Components:** 1rem (16px) for album art, main content cards, and the persistent player bar.
- **Extra Large:** 1.5rem (24px) for prominent hero sections or layout-defining containers.

## Components
- **Buttons:** 
  - *Primary:* Solid #8B5CF6 with white text. On hover, apply a 10px spread glow of the same color.
  - *Secondary:* Outlined with #2D3748, transitioning to a light purple tint on hover.
- **Cards:** Use #1F2937 with a 1px border. Album art inside cards should have a subtle 8px border radius.
- **Inputs:** Darker background (#0B0F19) with #2D3748 borders. On focus, the border changes to #8B5CF6 with a 0.5px outer glow.
- **Progress Bars (Player):** The track progress uses #8B5CF6 for the active fill and #2D3748 for the rail. The playhead thumb is a white circle, visible only on hover.
- **Waveforms:** Rendered in Emerald Green (#10B981) with a 40% opacity for the "background" of the wave and 100% opacity for the "played" section.
- **Chips/Tags:** Small, pill-shaped elements with #1F2937 background and #9CA3AF text. Used for genre tags or file types (e.g., .WAV, .MP3).