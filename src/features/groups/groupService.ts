import { serverTimestamp } from 'firebase/firestore'
import {
  createGroup as repoCreateGroup,
  getGroupByInviteCode,
  createMembership,
  getMembershipForUserInGroup,
} from '@/lib/repositories'
import type { Group, Membership } from '@/lib/types'
import { MemberRole } from '@/lib/types'

/** Generate a random 6-character uppercase alphanumeric code. */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export interface CreateGroupResult {
  group: Group
  membership: Membership
}

/**
 * Create a new group and add the creator as an admin member.
 * `name` must be 3–50 characters.
 */
export async function createGroup(
  userId: string,
  name: string,
): Promise<CreateGroupResult> {
  const trimmed = name.trim()
  if (trimmed.length < 3 || trimmed.length > 50) {
    throw new Error('Group name must be between 3 and 50 characters.')
  }

  const inviteCode = generateInviteCode()
  const now = serverTimestamp()

  const group = await repoCreateGroup({
    name: trimmed,
    inviteCode,
    createdByUserId: userId,
    createdAt: now as never,
    updatedAt: now as never,
  })

  const membership = await createMembership({
    groupId: group.id,
    userId,
    role: MemberRole.Admin,
    status: 'active',
    joinedAt: now as never,
    updatedAt: now as never,
  })

  return { group, membership }
}

export interface JoinGroupResult {
  group: Group
  membership: Membership
  alreadyMember: boolean
}

/**
 * Join a group using a 6-character invite code.
 * Idempotent — returns existing membership if the user is already a member.
 * Throws if the code does not match any active group.
 */
export async function joinGroupByCode(
  userId: string,
  code: string,
): Promise<JoinGroupResult> {
  const normalised = code.trim().toUpperCase()
  const group = await getGroupByInviteCode(normalised)
  if (!group) {
    throw new Error('No group found for that invite code. Please check and try again.')
  }

  const existing = await getMembershipForUserInGroup(userId, group.id)
  if (existing) {
    return { group, membership: existing, alreadyMember: true }
  }

  const now = serverTimestamp()
  const membership = await createMembership({
    groupId: group.id,
    userId,
    role: MemberRole.Member,
    status: 'active',
    joinedAt: now as never,
    updatedAt: now as never,
  })

  return { group, membership, alreadyMember: false }
}
