import * as breastfeeding from './breastfeedingConstipation'
import * as insulin from './insulinResistance'
import * as fatBurn from './fatBurning'
import * as sugarFree from './sugarFree'
import * as general from './generalWellness'

const FOOD_GUIDES = {
  breastfeeding_constipation: breastfeeding,
  insulin_resistance: insulin,
  fat_burning: fatBurn,
  sugar_free: sugarFree,
  general_wellness: general,
}

export function getFoodGuide(taskSet) {
  return FOOD_GUIDES[taskSet] || FOOD_GUIDES.general_wellness
}
