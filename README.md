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
  `GET {VITE_PLATE_API_URL}/placa/ABC1D23 → { brand, model, year, engine?, vehicleId? }` e, opcionais,
  `kind` (`carro|moto|caminhao|onibus|trator`), `yearFab`, `color`, `fuel`, `city`, `uf`, `fipeCode`, `fipeValue`,
  `fipeMonth`, `sourceName`. **Só dados do veículo**: nada do proprietário (LGPD).
- `src/providers/index.ts`: o ponto de troca.

A credencial de qualquer base de dados de placa fica **no backend**, nunca no front-end.

### Modal do veículo

Toda busca abre um modal (`src/ui/VehicleModal.tsx`, foco preso, Esc fecha) com os dados do veículo, a fonte e o aviso
"dados públicos do veículo, sem dados do proprietário". O casamento com o catálogo 3D fica em `src/data/match.ts`:

- placa de exemplo → "Ver peças em 3D";
- caminhão, ônibus ou trator → "Ver peças em 3D (exemplo)", deixando claro que o 3D é o modelo de exemplo do mesmo tipo;
- carro ou moto → diz que a Hübner fabrica para pesados/montadoras e oferece ver um exemplo, sem fingir que tem peça;
- placa não encontrada ou consulta com erro → a pessoa informa tipo, marca, modelo e ano e o app busca na
  **Tabela FIPE** (`src/providers/fipe.ts`, API pública gratuita do Parallelum, CORS aberto, 500 consultas/dia por IP
  de quem usa, sem chave): marca, modelo, ano, combustível, código e valor FIPE reais.

### Por que ainda não há consulta de placa real (15/10/2026)

Testado do servidor (AWS) com navegador real (Chromium headless): placafipe.com, keplaca.com, tabelafipebrasil.com e
placaipva.com.br devolvem bloqueio do Cloudflare para o IP (não é desafio que o navegador resolva);
consultarplacas.com carrega mas não devolve dados (reCAPTCHA); consultasdeplacas.com pede e-mail; consultadeplaca.net
é vitrine de relatório pago. Não existe API pública gratuita e oficial de placa → veículo. Caminhos possíveis, nenhum
contratado: API paga de placa (centavos a poucos reais por consulta), convênio com DETRAN/SENATRAN, ou a própria base
da Hübner/distribuidor. Quando houver, basta um backend que siga o contrato acima e `VITE_PLATE_API_URL` no build.

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
