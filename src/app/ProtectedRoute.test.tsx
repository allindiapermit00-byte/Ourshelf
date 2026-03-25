import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, type Mock } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

vi.mock('@/features/auth/useAuth', () => ({ useAuth: vi.fn() }))

import { useAuth } from '@/features/auth/useAuth'

function Protected() {
  return <div>Protected content</div>
}
function SignIn() {
  return <div>Sign in page</div>
}

function setup(initialPath = '/') {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Protected />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('shows a loading spinner while auth state is resolving', () => {
    ;(useAuth as Mock).mockReturnValue({ user: null, loading: true })
    setup()
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('redirects to /sign-in when the user is not authenticated', () => {
    ;(useAuth as Mock).mockReturnValue({ user: null, loading: false })
    setup()
    expect(screen.getByText('Sign in page')).toBeInTheDocument()
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
  })

  it('renders the protected outlet when the user is authenticated', () => {
    ;(useAuth as Mock).mockReturnValue({ user: { uid: 'uid-1' }, loading: false })
    setup()
    expect(screen.getByText('Protected content')).toBeInTheDocument()
    expect(screen.queryByText('Sign in page')).not.toBeInTheDocument()
  })
})
