import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <p className="text-5xl font-bold text-indigo-600 mb-4">404</p>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-8">
        The page you&apos;re looking for doesn&apos;t exist yet.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-5 py-2 hover:bg-indigo-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
