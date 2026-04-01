import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('./itemsService', () => ({
  listItemsForGroup: vi.fn(),
}))

vi.mock('@/lib/repositories', () => ({
  getUser: vi.fn(),
}))

import CatalogPage from './CatalogPage'
import { listItemsForGroup } from './itemsService'
import { getUser } from '@/lib/repositories'
import { ItemStatus, ItemType } from '@/lib/types'
import type { Item } from '@/lib/types'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    groupId: 'grp-1',
    ownerUserId: 'user-1',
    title: 'Catan',
    titleLower: 'catan',
    type: ItemType.BoardGame,
    status: ItemStatus.Available,
    createdAt: { seconds: 1000, nanoseconds: 0 } as never,
    updatedAt: { seconds: 1000, nanoseconds: 0 } as never,
    ...overrides,
  }
}

function renderPage(groupId = 'grp-1') {
  return render(
    <MemoryRouter initialEntries={[`/groups/${groupId}/catalog`]}>
      <Routes>
        <Route path="/groups/:groupId/catalog" element={<CatalogPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CatalogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(getUser as Mock).mockResolvedValue({ uid: 'user-1', displayName: 'Alice' })
  })

  it('shows a loading spinner initially', () => {
    // Never resolves in this tick
    ;(listItemsForGroup as Mock).mockImplementation(() => new Promise(() => {}))
    renderPage()
    expect(screen.getByTestId('catalog-loading')).toBeInTheDocument()
  })

  it('renders items after loading', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([
      makeItem({ id: 'a', title: 'Catan' }),
      makeItem({ id: 'b', title: 'Pandemic', type: ItemType.BoardGame }),
    ])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('catalog-list')).toBeInTheDocument())
    expect(screen.getByText('Catan')).toBeInTheDocument()
    expect(screen.getByText('Pandemic')).toBeInTheDocument()
  })

  it('shows an empty state when there are no items (no filter)', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('empty-state')).toBeInTheDocument())
    expect(screen.getByText('No items yet')).toBeInTheDocument()
  })

  it('shows an error state when the service rejects', async () => {
    ;(listItemsForGroup as Mock).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => expect(screen.getByTestId('error-state')).toBeInTheDocument())
  })

  it('renders owner names fetched via getUser', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([
      makeItem({ id: 'a', ownerUserId: 'user-1' }),
    ])
    ;(getUser as Mock).mockResolvedValue({ uid: 'user-1', displayName: 'Bob Smith' })
    renderPage()
    await waitFor(() => expect(screen.getByText('Bob Smith')).toBeInTheDocument())
  })

  it('renders the catalog filters bar', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('catalog-filters')).toBeInTheDocument())
  })

  it('re-fetches when the type filter changes', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    // Wait for initial load
    await waitFor(() => expect(screen.getByTestId('catalog-filters')).toBeInTheDocument())
    expect(listItemsForGroup).toHaveBeenCalledTimes(1)

    // Click "Books" chip
    const booksChip = screen.getByRole('button', { name: /books/i })
    await userEvent.click(booksChip)
    await waitFor(() => expect(listItemsForGroup).toHaveBeenCalledTimes(2))
    expect(listItemsForGroup).toHaveBeenLastCalledWith('grp-1', expect.objectContaining({ type: ItemType.Book }))
  })

  it('shows type-specific empty message for Books filter', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('catalog-filters')).toBeInTheDocument())

    const booksChip = screen.getByRole('button', { name: /books/i })
    await userEvent.click(booksChip)
    await waitFor(() => expect(screen.getByText('No books yet')).toBeInTheDocument())
  })

  it('shows type-specific empty message for Board games filter', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('catalog-filters')).toBeInTheDocument())

    const gamesChip = screen.getByRole('button', { name: /board games/i })
    await userEvent.click(gamesChip)
    await waitFor(() => expect(screen.getByText('No board games yet')).toBeInTheDocument())
  })

  it('renders the Add item link', async () => {
    ;(listItemsForGroup as Mock).mockResolvedValue([])
    renderPage()
    await waitFor(() => expect(screen.getByTestId('catalog-filters')).toBeInTheDocument())
    const link = screen.getByTestId('add-item-btn')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/groups/grp-1/items/new')
  })
})
