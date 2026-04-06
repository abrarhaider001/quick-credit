/** App route paths — flow: Splash → Login → OTP → Home → (Loans | Orders | Payment | Profile) */
export const paths = {
  splash: '/',
  login: '/login',
  otp: '/otp',
  home: '/home',
  loans: '/loans',
  orders: '/orders',
  payment: '/payment',
  profile: '/profile',
} as const

export type AppPath = (typeof paths)[keyof typeof paths]
