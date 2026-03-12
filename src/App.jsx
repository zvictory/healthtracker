import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/shared/LoadingSpinner'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Tasks = lazy(() => import('./pages/Tasks'))
const WaterTracker = lazy(() => import('./pages/WaterTracker'))
const BowelJournal = lazy(() => import('./pages/BowelJournal'))
const Statistics = lazy(() => import('./pages/Statistics'))
const FoodGuide = lazy(() => import('./pages/FoodGuide'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/bowel" element={<BowelJournal />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/food-guide" element={<FoodGuide />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
