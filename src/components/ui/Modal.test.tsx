import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from './Modal'

function Wrapper({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Test dialog">
      <p>Modal body</p>
      <button>Inside button</button>
    </Modal>
  )
}

describe('Modal', () => {
  it('does not render when closed', () => {
    render(<Wrapper open={false} onClose={() => {}} />)
    expect(screen.queryByTestId('modal-panel')).not.toBeInTheDocument()
  })

  it('renders when open', () => {
    render(<Wrapper open={true} onClose={() => {}} />)
    expect(screen.getByTestId('modal-panel')).toBeInTheDocument()
  })

  it('displays the title', () => {
    render(<Wrapper open={true} onClose={() => {}} />)
    expect(screen.getByText('Test dialog')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Wrapper open={true} onClose={() => {}} />)
    expect(screen.getByText('Modal body')).toBeInTheDocument()
  })

  it('has role="dialog" and aria-modal="true"', () => {
    render(<Wrapper open={true} onClose={() => {}} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<Wrapper open={true} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<Wrapper open={true} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('modal-backdrop'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    render(<Wrapper open={true} onClose={onClose} />)
    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })
})
