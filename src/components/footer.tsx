import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white">
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            MRCH
          </Link>
          <p className="text-xs text-gray-500">
          © {currentYear}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}