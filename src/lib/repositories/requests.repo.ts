import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { BorrowRequest, RequestStatus } from '@/lib/types'

const COL = 'borrowRequests'

/**
 * Fetch a BorrowRequest by its Firestore document ID.
 * Returns `null` if no document exists.
 */
export async function getRequest(id: string): Promise<BorrowRequest | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as BorrowRequest
}

/**
 * List borrow requests where the current user is the item owner.
 * Optionally filter by status; ordered by `requestedAt` descending.
 */
export async function listRequestsForOwner(
  ownerUserId: string,
  status?: RequestStatus
): Promise<BorrowRequest[]> {
  const constraints = [where('ownerUserId', '==', ownerUserId), orderBy('requestedAt', 'desc')]
  if (status !== undefined) {
    constraints.splice(1, 0, where('status', '==', status))
  }
  const q = query(collection(db, COL), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BorrowRequest)
}

/**
 * List borrow requests made by a specific user.
 * Optionally filter by status; ordered by `requestedAt` descending.
 */
export async function listRequestsForRequester(
  requesterUserId: string,
  status?: RequestStatus
): Promise<BorrowRequest[]> {
  const constraints = [
    where('requesterUserId', '==', requesterUserId),
    orderBy('requestedAt', 'desc'),
  ]
  if (status !== undefined) {
    constraints.splice(1, 0, where('status', '==', status))
  }
  const q = query(collection(db, COL), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as BorrowRequest)
}

/**
 * Create a new BorrowRequest document with an auto-generated ID.
 * Returns the created BorrowRequest (with its new `id`).
 */
export async function createRequest(data: Omit<BorrowRequest, 'id'>): Promise<BorrowRequest> {
  const ref = await addDoc(collection(db, COL), data)
  return { id: ref.id, ...data }
}

/**
 * Partially update a BorrowRequest document.
 */
export async function updateRequest(
  id: string,
  data: Partial<Omit<BorrowRequest, 'id'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}
