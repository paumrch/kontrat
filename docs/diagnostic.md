# Diagnostic Report - Filtros SSR Deep Analysis

## 🔍 TRAZABILIDAD ACTUAL DE FILTROS

### **Ruta de Datos por Filtro:**

#### 1. **Búsqueda General (`q`)**
- **UI**: `FilterForm.tsx` → input con debounce 300ms → `setFilters({busqueda})` 
- **URL**: `useEffect` → `router.push()` + `router.refresh()` → `?busqueda=valor`
- **SSR**: `page.tsx` → `buildFiltersFromSearchParams()` → `filters.q = searchParams.get('busqueda')`
- **Query**: `applyFiltersToSupabase()` → `query.or('contracting_party_name.ilike.%term%,project_name.ilike.%term%')`
- **DB**: Supabase ejecuta ILIKE en 2 campos
- **Render**: `getLicitacionesPage()` → resultados filtrados

#### 2. **Provincia NUTS (`province`)**  
- **UI**: `FilterForm.tsx` → Select onChange → `setFilters({province})`
- **URL**: `useEffect` → `router.push()` + `router.refresh()` → `?province=ES523`
- **SSR**: `buildFiltersFromSearchParams()` → `filters.province = 'ES523'` + `filters.nuts = {level:3, code:'ES523', match:'eq'}`
- **Query**: `applyFiltersToSupabase()` → `query.ilike('nuts_code', '%ES523%')`
- **DB**: Supabase ejecuta nuts_code ILIKE
- **Render**: Resultados por provincia

#### 3. **CPV Categories (`cpvCodes`)**
- **UI**: Checkbox list → `setFilters({cpvCodes: [...arr]})`  
- **URL**: `JSON.stringify(cpvCodes)` → `?cpvCodes=["45000000","90000000"]`
- **SSR**: `JSON.parse(searchParams.get('cpvCodes'))` → `filters.cpvCodes`
- **Query**: `cpvCodes.map(code => cpv_code.like.${code}%).join(',')` → `query.or(conditions)`
- **DB**: Supabase ejecuta múltiples LIKE con OR
- **Render**: Resultados por CPV

#### 4. **LoadMore (incremental)**
- **Trigger**: Button click → `handleLoadMore()`
- **Action**: `loadMore({page: nextPage, filters: currentFilters, orderBy})`  
- **Server**: Recibe filtros activos → `getLicitacionesPage()` con mismo filtros + page++
- **Response**: Nuevas filas → `setData(prev => [...prev.rows, ...result.rows])`

## ❌ PROBLEMAS IDENTIFICADOS

### **1. Filtros No Actualizan Lista - CAUSAS:**

#### ✅ **Propagación URL**: FUNCIONA
- Los filtros SÍ actualizan searchParams (verificado en logs: `?busqueda=valencia`, `?province=ES523`)

#### ✅ **buildFiltersFromSearchParams**: FUNCIONA  
- Lee correctamente `busqueda`, `province`, `cpvCodes` desde URL

#### ⚠️ **applyFiltersToSupabase**: PARCIALMENTE FUNCIONA
- `q/busqueda`: OK - funciona con OR en 2 campos
- `province/NUTS`: OK - funciona con ILIKE  
- `cpvCodes`: OK - funciona con múltiples LIKE OR
- `mostrarFinalizadas`: ❌ FALTA - no se implementa lógica de fechas

#### ❌ **Cache SSR**: PROBLEMA CRÍTICO
- `router.refresh()` se llama pero Next.js 15 App Router puede estar cacheando  
- **FALTA**: `revalidate = 0` o `dynamic = 'force-dynamic'` en page.tsx
- **RESULT**: SSR no se re-ejecuta con nuevos filtros

#### ✅ **LoadMore con Filtros**: FUNCIONA
- `LicitacionesTable.handleLoadMore()` YA pasa `currentFilters` correctamente

#### ❌ **RSC/Client Mix**: PROBLEMA MENOR
- FilterForm usa estado local + useEffect, puede interferir con SSR timing

### **2. CPV Descriptions Faltantes - CAUSAS:**

#### ❌ **Diccionario No Cargado en RSC**: CRÍTICO
- `src/utils/cpv.ts` usa `fetch('/CPVs.json')` que NO funciona en Server Components
- RSC no puede hacer fetch interno, necesita `import` directo

#### ❌ **Key Mismatch**: CRÍTICO  
- **JSON**: `{"CPV": "03000000-1", "DESCRIPCION": "..."}`
- **BD**: `cpv_code = "03000000"` (sin sufijo `-1`)
- **Lookup**: `cpvDescriptions.get("03000000")` → undefined

#### ❌ **Normalización Inconsistente**: CRÍTICO
- `cleanCPVCode()` remueve `-1` pero puede fallar edge cases
- Cache client-side no se comparte con server-side
- Padding/format puede no coincidir entre JSON keys y DB values

#### ❌ **Import Path**: PROBLEMA  
- CPV utilities importados en client components, no disponibles en RSC
- Necesita versión server-side separada

### **3. UI Inconsistencies - MENORES:**

#### ✅ **shadcn/ui**: OK - usa Button, Select, Switch correctamente
#### ✅ **Colores**: OK - solo grises en FilterForm y Table  
#### ⚠️ **Focus States**: REVISAR - algunos inputs pueden no tener focus visible
#### ⚠️ **A11y**: REVISAR - falta aria-label en algunos filtros
#### ⚠️ **Loading States**: REVISAR - skeletons pueden mejorarse

## 🎯 ROOT CAUSES PRIORITIZED

### **CRÍTICO (bloquea funcionalidad):**
1. **SSR Cache**: Page no se re-renderiza con filtros nuevos
2. **CPV Dictionary**: No carga en RSC, key mismatch con BD
3. **mostrarFinalizadas**: Filtro no implementado

### **ALTO (impacta UX):**  
4. **CPV Normalization**: Edge cases en códigos con formatos raros
5. **Error States**: No hay fallbacks cuando fallan filtros

### **MEDIO (mejoras):**
6. **Focus/A11y**: Estados de foco y accesibilidad  
7. **Debug**: No hay visibilidad de qué filtros se aplican

## 🔧 SOLUCIONES REQUERIDAS

1. **Fix SSR Cache**: `export const dynamic = 'force-dynamic'` en page.tsx
2. **CPV RSC Dict**: `src/lib/server/cpv-dict.ts` con `await import()`  
3. **Normalize CPV**: Función server-side para matching consistente
4. **mostrarFinalizadas**: Implementar lógica de fechas en applyFiltersToSupabase
5. **UI Polish**: Focus states, aria-labels, loading improvements