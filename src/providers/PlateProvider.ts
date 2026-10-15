import type { VehicleInfo } from '../types'

/**
 * Contrato único para identificar um veículo pela placa.
 *
 * Para plugar um provedor real (consulta própria a base licenciada, DETRAN via convênio,
 * parceiro de dados etc.), crie uma classe que implemente esta interface e registre-a em
 * `providers/index.ts`. O resto do app não muda.
 */
export interface PlateProvider {
  /** nome exibido na interface ("Demonstração", "Consulta Hübner"...) */
  readonly name: string
  /** true quando os resultados são de exemplo */
  readonly isDemo: boolean
  /** devolve o veículo ou null quando a placa não foi encontrada */
  lookup(plate: string): Promise<VehicleInfo | null>
}

/** Placa antiga (ABC1234) ou Mercosul (ABC1D23), sem hífen, maiúscula. */
export function normalizePlate(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function isValidPlate(plate: string): boolean {
  return /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(plate)
}

export function formatPlate(plate: string): string {
  const p = normalizePlate(plate)
  // Mercosul fica sem hífen; padrão antigo leva hífen
  return /^[A-Z]{3}[0-9]{4}$/.test(p) ? `${p.slice(0, 3)}-${p.slice(3)}` : p
}
