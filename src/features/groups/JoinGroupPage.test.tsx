import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, type Mock } from 'vitest'

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'uid-2', displayName: 'Bob' }, loading: false }),
}))

vi.mock('./groupService', () => ({
  joinGroupByCode: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { joinGroupByCode } from './groupService'
import JoinGroupPage from './JoinGroupPage'

function renderPage(initialPath = '/join') {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/join" element={<JoinGroupPage />} />
        <Route path="/join/:code" element={<JoinGroupPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('JoinGroupPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the page heading', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: /join a group/i })).toBeInTheDocument()
  })

  it('renders the invite code input', () => {
    renderPage()
    expect(screen.getByLabelText(/invite code/i)).toBeInTheDocument()
  })

  it('submit button is disabled when code is shorter than 6 chars', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /join group/i })).toBeDisabled()
  })

  it('enables submit button when 6 chars are entered', async () => {
    renderPage()
    await userEvent.type(screen.getByLabelText(/invite code/i), 'ABC123')
    expect(screen.getByRole('button', { name: /join group/i })).not.toBeDisabled()
  })

  it('calls joinGroupByCode and redirects on success', async () => {
    ;(joinGroupByCode as Mock).mockResolvedValue({
      group: { id: 'g99' },
      membership: {},
      alreadyMember: false,
    })
    renderPage()
    await userEvent.type(screen.getByLabelText(/invite code/i), 'ABC123')
    await userEvent.click(screen.getByRole('button', { name: /join group/i }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/groups/g99'))
  })

  it('shows an inline error for an invalid code', async () => {
    ;(joinGroupByCode as Mock).mockRejectedValue(
      new Error('No group found for that invite code. Please check and try again.'),
    )
    renderPage()
    await userEvent.type(screen.getByLabelText(/invite code/i), 'XXXXXX')
    await userEvent.click(screen.getByRole('button', { name: /join group/i }))
    await waitFor(() =>
      expect(screen.getByTestId('join-error')).toHaveTextContent(/no group found/i),
    )
  })

  it('pre-fills the code from the URL param', () => {
    ;(joinGroupByCode as Mock).mockReturnValue(new Promise(() => {})) // never resolves
    renderPage('/join/MYCODE')
    expect(screen.getByLabelText(/invite code/i)).toHaveValue('MYCODE')
  })
})
