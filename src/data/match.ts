import type { VehicleInfo, VehicleModel } from '../types'
import { ENABLED_VEHICLES, getVehicle, VEHICLES } from './catalog'

export interface Match {
  model: VehicleModel
  /** true = é exatamente o veículo do catálogo; false = exemplo do mesmo tipo */
  exact: boolean
}

/** Liga o veículo consultado a um modelo 3D do catálogo, se houver. Carro e moto não casam: a Hübner faz pesados. */
export function matchVehicle(v: VehicleInfo): Match | null {
  const direct = v.vehicleId ? getVehicle(v.vehicleId) : undefined
  if (direct && ENABLED_VEHICLES.includes(direct.id)) return { model: direct, exact: true }
  const kind = v.kind ?? direct?.kind
  if (kind !== 'caminhao' && kind !== 'onibus' && kind !== 'trator') return null
  const model = VEHICLES.find((m) => m.kind === kind && ENABLED_VEHICLES.includes(m.id))
  return model ? { model, exact: false } : null
}

/** Exemplo para quem não tem veículo pesado: o primeiro caminhão liberado (ou qualquer modelo). */
export function exampleVehicle(): VehicleModel | undefined {
  const list = VEHICLES.filter((m) => ENABLED_VEHICLES.includes(m.id))
  return list.find((m) => m.kind === 'caminhao') ?? list[0]
}

export function asCatalogVehicle(m: VehicleModel, plate?: string): VehicleInfo {
  return { plate, brand: m.brand, model: m.model, year: m.years.at(-1)!, engine: m.engine, vehicleId: m.id, source: 'demo' }
}
