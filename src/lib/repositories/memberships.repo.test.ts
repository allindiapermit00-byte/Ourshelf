import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import {
  createMembership,
  getMembershipsForUser,
  getMembersForGroup,
  updateMembership,
} from './memberships.repo'
import { MemberRole } from '@/lib/types'
import type { Membership } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))

function makeMembership(overrides: Partial<Omit<Membership, 'id'>> = {}): Omit<Membership, 'id'> {
  return {
    groupId: 'group-1',
    userId: 'uid-1',
    role: MemberRole.Member,
    status: 'active',
    joinedAt: ts,
    updatedAt: ts,
    ...overrides,
  }
}

describe('memberships.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('createMembership', () => {
    it('returns a Membership with an auto-generated id', async () => {
      const m = await createMembership(makeMembership())
      expect(m.id).toBeTruthy()
      expect(m.userId).toBe('uid-1')
    })
  })

  describe('getMembershipsForUser', () => {
    it('returns only active memberships for the user', async () => {
      await createMembership(makeMembership({ userId: 'uid-A', status: 'active' }))
      await createMembership(makeMembership({ userId: 'uid-A', status: 'removed' }))
      await createMembership(makeMembership({ userId: 'uid-B', status: 'active' }))

      const results = await getMembershipsForUser('uid-A')
      expect(results).toHaveLength(1)
      expect(results[0].userId).toBe('uid-A')
      expect(results[0].status).toBe('active')
    })

    it('returns empty array when user has no memberships', async () => {
      const results = await getMembershipsForUser('uid-nobody')
      expect(results).toHaveLength(0)
    })
  })

  describe('getMembersForGroup', () => {
    it('returns only active members in the group', async () => {
      await createMembership(makeMembership({ groupId: 'g-1', userId: 'u-1', status: 'active' }))
      await createMembership(makeMembership({ groupId: 'g-1', userId: 'u-2', status: 'removed' }))
      await createMembership(makeMembership({ groupId: 'g-2', userId: 'u-3', status: 'active' }))

      const results = await getMembersForGroup('g-1')
      expect(results).toHaveLength(1)
      expect(results[0].userId).toBe('u-1')
    })
  })

  describe('updateMembership', () => {
    it('updates the specified field', async () => {
      const m = await createMembership(makeMembership({ role: MemberRole.Member }))
      await updateMembership(m.id, { role: MemberRole.Admin })
      // Re-fetch via getMembersForGroup
      const updated = (await getMembersForGroup('group-1')).find((x) => x.id === m.id)
      expect(updated?.role).toBe(MemberRole.Admin)
    })
  })
})
