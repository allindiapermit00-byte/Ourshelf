import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/useAuth'
import { Button } from '@/components/ui'
import { createGroup } from './groupService'

export default function CreateGroupPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const nameError =
    name.length > 0 && (name.trim().length < 3 || name.trim().length > 50)
      ? 'Name must be 3–50 characters.'
      : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user || nameError) return
    setError(null)
    setLoading(true)
    try {
      const { group } = await createGroup(user.uid, name)
      void navigate(`/groups/${group.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Create a group</h1>
      <p className="text-sm text-gray-500 mb-6">
        Start a private shelf to share books and board games with friends.
      </p>

      <form onSubmit={(e) => void handleSubmit(e)} noValidate>
        <div className="mb-5">
          <label
            htmlFor="group-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Group name
          </label>
          <input
            id="group-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Book Club, Game Nights"
            maxLength={50}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              nameError ? 'border-red-400' : 'border-gray-300'
            }`}
            aria-describedby={nameError ? 'name-error' : undefined}
          />
          {nameError && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {nameError}
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!name.trim() || !!nameError}
          className="w-full"
        >
          Create group
        </Button>
      </form>
    </div>
  )
}
