import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import { getGroup, createGroup, updateGroup } from './groups.repo'
import type { Group } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))

function makeGroup(): Omit<Group, 'id'> {
  return {
    name: 'Family Shelf',
    inviteCode: 'ABC123',
    createdByUserId: 'uid-1',
    createdAt: ts,
    updatedAt: ts,
  }
}

describe('groups.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('getGroup', () => {
    it('returns null when the document does not exist', async () => {
      const result = await getGroup('nonexistent-id')
      expect(result).toBeNull()
    })

    it('returns a Group when the document exists', async () => {
      const group = await createGroup(makeGroup())
      const result = await getGroup(group.id)
      expect(result).not.toBeNull()
      expect(result?.name).toBe('Family Shelf')
      expect(result?.inviteCode).toBe('ABC123')
    })
  })

  describe('createGroup', () => {
    it('returns a Group with an auto-generated id', async () => {
      const group = await createGroup(makeGroup())
      expect(group.id).toBeTruthy()
      expect(group.name).toBe('Family Shelf')
    })

    it('persists the group so getGroup can retrieve it', async () => {
      const created = await createGroup(makeGroup())
      const fetched = await getGroup(created.id)
      expect(fetched?.id).toBe(created.id)
    })
  })

  describe('updateGroup', () => {
    it('updates only specified fields', async () => {
      const group = await createGroup(makeGroup())
      await updateGroup(group.id, { name: 'Updated Shelf' })
      const result = await getGroup(group.id)
      expect(result?.name).toBe('Updated Shelf')
      expect(result?.inviteCode).toBe('ABC123')
    })
  })
})
