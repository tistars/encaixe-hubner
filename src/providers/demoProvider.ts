import type { VehicleInfo } from '../types'
import type { PlateProvider } from './PlateProvider'
import { normalizePlate } from './PlateProvider'

/**
 * DADO DE EXEMPLO: placas fictícias de demonstração.
 * Não correspondem a nenhum veículo real consultado em base oficial.
 */
export const DEMO_PLATES: Record<string, Omit<VehicleInfo, 'plate' | 'source'>> = {
  HUB1E01: {
    brand: 'Volkswagen',
    model: 'Constellation 24.280 6x2',
    year: 2022,
    engine: 'MAN D08 6 cil. 6,9 L diesel',
    vehicleId: 'caminhao-medio',
  },
  HUB2A02: {
    brand: 'Valtra',
    model: 'Série A 4x4',
    year: 2021,
    engine: 'AGCO Power 3 cil. 3,3 L diesel',
    vehicleId: 'trator',
  },
  HUB3O03: {
    brand: 'Mercedes-Benz',
    model: 'OF 1721 (chassi de ônibus)',
    year: 2020,
    engine: 'OM 924 LA 4 cil. 4,8 L diesel',
    vehicleId: 'onibus',
  },
}

export class DemoPlateProvider implements PlateProvider {
  readonly name = 'Demonstração (placas de exemplo)'
  readonly isDemo = true

  async lookup(plate: string): Promise<VehicleInfo | null> {
    const p = normalizePlate(plate)
    // pequena espera para a interface mostrar o estado "consultando"
    await new Promise((r) => setTimeout(r, 650))
    const hit = DEMO_PLATES[p]
    return hit ? { ...hit, plate: p, source: 'demo', sourceName: 'Placa de exemplo (fictícia)' } : null
  }
}
