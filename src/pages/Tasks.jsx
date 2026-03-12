import { useState, useMemo } from 'react'
import { Plus, Sunrise, Sun, Moon, Star, ChevronDown } from 'lucide-react'
import { useDaily } from '../hooks/useDaily'
import { useScore } from '../hooks/useScore'
import { defaultTasks } from '../data/defaultTasks'
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
    return [...defaultTasks, ...custom]
  }, [customTasks])

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

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {}
    Object.keys(TASK_GROUPS).forEach(key => {
      initial[key] = key === currentTimeOfDay
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
    <div className="min-h-screen bg-[var(--color-bg)]">
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

          return (
            <div key={key} className="card overflow-hidden">
              <button
                onClick={() => toggleGroup(key)}
                className="w-full px-4 py-3 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <GroupIcon size={16} className="text-[var(--color-text-secondary)]" />
                  <span className="font-semibold text-sm">{group.label}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">{group.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-primary">
                    {groupCompleted}/{groupTasks.length}
                  </span>
                  <ChevronDown size={14} className={`text-[var(--color-text-tertiary)] transition-transform ${openGroups[key] ? 'rotate-180' : ''}`} />
                </div>
              </button>

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
