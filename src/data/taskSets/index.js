import { breastfeedingConstipationTasks } from './breastfeedingConstipation'
import { insulinResistanceTasks } from './insulinResistance'
import { fatBurningTasks } from './fatBurning'
import { sugarFreeTasks } from './sugarFree'
import { generalWellnessTasks } from './generalWellness'

const TASK_SETS = {
  breastfeeding_constipation: breastfeedingConstipationTasks,
  insulin_resistance: insulinResistanceTasks,
  fat_burning: fatBurningTasks,
  sugar_free: sugarFreeTasks,
  general_wellness: generalWellnessTasks,
}

export function getTaskSet(taskSetId) {
  return TASK_SETS[taskSetId] || TASK_SETS.general_wellness
}
