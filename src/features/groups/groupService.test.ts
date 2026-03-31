import { describe, it, expect, beforeEach } from 'vitest'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import { getGroup } from '@/lib/repositories'
import { getMembershipForUserInGroup } from '@/lib/repositories'
import { createGroup, joinGroupByCode } from './groupService'
import { MemberRole } from '@/lib/types'

const USER_A = 'uid-alice'
const USER_B = 'uid-bob'

describe('groupService', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('createGroup', () => {
    it('writes a groups document with the given name', async () => {
      const { group } = await createGroup(USER_A, 'Book Club')
      const fetched = await getGroup(group.id)
      expect(fetched?.name).toBe('Book Club')
    })

    it('generates a 6-character invite code', async () => {
      const { group } = await createGroup(USER_A, 'Book Club')
      expect(group.inviteCode).toMatch(/^[A-Z0-9]{6}$/)
    })

    it('sets createdByUserId correctly', async () => {
      const { group } = await createGroup(USER_A, 'Book Club')
      expect(group.createdByUserId).toBe(USER_A)
    })

    it('creates an admin membership for the creator', async () => {
      const { group, membership } = await createGroup(USER_A, 'Book Club')
      expect(membership.userId).toBe(USER_A)
      expect(membership.groupId).toBe(group.id)
      expect(membership.role).toBe(MemberRole.Admin)
      expect(membership.status).toBe('active')
    })

    it('throws when name is shorter than 3 characters', async () => {
      await expect(createGroup(USER_A, 'AB')).rejects.toThrow(/3/)
    })

    it('throws when name is longer than 50 characters', async () => {
      await expect(createGroup(USER_A, 'A'.repeat(51))).rejects.toThrow(/50/)
    })

    it('trims whitespace from the name', async () => {
      const { group } = await createGroup(USER_A, '  Book Club  ')
      expect(group.name).toBe('Book Club')
    })
  })

  describe('joinGroupByCode', () => {
    it('adds the user as a member of the group', async () => {
      const { group } = await createGroup(USER_A, 'Game Night')
      const { membership, alreadyMember } = await joinGroupByCode(USER_B, group.inviteCode)
      expect(membership.userId).toBe(USER_B)
      expect(membership.groupId).toBe(group.id)
      expect(membership.role).toBe(MemberRole.Member)
      expect(alreadyMember).toBe(false)
    })

    it('is idempotent — returns existing membership on second call', async () => {
      const { group } = await createGroup(USER_A, 'Game Night')
      await joinGroupByCode(USER_B, group.inviteCode)
      const { alreadyMember, membership } = await joinGroupByCode(USER_B, group.inviteCode)
      expect(alreadyMember).toBe(true)
      // Only one membership doc exists
      const found = await getMembershipForUserInGroup(USER_B, group.id)
      expect(found?.id).toBe(membership.id)
    })

    it('throws for a non-existent invite code', async () => {
      await expect(joinGroupByCode(USER_B, 'XXXXXX')).rejects.toThrow(/No group found/)
    })

    it('normalises the code to uppercase before lookup', async () => {
      const { group } = await createGroup(USER_A, 'Game Night')
      const { membership } = await joinGroupByCode(USER_B, group.inviteCode.toLowerCase())
      expect(membership.userId).toBe(USER_B)
    })
  })
})
