import { tips as breastfeeding } from './breastfeedingConstipation'
import { tips as insulin } from './insulinResistance'
import { tips as fatBurn } from './fatBurning'
import { tips as sugarFree } from './sugarFree'
import { tips as general } from './generalWellness'

const TIP_SETS = {
  breastfeeding_constipation: breastfeeding,
  insulin_resistance: insulin,
  fat_burning: fatBurn,
  sugar_free: sugarFree,
  general_wellness: general,
}

export function getTipSet(taskSet) {
  return TIP_SETS[taskSet] || TIP_SETS.general_wellness
}
