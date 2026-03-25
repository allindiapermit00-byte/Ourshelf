import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorState from './ErrorState'

describe('ErrorState', () => {
  it('renders default message when none provided', () => {
    render(<ErrorState />)
    expect(screen.getByTestId('error-state')).toBeInTheDocument()
  })

  it('renders custom message', () => {
    render(<ErrorState message="Failed to load data." />)
    expect(screen.getByText('Failed to load data.')).toBeInTheDocument()
  })

  it('has role="alert"', () => {
    render(<ErrorState />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('does not render retry button when onRetry is omitted', () => {
    render(<ErrorState />)
    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  it('renders retry button when onRetry is provided', () => {
    render(<ErrorState onRetry={() => {}} />)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('calls onRetry when retry button is clicked', async () => {
    const handler = vi.fn()
    render(<ErrorState onRetry={handler} />)
    await userEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(handler).toHaveBeenCalledOnce()
  })
})
