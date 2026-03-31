import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi, type Mock } from 'vitest'
import CreateGroupPage from './CreateGroupPage'

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'uid-1', displayName: 'Alice' }, loading: false }),
}))

vi.mock('./groupService', () => ({
  createGroup: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

import { createGroup } from './groupService'

function renderDirect() {
  render(
    <MemoryRouter>
      <CreateGroupPage />
    </MemoryRouter>,
  )
}

describe('CreateGroupPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders the page heading', () => {
    renderDirect()
    expect(screen.getByRole('heading', { name: /create a group/i })).toBeInTheDocument()
  })

  it('renders the group name input', () => {
    renderDirect()
    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument()
  })

  it('submit button is disabled when input is empty', () => {
    renderDirect()
    expect(screen.getByRole('button', { name: /create group/i })).toBeDisabled()
  })

  it('shows inline validation error for name shorter than 3 chars', async () => {
    renderDirect()
    await userEvent.type(screen.getByLabelText(/group name/i), 'AB')
    expect(screen.getByText(/3.+characters/i)).toBeInTheDocument()
  })

  it('submit button becomes enabled for a valid name', async () => {
    renderDirect()
    await userEvent.type(screen.getByLabelText(/group name/i), 'Book Club')
    expect(screen.getByRole('button', { name: /create group/i })).not.toBeDisabled()
  })

  it('calls createGroup with the trimmed name on submit', async () => {
    ;(createGroup as Mock).mockResolvedValue({ group: { id: 'g1' }, membership: {} })
    renderDirect()
    await userEvent.type(screen.getByLabelText(/group name/i), '  Book Club  ')
    await userEvent.click(screen.getByRole('button', { name: /create group/i }))
    await waitFor(() => expect(createGroup).toHaveBeenCalledWith('uid-1', '  Book Club  '))
  })

  it('redirects to /groups/:id after successful creation', async () => {
    ;(createGroup as Mock).mockResolvedValue({ group: { id: 'abc123' }, membership: {} })
    renderDirect()
    await userEvent.type(screen.getByLabelText(/group name/i), 'Book Club')
    await userEvent.click(screen.getByRole('button', { name: /create group/i }))
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/groups/abc123'))
  })

  it('shows an error message when createGroup rejects', async () => {
    ;(createGroup as Mock).mockRejectedValue(new Error('Network error'))
    renderDirect()
    await userEvent.type(screen.getByLabelText(/group name/i), 'Book Club')
    await userEvent.click(screen.getByRole('button', { name: /create group/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network error'))
  })
})
