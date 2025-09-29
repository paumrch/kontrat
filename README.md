# MRCH - Sistema de Licitaciones Públicas V2.1

Una aplicación de producción moderna para la gestión y consulta de licitaciones públicas españolas, construida con las últimas tecnologías web.

## ✨ Características V2.1

### 🔍 **Búsqueda Avanzada**
- **Búsqueda multícampo**: Título, organismo, código CPV, descripción CPV, código NUTS, territorio
- **Búsqueda server-side** optimizada con rendimiento de base de datos
- **Debounce de 300ms** para evitar consultas excesivas
- **Sincronización con URL** para compartir búsquedas

### 🎯 **Filtros Inteligentes**  
- **SSR (Server-Side Rendering)** completo para filtros en tiempo real
- **Filtro de Provincias**: Selector con 52 provincias españolas ordenadas alfabéticamente
- **Componentes shadcn/ui**: Select component moderno con mejor UX
- **Paginación optimizada** con streaming de datos (100 registros/página)
- **Mapeo NUTS automatizado** con códigos de territorio españoles (ES111-ES702)
- **Descriptions CPV precomputadas** para mejor rendimiento

### 💻 **Interfaz Renovada**
- **Layout minimalista** sin sidebar, filtros integrados arriba
- **Logo MRCH profesional** en header y footer con optimización SVG
- **Footer horizontal** con logo y copyright
- **Bordes suaves (rounded-sm)** para una apariencia más refinada
- **Diseño responsive** optimizado para móvil y desktop

### ⚡ **Performance & Arquitectura**
- **Next.js 15 con Turbopack** para builds ultra-rápidos
- **Componentes Server/Client híbridos** con Suspense streaming
- **Sin errores de hidratación** con renderizado condicional
- **Single request por filtro** con optimización de consultas SQL
- **Paginación real server-side** (no mock client-side)

## Technology Stack

- **Framework**: Next.js 15 con Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4  
- **Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Performance**: SSR + RSC + Streaming

## Prerequisites

- Node.js 18+
- npm o yarn
- Cuenta de Supabase

## 🛠️ Instalación

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/paumrch/kontrat.git
   cd kontrat
   ```

2. **Instala las dependencias**:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:

   ```bash
   cp .env.local.example .env.local
   ```
   
   Edita `.env.local` con tus credenciales de Supabase:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio_de_supabase
   ```

4. **Ejecuta el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

## 🗄️ Configuración de Supabase

1. **Crea un nuevo proyecto** en [Supabase](https://supabase.com)

2. **Obtén tus credenciales**:
   - Ve a Settings > API
   - Copia la `URL` y `anon` key
   - Copia la `service_role` key (opcional)

3. **Configura la autenticación**:
   - Ve a Authentication > Settings
   - Configura tu URL del sitio: `http://localhost:3000`

4. **Actualiza los tipos de base de datos**:

   ```bash
   npx supabase gen types typescript --project-id tu-project-id > src/types/database.types.ts
   ```

## 📁 Estructura del Proyecto V2

```text
src/
├── app/                                    # App Router Next.js 15
│   ├── (dashboard)/licitaciones/          # Página principal de licitaciones
│   │   ├── _components/                   # Componentes específicos
│   │   │   ├── FilterForm.tsx            # Formulario de filtros expandido
│   │   │   ├── LicitacionesTable.tsx     # Tabla con paginación SSR
│   │   │   └── LicitacionesSkeleton.tsx  # Loading states
│   │   └── page.tsx                      # Página SSR optimizada
│   ├── api/cpv/                          # API route para códigos CPV
│   ├── login/ & register/                # Autenticación
│   └── layout.tsx                        # Layout global
├── components/                            # Componentes globales
│   ├── ui/                               # shadcn/ui components
│   ├── Header.tsx                        # Header con branding MRCH
│   └── footer.tsx                        # Footer minimalista V2
├── lib/
│   ├── server/                           # Lógica server-side
│   │   ├── getLicitacionesPage.ts       # Paginación optimizada
│   │   ├── buildLicitacionesQuery.ts    # Constructor de queries
│   │   └── cpv-dict.ts                  # Diccionario CPV
│   ├── shared/                          # Tipos compartidos
│   └── supabase.ts                      # Cliente Supabase
├── utils/
│   ├── nuts.ts                          # Mapeo NUTS España
│   └── cpv.ts                           # Utilidades CPV
└── types/
    └── database.types.ts                # Tipos de DB autogenerados
```

## 🎨 Componentes Disponibles

Los siguientes componentes de shadcn/ui están instalados:

- Button
- Card
- Input
- Label
- Textarea

Para instalar más componentes:

```bash
npx shadcn@latest add [component-name]
```

## 🔒 Autenticación

El proyecto incluye un sistema de autenticación completo con:

- Registro de usuarios
- Inicio de sesión
- Cierre de sesión
- Estado de autenticación reactivo

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a [Vercel](https://vercel.com)
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Otras plataformas

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.
## 📋 Changelog

### V2.1.0 - Diciembre 2025
- ✅ **Filtro de Provincias**: Selector con las 52 provincias españolas ordenadas alfabéticamente
- ✅ **Componente shadcn/ui**: Implementación del Select component moderno
- ✅ **Logo Profesional**: Integración del logo MRCH en formato SVG en header y footer
- ✅ **Optimización de Hidratación**: Eliminación de errores de server-client mismatch
- ✅ **Limpieza de Código**: Eliminación de componentes obsoletos (FilterSidebar)
- ✅ **Código NUTS Mejorado**: Soporte completo para códigos nivel 3 (provincias individuales)

### V2.0.0 - Noviembre 2025
- ✅ **Sistema de Filtros SSR**: Filtrado en tiempo real sin recarga manual
- ✅ **Búsqueda Expandida**: 6 campos simultáneos con debouncing
- ✅ **UI Renovada**: Layout horizontal, eliminación de sidebar
- ✅ **Performance**: Optimización de consultas SQL y paginación server-side
- ✅ **Next.js 15**: Migración a App Router con Turbopack

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, puedes:

- Abrir un issue en GitHub
- Consultar la [documentación de Next.js](https://nextjs.org/docs)
- Consultar la [documentación de Supabase](https://supabase.com/docs)
- Consultar la [documentación de shadcn/ui](https://ui.shadcn.com)
