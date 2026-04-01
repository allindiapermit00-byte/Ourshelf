import { ItemType, ItemStatus } from '@/lib/types'
import type { CatalogFilter } from './itemsService'

interface CatalogFiltersProps {
  filter: CatalogFilter
  onChange: (next: CatalogFilter) => void
}

const TYPE_OPTIONS: { label: string; value: ItemType | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Books', value: ItemType.Book },
  { label: 'Board games', value: ItemType.BoardGame },
]

const STATUS_OPTIONS: { label: string; value: ItemStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Available', value: ItemStatus.Available },
  { label: 'Lent', value: ItemStatus.Lent },
  { label: 'Requested', value: ItemStatus.Requested },
]

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

export default function CatalogFilters({ filter, onChange }: CatalogFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3" data-testid="catalog-filters">
      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-500 shrink-0">Type:</span>
        {TYPE_OPTIONS.map(({ label, value }) => (
          <FilterChip
            key={label}
            label={label}
            active={filter.type === value}
            onClick={() => onChange({ ...filter, type: value })}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px bg-gray-200 self-stretch" aria-hidden="true" />

      {/* Status filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gray-500 shrink-0">Status:</span>
        {STATUS_OPTIONS.map(({ label, value }) => (
          <FilterChip
            key={label}
            label={label}
            active={filter.status === value}
            onClick={() => onChange({ ...filter, status: value })}
          />
        ))}
      </div>
    </div>
  )
}
