interface CardProps {
  children: React.ReactNode
  className?: string
  /** Use for clickable cards — adds hover shadow and cursor-pointer */
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  const interactive = onClick !== undefined

  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={interactive ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick() : undefined}
      className={[
        'bg-white rounded-xl border border-gray-100 shadow-sm',
        interactive
          ? 'cursor-pointer hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2'
          : '',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
