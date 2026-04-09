import { NavLink, Outlet } from 'react-router-dom'
import { FiHome, FiPackage, FiShield, FiUser } from 'react-icons/fi'
import { paths } from '@/routes/paths'

const tabs = [
  { to: paths.home, end: true, label: 'Home', icon: FiHome },
  { to: paths.homeOrders, end: false, label: 'Orders', icon: FiPackage },
  { to: paths.homeProfile, end: false, label: 'Profile', icon: FiUser },
] as const

export default function HomeLayout() {
  return (
    <div className="home-app">
      <aside className="home-sidebar" aria-label="Main navigation">
        <div className="home-sidebar__blob home-sidebar__blob--one" aria-hidden />
        <div className="home-sidebar__blob home-sidebar__blob--two" aria-hidden />
        <div className="home-sidebar__blob home-sidebar__blob--three" aria-hidden />

        <div className="home-sidebar__inner">
          <div className="home-sidebar__brand">
            <span className="home-sidebar__logo" aria-hidden>
              <FiShield size={22} />
            </span>
            <div>
              <span className="home-sidebar__app">QuickCredit</span>
              <span className="home-sidebar__tag">Credit &amp; loans</span>
            </div>
          </div>

          <nav className="home-sidebar__nav" aria-label="Sections">
            {tabs.map(({ to, end, label, icon: Icon }) => (
              <NavLink
                key={to + String(end)}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `home-nav-link${isActive ? ' home-nav-link--active' : ''}`
                }
              >
                <Icon size={20} strokeWidth={2} aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>

          <p className="home-sidebar__copyright">
            © {new Date().getFullYear()} QuickCredit
          </p>
        </div>
      </aside>

      <div className="home-main">
        <main className="home-content">
          <Outlet />
        </main>

        <nav className="home-mnav" aria-label="Tabs">
          {tabs.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={`m-${to}`}
              to={to}
              end={end}
              className={({ isActive }) =>
                `home-mnav__tab${isActive ? ' home-mnav__tab--active' : ''}`
              }
            >
              <Icon size={20} strokeWidth={2} aria-hidden />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
