// Alert rules per profile type
// Each rule defines: what to check, warning threshold, danger threshold, messages

export const ALERT_RULES = {
  breastfeeding_constipation: {
    type: 'bowel_days',
    check: (history) => {
      let days = 0
      for (const d of history) {
        if (d.bowel?.happened) break
        days++
      }
      return days
    },
    warning: { threshold: 3, message: '3 kundan ortiq ich kelmayapti. Tabiiy usullarni kuchaytiring!' },
    danger:  { threshold: 5, message: "5 kundan ortiq ich kelmayapti. Shifokorga murojaat qiling." },
  },

  insulin_resistance: {
    type: 'sugar_meals',
    check: (history) => {
      // Count sugar meals in last 7 days
      const week = history.slice(0, 7)
      return week.reduce((sum, d) => {
        const meals = d.meals?.entries || []
        return sum + meals.filter(m => m.sugar).length
      }, 0)
    },
    warning: { threshold: 3, message: "Bu hafta 3 marta shakarli ovqat yedingiz. Ehtiyot bo'ling!" },
    danger:  { threshold: 5, message: "Shakarli ovqat ko'paydi. Shifokorga murojaat qiling." },
  },

  fat_burning: {
    type: 'missed_exercise',
    check: (history) => {
      let days = 0
      for (const d of history) {
        if ((d.exercise?.totalMinutes || 0) > 0) break
        days++
      }
      return days
    },
    warning: { threshold: 3, message: "3 kundan beri mashq qilmadingiz. Bugun 15 daqiqa yuring!" },
    danger:  { threshold: 5, message: "5 kun mashqsiz o'tdi. Faol harakatni tiklang!" },
  },

  sugar_free: {
    type: 'sugar_slips',
    check: (history) => {
      const week = history.slice(0, 7)
      return week.reduce((sum, d) => {
        const meals = d.meals?.entries || []
        return sum + meals.filter(m => m.sugar).length
      }, 0)
    },
    warning: { threshold: 3, message: "Bu hafta 3 marta shakar iste'mol qildingiz." },
    danger:  { threshold: 5, message: "Shakar iste'moli ko'paydi. Rejani qayta ko'rib chiqing." },
  },

  general_wellness: {
    type: 'low_score_streak',
    check: (history) => {
      let days = 0
      for (const d of history) {
        if ((d.score || 0) >= 40) break
        days++
      }
      return days
    },
    warning: { threshold: 3, message: "3 kun ketma-ket past ball. Bugun bir oz ko'proq harakat qiling!" },
    danger:  { threshold: 5, message: "5 kun past ball. Maqsadlaringizni qayta ko'rib chiqing." },
  },
}

// Get alert level for a profile
export function getProfileAlert(profileType, history) {
  const rule = ALERT_RULES[profileType]
  if (!rule) return { level: 'normal', message: null, value: 0 }

  const value = rule.check(history)

  if (value >= rule.danger.threshold) {
    return { level: 'danger', message: rule.danger.message, value }
  }
  if (value >= rule.warning.threshold) {
    return { level: 'warning', message: rule.warning.message, value }
  }
  return { level: 'normal', message: null, value }
}
