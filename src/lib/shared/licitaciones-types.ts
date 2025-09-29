/**
 * Tipos compartidos para el sistema de filtros de licitaciones
 * Compatible con la UI original de /content y la nueva arquitectura SSR
 */

export interface LicitacionesFilters {
  // Búsqueda general por texto (organismo o título)
  q?: string
  busqueda?: string        // Alias compatible con UI de /content
  
  // Filtro por código CPV (exacto o prefijo)
  cpv?: string
  cpvCodes?: string[]  // Array de códigos CPV seleccionados
  cpvSearch?: string   // Búsqueda dentro de descripciones CPV
  
  // Filtro por organismo de contratación
  organismo?: string
  
  // Filtro por provincia usando códigos NUTS
  province?: string
  nuts?: {
    level: 1 | 2 | 3          // Nivel NUTS (normalmente 2 o 3)
    code: string              // Código NUTS (ej: ES523, ES5)
    match?: 'eq' | 'prefix'   // eq=exacto, prefix=jerárquico
  }
  
  // Filtros de fecha
  from?: string               // Fecha desde (YYYY-MM-DD)
  to?: string                 // Fecha hasta (YYYY-MM-DD)
  
  // Incluir licitaciones finalizadas recientemente
  showFinalized?: boolean
  mostrarFinalizadas?: boolean // Alias compatible con UI original
}

export interface OrderBy {
  field: string               // Campo para ordenar
  dir: 'asc' | 'desc'        // Dirección del ordenamiento
}

export interface PaginationResult<T> {
  rows: T[]                   // Filas de la página actual
  hasMore: boolean           // Si hay más páginas disponibles
  total?: number             // Total de registros (opcional)
  page?: number              // Página actual
  pageSize?: number          // Tamaño de página usado
}

/**
 * Configuración de paginación para getLicitacionesPage
 */
export interface PaginationConfig {
  page: number               // Página a cargar (0-indexed)
  pageSize?: number          // Registros por página (100-200)
  filters?: LicitacionesFilters
  orderBy?: OrderBy
}

/**
 * Resultado de una búsqueda paginada de licitaciones  
 * Estructura específica para licitaciones con metadatos adicionales
 */
export interface LicitacionesPage {
  rows: unknown[] // Filas de datos - tipo flexible para diferentes contextos
  hasMore: boolean
  total?: number
  uniqueCPVs?: string[] // CPVs únicos encontrados en esta página
}