import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
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
const GROUP_B: Group = {
  id: 'g2',
  name: 'Game Night',
  inviteCode: 'XYZ789',
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
const MEMBERSHIP_B: Membership = {
  id: 'm2',
  groupId: 'g2',
  userId: 'uid-1',
  role: MemberRole.Member,
  status: 'active',
  joinedAt: TS,
  updatedAt: TS,
}

vi.mock('./useGroup', () => ({ useGroup: vi.fn() }))
vi.mock('@/lib/repositories', () => ({
  getMembersForGroup: vi.fn().mockResolvedValue([]),
}))

import { useGroup } from './useGroup'
import GroupListPage from './GroupListPage'

function renderPage() {
  return render(
    <MemoryRouter>
      <GroupListPage />
    </MemoryRouter>,
  )
}

describe('GroupListPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows loading spinner while data is loading', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [],
      memberships: [],
      activeGroup: null,
      activeMembership: null,
      setActiveGroupId: vi.fn(),
      loading: true,
    })
    renderPage()
    expect(screen.getByTestId('groups-loading')).toBeInTheDocument()
  })

  it('shows empty state when user has no groups', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [],
      memberships: [],
      activeGroup: null,
      activeMembership: null,
      setActiveGroupId: vi.fn(),
      loading: false,
    })
    renderPage()
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create group/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /join with a code/i })).toBeInTheDocument()
  })

  it('shows the groups list when groups are loaded', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      memberships: [MEMBERSHIP_A, MEMBERSHIP_B],
      activeGroup: GROUP_A,
      activeMembership: MEMBERSHIP_A,
      setActiveGroupId: vi.fn(),
      loading: false,
    })
    renderPage()
    expect(screen.getByTestId('groups-list')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Book Club' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Game Night' })).toBeInTheDocument()
  })

  it('shows Active badge for the active group and no Switch button', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      memberships: [MEMBERSHIP_A, MEMBERSHIP_B],
      activeGroup: GROUP_A,
      activeMembership: MEMBERSHIP_A,
      setActiveGroupId: vi.fn(),
      loading: false,
    })
    renderPage()
    expect(screen.getByText('Active')).toBeInTheDocument()
    // Switch button only shows for non-active groups
    expect(screen.queryByTestId('switch-btn-g1')).not.toBeInTheDocument()
    expect(screen.getByTestId('switch-btn-g2')).toBeInTheDocument()
  })

  it('calls setActiveGroupId when Switch is clicked', async () => {
    const setActiveGroupId = vi.fn()
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      memberships: [MEMBERSHIP_A, MEMBERSHIP_B],
      activeGroup: GROUP_A,
      activeMembership: MEMBERSHIP_A,
      setActiveGroupId,
      loading: false,
    })
    renderPage()
    await userEvent.click(screen.getByTestId('switch-btn-g2'))
    expect(setActiveGroupId).toHaveBeenCalledWith('g2')
  })

  it('shows Admin badge for admin membership', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A],
      memberships: [MEMBERSHIP_A],
      activeGroup: GROUP_A,
      activeMembership: MEMBERSHIP_A,
      setActiveGroupId: vi.fn(),
      loading: false,
    })
    renderPage()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
