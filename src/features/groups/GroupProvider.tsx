import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { getMembershipsForUser } from '@/lib/repositories'
import { getGroup } from '@/lib/repositories'
import type { Group, Membership } from '@/lib/types'

const STORAGE_KEY = 'ourshelf:activeGroupId'

interface GroupContextValue {
  /** All groups the current user belongs to. */
  groups: Group[]
  /** All active memberships for the current user. */
  memberships: Membership[]
  /** The currently-selected group, or null when not loaded yet / no groups. */
  activeGroup: Group | null
  /** Membership for the active group. */
  activeMembership: Membership | null
  /** Switch to a different group and persist the choice. */
  setActiveGroupId: (id: string) => void
  /** True while memberships and groups are being fetched. */
  loading: boolean
}

const GroupContext = createContext<GroupContextValue | null>(null)

// eslint-disable-next-line react-refresh/only-export-components
export function useGroupContext(): GroupContextValue {
  const ctx = useContext(GroupContext)
  if (!ctx) throw new Error('useGroupContext must be used inside <GroupProvider>')
  return ctx
}

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const userId = user?.uid ?? null

  const [groups, setGroups] = useState<Group[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [activeGroupId, setActiveGroupIdState] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEY),
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setGroups([])
      setMemberships([])
      setLoading(false)
      return
    }

    setLoading(true)
    getMembershipsForUser(userId)
      .then(async (ms) => {
        setMemberships(ms)
        const fetched = await Promise.all(ms.map((m) => getGroup(m.groupId)))
        const validGroups = fetched.filter((g): g is Group => g !== null)
        setGroups(validGroups)
        // If persisted activeGroupId is no longer valid, reset to first group
        setActiveGroupIdState((prev) => {
          if (prev && validGroups.some((g) => g.id === prev)) return prev
          return validGroups[0]?.id ?? null
        })
      })
      .catch(() => {
        // On error leave groups empty; loading still ends so UI can show error states
      })
      .finally(() => setLoading(false))
  }, [userId])

  const setActiveGroupId = useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id)
    setActiveGroupIdState(id)
  }, [])

  const activeGroup = groups.find((g) => g.id === activeGroupId) ?? groups[0] ?? null
  const activeMembership =
    memberships.find((m) => m.groupId === activeGroup?.id) ?? null

  // Persist resolved activeGroupId to localStorage (handles first-load and reset)
  useEffect(() => {
    if (activeGroup) {
      localStorage.setItem(STORAGE_KEY, activeGroup.id)
    } else if (!loading) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [activeGroup, loading])

  return (
    <GroupContext.Provider
      value={{ groups, memberships, activeGroup, activeMembership, setActiveGroupId, loading }}
    >
      {children}
    </GroupContext.Provider>
  )
}
