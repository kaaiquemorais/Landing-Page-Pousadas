/* ══════════════════════════════════════════════════════════
   AVYXYVA · Proposta comercial
   app.js : etapas, quiz e navegação em telas
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };

  /* ─────────────── Perguntas ─────────────── */
  var QUESTIONS = [
    {
      eyebrow: 'Presença digital',
      text: 'Você acredita que ter uma presença digital forte traria mais reservas para a sua chácara?',
      options: [
        { k: 'A', label: 'Com certeza, é justamente o que falta hoje',  tag: 'Presença digital é prioridade' },
        { k: 'B', label: 'Acredito que sim, faria diferença',           tag: 'Aberto a crescer no digital' },
        { k: 'C', label: 'Talvez, quero entender melhor como funciona', tag: 'Quer entender o caminho' },
        { k: 'D', label: 'Hoje a gente depende só da indicação',        tag: 'Alcance a ser ampliado' }
      ]
    },
    {
      eyebrow: 'A força da imagem',
      text: 'Você concorda que boas fotos e um bom vídeo mudam a decisão de quem procura um espaço?',
      options: [
        { k: 'A', label: 'Sem dúvida, é o que mais pesa na escolha',   tag: 'Imagem decide a reserva' },
        { k: 'B', label: 'Concordo, faz muita diferença',              tag: 'Valoriza boas imagens' },
        { k: 'C', label: 'Ajuda bastante, mas o preço também conta',   tag: 'Equilíbrio entre imagem e valor' },
        { k: 'D', label: 'Nunca tinha parado para pensar nisso',       tag: 'Novo olhar sobre a imagem' }
      ]
    },
    {
      eyebrow: 'Gestão e resultado',
      text: 'Ter as reservas, os gastos e o lucro organizados em um só lugar faria diferença para você?',
      options: [
        { k: 'A', label: 'Faria toda a diferença no dia a dia',        tag: 'Gestão é prioridade' },
        { k: 'B', label: 'Sim, seria muito útil para acompanhar',      tag: 'Quer acompanhar resultados' },
        { k: 'C', label: 'Talvez mais para frente',                    tag: 'Gestão em segundo momento' },
        { k: 'D', label: 'Hoje é tudo no caderno mesmo',               tag: 'Controle ainda manual' }
      ]
    }
  ];

  /* Trechos do diagnóstico */
  var READ_1 = {
    A: 'Você já sabe o que precisa acontecer: a chácara existe, é bem cuidada, mas ainda não é encontrada por quem está procurando um espaço agora.',
    B: 'Você já enxerga que o digital pode trazer mais reservas. O passo que falta é dar à chácara um endereço próprio na internet, feito para converter.',
    C: 'Faz sentido querer entender antes de investir. Na prática é simples: uma página bem feita trabalha por vocês 24 horas por dia, respondendo dúvidas e trazendo conversas prontas.',
    D: 'Depender só da indicação limita a chácara ao círculo de quem já conhece. E são justamente as datas fora desse círculo que continuam vagas.'
  };
  var READ_2 = {
    A: 'E você tem razão: quem procura um espaço decide com os olhos, em poucos minutos. É por isso que a imagem certa vale mais do que qualquer descrição.',
    B: 'Boas imagens são o que transforma um "vou pensar" em um "quero reservar". É o detalhe que separa uma chácara boa de uma chácara desejada.',
    C: 'Preço realmente conta, mas ele só entra na conversa depois que a pessoa se encanta. Boa imagem é o que compra os primeiros segundos de atenção.',
    D: 'Vale parar para pensar: a maioria das reservas hoje nasce de uma foto vista no celular. É ali que a decisão começa.'
  };
  var READ_3 = {
    A: 'Com as reservas, os gastos e o lucro em uma tela só, as decisões deixam de ser palpite e passam a ser estratégia.',
    B: 'Acompanhar os números mês a mês mostra qual temporada rende mais e onde vale ajustar preço ou divulgação.',
    C: 'A organização pode entrar quando fizer sentido. O importante é começar pelo site e depois estruturar a gestão com calma.',
    D: 'O caderno resolve, mas esconde a informação mais valiosa: quanto a chácara realmente dá de lucro em cada mês.'
  };

  /* ─────────────── Estado ─────────────── */
  var state = { i: 0, answers: [], slide: 0 };
  window.AVX_STATE = state;

  var SLIDES = document.querySelectorAll('#stage-deck .slide');
  var TOTAL = SLIDES.length;

  var elQNum = $('#qNum'), elQBar = $('#qBar'), elQEyebrow = $('#qEyebrow'),
      elQText = $('#qText'), elQOpts = $('#qOptions'), elQBody = $('#quizBody'),
      elQCard = $('#quizCard'), elQBack = $('#qBack'),
      elLoader = $('#loader'), elDeckbar = $('#deckbar'),
      elPrev = $('#navPrev'), elNext = $('#navNext'), elDots = $('#deckDots');

  /* ───────────────────────────────────────────────
     Auto-ajuste: reduz a escala da tela ativa até o
     conteúdo caber inteiro, sem rolagem e sem corte.
     ─────────────────────────────────────────────── */
  function fitScreen(screen) {
    if (!screen || getComputedStyle(screen).display === 'none') return;
    var inner = screen.querySelector('.screen__inner');
    if (!inner) return;

    inner.style.setProperty('--fit', '1');
    var cs = getComputedStyle(screen);
    var avail = screen.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    if (avail <= 0) return;

    var k = 1;
    for (var i = 0; i < 12; i++) {
      var need = inner.scrollHeight;
      if (need <= avail) break;
      k = Math.max(0.52, k * (avail / need) * 0.995);
      inner.style.setProperty('--fit', String(k));
      if (k <= 0.52) break;
    }
  }

  function fitAll() {
    var active = document.querySelector('.stage--active');
    if (!active) return;
    Array.prototype.forEach.call(active.querySelectorAll('.screen'), fitScreen);
  }

  var fitTimer;
  function fitSoon() { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 60); }

  window.addEventListener('resize', fitSoon);
  window.addEventListener('orientationchange', function () { setTimeout(fitAll, 250); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener('load', fitAll);

  /* ─────────────── Etapas ─────────────── */
  function goStage(id) {
    ['stage-intro', 'stage-quiz', 'stage-deck'].forEach(function (s) {
      var el = document.getElementById(s);
      if (el) el.classList.toggle('stage--active', s === id);
    });
    elDeckbar.style.display = (id === 'stage-deck') ? 'flex' : 'none';
    fitAll();
  }

  /* ─────────────── Quiz ─────────────── */
  function render() {
    var q = QUESTIONS[state.i];
    elQNum.textContent = '0' + (state.i + 1);
    elQBar.style.width = ((state.i + 1) / QUESTIONS.length * 100) + '%';
    elQEyebrow.textContent = q.eyebrow;
    elQText.textContent = q.text;
    elQBack.disabled = state.i === 0;

    elQOpts.innerHTML = '';
    q.options.forEach(function (opt, idx) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'qopt';
      b.style.animation = 'in .45s ' + (0.05 + idx * 0.06) + 's cubic-bezier(.22,1,.36,1) both';
      b.innerHTML = '<span class="qopt__key">' + opt.k + '</span><span>' + opt.label + '</span>';
      if (state.answers[state.i] === idx) b.classList.add('is-picked');
      b.addEventListener('click', function () { pick(idx, b); });
      elQOpts.appendChild(b);
    });
    fitAll();
  }

  function pick(idx, btn) {
    if (elQOpts.dataset.busy === '1') return;
    elQOpts.dataset.busy = '1';
    Array.prototype.forEach.call(elQOpts.children, function (c) { c.classList.remove('is-picked'); });
    btn.classList.add('is-picked');
    state.answers[state.i] = idx;

    setTimeout(function () {
      elQOpts.dataset.busy = '';
      if (state.i < QUESTIONS.length - 1) {
        elQBody.classList.add('is-out');
        setTimeout(function () { state.i++; render(); elQBody.classList.remove('is-out'); }, 230);
      } else {
        finishQuiz();
      }
    }, 400);
  }

  function back() {
    if (state.i === 0) return;
    elQBody.classList.add('is-out');
    setTimeout(function () { state.i--; render(); elQBody.classList.remove('is-out'); }, 230);
  }

  function finishQuiz() {
    elQCard.style.transition = 'opacity .38s ease, transform .38s ease';
    elQCard.style.opacity = '0';
    elQCard.style.transform = 'scale(.97)';

    setTimeout(function () {
      elQCard.style.display = 'none';
      elLoader.hidden = false;
      setTimeout(function () {
        buildDiagnosis();
        goStage('stage-deck');
        showSlide(0);
      }, 2100);
    }, 380);
  }

  /* ─────────────── Diagnóstico ─────────────── */
  function buildDiagnosis() {
    var a = state.answers;
    var k = function (n) { return QUESTIONS[n].options[a[n] != null ? a[n] : 0].k; };

    $('#diagText').textContent = READ_1[k(0)] + ' ' + READ_2[k(1)] + ' ' + READ_3[k(2)];

    state.picked = a.map(function (ans, i) {
      var o = QUESTIONS[i].options[ans != null ? ans : 0];
      return { question: QUESTIONS[i].text, answer: o.label, tag: o.tag };
    });

    var chips = $('#diagChips');
    chips.innerHTML = '';
    var check = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    state.picked.forEach(function (p) {
      var span = document.createElement('span');
      span.className = 'chip';
      span.innerHTML = check + p.tag;
      chips.appendChild(span);
    });
    var loc = document.createElement('span');
    loc.className = 'chip';
    loc.innerHTML = check + 'Socorro/SP';
    chips.appendChild(loc);
  }

  /* ─────────────── Telas da proposta ─────────────── */
  for (var d = 0; d < TOTAL; d++) {
    (function (n) {
      var i = document.createElement('i');
      i.addEventListener('click', function () { showSlide(n); });
      elDots.appendChild(i);
    })(d);
  }

  function showSlide(n) {
    if (n < 0 || n > TOTAL - 1) return;
    state.slide = n;
    Array.prototype.forEach.call(SLIDES, function (s, i) { s.classList.toggle('is-on', i === n); });
    Array.prototype.forEach.call(elDots.children, function (s, i) { s.classList.toggle('on', i === n); });
    elPrev.disabled = n === 0;
    elNext.disabled = n === TOTAL - 1;
    fitScreen(SLIDES[n]);
    var inner = SLIDES[n].querySelector('.screen__inner');
    inner.style.animation = 'none';
    void inner.offsetWidth;
    inner.style.animation = '';
  }

  elPrev.addEventListener('click', function () { showSlide(state.slide - 1); });
  elNext.addEventListener('click', function () { showSlide(state.slide + 1); });

  /* gestos */
  var tx = 0, ty = 0;
  document.addEventListener('touchstart', function (e) {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!document.getElementById('stage-deck').classList.contains('stage--active')) return;
    var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      showSlide(state.slide + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ─────────────── Teclado ─────────────── */
  document.addEventListener('keydown', function (e) {
    var quizOn = document.getElementById('stage-quiz').classList.contains('stage--active');
    var deckOn = document.getElementById('stage-deck').classList.contains('stage--active');
    if (quizOn) {
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4 && elQOpts.children[n - 1]) elQOpts.children[n - 1].click();
      if (e.key === 'Backspace') { e.preventDefault(); back(); }
    } else if (deckOn) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') showSlide(state.slide + 1);
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') showSlide(state.slide - 1);
    }
  });

  /* ─────────────── Início ─────────────── */
  $('#startQuiz').addEventListener('click', function () { goStage('stage-quiz'); render(); });
  elQBack.addEventListener('click', back);

  elDeckbar.style.display = 'none';
  render();
})();
