# Site — Japão Granitos & Mármores (protótipo)

Site de uma página para a Japão Granitos & Mármores (Piracicaba/SP). Feito só com
HTML, CSS e JavaScript puros: **não precisa instalar nada** para ver nem para editar.
Ele abre rápido no celular porque não usa bibliotecas pesadas e as fotos estão em WebP,
em dois tamanhos (o celular baixa a versão menor).

```
index.html      ← a página (todo o texto do site está aqui)
css/style.css   ← cores, fontes, tamanhos e arredondados
js/main.js      ← simulador de orçamento, menu, animações
img/fotos/      ← fotos de ambientes (provisórias, do Unsplash)
img/pedras/     ← fotos das pedras do catálogo
img/logo.svg    ← a logo redesenhada em vetor (nítida em qualquer tamanho)
img/logo-alta-resolucao*.png ← a logo em 2048 × 2048 px (fundo branco e transparente)
CREDITOS.md     ← de onde veio cada foto
```

---

## Passo a passo: abrir o site no seu computador

### 1. Baixar os arquivos do GitHub

1. Entre no repositório `Enzooouu/Projeto-Jap-o-Marmoraria` no GitHub.
2. Logo acima da lista de arquivos tem um botão com o nome do ramo (geralmente `main`).
   Clique nele e escolha o ramo **`ccr-6ae44f6f-9fiios`** (é onde o site está).
3. Clique no botão verde **Code** → **Download ZIP**.
4. Abra a pasta de Downloads, clique com o botão direito no arquivo `.zip` e escolha
   **Extrair tudo** (Windows) ou dê dois cliques nele (Mac).

### 2. Abrir no navegador

1. Entre na pasta que foi extraída.
2. Dê **dois cliques no arquivo `index.html`**. Ele abre no seu navegador (Chrome, Edge…).

Pronto, é só isso. Precisa estar com internet, porque as fontes e o mapa vêm do Google.

### 3. Ver como fica no celular (sem celular)

1. Com o site aberto no Chrome, aperte **F12** (no Mac: `Cmd + Option + I`).
2. Clique no ícone de **celular/tablet** no canto de cima do painel que abriu
   (ou aperte `Ctrl + Shift + M`).
3. Lá em cima escolha um aparelho, por exemplo "iPhone 12 Pro".

### 4. Mandar um link para o dono ver no celular dele (grátis)

O jeito mais fácil é o **Netlify Drop**:

1. Acesse **app.netlify.com/drop** e crie uma conta grátis (pode entrar com o GitHub).
2. **Arraste a pasta inteira do site** (a que tem o `index.html` dentro) para a página.
3. Em alguns segundos aparece um link do tipo `https://nome-aleatorio.netlify.app`.
   Esse é o link que você manda no WhatsApp do dono.
4. Em "Site configuration" dá para trocar o nome, por exemplo `japao-granitos.netlify.app`.

Outra opção é o GitHub Pages: no repositório vá em **Settings → Pages**, em "Branch"
escolha `ccr-6ae44f6f-9fiios` e a pasta `/ (root)`, e clique em **Save**. Depois de
um ou dois minutos o link aparece nessa mesma tela.

---

## Para editar com conforto (opcional)

Dá para editar até no Bloco de Notas, mas o recomendado é:

1. Instale o **Visual Studio Code** (grátis): code.visualstudio.com → Download.
2. Abra o VS Code → **File → Open Folder** → escolha a pasta do site.
3. Na barra da esquerda, clique em **Extensions** (ícone de quadradinhos), procure
   **Live Server** e clique em **Install**.
4. Abra o `index.html` e clique em **Go Live** no canto de baixo à direita.
   O site abre no navegador e **atualiza sozinho** toda vez que você salvar um arquivo.

---

## Como trocar o que é provisório

Tudo que precisa ser trocado está marcado no código com um comentário que começa com
**`TROCAR`**. No VS Code, aperte `Ctrl + Shift + F` e procure por `TROCAR` para achar todos.

### A logo
A logo foi redesenhada em vetor (`img/logo.svg`) com as mesmas fontes da original
(Raleway em "JAPÃO", com o J redesenhado igual ao da original, e Josefin Slab Bold em "GRANITOS") e as mesmas cores
(amarelo `#F9D004`, vermelho `#DD002B`). Para usar fora do site (Instagram, cartão, fachada),
use `img/logo-alta-resolucao.png` ou a versão com fundo transparente.

### As fotos
Troque os arquivos dentro de `img/fotos/` **mantendo exatamente o mesmo nome**.
Cada foto tem duas versões: `-800.webp` (celular) e `-1600.webp` (computador).
Se as fotos novas forem `.jpg`, tudo bem: dá para converter grátis em **squoosh.app**
(arraste a foto, escolha "WebP", qualidade 75, e redimensione para 800 e depois 1600 de largura).

- `hero-*` → a foto grande do topo (uma cozinha/bancada bonita feita pela Japão)
- `servico-pias`, `servico-bancadas`, `servico-cozinhas`, `servico-banheiros`, `servico-balcoes`
- `galeria-1` a `galeria-5` → "Trabalhos entregues" (as fotos do Instagram da Japão servem)

Quando a galeria tiver fotos reais, **apague** no `index.html` a frase
"Imagens ilustrativas neste protótipo…" (procure `nota-prototipo`).

### As pedras do catálogo
As 7 pedras (Preto Absoluto, Verde Ubatuba, Tan Brown, Delicatus, Carrara, Calacatta e
Nero Marquina) são **exemplos comuns no mercado**. Confirme com o dono quais ele trabalha.
Para mudar uma pedra:
1. No `index.html`, procure a seção `CATÁLOGO DE PEDRAS` e edite o `<li>` da pedra.
2. No `js/main.js`, ajuste a lista `PEDRAS` lá no começo (ela alimenta o simulador).
3. Coloque a foto em `img/pedras/` com o nome `id-480.webp` e `id-900.webp`
   (fotos quadradas, bem de perto da pedra).

### Número de WhatsApp, endereço e horário
- WhatsApp: no `index.html` procure `5519987415983` e troque em todos os lugares;
  no `js/main.js` troque a linha `const WHATSAPP = '5519987415983';`.
- Endereço e horário: estão no `index.html` nas seções `ENDEREÇO` e `RODAPÉ`.
- Prêmio "Melhores do Ramo em Piracicaba": está no `index.html` dentro da seção `POR QUE A JAPÃO` (procure `premio`). Atualize o ano quando houver um prêmio mais recente.

### Cores
No começo do `css/style.css` ficam as variáveis de cor (`--gold` é o amarelo da logo,
`--red` é o vermelho da bolinha, `--ink` é o texto). Troque ali e o site inteiro muda.

---

## O que o site tem

1. Topo com foto grande, frase e botão "Pedir orçamento no WhatsApp"
2. Serviços: pias, bancadas, cozinhas, banheiros e balcões
3. Catálogo de pedras com filtro (granitos / mármores)
4. Galeria de trabalhos
5. Simulador de orçamento: o cliente escolhe peça, pedra e tamanho, vê um desenho da peça
   na pedra escolhida, e o botão abre o WhatsApp com a mensagem pronta (sem preço)
6. Por que a Japão (o que os clientes elogiam)
7. Nota 5,0 com 133 avaliações no Google, com link para as avaliações
8. Como funciona: contato → medição → produção → instalação
9. Endereço com mapa e horário
10. Botão de WhatsApp fixo no canto (aparece depois do topo)
11. Rodapé com contatos, Instagram e créditos das fotos

**Antes de publicar de verdade:** trocar as fotos provisórias, colocar a logo,
confirmar as pedras e apagar o aviso de imagens ilustrativas.
