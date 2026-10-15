# Fontes e o que é real × exemplo

Pesquisa feita em 15/10/2026, só com fontes públicas.

## O que a Hübner faz (real)

| Fonte | O que diz |
|---|---|
| https://hubner.com.br/ | Grupo Hübner: fundição, usinagem e montagem para a indústria automotiva. |
| https://hubner.com.br/quem-somos/organizacao-do-grupo/ | "Importante fornecedora da indústria automotiva, abastecendo montadoras, seus sistemistas e indústrias de bens de capital." |
| https://hubner.com.br/fundicao/institucional-hff/perfil-de-pecas-hff/ | Fundição de ferro cinzento e nodular (fornos a indução, macharia cold box/pepset, moldagem em areia verde, jateamento, pintura). |
| https://hubner.com.br/institucional-usinagem/ | Usinagem em Araucária-PR; certificações ISO 9001, ISO 14001 e IATF 16949. |
| https://hubner.com.br/atuacao/automotivo/ (imagem `automotivo-4-1-1024x214.png`) | Mostra 5 peças: travessa/suporte de suspensão, manga de eixo, volante do motor, carcaça de saída/bomba d'água, cárter. |
| https://hubner.com.br/atuacao/agricola/ (imagem `agrcola-1.png`) | Mostra carcaça de transmissão, estrutura de suporte, carcaça em forma de sino, suporte de eixo dianteiro e um tubo/coluna fundida. |
| https://www.agrolink.com.br/noticias/hubner-vai-fornecer-pecas-para-tratores-da-valtra_8136.html (2003) | Hübner fornece peças para tratores Valtra; fabrica "blocos de cabeçotes de motores e ajustadores automáticos de freio"; já atendeu reposição (Fusca, México). |
| https://br.linkedin.com/company/grupo-hubner | Fundições produzem ferro cinzento, nodular e alumínio para montadoras de ônibus, caminhões, veículos pesados e agrícolas. |
| cnpj.biz / econodata (CNPJ 06.886.749/0004-07) | Hubner Componentes e Sistemas Automotivos S/A, Araucária-PR, CNAE 2949-2/99. |

**Não encontrado:** catálogo público de reposição, códigos de peça, tabela de aplicação por marca/modelo/ano,
lista de distribuidores ou loja. A Hübner vende para montadoras (OEM), não ao varejo.

## Como isso entrou no app

- **Real:** as *famílias* de produto (campo `realFamily` em `src/data/catalog.ts`), mostradas com o selo verde "público".
- **Exemplo (inventado):** placas, códigos `HB-EX-*`, preços, disponibilidade, compatibilidade por veículo e a
  ligação entre cada peça e um modelo de veículo. Na interface aparecem com o selo amarelo "exemplo".
- O cubo de roda do caminhão não aparece nas fontes: é "família presumida".
- Marcas/modelos de veículo (Volkswagen Constellation, Valtra Série A, Mercedes-Benz OF 1721) são usados só para
  ilustrar. Nenhuma aplicação foi confirmada com a Hübner ou com as montadoras.

## Referência de UX

- https://goparts.com.br/categorias (grade de categorias com ícone e busca por placa). A página bloqueia leitura
  automatizada (Cloudflare); a referência foi o padrão de grade de categorias + lista de peças.

## Modelos 3D e ícones

- Nenhum modelo 3D baixado: todas as peças são geometria procedural (primitivas do three.js) escrita neste repositório.
- Ícones SVG desenhados para este projeto.
- Bibliotecas: three.js (MIT), React (MIT), @react-three/fiber e @react-three/drei (MIT), Vite (MIT).
