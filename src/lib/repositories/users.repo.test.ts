import { describe, it, expect, beforeEach } from 'vitest'
import { Timestamp } from 'firebase/firestore'
import { clearFirestoreEmulator } from '@/lib/test-utils/firestore-helpers'
import { getUser, setUser, updateUser } from './users.repo'
import type { UserProfile } from '@/lib/types'

const ts = Timestamp.fromDate(new Date('2025-01-01'))

function makeUser(id: string): UserProfile {
  return {
    id,
    displayName: 'Alice',
    email: 'alice@example.com',
    photoURL: null,
    createdAt: ts,
    lastLoginAt: ts,
  }
}

describe('users.repo', () => {
  beforeEach(async () => {
    await clearFirestoreEmulator()
  })

  describe('getUser', () => {
    it('returns null when the document does not exist', async () => {
      const result = await getUser('nonexistent-uid')
      expect(result).toBeNull()
    })

    it('returns a UserProfile when the document exists', async () => {
      const user = makeUser('uid-1')
      await setUser(user)
      const result = await getUser('uid-1')
      expect(result).not.toBeNull()
      expect(result?.id).toBe('uid-1')
      expect(result?.displayName).toBe('Alice')
    })
  })

  describe('setUser', () => {
    it('creates a user document with the given id', async () => {
      const user = makeUser('uid-2')
      await setUser(user)
      const result = await getUser('uid-2')
      expect(result).toMatchObject({ id: 'uid-2', email: 'alice@example.com' })
    })

    it('overwrites an existing user document', async () => {
      await setUser(makeUser('uid-3'))
      const updated: UserProfile = { ...makeUser('uid-3'), displayName: 'Alice Updated' }
      await setUser(updated)
      const result = await getUser('uid-3')
      expect(result?.displayName).toBe('Alice Updated')
    })
  })

  describe('updateUser', () => {
    it('updates only the specified fields', async () => {
      await setUser(makeUser('uid-4'))
      await updateUser('uid-4', { displayName: 'Alice V2' })
      const result = await getUser('uid-4')
      expect(result?.displayName).toBe('Alice V2')
      expect(result?.email).toBe('alice@example.com')
    })
  })
})
