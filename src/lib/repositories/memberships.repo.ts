import { collection, doc, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Membership } from '@/lib/types'

const COL = 'memberships'

/**
 * Return all active Membership documents for a given user.
 */
export async function getMembershipsForUser(userId: string): Promise<Membership[]> {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    where('status', '==', 'active')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Membership)
}

/**
 * Return all active Membership documents for a given group.
 */
export async function getMembersForGroup(groupId: string): Promise<Membership[]> {
  const q = query(
    collection(db, COL),
    where('groupId', '==', groupId),
    where('status', '==', 'active')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Membership)
}

/**
 * Return the active Membership for a specific (userId, groupId) pair.
 * Returns `null` if no matching membership exists.
 */
export async function getMembershipForUserInGroup(
  userId: string,
  groupId: string
): Promise<Membership | null> {
  const q = query(
    collection(db, COL),
    where('userId', '==', userId),
    where('groupId', '==', groupId),
    where('status', '==', 'active')
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as Membership
}

/**
 * Create a new Membership document with an auto-generated ID.
 * Returns the created Membership (with its new `id`).
 */
export async function createMembership(data: Omit<Membership, 'id'>): Promise<Membership> {
  const ref = await addDoc(collection(db, COL), data)
  return { id: ref.id, ...data }
}

/**
 * Partially update a Membership document.
 */
export async function updateMembership(
  id: string,
  data: Partial<Omit<Membership, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}
