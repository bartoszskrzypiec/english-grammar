/* english-grammar — interaktywna oś czasu dla czasów Present.
 *
 * Classic script (NIE moduł ES) — dzięki temu strony działają też otwarte
 * przez file:// dwuklikiem, bez serwera. Wystawia jedną funkcję:
 *
 *   window.EG.mountTimeline(hostElement, {
 *     tense: 'present-simple' | 'present-continuous'
 *          | 'present-perfect' | 'present-perfect-continuous',
 *     switcher: false        // true => segmentowany przełącznik 4 czasów
 *   });
 *
 * viewBox jest dopasowywany do szerokości kontenera (ResizeObserver), więc
 * tekst na osi zostaje czytelny na telefonie — skala user-unit ≈ px.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var VB_H = 196;
  var AXIS_Y = 104;
  var uidSeq = 0;

  // Geometria przeliczana pod aktualną szerokość.
  function layout(w) {
    var W = Math.min(Math.max(Math.round(w) || 480, 300), 680);
    return { W: W, L: 40, R: W - 40, NOW: Math.round(W / 2) };
  }
  function xOf(g, t) { return g.L + t * (g.R - g.L); }

  var TENSES = [
    'present-simple',
    'present-continuous',
    'present-perfect',
    'present-perfect-continuous'
  ];

  var LABELS = {
    'present-simple': 'Present Simple',
    'present-continuous': 'Present Continuous',
    'present-perfect': 'Present Perfect',
    'present-perfect-continuous': 'Present Perfect Continuous'
  };

  var SHORT = {
    'present-simple': 'Simple',
    'present-continuous': 'Continuous',
    'present-perfect': 'Perfect',
    'present-perfect-continuous': 'Perfect Cont.'
  };

  var CAPTIONS = {
    'present-simple': {
      pl: 'Czynność się powtarza albo jest zawsze prawdą. Konkretny moment nie ma znaczenia — kropki rozłożone są po całej osi.',
      en: 'Water boils at 100°C. · I go to work by bus. · She works in an office.'
    },
    'present-continuous': {
      pl: 'Czynność w toku teraz albo tymczasowo wokół teraz. Przerywana kropka z przodu = ustalony plan na najbliższą przyszłość.',
      en: 'She is learning English now. · I’m staying with friends this week. · We’re meeting them tomorrow.'
    },
    'present-perfect': {
      pl: 'Przeszłe działanie, którego skutek widać teraz — strzałka „ląduje” na teraz. Kiedy dokładnie się wydarzyło, jest nieistotne albo nieznane.',
      en: 'I have always wanted to be a doctor. · I’ve lost my keys (= I don’t have them now).'
    },
    'present-perfect-continuous': {
      pl: 'Liczy się sam proces i jak długo trwa — pas biegnie z przeszłości aż do teraz (a często dalej). Podkreślamy długość, nie wynik.',
      en: 'I have been studying for two hours. · It’s been raining all day. · She’s been working here since May.'
    }
  };

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k]);
        }
      }
    }
    return node;
  }

  function text(x1, y1, str, cls, anchor) {
    var t = el('text', { x: x1, y: y1, class: cls || 'tl-label' });
    if (anchor) t.setAttribute('text-anchor', anchor);
    t.textContent = str;
    return t;
  }

  function debounce(fn, ms) {
    var h;
    return function () {
      if (h) clearTimeout(h);
      h = setTimeout(fn, ms);
    };
  }

  // ---- Statyczne "meble" sceny: oś, strzałka, znacznik "teraz". ----
  function buildStage(host, g, arrowId) {
    var svg = el('svg', {
      viewBox: '0 0 ' + g.W + ' ' + VB_H,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': 'Oś czasu: przeszłość, teraz, przyszłość'
    });

    var defs = el('defs');
    var marker = el('marker', {
      id: arrowId, viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse'
    });
    marker.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'currentColor' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    svg.appendChild(el('line', {
      x1: g.L - 8, y1: AXIS_Y, x2: g.R + 8, y2: AXIS_Y,
      class: 'tl-axis', 'marker-end': 'url(#' + arrowId + ')'
    }));

    svg.appendChild(el('line', {
      x1: g.NOW, y1: 26, x2: g.NOW, y2: AXIS_Y + 26, class: 'tl-now'
    }));

    svg.appendChild(text(4, AXIS_Y + 40, 'PRZESZŁOŚĆ'));
    svg.appendChild(text(g.NOW, 18, 'TERAZ', 'tl-now-label', 'middle'));
    svg.appendChild(text(g.W - 4, AXIS_Y + 40, 'PRZYSZŁOŚĆ', 'tl-label', 'end'));

    var art = el('g', { class: 'tl-art' });
    svg.appendChild(art);

    host.appendChild(svg);
    return { svg: svg, art: art };
  }

  // ---- Rysunki poszczególnych czasów. ----
  function drawSimple(art, g) {
    for (var i = 0; i <= 8; i++) {
      var t = 0.06 + (i / 8) * 0.88;
      art.appendChild(el('circle', { cx: xOf(g, t), cy: AXIS_Y, r: 5, class: 'tl-mark' }));
    }
    art.appendChild(text(g.NOW, AXIS_Y - 20, 'każdego dnia, zawsze, zwykle', 'tl-hint', 'middle'));
  }

  function drawContinuous(art, g) {
    var x0 = xOf(g, 0.34), x1 = xOf(g, 0.60);
    art.appendChild(el('rect', { x: x0, y: AXIS_Y - 15, width: x1 - x0, height: 30, rx: 8, class: 'tl-band' }));
    art.appendChild(el('rect', { x: x0, y: AXIS_Y - 15, width: x1 - x0, height: 30, rx: 8, class: 'tl-band-edge' }));
    art.appendChild(el('circle', { cx: g.NOW, cy: AXIS_Y, r: 5, class: 'tl-mark' }));

    art.appendChild(el('circle', {
      cx: xOf(g, 0.84), cy: AXIS_Y, r: 6, class: 'tl-band-edge', 'stroke-dasharray': '3 3'
    }));
    art.appendChild(text(xOf(g, 0.84), AXIS_Y - 18, 'plan', 'tl-hint', 'middle'));
    art.appendChild(text(g.NOW, AXIS_Y - 24, 'w tej chwili / tymczasowo', 'tl-hint', 'middle'));
  }

  function drawPerfect(art, g) {
    var startX = xOf(g, 0.13);
    art.appendChild(el('path', {
      d: 'M ' + startX + ' ' + (AXIS_Y - 38) +
         ' C ' + xOf(g, 0.28) + ' ' + (AXIS_Y - 56) + ', ' +
         xOf(g, 0.42) + ' ' + (AXIS_Y - 28) + ', ' + (g.NOW - 4) + ' ' + (AXIS_Y - 6),
      class: 'tl-mark-stroke', 'marker-end': 'url(#' + g.arrowId + ')'
    }));
    art.appendChild(el('circle', { cx: startX, cy: AXIS_Y - 38, r: 4, class: 'tl-ghost' }));
    art.appendChild(text(startX, AXIS_Y - 46, 'kiedy? — nieistotne', 'tl-hint', 'middle'));

    art.appendChild(el('circle', { cx: g.NOW, cy: AXIS_Y, r: 7, class: 'tl-mark' }));
    art.appendChild(el('circle', { cx: g.NOW, cy: AXIS_Y, r: 13, class: 'tl-band-edge' }));
    art.appendChild(text(g.NOW, AXIS_Y + 26, 'skutek widoczny teraz', 'tl-hint', 'middle'));
  }

  function drawPerfectContinuous(art, g) {
    var x0 = xOf(g, 0.11), x1 = xOf(g, 0.58);
    var d = 'M ' + x0 + ' ' + AXIS_Y;
    var steps = 9;
    for (var i = 1; i <= steps; i++) {
      var px = x0 + ((x1 - x0) * i) / steps;
      var py = AXIS_Y + (i % 2 === 0 ? -7 : 7);
      d += ' Q ' + (px - (x1 - x0) / steps / 2) + ' ' + py + ' ' + px + ' ' + AXIS_Y;
    }
    art.appendChild(el('path', { d: d, class: 'tl-mark-stroke', 'marker-end': 'url(#' + g.arrowId + ')' }));

    art.appendChild(el('path', {
      d: 'M ' + x0 + ' ' + (AXIS_Y + 20) + ' L ' + x0 + ' ' + (AXIS_Y + 26) +
         ' L ' + x1 + ' ' + (AXIS_Y + 26) + ' L ' + x1 + ' ' + (AXIS_Y + 20),
      class: 'tl-band-edge'
    }));
    art.appendChild(text((x0 + x1) / 2, AXIS_Y - 18, 'jak długo? (for / since ...)', 'tl-hint', 'middle'));
  }

  var DRAW = {
    'present-simple': drawSimple,
    'present-continuous': drawContinuous,
    'present-perfect': drawPerfect,
    'present-perfect-continuous': drawPerfectContinuous
  };

  function mountTimeline(host, cfg) {
    if (!host) return;
    cfg = cfg || {};
    var tense = TENSES.indexOf(cfg.tense) >= 0 ? cfg.tense : 'present-simple';
    var arrowId = 'tl-arrow-' + (++uidSeq);

    host.classList.add('timeline');
    host.textContent = '';

    var bar = document.createElement('div');
    bar.className = 'timeline__bar';
    var title = document.createElement('p');
    title.textContent = cfg.switcher ? 'Oś czasu' : LABELS[tense];
    bar.appendChild(title);

    var stage = document.createElement('div');
    stage.className = 'timeline__stage';

    var caption = document.createElement('div');
    caption.className = 'timeline__caption';

    var lastW = 0;

    function measure() {
      var w = stage.clientWidth;
      if (!w && stage.getBoundingClientRect) w = stage.getBoundingClientRect().width;
      return w || 480;
    }

    function render(next) {
      tense = next;
      var g = layout(measure());
      g.arrowId = arrowId;
      lastW = g.W;
      stage.textContent = '';
      var built = buildStage(stage, g, arrowId);
      DRAW[tense](built.art, g);

      caption.textContent = '';
      var pPl = document.createElement('p');
      pPl.textContent = CAPTIONS[tense].pl;
      var pEn = document.createElement('p');
      var enSpan = document.createElement('span');
      enSpan.lang = 'en';
      enSpan.textContent = CAPTIONS[tense].en;
      pEn.appendChild(enSpan);
      caption.appendChild(pPl);
      caption.appendChild(pEn);

      if (!cfg.switcher) title.textContent = LABELS[tense];
    }

    if (cfg.switcher) {
      var seg = document.createElement('div');
      seg.className = 'seg seg--wrap';
      seg.setAttribute('role', 'group');
      seg.setAttribute('aria-label', 'Wybierz czas');
      TENSES.forEach(function (tn) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = SHORT[tn];
        b.setAttribute('aria-label', LABELS[tn]);
        if (tn === tense) b.classList.add('is-active');
        b.addEventListener('click', function () {
          seg.querySelectorAll('button').forEach(function (x2) { x2.classList.remove('is-active'); });
          b.classList.add('is-active');
          render(tn);
        });
        seg.appendChild(b);
      });
      bar.appendChild(seg);
    }

    host.appendChild(bar);
    host.appendChild(stage);
    host.appendChild(caption);

    render(tense);

    // Reaguj na zmianę szerokości (obrót telefonu, zmiana okna).
    var onResize = debounce(function () {
      var w = layout(measure()).W;
      if (Math.abs(w - lastW) >= 16) render(tense);
    }, 160);

    if (typeof ResizeObserver !== 'undefined') {
      try { new ResizeObserver(onResize).observe(stage); } catch (e) {}
    } else if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', onResize);
    }
  }

  window.EG = window.EG || {};
  window.EG.mountTimeline = mountTimeline;

  function auto() {
    document.querySelectorAll('[data-timeline]').forEach(function (node) {
      mountTimeline(node, {
        tense: node.getAttribute('data-timeline'),
        switcher: node.hasAttribute('data-switcher')
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', auto);
  } else {
    auto();
  }
})();
