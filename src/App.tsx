import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SplashPage from '@/pages/SplashPage'
import { paths } from '@/routes/paths'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OtpPage = lazy(() => import('@/pages/OtpPage'))
const HomeLayout = lazy(() => import('@/layouts/HomeLayout'))
const HomeDashboard = lazy(() => import('@/pages/home/HomeDashboard'))
const HomeOrdersPanel = lazy(() => import('@/pages/home/HomeOrdersPanel'))
const HomeProfilePanel = lazy(() => import('@/pages/home/HomeProfilePanel'))
const LoansPage = lazy(() => import('@/pages/LoansPage'))
const PaymentPage = lazy(() => import('@/pages/PaymentPage'))

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={paths.splash} element={<SplashPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.otp} element={<OtpPage />} />
        <Route path={paths.home} element={<HomeLayout />}>
          <Route index element={<HomeDashboard />} />
          <Route path="orders" element={<HomeOrdersPanel />} />
          <Route path="profile" element={<HomeProfilePanel />} />
        </Route>
        <Route
          path={paths.orders}
          element={<Navigate to={paths.homeOrders} replace />}
        />
        <Route
          path={paths.profile}
          element={<Navigate to={paths.homeProfile} replace />}
        />
        <Route path={paths.loans} element={<LoansPage />} />
        <Route path={paths.payment} element={<PaymentPage />} />
        <Route path="*" element={<Navigate to={paths.splash} replace />} />
      </Routes>
    </Suspense>
  )
}
