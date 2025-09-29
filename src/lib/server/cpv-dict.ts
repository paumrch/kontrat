/**
 * Server-side CPV Dictionary
 * Carga y cachea el diccionario CPV para React Server Components
 */

import cpvData from '../../../public/CPVs.json'

// Cache en memoria del servidor
let cpvDict: Map<string, string> | null = null

/**
 * Normaliza un código CPV para lookup consistente
 */
export function normalizeCPVCode(code: string): string {
  if (!code) return ''
  
  // Remover espacios, guiones, puntos
  let cleanCode = code.replace(/[-\s\.\,\:\;]/g, '')
  
  // Solo dígitos
  cleanCode = cleanCode.replace(/[^\d]/g, '')
  
  // Si tiene menos de 8 dígitos, completar con ceros a la derecha
  if (cleanCode.length < 8 && cleanCode.length > 0) {
    cleanCode = cleanCode.padEnd(8, '0')
  }
  
  // Si tiene más de 8 dígitos, tomar solo los primeros 8
  if (cleanCode.length > 8) {
    cleanCode = cleanCode.substring(0, 8)
  }
  
  return cleanCode
}

/**
 * Carga el diccionario CPV desde el JSON estático
 * Compatible con React Server Components
 */
export function getCpvDict(): Map<string, string> {
  if (cpvDict !== null) {
    return cpvDict
  }
  
  cpvDict = new Map()
  
  try {
    // El JSON tiene formato: [{"CPV": "03000000-1", "DESCRIPCION": "..."}]
    cpvData.forEach((item: { CPV: string; DESCRIPCION: string }) => {
      // Extraer código base antes del guión
      const baseCode = item.CPV.split('-')[0]
      // Normalizar para lookup consistente  
      const normalizedCode = normalizeCPVCode(baseCode)
      
      if (normalizedCode && item.DESCRIPCION) {
        cpvDict!.set(normalizedCode, item.DESCRIPCION)
      }
    })
    
    console.log(`[CPV Dict] Cargados ${cpvDict.size} códigos CPV`)
    
  } catch (error) {
    console.error('[CPV Dict] Error cargando diccionario:', error)
  }
  
  return cpvDict
}

/**
 * Obtiene la descripción de un código CPV
 * Fallback coherente para códigos no encontrados
 */
export function describeCpv(code: string, dict?: Map<string, string>): string {
  if (!code) return 'Sin código CPV'
  
  const cpvDict = dict || getCpvDict()
  const normalizedCode = normalizeCPVCode(code)
  
  if (!normalizedCode) {
    return 'Código CPV inválido'
  }
  
  // Buscar coincidencia exacta
  const exactMatch = cpvDict.get(normalizedCode)
  if (exactMatch) {
    return exactMatch
  }
  
  // Buscar por jerarquía CPV (códigos padre)
  if (normalizedCode.length === 8) {
    // Intentar con 6 dígitos + 00 (clase)
    const code6 = normalizedCode.substring(0, 6) + '00'
    const match6 = cpvDict.get(code6)
    if (match6) {
      return match6
    }
    
    // Intentar con 4 dígitos + 0000 (grupo)  
    const code4 = normalizedCode.substring(0, 4) + '0000'
    const match4 = cpvDict.get(code4)
    if (match4) {
      return match4
    }
    
    // Intentar con 2 dígitos + 000000 (división)
    const code2 = normalizedCode.substring(0, 2) + '000000'
    const match2 = cpvDict.get(code2)
    if (match2) {
      return match2
    }
  }
  
  // Fallback solo para códigos realmente no encontrados
  return `Sin descripción (código no reconocido: ${code})`
}