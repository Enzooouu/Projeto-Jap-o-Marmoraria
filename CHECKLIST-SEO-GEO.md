# Checklist de SEO local e GEO (usar em todo site novo)

Modelo aplicado no site da Japão Granitos & Mármores. Para um cliente novo, troque os dados em cada item.
Regra de ouro: **só dados reais da empresa**. Se não tem a informação, não escreva.

## 1. Dados da empresa (preencher antes de começar)
- Nome exato como está no Google Maps
- Endereço exato (mesma escrita do Maps) e cidade/UF
- Telefones (WhatsApp e fixo), horário, Instagram, link do Maps
- Nota e número de avaliações do Google, prêmios
- Serviços, materiais, área atendida, para quem (casas, empresas)
- URL final do site

Escreva o **NAP** (nome, endereço, telefone) uma vez e copie exatamente igual em todo lugar:
título, texto, cartão de endereço, rodapé, JSON-LD, FAQ e llms.txt.

## 2. `<head>`
- `<title>`: serviço + cidade | nome (até ~65 caracteres)
- `<meta name="description">`: o que faz, onde, prova (nota), chamada (até ~160)
- `<link rel="canonical">` com a URL final
- Open Graph: `og:title`, `og:description`, `og:url`, `og:image` (JPG 1200×630, URL completa), `og:locale` pt_BR
- Twitter Card `summary_large_image`
- Fontes carregando sem bloquear (preload + `media="print" onload`)
- Preload da foto do topo com `fetchpriority="high"`

## 3. Dados estruturados (JSON-LD, um bloco `@graph`)
- `LocalBusiness` (ou subtipo: `HomeAndConstructionBusiness`, `Dentist`, `Restaurant`…) com
  nome, endereço, telefone, `contactPoint`, horário, `areaServed`, `aggregateRating`, `award`,
  `hasMap`, `sameAs` (Instagram), `hasOfferCatalog` com os serviços
- `WebSite`
- `FAQPage` com as mesmas perguntas e respostas que aparecem na página
- Validar em https://search.google.com/test/rich-results e https://validator.schema.org

## 4. Conteúdo (GEO: para a IA entender e citar)
- Um único `<h1>` com serviço + cidade; depois `<h2>` por seção e `<h3>` dentro delas
- Uma frase logo no começo que se explica sozinha:
  "A [empresa] é uma [tipo] em [cidade] que faz [serviços] para [público]."
- Seção **Perguntas frequentes** (6 a 8): onde fica, área atendida, serviços, materiais,
  prazo, como pedir orçamento, avaliações. Respostas curtas, com nome da empresa e cidade
- Todo texto importante em HTML, nunca só dentro de imagem
- HTML semântico: `header`, `nav`, `main`, `section`, `footer`, `address`

## 5. Imagens
- WebP (ou AVIF), comprimidas, com `width` e `height`
- `alt` descrevendo o que a foto mostra (peça, material, empresa)
- `loading="lazy"` em tudo abaixo da primeira tela

## 6. Arquivos na raiz
- `robots.txt` liberando buscadores e robôs de IA, com link do sitemap
- `sitemap.xml` com a URL final
- `llms.txt` resumindo empresa, serviços, área, contatos e como pedir orçamento
- `netlify.toml` (ou equivalente) com cache longo para imagens

## 7. Mapa e contato
- Mapa do Google embutido na seção de endereço (`loading="lazy"`)
- Botão "Como chegar", link `tel:` para o fixo e link do WhatsApp

## 8. Velocidade (meta: 90+ no Lighthouse no celular)
- Animações só rodam quando estão na tela
- Nada de SVG gigante dentro do HTML (vira arquivo em `img/`)
- Rodar: `npx lighthouse URL --view` (celular) e `--preset=desktop`

## 9. Depois de publicar
- Cadastrar o site no Google Search Console e enviar o `sitemap.xml`
- Colocar o link do site no Google Meu Negócio e no Instagram
- Conferir a prévia do link no WhatsApp
