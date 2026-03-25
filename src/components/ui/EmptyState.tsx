interface EmptyStateProps {
  icon?: React.ReactNode
  heading: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ icon, heading, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      data-testid="empty-state"
    >
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-900 mb-1">{heading}</h3>
      {description && <p className="text-sm text-gray-500 max-w-xs mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}
