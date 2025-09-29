# Licitaciones Architecture - Next.js 15 + Supabase SSR

## **Overview**

Server-side rendered filtering system with incremental loading, built on Next.js 15 App Router + Supabase. Processes 4,000+ licitaciones with performance-first pagination (100-200 records/load).

## **Architecture Decisions**

### **SSR + RSC (React Server Components)**
- **Why**: Optimal SEO, faster initial load, server-side filtering
- **Trade-off**: Slightly more complex state management vs full client-side
- **Implementation**: `dynamic = 'force-dynamic'` ensures fresh data on filter changes

### **Server Actions for Pagination** 
- **Why**: Seamless incremental loading without full page reloads
- **Trade-off**: Next.js 15 specific vs universal REST API
- **Implementation**: `loadMore()` Server Action maintains active filters + page state

### **Performance Limits**
- **Page Size**: 100-200 records maximum per load
- **Why**: Prevent UI freezing, maintain responsive UX with large datasets
- **Trade-off**: Multiple requests vs single large payload
- **Alternative Rejected**: Client-side pagination (too slow with 4K+ records)

### **Supabase Query Optimization**
- **Column Selection**: Specific fields only (`id`, `project_name`, `cpv_code`, etc.) 
- **Why**: Reduce bandwidth, faster serialization
- **Trade-off**: Manual column management vs `select('*')` convenience
- **Filters**: Server-side with `eq()`, `ilike()`, `like()`, `range()` - no client-side processing

### **Cache Strategy**
- **SSR Cache**: `revalidate = 0` + `dynamic = 'force-dynamic'`  
- **Why**: Filters must show immediate results
- **Trade-off**: Fresh data on every request vs caching performance
- **CPV Dictionary**: Server-side memory cache (9K+ entries)

## **Data Flow**

```
[FilterForm] → [URLSearchParams] → [SSR Parse] → [Supabase Query] → [Render]
     ↓              ↓                    ↓             ↓              ↓
 Client State → router.push() → buildFilters() → applyFilters() → JSX + Data
```

## **Key Components**

- `page.tsx`: SSR entry point, handles searchParams → filters → initial data
- `FilterForm.tsx`: Client island for input debouncing + URL sync  
- `buildLicitacionesQuery.ts`: URLSearchParams parser + Supabase query builder
- `getLicitacionesPage.ts`: Core pagination engine with filter application
- `actions.ts`: Server Actions for incremental loading

## **Filter Capabilities**

- **General Search** (`busqueda`): ILIKE across `project_name` + `contracting_party_name`
- **Province** (`province`): NUTS code matching with level detection (ES523 → level 3)
- **CPV Codes** (`cpvCodes`): Array support with prefix matching (`45000000%`)
- **Date Range** (`mostrarFinalizadas`): Active vs recent finalized logic

## **Verification Status**: ✅ FUNCTIONAL
Server logs confirm: SearchParams parsing ✅, Filter application ✅, Query execution ✅