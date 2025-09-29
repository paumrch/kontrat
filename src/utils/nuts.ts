/**
 * Mapeo de códigos NUTS a sus descripciones
 * Basado en la nomenclatura oficial europea
 */
export const NUTS_MAPPING: Record<string, string> = {
  // España - NUTS 2 y principales NUTS 3
  'ES11': 'Galicia',
  'ES111': 'A Coruña',
  'ES112': 'Lugo', 
  'ES113': 'Ourense',
  'ES114': 'Pontevedra',
  'ES12': 'Principado de Asturias',
  'ES120': 'Asturias',
  'ES13': 'Cantabria',
  'ES130': 'Cantabria',
  'ES21': 'País Vasco',
  'ES211': 'Álava',
  'ES212': 'Guipúzcoa', 
  'ES213': 'Vizcaya',
  'ES22': 'Comunidad Foral de Navarra',
  'ES220': 'Navarra',
  'ES23': 'La Rioja',
  'ES230': 'La Rioja',
  'ES24': 'Aragón',
  'ES241': 'Huesca',
  'ES242': 'Teruel',
  'ES243': 'Zaragoza',
  'ES30': 'Comunidad de Madrid',
  'ES300': 'Madrid',
  'ES41': 'Castilla y León',
  'ES411': 'Ávila',
  'ES412': 'Burgos',
  'ES413': 'León',
  'ES414': 'Palencia',
  'ES415': 'Salamanca',
  'ES416': 'Segovia',
  'ES417': 'Soria',
  'ES418': 'Valladolid',
  'ES419': 'Zamora',
  'ES42': 'Castilla-La Mancha',
  'ES421': 'Albacete',
  'ES422': 'Ciudad Real',
  'ES423': 'Cuenca',
  'ES424': 'Guadalajara',
  'ES425': 'Toledo',
  'ES43': 'Extremadura',
  'ES431': 'Badajoz',
  'ES432': 'Cáceres',
  'ES51': 'Cataluña',
  'ES511': 'Barcelona',
  'ES512': 'Girona',
  'ES513': 'Lleida',
  'ES514': 'Tarragona',
  'ES52': 'Comunidad Valenciana',
  'ES521': 'Alicante',
  'ES522': 'Castellón',
  'ES523': 'Valencia',
  'ES53': 'Illes Balears',
  'ES531': 'Illes Balears',
  'ES61': 'Andalucía',
  'ES611': 'Almería',
  'ES612': 'Cádiz',
  'ES613': 'Córdoba',
  'ES614': 'Granada',
  'ES615': 'Huelva',
  'ES616': 'Jaén',
  'ES617': 'Málaga',
  'ES618': 'Sevilla',
  'ES62': 'Región de Murcia',
  'ES620': 'Murcia',
  'ES63': 'Ciudad de Ceuta',
  'ES630': 'Ceuta',
  'ES64': 'Ciudad de Melilla',
  'ES640': 'Melilla',
  'ES70': 'Canarias',
  'ES701': 'Las Palmas',
  'ES702': 'Santa Cruz de Tenerife'
}

/**
 * Obtiene la descripción de un código NUTS
 */
export function getNutsDescription(nutsCode: string | null): string {
  if (!nutsCode) return 'No especificado'
  
  const description = NUTS_MAPPING[nutsCode]
  if (description) return description
  
  // Si no encontramos el código exacto, intentar con códigos más generales
  if (nutsCode.length > 3) {
    const generalCode = nutsCode.substring(0, 3)
    const generalDescription = NUTS_MAPPING[generalCode]
    if (generalDescription) return generalDescription
  }
  
  if (nutsCode.length > 2) {
    const generalCode = nutsCode.substring(0, 2)
    const generalDescription = NUTS_MAPPING[generalCode]
    if (generalDescription) return generalDescription
  }
  
  return nutsCode // Si no encontramos nada, devolver el código tal como está
}

/**
 * Formatea el código NUTS con su descripción
 */
export function formatNutsDisplay(nutsCode: string | null): { code: string; description: string } {
  const code = nutsCode || 'N/A'
  const description = getNutsDescription(nutsCode)
  
  return { code, description }
}