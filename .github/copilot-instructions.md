# My Music Store - AI Agent Instructions

## Project Overview
A modern Next.js 16 music player application with TypeScript, SCSS modules, and Zustand for state management. The app provides music streaming, artist browsing, and playlist management with offline-first capabilities.

## Architecture & Key Patterns

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript (strict mode disabled for flexibility)
- **Styling**: SCSS modules with CSS custom properties for theming
- **State**: Zustand for global state (player, theme, playlists)
- **Data**: Local JSON files in `server/` directory (no backend API)
- **Audio**: ReactPlayer for video playback, native Audio API for music
- **Icons**: Lucide React for UI icons

### Directory Structure
- `app/` - Next.js App Router pages with route groups `(home)` and `(pages)`
- `components/` - Organized by feature (player/, sidebar/, header/, etc.)
- `store/` - Zustand stores (app-store.ts, theme-store.ts)
- `services/server/` - Data fetching functions from local JSON
- `public/musics/` - Static audio files (bangla/, hindi/, topSong/, trends/)
- `server/` - JSON data files (banglaSong.json, hindiSong.json, etc.)
- `styles/partials/` - SCSS variables, mixins, themes

### State Management with Zustand

**AppStore** (`store/app-store.ts`):
- Manages music playback state (currentMusic, isPlaying, volume, repeat, shuffle)
- Persists to localStorage with key from `NEXT_PUBLIC_APP_STORE` env
- Uses custom `changeAppLocalStorage` helper for atomic updates
- Key state: `currentMusic`, `playList`, `playListId`, `repeatType`, `volume`, `shuffleIndex`, `currentMusicTime`

**ThemeStore** (`store/theme-store.ts`):
- Manages dark/light mode toggle
- Persists theme preference to localStorage

**Critical Pattern**: State is initialized client-side via `AppInitializer.tsx` which:
1. Reads from localStorage on mount
2. Preloads first audio file using `<link rel="preload" as="audio">`
3. Fallback to default state if no stored data exists

### Data & Types

**Music Interface** (`typings.d.ts`):
```typescript
interface Music {
  id: number
  name: string
  src: string  // Path to audio file in /public/musics/
  coverImage: string  // Base64 encoded image
  avatar: string      // Base64 encoded artist image
  artist: string
  playedCount: number
}
```

**Data Source**: All music data lives in JSON files under `server/`:
- `banglaSong.json`, `hindiSong.json`, `topSong.json`
- Files contain arrays with base64-encoded images (large payloads)
- No external API - everything is bundled with the app

### Styling Conventions

**SCSS Modules**:
- Every component has a matching `.module.scss` file
- Use CSS custom properties from `styles/globals.scss` for colors
- Primary color: `#5773ff` (adjustable via `$primary-color` variable)
- Dark theme: Inverts color scheme using CSS custom properties

**Theme Implementation**:
- `ThemeProvider` wraps app in `layout.tsx`
- Toggles `data-theme="dark"` on `<body>` element
- CSS variables update automatically (see `styles/partials/_dark-theme.scss`)

### Audio Playback Strategy

**Performance Optimizations**:
1. **Preloading**: First track from playlists is preloaded via `<link rel="preload">`
2. **Client-Only**: All audio logic wrapped in `"use client"` directives
3. **State Sync**: Player state synced to localStorage after every change
4. **Custom Hooks**: `use-audio-duration.tsx`, `use-format-second.ts` for audio metadata

**Player Component Architecture**:
- `Player.tsx` - Main container (hidden on `/video` routes)
- `PlayerControl.tsx` - Playback controls (play/pause, next/prev, seek)
- `PlayerInfo.tsx` - Track metadata display
- `PlayerInfoPlayListItem.tsx` - Playlist item rendering

### Common Development Patterns

**File Organization**:
- Components grouped by feature, not type
- Each component directory has its own SCSS module
- Shared types in `typings.d.ts`, hook types in `hooks/hooks.d.ts`

**Routing**:
- App Router with parallel routes: `(home)/page.tsx` for root, `(pages)/` for nested pages
- Route groups keep URLs clean (e.g., `/artists` not `/pages/artists`)

**Data Fetching**:
- All data fetching in `services/server/` directory
- No async components - data passed as props from server components to client components
- Example: `app/(home)/page.tsx` fetches data, passes to `<Index />` client component

**Styling Best Practices**:
- Import SCSS module as `styles` object
- Use semantic class names: `styles.container`, `styles.card`, not `styles.div1`
- Prefer CSS custom properties over hard-coded colors
- Mobile-first responsive design (use `@media` queries)
- **Responsive breakpoints**:
  - Desktop: `@media (min-width: 1025px)`
  - Tablet: `@media (max-width: 1024px)`
  - Mobile: `@media (max-width: 768px)`
  - Small Mobile: `@media (max-width: 480px)`
  - Use mixins from `styles/partials/_mixin.scss`: `@include tablet`, `@include mobile`, etc.

### Build & Environment

**Scripts**:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server

**Environment Variables**:
- `NEXT_PUBLIC_APP_STORE` - localStorage key for app state
- `NEXT_PUBLIC_TITLE` - App title for metadata

**Build Configuration** (`next.config.js`):
- `reactStrictMode: false` - Strict mode disabled
- `unoptimized: true` - Image optimization disabled
- Console logs removed in production (except errors/warnings)
- Allowed image domains: i.imgur.com, i.scdn.co, i.ytimg.com

### Common Gotchas

1. **Client-side only**: Music player must be wrapped in `"use client"` - no SSR for audio
2. **Large JSON files**: Base64 images in JSON make files large (~100KB+)
3. **Path imports**: Use `@/` alias for imports (configured in `tsconfig.json`)
4. **SCSS imports**: Always import partials for variables/mixins access
5. **Type definitions**: Extend global types in `typings.d.ts`, not component files
6. **Responsive design**: All components are fully responsive - maintain breakpoint consistency across new components

### Responsive Design System

**Breakpoint Strategy**:
- **Desktop (1025px+)**: Full layout with visible sidebar
- **Tablet (768px - 1024px)**: Sidebar becomes collapsible drawer, adjusted spacing
- **Mobile (481px - 768px)**: Vertical layouts, stacked player controls
- **Small Mobile (≤480px)**: Minimal UI, hidden non-essential elements

**Key Responsive Patterns**:
1. **Sidebar**: Fixed position drawer on mobile/tablet with slide-in animation
2. **Player**: Stacks vertically on mobile, full width on tablet+
3. **Grid Layouts**: Auto-adjust columns based on screen size (using CSS Grid `auto-fill`)
4. **Typography**: Scales down proportionally at each breakpoint
5. **Spacing**: Reduces padding/margins at smaller screens
6. **Navigation**: Sidebar hidden by default on mobile (toggle button needed)

### Testing & Debugging

**Key Points**:
- No formal testing setup currently
- Use browser DevTools for audio debugging
- Check localStorage for persisted state
- Verify SCSS compilation in browser inspector
- Use React DevTools for Zustand state inspection

### When Adding Features

**New Music Sources**:
1. Add JSON file to `server/` directory
2. Create service function in `services/server/`
3. Add route in `app/(pages)/`
4. Update sidebar links in `constants/sidebar-links.ts`

**New Themes**:
1. Add CSS variables to `styles/partials/_variables.scss`
2. Update dark theme overrides in `_dark-theme.scss`
3. No JS changes needed (uses CSS custom properties)

**New Player Features**:
1. Update `AppStoreState` interface in `store/store.d.ts`
2. Add state logic to `app-store.ts`
3. Update localStorage sync in `changeAppLocalStorage` function
4. Add UI in appropriate Player component

---

**Remember**: This is an offline-first app with no backend. All data is bundled at build time. Focus on client-side performance and localStorage reliability.
