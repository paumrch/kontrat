/**
 * Utilidades para testing y debugging del toggle de licitaciones
 */

export interface LicitacionTest {
  id: string
  fecha_fin_presentacion: string
  titulo: string
}

export interface TestScenario {
  nombre: string
  licitaciones: LicitacionTest[]
  toggleActivado: boolean
  resultadoEsperado: {
    total: number
    activas: number
    finalizadasRecientes: number
  }
}

/**
 * Genera licitaciones de prueba para testing
 */
export const generarLicitacionesPrueba = (): LicitacionTest[] => {
  const hoy = new Date()
  const datosTest: LicitacionTest[] = []

  // Licitaciones activas (futuras)
  for (let i = 1; i <= 5; i++) {
    const fechaFutura = new Date(hoy)
    fechaFutura.setDate(hoy.getDate() + i)
    datosTest.push({
      id: `activa-${i}`,
      fecha_fin_presentacion: fechaFutura.toISOString().split('T')[0],
      titulo: `Licitación Activa ${i}`
    })
  }

  // Licitaciones finalizadas recientemente (últimos 3 días)
  for (let i = 1; i <= 3; i++) {
    const fechaReciente = new Date(hoy)
    fechaReciente.setDate(hoy.getDate() - i)
    datosTest.push({
      id: `reciente-${i}`,
      fecha_fin_presentacion: fechaReciente.toISOString().split('T')[0],
      titulo: `Licitación Finalizada Hace ${i} días`
    })
  }

  // Licitaciones finalizadas antiguas (más de 7 días)
  for (let i = 8; i <= 10; i++) {
    const fechaAntigua = new Date(hoy)
    fechaAntigua.setDate(hoy.getDate() - i)
    datosTest.push({
      id: `antigua-${i}`,
      fecha_fin_presentacion: fechaAntigua.toISOString().split('T')[0],
      titulo: `Licitación Finalizada Hace ${i} días`
    })
  }

  return datosTest
}

/**
 * Define escenarios de prueba
 */
export const escenariosPrueba: TestScenario[] = [
  {
    nombre: "Toggle DESACTIVADO - Solo activas",
    licitaciones: generarLicitacionesPrueba(),
    toggleActivado: false,
    resultadoEsperado: {
      total: 5, // Solo las 5 activas
      activas: 5,
      finalizadasRecientes: 0
    }
  },
  {
    nombre: "Toggle ACTIVADO - Activas + Recientes",
    licitaciones: generarLicitacionesPrueba(),
    toggleActivado: true,
    resultadoEsperado: {
      total: 8, // 5 activas + 3 finalizadas recientes
      activas: 5,
      finalizadasRecientes: 3
    }
  }
]

/**
 * Ejecuta las validaciones de los escenarios
 */
export const validarEscenario = (escenario: TestScenario, resultado: { total: number, activas: number, finalizadas: number }) => {
  const errores: string[] = []

  if (resultado.total !== escenario.resultadoEsperado.total) {
    errores.push(`Total esperado: ${escenario.resultadoEsperado.total}, obtenido: ${resultado.total}`)
  }

  if (resultado.activas !== escenario.resultadoEsperado.activas) {
    errores.push(`Activas esperadas: ${escenario.resultadoEsperado.activas}, obtenidas: ${resultado.activas}`)
  }

  if (resultado.finalizadas !== escenario.resultadoEsperado.finalizadasRecientes) {
    errores.push(`Finalizadas recientes esperadas: ${escenario.resultadoEsperado.finalizadasRecientes}, obtenidas: ${resultado.finalizadas}`)
  }

  return {
    exito: errores.length === 0,
    errores
  }
}

/**
 * Formatear resultados de testing para consola
 */
export const formatearResultadoTest = (escenario: TestScenario, validacion: ReturnType<typeof validarEscenario>) => {
  const emoji = validacion.exito ? '✅' : '❌'
  console.log(`${emoji} ${escenario.nombre}`)
  
  if (!validacion.exito) {
    validacion.errores.forEach(error => {
      console.log(`   ❌ ${error}`)
    })
  } else {
    console.log(`   ✅ Todos los valores coinciden`)
  }
}