/* english-grammar — silnik ćwiczeń.
 *
 * Classic script (NIE moduł ES) — strony działają też przez file://.
 * Wystawia:
 *
 *   window.EG.mountExercises(hostElement, {
 *     id: 'present-simple',              // klucz postępu w localStorage
 *     title: 'Ćwiczenia: Present Simple',
 *     intro: 'Krótka instrukcja po polsku.',
 *     items: [ ... ]                     // patrz typy niżej
 *   });
 *
 * Typy itemów:
 *   gap      { q:'She ___ here.', hint:'(work)', answers:['works'], why:'...', ctx:'...' }
 *   choice   { q:'Look! It ___.', options:['rains','is raining'], answer:1, why:'...', ctx:'...' }
 *   error    { sentence:'I have been knowing him for years.', wrongIndex:3, fix:'known', why:'...', ctx:'...' }
 *            wrongIndex: -1 oznacza "zdanie jest poprawne"
 *   contrast { a:{sentence,meaning}, b:{sentence,meaning}, labels:['...','...'], note:'...' }  (bez oceniania)
 *
 * Ocena: gap + choice + error. contrast to element do eksploracji.
 * Postęp zapisywany per zestaw; każdy dostęp do localStorage w try/catch.
 */
(function () {
  'use strict';

  var GRADED = { gap: 1, choice: 1, error: 1 };

  function norm(s) {
    return String(s == null ? '' : s)
      .trim().toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, ' ');
  }

  function e(tag, props, kids) {
    var node = document.createElement(tag);
    if (props) {
      for (var k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        if (k === 'class') node.className = props[k];
        else if (k === 'text') node.textContent = props[k];
        else if (k === 'html') node.innerHTML = props[k];
        else if (k === 'lang') node.lang = props[k];
        else if (k in node) { try { node[k] = props[k]; } catch (err) { node.setAttribute(k, props[k]); } }
        else node.setAttribute(k, props[k]);
      }
    }
    (kids || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function enSpan(str) { return e('span', { lang: 'en', text: str }); }

  // ---- Trwały postęp ----
  function Store(id) {
    this.key = 'eng-grammar:' + id;
    this.data = { v: 1, results: {} };
    try {
      var raw = localStorage.getItem(this.key);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.results) this.data = parsed;
      }
    } catch (err) { /* prywatny tryb / zablokowane — działamy bez zapisu */ }
  }
  Store.prototype.get = function (i) { return this.data.results[i]; };
  Store.prototype.set = function (i, rec) {
    this.data.results[i] = rec;
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (err) {}
  };
  Store.prototype.clear = function () {
    this.data = { v: 1, results: {} };
    try { localStorage.removeItem(this.key); } catch (err) {}
  };

  // ---- Render pojedynczych itemów ----

  function renderFeedback(wrap, ok, correctText, why) {
    var fb = e('div', {
      class: 'ex-feedback ' + (ok ? 'is-correct' : 'is-wrong'),
      role: 'status', 'aria-live': 'polite'
    });
    fb.appendChild(e('strong', { text: ok ? 'Dobrze.' : 'Jeszcze nie.' }));
    if (!ok && correctText) {
      fb.appendChild(e('div', {}, ['Poprawnie: ', enSpan(correctText)]));
    }
    wrap.appendChild(fb);
    if (why) {
      wrap.appendChild(e('p', { class: 'ex-why', text: why }));
    }
  }

  function makeGap(item, idx, prev, onGraded) {
    var wrap = e('div', { class: 'ex-item' });
    wrap.appendChild(e('p', { class: 'ex-num', text: 'ZADANIE ' + (idx + 1) }));
    if (item.ctx) wrap.appendChild(e('p', { class: 'ex-ctx', text: item.ctx }));

    var q = e('p', { class: 'ex-q', lang: 'en' });
    var parts = String(item.q).split('___');
    var input = e('input', {
      class: 'ex-blank', type: 'text', autocomplete: 'off',
      autocapitalize: 'none', spellcheck: false,
      'aria-label': 'Uzupełnij lukę'
    });
    q.appendChild(document.createTextNode(parts[0] || ''));
    q.appendChild(input);
    q.appendChild(document.createTextNode(parts[1] || ''));
    wrap.appendChild(q);
    if (item.hint) wrap.appendChild(e('span', { class: 'ex-hint', lang: 'en', text: item.hint }));

    var actions = e('div', { class: 'ex-actions' });
    var btn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź' });
    actions.appendChild(btn);
    wrap.appendChild(actions);

    function resolve(given) {
      var ok = item.answers.some(function (a) { return norm(a) === norm(given); });
      input.value = given;
      input.disabled = true;
      btn.disabled = true;
      renderFeedback(wrap, ok, item.answers[0], item.why);
      return ok;
    }

    function submit() {
      if (input.disabled) return;
      var given = input.value;
      if (!given.trim()) { input.focus(); return; }
      var ok = resolve(given);
      onGraded(idx, { correct: ok, given: given });
    }

    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); submit(); }
    });

    if (prev) resolve(prev.given != null ? prev.given : '');
    return wrap;
  }

  function makeChoice(item, idx, prev, onGraded) {
    var wrap = e('div', { class: 'ex-item' });
    wrap.appendChild(e('p', { class: 'ex-num', text: 'ZADANIE ' + (idx + 1) }));
    if (item.ctx) wrap.appendChild(e('p', { class: 'ex-ctx', text: item.ctx }));
    if (item.q) wrap.appendChild(e('p', { class: 'ex-q', lang: 'en', text: item.q }));

    var list = e('div', { class: 'ex-options', role: 'group', 'aria-label': 'Wybierz odpowiedź' });
    var buttons = [];

    function resolve(picked) {
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === item.answer) b.classList.add('is-correct');
        if (i === picked && picked !== item.answer) b.classList.add('is-wrong');
        if (i === picked) b.classList.add('is-picked');
      });
      renderFeedback(wrap, picked === item.answer, item.options[item.answer], item.why);
    }

    item.options.forEach(function (opt, i) {
      var b = e('button', { class: 'ex-option', type: 'button' }, [enSpan(opt)]);
      b.addEventListener('click', function () {
        if (b.disabled) return;
        resolve(i);
        onGraded(idx, { correct: i === item.answer, given: i });
      });
      buttons.push(b);
      list.appendChild(b);
    });
    wrap.appendChild(list);

    if (prev) resolve(typeof prev.given === 'number' ? prev.given : -1);
    return wrap;
  }

  function makeError(item, idx, prev, onGraded) {
    var wrap = e('div', { class: 'ex-item' });
    wrap.appendChild(e('p', { class: 'ex-num', text: 'ZADANIE ' + (idx + 1) }));
    wrap.appendChild(e('p', {
      class: 'ex-ctx',
      text: item.ctx || 'Kliknij słowo, które jest błędne — albo zaznacz, że zdanie jest poprawne.'
    }));

    var tokens = String(item.sentence).split(/\s+/);
    var row = e('div', { class: 'ex-tokens', lang: 'en' });
    var tokBtns = [];
    var picked = null; // indeks tokena, albo -1 dla "poprawne"

    var okBtn = e('button', {
      class: 'ex-token', type: 'button', lang: 'pl', text: '„zdanie jest poprawne”'
    });

    function setPick(p) {
      if (locked) return;
      picked = p;
      tokBtns.forEach(function (b, i) { b.classList.toggle('is-picked', i === p); });
      okBtn.classList.toggle('is-picked', p === -1);
      checkBtn.disabled = p === null;
    }

    tokens.forEach(function (tk, i) {
      var b = e('button', { class: 'ex-token', type: 'button', text: tk });
      b.addEventListener('click', function () { setPick(i); });
      tokBtns.push(b);
      row.appendChild(b);
      row.appendChild(document.createTextNode(' '));
    });
    wrap.appendChild(row);

    var actions = e('div', { class: 'ex-actions' });
    okBtn.addEventListener('click', function () { setPick(-1); });
    var checkBtn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź', disabled: true });
    actions.appendChild(okBtn);
    actions.appendChild(checkBtn);
    wrap.appendChild(actions);

    var locked = false;

    function resolve(p) {
      locked = true;
      picked = p;
      checkBtn.disabled = true;
      okBtn.disabled = true;
      var ok = p === item.wrongIndex;
      tokBtns.forEach(function (b, i) {
        b.disabled = true;
        if (i === item.wrongIndex) b.classList.add('is-target');
        if (i === p && !ok) b.classList.add('is-miss');
      });
      if (item.wrongIndex === -1) okBtn.classList.add('is-target');
      if (p === -1 && !ok) okBtn.classList.add('is-miss');

      var fb = e('div', {
        class: 'ex-feedback ' + (ok ? 'is-correct' : 'is-wrong'),
        role: 'status', 'aria-live': 'polite'
      });
      fb.appendChild(e('strong', { text: ok ? 'Dobrze.' : 'Jeszcze nie.' }));
      if (item.wrongIndex === -1) {
        fb.appendChild(e('div', { text: 'To zdanie jest poprawne.' }));
      } else {
        fb.appendChild(e('div', {}, [
          'Błędne słowo: ', enSpan(tokens[item.wrongIndex].replace(/[.,!?;:]+$/, '')),
          item.fix ? ' → ' : '', item.fix ? enSpan(item.fix) : ''
        ]));
      }
      wrap.appendChild(fb);
      if (item.why) wrap.appendChild(e('p', { class: 'ex-why', text: item.why }));
    }

    checkBtn.addEventListener('click', function () {
      if (locked || picked === null) return;
      var p = picked;
      var ok = p === item.wrongIndex;
      resolve(p);
      onGraded(idx, { correct: ok, given: p });
    });

    if (prev) resolve(typeof prev.given === 'number' ? prev.given : null);
    return wrap;
  }

  function makeContrast(item) {
    var wrap = e('div', { class: 'ex-item' });
    wrap.appendChild(e('p', { class: 'ex-num', text: 'PARA KONTRASTOWA' }));

    var box = e('div', { class: 'contrast' });
    var seg = e('div', { class: 'seg', role: 'group', 'aria-label': 'Przełącz zdanie' });
    var labels = item.labels || ['A', 'B'];
    var sentence = e('p', { class: 'contrast__sentence', lang: 'en' });
    var meaning = e('p', { class: 'contrast__meaning' });
    var variants = [item.a, item.b];

    function show(n) {
      seg.querySelectorAll('button').forEach(function (b, i) {
        b.classList.toggle('is-active', i === n);
      });
      sentence.textContent = variants[n].sentence;
      meaning.textContent = variants[n].meaning;
    }

    labels.forEach(function (lab, i) {
      var b = e('button', { type: 'button', text: lab });
      b.addEventListener('click', function () { show(i); });
      seg.appendChild(b);
    });

    box.appendChild(seg);
    box.appendChild(sentence);
    box.appendChild(meaning);
    if (item.note) box.appendChild(e('p', { class: 'contrast__note', text: item.note }));
    wrap.appendChild(box);
    show(0);
    return wrap;
  }

  var MAKERS = { gap: makeGap, choice: makeChoice, error: makeError, contrast: makeContrast };

  // ---- Montaż całego zestawu ----
  function mountExercises(host, cfg) {
    if (!host || !cfg || !cfg.items) return;
    host.textContent = '';
    host.classList.add('exercise');

    var store = new Store(cfg.id || 'default');
    var gradedTotal = cfg.items.filter(function (it) { return GRADED[it.type]; }).length;

    var scoreEl = e('span', { class: 'ex-score' });
    var head = e('div', { class: 'exercise__head' }, [
      e('p', { class: 'exercise__title', text: cfg.title || 'Ćwiczenia' }),
      scoreEl
    ]);
    host.appendChild(head);
    if (cfg.intro) host.appendChild(e('p', { class: 'ex-item ex-ctx', text: cfg.intro }));

    function refreshScore() {
      if (gradedTotal === 0) { scoreEl.textContent = ''; return; }
      var done = 0, ok = 0;
      cfg.items.forEach(function (it, i) {
        if (!GRADED[it.type]) return;
        var r = store.get(i);
        if (r) { done++; if (r.correct) ok++; }
      });
      scoreEl.innerHTML = '';
      scoreEl.appendChild(document.createTextNode('Wynik: '));
      scoreEl.appendChild(e('b', { text: ok + ' / ' + gradedTotal }));
      if (done < gradedTotal) {
        scoreEl.appendChild(document.createTextNode(' (' + (gradedTotal - done) + ' do zrobienia)'));
      }
    }

    function onGraded(idx, rec) {
      store.set(idx, rec);
      refreshScore();
    }

    var body = e('div', { class: 'exercise__body' });
    cfg.items.forEach(function (item, idx) {
      var maker = MAKERS[item.type];
      if (!maker) return;
      body.appendChild(maker(item, idx, store.get(idx), onGraded));
    });
    host.appendChild(body);

    if (gradedTotal > 0) {
      var resetBtn = e('button', { class: 'ex-btn ex-btn--ghost', type: 'button', text: 'Zacznij od nowa' });
      resetBtn.addEventListener('click', function () {
        store.clear();
        mountExercises(host, cfg);
      });
      host.appendChild(e('div', { class: 'ex-foot' }, [
        e('p', { text: 'Postęp zapisuje się w tej przeglądarce.' }),
        resetBtn
      ]));
    }

    refreshScore();
  }

  window.EG = window.EG || {};
  window.EG.mountExercises = mountExercises;
})();
