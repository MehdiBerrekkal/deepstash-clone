import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Dutch, A1 → B1, for English speakers. Original content written for this app. Lines are "woord|English|emoji|example|example in English". */
function w5(block: string): Word[] {
  return block
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [text, en, emoji, ex, exEn] = l.split('|').map((x) => x.trim());
      return { text, en, fr: en, emoji: emoji || '•', ...(ex ? { ex, exEn, exFr: exEn } : {}) };
    });
}
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `nl-${id}`, level, icon, en, fr, words: w5(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
hallo|hello|👋|Hallo, ik ben Sanne.|Hello, I’m Sanne.
goedemorgen|good morning|🌅|Goedemorgen, meneer De Vries!|Good morning, Mr De Vries!
goedenavond|good evening|🌆|Goedenavond, welkom.|Good evening, welcome.
doei|bye|🫡|Doei, tot morgen!|Bye, see you tomorrow!
dank je wel|thank you|🙏|Dank je wel!|Thank you!
alsjeblieft|please / here you are|🥺|Een koffie, alsjeblieft.|A coffee, please.
sorry|sorry|😅|Sorry, ik ben te laat.|Sorry, I’m late.
aangenaam|nice to meet you|🤝|Aangenaam, ik ben Daan.|Nice to meet you, I’m Daan.
de naam|name|🏷️|Hoe heet je?|What’s your name?
de vriend|friend (m)|👫|Daan is mijn vriend.|Daan is my friend.
de vriendin|friend (f)|👭|Sanne is mijn vriendin.|Sanne is my friend.
de man|man / husband|👨|De man leest de krant.|The man is reading the paper.
de vrouw|woman / wife|👩|De vrouw belt met haar moeder.|The woman is calling her mother.
het kind|child|🧒|Het kind speelt in het park.|The child is playing in the park.
ja|yes|✅|Ja, graag!|Yes, please!
nee|no|❌|Nee, dank je.|No, thanks.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
de koffie|coffee|☕|Een koffie verkeerd, alsjeblieft.|A milky coffee, please.
de thee|tea|🍵|Verse muntthee.|Fresh mint tea.
het water|water|💧|Een glas water, alsjeblieft.|A glass of water, please.
het sap|juice|🧃|Vers sinaasappelsap.|Fresh orange juice.
de melk|milk|🥛|Koffie met melk.|Coffee with milk.
de suiker|sugar|🍬|Zonder suiker, graag.|Without sugar, please.
de appeltaart|apple pie|🥧|Appeltaart met slagroom.|Apple pie with whipped cream.
het broodje|sandwich / roll|🥪|Een broodje kaas.|A cheese roll.
de rekening|the bill|🧾|Mag ik de rekening?|Could I have the bill?
de ober|waiter|🤵|De ober komt eraan.|The waiter is coming.
ik wil graag|I would like|🙂|Ik wil graag een cappuccino.|I’d like a cappuccino.
hoeveel kost|how much is|💶|Hoeveel kost het?|How much is it?
lekker|tasty / nice|😋|Wat lekker!|How tasty!
warm|warm / hot|♨️|Pas op, de thee is heet.|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
de familie|family|👪|Mijn familie woont in Utrecht.|My family lives in Utrecht.
de moeder|mother|👩|Mijn moeder is lerares.|My mother is a teacher.
de vader|father|👨|Mijn vader kookt graag.|My father likes cooking.
de ouders|parents|👨‍👩‍👧|Mijn ouders zijn op vakantie.|My parents are on holiday.
de broer|brother|👦|Mijn broer heet Daan.|My brother is called Daan.
de zus|sister|👧|Ik heb een zus.|I have a sister.
de zoon|son|👦|Hun zoon is tien.|Their son is ten.
de dochter|daughter|👧|Mijn dochter tekent graag.|My daughter likes drawing.
de opa|grandpa|👴|Opa vertelt verhalen.|Grandpa tells stories.
de oma|grandma|👵|Oma bakt de lekkerste taart.|Grandma bakes the best cake.
de oom|uncle|🧔|Mijn oom woont in België.|My uncle lives in Belgium.
de tante|aunt|👩‍🦱|Mijn tante is arts.|My aunt is a doctor.
de baby|baby|👶|De baby slaapt.|The baby is sleeping.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
een|one|1️⃣|Eén koffie, alsjeblieft.|One coffee, please.
twee|two|2️⃣|Twee kaartjes, alsjeblieft.|Two tickets, please.
drie|three|3️⃣|We zijn met z’n drieën.|There are three of us.
vier|four|4️⃣|Hij heeft vier kinderen.|He has four children.
vijf|five|5️⃣|Dat is vijf euro.|That’s five euros.
zes|six|6️⃣|Ik sta om zes uur op.|I get up at six.
zeven|seven|7️⃣|Een week heeft zeven dagen.|A week has seven days.
acht|eight|8️⃣|Ik werk acht uur per dag.|I work eight hours a day.
negen|nine|9️⃣|Mijn dochter is negen.|My daughter is nine.
tien|ten|🔟|De trein vertrekt over tien minuten.|The train leaves in ten minutes.
twintig|twenty|💶|Dat is twintig euro.|That’s twenty euros.
honderd|a hundred|💯|Het hotel is honderd meter verderop.|The hotel is a hundred metres further.
hoe oud ben je?|how old are you?|🎂|Hoe oud ben je?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
maandag|Monday|1️⃣|Op maandag werk ik.|On Monday I work.
dinsdag|Tuesday|2️⃣|Dinsdag ga ik zwemmen.|On Tuesday I go swimming.
woensdag|Wednesday|3️⃣|Zien we elkaar woensdag?|See you on Wednesday?
donderdag|Thursday|4️⃣|Donderdag is koopavond.|Thursday is late-night shopping.
vrijdag|Friday|5️⃣|Vrijdagavond gaan we uit.|On Friday evening we go out.
zaterdag|Saturday|6️⃣|Zaterdag ga ik naar de markt.|On Saturday I go to the market.
zondag|Sunday|7️⃣|Zondag fietsen we.|On Sunday we go cycling.
vandaag|today|📅|Vandaag is het mooi weer.|The weather is nice today.
morgen|tomorrow|🌄|Tot morgen!|See you tomorrow!
gisteren|yesterday|⬅️|Gisteren was ik moe.|Yesterday I was tired.
de tijd|time|⌛|Ik heb geen tijd.|I don’t have time.
hoe laat is het?|what time is it?|🕐|Hoe laat is het?|What time is it?
de week|week|🗓️|Ik werk vier dagen per week.|I work four days a week.
`),
  t('A1', 'food', '🧀', 'Food', 'La nourriture', `
het brood|bread|🍞|Bruin brood met kaas.|Brown bread with cheese.
de kaas|cheese|🧀|Goudse kaas is beroemd.|Gouda cheese is famous.
de appel|apple|🍎|Een appel per dag.|An apple a day.
de banaan|banana|🍌|Een banaan voor onderweg.|A banana for the road.
de aardappel|potato|🥔|Aardappelen met groente.|Potatoes with vegetables.
het vlees|meat|🥩|Ik eet geen vlees.|I don’t eat meat.
de vis|fish|🐟|Vrijdag eten we vis.|On Friday we eat fish.
het ei|egg|🥚|Een gekookt ei.|A boiled egg.
de soep|soup|🥣|Erwtensoep in de winter.|Pea soup in winter.
de groente|vegetables|🥦|Eet meer groente!|Eat more vegetables!
de stroopwafel|syrup waffle|🧇|Een stroopwafel bij de koffie.|A syrup waffle with the coffee.
de friet|chips / fries|🍟|Friet met mayonaise.|Fries with mayonnaise.
eten|to eat|🍽️|We eten om zes uur.|We eat at six.
drinken|to drink|🥤|Ik drink veel water.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
het huis|house|🏠|Het huis heeft een tuin.|The house has a garden.
het appartement|flat|🏢|Ik woon in een klein appartement.|I live in a small flat.
de keuken|kitchen|🍳|De keuken is licht.|The kitchen is bright.
de slaapkamer|bedroom|🛏️|De slaapkamer is boven.|The bedroom is upstairs.
de badkamer|bathroom|🛁|De badkamer is naast de slaapkamer.|The bathroom is next to the bedroom.
de woonkamer|living room|🛋️|We kijken tv in de woonkamer.|We watch TV in the living room.
de deur|door|🚪|Doe de deur dicht, alsjeblieft.|Close the door, please.
het raam|window|🪟|Doe het raam open, het is warm.|Open the window, it’s warm.
het bed|bed|🛌|Het bed is heel comfortabel.|The bed is very comfortable.
de stoel|chair|🪑|Pak een stoel.|Grab a chair.
de sleutel|key|🔑|Waar is mijn sleutel?|Where’s my key?
de tuin|garden|🌷|De kinderen spelen in de tuin.|The children play in the garden.
wonen|to live|🏡|Ik woon in Amsterdam.|I live in Amsterdam.
`),
  t('A1', 'city', '🚲', 'In town', 'En ville', `
de straat|street|🛣️|Ik woon in deze straat.|I live on this street.
het plein|square|⛲|We zien elkaar op het plein.|See you in the square.
het station|station|🚉|Het station is vlakbij.|The station is very close.
de bakker|baker’s|🥖|De bakker gaat om zeven uur open.|The baker’s opens at seven.
de apotheek|pharmacy|💊|Is er een apotheek in de buurt?|Is there a pharmacy nearby?
de supermarkt|supermarket|🛒|Ik ga naar de supermarkt.|I’m going to the supermarket.
het museum|museum|🏛️|Het Rijksmuseum is groot.|The Rijksmuseum is big.
de gracht|canal|🛶|We wandelen langs de gracht.|We walk along the canal.
de fiets|bike|🚲|Ik ga met de fiets.|I’m going by bike.
de brug|bridge|🌉|Fiets over de brug.|Cycle over the bridge.
rechts|right|➡️|Ga rechtsaf.|Turn right.
links|left|⬅️|Het station is links.|The station is on the left.
rechtdoor|straight on|⬆️|Ga rechtdoor.|Go straight on.
ver|far|🧭|Is het ver?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
rood|red|🔴|Een rode fiets.|A red bike.
blauw|blue|🔵|De lucht is blauw.|The sky is blue.
groen|green|🟢|Het park is groen.|The park is green.
geel|yellow|🟡|Een gele tulp.|A yellow tulip.
oranje|orange|🟠|Op Koningsdag is alles oranje.|On King’s Day everything is orange.
zwart|black|⚫|Een zwarte kat.|A black cat.
wit|white|⚪|Een wit overhemd.|A white shirt.
groot|big|🐘|Een groot huis.|A big house.
klein|small|🐭|Een kleine hond.|A small dog.
nieuw|new|🆕|Ik heb een nieuwe telefoon.|I have a new phone.
oud|old|🏚️|Een oud gebouw.|An old building.
mooi|beautiful|🌷|Wat een mooie dag!|What a beautiful day!
duur|expensive|💎|Amsterdam is duur.|Amsterdam is expensive.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
de reis|trip|🧳|Goede reis!|Have a good trip!
reizen|to travel|🌍|Ik reis graag met de trein.|I like travelling by train.
het vliegtuig|plane|✈️|Het vliegtuig landt om twaalf uur.|The plane lands at twelve.
het vliegveld|airport|🛫|We nemen een taxi naar het vliegveld.|We’re taking a taxi to the airport.
het kaartje|ticket|🎫|Ik heb de kaartjes online gekocht.|I bought the tickets online.
de koffer|suitcase|🧳|Mijn koffer is te zwaar.|My suitcase is too heavy.
het paspoort|passport|🛂|Vergeet je paspoort niet!|Don’t forget your passport!
de vakantie|holiday|🏝️|We gaan in augustus op vakantie.|We’re going on holiday in August.
het strand|beach|🏖️|Het strand is in Scheveningen.|The beach is at Scheveningen.
het hotel|hotel|🏨|Het hotel ligt aan de gracht.|The hotel is on the canal.
de reservering|booking|📋|Ik heb een reservering op naam van Smith.|I have a booking under the name Smith.
het ontbijt|breakfast|🥐|Is het ontbijt inbegrepen?|Is breakfast included?
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
de dokter|doctor|👨‍⚕️|Ik moet naar de dokter.|I need to go to the doctor.
ziek|ill|🤒|Ik ben sinds gisteren ziek.|I’ve been ill since yesterday.
de koorts|fever|🌡️|Ik heb koorts.|I have a fever.
verkouden|having a cold|🤧|Ik ben verkouden.|I have a cold.
de hoest|cough|😷|Ik heb een nare hoest.|I have a nasty cough.
de hoofdpijn|headache|🤕|Ik heb hoofdpijn.|I have a headache.
het recept|prescription|📃|Hier is uw recept.|Here’s your prescription.
het medicijn|medicine|💊|Neem dit medicijn twee keer per dag.|Take this medicine twice a day.
moe|tired|🥱|Ik ben heel moe.|I’m very tired.
rusten|to rest|🛋️|U moet rusten.|You need to rest.
de ambulance|ambulance|🚑|Bel een ambulance!|Call an ambulance!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
het werk|work|💼|Ik vind mijn werk leuk.|I like my work.
werken|to work|🧑‍💻|Ik werk bij een bank.|I work at a bank.
het kantoor|office|🏢|Het kantoor is in het centrum.|The office is in the centre.
de collega|colleague|🤝|Mijn collega’s zijn aardig.|My colleagues are nice.
de baas|boss|😎|De baas zit in een vergadering.|The boss is in a meeting.
de vergadering|meeting|👥|De vergadering begint om negen uur.|The meeting starts at nine.
het salaris|salary|💵|Het salaris is goed.|The salary is good.
het sollicitatiegesprek|job interview|🤝|Morgen heb ik een sollicitatiegesprek.|I have a job interview tomorrow.
het bedrijf|company|🏢|Ze heeft een eigen bedrijf.|She has her own company.
thuiswerken|to work from home|🏠|Op maandag werk ik thuis.|On Mondays I work from home.
druk|busy|🏃|Ik heb het druk deze week.|I’m busy this week.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
blij|happy|😊|Ik ben blij je te zien.|I’m happy to see you.
verdrietig|sad|😢|Waarom ben je verdrietig?|Why are you sad?
boos|angry|😠|Hij is boos vandaag.|He’s angry today.
bezorgd|worried|😟|Ik ben bezorgd over het examen.|I’m worried about the exam.
trots|proud|🦚|Ik ben trots op je.|I’m proud of you.
verrast|surprised|😮|Ik was echt verrast.|I was really surprised.
bang|scared|😱|Ik ben bang voor spinnen.|I’m scared of spiders.
verveeld|bored|🥱|Ik verveel me.|I’m bored.
missen|to miss|💌|Ik mis je.|I miss you.
gezellig|cosy / convivial|🕯️|Wat gezellig hier!|It’s so cosy here!
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
volgens mij|in my opinion|💬|Volgens mij is dat een goed idee.|In my opinion, that’s a good idea.
ik denk dat|I think that|💭|Ik denk dat je gelijk hebt.|I think you’re right.
gelijk hebben|to be right|✅|Je hebt gelijk.|You’re right.
het eens zijn|to agree|🤝|Ik ben het met je eens.|I agree with you.
maar|but|↔️|Het is duur, maar goed.|It’s expensive, but good.
daarom|that’s why|➡️|Het regent, daarom blijf ik thuis.|It’s raining, so I’m staying home.
misschien|maybe|🤷|Misschien regent het morgen.|Maybe it’ll rain tomorrow.
natuurlijk|of course|✅|Natuurlijk help ik je!|Of course I’ll help you!
eigenlijk|actually|📌|Eigenlijk weet ik het niet.|Actually, I don’t know.
het probleem|problem|❗|Geen probleem!|No problem!
`),
  t('B1', 'society', '🌍', 'Culture and environment', 'Culture et environnement', `
de cultuur|culture|🎭|De Nederlandse cultuur is direct.|Dutch culture is direct.
de geschiedenis|history|📜|Ik hou van geschiedenis.|I love history.
het schilderij|painting|🖼️|Het schilderij hangt in het museum.|The painting hangs in the museum.
de molen|windmill|🌬️|We bezoeken een oude molen.|We’re visiting an old windmill.
de tulp|tulip|🌷|In april bloeien de tulpen.|The tulips bloom in April.
het milieu|environment|🌍|We moeten het milieu beschermen.|We must protect the environment.
recyclen|to recycle|♻️|We recyclen glas en papier.|We recycle glass and paper.
het nieuws|news|📰|Heb je het nieuws gezien?|Did you see the news?
het internet|internet|🌐|Ik heb het op internet gevonden.|I found it online.
duurzaam|sustainable|🌿|Duurzaam leven is belangrijk.|Sustainable living is important.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'nl-g-articles', level: 'A1', icon: '🔤', en: 'De and het', fr: 'De et het',
    cards: [
      { en: 'Dutch has two words for "the": de (most nouns, all plurals) and het (neuter nouns, and all diminutives in -je). "A" is always een.', fr: 'Deux articles : de et het ; « un » : een.', examples: [['de man', 'the man', 'the man'], ['het huis', 'the house', 'the house'], ['het meisje', 'the girl', 'the girl']] },
    ],
    drills: [
      { text: '___ fiets is nieuw.', answer: 'De', wrong: ['Het', 'Een'], en: 'The bike is new.', fr: 'The bike is new.' },
      { text: '___ huis is groot.', answer: 'Het', wrong: ['De', 'Een'], en: 'The house is big.', fr: 'The house is big.' },
      { text: '___ kinderen spelen.', answer: 'De', wrong: ['Het', 'Een'], en: 'The children are playing.', fr: 'The children are playing.' },
    ],
  },
  {
    id: 'nl-g-zijn-hebben', level: 'A1', icon: '🧩', en: 'Zijn and hebben', fr: 'Zijn et hebben',
    cards: [
      { en: 'zijn (to be): ik ben, jij bent, hij is, wij zijn, jullie zijn, zij zijn.', fr: 'zijn : ben, bent, is, zijn.', examples: [['Ik ben moe.', 'I’m tired.', 'I’m tired.']] },
      { en: 'hebben (to have): ik heb, jij hebt, hij heeft, wij hebben, jullie hebben, zij hebben.', fr: 'hebben : heb, hebt, heeft, hebben.', examples: [['Heb je tijd?', 'Do you have time?', 'Do you have time?']] },
    ],
    drills: [
      { text: 'Ik ___ Sanne.', answer: 'ben', wrong: ['is', 'heb'], en: 'I’m Sanne.', fr: 'I’m Sanne.' },
      { text: 'Hij ___ een broer.', answer: 'heeft', wrong: ['hebt', 'is'], en: 'He has a brother.', fr: 'He has a brother.' },
      { text: 'Wij ___ in Utrecht.', answer: 'zijn', wrong: ['bent', 'hebben'], en: 'We are in Utrecht.', fr: 'We are in Utrecht.' },
    ],
  },
  {
    id: 'nl-g-present', level: 'A1', icon: '🔁', en: 'Present tense and word order', fr: 'Présent et ordre des mots',
    cards: [
      { en: 'Take the stem (werken → werk): ik werk, jij werkt, hij werkt, wij werken. In a question, jij loses its -t: Werk jij hier?', fr: 'Radical + t ; inversion dans les questions (Werk jij…?).', examples: [['Ik woon in Leiden.', 'I live in Leiden.', 'I live in Leiden.'], ['Woon jij hier?', 'Do you live here?', 'Do you live here?']] },
      { en: 'The verb is always second: Morgen ga ik naar Utrecht.', fr: 'Le verbe toujours en 2e position.', examples: [['Vandaag werk ik thuis.', 'Today I work from home.', 'Today I work from home.']] },
    ],
    drills: [
      { text: 'Jij ___ in een bank.', answer: 'werkt', wrong: ['werk', 'werken'], en: 'You work in a bank.', fr: 'You work in a bank.' },
      { text: '___ jij Engels?', answer: 'Spreek', wrong: ['Spreekt', 'Spreken'], en: 'Do you speak English?', fr: 'Do you speak English?' },
      { text: 'Morgen ___ ik naar Gent.', answer: 'ga', wrong: ['gaat', 'gaan'], en: 'Tomorrow I’m going to Ghent.', fr: 'Tomorrow I’m going to Ghent.' },
    ],
  },
  {
    id: 'nl-g-perfect', level: 'A2', icon: '⏮️', en: 'The perfect tense', fr: 'Le passé composé',
    cards: [
      { en: 'Spoken past: hebben or zijn + ge-…-t/d at the end. Ik heb gewerkt. Movement and change use zijn: Ik ben gegaan.', fr: 'Hebben/zijn + participe (ge-…-t/d) en fin de phrase.', examples: [['Ik heb pizza gegeten.', 'I ate pizza.', 'I ate pizza.'], ['We zijn naar Brugge gefietst.', 'We cycled to Bruges.', 'We cycled to Bruges.']] },
    ],
    drills: [
      { text: 'Ik ___ een film gezien.', answer: 'heb', wrong: ['ben', 'heeft'], en: 'I saw a film.', fr: 'I saw a film.' },
      { text: 'Zij is naar huis ___.', answer: 'gegaan', wrong: ['gaan', 'gegaat'], en: 'She went home.', fr: 'She went home.' },
      { text: 'We hebben lang ___.', answer: 'gewerkt', wrong: ['gewerkd', 'werken'], en: 'We worked for a long time.', fr: 'We worked for a long time.' },
    ],
  },
  {
    id: 'nl-g-separable', level: 'B1', icon: '✂️', en: 'Separable verbs', fr: 'Les verbes séparables',
    cards: [
      { en: 'Many verbs split: opstaan (to get up) → Ik sta om zeven uur op. The prefix goes to the end.', fr: 'Verbes séparables : la particule va en fin de phrase.', examples: [['Ik sta vroeg op.', 'I get up early.', 'I get up early.'], ['Hij belt zijn moeder op.', 'He calls his mother.', 'He calls his mother.']] },
    ],
    drills: [
      { text: 'Ik sta om zeven uur ___.', answer: 'op', wrong: ['aan', 'uit'], en: 'I get up at seven.', fr: 'I get up at seven.' },
      { text: 'Doe het licht ___ (on).', answer: 'aan', wrong: ['op', 'uit'], en: 'Turn the light on.', fr: 'Turn the light on.' },
      { text: 'We gaan vanavond ___ (out).', answer: 'uit', wrong: ['op', 'aan'], en: 'We’re going out tonight.', fr: 'We’re going out tonight.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'nl-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Goedemiddag! Wat mag het zijn?', en: 'Good afternoon! What can I get you?', fr: 'Good afternoon! What can I get you?' },
      { who: 'B', text: 'Een koffie en een stuk appeltaart, alsjeblieft.', en: 'A coffee and a slice of apple pie, please.', fr: 'A coffee and a slice of apple pie, please.', wrong: ['Ik ben een appeltaart.', 'De rekening is koffie.'] },
      { who: 'A', text: 'Met slagroom?', en: 'With whipped cream?', fr: 'With whipped cream?' },
      { who: 'B', text: 'Ja, graag!', en: 'Yes, please!', fr: 'Yes, please!', wrong: ['Ik ben dertig jaar.', 'Het is koud in Parijs.'] },
      { who: 'A', text: 'Dat is dan zeven euro vijftig.', en: 'That’ll be seven fifty.', fr: 'That’ll be seven fifty.' },
      { who: 'B', text: 'Kan ik pinnen?', en: 'Can I pay by card?', fr: 'Can I pay by card?', wrong: ['Welterusten, euro!', 'Waar is de appeltaart?'] },
    ],
  },
  {
    id: 'nl-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Pardon, waar is het station?', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['Pardon, hoeveel kost het station?', 'Pardon, ik ben het station.'] },
      { who: 'A', text: 'Ga rechtdoor en dan bij de brug linksaf.', en: 'Go straight on, then left at the bridge.', fr: 'Go straight on, then left at the bridge.' },
      { who: 'B', text: 'Is het ver?', en: 'Is it far?', fr: 'Is it far?', wrong: ['Is het lekker?', 'Is het maandag?'] },
      { who: 'A', text: 'Nee, vijf minuten lopen.', en: 'No, five minutes’ walk.', fr: 'No, five minutes’ walk.' },
      { who: 'B', text: 'Dank u wel!', en: 'Thank you!', fr: 'Thank you!', wrong: ['Eet smakelijk!', 'Welterusten!'] },
    ],
  },
  {
    id: 'nl-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Goedenavond! Kan ik u helpen?', en: 'Good evening! Can I help you?', fr: 'Good evening! Can I help you?' },
      { who: 'B', text: 'Ik heb een reservering op naam van Smith.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['Ik heb hoofdpijn.', 'Een koffie, alsjeblieft.'] },
      { who: 'A', text: 'Twee nachten, tweepersoonskamer. Mag ik uw paspoort zien?', en: 'Two nights, double room. May I see your passport?', fr: 'Two nights, double room. May I see your passport?' },
      { who: 'B', text: 'Alstublieft. Hoe laat is het ontbijt?', en: 'Here you are. What time is breakfast?', fr: 'Here you are. What time is breakfast?', wrong: ['Alstublieft. Waar is het strand van het paspoort?', 'Nee, ik heb geen honger.'] },
      { who: 'A', text: 'Van zeven tot tien. Uw kamer is op de derde verdieping.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'Prima. Is de wifi gratis?', en: 'Great. Is the wifi free?', fr: 'Great. Is the wifi free?', wrong: ['Prima. Ik ben gratis.', 'Prima. Ik ben dertig.'] },
    ],
  },
  {
    id: 'nl-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Goedemorgen. Wat is er aan de hand?', en: 'Good morning. What’s the matter?', fr: 'Good morning. What’s the matter?' },
      { who: 'B', text: 'Ik heb keelpijn en koorts.', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['Ik wil graag een stroopwafel.', 'Ik heb een tweepersoonskamer.'] },
      { who: 'A', text: 'Sinds wanneer?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'Sinds drie dagen.', en: 'For three days.', fr: 'For three days.', wrong: ['Om drie uur.', 'Drie euro, alstublieft.'] },
      { who: 'A', text: 'Het is griep. Hier is een recept. Neem rust.', en: 'It’s flu. Here’s a prescription. Get some rest.', fr: 'It’s flu. Here’s a prescription. Get some rest.' },
      { who: 'B', text: 'Dank u, dokter.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Dank u, waar is het station?', 'Proost!'] },
    ],
  },
  {
    id: 'nl-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Wat ga je dit weekend doen?', en: 'What are you doing this weekend?', fr: 'What are you doing this weekend?' },
      { who: 'B', text: 'Nog niks. Heb je een idee?', en: 'Nothing yet. Got an idea?', fr: 'Nothing yet. Got an idea?', wrong: ['Gisteren at ik friet.', 'Ik ben in Leiden geboren.'] },
      { who: 'A', text: 'Zullen we naar de bollenvelden fietsen?', en: 'Shall we cycle to the bulb fields?', fr: 'Shall we cycle to the bulb fields?' },
      { who: 'B', text: 'Leuk idee! Als het niet regent, ga ik mee.', en: 'Nice idea! If it doesn’t rain, I’ll come.', fr: 'Nice idea! If it doesn’t rain, I’ll come.', wrong: ['Leuk idee! Vorig jaar was ik ziek.', 'Nee, ik heb geen schoenen.'] },
      { who: 'A', text: 'Zullen we om tien uur bij het station afspreken?', en: 'Shall we meet at the station at ten?', fr: 'Shall we meet at the station at ten?' },
      { who: 'B', text: 'Afgesproken! Ik neem broodjes mee.', en: 'Deal! I’ll bring sandwiches.', fr: 'Deal! I’ll bring sandwiches.', wrong: ['Afgesproken! Ik heb gisteren meegenomen.', 'Nee dank je, ik ben het station.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'nl-s-market', level: 'A1', icon: '🧺', en: 'Sanne at the market', fr: 'Sanne au marché',
    sentences: [
      ['Sanne woont in Utrecht.', 'Sanne lives in Utrecht.', 'Sanne lives in Utrecht.'],
      ['Op zaterdag gaat ze naar de markt.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['Ze koopt appels, kaas en brood.', 'She buys apples, cheese and bread.', 'She buys apples, cheese and bread.'],
      ['Dan drinkt ze koffie bij Bram.', 'Then she has coffee at Bram’s.', 'Then she has coffee at Bram’s.'],
      ['Bram geeft haar een stroopwafel.', 'Bram gives her a syrup waffle.', 'Bram gives her a syrup waffle.'],
      ['Sanne is heel blij.', 'Sanne is very happy.', 'Sanne is very happy.'],
    ],
    glossary: { woont: ['lives', 'lives'], zaterdag: ['Saturday', 'Saturday'], markt: ['market', 'market'], koopt: ['buys', 'buys'], kaas: ['cheese', 'cheese'], dan: ['then', 'then'], drinkt: ['drinks', 'drinks'], geeft: ['gives', 'gives'], blij: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Sanne live?', fr: 'Where does Sanne live?', answer: 'Utrecht', wrong: ['Amsterdam', 'Rotterdam'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'appels, kaas en brood', wrong: ['vis en rijst', 'schoenen'] },
      { en: 'What does Bram give her?', fr: 'What does Bram give her?', answer: 'een stroopwafel', wrong: ['een koffie', 'een appel'] },
    ],
  },
  {
    id: 'nl-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Daan had om acht uur een trein naar Amsterdam.', 'Daan had a train to Amsterdam at eight.', 'Daan had a train to Amsterdam at eight.'],
      ['Maar hij werd om half acht wakker.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Hij kleedde zich snel aan en sprong op de fiets.', 'He got dressed quickly and jumped on his bike.', 'He got dressed quickly and jumped on his bike.'],
      ['Hij was om twee over acht op het station.', 'He was at the station at two minutes past eight.', 'He was at the station at two minutes past eight.'],
      ['De trein was al vertrokken.', 'The train had already left.', 'The train had already left.'],
      ['Hij nam de volgende trein en las een goed boek.', 'He took the next train and read a good book.', 'He took the next train and read a good book.'],
    ],
    glossary: { had: ['had', 'had'], wakker: ['awake', 'awake'], snel: ['quickly', 'quickly'], fiets: ['bike', 'bike'], al: ['already', 'already'], vertrokken: ['left', 'left'], volgende: ['next', 'next'], las: ['read', 'read'] },
    questions: [
      { en: 'Where was Daan going?', fr: 'Where was Daan going?', answer: 'naar Amsterdam', wrong: ['naar Utrecht', 'naar Gent'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'met de fiets', wrong: ['met de taxi', 'te voet'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'hij las een boek', wrong: ['hij sliep', 'hij at'] },
    ],
  },
  {
    id: 'nl-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Twee jaar geleden kregen de bewoners van ons gebouw een idee.', 'Two years ago the residents of our building had an idea.', 'Two years ago the residents of our building had an idea.'],
      ['Het dak was leeg en niemand gebruikte het.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Mevrouw Jansen stelde voor om een moestuin te maken.', 'Mrs Jansen suggested making a vegetable garden.', 'Mrs Jansen suggested making a vegetable garden.'],
      ['In het begin was niet iedereen overtuigd.', 'At first not everyone was convinced.', 'At first not everyone was convinced.'],
      ['Nu groeien er tomaten, kruiden en aardbeien.', 'Now tomatoes, herbs and strawberries grow there.', 'Now tomatoes, herbs and strawberries grow there.'],
      ['En elke zondag eet iedereen samen op het dak.', 'And every Sunday everyone eats together on the roof.', 'And every Sunday everyone eats together on the roof.'],
    ],
    glossary: { bewoners: ['residents', 'residents'], dak: ['roof', 'roof'], leeg: ['empty', 'empty'], niemand: ['nobody', 'nobody'], moestuin: ['vegetable garden', 'vegetable garden'], overtuigd: ['convinced', 'convinced'], groeien: ['grow', 'grow'], samen: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'mevrouw Jansen', wrong: ['Sanne', 'Daan'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'tomaten, kruiden en aardbeien', wrong: ['appels en peren', 'aardappelen'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: 'elke zondag', wrong: ['elke maandag', 'een keer per jaar'] },
    ],
  },
];

export const DUTCH_FULL: FullCourse = { topics, grammar, dialogues, stories };
