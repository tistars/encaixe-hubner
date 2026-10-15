import type { VehicleInfo, VehicleKind } from '../types'

/**
 * Tabela FIPE pela API pública e gratuita do Parallelum (https://deividfortuna.github.io/fipe/).
 * CORS aberto, sem chave, limite de 500 consultas/dia por IP — o IP de quem usa o app, não do servidor.
 * Não consulta placa: serve para a pessoa informar o veículo e ver dados reais de modelo, combustível e valor.
 */
const BASE = 'https://parallelum.com.br/fipe/api/v1'

export type FipeTipo = 'carros' | 'motos' | 'caminhoes'
export interface FipeItem {
  codigo: string
  nome: string
}

export const FIPE_TIPOS: { id: FipeTipo; label: string }[] = [
  { id: 'caminhoes', label: 'Caminhão ou ônibus' },
  { id: 'carros', label: 'Carro ou utilitário' },
  { id: 'motos', label: 'Moto' },
]

const cache = new Map<string, Promise<unknown>>()

function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const hit = cache.get(path)
  if (hit) return hit as Promise<T>
  const p = fetch(BASE + path, { signal }).then((r) => {
    if (!r.ok) throw new Error(r.status === 429 ? 'Limite diário da Tabela FIPE atingido' : `FIPE ${r.status}`)
    return r.json() as Promise<T>
  })
  p.catch(() => cache.delete(path))
  cache.set(path, p)
  return p
}

export const fipeMarcas = (tipo: FipeTipo, s?: AbortSignal) => get<FipeItem[]>(`/${tipo}/marcas`, s)
export const fipeModelos = (tipo: FipeTipo, marca: string, s?: AbortSignal) =>
  get<{ modelos: FipeItem[] }>(`/${tipo}/marcas/${marca}/modelos`, s).then((d) => d.modelos)
export const fipeAnos = (tipo: FipeTipo, marca: string, modelo: string, s?: AbortSignal) =>
  get<FipeItem[]>(`/${tipo}/marcas/${marca}/modelos/${modelo}/anos`, s)

interface FipeValor {
  Valor: string
  Marca: string
  Modelo: string
  AnoModelo: number
  Combustivel: string
  CodigoFipe: string
  MesReferencia: string
}

const BUS = /(ônibus|onibus|micro|\bOF\b|\bO-?500|\bOH\b|chassi)/i

export async function fipeVeiculo(tipo: FipeTipo, marca: string, modelo: string, ano: string, plate?: string): Promise<VehicleInfo> {
  const d = await get<FipeValor>(`/${tipo}/marcas/${marca}/modelos/${modelo}/anos/${ano}`)
  const kind: VehicleKind = tipo === 'carros' ? 'carro' : tipo === 'motos' ? 'moto' : BUS.test(d.Modelo) ? 'onibus' : 'caminhao'
  return {
    plate,
    brand: d.Marca,
    model: d.Modelo,
    // 32000 é o código que a FIPE usa para "zero km"
    year: d.AnoModelo === 32000 ? new Date().getFullYear() : d.AnoModelo,
    engine: '',
    vehicleId: '',
    source: 'fipe',
    kind,
    fuel: d.Combustivel,
    fipeCode: d.CodigoFipe,
    fipeValue: d.Valor,
    fipeMonth: d.MesReferencia.trim(),
    sourceName: 'Tabela FIPE (informado por você)',
  }
}
