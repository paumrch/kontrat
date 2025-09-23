# Kontrat

A production-grade application built with modern web technologies, following Next Forge design principles.

## Technology Stack

- **Framework**: Next.js 15 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Fonts**: Geist Sans & Mono

## Design System

This project follows the Next Forge design system principles:

- Clean, minimal UI without emojis
- Small typography with careful hierarchy
- Limited color palette: black, white, and grays
- Consistent spacing and subtle shadows
- Modern, professional aesthetic

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

## 📁 Estructura del Proyecto

```text
src/
├── app/                    # App Router de Next.js
├── components/             # Componentes React
│   ├── ui/                # Componentes de shadcn/ui
│   └── AuthForm.tsx       # Componente de autenticación
├── hooks/                 # Hooks personalizados
│   └── useAuth.ts         # Hook de autenticación
├── lib/                   # Librerías y utilidades
│   ├── utils.ts           # Utilidades de shadcn/ui
│   └── supabase.ts        # Cliente de Supabase
└── types/                 # Tipos de TypeScript
    └── database.types.ts  # Tipos de la base de datos
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
