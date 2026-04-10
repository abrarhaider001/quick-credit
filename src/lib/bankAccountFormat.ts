/** Demo primary account (digits only). */
export const DEMO_BANK_ACCOUNT_DIGITS = '1234567890128842'

/** Groups of 4 for display, e.g. "1234 5678 9012 8842". */
export function formatBankAccountFull(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (!d) return ''
  const parts: string[] = []
  for (let i = 0; i < d.length; i += 4) {
    parts.push(d.slice(i, i + 4))
  }
  return parts.join(' ')
}

/**
 * Masks the first group (first four digits); keeps the rest formatted.
 * e.g. "•••• 5678 9012 8842"
 */
export function formatBankAccountHideFirstGroup(digits: string): string {
  const d = digits.replace(/\D/g, '')
  if (d.length <= 4) {
    return '••••'
  }
  const rest = d.slice(4)
  const tail = formatBankAccountFull(rest)
  return tail ? `•••• ${tail}` : '••••'
}
