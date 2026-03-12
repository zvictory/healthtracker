# Sog'liq Kuzatuvchi — HealthTracker PWA

A daily health tracking Progressive Web App built for breastfeeding mothers to manage constipation prevention through habits, hydration, and bowel movement monitoring. All UI text is in **Uzbek**. Data stays 100% on-device via `localStorage`.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Build | Vite | 8.0 |
| Styling | Tailwind CSS v4 | 4.2 |
| Routing | react-router-dom | 7.13 |
| Charts | recharts (lazy-loaded) | 3.8 |
| Icons | lucide-react | 0.577 |
| Dates | date-fns | 4.1 |
| PWA | vite-plugin-pwa | 1.2 |

```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run preview # Preview production build
```

---

## Architecture

```
src/
├── pages/            # 7 route-level components (React.lazy)
├── components/
│   ├── bowel/        # BowelAlert, BowelHistory, BowelLogForm
│   ├── dashboard/    # HealthScoreCard, QuickStats, MoodSelector, SmartTips, StreakCounter
│   ├── layout/       # Layout, Sidebar, BottomNav
│   ├── settings/     # DarkModeToggle, NotificationPermission, ReminderSettings
│   ├── shared/       # ProgressRing, ConfettiEffect, Toast, ConfirmDialog, PageHeader, LoadingSpinner
│   ├── stats/        # WeeklyCharts, MonthlyHeatmap, TrendAnalysis, AchievementBadges, WeeklySummary
│   ├── tasks/        # TaskItem, AddTaskModal, TaskMotivation
│   └── water/        # GlassAnimation
├── hooks/            # 9 custom hooks (useDaily, useWater, useBowel, useScore, useStreak, useSmartTips, useStorage, useNotifications, useDarkMode)
├── data/             # defaultTasks, foodGuide, tips, achievements
├── utils/            # constants, dateUtils, scoreCalculator, tipEngine
├── App.jsx           # Routes with React.lazy + Suspense
├── main.jsx          # BrowserRouter entry
└── index.css         # Theme (CSS custom properties), card system, animations
```

**Total: ~55 files**

---

## Routing

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Health score ring, quick stats, mood, tips, streak |
| `/tasks` | Tasks | 4 time-based groups (morning/day/evening/extra), 16 default tasks |
| `/water` | WaterTracker | Glass counter with progress ring, constipation mode (10→12 target) |
| `/bowel` | BowelJournal | Days-since counter, Bristol scale form, 14-day history |
| `/stats` | Statistics | Weekly charts (recharts), monthly heatmap (CSS grid), achievement badges |
| `/food-guide` | FoodGuide | 10 beneficial + 6 harmful foods |
| `/settings` | Settings | Notifications, water target, dark mode, data clearing |

---

## Daily Data Structure

```js
{
  date: "2026-03-13",
  tasks: {
    morning_water: { done: true, time: "06:45" },
    olive_oil: { done: false, time: null },
    // ... 16 default + custom tasks
  },
  water: {
    target: 10,           // 10 default, 12 if constipation mode
    consumed: 6,
    log: ["06:45", "08:30", ...]
  },
  bowel: {
    happened: false,
    time: null,
    consistency: null,    // 'hard' | 'normal' | 'soft' | 'liquid'
    notes: ""
  },
  mood: null,             // 'good' | 'okay' | 'bad'
  score: 0,               // 0-100, auto-calculated
  custom_tasks: []
}
```

---

## Scoring Formula

```
Score = (completedTasks / totalTasks) × 70
      + min(waterConsumed / waterTarget, 1) × 20
      + (bowelHappened ? 10 : 0)

Max: 100 points
```

| Component | Max Points | Weight |
|-----------|-----------|--------|
| Task completion | 70 | Proportional to completed/total |
| Water intake | 20 | Proportional to consumed/target, capped at 1.0 |
| Bowel movement | 10 | Boolean — all or nothing |

---

## Default Tasks (16)

### Ertalab / Morning (06:00–09:00)
- Warm water on empty stomach
- 1 tbsp olive oil
- Dried apricot water
- Oatmeal + fruit breakfast

### Kun davomida / Daytime (09:00–18:00)
- Water after each feeding
- Vegetables at lunch (beetroot, carrot, squash)
- 20–30 min walk
- Belly massage (clockwise, 5 min)
- Don't delay toilet

### Kechqurun / Evening (18:00–22:00)
- 1 glass kefir
- Light vegetable dinner
- Flaxseed (1 tsp with kefir)
- Light stretching (5–10 min)

### Qo'shimcha / Extra (optional)
- Figs (2–3 pieces)
- Beetroot salad
- Hot water with lemon

---

## Achievements (4 Badges)

| Badge | Condition |
|-------|-----------|
| 7 kun ketma-ket (7-day streak) | 70%+ score for 7 consecutive days |
| Suv ustasi (Water master) | 10+ glasses for 7 days |
| Harakatli ona (Active mom) | Walking task completed 7 days |
| Sog'lom oshqozon (Healthy gut) | Bowel movement 7+ times in 14 days |

---

## Alert System

| Days without bowel | Level | Behavior |
|-------------------|-------|----------|
| 0–2 | Normal | Green indicator |
| 3–4 | Warning | Amber alert banner, water target → 12 |
| 5+ | Danger | Red alert banner, "consult a doctor" message |

---

## Design System

**Font**: Plus Jakarta Sans (400–800)

**Colors** (CSS custom properties in `index.css`):

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#0D9488` | Teal — navigation, active states |
| `--color-success` | `#10B981` | Emerald — completed tasks, good score |
| `--color-water` | `#3B82F6` | Blue — water tracking |
| `--color-warning` | `#F59E0B` | Amber — tips, 3-day alert |
| `--color-danger` | `#EF4444` | Red — 5-day alert, harmful foods |
| `--color-accent` | `#8B5CF6` | Violet — mood, achievements |

**Card system**: `@layer components` — shadow-first depth (no visible borders), 20px radius.

**Dark mode**: CSS variable swap via `.dark` class. Modes: `auto` (after 20:00), `on`, `off`.

**Responsive**: Mobile-first. Bottom nav on mobile, 260px sidebar on desktop (`lg:1024px+`).

---

## Hooks Reference

| Hook | Purpose |
|------|---------|
| `useDaily()` | Central data: `todayData`, `updateTodayData()`, `getHistoricalData()`, `getDayData()` |
| `useWater()` | `addGlass()`, `removeGlass()`, `progress`, `isConstipationMode` |
| `useBowel()` | `logBowelMovement()`, `daysSinceLast`, `alertLevel`, `history` |
| `useScore()` | Auto-calculated score from daily data |
| `useStreak()` | `currentStreak`, `earnedAchievements`, `weeklySummary` |
| `useSmartTips()` | `tips`, `adaptiveAdvice`, `bowelTrend` |
| `useStorage(key, default)` | localStorage wrapper with cross-tab sync |
| `useNotifications()` | `permission`, `reminders`, `requestPermission()`, toast fallback |
| `useDarkMode()` | `mode`, `setDarkMode()` — auto/on/off |

---

## Storage

All data in `localStorage` — no server, no accounts, full privacy.

| Key | Content |
|-----|---------|
| `healthtracker_daily` | All daily tracking data (historical + today) |
| `healthtracker_settings` | User preferences |
| `healthtracker_reminders` | Notification schedule (6 daily reminders) |
| `healthtracker_darkmode` | Dark mode setting |

Estimated size: ~1–2 KB/day → ~500 KB/year (well within localStorage limits).

---

## PWA Configuration

- **Manifest**: `name: "Sog'liq Kuzatuvchi"`, `display: standalone`, `orientation: portrait`
- **Service Worker**: Auto-generated by `vite-plugin-pwa` (Workbox)
- **Offline**: Precached assets, works without network
- **Install**: Add to Home Screen on mobile browsers
- **Icons**: `pwa-192x192.png`, `pwa-512x512.png`

---

## Key Technical Decisions

1. **recharts lazy-loaded** — ~328 KB chunk only downloaded when Statistics page is visited
2. **Monthly heatmap is custom CSS Grid** — lighter than recharts, more flexible
3. **Score auto-recalculates** via `useScore` hook on every data change
4. **Midnight reset** — `useDaily` detects new day and creates fresh data
5. **Notification fallback** — Browser Notification API + in-app toast for iOS Safari
6. **No emoji UI icons** — all icons are Lucide React SVGs; food emojis kept as content only
