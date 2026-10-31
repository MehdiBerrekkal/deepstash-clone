// Builds the bigger free library from EPUBs:
//   - BUNDLE: Standard Ebooks (standardebooks.org: public-domain texts, CC0 production) and French originals from
//     Project Gutenberg, parsed with the app's own EPUB reader into src/data/classics/<id>.txt like the other classics.
//   - CATALOG: longer works the app downloads on demand from Standard Ebooks (src/data/catalog.json).
// Only works whose authors and translators died more than 70 years ago are listed, so they're public domain in most
// countries, not just the US. Descriptions are our own.
// Usage: node scripts/build-library.js [cacheDir]   (downloads are cached between runs)
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src', 'data', 'classics');
const cacheDir = process.argv[2] ?? path.join(require('os').tmpdir(), 'library-cache');
const UA = 'deepstash-clone library build (personal reading app)';

// shelf: wisdom | lives | ideas | novels | poetry | french
const SE = (slug, topicId, shelf, year, description) => ({ slug, topicId, shelf, year, description });
const BUNDLE = [
  SE('epictetus/discourses/george-long', 'philosophy', 'wisdom', 108, "A former slave's lessons on freedom, recorded by his student: the fullest guide to Stoic practice."),
  SE('boethius/the-consolation-of-philosophy/h-r-james', 'philosophy', 'wisdom', 524, 'Written in prison awaiting execution: Lady Philosophy visits and teaches what fortune can never take away.'),
  SE('david-hume/an-enquiry-concerning-human-understanding', 'philosophy', 'wisdom', 1748, 'How much can we really know? Hume questions cause, habit and certainty with startling clarity.'),
  SE('friedrich-nietzsche/beyond-good-and-evil/helen-zimmern', 'philosophy', 'wisdom', 1886, 'Nietzsche challenges every comfortable belief about truth and morality, in bursts of brilliant aphorism.'),
  SE('g-k-chesterton/orthodoxy', 'philosophy', 'wisdom', 1908, 'A witty, joyful account of how wonder, paradox and common sense shaped one writer’s view of life.'),
  SE('leo-tolstoy/a-confession/aylmer-maude', 'philosophy', 'wisdom', 1882, 'At the height of his fame, Tolstoy asks what gives life meaning, and tells how he searched for an answer.'),
  SE('henry-david-thoreau/essays', 'mindfulness', 'wisdom', 1862, "Thoreau's shorter writings, including Walking and Civil Disobedience: on nature, conscience and simple living."),
  SE('william-james/pragmatism', 'psychology', 'ideas', 1907, 'The founder of American psychology argues that ideas should be judged by the difference they make in life.'),
  SE('charles-darwin/the-origin-of-species', 'science', 'ideas', 1859, 'The book that explained how life changes: patient observations building to the theory of natural selection.'),
  SE('edwin-a-abbott/flatland', 'science', 'ideas', 1884, 'A square in a two-dimensional world discovers a third dimension: a playful, mind-stretching classic.'),
  SE('booker-t-washington/up-from-slavery', 'history', 'lives', 1901, 'From enslaved child to founder of a college: a story of education, work and unshakable determination.'),
  SE('frederick-douglass/narrative-of-the-life-of-frederick-douglass', 'history', 'lives', 1845, 'Douglass tells how he learned to read, escaped slavery and found his voice: short, fierce and unforgettable.'),
  SE('mahatma-gandhi/the-story-of-my-experiments-with-truth/mahadev-desai', 'history', 'lives', 1927, 'Gandhi’s own account of his life as a series of honest experiments with truth, diet, faith and nonviolence.'),
  SE('joshua-slocum/sailing-alone-around-the-world', 'history', 'lives', 1900, 'The first person to sail alone around the globe tells the tale with humour, grit and wonder.'),
  SE('charles-dickens/a-christmas-carol', 'creativity', 'novels', 1843, 'A miser, three ghosts and one long night: the most beloved story of a change of heart.'),
  SE('charles-dickens/great-expectations', 'creativity', 'novels', 1861, 'An orphan’s rise into a world of money and secrets, and what he learns about loyalty and love.'),
  SE('charles-dickens/a-tale-of-two-cities', 'history', 'novels', 1859, 'London and Paris in the French Revolution: sacrifice, revenge and redemption in Dickens’s great historical novel.'),
  SE('fyodor-dostoevsky/notes-from-underground/constance-garnett', 'psychology', 'novels', 1864, 'A bitter, brilliant narrator argues with the reader, and with himself, about free will and spite.'),
  SE('mark-twain/the-adventures-of-huckleberry-finn', 'creativity', 'novels', 1884, 'A boy and an escaped slave drift down the Mississippi in America’s great novel of friendship and conscience.'),
  SE('mark-twain/the-adventures-of-tom-sawyer', 'creativity', 'novels', 1876, 'Mischief, treasure and boyhood adventure on the banks of the Mississippi.'),
  SE('oscar-wilde/the-picture-of-dorian-gray', 'psychology', 'novels', 1890, 'A beautiful young man stays young while his portrait ages with every sin: Wilde’s dazzling moral fable.'),
  SE('arthur-conan-doyle/the-adventures-of-sherlock-holmes', 'creativity', 'novels', 1892, 'Twelve cases for the world’s most famous detective, and the stories that made him a legend.'),
  SE('arthur-conan-doyle/the-hound-of-the-baskervilles', 'creativity', 'novels', 1902, 'A family curse, a spectral hound and the misty moors: Holmes’s most famous case.'),
  SE('jules-verne/around-the-world-in-eighty-days/george-makepeace-towle', 'creativity', 'novels', 1872, 'A precise English gentleman bets his fortune that he can circle the globe in eighty days.'),
  SE('jules-verne/journey-to-the-center-of-the-earth/f-a-malleson', 'science', 'novels', 1864, 'A professor, his nephew and a guide descend into an Icelandic volcano toward the heart of the Earth.'),
  SE('h-g-wells/the-time-machine', 'science', 'novels', 1895, 'A Victorian inventor travels to the far future and discovers what has become of humanity.'),
  SE('h-g-wells/the-war-of-the-worlds', 'science', 'novels', 1898, 'Martians land in the English countryside: the original alien-invasion story.'),
  SE('jane-austen/emma', 'relationships', 'novels', 1815, 'A clever, well-meaning matchmaker learns, slowly and comically, how little she understands her own heart.'),
  SE('jane-austen/persuasion', 'relationships', 'novels', 1817, 'A second chance at love, eight years after a broken engagement: Austen’s most tender novel.'),
  SE('charlotte-bronte/jane-eyre', 'relationships', 'novels', 1847, 'An orphan governess insists on her own worth, and on love on equal terms.'),
  SE('emily-bronte/wuthering-heights', 'relationships', 'novels', 1847, 'A wild, obsessive love story on the Yorkshire moors, told across two generations.'),
  SE('robert-louis-stevenson/the-strange-case-of-dr-jekyll-and-mr-hyde', 'psychology', 'novels', 1886, 'A respected doctor and his monstrous other self: the classic tale of the divided mind.'),
  SE('robert-louis-stevenson/treasure-island', 'creativity', 'novels', 1883, 'A boy, a treasure map and Long John Silver: the adventure that defined pirates forever.'),
  SE('f-scott-fitzgerald/the-great-gatsby', 'money', 'novels', 1925, 'Wealth, longing and illusion in the Jazz Age, through the eyes of Gatsby’s neighbour.'),
  SE('virginia-woolf/mrs-dalloway', 'mindfulness', 'novels', 1925, 'One June day in London, as a woman prepares for a party: Woolf’s luminous novel of the inner life.'),
  SE('jack-london/the-call-of-the-wild', 'creativity', 'novels', 1903, 'A domestic dog is stolen and taken to the Yukon, where he learns to survive and answers an ancient call.'),
  SE('jonathan-swift/gullivers-travels', 'creativity', 'novels', 1726, 'Tiny people, giants and talking horses: a voyage that slyly satirises human pride.'),
  SE('voltaire/candide/the-modern-library', 'philosophy', 'novels', 1759, 'A cheerful optimist suffers every disaster imaginable: Voltaire’s quick, savage, funny satire.'),
  SE('kenneth-grahame/the-wind-in-the-willows', 'creativity', 'novels', 1908, 'Mole, Rat, Badger and the irrepressible Toad: friendship and adventure along the riverbank.'),
  SE('l-m-montgomery/anne-of-green-gables', 'relationships', 'novels', 1908, 'A talkative, imaginative orphan wins over a quiet Prince Edward Island farm and everyone around it.'),
  SE('frances-hodgson-burnett/the-secret-garden', 'mindfulness', 'novels', 1911, 'Two lonely children bring a locked, forgotten garden back to life, and themselves with it.'),
  SE('gustave-flaubert/madame-bovary/eleanor-marx-aveling', 'relationships', 'novels', 1857, 'A doctor’s wife dreams of romance and luxury in provincial France, with ruinous results.'),
  SE('anton-chekhov/short-fiction/constance-garnett', 'creativity', 'novels', 1900, 'Chekhov’s stories: small, quiet moments that reveal whole lives, written with endless compassion.'),
  SE('walt-whitman/leaves-of-grass', 'poetry', 'poetry', 1855, 'Whitman’s lifelong book of poems celebrating the self, democracy, the body and the open road.'),
  SE('john-keats/poetry', 'poetry', 'poetry', 1820, 'The odes, sonnets and narrative poems of the Romantic poet who died at twenty-five.'),
  SE('william-shakespeare/poetry', 'poetry', 'poetry', 1609, 'All of Shakespeare’s sonnets and longer poems: love, time, beauty and mortality.'),
  SE('w-b-yeats/poetry', 'poetry', 'poetry', 1933, 'Yeats’s poems, from the dreamy Irish lyrics of his youth to the hard, magnificent late work.'),
  SE('edgar-allan-poe/poetry', 'poetry', 'poetry', 1845, 'The Raven, Annabel Lee and the rest of Poe’s haunting, musical verse.'),
  SE('william-shakespeare/hamlet', 'poetry', 'poetry', 1603, 'A prince, a ghost and a question of revenge: Shakespeare’s most famous tragedy.'),
  SE('william-shakespeare/macbeth', 'poetry', 'poetry', 1623, 'Ambition, prophecy and guilt: a brave soldier talks himself into murder.'),
  SE('william-shakespeare/romeo-and-juliet', 'poetry', 'poetry', 1597, 'Two young lovers from feuding families, and the few days that change everything.'),
  SE('sophocles/oedipus-rex/francis-storr', 'poetry', 'poetry', -429, 'A king hunts for the cause of a plague, and discovers the terrible truth about himself.'),
];

// French originals, in French, from Project Gutenberg.
const GB = (gutenberg, id, title, author, year, topicId, description) => ({ gutenberg, id, title, author, year, topicId, shelf: 'french', description, lang: 'fr' });
const FRENCH = [
  GB(4650, 'fr-candide', "Candide, ou l'optimisme", 'Voltaire', 1759, 'philosophy', 'Le conte philosophique le plus vif de Voltaire : un optimiste naïf traverse toutes les catastrophes du monde.'),
  GB(6099, 'fr-fleurs-du-mal', 'Les Fleurs du mal', 'Charles Baudelaire', 1857, 'poetry', 'Le recueil qui a changé la poésie : beauté, mélancolie et modernité de Paris.'),
  GB(14155, 'fr-madame-bovary', 'Madame Bovary', 'Gustave Flaubert', 1857, 'relationships', 'Les rêves romanesques d’Emma Bovary se heurtent à la vie de province : un chef-d’œuvre du réalisme.'),
  GB(800, 'fr-tour-du-monde', 'Le Tour du monde en quatre-vingts jours', 'Jules Verne', 1872, 'creativity', 'Phileas Fogg parie sa fortune qu’il fera le tour du globe en quatre-vingts jours.'),
  GB(4791, 'fr-voyage-centre-terre', 'Voyage au centre de la Terre', 'Jules Verne', 1864, 'science', 'Un professeur, son neveu et un guide descendent dans un volcan islandais jusqu’au cœur de la Terre.'),
  GB(13951, 'fr-trois-mousquetaires', 'Les Trois Mousquetaires', 'Alexandre Dumas', 1844, 'creativity', 'D’Artagnan rejoint Athos, Porthos et Aramis : duels, intrigues et amitié à la cour de Louis XIII.'),
  GB(13846, 'fr-discours-methode', 'Discours de la méthode', 'René Descartes', 1637, 'philosophy', 'Descartes cherche une méthode sûre pour bien conduire sa raison : le texte fondateur de la pensée moderne.'),
  GB(798, 'fr-rouge-et-noir', 'Le Rouge et le Noir', 'Stendhal', 1830, 'psychology', 'L’ascension et la chute de Julien Sorel, jeune ambitieux dans la France de la Restauration.'),
  GB(5711, 'fr-germinal', 'Germinal', 'Émile Zola', 1885, 'history', 'La vie des mineurs du Nord et une grève qui gronde : le grand roman social de Zola.'),
  GB(19657, 'fr-notre-dame-de-paris', 'Notre-Dame de Paris', 'Victor Hugo', 1831, 'history', 'Esmeralda, Quasimodo et Frollo autour de la cathédrale, dans le Paris du XVe siècle.'),
  GB(56327, 'fr-fables-la-fontaine', 'Fables', 'Jean de La Fontaine', 1668, 'poetry', 'Le corbeau, le renard, la cigale et la fourmi : des fables pleines d’esprit et de sagesse.'),
  GB(6838, 'fr-dernier-jour-condamne', 'Le Dernier Jour d’un condamné', 'Victor Hugo', 1829, 'philosophy', 'Les dernières heures d’un homme condamné à mort : un plaidoyer bouleversant contre la peine capitale.'),
  GB(2650, 'fr-du-cote-de-chez-swann', 'Du côté de chez Swann', 'Marcel Proust', 1913, 'mindfulness', 'Le premier tome de la Recherche : la mémoire, le temps et la fameuse madeleine.'),
];

// Long works downloaded on demand (Standard Ebooks allows it from browsers as well as phones).
const CATALOG = [
  SE('adam-smith/the-wealth-of-nations', 'money', 'ideas', 1776, 'The founding book of economics: how markets, specialisation and trade create the wealth of nations.'),
  SE('adam-smith/the-theory-of-moral-sentiments', 'psychology', 'ideas', 1759, 'Before economics, Smith wrote this: how sympathy and the imagined impartial spectator shape our morals.'),
  SE('plato/dialogues/benjamin-jowett', 'philosophy', 'wisdom', -380, 'Socrates questions, provokes and teaches across Plato’s dialogues on love, justice, death and knowledge.'),
  SE('herodotus/histories/g-c-macaulay', 'history', 'lives', -430, 'The first great work of history: the Persian Wars, and the customs, myths and marvels of the ancient world.'),
  SE('thucydides/history-of-the-peloponnesian-war/richard-crawley', 'history', 'lives', -400, 'Athens against Sparta, told by a general who lived through it: power, fear and politics laid bare.'),
  SE('edward-gibbon/the-history-of-the-decline-and-fall-of-the-roman-empire', 'history', 'lives', 1776, 'Gibbon’s monumental, ironic history of how Rome fell over thirteen centuries.'),
  SE('ulysses-s-grant/personal-memoirs-of-ulysses-s-grant', 'leadership', 'lives', 1885, 'The Union general and president writes plainly and brilliantly about war and command.'),
  SE('charles-darwin/the-voyage-of-the-beagle', 'science', 'ideas', 1839, 'Young Darwin’s five-year voyage around the world: the journey that sparked his great idea.'),
  SE('william-james/the-varieties-of-religious-experience', 'psychology', 'ideas', 1902, 'A psychologist studies conversion, mysticism and saintliness with curiosity and respect.'),
  SE('fyodor-dostoevsky/crime-and-punishment/constance-garnett', 'psychology', 'novels', 1866, 'A poor student commits a murder to prove a theory, and cannot escape his conscience.'),
  SE('fyodor-dostoevsky/the-brothers-karamazov/constance-garnett', 'philosophy', 'novels', 1880, 'Three brothers, a murdered father and the deepest questions about faith, freedom and love.'),
  SE('leo-tolstoy/anna-karenina/constance-garnett', 'relationships', 'novels', 1878, 'A passionate affair defies Russian society, set against a quieter story of a man searching for meaning.'),
  SE('herman-melville/moby-dick', 'creativity', 'novels', 1851, 'Captain Ahab’s obsessive hunt for the white whale: an epic of the sea and the human mind.'),
  SE('george-eliot/middlemarch', 'relationships', 'novels', 1872, 'The hopes and compromises of a whole English town, in what many call the greatest English novel.'),
  SE('victor-hugo/les-miserables/isabel-f-hapgood', 'history', 'novels', 1862, 'Jean Valjean, the relentless Javert and the barricades of Paris: Hugo’s vast novel of justice and mercy.'),
  SE('victor-hugo/notre-dame-de-paris/isabel-f-hapgood', 'history', 'novels', 1831, 'Esmeralda, Quasimodo and the cathedral that watches over medieval Paris.'),
  SE('alexandre-dumas/the-count-of-monte-cristo/chapman-and-hall', 'creativity', 'novels', 1844, 'Betrayed and imprisoned, Edmond Dantès escapes with a fortune and a plan for revenge.'),
  SE('alexandre-dumas/the-three-musketeers/william-robson', 'creativity', 'novels', 1844, 'D’Artagnan and the musketeers: swordfights, intrigue and friendship in the France of Louis XIII.'),
  SE('miguel-de-cervantes-saavedra/don-quixote/john-ormsby', 'creativity', 'novels', 1605, 'A man who has read too many romances becomes a knight, with his loyal squire Sancho Panza.'),
  SE('homer/the-odyssey/william-cullen-bryant', 'poetry', 'poetry', -700, 'Odysseus’s ten-year voyage home from Troy: monsters, gods and a faithful wife.'),
  SE('homer/the-iliad/william-cullen-bryant', 'poetry', 'poetry', -750, 'The rage of Achilles and the last weeks of the Trojan War.'),
  SE('dante-alighieri/the-divine-comedy/henry-wadsworth-longfellow', 'poetry', 'poetry', 1320, 'Dante’s journey through Hell, Purgatory and Paradise, in Longfellow’s translation.'),
  SE('john-milton/paradise-lost', 'poetry', 'poetry', 1667, 'The fall of Satan and of humankind, in the grandest epic poem in English.'),
  SE('virgil/the-aeneid/john-dryden', 'poetry', 'poetry', -19, 'Aeneas flees burning Troy to found Rome: Virgil’s epic of duty and destiny.'),
  SE('geoffrey-chaucer/the-canterbury-tales', 'poetry', 'poetry', 1400, 'Pilgrims on the road to Canterbury tell bawdy, wise and wonderful tales.'),
  SE('thomas-hobbes/leviathan', 'philosophy', 'ideas', 1651, 'Life without government would be nasty, brutish and short: Hobbes’s case for the social contract.'),
  SE('john-locke/two-treatises-of-government', 'philosophy', 'ideas', 1689, 'Natural rights, property and the consent of the governed: the ideas behind modern democracy.'),
  SE('david-hume/a-treatise-of-human-nature', 'philosophy', 'wisdom', 1739, 'Hume’s ambitious early work on the mind, the passions and morality.'),
  SE('mary-wollstonecraft/a-vindication-of-the-rights-of-woman', 'history', 'ideas', 1792, 'A passionate, reasoned argument for women’s education and equality.'),
  SE('louisa-may-alcott/little-women', 'relationships', 'novels', 1868, 'Four sisters grow up during the American Civil War, each finding her own path.'),
  SE('nathaniel-hawthorne/the-scarlet-letter', 'psychology', 'novels', 1850, 'A woman marked for adultery in Puritan New England, and the hidden guilt of others.'),
  SE('bram-stoker/dracula', 'creativity', 'novels', 1897, 'The count from Transylvania arrives in England, told in letters, diaries and newspaper clippings.'),
  SE('charles-dickens/david-copperfield', 'creativity', 'novels', 1850, 'Dickens’s most personal novel: a boy’s journey through hardship, friendship and love to adulthood.'),
  SE('charles-dickens/oliver-twist', 'creativity', 'novels', 1838, 'An orphan falls among London pickpockets in Dickens’s vivid attack on poverty and cruelty.'),
  SE('william-makepeace-thackeray/vanity-fair', 'money', 'novels', 1848, 'Clever, ruthless Becky Sharp climbs through high society in a sparkling satire of ambition.'),
  SE('thomas-hardy/tess-of-the-durbervilles', 'relationships', 'novels', 1891, 'A young woman’s struggle against fate and the hypocrisy of Victorian England.'),
  SE('rudyard-kipling/the-jungle-book', 'creativity', 'novels', 1894, 'Mowgli, raised by wolves, learns the law of the jungle from Baloo and Bagheera.'),
  SE('james-joyce/dubliners', 'creativity', 'novels', 1914, 'Fifteen stories of ordinary Dublin lives, each ending in a quiet moment of revelation.'),
  SE('james-joyce/ulysses', 'creativity', 'novels', 1922, 'One day in Dublin, 16 June 1904, told in every style imaginable: the great modernist novel.'),
  SE('jane-austen/sense-and-sensibility', 'relationships', 'novels', 1811, 'Two sisters, one sensible and one romantic, face love, money and heartbreak.'),
  SE('edith-wharton/the-age-of-innocence', 'relationships', 'novels', 1920, 'A New York gentleman torn between duty and passion in the gilded society of the 1870s.'),
  SE('marcel-proust/in-search-of-lost-time/c-k-scott-moncrieff', 'mindfulness', 'novels', 1913, 'Proust’s vast exploration of memory, time, love and art, in Scott Moncrieff’s translation.'),
];

const DROP_TITLES = /^(titlepage|colophon|uncopyright|imprint|table of contents|contents|loi|licence|license)$/i;
const GUTENBERG_NOISE = /project gutenberg|gutenberg\.org|\*\*\* ?(start|end) of (the|this)|gutenberg-tm|www\.gutenberg/i;

const seUrls = (slug) => ({
  // ?source=download returns the file itself; without it Standard Ebooks shows a thank-you page.
  epub: `https://standardebooks.org/ebooks/${slug}/downloads/${slug.replace(/\//g, '_')}.epub?source=download`,
  cover: `https://standardebooks.org/ebooks/${slug}/downloads/cover-thumbnail.jpg`,
  homepage: `https://standardebooks.org/ebooks/${slug}`,
});
const seId = (slug) => slug.split('/').slice(0, 2).join('-');

async function fetchCached(url, name) {
  fs.mkdirSync(cacheDir, { recursive: true });
  const file = path.join(cacheDir, name);
  if (fs.existsSync(file) && fs.statSync(file).size > 1000) return fs.readFileSync(file);
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // EPUBs are zip files; anything else (an HTML page, an error) must not be cached as a book.
  if (buf[0] !== 0x50 || buf[1] !== 0x4b) throw new Error(`not an EPUB: ${url}`);
  fs.writeFileSync(file, buf);
  await new Promise((r) => setTimeout(r, 800)); // be polite to small volunteer-run sites
  return buf;
}

function clean(book) {
  const chapters = book.chapters
    .filter((c) => !DROP_TITLES.test(c.title.trim()) && !/gutenberg|licen[cs]e/i.test(c.title))
    .map((c) => ({ title: c.title, paragraphs: c.paragraphs.filter((p) => !GUTENBERG_NOISE.test(p)) }))
    .filter((c) => c.paragraphs.join(' ').length > 40);
  return chapters;
}

/** Pull a title and author out of an EPUB's own metadata when we didn't specify them. */
function authorOf(parsed) {
  return parsed.author.replace(/\s+/g, ' ').trim();
}

(async () => {
  const { parseEpub } = await import(pathToFileURL(path.join(root, 'src', 'lib', 'epub.ts')).href);
  const added = [];

  for (const b of BUNDLE) {
    const id = seId(b.slug);
    const urls = seUrls(b.slug);
    try {
      const parsed = await parseEpub(await fetchCached(urls.epub, `${id}.epub`), `${id}.epub`);
      const chapters = clean(parsed);
      const words = chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0);
      fs.writeFileSync(path.join(outDir, `${id}.txt`), JSON.stringify({ chapters }));
      const translator = b.slug.split('/')[2];
      added.push({
        id, origin: 'library', shelf: b.shelf, title: parsed.title, author: authorOf(parsed),
        ...(translator ? { translator: translator.split('-').map((w) => (w.length > 1 ? w[0].toUpperCase() + w.slice(1) : w.toUpperCase() + '.')).join(' ') } : {}),
        year: b.year, topicId: b.topicId, description: b.description, license: 'Public domain',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', homepage: urls.homepage, coverUrl: urls.cover,
        source: 'Standard Ebooks', chapters: chapters.length, words,
      });
      console.log(`ok  ${id}: ${chapters.length} ch, ${words} words`);
    } catch (e) {
      console.log(`FAIL ${id}: ${e.message}`);
    }
  }

  for (const b of FRENCH) {
    try {
      const parsed = await parseEpub(
        await fetchCached(`https://www.gutenberg.org/ebooks/${b.gutenberg}.epub.noimages`, `gutenberg-${b.gutenberg}.epub`),
        `${b.id}.epub`,
      );
      const chapters = clean(parsed);
      const words = chapters.reduce((n, c) => n + c.paragraphs.join(' ').split(/\s+/).length, 0);
      fs.writeFileSync(path.join(outDir, `${b.id}.txt`), JSON.stringify({ chapters }));
      const { gutenberg, ...meta } = b;
      added.push({
        ...meta, origin: 'library', gutenberg, license: 'Public domain', homepage: `https://www.gutenberg.org/ebooks/${gutenberg}`,
        coverUrl: `https://www.gutenberg.org/cache/epub/${gutenberg}/pg${gutenberg}.cover.medium.jpg`, source: 'Project Gutenberg',
        chapters: chapters.length, words,
      });
      console.log(`ok  ${b.id}: ${chapters.length} ch, ${words} words`);
    } catch (e) {
      console.log(`FAIL ${b.id}: ${e.message}`);
    }
  }

  // Catalog entries are only described here; the app downloads the EPUB when someone opens one.
  const catalog = CATALOG.map((b) => {
    const urls = seUrls(b.slug);
    const [author, title, translator] = b.slug.split('/');
    const words = (s) => s.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    return {
      id: seId(b.slug), origin: 'catalog', shelf: b.shelf, title: words(title).replace(/\b(Of|The|And|A|In|To|On)\b(?!^)/g, (m, _w, i) => (i ? m.toLowerCase() : m)),
      author: words(author), ...(translator ? { translator: words(translator) } : {}), year: b.year, topicId: b.topicId,
      description: b.description, license: 'Public domain', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
      homepage: urls.homepage, coverUrl: urls.cover, epubUrl: urls.epub, source: 'Standard Ebooks', chapters: 0, words: 0,
    };
  });

  const indexFile = path.join(outDir, 'index.json');
  const index = JSON.parse(fs.readFileSync(indexFile, 'utf8')).filter((b) => b.origin !== 'library');
  const merged = [...index, ...added];
  fs.writeFileSync(indexFile, JSON.stringify(merged, null, 2) + '\n');
  fs.writeFileSync(path.join(root, 'src', 'data', 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n');
  const lines = merged.map((b) => `  '${b.id}': require('./${b.id}.txt'),`).join('\n');
  fs.writeFileSync(
    path.join(outDir, 'assets.ts'),
    `// Generated by scripts/build-classics.js, build-books.js and build-library.js. Metro bundles each book as an asset that the reader loads on demand.\n/* eslint-disable @typescript-eslint/no-require-imports */\nexport const classicAssets: Record<string, number> = {\n${lines}\n};\n`,
  );
  console.log(`Bundled ${added.length} new books (${merged.length} in total); ${catalog.length} more to download on demand.`);
})();
