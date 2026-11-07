import { MORE_COURSES } from '@/data/learn/courses2';

/**
 * Language courses, written for this app. Each course is a path of short units; each unit is a set of items
 * (letters, characters, words or phrases) that the session engine turns into varied mini-games.
 */

export type LItem = {
  /** Progress key for words of full courses (course:topic:word). */
  key?: string;
  /** What's shown: a letter, a character, a word or a phrase. */
  text: string;
  /** Romanization or pronunciation help. */
  roman?: string;
  en: string;
  fr: string;
  emoji?: string;
  /** What the voice should say, when it differs from the text (e.g. a Hangul letter is said in a syllable). */
  say?: string;
  /** Pieces to build it from (syllables, characters or words). */
  tiles?: string[];
  /** Hangul syllable blocks: the consonant and vowel. Mandarin tone units: the tone (1-4). */
  parts?: string[];
  tone?: number;
  /** Spelling games: plausible wrong spellings (otherwise they're made by moving accents). */
  wrong?: string[];
  /** An example sentence using it, with translations. */
  ex?: string;
  exEn?: string;
  exFr?: string;
};

export type UnitKind = 'script' | 'words' | 'phrases' | 'blocks' | 'tones' | 'accents';
export type Unit = {
  id: string;
  kind: UnitKind;
  title: { en: string; fr: string };
  /** What you can do after it ("can-do"). */
  can: { en: string; fr: string };
  icon: string;
  /** For script units: where the stroke data comes from. */
  script?: 'kana' | 'hanzi' | 'hangul' | 'cyrillic' | 'arabic' | 'devanagari';
  items: LItem[];
};
export type Course = {
  id: string;
  name: { en: string; fr: string };
  native: string;
  flag: string;
  /** Voice language for speech. */
  voice: string;
  color: string;
  /** Written right to left (Arabic). */
  rtl?: boolean;
  units: Unit[];
};

const w = (text: string, roman: string, en: string, fr: string, emoji?: string, extra: Partial<LItem> = {}): LItem => ({ text, roman, en, fr, emoji, ...extra });
/** Kana/letters: the sound is the romanization. */
const ch = (text: string, roman: string, extra: Partial<LItem> = {}): LItem => ({ text, roman, en: roman, fr: roman, ...extra });
const chars = (s: string) => [...s];

// ---------- Japanese ----------

const kanaRow = (kana: string, romaji: string[]) => chars(kana).map((k, i) => ch(k, romaji[i]));

export const JAPANESE: Course = {
  id: 'ja',
  name: { en: 'Japanese', fr: 'Japonais' },
  native: '日本語',
  flag: '🇯🇵',
  voice: 'ja-JP',
  color: '#E5484D',
  units: [
    { id: 'hira-1', kind: 'script', script: 'kana', icon: 'あ', title: { en: 'Hiragana: あ to こ', fr: 'Hiragana : あ à こ' }, can: { en: 'Read and write the first 10 hiragana', fr: 'Lire et écrire les 10 premiers hiragana' }, items: kanaRow('あいうえおかきくけこ', ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko']) },
    { id: 'hira-2', kind: 'script', script: 'kana', icon: 'さ', title: { en: 'Hiragana: さ to と', fr: 'Hiragana : さ à と' }, can: { en: 'Read and write さ, た and their rows', fr: 'Lire et écrire さ, た et leurs lignes' }, items: kanaRow('さしすせそたちつてと', ['sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to']) },
    { id: 'hira-3', kind: 'script', script: 'kana', icon: 'な', title: { en: 'Hiragana: な to ほ', fr: 'Hiragana : な à ほ' }, can: { en: 'Read and write な and は rows', fr: 'Lire et écrire les lignes な et は' }, items: kanaRow('なにぬねのはひふへほ', ['na', 'ni', 'nu', 'ne', 'no', 'ha', 'hi', 'fu', 'he', 'ho']) },
    { id: 'hira-4', kind: 'script', script: 'kana', icon: 'ま', title: { en: 'Hiragana: ま to よ', fr: 'Hiragana : ま à よ' }, can: { en: 'Read and write ま and や rows', fr: 'Lire et écrire les lignes ま et や' }, items: kanaRow('まみむめもやゆよ', ['ma', 'mi', 'mu', 'me', 'mo', 'ya', 'yu', 'yo']) },
    { id: 'hira-5', kind: 'script', script: 'kana', icon: 'ら', title: { en: 'Hiragana: ら to ん', fr: 'Hiragana : ら à ん' }, can: { en: 'Read every basic hiragana', fr: 'Lire tous les hiragana de base' }, items: kanaRow('らりるれろわをん', ['ra', 'ri', 'ru', 're', 'ro', 'wa', 'wo', 'n']) },
    {
      id: 'ja-greet', kind: 'words', icon: '👋', title: { en: 'Greetings', fr: 'Salutations' }, can: { en: 'Greet people and say thank you', fr: 'Saluer et dire merci' },
      items: [
        w('こんにちは', 'konnichiwa', 'hello', 'bonjour', '👋'),
        w('おはよう', 'ohayō', 'good morning', 'bonjour (le matin)', '🌅'),
        w('こんばんは', 'konbanwa', 'good evening', 'bonsoir', '🌙'),
        w('ありがとう', 'arigatō', 'thank you', 'merci', '🙏'),
        w('すみません', 'sumimasen', 'excuse me / sorry', 'excusez-moi / pardon', '🙇'),
        w('さようなら', 'sayōnara', 'goodbye', 'au revoir', '👋'),
        w('はい', 'hai', 'yes', 'oui', '✅'),
        w('いいえ', 'iie', 'no', 'non', '❌'),
      ].map((i) => ({ ...i, tiles: chars(i.text) })),
    },
    { id: 'kata-1', kind: 'script', script: 'kana', icon: 'ア', title: { en: 'Katakana: ア to コ', fr: 'Katakana : ア à コ' }, can: { en: 'Read and write the first 10 katakana', fr: 'Lire et écrire les 10 premiers katakana' }, items: kanaRow('アイウエオカキクケコ', ['a', 'i', 'u', 'e', 'o', 'ka', 'ki', 'ku', 'ke', 'ko']) },
    {
      id: 'ja-food', kind: 'words', icon: '🍣', title: { en: 'Food and drinks', fr: 'Nourriture et boissons' }, can: { en: 'Name everyday food and drinks', fr: 'Nommer la nourriture et les boissons courantes' },
      items: [
        w('みず', 'mizu', 'water', 'eau', '💧'),
        w('おちゃ', 'ocha', 'green tea', 'thé vert', '🍵'),
        w('ごはん', 'gohan', 'rice / meal', 'riz / repas', '🍚'),
        w('すし', 'sushi', 'sushi', 'sushi', '🍣'),
        w('パン', 'pan', 'bread', 'pain', '🍞'),
        w('りんご', 'ringo', 'apple', 'pomme', '🍎'),
        w('さかな', 'sakana', 'fish', 'poisson', '🐟'),
        w('たまご', 'tamago', 'egg', 'œuf', '🥚'),
      ].map((i) => ({ ...i, tiles: chars(i.text) })),
    },
    { id: 'kata-2', kind: 'script', script: 'kana', icon: 'サ', title: { en: 'Katakana: サ to ト', fr: 'Katakana : サ à ト' }, can: { en: 'Read and write サ and タ rows', fr: 'Lire et écrire les lignes サ et タ' }, items: kanaRow('サシスセソタチツテト', ['sa', 'shi', 'su', 'se', 'so', 'ta', 'chi', 'tsu', 'te', 'to']) },
    {
      id: 'ja-num', kind: 'script', script: 'kana', icon: '一', title: { en: 'Numbers 1–10 (kanji)', fr: 'Nombres 1 à 10 (kanji)' }, can: { en: 'Count to ten and write the numbers', fr: 'Compter jusqu’à dix et écrire les nombres' },
      items: [
        w('一', 'ichi', 'one', 'un', '1️⃣'), w('二', 'ni', 'two', 'deux', '2️⃣'), w('三', 'san', 'three', 'trois', '3️⃣'), w('四', 'yon', 'four', 'quatre', '4️⃣'), w('五', 'go', 'five', 'cinq', '5️⃣'),
        w('六', 'roku', 'six', 'six', '6️⃣'), w('七', 'nana', 'seven', 'sept', '7️⃣'), w('八', 'hachi', 'eight', 'huit', '8️⃣'), w('九', 'kyū', 'nine', 'neuf', '9️⃣'), w('十', 'jū', 'ten', 'dix', '🔟'),
      ],
    },
    {
      id: 'ja-phrases', kind: 'phrases', icon: '💬', title: { en: 'Out and about', fr: 'En voyage' }, can: { en: 'Order, ask prices and find the station', fr: 'Commander, demander un prix, trouver la gare' },
      items: [
        w('コーヒー を ください', 'kōhī o kudasai', 'A coffee, please', 'Un café, s’il vous plaît', '☕'),
        w('これ は いくら です か', 'kore wa ikura desu ka', 'How much is this?', 'Combien ça coûte ?', '💴'),
        w('えき は どこ です か', 'eki wa doko desu ka', 'Where is the station?', 'Où est la gare ?', '🚉'),
        w('トイレ は どこ です か', 'toire wa doko desu ka', 'Where is the toilet?', 'Où sont les toilettes ?', '🚻'),
        w('わたし は がくせい です', 'watashi wa gakusei desu', 'I am a student', 'Je suis étudiant', '🎓'),
        w('にほんご が すこし わかります', 'nihongo ga sukoshi wakarimasu', 'I understand a little Japanese', 'Je comprends un peu le japonais', '🗾'),
      ].map((i) => ({ ...i, tiles: i.text.split(' '), text: i.text.replace(/ /g, '') })),
    },
  ],
};

// ---------- Korean ----------

const jamo = (text: string, roman: string, say: string) => ch(text, roman, { say });
const block = (text: string, roman: string, c: string, v: string) => ({ ...ch(text, roman), parts: [c, v] });

export const KOREAN: Course = {
  id: 'ko',
  name: { en: 'Korean', fr: 'Coréen' },
  native: '한국어',
  flag: '🇰🇷',
  voice: 'ko-KR',
  color: '#3E8BFF',
  units: [
    {
      id: 'ko-cons-1', kind: 'script', script: 'hangul', icon: 'ㄱ', title: { en: 'Consonants ㄱ to ㅅ', fr: 'Consonnes ㄱ à ㅅ' }, can: { en: 'Read and write 7 consonants', fr: 'Lire et écrire 7 consonnes' },
      items: [jamo('ㄱ', 'g / k', '가'), jamo('ㄴ', 'n', '나'), jamo('ㄷ', 'd / t', '다'), jamo('ㄹ', 'r / l', '라'), jamo('ㅁ', 'm', '마'), jamo('ㅂ', 'b / p', '바'), jamo('ㅅ', 's', '사')],
    },
    {
      id: 'ko-vow-1', kind: 'script', script: 'hangul', icon: 'ㅏ', title: { en: 'Vowels ㅏ to ㅣ', fr: 'Voyelles ㅏ à ㅣ' }, can: { en: 'Read and write the 6 basic vowels', fr: 'Lire et écrire les 6 voyelles de base' },
      items: [jamo('ㅏ', 'a', '아'), jamo('ㅓ', 'eo', '어'), jamo('ㅗ', 'o', '오'), jamo('ㅜ', 'u', '우'), jamo('ㅡ', 'eu', '으'), jamo('ㅣ', 'i', '이')],
    },
    {
      id: 'ko-blocks-1', kind: 'blocks', icon: '가', title: { en: 'Build syllables', fr: 'Construire des syllabes' }, can: { en: 'Combine a consonant and a vowel into a syllable', fr: 'Assembler consonne et voyelle en syllabe' },
      items: [block('가', 'ga', 'ㄱ', 'ㅏ'), block('나', 'na', 'ㄴ', 'ㅏ'), block('도', 'do', 'ㄷ', 'ㅗ'), block('러', 'reo', 'ㄹ', 'ㅓ'), block('무', 'mu', 'ㅁ', 'ㅜ'), block('비', 'bi', 'ㅂ', 'ㅣ'), block('소', 'so', 'ㅅ', 'ㅗ'), block('그', 'geu', 'ㄱ', 'ㅡ')],
    },
    {
      id: 'ko-cons-2', kind: 'script', script: 'hangul', icon: 'ㅇ', title: { en: 'Consonants ㅇ to ㅎ', fr: 'Consonnes ㅇ à ㅎ' }, can: { en: 'Read and write all 14 basic consonants', fr: 'Lire et écrire les 14 consonnes de base' },
      items: [jamo('ㅇ', 'silent / ng', '아'), jamo('ㅈ', 'j', '자'), jamo('ㅊ', 'ch', '차'), jamo('ㅋ', 'k', '카'), jamo('ㅌ', 't', '타'), jamo('ㅍ', 'p', '파'), jamo('ㅎ', 'h', '하')],
    },
    {
      id: 'ko-vow-2', kind: 'script', script: 'hangul', icon: 'ㅑ', title: { en: 'Y-vowels', fr: 'Voyelles en Y' }, can: { en: 'Read and write ya, yeo, yo, yu', fr: 'Lire et écrire ya, yeo, yo, yu' },
      items: [jamo('ㅑ', 'ya', '야'), jamo('ㅕ', 'yeo', '여'), jamo('ㅛ', 'yo', '요'), jamo('ㅠ', 'yu', '유')],
    },
    {
      id: 'ko-greet', kind: 'words', icon: '👋', title: { en: 'Greetings', fr: 'Salutations' }, can: { en: 'Greet, thank and apologise', fr: 'Saluer, remercier, s’excuser' },
      items: [
        w('안녕하세요', 'annyeonghaseyo', 'hello', 'bonjour', '👋'),
        w('감사합니다', 'gamsahamnida', 'thank you', 'merci', '🙏'),
        w('죄송합니다', 'joesonghamnida', 'I’m sorry', 'je suis désolé', '🙇'),
        w('네', 'ne', 'yes', 'oui', '✅'),
        w('아니요', 'aniyo', 'no', 'non', '❌'),
        w('안녕히 가세요', 'annyeonghi gaseyo', 'goodbye (to someone leaving)', 'au revoir (à qui s’en va)', '👋'),
      ].map((i) => ({ ...i, tiles: chars(i.text.replace(/ /g, '')) })),
    },
    {
      id: 'ko-blocks-2', kind: 'blocks', icon: '하', title: { en: 'More syllables', fr: 'Plus de syllabes' }, can: { en: 'Read any simple Korean syllable', fr: 'Lire toute syllabe coréenne simple' },
      items: [block('아', 'a', 'ㅇ', 'ㅏ'), block('자', 'ja', 'ㅈ', 'ㅏ'), block('차', 'cha', 'ㅊ', 'ㅏ'), block('코', 'ko', 'ㅋ', 'ㅗ'), block('투', 'tu', 'ㅌ', 'ㅜ'), block('피', 'pi', 'ㅍ', 'ㅣ'), block('하', 'ha', 'ㅎ', 'ㅏ'), block('요', 'yo', 'ㅇ', 'ㅛ')],
    },
    {
      id: 'ko-food', kind: 'words', icon: '🍚', title: { en: 'Food and drinks', fr: 'Nourriture et boissons' }, can: { en: 'Name everyday food', fr: 'Nommer la nourriture courante' },
      items: [
        w('물', 'mul', 'water', 'eau', '💧'), w('밥', 'bap', 'rice / meal', 'riz / repas', '🍚'), w('김치', 'gimchi', 'kimchi', 'kimchi', '🥬'), w('커피', 'keopi', 'coffee', 'café', '☕'),
        w('우유', 'uyu', 'milk', 'lait', '🥛'), w('사과', 'sagwa', 'apple', 'pomme', '🍎'), w('빵', 'ppang', 'bread', 'pain', '🍞'), w('고기', 'gogi', 'meat', 'viande', '🍖'),
      ].map((i) => ({ ...i, tiles: chars(i.text) })),
    },
    {
      id: 'ko-phrases', kind: 'phrases', icon: '💬', title: { en: 'Out and about', fr: 'En voyage' }, can: { en: 'Order, ask prices and directions', fr: 'Commander, demander un prix ou son chemin' },
      items: [
        w('커피 주세요', 'keopi juseyo', 'Coffee, please', 'Un café, s’il vous plaît', '☕'),
        w('이거 얼마예요?', 'igeo eolmayeyo?', 'How much is this?', 'Combien ça coûte ?', '💳'),
        w('화장실 어디예요?', 'hwajangsil eodiyeyo?', 'Where is the toilet?', 'Où sont les toilettes ?', '🚻'),
        w('만나서 반가워요', 'mannaseo bangawoyo', 'Nice to meet you', 'Enchanté', '🤝'),
        w('저는 학생이에요', 'jeoneun haksaeng-ieyo', 'I am a student', 'Je suis étudiant', '🎓'),
      ].map((i) => ({ ...i, tiles: i.text.split(' ') })),
    },
  ],
};

// ---------- Mandarin ----------

const hz = (text: string, roman: string, en: string, fr: string, emoji?: string) => w(text, roman, en, fr, emoji);
const tone = (text: string, roman: string, t: number, en: string, fr: string) => ({ ...w(text, roman, en, fr), tone: t });

export const MANDARIN: Course = {
  id: 'zh',
  name: { en: 'Mandarin Chinese', fr: 'Chinois mandarin' },
  native: '中文',
  flag: '🇨🇳',
  voice: 'zh-CN',
  color: '#F2B84B',
  units: [
    {
      id: 'zh-tones', kind: 'tones', icon: 'ā', title: { en: 'The four tones', fr: 'Les quatre tons' }, can: { en: 'Hear the difference between the 4 tones', fr: 'Entendre la différence entre les 4 tons' },
      items: [tone('妈', 'mā', 1, 'mother', 'mère'), tone('麻', 'má', 2, 'hemp', 'chanvre'), tone('马', 'mǎ', 3, 'horse', 'cheval'), tone('骂', 'mà', 4, 'to scold', 'gronder'), tone('书', 'shū', 1, 'book', 'livre'), tone('茶', 'chá', 2, 'tea', 'thé'), tone('好', 'hǎo', 3, 'good', 'bon'), tone('是', 'shì', 4, 'to be', 'être')],
    },
    {
      id: 'zh-num', kind: 'script', script: 'hanzi', icon: '一', title: { en: 'Numbers 1–10', fr: 'Nombres 1 à 10' }, can: { en: 'Count to ten and write the numbers', fr: 'Compter jusqu’à dix et écrire les nombres' },
      items: [
        hz('一', 'yī', 'one', 'un', '1️⃣'), hz('二', 'èr', 'two', 'deux', '2️⃣'), hz('三', 'sān', 'three', 'trois', '3️⃣'), hz('四', 'sì', 'four', 'quatre', '4️⃣'), hz('五', 'wǔ', 'five', 'cinq', '5️⃣'),
        hz('六', 'liù', 'six', 'six', '6️⃣'), hz('七', 'qī', 'seven', 'sept', '7️⃣'), hz('八', 'bā', 'eight', 'huit', '8️⃣'), hz('九', 'jiǔ', 'nine', 'neuf', '9️⃣'), hz('十', 'shí', 'ten', 'dix', '🔟'),
      ],
    },
    {
      id: 'zh-nature', kind: 'script', script: 'hanzi', icon: '山', title: { en: 'Picture characters', fr: 'Caractères-images' }, can: { en: 'Recognise characters that started as pictures', fr: 'Reconnaître des caractères nés de dessins' },
      items: [hz('人', 'rén', 'person', 'personne', '🧍'), hz('大', 'dà', 'big', 'grand', '🐘'), hz('小', 'xiǎo', 'small', 'petit', '🐭'), hz('口', 'kǒu', 'mouth', 'bouche', '👄'), hz('日', 'rì', 'sun / day', 'soleil / jour', '☀️'), hz('月', 'yuè', 'moon / month', 'lune / mois', '🌙'), hz('山', 'shān', 'mountain', 'montagne', '⛰️'), hz('水', 'shuǐ', 'water', 'eau', '💧'), hz('火', 'huǒ', 'fire', 'feu', '🔥'), hz('木', 'mù', 'tree / wood', 'arbre / bois', '🌳')],
    },
    {
      id: 'zh-greet', kind: 'words', icon: '👋', title: { en: 'Greetings', fr: 'Salutations' }, can: { en: 'Greet, thank and apologise', fr: 'Saluer, remercier, s’excuser' },
      items: [
        hz('你好', 'nǐ hǎo', 'hello', 'bonjour', '👋'), hz('谢谢', 'xièxie', 'thank you', 'merci', '🙏'), hz('再见', 'zàijiàn', 'goodbye', 'au revoir', '👋'),
        hz('对不起', 'duìbuqǐ', 'sorry', 'pardon', '🙇'), hz('没关系', 'méi guānxi', 'it’s OK', 'ce n’est rien', '👌'), hz('早上好', 'zǎoshang hǎo', 'good morning', 'bonjour (le matin)', '🌅'),
      ].map((i) => ({ ...i, tiles: chars(i.text) })),
    },
    {
      id: 'zh-people', kind: 'script', script: 'hanzi', icon: '我', title: { en: 'Me, you and more', fr: 'Moi, toi et plus' }, can: { en: 'Write I, you, good, not, love…', fr: 'Écrire je, tu, bon, ne pas, aimer…' },
      items: [hz('我', 'wǒ', 'I / me', 'je / moi', '🙋'), hz('你', 'nǐ', 'you', 'tu', '🫵'), hz('他', 'tā', 'he', 'il', '👨'), hz('好', 'hǎo', 'good', 'bon', '👍'), hz('是', 'shì', 'to be', 'être', '🟰'), hz('不', 'bù', 'not', 'ne… pas', '🚫'), hz('中', 'zhōng', 'middle', 'milieu', '🎯'), hz('爱', 'ài', 'love', 'amour', '❤️')],
    },
    {
      id: 'zh-food', kind: 'words', icon: '🍜', title: { en: 'Food and drinks', fr: 'Nourriture et boissons' }, can: { en: 'Name everyday food', fr: 'Nommer la nourriture courante' },
      items: [
        hz('茶', 'chá', 'tea', 'thé', '🍵'), hz('米饭', 'mǐfàn', 'cooked rice', 'riz cuit', '🍚'), hz('面条', 'miàntiáo', 'noodles', 'nouilles', '🍜'), hz('苹果', 'píngguǒ', 'apple', 'pomme', '🍎'),
        hz('咖啡', 'kāfēi', 'coffee', 'café', '☕'), hz('鸡蛋', 'jīdàn', 'egg', 'œuf', '🥚'), hz('鱼', 'yú', 'fish', 'poisson', '🐟'), hz('牛奶', 'niúnǎi', 'milk', 'lait', '🥛'),
      ].map((i) => ({ ...i, tiles: chars(i.text) })),
    },
    {
      id: 'zh-phrases', kind: 'phrases', icon: '💬', title: { en: 'Out and about', fr: 'En voyage' }, can: { en: 'Order, ask prices and directions', fr: 'Commander, demander un prix ou son chemin' },
      items: [
        w('我 要 一杯 咖啡', 'wǒ yào yì bēi kāfēi', 'I’d like a coffee', 'Je voudrais un café', '☕'),
        w('这 是 什么', 'zhè shì shénme?', 'What is this?', 'Qu’est-ce que c’est ?', '❓'),
        w('多少 钱', 'duōshao qián?', 'How much is it?', 'Combien ça coûte ?', '💴'),
        w('厕所 在 哪儿', 'cèsuǒ zài nǎr?', 'Where is the toilet?', 'Où sont les toilettes ?', '🚻'),
        w('我 是 学生', 'wǒ shì xuésheng', 'I am a student', 'Je suis étudiant', '🎓'),
      ].map((i) => ({ ...i, tiles: i.text.split(' '), text: i.text.replace(/ /g, '') })),
    },
  ],
};

// ---------- Spanish ----------

const sw = (text: string, roman: string, en: string, fr: string, emoji?: string) => w(text, roman, en, fr, emoji);

export const SPANISH: Course = {
  id: 'es',
  name: { en: 'Spanish', fr: 'Espagnol' },
  native: 'Español',
  flag: '🇪🇸',
  voice: 'es-ES',
  color: '#FFB547',
  units: [
    {
      id: 'es-sounds', kind: 'accents', icon: 'ñ', title: { en: 'Sounds and accents', fr: 'Sons et accents' }, can: { en: 'Spell and say ñ, ll, rr and accents', fr: 'Écrire et dire ñ, ll, rr et les accents' },
      items: [sw('niño', 'NEE-nyo', 'child', 'enfant', '🧒'), sw('mañana', 'ma-NYA-na', 'tomorrow / morning', 'demain / matin', '🌅'), sw('llave', 'YA-veh', 'key', 'clé', '🔑'), sw('perro', 'PEH-rro (rolled r)', 'dog', 'chien', '🐕'), sw('canción', 'kan-THYON', 'song', 'chanson', '🎵'), sw('café', 'ka-FEH', 'coffee', 'café', '☕'), sw('árbol', 'AR-bol', 'tree', 'arbre', '🌳'), sw('jamón', 'ha-MON', 'ham', 'jambon', '🍖')],
    },
    {
      id: 'es-greet', kind: 'words', icon: '👋', title: { en: 'Greetings', fr: 'Salutations' }, can: { en: 'Greet people and be polite', fr: 'Saluer et être poli' },
      items: [sw('hola', 'OH-la', 'hello', 'bonjour / salut', '👋'), sw('buenos días', 'BWEH-nos DEE-as', 'good morning', 'bonjour (le matin)', '🌅'), sw('buenas noches', 'BWEH-nas NO-ches', 'good night', 'bonne nuit', '🌙'), sw('gracias', 'GRA-thyas', 'thank you', 'merci', '🙏'), sw('por favor', 'por fa-VOR', 'please', 's’il vous plaît', '🙂'), sw('adiós', 'a-DYOS', 'goodbye', 'au revoir', '👋'), sw('de nada', 'deh NA-da', 'you’re welcome', 'de rien', '😊'), sw('perdón', 'per-DON', 'sorry', 'pardon', '🙇')],
    },
    {
      id: 'es-food', kind: 'words', icon: '🥘', title: { en: 'Food and drinks', fr: 'Nourriture et boissons' }, can: { en: 'Name everyday food', fr: 'Nommer la nourriture courante' },
      items: [sw('agua', 'A-gwa', 'water', 'eau', '💧'), sw('pan', 'pan', 'bread', 'pain', '🍞'), sw('manzana', 'man-THA-na', 'apple', 'pomme', '🍎'), sw('queso', 'KEH-so', 'cheese', 'fromage', '🧀'), sw('pescado', 'pes-KA-do', 'fish', 'poisson', '🐟'), sw('huevo', 'WEH-vo', 'egg', 'œuf', '🥚'), sw('leche', 'LEH-cheh', 'milk', 'lait', '🥛'), sw('arroz', 'a-RROTH', 'rice', 'riz', '🍚')],
    },
    {
      id: 'es-num', kind: 'words', icon: '🔢', title: { en: 'Numbers 1–10', fr: 'Nombres 1 à 10' }, can: { en: 'Count to ten', fr: 'Compter jusqu’à dix' },
      items: [sw('uno', 'OO-no', 'one', 'un', '1️⃣'), sw('dos', 'dos', 'two', 'deux', '2️⃣'), sw('tres', 'tres', 'three', 'trois', '3️⃣'), sw('cuatro', 'KWA-tro', 'four', 'quatre', '4️⃣'), sw('cinco', 'THEEN-ko', 'five', 'cinq', '5️⃣'), sw('seis', 'says', 'six', 'six', '6️⃣'), sw('siete', 'SYEH-teh', 'seven', 'sept', '7️⃣'), sw('ocho', 'OH-cho', 'eight', 'huit', '8️⃣'), sw('nueve', 'NWEH-veh', 'nine', 'neuf', '9️⃣'), sw('diez', 'dyeth', 'ten', 'dix', '🔟')],
    },
    {
      id: 'es-family', kind: 'words', icon: '👪', title: { en: 'Family', fr: 'Famille' }, can: { en: 'Talk about your family', fr: 'Parler de sa famille' },
      items: [sw('madre', 'MA-dreh', 'mother', 'mère', '👩'), sw('padre', 'PA-dreh', 'father', 'père', '👨'), sw('hermano', 'er-MA-no', 'brother', 'frère', '👦'), sw('hermana', 'er-MA-na', 'sister', 'sœur', '👧'), sw('hijo', 'EE-ho', 'son', 'fils', '👶'), sw('abuela', 'a-BWEH-la', 'grandmother', 'grand-mère', '👵'), sw('amigo', 'a-MEE-go', 'friend', 'ami', '🤝')],
    },
    {
      id: 'es-phrases', kind: 'phrases', icon: '💬', title: { en: 'At the café', fr: 'Au café' }, can: { en: 'Order a coffee and ask the price', fr: 'Commander un café et demander le prix' },
      items: [
        sw('Un café, por favor', 'oon ka-FEH, por fa-VOR', 'A coffee, please', 'Un café, s’il vous plaît', '☕'),
        sw('¿Cuánto cuesta?', 'KWAN-to KWES-ta', 'How much is it?', 'Combien ça coûte ?', '💶'),
        sw('¿Dónde está el baño?', 'DON-deh es-TA el BA-nyo', 'Where is the bathroom?', 'Où sont les toilettes ?', '🚻'),
        sw('Me llamo Ana', 'meh YA-mo A-na', 'My name is Ana', 'Je m’appelle Ana', '🙋'),
        sw('Mucho gusto', 'MOO-cho GOOS-to', 'Nice to meet you', 'Enchanté', '🤝'),
        sw('No entiendo', 'no en-TYEN-do', 'I don’t understand', 'Je ne comprends pas', '🤷'),
      ].map((i) => ({ ...i, tiles: i.text.replace(/[¿?,]/g, '').split(' ') })),
    },
  ],
};

export const COURSES: Course[] = [JAPANESE, KOREAN, MANDARIN, SPANISH, ...MORE_COURSES];
export const courseById = Object.fromEntries(COURSES.map((c) => [c.id, c])) as Record<string, Course>;
