# GreenTrack AI

A Vite + React 19 single-page app for tracking tree survival, AI plant diagnostics, GIS mapping, and community gamification.

## Commands

- `npm install` — install deps (Vite 8, React 19, Tailwind 3, Supabase, Leaflet, Chart.js, html5-qrcode, qrcode.react).
- `npm run dev` — start Vite dev server on `http://localhost:3000` (port locked in `vite.config.js`).
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built `dist/` locally.

No lint, typecheck, or test scripts are configured — do not invent them. There is no test suite.

## Environment

Copy `.env.example` to `.env`. All vars **must** be prefixed `VITE_` to be exposed to the client:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` — Supabase project creds. Without these the app silently falls back to LocalStorage (see `src/services/supabaseClient.js` — `isSupabaseConfigured` is the gate).
- `VITE_GEMINI_API_KEY` — optional. If absent or the call fails, `analyzePlantWithGemini` returns falsy and the app falls back to the local pixel-chromatic analyzer in `plantVisionService.js` (see `App.jsx:85-94`).

Apply `schema.sql` to your Supabase Postgres to create the `guilds`, `users`, `trees`, `tree_events`, `quests` tables (uses PostGIS `geom` column on `trees`).

## Architecture

- Single SPA, no router library. Tab switching is local state in `src/App.jsx` (`currentTab`: `dashboard | guilds | doctor | map | encyclopedia`). Modals are also state-driven.
- Entry: `src/main.jsx` → `src/App.jsx`. Imports `'leaflet/dist/leaflet.css'` and `'./index.css'` globally.
- Feature folders under `src/components/`: `Dashboard`, `MyForest`, `Guilds`, `PlantDoctor`, `MapTracker`, `DigitalTwin`, `Encyclopedia`.
- Data lives in `src/data/` (`plantDatabase.js`, `diseaseDatabase.js`, `guildsData.js`, `initialTrees.js`) — large static lookup tables, not API-driven.
- Services in `src/services/`: `storageService` (LocalStorage + Supabase sync), `plantVisionService` (local pixel analyzer + synthetic presets), `geminiService` (real Gemini Vision call), `botanistAIService` (chatbot), `carbonCalculator`, `supabaseClient`.

## Storage model

LocalStorage is the source of truth on first load (`loadTrees()` seeds `INITIAL_TREES` if empty). `syncTreesFromCloud()` then overwrites with Supabase rows if configured — race is intentional, not a bug. Keys: `greentrack_trees_v2`, `greentrack_user_profile_v2`. Do not rename without a migration.

## Deployment

- `vercel.json` rewrites all routes to `/index.html` (SPA fallback).
- `public/_redirects` mirrors this for Netlify-style hosts.

## Conventions / gotchas

- React 19 + Vite 8 + Tailwind 3.4. Do not bump Tailwind to v4 — config style (`tailwind.config.js`, `postcss.config.js`) is v3-shaped.
- `lucide-react` is pinned to `^1.37.0` — unusual; most ecosystems use a much newer version. Don't "fix" the version without checking imports.
- `legacy_index.html` is a pre-React CDN prototype kept for reference. Do not import from it or move it; it is not the app.
- `.opencode/` is local OpenCode config (skills, package.json) — leave it alone.
- `index.html` is the Vite entry; the root `#root` mount is required.
- No CSS modules — styling is Tailwind utility classes + CSS variables in `src/index.css` for the glassmorphism theme.
