/* english-grammar — silnik ćwiczeń.
 *
 * Classic script (NIE moduł ES) — strony działają też przez file://.
 *
 *   window.EG.mountExercises(hostElement, {
 *     id: 'present-simple',              // klucz postępu w localStorage
 *     title: 'Ćwiczenia: Present Simple',
 *     intro: 'Krótka instrukcja po polsku.',
 *     items: [ ... ]  albo  EG.bank('present-simple')  albo  EG.bankPick([...])
 *     onSave: function(itemId, rec) { ... }             // opcjonalny hook
 *   });
 *
 * Bank zadań (dla strony „Powtórka błędów"):
 *   EG.registerItems([ { id, type, tags:[...], ... } ])   // w assets/js/data/*.js
 *   EG.bank('present-perfect')      -> itemy z tym tagiem
 *   EG.bankPick(['ps-1','pp-3'])    -> itemy po ID, w tej kolejności
 *   EG.mountReview(hostElement, { title })  -> zbiera błędne odpowiedzi
 *                                              ze wszystkich zestawów
 *
 * Typy itemów:
 *   gap       { q:'She ___ here.', hint:'(work)', answers:['works'], why, ctx? }
 *   choice    { q?, options:['a','b'], answer:1, why, ctx? }
 *   error     { sentence:'They is here.', wrongIndex:1, fix:'are', why, ctx? }   (wrongIndex -1 = poprawne)
 *   order     { answer:'Where is he going?', alt?:[], pool?:[], why, ctx? }
 *   transform { base:'She works here.', instruction:'Zamień na pytanie.', answers:['Does she work here?'], why }
 *   cloze     { text:'I ___ (live) here since 2010. It ___ (be) nice.', blanks:[{answers:['have lived'],hint:'(live)'},{answers:['is']}], why, ctx? }
 *   listen    { sentence:'I have been studying for two hours.', mode:'type'|'choice', options?, answer?, alt?, why, ctx? }
 *   contrast  { a:{sentence,meaning}, b:{sentence,meaning}, labels?, note? }   (bez oceniania)
 *
 * Postęp: klucz w localStorage `eng-grammar:<setId>`, wynik kluczowany
 * po `item.id` (fallback do indeksu). Każdy dostęp w try/catch.
 */
(function () {
  'use strict';

  var GRADED = { gap: 1, choice: 1, error: 1, order: 1, transform: 1, cloze: 1, listen: 1 };
  var STORE_PREFIX = 'eng-grammar:';

  function norm(s) {
    return String(s == null ? '' : s)
      .trim().toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/['"]/g, '')          // "I'm" == "im", "don't" == "dont"
      .replace(/\s+/g, ' ')
      .replace(/\s*[.?!,;:]+$/, '');
  }

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function shuffleDistinct(a) {
    if (a.length < 3) return shuffle(a);
    var s;
    for (var k = 0; k < 6; k++) { s = shuffle(a); if (s.join(' ') !== a.join(' ')) return s; }
    return s;
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
  function txt(s) { return document.createTextNode(s); }

  // ---- Synteza mowy (typ `listen`) ----
  function speechReady() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';
  }
  if (speechReady()) {
    try {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = function () { try { window.speechSynthesis.getVoices(); } catch (e) {} };
    } catch (e) {}
  }
  function speak(text) {
    if (!speechReady()) return false;
    try {
      window.speechSynthesis.cancel();
      var u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'en-GB';
      u.rate = 0.95;
      var voices = window.speechSynthesis.getVoices() || [];
      var v = voices.filter(function (x) { return /^en[-_]?/i.test(x.lang || ''); })[0];
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
      return true;
    } catch (err) { return false; }
  }

  // ---- Trwały postęp ----
  function Store(id) {
    this.key = STORE_PREFIX + id;
    this.data = { v: 2, results: {} };
    try {
      var raw = localStorage.getItem(this.key);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.v === 2 && parsed.results) this.data = parsed;
      }
    } catch (err) { /* prywatny tryb / zablokowane */ }
  }
  Store.prototype.get = function (k) { return this.data.results[k]; };
  Store.prototype.set = function (k, rec) {
    this.data.results[k] = rec;
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (err) {}
  };
  Store.prototype.clear = function () {
    this.data = { v: 2, results: {} };
    try { localStorage.removeItem(this.key); } catch (err) {}
  };

  // ---- Bank zadań ----
  var EG = window.EG = window.EG || {};
  EG._items = EG._items || [];
  EG._byId = EG._byId || {};

  EG.registerItems = function (arr) {
    (arr || []).forEach(function (it) {
      if (!it || !it.id || EG._byId[it.id]) return;
      EG._items.push(it);
      EG._byId[it.id] = it;
    });
  };
  EG.bank = function (tag) {
    return EG._items.filter(function (it) { return it.tags && it.tags.indexOf(tag) >= 0; });
  };
  EG.bankPick = function (ids) {
    return (ids || []).map(function (id) { return EG._byId[id]; }).filter(Boolean);
  };

  // ---- Wspólna informacja zwrotna ----
  function renderFeedback(wrap, ok, correctText, why) {
    var fb = e('div', {
      class: 'ex-feedback ' + (ok ? 'is-correct' : 'is-wrong'),
      role: 'status', 'aria-live': 'polite'
    });
    fb.appendChild(e('strong', { text: ok ? 'Dobrze.' : 'Jeszcze nie.' }));
    if (!ok && correctText) fb.appendChild(e('div', {}, ['Poprawnie: ', enSpan(correctText)]));
    wrap.appendChild(fb);
    if (why) wrap.appendChild(e('p', { class: 'ex-why', text: why }));
  }

  function itemHead(wrap, num, ctx, fallbackCtx) {
    wrap.appendChild(e('p', { class: 'ex-num', text: 'ZADANIE ' + num }));
    if (ctx || fallbackCtx) wrap.appendChild(e('p', { class: 'ex-ctx', text: ctx || fallbackCtx }));
  }

  // Wspólny renderer opcji (choice + listen:choice)
  function optionList(wrap, options, answerIdx, why, prev, save) {
    var list = e('div', { class: 'ex-options', role: 'group', 'aria-label': 'Wybierz odpowiedź' });
    var buttons = [];
    function resolve(picked) {
      buttons.forEach(function (b, i) {
        b.disabled = true;
        if (i === answerIdx) b.classList.add('is-correct');
        if (i === picked && picked !== answerIdx) b.classList.add('is-wrong');
        if (i === picked) b.classList.add('is-picked');
      });
      renderFeedback(wrap, picked === answerIdx, options[answerIdx], why);
    }
    options.forEach(function (opt, i) {
      var b = e('button', { class: 'ex-option', type: 'button' }, [enSpan(opt)]);
      b.addEventListener('click', function () {
        if (b.disabled) return;
        resolve(i);
        save({ correct: i === answerIdx, given: i });
      });
      buttons.push(b);
      list.appendChild(b);
    });
    wrap.appendChild(list);
    if (prev) resolve(typeof prev.given === 'number' ? prev.given : -1);
  }

  // Wspólny renderer pola tekstowego (transform + listen:type)
  function textAnswer(wrap, answers, why, prev, save, ariaLabel) {
    var input = e('input', {
      class: 'ex-blank ex-blank--wide', type: 'text', autocomplete: 'off',
      autocapitalize: 'none', spellcheck: false, 'aria-label': ariaLabel || 'Odpowiedź'
    });
    wrap.appendChild(input);
    var actions = e('div', { class: 'ex-actions' });
    var btn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź' });
    actions.appendChild(btn);
    wrap.appendChild(actions);

    function resolve(given) {
      input.value = given; input.disabled = true; btn.disabled = true;
      var ok = answers.some(function (a) { return norm(a) === norm(given); });
      renderFeedback(wrap, ok, answers[0], why);
      return ok;
    }
    function submit() {
      if (input.disabled) return;
      if (!input.value.trim()) { input.focus(); return; }
      var g = input.value;
      save({ correct: resolve(g), given: g });
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); submit(); } });
    if (prev && prev.given != null) resolve(String(prev.given));
  }

  // ---- Typy itemów ----

  function makeGap(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.ctx);

    var q = e('p', { class: 'ex-q', lang: 'en' });
    var parts = String(item.q).split('___');
    var input = e('input', {
      class: 'ex-blank', type: 'text', autocomplete: 'off',
      autocapitalize: 'none', spellcheck: false, 'aria-label': 'Uzupełnij lukę'
    });
    q.appendChild(txt(parts[0] || ''));
    q.appendChild(input);
    q.appendChild(txt(parts[1] || ''));
    wrap.appendChild(q);
    if (item.hint) wrap.appendChild(e('span', { class: 'ex-hint', lang: 'en', text: item.hint }));

    var actions = e('div', { class: 'ex-actions' });
    var btn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź' });
    actions.appendChild(btn);
    wrap.appendChild(actions);

    function resolve(given) {
      var ok = item.answers.some(function (a) { return norm(a) === norm(given); });
      input.value = given; input.disabled = true; btn.disabled = true;
      renderFeedback(wrap, ok, item.answers[0], item.why);
      return ok;
    }
    function submit() {
      if (input.disabled) return;
      if (!input.value.trim()) { input.focus(); return; }
      var g = input.value;
      save({ correct: resolve(g), given: g });
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); submit(); } });
    if (prev) resolve(prev.given != null ? String(prev.given) : '');
    return wrap;
  }

  function makeChoice(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.ctx);
    if (item.q) wrap.appendChild(e('p', { class: 'ex-q', lang: 'en', text: item.q }));
    optionList(wrap, item.options, item.answer, item.why, prev, save);
    return wrap;
  }

  function makeError(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.ctx, 'Kliknij słowo, które jest błędne — albo zaznacz, że zdanie jest poprawne.');

    var tokens = String(item.sentence).split(/\s+/);
    var row = e('div', { class: 'ex-tokens', lang: 'en' });
    var tokBtns = [];
    var picked = null;
    var locked = false;

    var okBtn = e('button', { class: 'ex-token ex-token--ok', type: 'button', lang: 'pl', text: '„zdanie jest poprawne”' });

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
    });
    wrap.appendChild(row);

    var actions = e('div', { class: 'ex-actions' });
    okBtn.addEventListener('click', function () { setPick(-1); });
    var checkBtn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź', disabled: true });
    actions.appendChild(okBtn);
    actions.appendChild(checkBtn);
    wrap.appendChild(actions);

    function resolve(p) {
      locked = true; picked = p;
      checkBtn.disabled = true; okBtn.disabled = true;
      var ok = p === item.wrongIndex;
      tokBtns.forEach(function (b, i) {
        b.disabled = true;
        if (i === item.wrongIndex) b.classList.add('is-target');
        if (i === p && !ok) b.classList.add('is-miss');
      });
      if (item.wrongIndex === -1) okBtn.classList.add('is-target');
      if (p === -1 && !ok) okBtn.classList.add('is-miss');

      var fb = e('div', { class: 'ex-feedback ' + (ok ? 'is-correct' : 'is-wrong'), role: 'status', 'aria-live': 'polite' });
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
      resolve(p);
      save({ correct: p === item.wrongIndex, given: p });
    });

    if (prev) resolve(typeof prev.given === 'number' ? prev.given : null);
    return wrap;
  }

  function makeOrder(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.ctx, 'Ułóż zdanie — klikaj słowa w kolejności. Klik w ułożone słowo cofa je.');

    var correct = String(item.answer).trim();
    var solution = correct.split(/\s+/);
    var pool = item.pool ? item.pool.slice() : solution.slice();

    var answerLine = e('div', { class: 'answer-line', lang: 'en', 'aria-label': 'Twoje zdanie' });
    var placeholder = e('span', { class: 'answer-line__ph', lang: 'pl', text: 'klikaj słowa poniżej…' });
    var chipRow = e('div', { class: 'chips', lang: 'en' });
    var chosen = [];
    var locked = false;

    function renderAnswer() {
      answerLine.textContent = '';
      if (!chosen.length) { answerLine.appendChild(placeholder); return; }
      chosen.forEach(function (c, i) {
        var t = e('button', { class: 'chip chip--placed', type: 'button', text: c.word });
        t.addEventListener('click', function () {
          if (locked) return;
          c.chipEl.classList.remove('is-used');
          c.chipEl.disabled = false;
          chosen.splice(i, 1);
          renderAnswer();
          checkBtn.disabled = chosen.length === 0;
        });
        answerLine.appendChild(t);
      });
    }

    shuffleDistinct(pool).forEach(function (w) {
      var chip = e('button', { class: 'chip', type: 'button', text: w });
      chip.addEventListener('click', function () {
        if (locked || chip.disabled) return;
        chip.classList.add('is-used');
        chip.disabled = true;
        chosen.push({ word: w, chipEl: chip });
        renderAnswer();
        checkBtn.disabled = false;
      });
      chipRow.appendChild(chip);
    });

    wrap.appendChild(answerLine);
    wrap.appendChild(chipRow);
    renderAnswer();

    var actions = e('div', { class: 'ex-actions' });
    var checkBtn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź', disabled: true });
    actions.appendChild(checkBtn);
    wrap.appendChild(actions);

    function accepts(str) {
      return [correct].concat(item.alt || []).some(function (c) { return norm(c) === norm(str); });
    }

    checkBtn.addEventListener('click', function () {
      if (locked) return;
      var given = chosen.map(function (c) { return c.word; }).join(' ');
      locked = true;
      checkBtn.disabled = true;
      chipRow.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
      answerLine.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
      var ok = accepts(given);
      answerLine.classList.add(ok ? 'is-correct' : 'is-wrong');
      renderFeedback(wrap, ok, ok ? null : correct, item.why);
      save({ correct: ok, given: given });
    });

    if (prev && prev.given != null) {
      locked = true;
      chipRow.hidden = true;
      checkBtn.hidden = true;
      answerLine.textContent = String(prev.given);
      var wasOk = accepts(String(prev.given));
      answerLine.classList.add(wasOk ? 'is-correct' : 'is-wrong');
      renderFeedback(wrap, wasOk, wasOk ? null : correct, item.why);
    }
    return wrap;
  }

  function makeTransform(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.instruction);
    wrap.appendChild(e('p', { class: 'ex-q', lang: 'en', text: item.base }));
    textAnswer(wrap, item.answers, item.why, prev, save, 'Przekształcone zdanie');
    return wrap;
  }

  function makeCloze(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    itemHead(wrap, num, item.ctx, 'Uzupełnij wszystkie luki, potem sprawdź.');

    var para = e('p', { class: 'ex-q cloze', lang: 'en' });
    var chunks = String(item.text).split('___');
    var slots = [];
    chunks.forEach(function (chunk, i) {
      para.appendChild(txt(chunk));
      if (i < chunks.length - 1) {
        var b = (item.blanks && item.blanks[i]) || { answers: [] };
        var inp = e('input', {
          class: 'ex-blank cloze__blank', type: 'text', autocomplete: 'off',
          autocapitalize: 'none', spellcheck: false, 'aria-label': 'Luka ' + (i + 1)
        });
        para.appendChild(inp);
        slots.push({ inp: inp, answers: b.answers || [] });
        if (b.hint) para.appendChild(txt(' ' + b.hint));
      }
    });
    wrap.appendChild(para);

    var actions = e('div', { class: 'ex-actions' });
    var btn = e('button', { class: 'ex-btn', type: 'button', text: 'Sprawdź' });
    actions.appendChild(btn);
    wrap.appendChild(actions);

    function resolve(vals) {
      var allOk = true;
      slots.forEach(function (s, i) {
        if (vals[i] != null) s.inp.value = vals[i];
        s.inp.disabled = true;
        var ok = s.answers.some(function (a) { return norm(a) === norm(s.inp.value); });
        s.inp.classList.add(ok ? 'is-correct' : 'is-wrong');
        if (!ok) allOk = false;
      });
      btn.disabled = true;
      var corrected = slots.map(function (s) { return s.answers[0]; }).join('  ·  ');
      renderFeedback(wrap, allOk, allOk ? null : corrected, item.why);
      return allOk;
    }
    function submit() {
      if (btn.disabled) return;
      var vals = slots.map(function (s) { return s.inp.value; });
      if (vals.some(function (v) { return !v.trim(); })) { return; }
      save({ correct: resolve(vals), given: vals });
    }
    btn.addEventListener('click', submit);
    slots.forEach(function (s) {
      s.inp.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') { ev.preventDefault(); submit(); } });
    });
    if (prev && prev.given) resolve(prev.given);
    return wrap;
  }

  function makeListen(item, num, prev, save) {
    var wrap = e('div', { class: 'ex-item' });
    var has = speechReady();
    var mode = item.mode === 'choice' ? 'choice' : 'type';
    var doWhat = mode === 'choice' ? 'wybierz, co słyszysz.' : 'wpisz dokładnie to, co słyszysz.';
    itemHead(wrap, num, item.ctx,
      has ? 'Posłuchaj i ' + doWhat
          : 'Twoja przeglądarka nie ma syntezy mowy — przeczytaj zdanie i ' +
            (mode === 'choice' ? 'wybierz je.' : 'przepisz je.'));

    var bar = e('div', { class: 'ex-actions' });
    if (has) {
      var play = e('button', { class: 'ex-btn speak-btn', type: 'button', text: '▶︎  Odtwórz' });
      play.addEventListener('click', function () { speak(item.sentence); });
      var again = e('button', { class: 'ex-btn ex-btn--ghost', type: 'button', text: 'Wolniej' });
      again.addEventListener('click', function () {
        if (!speechReady()) return;
        try {
          window.speechSynthesis.cancel();
          var u = new window.SpeechSynthesisUtterance(item.sentence);
          u.lang = 'en-GB'; u.rate = 0.7;
          window.speechSynthesis.speak(u);
        } catch (err) {}
      });
      bar.appendChild(play);
      bar.appendChild(again);
    } else {
      bar.appendChild(e('p', { class: 'ex-q', lang: 'en', text: item.sentence }));
    }
    wrap.appendChild(bar);

    if (mode === 'choice') {
      optionList(wrap, item.options, item.answer, item.why, prev, save);
    } else {
      var answers = [item.sentence].concat(item.alt || []);
      textAnswer(wrap, answers, item.why, prev, save, 'Wpisz, co słyszysz');
    }
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
      seg.querySelectorAll('button').forEach(function (b, i) { b.classList.toggle('is-active', i === n); });
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

  var MAKERS = {
    gap: makeGap, choice: makeChoice, error: makeError, order: makeOrder,
    transform: makeTransform, cloze: makeCloze, listen: makeListen, contrast: makeContrast
  };

  // ---- Montaż zestawu ----
  function keyOf(item, idx) { return item && item.id ? item.id : '#' + idx; }

  function mountExercises(host, cfg) {
    if (!host || !cfg || !cfg.items) return;
    host.textContent = '';
    host.classList.add('exercise');

    var items = cfg.items;
    var store = new Store(cfg.id || 'default');
    var gradedTotal = items.filter(function (it) { return GRADED[it.type]; }).length;

    var scoreEl = e('span', { class: 'ex-score' });
    host.appendChild(e('div', { class: 'exercise__head' }, [
      e('p', { class: 'exercise__title', text: cfg.title || 'Ćwiczenia' }),
      scoreEl
    ]));
    if (cfg.intro) host.appendChild(e('p', { class: 'ex-item ex-ctx', text: cfg.intro }));

    function refreshScore() {
      if (gradedTotal === 0) { scoreEl.textContent = ''; return; }
      var done = 0, ok = 0;
      items.forEach(function (it, i) {
        if (!GRADED[it.type]) return;
        var r = store.get(keyOf(it, i));
        if (r) { done++; if (r.correct) ok++; }
      });
      scoreEl.innerHTML = '';
      scoreEl.appendChild(txt('Wynik: '));
      scoreEl.appendChild(e('b', { text: ok + ' / ' + gradedTotal }));
      if (done < gradedTotal) scoreEl.appendChild(txt(' (' + (gradedTotal - done) + ' do zrobienia)'));
    }

    var body = e('div', { class: 'exercise__body' });
    items.forEach(function (item, idx) {
      var maker = MAKERS[item.type];
      if (!maker) return;
      var key = keyOf(item, idx);
      function save(rec) {
        store.set(key, rec);
        if (cfg.onSave) { try { cfg.onSave(key, rec); } catch (err) {} }
        refreshScore();
      }
      body.appendChild(maker(item, idx + 1, store.get(key), save));
    });
    host.appendChild(body);

    if (gradedTotal > 0) {
      var resetBtn = e('button', { class: 'ex-btn ex-btn--ghost', type: 'button', text: 'Zacznij od nowa' });
      resetBtn.addEventListener('click', function () { store.clear(); mountExercises(host, cfg); });
      host.appendChild(e('div', { class: 'ex-foot' }, [
        e('p', { text: 'Postęp zapisuje się w tej przeglądarce.' }),
        resetBtn
      ]));
    }
    refreshScore();
  }

  // ---- Powtórka błędów ze wszystkich zestawów ----
  EG.mountReview = function (host, opts) {
    if (!host) return;
    opts = opts || {};
    var storeId = opts.storeId || 'review';
    var selfKey = STORE_PREFIX + storeId;
    var wrongIds = [];
    var seen = {};

    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!k || k.indexOf(STORE_PREFIX) !== 0 || k === selfKey) continue;
        var parsed;
        try { parsed = JSON.parse(localStorage.getItem(k) || '{}'); } catch (err) { continue; }
        if (!parsed || !parsed.results) continue;
        Object.keys(parsed.results).forEach(function (rk) {
          var rec = parsed.results[rk];
          if (rec && rec.correct === false && EG._byId[rk] && !seen[rk]) {
            seen[rk] = 1;
            wrongIds.push(rk);
          }
        });
      }
    } catch (err) { /* localStorage niedostępny */ }

    if (!wrongIds.length) {
      host.textContent = '';
      host.classList.add('exercise');
      host.appendChild(e('div', { class: 'exercise__head' }, [
        e('p', { class: 'exercise__title', text: opts.title || 'Powtórka błędów' })
      ]));
      host.appendChild(e('p', { class: 'ex-item ex-ctx', text:
        'Nie ma jeszcze błędów do powtórki. Porozwiązuj ćwiczenia na stronach czasów — ' +
        'te, w których się pomylisz, wrócą tutaj.' }));
      return;
    }

    mountExercises(host, {
      id: storeId,
      title: (opts.title || 'Powtórka błędów') + ' (' + wrongIds.length + ')',
      intro: opts.intro || 'Zadania, w których się pomyliłeś — rozwiąż je jeszcze raz. ' +
        'Gdy trafisz, znikają z powtórki.',
      items: EG.bankPick(wrongIds),
      onSave: function (id, rec) {
        if (!rec || !rec.correct) return;
        // Odbij poprawną odpowiedź do wszystkich zestawów źródłowych.
        try {
          for (var j = 0; j < localStorage.length; j++) {
            var kk = localStorage.key(j);
            if (!kk || kk.indexOf(STORE_PREFIX) !== 0 || kk === selfKey) continue;
            var p;
            try { p = JSON.parse(localStorage.getItem(kk) || '{}'); } catch (err) { continue; }
            if (p && p.results && p.results[id]) {
              p.results[id] = rec;
              localStorage.setItem(kk, JSON.stringify(p));
            }
          }
        } catch (err) {}
      }
    });
  };

  EG.mountExercises = mountExercises;
})();
