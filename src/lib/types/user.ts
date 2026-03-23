import type { Timestamp } from 'firebase/firestore'

export interface UserProfile {
  /** Firebase Auth UID */
  id: string
  displayName: string
  email: string
  photoURL: string | null
  createdAt: Timestamp
  lastLoginAt: Timestamp
}
