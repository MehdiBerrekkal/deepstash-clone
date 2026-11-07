import type { Course, LItem, Unit } from '@/data/learn/courses';

/**
 * More courses, built from shared themes: every course teaches the same everyday concepts (greetings, food,
 * numbers, family, phrases) in its own words, plus its own sounds or alphabet. Written for this app.
 */

type Concept = { en: string; fr: string; emoji: string };
const GREET: Concept[] = [
  { en: 'hello', fr: 'bonjour', emoji: '👋' },
  { en: 'good morning', fr: 'bonjour (le matin)', emoji: '🌅' },
  { en: 'good evening', fr: 'bonsoir', emoji: '🌙' },
  { en: 'thank you', fr: 'merci', emoji: '🙏' },
  { en: 'please', fr: 's’il vous plaît', emoji: '🙂' },
  { en: 'goodbye', fr: 'au revoir', emoji: '👋' },
  { en: 'yes', fr: 'oui', emoji: '✅' },
  { en: 'no', fr: 'non', emoji: '❌' },
];
const FOOD: Concept[] = [
  { en: 'water', fr: 'eau', emoji: '💧' },
  { en: 'bread', fr: 'pain', emoji: '🍞' },
  { en: 'apple', fr: 'pomme', emoji: '🍎' },
  { en: 'cheese', fr: 'fromage', emoji: '🧀' },
  { en: 'fish', fr: 'poisson', emoji: '🐟' },
  { en: 'egg', fr: 'œuf', emoji: '🥚' },
  { en: 'milk', fr: 'lait', emoji: '🥛' },
  { en: 'coffee', fr: 'café', emoji: '☕' },
];
const NUMS: Concept[] = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].map((en, i) => ({
  en,
  fr: ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'][i],
  emoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'][i],
}));
const FAMILY: Concept[] = [
  { en: 'mother', fr: 'mère', emoji: '👩' },
  { en: 'father', fr: 'père', emoji: '👨' },
  { en: 'brother', fr: 'frère', emoji: '👦' },
  { en: 'sister', fr: 'sœur', emoji: '👧' },
  { en: 'son', fr: 'fils', emoji: '👶' },
  { en: 'daughter', fr: 'fille', emoji: '👧' },
  { en: 'friend', fr: 'ami', emoji: '🤝' },
];
const PHRASES: Concept[] = [
  { en: 'A coffee, please', fr: 'Un café, s’il vous plaît', emoji: '☕' },
  { en: 'How much is it?', fr: 'Combien ça coûte ?', emoji: '💶' },
  { en: 'Where is the toilet?', fr: 'Où sont les toilettes ?', emoji: '🚻' },
  { en: 'My name is Anna', fr: 'Je m’appelle Anna', emoji: '🙋' },
  { en: 'I don’t understand', fr: 'Je ne comprends pas', emoji: '🤷' },
  { en: 'Nice to meet you', fr: 'Enchanté', emoji: '🤝' },
];

/** Items for a theme: the word in the language, plus romanization when the script isn't Latin. */
function themed(concepts: Concept[], words: string[], roman?: string[], tiles?: 'words'): LItem[] {
  return concepts.map((c, i) => ({
    text: words[i],
    roman: roman?.[i] ?? '',
    en: c.en,
    fr: c.fr,
    emoji: c.emoji,
    ...(tiles === 'words' ? { tiles: words[i].replace(/[¿?¡!,.،؟]/g, '').split(/\s+/).filter(Boolean) } : {}),
  }));
}
/** Multi-word items can be built from their words. */
const withTiles = (items: LItem[]) => items.map((it) => (it.text.includes(' ') ? { ...it, tiles: it.text.replace(/[¿?¡!,.،؟]/g, '').split(/\s+/) } : it));

const unit = (id: string, kind: Unit['kind'], icon: string, en: string, fr: string, canEn: string, canFr: string, items: LItem[]): Unit => ({ id, kind, icon, title: { en, fr }, can: { en: canEn, fr: canFr }, items });

/** The five everyday units every course shares. */
function everyday(id: string, w: { greet: string[]; food: string[]; nums: string[]; family: string[]; phrases: string[] }, roman?: { greet?: string[]; food?: string[]; nums?: string[]; family?: string[]; phrases?: string[] }): Unit[] {
  return [
    unit(`${id}-greet`, 'words', '👋', 'Greetings', 'Salutations', 'Greet people and be polite', 'Saluer et être poli', withTiles(themed(GREET, w.greet, roman?.greet))),
    unit(`${id}-food`, 'words', '🍽️', 'Food and drinks', 'Nourriture et boissons', 'Name everyday food and drinks', 'Nommer la nourriture courante', themed(FOOD, w.food, roman?.food)),
    unit(`${id}-num`, 'words', '🔢', 'Numbers 1–10', 'Nombres 1 à 10', 'Count to ten', 'Compter jusqu’à dix', themed(NUMS, w.nums, roman?.nums)),
    unit(`${id}-family`, 'words', '👪', 'Family', 'Famille', 'Talk about your family', 'Parler de sa famille', withTiles(themed(FAMILY, w.family, roman?.family))),
    unit(`${id}-phrases`, 'phrases', '💬', 'Out and about', 'En voyage', 'Order, ask a price, find the toilet', 'Commander, demander un prix, trouver les toilettes', themed(PHRASES, w.phrases, roman?.phrases, 'words')),
  ];
}
const sounds = (id: string, icon: string, en: string, fr: string, items: LItem[]) =>
  unit(`${id}-sounds`, 'accents', icon, en, fr, 'Spell and say the special letters', 'Écrire et prononcer les lettres spéciales', items);
const s = (text: string, roman: string, en: string, fr: string, emoji: string, wrong?: string[]): LItem => ({ text, roman, en, fr, emoji, ...(wrong ? { wrong } : {}) });

export const GERMAN: Course = {
  id: 'de', name: { en: 'German', fr: 'Allemand' }, native: 'Deutsch', flag: '🇩🇪', voice: 'de-DE', color: '#F2C14E',
  units: [
    sounds('de', 'ä', 'Umlauts: ä, ö, ü', 'Trémas : ä, ö, ü', [
      s('Mädchen', 'MAYT-shen', 'girl', 'fille', '👧'), s('schön', 'shurn (rounded lips)', 'beautiful', 'beau', '🌸'), s('Brücke', 'BRUE-keh', 'bridge', 'pont', '🌉'), s('Käse', 'KAY-zeh', 'cheese', 'fromage', '🧀'),
      s('müde', 'MUE-deh', 'tired', 'fatigué', '😴'), s('Tür', 'tuer', 'door', 'porte', '🚪'), s('Bär', 'bair', 'bear', 'ours', '🐻'), s('Frühstück', 'FRUE-shtuek', 'breakfast', 'petit-déjeuner', '🍳'),
    ]),
    ...everyday('de', {
      greet: ['Hallo', 'Guten Morgen', 'Guten Abend', 'Danke', 'Bitte', 'Tschüss', 'Ja', 'Nein'],
      food: ['Wasser', 'Brot', 'Apfel', 'Käse', 'Fisch', 'Ei', 'Milch', 'Kaffee'],
      nums: ['eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn'],
      family: ['Mutter', 'Vater', 'Bruder', 'Schwester', 'Sohn', 'Tochter', 'Freund'],
      phrases: ['Einen Kaffee, bitte', 'Wie viel kostet das?', 'Wo ist die Toilette?', 'Ich heiße Anna', 'Ich verstehe nicht', 'Freut mich'],
    }),
  ],
};

export const FRENCH: Course = {
  id: 'fr', name: { en: 'French', fr: 'Français' }, native: 'Français', flag: '🇫🇷', voice: 'fr-FR', color: '#3E8BFF',
  units: [
    sounds('fr', 'é', 'Accents: é, è, ê, ç', 'Accents : é, è, ê, ç', [
      s('café', 'ka-FAY', 'coffee', 'café', '☕'), s('élève', 'ay-LEV', 'pupil', 'élève', '🧑‍🎓'), s('forêt', 'fo-REH', 'forest', 'forêt', '🌲'), s('garçon', 'gar-SOHN', 'boy', 'garçon', '👦'),
      s('hôpital', 'oh-pee-TAL', 'hospital', 'hôpital', '🏥'), s('fenêtre', 'fuh-NETR', 'window', 'fenêtre', '🪟'), s('Noël', 'no-EL', 'Christmas', 'Noël', '🎄'), s('français', 'frahn-SEH', 'French', 'français', '🇫🇷'),
    ]),
    ...everyday('fr', {
      greet: ['bonjour', 'bonjour', 'bonsoir', 'merci', 's’il vous plaît', 'au revoir', 'oui', 'non'],
      food: ['eau', 'pain', 'pomme', 'fromage', 'poisson', 'œuf', 'lait', 'café'],
      nums: ['un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
      family: ['mère', 'père', 'frère', 'sœur', 'fils', 'fille', 'ami'],
      phrases: ['Un café, s’il vous plaît', 'C’est combien ?', 'Où sont les toilettes ?', 'Je m’appelle Anna', 'Je ne comprends pas', 'Enchanté'],
    }),
  ],
};
// "bonjour" stands for both hello and good morning: keep only one of them in French.
FRENCH.units[1].items = FRENCH.units[1].items.filter((it, i) => i !== 1);

export const ENGLISH: Course = {
  id: 'en', name: { en: 'English', fr: 'Anglais' }, native: 'English', flag: '🇬🇧', voice: 'en-GB', color: '#7C8CFF',
  units: [
    sounds('en', 'kn', 'Tricky spellings', 'Orthographes piégeuses', [
      s('knife', 'naif (silent k)', 'knife', 'couteau', '🔪', ['nife', 'knive', 'naif']), s('island', 'EYE-land (silent s)', 'island', 'île', '🏝️', ['iland', 'isle land', 'ailand']),
      s('Wednesday', 'WENZ-day', 'Wednesday', 'mercredi', '📅', ['Wensday', 'Wednsday', 'Wendesday']), s('beautiful', 'BYOO-ti-ful', 'beautiful', 'beau', '🌸', ['beatiful', 'beautifull', 'butiful']),
      s('through', 'throo', 'through', 'à travers', '➡️', ['thru', 'trough', 'throuh']), s('receive', 'ri-SEEV', 'receive', 'recevoir', '📨', ['recieve', 'receeve', 'resive']),
      s('enough', 'i-NUF', 'enough', 'assez', '✋', ['enuf', 'enouf', 'inough']), s('daughter', 'DAW-ter', 'daughter', 'fille', '👧', ['dauhter', 'doughter', 'dawter']),
    ]),
    ...everyday('en', {
      greet: ['hello', 'good morning', 'good evening', 'thank you', 'please', 'goodbye', 'yes', 'no'],
      food: ['water', 'bread', 'apple', 'cheese', 'fish', 'egg', 'milk', 'coffee'],
      nums: ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
      family: ['mother', 'father', 'brother', 'sister', 'son', 'daughter', 'friend'],
      phrases: ['A coffee, please', 'How much is it?', 'Where is the toilet?', 'My name is Anna', 'I don’t understand', 'Nice to meet you'],
    }),
  ],
};

export const ITALIAN: Course = {
  id: 'it', name: { en: 'Italian', fr: 'Italien' }, native: 'Italiano', flag: '🇮🇹', voice: 'it-IT', color: '#3DDC97',
  units: [
    sounds('it', 'à', 'Accents and double letters', 'Accents et lettres doubles', [
      s('caffè', 'kaf-FEH', 'coffee', 'café', '☕'), s('città', 'cheet-TAH', 'city', 'ville', '🏙️'), s('perché', 'per-KAY', 'why / because', 'pourquoi / parce que', '❓'), s('più', 'pyoo', 'more', 'plus', '➕'),
      s('università', 'oo-nee-ver-see-TAH', 'university', 'université', '🎓'), s('lunedì', 'loo-neh-DEE', 'Monday', 'lundi', '📅'), s('così', 'ko-ZEE', 'like this', 'comme ça', '👉'), s('già', 'jah', 'already', 'déjà', '⏱️'),
    ]),
    ...everyday('it', {
      greet: ['ciao', 'buongiorno', 'buonasera', 'grazie', 'per favore', 'arrivederci', 'sì', 'no'],
      food: ['acqua', 'pane', 'mela', 'formaggio', 'pesce', 'uovo', 'latte', 'caffè'],
      nums: ['uno', 'due', 'tre', 'quattro', 'cinque', 'sei', 'sette', 'otto', 'nove', 'dieci'],
      family: ['madre', 'padre', 'fratello', 'sorella', 'figlio', 'figlia', 'amico'],
      phrases: ['Un caffè, per favore', 'Quanto costa?', 'Dov’è il bagno?', 'Mi chiamo Anna', 'Non capisco', 'Piacere'],
    }),
  ],
};

export const PORTUGUESE: Course = {
  id: 'pt', name: { en: 'Portuguese (Brazil)', fr: 'Portugais (Brésil)' }, native: 'Português', flag: '🇧🇷', voice: 'pt-BR', color: '#30A46C',
  units: [
    sounds('pt', 'ã', 'Nasal sounds and accents', 'Sons nasaux et accents', [
      s('pão', 'powng (nasal)', 'bread', 'pain', '🍞'), s('coração', 'ko-ra-SOWNG', 'heart', 'cœur', '❤️'), s('maçã', 'ma-SANG', 'apple', 'pomme', '🍎'), s('você', 'vo-SEH', 'you', 'tu / vous', '🫵'),
      s('avó', 'a-VAW', 'grandmother', 'grand-mère', '👵'), s('irmã', 'eer-MANG', 'sister', 'sœur', '👧'), s('também', 'tahm-BENG', 'also', 'aussi', '➕'), s('café', 'ka-FEH', 'coffee', 'café', '☕'),
    ]),
    ...everyday('pt', {
      greet: ['olá', 'bom dia', 'boa noite', 'obrigado', 'por favor', 'tchau', 'sim', 'não'],
      food: ['água', 'pão', 'maçã', 'queijo', 'peixe', 'ovo', 'leite', 'café'],
      nums: ['um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez'],
      family: ['mãe', 'pai', 'irmão', 'irmã', 'filho', 'filha', 'amigo'],
      phrases: ['Um café, por favor', 'Quanto custa?', 'Onde fica o banheiro?', 'Meu nome é Ana', 'Não entendo', 'Prazer'],
    }),
  ],
};

export const DUTCH: Course = {
  id: 'nl', name: { en: 'Dutch', fr: 'Néerlandais' }, native: 'Nederlands', flag: '🇳🇱', voice: 'nl-NL', color: '#F76B15',
  units: [
    sounds('nl', 'ij', 'Dutch sounds: ij, ui, oe, eu', 'Sons néerlandais : ij, ui, oe, eu', [
      s('ijs', 'ays', 'ice / ice cream', 'glace', '🍦', ['eis', 'ys', 'ijss']), s('huis', 'howss (rounded)', 'house', 'maison', '🏠', ['hois', 'hius', 'huiz']), s('boek', 'book', 'book', 'livre', '📖', ['buk', 'bouk', 'boec']),
      s('deur', 'dur (rounded)', 'door', 'porte', '🚪', ['dör', 'duer', 'deure']), s('fiets', 'feets', 'bicycle', 'vélo', '🚲', ['fits', 'fietz', 'feets']), s('meisje', 'MAY-sheh', 'girl', 'fille', '👧', ['meisie', 'mijsje', 'meishe']),
      s('kaas', 'kahs', 'cheese', 'fromage', '🧀', ['kas', 'kaaz', 'caas']), s('groot', 'khroht', 'big', 'grand', '🐘', ['grot', 'groht', 'chroot']),
    ]),
    ...everyday('nl', {
      greet: ['hallo', 'goedemorgen', 'goedenavond', 'dank je', 'alsjeblieft', 'doei', 'ja', 'nee'],
      food: ['water', 'brood', 'appel', 'kaas', 'vis', 'ei', 'melk', 'koffie'],
      nums: ['één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien'],
      family: ['moeder', 'vader', 'broer', 'zus', 'zoon', 'dochter', 'vriend'],
      phrases: ['Een koffie, alsjeblieft', 'Hoeveel kost het?', 'Waar is het toilet?', 'Ik heet Anna', 'Ik begrijp het niet', 'Aangenaam'],
    }),
  ],
};

export const TURKISH: Course = {
  id: 'tr', name: { en: 'Turkish', fr: 'Turc' }, native: 'Türkçe', flag: '🇹🇷', voice: 'tr-TR', color: '#E5484D',
  units: [
    sounds('tr', 'ş', 'Turkish letters: ç, ğ, ı, ö, ş, ü', 'Lettres turques : ç, ğ, ı, ö, ş, ü', [
      s('çay', 'chai', 'tea', 'thé', '🍵'), s('ağaç', 'aa-ACH (ğ lengthens)', 'tree', 'arbre', '🌳'), s('kız', 'kuhz (ı like "uh")', 'girl', 'fille', '👧', ['kiz', 'kuz', 'kıs']),
      s('göz', 'gurz (rounded)', 'eye', 'œil', '👁️'), s('şeker', 'sheh-KER', 'sugar', 'sucre', '🍬'), s('üzüm', 'ue-ZUEM', 'grape', 'raisin', '🍇'), s('ışık', 'uh-SHUHK', 'light', 'lumière', '💡', ['isik', 'ışik', 'işık']), s('gül', 'guel', 'rose', 'rose', '🌹'),
    ]),
    ...everyday('tr', {
      greet: ['merhaba', 'günaydın', 'iyi akşamlar', 'teşekkürler', 'lütfen', 'hoşça kal', 'evet', 'hayır'],
      food: ['su', 'ekmek', 'elma', 'peynir', 'balık', 'yumurta', 'süt', 'kahve'],
      nums: ['bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on'],
      family: ['anne', 'baba', 'erkek kardeş', 'kız kardeş', 'oğul', 'kız', 'arkadaş'],
      phrases: ['Bir kahve, lütfen', 'Ne kadar?', 'Tuvalet nerede?', 'Benim adım Ayşe', 'Anlamıyorum', 'Memnun oldum'],
    }),
  ],
};

// ---------- Russian, Arabic, Hindi: their alphabets first ----------

const letters = (pairs: [string, string, string?][]): LItem[] => pairs.map(([text, roman, say]) => ({ text, roman, en: roman, fr: roman, ...(say ? { say } : {}) }));
const SCRIPTS: Record<string, Unit['script']> = { ru: 'cyrillic', ar: 'arabic', hi: 'devanagari' };
/** An alphabet unit: recognise the letters, and write them with a finger. */
const alphabet = (id: string, n: number, icon: string, en: string, fr: string, items: LItem[]): Unit => ({
  ...unit(`${id}-abc-${n}`, 'script', icon, en, fr, `Read and write these ${items.length} letters`, `Lire et écrire ces ${items.length} lettres`, items),
  script: SCRIPTS[id],
});

export const RUSSIAN: Course = {
  id: 'ru', name: { en: 'Russian', fr: 'Russe' }, native: 'Русский', flag: '🇷🇺', voice: 'ru-RU', color: '#7FE3D6',
  units: [
    alphabet('ru', 1, 'А', 'Cyrillic: familiar letters', 'Cyrillique : lettres familières', letters([['А', 'a'], ['К', 'k'], ['М', 'm'], ['О', 'o'], ['Т', 't'], ['Е', 'ye'], ['В', 'v'], ['Н', 'n'], ['Р', 'r'], ['С', 's'], ['У', 'u']])),
    alphabet('ru', 2, 'Б', 'Cyrillic: new shapes', 'Cyrillique : nouvelles formes', letters([['Б', 'b'], ['Г', 'g'], ['Д', 'd'], ['З', 'z'], ['И', 'i'], ['Й', 'y (short)'], ['Л', 'l'], ['П', 'p'], ['Ф', 'f'], ['Э', 'e'], ['Ю', 'yu'], ['Я', 'ya']])),
    alphabet('ru', 3, 'Ж', 'Cyrillic: the rest', 'Cyrillique : le reste', letters([['Ё', 'yo'], ['Ж', 'zh'], ['Х', 'kh'], ['Ц', 'ts'], ['Ч', 'ch'], ['Ш', 'sh'], ['Щ', 'shch'], ['Ы', 'y (deep i)'], ['Ь', 'soft sign'], ['Ъ', 'hard sign']])),
    ...everyday(
      'ru',
      {
        greet: ['привет', 'доброе утро', 'добрый вечер', 'спасибо', 'пожалуйста', 'до свидания', 'да', 'нет'],
        food: ['вода', 'хлеб', 'яблоко', 'сыр', 'рыба', 'яйцо', 'молоко', 'кофе'],
        nums: ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять', 'десять'],
        family: ['мама', 'папа', 'брат', 'сестра', 'сын', 'дочь', 'друг'],
        phrases: ['Кофе, пожалуйста', 'Сколько стоит?', 'Где туалет?', 'Меня зовут Анна', 'Я не понимаю', 'Очень приятно'],
      },
      {
        greet: ['privet', 'dobroye utro', 'dobryy vecher', 'spasibo', 'pozhaluysta', 'do svidaniya', 'da', 'net'],
        food: ['voda', 'khleb', 'yabloko', 'syr', 'ryba', 'yaytso', 'moloko', 'kofe'],
        nums: ['odin', 'dva', 'tri', 'chetyre', 'pyat’', 'shest’', 'sem’', 'vosem’', 'devyat’', 'desyat’'],
        family: ['mama', 'papa', 'brat', 'sestra', 'syn', 'doch’', 'drug'],
        phrases: ['kofe, pozhaluysta', 'skol’ko stoit?', 'gde tualet?', 'menya zovut Anna', 'ya ne ponimayu', 'ochen’ priyatno'],
      },
    ),
  ],
};

export const ARABIC: Course = {
  id: 'ar', name: { en: 'Arabic', fr: 'Arabe' }, native: 'العربية', flag: '🇸🇦', voice: 'ar-SA', color: '#30A46C', rtl: true,
  units: [
    alphabet('ar', 1, 'ب', 'Letters ا to خ', 'Lettres ا à خ', letters([['ا', 'alif (a)', 'ألف'], ['ب', 'ba (b)', 'باء'], ['ت', 'ta (t)', 'تاء'], ['ث', 'tha (th)', 'ثاء'], ['ج', 'jim (j)', 'جيم'], ['ح', 'ḥa (h, breathy)', 'حاء'], ['خ', 'kha (kh)', 'خاء']])),
    alphabet('ar', 2, 'د', 'Letters د to ض', 'Lettres د à ض', letters([['د', 'dal (d)', 'دال'], ['ذ', 'dhal (th as in "this")', 'ذال'], ['ر', 'ra (r)', 'راء'], ['ز', 'zay (z)', 'زاي'], ['س', 'sin (s)', 'سين'], ['ش', 'shin (sh)', 'شين'], ['ص', 'ṣad (heavy s)', 'صاد'], ['ض', 'ḍad (heavy d)', 'ضاد']])),
    alphabet('ar', 3, 'ع', 'Letters ط to غ', 'Lettres ط à غ', letters([['ط', 'ṭa (heavy t)', 'طاء'], ['ظ', 'ẓa (heavy th)', 'ظاء'], ['ع', 'ʿayn (throat sound)', 'عين'], ['غ', 'ghayn (gh)', 'غين'], ['ف', 'fa (f)', 'فاء'], ['ق', 'qaf (deep k)', 'قاف'], ['ك', 'kaf (k)', 'كاف']])),
    alphabet('ar', 4, 'م', 'Letters ل to ي', 'Lettres ل à ي', letters([['ل', 'lam (l)', 'لام'], ['م', 'mim (m)', 'ميم'], ['ن', 'nun (n)', 'نون'], ['ه', 'ha (h)', 'هاء'], ['و', 'waw (w / u)', 'واو'], ['ي', 'ya (y / i)', 'ياء']])),
    ...everyday(
      'ar',
      {
        greet: ['مرحبا', 'صباح الخير', 'مساء الخير', 'شكرا', 'من فضلك', 'مع السلامة', 'نعم', 'لا'],
        food: ['ماء', 'خبز', 'تفاحة', 'جبن', 'سمك', 'بيضة', 'حليب', 'قهوة'],
        nums: ['واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'],
        family: ['أم', 'أب', 'أخ', 'أخت', 'ابن', 'ابنة', 'صديق'],
        phrases: ['قهوة من فضلك', 'كم السعر؟', 'أين الحمام؟', 'اسمي آنا', 'لا أفهم', 'تشرفنا'],
      },
      {
        greet: ['marḥaban', 'ṣabāḥ al-khayr', 'masāʾ al-khayr', 'shukran', 'min faḍlak', 'maʿa as-salāma', 'naʿam', 'lā'],
        food: ['māʾ', 'khubz', 'tuffāḥa', 'jubn', 'samak', 'bayḍa', 'ḥalīb', 'qahwa'],
        nums: ['wāḥid', 'ithnān', 'thalātha', 'arbaʿa', 'khamsa', 'sitta', 'sabʿa', 'thamāniya', 'tisʿa', 'ʿashara'],
        family: ['umm', 'ab', 'akh', 'ukht', 'ibn', 'ibna', 'ṣadīq'],
        phrases: ['qahwa min faḍlak', 'kam as-siʿr?', 'ayna al-ḥammām?', 'ismī Anna', 'lā afham', 'tasharrafnā'],
      },
    ),
  ],
};

export const HINDI: Course = {
  id: 'hi', name: { en: 'Hindi', fr: 'Hindi' }, native: 'हिन्दी', flag: '🇮🇳', voice: 'hi-IN', color: '#FFB547',
  units: [
    alphabet('hi', 1, 'अ', 'Devanagari vowels', 'Voyelles devanagari', letters([['अ', 'a'], ['आ', 'ā'], ['इ', 'i'], ['ई', 'ī'], ['उ', 'u'], ['ऊ', 'ū'], ['ए', 'e'], ['ऐ', 'ai'], ['ओ', 'o'], ['औ', 'au']])),
    alphabet('hi', 2, 'क', 'Consonants क to थ', 'Consonnes क à थ', letters([['क', 'ka'], ['ख', 'kha'], ['ग', 'ga'], ['घ', 'gha'], ['च', 'cha'], ['छ', 'chha'], ['ज', 'ja'], ['झ', 'jha'], ['ट', 'ṭa'], ['ड', 'ḍa'], ['त', 'ta'], ['थ', 'tha']])),
    alphabet('hi', 3, 'म', 'Consonants द to ह', 'Consonnes द à ह', letters([['द', 'da'], ['ध', 'dha'], ['न', 'na'], ['प', 'pa'], ['फ', 'pha'], ['ब', 'ba'], ['भ', 'bha'], ['म', 'ma'], ['य', 'ya'], ['र', 'ra'], ['ल', 'la'], ['व', 'va'], ['स', 'sa'], ['ह', 'ha']])),
    ...everyday(
      'hi',
      {
        greet: ['नमस्ते', 'सुप्रभात', 'शुभ संध्या', 'धन्यवाद', 'कृपया', 'फिर मिलेंगे', 'हाँ', 'नहीं'],
        food: ['पानी', 'रोटी', 'सेब', 'पनीर', 'मछली', 'अंडा', 'दूध', 'कॉफ़ी'],
        nums: ['एक', 'दो', 'तीन', 'चार', 'पाँच', 'छह', 'सात', 'आठ', 'नौ', 'दस'],
        family: ['माँ', 'पिता', 'भाई', 'बहन', 'बेटा', 'बेटी', 'दोस्त'],
        phrases: ['एक कॉफ़ी, कृपया', 'यह कितने का है?', 'शौचालय कहाँ है?', 'मेरा नाम अन्ना है', 'मुझे समझ नहीं आया', 'आपसे मिलकर खुशी हुई'],
      },
      {
        greet: ['namaste', 'suprabhāt', 'shubh sandhyā', 'dhanyavād', 'kripayā', 'phir milenge', 'hā̃', 'nahī̃'],
        food: ['pānī', 'roṭī', 'seb', 'panīr', 'machhlī', 'aṇḍā', 'dūdh', 'kôfī'],
        nums: ['ek', 'do', 'tīn', 'chār', 'pā̃ch', 'chhah', 'sāt', 'āṭh', 'nau', 'das'],
        family: ['mā̃', 'pitā', 'bhāī', 'bahan', 'beṭā', 'beṭī', 'dost'],
        phrases: ['ek kôfī, kripayā', 'yah kitne kā hai?', 'shauchālay kahā̃ hai?', 'merā nām Annā hai', 'mujhe samajh nahī̃ āyā', 'āpse milkar khushī huī'],
      },
    ),
  ],
};

export const MORE_COURSES: Course[] = [GERMAN, FRENCH, ENGLISH, ITALIAN, PORTUGUESE, DUTCH, TURKISH, RUSSIAN, ARABIC, HINDI];
