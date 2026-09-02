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
 * Wzorzec z learning-materials/patterns/svg-slider-widget.md: elementy po
 * id, jedna funkcja render() wołana raz na starcie, zero zależności.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  // Geometria sceny. Oś od LEFT do RIGHT, "teraz" na środku.
  var VB_W = 640, VB_H = 200;
  var LEFT = 48, RIGHT = 592, AXIS_Y = 118, NOW_X = 320;

  // Mapuje pozycję w czasie 0..1 (0 = daleka przeszłość, 0.5 = teraz,
  // 1 = daleka przyszłość) na współrzędną x.
  function x(t) { return LEFT + t * (RIGHT - LEFT); }

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

  function text(x1, y1, str, cls) {
    var t = el('text', { x: x1, y: y1, class: cls || 'tl-label' });
    t.textContent = str;
    return t;
  }

  // ---- Statyczne "meble" sceny: oś, strzałka, znacznik "teraz". ----
  function buildStage(host) {
    var svg = el('svg', {
      viewBox: '0 0 ' + VB_W + ' ' + VB_H,
      role: 'img',
      'aria-label': 'Oś czasu: przeszłość, teraz, przyszłość'
    });

    var defs = el('defs');
    var marker = el('marker', {
      id: 'tl-arrow', viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse'
    });
    marker.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'currentColor' }));
    defs.appendChild(marker);
    svg.appendChild(defs);

    // główna oś ze strzałką w prawo
    svg.appendChild(el('line', {
      x1: LEFT - 8, y1: AXIS_Y, x2: RIGHT + 8, y2: AXIS_Y,
      class: 'tl-axis', 'marker-end': 'url(#tl-arrow)'
    }));

    // pionowy znacznik "teraz"
    svg.appendChild(el('line', {
      x1: NOW_X, y1: 34, x2: NOW_X, y2: AXIS_Y + 30, class: 'tl-now'
    }));

    svg.appendChild(text(LEFT - 8, AXIS_Y + 48, 'PRZESZŁOŚĆ'));
    var nowLabel = text(NOW_X, 26, 'TERAZ', 'tl-now-label');
    nowLabel.setAttribute('text-anchor', 'middle');
    svg.appendChild(nowLabel);
    var future = text(RIGHT + 8, AXIS_Y + 48, 'PRZYSZŁOŚĆ');
    future.setAttribute('text-anchor', 'end');
    svg.appendChild(future);

    // warstwa rysowana per czas
    var art = el('g', { class: 'tl-art' });
    svg.appendChild(art);

    host.appendChild(svg);
    return { svg: svg, art: art };
  }

  // ---- Rysunki poszczególnych czasów w warstwie `art`. ----
  function drawSimple(art) {
    // równomierne kropki wzdłuż całej osi = powtarzalność / stała prawda
    for (var i = 0; i <= 8; i++) {
      var t = 0.06 + (i / 8) * 0.88;
      art.appendChild(el('circle', { cx: x(t), cy: AXIS_Y, r: 5, class: 'tl-mark' }));
    }
    var g = text(x(0.5), AXIS_Y - 22, 'każdego dnia, zawsze, zwykle', 'tl-hint');
    g.setAttribute('text-anchor', 'middle');
    art.appendChild(g);
  }

  function drawContinuous(art) {
    // pasek wokół "teraz" = w toku; przerywana kropka z przodu = plan
    var x0 = x(0.34), x1 = x(0.60);
    art.appendChild(el('rect', {
      x: x0, y: AXIS_Y - 16, width: x1 - x0, height: 32, rx: 8, class: 'tl-band'
    }));
    art.appendChild(el('rect', {
      x: x0, y: AXIS_Y - 16, width: x1 - x0, height: 32, rx: 8, class: 'tl-band-edge'
    }));
    art.appendChild(el('circle', { cx: NOW_X, cy: AXIS_Y, r: 5, class: 'tl-mark' }));

    // kropka-plan w przyszłości
    art.appendChild(el('circle', {
      cx: x(0.82), cy: AXIS_Y, r: 6, class: 'tl-band-edge', 'stroke-dasharray': '3 3'
    }));
    var p = text(x(0.82), AXIS_Y - 20, 'plan', 'tl-hint');
    p.setAttribute('text-anchor', 'middle');
    art.appendChild(p);

    var g = text(NOW_X, AXIS_Y - 26, 'w tej chwili / tymczasowo', 'tl-hint');
    g.setAttribute('text-anchor', 'middle');
    art.appendChild(g);
  }

  function drawPerfect(art) {
    // strzałka z nieokreślonej przeszłości "ląduje" na teraz
    var startX = x(0.14);
    var path = el('path', {
      d: 'M ' + startX + ' ' + (AXIS_Y - 40) +
         ' C ' + x(0.28) + ' ' + (AXIS_Y - 60) + ', ' +
         x(0.42) + ' ' + (AXIS_Y - 30) + ', ' + (NOW_X - 4) + ' ' + (AXIS_Y - 6),
      class: 'tl-mark-stroke', 'marker-end': 'url(#tl-arrow)'
    });
    art.appendChild(path);
    art.appendChild(el('circle', { cx: startX, cy: AXIS_Y - 40, r: 4, class: 'tl-ghost' }));
    var q = text(startX, AXIS_Y - 48, 'kiedy? — nieistotne', 'tl-hint');
    q.setAttribute('text-anchor', 'middle');
    art.appendChild(q);

    // "błysk" wyniku na teraz
    art.appendChild(el('circle', { cx: NOW_X, cy: AXIS_Y, r: 7, class: 'tl-mark' }));
    art.appendChild(el('circle', { cx: NOW_X, cy: AXIS_Y, r: 13, class: 'tl-band-edge' }));
    var r = text(NOW_X, AXIS_Y + 34, 'skutek widoczny teraz', 'tl-hint');
    r.setAttribute('text-anchor', 'middle');
    art.appendChild(r);
  }

  function drawPerfectContinuous(art) {
    // falisty pas z przeszłości do (lekko za) teraz = proces + długość
    var x0 = x(0.12), x1 = x(0.58);
    var d = 'M ' + x0 + ' ' + AXIS_Y;
    var steps = 9;
    for (var i = 1; i <= steps; i++) {
      var px = x0 + ((x1 - x0) * i) / steps;
      var py = AXIS_Y + (i % 2 === 0 ? -7 : 7);
      d += ' Q ' + (px - (x1 - x0) / steps / 2) + ' ' + py + ' ' + px + ' ' + AXIS_Y;
    }
    var wave = el('path', { d: d, class: 'tl-mark-stroke', 'marker-end': 'url(#tl-arrow)' });
    art.appendChild(wave);

    // klamra długości pod pasem
    art.appendChild(el('path', {
      d: 'M ' + x0 + ' ' + (AXIS_Y + 24) + ' L ' + x0 + ' ' + (AXIS_Y + 30) +
         ' L ' + x1 + ' ' + (AXIS_Y + 30) + ' L ' + x1 + ' ' + (AXIS_Y + 24),
      class: 'tl-band-edge'
    }));
    var g = text((x0 + x1) / 2, AXIS_Y + 44, 'jak długo? (for / since ...)', 'tl-hint');
    g.setAttribute('text-anchor', 'middle');
    art.appendChild(g);
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

    host.classList.add('timeline');
    host.textContent = '';

    // Pasek nagłówka: tytuł + (opcjonalnie) przełącznik.
    var bar = document.createElement('div');
    bar.className = 'timeline__bar';
    var title = document.createElement('p');
    title.textContent = cfg.switcher ? 'Oś czasu' : LABELS[tense];
    bar.appendChild(title);

    var stage = document.createElement('div');
    stage.className = 'timeline__stage';

    var caption = document.createElement('div');
    caption.className = 'timeline__caption';

    var built = null;

    function render(next) {
      tense = next;
      if (!built) built = buildStage(stage);
      var art = built.art;
      while (art.firstChild) art.removeChild(art.firstChild);
      DRAW[tense](art);

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
      seg.className = 'seg';
      seg.setAttribute('role', 'group');
      seg.setAttribute('aria-label', 'Wybierz czas');
      TENSES.forEach(function (tn) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = LABELS[tn].replace('Present ', 'P. ');
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
  }

  window.EG = window.EG || {};
  window.EG.mountTimeline = mountTimeline;

  // Auto-montaż: <div data-timeline="present-simple" data-switcher>
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
