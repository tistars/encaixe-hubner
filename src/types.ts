export type CategoryId =
  | 'motor'
  | 'arrefecimento'
  | 'transmissao'
  | 'freios'
  | 'suspensao'
  | 'rodas'
  | 'estrutura'
  | 'carroceria'

export interface Category {
  id: CategoryId
  name: string
  icon: string // chave do ícone em ui/icons.tsx
}

/** Forma geométrica procedural de cada peça (sem modelo baixado: tudo gerado em código). */
export type Shape =
  | { kind: 'box'; size: [number, number, number]; radius?: number }
  | { kind: 'cyl'; r: number; h: number; axis?: 'x' | 'y' | 'z'; seg?: number; rTop?: number }
  | { kind: 'ring'; r: number; tube: number; axis?: 'x' | 'y' | 'z' }
  | { kind: 'wheel'; r: number; w: number }
  | { kind: 'flywheel'; r: number; t: number }
  | { kind: 'head'; size: [number, number, number] }
  | { kind: 'pan'; size: [number, number, number] }
  | { kind: 'knuckle'; s: number; side: 1 | -1 }
  | { kind: 'crossmember'; w: number }
  | { kind: 'slack'; s: number }
  | { kind: 'pump'; s: number }
  | { kind: 'housing'; size: [number, number, number] }
  | { kind: 'cab'; size: [number, number, number] }

export interface PartMesh {
  shape: Shape
  /** posição montada [x,y,z] (metros, eixo x = comprimento do veículo) */
  pos: [number, number, number]
  rot?: [number, number, number]
  /** deslocamento quando explodido */
  explode: [number, number, number]
}

export interface Part {
  id: string
  name: string
  category: CategoryId
  icon: string
  /** true = peça da família de produtos Hübner (destacada e clicável) */
  hubner: boolean
  /** código da peça — SEMPRE de exemplo nesta demo */
  code?: string
  description?: string
  /** preço de exemplo em R$ (não é tabela real) */
  price?: number
  /** disponibilidade de exemplo (nunca estoque real) */
  availability?: 'linha' | 'encomenda'
  /** família de produto vista no site público da Hübner (fonte em docs/fontes.md) */
  realFamily?: string
  meshes: PartMesh[]
}

export interface VehicleModel {
  id: string
  kind: 'caminhao' | 'onibus' | 'trator'
  brand: string
  model: string
  years: number[]
  engine: string
  /** câmera inicial */
  camera: [number, number, number]
  parts: Part[]
}

/** Tipo de veículo, no vocabulário da Tabela FIPE (ônibus e micro-ônibus ficam em caminhões). */
export type VehicleKind = 'carro' | 'moto' | 'caminhao' | 'onibus' | 'trator'

export interface VehicleInfo {
  plate?: string
  brand: string
  model: string
  year: number
  engine: string
  /** id do modelo 3D/catálogo que atende este veículo; vazio quando nenhum atende */
  vehicleId: string
  source: 'demo' | 'manual' | 'api' | 'fipe'
  // Campos públicos do VEÍCULO (opcionais). Nunca dado do proprietário.
  kind?: VehicleKind
  yearFab?: number
  color?: string
  fuel?: string
  city?: string
  uf?: string
  fipeCode?: string
  /** valor FIPE em texto, como a fonte devolve ("R$ 45.000,00") */
  fipeValue?: string
  fipeMonth?: string
  /** nome da fonte exibido no modal */
  sourceName?: string
}

export interface CartItem {
  partId: string
  vehicleId: string
  qty: number
}
