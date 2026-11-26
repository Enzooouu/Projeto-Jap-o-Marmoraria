/* =========================================================
   Japão Granitos & Mármores — comportamento do site
   ========================================================= */

/* Número do WhatsApp (só números, com 55 + DDD) */
const WHATSAPP = '5519987415983';

/* Lista de pedras do simulador. Para incluir uma pedra, adicione uma linha aqui
   e coloque a foto em img/pedras/<id>-480.webp */
const PEDRAS = [
  { id: 'preto-absoluto', nome: 'Preto Absoluto', tipo: 'granito' },
  { id: 'verde-ubatuba', nome: 'Verde Ubatuba', tipo: 'granito' },
  { id: 'tan-brown', nome: 'Tan Brown', tipo: 'granito' },
  { id: 'delicatus', nome: 'Delicatus', tipo: 'granito' },
  { id: 'carrara', nome: 'Carrara', tipo: 'mármore' },
  { id: 'calacatta', nome: 'Calacatta', tipo: 'mármore' },
  { id: 'nero-marquina', nome: 'Nero Marquina', tipo: 'mármore' },
];

const PECAS = {
  pia: 'Pia',
  bancada: 'Bancada',
  cozinha: 'Cozinha completa',
  banheiro: 'Bancada de banheiro',
  balcao: 'Balcão',
};

document.documentElement.classList.add('js');
const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- menu no celular ---------- */
(() => {
  const botao = $('.menu-abrir');
  const menu = $('#menu');
  if (!botao || !menu) return;
  const fechar = () => { menu.classList.remove('aberto'); botao.setAttribute('aria-expanded', 'false'); botao.textContent = 'Menu'; };
  botao.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.textContent = aberto ? 'Fechar' : 'Menu';
  });
  $$('a', menu).forEach((a) => a.addEventListener('click', fechar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
})();

/* ---------- entradas suaves das seções ---------- */
(() => {
  const itens = $$('.revelar');
  if (!('IntersectionObserver' in window) || reduzir) { itens.forEach((el) => el.classList.add('visivel')); return; }
  // escalona os itens que entram juntos (título, texto, imagem)
  const grupos = new Map();
  itens.forEach((el) => {
    const pai = el.parentElement;
    const i = grupos.get(pai) || 0;
    el.style.setProperty('--atraso', `${Math.min(i, 5) * 80}ms`);
    grupos.set(pai, i + 1);
  });
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visivel'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  itens.forEach((el) => io.observe(el));
})();

/* ---------- serviços: foto parada que troca conforme a leitura ---------- */
(() => {
  const servicos = $$('.servico');
  const fotos = $$('.servicos-palco img');
  if (!servicos.length || !('IntersectionObserver' in window)) return;
  const ativar = (nome) => {
    servicos.forEach((s) => s.classList.toggle('ativo', s.dataset.servico === nome));
    fotos.forEach((f) => f.classList.toggle('ativo', f.dataset.servico === nome));
  };
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => { if (e.isIntersecting) ativar(e.target.dataset.servico); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  servicos.forEach((s) => io.observe(s));
  ativar('pias');
})();

/* ---------- trilhos com rolagem lateral (pedras e etapas) ---------- */
function trilho(trilhoEl, barraEl, botoes, aoMudar) {
  if (!trilhoEl) return;
  const atualizar = () => {
    const max = trilhoEl.scrollWidth - trilhoEl.clientWidth;
    const p = max > 0 ? trilhoEl.scrollLeft / max : 1;
    const visivel = trilhoEl.clientWidth / trilhoEl.scrollWidth;
    if (barraEl) barraEl.style.transform = `scaleX(${Math.min(1, visivel + p * (1 - visivel))})`;
    const secao = trilhoEl.closest('section');
    if (secao) secao.classList.toggle('sem-rolagem', max <= 2);
    if (aoMudar) aoMudar();
  };
  trilhoEl.addEventListener('scroll', atualizar, { passive: true });
  window.addEventListener('resize', atualizar);
  botoes.forEach((b) => b.addEventListener('click', () => {
    const dir = Number(b.dataset.rolar || b.dataset.rolarEtapas);
    const item = trilhoEl.firstElementChild;
    const passo = item ? item.getBoundingClientRect().width + 20 : 300;
    trilhoEl.scrollBy({ left: dir * passo, behavior: reduzir ? 'auto' : 'smooth' });
  }));
  atualizar();
}

(() => {
  const t = $('#etapas-trilho');
  if (!t) return;
  const etapas = $$('.etapa', t);
  const marcar = () => {
    const esq = t.getBoundingClientRect().left;
    let atual = etapas[0];
    etapas.forEach((e) => { if (e.getBoundingClientRect().left - esq < 40) atual = e; });
    if (t.scrollLeft + t.clientWidth >= t.scrollWidth - 4) atual = etapas[etapas.length - 1];
    etapas.forEach((e) => e.classList.toggle('atual', e === atual));
  };
  trilho(t, $('#etapas-progresso'), $$('[data-rolar-etapas]'), marcar);
})();

/* ---------- barra do topo: transparente no início, pílula com borda e sombra ao rolar ---------- */
(() => {
  const topo = $('.topo');
  if (!topo) return;
  const marcar = () => topo.classList.toggle('rolou', window.scrollY > 12);
  window.addEventListener('scroll', marcar, { passive: true });
  marcar();
})();

/* ---------- vitrine de pedras: carrossel infinito, avança sozinho a cada 11 segundos ---------- */
/* As pedras vizinhas aparecem nas laterais. Com o mouse em cima o tempo corre 2x mais devagar. */
(() => {
  const vitrine = $('#vitrine');
  const trilhoEl = $('#vitrine-trilho');
  if (!vitrine || !trilhoEl) return;
  const INTERVALO = 11000;
  const LENTO = 0.5;                 // velocidade do tempo com o mouse em cima
  const originais = $$('.slide', trilhoEl);
  const total = originais.length;
  const N = 2;                       // cópias em cada ponta, para as laterais nunca ficarem vazias
  const clonar = (el) => { const c = el.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.classList.add('clone'); return c; };
  for (let k = 0; k < N; k++) {
    trilhoEl.appendChild(clonar(originais[k % total]));
    trilhoEl.insertBefore(clonar(originais[(total - 1 - k + total) % total]), trilhoEl.firstElementChild);
  }
  const slides = $$('.slide', trilhoEl);

  const atualEl = $('#vitrine-atual');
  const tempoEl = $('#vitrine-tempo');
  $('#vitrine-total').textContent = total;
  let i = N;                         // posição no trilho (N = primeira pedra real)
  let ocupado = false;
  let progresso = 0;                 // 0 a 1 até a próxima troca
  let devagar = false, parado = false;

  const deslocamento = () => {
    const w = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(trilhoEl).columnGap) || 0;
    return (vitrine.clientWidth - w) / 2 - i * (w + gap);
  };
  const posicionar = (animar) => {
    trilhoEl.style.transition = animar && !reduzir ? 'transform .9s cubic-bezier(.65,0,.25,1)' : 'none';
    trilhoEl.style.transform = `translate3d(${deslocamento()}px, 0, 0)`;
    const real = ((i - N) % total + total) % total;
    atualEl.textContent = real + 1;
    slides.forEach((sl, k) => {
      const ativo = k === i;
      sl.classList.toggle('ativo', ativo);
      // só o slide do meio entra na leitura de tela e no Tab; os das laterais servem para clicar e ir até eles
      if (ativo) sl.removeAttribute('aria-hidden'); else sl.setAttribute('aria-hidden', 'true');
      $$('a, button, img[tabindex]', sl).forEach((f) => { f.tabIndex = ativo ? 0 : -1; });
    });
  };
  const corrigirPonta = () => {
    if (i >= total + N) { i -= total; posicionar(false); }
    if (i < N) { i += total; posicionar(false); }
    ocupado = false;
  };
  const ir = (passo) => {
    if (ocupado) return;
    i += passo;
    ocupado = !reduzir;
    progresso = 0;
    posicionar(true);
    if (reduzir) corrigirPonta();
  };
  trilhoEl.addEventListener('transitionend', (e) => { if (e.target === trilhoEl) corrigirPonta(); });
  window.addEventListener('resize', () => posicionar(false));

  // clicar numa pedra da lateral leva até ela
  vitrine.addEventListener('click', (e) => {
    const sl = e.target.closest('.slide');
    if (!sl || sl.classList.contains('ativo')) return;
    e.preventDefault(); e.stopPropagation();
    ir(slides.indexOf(sl) - i);
  }, true);

  let antes = performance.now();
  const relogio = (agora) => {
    const dt = agora - antes; antes = agora;
    if (!parado) {
      progresso += (dt / INTERVALO) * (devagar ? LENTO : 1);
      if (progresso >= 1) ir(1);
      tempoEl.style.transform = `scaleX(${Math.min(progresso, 1)})`;
    }
    requestAnimationFrame(relogio);
  };

  vitrine.addEventListener('mouseenter', () => { devagar = true; });
  vitrine.addEventListener('mouseleave', () => { devagar = false; });
  vitrine.addEventListener('focusin', () => { devagar = true; });
  vitrine.addEventListener('focusout', () => { devagar = false; });
  document.addEventListener('visibilitychange', () => { parado = document.hidden; antes = performance.now(); });

  $('#vitrine-proxima').addEventListener('click', () => ir(1));
  $('#vitrine-anterior').addEventListener('click', () => ir(-1));

  // arrastar com o dedo
  let x0 = null;
  vitrine.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  vitrine.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) ir(dx < 0 ? 1 : -1);
  });
  vitrine.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') ir(1);
    if (e.key === 'ArrowLeft') ir(-1);
  });

  posicionar(false);
  // fontes e imagens podem mudar a largura depois de carregar
  window.addEventListener('load', () => posicionar(false));
  requestAnimationFrame(relogio);
})();

/* ---------- zoom: toda imagem abre ampliada, com zoom e arraste ---------- */
(() => {
  const caixa = $('#zoom');
  const palco = $('#zoom-palco');
  const img = $('#zoom-img');
  const legenda = $('#zoom-legenda');
  if (!caixa) return;
  const fora = '.hero-foto img, .marca-img, .rodape-logo, .amostra img, .zoom img, .clone img, .slide:not(.ativo) img';
  const visivel = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const todas = () => $$('main img, footer img').filter((el) => !el.matches(fora));
  // na navegação entram só as fotos que estão de fato na tela (nada de cópia escondida)
  const lista = () => todas().filter((el) => visivel(el) && (!el.closest('.servicos-palco') || el.classList.contains('ativo')));
  let atuais = [];
  let pos = 0;
  let escala = 1, tx = 0, ty = 0;
  let origem = null;

  const maior = (el) => {
    const ss = el.getAttribute('srcset');
    if (!ss) return el.currentSrc || el.src;
    return ss.split(',').map((p) => p.trim().split(/\s+/)).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
  };
  const aplicar = (suave) => {
    img.style.transition = suave && !reduzir ? 'transform .25s ease' : 'none';
    img.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${escala})`;
    caixa.classList.toggle('ampliada', escala > 1.01);
  };
  const limitar = () => {
    const r = palco.getBoundingClientRect();
    const w = img.offsetWidth * escala, h = img.offsetHeight * escala;
    const mx = Math.max(0, (w - r.width) / 2), my = Math.max(0, (h - r.height) / 2);
    tx = Math.min(mx, Math.max(-mx, tx)); ty = Math.min(my, Math.max(-my, ty));
  };
  const zoomEm = (nova, cx, cy) => {
    nova = Math.min(5, Math.max(1, nova));
    const r = palco.getBoundingClientRect();
    const px = (cx ?? r.left + r.width / 2) - (r.left + r.width / 2);
    const py = (cy ?? r.top + r.height / 2) - (r.top + r.height / 2);
    tx = px - (px - tx) * (nova / escala);
    ty = py - (py - ty) * (nova / escala);
    escala = nova;
    if (escala === 1) { tx = 0; ty = 0; }
    limitar(); aplicar(true);
  };
  const mostrar = (k) => {
    pos = (k + atuais.length) % atuais.length;
    const el = atuais[pos];
    escala = 1; tx = 0; ty = 0; aplicar(false);
    img.src = maior(el);
    img.alt = el.alt || '';
    legenda.textContent = el.alt || '';
    caixa.classList.toggle('so-uma', atuais.length < 2);
  };
  const abrir = (el) => {
    atuais = lista();
    if (!atuais.includes(el)) atuais.unshift(el);
    origem = document.activeElement;
    mostrar(atuais.indexOf(el));
    caixa.hidden = false;
    document.documentElement.classList.add('zoom-aberto');
    $('#zoom-fechar').focus();
  };
  const fechar = () => {
    caixa.hidden = true;
    document.documentElement.classList.remove('zoom-aberto');
    img.removeAttribute('src');
    if (origem && origem.focus) origem.focus();
  };

  // deixa as imagens clicáveis e acessíveis pelo teclado
  todas().forEach((el) => {
    el.classList.add('ampliavel');
    if (el.closest('a, button, label')) return;
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `Ampliar imagem: ${el.alt || 'foto'}`);
  });
  document.addEventListener('click', (e) => {
    const el = e.target.closest('img.ampliavel');
    if (el && !el.closest('.clone')) { e.preventDefault(); abrir(el); }
  });
  document.addEventListener('keydown', (e) => {
    if (!caixa.hidden) {
      if (e.key === 'Escape') fechar();
      if (e.key === 'ArrowRight') mostrar(pos + 1);
      if (e.key === 'ArrowLeft') mostrar(pos - 1);
      if (e.key === '+' || e.key === '=') zoomEm(escala * 1.5);
      if (e.key === '-') zoomEm(escala / 1.5);
      if (e.key === 'Tab') { // mantém o foco dentro da janela
        const f = $$('button', caixa).filter((b) => b.offsetParent);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
      return;
    }
    const el = document.activeElement;
    if (el && el.classList && el.classList.contains('ampliavel') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrir(el); }
  });

  $('#zoom-fechar').addEventListener('click', fechar);
  $('#zoom-mais').addEventListener('click', () => zoomEm(escala * 1.5));
  $('#zoom-menos').addEventListener('click', () => zoomEm(escala / 1.5));
  $('#zoom-prox').addEventListener('click', () => mostrar(pos + 1));
  $('#zoom-ant').addEventListener('click', () => mostrar(pos - 1));
  palco.addEventListener('click', (e) => { if (e.target === palco && escala === 1) fechar(); });
  palco.addEventListener('dblclick', (e) => zoomEm(escala > 1 ? 1 : 2.5, e.clientX, e.clientY));
  palco.addEventListener('wheel', (e) => { e.preventDefault(); zoomEm(escala * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX, e.clientY); }, { passive: false });

  // arrastar (mouse ou um dedo) e pinça (dois dedos)
  const toques = new Map();
  let arraste = null, pinca = null, ultimoToque = 0;
  palco.addEventListener('pointerdown', (e) => {
    palco.setPointerCapture(e.pointerId);
    toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (toques.size === 2) {
      const [a, b] = [...toques.values()];
      pinca = { d: Math.hypot(a.x - b.x, a.y - b.y), e: escala };
      arraste = null;
    } else {
      arraste = { x: e.clientX, y: e.clientY, tx, ty, moveu: false };
      // toque duplo no celular
      const agora = Date.now();
      if (e.pointerType !== 'mouse' && agora - ultimoToque < 300) zoomEm(escala > 1 ? 1 : 2.5, e.clientX, e.clientY);
      ultimoToque = agora;
    }
  });
  palco.addEventListener('pointermove', (e) => {
    if (!toques.has(e.pointerId)) return;
    toques.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinca && toques.size === 2) {
      const [a, b] = [...toques.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      escala = Math.min(5, Math.max(1, pinca.e * d / pinca.d));
      if (escala === 1) { tx = 0; ty = 0; }
      limitar(); aplicar(false);
    } else if (arraste) {
      const dx = e.clientX - arraste.x, dy = e.clientY - arraste.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) arraste.moveu = true;
      if (escala > 1) { tx = arraste.tx + dx; ty = arraste.ty + dy; limitar(); aplicar(false); }
    }
  });
  const soltar = (e) => {
    const a = arraste;
    toques.delete(e.pointerId);
    if (toques.size < 2) pinca = null;
    // sem zoom, arrastar para o lado troca de imagem
    if (a && escala === 1 && a.moveu) {
      const dx = e.clientX - a.x;
      if (Math.abs(dx) > 60) mostrar(pos + (dx < 0 ? 1 : -1));
    }
    arraste = null;
  };
  palco.addEventListener('pointerup', soltar);
  palco.addEventListener('pointercancel', soltar);
})();

/* ---------- simulador de orçamento ---------- */
(() => {
  const form = $('#simulador');
  if (!form) return;

  // monta as amostras de pedra
  const caixa = $('#amostras');
  caixa.innerHTML = PEDRAS.map((p, i) => `
    <label class="amostra">
      <input type="radio" name="pedra" value="${p.id}" ${i === 0 ? 'checked' : ''}>
      <span class="amostra-cartao">
        <img src="img/pedras/${p.id}-480.webp" width="480" height="480" alt="" loading="lazy">
        <span>${p.nome}</span>
      </span>
    </label>`).join('') + `
    <label class="amostra">
      <input type="radio" name="pedra" value="indefinida">
      <span class="amostra-cartao"><span class="amostra-vazia" aria-hidden="true"></span><span>Ainda não sei</span></span>
    </label>`;

  const forma = $('#sim-forma');
  const textura = $('#textura-img');
  const comp = $('#comp');
  const compSaida = $('#comp-saida');
  const prof = $('#prof');
  const resumo = $('#sim-resumo');
  const textoPre = $('#sim-texto');
  const campoTexto = $('#sim-campo-texto');

  const fmtM = (n) => n.toFixed(2).replace('.', ',') + ' m';
  const valor = (nome) => (form.querySelector(`input[name="${nome}"]:checked`) || {}).value;

  // desenho da peça vista de cima, com a pedra como textura
  function desenhar(peca, comprimento, profundidade) {
    const W = 420, H = 300, margem = 34;
    const pMax = W - margem * 2;
    const largura = Math.round(210 + ((comprimento - 0.5) / 5.5) * (pMax - 210));
    const fundo = Math.round((profundidade || 60) * 2.1);
    const x = (W - largura) / 2;
    const y = peca === 'balcao' ? 36 : (H - fundo) / 2 - 4;
    const pedra = 'fill="url(#textura-pedra)" stroke="url(#textura-pedra)" stroke-width="8" stroke-linejoin="round"';
    const aco = 'fill="#C9CDD0" stroke="#A9AEB2" stroke-width="2"';
    const cota = (tx, ty, t) => `<text x="${tx}" y="${ty}" text-anchor="middle" font-family="Jost, sans-serif" font-size="14" fill="#57524B">${t}</text>`;
    const medTxt = profundidade ? `${profundidade} cm` : 'profundidade a medir';
    let s = '';

    if (peca === 'cozinha') {
      // bancada em L (profundidade desenhada um pouco menor para caber pia e cooktop)
      const f = Math.round(fundo * 0.75);
      const perna = Math.max(120, Math.min(170, Math.round(largura * 0.6)));
      const y0 = 40;
      const pw = Math.min(80, Math.round(largura * 0.2));
      const px = x + largura - pw - 22;
      s += `<path class="peca" ${pedra} d="M${x} ${y0} H${x + largura} V${y0 + f} H${x + f} V${y0 + perna + f} H${x} Z"/>`;
      s += `<rect ${aco} x="${px}" y="${y0 + f * 0.2}" width="${pw}" height="${f * 0.6}" rx="8"/>`;
      const cx0 = (x + f + px) / 2 - f * 0.17;
      s += `<g fill="#3A3733">${[0, 1, 2, 3].map((i) => `<circle cx="${cx0 + (i % 2) * f * 0.34}" cy="${y0 + f * 0.32 + Math.floor(i / 2) * f * 0.36}" r="${f * 0.1}"/>`).join('')}</g>`;
      s += cota(x + largura / 2, y0 - 12, `cerca de ${fmtM(comprimento)}`);
      s += cota(x + (largura + f) / 2, y0 + f + 24, medTxt);
    } else if (peca === 'balcao') {
      // balcão: tampo com avanço para banquetas
      s += `<rect class="peca" ${pedra} x="${x}" y="${y}" width="${largura}" height="${fundo}" rx="4"/>`;
      s += `<rect class="peca" ${pedra} x="${x}" y="${y + fundo + 10}" width="${largura}" height="${Math.max(26, fundo * 0.38)}" rx="4"/>`;
      const n = Math.max(1, Math.min(6, Math.round(comprimento / 0.6)));
      s += `<g fill="#D8D4CC">${Array.from({ length: n }, (_, i) => `<circle cx="${x + (largura / n) * (i + 0.5)}" cy="${y + fundo * 1.38 + 52}" r="15"/>`).join('')}</g>`;
      s += cota(x + largura / 2, y - 14, `cerca de ${fmtM(comprimento)}`);
      s += cota(W / 2, H - 10, medTxt);
    } else {
      s += `<rect class="peca" ${pedra} x="${x}" y="${y}" width="${largura}" height="${fundo}" rx="4"/>`;
      if (peca === 'pia') {
        const cw = Math.min(110, largura * 0.4);
        s += `<rect ${aco} x="${x + largura / 2 - cw / 2}" y="${y + fundo * 0.2}" width="${cw}" height="${fundo * 0.6}" rx="10"/>`;
        s += `<circle cx="${x + largura / 2}" cy="${y + fundo * 0.11}" r="5" fill="#8E9397"/>`;
      } else if (peca === 'banheiro') {
        const cubas = comprimento >= 1.4 ? 2 : 1;
        for (let i = 0; i < cubas; i++) {
          const cx = x + (largura / (cubas + 1)) * (i + 1);
          s += `<ellipse fill="#F4F3F0" stroke="#D2CEC6" stroke-width="2" cx="${cx}" cy="${y + fundo * 0.55}" rx="${Math.min(46, largura / (cubas * 3))}" ry="${fundo * 0.3}"/>`;
          s += `<circle cx="${cx}" cy="${y + fundo * 0.12}" r="4.5" fill="#8E9397"/>`;
        }
      }
      s += cota(x + largura / 2, y - 14, `cerca de ${fmtM(comprimento)}`);
      s += cota(x + largura / 2, y + fundo + 26, medTxt);
    }
    forma.innerHTML = s;
  }

  function mensagem(dados) {
    const linhas = [
      'Olá, Japão Granitos! Vim pelo site e gostaria de um orçamento.',
      '',
      `• Peça: ${dados.peca}`,
      `• Pedra: ${dados.pedra}`,
      `• Tamanho aproximado: ${dados.tamanho}`,
    ];
    if (dados.nome) linhas.push(`• Nome: ${dados.nome}`);
    if (dados.bairro) linhas.push(`• Bairro/cidade: ${dados.bairro}`);
    linhas.push('', 'Pode me passar um orçamento?');
    return linhas.join('\n');
  }

  function atualizar() {
    const peca = valor('peca') || 'bancada';
    const pedraId = valor('pedra') || PEDRAS[0].id;
    const comprimento = Number(comp.value);
    const profundidade = Number(prof.value);
    const pedra = PEDRAS.find((p) => p.id === pedraId);

    compSaida.textContent = fmtM(comprimento);
    if (pedra) textura.setAttribute('href', `img/pedras/${pedra.id}-480.webp`);
    else textura.setAttribute('href', '');
    desenhar(peca, comprimento, profundidade);
    // sem pedra definida, mostra um cinza neutro
    if (!pedra) $$('.peca', forma).forEach((el) => { el.setAttribute('fill', '#D9D5CD'); el.setAttribute('stroke', '#D9D5CD'); });

    const tamanho = profundidade ? `${fmtM(comprimento)} × ${profundidade} cm` : `${fmtM(comprimento)} de comprimento (profundidade a medir)`;
    const nomePedra = pedra ? `${pedra.nome} (${pedra.tipo})` : 'ainda não escolhi, quero sugestões';
    resumo.textContent = `${PECAS[peca]} em ${pedra ? pedra.nome : 'pedra a escolher'}, cerca de ${tamanho}`;

    const texto = mensagem({
      peca: PECAS[peca],
      pedra: nomePedra,
      tamanho,
      nome: $('#nome').value.trim(),
      bairro: $('#bairro').value.trim(),
    });
    textoPre.textContent = texto;
    campoTexto.value = texto;
    return texto;
  }

  form.addEventListener('input', atualizar);
  form.addEventListener('change', atualizar);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(atualizar())}`;
    const aba = window.open(url, '_blank', 'noopener');
    if (!aba) window.location.href = url;
  });

  // links de outras seções que já escolhem peça ou pedra
  const irParaSimulador = () => $('#orcamento').scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' });
  $$('[data-peca]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const r = form.querySelector(`input[name="peca"][value="${a.dataset.peca}"]`);
    if (r) r.checked = true;
    atualizar();
    irParaSimulador();
  }));
  $$('[data-pedra]').forEach((b) => b.addEventListener('click', () => {
    const r = form.querySelector(`input[name="pedra"][value="${b.dataset.pedra}"]`);
    if (r) r.checked = true;
    atualizar();
    irParaSimulador();
  }));

  atualizar();
})();

/* ---------- botão fixo aparece depois do topo da página ---------- */
(() => {
  const botao = $('.whats-fixo');
  const hero = $('.hero');
  if (!botao || !hero || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([e]) => botao.classList.toggle('escondido', e.isIntersecting), { threshold: 0.35 });
  io.observe(hero);
})();

/* ---------- faixa com o nome: anda sempre e segue a direção da rolagem ---------- */
(() => {
  const faixa = $('#faixa');
  const trilho = faixa && $('.faixa-trilho', faixa);
  if (!trilho || reduzir) return;
  const BASE = 60;            // velocidade normal, em pixels por segundo
  let direcao = -1;           // -1 = anda para a esquerda (rolando para baixo), 1 = para a direita
  let x = 0;
  let extra = 0;              // empurrão extra quando a pessoa rola rápido
  let ultimoY = window.scrollY;
  let antes = performance.now();
  let visivel = true;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const delta = y - ultimoY;
    if (Math.abs(delta) > 1) direcao = delta > 0 ? -1 : 1;
    extra = Math.min(extra + Math.abs(delta) * 6, 900);
    ultimoY = y;
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visivel = e.isIntersecting; }).observe(faixa);
  }

  function passo(agora) {
    const dt = Math.min((agora - antes) / 1000, 0.05);
    antes = agora;
    if (visivel) {
      const metade = trilho.scrollWidth / 2;  // o texto está duplicado: ao andar meia faixa, volta ao início sem emenda
      x += direcao * (BASE + extra) * dt;
      if (x <= -metade) x += metade;
      if (x > 0) x -= metade;
      trilho.style.transform = `translate3d(${x}px, 0, 0)`;
    }
    extra *= Math.pow(0.04, dt); // o empurrão some aos poucos
    requestAnimationFrame(passo);
  }
  requestAnimationFrame(passo);
})();

/* ---------- ano no rodapé ---------- */
(() => { const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear(); })();
