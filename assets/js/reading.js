/* english-grammar — filtrowana lista do czytania (Muzeum błędów, Bank zdań).
 *
 * Classic script. Wystawia:
 *
 *   window.EG.mountList(hostElement, {
 *     data: [ { ... } ],
 *     unit: 'zdań',                         // do licznika "40 z 160 zdań"
 *     facets: [
 *       { key:'cat', label:'Kategoria', all:'Wszystkie', order?:[], map?:{} }
 *     ],
 *     search: ['en','pl'],                  // pola do szukania podłańcucha (opcjonalne)
 *     searchLabel: 'Szukaj…',
 *     render: function(entry){ return domNode; },
 *     empty: 'Nic nie pasuje.'
 *   });
 */
(function () {
  'use strict';
  var EG = window.EG = window.EG || {};

  function e(tag, props, kids) {
    var node = document.createElement(tag);
    if (props) {
      for (var k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        if (k === 'class') node.className = props[k];
        else if (k === 'text') node.textContent = props[k];
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

  function uniqueValues(data, key, order) {
    if (order && order.length) return order.slice();
    var seen = {}, out = [];
    data.forEach(function (d) {
      var v = d[key];
      if (v == null || seen[v]) return;
      seen[v] = 1; out.push(v);
    });
    return out;
  }

  EG.mountList = function (host, cfg) {
    if (!host || !cfg || !cfg.data) return;
    host.textContent = '';
    host.classList.add('listing');

    var facets = cfg.facets || [];
    var state = { q: '' };
    facets.forEach(function (f) { state[f.key] = null; });

    var bar = e('div', { class: 'filterbar' });
    var countEl = e('p', { class: 'listing__count' });
    var listEl = e('div', { class: cfg.listClass || 'list' });

    function matches(entry) {
      for (var i = 0; i < facets.length; i++) {
        var f = facets[i];
        if (state[f.key] != null && entry[f.key] !== state[f.key]) return false;
      }
      if (state.q && cfg.search) {
        var hay = cfg.search.map(function (k) { return String(entry[k] || ''); }).join(' ').toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) < 0) return false;
      }
      return true;
    }

    function draw() {
      listEl.textContent = '';
      var shown = 0;
      cfg.data.forEach(function (entry) {
        if (!matches(entry)) return;
        shown++;
        listEl.appendChild(cfg.render(entry));
      });
      var unit = cfg.unit ? ' ' + cfg.unit : '';
      countEl.textContent = shown === cfg.data.length
        ? cfg.data.length + unit
        : shown + ' z ' + cfg.data.length + unit;
      if (!shown) listEl.appendChild(e('p', { class: 'listing__empty', text: cfg.empty || 'Nic nie pasuje do filtrów.' }));
    }

    facets.forEach(function (f) {
      var group = e('div', { class: 'filter-group', role: 'group', 'aria-label': f.label || 'Filtr' });
      if (f.label) group.appendChild(e('span', { class: 'filter-group__label', text: f.label }));
      var chips = [];

      function setActive(val) {
        state[f.key] = val;
        chips.forEach(function (c) {
          var on = c.getAttribute('data-val') === (val == null ? '' : String(val));
          c.classList.toggle('is-active', on);
          c.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        draw();
      }

      var allChip = e('button', {
        class: 'filter-chip is-active', type: 'button', 'data-val': '',
        'aria-pressed': 'true', text: f.all || 'Wszystkie'
      });
      allChip.addEventListener('click', function () { setActive(null); });
      chips.push(allChip);
      group.appendChild(allChip);

      uniqueValues(cfg.data, f.key, f.order).forEach(function (v) {
        var label = (f.map && f.map[v]) || v;
        var c = e('button', {
          class: 'filter-chip', type: 'button', 'data-val': String(v),
          'aria-pressed': 'false', text: label
        });
        c.addEventListener('click', function () { setActive(v); });
        chips.push(c);
        group.appendChild(c);
      });
      bar.appendChild(group);
    });

    if (cfg.search) {
      var search = e('input', {
        class: 'filter-search', type: 'search',
        placeholder: cfg.searchLabel || 'Szukaj…',
        'aria-label': cfg.searchLabel || 'Szukaj'
      });
      search.addEventListener('input', function () { state.q = search.value; draw(); });
      bar.appendChild(search);
    }

    host.appendChild(bar);
    host.appendChild(countEl);
    host.appendChild(listEl);
    draw();
  };
})();
