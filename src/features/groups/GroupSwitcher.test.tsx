import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

vi.mock('./useGroup', () => ({ useGroup: vi.fn() }))

import { useGroup } from './useGroup'
import GroupSwitcher from './GroupSwitcher'

function renderSwitcher() {
  return render(<GroupSwitcher />)
}

describe('GroupSwitcher', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders nothing while loading', () => {
    ;(useGroup as Mock).mockReturnValue({ groups: [], activeGroup: null, loading: true, setActiveGroupId: vi.fn() })
    const { container } = renderSwitcher()
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when user has no groups', () => {
    ;(useGroup as Mock).mockReturnValue({ groups: [], activeGroup: null, loading: false, setActiveGroupId: vi.fn() })
    const { container } = renderSwitcher()
    expect(container).toBeEmptyDOMElement()
  })

  it('shows active group name in the button', () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      activeGroup: GROUP_A,
      loading: false,
      setActiveGroupId: vi.fn(),
      memberships: [MEMBERSHIP_A],
    })
    renderSwitcher()
    expect(screen.getByRole('button', { name: /switch group/i })).toHaveTextContent('Book Club')
  })

  it('opens dropdown listing all groups on button click', async () => {
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      activeGroup: GROUP_A,
      loading: false,
      setActiveGroupId: vi.fn(),
    })
    renderSwitcher()
    await userEvent.click(screen.getByRole('button', { name: /switch group/i }))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByTestId('switcher-option-g1')).toBeInTheDocument()
    expect(screen.getByTestId('switcher-option-g2')).toBeInTheDocument()
  })

  it('calls setActiveGroupId and closes dropdown when an option is selected', async () => {
    const setActiveGroupId = vi.fn()
    ;(useGroup as Mock).mockReturnValue({
      groups: [GROUP_A, GROUP_B],
      activeGroup: GROUP_A,
      loading: false,
      setActiveGroupId,
    })
    renderSwitcher()
    await userEvent.click(screen.getByRole('button', { name: /switch group/i }))
    await userEvent.click(screen.getByTestId('switcher-option-g2'))
    expect(setActiveGroupId).toHaveBeenCalledWith('g2')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
