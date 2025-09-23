'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Cargando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Bienvenido a tu panel de control, {user.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Perfil de Usuario</CardTitle>
              <CardDescription className="text-sm">
                Información de tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Email:</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium">ID de Usuario:</p>
                <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Cuenta creada:</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Estadísticas</CardTitle>
              <CardDescription className="text-sm">
                Resumen de actividad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Sesiones:</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Última conexión:</span>
                <span className="text-sm font-medium">Ahora</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estado:</span>
                <span className="text-sm font-medium text-green-600">Activo</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Acciones Rápidas</CardTitle>
              <CardDescription className="text-sm">
                Opciones disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button size="sm" className="w-full text-sm">
                Editar Perfil
              </Button>
              <Button variant="outline" size="sm" className="w-full text-sm">
                Configuración
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full text-sm"
                onClick={signOut}
              >
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Información del Sistema</CardTitle>
            <CardDescription className="text-sm">
              Detalles técnicos de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-2">Tecnologías:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Next.js 15 con Turbopack</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS 4</li>
                  <li>• shadcn/ui</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">Backend:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Supabase Auth</li>
                  <li>• PostgreSQL</li>
                  <li>• Real-time subscriptions</li>
                  <li>• Edge Functions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}