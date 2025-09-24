import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json({ error: 'CPV code is required' }, { status: 400 })
    }
    
    // Limpiar el código CPV
    const cleanCode = code.replace(/[-\s]/g, '')
    
    try {
      // Importar dinámicamente la librería cpv-eu
      const { getLabelByCPVCode } = await import('cpv-eu')
      const description = getLabelByCPVCode(cleanCode, 'es')
      
      if (description) {
        return NextResponse.json({
          code: code,
          description: description
        })
      } else {
        return NextResponse.json({
          code: code,
          description: 'CPV no encontrado'
        })
      }
    } catch (libError) {
      console.warn('Error usando librería cpv-eu:', libError)
      
      // Mapeo de fallback para CPVs comunes
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
      }
      
      const description = commonCPVs[cleanCode]
      
      return NextResponse.json({
        code: code,
        description: description || `CPV ${cleanCode} - Sin descripción disponible`
      })
    }
  } catch (error) {
    console.error('Error en API CPV:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}