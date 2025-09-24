export interface CPVInfo {
  code: string;
  description: string;
}

// Cache de CPVs para evitar múltiples requests
const cpvCache = new Map<string, CPVInfo>();

// Función mejorada para limpiar códigos CPV
export function cleanCPVCode(code: string): string {
  if (!code) return '';
  
  // Remover espacios, guiones, puntos y otros caracteres especiales
  let cleanCode = code.replace(/[-\s\.\,\:\;]/g, '');
  
  // Asegurarse de que sea solo dígitos
  cleanCode = cleanCode.replace(/[^\d]/g, '');
  
  // Si tiene menos de 8 dígitos, completar con ceros
  if (cleanCode.length < 8 && cleanCode.length > 0) {
    cleanCode = cleanCode.padEnd(8, '0');
  }
  
  // Si tiene más de 8 dígitos, tomar solo los primeros 8
  if (cleanCode.length > 8) {
    cleanCode = cleanCode.substring(0, 8);
  }
  
  return cleanCode;
}

export async function getCPVInfo(code: string): Promise<CPVInfo> {
  try {
    // Usar la función mejorada para limpiar el código
    const cleanCode = cleanCPVCode(code);
    
    if (!cleanCode) {
      return {
        code: code,
        description: 'Código CPV inválido'
      };
    }
    
    // Verificar caché primero
    const cacheKey = cleanCode;
    if (cpvCache.has(cacheKey)) {
      return cpvCache.get(cacheKey)!;
    }
    
    try {
      const response = await fetch(`/api/cpv?code=${cleanCode}`);
      if (response.ok) {
        const cpvInfo: CPVInfo = await response.json();
        
        // Guardar en caché
        cpvCache.set(cacheKey, cpvInfo);
        return cpvInfo;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (apiError) {
      console.warn(`Error API CPV para ${code}:`, apiError);
      
      // Fallback local para CPVs comunes
      return getCPVInfoSync(code);
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
  const cleanCode = cleanCPVCode(code);
  
  if (!cleanCode) {
    return {
      code: code,
      description: 'Código CPV inválido'
    };
  }
  
  // Verificar caché primero
  const cacheKey = cleanCode;
  if (cpvCache.has(cacheKey)) {
    return cpvCache.get(cacheKey)!;
  }
  
  // Mapeo ampliado de CPVs comunes en español
  const commonCPVs: { [key: string]: string } = {
    // Divisiones principales (2 dígitos)
    '03000000': 'Productos de la agricultura, ganadería, pesca, silvicultura',
    '09000000': 'Derivados del petróleo, combustibles, electricidad y otras fuentes de energía',
    '15000000': 'Alimentos, bebidas, tabaco y productos afines',
    '18000000': 'Prendas de vestir, calzado, artículos de cuero',
    '22000000': 'Material impreso y productos afines',
    '24000000': 'Productos químicos',
    '30000000': 'Maquinaria y equipos informáticos, de oficina y de telecomunicación',
    '31000000': 'Maquinaria y equipos eléctricos, de iluminación y de otra índole',
    '32000000': 'Equipos de radio, televisión, comunicación, telecomunicación',
    '33000000': 'Equipos médicos, farmacéuticos y de cuidado personal',
    '34000000': 'Equipo de transporte y productos auxiliares para el transporte',
    '35000000': 'Equipos de seguridad, contra incendios, policiales y de defensa',
    '38000000': 'Instrumentos de medición, control y laboratorio',
    '39000000': 'Mobiliario, accesorios, equipos domésticos',
    '42000000': 'Maquinaria industrial',
    '44000000': 'Materiales de construcción y elementos afines',
    '45000000': 'Trabajos de construcción',
    '48000000': 'Paquetes de software y sistemas de información',
    '50000000': 'Servicios de reparación y mantenimiento',
    '51000000': 'Servicios de instalación',
    '55000000': 'Servicios de hostelería y restauración',
    '60000000': 'Servicios de transporte',
    '63000000': 'Servicios auxiliares al transporte; servicios de agencias de viajes',
    '64000000': 'Servicios postales y de telecomunicaciones',
    '65000000': 'Servicios de suministro público',
    '66000000': 'Servicios financieros y de seguros',
    '70000000': 'Servicios inmobiliarios',
    '71000000': 'Servicios de arquitectura, ingeniería y planificación',
    '72000000': 'Servicios de tecnología de la información',
    '73000000': 'Servicios de investigación y desarrollo',
    '74000000': 'Otros servicios profesionales y comerciales',
    '75000000': 'Servicios de la administración pública',
    '76000000': 'Servicios relacionados con la industria del petróleo y del gas',
    '77000000': 'Servicios agrícolas, forestales, hortícolas, acuícolas y apícolas',
    '79000000': 'Servicios empresariales: jurídicos, mercadotécnicos, consultoría',
    '80000000': 'Servicios de educación y formación',
    '85000000': 'Servicios de salud y trabajo social',
    '90000000': 'Servicios de alcantarillado, basura, limpieza y medio ambiente',
    '92000000': 'Servicios recreativos, culturales y deportivos',
    '98000000': 'Otros servicios comunitarios, sociales y personales',
    
    // Códigos específicos más detallados
    '18100000': 'Ropa de trabajo, de seguridad y uniformes',
    '18400000': 'Prendas de cuero',
    '22300000': 'Libros y folletos impresos',
    '30200000': 'Equipos informáticos y suministros',
    '30230000': 'Equipos terminales de ordenador',
    '31600000': 'Motores eléctricos, generadores y transformadores',
    '32500000': 'Equipos de telecomunicación',
    '33100000': 'Equipos médicos',
    '33600000': 'Productos farmacéuticos',
    '34100000': 'Vehículos a motor',
    '34700000': 'Aeronaves, vehículos espaciales y equipos afines',
    '35100000': 'Equipos de seguridad y protección',
    '38900000': 'Instrumentos diversos',
    '39200000': 'Material de limpieza',
    '44100000': 'Materiales de construcción estructural',
    '45200000': 'Trabajos generales de construcción de inmuebles',
    '45300000': 'Trabajos de instalación en construcciones',
    '45400000': 'Trabajos de terminación de edificios',
    '48800000': 'Sistemas de información y servidores',
    '50700000': 'Servicios de reparación y mantenimiento de equipos de transporte',
    '55100000': 'Servicios de hoteles',
    '55300000': 'Servicios de restaurante',
    '60100000': 'Servicios de transporte por carretera',
    '60400000': 'Servicios de transporte por water',
    '60500000': 'Servicios de transporte aéreo',
    '63700000': 'Servicios de agencias de viajes y servicios afines',
    '64200000': 'Servicios de telecomunicaciones',
    '65100000': 'Distribución de agua',
    '65300000': 'Suministro de electricidad',
    '66100000': 'Servicios bancarios y de inversión',
    '71200000': 'Servicios de ingeniería',
    '71300000': 'Servicios de ingeniería especializada',
    '72200000': 'Servicios de consultoría en programas de informática y suministro de programas',
    '72600000': 'Servicios de asistencia informática',
    '73200000': 'Servicios de investigación y desarrollo experimental',
    '74900000': 'Servicios profesionales diversos',
    '75100000': 'Servicios de la administración pública',
    '79300000': 'Estudios de mercado y encuestas de opinión pública',
    '79400000': 'Servicios de consultoría en publicidad y marketing',
    '79900000': 'Servicios empresariales diversos',
    '80400000': 'Servicios de enseñanza superior',
    '80500000': 'Servicios de educación diversos',
    '85100000': 'Servicios de salud',
    '85300000': 'Servicios sociales',
    '90500000': 'Servicios de gestión de residuos',
    '90600000': 'Servicios de limpieza y medio ambiente',
    '92600000': 'Servicios deportivos',
    '98300000': 'Servicios de organizaciones asociativas'
  };
  
  const description = commonCPVs[cleanCode];
  const finalDescription = description || `CPV ${cleanCode} - Sin descripción disponible`;
  
  const cpvInfo: CPVInfo = {
    code: code,
    description: finalDescription
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