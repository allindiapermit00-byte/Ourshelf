import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { Timestamp } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { getUser, setUser, updateUser } from '@/lib/repositories/users.repo'

const googleProvider = new GoogleAuthProvider()

/** Open the Google sign-in popup. */
export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider)
}

/** Sign the current user out. */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/**
 * Create or refresh a UserProfile in Firestore.
 *
 * - First sign-in → creates the document.
 * - Subsequent sign-ins → updates `lastLoginAt` only.
 */
export async function bootstrapUserProfile(firebaseUser: User): Promise<void> {
  const existing = await getUser(firebaseUser.uid)
  const now = Timestamp.now()

  if (!existing) {
    await setUser({
      id: firebaseUser.uid,
      displayName: firebaseUser.displayName ?? 'Unknown',
      email: firebaseUser.email ?? '',
      photoURL: firebaseUser.photoURL,
      createdAt: now,
      lastLoginAt: now,
    })
  } else {
    await updateUser(firebaseUser.uid, { lastLoginAt: now })
  }
}
