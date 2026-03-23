import type { Timestamp } from 'firebase/firestore'

export enum MemberRole {
  Admin = 'admin',
  Member = 'member',
}

export type MembershipStatus = 'active' | 'removed'

export interface Group {
  id: string
  name: string
  /** 6-character alphanumeric invite code */
  inviteCode: string
  createdByUserId: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface Membership {
  id: string
  groupId: string
  userId: string
  role: MemberRole
  status: MembershipStatus
  joinedAt: Timestamp
  updatedAt: Timestamp
}
