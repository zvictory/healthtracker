import { useState, useEffect } from 'react'

const query = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null

export function useReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(query?.matches ?? false)

  useEffect(() => {
    if (!query) return
    const handler = (e) => setPrefersReduced(e.matches)
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

// Static check for non-hook contexts
export const prefersReducedMotion = () => query?.matches ?? false
