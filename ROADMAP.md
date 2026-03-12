# Sog'liq Kuzatuvchi — Complete Development Bible

> **Save as `CLAUDE.md` in your project root. This is the single source of truth — it contains the project context, code audit, competitive research, feature specifications with priority tiers, UX design patterns, and implementation roadmap.**

---

## 1. Project Identity

You are working on **Sog'liq Kuzatuvchi** (HealthTracker), a Progressive Web App for breastfeeding mothers to track constipation prevention habits. All UI text is in **Uzbek (Latin script)**. The app is being evolved from a localStorage-only PWA into a full multi-user platform with backend, authentication, RBAC, Telegram bot integration, and modern gamification.

**Target user**: Breastfeeding mothers in Uzbekistan, ages 20-40, budget Android phones, intermittent connectivity. The app must be fast, offline-capable, and feel rewarding to use daily.

**Competitive benchmark**: The app should feel as polished as Garmin Connect, Fitbit, Headspace, or Noom — not a hobby project. Reference apps: Gentler Streak (Apple Design Award for sustainable fitness UX), Calm (3x retention from smart reminders), Yoga-Go ($2M/month from great onboarding), MySugr (gamified chronic health tracking).

---

## 2. Current Tech Stack (DO NOT change without approval)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.x |
| Build | Vite | 8.x |
| Styling | Tailwind CSS v4 | 4.x |
| Routing | react-router-dom | 7.x |
| Charts | recharts (lazy-loaded) | 3.x |
| Icons | lucide-react | latest |
| Dates | date-fns | 4.x |
| PWA | vite-plugin-pwa | 1.x |
| Animations | framer-motion | (to add) |
| State | React Context + hooks | built-in |

**Font**: Plus Jakarta Sans (400–800)
**Icons**: Lucide React SVGs only — no emoji as UI icons

---

## 3. Current Architecture & Code Audit

```
src/                          # ~2,148 lines, 55 files
├── pages/                    # 7 pages (React.lazy)
│   ├── Dashboard.jsx         # 85 ln — REDESIGN (no sparklines, no XP, no stat pills)
│   ├── Tasks.jsx             # 159 ln — SOLID (best page — time-grouped, collapsible, confetti)
│   ├── WaterTracker.jsx      # 99 ln — SOLID (needs undo, splash animation)
│   ├── BowelJournal.jsx      # 68 ln — CONVERT to bottom sheet
│   ├── Statistics.jsx         # 65 ln — EXTEND (add challenges, XP, PDF export)
│   ├── FoodGuide.jsx         # 65 ln — KEEP
│   └── Settings.jsx          # 140 ln — EXTEND (add profile, Telegram, language)
├── components/
│   ├── bowel/                # BowelAlert(29), BowelHistory(63), BowelLogForm(61)
│   ├── dashboard/            # HealthScoreCard(66), QuickStats(69), MoodSelector(42-SOLID), SmartTips(47-SOLID), StreakCounter(21)
│   ├── layout/               # Layout(28), Sidebar(78), BottomNav(42)
│   ├── settings/             # DarkModeToggle(25), NotificationPermission(40), ReminderSettings(28)
│   ├── shared/               # ProgressRing(32-SOLID), ConfettiEffect(42), Toast(17-EXTEND), ConfirmDialog(24), PageHeader(11), LoadingSpinner(7)
│   ├── stats/                # WeeklyCharts(56), MonthlyHeatmap(115), TrendAnalysis(119), AchievementBadges(51), WeeklySummary(25)
│   ├── tasks/                # TaskItem(45), AddTaskModal(64), TaskMotivation(30)
│   └── water/                # GlassAnimation(43)
├── hooks/
│   ├── useDaily.js           # 66 ln — SOLID (central data, partial updates, historical)
│   ├── useStorage.js         # 40 ln — SOLID (cross-tab sync, error handling)
│   ├── useWater.js           # 44 ln — SOLID (constipation mode auto-switch)
│   ├── useBowel.js           # 33 ln — SOLID (alert levels, history)
│   ├── useScore.js           # 16 ln — WATCH (useEffect loop risk)
│   ├── useStreak.js          # 40 ln — EXTEND (no shields, needs memoization)
│   ├── useSmartTips.js       # 14 ln — THIN (no time awareness)
│   ├── useNotifications.js   # 88 ln — SOLID
│   └── useDarkMode.js        # 25 ln — SOLID (auto after 20:00)
├── data/                     # defaultTasks(25), foodGuide(21), tips(52), achievements(51)
├── utils/                    # constants(37), dateUtils(55), scoreCalculator(19), tipEngine(83)
├── App.jsx                   # 30 ln — routes with React.lazy + Suspense
├── main.jsx                  # 13 ln — BrowserRouter entry
└── index.css                 # 199 ln — theme tokens, dark mode, card system, animations
```

### Known Bugs & Issues

1. **useScore.js** — useEffect writes score back to todayData on every render cycle. `todayData.score !== score` guard exists but fragile with object references. Add useMemo.
2. **useStreak.js** — `getHistoricalData(30)` creates new array reference each render → achievements re-check every render. Add memoization.
3. **vite.config.js** — PWA manifest references `.png` icons but `/public` only has `.svg`. Install prompt will fail.
4. **No onboarding** — new users land on empty dashboard with zero data. Top-priority fix.
5. **No BottomSheet** — BowelLogForm is full-page navigation for a 10-second action.

### Design System (from index.css)

```css
--color-primary: #0D9488;      /* Teal — nav, active */
--color-success: #10B981;      /* Emerald — completed, good */
--color-water: #3B82F6;        /* Blue — water tracking */
--color-warning: #F59E0B;      /* Amber — tips, 3-day alert */
--color-danger: #EF4444;       /* Red — 5-day alert, harmful */
--color-accent: #8B5CF6;       /* Violet — mood, achievements */
```

- Cards: shadow-first depth (no borders), 20px radius
- Dark mode: `.dark` class, variable swap, auto after 20:00
- Responsive: mobile-first, bottom nav mobile, 260px sidebar desktop (lg:1024px+)
- Animations: fadeIn, scaleIn, slideUp, confetti-fall, flame, pulse-soft — all respect prefers-reduced-motion

### Data Model (localStorage)

```js
{
  date: "2026-03-13",
  tasks: { morning_water: { done: true, time: "06:45" }, ... },  // 16 default + custom
  water: { target: 10, consumed: 6, log: ["06:45", "08:30"] },
  bowel: { happened: false, time: null, consistency: null, notes: "" },
  mood: null,        // 'good' | 'okay' | 'bad'
  score: 0,          // 0-100 auto-calculated
  custom_tasks: []
}
```

**Scoring**: `(tasks_done/total × 70) + (min(water/target, 1) × 20) + (bowel ? 10 : 0)`

---

## 4. UX Design Principles (from competitive research)

These are the patterns that separate top-rated health apps from mediocre ones. Apply to every component you build.

### 4.1 First Impression (Onboarding)

- **Personalized onboarding quiz (3-5 screens)**: Tailors the entire experience from day one. Yoga-Go generates $2M/month partly from this. Ask goals, health state, reminder preferences. Pre-fill settings based on answers.
- **Instant value on first screen**: After onboarding, show a pre-filled dashboard with today's plan immediately. Never show an empty state to a new user — pre-populate defaults.
- **Zero-friction first action**: The first thing a user does should take ONE tap and give instant feedback (e.g., "Tap to log your first glass of water" → splash animation + encouraging text).

### 4.2 Daily Engagement Loop

- **One-tap logging**: The #1 rule. Never require more than one tap for the most common action. Water: tap = +1 glass. Task: tap = toggle done. This is non-negotiable.
- **Undo instead of confirm**: Don't ask "Are you sure?" for reversible actions. Log immediately, show 5-second toast with "Undo" button. Cuts interaction time in half. Garmin and Fitbit both use this.
- **Time-grouped task lists**: Morning/Daytime/Evening sections. Auto-collapse past time blocks. Auto-expand current group. Reduces cognitive load.
- **Swipe gestures**: Swipe right = complete, swipe left = skip. Long-press for details. Gesture-driven tracking feels faster than buttons on mobile.

### 4.3 Gamification & Motivation

- **Streak system with shields**: Consecutive-day counter with visual flame icon. "Streak shields" forgive 1 missed day per week (Duolingo pattern). Losing a long streak is the #1 retention killer — prevent it.
- **Achievement badges with tiers**: 15-25 badges, each with bronze/silver/gold tiers. Displayed on profile. Shareable to social/Telegram. Locked badges show preview to motivate.
- **XP & level system**: Daily score feeds lifetime XP. Levels 1-50 with milestone names. Profile shows level prominently. Creates long-term progression beyond daily tracking.
- **Weekly challenges**: Time-boxed goals that rotate: "Drink 12 glasses every day this week." Optional, fresh, with badge rewards. Keeps engagement beyond daily routine.
- **Celebration micro-animations**: Confetti on 100% score. Water splash on glass log. Checkmark draw animation. Haptic feedback. Small dopamine hits make logging rewarding.
- **Progressive urgency reminders**: 1st: gentle ("Suv ichish vaqti!"). 2nd: contextual ("4/10 stakan, 3 soat qoldi"). 3rd: kind ("Ertaga yangi kun — o'zingizni ayablamang"). Never nag.

### 4.4 Data & Insights

- **Weekly trend mini-charts**: Sparkline on dashboard cards showing 7-day trends. Score up? Green arrow. Water dropping? Amber warning. Patterns at a glance.
- **Monthly heatmap calendar**: GitHub-style grid where each day's color = health score. Instant visual of consistency over 30/90 days. (You already have this — keep it.)
- **AI weekly summary**: Natural language recap in Uzbek: "Bu hafta 82% o'rtacha ball (+5%). Seshanba va payshanba ertalab suv o'tkazildi. Ich kelishi yaxshilandi — kefirni davom ettiring!"
- **Correlation insights**: "Ertalab vazifalarni bajarganingizda o'rtacha ball 85, o'tkazganingizda 52." Data-driven nudges connecting behavior to outcomes.
- **Exportable PDF reports**: Doctor-friendly PDF with charts, bowel frequency, water trends, score history. QR code linking to live dashboard. Essential for doctor-patient workflow.

### 4.5 Visual Design System

- **Soft, rounded, minimal UI**: No sharp edges, no heavy borders. Large border-radius (16-20px), subtle shadows, generous whitespace. Calming palette — teal/sage primary. Think Headspace, not Excel.
- **Dark mode (auto + manual)**: Auto-switch after 20:00 or system. 82% of mobile users enable dark mode. Muted teal/blue accents on dark backgrounds. (You have this — it's good.)
- **Illustration-first empty states**: Warm SVG illustration + encouraging Uzbek text + CTA button. Never a blank screen. "Bugun boshlang — birinchi stakan suvni kiriting!"
- **Micro-interactions everywhere**: Button press scales (0.97), cards lift on hover, progress rings animate with spring physics. Every interaction should feel alive. Use framer-motion.

### 4.6 Platform & Accessibility

- **PWA native feel**: Standalone mode, pull-to-refresh, bottom sheet modals, haptic feedback. Should feel indistinguishable from native app.
- **Offline-first**: All tracking works without internet. Queue syncs on reconnect. Critical for Uzbekistan connectivity.
- **Accessibility**: 4.5:1 contrast, 44px touch targets, screen reader labels, reduced-motion mode. Health apps serve vulnerable users — a11y is not optional.
- **Multi-language**: i18n from day one. Uzbek primary, Russian secondary, English planned. Content in JSON files, not hardcoded.

---

## 5. Complete Feature Specifications (with Priority Tiers)

### Priority Legend

- 🟢 **MUST-HAVE** — Ship is incomplete without this. Build in Phase 1.
- 🔵 **RECOMMENDED** — Significantly improves UX. Build in Phase 1-2.
- 🟣 **PREMIUM** — Differentiator from competitors. Build in Phase 3-5.

---

### 5.1 Onboarding & First Experience

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F1 | Personalized onboarding quiz (4 screens: name, baby info, goals, reminders) | 🟢 MUST | 1 | NEW: `pages/Onboarding.jsx`, `hooks/useOnboarding.js`, `components/onboarding/*` |
| F2 | Instant value first screen — pre-populated dashboard after onboarding | 🟢 MUST | 1 | MODIFY: `pages/Dashboard.jsx` |
| F3 | Zero-friction first action — guided first water log with celebration | 🔵 REC | 1 | MODIFY: `pages/WaterTracker.jsx` |
| F4 | Onboarding skip + revisit from settings | 🔵 REC | 1 | MODIFY: `pages/Settings.jsx` |

### 5.2 Dashboard & Daily View

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F5 | Hero health score ring — larger (200px), animated fill, color transitions (red<40, amber 40-70, green>70) | 🟢 MUST | 1 | MODIFY: `components/dashboard/HealthScoreCard.jsx` |
| F6 | Glanceable stat pills — compact horizontal row: water, tasks, bowel, streak | 🟢 MUST | 1 | NEW: `components/dashboard/StatPills.jsx` |
| F7 | Weekly sparkline — 7-day score trend inside score card | 🟢 MUST | 1 | NEW: `components/dashboard/WeeklySparkline.jsx` |
| F8 | Customizable dashboard widget order — drag to reorder cards | 🔵 REC | 2 | MODIFY: `pages/Dashboard.jsx` |
| F9 | Smart contextual tips — time-aware, data-pattern-based, never repeats same tip twice in a row | 🔵 REC | 1 | MODIFY: `hooks/useSmartTips.js`, `utils/tipEngine.js` |
| F10 | Bowel alert integrated banner (not separate component) with smooth animation | 🟢 MUST | 1 | MODIFY: `pages/Dashboard.jsx`, `components/bowel/BowelAlert.jsx` |

### 5.3 Gamification System

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F11 | Streak shields — 1 free miss per week, visual shield indicator, streak preserved | 🟢 MUST | 1 | MODIFY: `hooks/useStreak.js` |
| F12 | Achievement badges — expand 4→16 with bronze/silver/gold tiers | 🟢 MUST | 1 | MODIFY: `data/achievements.js`, `components/stats/AchievementBadges.jsx` |
| F13 | XP system — daily score → lifetime XP, levels 1-50, milestone names | 🟢 MUST | 1 | NEW: `hooks/useXP.js`, `components/shared/LevelProgress.jsx` |
| F14 | Celebration micro-animations — confetti, splash, checkmark draw, haptics | 🔵 REC | 1 | MODIFY: `components/shared/ConfettiEffect.jsx`, `components/tasks/TaskItem.jsx`, `components/water/GlassAnimation.jsx` |
| F15 | Weekly challenges — rotating time-boxed goals with badge rewards | 🟣 PREMIUM | 1 | NEW: `hooks/useChallenges.js`, `data/challenges.js`, `components/stats/ChallengeList.jsx` |
| F16 | Points/XP leaderboard — optional, friends or community | 🟣 PREMIUM | 4 | NEW: backend required |

### 5.4 Tracking UX

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F17 | One-tap water logging — tap = +1, no confirmation | 🟢 MUST | 1 | Already works. Enhance with animation. |
| F18 | Undo toast — 5-second undo button instead of confirm dialog | 🟢 MUST | 1 | MODIFY: `components/shared/Toast.jsx` → add action button support |
| F19 | Time-grouped tasks with auto-collapse past groups | 🟢 MUST | 1 | MODIFY: `pages/Tasks.jsx` (partially exists — auto-expand current, but no auto-collapse past) |
| F20 | Swipe-to-complete tasks — swipe right = done, left = skip | 🔵 REC | 1 | MODIFY: `components/tasks/TaskItem.jsx` — add framer-motion drag |
| F21 | Per-group progress bar in task list headers | 🔵 REC | 1 | MODIFY: `pages/Tasks.jsx` |
| F22 | Bottom sheet for bowel log — not full page navigation | 🟢 MUST | 1 | NEW: `components/shared/BottomSheet.jsx`, MODIFY: `components/bowel/BowelLogForm.jsx` |
| F23 | Bottom sheet for add task modal | 🔵 REC | 1 | MODIFY: `components/tasks/AddTaskModal.jsx` |
| F24 | Visual Bristol scale selector — illustrations instead of text labels | 🔵 REC | 1 | MODIFY: `components/bowel/BowelLogForm.jsx` |

### 5.5 Data Visualization & Insights

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F25 | Weekly trend mini-charts on dashboard cards | 🟢 MUST | 1 | Already partially exists in stats. Bring sparkline to dashboard. |
| F26 | Monthly heatmap calendar (GitHub-style) | 🟢 MUST | — | Already exists: `MonthlyHeatmap.jsx` (115 ln). Keep. |
| F27 | Comparison charts — this week vs last week overlay | 🔵 REC | 1 | MODIFY: `components/stats/WeeklyCharts.jsx` |
| F28 | AI-generated weekly summary (natural language, Uzbek) | 🟣 PREMIUM | 5 | NEW: Anthropic API integration |
| F29 | Correlation insights ("when you do X, score is Y") | 🟣 PREMIUM | 5 | NEW: `utils/correlationEngine.js` |
| F30 | Exportable PDF health reports with QR code | 🔵 REC | 2 | NEW: `utils/pdfExport.js` |

### 5.6 Notifications & Reminders

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F31 | Smart notification timing — learn user patterns, nudge before usual time | 🔵 REC | 3 | MODIFY: `hooks/useNotifications.js` |
| F32 | Progressive urgency — gentle → contextual → kind, never nagging | 🟢 MUST | 1 | MODIFY: `utils/tipEngine.js`, notification messages |
| F33 | Telegram reminders via bot (6 daily, configurable) | 🟢 MUST | 3 | NEW: bot server |
| F34 | Constipation mode extra reminders (added automatically at 3+ days) | 🟢 MUST | 1 | Already exists in useWater. Extend to notifications. |

### 5.7 Visual Design & Polish

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F35 | Soft rounded minimal UI — 16-20px radius, subtle shadows, generous whitespace | 🟢 MUST | — | Already mostly done (20px radius, shadow-card). Minor tweaks. |
| F36 | Dark mode auto + manual | 🟢 MUST | — | Already done. Keep. |
| F37 | Empty state illustrations — SVG per section with encouraging text | 🔵 REC | 1 | NEW: `components/shared/EmptyState.jsx` |
| F38 | Micro-interactions — spring physics buttons, animated transitions, card lift | 🔵 REC | 1 | MODIFY: multiple components, add framer-motion |
| F39 | Page transitions — framer-motion AnimatePresence between routes | 🔵 REC | 1 | MODIFY: `App.jsx` |
| F40 | Haptic feedback — navigator.vibrate() on tap actions | 🔵 REC | 1 | MODIFY: `components/tasks/TaskItem.jsx`, water buttons |

### 5.8 Platform & Accessibility

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F41 | PWA native feel — standalone, pull-to-refresh, install prompt | 🟢 MUST | — | Already done via vite-plugin-pwa. Fix PNG icon issue. |
| F42 | Offline-first — all tracking works without internet | 🟢 MUST | — | Already done via localStorage. Backend adds sync queue. |
| F43 | Accessibility — contrast, touch targets, aria labels, reduced motion | 🟢 MUST | 1 | AUDIT all components, add missing labels |
| F44 | i18n foundation — Uzbek primary, Russian secondary, English stub | 🔵 REC | 1 | NEW: `i18n/uz.json`, `i18n/ru.json`, `hooks/useTranslation.js` |
| F45 | Multi-language selector in settings | 🔵 REC | 1 | MODIFY: `pages/Settings.jsx` |

### 5.9 Authentication & Multi-User (Phase 2)

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F46 | User registration (name, email, phone, password) | 🟢 MUST | 2 | NEW: `pages/Register.jsx`, server endpoints |
| F47 | JWT login with access (15m) + refresh (7d) tokens | 🟢 MUST | 2 | NEW: `pages/Login.jsx`, `context/AuthContext.jsx` |
| F48 | RBAC — 4 roles (user, doctor, admin, superadmin) | 🟢 MUST | 2 | NEW: middleware, `components/shared/ProtectedRoute.jsx` |
| F49 | Role-adaptive navigation — sidebar/bottomnav changes per role | 🟢 MUST | 2 | MODIFY: `components/layout/Sidebar.jsx`, `BottomNav.jsx` |
| F50 | localStorage → server data migration on first login | 🟢 MUST | 2 | NEW: migration endpoint + client logic |
| F51 | Offline sync queue — track locally, sync on reconnect | 🔵 REC | 2 | NEW: `hooks/useSyncQueue.js` |

### 5.10 Telegram Bot (Phase 3)

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F52 | Bot registration — /start → collect name/phone → create account | 🟢 MUST | 3 | NEW: bot server |
| F53 | Account linking — /link → email → OTP → verified | 🟢 MUST | 3 | NEW: telegram_otp table, endpoints |
| F54 | Health commands — /water, /task, /bowel, /mood, /today, /stats | 🟢 MUST | 3 | NEW: bot command handlers |
| F55 | Inline keyboard task toggling | 🔵 REC | 3 | NEW: bot keyboard builders |
| F56 | BullMQ reminder queue — 6 daily, configurable, timezone-aware | 🟢 MUST | 3 | NEW: queue workers |
| F57 | Telegram Mini App — full PWA inside Telegram | 🔵 REC | 3 | MODIFY: auth to support WebApp.initData |
| F58 | Doctor alerts via bot — patient warning notifications | 🔵 REC | 3 | NEW: doctor notification handlers |

### 5.11 Doctor & Admin (Phase 4)

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F59 | Doctor dashboard — patient list with health summaries | 🟢 MUST | 4 | NEW: `pages/DoctorDashboard.jsx` |
| F60 | Patient detail view — history, charts, bowel frequency | 🟢 MUST | 4 | NEW: `pages/PatientDetail.jsx` |
| F61 | Clinical notes on patient records | 🔵 REC | 4 | NEW: notes endpoints + UI |
| F62 | Admin user management — CRUD, activate/deactivate | 🟢 MUST | 4 | NEW: `pages/AdminDashboard.jsx` |
| F63 | Doctor-patient assignment | 🟢 MUST | 4 | NEW: assignment endpoints + UI |
| F64 | Audit log viewer | 🔵 REC | 4 | NEW: `pages/AuditLogs.jsx` |

### 5.12 Intelligence Layer (Phase 5)

| # | Feature | Priority | Phase | Files |
|---|---------|----------|-------|-------|
| F65 | AI weekly summary — GPT-generated Uzbek recap | 🟣 PREMIUM | 5 | NEW: Anthropic API call |
| F66 | Cross-metric correlations — "task X correlates with better bowel health" | 🟣 PREMIUM | 5 | NEW: `utils/correlationEngine.js` |
| F67 | Trend predictions — score trajectory, bowel regularity forecast | 🟣 PREMIUM | 5 | NEW: prediction logic |
| F68 | PDF health report — one-tap export for doctor visits | 🔵 REC | 4 | NEW: `utils/pdfExport.js` |

---

## 6. Development Rules

### Code Style

- Functional React with hooks only (no class components)
- `export default function ComponentName()` pattern
- Props destructured in function signature
- Hooks in `src/hooks/`, prefixed with `use`
- Tailwind for styling — inline styles only for dynamic values
- All user-facing text in Uzbek (Latin), via i18n keys once set up
- PascalCase components, camelCase hooks/utils

### Performance

- New pages: `React.lazy()` + `Suspense`
- Heavy libs (recharts, framer-motion): lazy-loaded
- Images: WebP, `loading="lazy"`
- No blocking renders — `useDeferredValue` or `startTransition` for heavy computations
- Target: <3s first contentful paint on 3G

### Accessibility

- All interactive elements: `aria-label` or visible label
- Color contrast: 4.5:1 minimum
- Touch targets: 44x44px minimum
- Keyboard navigation for all flows
- `prefers-reduced-motion` respected (already in index.css)

### Mobile-First

- Design for 375px first, scale up
- Bottom nav: max 5 items (currently: Home, Tasks, Water, Journal, Stats)
- Cards: full-width mobile, grid desktop
- Bottom sheets for secondary actions
- Swipe gestures for common actions

---

## 7. Phased Implementation Roadmap

### Phase 1: UX Polish & Gamification (2-3 weeks, frontend only)

**Goal**: Make existing app feel modern and engaging. Ship and get feedback.

| Step | Features | New Files | Modified Files |
|------|----------|-----------|----------------|
| 1.1 Onboarding | F1, F2, F3, F4 | `pages/Onboarding.jsx`, `hooks/useOnboarding.js`, 4 step components | `App.jsx`, `Settings.jsx` |
| 1.2 Gamification | F11, F12, F13, F15 | `hooks/useXP.js`, `hooks/useChallenges.js`, `data/challenges.js`, `components/shared/LevelProgress.jsx`, `components/stats/ChallengeList.jsx` | `data/achievements.js`, `hooks/useStreak.js`, `components/stats/AchievementBadges.jsx` |
| 1.3 Animations | F14, F38, F39, F40 | — | `HealthScoreCard.jsx`, `TaskItem.jsx`, `GlassAnimation.jsx`, `ConfettiEffect.jsx`, `App.jsx` |
| 1.4 Bottom Sheet | F22, F23 | `components/shared/BottomSheet.jsx` | `BowelLogForm.jsx`, `AddTaskModal.jsx` |
| 1.5 Dashboard | F5, F6, F7, F9, F10 | `components/dashboard/StatPills.jsx`, `components/dashboard/WeeklySparkline.jsx` | `Dashboard.jsx`, `HealthScoreCard.jsx`, `useSmartTips.js` |
| 1.6 Task UX | F18, F19, F20, F21 | — | `Tasks.jsx`, `TaskItem.jsx`, `Toast.jsx` |
| 1.7 Polish | F37, F43, F44, F45 | `components/shared/EmptyState.jsx`, `i18n/uz.json`, `i18n/ru.json`, `hooks/useTranslation.js` | `Settings.jsx`, accessibility audit |

### Phase 2: Backend & Auth (2-3 weeks)

F46-F51 + database schema + API endpoints

### Phase 3: Telegram Bot (1-2 weeks)

F52-F58 + grammY server + BullMQ reminders

### Phase 4: Doctor & Admin (1-2 weeks)

F59-F64 + F68 + admin panel + doctor views

### Phase 5: Intelligence (1 week)

F65-F67 + AI integration + correlation engine

**Total: 7-11 weeks to full platform.**

---

## 8. Uzbek UI Terminology

| English | Uzbek |
|---------|-------|
| Dashboard | Bosh sahifa |
| Tasks | Vazifalar |
| Water | Suv |
| Bowel journal | Ichak jurnali |
| Statistics | Statistika |
| Settings | Sozlamalar |
| Food guide | Ovqat qo'llanmasi |
| Score / Points | Ball |
| Streak | Ketma-ketlik |
| Achievement / Badge | Yutuq / Nishon |
| Completed | Bajarildi |
| Morning | Ertalab |
| Daytime | Kun davomida |
| Evening | Kechqurun |
| Extra | Qo'shimcha |
| Good / Okay / Bad | Yaxshi / O'rtacha / Yomon |
| Doctor | Shifokor |
| Patient | Bemor |
| Reminder | Eslatma |
| Profile | Profil |
| Log out | Chiqish |
| Register | Ro'yxatdan o'tish |
| Login | Kirish |
| Save / Cancel | Saqlash / Bekor qilish |
| Delete / Confirm | O'chirish / Tasdiqlash |
| Today / This week / This month | Bugun / Bu hafta / Bu oy |
| Level | Daraja |
| Challenge | Sinov |
| Offline / Syncing | Oflayn / Sinxronlanmoqda |
| Shield (streak) | Qalqon |
| Water glass | Stakan |
| Bowel movement | Ich kelishi |
| Constipation | Ich qotishi |
| Consult a doctor | Shifokorga murojaat qiling |

---

## 9. How to Work With Claude

1. **Always read existing code first** before modifying — use `cat` or `view` on files
2. **One feature per conversation** — don't build everything at once
3. **Show file diffs** — explain what changes and why
4. **Test on 375px viewport** — this is mobile-first
5. **Keep Uzbek accurate** — if unsure, ask the developer
6. **Preserve design tokens** — use CSS custom properties from index.css
7. **Performance matters** — lazy-load, code-split, defer. Budget phones.
8. **Extend hooks, don't rewrite** — useDaily, useStorage, useWater, useBowel are stable
