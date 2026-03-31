import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getGroup } from '@/lib/repositories'
import type { Group } from '@/lib/types'
import { Spinner, EmptyState, ErrorState } from '@/components/ui'
import InviteLinkBanner from './InviteLinkBanner'

export default function GroupCatalogPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!groupId) return
    setLoading(true)
    getGroup(groupId)
      .then((g) => {
        setGroup(g)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load the group. Please try again.')
        setLoading(false)
      })
  }, [groupId])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          setError(null)
          setLoading(true)
          if (groupId) {
            getGroup(groupId)
              .then((g) => {
                setGroup(g)
                setLoading(false)
              })
              .catch(() => {
                setError('Could not load the group. Please try again.')
                setLoading(false)
              })
          }
        }}
      />
    )
  }

  if (!group) {
    return (
      <EmptyState
        heading="Group not found"
        description="This group may have been deleted or the link is incorrect."
        action={<Link to="/" className="text-sm text-indigo-600 hover:underline">Back to home</Link>}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-900">{group.name}</h1>
      </div>

      <InviteLinkBanner inviteCode={group.inviteCode} />

      <EmptyState
        heading="No items yet"
        description="Add the first book or board game to this group's shared shelf."
      />
    </div>
  )
}
