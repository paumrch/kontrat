import { Suspense } from 'react'
import { getLicitacionesPage } from '@/lib/server/getLicitacionesPage'
import { buildFiltersFromSearchParams } from '@/lib/server/buildLicitacionesQuery'
import LicitacionesTable from './_components/LicitacionesTable'
import LicitacionesSkeleton from './_components/LicitacionesSkeleton'
import FilterForm from './_components/FilterForm'

// Forzar re-renderizado SSR en cada request - crítico para que filtros funcionen
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchParams {
  [key: string]: string | string[] | undefined
}

/**
 * Página principal de licitaciones con layout EXACTO de /content
 * SSR + filtros server-side manteniendo la UI original 1:1
 */
export default async function LicitacionesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const urlParams = new URLSearchParams()
  
  // Convertir searchParams a URLSearchParams
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach(v => urlParams.append(key, v))
      } else {
        urlParams.set(key, value)
      }
    }
  })
  
  // Parsear filtros desde URL
  const filters = buildFiltersFromSearchParams(urlParams)
  const page = parseInt(params.page as string || '0', 10)
  
  // DEBUG: Log solo si hay filtros reales (no vacíos)
  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'q' && value && value.trim()) return true
    if (key === 'cpvCodes' && Array.isArray(value) && value.length > 0) return true
    if (key === 'province' && value && value !== 'all') return true
    if (key === 'mostrarFinalizadas' && value) return true
    return false
  })
  
  if (hasActiveFilters) {
    console.log('[PAGE SSR] Re-rendering con filtros:', filters)
  }
  
  return (
    <div className="pt-14">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Licitaciones</h1>
              <Suspense fallback={
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1"></div>
              }>
                <LicitacionesCountDisplay 
                  key={JSON.stringify(filters)}
                  filters={filters} 
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1">
          <div className="max-w-full">
            {/* Filtros arriba de la tabla */}
            <div className="bg-white border-b border-gray-200 p-4">
              <Suspense fallback={
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 animate-pulse"></div>
                  ))}
                </div>
              }>
                <FilterFormContent 
                  key={JSON.stringify(filters)} 
                  filters={filters} 
                />
              </Suspense>
            </div>

            {/* Lista de Licitaciones con Suspense */}
            <div className="bg-white">
              <Suspense fallback={<LicitacionesSkeleton />}>
                <LicitacionesContent 
                  key={`${JSON.stringify(filters)}-${page}`}
                  filters={filters} 
                  page={page} 
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Componente para cargar FilterForm con CPVs únicos
 */
async function FilterFormContent({ filters }: { filters: ReturnType<typeof buildFiltersFromSearchParams> }) {
  // Cargar licitaciones para extraer CPVs únicos
  const data = await getLicitacionesPage({
    page: 0,
    pageSize: 200, // Cargar más para mejor variedad de CPVs
    filters,
    orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
  })
  
  return (
    <FilterForm 
      initialFilters={filters}
      uniqueCPVs={data.uniqueCPVs}
    />
  )
}

/**
 * Contenido de licitaciones que puede streamear
 */
async function LicitacionesContent({ filters, page }: { filters: ReturnType<typeof buildFiltersFromSearchParams>; page: number }) {
  // SSR: Carga inicial con filtros aplicados y paginación REAL
  const data = await getLicitacionesPage({
    page,
    pageSize: 100,
    filters,
    orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
  })

  return (
    <LicitacionesTable 
      initialData={data}
      currentFilters={filters}
      currentOrderBy={{ field: 'fecha_fin_presentacion', dir: 'asc' }}
      currentPage={page}
    />
  )
}

/**
 * Componente para mostrar el contador bajo el H1
 */
async function LicitacionesCountDisplay({ filters }: { filters: ReturnType<typeof buildFiltersFromSearchParams> }) {
  const data = await getLicitacionesPage({
    page: 0,
    pageSize: 1, // Solo necesitamos el total
    filters,
    orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
  })
  
  return (
    <p className="text-gray-600 mt-1 text-sm">
      {data.total || 0} licitaciones encontradas
    </p>
  )
}