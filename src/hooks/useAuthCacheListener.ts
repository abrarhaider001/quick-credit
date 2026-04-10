import { useEffect, useState } from 'react'
import { readCachedAuth, type CachedAuth } from '@/lib/authCache'

/** Re-read auth cache when `qc-auth-changed` fires (login / logout). */
export function useAuthCacheListener(): CachedAuth {
  const [, setN] = useState(0)
  useEffect(() => {
    const bump = () => setN((x) => x + 1)
    window.addEventListener('qc-auth-changed', bump)
    return () => window.removeEventListener('qc-auth-changed', bump)
  }, [])
  return readCachedAuth()
}
