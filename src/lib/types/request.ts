import type { Timestamp } from 'firebase/firestore'

export enum RequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Declined = 'declined',
  Cancelled = 'cancelled',
}

export interface BorrowRequest {
  id: string
  groupId: string
  itemId: string
  ownerUserId: string
  requesterUserId: string
  status: RequestStatus
  /** Set once a Loan document is created after approval */
  loanId?: string
  requestedAt: Timestamp
  updatedAt: Timestamp
}
