import { useRef, useState } from 'react'
import { useGroup } from './useGroup'

export default function GroupSwitcher() {
  const { groups, activeGroup, setActiveGroupId, loading } = useGroup()
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  if (loading || groups.length === 0) return null

  function select(id: string) {
    setActiveGroupId(id)
    setOpen(false)
    buttonRef.current?.focus()
  }

  return (
    <div className="relative" data-testid="group-switcher">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch group"
        className="flex items-center gap-1.5 max-w-[160px] rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
      >
        <span className="truncate">{activeGroup?.name ?? 'Select group'}</span>
        <svg
          className={`w-3.5 h-3.5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <ul
            role="listbox"
            aria-label="Your groups"
            className="absolute left-0 top-full mt-1 z-50 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1 text-sm"
          >
            {groups.map((g) => (
              <li key={g.id} role="option" aria-selected={g.id === activeGroup?.id}>
                <button
                  onClick={() => select(g.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:bg-indigo-50 truncate ${
                    g.id === activeGroup?.id
                      ? 'text-indigo-600 font-medium'
                      : 'text-gray-700'
                  }`}
                  data-testid={`switcher-option-${g.id}`}
                >
                  {g.name}
                  {g.id === activeGroup?.id && (
                    <span className="ml-1 text-indigo-400">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
