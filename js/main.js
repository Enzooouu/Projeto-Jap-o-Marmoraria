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

trilho($('#pedras-trilho'), $('#pedras-progresso'), $$('[data-rolar]'));

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

/* ---------- filtro do catálogo ---------- */
(() => {
  const chips = $$('[data-filtro]');
  const pedras = $$('.pedra');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filtro;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    pedras.forEach((p) => { p.hidden = f !== 'todas' && p.dataset.tipo !== f; });
    const t = $('#pedras-trilho');
    t.scrollTo({ left: 0 });
    t.dispatchEvent(new Event('scroll'));
  }));
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

/* ---------- ano no rodapé ---------- */
(() => { const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear(); })();
