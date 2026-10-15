import type { PlateProvider } from './PlateProvider'
import { DemoPlateProvider } from './demoProvider'
import { HttpPlateProvider } from './httpProvider'

/**
 * PONTO DE PLUGUE do provedor de placa.
 * Sem VITE_PLATE_API_URL o app usa as placas de exemplo.
 */
const apiUrl = import.meta.env.VITE_PLATE_API_URL as string | undefined

export const plateProvider: PlateProvider = apiUrl ? new HttpPlateProvider(apiUrl) : new DemoPlateProvider()

export * from './PlateProvider'
export { DEMO_PLATES } from './demoProvider'
