import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import { getItem, listItemsForGroup, createItem, updateItem } from './items.repo'
import { ItemType, ItemStatus } from '@/lib/types'
import type { Item } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))

function makeItem(overrides: Partial<Omit<Item, 'id'>> = {}): Omit<Item, 'id'> {
  return {
    groupId: 'group-1',
    ownerUserId: 'uid-1',
    title: 'Dune',
    titleLower: 'dune',
    type: ItemType.Book,
    status: ItemStatus.Available,
    createdAt: ts,
    updatedAt: ts,
    ...overrides,
  }
}

describe('items.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('getItem', () => {
    it('returns null when the document does not exist', async () => {
      expect(await getItem('nonexistent-id')).toBeNull()
    })

    it('returns an Item when the document exists', async () => {
      const item = await createItem(makeItem())
      const result = await getItem(item.id)
      expect(result?.title).toBe('Dune')
      expect(result?.type).toBe(ItemType.Book)
    })
  })

  describe('createItem', () => {
    it('returns an Item with an auto-generated id', async () => {
      const item = await createItem(makeItem())
      expect(item.id).toBeTruthy()
      expect(item.status).toBe(ItemStatus.Available)
    })
  })

  describe('listItemsForGroup', () => {
    it('returns all items for a group with no filters', async () => {
      await createItem(makeItem({ groupId: 'g-1', type: ItemType.Book }))
      await createItem(makeItem({ groupId: 'g-1', type: ItemType.BoardGame }))
      await createItem(makeItem({ groupId: 'g-2', type: ItemType.Book }))

      const results = await listItemsForGroup('g-1')
      expect(results).toHaveLength(2)
    })

    it('filters by status', async () => {
      await createItem(makeItem({ groupId: 'g-1', status: ItemStatus.Available }))
      await createItem(makeItem({ groupId: 'g-1', status: ItemStatus.Lent }))

      const results = await listItemsForGroup('g-1', { status: ItemStatus.Available })
      expect(results).toHaveLength(1)
      expect(results[0].status).toBe(ItemStatus.Available)
    })

    it('filters by type', async () => {
      await createItem(makeItem({ groupId: 'g-1', type: ItemType.Book }))
      await createItem(makeItem({ groupId: 'g-1', type: ItemType.BoardGame }))

      const results = await listItemsForGroup('g-1', { type: ItemType.BoardGame })
      expect(results).toHaveLength(1)
      expect(results[0].type).toBe(ItemType.BoardGame)
    })

    it('returns empty array when group has no items', async () => {
      expect(await listItemsForGroup('empty-group')).toHaveLength(0)
    })
  })

  describe('updateItem', () => {
    it('updates only the specified fields', async () => {
      const item = await createItem(makeItem({ title: 'Dune', status: ItemStatus.Available }))
      await updateItem(item.id, { status: ItemStatus.Lent })
      const result = await getItem(item.id)
      expect(result?.status).toBe(ItemStatus.Lent)
      expect(result?.title).toBe('Dune')
    })
  })
})
