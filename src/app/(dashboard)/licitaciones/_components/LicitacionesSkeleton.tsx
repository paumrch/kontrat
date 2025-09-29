'use client'

/**
 * Skeleton loading para tabla de licitaciones
 * Mejora TTFB percibido mientras carga SSR/streaming
 */
export default function LicitacionesSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
      
      {/* Table skeleton */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-4 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="col-span-3 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="col-span-2 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="col-span-2 h-4 bg-gray-300 rounded animate-pulse" />
            <div className="col-span-1 h-4 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Table rows skeleton */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-12 gap-4 p-4">
              <div className="col-span-4 space-y-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-gray-150 rounded animate-pulse" />
              </div>
              <div className="col-span-3 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="col-span-1 h-8 w-8 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}