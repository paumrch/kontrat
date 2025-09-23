import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Por ahora, un middleware simple que permite todas las rutas
  // En producción, aquí podrías implementar lógica de autenticación del servidor
  
  const { pathname } = request.nextUrl
  
  // Permitir acceso a todas las rutas por ahora
  // La autenticación se maneja en el cliente con el AuthContext
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}