# Sistema de Paginación Server-Side con RSC + SSR

## Resumen

Implementación completa de **paginación server-side** para licitaciones públicas usando **Next.js 15 App Router**, **React Server Components (RSC)** y **Server Actions**. La primera página se renderiza con **SSR** y las páginas adicionales se cargan progresivamente mediante Server Actions para optimizar el rendimiento y manejar grandes volúmenes de datos de Supabase.

## Arquitectura

### 1. **Server Helper** (`/lib/server/getLicitacionesPage.ts`)
- **Función principal**: `getLicitacionesPage(page, pageSize)`
- **Paginación PostgREST**: Usa `range(from, to)` para superar límite de 1000 registros
- **Cliente Supabase** optimizado para servidor con variables de entorno
- **Error handling** robusto y cálculo automático de `hasMore`

### 2. **Server Actions** (`/app/(dashboard)/licitaciones/actions.ts`)
- **Directiva**: `'use server'` al inicio del archivo
- **Función**: `loadMore(page)` - envuelve `getLicitacionesPage` para Client Components
- **Typescript** totalmente tipado con `Database['public']['Tables']['licitaciones']['Row']`

### 3. **Componentes UI**
- **`Table.tsx`**: Server Component con skeleton states y accesibilidad
- **`LoadMoreButton.tsx`**: Client Component aislado para interactividad
- **`LicitacionesWrapper.tsx`**: Client Component para manejo de estado de paginación
- **`page.tsx`**: Página principal con SSR para primer batch

### 4. **Utilidades** (`/lib/utils.ts`)
- **`formatCurrency()`**: Formato EUR españo
- **`formatDate()`**: Formato fecha local español

## Características Técnicas

- ✅ **RSC + SSR**: Primera página server-rendered, cargas progresivas con Server Actions
- ✅ **TypeScript**: Interfaces completas con tipos de base de datos
- ✅ **Supabase**: PostgREST paginación con `range()`, manejo de límites de 1000
- ✅ **Performance**: Skeleton states, lazy loading, error boundaries
- ✅ **Accesibilidad**: ARIA labels, semantic HTML, keyboard navigation
- ✅ **Design System**: Paleta gris exclusiva, shadcn/ui components

## Estado de Implementación

**✅ COMPLETADO** - Sistema completamente funcional y compilado exitosamente.