interface LicitacionesLayoutProps {
  sidebar: React.ReactNode
  header: React.ReactNode
  content: React.ReactNode
  pagination?: React.ReactNode
}

/**
 * Layout principal que replica exactamente la estructura de /content
 * Sidebar fijo + contenido principal con header, lista y paginación
 */
export default function LicitacionesLayout({ 
  sidebar, 
  header, 
  content, 
  pagination 
}: LicitacionesLayoutProps) {
  return (
    <div className="pt-14">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - réplica exacta de /content */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {sidebar}
        </div>

        {/* Contenido Principal - estructura idéntica */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            {header}
          </div>

          {/* Lista de Licitaciones */}
          <div className="flex-1 overflow-auto">
            {content}
          </div>

          {/* Paginación */}
          {pagination && (
            <div className="bg-white border-t border-gray-200 px-8 py-4">
              {pagination}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}