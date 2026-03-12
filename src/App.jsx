import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useOnboarding } from './hooks/useOnboarding'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/shared/LoadingSpinner'

const Onboarding = lazy(() => import('./pages/Onboarding'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const WaterTracker = lazy(() => import('./pages/WaterTracker'))
const BowelJournal = lazy(() => import('./pages/BowelJournal'))
const Statistics = lazy(() => import('./pages/Statistics'))
const FoodGuide = lazy(() => import('./pages/FoodGuide'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  const { isCompleted } = useOnboarding()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {!isCompleted ? (
          <>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/water" element={<WaterTracker />} />
              <Route path="/bowel" element={<BowelJournal />} />
              <Route path="/stats" element={<Statistics />} />
              <Route path="/food-guide" element={<FoodGuide />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/onboarding" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Suspense>
  )
}
