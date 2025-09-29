import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-white">
      <div className="w-full px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image 
              src="/MRCH_logo.svg" 
              alt="MRCH" 
              width={80} 
              height={28}
              className="h-7 w-auto"
            />
          </Link>
          <p className="text-xs text-gray-500">
          © {currentYear}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}