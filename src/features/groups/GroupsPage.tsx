import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/ui'

/** Groups list — will show joined groups in a later task. */
export default function GroupsPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Groups</h1>
        <Link
          to="/groups/new"
          className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        >
          Create group
        </Link>
      </div>

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
    </div>
  )
}
