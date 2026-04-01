import { ItemStatusBadge, ItemTypeBadge } from '@/components/ui'
import type { Item } from '@/lib/types'

interface ItemCardProps {
  item: Item
  /** Resolved display name of the item owner (fetched by parent). */
  ownerName: string
}

export default function ItemCard({ item, ownerName }: ItemCardProps) {
  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
      data-testid={`item-card-${item.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
          {item.author && (
            <p className="text-xs text-gray-500 truncate">{item.author}</p>
          )}
        </div>
        <ItemStatusBadge status={item.status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <ItemTypeBadge type={item.type} />
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-500 truncate">
          Owned by <span className="font-medium text-gray-700">{ownerName}</span>
        </span>
      </div>

      {item.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
      )}
    </div>
  )
}
