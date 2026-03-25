interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }

export default function Spinner({ size = 'md', label = 'Loading…' }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center" data-testid="spinner">
      <span
        className={`${sizeClasses[size]} border-2 border-indigo-600 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
    </div>
  )
}
