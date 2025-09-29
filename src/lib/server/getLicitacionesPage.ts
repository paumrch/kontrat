import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'
import { PaginationConfig } from '@/lib/shared/licitaciones-types'
import { applyFiltersToSupabase } from './buildLicitacionesQuery'
import { describeCpv, getCpvDict } from './cpv-dict'

type Licitacion = Database['public']['Tables']['licitaciones']['Row']

// Tipo optimizado para select - SOLO columnas necesarias + CPV description precomputed
type LicitacionMinimal = Pick<Licitacion, 
  | 'id' 
  | 'contracting_party_name'
  | 'project_name'
  | 'cpv_code'
  | 'nuts_code'
  | 'territory_name'
  | 'fecha_fin_presentacion'
  | 'importe'
  | 'anuncio_link'
> & {
  cpv_description?: string  // Pre-computed CPV description
}

/**
 * Cliente Supabase optimizado para servidor
 */
const getServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}

/**
 * Obtiene licitaciones con paginación server-side REAL
 * Replica exactamente la lógica de /content pero server-side
 * NUNCA trae todo al cliente - máximo 200 filas por request
 */
export async function getLicitacionesPage(args: PaginationConfig): Promise<{ 
  rows: LicitacionMinimal[]
  hasMore: boolean
  total?: number
  uniqueCPVs: string[]
}> {
  const { 
    page = 0, 
    pageSize = 100, // Máximo conservador para evitar cuelgues
    filters = {},
    orderBy = { field: 'fecha_fin_presentacion', dir: 'asc' }
  } = args

  if (page < 0) {
    throw new Error('Page number must be >= 0')
  }
  
  if (pageSize > 200) {
    throw new Error('pageSize maximum is 200 for performance')
  }

  const supabase = getServerClient()

  try {
    // PASO 1: Contar total con filtros aplicados
    let countQuery = supabase
      .from('licitaciones')
      .select('id', { count: 'exact', head: true })
    
    // Aplicar filtros exactos de /content
    countQuery = applyFiltersToSupabase(countQuery, filters)
    
    const { count, error: countError } = await countQuery
    
    if (countError) {
      console.error('Error en conteo:', countError)
      return { rows: [], hasMore: false, uniqueCPVs: [] }
    }
    
    const total = count || 0
    
    // PASO 2: Query principal con SELECT optimizado y paginación real
    const from = page * pageSize
    const to = from + pageSize - 1
    
    let dataQuery = supabase
      .from('licitaciones')
      .select(`
        id,
        contracting_party_name,
        project_name, 
        cpv_code,
        nuts_code,
        territory_name,
        fecha_fin_presentacion,
        importe,
        anuncio_link
      `)
      .range(from, to)
    
    // Aplicar mismos filtros que al conteo
    dataQuery = applyFiltersToSupabase(dataQuery, filters, orderBy)
    
    const { data: rows, error } = await dataQuery
    
    if (error) {
      console.error('Error en query principal:', error)
      return { rows: [], hasMore: false, uniqueCPVs: [] }
    }
    
    const typedRows = rows as LicitacionMinimal[] | null

    // PASO 3: Pre-computar descripciones CPV para mejor performance
    let enhancedRows: LicitacionMinimal[] = []
    if (typedRows && typedRows.length > 0) {
      const cpvDict = getCpvDict()
      enhancedRows = typedRows.map(row => ({
        ...row,
        cpv_description: row.cpv_code ? describeCpv(row.cpv_code, cpvDict) : undefined
      }))
    }

    // PASO 4: Extraer CPVs únicos de este batch (no de toda la DB)
    const uniqueCPVs = Array.from(new Set(
      (enhancedRows || [])
        .map(row => row.cpv_code)
        .filter((cpv): cpv is string => cpv !== null && cpv !== undefined)
        .map(cpv => cpv.substring(0, 8)) // Tomar solo el código principal
    )).sort()

    // Determinar si hay más páginas
    const hasMore = (enhancedRows?.length || 0) === pageSize && (from + pageSize) < total
    
    return {
      rows: enhancedRows || [],
      hasMore,
      total,
      uniqueCPVs
    }

  } catch (error) {
    console.error('Error en getLicitacionesPage:', error)
    return { rows: [], hasMore: false, uniqueCPVs: [] }
  }
}