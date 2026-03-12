// Legacy re-export — new code should import from data/taskSets
import { getTaskSet } from './taskSets'

// Default to breastfeeding_constipation for backward compatibility
export const defaultTasks = getTaskSet('breastfeeding_constipation')
