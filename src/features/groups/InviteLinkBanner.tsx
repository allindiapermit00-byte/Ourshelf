import { useState } from 'react'

interface InviteLinkBannerProps {
  inviteCode: string
}

export default function InviteLinkBanner({ inviteCode }: InviteLinkBannerProps) {
  const [copied, setCopied] = useState(false)

  const inviteUrl = `${window.location.origin}/join/${inviteCode}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select the text in the input
    }
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3"
      data-testid="invite-link-banner"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-indigo-500 font-medium mb-0.5">Invite link</p>
        <p
          className="text-sm text-indigo-800 font-mono truncate"
          data-testid="invite-url"
          title={inviteUrl}
        >
          {inviteUrl}
        </p>
      </div>
      <button
        onClick={() => void handleCopy()}
        className="shrink-0 rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-1.5 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
        aria-label="Copy invite link"
        data-testid="copy-invite-btn"
      >
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
