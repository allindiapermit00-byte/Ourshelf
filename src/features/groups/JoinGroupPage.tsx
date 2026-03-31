import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/components/ui'
import { joinGroupByCode } from './groupService'

export default function JoinGroupPage() {
  const { code: urlCode } = useParams<{ code?: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [code, setCode] = useState(urlCode?.toUpperCase() ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Auto-submit when the code is pre-filled from the URL
  useEffect(() => {
    if (urlCode && user) {
      void handleJoin(urlCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleJoin(rawCode: string) {
    if (!user) return
    setError(null)
    setLoading(true)
    try {
      const { group } = await joinGroupByCode(user.uid, rawCode)
      void navigate(`/groups/${group.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    void handleJoin(code)
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Join a group</h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter the 6-character code shared by a group admin.
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-5">
          <label
            htmlFor="invite-code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Invite code
          </label>
          <input
            id="invite-code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. ABC123"
            maxLength={6}
            className={`w-full rounded-lg border px-3 py-2 text-sm uppercase tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              error ? 'border-red-400' : 'border-gray-300'
            }`}
            aria-describedby={error ? 'code-error' : undefined}
          />
          {error && (
            <p
              id="code-error"
              role="alert"
              className="mt-1 text-xs text-red-600"
              data-testid="join-error"
            >
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={code.trim().length < 6}
          className="w-full"
        >
          Join group
        </Button>
      </form>
    </div>
  )
}
