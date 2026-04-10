export type LoginToOtpState = {
  phoneDigits: string
  phoneDisplay: string
  /** Firestore `users` document id */
  expectedUid: string
  fullName: string
  minLimit: number
  maxLimit: number
}

export function isLoginToOtpState(x: unknown): x is LoginToOtpState {
  if (typeof x !== 'object' || x === null) return false
  const o = x as LoginToOtpState
  return (
    typeof o.phoneDigits === 'string' &&
    typeof o.phoneDisplay === 'string' &&
    typeof o.expectedUid === 'string' &&
    typeof o.fullName === 'string' &&
    typeof o.minLimit === 'number' &&
    typeof o.maxLimit === 'number'
  )
}
