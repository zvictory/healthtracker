import { useState, useMemo } from 'react'
import { Plus, Sunrise, Sun, Moon, Star, ChevronDown } from 'lucide-react'
import { useDaily } from '../hooks/useDaily'
import { useScore } from '../hooks/useScore'
import { useProfile } from '../hooks/useProfile'
import { getTaskSet } from '../data/taskSets'
import { TASK_GROUPS } from '../utils/constants'
import { getTimeOfDay } from '../utils/dateUtils'
import TaskItem from '../components/tasks/TaskItem'
import TaskMotivation from '../components/tasks/TaskMotivation'
import AddTaskModal from '../components/tasks/AddTaskModal'
import PageHeader from '../components/shared/PageHeader'
import ConfettiEffect from '../components/shared/ConfettiEffect'

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
        title="Vazifalar"
        subtitle={`${completedCount}/${totalCount} bajarildi`}
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center cursor-pointer"
          >
            <Plus size={18} />
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

          return (
            <div key={key} className="card overflow-hidden">
              <button
                onClick={() => toggleGroup(key)}
                className="w-full px-5 py-4 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-divider)] flex items-center justify-center flex-shrink-0">
                    <GroupIcon size={16} className="text-[var(--color-text-secondary)]" />
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
                  className="h-full bg-primary rounded-r-full transition-all duration-500"
                  style={{ width: `${groupProgress * 100}%` }}
                />
              </div>

              {openGroups[key] && (
                <div className="border-t border-[var(--color-divider)]">
                  {groupTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      done={tasks[task.id]?.done || false}
                      time={tasks[task.id]?.time}
                      onToggle={() => toggleTask(task.id)}
                    />
                  ))}
                </div>
              )}
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
    </div>
  )
}
