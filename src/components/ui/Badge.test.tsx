import { render, screen } from '@testing-library/react'
import Badge, { ItemStatusBadge, ItemTypeBadge, RequestStatusBadge, LoanStateBadge } from './Badge'
import { ItemStatus, ItemType, RequestStatus, LoanReturnState } from '@/lib/types'

describe('Badge', () => {
  it('renders the label', () => {
    render(<Badge label="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it.each(['default', 'success', 'warning', 'danger', 'info', 'neutral'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      render(<Badge label="Test" variant={variant} />)
      expect(screen.getByText('Test')).toBeInTheDocument()
    }
  )
})

describe('ItemStatusBadge', () => {
  it.each(Object.values(ItemStatus))('renders status=%s', (status) => {
    render(<ItemStatusBadge status={status} />)
    expect(screen.getByText(/.+/)).toBeInTheDocument()
  })
})

describe('ItemTypeBadge', () => {
  it.each(Object.values(ItemType))('renders type=%s', (type) => {
    render(<ItemTypeBadge type={type} />)
    expect(screen.getByText(/.+/)).toBeInTheDocument()
  })
})

describe('RequestStatusBadge', () => {
  it.each(Object.values(RequestStatus))('renders status=%s', (status) => {
    render(<RequestStatusBadge status={status} />)
    expect(screen.getByText(/.+/)).toBeInTheDocument()
  })
})

describe('LoanStateBadge', () => {
  it.each(Object.values(LoanReturnState))('renders state=%s', (state) => {
    render(<LoanStateBadge state={state} />)
    expect(screen.getByText(/.+/)).toBeInTheDocument()
  })
})
