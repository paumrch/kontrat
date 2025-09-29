import { getLicitacionesPage } from '@/lib/server/getLicitacionesPage'
import { loadMore, applyFilters } from '@/app/(dashboard)/licitaciones/actions'

// Mock Supabase para tests
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        gte: jest.fn(() => ({
          order: jest.fn(() => ({
            range: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 'test-1',
                  project_name: 'Test Project',
                  contracting_party_name: 'Test Organization',
                  cpv_code: '45000000',
                  nuts_code: 'ES30',
                  fecha_fin_presentacion: '2024-12-31',
                  importe: 100000,
                  anuncio_link: 'https://test.com'
                }
              ],
              error: null
            }))
          }))
        }))
      }))
    }))
  }))
}))

describe('Licitaciones - Performance Optimization', () => {
  
  describe('getLicitacionesPage', () => {
    it('should return paginated data with max 200 pageSize', async () => {
      const result = await getLicitacionesPage({
        page: 0,
        pageSize: 100,
        filters: {},
        orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
      })
      
      expect(result).toHaveProperty('rows')
      expect(result).toHaveProperty('hasMore')
      expect(result).toHaveProperty('uniqueCPVs')
      expect(Array.isArray(result.rows)).toBe(true)
      expect(Array.isArray(result.uniqueCPVs)).toBe(true)
    })

    it('should enforce pageSize limit of 200', async () => {
      await expect(
        getLicitacionesPage({
          page: 0,
          pageSize: 300, // Excede límite
          filters: {},
          orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
        })
      ).rejects.toThrow('pageSize maximum is 200 for performance')
    })
    
    it('should handle empty results gracefully', async () => {
      const result = await getLicitacionesPage({
        page: 999, // Página que no existe
        pageSize: 100,
        filters: {},
        orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
      })
      
      expect(result.rows).toEqual([])
      expect(result.hasMore).toBe(false)
      expect(result.uniqueCPVs).toEqual([])
    })
  })
  
  describe('Server Actions', () => {
    it('loadMore should return second batch', async () => {
      const result = await loadMore({
        page: 1,
        pageSize: 100,
        filters: { showFinalized: false },
        orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
      })
      
      expect(result).toHaveProperty('rows')
      expect(result).toHaveProperty('hasMore')
      expect(result).toHaveProperty('uniqueCPVs')
    })
    
    it('applyFilters should reset to page 0', async () => {
      const result = await applyFilters(
        { q: 'test', showFinalized: false },
        { field: 'project_name', dir: 'desc' }
      )
      
      expect(result).toHaveProperty('rows')
      expect(result).toHaveProperty('hasMore')
    })
  })
  
  describe('Performance Tests', () => {
    it('should complete page load under reasonable time', async () => {
      const startTime = Date.now()
      
      const result = await getLicitacionesPage({
        page: 0,
        pageSize: 100,
        filters: {},
        orderBy: { field: 'fecha_fin_presentacion', dir: 'asc' }
      })
      
      const duration = Date.now() - startTime
      
      // Debe completar en menos de 5 segundos (generoso para CI)
      expect(duration).toBeLessThan(5000)
      expect(result.rows.length).toBeLessThanOrEqual(100)
    })
  })
})