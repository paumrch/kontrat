import { supabase } from '@/lib/supabase'
// import { Database } from '@/types/database.types'

// Tipos de conveniencia
// type Tables = Database['public']['Tables']

/**
 * Función utilitaria para manejar errores de Supabase
 */
export function handleSupabaseError(error: Error | null) {
  if (error) {
    console.error('Error de Supabase:', error.message)
    throw new Error(error.message)
  }
}

/**
 * Función para obtener el usuario actual
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  handleSupabaseError(error)
  return user
}

/**
 * Función para verificar si el usuario está autenticado
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Función para cerrar sesión
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  handleSupabaseError(error)
}

/**
 * Función para registrar un nuevo usuario
 */
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  handleSupabaseError(error)
  return data
}

/**
 * Función para iniciar sesión
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  handleSupabaseError(error)
  return data
}

// Ejemplo de función para operaciones de base de datos
// Descomenta y adapta según tus necesidades:

/*
export async function getProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
  
  handleSupabaseError(error)
  return data
}

export async function createProfile(profile: Tables['profiles']['Insert']) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single()
  
  handleSupabaseError(error)
  return data
}

export async function updateProfile(
  id: string, 
  updates: Tables['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  handleSupabaseError(error)
  return data
}
*/