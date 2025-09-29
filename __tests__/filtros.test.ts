/**
 * Tests básicos para sistema de filtros restaurado
 */

import { describe, test, expect } from '@jest/globals'
import { buildFiltersFromSearchParams } from '../src/lib/server/buildLicitacionesQuery'
import { describeCpv, normalizeCPVCode, getCpvDict } from '../src/lib/server/cpv-dict'

describe('Filtros Server-Side', () => {
  test('buildFiltersFromSearchParams - búsqueda general', () => {
    const params = new URLSearchParams('busqueda=valencia')
    const filters = buildFiltersFromSearchParams(params)
    
    expect(filters.busqueda).toBeUndefined() // se mapea a .q
    expect(filters.q).toBe('valencia')
  })
  
  test('buildFiltersFromSearchParams - provincia NUTS', () => {
    const params = new URLSearchParams('province=ES523')
    const filters = buildFiltersFromSearchParams(params)
    
    expect(filters.province).toBe('ES523')
    expect(filters.nuts).toEqual({
      level: 3,
      code: 'ES523', 
      match: 'eq'
    })
  })
  
  test('buildFiltersFromSearchParams - CPV codes array', () => {
    const params = new URLSearchParams('cpvCodes=["45000000","90000000"]')
    const filters = buildFiltersFromSearchParams(params)
    
    expect(filters.cpvCodes).toEqual(['45000000', '90000000'])
  })
  
  test('buildFiltersFromSearchParams - mostrar finalizadas', () => {
    const params = new URLSearchParams('mostrarFinalizadas=true')
    const filters = buildFiltersFromSearchParams(params)
    
    expect(filters.mostrarFinalizadas).toBe(true)
    expect(filters.showFinalized).toBe(true)
  })
  
  test('buildFiltersFromSearchParams - filtros combinados', () => {
    const params = new URLSearchParams('busqueda=construccion&province=ES300&mostrarFinalizadas=true')
    const filters = buildFiltersFromSearchParams(params)
    
    expect(filters.q).toBe('construccion')
    expect(filters.province).toBe('ES300')
    expect(filters.mostrarFinalizadas).toBe(true)
    expect(filters.nuts).toEqual({
      level: 3,
      code: 'ES300',
      match: 'eq' 
    })
  })
})

describe('CPV Dictionary', () => {
  test('normalizeCPVCode - código con guión', () => {
    expect(normalizeCPVCode('45000000-1')).toBe('45000000')
  })
  
  test('normalizeCPVCode - código corto con padding', () => {
    expect(normalizeCPVCode('450')).toBe('45000000')
  })
  
  test('normalizeCPVCode - código con caracteres especiales', () => {
    expect(normalizeCPVCode('45-00.00:00')).toBe('45000000')
  })
  
  test('describeCpv - código conocido', () => {
    const dict = getCpvDict()
    const description = describeCpv('45000000', dict)
    
    // Debería encontrar la descripción, no el fallback
    expect(description).not.toContain('Sin descripción (código no reconocido')
    expect(typeof description).toBe('string')
    expect(description.length).toBeGreaterThan(10)
  })
  
  test('describeCpv - código inexistente', () => {
    const dict = getCpvDict()
    const description = describeCpv('99999999', dict)
    
    expect(description).toContain('Sin descripción (código no reconocido: 99999999)')
  })
  
  test('describeCpv - código vacío', () => {
    const dict = getCpvDict()
    const description = describeCpv('', dict)
    
    expect(description).toBe('Sin código CPV')
  })
  
  test('describeCpv - código inválido', () => {
    const dict = getCpvDict()
    const description = describeCpv('abc', dict)
    
    expect(description).toBe('Código CPV inválido')
  })
})