'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { formatCPVDisplay } from '@/utils/cpv'
import { useCPVDescriptions } from '@/hooks/useCPVDescriptions'

interface Filters {
  cpvCodes: string[]
  cpvSearch: string  
  province: string
  busqueda: string
  mostrarFinalizadas: boolean
}

interface FilterSidebarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  uniqueCPVs: string[]
}

// Mapeo de provincias españolas - idéntico a /content
const PROVINCES = [
  { code: 'ES111', name: 'La Coruña' },
  { code: 'ES112', name: 'Lugo' },
  { code: 'ES113', name: 'Orense' },
  { code: 'ES114', name: 'Pontevedra' },
  { code: 'ES120', name: 'Principado de Asturias' },
  { code: 'ES130', name: 'Cantabria' },
  { code: 'ES211', name: 'Álava' },
  { code: 'ES212', name: 'Guipúzcoa' },
  { code: 'ES213', name: 'Vizcaya' },
  { code: 'ES220', name: 'Comunidad Foral de Navarra' },
  { code: 'ES230', name: 'La Rioja' },
  { code: 'ES241', name: 'Huesca' },
  { code: 'ES242', name: 'Teruel' },
  { code: 'ES243', name: 'Zaragoza' },
  { code: 'ES300', name: 'Comunidad de Madrid' },
  { code: 'ES411', name: 'Ávila' },
  { code: 'ES412', name: 'Burgos' },
  { code: 'ES413', name: 'León' },
  { code: 'ES414', name: 'Palencia' },
  { code: 'ES415', name: 'Salamanca' },
  { code: 'ES416', name: 'Segovia' },
  { code: 'ES417', name: 'Soria' },
  { code: 'ES418', name: 'Valladolid' },
  { code: 'ES419', name: 'Zamora' },
  { code: 'ES421', name: 'Albacete' },
  { code: 'ES422', name: 'Ciudad Real' },
  { code: 'ES423', name: 'Cuenca' },
  { code: 'ES424', name: 'Guadalajara' },
  { code: 'ES425', name: 'Toledo' },
  { code: 'ES431', name: 'Badajoz' },
  { code: 'ES432', name: 'Cáceres' },
  { code: 'ES511', name: 'Barcelona' },
  { code: 'ES512', name: 'Gerona' },
  { code: 'ES513', name: 'Lérida' },
  { code: 'ES514', name: 'Tarragona' },
  { code: 'ES521', name: 'Alicante' },
  { code: 'ES522', name: 'Castellón' },
  { code: 'ES523', name: 'Valencia' },
  { code: 'ES531', name: 'Ibiza y Formentera' },
  { code: 'ES532', name: 'Mallorca' },
  { code: 'ES533', name: 'Menorca' },
  { code: 'ES611', name: 'Almería' },
  { code: 'ES612', name: 'Cádiz' },
  { code: 'ES613', name: 'Córdoba' },
  { code: 'ES614', name: 'Granada' },
  { code: 'ES615', name: 'Huelva' },
  { code: 'ES616', name: 'Jaén' },
  { code: 'ES617', name: 'Málaga' },
  { code: 'ES618', name: 'Sevilla' },
  { code: 'ES620', name: 'Región de Murcia' },
  { code: 'ES630', name: 'Ceuta' },
  { code: 'ES640', name: 'Melilla' },
  { code: 'ES703', name: 'El Hierro' },
  { code: 'ES704', name: 'Fuerteventura' },
  { code: 'ES705', name: 'Gran Canaria' },
  { code: 'ES706', name: 'La Gomera' },
  { code: 'ES707', name: 'La Palma' },
  { code: 'ES708', name: 'Lanzarote' },
  { code: 'ES709', name: 'Tenerife' }
].sort((a, b) => a.name.localeCompare(b.name))

/**
 * Sidebar de filtros - réplica exacta de la UI de /content
 * Client Component necesario para inputs controlados
 */
export default function FilterSidebar({ filters, onFiltersChange, uniqueCPVs }: FilterSidebarProps) {
  // Cargar descripciones CPV igual que en /content
  const { cpvDescriptions } = useCPVDescriptions(uniqueCPVs)

  const clearFilters = () => {
    onFiltersChange({
      cpvCodes: [],
      cpvSearch: '',
      province: '',
      busqueda: '',
      mostrarFinalizadas: false
    })
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Filtro Búsqueda General - idéntico a /content */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-900">Búsqueda</label>
        <input
          type="text"
          placeholder="Buscar por organismo o título..."
          value={filters.busqueda}
          onChange={(e) => onFiltersChange({ ...filters, busqueda: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-md text-xs text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
        />
      </div>

      {/* Toggle Licitaciones Finalizadas - idéntico a /content */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-900">Incluir finalizadas</label>
        <div className="flex items-center space-x-3">
          <Switch
            id="mostrarFinalizadas"
            checked={filters.mostrarFinalizadas}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, mostrarFinalizadas: checked })}
          />
          <label htmlFor="mostrarFinalizadas" className="text-xs text-gray-700 cursor-pointer">
            Mostrar finalizadas recientemente (máximo 7 días desde su finalización)
          </label>
        </div>
      </div>

      {/* Filtro Provincia - idéntico a /content */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-900">Provincia</label>
        <Select 
          value={filters.province || 'all'} 
          onValueChange={(value) => onFiltersChange({ ...filters, province: value === 'all' ? '' : value })}
        >
          <SelectTrigger className="bg-white border-gray-200 text-gray-900 w-full">
            <SelectValue placeholder="Todas las provincias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las provincias</SelectItem>
            {PROVINCES.map(province => (
              <SelectItem key={province.code} value={province.code}>{province.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro CPV con búsqueda - idéntico a /content */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-900">Categorías CPV</label>
          {filters.cpvCodes.length > 0 && (
            <button
              onClick={() => onFiltersChange({ ...filters, cpvCodes: [] })}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Limpiar ({filters.cpvCodes.length})
            </button>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Buscar por nombre de categoría..."
            value={filters.cpvSearch}
            onChange={(e) => onFiltersChange({ ...filters, cpvSearch: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
          {uniqueCPVs
            .filter(cpv => {
              if (!filters.cpvSearch) return true;
              const cpvInfo = cpvDescriptions.get(cpv);
              const description = cpvInfo?.description || formatCPVDisplay(cpv).description;
              return description.toLowerCase().includes(filters.cpvSearch.toLowerCase()) ||
                     cpv.includes(filters.cpvSearch);
            })
            .map(cpv => {
              const cpvInfo = cpvDescriptions.get(cpv) || formatCPVDisplay(cpv);
              return (
                <label key={cpv} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.cpvCodes.includes(cpv)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onFiltersChange({ ...filters, cpvCodes: [...filters.cpvCodes, cpv] });
                      } else {
                        onFiltersChange({ ...filters, cpvCodes: filters.cpvCodes.filter(c => c !== cpv) });
                      }
                    }}
                    className="mt-0.5 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900 font-medium leading-tight">
                      {cpvInfo.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {cpv}
                    </div>
                  </div>
                </label>
              );
            })
          }
        </div>
      </div>

      {/* Botón limpiar filtros - idéntico a /content */}
      <Button 
        variant="outline" 
        onClick={clearFilters} 
        className="w-full border-gray-200 text-gray-900 hover:bg-gray-50 text-xs"
      >
        Limpiar Filtros
      </Button>
    </div>
  )
}