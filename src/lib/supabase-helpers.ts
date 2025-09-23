import { supabase } from '@/lib/supabase'

// Tipos para las operaciones de autenticación
export interface AuthResponse {
  success: boolean
  error?: string
  data?: unknown
}

// Utilidades para la autenticación
export const auth = {
  // Registrar usuario
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Iniciar sesión
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Cerrar sesión
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, data: user }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Restablecer contraseña
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  }
}

// Utilidades para operaciones de base de datos
// Nota: Estas son funciones de ejemplo. Una vez que definas tus tablas en Supabase,
// puedes generar tipos automáticamente y reemplazar estas funciones genéricas
export const database = {
  // Función genérica para obtener datos de cualquier tabla
  async getFromTable(tableName: string, columns = '*') {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Función genérica para insertar datos
  async insertIntoTable(tableName: string, data: Record<string, unknown>) {
    try {
      // Usar any para evitar errores de tipos hasta que se definan las tablas
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: insertedData, error } = await (supabase as any)
        .from(tableName)
        .insert(data)
        .select()
      
      if (error) {
        throw error
      }
      
      return { success: true, data: insertedData }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Función genérica para actualizar datos
  async updateInTable(
    tableName: string, 
    updates: Record<string, unknown>, 
    condition: Record<string, unknown>
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from(tableName).update(updates)
      
      // Aplicar condiciones
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query.select()
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  },

  // Función genérica para eliminar datos
  async deleteFromTable(tableName: string, condition: Record<string, unknown>) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let query = (supabase as any).from(tableName).delete()
      
      // Aplicar condiciones
      Object.entries(condition).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query.select()
      
      if (error) {
        throw error
      }
      
      return { success: true, data }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }
    }
  }
}