import { render, screen, waitFor } from '@testing-library/react'
import { vi, type Mock } from 'vitest'
import type { Timestamp } from 'firebase/firestore'
import { MemberRole } from '@/lib/types'
import type { Group, Membership } from '@/lib/types'

const TS = {} as Timestamp

const GROUP_A: Group = {
  id: 'g1',
  name: 'Book Club',
  inviteCode: 'ABC123',
  createdByUserId: 'uid-1',
  createdAt: TS,
  updatedAt: TS,
}

const MEMBERSHIP_A: Membership = {
  id: 'm1',
  groupId: 'g1',
  userId: 'uid-1',
  role: MemberRole.Admin,
  status: 'active',
  joinedAt: TS,
  updatedAt: TS,
}

vi.mock('@/features/auth/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'uid-1', displayName: 'Alice' }, loading: false }),
}))

vi.mock('@/lib/repositories', () => ({
  getMembershipsForUser: vi.fn(),
  getGroup: vi.fn(),
}))

import { getMembershipsForUser, getGroup } from '@/lib/repositories'
import { GroupProvider, useGroupContext } from './GroupProvider'

function Consumer() {
  const { groups, activeGroup, loading } = useGroupContext()
  if (loading) return <div data-testid="loading">loading</div>
  return (
    <div>
      <div data-testid="group-count">{groups.length}</div>
      <div data-testid="active-group">{activeGroup?.name ?? 'none'}</div>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <GroupProvider>
      <Consumer />
    </GroupProvider>,
  )
}

describe('GroupProvider', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    localStorage.clear()
  })

  it('shows loading initially', () => {
    ;(getMembershipsForUser as Mock).mockReturnValue(new Promise(() => {}))
    renderWithProvider()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('exposes empty groups when user has no memberships', async () => {
    ;(getMembershipsForUser as Mock).mockResolvedValue([])
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('group-count')).toHaveTextContent('0'))
    expect(screen.getByTestId('active-group')).toHaveTextContent('none')
  })

  it('fetches and exposes groups for user memberships', async () => {
    ;(getMembershipsForUser as Mock).mockResolvedValue([MEMBERSHIP_A])
    ;(getGroup as Mock).mockResolvedValue(GROUP_A)
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('group-count')).toHaveTextContent('1'))
    expect(screen.getByTestId('active-group')).toHaveTextContent('Book Club')
  })

  it('restores active group from localStorage', async () => {
    const GROUP_B: Group = { ...GROUP_A, id: 'g2', name: 'Game Night' }
    const MEMBERSHIP_B: Membership = { ...MEMBERSHIP_A, id: 'm2', groupId: 'g2' }
    localStorage.setItem('ourshelf:activeGroupId', 'g2')
    ;(getMembershipsForUser as Mock).mockResolvedValue([MEMBERSHIP_A, MEMBERSHIP_B])
    ;(getGroup as Mock).mockImplementation((id: string) =>
      id === 'g1' ? Promise.resolve(GROUP_A) : Promise.resolve(GROUP_B),
    )
    renderWithProvider()
    await waitFor(() => expect(screen.getByTestId('active-group')).toHaveTextContent('Game Night'))
  })
})
