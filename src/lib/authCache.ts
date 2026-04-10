export type CachedAuth = {
  fullName: string
  phoneDigits: string
  /** Firestore `users` doc id — set after OTP for orders/profile. */
  userId?: string
  minLimit?: number
  maxLimit?: number
}

const AUTH_CACHE_KEY = 'quickcredit.auth.v1'

export function notifyAuthCacheChanged(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('qc-auth-changed'))
}

export function readCachedAuth(): CachedAuth {
  if (typeof window === 'undefined') {
    return { fullName: '', phoneDigits: '' }
  }

  try {
    const raw = window.localStorage.getItem(AUTH_CACHE_KEY)
    if (!raw) return { fullName: '', phoneDigits: '' }
    const parsed = JSON.parse(raw) as Partial<CachedAuth>
    return {
      fullName: typeof parsed.fullName === 'string' ? parsed.fullName.slice(0, 20) : '',
      phoneDigits:
        typeof parsed.phoneDigits === 'string'
          ? parsed.phoneDigits.replace(/\D/g, '').slice(0, 10)
          : '',
      userId: typeof parsed.userId === 'string' && parsed.userId.length > 0 ? parsed.userId : undefined,
      minLimit: typeof parsed.minLimit === 'number' ? parsed.minLimit : undefined,
      maxLimit: typeof parsed.maxLimit === 'number' ? parsed.maxLimit : undefined,
    }
  } catch {
    return { fullName: '', phoneDigits: '' }
  }
}

export function writeCachedAuth(value: CachedAuth): void {
  if (typeof window === 'undefined') return
  try {
    const payload: Record<string, unknown> = {
      fullName: value.fullName.slice(0, 20),
      phoneDigits: value.phoneDigits.replace(/\D/g, '').slice(0, 10),
    }
    if (value.userId) payload.userId = value.userId
    if (typeof value.minLimit === 'number') payload.minLimit = value.minLimit
    if (typeof value.maxLimit === 'number') payload.maxLimit = value.maxLimit
    window.localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(payload))
    notifyAuthCacheChanged()
  } catch {
    // Ignore storage failures.
  }
}

/** Clears stored session (name / phone) — used on logout. */
export function clearCachedAuth(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(AUTH_CACHE_KEY)
    notifyAuthCacheChanged()
  } catch {
    // ignore
  }
}
