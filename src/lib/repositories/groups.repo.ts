import { collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Group } from '@/lib/types'

const COL = 'groups'

/**
 * Fetch a Group by its Firestore document ID.
 * Returns `null` if no document exists.
 */
export async function getGroup(id: string): Promise<Group | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Group
}

/**
 * Create a new group document with an auto-generated ID.
 * Returns the created Group (with its new `id`).
 */
export async function createGroup(data: Omit<Group, 'id'>): Promise<Group> {
  const ref = await addDoc(collection(db, COL), data)
  return { id: ref.id, ...data }
}

/**
 * Find a group by its 6-character invite code.
 * Returns `null` if no matching group exists.
 */
export async function getGroupByInviteCode(code: string): Promise<Group | null> {
  const q = query(collection(db, COL), where('inviteCode', '==', code), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Group
}

/**
 * Partially update a Group document.
 * `id` and `createdAt` may not be changed.
 */
export async function updateGroup(
  id: string,
  data: Partial<Omit<Group, 'id' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}
