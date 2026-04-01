import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

vi.mock('@/lib/repositories', () => ({
  listItemsForGroup: vi.fn(),
}))

import { listItemsForGroup } from './itemsService'
import { listItemsForGroup as repoList } from '@/lib/repositories'
import { ItemStatus, ItemType } from '@/lib/types'
import type { Item } from '@/lib/types'

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    groupId: 'group-1',
    ownerUserId: 'user-1',
    title: 'The Pragmatic Programmer',
    titleLower: 'the pragmatic programmer',
    type: ItemType.Book,
    status: ItemStatus.Available,
    createdAt: { seconds: 1000, nanoseconds: 0 } as never,
    updatedAt: { seconds: 1000, nanoseconds: 0 } as never,
    ...overrides,
  }
}

describe('itemsService › listItemsForGroup', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns non-archived items unchanged', async () => {
    const items = [
      makeItem({ id: 'a', status: ItemStatus.Available }),
      makeItem({ id: 'b', status: ItemStatus.Lent }),
      makeItem({ id: 'c', status: ItemStatus.Requested }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1')
    expect(result).toEqual(items)
  })

  it('always excludes Archived items', async () => {
    const items = [
      makeItem({ id: 'a', status: ItemStatus.Available }),
      makeItem({ id: 'arch', status: ItemStatus.Archived }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('a')
  })

  it('filters by type=Book', async () => {
    const items = [
      makeItem({ id: 'book', type: ItemType.Book }),
      makeItem({ id: 'game', type: ItemType.BoardGame }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1', { type: ItemType.Book })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('book')
  })

  it('filters by type=BoardGame', async () => {
    const items = [
      makeItem({ id: 'book', type: ItemType.Book }),
      makeItem({ id: 'game', type: ItemType.BoardGame }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1', { type: ItemType.BoardGame })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('game')
  })

  it('filters by status=Available', async () => {
    const items = [
      makeItem({ id: 'avail', status: ItemStatus.Available }),
      makeItem({ id: 'lent', status: ItemStatus.Lent }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1', { status: ItemStatus.Available })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('avail')
  })

  it('applies both type and status filters together', async () => {
    const items = [
      makeItem({ id: 'match', type: ItemType.Book, status: ItemStatus.Available }),
      makeItem({ id: 'wrong-type', type: ItemType.BoardGame, status: ItemStatus.Available }),
      makeItem({ id: 'wrong-status', type: ItemType.Book, status: ItemStatus.Lent }),
    ]
    ;(repoList as Mock).mockResolvedValue(items)

    const result = await listItemsForGroup('group-1', {
      type: ItemType.Book,
      status: ItemStatus.Available,
    })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('match')
  })

  it('passes the groupId to the repo', async () => {
    ;(repoList as Mock).mockResolvedValue([])
    await listItemsForGroup('grp-xyz', {})
    expect(repoList).toHaveBeenCalledWith('grp-xyz')
  })
})
