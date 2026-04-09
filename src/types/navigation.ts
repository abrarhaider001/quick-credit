export type LoginToOtpState = {
  fullName: string
  phoneDigits: string
  phoneDisplay: string
}

export function isLoginToOtpState(x: unknown): x is LoginToOtpState {
  return (
    typeof x === 'object' &&
    x !== null &&
    'fullName' in x &&
    typeof (x as LoginToOtpState).fullName === 'string' &&
    'phoneDigits' in x &&
    typeof (x as LoginToOtpState).phoneDigits === 'string' &&
    'phoneDisplay' in x &&
    typeof (x as LoginToOtpState).phoneDisplay === 'string'
  )
}
