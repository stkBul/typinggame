# Typing Game — Lesson Improvement Plan

## Context

This is a Danish 10-finger touch-typing trainer built with React + TypeScript + Vite.
The curriculum is in `src/lessons/curriculum.ts` (31 lessons, 6 levels).

Run tests with: `npm test` (Vitest).
The critical test is in `src/lessons/curriculum.test.ts` — it enforces that every drill character has been introduced in the current or an earlier lesson.

---

## Phase 1 — More Drills Per Lesson (curriculum.ts only)

**Goal:** Add bridge drills, expand short drill texts, add extra drills to consolidation lessons.

### 1a. Bridge drills (add to every non-first lesson)

A bridge drill is the **first drill** in a lesson. It warms up the previous lesson's new characters before the learner encounters the current lesson's new characters. Drill ID pattern: `{lessonId}-bridge-1`.

The bridge drill must only use characters from the **previous** lesson's allowed set (all lessons up to and including lesson `N-1`).

### 1b. Expand drill texts

All drill texts should be at least **55 characters long** (including spaces). Extend by repeating patterns or adding more words/chars using only the allowed character set.

### 1c. Expand consolidation lessons

Consolidation lessons (IDs 6, 13, 19, 22, 26, 31) currently have 2–3 drills. Expand to **4–5 drills** by adding more word and sentence drills using only already-allowed characters.

---

## Character availability per lesson

This is the cumulative allowed set at each lesson. Bridge drills must only use chars from the row **above** the lesson they're in.

| Lesson | New chars introduced | Full allowed set (+ space always) |
|--------|---------------------|-----------------------------------|
| 1 | f, j | f j |
| 2 | d, k | f j d k |
| 3 | s, l | f j d k s l |
| 4 | a, æ | f j d k s l a æ |
| 5 | g, h | f j d k s l a æ g h |
| 6 | _(consolidation)_ | f j d k s l a æ g h |
| 7 | e, i | + e i |
| 8 | r, u | + r u |
| 9 | t, y | + t y |
| 10 | o, w | + o w |
| 11 | q, p | + q p |
| 12 | å, ø | + å ø |
| 13 | _(consolidation)_ | all above |
| 14 | n, m | + n m |
| 15 | v, b | + v b |
| 16 | c, , | + c , |
| 17 | x, . | + x . |
| 18 | z, - | + z - |
| 19 | _(consolidation)_ | all above (full lowercase alphabet + , . -) |
| 20 | Q W E R T A S D F G Z X C V B | + left-hand capitals |
| 21 | Y U I O P Å H J K L Æ Ø N M | + right-hand capitals |
| 22 | _(consolidation)_ | all letters + capitals + , . - |
| 23 | 4 5 6 7 | + 4 5 6 7 |
| 24 | 3 8 2 9 | + 3 8 2 9 |
| 25 | 1 0 + | + 1 0 + |
| 26 | _(consolidation)_ | all letters + capitals + numbers + , . - |
| 27 | : ; _ ' * | + : ; _ ' * |
| 28 | ! ? | + ! ? |
| 29 | ( ) / = " | + ( ) / = " |
| 30 | # ¤ % & ½ § < > | + # ¤ % & ½ § < > |
| 31 | _(consolidation)_ | everything |

**Danish keyboard layout notes** (important for special chars):

| Character | Key | Shift? |
|-----------|-----|--------|
| `;` | Comma key | Yes (Shift+,) |
| `:` | Period key | Yes (Shift+.) |
| `_` | Slash/hyphen key | Yes (Shift+-) |
| `'` | Backslash key | No |
| `*` | Backslash key | Yes |
| `(` | Digit8 | Yes |
| `)` | Digit9 | Yes |
| `=` | Digit0 | Yes |
| `"` | Digit2 | Yes |
| `?` | Minus/plus key | Yes (Shift++) |
| `!` | Digit1 | Yes |
| `#` | Digit3 | Yes |
| `¤` | Digit4 | Yes |
| `%` | Digit5 | Yes |
| `&` | Digit6 | Yes |
| `/` | Digit7 | Yes |
| `<` | IntlBackslash | No |
| `>` | IntlBackslash | Yes |
| `½` | Backquote | No |
| `§` | Backquote | Yes |
| `+` | Minus key | No |
| `-` | Slash key | No |

**Never use `@` — it is not in the Danish QWERTY layout defined in `src/keyboard/layout.ts`.**

---

## Full target curriculum (all 31 lessons)

Each lesson shows: bridge drill (if any), existing drills (expanded), new drills (for consolidation lessons).
Keep all existing drill IDs unchanged. New drills get new IDs.

### Lesson 1 — f og j
No bridge (first lesson). Expand texts to 55+ chars.

```
drills: [
  { id: '1-keys-1', kind: 'keys', text: 'fff jjj fjf jfj ffj jjf fj jf fjfj jfjf fff jjj fjfjfj jfjfjf' },
  { id: '1-keys-2', kind: 'keys', text: 'jf fj jjf ffj fjfj jfjf fj jf jjj fff fjfj jfjf ffj jjf fjfj' },
]
```

### Lesson 2 — d og k
Bridge re-practices f, j.

```
drills: [
  { id: '2-bridge-1', kind: 'keys', text: 'fj jf ff jj fjf jfj fjfj jfjf fff jjj jf ff jj fj fjfj jfjf' },
  { id: '2-keys-1', kind: 'keys', text: 'ddd kkk dkd kdk fdk jkd dk kd fdd jkk ddk kkf djk kdf fdk jkd' },
  { id: '2-keys-2', kind: 'keys', text: 'fjdk jkdf kdjf djkf dk kd fj jk fjdk kdfj djfk dkfj jkfd fdjk' },
]
```

### Lesson 3 — s og l
Bridge re-practices d, k.

```
drills: [
  { id: '3-bridge-1', kind: 'keys', text: 'fjdk kdjf dkfj jkfd fjdk kdfj dkfj dk kd fj jk fjdk fjdk kdjf' },
  { id: '3-keys-1', kind: 'keys', text: 'sss lll sls lsl fls jsl sl ls sss lll sld lks fjsl sldk lsdk sl' },
  { id: '3-keys-2', kind: 'keys', text: 'fjdksl lskdjf sldk fjsl sl ls fjdksl lskdj sldkfj jfkdls sl ls' },
]
```

### Lesson 4 — a og æ
Bridge re-practices s, l.

```
drills: [
  { id: '4-bridge-1', kind: 'keys', text: 'sl ls sls lsl fjsl sldk fjdksl lskdjf sld kls fls jsl sl ls sl' },
  { id: '4-keys-1', kind: 'keys', text: 'aaa æææ aæa æaæ asdf jklæ asdf jklæ aaa æ a æ aæ æa aslf fjæ' },
  { id: '4-words-1', kind: 'words', text: 'fald skal dal kald sæl læs fad sal ask gas lak sald dal fals' },
]
```

### Lesson 5 — g og h
Bridge re-practices a, æ (no g/h in bridge).

```
drills: [
  { id: '5-bridge-1', kind: 'words', text: 'fald skal dal kald sæl læs fad sal ask lak sald dal fals flask' },
  { id: '5-keys-1', kind: 'keys', text: 'ggg hhh ghg hgh fgh hjg asdfg hjklæ ggg hhh ghfj hjdg fgh hjg' },
  { id: '5-words-1', kind: 'words', text: 'dag lag slag flag hals glas gas hæl glad hald gals dag slag flag' },
]
```

### Lesson 6 — Hjemmerækken (consolidation)
No bridge. Expand from 2 to 4 drills. Only chars: f j d k s l a æ g h.

```
drills: [
  { id: '6-words-1', kind: 'words', text: 'skal fald dag glas hals flag sæl læs glad gas ask lak flask dal' },
  { id: '6-words-2', kind: 'words', text: 'ask gas lak dal sal hæl salg flask glad flag dal gals hals dag' },
  { id: '6-words-3', kind: 'words', text: 'slag fald glas flag hal sad lad dag gas hæl læs sæl ask flask' },
  { id: '6-words-4', kind: 'words', text: 'glad hald dags gal slag fals ask lad sad glas hal sæl flag dal' },
]
```

### Lesson 7 — e og i
Bridge re-practices home row words (no e/i in bridge).

```
drills: [
  { id: '7-bridge-1', kind: 'words', text: 'dag slag hals gas glad flag sæl læs fald glas ask lak hæl dal' },
  { id: '7-keys-1', kind: 'keys', text: 'eee iii eie iei die fie kei lei eee iii ied gie hei fie die iei' },
  { id: '7-words-1', kind: 'words', text: 'jeg hej leg del fed side ide ged dig sig lie hej del fed side' },
]
```

### Lesson 8 — r og u
Bridge re-practices e, i words.

```
drills: [
  { id: '8-bridge-1', kind: 'words', text: 'jeg hej leg del fed side ide ged dig sig lie hej del fed side' },
  { id: '8-keys-1', kind: 'keys', text: 'rrr uuu rur uru fru jur dru kur rrr uuu ruf jud dru lur sru ur' },
  { id: '8-words-1', kind: 'words', text: 'rude sur kur rar gul rul frue ur urer sur kur rude frue gul' },
  { id: '8-sentence-1', kind: 'sentence', text: 'jeg er glad du er sej jeg ser dig her i dag' },
]
```

### Lesson 9 — t og y
Bridge re-practices r, u words.

```
drills: [
  { id: '9-bridge-1', kind: 'words', text: 'rude sur kur gul rul frue ur urer rude sur kur gul rul frue' },
  { id: '9-keys-1', kind: 'keys', text: 'ttt yyy tyt yty fty jyt rty uyt ttt yyy tft jyj rty uyt tyr ty' },
  { id: '9-words-1', kind: 'words', text: 'tyr ret let tre fryd dyr lyd syd hyl flyt tryl dyrt tyre lyde' },
  { id: '9-sentence-1', kind: 'sentence', text: 'jeg er glad du er tryg og du er fri i dag' },
]
```

### Lesson 10 — o og w
Bridge re-practices t, y words.

```
drills: [
  { id: '10-bridge-1', kind: 'words', text: 'tyr ret let tre fryd dyr lyd syd hyl flyt tyre dyrt tryl lyde' },
  { id: '10-keys-1', kind: 'keys', text: 'ooo www owo wow tow rod sok fok ooo www ord sol kold tok sol ow' },
  { id: '10-words-1', kind: 'words', text: 'ord sol stol kold told fjord ros god ko lo rod fold sod tolk' },
  { id: '10-sentence-1', kind: 'sentence', text: 'du er god og jeg er glad for det her i dag' },
]
```

### Lesson 11 — q og p
Bridge re-practices o, w words.

```
drills: [
  { id: '11-bridge-1', kind: 'words', text: 'ord sol stol kold told fjord ros god ko lo rod fold sod tolk' },
  { id: '11-keys-1', kind: 'keys', text: 'qqq ppp qpq pqp pad par qua que qqq ppp spa pil pud pot kop pq' },
  { id: '11-words-1', kind: 'words', text: 'pil pose post pas pris pude kop top spar april pol put pris top' },
  { id: '11-sentence-1', kind: 'sentence', text: 'peter har et stort kort og et godt hus her' },
]
```

### Lesson 12 — å og ø
Bridge re-practices q, p words.

```
drills: [
  { id: '12-bridge-1', kind: 'words', text: 'pil pose post pas pris pude kop top spar april pol put kop top' },
  { id: '12-keys-1', kind: 'keys', text: 'ååå øøø åøå øåø går får øre øst ååå øøø rå få gå på stå rød øl' },
  { id: '12-words-1', kind: 'words', text: 'på så går står får øl sø rød sød løs åle øre råd åbne grøft' },
  { id: '12-sentence-1', kind: 'sentence', text: 'du går først og jeg går sidst og det er godt' },
]
```

### Lesson 13 — Øverste række (consolidation)
No bridge. Expand from 3 to 5 drills. No n, m, v, b, c, x, z (not introduced yet).

```
drills: [
  { id: '13-words-1', kind: 'words', text: 'fjord skør gæld høj tør lås pløj støj fløde stærk rød sød grøft' },
  { id: '13-words-2', kind: 'words', text: 'pris sport syd folk stol glad rød sød spørg tro løs gør går' },
  { id: '13-sentence-1', kind: 'sentence', text: 'jeg er glad og du er sød og vi går tur i dag' },
  { id: '13-sentence-2', kind: 'sentence', text: 'håret står lige op og øjet ser godt' },
  { id: '13-sentence-3', kind: 'sentence', text: 'per går til sport og pia tager det roligt' },
]
```

### Lesson 14 — n og m
Bridge re-practices top-row content (no n/m in bridge).

```
drills: [
  { id: '14-bridge-1', kind: 'sentence', text: 'jeg er glad og du er sød og det er godt at lære at skøjte her' },
  { id: '14-keys-1', kind: 'keys', text: 'nnn mmm nmn mnm fan man min mon nnn mmm nan mun fon jmn min mon' },
  { id: '14-words-1', kind: 'words', text: 'man men min mor mod nu nem mand måne morgen nul mund mene min' },
  { id: '14-sentence-1', kind: 'sentence', text: 'min mor er en god mand og hun er nem at tale med' },
]
```

### Lesson 15 — v og b
Bridge re-practices n, m words (no v/b in bridge).

```
drills: [
  { id: '15-bridge-1', kind: 'words', text: 'man men min mor mod nu nem mand måne morgen nul mund mene min' },
  { id: '15-keys-1', kind: 'keys', text: 'vvv bbb vbv bvb van bil bog ven vvv bbb vib brev ven vand bog vb' },
  { id: '15-words-1', kind: 'words', text: 'ven bil bog bo brev vand over leve liv være ved bur bæk bryd' },
  { id: '15-sentence-1', kind: 'sentence', text: 'vi bor ved en god vej og vi er gode venner her' },
]
```

### Lesson 16 — c og komma
Bridge re-practices v, b words.

```
drills: [
  { id: '16-bridge-1', kind: 'words', text: 'ven bil bog bo brev vand over leve liv være ved bur bæk bryd' },
  { id: '16-keys-1', kind: 'keys', text: 'ccc ,,, c,c ,c, ca, co, ce, ci, ccc ,,, cel, vc, bc, ca, co, ce,' },
  { id: '16-words-1', kind: 'words', text: 'cykel cirka cafe cola disco celle cirkus celle, disco, cafe, cykel,' },
  { id: '16-sentence-1', kind: 'sentence', text: 'jeg er glad, og du er sød, og vi er gode venner her' },
]
```

### Lesson 17 — x og punktum
Bridge re-practices c, comma content.

```
drills: [
  { id: '17-bridge-1', kind: 'sentence', text: 'jeg er glad, og du er sød, og vi er gode venner her i dag' },
  { id: '17-keys-1', kind: 'keys', text: 'xxx ... x.x .x. ax. ox. ex. ix. xxx ... sex. box. vax. ox. x.x.' },
  { id: '17-words-1', kind: 'words', text: 'taxa sax max boks xylofon hexe max. taxa. sax. boks. hex. max.' },
  { id: '17-sentence-1', kind: 'sentence', text: 'vi tog en taxa hjem. det var godt. vi er glade.' },
]
```

### Lesson 18 — z og bindestreg
Bridge re-practices x, period content.

```
drills: [
  { id: '18-bridge-1', kind: 'sentence', text: 'vi tog en taxa hjem. max boks sax hex. det var godt at leve.' },
  { id: '18-keys-1', kind: 'keys', text: 'zzz --- z-z -z- za- zo- ze- zi- zzz --- zen- zig-zag zo- zz-zz' },
  { id: '18-words-1', kind: 'words', text: 'zebra zone pizza jazz zoo zigzag zebra-zone jazz-bar zap zigzag' },
  { id: '18-sentence-1', kind: 'sentence', text: 'vi spiste pizza i går - det var godt. jazz er den bedste musik.' },
]
```

### Lesson 19 — Hele alfabetet (consolidation)
No bridge. Expand from 3 to 5 drills. All lowercase + , . - available.

```
drills: [
  { id: '19-words-1', kind: 'words', text: 'hjælp dejlig kærlig brød smuk fjern lykke voksen zebra xylofon' },
  {
    id: '19-sentence-1',
    kind: 'sentence',
    text: 'quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen walther spillede på xylofon.',
  },
  { id: '19-sentence-2', kind: 'sentence', text: 'han bor i en stor by, men hun bor på landet ved en smuk skov.' },
  { id: '19-sentence-3', kind: 'sentence', text: 'den gode ven tog en taxa hjem - det var en dejlig og varm dag.' },
  { id: '19-sentence-4', kind: 'sentence', text: 'vi spiste brød, drak juice og gik en lang tur i den smukke park.' },
]
```

### Lesson 20 — Versaler venstre hånd
Bridge uses lesson 19 content (no capitals in bridge).

```
drills: [
  { id: '20-bridge-1', kind: 'sentence', text: 'vi spiste pizza i går - det var godt. jazz er dejlig musik.' },
  { id: '20-keys-1', kind: 'keys', text: 'Aa Ss Dd Ff Gg Qq Ww Ee Rr Tt Zz Xx Cc Vv Bb Aa Ss Dd Ff Gg' },
  { id: '20-words-1', kind: 'words', text: 'Anna Bo Carl David Erik Frank Gert Sara Tina Vera Bo Anna Carl' },
  { id: '20-words-2', kind: 'words', text: 'Zara Xenia Walther Quist Rune Vera Sara Tina Frank Gert Bo' },
]
```

### Lesson 21 — Versaler højre hånd
Bridge re-practices left-hand capitals.

```
drills: [
  { id: '21-bridge-1', kind: 'words', text: 'Anna Bo Carl David Erik Frank Sara Tina Vera Zara Xenia Rune' },
  { id: '21-keys-1', kind: 'keys', text: 'Hh Jj Kk Ll Yy Uu Ii Oo Pp Nn Mm Åå Øø Ææ Hh Jj Kk Ll Yy Uu' },
  { id: '21-words-1', kind: 'words', text: 'Hans Ida Jens Kira Lars Mette Niels Ole Pia Ulla Hans Ida Lars' },
  { id: '21-words-2', kind: 'words', text: 'Åse Ørsted Ærø Møn Yrsa Åse Ørsted Yrsa Møn Ærø Niels Ole' },
]
```

### Lesson 22 — Versaler i sætninger (consolidation)
Bridge warms up single capital words. Expand from 3 to 4 drills.

```
drills: [
  { id: '22-bridge-1', kind: 'words', text: 'Hans Ida Anna Bo Carl Lars Mette Niels Ole Pia Ulla Åse Yrsa' },
  { id: '22-sentence-1', kind: 'sentence', text: 'Jeg hedder Anna og jeg bor i Aarhus med min familie.' },
  { id: '22-sentence-2', kind: 'sentence', text: 'Min ven Erik spiller fodbold hver dag efter skole.' },
  { id: '22-sentence-3', kind: 'sentence', text: 'København er en stor by i Danmark med mange gode caféer.' },
  { id: '22-sentence-4', kind: 'sentence', text: 'Lars og Mette bor på Møn, men Niels bor i Aarhus.' },
]
```

Wait — `café` uses `é` which is NOT in the layout. Replace with:
`{ id: '22-sentence-3', kind: 'sentence', text: 'København er en stor by i Danmark med mange gode steder.' }`

### Lesson 23 — Tallene 4 5 6 7
Bridge uses lesson 22 content (no numbers in bridge).

```
drills: [
  { id: '23-bridge-1', kind: 'sentence', text: 'Jeg hedder Lars og bor i Aarhus med min gode ven Niels.' },
  { id: '23-keys-1', kind: 'keys', text: '444 555 666 777 456 567 4567 7654 444 555 456 567 4556 7765 456' },
  { id: '23-keys-2', kind: 'keys', text: 'ff44 jj77 dd55 kk66 f4j7 d5k6 ff4 jj7 dd5 kk6 4567 7654 f4j7' },
  { id: '23-sentence-1', kind: 'sentence', text: 'Klokken er 5 og vi er 6 og der er 7 stole.' },
]
```

### Lesson 24 — Tallene 3 8 2 9
Bridge re-practices 4 5 6 7.

```
drills: [
  { id: '24-bridge-1', kind: 'keys', text: '444 555 666 777 456 567 4567 7654 ff44 jj77 f4j7 d5k6 4567' },
  { id: '24-keys-1', kind: 'keys', text: '333 888 222 999 38 83 29 92 2389 333 888 23 89 38 92 2389 9283' },
  { id: '24-keys-2', kind: 'keys', text: 'dd33 kk88 ss22 ll99 d3k8 s2l9 dd3 kk8 ss2 ll9 3829 9283 d3k8' },
  { id: '24-sentence-1', kind: 'sentence', text: 'Vi er 8 i klassen og 2 er syge, men 3 er friske.' },
]
```

### Lesson 25 — Tallene 1 0 og +
Bridge re-practices 3 8 2 9.

```
drills: [
  { id: '25-bridge-1', kind: 'keys', text: '333 888 222 999 38 83 29 92 2389 9283 dd33 kk88 3829 9283' },
  { id: '25-keys-1', kind: 'keys', text: '111 000 +++ 10 01 100 010 1+0 0+1 111 000 10+1 0+10 100+0 1+0' },
  { id: '25-keys-2', kind: 'keys', text: 'aa11 1+1 0+0 100 1010 10+10 aa1 1+0 0+1 100 1010 10+1 100 0+1' },
  { id: '25-sentence-1', kind: 'sentence', text: 'Jeg har 10 fingre og 10 tæer.' },
  { id: '25-sentence-2', kind: 'sentence', text: '1 + 1 er 2 og 2 + 2 er 4 og 5 + 5 er 10.' },
]
```

### Lesson 26 — Tal i tekst (consolidation)
No bridge. Expand from 3 to 4 drills.

```
drills: [
  { id: '26-keys-1', kind: 'keys', text: '10 20 30 40 50 60 70 80 90 100 200 300 400 500 1000 2000 3000' },
  { id: '26-sentence-1', kind: 'sentence', text: 'Der er 365 dage i et år og 52 uger.' },
  { id: '26-sentence-2', kind: 'sentence', text: 'Vi mødtes klokken 8 og spiste klokken 9 og gik hjem klokken 10.' },
  { id: '26-sentence-3', kind: 'sentence', text: 'Der var 24 elever i klassen og 3 var syge i dag.' },
]
```

### Lesson 27 — Kolon, semikolon og co.
Bridge uses lesson 26 content (no : ; _ ' * in bridge).

```
drills: [
  { id: '27-bridge-1', kind: 'sentence', text: 'Vi mødtes klokken 8 og spiste klokken 9. Der var 24 elever.' },
  { id: '27-keys-1', kind: 'keys', text: "a: o; e_ i* u: :; _* :: ;; ** a:b o;p e_r i*t u:y :;_* ::;;" },
  { id: '27-keys-2', kind: 'keys', text: "fil_navn 3*4 det' her' klokken_5 fil_2 abc_def 5*6 it's" },
  { id: '27-sentence-1', kind: 'sentence', text: 'Klokken er 12:30; vi ses igen.' },
  { id: '27-sentence-2', kind: 'sentence', text: 'Jeg kom; du gik: vi mødtes bagefter.' },
]
```

### Lesson 28 — Udråb og spørgsmål
Bridge re-practices : ; _ ' *.

```
drills: [
  { id: '28-bridge-1', kind: 'sentence', text: "Klokken er 12:30; vi ses. fil_navn 3*4 det' her klokken_5." },
  { id: '28-keys-1', kind: 'keys', text: 'ja! nej! hvad? hvor? !! ?? !? ?! ja! nej! hvad? hvor? ja! !?' },
  { id: '28-sentence-1', kind: 'sentence', text: 'Hej! Hvordan går det? Jeg er glad!' },
  { id: '28-sentence-2', kind: 'sentence', text: 'Er du klar? Ja, jeg er klar! Vi starter nu!' },
]
```

### Lesson 29 — Parenteser og citationstegn
Bridge re-practices ! ?.

```
drills: [
  { id: '29-bridge-1', kind: 'sentence', text: 'Hej! Hvordan går det? Er du klar? Ja, jeg er klar!' },
  { id: '29-keys-1', kind: 'keys', text: '(a) (b) 7/8 2=2 "ja" () // == "" (x) (y) 9/10 3=3 "nej" ()' },
  { id: '29-sentence-1', kind: 'sentence', text: '2 + 2 = 4 (det er let) og 3 + 3 = 6.' },
  { id: '29-sentence-2', kind: 'sentence', text: 'Hun sagde "hej" og smilede til os alle.' },
]
```

### Lesson 30 — De sidste tegn
Bridge re-practices ( ) / = ".

```
drills: [
  { id: '30-bridge-1', kind: 'sentence', text: '2 + 2 = 4 (let). Hun sagde "hej" og smilede. 7/8 er godt!' },
  { id: '30-keys-1', kind: 'keys', text: '## ¤¤ %% && ½½ §§ << >> #5 50% a&b 5<6 6>5 §2 ½ liter #10 ¤¤' },
  { id: '30-sentence-1', kind: 'sentence', text: 'Tilbud: 50% i dag & i morgen!' },
  { id: '30-sentence-2', kind: 'sentence', text: 'Se § 4, køb ½ liter til værelse #2 for 99 ¤.' },
]
```

### Lesson 31 — Hele tastaturet (consolidation)
No bridge. Expand from 3 to 4 drills. All chars available.

```
drills: [
  {
    id: '31-sentence-1',
    kind: 'sentence',
    text: 'Quizdeltagerne spiste jordbær med fløde, mens cirkusklovnen Walther spillede på xylofon!',
  },
  { id: '31-sentence-2', kind: 'sentence', text: 'Bestil 3 pizzaer (50% rabat) inden kl. 18:30!' },
  { id: '31-sentence-3', kind: 'sentence', text: 'Pris: 199 kr. = 2 stk. & gratis fragt!' },
  { id: '31-sentence-4', kind: 'sentence', text: 'Ring #42 hvis 5 < 6 & 9 > 3, men tjek § 5 (½ side) til 99 ¤.' },
]
```

---

## How to verify

After editing `src/lessons/curriculum.ts`, run:

```
npm test
```

All three curriculum tests must pass:
1. **Unique IDs** — every lesson ID and drill ID must be unique.
2. **Typeable characters** — every character in every drill must exist in the Danish QWERTY layout (`findKey` must not return null).
3. **Character constraint** — a drill may only use characters introduced in the current or an earlier lesson.

---

## Phase 2 — Per-Character Error Tracking

**Files:** `src/engine/stats.ts`, `src/engine/reducer.ts`, `src/components/LessonRunner.tsx`

### stats.ts
Add `charErrors: Record<string, number>` to `TypingStats`. Populate it in `computeStats` by iterating keystrokes where `correct === false` and incrementing `charErrors[keystroke.expected]`. Update `aggregateStats` to merge the `charErrors` maps across drills.

### LessonRunner.tsx
After all drills are done, if the lesson was **not passed**, read the top-3 most-errored characters from the aggregated stats. On retry (`restart()`), prepend a generated `keys`-kind drill containing those characters repeated (e.g. `'fff fff fdf dff'` if `f` and `d` were the worst). Insert it at index 0 of the drills array for that retry only (do not persist it).

---

## Phase 3 — Add `passage` Drill Kind

**Files:** `src/lessons/types.ts`, `src/lessons/curriculum.ts`, `src/components/LessonRunner.tsx`

### types.ts
Add `'passage'` to the `DrillKind` union. A passage is 3–5 connected sentences, 150–200 chars, displayed identically to a sentence drill but longer.

### curriculum.ts
Add one `passage` drill to lessons 10–31. Use only chars available at that lesson. Examples:
- Lesson 10: `'det er en god dag. sol og lys er godt for folk. du er god til at styre dit liv og finde ro.'`
- Lesson 19: a 3-sentence passage using the full lowercase alphabet.

### LessonRunner.tsx
Add `'Tekst'` to the `DRILL_KIND_LABEL` map for `passage`. Render identically to `sentence`.

---

## Phase 4 — Rhythm/Consistency Score

**Files:** `src/engine/stats.ts`, `src/components/LessonRunner.tsx`

### stats.ts
Add `rhythmScore: number` (0–1) to `TypingStats`. Compute it as:
1. From `keystrokes`, extract inter-keystroke intervals: `intervals = keystrokes.slice(1).map((k, i) => k.time - keystrokes[i].time)`.
2. Filter out intervals > 2000ms (pauses) and intervals where index 0 (first key).
3. Compute coefficient of variation: `stdDev(intervals) / mean(intervals)`. Lower = more consistent.
4. Convert to a 0–1 score: `rhythmScore = Math.max(0, 1 - cv)`. Clamp to [0, 1].
5. In `aggregateStats`, average the `rhythmScore` across parts weighted by drill length.

### LessonRunner.tsx
In `LessonSummary`, add a third `SummaryStat` showing "Rytme" as 1–3 stars:
- 3 stars: rhythmScore ≥ 0.75
- 2 stars: rhythmScore ≥ 0.50
- 1 star: below 0.50

Display as `★★★`, `★★☆`, `★☆☆`. No pass/fail dependency — informational only.

---

## Phase 5 — Spaced Review Prompts

**Files:** `src/progress/store.ts`, `src/routes/Home.tsx`, `src/routes/Lessons.tsx`

### store.ts
Add a selector function:

```ts
export function lessonsNeedingReview(
  data: ProgressData,
  now: number = Date.now(),
): string[] {
  const REVIEW_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  return LESSONS
    .filter((l) => {
      const r = data.records[l.id];
      if (!r?.passed) return false;
      return now - r.lastPlayedAt > REVIEW_AFTER_MS;
    })
    .sort((a, b) => {
      // Prioritise lessons where the learner barely passed (WPM closest to target).
      const margin = (l: typeof a) =>
        (data.records[l.id]?.bestWpm ?? 0) - l.targetWpm;
      return margin(a) - margin(b);
    })
    .map((l) => l.id);
}
```

### Home.tsx
Below the main CTA buttons, if `lessonsNeedingReview(progress)` returns any IDs, render a small card:

```
Klar til genopfriskning: [lesson title] →
```

Link to `/lesson/{id}`. Show at most 1 lesson (the top-priority one).

### Lessons.tsx
In `LessonCard`, if the lesson is passed and `now - record.lastPlayedAt > 7 days`, show a small `🔄` badge next to the `✅` to signal it's due for review.
