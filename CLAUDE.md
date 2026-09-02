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
index.html                     hub (kafle .card: moduł, ćwiczenia, do czytania, roadmapa)
czasy/<nazwa-czasu>.html        jedna strona = jeden czas
czasy/porownanie.html           pary kontrastowe + oś z przełącznikiem + quiz
cwiczenia.html                  test mieszany (bankPick) + „Powtórka błędów” (mountReview)
bledy.html                      Muzeum błędów (filtrowana lista)
przyklady.html                  Bank zdań (filtrowana lista)
assets/css/style.css            jedyny arkusz
assets/js/timeline.js           window.EG.mountTimeline
assets/js/exercises.js          window.EG.mountExercises / bank / mountReview
assets/js/reading.js            window.EG.mountList
assets/js/data/present.js       bank zadań Moduł 1 (EG.registerItems)
assets/js/data/bledy.js         window.EG_BLEDY  (Muzeum błędów)
assets/js/data/przyklady.js     window.EG_PRZYKLADY  (Bank zdań)
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
7. „Ćwiczenia” — `<div id="ex"></div>` + `<script src="../assets/js/data/present.js">`
   + `EG.mountExercises(el, { id, title, intro, items: EG.bank('<slug>') })`
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

`window.EG.mountExercises(hostEl, { id, title, intro, items, onSave? })`.
`id` = klucz `localStorage` (`eng-grammar:<id>`) — **musi być unikalny na
stronie** (na `porownanie.html` jest kilka bloków, każdy z własnym `id`).

Normalizacja odpowiedzi (`gap`/`transform`/`order`/`cloze`/`listen`): trim,
lowercase, `’`→`'`, **usunięcie apostrofów** (`I'm` == `im`) i końcowej
interpunkcji. Warianty w `answers[]` nadal warto podać dla „do not / don't”,
„have / 've” itp.

Typy `items`:

| type | pola | uwagi |
|---|---|---|
| `gap` | `q` (z `___`), `hint?`, `answers[]`, `why`, `ctx?` | jedna luka w zdaniu |
| `choice` | `q?`, `options[]`, `answer` (indeks), `why`, `ctx?` | klik = od razu ocena |
| `error` | `sentence`, `wrongIndex` (indeks tokena po `split(/\s+/)`; `-1` = zdanie poprawne), `fix?`, `why`, `ctx?` | **tylko błędy naprawialne wymianą jednego tokena** — nie takie, gdzie trzeba zmienić dwa słowa. Takie rób jako `choice`. |
| `order` | `answer` (poprawne zdanie, **bez** końcowej kropki), `alt?[]`, `pool?[]` (domyślnie słowa z `answer`), `why`, `ctx?` | klocki-słowa; klik dokłada, klik w ułożone cofa |
| `transform` | `base` (zdanie EN), `instruction` (PL polecenie), `answers[]`, `why` | jak `gap`, ale z pełnym zdaniem wyjściowym |
| `cloze` | `text` (z `___` × N), `blanks: [{answers[], hint?}]` (długość == liczba `___`), `why`, `ctx?` | jedno „Sprawdź”, per-luka ✓/✗ |
| `listen` | `sentence`, `mode:'type'\|'choice'`, `options?`, `answer?`, `alt?`, `why`, `ctx?` | ▶ mówi przez `speechSynthesis`; brak głosu → fallback z tekstem |
| `contrast` | `a{sentence,meaning}`, `b{sentence,meaning}`, `labels?[]`, `note?` | nieoceniane |

Ocena: wszystko poza `contrast`. Bank błędów celuje w interferencję PL→EN
(brak `-s` w 3. os., podwójne oznaczenie po `does`, brak `be` w Continuous,
czasowniki stanowe w `-ing`, Present Perfect z określonym czasem przeszłym,
Present Simple/Continuous zamiast Perfect przy `for/since`, `since` vs `for`,
druga forma zamiast trzeciej po `have`, szyk w pytaniu i pytaniu zależnym).

### Bank zadań (`EG.registerItems` / `EG.bank` / `EG.bankPick`)

Itemy **nie** są już inline na stronach — mieszkają w `assets/js/data/<modul>.js`,
który woła `EG.registerItems([ { id, type, tags:[...], ... } ])`. Strona ładuje
ten plik przed swoim inline `<script>` i montuje wybór:

```js
EG.mountExercises(el, { id: 'present-perfect', items: EG.bank('present-perfect') });
EG.mountExercises(el, { id: 'mixed-test', items: EG.bankPick(['ps-01','pp-06', ...]) });
```

- `id` itemu jest **stabilny na zawsze** — to klucz postępu i powtórki błędów.
- `tags` — slug czasu (`present-simple`…) albo `mixed`. `EG.bank(tag)` filtruje,
  `EG.bankPick([...])` wybiera po ID w podanej kolejności.
- Zmiana treści itemu = OK; zmiana `id` = kasuje czyjś postęp.

### `EG.mountReview(hostEl, { title? })`

Skanuje `localStorage` (prefiks `eng-grammar:`), zbiera `id` itemów z
`correct: false`, montuje je jako świeży zestaw pod kluczem `eng-grammar:review`.
Poprawna odpowiedź w powtórce jest **odbijana** do zestawu źródłowego (item
znika z kolejnej powtórki). Pusty wynik → komunikat zachęcający do ćwiczeń.
Wymaga, żeby `assets/js/data/*.js` wszystkich modułów były załadowane na
stronie z powtórką (`cwiczenia.html`).

## `assets/js/reading.js`

`window.EG.mountList(hostEl, { data, facets, search?, render, unit?, listClass?, empty? })`
— filtrowana lista do stron „do czytania”. `facets: [{ key, label, all, order?, map? }]`
robi grupę chipów (single-select). `search: ['pole', ...]` dodaje pole
szukania po podłańcuchu. `render(entry)` zwraca węzeł DOM jednego wiersza.
Używane przez `bledy.html` (`.museum__row`) i `przyklady.html` (`.bank__row`).

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

## Roadmapa modułów (kolejność wg wartości dla Polaka z kalkami)

1. **Przedimki** (`a/an/the/∅`) — folder `przedimki/`. + widget `annotate.js`
   (klik w czasownik → notka „dlaczego ten czas”) i teksty z adnotacjami dla
   Present. + dłuższa historyjka.
2. **Czasy przeszłe** — Past Simple vs Present Perfect, Past Continuous, Past
   Perfect. `timeline.js` dostaje nowe warianty `tense`.
3. **Okresy warunkowe** 0/1/2/3 + mieszane.
4. **Przyimki** (in/on/at + czasowniki z przyimkami); potem drobne (liczba
   mnoga / niepoliczalne, `will` vs `going to`).

## Dodanie kolejnego modułu

1. Nowy folder (np. `przedimki/`), strony wg szablonu strony czasu.
2. **Nowy plik banku** `assets/js/data/<modul>.js` z `EG.registerItems([...])`;
   `id` z własnym prefiksem (np. `art-01`), `tags` z własnym slugiem.
   Strony modułu montują przez `EG.bank('<slug>')`.
3. Dopisz plik banku do `<script>` na `cwiczenia.html`, żeby „Powtórka błędów”
   widziała jego itemy.
4. Nowe kafle w `index.html` (sekcja modułu + usuń z „W przygotowaniu”);
   nowe wpisy zalążkowe w `assets/js/data/bledy.js` i `przyklady.js`.
5. `timeline.js` — rozszerz o nowe `tense` tylko jeśli oś czasu ma sens.
6. Wpis w `CHANGELOG.md`. Nie przebudowuj istniejących stron „przy okazji”.
