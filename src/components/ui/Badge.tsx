import { ItemStatus, ItemType, RequestStatus, LoanReturnState } from '@/lib/types'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-600',
}

export default function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}`}
    >
      {label}
    </span>
  )
}

// ── Semantic badge helpers ────────────────────────────────────────────────────

const itemStatusVariant: Record<ItemStatus, BadgeVariant> = {
  [ItemStatus.Available]: 'success',
  [ItemStatus.Requested]: 'warning',
  [ItemStatus.Lent]: 'info',
  [ItemStatus.Archived]: 'neutral',
}

const itemStatusLabel: Record<ItemStatus, string> = {
  [ItemStatus.Available]: 'Available',
  [ItemStatus.Requested]: 'Requested',
  [ItemStatus.Lent]: 'Lent out',
  [ItemStatus.Archived]: 'Archived',
}

const itemTypeLabel: Record<ItemType, string> = {
  [ItemType.Book]: 'Book',
  [ItemType.BoardGame]: 'Board game',
}

const requestStatusVariant: Record<RequestStatus, BadgeVariant> = {
  [RequestStatus.Pending]: 'warning',
  [RequestStatus.Approved]: 'success',
  [RequestStatus.Declined]: 'danger',
  [RequestStatus.Cancelled]: 'neutral',
}

const requestStatusLabel: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: 'Pending',
  [RequestStatus.Approved]: 'Approved',
  [RequestStatus.Declined]: 'Declined',
  [RequestStatus.Cancelled]: 'Cancelled',
}

const loanStateVariant: Record<LoanReturnState, BadgeVariant> = {
  [LoanReturnState.Lent]: 'info',
  [LoanReturnState.ReturnPending]: 'warning',
  [LoanReturnState.Returned]: 'success',
}

const loanStateLabel: Record<LoanReturnState, string> = {
  [LoanReturnState.Lent]: 'Lent out',
  [LoanReturnState.ReturnPending]: 'Return pending',
  [LoanReturnState.Returned]: 'Returned',
}

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  return <Badge label={itemStatusLabel[status]} variant={itemStatusVariant[status]} />
}

export function ItemTypeBadge({ type }: { type: ItemType }) {
  return <Badge label={itemTypeLabel[type]} variant="default" />
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return <Badge label={requestStatusLabel[status]} variant={requestStatusVariant[status]} />
}

export function LoanStateBadge({ state }: { state: LoanReturnState }) {
  return <Badge label={loanStateLabel[state]} variant={loanStateVariant[state]} />
}
