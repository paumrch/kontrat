'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { Database } from '@/types/database.types'

type Licitacion = Database['public']['Tables']['licitaciones']['Row']

export default function ContentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) return
    
    setDataLoading(true)
    try {
      const currentDate = new Date().toISOString().split('T')[0]
      
      // Cargar solo licitaciones con fecha límite posterior a hoy
      const { data: licitacionesData, error: licitacionesError } = await supabase
        .from('licitaciones')
        .select('*')
        .gt('fecha_fin_presentacion', currentDate)
        .order('fecha_fin_presentacion', { ascending: true })
      
      if (licitacionesError) {
        console.error('Error cargando licitaciones:', licitacionesError)
      } else {
        setLicitaciones(licitacionesData || [])
      }

    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setDataLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/login')
      return
    }

    loadData()
  }, [user, loading, router, loadData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  if (loading || dataLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Cargando datos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-medium mb-2">Licitaciones Públicas Abiertas</h1>
          <p className="text-sm text-muted-foreground">
            Licitaciones activas con fecha límite de presentación posterior a hoy para {user.email}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Licitaciones Activas</h2>
            <Badge variant="secondary">{licitaciones.length} abiertas</Badge>
          </div>
          
          {licitaciones.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No hay licitaciones abiertas actualmente</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {licitaciones.map((licitacion) => (
                <Card key={licitacion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-medium leading-tight">
                      {licitacion.project_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      CPV: {licitacion.cpv_code} | NUTS: {licitacion.nuts_code} | {licitacion.territory_name || 'Sin territorio'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Importe:</span>
                        <span className="text-base font-semibold text-primary">
                          {licitacion.importe ? formatCurrency(licitacion.importe) : 'No especificado'}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Abierto hasta:</span>
                          <span className="font-medium">{licitacion.fecha_fin_presentacion ? formatDate(licitacion.fecha_fin_presentacion) : 'No especificada'}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full" 
                          onClick={() => licitacion.anuncio_link && window.open(licitacion.anuncio_link, '_blank')}
                          disabled={!licitacion.anuncio_link}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Ver en PLACSP
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}