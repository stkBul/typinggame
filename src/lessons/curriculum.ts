import type { Lesson } from './types';

// Danish touch-typing curriculum, built outward from the home row.
// Every drill uses only characters introduced in this lesson or earlier, so a
// learner never has to type a key they haven't met yet. (Verified by a test.)
export const LESSONS: Lesson[] = [
  {
    id: '1',
    level: 1,
    title: 'f og j',
    description:
      'Pegefingrenes hjemmetaster. Mærk de små kanter på F og J — derfra finder du altid hjem.',
    newChars: ['f', 'j'],
    targetWpm: 8,
    minAccuracy: 0.9,
    drills: [
      { id: '1-keys-1', kind: 'keys', text: 'fff jjj fjf jfj ffj jjf fj jf' },
      { id: '1-keys-2', kind: 'keys', text: 'jf fj jjf ffj fjfj jfjf fj jf' },
    ],
  },
  {
    id: '2',
    level: 1,
    title: 'd og k',
    description: 'Langfingrenes hjemmetaster. Hold pegefingrene på F og J.',
    newChars: ['d', 'k'],
    targetWpm: 8,
    minAccuracy: 0.9,
    drills: [
      { id: '2-keys-1', kind: 'keys', text: 'ddd kkk dkd kdk fdk jkd dk kd' },
      { id: '2-keys-2', kind: 'keys', text: 'fjdk jkdf kdjf djkf dk kd fj jk' },
    ],
  },
  {
    id: '3',
    level: 1,
    title: 's og l',
    description: 'Ringfingrenes hjemmetaster. Rækken vokser udad.',
    newChars: ['s', 'l'],
    targetWpm: 9,
    minAccuracy: 0.9,
    drills: [
      { id: '3-keys-1', kind: 'keys', text: 'sss lll sls lsl fls jsl sl ls' },
      { id: '3-keys-2', kind: 'keys', text: 'fjdksl lskdjf sldk fjsl sl ls' },
    ],
  },
  {
    id: '4',
    level: 1,
    title: 'a og æ',
    description:
      'Lillefingrenes hjemmetaster. Nu kan vi skrive de første rigtige ord!',
    newChars: ['a', 'æ'],
    targetWpm: 10,
    minAccuracy: 0.9,
    drills: [
      { id: '4-keys-1', kind: 'keys', text: 'aaa æææ aæa æaæ asdf jklæ asdf jklæ' },
      { id: '4-words-1', kind: 'words', text: 'fald skal dal kald sæl læs fad sal' },
    ],
  },
  {
    id: '5',
    level: 1,
    title: 'g og h',
    description: 'Pegefingrene strækker indad til G og H. Nu er hele hjemmerækken på plads.',
    newChars: ['g', 'h'],
    targetWpm: 10,
    minAccuracy: 0.92,
    drills: [
      { id: '5-keys-1', kind: 'keys', text: 'ggg hhh ghg hgh fgh hjg asdfg hjklæ' },
      { id: '5-words-1', kind: 'words', text: 'dag lag slag flag hals glas gas hæl' },
    ],
  },
  {
    id: '6',
    level: 1,
    title: 'Hjemmerækken — ord',
    description: 'Saml hele hjemmerækken med rigtige danske ord.',
    newChars: [],
    targetWpm: 12,
    minAccuracy: 0.92,
    drills: [
      { id: '6-words-1', kind: 'words', text: 'skal fald dag glas hals flag sæl læs' },
      { id: '6-words-2', kind: 'words', text: 'ask gas lak dal sal hæl salg flask' },
    ],
  },
  {
    id: '7',
    level: 2,
    title: 'e og i',
    description: 'Op på øverste række med langfingrene. Vokalerne åbner mange nye ord.',
    newChars: ['e', 'i'],
    targetWpm: 12,
    minAccuracy: 0.92,
    drills: [
      { id: '7-keys-1', kind: 'keys', text: 'eee iii eie iei die fie kei lei' },
      { id: '7-words-1', kind: 'words', text: 'jeg hej leg del fed side ide ged dig sig' },
    ],
  },
  {
    id: '8',
    level: 2,
    title: 'r og u',
    description: 'Pegefingrene op til R og U. Nu kan vi skrive hele sætninger.',
    newChars: ['r', 'u'],
    targetWpm: 14,
    minAccuracy: 0.93,
    drills: [
      { id: '8-keys-1', kind: 'keys', text: 'rrr uuu rur uru fru jur dru kur' },
      { id: '8-words-1', kind: 'words', text: 'rude sur kur rar gul rul frue ur' },
      { id: '8-sentence-1', kind: 'sentence', text: 'jeg er glad du er sej jeg ser dig' },
    ],
  },
];

const byId = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

export function getLesson(id: string | undefined): Lesson | undefined {
  return id === undefined ? undefined : byId.get(id);
}

/** The lesson after the given id, or undefined if it's the last one. */
export function getNextLesson(id: string): Lesson | undefined {
  const index = LESSONS.findIndex((lesson) => lesson.id === id);
  return index === -1 ? undefined : LESSONS[index + 1];
}
