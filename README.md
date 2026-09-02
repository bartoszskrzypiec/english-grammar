# English Grammar

Prywatne, interaktywne materiały do nauki angielskiej gramatyki — dla osoby,
która posługuje się angielskim od dawna, ale ma utrwalone problemy z
gramatyką (zwłaszcza tam, gdzie polski „podpowiada” złą formę).

**Moduł 1 (gotowy):** cztery czasy teraźniejsze — Present Simple, Present
Continuous, Present Perfect, Present Perfect Continuous.

Wersja live: https://bartoszskrzypiec.github.io/english-grammar/

## Jak to działa

Czyste, statyczne pliki HTML/CSS/JS. Zero zależności, zero build stepu, zero
npm. Otwierasz `index.html` w przeglądarce (albo całość przez GitHub Pages)
i działa. Skrypty są klasyczne (nie moduły ES), więc strony działają też
otwarte lokalnie przez `file://`.

```
index.html                              spis treści
czasy/present-simple.html               \
czasy/present-continuous.html            |  strona na czas: oś czasu +
czasy/present-perfect.html               |  budowa + kiedy używać +
czasy/present-perfect-continuous.html   /   częste błędy + ćwiczenia
czasy/porownanie.html                   który czas wybrać: pary kontrastowe + quiz
cwiczenia.html                          test mieszany ze wszystkich czterech czasów
assets/css/style.css                    wspólny arkusz (light + dark)
assets/js/timeline.js                   widget interaktywnej osi czasu
assets/js/exercises.js                  silnik ćwiczeń (luki / wybór / błędy / pary)
```

## Zasada języka

Wyjaśnienia, polecenia i informacja zwrotna — po polsku. Przykłady, zdania
w ćwiczeniach i nazwy czasów — po angielsku, w elementach `lang="en"`.
Obie warstwy są widoczne naraz; nie ma przełącznika PL/EN.

## Postęp

Wynik i stan ćwiczeń zapisują się w `localStorage` przeglądarki (klucz
`eng-grammar:<id-zestawu>`). Każdy zestaw ma przycisk „Zacznij od nowa”.

## Rozwój

Żywy projekt. Kolejne moduły (Past Tenses, Future, Conditionals, …)
dokładane są osobno, każdy jako nowy folder + wpisy w `index.html`. Zasady
i konwencje: patrz `CLAUDE.md`.
