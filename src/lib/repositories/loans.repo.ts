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
import type { Loan } from '@/lib/types'
import { LoanReturnState } from '@/lib/types'

const COL = 'loans'

/**
 * Fetch a Loan by its Firestore document ID.
 * Returns `null` if no document exists.
 */
export async function getLoan(id: string): Promise<Loan | null> {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() } as Loan
}

/**
 * List all loans where the given user is the borrower, newest first.
 */
export async function listLoansForBorrower(borrowerUserId: string): Promise<Loan[]> {
  const q = query(
    collection(db, COL),
    where('borrowerUserId', '==', borrowerUserId),
    orderBy('lentAt', 'desc')
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Loan)
}

/**
 * List all active (not yet fully returned) loans in a group, soonest due first.
 * Active = returnState is `lent` or `return_pending`.
 */
export async function listActiveLoansForGroup(groupId: string): Promise<Loan[]> {
  // Firestore does not support `!=` across compound queries, so we fetch lent and
  // return_pending separately and merge client-side.
  const [lentSnap, pendingSnap] = await Promise.all([
    getDocs(
      query(
        collection(db, COL),
        where('groupId', '==', groupId),
        where('returnState', '==', LoanReturnState.Lent)
      )
    ),
    getDocs(
      query(
        collection(db, COL),
        where('groupId', '==', groupId),
        where('returnState', '==', LoanReturnState.ReturnPending)
      )
    ),
  ])

  const loans = [
    ...lentSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Loan),
    ...pendingSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Loan),
  ]

  // Sort by dueAt ascending (null/missing due dates last)
  loans.sort((a, b) => {
    if (!a.dueAt) return 1
    if (!b.dueAt) return -1
    return a.dueAt.toMillis() - b.dueAt.toMillis()
  })

  return loans
}

/**
 * Create a new Loan document with an auto-generated ID.
 * Returns the created Loan (with its new `id`).
 */
export async function createLoan(data: Omit<Loan, 'id'>): Promise<Loan> {
  const ref = await addDoc(collection(db, COL), data)
  return { id: ref.id, ...data }
}

/**
 * Partially update a Loan document.
 */
export async function updateLoan(id: string, data: Partial<Omit<Loan, 'id'>>): Promise<void> {
  await updateDoc(doc(db, COL, id), data)
}
