import { useAuth } from '@/features/auth/useAuth'
import { signOut } from '@/features/auth/authService'

/** Placeholder home page — groups and items UI are added in subsequent tasks. */
export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">OurShelf</h1>
          <div className="flex items-center gap-3">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Avatar'}
                className="w-8 h-8 rounded-full"
              />
            )}
            <button
              onClick={() => void signOut()}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-600">
          Welcome, {user?.displayName ?? 'there'}! Your shelf is coming soon — groups and items
          arrive in the next tasks.
        </p>
      </main>
    </div>
  )
}
