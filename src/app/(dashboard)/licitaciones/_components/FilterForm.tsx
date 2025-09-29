'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { LicitacionesFilters } from '@/lib/shared/licitaciones-types'

interface FilterFormProps {
  initialFilters: LicitacionesFilters
  uniqueCPVs: string[]
}

export default function FilterForm({ initialFilters }: FilterFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    cpvCodes: initialFilters.cpvCodes || [],
    cpvSearch: initialFilters.cpvSearch || '',
    province: initialFilters.province || '',
    busqueda: initialFilters.busqueda || initialFilters.q || '',
    mostrarFinalizadas: initialFilters.mostrarFinalizadas || false
  })
  
  // Sincronizar con URL cuando cambie externamente (navegación, etc.)
  // Solo cuando searchParams cambie, no cuando filters.busqueda cambie
  useEffect(() => {
    const urlBusqueda = searchParams.get('busqueda') || ''
    setFilters(prev => {
      // Solo actualizar si realmente es diferente
      if (prev.busqueda !== urlBusqueda) {
        return { ...prev, busqueda: urlBusqueda }
      }
      return prev
    })
  }, [searchParams])
  
  const debouncedBusqueda = useDebounce(filters.busqueda, 300)
  
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
          onClick={() => setFilters({
            cpvCodes: [],
            cpvSearch: '',
            province: '',
            busqueda: '',
            mostrarFinalizadas: false
          })}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          Limpiar
        </button>
      </div>
    </div>
  )
}
