import { useAuth } from '@/features/auth/useAuth'
import { EmptyState } from '@/components/ui'

/** Placeholder home page — groups and items UI are added in subsequent tasks. */
export default function HomePage() {
  const { user } = useAuth()

  return (
    <EmptyState
      heading={`Welcome, ${user?.displayName ?? 'there'}!`}
      description="Your shelf is empty for now. Create a group to start sharing books and board games with friends."
    />
  )
}
