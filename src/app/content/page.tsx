'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'

type Licitacion = Database['public']['Tables']['licitaciones']['Row']

interface Filters {
  cpv: string
  nuts: string
  minAmount: number
  maxAmount: number
}

export default function ContentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    cpv: '',
    nuts: '',
    minAmount: 0,
    maxAmount: 1000000
  })

  const itemsPerPage = 10

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

  // Filtrar licitaciones
  const filteredLicitaciones = useMemo(() => {
    return licitaciones.filter(licitacion => {
      const matchesCPV = !filters.cpv || licitacion.cpv_code?.includes(filters.cpv)
      const matchesNUTS = !filters.nuts || licitacion.nuts_code?.includes(filters.nuts)
      const amount = licitacion.importe || 0
      const matchesAmount = amount >= filters.minAmount && amount <= filters.maxAmount
      
      return matchesCPV && matchesNUTS && matchesAmount
    })
  }, [licitaciones, filters])

  // Paginación
  const totalPages = Math.ceil(filteredLicitaciones.length / itemsPerPage)
  const paginatedLicitaciones = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredLicitaciones.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredLicitaciones, currentPage])

  // Obtener valores únicos para los filtros
  const uniqueCPVs = useMemo(() => {
    const cpvs = licitaciones
      .map(l => l.cpv_code)
      .filter(Boolean)
      .map(cpv => cpv!.split('-')[0]) // Tomar solo el código principal
    return [...new Set(cpvs)].sort()
  }, [licitaciones])

  const uniqueNUTS = useMemo(() => {
    const nuts = licitaciones
      .map(l => l.nuts_code)
      .filter(Boolean)
    return [...new Set(nuts)].sort()
  }, [licitaciones])

  useEffect(() => {
    if (loading) return
    
    if (!user) {
      router.push('/login')
      return
    }

    loadData()
  }, [user, loading, router, loadData])

  useEffect(() => {
    setCurrentPage(1) // Reset page when filters change
  }, [filters])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  const clearFilters = () => {
    setFilters({
      cpv: '',
      nuts: '',
      minAmount: 0,
      maxAmount: 1000000
    })
  }

  if (loading || dataLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
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
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Licitaciones Públicas Abiertas</h1>
        <p className="text-sm text-muted-foreground">
          Licitaciones activas con fecha límite de presentación posterior a hoy para {user.email}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtro CPV */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Código CPV</label>
                <Select value={filters.cpv || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, cpv: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los CPV" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los CPV</SelectItem>
                    {uniqueCPVs.map(cpv => (
                      <SelectItem key={cpv} value={cpv}>{cpv}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro NUTS */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Código NUTS</label>
                <Select value={filters.nuts || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, nuts: value === 'all' ? '' : value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los NUTS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los NUTS</SelectItem>
                    {uniqueNUTS.map(nuts => (
                      <SelectItem key={nuts} value={nuts!}>{nuts}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Económico */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Rango de Importe</label>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatCurrency(filters.minAmount)}</span>
                    <span>{formatCurrency(filters.maxAmount)}</span>
                  </div>
                  <div className="px-2">
                    <Slider
                      value={[filters.minAmount, filters.maxAmount]}
                      onValueChange={([min, max]) => setFilters(prev => ({ ...prev, minAmount: min, maxAmount: max }))}
                      max={1000000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Botón limpiar filtros */}
              <Button variant="outline" onClick={clearFilters} className="w-full">
                Limpiar Filtros
              </Button>

              {/* Estadísticas */}
              <div className="pt-4 border-t">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">{licitaciones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filtradas:</span>
                    <span className="font-medium">{filteredLicitaciones.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Licitaciones Activas</h2>
              <Badge variant="secondary">{filteredLicitaciones.length} de {licitaciones.length}</Badge>
            </div>
            
            {filteredLicitaciones.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    {licitaciones.length === 0 ? 'No hay licitaciones abiertas actualmente' : 'No se encontraron licitaciones con los filtros aplicados'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Lista de Licitaciones */}
                <div className="space-y-4">
                  {paginatedLicitaciones.map((licitacion) => (
                    <Card key={licitacion.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-medium leading-tight mb-2">
                              {licitacion.project_name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              CPV: {licitacion.cpv_code} | NUTS: {licitacion.nuts_code} | {licitacion.territory_name || 'Sin territorio'}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-primary">
                              {licitacion.importe ? formatCurrency(licitacion.importe) : 'No especificado'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Abierto hasta: {licitacion.fecha_fin_presentacion ? formatDate(licitacion.fecha_fin_presentacion) : 'No especificada'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            {licitacion.contracting_party_name && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Organismo: </span>
                                <span>{licitacion.contracting_party_name}</span>
                              </div>
                            )}
                            {licitacion.cpv_description && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Descripción CPV: </span>
                                <span>{licitacion.cpv_description}</span>
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => licitacion.anuncio_link && window.open(licitacion.anuncio_link, '_blank')}
                            disabled={!licitacion.anuncio_link}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Ver en PLACSP
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 pt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Info de paginación */}
                <div className="text-center text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredLicitaciones.length)} de {filteredLicitaciones.length} licitaciones
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}