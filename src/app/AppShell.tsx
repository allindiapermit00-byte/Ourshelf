import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { signOut } from '@/features/auth/authService'

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/items', label: 'My Items', end: false },
  { to: '/groups', label: 'Groups', end: false },
  { to: '/activity', label: 'Activity', end: false },
]

const activeClass = 'text-indigo-600 border-b-2 border-indigo-600 font-medium'
const inactiveClass =
  'text-gray-500 hover:text-gray-900 border-b-2 border-transparent font-medium transition-colors'

export default function AppShell() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Top nav bar ─────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Brand */}
          <span className="text-lg font-bold text-indigo-600 tracking-tight select-none">
            OurShelf
          </span>

          {/* Desktop nav links */}
          <nav className="hidden sm:flex items-center gap-1 h-full" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 h-full flex items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
                    isActive ? activeClass : inactiveClass
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right side: avatar + sign-out */}
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Avatar'}
                className="w-8 h-8 rounded-full object-cover hidden sm:block"
              />
            )}
            <button
              onClick={() => void signOut()}
              className="hidden sm:block text-sm text-gray-500 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
            >
              Sign out
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="sm:hidden p-1 text-gray-500 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav
            className="sm:hidden border-t border-gray-200 bg-white"
            aria-label="Mobile navigation"
            data-testid="mobile-menu"
          >
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 ${
                    isActive
                      ? 'border-indigo-600 text-indigo-600 bg-indigo-50 font-medium'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-100">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? 'Avatar'}
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <span className="text-sm text-gray-700 flex-1">{user?.displayName}</span>
              <button
                onClick={() => void signOut()}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              >
                Sign out
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ── Page content ────────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
