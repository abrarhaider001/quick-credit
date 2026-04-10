export type CachedAuth = {
  fullName: string
  phoneDigits: string
}

const AUTH_CACHE_KEY = 'quickcredit.auth.v1'

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
    }
  } catch {
    return { fullName: '', phoneDigits: '' }
  }
}

export function writeCachedAuth(value: CachedAuth): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      AUTH_CACHE_KEY,
      JSON.stringify({
        fullName: value.fullName.slice(0, 20),
        phoneDigits: value.phoneDigits.replace(/\D/g, '').slice(0, 10),
      }),
    )
  } catch {
    // Ignore storage failures.
  }
}

/** Clears stored session (name / phone) — used on logout. */
export function clearCachedAuth(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(AUTH_CACHE_KEY)
  } catch {
    // ignore
  }
}
