// Exportaciones de componentes activos para la nueva implementación SSR
// Solo incluye componentes que realmente se están usando

export { default as FilterForm } from './FilterForm'
export { default as LicitacionesTable } from './LicitacionesTable'  
export { default as LicitacionesLayout } from './LicitacionesLayout'
export { default as FilterSidebar } from './FilterSidebar'
export { default as LicitacionesSkeleton } from './LicitacionesSkeleton'

// Re-export de tipos para conveniencia
export type { Database } from '@/types/database.types'

/**
 * Interfaz de filtros idéntica a /content
 * Mantiene compatibilidad total con la UI existente
 */
export interface Filters {
  cpvCodes: string[]
  cpvSearch: string
  province: string
  busqueda: string
  mostrarFinalizadas: boolean
}