import { Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { EmptyState } from '@/components/ui'

/** Placeholder home page — groups and items UI are added in subsequent tasks. */
export default function HomePage() {
  const { user } = useAuth()

  return (
    <EmptyState
      heading={`Welcome, ${user?.displayName ?? 'there'}!`}
      description="Your shelf is empty for now. Create a group to start sharing books and board games with friends."
      action={
        <Link
          to="/groups/new"
          className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        >
          Create a group
        </Link>
      }
    />
  )
}
