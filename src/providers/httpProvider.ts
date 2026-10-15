import type { VehicleInfo, VehicleKind } from '../types'
import type { PlateProvider } from './PlateProvider'
import { normalizePlate } from './PlateProvider'

const KINDS: VehicleKind[] = ['carro', 'moto', 'caminhao', 'onibus', 'trator']
const opt = (v: unknown) => (v == null || v === '' ? undefined : String(v))
const optNum = (v: unknown) => (v == null || v === '' || !Number.isFinite(Number(v)) ? undefined : Number(v))

/**
 * Esqueleto para um provedor real via HTTP — DESLIGADO por padrão.
 *
 * Espera um endpoint PRÓPRIO (backend seu) que responda:
 *   GET {baseUrl}/placa/ABC1D23  ->  { brand, model, year, engine?, vehicleId?,
 *                                      kind?, yearFab?, color?, fuel?, city?, uf?,
 *                                      fipeCode?, fipeValue?, fipeMonth?, sourceName? }
 * Só dados do veículo: o backend nunca deve devolver nada do proprietário.
 *
 * Nunca coloque chave de API no front-end: o backend guarda a credencial e o
 * navegador só fala com ele. Ligue com VITE_PLATE_API_URL no build.
 */
export class HttpPlateProvider implements PlateProvider {
  readonly name = 'Consulta de placa'
  readonly isDemo = false

  constructor(private baseUrl: string) {}

  async lookup(plate: string): Promise<VehicleInfo | null> {
    const p = normalizePlate(plate)
    const res = await fetch(`${this.baseUrl.replace(/\/$/, '')}/placa/${p}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Consulta falhou (${res.status})`)
    const d = await res.json()
    const kind = KINDS.includes(d.kind) ? (d.kind as VehicleKind) : undefined
    return {
      plate: p,
      brand: String(d.brand),
      model: String(d.model),
      year: Number(d.year),
      engine: String(d.engine ?? ''),
      vehicleId: String(d.vehicleId ?? ''),
      source: 'api',
      kind,
      yearFab: optNum(d.yearFab),
      color: opt(d.color),
      fuel: opt(d.fuel),
      city: opt(d.city),
      uf: opt(d.uf),
      fipeCode: opt(d.fipeCode),
      fipeValue: opt(d.fipeValue),
      fipeMonth: opt(d.fipeMonth),
      sourceName: opt(d.sourceName) ?? this.name,
    }
  }
}
