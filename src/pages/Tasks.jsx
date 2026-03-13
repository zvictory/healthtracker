import { useState, useMemo } from 'react'
import { Plus, Sunrise, Sun, Moon, Star, ChevronDown, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useDaily } from '../hooks/useDaily'
import { useScore } from '../hooks/useScore'
import { useProfile } from '../hooks/useProfile'
import { useTranslation } from '../hooks/useTranslation'
import { getTaskSet } from '../data/taskSets'
import { TASK_GROUPS } from '../utils/constants'
import { getTimeOfDay } from '../utils/dateUtils'
import TaskItem from '../components/tasks/TaskItem'
import TaskMotivation from '../components/tasks/TaskMotivation'
import AddTaskModal from '../components/tasks/AddTaskModal'
import PageHeader from '../components/shared/PageHeader'
import ConfettiEffect from '../components/shared/ConfettiEffect'
import Toast from '../components/shared/Toast'

const GROUP_ICONS = {
  morning: Sunrise,
  day: Sun,
  evening: Moon,
  extra: Star,
}

export default function Tasks() {
  const { todayData, updateTodayData } = useDaily()
  const score = useScore()
  const { profile } = useProfile()
  const profileTasks = useMemo(() => getTaskSet(profile.taskSet), [profile.taskSet])
  const [showAddModal, setShowAddModal] = useState(false)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [undoToast, setUndoToast] = useState(null)
  const { t } = useTranslation()

  const tasks = todayData.tasks || {}
  const customTasks = todayData.custom_tasks || []
  const currentTimeOfDay = getTimeOfDay()

  const allTasks = useMemo(() => {
    const custom = customTasks.map(ct => ({
      id: ct.id,
      group: ct.group,
      text: ct.text,
      icon: '⭐',
    }))
    return [...profileTasks, ...custom]
  }, [customTasks, profileTasks])

  const groupedTasks = useMemo(() => {
    const groups = {}
    Object.keys(TASK_GROUPS).forEach(key => {
      groups[key] = allTasks.filter(t => t.group === key)
    })
    return groups
  }, [allTasks])

  const completedCount = Object.values(tasks).filter(t => t.done).length
  const totalCount = allTasks.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const timeOrder = ['morning', 'day', 'evening', 'extra']
  const currentIdx = timeOrder.indexOf(currentTimeOfDay)

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    Object.keys(TASK_GROUPS).forEach(key => {
      const idx = timeOrder.indexOf(key)
      // Auto-open current group, collapse past groups (unless it's extra)
      initial[key] = key === currentTimeOfDay || (key === 'extra')
      if (idx < currentIdx && key !== 'extra') initial[key] = false
    })
    return initial
  })

  const toggleGroup = (groupId) => {
    setOpenGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const toggleTask = (taskId) => {
    const current = tasks[taskId] || { done: false, time: null }
    const newDone = !current.done
    const newTime = newDone ? new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }) : null

    if (newDone) {
      setConfettiTrigger(prev => prev + 1)
      // Show undo toast
      setUndoToast({
        message: t('tasks.task_done'),
        undo: () => updateTodayData({
          tasks: { ...todayData.tasks, [taskId]: { done: false, time: null } },
        }),
      })
    }

    updateTodayData({
      tasks: { ...tasks, [taskId]: { done: newDone, time: newTime } },
    })
  }

  const addCustomTask = (text, group) => {
    const id = `custom_${Date.now()}`
    const newCustom = [...customTasks, { id, text, group }]
    updateTodayData({
      custom_tasks: newCustom,
      tasks: { ...tasks, [id]: { done: false, time: null } },
    })
    setShowAddModal(false)
  }

  return (
    <div>
      <ConfettiEffect trigger={confettiTrigger} />

      <PageHeader
        title={t('tasks.title')}
        subtitle={t('tasks.completed', { done: completedCount, total: totalCount })}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            aria-label={t('tasks.add_task')}
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer"
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        }
      />

      <TaskMotivation progress={progress} />

      <div className="px-4 lg:px-6 pb-8 space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
        {Object.entries(TASK_GROUPS).map(([key, group]) => {
          const groupTasks = groupedTasks[key] || []
          const groupCompleted = groupTasks.filter(t => tasks[t.id]?.done).length
          const GroupIcon = GROUP_ICONS[key]

          const groupProgress = groupTasks.length > 0 ? groupCompleted / groupTasks.length : 0
          const groupDone = groupTasks.length > 0 && groupCompleted === groupTasks.length

          return (
            <div key={key} className="card overflow-hidden">
              <button
                onClick={() => toggleGroup(key)}
                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${groupDone ? 'bg-[var(--color-success-light)]' : 'bg-[var(--color-divider)]'}`}>
                    {groupDone
                      ? <CheckCircle2 size={16} className="text-[var(--color-success)]" />
                      : <GroupIcon size={16} className="text-[var(--color-text-secondary)]" />
                    }
                  </div>
                  <div>
                    <span className="font-semibold text-sm block">{group.label}</span>
                    <span className="text-[11px] text-[var(--color-text-tertiary)]">{group.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold rounded-full bg-primary-50 text-primary px-2.5 py-1">
                    {groupCompleted}/{groupTasks.length}
                  </span>
                  <ChevronDown size={14} className={`text-[var(--color-text-tertiary)] transition-transform duration-200 ${openGroups[key] ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Per-group progress bar */}
              <div className="h-1.5 bg-[var(--color-divider)]">
                <div
                  className={`h-full rounded-r-full transition-all duration-500 ${groupDone ? 'bg-[var(--color-success)]' : 'bg-primary'}`}
                  style={{ width: `${groupProgress * 100}%` }}
                />
              </div>

              <AnimatePresence>
                {openGroups[key] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden border-t border-[var(--color-divider)]"
                  >
                    {groupTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        done={tasks[task.id]?.done || false}
                        time={tasks[task.id]?.time}
                        onToggle={() => toggleTask(task.id)}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {showAddModal && (
        <AddTaskModal
          onAdd={addCustomTask}
          onClose={() => setShowAddModal(false)}
        />
      )}

      <AnimatePresence>
        {undoToast && (
          <Toast
            message={undoToast.message}
            action={undoToast.undo}
            onDismiss={() => setUndoToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
