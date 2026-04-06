import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { paths } from '@/routes/paths'

const SplashPage = lazy(() => import('@/pages/SplashPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OtpPage = lazy(() => import('@/pages/OtpPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const LoansPage = lazy(() => import('@/pages/LoansPage'))
const OrdersPage = lazy(() => import('@/pages/OrdersPage'))
const PaymentPage = lazy(() => import('@/pages/PaymentPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={paths.splash} element={<SplashPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.otp} element={<OtpPage />} />
        <Route path={paths.home} element={<HomePage />} />
        <Route path={paths.loans} element={<LoansPage />} />
        <Route path={paths.orders} element={<OrdersPage />} />
        <Route path={paths.payment} element={<PaymentPage />} />
        <Route path={paths.profile} element={<ProfilePage />} />
        <Route path="*" element={<Navigate to={paths.splash} replace />} />
      </Routes>
    </Suspense>
  )
}
