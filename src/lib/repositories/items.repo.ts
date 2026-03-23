import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Item, ItemStatus, ItemType } from '@/lib/types'

const COL = 'items'

/**
 * Fetch an Item by its Firestore document ID.
 * Returns `null` if no document exists.
 */
export async function getItem(id: string): Promise<Item | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Item
}

export interface ListItemsFilter {
  status?: ItemStatus
  type?: ItemType
}

/**
 * List all non-archived items for a given group, with optional status/type filters.
 * Results are fetched in insertion order (no server-side ordering — filtered client-side if needed).
 */
export async function listItemsForGroup(
  groupId: string,
  filters?: ListItemsFilter
): Promise<Item[]> {
  const constraints = [where('groupId', '==', groupId)]

  if (filters?.status !== undefined) {
    constraints.push(where('status', '==', filters.status))
  }
  if (filters?.type !== undefined) {
    constraints.push(where('type', '==', filters.type))
  }

  const q = query(collection(db, COL), ...constraints)
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Item)
}

/**
 * Create a new Item document with an auto-generated ID.
 * Returns the created Item (with its new `id`).
 */
export async function createItem(data: Omit<Item, 'id'>): Promise<Item> {
  const ref = await addDoc(collection(db, COL), data)
  return { id: ref.id, ...data }
}

/**
 * Partially update an Item document.
 * `id`, `groupId`, `ownerUserId`, and `createdAt` may not be changed.
 */
export async function updateItem(
  id: string,
  data: Partial<Omit<Item, 'id' | 'groupId' | 'ownerUserId' | 'createdAt'>>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}
