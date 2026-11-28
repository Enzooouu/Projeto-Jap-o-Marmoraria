# Resumo do projeto: site da Japão Granitos & Mármores

Use este texto para continuar o trabalho em outra conta ou conversa. Cole ele no começo da nova conversa.

## Contexto
- Protótipo gratuito de site para a marmoraria **Japão Granitos & Mármores** (Piracicaba/SP), para tentar vender o site ao dono.
- Repositório: `Enzooouu/Projeto-Jap-o-Marmoraria`, ramo **`ccr-6ae44f6f-9fiios`**.
- Site em **HTML, CSS e JavaScript puros** (sem instalar nada): `index.html`, `css/style.css`, `js/main.js`, imagens em `img/`.
- Para ver: baixar o ZIP do ramo no GitHub e abrir o `index.html`. Guia completo no `README.md`; créditos das fotos em `CREDITOS.md`.

## Dados da empresa (não inventar outros)
- Pias, bancadas, balcões, cozinhas e banheiros em granito e mármore.
- R. Antônio Bacchi, 1136, Paulicéia, Piracicaba/SP · WhatsApp (19) 98741-5983 · seg a sex, 8h às 17h45.
- Instagram @japaogranitosemarmores · Google: nota 5,0 com 133 avaliações.
- Clientes elogiam: atendimento rápido pelo WhatsApp, prazo cumprido, acabamento caprichado, material de qualidade.
- Prêmio "Melhores do Ramo de Marmoraria em Piracicaba", 7º ano consecutivo em 2023 (post do Instagram: https://www.instagram.com/p/CqBPNRtuXnY/).

## Regras do dono do projeto
- Não inventar informações, depoimentos nem nomes de clientes.
- Nunca deixar cantos vivos: todo elemento com fundo, borda ou imagem tem arredondado; cantos concêntricos (raio externo = raio interno + espaçamento).
- Mobile-first; site leve.
- Commits no nome **Enzooouu** com o e-mail `200690972+Enzooouu@users.noreply.github.com` (o e-mail antigo caía na conta errada "Enzooooou").
- Explicar tudo de forma simples (o dono do projeto é iniciante).

## Identidade visual
- Logo redesenhada em vetor: `img/logo.svg` (+ PNGs 2048 px). "JAPÃO" = Raleway (J, P e O redesenhados à mão), "GRANITOS" = Josefin Slab Bold.
- Cores: fundo `#FAFAFA`, pedra clara `#F3F2EF`, cartões `#FFFFFF`, texto `#1A1A18`, cinza `#5C5A55`, amarelo da logo `#F9D004`, ouro escuro p/ links `#7A6000`, vermelho só na bolinha `#DD002B`.
- Fontes: títulos Josefin Sans (300), texto Jost.

## Como o site está hoje (de cima para baixo)
1. **Barra do topo** em pílula: transparente no topo; ao rolar fica branca com borda fina e sombra leve.
2. **Topo**: foto em tela cheia, cantos de baixo arredondados (ficam abaixo da dobra), frase "Sua cozinha em pedra, no prazo.", botão de orçamento no WhatsApp e nota 5,0. A foto do topo não abre zoom.
3. **Serviços**: foto que troca conforme o serviço lido (pias, bancadas, cozinhas, banheiros, balcões).
4. **Vitrine de pedras**: carrossel infinito, foto de obra + card da pedra encostado, legenda; laterais menores e apagadas; avança a cada 11 s e fica 2x mais lento com o mouse em cima.
5. **Trabalhos entregues**: 3 colunas (fotos começam em alturas diferentes e terminam alinhadas), mais larga (até 1760 px), título em cada obra, botão do Instagram no topo da seção.
6. **Simulador de orçamento** (estilo inspirado no site da Belcor): à esquerda título, desenho da peça na pedra, mensagem pronta e botão do WhatsApp; à direita cartão com perguntas (peça, tamanho + medidas opcionais, pedra, dados, observações).
7. **Avaliações** (seção clara): estatueta grande inclinada à esquerda; à direita 5,0 grande, estrelas, título, texto do prêmio, botões e 3 pontos do "por que a Japão"; embaixo fileira de cartões rolando (2x mais lenta com o mouse em cima), cartões mais altos.
8. **Como funciona**: contato → medição → produção → instalação.
9. **Endereço** com mapa e horário.
10. **Rodapé** com contatos, Instagram e créditos.
- Toda imagem (exceto foto do topo, logo e amostras do simulador) abre zoom com pinça, roda do mouse e setas.
- Faixa com o nome que rola e muda de direção conforme a rolagem; botão fixo do WhatsApp amarelo.

## O que ainda falta / pendências
- **Fotos reais**: todas as fotos de obras são ilustrativas (Unsplash e fotos abertas com crédito). Trocar pelas do Instagram da Japão e apagar os avisos "Foto ilustrativa".
- **Avaliações reais**: os cartões mostram os elogios frequentes, sem nomes. Para usar avaliações reais, copiar 6 a 10 do Google (texto, nome, há quanto tempo) e trocar no `index.html` (instruções no comentário da seção).
- **Confirmar com o dono** quais pedras ele trabalha e os textos de serviços/etapas.
- Os commits antigos (antes de `f91e6e9`) aparecem na conta "Enzooooou"; dá para corrigir reescrevendo o histórico ou movendo o e-mail entre as contas.
- Possível próximo passo: versão horizontal da logo para o topo (se o dono aceitar).

## Preço discutido
- Faixa sugerida R$ 1.800 a R$ 2.500 + manutenção opcional R$ 100 a R$ 150/mês; o dono do projeto pensou em R$ 1.120 como preço de entrada (ok para primeiro cliente, com escopo e rodadas de ajuste combinados por escrito).

## SEO local e GEO (aplicado)
- Título e description com serviço + cidade; H1 "Granito e mármore em Piracicaba"; canônica, Open Graph e Twitter Card (img/og-imagem.jpg).
- JSON-LD @graph: HomeAndConstructionBusiness + WebSite + FAQPage.
- Seção "Perguntas frequentes" (#duvidas), robots.txt, sitemap.xml, llms.txt, netlify.toml.
- Telefone fixo (19) 3422-8887 (visto nos posts do Instagram). Endereço padronizado: "R. Antônio Bacchi, 1136 - Paulicéia, Piracicaba - SP".
- Checklist para os próximos sites: CHECKLIST-SEO-GEO.md.
