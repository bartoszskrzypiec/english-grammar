/* english-grammar — bank zadań: czasy teraźniejsze (Moduł 1).
 *
 * Rejestruje się w silniku (assets/js/exercises.js musi być załadowany
 * WCZEŚNIEJ). Strony montują wybór przez EG.bank('<slug>') lub EG.bankPick([...]).
 *
 * id: stabilne, nigdy nie zmieniać (klucz postępu i powtórki błędów).
 * tags: [<slug czasu>] — 'present-simple' | 'present-continuous'
 *                        | 'present-perfect' | 'present-perfect-continuous'
 */
(function () {
  'use strict';
  if (!window.EG || !window.EG.registerItems) return;

  window.EG.registerItems([

    /* ===================== PRESENT SIMPLE ===================== */
    {
      id: 'ps-01', type: 'gap', tags: ['present-simple'],
      ctx: 'Rutyna — gdzie ktoś pracuje.',
      q: 'She ___ in an office.', hint: '(work)', answers: ['works'],
      why: 'Trzecia osoba liczby pojedynczej (she) w Present Simple dostaje końcówkę -s: work → works.'
    },
    {
      id: 'ps-02', type: 'gap', tags: ['present-simple'],
      ctx: 'Godziny otwarcia z regulaminu muzeum.',
      q: 'The museum ___ at 9 a.m. on weekdays.', hint: '(open)', answers: ['opens'],
      why: 'Harmonogramy i rozkłady podajemy w Present Simple, nawet gdy mówią o przyszłości.'
    },
    {
      id: 'ps-03', type: 'error', tags: ['present-simple'],
      ctx: 'Przeczenie w trzeciej osobie.',
      sentence: 'He don’t like coffee.', wrongIndex: 1, fix: 'doesn’t',
      why: 'Trzecia osoba (he) w przeczeniu Present Simple: doesn’t, nie don’t. Czasownik „like” zostaje bez -s.'
    },
    {
      id: 'ps-04', type: 'error', tags: ['present-simple'],
      ctx: 'Pytanie w trzeciej osobie.',
      sentence: 'Does she works here?', wrongIndex: 2, fix: 'work',
      why: '„Does” już niesie trzecią osobę, więc czasownik główny wraca do bezokolicznika: Does she work here?'
    },
    {
      id: 'ps-05', type: 'choice', tags: ['present-simple'],
      ctx: 'Ogólna prawda fizyczna, nie chwila.',
      q: 'Water ___ at 100 degrees Celsius.',
      options: ['is boiling', 'boils', 'has boiled'], answer: 1,
      why: 'Prawa natury i ogólne fakty → Present Simple.'
    },
    {
      id: 'ps-06', type: 'choice', tags: ['present-simple'],
      ctx: 'Stała umiejętność.',
      q: 'My brother ___ three languages.',
      options: ['is speaking', 'speaks', 'has been speaking'], answer: 1,
      why: 'Stała cecha / umiejętność, nie czynność w toku → Present Simple.'
    },
    {
      id: 'ps-07', type: 'gap', tags: ['present-simple'],
      ctx: 'Twój nawyk żywieniowy — przeczenie.',
      q: 'I ___ meat.', hint: '(not / eat)',
      answers: ['don’t eat', 'do not eat'],
      why: 'Przeczenie w pierwszej osobie: don’t + bezokolicznik.'
    },
    {
      id: 'ps-08', type: 'choice', tags: ['present-simple'],
      ctx: '„Rozumiem, o co ci chodzi” — powiedziane w tej chwili.',
      q: 'I ___ what you mean.',
      options: ['am understanding', 'understand'], answer: 1,
      why: '„understand” to czasownik stanowy — nie występuje w formie continuous, nawet gdy mówisz o teraz.'
    },
    {
      id: 'ps-09', type: 'error', tags: ['present-simple'],
      ctx: 'Brak końcówki trzeciej osoby.',
      sentence: 'My sister live in Berlin.', wrongIndex: 2, fix: 'lives',
      why: 'he / she / it → czasownik z -s. „My sister lives in Berlin.” To najczęstsza pomyłka Polaków.'
    },
    {
      id: 'ps-10', type: 'choice', tags: ['present-simple'],
      ctx: 'Odjazd z rozkładu jazdy.',
      q: 'The train ___ at 6 a.m. — it’s in the timetable.',
      options: ['is leaving', 'leaves'], answer: 1,
      why: 'Rozkłady jazdy → Present Simple, mimo że chodzi o przyszłość.'
    },
    {
      id: 'ps-11', type: 'order', tags: ['present-simple'],
      ctx: 'Ułóż zdanie. Uważaj, gdzie stoi „always”.',
      answer: 'She always takes the bus to work',
      why: 'Przysłówek częstotliwości (always, usually, often…) stoi PRZED czasownikiem głównym: „She always takes…”.'
    },
    {
      id: 'ps-12', type: 'transform', tags: ['present-simple'],
      base: 'She works here.', instruction: 'Zamień na pytanie.',
      answers: ['Does she work here?'],
      why: 'Pytanie: Does + podmiot + bezokolicznik (bez -s). „Does she work here?”'
    },
    {
      id: 'ps-13', type: 'transform', tags: ['present-simple'],
      base: 'They play tennis on Sundays.', instruction: 'Zamień na przeczenie.',
      answers: ["They don't play tennis on Sundays.", 'They do not play tennis on Sundays.'],
      why: 'Przeczenie: podmiot + don’t/doesn’t + bezokolicznik.'
    },
    {
      id: 'ps-14', type: 'listen', tags: ['present-simple'], mode: 'type',
      sentence: 'He usually walks to school.',
      why: '„usually” + Present Simple = rutyna. Przysłówek przed czasownikiem: „He usually walks…”.'
    },
    {
      id: 'ps-15', type: 'error', tags: ['present-simple'],
      ctx: 'Trzecia osoba, twierdzenie.',
      sentence: 'She go to the gym every morning.', wrongIndex: 1, fix: 'goes',
      why: 'go → goes w trzeciej osobie (czasowniki na -o dostają -es).'
    },
    {
      id: 'ps-16', type: 'choice', tags: ['present-simple'],
      ctx: 'Przysłówek częstotliwości z czasownikiem „be”.',
      q: 'I ___ late for meetings.',
      options: ['am never', 'never am'], answer: 0,
      why: 'Po czasowniku „be” przysłówek stoi PO nim: „I am never late”. Przed innymi czasownikami — przed nimi.'
    },
    {
      id: 'ps-17', type: 'contrast', tags: ['present-simple'],
      a: { sentence: 'She doesn’t drink coffee.', meaning: 'Nigdy / w ogóle — to jej nawyk (albo jego brak).' },
      b: { sentence: 'She isn’t drinking coffee.', meaning: 'Nie w tej chwili — akurat teraz nie pije, ale normalnie pije.' },
      labels: ['Present Simple', 'Present Continuous'],
      note: 'Ta sama forma po polsku („nie pije kawy”), dwa różne znaczenia po angielsku.'
    },

    /* ===================== PRESENT CONTINUOUS ===================== */
    {
      id: 'pc-01', type: 'gap', tags: ['present-continuous'],
      ctx: 'Widzisz to przez okno w tej chwili.',
      q: 'Look! It ___ outside.', hint: '(rain)',
      answers: ['is raining', 's raining'],
      why: 'Czynność w toku, w tym momencie → am/is/are + -ing. „It is raining.”'
    },
    {
      id: 'pc-02', type: 'gap', tags: ['present-continuous'],
      ctx: 'Co robisz i gdzie jesteś właśnie teraz.',
      q: 'Right now I ___ in a café.', hint: '(sit)',
      answers: ['am sitting', 'm sitting'],
      why: 'Krótka sylaba zakończona spółgłoską → podwajamy: sit → sitting.'
    },
    {
      id: 'pc-03', type: 'choice', tags: ['present-continuous'],
      ctx: 'Spotkanie jest umówione — jest termin.',
      q: 'We ___ the client tomorrow.',
      options: ['meet', 'are meeting', 'will meet'], answer: 1,
      why: 'Ustalony plan na najbliższą przyszłość → Present Continuous.'
    },
    {
      id: 'pc-04', type: 'choice', tags: ['present-continuous'],
      ctx: 'Twoja potrzeba w tej chwili.',
      q: 'I ___ a new phone.',
      options: ['am wanting', 'want'], answer: 1,
      why: '„want” to czasownik stanowy — nigdy w formie -ing, nawet o teraz.'
    },
    {
      id: 'pc-05', type: 'error', tags: ['present-continuous'],
      ctx: 'Trzecia osoba mnoga.',
      sentence: 'They is playing football.', wrongIndex: 1, fix: 'are',
      why: 'they → are, nie is.'
    },
    {
      id: 'pc-06', type: 'error', tags: ['present-continuous'],
      ctx: 'Czynność w toku — sprawdź formę czasownika.',
      sentence: 'I am read a book right now.', wrongIndex: 2, fix: 'reading',
      why: 'Po am/is/are musi być forma -ing: „I am reading a book right now.”'
    },
    {
      id: 'pc-07', type: 'error', tags: ['present-continuous'],
      ctx: 'Czegoś tu brakuje.',
      sentence: 'I working now.', wrongIndex: 1, fix: 'am working',
      why: 'Present Continuous to zawsze am/is/are + -ing. Po polsku „pracuję” nie ma osobnego „być”, więc łatwo je pominąć.'
    },
    {
      id: 'pc-08', type: 'choice', tags: ['present-continuous'],
      ctx: 'Sytuacja zmienia się z tygodnia na tydzień.',
      q: 'It’s autumn — the days ___ shorter.',
      options: ['get', 'are getting'], answer: 1,
      why: 'Proces w trakcie zmiany / rozwoju → Present Continuous.'
    },
    {
      id: 'pc-09', type: 'order', tags: ['present-continuous'],
      ctx: 'Ułóż pytanie.',
      answer: 'Where is he going now',
      why: 'Pytanie szczegółowe: słowo pytające + is/are/am + podmiot + -ing. „Where is he going?”'
    },
    {
      id: 'pc-10', type: 'transform', tags: ['present-continuous'],
      base: 'You are working today.', instruction: 'Zamień na pytanie.',
      answers: ['Are you working today?'],
      why: 'Pytanie w Present Continuous: be na początek — „Are you working today?”'
    },
    {
      id: 'pc-11', type: 'listen', tags: ['present-continuous'], mode: 'type',
      sentence: 'I’m staying with friends this week.',
      why: 'Sytuacja tymczasowa („this week”) → Present Continuous, choć to nie „w tej sekundzie”.'
    },
    {
      id: 'pc-12', type: 'choice', tags: ['present-continuous'],
      ctx: 'Słyszysz to w tej chwili.',
      q: 'Listen! Someone ___ at the door.',
      options: ['knocks', 'is knocking'], answer: 1,
      why: 'Czynność słyszana teraz → Present Continuous.'
    },
    {
      id: 'pc-13', type: 'error', tags: ['present-continuous'],
      ctx: '„have lunch” = jeść — tu forma continuous jest OK. Sprawdź samą formę.',
      sentence: 'She is have lunch at the moment.', wrongIndex: 2, fix: 'having',
      why: 'Po „is” musi być forma -ing: „She is having lunch.” (have w znaczeniu „jeść” continuous przyjmuje).'
    },
    {
      id: 'pc-14', type: 'cloze', tags: ['present-continuous'],
      ctx: 'Dziś nie pracujesz, bo masz remont.',
      text: 'I ___ today because I ___ the kitchen.',
      blanks: [
        { answers: ["'m not working", 'am not working', 'm not working'], hint: '(not / work)' },
        { answers: ["'m painting", 'am painting', 'm painting'], hint: '(paint)' }
      ],
      why: 'Obie czynności tymczasowe, wokół teraz → Present Continuous. Przeczenie: am not + -ing.'
    },
    {
      id: 'pc-15', type: 'gap', tags: ['present-continuous'],
      ctx: 'Co robią dzieci w tej chwili.',
      q: 'The children ___ in the garden.', hint: '(play)',
      answers: ['are playing', 're playing'],
      why: 'they → are + playing.'
    },
    {
      id: 'pc-16', type: 'contrast', tags: ['present-continuous'],
      a: { sentence: 'I live in Warsaw.', meaning: 'Na stałe — to moje miasto.' },
      b: { sentence: 'I’m living in Warsaw.', meaning: 'Tymczasowo — np. na czas projektu, potem wracam.' },
      labels: ['Present Simple', 'Present Continuous'],
      note: 'Continuous sygnalizuje, że stan jest przejściowy.'
    },

    /* ===================== PRESENT PERFECT ===================== */
    {
      id: 'pp-01', type: 'choice', tags: ['present-perfect'],
      ctx: 'Doświadczenie życiowe — kiedykolwiek, bez podanego kiedy.',
      q: '___ oysters?',
      options: ['Did you ever try', 'Have you ever tried', 'Are you ever trying'], answer: 1,
      why: 'Doświadczenie życiowe, czas nieokreślony → Present Perfect.'
    },
    {
      id: 'pp-02', type: 'choice', tags: ['present-perfect'],
      ctx: '„last weekend” — miniony, zamknięty czas.',
      q: 'I ___ that film last weekend.',
      options: ['have watched', 'watched'], answer: 1,
      why: '„last weekend” to zamknięty czas przeszły → Past Simple, nie Present Perfect.'
    },
    {
      id: 'pp-03', type: 'choice', tags: ['present-perfect'],
      ctx: 'Stoisz pod drzwiami i nie masz jak wejść.',
      q: 'I ___ my keys.',
      options: ['have lost', 'lost'], answer: 0,
      why: 'Liczy się skutek w tej chwili (nie masz kluczy) → Present Perfect.'
    },
    {
      id: 'pp-04', type: 'choice', tags: ['present-perfect'],
      ctx: 'Znajomość zaczęła się dawno i trwa do dziś.',
      q: 'I ___ her for ten years.',
      options: ['know', 'have known'], answer: 1,
      why: 'Stan od przeszłości do teraz z „for/since” → Present Perfect. Po polsku mylący czas teraźniejszy.'
    },
    {
      id: 'pp-05', type: 'gap', tags: ['present-perfect'],
      ctx: 'Mieszkanie od konkretnego roku, nadal.',
      q: 'We ___ here since 2015.', hint: '(live)',
      answers: ['have lived', 've lived'],
      why: 'have/has + trzecia forma. „live” jest regularne: lived.'
    },
    {
      id: 'pp-06', type: 'error', tags: ['present-perfect'],
      ctx: 'Trzecia osoba.',
      sentence: 'She have finished her work.', wrongIndex: 1, fix: 'has',
      why: 'he / she / it → has.'
    },
    {
      id: 'pp-07', type: 'error', tags: ['present-perfect'],
      ctx: 'Forma czasownika po „have”.',
      sentence: 'I have never went to Spain.', wrongIndex: 3, fix: 'gone',
      why: 'Po have/has idzie trzecia forma: go → gone (albo „been” dla doświadczenia). „went” to druga forma.'
    },
    {
      id: 'pp-08', type: 'error', tags: ['present-perfect'],
      ctx: 'Znów forma imiesłowu.',
      sentence: 'He has broke his leg.', wrongIndex: 2, fix: 'broken',
      why: 'break → broke (Past Simple) → broken (trzecia forma). Po „has” musi być „broken”.'
    },
    {
      id: 'pp-09', type: 'order', tags: ['present-perfect'],
      ctx: 'Ułóż pytanie o doświadczenie.',
      answer: 'Have you ever been to Japan',
      why: 'Pytanie w Present Perfect: Have/Has + podmiot + (ever) + trzecia forma. „Have you ever been to Japan?”'
    },
    {
      id: 'pp-10', type: 'transform', tags: ['present-perfect'],
      base: 'She has finished the report.', instruction: 'Zamień na pytanie.',
      answers: ['Has she finished the report?'],
      why: 'Has + podmiot + trzecia forma.'
    },
    {
      id: 'pp-11', type: 'transform', tags: ['present-perfect'],
      base: 'I have seen this film.', instruction: 'Zamień na przeczenie.',
      answers: ["I haven't seen this film.", 'I have not seen this film.'],
      why: 'haven’t / hasn’t + trzecia forma.'
    },
    {
      id: 'pp-12', type: 'cloze', tags: ['present-perfect'],
      ctx: 'Znasz Toma od studiów, do dziś.',
      text: 'I ___ Tom since university and we ___ close friends ever since.',
      blanks: [
        { answers: ['have known', 've known'], hint: '(know)' },
        { answers: ['have been', 've been'], hint: '(be)' }
      ],
      why: 'Stany (know, be) od przeszłości do teraz → Present Perfect (Simple), nie continuous.'
    },
    {
      id: 'pp-13', type: 'listen', tags: ['present-perfect'], mode: 'type',
      sentence: 'I’ve just finished my homework.',
      why: '„just” + świeży skutek → Present Perfect: „I have just finished.”'
    },
    {
      id: 'pp-14', type: 'choice', tags: ['present-perfect'],
      ctx: 'Najlepsza książka w twoim życiu — bez podanej daty.',
      q: 'It’s the best book I ___.',
      options: ['read', 'have ever read'], answer: 1,
      why: 'Po „the best … (that) I …” z doświadczeniem życiowym → Present Perfect: „I have ever read.”'
    },
    {
      id: 'pp-15', type: 'error', tags: ['present-perfect'],
      ctx: 'Forma czasownika w pytaniu.',
      sentence: 'Have you ate lunch yet?', wrongIndex: 2, fix: 'eaten',
      why: 'eat → ate → eaten. Po „Have you” trzecia forma: „Have you eaten lunch yet?”'
    },
    {
      id: 'pp-16', type: 'choice', tags: ['present-perfect'],
      ctx: '„yesterday” — zamknięty moment w przeszłości.',
      q: 'I ___ him yesterday.',
      options: ['have seen', 'saw'], answer: 1,
      why: 'Określony czas przeszły → Past Simple, nie Present Perfect.'
    },
    {
      id: 'pp-17', type: 'contrast', tags: ['present-perfect'],
      a: { sentence: 'He’s gone to Paris.', meaning: 'Pojechał i nadal tam jest — nie ma go tutaj.' },
      b: { sentence: 'He’s been to Paris.', meaning: 'Był i wrócił — albo: ma to w swoim doświadczeniu.' },
      labels: ['gone', 'been'],
      note: 'Ta sama konstrukcja, wybór imiesłowu zmienia sens.'
    },

    /* ===================== PRESENT PERFECT CONTINUOUS ===================== */
    {
      id: 'ppc-01', type: 'gap', tags: ['present-perfect-continuous'],
      ctx: 'Ile czasu trwa twoja nauka — do teraz.',
      q: 'I ___ for two hours.', hint: '(study)',
      answers: ['have been studying', 've been studying'],
      why: 'have/has + been + -ing.'
    },
    {
      id: 'ppc-02', type: 'choice', tags: ['present-perfect-continuous'],
      ctx: 'Jesteś przemoczony — dopiero co przestało.',
      q: 'Why are you so wet? — I ___ in the rain.',
      options: ['have run', 'have been running', 'run'], answer: 1,
      why: 'Świeży skutek + nacisk na samą czynność → Present Perfect Continuous.'
    },
    {
      id: 'ppc-03', type: 'choice', tags: ['present-perfect-continuous'],
      ctx: 'Znasz go od studiów — to stan.',
      q: 'I ___ him since college.',
      options: ['have been knowing', 'have known'], answer: 1,
      why: '„know” to czasownik stanowy — nie ma formy continuous. „Od kiedy” wyraża Present Perfect Simple.'
    },
    {
      id: 'ppc-04', type: 'choice', tags: ['present-perfect-continuous'],
      ctx: 'Podajesz liczbę — ile rozdziałów.',
      q: 'I ___ three chapters today.',
      options: ['have been reading', 'have read'], answer: 1,
      why: 'Ilość / rezultat → Present Perfect Simple. Continuous podkreślałby sam proces, nie liczbę.'
    },
    {
      id: 'ppc-05', type: 'error', tags: ['present-perfect-continuous'],
      ctx: 'Sprawdź formę czasownika głównego.',
      sentence: 'I have been study English for years.', wrongIndex: 3, fix: 'studying',
      why: 'Po „have been” idzie forma -ing.'
    },
    {
      id: 'ppc-06', type: 'error', tags: ['present-perfect-continuous'],
      ctx: 'To samo — forma po „been”.',
      sentence: 'She has been work here since May.', wrongIndex: 3, fix: 'working',
      why: 'have/has + been + -ing.'
    },
    {
      id: 'ppc-07', type: 'error', tags: ['present-perfect-continuous'],
      ctx: 'Czegoś brakuje w konstrukcji.',
      sentence: 'I have waiting for the bus.', wrongIndex: 2, fix: 'been waiting',
      why: 'Brakuje „been”. Kolejność: have + been + -ing.'
    },
    {
      id: 'ppc-08', type: 'choice', tags: ['present-perfect-continuous'],
      ctx: 'Padasz z nóg, bo długo coś robiłeś.',
      q: 'I’m exhausted. I ___ the house all day.',
      options: ['have been cleaning', 'clean', 'am cleaning'], answer: 0,
      why: 'Długa czynność do teraz + widoczne zmęczenie → Present Perfect Continuous.'
    },
    {
      id: 'ppc-09', type: 'order', tags: ['present-perfect-continuous'],
      ctx: 'Ułóż pytanie o czas trwania.',
      answer: 'How long have you been waiting here',
      why: '„How long” + have/has + podmiot + been + -ing. „How long have you been waiting?”'
    },
    {
      id: 'ppc-10', type: 'transform', tags: ['present-perfect-continuous'],
      base: 'I have been working all day.', instruction: 'Zamień na przeczenie.',
      answers: ["I haven't been working all day.", 'I have not been working all day.'],
      why: 'haven’t + been + -ing.'
    },
    {
      id: 'ppc-11', type: 'cloze', tags: ['present-perfect-continuous'],
      ctx: 'Skutek widać teraz — mokre ulice.',
      text: 'It ___ all afternoon, so the roads ___ wet.',
      blanks: [
        { answers: ["'s been raining", 'has been raining', 's been raining'], hint: '(rain)' },
        { answers: ['are'], hint: '(be)' }
      ],
      why: 'Proces do teraz ze świeżym skutkiem → Present Perfect Continuous. Skutek opisujemy w Present Simple.'
    },
    {
      id: 'ppc-12', type: 'listen', tags: ['present-perfect-continuous'], mode: 'type',
      sentence: 'She’s been working here since May.',
      why: '„since May” + trwa do teraz → have/has been + -ing.'
    },
    {
      id: 'ppc-13', type: 'error', tags: ['present-perfect-continuous'],
      ctx: '„od” + liczba lat — dobierz przyimek.',
      sentence: 'She has been studying English since three years.', wrongIndex: 5, fix: 'for',
      why: 'for + długość (for three years), since + punkt startu (since 2021).'
    },
    {
      id: 'ppc-14', type: 'choice', tags: ['present-perfect-continuous'],
      ctx: 'Pytasz o długość, nie o wynik.',
      q: 'How long ___ English?',
      options: ['have you learnt', 'have you been learning'], answer: 1,
      why: '„How long” z czasownikiem czynnościowym → domyślnie Present Perfect Continuous.'
    },
    {
      id: 'ppc-15', type: 'contrast', tags: ['present-perfect-continuous'],
      a: { sentence: 'I’ve been painting the kitchen.', meaning: 'O samej czynności — być może niedokończonej. Stąd bałagan i zapach farby.' },
      b: { sentence: 'I’ve painted the kitchen.', meaning: 'Skończone. Kuchnia jest pomalowana — jest wynik.' },
      labels: ['Perfect Continuous', 'Perfect Simple'],
      note: 'Continuous = proces, Simple = rezultat.'
    },

    /* ===================== MIESZANE (porównanie + test) ===================== */
    {
      id: 'mix-01', type: 'choice', tags: ['mixed'],
      ctx: 'Codzienny sposób dojazdu.',
      q: 'She ___ to work by bike every day.',
      options: ['goes', 'is going', 'has gone'], answer: 0,
      why: 'Rutyna, „every day” → Present Simple.'
    },
    {
      id: 'mix-02', type: 'choice', tags: ['mixed'],
      ctx: 'Widzisz to przez okno w tej chwili.',
      q: 'Look — she ___ down the street!',
      options: ['runs', 'is running'], answer: 1,
      why: 'Czynność w tej chwili → Present Continuous.'
    },
    {
      id: 'mix-03', type: 'choice', tags: ['mixed'],
      ctx: 'Zatrudniony od 2018, nadal.',
      q: 'He ___ for this company since 2018.',
      options: ['works', 'has worked'], answer: 1,
      why: '„since 2018” + trwa do teraz → Present Perfect. „He works … since 2018” to błąd.'
    },
    {
      id: 'mix-04', type: 'choice', tags: ['mixed'],
      ctx: '„yesterday” — zamknięty czas przeszły.',
      q: 'I ___ a great film yesterday.',
      options: ['have seen', 'saw'], answer: 1,
      why: 'Określony moment w przeszłości → Past Simple, nie Present Perfect.'
    },
    {
      id: 'mix-05', type: 'choice', tags: ['mixed'],
      ctx: 'Jesteś zmęczony po długiej czynności przez cały tydzień.',
      q: 'I’m tired because I ___ hard all week.',
      options: ['have worked', 'have been working'], answer: 1,
      why: 'Nacisk na proces i długość + świeży skutek → Present Perfect Continuous.'
    },
    {
      id: 'mix-06', type: 'choice', tags: ['mixed'],
      ctx: 'Podajesz liczbę zrobionych rzeczy.',
      q: 'I ___ five emails this morning.',
      options: ['have been writing', 'have written'], answer: 1,
      why: 'Ilość / rezultat → Present Perfect Simple.'
    },
    {
      id: 'mix-07', type: 'error', tags: ['mixed'],
      ctx: 'Trzecia osoba, przeczenie.',
      sentence: 'She don’t like tea.', wrongIndex: 1, fix: 'doesn’t',
      why: 'he / she / it → doesn’t.'
    },
    {
      id: 'mix-08', type: 'error', tags: ['mixed'],
      ctx: 'Forma czasownika po „have”.',
      sentence: 'I have went to the shops.', wrongIndex: 2, fix: 'gone',
      why: 'Po have/has idzie trzecia forma: go → gone.'
    },
    {
      id: 'mix-09', type: 'error', tags: ['mixed'],
      ctx: 'Czasownik be w liczbie mnogiej.',
      sentence: 'They is watching TV.', wrongIndex: 1, fix: 'are',
      why: 'they → are.'
    },
    {
      id: 'mix-10', type: 'error', tags: ['mixed'],
      ctx: 'Nie każde zdanie ma błąd — zaznacz, jeśli jest poprawne.',
      sentence: 'She has lived in Rome since 2015.', wrongIndex: -1,
      why: 'Poprawne: Present Perfect z „since” dla stanu, który zaczął się w przeszłości i trwa do teraz.'
    },
    {
      id: 'mix-11', type: 'order', tags: ['mixed'],
      ctx: 'Ułóż pytanie zależne — uważaj na szyk po „know”.',
      answer: 'I don’t know where the station is',
      alt: ['I do not know where the station is'],
      why: 'Po „I don’t know…” pytanie ma szyk zdania oznajmującego: „…where the station is”, nie „…where is the station”.'
    },
    {
      id: 'mix-12', type: 'transform', tags: ['mixed'],
      base: 'He has seen this film.', instruction: 'Zamień na pytanie.',
      answers: ['Has he seen this film?'],
      why: 'Has + podmiot + trzecia forma.'
    },
    {
      id: 'mix-13', type: 'listen', tags: ['mixed'], mode: 'choice',
      sentence: 'She has been living here for years.',
      options: ['She has been living here for years.', 'She has lived here for years.', 'She is living here for years.'],
      answer: 0,
      why: '„for years” + trwa do teraz; z „live” obie formy Perfect są OK, ale „is living … for years” to błąd.'
    },
    {
      id: 'mix-14', type: 'cloze', tags: ['mixed'],
      ctx: 'Ktoś opisuje ostatni okres w swoim życiu.',
      text: 'These days I ___ up early because I ___ for a marathon. I ___ this training plan for three weeks now.',
      blanks: [
        { answers: ['get'], hint: '(get)' },
        { answers: ["'m training", 'am training', 'm training'], hint: '(train)' },
        { answers: ["'ve been following", 'have been following', 've been following'], hint: '(follow)' }
      ],
      why: 'Nawyk w tym okresie → Present Simple; tymczasowy cel → Present Continuous; „for three weeks now” + trwa → Present Perfect Continuous.'
    },
    {
      id: 'mix-15', type: 'gap', tags: ['mixed'],
      ctx: 'Nawyk twojego ojca — przeczenie.',
      q: 'My father ___ coffee.', hint: '(not / drink)',
      answers: ['doesn’t drink', 'does not drink'],
      why: 'Rutyna, trzecia osoba, przeczenie → doesn’t + bezokolicznik.'
    },
    {
      id: 'mix-16', type: 'choice', tags: ['mixed'],
      ctx: 'Zawartość pudełka — stan.',
      q: 'This box ___ old photos.',
      options: ['is containing', 'contains'], answer: 1,
      why: '„contain” to czasownik stanowy — nigdy w formie -ing.'
    },
    {
      id: 'mix-17', type: 'error', tags: ['mixed'],
      ctx: 'Forma imiesłowu po „has”.',
      sentence: 'He has never drove a truck.', wrongIndex: 3, fix: 'driven',
      why: 'drive → drove → driven. Po „has” trzecia forma.'
    },
    {
      id: 'mix-18', type: 'error', tags: ['mixed'],
      ctx: 'Forma czasownika w pytaniu Present Perfect.',
      sentence: 'Have you finish your homework?', wrongIndex: 2, fix: 'finished',
      why: 'Have + you + trzecia forma. „Have you finished…?”'
    },
    {
      id: 'mix-19', type: 'error', tags: ['mixed'],
      ctx: 'Pytanie w trzeciej osobie.',
      sentence: 'Does your brother lives with you?', wrongIndex: 3, fix: 'live',
      why: 'Po „Does” czasownik główny wraca do bezokolicznika bez -s.'
    },
    {
      id: 'mix-20', type: 'choice', tags: ['mixed'],
      ctx: '„in 2019” — podany zamknięty rok.',
      q: 'They ___ their house in 2019.',
      options: ['have bought', 'bought'], answer: 1,
      why: 'Określony moment w przeszłości → Past Simple.'
    }

  ]);
})();
