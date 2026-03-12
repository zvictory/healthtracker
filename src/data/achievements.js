export const achievements = [
  {
    id: 'streak_7',
    name: '7 kun ketma-ket',
    description: "7 kun ketma-ket 70%+ ball to'plang",
    emoji: '🔥',
    check: (history) => {
      if (history.length < 7) return { earned: false, progress: history.length / 7 }
      const last7 = history.slice(0, 7)
      const allAbove70 = last7.every(d => d.score >= 70)
      const streak = last7.filter(d => d.score >= 70).length
      return { earned: allAbove70, progress: streak / 7 }
    },
  },
  {
    id: 'water_master',
    name: 'Suv ustasi',
    description: '7 kun 10+ stakan suv iching',
    emoji: '💧',
    check: (history) => {
      if (history.length < 7) return { earned: false, progress: 0 }
      const last7 = history.slice(0, 7)
      const daysHit = last7.filter(d => (d.water?.consumed || 0) >= 10).length
      return { earned: daysHit >= 7, progress: daysHit / 7 }
    },
  },
  {
    id: 'active_mom',
    name: 'Harakatli ona',
    description: '7 kun piyoda yurish bajarilgan',
    emoji: '🚶‍♀️',
    check: (history) => {
      if (history.length < 7) return { earned: false, progress: 0 }
      const last7 = history.slice(0, 7)
      const daysWalked = last7.filter(d => d.tasks?.walking?.done).length
      return { earned: daysWalked >= 7, progress: daysWalked / 7 }
    },
  },
  {
    id: 'healthy_gut',
    name: "Sog'lom oshqozon",
    description: "14 kun davomida 7+ marta ich kelishi",
    emoji: '🎯',
    check: (history) => {
      if (history.length < 14) return { earned: false, progress: 0 }
      const last14 = history.slice(0, 14)
      const bowelDays = last14.filter(d => d.bowel?.happened).length
      return { earned: bowelDays >= 7, progress: bowelDays / 7 }
    },
  },
]
