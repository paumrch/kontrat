import { useState, useEffect } from 'react'

/**
 * Hook personalizado para debounce - evita llamadas frecuentes durante escritura
 * @param value - Valor a hacer debounce
 * @param delay - Delay en millisegundos (por defecto 500ms)
 * @returns Valor con debounce aplicado
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Crear timer para actualizar el valor debounced después del delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup: cancelar timer si value cambia antes del delay
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}