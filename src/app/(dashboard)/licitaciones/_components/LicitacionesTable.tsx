'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, Loader2 } from 'lucide-react'
import { loadMore } from '../actions'
import { formatNutsDisplay } from '@/utils/nuts'
import type { LicitacionesFilters, OrderBy } from '@/lib/shared/licitaciones-types'

// Tipo para las licitaciones (optimizado con CPV description)
type LicitacionMinimal = {
  id: string
  contracting_party_name: string | null
  project_name: string
  cpv_code: string | null
  cpv_description?: string  // Pre-computed CPV description from server
  nuts_code: string | null
  fecha_fin_presentacion: string | null
  importe: number | null
  anuncio_link: string | null
}

interface LicitacionesTableProps {
  initialData: {
    rows: LicitacionMinimal[]
    hasMore: boolean
    total?: number
    uniqueCPVs: string[]
  }
  currentFilters: LicitacionesFilters
  currentOrderBy: OrderBy
  currentPage: number
}

/**
 * Tabla de licitaciones con paginación incremental
 * Mantiene la UI exacta pero con carga por lotes
 */
export default function LicitacionesTable({ 
  initialData, 
  currentFilters, 
  currentOrderBy, 
  currentPage 
}: LicitacionesTableProps) {
  const [data, setData] = useState(initialData)
  const [page, setPage] = useState(currentPage)
  const [isPending, startTransition] = useTransition()
  
  // CRITICAL FIX: Sincronizar estado local cuando llegan nuevos initialData del servidor
  useEffect(() => {
    setData(initialData)
    setPage(currentPage)
  }, [initialData, currentPage])
  
  const handleLoadMore = () => {
    startTransition(async () => {
      try {
        const nextPage = page + 1
        const result = await loadMore({
          page: nextPage,
          pageSize: 100,
          filters: currentFilters,
          orderBy: currentOrderBy
        })
        
        // Agregar nuevas filas a las existentes
        setData(prevData => ({
          ...result,
          rows: [...prevData.rows, ...result.rows]
        }))
        setPage(nextPage)
      } catch (error) {
        console.error('Error loading more:', error)
      }
    })
  }
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sin fecha'
    try {
      return new Date(dateStr).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch {
      return 'Fecha inválida'
    }
  }
  
  const formatAmount = (amount: number | null) => {
    if (amount === null || amount === 0) return 'No especificado'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }
  
  if (data.rows.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 text-lg">
          No se encontraron licitaciones
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Prueba ajustando los filtros de búsqueda
        </p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {/* Tabla responsive */}
      <div className="overflow-hidden">
        {/* Header de tabla */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-full mx-auto px-4">
            <div className="grid grid-cols-11 gap-4 py-4 text-sm font-medium text-gray-700">
              <div className="col-span-6">Objeto / Organismo</div>
              <div className="col-span-2">CPV / Territorio</div>
              <div className="col-span-2">Fecha / Importe</div>
              <div className="col-span-1">Enlace</div>
            </div>
          </div>
        </div>
        
        {/* Filas de datos */}
        <div className="divide-y divide-gray-100">
          {data.rows.map((licitacion, index) => (
            <div key={licitacion.id} className={`hover:bg-blue-50 transition-colors ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
            }`}>
              <div className="max-w-full mx-auto px-4">
                <div className="grid grid-cols-11 gap-4 py-4">
              {/* Objeto / Organismo */}
              <div className="col-span-6 space-y-1">
                <div className="font-medium text-gray-900 text-sm leading-tight">
                  {licitacion.project_name}
                </div>
                <div className="text-xs text-gray-600">
                  {licitacion.contracting_party_name || 'Organismo no especificado'}
                </div>
              </div>
              
              {/* CPV / Territorio */}
              <div className="col-span-2 space-y-1">
                {licitacion.cpv_code && (
                  <div className="text-xs font-mono text-gray-600">
                    {licitacion.cpv_code}
                  </div>
                )}
                {licitacion.cpv_description && (
                  <div className="text-xs text-gray-500 line-clamp-2">
                    {licitacion.cpv_description}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {(() => {
                    const nutsDisplay = formatNutsDisplay(licitacion.nuts_code)
                    return (
                      <>
                        <div className="font-mono text-gray-600">{nutsDisplay.code}</div>
                        <div className="text-gray-500">{nutsDisplay.description}</div>
                      </>
                    )
                  })()}
                </div>
              </div>
              
              {/* Fecha / Importe */}
              <div className="col-span-2 space-y-1">
                <div className="text-xs text-gray-600">
                  {formatDate(licitacion.fecha_fin_presentacion)}
                </div>
                <div className="text-xs font-medium text-gray-900">
                  {formatAmount(licitacion.importe)}
                </div>
              </div>
              
              {/* Enlace */}
              <div className="col-span-1 flex items-center">
                {licitacion.anuncio_link ? (
                  <a
                    href={licitacion.anuncio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                    title="Ver licitación"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">-</span>
                )}
              </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Load More Button */}
      {data.hasMore && (
        <div className="flex justify-center pt-4 pb-8">
          <Button
            onClick={handleLoadMore}
            disabled={isPending}
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              'Cargar más'
            )}
          </Button>
        </div>
      )}
      
      {/* Indicador si no hay más */}
      {!data.hasMore && data.rows.length > 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          No hay más licitaciones para mostrar
        </div>
      )}
    </div>
  )
}