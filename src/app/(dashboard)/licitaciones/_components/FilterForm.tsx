'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { LicitacionesFilters } from '@/lib/shared/licitaciones-types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FilterFormProps {
  initialFilters: LicitacionesFilters
  uniqueCPVs: string[]
}

// Lista completa de provincias españolas con códigos NUTS (ordenadas alfabéticamente)
const PROVINCIAS = [
  { code: 'all', name: 'Todas las provincias' },
  { code: 'ES111', name: 'A Coruña' },
  { code: 'ES421', name: 'Albacete' },
  { code: 'ES521', name: 'Alicante' },
  { code: 'ES611', name: 'Almería' },
  { code: 'ES120', name: 'Asturias' },
  { code: 'ES211', name: 'Álava' },
  { code: 'ES411', name: 'Ávila' },
  { code: 'ES431', name: 'Badajoz' },
  { code: 'ES511', name: 'Barcelona' },
  { code: 'ES412', name: 'Burgos' },
  { code: 'ES432', name: 'Cáceres' },
  { code: 'ES612', name: 'Cádiz' },
  { code: 'ES130', name: 'Cantabria' },
  { code: 'ES522', name: 'Castellón' },
  { code: 'ES630', name: 'Ceuta' },
  { code: 'ES422', name: 'Ciudad Real' },
  { code: 'ES613', name: 'Córdoba' },
  { code: 'ES423', name: 'Cuenca' },
  { code: 'ES512', name: 'Girona' },
  { code: 'ES614', name: 'Granada' },
  { code: 'ES424', name: 'Guadalajara' },
  { code: 'ES212', name: 'Guipúzcoa' },
  { code: 'ES615', name: 'Huelva' },
  { code: 'ES241', name: 'Huesca' },
  { code: 'ES531', name: 'Illes Balears' },
  { code: 'ES616', name: 'Jaén' },
  { code: 'ES230', name: 'La Rioja' },
  { code: 'ES701', name: 'Las Palmas' },
  { code: 'ES413', name: 'León' },
  { code: 'ES513', name: 'Lleida' },
  { code: 'ES112', name: 'Lugo' },
  { code: 'ES300', name: 'Madrid' },
  { code: 'ES617', name: 'Málaga' },
  { code: 'ES640', name: 'Melilla' },
  { code: 'ES620', name: 'Murcia' },
  { code: 'ES220', name: 'Navarra' },
  { code: 'ES113', name: 'Ourense' },
  { code: 'ES414', name: 'Palencia' },
  { code: 'ES114', name: 'Pontevedra' },
  { code: 'ES415', name: 'Salamanca' },
  { code: 'ES702', name: 'Santa Cruz de Tenerife' },
  { code: 'ES416', name: 'Segovia' },
  { code: 'ES618', name: 'Sevilla' },
  { code: 'ES417', name: 'Soria' },
  { code: 'ES514', name: 'Tarragona' },
  { code: 'ES242', name: 'Teruel' },
  { code: 'ES425', name: 'Toledo' },
  { code: 'ES523', name: 'Valencia' },
  { code: 'ES418', name: 'Valladolid' },
  { code: 'ES213', name: 'Vizcaya' },
  { code: 'ES419', name: 'Zamora' },
  { code: 'ES243', name: 'Zaragoza' },
]

export default function FilterForm({ initialFilters }: FilterFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  
  const [filters, setFilters] = useState({
    cpvCodes: initialFilters.cpvCodes || [],
    cpvSearch: initialFilters.cpvSearch || '',
    province: initialFilters.province || '',
    busqueda: initialFilters.busqueda || initialFilters.q || '',
    mostrarFinalizadas: initialFilters.mostrarFinalizadas || false
  })

  // Efecto para manejar la hidratación
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Sincronizar con URL cuando cambie externamente (navegación, etc.)
  // Solo cuando searchParams cambie, no cuando filters.busqueda cambie
  useEffect(() => {
    const urlBusqueda = searchParams.get('busqueda') || ''
    const urlProvince = searchParams.get('province') || ''
    
    setFilters(prev => {
      const updates: Partial<typeof prev> = {}
      
      // Solo actualizar si realmente es diferente
      if (prev.busqueda !== urlBusqueda) {
        updates.busqueda = urlBusqueda
      }
      if (prev.province !== urlProvince) {
        updates.province = urlProvince
      }
      
      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev
    })
  }, [searchParams])

  const debouncedBusqueda = useDebounce(filters.busqueda, 300)
  
  // Manejar cambio de provincia inmediatamente
  const handleProvinceChange = (newProvince: string) => {
    // Convertir "all" a cadena vacía para la URL
    const provinceValue = newProvince === 'all' ? '' : newProvince
    setFilters(prev => ({ ...prev, province: provinceValue }))
    
    const newParams = new URLSearchParams()
    
    // Preservar otros parámetros existentes excepto 'page'
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'province') {
        newParams.set(key, value)
      }
    })
    
    // Agregar nuevo parámetro de provincia si existe (y no es "all")
    if (provinceValue) {
      newParams.set('province', provinceValue)
    }
    
    const newUrl = `${window.location.pathname}?${newParams.toString()}`
    router.replace(newUrl, { scroll: false })
  }
  
  useEffect(() => {
    // Solo actualizar URL cuando el valor debounced cambie realmente
    const currentBusqueda = searchParams.get('busqueda') || ''
    const newBusqueda = debouncedBusqueda.trim()
    
    // Evitar actualizaciones si no hay cambio real
    if (currentBusqueda === newBusqueda) {
      return
    }
    
    const newParams = new URLSearchParams()
    
    // Preservar otros parámetros existentes excepto 'page'
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'busqueda') {
        newParams.set(key, value)
      }
    })
    
    // Agregar nuevo parámetro de búsqueda si existe
    if (newBusqueda) {
      newParams.set('busqueda', newBusqueda)
    }
    
    const newUrl = `${window.location.pathname}?${newParams.toString()}`
    router.replace(newUrl, { scroll: false })
  }, [debouncedBusqueda, router, searchParams])
  
  return (
    <div className="max-w-full mx-auto">
      <div className="flex items-center gap-4">
        <div className="min-w-0 w-48">
          {mounted ? (
            <Select value={filters.province || 'all'} onValueChange={handleProvinceChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar provincia" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCIAS.map(provincia => (
                  <SelectItem key={provincia.code} value={provincia.code}>
                    {provincia.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="w-full h-9 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white flex items-center">
              <span className="text-gray-500">
                {filters.province ? PROVINCIAS.find(p => p.code === filters.province)?.name || 'Seleccionar provincia' : 'Todas las provincias'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <input
            id="busqueda"
            type="text"
            placeholder="Buscar por título, organismo, CPV, territorio..."
            value={filters.busqueda}
            onChange={(e) => setFilters(prev => ({ ...prev, busqueda: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="button"
          onClick={() => {
            setFilters({
              cpvCodes: [],
              cpvSearch: '',
              province: '',
              busqueda: '',
              mostrarFinalizadas: false
            })
            // También limpiar URL
            router.replace(window.location.pathname, { scroll: false })
          }}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
