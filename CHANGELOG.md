# Changelog

Dziennik zmian. Nowy wpis przy każdej istotnej zmianie treści lub silnika.

## 2026-09-02 — silnik +4 typy, bank zadań, powtórka błędów, strony do czytania

- `exercises.js`: nowe typy ćwiczeń — `order` (rozsypanka), `transform`
  (przekształć zdanie), `cloze` (tekst z wieloma lukami), `listen` (synteza
  mowy `speechSynthesis`, z fallbackiem do tekstu). `norm()` łagodniejsze
  (ignoruje apostrofy i końcową interpunkcję).
- **Bank zadań z ID**: `EG.registerItems` / `EG.bank(tag)` / `EG.bankPick([id])`.
  Itemy Present przeniesione z inline'owych configów do `assets/js/data/present.js`
  (79 itemów, każdy z `id` i `tags`). `Store` bump do `v: 2` — wynik kluczowany
  po `item.id`, nie po indeksie.
- **`EG.mountReview(host)`**: zbiera zadania z `correct: false` ze wszystkich
  zestawów (`localStorage` prefiks `eng-grammar:`), montuje jako powtórkę;
  poprawna odpowiedź odbija się do zestawu źródłowego (znika z powtórki).
- `assets/js/reading.js` — `EG.mountList` (filtrowana lista z chipami i szukaniem).
- Nowe strony: `bledy.html` (Muzeum błędów, `assets/js/data/bledy.js`, 58 wpisów),
  `przyklady.html` (Bank zdań, `assets/js/data/przyklady.js`, 116 zdań).
- `cwiczenia.html`: test mieszany jako `EG.bankPick` (~35), + sekcja „Powtórka błędów”.
- `czasy/*.html` + `porownanie.html`: montaż przez `EG.bank(...)`; strony czasów
  ~16–17 zadań każda (z `order` / `transform` / `listen` / `cloze`).
- `index.html` przebudowany na hub (moduł, ćwiczenia+powtórka, do czytania, roadmapa).
- `style.css`: komponenty `.chips`/`.chip`/`.answer-line`, `.cloze__blank`,
  `.speak-btn`, `.filterbar`/`.filter-chip`/`.filter-search`, `.museum`, `.bank`
  + reguły mobilne dla nich.

## 2026-09-02 — dopasowanie do telefonu

- `timeline.js`: viewBox dopasowywany do szerokości kontenera (ResizeObserver),
  skala user-unit ≈ px — tekst na osi zostaje czytelny na telefonie; większe
  czcionki etykiet; unikalny `id` markera strzałki na instancję.
- Przełącznik czasów: krótkie etykiety (`Simple` / `Continuous` / `Perfect` /
  `Perfect Cont.`), pełna szerokość i układ 2×2 na wąskim ekranie.
- `style.css`: `@media (max-width: 600px)` — mniejsze marginesy, mniejszy H1,
  luka w zdaniu w osobnym wierszu; `@media (max-width: 620px)` — tabele form
  jako kafelki z etykietami kolumn (`data-col` na `<td>`); pola dotykowe
  min. 40–44 px (opcje, tokeny, przyciski); `-webkit-tap-highlight-color`,
  `scroll-margin-top` pod przyklejoną nawigacją, `overflow-wrap` dla `lang="en"`.

## 2026-09-02 — start projektu, Moduł 1: czasy teraźniejsze

- Repo, struktura, wspólny arkusz `assets/css/style.css` (light + dark).
- `assets/js/timeline.js` — interaktywna oś czasu, cztery rysunki
  (Simple / Continuous / Perfect / Perfect Continuous), tryb z przełącznikiem.
- `assets/js/exercises.js` — silnik ćwiczeń: typy `gap`, `choice`, `error`
  (klikalne tokeny), `contrast`; wynik i postęp w `localStorage`.
- Strony: spis treści, cztery strony czasów (budowa, kiedy używać, markery,
  częste błędy z kalki PL→EN, wbudowane ćwiczenia), `czasy/porownanie.html`
  (pary kontrastowe + quiz), `cwiczenia.html` (test mieszany, 18 zadań).
- GitHub Pages z gałęzi `main` / root.
