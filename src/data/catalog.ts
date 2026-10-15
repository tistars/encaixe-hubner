import type { Category, CategoryId, Part, VehicleModel } from '../types'

/*
 * SEED DO CATÁLOGO
 * ----------------
 * REAL (fonte em docs/fontes.md): as FAMÍLIAS de produto marcadas em `realFamily`
 * aparecem no site público do Grupo Hübner (hubner.com.br, páginas Automotivo e Agrícola)
 * ou em notícia pública (Agrolink, 2003).
 *
 * EXEMPLO (inventado para a demonstração): códigos, preços, disponibilidade,
 * compatibilidade por marca/modelo/ano e as placas. A Hübner não publica catálogo
 * de reposição por veículo; nada aqui é estoque real.
 */

export const CATEGORIES: Category[] = [
  { id: 'motor', name: 'Motor', icon: 'motor' },
  { id: 'arrefecimento', name: 'Arrefecimento', icon: 'arrefecimento' },
  { id: 'transmissao', name: 'Transmissão', icon: 'transmissao' },
  { id: 'freios', name: 'Freios', icon: 'freios' },
  { id: 'suspensao', name: 'Suspensão e direção', icon: 'suspensao' },
  { id: 'rodas', name: 'Rodas e cubos', icon: 'rodas' },
  { id: 'estrutura', name: 'Chassi e estrutura', icon: 'estrutura' },
  { id: 'carroceria', name: 'Cabine e carroceria', icon: 'carroceria' },
]

export const categoryName = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.name ?? id

const FAM = {
  travessa: 'Travessa / suporte de suspensão (foto em hubner.com.br › Automotivo)',
  manga: 'Manga de eixo (foto em hubner.com.br › Automotivo)',
  volante: 'Volante do motor (foto em hubner.com.br › Automotivo)',
  carcacaAgua: 'Carcaça de bomba d’água / saída de água (foto em hubner.com.br › Automotivo)',
  carter: 'Cárter de óleo (foto em hubner.com.br › Automotivo)',
  blocoCabecote: 'Blocos e cabeçotes de motor (Agrolink, 2003)',
  ajustador: 'Ajustador automático de freio (Agrolink, 2003)',
  carcacaTransmissao: 'Carcaça de transmissão agrícola (foto em hubner.com.br › Agrícola)',
  suporteEixo: 'Suporte do eixo dianteiro agrícola (foto em hubner.com.br › Agrícola)',
  sinoRedutor: 'Carcaça/sino de redutor (foto em hubner.com.br › Agrícola)',
  estruturaCabine: 'Estrutura de suporte fundida (foto em hubner.com.br › Agrícola)',
}

/* ---------------------------------------------------------------- caminhão */

const W = 1.05 // meia-bitola das rodas (z)

const truckParts: Part[] = [
  // ---- peças da família Hübner (destacadas)
  {
    id: 'cabecote', name: 'Cabeçote do motor', category: 'motor', icon: 'cabecote', hubner: true,
    code: 'HB-EX-1101', price: 7890, availability: 'encomenda', realFamily: FAM.blocoCabecote,
    description: 'Cabeçote em ferro fundido usinado, sedes de válvula e galerias de água.',
    meshes: [{ shape: { kind: 'head', size: [1.0, 0.24, 0.6] }, pos: [2.7, 1.79, 0], explode: [0, 2.15, 0] }],
  },
  {
    id: 'bloco', name: 'Bloco do motor', category: 'motor', icon: 'motor', hubner: true,
    code: 'HB-EX-1001', price: 18450, availability: 'encomenda', realFamily: FAM.blocoCabecote,
    description: 'Bloco de 6 cilindros em ferro fundido cinzento, usinado e testado.',
    meshes: [{ shape: { kind: 'housing', size: [1.0, 0.72, 0.66] }, pos: [2.7, 1.3, 0], explode: [0, 1.2, 0] }],
  },
  {
    id: 'carter', name: 'Cárter de óleo', category: 'motor', icon: 'carter', hubner: true,
    code: 'HB-EX-1205', price: 1290, availability: 'linha', realFamily: FAM.carter,
    description: 'Cárter estrutural com flange usinada e bujão de dreno.',
    meshes: [{ shape: { kind: 'pan', size: [0.95, 0.3, 0.6] }, pos: [2.7, 0.8, 0], explode: [0, 0.62, 0] }],
  },
  {
    id: 'volante', name: 'Volante do motor', category: 'transmissao', icon: 'volante', hubner: true,
    code: 'HB-EX-1310', price: 2340, availability: 'linha', realFamily: FAM.volante,
    description: 'Volante usinado e balanceado com cremalheira de partida.',
    meshes: [{ shape: { kind: 'flywheel', r: 0.34, t: 0.07 }, pos: [2.13, 1.28, 0], explode: [-0.55, 1.25, 0] }],
  },
  {
    id: 'carcaca-agua', name: 'Carcaça da bomba d’água', category: 'arrefecimento', icon: 'arrefecimento', hubner: true,
    code: 'HB-EX-1420', price: 690, availability: 'linha', realFamily: FAM.carcacaAgua,
    description: 'Carcaça fundida com saída para o radiador e flange de fixação.',
    meshes: [{ shape: { kind: 'pump', s: 0.2 }, pos: [3.26, 1.45, 0.18], explode: [0.95, 1.3, 0.25] }],
  },
  {
    id: 'travessa', name: 'Travessa da suspensão dianteira', category: 'estrutura', icon: 'travessa', hubner: true,
    code: 'HB-EX-2105', price: 4120, availability: 'encomenda', realFamily: FAM.travessa,
    description: 'Travessa fundida que une as longarinas e apoia a suspensão dianteira.',
    meshes: [{ shape: { kind: 'crossmember', w: 1.5 }, pos: [3.1, 0.72, 0], explode: [0.6, -0.25, 0] }],
  },
  {
    id: 'manga', name: 'Manga de eixo', category: 'suspensao', icon: 'manga', hubner: true,
    code: 'HB-EX-2210', price: 2780, availability: 'linha', realFamily: FAM.manga,
    description: 'Manga de eixo forjada/usinada, lados esquerdo e direito.',
    meshes: [
      { shape: { kind: 'knuckle', s: 0.3, side: 1 }, pos: [2.6, 0.52, 0.78], explode: [0, 0.15, 0.75] },
      { shape: { kind: 'knuckle', s: 0.3, side: -1 }, pos: [2.6, 0.52, -0.78], explode: [0, 0.15, -0.75] },
    ],
  },
  {
    id: 'cubo', name: 'Cubo de roda dianteiro', category: 'rodas', icon: 'rodas', hubner: true,
    code: 'HB-EX-2330', price: 1560, availability: 'linha',
    description: 'Cubo de roda usinado com furação para 10 prisioneiros.',
    meshes: [
      { shape: { kind: 'cyl', r: 0.17, h: 0.2, axis: 'z', rTop: 0.12 }, pos: [2.6, 0.5, 0.93], explode: [0, 0.05, 1.2] },
      { shape: { kind: 'cyl', r: 0.17, h: 0.2, axis: 'z', rTop: 0.12 }, pos: [2.6, 0.5, -0.93], explode: [0, 0.05, -1.2] },
    ],
  },
  {
    id: 'ajustador', name: 'Ajustador automático de freio', category: 'freios', icon: 'freios', hubner: true,
    code: 'HB-EX-3105', price: 540, availability: 'linha', realFamily: FAM.ajustador,
    description: 'Ajustador automático (catraca) para freio a tambor com came em S.',
    meshes: [
      { shape: { kind: 'slack', s: 0.22 }, pos: [-1.6, 0.42, 0.62], explode: [0, -0.05, 0.62] },
      { shape: { kind: 'slack', s: 0.22 }, pos: [-1.6, 0.42, -0.62], explode: [0, -0.05, -0.62] },
      { shape: { kind: 'slack', s: 0.22 }, pos: [-2.9, 0.42, 0.62], explode: [0, -0.05, 0.62] },
      { shape: { kind: 'slack', s: 0.22 }, pos: [-2.9, 0.42, -0.62], explode: [0, -0.05, -0.62] },
    ],
  },

  // ---- peças fora do catálogo (cinza transparente, não clicáveis)
  {
    id: 'cabine', name: 'Cabine', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'cab', size: [1.9, 2.0, 2.3] }, pos: [2.95, 2.35, 0], explode: [0.7, 3.3, 0] }],
  },
  {
    id: 'bau', name: 'Baú de carga', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [5.6, 2.5, 2.4] }, pos: [-1.3, 2.35, 0], explode: [-1.4, 2.2, 0] }],
  },
  {
    id: 'parachoque', name: 'Para-choque', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [0.22, 0.4, 2.35], radius: 0.06 }, pos: [3.98, 0.85, 0], explode: [1.6, 0, 0] }],
  },
  {
    id: 'longarinas', name: 'Longarinas do chassi', category: 'estrutura', icon: 'estrutura', hubner: false,
    meshes: [
      { shape: { kind: 'box', size: [7.6, 0.26, 0.09] }, pos: [-0.05, 0.9, 0.45], explode: [0, 0, 0.12] },
      { shape: { kind: 'box', size: [7.6, 0.26, 0.09] }, pos: [-0.05, 0.9, -0.45], explode: [0, 0, -0.12] },
    ],
  },
  {
    id: 'radiador', name: 'Radiador', category: 'arrefecimento', icon: 'arrefecimento', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [0.12, 0.85, 0.95] }, pos: [3.62, 1.45, 0], explode: [1.75, 0.75, 0] }],
  },
  {
    id: 'cambio', name: 'Caixa de câmbio', category: 'transmissao', icon: 'transmissao', hubner: false,
    meshes: [{ shape: { kind: 'cyl', r: 0.26, h: 0.85, axis: 'x', rTop: 0.2 }, pos: [1.6, 1.22, 0], explode: [-1.35, 1.05, 0] }],
  },
  {
    id: 'eixo-dianteiro', name: 'Eixo dianteiro', category: 'suspensao', icon: 'suspensao', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [0.14, 0.14, 1.45] }, pos: [2.6, 0.52, 0], explode: [0, -0.15, 0] }],
  },
  {
    id: 'eixos-traseiros', name: 'Eixos traseiros (tandem)', category: 'transmissao', icon: 'transmissao', hubner: false,
    meshes: [
      { shape: { kind: 'cyl', r: 0.09, h: 1.7, axis: 'z' }, pos: [-1.6, 0.5, 0], explode: [0, -0.1, 0] },
      { shape: { kind: 'cyl', r: 0.09, h: 1.7, axis: 'z' }, pos: [-2.9, 0.5, 0], explode: [0, -0.1, 0] },
    ],
  },
  {
    id: 'rodas', name: 'Rodas e pneus', category: 'rodas', icon: 'pneu', hubner: false,
    meshes: [
      { shape: { kind: 'wheel', r: 0.52, w: 0.32 }, pos: [2.6, 0.52, W], explode: [0, 0, 1.75] },
      { shape: { kind: 'wheel', r: 0.52, w: 0.32 }, pos: [2.6, 0.52, -W], explode: [0, 0, -1.75] },
      { shape: { kind: 'wheel', r: 0.52, w: 0.5 }, pos: [-1.6, 0.52, W], explode: [0, 0, 1.4] },
      { shape: { kind: 'wheel', r: 0.52, w: 0.5 }, pos: [-1.6, 0.52, -W], explode: [0, 0, -1.4] },
      { shape: { kind: 'wheel', r: 0.52, w: 0.5 }, pos: [-2.9, 0.52, W], explode: [0, 0, 1.4] },
      { shape: { kind: 'wheel', r: 0.52, w: 0.5 }, pos: [-2.9, 0.52, -W], explode: [0, 0, -1.4] },
    ],
  },
  {
    id: 'tanque', name: 'Tanque de combustível', category: 'motor', icon: 'motor', hubner: false,
    meshes: [{ shape: { kind: 'cyl', r: 0.27, h: 1.1, axis: 'x' }, pos: [0.7, 0.72, -0.82], explode: [0, 0, -1.3] }],
  },
  {
    id: 'escapamento', name: 'Silencioso do escapamento', category: 'motor', icon: 'motor', hubner: false,
    meshes: [{ shape: { kind: 'cyl', r: 0.2, h: 0.8, axis: 'x' }, pos: [0.7, 0.72, 0.8], explode: [0, 0, 1.3] }],
  },
]

/* ---------------------------------------------------------------- trator */

const tractorParts: Part[] = [
  {
    id: 't-carcaca-transmissao', name: 'Carcaça da transmissão', category: 'transmissao', icon: 'transmissao', hubner: true,
    code: 'HB-EX-5101', price: 21900, availability: 'encomenda', realFamily: FAM.carcacaTransmissao,
    description: 'Carcaça estrutural da transmissão: também é parte do chassi do trator.',
    meshes: [{ shape: { kind: 'housing', size: [1.1, 0.8, 0.8] }, pos: [-0.45, 1.0, 0], explode: [0, 1.15, 0] }],
  },
  {
    id: 't-suporte-eixo', name: 'Suporte do eixo dianteiro', category: 'suspensao', icon: 'travessa', hubner: true,
    code: 'HB-EX-5210', price: 6350, availability: 'encomenda', realFamily: FAM.suporteEixo,
    description: 'Suporte fundido que fixa o eixo dianteiro oscilante ao bloco.',
    meshes: [{ shape: { kind: 'crossmember', w: 0.75 }, pos: [1.45, 0.72, 0], explode: [0.8, -0.2, 0] }],
  },
  {
    id: 't-sino', name: 'Carcaça do redutor final', category: 'transmissao', icon: 'volante', hubner: true,
    code: 'HB-EX-5320', price: 3480, availability: 'linha', realFamily: FAM.sinoRedutor,
    description: 'Carcaça em forma de sino do redutor final, lados esquerdo e direito.',
    meshes: [
      { shape: { kind: 'cyl', r: 0.3, h: 0.35, axis: 'z', rTop: 0.2 }, pos: [-0.6, 0.85, 0.55], explode: [0, 0.2, 0.7] },
      { shape: { kind: 'cyl', r: 0.2, h: 0.35, axis: 'z', rTop: 0.3 }, pos: [-0.6, 0.85, -0.55], explode: [0, 0.2, -0.7] },
    ],
  },
  {
    id: 't-estrutura', name: 'Estrutura de suporte do capô', category: 'estrutura', icon: 'estrutura', hubner: true,
    code: 'HB-EX-5405', price: 2190, availability: 'linha', realFamily: FAM.estruturaCabine,
    description: 'Estrutura fundida que sustenta capô e radiador.',
    meshes: [{ shape: { kind: 'box', size: [0.12, 0.7, 0.75], radius: 0.04 }, pos: [1.55, 1.35, 0], explode: [1.1, 0.6, 0] }],
  },
  {
    id: 't-carter', name: 'Cárter de óleo', category: 'motor', icon: 'carter', hubner: true,
    code: 'HB-EX-5501', price: 1680, availability: 'linha', realFamily: FAM.carter,
    description: 'Cárter estrutural: no trator ele também sustenta o eixo dianteiro.',
    meshes: [{ shape: { kind: 'pan', size: [1.0, 0.3, 0.55] }, pos: [0.85, 0.8, 0], explode: [0, -0.15, 0.95] }],
  },
  {
    id: 't-motor', name: 'Motor (bloco e cabeçote)', category: 'motor', icon: 'motor', hubner: false,
    meshes: [{ shape: { kind: 'housing', size: [1.0, 0.65, 0.6] }, pos: [0.85, 1.28, 0], explode: [0, 1.3, 0] }],
  },
  {
    id: 't-capo', name: 'Capô', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [1.5, 0.55, 0.8], radius: 0.12 }, pos: [0.9, 1.9, 0], explode: [0.4, 2.0, 0] }],
  },
  {
    id: 't-cabine', name: 'Cabine', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'cab', size: [1.3, 1.5, 1.35] }, pos: [-0.65, 2.15, 0], explode: [-0.6, 2.4, 0] }],
  },
  {
    id: 't-rodas-tras', name: 'Rodas traseiras', category: 'rodas', icon: 'pneu', hubner: false,
    meshes: [
      { shape: { kind: 'wheel', r: 0.85, w: 0.45 }, pos: [-0.6, 0.85, 1.0], explode: [0, 0, 1.6] },
      { shape: { kind: 'wheel', r: 0.85, w: 0.45 }, pos: [-0.6, 0.85, -1.0], explode: [0, 0, -1.6] },
    ],
  },
  {
    id: 't-rodas-frente', name: 'Rodas dianteiras', category: 'rodas', icon: 'pneu', hubner: false,
    meshes: [
      { shape: { kind: 'wheel', r: 0.5, w: 0.3 }, pos: [1.45, 0.5, 0.82], explode: [0, 0, 1.3] },
      { shape: { kind: 'wheel', r: 0.5, w: 0.3 }, pos: [1.45, 0.5, -0.82], explode: [0, 0, -1.3] },
    ],
  },
  {
    id: 't-eixo', name: 'Eixo dianteiro', category: 'suspensao', icon: 'suspensao', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [0.14, 0.14, 1.4] }, pos: [1.45, 0.5, 0], explode: [0, -0.1, 0] }],
  },
  {
    id: 't-tanque', name: 'Tanque de combustível', category: 'motor', icon: 'motor', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [0.5, 0.45, 0.35], radius: 0.08 }, pos: [-0.05, 1.3, 0.55], explode: [0, 0.5, 1.2] }],
  },
]

/* ---------------------------------------------------------------- ônibus */

const busParts: Part[] = [
  {
    id: 'o-carter', name: 'Cárter de óleo', category: 'motor', icon: 'carter', hubner: true,
    code: 'HB-EX-7201', price: 1190, availability: 'linha', realFamily: FAM.carter,
    description: 'Cárter estrutural para motor dianteiro de ônibus.',
    meshes: [{ shape: { kind: 'pan', size: [0.85, 0.28, 0.55] }, pos: [3.6, 0.7, 0], explode: [0, 0.55, 0] }],
  },
  {
    id: 'o-volante', name: 'Volante do motor', category: 'transmissao', icon: 'volante', hubner: true,
    code: 'HB-EX-7310', price: 2190, availability: 'linha', realFamily: FAM.volante,
    description: 'Volante usinado e balanceado com cremalheira.',
    meshes: [{ shape: { kind: 'flywheel', r: 0.3, t: 0.07 }, pos: [3.1, 1.12, 0], explode: [-0.55, 1.2, 0] }],
  },
  {
    id: 'o-carcaca-agua', name: 'Carcaça da bomba d’água', category: 'arrefecimento', icon: 'arrefecimento', hubner: true,
    code: 'HB-EX-7420', price: 640, availability: 'linha', realFamily: FAM.carcacaAgua,
    description: 'Carcaça fundida com saída para o radiador.',
    meshes: [{ shape: { kind: 'pump', s: 0.18 }, pos: [4.1, 1.25, 0.16], explode: [0.9, 1.1, 0.2] }],
  },
  {
    id: 'o-manga', name: 'Manga de eixo', category: 'suspensao', icon: 'manga', hubner: true,
    code: 'HB-EX-7210', price: 2650, availability: 'encomenda', realFamily: FAM.manga,
    description: 'Manga de eixo dianteira, lados esquerdo e direito.',
    meshes: [
      { shape: { kind: 'knuckle', s: 0.3, side: 1 }, pos: [3.6, 0.52, 0.78], explode: [0, 0.15, 0.8] },
      { shape: { kind: 'knuckle', s: 0.3, side: -1 }, pos: [3.6, 0.52, -0.78], explode: [0, 0.15, -0.8] },
    ],
  },
  {
    id: 'o-ajustador', name: 'Ajustador automático de freio', category: 'freios', icon: 'freios', hubner: true,
    code: 'HB-EX-7105', price: 520, availability: 'linha', realFamily: FAM.ajustador,
    description: 'Ajustador automático para freio a tambor do eixo traseiro.',
    meshes: [
      { shape: { kind: 'slack', s: 0.22 }, pos: [-2.6, 0.42, 0.62], explode: [0, -0.05, 0.62] },
      { shape: { kind: 'slack', s: 0.22 }, pos: [-2.6, 0.42, -0.62], explode: [0, -0.05, -0.62] },
    ],
  },
  {
    id: 'o-travessa', name: 'Suporte de mola traseira', category: 'suspensao', icon: 'travessa', hubner: true,
    code: 'HB-EX-7520', price: 860, availability: 'encomenda', realFamily: FAM.travessa,
    description: 'Suporte fundido do feixe de molas traseiro.',
    meshes: [
      { shape: { kind: 'box', size: [0.3, 0.3, 0.12], radius: 0.04 }, pos: [-2.0, 0.78, 0.55], explode: [0, 0.25, 0.9] },
      { shape: { kind: 'box', size: [0.3, 0.3, 0.12], radius: 0.04 }, pos: [-2.0, 0.78, -0.55], explode: [0, 0.25, -0.9] },
    ],
  },
  {
    id: 'o-motor', name: 'Motor (bloco e cabeçote)', category: 'motor', icon: 'motor', hubner: false,
    meshes: [{ shape: { kind: 'housing', size: [0.95, 0.7, 0.6] }, pos: [3.6, 1.18, 0], explode: [0, 1.15, 0] }],
  },
  {
    id: 'o-carroceria', name: 'Carroceria do ônibus', category: 'carroceria', icon: 'carroceria', hubner: false,
    meshes: [{ shape: { kind: 'box', size: [10.2, 2.4, 2.5], radius: 0.18 }, pos: [0, 2.25, 0], explode: [0, 3.4, -0.6] }],
  },
  {
    id: 'o-longarinas', name: 'Longarinas do chassi', category: 'estrutura', icon: 'estrutura', hubner: false,
    meshes: [
      { shape: { kind: 'box', size: [9.6, 0.24, 0.09] }, pos: [0, 0.82, 0.45], explode: [0, 0, 0.1] },
      { shape: { kind: 'box', size: [9.6, 0.24, 0.09] }, pos: [0, 0.82, -0.45], explode: [0, 0, -0.1] },
    ],
  },
  {
    id: 'o-rodas', name: 'Rodas e pneus', category: 'rodas', icon: 'pneu', hubner: false,
    meshes: [
      { shape: { kind: 'wheel', r: 0.5, w: 0.3 }, pos: [3.6, 0.5, 1.05], explode: [0, 0, 1.7] },
      { shape: { kind: 'wheel', r: 0.5, w: 0.3 }, pos: [3.6, 0.5, -1.05], explode: [0, 0, -1.7] },
      { shape: { kind: 'wheel', r: 0.5, w: 0.5 }, pos: [-2.6, 0.5, 1.05], explode: [0, 0, 1.5] },
      { shape: { kind: 'wheel', r: 0.5, w: 0.5 }, pos: [-2.6, 0.5, -1.05], explode: [0, 0, -1.5] },
    ],
  },
  {
    id: 'o-cambio', name: 'Caixa de câmbio', category: 'transmissao', icon: 'transmissao', hubner: false,
    meshes: [{ shape: { kind: 'cyl', r: 0.24, h: 0.8, axis: 'x', rTop: 0.18 }, pos: [2.55, 1.08, 0], explode: [-1.2, 1.0, 0] }],
  },
  {
    id: 'o-eixo-tras', name: 'Eixo traseiro', category: 'transmissao', icon: 'transmissao', hubner: false,
    meshes: [{ shape: { kind: 'cyl', r: 0.09, h: 1.7, axis: 'z' }, pos: [-2.6, 0.5, 0], explode: [0, -0.1, 0] }],
  },
]

export const VEHICLES: VehicleModel[] = [
  {
    id: 'caminhao-medio', kind: 'caminhao', brand: 'Volkswagen', model: 'Constellation 24.280 6x2',
    years: [2019, 2020, 2021, 2022, 2023, 2024], engine: 'MAN D08 6 cil. 6,9 L diesel',
    camera: [9, 5.6, 10], parts: truckParts,
  },
  {
    id: 'trator', kind: 'trator', brand: 'Valtra', model: 'Série A 4x4',
    years: [2019, 2020, 2021, 2022, 2023], engine: 'AGCO Power 3 cil. 3,3 L diesel',
    camera: [7.4, 5.4, 8.2], parts: tractorParts,
  },
  {
    id: 'onibus', kind: 'onibus', brand: 'Mercedes-Benz', model: 'OF 1721 (chassi de ônibus)',
    years: [2018, 2019, 2020, 2021, 2022], engine: 'OM 924 LA 4 cil. 4,8 L diesel',
    camera: [9, 5.2, 10], parts: busParts,
  },
]

/** Veículos liberados na interface (a fatia vertical começou só com o caminhão). */
export const ENABLED_VEHICLES = (import.meta.env.VITE_VEHICLES as string | undefined)?.split(',') ?? VEHICLES.map((v) => v.id)

export const getVehicle = (id: string) => VEHICLES.find((v) => v.id === id)
export const getPart = (vehicleId: string, partId: string) => getVehicle(vehicleId)?.parts.find((p) => p.id === partId)

export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
