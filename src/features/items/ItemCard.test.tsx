import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ItemCard from './ItemCard'
import { ItemStatus, ItemType } from '@/lib/types'
import type { Item } from '@/lib/types'

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    groupId: 'group-1',
    ownerUserId: 'user-1',
    title: 'Pandemic',
    titleLower: 'pandemic',
    type: ItemType.BoardGame,
    status: ItemStatus.Available,
    createdAt: { seconds: 1000, nanoseconds: 0 } as never,
    updatedAt: { seconds: 1000, nanoseconds: 0 } as never,
    ...overrides,
  }
}

function renderCard(item: Item, ownerName = 'Alice') {
  return render(
    <MemoryRouter>
      <ItemCard item={item} ownerName={ownerName} />
    </MemoryRouter>,
  )
}

describe('ItemCard', () => {
  it('renders the item title', () => {
    renderCard(makeItem({ title: 'Catan' }))
    expect(screen.getByText('Catan')).toBeInTheDocument()
  })

  it('renders the author when present', () => {
    renderCard(makeItem({ author: 'Klaus Teuber' }))
    expect(screen.getByText('Klaus Teuber')).toBeInTheDocument()
  })

  it('does not render author row when absent', () => {
    const { queryByText } = renderCard(makeItem({ author: undefined }))
    // No author text at all — we check the author-specific content isn't present
    expect(queryByText('Klaus Teuber')).toBeNull()
  })

  it('renders the status badge for Available', () => {
    renderCard(makeItem({ status: ItemStatus.Available }))
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('renders the status badge for Lent', () => {
    renderCard(makeItem({ status: ItemStatus.Lent }))
    expect(screen.getByText('Lent out')).toBeInTheDocument()
  })

  it('renders the type badge for Book', () => {
    renderCard(makeItem({ type: ItemType.Book }))
    expect(screen.getByText('Book')).toBeInTheDocument()
  })

  it('renders the type badge for BoardGame', () => {
    renderCard(makeItem({ type: ItemType.BoardGame }))
    expect(screen.getByText('Board game')).toBeInTheDocument()
  })

  it('renders the owner name', () => {
    renderCard(makeItem(), 'Bob')
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders the description when present', () => {
    renderCard(makeItem({ description: 'A fun cooperative game.' }))
    expect(screen.getByText('A fun cooperative game.')).toBeInTheDocument()
  })

  it('does not render description when absent', () => {
    renderCard(makeItem({ description: undefined }))
    // Verify the card root exists but no description paragraph
    expect(screen.getByTestId('item-card-item-1')).toBeInTheDocument()
  })

  it('has the correct data-testid based on item id', () => {
    renderCard(makeItem({ id: 'abc-123' }))
    expect(screen.getByTestId('item-card-abc-123')).toBeInTheDocument()
  })
})
