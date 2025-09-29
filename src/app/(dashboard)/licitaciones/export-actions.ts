'use server'

import { getLicitacionesPage } from '@/lib/server/getLicitacionesPage'
import type { LicitacionesFilters } from '@/lib/shared/licitaciones-types'

/**
 * Server Action para exportar CSV de todas las licitaciones
 * Usa batches para manejar grandes volúmenes sin memory overflow
 */
export async function exportAllLicitacionesCSV(filters?: LicitacionesFilters) {
  try {
    const allRows: Array<{
      id: string
      project_name: string
      contracting_party_name: string | null
      cpv_code: string | null
      nuts_code: string | null
      fecha_fin_presentacion: string | null
      importe: number | null
      anuncio_link: string | null
    }> = []
    let page = 0
    let hasMore = true
    
    // Recoger todas las licitaciones por batches
    while (hasMore) {
      const result = await getLicitacionesPage({
        page,
        pageSize: 1000, // Batches grandes para export
        filters,
        orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
      })
      
      allRows.push(...result.rows)
      hasMore = result.hasMore
      page++
      
      // Safety: máximo 20 páginas = 20K registros
      if (page >= 20) {
        console.warn('Export CSV alcanzó límite de seguridad: 20K registros')
        break
      }
    }
    
    // Generar CSV
    const headers = [
      'ID',
      'Proyecto',
      'Organismo',
      'CPV',
      'Territorio',
      'Fecha Límite',
      'Importe',
      'Enlace'
    ]
    
    const csvRows = [
      headers.join(','),
      ...allRows.map(row => [
        `"${row.id}"`,
        `"${(row.project_name || '').replace(/"/g, '""')}"`,
        `"${(row.contracting_party_name || '').replace(/"/g, '""')}"`,
        `"${row.cpv_code || ''}"`,
        `"${row.nuts_code || ''}"`,
        `"${row.fecha_fin_presentacion || ''}"`,
        `"${row.importe || ''}"`,
        `"${row.anuncio_link || ''}"`
      ].join(','))
    ]
    
    const csvContent = csvRows.join('\n')
    const timestamp = new Date().toISOString().split('T')[0]
    
    return {
      content: csvContent,
      filename: `licitaciones-${timestamp}.csv`,
      count: allRows.length
    }
    
  } catch (error) {
    console.error('Error en exportAllLicitacionesCSV:', error)
    throw new Error('Error generando CSV')
  }
}