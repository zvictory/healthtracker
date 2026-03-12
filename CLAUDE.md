# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start Vite dev server (usually localhost:5173/5174)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
npm run lint     # ESLint check
```

No test framework is currently configured.

## Architecture

**HealthTracker** is a React 19 PWA for breastfeeding mothers to track daily health habits (tasks, water, bowel movements). All UI text is in **Uzbek (Latin script)**. Data is 100% client-side via `localStorage`.

### Tech Stack

React 19 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`) + react-router-dom 7 + recharts 3 (lazy-loaded) + lucide-react + date-fns 4 + vite-plugin-pwa

### Key Patterns

- **All 7 pages are `React.lazy()`** loaded in `App.jsx` with `<Suspense>` — recharts (~328KB) only downloads when Statistics page is visited
- **`useDaily()` is the single source of truth** — all tracking data flows through this hook. It reads/writes `localStorage` key `healthtracker_daily` and handles midnight resets
- **Scoring formula**: `(tasks_done/total × 70) + (min(water/target, 1) × 20) + (bowel ? 10 : 0)` — max 100
- **Card system**: `.card` class in `@layer components` (index.css) — shadow-first depth, no visible borders, 20px radius. Placed in `@layer` so Tailwind utilities can override background
- **CSS custom properties in `@theme`** generate Tailwind utilities (e.g., `--color-success-light` → `bg-success-light`)
- **Dark mode**: `.dark` class on `<html>`, variable swap in index.css. Modes: `auto` (after 20:00), `on`, `off`
- **Responsive**: Mobile-first. `BottomNav` on mobile, 260px `Sidebar` on desktop (`lg:1024px+`)
- **Icons**: Lucide React SVGs only — no emoji as UI icons (food emojis kept as content)
- **Font**: Plus Jakarta Sans (400–800) via Google Fonts

### Data Flow

```
useDaily() → todayData (localStorage)
  ├── useWater()  → addGlass(), removeGlass(), isConstipationMode (auto 10→12 at 3+ days)
  ├── useBowel()  → logBowelMovement(), daysSinceLast, alertLevel
  ├── useScore()  → auto-calculated from daily data
  ├── useStreak() → currentStreak, earnedAchievements
  └── useSmartTips() → dynamic tips from tipEngine
```

### Alert Thresholds (Bowel)

| Days without | Level | Behavior |
|---|---|---|
| 0–2 | Normal | Green indicator |
| 3–4 | Warning | Amber alert, water target → 12 |
| 5+ | Danger | Red alert, "consult doctor" |

## Code Conventions

- Functional React with hooks only — `export default function ComponentName()`
- Props destructured in function signature
- Tailwind for all styling — inline `style={}` only for truly dynamic values (colors from data, gradients)
- PascalCase components, camelCase hooks/utils, hooks prefixed `use`
- All user-facing strings hardcoded in Uzbek (no i18n yet)
- Extend existing hooks rather than rewriting — `useDaily`, `useStorage`, `useWater`, `useBowel` are stable

## localStorage Keys

| Key | Content |
|---|---|
| `healthtracker_daily` | All daily tracking data (keyed by date) |
| `healthtracker_settings` | User preferences |
| `healthtracker_reminders` | Notification schedule |
| `healthtracker_darkmode` | Dark mode setting |

## Future Development

See `ROADMAP.md` for the 5-phase development plan (UX Polish → Backend → Telegram Bot → Doctor/Admin → Intelligence) and 68 feature specifications (F1–F68).
