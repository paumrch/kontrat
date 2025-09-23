'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-lg font-medium text-foreground">
            Kontrat
          </Link>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/content">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Contenido
                  </Button>
                </Link>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="text-sm"
                >
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Acceder
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="text-sm">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}