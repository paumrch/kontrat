'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { ExternalLink, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Database } from '@/types/database.types'
import { formatCPVDisplay } from '@/utils/cpv'
import { useCPVDescriptions } from '@/hooks/useCPVDescriptions'

type Licitacion = Database['public']['Tables']['licitaciones']['Row']

interface Filters {
  cpvCodes: string[]
  cpvSearch: string
  province: string
  minAmount: number
  maxAmount: number
}

// Mapeo de provincias españolas
const PROVINCES = [
  { code: 'ES111', name: 'La Coruña' },
  { code: 'ES112', name: 'Lugo' },
  { code: 'ES113', name: 'Orense' },
  { code: 'ES114', name: 'Pontevedra' },
  { code: 'ES120', name: 'Principado de Asturias' },
  { code: 'ES130', name: 'Cantabria' },
  { code: 'ES211', name: 'Álava' },
  { code: 'ES212', name: 'Guipúzcoa' },
  { code: 'ES213', name: 'Vizcaya' },
  { code: 'ES220', name: 'Comunidad Foral de Navarra' },
  { code: 'ES230', name: 'La Rioja' },
  { code: 'ES241', name: 'Huesca' },
  { code: 'ES242', name: 'Teruel' },
  { code: 'ES243', name: 'Zaragoza' },
  { code: 'ES300', name: 'Comunidad de Madrid' },
  { code: 'ES411', name: 'Ávila' },
  { code: 'ES412', name: 'Burgos' },
  { code: 'ES413', name: 'León' },
  { code: 'ES414', name: 'Palencia' },
  { code: 'ES415', name: 'Salamanca' },
  { code: 'ES416', name: 'Segovia' },
  { code: 'ES417', name: 'Soria' },
  { code: 'ES418', name: 'Valladolid' },
  { code: 'ES419', name: 'Zamora' },
  { code: 'ES421', name: 'Albacete' },
  { code: 'ES422', name: 'Ciudad Real' },
  { code: 'ES423', name: 'Cuenca' },
  { code: 'ES424', name: 'Guadalajara' },
  { code: 'ES425', name: 'Toledo' },
  { code: 'ES431', name: 'Badajoz' },
  { code: 'ES432', name: 'Cáceres' },
  { code: 'ES511', name: 'Barcelona' },
  { code: 'ES512', name: 'Gerona' },
  { code: 'ES513', name: 'Lérida' },
  { code: 'ES514', name: 'Tarragona' },
  { code: 'ES521', name: 'Alicante' },
  { code: 'ES522', name: 'Castellón' },
  { code: 'ES523', name: 'Valencia' },
  { code: 'ES531', name: 'Ibiza y Formentera' },
  { code: 'ES532', name: 'Mallorca' },
  { code: 'ES533', name: 'Menorca' },
  { code: 'ES611', name: 'Almería' },
  { code: 'ES612', name: 'Cádiz' },
  { code: 'ES613', name: 'Córdoba' },
  { code: 'ES614', name: 'Granada' },
  { code: 'ES615', name: 'Huelva' },
  { code: 'ES616', name: 'Jaén' },
  { code: 'ES617', name: 'Málaga' },
  { code: 'ES618', name: 'Sevilla' },
  { code: 'ES620', name: 'Región de Murcia' },
  { code: 'ES630', name: 'Ceuta' },
  { code: 'ES640', name: 'Melilla' },
  { code: 'ES703', name: 'El Hierro' },
  { code: 'ES704', name: 'Fuerteventura' },
  { code: 'ES705', name: 'Gran Canaria' },
  { code: 'ES706', name: 'La Gomera' },
  { code: 'ES707', name: 'La Palma' },
  { code: 'ES708', name: 'Lanzarote' },
  { code: 'ES709', name: 'Tenerife' }
].sort((a, b) => a.name.localeCompare(b.name))

export default function ContentPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [licitaciones, setLicitaciones] = useState<Licitacion[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    cpvCodes: [],
    cpvSearch: '',
    province: '',
    minAmount: 0,
    maxAmount: 1000000
  })

  const itemsPerPage = 10

  // Extraer códigos CPV únicos de las licitaciones
  const cpvCodes = useMemo(() => {
    return licitaciones
      .map(licitacion => licitacion.cpv_code)
      .filter((code): code is string => Boolean(code && code.trim()))
  }, [licitaciones])

  // Cargar descripciones CPV
  const { cpvDescriptions } = useCPVDescriptions(cpvCodes)

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
      const matchesCPV = filters.cpvCodes.length === 0 || 
        (licitacion.cpv_code && filters.cpvCodes.some(code => licitacion.cpv_code?.startsWith(code)))
      const matchesProvince = !filters.province || licitacion.nuts_code?.includes(filters.province)
      const amount = licitacion.importe || 0
      const matchesAmount = amount >= filters.minAmount && amount <= filters.maxAmount
      
      return matchesCPV && matchesProvince && matchesAmount
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
      cpvCodes: [],
      cpvSearch: '',
      province: '',
      minAmount: 0,
      maxAmount: 1000000
    })
  }

  if (loading || dataLoading) {
    return (
      <div className="pt-14">
        <div className="flex h-screen bg-gray-50">
          <div className="w-80 bg-white border-r border-gray-200"></div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Cargando contratos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="pt-14">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">          
          <div className="flex-1 p-6 space-y-6">
            {/* Filtro CPV con búsqueda */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-900">Categorías CPV</label>
                {filters.cpvCodes.length > 0 && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, cpvCodes: [] }))}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Limpiar ({filters.cpvCodes.length})
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Buscar por nombre de categoría..."
                  value={filters.cpvSearch}
                  onChange={(e) => setFilters(prev => ({ ...prev, cpvSearch: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
                {uniqueCPVs
                  .filter(cpv => {
                    if (!filters.cpvSearch) return true;
                    const cpvInfo = cpvDescriptions.get(cpv);
                    const description = cpvInfo?.description || formatCPVDisplay(cpv).description;
                    return description.toLowerCase().includes(filters.cpvSearch.toLowerCase()) ||
                           cpv.includes(filters.cpvSearch);
                  })
                  .map(cpv => {
                    const cpvInfo = cpvDescriptions.get(cpv) || formatCPVDisplay(cpv);
                    return (
                      <label key={cpv} className="flex items-start space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.cpvCodes.includes(cpv)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, cpvCodes: [...prev.cpvCodes, cpv] }));
                            } else {
                              setFilters(prev => ({ ...prev, cpvCodes: prev.cpvCodes.filter(c => c !== cpv) }));
                            }
                          }}
                          className="mt-0.5 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-gray-900 font-medium leading-tight">
                            {cpvInfo.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {cpv}
                          </div>
                        </div>
                      </label>
                    );
                  })
                }
              </div>
            </div>

            {/* Filtro Provincia */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-900">Provincia</label>
              <Select value={filters.province || 'all'} onValueChange={(value) => setFilters(prev => ({ ...prev, province: value === 'all' ? '' : value }))}>
                <SelectTrigger className="bg-white border-gray-200 text-gray-900">
                  <SelectValue placeholder="Todas las provincias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las provincias</SelectItem>
                  {PROVINCES.map(province => (
                    <SelectItem key={province.code} value={province.code}>{province.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro Económico */}
            <div className="space-y-4">
              <label className="text-xs font-medium text-gray-900">Importe</label>
              <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-600">
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
            <Button 
              variant="outline" 
              onClick={clearFilters} 
              className="w-full border-gray-200 text-gray-900 hover:bg-gray-50 text-xs"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Contratos</h1>
                <p className="text-gray-600 mt-1">
                  {filteredLicitaciones.length} licitaciones en período de presentación de ofertas
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Licitaciones */}
          <div className="flex-1 overflow-auto">
            {filteredLicitaciones.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron contratos</h3>
                  <p className="text-gray-500">
                    {licitaciones.length === 0 ? 'No hay contratos abiertos actualmente' : 'Prueba ajustando los filtros'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {paginatedLicitaciones.map((licitacion, index) => (
                  <div 
                    key={licitacion.id} 
                    className={`px-6 py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      index === paginatedLicitaciones.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {/* Provincia y descripción CPV - arriba del título */}
                        <div className="mb-2 text-xs text-gray-600">
                          <span className="flex items-center">
                            {licitacion.territory_name && (
                              <>
                                <span>{licitacion.territory_name}</span>
                                {licitacion.cpv_code && <span className="mx-2">|</span>}
                              </>
                            )}
                            {licitacion.cpv_code && (
                              <span>
                                {cpvDescriptions.get(licitacion.cpv_code)?.description || 
                                 formatCPVDisplay(licitacion.cpv_code).description}
                              </span>
                            )}
                          </span>
                        </div>

                        {/* Título de la licitación */}
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-sm font-medium text-gray-900 leading-tight pr-4">
                            {licitacion.project_name}
                          </h3>
                          <div className="text-right flex-shrink-0">
                            <div className="text-base font-semibold text-gray-900">
                              {licitacion.importe ? formatCurrency(licitacion.importe) : 'No especificado'}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Abierto hasta: {licitacion.fecha_fin_presentacion ? formatDate(licitacion.fecha_fin_presentacion) : 'No especificada'}
                            </div>
                          </div>
                        </div>

                        {/* Organismo - justo debajo del título */}
                        {licitacion.contracting_party_name && (
                          <div className="mb-4 text-xs text-gray-500">
                            {licitacion.contracting_party_name}
                          </div>
                        )}

                        {/* Información técnica secundaria y botón */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {licitacion.nuts_code && (
                              <span>NUTS: {licitacion.nuts_code}</span>
                            )}
                            {licitacion.cpv_code && (
                              <span>CPV: {licitacion.cpv_code}</span>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => licitacion.anuncio_link && window.open(licitacion.anuncio_link, '_blank')}
                              disabled={!licitacion.anuncio_link}
                              className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs px-3 py-1.5"
                            >
                              <ExternalLink className="w-3 h-3 mr-1.5" />
                              Ver en PLACSP
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="bg-white border-t border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredLicitaciones.length)} de {filteredLicitaciones.length} contratos
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let page;
                      if (totalPages <= 7) {
                        page = i + 1;
                      } else if (currentPage <= 4) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 3) {
                        page = totalPages - 6 + i;
                      } else {
                        page = currentPage - 3 + i;
                      }
                      
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 p-0 ${
                            page === currentPage 
                              ? 'bg-gray-900 text-white hover:bg-gray-800' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}