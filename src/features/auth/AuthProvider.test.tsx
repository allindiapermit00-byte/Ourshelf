import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }))
vi.mock('@/lib/firebase', () => ({ auth: {} }))
vi.mock('./authService', () => ({ bootstrapUserProfile: vi.fn() }))

import { onAuthStateChanged } from 'firebase/auth'
import { AuthProvider } from './AuthProvider'
import { useAuth } from './useAuth'

/** Small component that renders the auth context values for inspection. */
function AuthDisplay() {
  const { user, loading } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? (user as { uid: string }).uid : 'null'}</span>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => vi.clearAllMocks())

  it('starts in loading=true state before onAuthStateChanged fires', () => {
    // Callback never fired — stays loading
    ;(onAuthStateChanged as Mock).mockReturnValue(() => {})

    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading').textContent).toBe('true')
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('resolves loading=false with user=null after unauthenticated callback', async () => {
    ;(onAuthStateChanged as Mock).mockImplementation((_auth: unknown, cb: (u: null) => void) => {
      cb(null)
      return () => {}
    })

    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('resolves loading=false with the user after authenticated callback', async () => {
    const fakeUser = { uid: 'uid-test' }
    ;(onAuthStateChanged as Mock).mockImplementation(
      (_auth: unknown, cb: (u: typeof fakeUser) => Promise<void>) => {
        void cb(fakeUser)
        return () => {}
      }
    )

    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('user').textContent).toBe('uid-test')
  })

  it('calls unsubscribe on unmount', () => {
    const unsubscribe = vi.fn()
    ;(onAuthStateChanged as Mock).mockReturnValue(unsubscribe)

    const { unmount } = render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    unmount()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
