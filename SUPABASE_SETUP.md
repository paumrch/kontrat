# Configuración de Supabase para Kontrat

## 📋 Pasos para configurar tu base de datos

### 1. Configuración inicial completada ✅
- ✅ Variables de entorno configuradas
- ✅ Cliente de Supabase inicializado
- ✅ Hook de autenticación creado
- ✅ Componente de autenticación implementado

### 2. Próximos pasos para tu base de datos

#### Crear tablas en Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a "Table Editor"
3. Crea las tablas que necesites para tu aplicación

#### Ejemplo: Tabla de usuarios (opcional)
```sql
-- Tabla de perfiles de usuario (extiende auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,

  PRIMARY KEY (id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### Generar tipos TypeScript automáticamente
Una vez que hayas creado tus tablas, puedes generar los tipos automáticamente:

```bash
# Instalar Supabase CLI
npm install -g supabase

# Generar tipos
npx supabase gen types typescript --project-id nftaulokibmzwaqkxmbt > src/types/database.types.ts
```

#### Configurar Row Level Security (RLS)
Es altamente recomendado habilitar RLS en todas tus tablas:

```sql
-- Habilitar RLS en una tabla
ALTER TABLE tu_tabla ENABLE ROW LEVEL SECURITY;

-- Crear política de ejemplo (solo el usuario puede ver sus propios datos)
CREATE POLICY "Users can view own data" ON tu_tabla
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. Configuración de autenticación

#### Configurar URLs de redirección
1. Ve a Authentication > Settings
2. Agrega estas URLs:
   - Site URL: `http://localhost:3001` (desarrollo)
   - Site URL: `https://tu-dominio.com` (producción)

#### Configurar proveedores OAuth (opcional)
Si quieres usar login con Google, GitHub, etc.:
1. Ve a Authentication > Providers
2. Habilita los proveedores que desees
3. Configura las credenciales OAuth

### 4. Funciones avanzadas de Supabase

#### Storage (almacenamiento de archivos)
```typescript
// Ejemplo de upload de archivo
import { supabase } from '@/lib/supabase'

const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)
  
  if (error) {
    console.error('Error uploading file:', error)
    return null
  }
  
  return data
}
```

#### Realtime (actualizaciones en tiempo real)
```typescript
// Ejemplo de suscripción a cambios en tiempo real
import { supabase } from '@/lib/supabase'

const subscribeToChanges = () => {
  const subscription = supabase
    .channel('table-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'tu_tabla' },
      (payload) => {
        console.log('Change received!', payload)
      }
    )
    .subscribe()

  return () => subscription.unsubscribe()
}
```

### 5. Mejores prácticas de seguridad

1. **Nunca expongas service_role_key** en el frontend
2. **Usa RLS** en todas las tablas sensibles
3. **Valida datos** tanto en frontend como backend
4. **Usa políticas restrictivas** por defecto
5. **Audita permisos** regularmente

### 6. Recursos útiles

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de autenticación](https://supabase.com/docs/guides/auth)
- [Guía de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Ejemplos de aplicaciones](https://github.com/supabase/supabase/tree/master/examples)

## 🎯 Tu aplicación ya está lista para comenzar a trabajar con Supabase!

El formulario de autenticación en la página principal ya está conectado a tu proyecto de Supabase. Puedes:
1. Registrar nuevos usuarios
2. Iniciar sesión
3. Cerrar sesión

Una vez que tengas tus tablas configuradas, podrás usar las funciones en `src/lib/supabase-helpers.ts` para interactuar con tu base de datos.