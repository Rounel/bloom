# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bloomfield Terminal — a financial dashboard for West African markets (BRVM, macro indicators, FX, news). French-language UI, dark theme by default. All data is local mock data; there is no backend API.

## Commands

```bash
npm run dev      # Development server (Next.js)
npm run build    # Production build
npm run start    # Run production server
npm run lint     # ESLint
```

Package manager is **pnpm** (`pnpm-lock.yaml` is present). Use `pnpm install` to add dependencies.

## Architecture

**Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand, shadcn/ui (Radix UI), Recharts.

### Directory layout

```
app/                   # Next.js App Router — only layout.tsx and page.tsx
components/
  dashboard/           # Dashboard shell (header, sidebar, workspace, status bar)
  dashboard/panels/    # 10 panel components (one per financial data type)
  ui/                  # shadcn/ui components — do not edit these manually
lib/
  dashboard-store.ts   # Zustand store — all panel state lives here
  mock-data.ts         # All financial data fixtures and generators
  utils.ts             # cn() helper only
hooks/                 # use-mobile, use-toast
styles/globals.css     # Tailwind CSS + OKLch design tokens (light & dark)
```

### Panel system

The dashboard is built around floating, draggable, resizable panels:

- **`lib/dashboard-store.ts`** — single Zustand store managing every panel's `id`, `type`, `x/y`, `width/height`, `isMinimized`, `isMaximized`, and `zIndex`. Contains `findOptimalPosition()` for collision-free auto-placement.
- **`components/dashboard/panel-registry.tsx`** — maps `PanelType` string → component. Add a new panel here and in the store's `PanelType` union.
- **`components/dashboard/draggable-panel.tsx`** — shell wrapping every panel; handles drag, resize, minimize/maximize, z-index.
- **`components/dashboard/workspace.tsx`** — renders desktop (draggable) and mobile (vertical list) layouts based on `lg` breakpoint.

### Adding a panel

1. Create `components/dashboard/panels/<name>.tsx` (mark `'use client'` if interactive).
2. Add the type to the `PanelType` union in `lib/dashboard-store.ts`.
3. Register it in `components/dashboard/panel-registry.tsx`.
4. Optionally add a default entry to `defaultPanels` in the store.

### Mock data

All data is in `lib/mock-data.ts`. Stock price history is generated with a **seeded PRNG** (`createRng` / mulberry32) keyed on `basePrice * 31 + days`, with a fixed reference date (`2026-04-10`). This keeps server and client renders identical. **Do not replace the PRNG with `Math.random()`** — it will cause hydration mismatches.

### Hydration rules

- `new Date()` and `Math.random()` in render paths cause SSR/client mismatches. For time displays, initialize state as `''` and set the real value in `useEffect`.
- `toLocaleString()` / `toLocaleTimeString()` without an explicit locale tag can also mismatch — always pass `'fr-FR'`.

### Styling

- Tailwind CSS v4 (no `tailwind.config.*` — config is inline in `globals.css` with `@theme`).
- CSS custom properties in OKLch: `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--chart-1..5`, `--sidebar-*`, etc.
- Dark theme is the default (`class="dark"` on `<html>`); light theme variables are in `@layer base`.
- Use `cn()` from `lib/utils.ts` for conditional class merging.

### Next.js config notes

`next.config.mjs` sets `typescript: { ignoreBuildErrors: true }` — TypeScript errors will not fail the build. Fix type errors anyway; don't rely on this flag.
