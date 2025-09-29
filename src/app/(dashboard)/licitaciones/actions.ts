'use server'

import { getLicitacionesPage } from '@/lib/server/getLicitacionesPage'
import type { LicitacionesFilters, OrderBy } from '@/lib/shared/licitaciones-types'

/**
 * Server Action para cargar más licitaciones (paginación incremental)
 * Usado por botón "Load More" o navegación por páginas
 */
export async function loadMore(args: {
  page: number
  pageSize?: number
  filters?: LicitacionesFilters
  orderBy?: OrderBy
}) {
  try {
    const result = await getLicitacionesPage(args)
    return result
  } catch (error) {
    console.error('Error en loadMore:', error)
    return { rows: [], hasMore: false, uniqueCPVs: [] }
  }
}

/**
 * Server Action para aplicar filtros (recarga desde página 0)
 */
export async function applyFilters(filters: LicitacionesFilters, orderBy?: OrderBy) {
  try {
    const result = await getLicitacionesPage({
      page: 0,
      pageSize: 100,
      filters,
      orderBy
    })
    return result
  } catch (error) {
    console.error('Error en applyFilters:', error)
    return { rows: [], hasMore: false, uniqueCPVs: [] }
  }
}