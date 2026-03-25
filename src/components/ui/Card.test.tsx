import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('is non-interactive by default (no role button)', () => {
    render(<Card>Content</Card>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders as interactive when onClick is provided', () => {
    render(<Card onClick={() => {}}>Click me</Card>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('fires onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Card onClick={handler}>Click me</Card>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('fires onClick when Enter is pressed', async () => {
    const handler = vi.fn()
    render(<Card onClick={handler}>Card</Card>)
    screen.getByRole('button').focus()
    await userEvent.keyboard('{Enter}')
    expect(handler).toHaveBeenCalledOnce()
  })

  it('fires onClick when Space is pressed', async () => {
    const handler = vi.fn()
    render(<Card onClick={handler}>Card</Card>)
    screen.getByRole('button').focus()
    await userEvent.keyboard(' ')
    expect(handler).toHaveBeenCalledOnce()
  })
})
