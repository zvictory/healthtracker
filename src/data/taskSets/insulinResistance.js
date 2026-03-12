export const insulinResistanceTasks = [
  // Ertalab (06:00-09:00)
  { id: 'morning_water_ir', group: 'morning', text: 'Ochqoringa 1 stakan iliq suv iching' },
  { id: 'no_sugar_breakfast', group: 'morning', text: 'Shakarsiz nonushta (tuxum, sabzavot)' },
  { id: 'glucose_check_am', group: 'morning', text: 'Qon shakarini tekshiring (ixtiyoriy)' },
  { id: 'morning_walk', group: 'morning', text: '15 daqiqa ertalab yurish' },

  // Kun davomida (09:00-18:00)
  { id: 'walk_after_lunch', group: 'day', text: '30 daqiqa piyoda yuring (ovqatdan keyin)' },
  { id: 'no_sugar_snack', group: 'day', text: "Shakarsiz tamaddi (yong'oq, sabzavot)" },
  { id: 'water_between_meals', group: 'day', text: 'Ovqat oralig\'ida 2 stakan suv' },
  { id: 'fiber_lunch', group: 'day', text: 'Tolali tushlik (sabzavot, dukkaklilar)' },
  { id: 'no_white_bread', group: 'day', text: "Oq non va shakarli ichimliklardan saqlaning" },

  // Kechqurun (18:00-22:00)
  { id: 'light_dinner_ir', group: 'evening', text: 'Yengil kechki ovqat (20:00 gacha)' },
  { id: 'evening_walk_ir', group: 'evening', text: 'Kechki 15 daqiqa yurish' },
  { id: 'glucose_check_pm', group: 'evening', text: 'Kechki qon shakari tekshiruvi (ixtiyoriy)' },
  { id: 'no_late_snack', group: 'evening', text: "22:00 dan keyin ovqatlanmang" },

  // Qo'shimcha
  { id: 'cinnamon', group: 'extra', text: "Dolchin choy iching (insulin sezuvchanligini oshiradi)" },
  { id: 'apple_vinegar', group: 'extra', text: 'Olma sirkasi — 1 choy qoshiq suv bilan' },
]
