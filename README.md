# Encaixe: da placa à peça

Protótipo de marketplace por placa para o **Grupo Hübner** (Araucária-PR). Você digita a placa, o app identifica o
veículo e mostra uma **vista 3D explodida**: as peças que a Hübner fabrica para aquele veículo ficam em laranja e
são clicáveis; o resto fica em cinza claro transparente. Clicou na peça, vê código, compatibilidade e
disponibilidade, escolhe a quantidade e manda para o carrinho.

> **Demonstração.** Placas, códigos, preços, disponibilidade e compatibilidade são **dados de exemplo**.
> Nada aqui é estoque real nem tabela oficial da Hübner. Projeto independente da Stars Aceleradora.

Demo publicada: https://tony-gw.tail2061e4.ts.net:10000/encaixe-05c1f968/

## O que tem

- Busca por placa (padrão antigo e Mercosul) com provedor plugável, ou marca/modelo/ano manual.
- Vista 3D (three.js + react-three-fiber): explodir/montar animado, controle deslizante, giro automático,
  rotação, zoom e pan, câmera que desliza até a peça escolhida.
- Painel da peça: nome, código, ícone, compatibilidade, disponibilidade, quantidade, adicionar ao carrinho.
- Lista por categoria (estilo goparts) como alternativa ao 3D, com busca e filtro "só peças Hübner".
- Carrinho lateral (salvo no navegador) e checkout de demonstração, sem pagamento.
- Três veículos de exemplo: caminhão (HUB1E01), trator (HUB2A02) e chassi de ônibus (HUB3O03).
- Mobile-first, PT-BR, respeita `prefers-reduced-motion`, navegação por teclado.

## Como rodar

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # gera dist/ estático (base relativa, serve em qualquer subpasta)
```

Variáveis de build (opcionais):

| Variável | Para quê |
|---|---|
| `VITE_PLATE_API_URL` | Liga o provedor HTTP de placa (veja abaixo). Sem ela, usa as placas de exemplo. |
| `VITE_VEHICLES` | Lista de ids de veículo liberados, separados por vírgula (padrão: todos). |

## Onde plugar a API de placa

Não existe API pública gratuita e oficial de placa → veículo. O app tem um contrato único:

```ts
// src/providers/PlateProvider.ts
export interface PlateProvider {
  readonly name: string
  readonly isDemo: boolean
  lookup(plate: string): Promise<VehicleInfo | null>
}
```

- `src/providers/demoProvider.ts`: placas de exemplo (padrão).
- `src/providers/httpProvider.ts`: esqueleto para um **backend próprio** que responda
  `GET {VITE_PLATE_API_URL}/placa/ABC1D23 → { brand, model, year, engine, vehicleId }`.
- `src/providers/index.ts`: o ponto de troca.

A credencial de qualquer base de dados de placa fica **no backend**, nunca no front-end.

## Dados: real × exemplo

Detalhe completo com links em [`docs/fontes.md`](docs/fontes.md).

- **Real (fonte pública):** as famílias de produto da Hübner: blocos e cabeçotes, cárter, volante, carcaça de bomba d'água,
  manga de eixo, travessa de suspensão, ajustador automático de freio, carcaças de transmissão agrícola etc.
  Na interface, selo verde "público".
- **Exemplo:** todo o resto (placas, códigos `HB-EX-*`, preços, disponibilidade, compatibilidade por modelo/ano).
  Na interface, selo amarelo "exemplo".

O seed fica em `src/data/catalog.ts`. Para usar o catálogo real basta trocar esse arquivo (ou carregá-lo de uma API)
mantendo o formato `VehicleModel → Part[]`.

## 3D

Tudo é geometria procedural (`src/three/ShapeMesh.tsx`); não há modelo 3D de terceiros. Cada peça tem posição
montada e vetor de explosão (`meshes[].pos` / `meshes[].explode`). Para usar modelos reais (GLB/CAD da Hübner),
troque o `ShapeMesh` da peça por um `useGLTF` e mantenha os mesmos vetores.

## Licença

MIT. Marcas citadas pertencem aos seus donos e aparecem só para ilustrar.
