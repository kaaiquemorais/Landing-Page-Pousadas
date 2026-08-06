/* ══════════════════════════════════════════════════════════
   AVYXYVA · Proposta comercial
   pdf.js : documento de uma única página A4, fonte Poppins
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var FILE = 'Proposta-Avyxyva-Chacara-Socorro.pdf';

  var ASSETS = [
    'assets/js/vendor/jspdf.umd.min.js',
    'assets/js/logo-b64.js',
    'assets/js/fonts/poppins-b64.js'
  ];

  /* ─────────────── Entregas ─────────────── */
  var DELIVERIES = [
    {
      tag: 'Entrega 01 · principal',
      title: 'Landing Page Profissional',
      items: ['Estrutura, acomodações e lazer',
              'Localização com mapa e rota',
              'Informações de locação',
              'Botão de WhatsApp fixo',
              'Domínio próprio incluso']
    },
    {
      tag: 'Entrega 02 · opcional',
      title: 'CRM, o painel de gestão',
      items: ['Cadastro de locações',
              'Datas reservadas organizadas',
              'Valores recebidos e gastos',
              'Lucro calculado mês a mês',
              'Gráficos de evolução']
    },
    {
      tag: 'Entrega 03 · opcional',
      title: 'Produção Audiovisual',
      items: ['Filmagem com drone',
              'Câmera profissional',
              'Sessão de fotos completa',
              'Edição do vídeo final',
              'Material liberado para uso']
    }
  ];

  /* ─────────────── Investimento ─────────────── */
  var PLANS = [
    { title: 'Landing Page Profissional', sub: 'domínio por 1 ano', pix: 'R$ 1.000,00',
      rows: ['1.000,00','543,35','365,87','279,71','227,56','191,45',
             '166,73','147,69','132,95','121,13','111,41','103,29'] },
    { title: 'Landing Page Profissional', sub: 'domínio por 3 anos', pix: 'R$ 1.100,00', highlight: true,
      rows: ['1.100,00','597,69','402,46','307,68','250,32','210,60',
             '183,41','162,46','146,24','133,24','122,56','113,62'] },
    { title: 'CRM, painel de gestão', sub: 'opcional', pix: 'R$ 500,00',
      rows: ['500,00','271,68','182,94','139,86','113,78','95,73',
             '83,37','73,85','66,48','60,57','55,71','51,65'] },
    { title: 'Produção Audiovisual', sub: 'opcional', pix: 'R$ 700,00',
      rows: ['700,00','380,35','256,11','195,80','159,30','134,02',
             '116,72','103,39','93,07','84,79','77,99','72,30'] }
  ];

  /* ─────────────── Paleta ─────────────── */
  var C = {
    ink:   [24, 18, 46],
    ink2:  [92, 82, 122],
    ink3:  [142, 132, 170],
    vio:   [124, 58, 237],
    vioD:  [66, 24, 132],
    vioL:  [167, 139, 250],
    tintA: [244, 240, 255],
    tintB: [250, 248, 255],
    line:  [227, 218, 250],
    page:  [253, 252, 255],
    white: [255, 255, 255]
  };

  /* ─────────────── Métrica A4 ─────────────── */
  var W = 210, H = 297, M = 12, CW = W - M * 2;

  var doc, loaded = false;

  /* ═══════ Carregamento sob demanda ═══════ */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = res;
      s.onerror = function () { rej(new Error('Falha ao carregar ' + src)); };
      document.head.appendChild(s);
    });
  }
  function ensureAssets() {
    if (loaded) return Promise.resolve();
    return ASSETS.reduce(function (p, src) {
      return p.then(function () { return loadScript(src); });
    }, Promise.resolve()).then(function () { loaded = true; });
  }

  /* ═══════ Primitivas ═══════ */
  function fill(c)   { doc.setFillColor(c[0], c[1], c[2]); }
  function stroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
  function ink(c)    { doc.setTextColor(c[0], c[1], c[2]); }
  function font(style, size) { doc.setFont('Poppins', style); doc.setFontSize(size); }
  function wrap(t, w) { return doc.splitTextToSize(t, w); }

  function lerp(a, b, t) {
    return [Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t)];
  }

  /* Gradiente vertical com cantos arredondados */
  function gradPanel(x, y, w, h, c1, c2, rTop, rBot) {
    rTop = rTop || 0; rBot = rBot || 0;
    var steps = Math.max(50, Math.round(h * 4));
    var sh = h / steps;
    for (var i = 0; i < steps; i++) {
      var t = i * sh, b = t + sh, ins = 0;
      if (rTop > 0 && t < rTop) {
        var a = rTop - t;
        ins = rTop - Math.sqrt(Math.max(0, rTop * rTop - a * a));
      } else if (rBot > 0 && b > h - rBot) {
        var d = b - (h - rBot);
        ins = rBot - Math.sqrt(Math.max(0, rBot * rBot - d * d));
      }
      fill(lerp(c1, c2, i / (steps - 1)));
      doc.rect(x + ins, y + t, w - 2 * ins, sh + (i < steps - 1 ? 0.25 : 0), 'F');
    }
  }
  function gradH(x, y, w, h, c1, c2, steps) {
    steps = steps || 90;
    var sw = w / steps;
    for (var i = 0; i < steps; i++) {
      fill(lerp(c1, c2, i / (steps - 1)));
      doc.rect(x + i * sw, y, sw + 0.3, h, 'F');
    }
  }
  function rule(x, y, w, h, c1, c2) { gradH(x, y, w, h, c1, c2, 70); }

  /* ═══════ 1. Cabeçalho ═══════ */
  function header() {
    gradH(0, 0, W, 46, [20, 12, 52], [76, 30, 156]);
    /* leve clarão no canto superior direito */
    for (var i = 0; i < 16; i++) {
      var c = lerp([104, 56, 200], [76, 30, 156], i / 15);
      doc.setFillColor(c[0], c[1], c[2]);
      doc.circle(W - 6, -4, 26 - i * 1.5, 'F');
    }

    doc.addImage(window.AVX_LOGO_B64, 'PNG', M, 12, 21, 21);

    font('semibold', 15); ink(C.white); doc.setCharSpace(0.35);
    doc.text('Avyxyva', M + 26, 21.5);
    doc.setCharSpace(0.9);
    font('normal', 6.4); ink([190, 166, 248]);
    doc.text('MARKETING DIGITAL', M + 26.5, 27);
    doc.setCharSpace(0);

    font('normal', 6.8); ink([204, 182, 252]);
    doc.text('P R O P O S T A   C O M E R C I A L', W - M, 15.5, { align: 'right' });
    font('semibold', 14.5); ink(C.white);
    doc.text('Chácara em Socorro/SP', W - M, 25.5, { align: 'right' });

    var d = new Date();
    var meses = ['janeiro','fevereiro','março','abril','maio','junho',
                 'julho','agosto','setembro','outubro','novembro','dezembro'];
    font('normal', 6.6); ink([176, 155, 224]);
    doc.text('Emitida em ' + d.getDate() + ' de ' + meses[d.getMonth()] + ' de ' + d.getFullYear(),
             W - M, 31.5, { align: 'right' });

    rule(0, 46, W, 1, [201, 179, 255], [91, 33, 182]);
  }

  /* ═══════ 2. Frase de abertura ═══════ */
  function intro() {
    font('semibold', 10.6); ink(C.ink);
    doc.text('A sua chácara já é encantadora. Agora ela precisa ser encontrada.', M, 56.5);
    font('normal', 8); ink(C.ink2);
    doc.text(wrap('Uma página profissional, feita primeiro para o celular, que apresenta o espaço de cima a ' +
             'baixo e leva o visitante direto para a conversa no WhatsApp.', CW), M, 62.4,
             { lineHeightFactor: 1.35 });
  }

  /* ═══════ 3. Entregas ═══════ */
  function deliveries() {
    var top = 71, h = 47, gap = 5;
    var cw = (CW - gap * 2) / 3;

    DELIVERIES.forEach(function (d, i) {
      var x = M + i * (cw + gap);
      fill(C.white); stroke(C.line); doc.setLineWidth(0.32);
      doc.roundedRect(x, top, cw, h, 3, 3, 'FD');
      gradPanel(x, top, cw, 1.8, C.vioL, C.vio, 0.9, 0);

      font('semibold', 5.9); ink(C.vio); doc.setCharSpace(0.4);
      doc.text(d.tag.toUpperCase(), x + 5, top + 8);
      doc.setCharSpace(0);
      font('semibold', 9.2); ink(C.ink);
      doc.text(wrap(d.title, cw - 10), x + 5, top + 13.6, { lineHeightFactor: 1.2 });

      var ly = top + 21;
      d.items.forEach(function (it) {
        fill(C.vio); doc.circle(x + 6.1, ly - 1.1, 0.75, 'F');
        font('normal', 7); ink(C.ink2);
        var l = wrap(it, cw - 13);
        doc.text(l, x + 8.6, ly, { lineHeightFactor: 1.25 });
        ly += l.length * 3.3 + 1.6;
      });
    });
  }

  /* ═══════ 4. Investimento ═══════ */
  function investment() {
    var top = 124;

    font('semibold', 6.6); ink(C.vio); doc.setCharSpace(0.55);
    doc.text('INVESTIMENTO', M, top);
    doc.setCharSpace(0);
    font('normal', 7.2); ink(C.ink3);
    doc.text('À vista no Pix sem nenhuma taxa adicional  ·  parcelado em até 12x com taxa de checkout de R$ 0,99',
             W - M, top, { align: 'right' });

    var gap = 5;
    var cw = (CW - gap) / 2, ch = 61;
    var y0 = top + 5;

    PLANS.forEach(function (p, i) {
      var x = M + (i % 2) * (cw + gap);
      var y = y0 + ((i / 2) | 0) * (ch + gap);
      priceCard(p, x, y, cw, ch);
    });
  }

  function priceCard(plan, x, y, w, h) {
    fill(C.white); stroke(plan.highlight ? C.vioL : C.line);
    doc.setLineWidth(plan.highlight ? 0.65 : 0.32);
    doc.roundedRect(x, y, w, h, 3, 3, 'FD');

    /* faixa superior */
    gradPanel(x + 0.35, y + 0.35, w - 0.7, 15, plan.highlight ? [52, 18, 112] : [38, 26, 78], C.vio, 2.7, 0);

    font('semibold', 8.8); ink(C.white);
    doc.text(plan.title, x + 5.5, y + 6.9);
    font('normal', 6.2); ink([214, 200, 250]);
    doc.text(plan.sub, x + 5.5, y + 11.4);

    font('normal', 5.4); ink([206, 190, 248]);
    doc.text('À VISTA NO PIX', x + w - 5.5, y + 6.2, { align: 'right' });
    font('bold', 11.5); ink(C.white);
    doc.text(plan.pix, x + w - 5.5, y + 12.2, { align: 'right' });

    font('semibold', 5.6); ink(C.vio); doc.setCharSpace(0.35);
    doc.text('PARCELAMENTO EM ATÉ 12X NO CARTÃO', x + 5.5, y + 20.5);
    doc.setCharSpace(0);

    /* grade 3 x 4 */
    var gx = x + 5, gw = w - 10, g = 2;
    var cellW = (gw - g * 2) / 3, cellH = 7.8;
    plan.rows.forEach(function (v, i) {
      var col = i % 3, row = (i / 3) | 0;
      var cx = gx + col * (cellW + g);
      var cy = y + 22.8 + row * (cellH + 1.6);
      fill(i === 0 ? C.tintA : [251, 250, 254]);
      stroke(i === 0 ? C.vioL : C.line); doc.setLineWidth(i === 0 ? 0.35 : 0.22);
      doc.roundedRect(cx, cy, cellW, cellH, 1.6, 1.6, 'FD');
      font('semibold', 6); ink(i === 0 ? C.vio : C.ink3);
      doc.text((i + 1) + 'x', cx + 2.6, cy + 5.4);
      font(i === 0 ? 'semibold' : 'normal', 7); ink(C.ink);
      doc.text('R$ ' + v, cx + cellW - 2.6, cy + 5.4, { align: 'right' });
    });
  }

  /* ═══════ 5. Condições ═══════ */
  function terms() {
    var top = 260, h = 22;
    fill(C.tintB); stroke(C.line); doc.setLineWidth(0.32);
    doc.roundedRect(M, top, CW, h, 3, 3, 'FD');
    gradPanel(M, top, 1.6, h, C.vioL, C.vio, 0.8, 0.8);

    font('semibold', 6.4); ink(C.vio); doc.setCharSpace(0.5);
    doc.text('O QUE ESTÁ COMBINADO', M + 6, top + 6.5);
    doc.setCharSpace(0);

    var list = [
      'Alterações no site sem custo adicional',
      'Domínio incluso no período contratado',
      'Produção realizada em Socorro/SP',
      'Opcionais podem ser contratados depois',
      'Atendimento direto com Kaique Morais',
      'Produção pode ser feita em setembro'
    ];
    var colW = (CW - 12) / 3;
    list.forEach(function (t, i) {
      var cx = M + 6 + (i % 3) * colW;
      var cy = top + 12.6 + ((i / 3) | 0) * 5.2;
      fill(C.vio); doc.circle(cx + 0.8, cy - 1.1, 0.7, 'F');
      font('normal', 6.5); ink(C.ink2);
      doc.text(t, cx + 3.2, cy);
    });
  }

  /* ═══════ 6. Rodapé ═══════ */
  function footer() {
    rule(M, 287, CW, 0.45, [201, 179, 255], [91, 33, 182]);
    font('semibold', 7.4); ink(C.ink);
    doc.text('Kaique Morais', M, 292.4);
    font('normal', 6.6); ink(C.ink3);
    doc.text('·  Avyxyva Marketing Digital', M + 23, 292.4);
    font('normal', 6.6); ink(C.vio);
    doc.text('Vamos colocar a chácara no ar?', W - M, 292.4, { align: 'right' });
  }

  /* ═══════ Montagem ═══════ */
  function build() {
    var jsPDF = window.jspdf.jsPDF;
    doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });

    doc.addFileToVFS('Poppins-Regular.ttf',  window.AVX_FONTS.regular);
    doc.addFileToVFS('Poppins-SemiBold.ttf', window.AVX_FONTS.semibold);
    doc.addFileToVFS('Poppins-Bold.ttf',     window.AVX_FONTS.bold);
    doc.addFont('Poppins-Regular.ttf',  'Poppins', 'normal');
    doc.addFont('Poppins-SemiBold.ttf', 'Poppins', 'semibold');
    doc.addFont('Poppins-Bold.ttf',     'Poppins', 'bold');
    doc.setFont('Poppins', 'normal');

    doc.setProperties({
      title: 'Proposta Comercial · Chácara em Socorro/SP',
      subject: 'Landing Page Profissional, painel CRM e produção audiovisual',
      author: 'Kaique Morais · Avyxyva Marketing Digital',
      keywords: 'proposta, chácara, socorro, landing page, crm, drone',
      creator: 'Avyxyva Marketing Digital'
    });

    fill(C.page); doc.rect(0, 0, W, H, 'F');

    header();
    intro();
    deliveries();
    investment();
    terms();
    footer();

    doc.save(FILE);
  }

  /* ═══════ Botão ═══════ */
  var btn = document.getElementById('downloadPdf');
  var label = document.getElementById('dlLabel');
  var meta = document.getElementById('dlMeta');
  var metaDefault = meta.textContent;

  btn.addEventListener('click', function () {
    if (btn.classList.contains('is-busy')) return;
    btn.classList.add('is-busy');
    btn.classList.remove('is-done');
    label.textContent = 'Preparando o documento…';

    ensureAssets()
      .then(function () {
        label.textContent = 'Gerando a proposta…';
        return new Promise(function (r) { setTimeout(r, 80); });
      })
      .then(function () {
        build();
        btn.classList.remove('is-busy');
        btn.classList.add('is-done');
        label.textContent = 'Proposta baixada com sucesso';
        meta.textContent = 'Se o download não aparecer, confira a pasta de downloads do seu aparelho.';
        setTimeout(function () {
          btn.classList.remove('is-done');
          label.textContent = 'Baixar proposta novamente';
          meta.textContent = metaDefault;
        }, 6000);
      })
      .catch(function (err) {
        console.error(err);
        btn.classList.remove('is-busy');
        label.textContent = 'Tentar novamente';
        meta.textContent = 'Não foi possível gerar o arquivo. Verifique a conexão e tente de novo.';
      });
  });
})();
