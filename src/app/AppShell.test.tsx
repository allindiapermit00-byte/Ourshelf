import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AppShell from './AppShell'

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({
    user: { displayName: 'Ada Lovelace', photoURL: null, uid: 'uid-1' },
    loading: false,
  }),
}))

vi.mock('@/features/auth/authService', () => ({
  signOut: vi.fn(),
}))

function renderAppShell(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/items" element={<div>Items page</div>} />
          <Route path="/groups" element={<div>Groups page</div>} />
          <Route path="/activity" element={<div>Activity page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('AppShell', () => {
  it('renders brand name', () => {
    renderAppShell()
    expect(screen.getByText('OurShelf')).toBeInTheDocument()
  })

  it('renders all nav links', () => {
    renderAppShell()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My Items' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Groups' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Activity' })).toBeInTheDocument()
  })

  it('renders the sign out button', () => {
    renderAppShell()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('renders child route content', () => {
    renderAppShell('/')
    expect(screen.getByText('Home page')).toBeInTheDocument()
  })

  it('calls signOut when sign out button is clicked', async () => {
    const { signOut } = await import('@/features/auth/authService')
    renderAppShell()
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }))
    expect(signOut).toHaveBeenCalled()
  })

  it('opens mobile menu on hamburger click', async () => {
    renderAppShell()
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    await userEvent.click(hamburger)
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
  })
})
