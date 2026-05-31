export interface Passage {
  /** Fairy-tale title the excerpt is from. */
  title: string;
  text: string;
}

// Public-domain excerpts from H.C. Andersen (d. 1875), in modern Danish
// spelling and cleaned to characters typeable on a Danish keyboard.
export const PASSAGES: Passage[] = [
  {
    title: 'Den grimme ælling',
    text: 'Der var så dejligt ude på landet. Det var sommer, kornet stod gult, havren grøn, høet var rejst i stakke nede i de grønne enge, og der gik storken på sine lange røde ben og snakkede, for det sprog havde han lært af sin moder. Rundt om ager og eng var der store skove, og midt i skovene dybe søer. Jo, der var rigtignok dejligt derude på landet. Midt i solskinnet lå der en gammel gård med dybe kanaler rundt om.',
  },
  {
    title: 'Kejserens nye klæder',
    text: 'For mange år siden levede en kejser, som holdt så uhyre meget af smukke nye klæder, at han gav alle sine penge ud for at blive rigtig pyntet. Han brød sig ikke om sine soldater, brød sig ikke om komedie eller om at køre i skoven, uden alene for at vise sine nye klæder. Han havde en kjole for hver time på dagen, og ligesom man siger om en konge, at han er i rådet, så sagde man altid her: Kejseren er i garderoben.',
  },
  {
    title: 'Den lille pige med svovlstikkerne',
    text: 'Det var så grueligt koldt; det sneede, og det begyndte at blive mørk aften. Det var også den sidste aften i året, nytårsaften. I denne kulde og i dette mørke gik på gaden en lille fattig pige med bart hoved og nøgne fødder. Ja, hun havde jo rigtignok haft tøfler på, da hun kom hjemmefra, men hvad kunne det hjælpe. Det var meget store tøfler, hendes moder havde sidst brugt dem, så store var de, og dem tabte den lille, da hun skyndte sig over gaden.',
  },
  {
    title: 'Fyrtøjet',
    text: 'Der kom en soldat marcherende hen ad landevejen. Han havde sit tornyster på ryggen og en sabel ved siden, for han havde været i krig, og nu skulle han hjem. Så mødte han en gammel heks på landevejen; hun var så ækel, at hendes underlæbe hang hende lige ned på brystet. Hun sagde: God aften, soldat, hvor du har en pæn sabel og et stort tornyster, du er en rigtig soldat, og nu skal du få så mange penge, du vil eje.',
  },
  {
    title: 'Nattergalen',
    text: 'I Kina, ved du nok, er kejseren en kineser, og alle de, han har om sig, er kinesere. Det er nu mange år siden, men just derfor er det værd at høre historien, før den bliver glemt. Kejserens slot var det prægtigste i verden, ganske og aldeles af fint porcelæn, så kostbart, men så skørt, så vanskeligt at røre ved, at man måtte være ordentlig forsigtig. I haven så man de forunderligste blomster.',
  },
];

/** Pick a random passage, avoiding `excludeTitle` when possible. */
export function randomPassage(excludeTitle?: string): Passage {
  const pool =
    excludeTitle && PASSAGES.length > 1
      ? PASSAGES.filter((p) => p.title !== excludeTitle)
      : PASSAGES;
  return pool[Math.floor(Math.random() * pool.length)];
}
