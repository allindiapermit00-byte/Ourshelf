import type { Timestamp } from 'firebase/firestore'

export enum ItemType {
  Book = 'book',
  BoardGame = 'board_game',
}

export enum ItemStatus {
  Available = 'available',
  Requested = 'requested',
  Lent = 'lent',
  Archived = 'archived',
}

export interface Item {
  id: string
  groupId: string
  ownerUserId: string
  title: string
  /** Lowercase version of title used for prefix search / client-side filtering */
  titleLower: string
  type: ItemType
  status: ItemStatus
  /** Only relevant when type === ItemType.Book */
  author?: string
  description?: string
  notes?: string
  /** Default lending duration in days */
  dueDaysDefault?: number
  tags?: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
