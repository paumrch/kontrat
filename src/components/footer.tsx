import { Linkedin, Instagram, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="w-full px-6 py-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Logo and brand */}
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold text-foreground">
              Kontrat
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              Contratación pública
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Producto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/content" className="text-muted-foreground hover:text-foreground transition-colors">
                  Licitaciones
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Analíticas
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-muted-foreground hover:text-foreground transition-colors">
                  Alertas
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Síguenos</h3>
            <div className="flex space-x-3">
              <Link
                href="https://linkedin.com"
                className="text-black hover:text-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" fill="currentColor" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="text-black hover:text-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" fill="currentColor" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://twitter.com"
                className="text-black hover:text-gray-700 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" fill="currentColor" />
                <span className="sr-only">X (Twitter)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} Kontrat. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}