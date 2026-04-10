/** Format 10-digit Indian mobile for display: +91 98765 43210 */
export function formatPhoneIndia(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 0) return '+91 —'
  if (d.length <= 5) return `+91 ${d}`
  return `+91 ${d.slice(0, 5)} ${d.slice(5, 10)}`
}

/** Same as Login phone field: +91 987 6543210 (3 digits, space, rest) */
export function formatPhoneLoginMask(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length === 0) return '+91 —'
  if (d.length <= 3) return `+91 ${d}`
  return `+91 ${d.slice(0, 3)} ${d.slice(3)}`
}

/** 10-digit national mobile → E.164 stored on `users.phone` (e.g. +917010838732). */
export function toIndiaE164FromDigits(digits: string): string | null {
  const d = digits.replace(/\D/g, '')
  if (d.length !== 10) return null
  return `+91${d}`
}
