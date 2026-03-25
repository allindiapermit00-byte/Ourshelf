import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./authService', () => ({ signInWithGoogle: vi.fn() }))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { signInWithGoogle } from './authService'
import SignInPage from './SignInPage'

function renderPage() {
  render(
    <MemoryRouter>
      <SignInPage />
    </MemoryRouter>
  )
}

describe('SignInPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the sign-in button', () => {
    ;(signInWithGoogle as Mock).mockResolvedValue(undefined)
    renderPage()
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
  })

  it('heading shows "OurShelf"', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'OurShelf' })).toBeInTheDocument()
  })

  it('shows loading status while sign-in is in progress', async () => {
    let resolve!: () => void
    ;(signInWithGoogle as Mock).mockReturnValue(
      new Promise<void>((r) => {
        resolve = r
      })
    )

    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
    expect(screen.getByRole('button')).toBeDisabled()

    resolve()
  })

  it('shows error alert on sign-in failure', async () => {
    ;(signInWithGoogle as Mock).mockRejectedValue(new Error('popup-closed-by-user'))
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(screen.getByRole('alert')).toHaveTextContent('popup-closed-by-user')
  })

  it('button is re-enabled after a failed sign-in', async () => {
    ;(signInWithGoogle as Mock).mockRejectedValue(new Error('network-error'))
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled())
  })

  it('navigates to / on successful sign-in', async () => {
    ;(signInWithGoogle as Mock).mockResolvedValue(undefined)
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'))
  })
})
