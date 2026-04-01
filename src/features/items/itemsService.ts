import { listItemsForGroup as repoList } from '@/lib/repositories'
import type { Item, ItemStatus, ItemType } from '@/lib/types'
import { ItemStatus as IS } from '@/lib/types'

export interface CatalogFilter {
  type?: ItemType
  status?: ItemStatus
}

/**
 * Return all non-archived items for a group, filtered client-side by type/status.
 * Archived items are always excluded.
 */
export async function listItemsForGroup(
  groupId: string,
  filter: CatalogFilter = {},
): Promise<Item[]> {
  // Fetch without server-side type/status filters to keep index requirements minimal;
  // filter client-side so we can also always exclude archived.
  const all = await repoList(groupId)
  return all.filter((item) => {
    if (item.status === IS.Archived) return false
    if (filter.type !== undefined && item.type !== filter.type) return false
    if (filter.status !== undefined && item.status !== filter.status) return false
    return true
  })
}
