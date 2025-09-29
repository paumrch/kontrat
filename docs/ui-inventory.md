# UI Inventory - Original Licitaciones Filters

## 📋 Reference: /src/app/content/page.tsx

### 🎯 Layout Structure
```
div.pt-14
  div.flex.h-screen.bg-gray-50
    // Sidebar (w-80 bg-white border-r border-gray-200)
    // Main Content (flex-1 flex flex-col)
```

### 🔍 Filters - Exact Order & Labels
1. **Búsqueda General**
   - Label: "Búsqueda" (text-xs font-medium text-gray-900)  
   - Input: placeholder="Buscar por organismo o título..."
   - Value: `filters.busqueda`
   - Class: w-full px-3 py-2 border border-gray-200 rounded-md text-xs

2. **Toggle Finalizadas**
   - Label: "Incluir finalizadas" (text-xs font-medium text-gray-900)
   - Switch component + label text
   - Value: `filters.mostrarFinalizadas`
   - Label text: "Mostrar finalizadas recientemente (máximo 7 días desde su finalización)"

3. **Provincia (NUTS)**
   - Label: "Provincia" (text-xs font-medium text-gray-900)
   - Select component, placeholder="Todas las provincias"
   - Value: `filters.province`
   - Options: PROVINCES array with code/name
   - Special: "Todas las provincias" = 'all' value

4. **CPV Categories**
   - Label: "Categorías CPV" (text-xs font-medium text-gray-900)
   - Clear button: "Limpiar ({count})" when filters.cpvCodes.length > 0
   - Search input: placeholder="Buscar por nombre de categoría..."
   - Checkbox list: max-h-48 overflow-y-auto in border box
   - Value: `filters.cpvCodes` (array), `filters.cpvSearch` (string)

5. **Clear All Button**
   - Button variant="outline": "Limpiar Filtros"
   - Full width: w-full

### 🏷️ NUTS Provinces - Complete List
```ts
const PROVINCES = [
  { code: 'ES111', name: 'La Coruña' },
  // ... 69 total provinces (exact same order)
].sort((a, b) => a.name.localeCompare(b.name))
```

### 🎨 Color Scheme (Strict)
- Background: white, gray-50
- Text: gray-900, gray-600, gray-700, gray-500
- Borders: border-gray-200, border-gray-300
- Focus: focus:ring-gray-400, focus:ring-gray-500
- No other colors allowed

### 📊 Filter Logic
- CPV: startsWith matching for prefixes
- Province: nuts_code?.includes(filters.province) 
- Búsqueda: ilike on contracting_party_name OR project_name
- Finalizadas: fecha_fin_presentacion >= (today - 7 days)

### 🗂️ State Structure
```ts
interface Filters {
  cpvCodes: string[]        // CPV prefixes selected
  cpvSearch: string        // Search within CPV descriptions  
  province: string         // NUTS code selected
  busqueda: string         // General search text
  mostrarFinalizadas: boolean // Include recent finalized
}
```

### 🎯 Behavior Requirements
- Reset currentPage to 1 when filters change
- Debounce search inputs (200-300ms recommended)
- Persist to URL with same parameter names as original
- Server-side filtering only (no client processing of large datasets)
- Support NUTS eq/prefix logic: ES523 = exact, ES5 = prefix

### 🔄 Data Flow
1. SSR: Parse searchParams → filters → getLicitacionesPage(page=0)
2. Client: Filter changes → Server Action → append new rows  
3. URL sync: Filter state ↔ searchParams (bidirectional)

## ✅ Acceptance Criteria
- [ ] Identical DOM structure and classes
- [ ] Same labels, placeholders, and order  
- [ ] All 4 filters: CPV, Organismo, Título, Provincia=NUTS
- [ ] Server-side filtering with 100-200 record batches
- [ ] No colors outside gray palette
- [ ] No schema changes to Supabase