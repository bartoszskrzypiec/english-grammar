# Changelog

Dziennik zmian. Nowy wpis przy każdej istotnej zmianie treści lub silnika.

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
