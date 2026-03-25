import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it.each(['primary', 'secondary', 'ghost', 'destructive'] as const)(
    'renders variant=%s without crash',
    (variant) => {
      render(<Button variant={variant}>Label</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    }
  )

  it.each(['sm', 'md', 'lg'] as const)('renders size=%s without crash', (size) => {
    render(<Button size={size}>Label</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows spinner and is disabled when loading', () => {
    render(<Button loading>Save</Button>)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Go</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('fires onClick when clicked', async () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Go</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handler).toHaveBeenCalledOnce()
  })

  it('does not fire onClick when disabled', async () => {
    const handler = vi.fn()
    render(
      <Button disabled onClick={handler}>
        Go
      </Button>
    )
    await userEvent.click(screen.getByRole('button'))
    expect(handler).not.toHaveBeenCalled()
  })
})
