import { useMemo, useCallback } from 'react'
import { useStorage } from './useStorage'
import { useProfile } from './useProfile'
import { useDaily } from './useDaily'
import { challengePool } from '../data/challenges'

const STORAGE_KEY = 'healthtracker_challenges'

// Monday-based week key: "2026-W11"
function getWeekKey(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  // Shift to Monday-start: Sunday becomes end of previous week
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 1 - day)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function getMondayOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay() || 7
  d.setDate(d.getDate() + 1 - day)
  d.setHours(0, 0, 0, 0)
  return d
}

// Pick a challenge, seeded by week so it's deterministic (no random re-rolls on re-render)
function pickChallenge(pool, weekKey, previousIds = []) {
  if (pool.length === 0) return null
  // Prefer challenges not recently done
  const fresh = pool.filter(c => !previousIds.includes(c.id))
  const candidates = fresh.length > 0 ? fresh : pool
  // Deterministic pick based on week key hash
  let hash = 0
  for (let i = 0; i < weekKey.length; i++) {
    hash = ((hash << 5) - hash + weekKey.charCodeAt(i)) | 0
  }
  return candidates[Math.abs(hash) % candidates.length]
}

export function useChallenges() {
  const [data, setData] = useStorage(STORAGE_KEY, { history: [] })
  const { profile } = useProfile()
  const { getHistoricalData } = useDaily()

  const weekKey = getWeekKey()
  const modules = profile.activeModules || []

  // Filter pool to challenges this profile can do
  const availablePool = useMemo(() =>
    challengePool.filter(c =>
      c.requiredModules.every(m => modules.includes(m))
    ),
    [modules]
  )

  // Get or create the active challenge for this week
  const activeChallenge = useMemo(() => {
    // Already have one for this week?
    if (data.active?.weekKey === weekKey) {
      return data.active
    }
    // Need to pick a new one
    const previousIds = (data.history || []).slice(-4).map(h => h.challengeId)
    const picked = pickChallenge(availablePool, weekKey, previousIds)
    if (!picked) return null
    return {
      weekKey,
      challengeId: picked.id,
      startDate: getMondayOfWeek().toISOString().split('T')[0],
    }
  }, [data, weekKey, availablePool])

  // Persist new challenge if it was just picked
  const ensurePersisted = useCallback(() => {
    if (activeChallenge && data.active?.weekKey !== weekKey) {
      setData(prev => ({
        ...prev,
        active: activeChallenge,
      }))
    }
  }, [activeChallenge, data.active, weekKey, setData])

  // Call on mount-like timing
  useMemo(() => ensurePersisted(), [ensurePersisted])

  // Calculate progress
  const challengeDef = challengePool.find(c => c.id === activeChallenge?.challengeId)

  const { daysCompleted, isCompleted, daysRemaining } = useMemo(() => {
    if (!challengeDef || !activeChallenge) {
      return { daysCompleted: 0, isCompleted: false, daysRemaining: 0 }
    }

    const startDate = new Date(activeChallenge.startDate)
    const historical = getHistoricalData(challengeDef.duration)

    // Count days from start that satisfy the condition
    let completed = 0
    for (const day of historical) {
      const dayDate = new Date(day.date)
      if (dayDate >= startDate) {
        try {
          if (challengeDef.condition(day)) completed++
        } catch { /* condition failed, skip */ }
      }
    }

    const today = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + challengeDef.duration)
    const remaining = Math.max(0, Math.ceil((endDate - today) / 86400000))

    return {
      daysCompleted: Math.min(completed, challengeDef.targetDays),
      isCompleted: completed >= challengeDef.targetDays,
      daysRemaining: remaining,
    }
  }, [challengeDef, activeChallenge, getHistoricalData])

  // Mark completed and award XP (stored in history)
  const claimReward = useCallback(() => {
    if (!isCompleted || !challengeDef) return 0
    setData(prev => {
      // Don't double-claim
      if (prev.history?.some(h => h.weekKey === weekKey)) return prev
      return {
        ...prev,
        history: [...(prev.history || []), {
          weekKey,
          challengeId: challengeDef.id,
          completedAt: new Date().toISOString(),
          xpReward: challengeDef.xpReward,
        }],
      }
    })
    return challengeDef.xpReward
  }, [isCompleted, challengeDef, weekKey, setData])

  const alreadyClaimed = data.history?.some(h => h.weekKey === weekKey)

  return {
    activeChallenge: challengeDef ? {
      ...challengeDef,
      startDate: activeChallenge?.startDate,
    } : null,
    daysCompleted,
    targetDays: challengeDef?.targetDays || 0,
    isCompleted,
    alreadyClaimed,
    daysRemaining,
    xpReward: challengeDef?.xpReward || 0,
    progress: challengeDef ? daysCompleted / challengeDef.targetDays : 0,
    claimReward,
    completedChallenges: data.history?.length || 0,
  }
}
