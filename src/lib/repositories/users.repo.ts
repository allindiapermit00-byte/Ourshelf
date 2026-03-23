import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { UserProfile } from '@/lib/types'

const COL = 'users'

/**
 * Fetch a UserProfile by Firebase Auth UID.
 * Returns `null` if no document exists.
 */
export async function getUser(id: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as UserProfile
}

/**
 * Create or fully overwrite a UserProfile document.
 * The document ID equals the Firebase Auth UID stored in `user.id`.
 */
export async function setUser(user: UserProfile): Promise<void> {
  const { id, ...data } = user
  await setDoc(doc(db, COL, id), data)
}

/**
 * Partially update a UserProfile.
 * `id` and `createdAt` may not be changed.
 */
export async function updateUser(
  id: string,
  data: Partial<Omit<UserProfile, 'id' | 'createdAt'>> & { updatedAt?: Timestamp }
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    lastLoginAt: data.lastLoginAt ?? Timestamp.now(),
  })
}
