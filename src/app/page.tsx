'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/content')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-sm text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-sm text-gray-600">Redirigiendo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-gray-900 tracking-tight mb-6">
              Kontrat
            </h1>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Sistema de gestión y consulta de licitaciones públicas españolas
            </p>
            
            <div className="space-y-4">
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => router.push('/register')}
                  className="px-6 py-3 bg-white text-gray-900 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Licitaciones Actuales</h3>
                <p className="text-sm text-gray-600">Consulta todas las licitaciones públicas activas</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Filtros Avanzados</h3>
                <p className="text-sm text-gray-600">Filtra por categoría, provincia y presupuesto</p>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Información Detallada</h3>
                <p className="text-sm text-gray-600">Accede a toda la información de cada licitación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
