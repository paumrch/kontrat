export interface CPVInfo {
  code: string;
  description: string;
}

// Cache de CPVs para evitar múltiples requests
const cpvCache = new Map<string, CPVInfo>();

export async function getCPVInfo(code: string): Promise<CPVInfo> {
  try {
    // Limpiar el código CPV (remover espacios y guiones)
    const cleanCode = code.replace(/[-\s]/g, '');
    
    // Verificar caché primero
    const cacheKey = cleanCode;
    if (cpvCache.has(cacheKey)) {
      return cpvCache.get(cacheKey)!;
    }
    
    try {
      // Llamar a la API para obtener la descripción
      const response = await fetch(`/api/cpv?code=${encodeURIComponent(cleanCode)}`);
      
      if (response.ok) {
        const result = await response.json();
        const cpvInfo: CPVInfo = {
          code: code,
          description: result.description
        };
        
        // Guardar en caché
        cpvCache.set(cacheKey, cpvInfo);
        return cpvInfo;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (apiError) {
      console.warn(`Error API CPV para ${code}:`, apiError);
      
      // Fallback local para CPVs comunes
      const commonCPVs: Record<string, string> = {
        '45000000': 'Trabajos de construcción',
        '30000000': 'Equipos informáticos, de oficina y de telecomunicaciones',
        '48000000': 'Paquetes de software y sistemas de información',
        '79000000': 'Servicios comerciales',
        '72000000': 'Servicios de tecnologías de la información',
        '90000000': 'Servicios de saneamiento, desechos y limpieza',
        '50000000': 'Servicios de reparación y mantenimiento',
        '39000000': 'Mobiliario, accesorios, equipos domésticos',
        '60000000': 'Servicios de transporte',
        '80000000': 'Servicios de educación y formación',
        '85000000': 'Servicios de salud y trabajo social',
        '75000000': 'Servicios de la administración pública',
        '71000000': 'Servicios de arquitectura, ingeniería y planificación',
        '35000000': 'Equipos de seguridad, contra incendios, policiales y de defensa',
        '44000000': 'Materiales de construcción y elementos afines',
        '15000000': 'Alimentos, bebidas, tabaco y productos afines',
        '03000000': 'Productos de la agricultura, ganadería, pesca, silvicultura',
        '34000000': 'Equipo de transporte y productos auxiliares para el transporte',
        '33000000': 'Equipos médicos, farmacéuticos y de cuidado personal',
        '31000000': 'Maquinaria y equipos eléctricos, de iluminación y de otra índole'
      };
      
      const description = commonCPVs[cleanCode] || `CPV ${cleanCode} - Sin descripción disponible`;
      
      const cpvInfo: CPVInfo = {
        code: code,
        description: description
      };
      
      // Guardar en caché
      cpvCache.set(cacheKey, cpvInfo);
      return cpvInfo;
    }
  } catch (error) {
    console.warn(`Error al obtener CPV ${code}:`, error);
    const errorInfo: CPVInfo = {
      code: code,
      description: 'Error al cargar descripción'
    };
    return errorInfo;
  }
}

// Versión sincrónica para compatibilidad hacia atrás (usa caché o fallback)
export function getCPVInfoSync(code: string): CPVInfo {
  const cleanCode = code.replace(/[-\s]/g, '');
  
  // Verificar caché primero
  const cacheKey = cleanCode;
  if (cpvCache.has(cacheKey)) {
    return cpvCache.get(cacheKey)!;
  }
  
  // Fallback local para CPVs comunes
  const commonCPVs: Record<string, string> = {
    '45000000': 'Trabajos de construcción',
    '30000000': 'Equipos informáticos, de oficina y de telecomunicaciones',
    '48000000': 'Paquetes de software y sistemas de información',
    '79000000': 'Servicios comerciales',
    '72000000': 'Servicios de tecnologías de la información',
    '90000000': 'Servicios de saneamiento, desechos y limpieza',
    '50000000': 'Servicios de reparación y mantenimiento',
    '39000000': 'Mobiliario, accesorios, equipos domésticos',
    '60000000': 'Servicios de transporte',
    '80000000': 'Servicios de educación y formación',
    '85000000': 'Servicios de salud y trabajo social',
    '75000000': 'Servicios de la administración pública',
    '71000000': 'Servicios de arquitectura, ingeniería y planificación',
    '35000000': 'Equipos de seguridad, contra incendios, policiales y de defensa',
    '44000000': 'Materiales de construcción y elementos afines',
    '15000000': 'Alimentos, bebidas, tabaco y productos afines',
    '03000000': 'Productos de la agricultura, ganadería, pesca, silvicultura',
    '34000000': 'Equipo de transporte y productos auxiliares para el transporte',
    '33000000': 'Equipos médicos, farmacéuticos y de cuidado personal',
    '31000000': 'Maquinaria y equipos eléctricos, de iluminación y de otra índole'
  };
  
  const description = commonCPVs[cleanCode] || `CPV ${cleanCode} - Sin descripción disponible`;
  
  const cpvInfo: CPVInfo = {
    code: code,
    description: description
  };
  
  // Guardar en caché
  cpvCache.set(cacheKey, cpvInfo);
  return cpvInfo;
}

export function formatCPVDisplay(code: string): { code: string; description: string } {
  const cpvInfo = getCPVInfoSync(code);
  return {
    code: cpvInfo.code,
    description: cpvInfo.description
  };
}

// Componente para mostrar el CPV formateado
export function formatCPVForDisplay(code: string): string {
  const cpvInfo = getCPVInfoSync(code);
  return `${cpvInfo.code} - ${cpvInfo.description}`;
}