import type { Timestamp } from 'firebase/firestore'

export enum LoanReturnState {
  Lent = 'lent',
  ReturnPending = 'return_pending',
  Returned = 'returned',
}

export interface Loan {
  id: string
  groupId: string
  itemId: string
  requestId: string
  ownerUserId: string
  borrowerUserId: string
  returnState: LoanReturnState
  lentAt: Timestamp
  /** Computed from dueDaysDefault at loan creation time */
  dueAt?: Timestamp
  /** Set by borrower when they mark the item as returned */
  returnedAt?: Timestamp
  /** Set by owner when they confirm return */
  returnConfirmedAt?: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
