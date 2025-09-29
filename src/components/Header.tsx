'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export default function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="border-b border-gray-200 bg-white w-full fixed top-0 z-50">
      <div className="w-full px-4">
        <div className="flex justify-between items-center h-14">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            MRCH
          </Link>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    Inicio
                  </Button>
                </Link>
                <Link href="/licitaciones">
                  <Button variant="ghost" size="sm" className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    Contratos
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2"
                  title={user.email}
                >
                  <User className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                    Acceder
                  </Button>
                </Link>
                                <Link href="/register">
                  <Button size="sm" className="text-sm bg-gray-900 text-white hover:bg-gray-800">
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