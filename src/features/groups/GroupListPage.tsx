import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMembersForGroup } from '@/lib/repositories'
import { Spinner, EmptyState, Card, Badge } from '@/components/ui'
import { MemberRole } from '@/lib/types'
import type { Group, Membership } from '@/lib/types'
import { useGroup } from './useGroup'

function GroupCard({
  group,
  membership,
  isActive,
  onSwitch,
}: {
  group: Group
  membership: Membership
  isActive: boolean
  onSwitch: () => void
}) {
  const [memberCount, setMemberCount] = useState<number | null>(null)

  useEffect(() => {
    getMembersForGroup(group.id)
      .then((ms) => setMemberCount(ms.length))
      .catch(() => setMemberCount(null))
  }, [group.id])

  return (
    <Card>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to={`/groups/${group.id}`}
            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
          >
            {group.name}
          </Link>
          {membership.role === MemberRole.Admin && (
            <Badge label="Admin" variant="info" />
          )}
          {isActive && <Badge label="Active" variant="success" />}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs text-gray-400">
            {memberCount === null ? '…' : `${memberCount} member${memberCount !== 1 ? 's' : ''}`}
          </span>
          {!isActive && (
            <button
              onClick={onSwitch}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
              data-testid={`switch-btn-${group.id}`}
            >
              Switch
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default function GroupListPage() {
  const { groups, memberships, activeGroup, setActiveGroupId, loading } = useGroup()

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="groups-loading">
        <Spinner size="lg" />
      </div>
    )
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        heading="You haven't joined any groups yet"
        description="Create a new group or ask a friend to share their invite link."
        action={
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              to="/groups/new"
              className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
            >
              Create group
            </Link>
            <Link
              to="/join"
              className="rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
            >
              Join with a code
            </Link>
          </div>
        }
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Groups</h1>
        <div className="flex gap-2">
          <Link
            to="/groups/new"
            className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            Create group
          </Link>
          <Link
            to="/join"
            className="rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
          >
            Join
          </Link>
        </div>
      </div>

      <div className="space-y-3" data-testid="groups-list">
        {groups.map((group) => {
          const membership = memberships.find((m) => m.groupId === group.id)
          if (!membership) return null
          return (
            <GroupCard
              key={group.id}
              group={group}
              membership={membership}
              isActive={activeGroup?.id === group.id}
              onSwitch={() => setActiveGroupId(group.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
