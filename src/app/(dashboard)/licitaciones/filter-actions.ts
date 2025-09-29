'use server'

import { getLicitacionesPage } from '@/lib/server/getLicitacionesPage'
import { buildFiltersFromSearchParams } from '@/lib/server/buildLicitacionesQuery'
import { LicitacionesFilters } from '@/lib/shared/licitaciones-types'

/**
 * Server Action para cargar más licitaciones (paginación incremental)
 * Mantiene filtros activos y carga siguientes lotes sin client-side processing
 */
export async function loadMore(
  page: number,
  filters: LicitacionesFilters,
  pageSize: number = 100
) {
  if (page < 0) {
    throw new Error('Page must be >= 0')
  }
  
  try {
    const result = await getLicitacionesPage({
      page,
      pageSize: Math.min(pageSize, 200), // Cap at 200 for performance
      filters,
      orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
    })
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    console.error('Error in loadMore server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server Action para aplicar filtros desde URL params
 * Reconstruye state desde searchParams y retorna primera página
 */
export async function applyFiltersFromUrl(searchParamsString: string) {
  try {
    const urlParams = new URLSearchParams(searchParamsString)
    const filters = buildFiltersFromSearchParams(urlParams)
    const page = parseInt(urlParams.get('page') || '0', 10)
    
    const result = await getLicitacionesPage({
      page,
      pageSize: 100,
      filters,
      orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
    })
    
    return {
      success: true,
      data: result,
      filters,
      page
    }
  } catch (error) {
    console.error('Error in applyFiltersFromUrl server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Server Action para obtener CPVs únicos (usado por filtros)
 * Optimizado para cargar solo códigos CPV sin datos completos
 */
export async function getUniqueCPVs(filters?: LicitacionesFilters) {
  try {
    // Cargar muestra grande para obtener buena variedad de CPVs
    const result = await getLicitacionesPage({
      page: 0,
      pageSize: 200,
      filters: filters || {},
      orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
    })
    
    return {
      success: true,
      cpvs: result.uniqueCPVs
    }
  } catch (error) {
    console.error('Error in getUniqueCPVs server action:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cpvs: []
    }
  }
}