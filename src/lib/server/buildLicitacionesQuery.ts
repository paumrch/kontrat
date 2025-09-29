/**
 * Helpers para construir queries de Supabase con filtros de licitaciones
 * Preserva la lógica exacta de /content pero optimizada para server-side
 */

import { LicitacionesFilters, OrderBy } from '@/lib/shared/licitaciones-types'

/**
 * Reconstruye filtros desde URLSearchParams manteniendo nombres exactos de /content
 */
export function buildFiltersFromSearchParams(searchParams: URLSearchParams): LicitacionesFilters {
  const filters: LicitacionesFilters = {}
  
  // Búsqueda general (organismo o título)
  const busqueda = searchParams.get('busqueda')
  if (busqueda) filters.q = busqueda
  
  // CPV - mantener compatibilidad con formato original
  const cpv = searchParams.get('cpv')
  if (cpv) filters.cpv = cpv
  
  const cpvCodes = searchParams.get('cpvCodes')
  if (cpvCodes) {
    try {
      filters.cpvCodes = JSON.parse(cpvCodes)
    } catch {
      // Si no es JSON válido, tratarlo como string único
      filters.cpvCodes = [cpvCodes]
    }
  }
  
  const cpvSearch = searchParams.get('cpvSearch')
  if (cpvSearch) filters.cpvSearch = cpvSearch
  
  // Provincia - mantener nombre exacto 'province' de /content
  const province = searchParams.get('province')
  if (province && province !== 'all') {
    filters.province = province
    
    // Determinar nivel NUTS y estrategia de matching
    const nutsLevel = province.length === 5 ? 3 : province.length === 4 ? 2 : 1
    filters.nuts = {
      level: nutsLevel as 1 | 2 | 3,
      code: province,
      match: nutsLevel === 3 ? 'eq' : 'prefix'
    }
  }
  
  // Organismo de contratación
  const organismo = searchParams.get('organismo')
  if (organismo) filters.organismo = organismo
  
  // Fechas
  const from = searchParams.get('from')
  if (from) filters.from = from
  
  const to = searchParams.get('to')
  if (to) filters.to = to
  
  // Finalizadas - mantener nombre exacto de /content
  const mostrarFinalizadas = searchParams.get('mostrarFinalizadas')
  if (mostrarFinalizadas === 'true') {
    filters.mostrarFinalizadas = true
    filters.showFinalized = true // Alias para nueva lógica
  }
  
  return filters
}

/**
 * Aplica filtros a una query de Supabase manteniendo lógica exacta de /content
 */
export function applyFiltersToSupabase(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any, // Query de Supabase - API compleja sin tipos exportados
  filters: LicitacionesFilters,
  orderBy?: OrderBy
) {
  // 1. Filtro de búsqueda general expandida (título, organismo, CPV, territorio)
  const searchTerm = filters.q || filters.busqueda
  if (searchTerm) {
    // Búsqueda en múltiples campos:
    // - Título del proyecto
    // - Organismo contratante
    // - Código CPV
    // - Descripción CPV almacenada en BD
    // - Código NUTS
    // - Nombre del territorio
    query = query.or(
      `contracting_party_name.ilike.%${searchTerm}%,project_name.ilike.%${searchTerm}%,cpv_code.ilike.%${searchTerm}%,cpv_description.ilike.%${searchTerm}%,nuts_code.ilike.%${searchTerm}%,territory_name.ilike.%${searchTerm}%`
    )
  }
  
  // 2. Filtro CPV - soportar array o string único
  const cpvCodes = filters.cpvCodes || (filters.cpv ? [filters.cpv] : [])
  if (cpvCodes.length > 0) {
    // CRITICAL FIX: Aplicar startsWith para cada código CPV con OR logic
    const cpvConditions = cpvCodes.map(code => `cpv_code.like.${code}%`).join(',')
    query = query.or(cpvConditions)
  }
  
  // 3. Filtro provincia/NUTS - mantener lógica de includes de /content  
  if (filters.province) {
    query = query.ilike('nuts_code', `%${filters.province}%`)
  } else if (filters.nuts) {
    if (filters.nuts.match === 'eq') {
      query = query.eq('nuts_code', filters.nuts.code)
    } else {
      query = query.like('nuts_code', `${filters.nuts.code}%`)
    }
  }
  
  // 4. Filtro organismo
  if (filters.organismo) {
    query = query.eq('contracting_party_name', filters.organismo)
  }
  
  // 5. Filtros de fecha
  if (filters.from) {
    query = query.gte('fecha_fin_presentacion', filters.from)
  }
  if (filters.to) {
    query = query.lte('fecha_fin_presentacion', filters.to)
  }
  
  // 6. Licitaciones finalizadas - replicar lógica exacta de /content
  if (filters.mostrarFinalizadas || filters.showFinalized) {
    // MODO: Activas + Finalizadas recientes (últimos 7 días)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
    
    query = query.gte('fecha_fin_presentacion', sevenDaysAgoStr)
  } else {
    // MODO: Solo activas (lógica por defecto de /content)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const currentDateStr = today.toISOString().split('T')[0]
    
    query = query.gte('fecha_fin_presentacion', currentDateStr)
  }
  
  // 7. Ordenamiento
  if (orderBy) {
    query = query.order(orderBy.field, { ascending: orderBy.dir === 'asc' })
  } else {
    // Ordenamiento por defecto de /content
    query = query.order('fecha_fin_presentacion', { ascending: true })
  }
  
  return query
}

/**
 * Convierte filtros a URLSearchParams para sincronización con URL
 */
export function filtersToSearchParams(filters: LicitacionesFilters): URLSearchParams {
  const params = new URLSearchParams()
  
  if (filters.q || filters.busqueda) {
    params.set('busqueda', filters.q || filters.busqueda || '')
  }
  
  if (filters.cpvCodes && filters.cpvCodes.length > 0) {
    params.set('cpvCodes', JSON.stringify(filters.cpvCodes))
  } else if (filters.cpv) {
    params.set('cpv', filters.cpv)
  }
  
  if (filters.cpvSearch) {
    params.set('cpvSearch', filters.cpvSearch)
  }
  
  if (filters.province) {
    params.set('province', filters.province)
  }
  
  if (filters.organismo) {
    params.set('organismo', filters.organismo)
  }
  
  if (filters.from) {
    params.set('from', filters.from)
  }
  
  if (filters.to) {
    params.set('to', filters.to)
  }
  
  if (filters.mostrarFinalizadas || filters.showFinalized) {
    params.set('mostrarFinalizadas', 'true')
  }
  
  return params
}