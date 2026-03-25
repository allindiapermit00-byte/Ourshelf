import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

vi.mock('firebase/auth', () => ({
  GoogleAuthProvider: vi.fn(() => ({})),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
}))

vi.mock('@/lib/firebase', () => ({ auth: {} }))

vi.mock('@/lib/repositories/users.repo', () => ({
  getUser: vi.fn(),
  setUser: vi.fn(),
  updateUser: vi.fn(),
}))

// Stable Timestamp.now stub
vi.mock('firebase/firestore', () => ({
  Timestamp: { now: vi.fn(() => ({ seconds: 1000, nanoseconds: 0 })) },
}))

import { signInWithGoogle, signOut, bootstrapUserProfile } from './authService'
import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { getUser, setUser, updateUser } from '@/lib/repositories/users.repo'

const mockFirebaseUser = {
  uid: 'uid-1',
  displayName: 'Alice',
  email: 'alice@example.com',
  photoURL: 'https://example.com/photo.png',
}

describe('authService', () => {
  beforeEach(() => vi.clearAllMocks())

  describe('signInWithGoogle', () => {
    it('delegates to signInWithPopup', async () => {
      ;(signInWithPopup as Mock).mockResolvedValue({})
      await signInWithGoogle()
      expect(signInWithPopup).toHaveBeenCalledOnce()
    })
  })

  describe('signOut', () => {
    it('delegates to firebase signOut', async () => {
      ;(firebaseSignOut as Mock).mockResolvedValue(undefined)
      await signOut()
      expect(firebaseSignOut).toHaveBeenCalledOnce()
    })
  })

  describe('bootstrapUserProfile', () => {
    it('creates a new profile on first sign-in', async () => {
      ;(getUser as Mock).mockResolvedValue(null)
      ;(setUser as Mock).mockResolvedValue(undefined)

      await bootstrapUserProfile(mockFirebaseUser as never)

      expect(setUser).toHaveBeenCalledOnce()
      expect(setUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'uid-1',
          displayName: 'Alice',
          email: 'alice@example.com',
          photoURL: 'https://example.com/photo.png',
        })
      )
      expect(updateUser).not.toHaveBeenCalled()
    })

    it('updates lastLoginAt on subsequent sign-ins without overwriting profile', async () => {
      ;(getUser as Mock).mockResolvedValue({ id: 'uid-1', displayName: 'Alice' })
      ;(updateUser as Mock).mockResolvedValue(undefined)

      await bootstrapUserProfile(mockFirebaseUser as never)

      expect(setUser).not.toHaveBeenCalled()
      expect(updateUser).toHaveBeenCalledWith(
        'uid-1',
        expect.objectContaining({ lastLoginAt: { seconds: 1000, nanoseconds: 0 } })
      )
    })

    it('falls back to "Unknown" when displayName is null', async () => {
      ;(getUser as Mock).mockResolvedValue(null)
      ;(setUser as Mock).mockResolvedValue(undefined)

      await bootstrapUserProfile({ ...mockFirebaseUser, displayName: null } as never)

      expect(setUser).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'Unknown' }))
    })

    it('falls back to empty string when email is null', async () => {
      ;(getUser as Mock).mockResolvedValue(null)
      ;(setUser as Mock).mockResolvedValue(undefined)

      await bootstrapUserProfile({ ...mockFirebaseUser, email: null } as never)

      expect(setUser).toHaveBeenCalledWith(expect.objectContaining({ email: '' }))
    })
  })
})
