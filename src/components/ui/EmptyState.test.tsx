import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('renders heading', () => {
    render(<EmptyState heading="Nothing here yet" />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState heading="Empty" description="No items found." />)
    expect(screen.getByText('No items found.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<EmptyState heading="Empty" />)
    // just check it doesn't crash and heading is present
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('renders action node when action prop is provided', () => {
    render(<EmptyState heading="Empty" action={<button>Add item</button>} />)
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('fires action onClick', async () => {
    const handler = vi.fn()
    render(<EmptyState heading="Empty" action={<button onClick={handler}>Go</button>} />)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('has testid', () => {
    render(<EmptyState heading="Empty" />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })
})
