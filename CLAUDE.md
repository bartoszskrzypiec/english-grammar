# CLAUDE.md

Wskazówki dla sesji Claude Code pracujących w tym repo.

## Czym to jest

Prywatne, interaktywne materiały do nauki **angielskiej gramatyki**, dla
Bartka — osoby, która mówi po angielsku od lat, ale ma utrwalone błędy
gramatyczne (typowa „fossilized errors”: płynna komunikacja, powtarzalne
pomyłki, często z kalki z polskiego). Materiał ma **uczyć decyzji i łapać
konkretne błędy**, nie recytować definicje.

To **nie** jest część rodziny książek CG (`learning-materials`,
`raytracing-book`, `lookdev-book` itd.). Inna dziedzina, inny odbiorca,
osobne repo, własny `assets/`. Z tamtej rodziny wzięte są tylko sprawdzone
konwencje (statyczne pliki, brak build stepu, GitHub Pages z `main`/root,
paleta light+dark przez `prefers-color-scheme`).

Live: https://bartoszskrzypiec.github.io/english-grammar/

## Brak systemu budowania

Czysty statyczny HTML/CSS/JS. Zero npm, zero bundlera, zero CI, zero testów.
„Uruchomienie” = otwarcie pliku w przeglądarce lub `python -m http.server` w
katalogu repo. Walidacja JS: `node --check assets/js/*.js`.

**Skrypty są klasyczne (`<script src>`), nie moduły ES.** Powód: strony mają
działać też otwarte przez `file://` (dwuklik), bez serwera. Nie zamieniaj na
`type="module"` ani nie dodawaj importów między plikami.

## Zasada języka (trzymać się jej ściśle)

- Interfejs, nagłówki, wyjaśnienia, polecenia, feedback → **polski**, z
  pełnymi znakami diakrytycznymi.
- Zdania przykładowe, zdania w ćwiczeniach, nazwy czasów, słowa-markery →
  **angielski**, każdy fragment w `<span lang="en">…</span>` (wymowa dla
  czytników ekranu, dzielenie wyrazów).
- `<html lang="pl">` na każdej stronie. Bez przełącznika PL/EN, bez `i18n.js`.
- Angielski przykład w prozie → blok `.eg` (`<span class="eg__tag">EN</span>`
  + `<span lang="en">` + opcjonalny `<span class="eg__pl">` z tłumaczeniem).
- Reguła → `.rule`, częsty błąd → `.pitfall` (z `.bad` przekreślonym i
  `.good`, oraz `.pitfall__why` wyjaśniającym *dlaczego* Polak tak robi).

## Struktura

```
index.html                     spis treści (kafle .card)
czasy/<nazwa-czasu>.html        jedna strona = jeden czas
czasy/porownanie.html           pary kontrastowe + oś z przełącznikiem + quiz
cwiczenia.html                  test mieszany
assets/css/style.css            jedyny arkusz
assets/js/timeline.js           window.EG.mountTimeline
assets/js/exercises.js          window.EG.mountExercises
```

Folder `czasy/` po polsku; pliki po angielsku (nazwy własne czasów).
Strony w `czasy/` linkują do `../assets/...`, `../index.html`,
`../cwiczenia.html`; do siebie nawzajem — względnie.

### Szablon strony czasu

1. `hero` z `eyebrow` „Czas NN z 4” + jedno zdanie „do czego służy”
2. `<div data-timeline="<slug>"></div>` (auto-montaż)
3. „Budowa” — `.form-table` (twierdzenie / przeczenie / pytanie)
4. „Kiedy używać” — przypadki, każdy z `.eg`
5. „Markery czasu”
6. „Częste błędy (kalka z polskiego)” — `.pitfall` × kilka
7. „Ćwiczenia” — `<div id="ex"></div>` + `EG.mountExercises(...)` w `<script>` na końcu
8. `.site-nav` (← poprzedni / następny →)

Kolejność prev/next: Present Simple → Continuous → Perfect → Perfect
Continuous → `porownanie.html`.

## `assets/js/timeline.js`

`window.EG.mountTimeline(hostEl, { tense, switcher })` albo auto-montaż z
`<div data-timeline="present-simple" [data-switcher]></div>`.

`tense` ∈ `present-simple`, `present-continuous`, `present-perfect`,
`present-perfect-continuous`. SVG rysowany z elementów, `render()` wołany raz
na starcie (wzorzec SVG+slider z `learning-materials`). Kolory z tokenów
`--accent`/`--text`/`--text-muted` przez klasy `.tl-*` w `style.css`.
Dodając nowy czas: dopisz wpis do `TENSES`, `LABELS`, `CAPTIONS`, `DRAW`.

## `assets/js/exercises.js`

`window.EG.mountExercises(hostEl, { id, title, intro, items })`. `id` =
klucz `localStorage` (`eng-grammar:<id>`) — **musi być unikalny na stronie**
(na `porownanie.html` jest kilka bloków, każdy z własnym `id`).

Typy `items`:

| type | pola | uwagi |
|---|---|---|
| `gap` | `q` (z `___`), `hint?`, `answers[]`, `why`, `ctx?` | porównanie po normalizacji (trim, lowercase, `’`→`'`); podaj warianty z apostrofem i bez |
| `choice` | `q?`, `options[]`, `answer` (indeks), `why`, `ctx?` | klik = od razu ocena |
| `error` | `sentence`, `wrongIndex` (indeks tokena po podziale na spacje; `-1` = zdanie poprawne), `fix?`, `why`, `ctx?` | **tylko błędy naprawialne wymianą jednego tokena** — nie takie, gdzie trzeba zmienić dwa słowa (np. „am knowing” → „know”). Takie rób jako `choice`. |
| `contrast` | `a{sentence,meaning}`, `b{sentence,meaning}`, `labels?[]`, `note?` | nieoceniane; blok bez wyniku i bez „Zacznij od nowa”, jeśli wszystkie itemy to `contrast` |

Ocena: `gap` + `choice` + `error`. Bank błędów celuje w interferencję PL→EN
(brak `-s` w 3. os., podwójne oznaczenie po `does`/`doesn't`, brak `be` w
Continuous, czasowniki stanowe w formie `-ing`, Present Perfect z określonym
czasem przeszłym, Present Simple/Continuous zamiast Perfect przy `for/since`,
`since` vs `for`, druga forma zamiast trzeciej po `have/has`).

## Poprawność językowa

To materiał do nauki — błąd merytoryczny jest gorszy niż brak treści.
Przy dodawaniu/zmianie przykładów i zadań sprawdzaj każde zdanie: forma,
przypadek użycia, czy `why` faktycznie tłumaczy regułę. Rejestr: brytyjski
angielski (np. `travelling`, `Have you finished?` zamiast `Did you finish?`),
ale bez pryncypialności tam, gdzie oba warianty są poprawne — wtedy zaznacz
to w `why`.

## Git

Commituj i pushuj po zmianie, bez pytania za każdym razem (gdy remote już
istnieje). Wiadomości commitów **bez polskich znaków** (ASCII) — treść stron
zawsze z pełnymi diakrytykami. Nie force-push bez pytania. Przy zmianie w
`timeline.js`/`exercises.js` albo w regułach — dopisz wpis do `CHANGELOG.md`.

## Weryfikacja przed commitem

- `node --check assets/js/timeline.js assets/js/exercises.js`
- `python -m http.server` + przejść po wszystkich stronach: oś czasu się
  rysuje, ćwiczenia przyjmują odpowiedź i pokazują „dlaczego”, wynik się
  nalicza, odświeżenie zachowuje postęp, „Zacznij od nowa” czyści.
- Otworzyć też przez `file://` — musi działać tak samo.
- Dark mode (`prefers-color-scheme: dark`), szerokość 360px bez poziomego
  scrolla, `prefers-reduced-motion` bez animacji.
- Każdy `<span lang="en">` faktycznie owija tekst angielski; każdy item
  ćwiczenia ma `why`.

## Dodanie kolejnego modułu (np. Past Tenses)

Nowy folder (`czasy-przeszle/` albo `past/`), strony wg tego samego
szablonu, nowe kafle w `index.html`, ewentualnie nowa strona porównawcza.
`timeline.js` rozszerz o nowe `tense`, jeśli oś czasu ma sens dla danego
czasu. Wpis w `CHANGELOG.md`. Nie przebudowuj istniejących stron „przy
okazji”.
