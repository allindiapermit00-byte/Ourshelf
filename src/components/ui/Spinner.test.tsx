import { render, screen } from '@testing-library/react'
import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders with testid', () => {
    render(<Spinner />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('has role="status"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it.each(['sm', 'md', 'lg'] as const)('renders size=%s without crash', (size) => {
    render(<Spinner size={size} />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('respects custom label prop', () => {
    render(<Spinner label="Loading items" />)
    expect(screen.getByLabelText('Loading items')).toBeInTheDocument()
  })
})
