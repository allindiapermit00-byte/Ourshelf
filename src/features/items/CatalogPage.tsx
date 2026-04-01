import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUser } from '@/lib/repositories'
import type { Item } from '@/lib/types'
import { Spinner, EmptyState, ErrorState } from '@/components/ui'
import ItemCard from './ItemCard'
import CatalogFilters from './CatalogFilters'
import { listItemsForGroup, type CatalogFilter } from './itemsService'
import { ItemType, ItemStatus } from '@/lib/types'

function emptyMessage(filter: CatalogFilter): string {
  const typeLabel =
    filter.type === ItemType.Book
      ? 'books'
      : filter.type === ItemType.BoardGame
        ? 'board games'
        : 'items'
  const statusLabel =
    filter.status === ItemStatus.Available
      ? 'available '
      : filter.status === ItemStatus.Lent
        ? 'lent '
        : filter.status === ItemStatus.Requested
          ? 'requested '
          : ''
  return `No ${statusLabel}${typeLabel} yet`
}

export default function CatalogPage() {
  const { groupId } = useParams<{ groupId: string }>()

  const [items, setItems] = useState<Item[]>([])
  const [ownerNames, setOwnerNames] = useState<Record<string, string>>({})
  const [filter, setFilter] = useState<CatalogFilter>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    if (!groupId) return
    setLoading(true)
    setError(null)
    listItemsForGroup(groupId, filter)
      .then(async (fetched) => {
        setItems(fetched)
        // Batch-fetch unique owner profiles
        const uniqueOwnerIds = [...new Set(fetched.map((i) => i.ownerUserId))]
        const profiles = await Promise.all(uniqueOwnerIds.map((id) => getUser(id)))
        const map: Record<string, string> = {}
        profiles.forEach((p, idx) => {
          map[uniqueOwnerIds[idx]] = p?.displayName ?? 'Unknown'
        })
        setOwnerNames(map)
      })
      .catch(() => setError('Could not load items. Please try again.'))
      .finally(() => setLoading(false))
  }, [groupId, filter])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Catalog</h1>
        <Link
          to={`/groups/${groupId ?? ''}/items/new`}
          className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          data-testid="add-item-btn"
        >
          Add item
        </Link>
      </div>

      {/* Filters — always visible */}
      <CatalogFilters filter={filter} onChange={setFilter} />

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16" data-testid="catalog-loading">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState
          heading={emptyMessage(filter)}
          description={
            !filter.type && !filter.status
              ? 'Add the first item to start sharing with your group.'
              : 'Try a different filter to see more items.'
          }
        />
      ) : (
        <div className="grid gap-3" data-testid="catalog-list">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              ownerName={ownerNames[item.ownerUserId] ?? '…'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
