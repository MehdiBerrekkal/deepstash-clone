import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Italian, A1 → B1, for English speakers. Original content written for this app. Lines are "parola|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `it-${id}`, level, icon, en, fr, words: w5(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
ciao|hi / bye|👋|Ciao, sono Giulia!|Hi, I’m Giulia!
buongiorno|good morning|🌅|Buongiorno, signor Rossi.|Good morning, Mr Rossi.
buonasera|good evening|🌆|Buonasera a tutti!|Good evening, everyone!
grazie|thank you|🙏|Grazie mille!|Thanks a lot!
prego|you’re welcome / please, go ahead|🙂|Prego, si accomodi.|Please, have a seat.
per favore|please|🥺|Un caffè, per favore.|A coffee, please.
scusi|excuse me (polite)|😅|Scusi, dov’è la stazione?|Excuse me, where is the station?
piacere|nice to meet you|🤝|Piacere, Marco.|Nice to meet you, I’m Marco.
il nome|name|🏷️|Come ti chiami? Qual è il tuo nome?|What’s your name?
l’amico|friend (m)|🤝|Luca è il mio amico.|Luca is my friend.
l’amica|friend (f)|🤝|Giulia è la mia amica.|Giulia is my friend.
l’uomo|man|👨|L’uomo legge il giornale.|The man is reading the paper.
la donna|woman|👩|La donna parla al telefono.|The woman is on the phone.
il bambino|child (boy)|🧒|Il bambino gioca in giardino.|The child is playing in the garden.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
il caffè|coffee (espresso)|☕|Un caffè al banco, per favore.|An espresso at the counter, please.
il cappuccino|cappuccino|☕|Il cappuccino si beve la mattina.|Cappuccino is for the morning.
il tè|tea|🍵|Preferisco il tè verde.|I prefer green tea.
l’acqua|water|💧|Un’acqua naturale, per favore.|A still water, please.
il succo|juice|🧃|Un succo d’arancia.|An orange juice.
il latte|milk|🥛|Caffè con un po’ di latte.|Coffee with a dash of milk.
lo zucchero|sugar|🍬|Senza zucchero, grazie.|No sugar, thanks.
il cornetto|croissant|🥐|Un cornetto alla crema.|A cream-filled croissant.
il conto|the bill|🧾|Il conto, per favore.|The bill, please.
il cameriere|waiter|🤵|Il cameriere arriva subito.|The waiter is coming right away.
vorrei|I would like|🙂|Vorrei un cappuccino.|I’d like a cappuccino.
quanto costa|how much is|💶|Quanto costa?|How much is it?
buono|good / tasty|😋|Questo cornetto è buonissimo!|This croissant is delicious!
caldo|hot|♨️|Attenzione, è caldo.|Careful, it’s hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
la famiglia|family|👪|La mia famiglia è grande.|My family is big.
la madre|mother|👩|Mia madre è insegnante.|My mother is a teacher.
il padre|father|👨|Mio padre cucina benissimo.|My father cooks really well.
i genitori|parents|👨‍👩‍👧|I miei genitori vivono a Napoli.|My parents live in Naples.
il fratello|brother|👦|Mio fratello si chiama Luca.|My brother is called Luca.
la sorella|sister|👧|Ho una sorella più piccola.|I have a younger sister.
il figlio|son|👦|Il loro figlio ha dieci anni.|Their son is ten.
la figlia|daughter|👧|Mia figlia ama disegnare.|My daughter loves drawing.
il nonno|grandfather|👴|Il nonno racconta storie.|Grandpa tells stories.
la nonna|grandmother|👵|La nonna fa la pasta in casa.|Grandma makes fresh pasta.
lo zio|uncle|🧔|Mio zio abita a Roma.|My uncle lives in Rome.
la zia|aunt|👩‍🦱|Mia zia è medico.|My aunt is a doctor.
il marito|husband|🤵|Suo marito è francese.|Her husband is French.
la moglie|wife|👰|Sua moglie è architetto.|His wife is an architect.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
uno|one|1️⃣|Un caffè, per favore.|One coffee, please.
due|two|2️⃣|Due biglietti, per favore.|Two tickets, please.
tre|three|3️⃣|Siamo in tre.|There are three of us.
quattro|four|4️⃣|Ha quattro figli.|He has four children.
cinque|five|5️⃣|Sono cinque euro.|That’s five euros.
sei|six|6️⃣|Mi alzo alle sei.|I get up at six.
sette|seven|7️⃣|La settimana ha sette giorni.|The week has seven days.
otto|eight|8️⃣|Lavoro otto ore al giorno.|I work eight hours a day.
nove|nine|9️⃣|Mia figlia ha nove anni.|My daughter is nine.
dieci|ten|🔟|Il treno parte tra dieci minuti.|The train leaves in ten minutes.
venti|twenty|💶|Fanno venti euro.|That’s twenty euros.
cento|a hundred|💯|L’hotel è a cento metri.|The hotel is a hundred metres away.
quanti anni hai?|how old are you?|🎂|Quanti anni hai?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
lunedì|Monday|1️⃣|Lunedì lavoro.|On Monday I work.
martedì|Tuesday|2️⃣|Martedì vado in palestra.|On Tuesday I go to the gym.
mercoledì|Wednesday|3️⃣|Ci vediamo mercoledì?|See you on Wednesday?
giovedì|Thursday|4️⃣|Giovedì sera esco.|On Thursday evening I go out.
venerdì|Friday|5️⃣|Venerdì pizza con gli amici.|Friday is pizza with friends.
sabato|Saturday|6️⃣|Il sabato vado al mercato.|On Saturdays I go to the market.
domenica|Sunday|7️⃣|La domenica pranziamo dalla nonna.|On Sundays we have lunch at Grandma’s.
oggi|today|📅|Oggi fa bel tempo.|The weather is nice today.
domani|tomorrow|🌄|A domani!|See you tomorrow!
ieri|yesterday|⬅️|Ieri ero stanco.|Yesterday I was tired.
l’ora|hour / time|🕐|Che ora è?|What time is it?
la mattina|morning|🌅|La mattina bevo un caffè.|In the morning I drink a coffee.
la sera|evening|🌆|Stasera ceniamo fuori.|Tonight we’re eating out.
la settimana|week|🗓️|Lavoro cinque giorni a settimana.|I work five days a week.
`),
  t('A1', 'food', '🍝', 'Food', 'La nourriture', `
la pasta|pasta|🍝|La pasta si mangia al dente.|Pasta is eaten al dente.
la pizza|pizza|🍕|Una pizza margherita, per favore.|A margherita pizza, please.
il pane|bread|🍞|Il pane è ancora caldo.|The bread is still warm.
il formaggio|cheese|🧀|Il parmigiano è un formaggio famoso.|Parmesan is a famous cheese.
il pomodoro|tomato|🍅|Pasta al pomodoro.|Pasta with tomato sauce.
la mela|apple|🍎|Una mela al giorno.|An apple a day.
la carne|meat|🥩|Non mangio carne.|I don’t eat meat.
il pesce|fish|🐟|Il venerdì mangiamo pesce.|On Fridays we eat fish.
l’uovo|egg|🥚|Due uova per la carbonara.|Two eggs for the carbonara.
il gelato|ice cream|🍦|Un gelato al pistacchio.|A pistachio ice cream.
l’olio|olive oil|🫒|Un filo d’olio sulla bruschetta.|A drizzle of oil on the bruschetta.
la verdura|vegetables|🥦|Mangia più verdura!|Eat more vegetables!
mangiare|to eat|🍽️|Mangiamo a mezzogiorno.|We eat at noon.
bere|to drink|🥤|Bevo molta acqua.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
la casa|house / home|🏠|La casa ha un balcone.|The house has a balcony.
l’appartamento|flat|🏢|Vivo in un piccolo appartamento.|I live in a small flat.
la cucina|kitchen|🍳|La cucina è luminosa.|The kitchen is bright.
la camera da letto|bedroom|🛏️|La camera da letto è tranquilla.|The bedroom is quiet.
il bagno|bathroom|🛁|Il bagno è in fondo.|The bathroom is at the end.
il soggiorno|living room|🛋️|Guardiamo la TV in soggiorno.|We watch TV in the living room.
la porta|door|🚪|Chiudi la porta, per favore.|Close the door, please.
la finestra|window|🪟|Apri la finestra, fa caldo.|Open the window, it’s hot.
il letto|bed|🛌|Il letto è comodo.|The bed is comfortable.
la sedia|chair|🪑|Prendi una sedia.|Take a chair.
la chiave|key|🔑|Dove sono le chiavi?|Where are the keys?
il balcone|balcony|🪴|Facciamo colazione sul balcone.|We have breakfast on the balcony.
abitare|to live (somewhere)|🏡|Abito a Bologna.|I live in Bologna.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
la strada|street / road|🛣️|Abito in questa strada.|I live on this street.
la piazza|square|⛲|Ci vediamo in piazza.|See you in the square.
la stazione|station|🚉|La stazione è vicina.|The station is close.
il forno|bakery|🥖|Il forno apre alle sette.|The bakery opens at seven.
la farmacia|pharmacy|💊|C’è una farmacia qui vicino?|Is there a pharmacy nearby?
il supermercato|supermarket|🛒|Vado al supermercato.|I’m going to the supermarket.
la banca|bank|🏦|La banca chiude alle quattro.|The bank closes at four.
il museo|museum|🏛️|Il museo è gratis la domenica.|The museum is free on Sundays.
la chiesa|church|⛪|La chiesa è molto antica.|The church is very old.
il parco|park|🌳|Facciamo una passeggiata al parco.|Let’s take a walk in the park.
a destra|on the right|➡️|Giri a destra.|Turn right.
a sinistra|on the left|⬅️|La stazione è a sinistra.|The station is on the left.
dritto|straight on|⬆️|Vada sempre dritto.|Keep going straight.
lontano|far|🧭|È lontano?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
rosso|red|🔴|Una macchina rossa.|A red car.
blu|blue|🔵|Il mare è blu.|The sea is blue.
verde|green|🟢|Le olive verdi.|Green olives.
giallo|yellow|🟡|Un limone giallo.|A yellow lemon.
nero|black|⚫|Un gatto nero.|A black cat.
bianco|white|⚪|Una camicia bianca.|A white shirt.
grande|big|🐘|Una casa grande.|A big house.
piccolo|small|🐭|Un cane piccolo.|A small dog.
nuovo|new|🆕|Ho un telefono nuovo.|I have a new phone.
vecchio|old|🏚️|Un palazzo vecchio.|An old building.
bello|beautiful|🌸|Che bella giornata!|What a beautiful day!
caro|expensive / dear|💎|Il ristorante è caro.|The restaurant is expensive.
economico|cheap|🏷️|Questo hotel è economico.|This hotel is cheap.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
il viaggio|trip|🧳|Buon viaggio!|Have a good trip!
viaggiare|to travel|🌍|Mi piace viaggiare in treno.|I like travelling by train.
l’aereo|plane|✈️|L’aereo parte alle dieci.|The plane leaves at ten.
l’aeroporto|airport|🛫|Andiamo all’aeroporto in taxi.|We’re taking a taxi to the airport.
il biglietto|ticket|🎫|Ho comprato i biglietti online.|I bought the tickets online.
la valigia|suitcase|🧳|La mia valigia è troppo pesante.|My suitcase is too heavy.
il passaporto|passport|🛂|Non dimenticare il passaporto.|Don’t forget your passport.
le vacanze|holidays|🏝️|Andiamo in vacanza ad agosto.|We go on holiday in August.
la spiaggia|beach|🏖️|La spiaggia è a cinque minuti.|The beach is five minutes away.
la montagna|mountains|🏔️|D’inverno andiamo in montagna.|In winter we go to the mountains.
l’albergo|hotel|🏨|L’albergo ha una bella vista.|The hotel has a nice view.
la prenotazione|booking|📋|Ho una prenotazione a nome Smith.|I have a booking under the name Smith.
la colazione|breakfast|🥐|La colazione è inclusa?|Is breakfast included?
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
il medico|doctor|👨‍⚕️|Devo andare dal medico.|I have to go to the doctor.
malato|ill|🤒|Sono malato da ieri.|I’ve been ill since yesterday.
la febbre|fever|🌡️|Ho la febbre.|I have a fever.
il raffreddore|cold|🤧|Ho preso il raffreddore.|I caught a cold.
la tosse|cough|😷|Ho una brutta tosse.|I have a bad cough.
il mal di testa|headache|🤕|Ho mal di testa.|I have a headache.
la ricetta|prescription / recipe|📃|Ecco la ricetta.|Here’s the prescription.
la medicina|medicine|💊|Prenda questa medicina.|Take this medicine.
stanco|tired|🥱|Sono molto stanco.|I’m very tired.
riposare|to rest|🛋️|Deve riposare.|You need to rest.
il pronto soccorso|A&E|🚑|È al pronto soccorso.|He’s in A&E.
guarire|to get better|🌤️|Guarisci presto!|Get well soon!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
il lavoro|work / job|💼|Mi piace il mio lavoro.|I like my job.
lavorare|to work|🧑‍💻|Lavoro in banca.|I work in a bank.
l’ufficio|office|🏢|L’ufficio è in centro.|The office is in the centre.
il collega|colleague|🤝|I miei colleghi sono simpatici.|My colleagues are nice.
il capo|boss|😎|Il capo è in riunione.|The boss is in a meeting.
la riunione|meeting|👥|La riunione inizia alle nove.|The meeting starts at nine.
lo stipendio|salary|💵|Lo stipendio non è alto.|The salary isn’t high.
il colloquio|job interview|🤝|Domani ho un colloquio.|I have an interview tomorrow.
il mestiere|trade / profession|🧑‍🔧|Che mestiere fai?|What do you do?
l’azienda|company|🏢|Lavora in un’azienda di moda.|She works for a fashion company.
le ferie|time off|🏖️|Ad agosto sono in ferie.|I’m off in August.
lo smart working|working from home|🏠|Il lunedì faccio smart working.|On Mondays I work from home.
`),
  t('A2', 'hobbies', '🎭', 'Free time', 'Les loisirs', `
il tempo libero|free time|🎨|Cosa fai nel tempo libero?|What do you do in your free time?
il calcio|football|⚽|Mio figlio gioca a calcio.|My son plays football.
nuotare|to swim|🏊|D’estate nuoto ogni giorno.|In summer I swim every day.
la bicicletta|bicycle|🚲|Vado al lavoro in bicicletta.|I cycle to work.
leggere|to read|📖|Leggo un romanzo giallo.|I’m reading a crime novel.
il cinema|cinema|🎬|Andiamo al cinema stasera?|Shall we go to the cinema tonight?
la musica|music|🎵|Ascolto musica mentre lavoro.|I listen to music while I work.
cantare|to sing|🎤|Canto nel coro.|I sing in a choir.
ballare|to dance|💃|Balliamo la salsa il venerdì.|We dance salsa on Fridays.
cucinare|to cook|👩‍🍳|Cucino la domenica.|I cook on Sundays.
fotografare|to photograph|📷|Mi piace fotografare i tramonti.|I like photographing sunsets.
il teatro|theatre|🎭|Andiamo a teatro sabato.|We’re going to the theatre on Saturday.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
il negozio|shop|🏬|Il negozio apre alle dieci.|The shop opens at ten.
comprare|to buy|🛒|Compro il pane ogni mattina.|I buy bread every morning.
il prezzo|price|🏷️|Qual è il prezzo?|What’s the price?
i saldi|the sales|🏷️|I saldi iniziano a gennaio.|The sales start in January.
la taglia|size|📏|Avete una taglia più grande?|Do you have a bigger size?
il camerino|fitting room|🚪|Il camerino è in fondo.|The fitting room is at the back.
pagare|to pay|💳|Posso pagare con la carta?|Can I pay by card?
in contanti|in cash|💵|Pago in contanti.|I’ll pay cash.
lo scontrino|receipt|🧾|Ecco lo scontrino.|Here’s the receipt.
cambiare|to exchange / change|🔁|Posso cambiarlo?|Can I exchange it?
il regalo|present|🎁|È un regalo per mia madre.|It’s a present for my mother.
la borsa|bag|👜|Che bella borsa!|What a lovely bag!
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
felice|happy|😊|Sono felice di vederti.|I’m happy to see you.
triste|sad|😢|Oggi è triste.|She’s sad today.
arrabbiato|angry|😠|Perché sei arrabbiato?|Why are you angry?
preoccupato|worried|😟|Sono preoccupata per l’esame.|I’m worried about the exam.
contento|pleased|🙂|Sono contento del risultato.|I’m pleased with the result.
orgoglioso|proud|🦚|Sono orgoglioso di te.|I’m proud of you.
sorpreso|surprised|😮|Che sorpresa!|What a surprise!
la paura|fear|😱|Ho paura dei ragni.|I’m afraid of spiders.
annoiato|bored|🥱|Mi annoio la domenica.|I get bored on Sundays.
deluso|disappointed|😞|È deluso.|He’s disappointed.
rilassato|relaxed|😌|In vacanza sono rilassata.|On holiday I’m relaxed.
mi manchi|I miss you|💌|Mi manchi tanto.|I miss you so much.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
secondo me|in my opinion|💬|Secondo me hai ragione.|In my opinion you’re right.
penso che|I think that|💭|Penso che sia una buona idea.|I think it’s a good idea.
avere ragione|to be right|✅|Hai ragione, è troppo caro.|You’re right, it’s too expensive.
essere d’accordo|to agree|🤝|Sono d’accordo con te.|I agree with you.
però|but / however|↔️|È caro, però è buono.|It’s expensive, but it’s good.
quindi|so|➡️|Piove, quindi resto a casa.|It’s raining, so I’m staying home.
comunque|anyway|🤷|Comunque, grazie.|Anyway, thanks.
il vantaggio|advantage|👍|Il vantaggio è il prezzo.|The advantage is the price.
lo svantaggio|disadvantage|👎|Lo svantaggio è il rumore.|The disadvantage is the noise.
convincere|to convince|🗣️|Mi hai convinto.|You’ve convinced me.
forse|maybe|🤷|Forse domani piove.|Maybe it’ll rain tomorrow.
infatti|indeed / in fact|📌|Infatti, è chiuso.|Indeed, it’s closed.
`),
  t('B1', 'culture', '🏛️', 'Culture and environment', 'Culture et environnement', `
l’arte|art|🎨|Firenze è piena d’arte.|Florence is full of art.
il quadro|painting|🖼️|Il quadro è agli Uffizi.|The painting is in the Uffizi.
la mostra|exhibition|🖼️|La mostra su Caravaggio è bellissima.|The Caravaggio exhibition is wonderful.
il romanzo|novel|📘|Sto leggendo un romanzo di Calvino.|I’m reading a Calvino novel.
lo scrittore|writer|✒️|È uno scrittore famoso.|He’s a famous writer.
l’opera|opera|🎻|Andiamo all’opera all’Arena di Verona.|We’re going to the opera at Verona’s Arena.
la tradizione|tradition|🎎|È una tradizione di famiglia.|It’s a family tradition.
la storia|history / story|📜|Amo la storia di Roma.|I love Roman history.
l’ambiente|environment|🌍|Dobbiamo proteggere l’ambiente.|We must protect the environment.
riciclare|to recycle|♻️|Ricicliamo il vetro e la carta.|We recycle glass and paper.
i rifiuti|waste|🗑️|Riduciamo i rifiuti.|Let’s reduce waste.
sostenibile|sustainable|🌿|Un turismo più sostenibile.|More sustainable tourism.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'it-g-articles', level: 'A1', icon: '🔤', en: 'Gender and articles', fr: 'Genre et articles',
    cards: [
      { en: 'Nouns are masculine (often -o) or feminine (often -a). "The": il (m), lo (before s+consonant, z), l’ (before a vowel), la (f).', fr: 'Masculin -o, féminin -a. Articles : il, lo, l’, la.', examples: [['il libro', 'the book', 'the book'], ['lo zaino', 'the backpack', 'the backpack'], ['la casa', 'the house', 'the house']] },
      { en: 'Plural: i / gli (m), le (f). "A": un, uno, una, un’.', fr: 'Pluriel : i, gli, le. « Un » : un, uno, una, un’.', examples: [['i libri', 'the books', 'the books'], ['le case', 'the houses', 'the houses']] },
    ],
    drills: [
      { text: '___ libro è nuovo.', answer: 'Il', wrong: ['La', 'Lo'], en: 'The book is new.', fr: 'The book is new.' },
      { text: '___ zaino è pesante.', answer: 'Lo', wrong: ['Il', 'La'], en: 'The backpack is heavy.', fr: 'The backpack is heavy.' },
      { text: 'Ho ___ amica a Roma.', answer: 'un’', wrong: ['un', 'uno'], en: 'I have a friend in Rome.', fr: 'I have a friend in Rome.' },
      { text: '___ case sono belle.', answer: 'Le', wrong: ['I', 'Gli'], en: 'The houses are beautiful.', fr: 'The houses are beautiful.' },
    ],
  },
  {
    id: 'it-g-essere-avere', level: 'A1', icon: '🧩', en: 'Essere and avere', fr: 'Essere et avere',
    cards: [
      { en: 'Essere (to be): sono, sei, è, siamo, siete, sono.', fr: 'Essere : sono, sei, è, siamo, siete, sono.', examples: [['Sono italiana.', 'I’m Italian.', 'I’m Italian.']] },
      { en: 'Avere (to have): ho, hai, ha, abbiamo, avete, hanno. Italian uses avere for age, hunger and cold: ho trent’anni, ho fame.', fr: 'Avere : ho, hai, ha, abbiamo, avete, hanno.', examples: [['Ho fame.', 'I’m hungry.', 'I’m hungry.']] },
    ],
    drills: [
      { text: 'Io ___ stanco.', answer: 'sono', wrong: ['ho', 'è'], en: 'I’m tired.', fr: 'I’m tired.' },
      { text: 'Tu ___ un fratello?', answer: 'hai', wrong: ['sei', 'ha'], en: 'Do you have a brother?', fr: 'Do you have a brother?' },
      { text: 'Noi ___ a Milano.', answer: 'siamo', wrong: ['abbiamo', 'siete'], en: 'We’re in Milan.', fr: 'We’re in Milan.' },
      { text: 'Lei ___ venti anni.', answer: 'ha', wrong: ['è', 'hanno'], en: 'She’s twenty.', fr: 'She’s twenty.' },
    ],
  },
  {
    id: 'it-g-present', level: 'A1', icon: '🔁', en: 'Present tense: -are, -ere, -ire', fr: 'Présent : -are, -ere, -ire',
    cards: [
      { en: '-are: parlo, parli, parla, parliamo, parlate, parlano. -ere: prendo, prendi, prende… -ire: dormo, dormi, dorme…', fr: 'Terminaisons du présent pour -are, -ere, -ire.', examples: [['Parlo italiano.', 'I speak Italian.', 'I speak Italian.'], ['Dormiamo poco.', 'We don’t sleep much.', 'We don’t sleep much.']] },
    ],
    drills: [
      { text: 'Tu ___ inglese?', answer: 'parli', wrong: ['parla', 'parlo'], en: 'Do you speak English?', fr: 'Do you speak English?' },
      { text: 'Noi ___ il treno.', answer: 'prendiamo', wrong: ['prendete', 'prendono'], en: 'We take the train.', fr: 'We take the train.' },
      { text: 'Loro ___ fino a tardi.', answer: 'dormono', wrong: ['dormiamo', 'dorme'], en: 'They sleep late.', fr: 'They sleep late.' },
    ],
  },
  {
    id: 'it-g-passato', level: 'A2', icon: '⏮️', en: 'Passato prossimo', fr: 'Passato prossimo',
    cards: [
      { en: 'Past: avere or essere + past participle. -are → -ato, -ere → -uto, -ire → -ito. Movement verbs use essere and agree: è andata.', fr: 'Avere/essere + participe ; accord avec essere.', examples: [['Ho mangiato una pizza.', 'I ate a pizza.', 'I ate a pizza.'], ['Siamo andati a Roma.', 'We went to Rome.', 'We went to Rome.']] },
    ],
    drills: [
      { text: 'Ieri ___ lavorato tanto.', answer: 'ho', wrong: ['sono', 'hai'], en: 'Yesterday I worked a lot.', fr: 'Yesterday I worked a lot.' },
      { text: 'Giulia è ___ a Venezia.', answer: 'andata', wrong: ['andato', 'andare'], en: 'Giulia went to Venice.', fr: 'Giulia went to Venice.' },
      { text: 'Avete ___ il film?', answer: 'visto', wrong: ['vedere', 'veduto'], en: 'Have you seen the film?', fr: 'Have you seen the film?' },
    ],
  },
  {
    id: 'it-g-piacere', level: 'A2', icon: '❤️', en: 'Mi piace', fr: 'Mi piace',
    cards: [
      { en: 'To say you like something: mi piace + singular, mi piacciono + plural. Ti piace? = do you like?', fr: 'Mi piace + singulier, mi piacciono + pluriel.', examples: [['Mi piace il gelato.', 'I like ice cream.', 'I like ice cream.'], ['Mi piacciono i film italiani.', 'I like Italian films.', 'I like Italian films.']] },
    ],
    drills: [
      { text: 'Mi ___ la pizza.', answer: 'piace', wrong: ['piacciono', 'piaci'], en: 'I like pizza.', fr: 'I like pizza.' },
      { text: 'Ti ___ i gatti?', answer: 'piacciono', wrong: ['piace', 'piaci'], en: 'Do you like cats?', fr: 'Do you like cats?' },
      { text: '___ piace viaggiare.', answer: 'Mi', wrong: ['Io', 'Me'], en: 'I like travelling.', fr: 'I like travelling.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'it-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Buongiorno! Cosa prende?', en: 'Good morning! What will you have?', fr: 'Good morning! What will you have?' },
      { who: 'B', text: 'Un cappuccino e un cornetto, per favore.', en: 'A cappuccino and a croissant, please.', fr: 'A cappuccino and a croissant, please.', wrong: ['Il conto è un cornetto.', 'Sono un cappuccino.'] },
      { who: 'A', text: 'Al banco o al tavolo?', en: 'At the counter or at a table?', fr: 'At the counter or at a table?' },
      { who: 'B', text: 'Al banco, grazie.', en: 'At the counter, thanks.', fr: 'At the counter, thanks.', wrong: ['Ho trent’anni.', 'Fa freddo a Roma.'] },
      { who: 'A', text: 'Sono due euro e cinquanta.', en: 'That’s two fifty.', fr: 'That’s two fifty.' },
      { who: 'B', text: 'Ecco a lei. Buona giornata!', en: 'Here you go. Have a nice day!', fr: 'Here you go. Have a nice day!', wrong: ['Buonanotte, euro!', 'Scusi, dov’è il cornetto?'] },
    ],
  },
  {
    id: 'it-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Scusi, dov’è la stazione?', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['Scusi, quanto costa la stazione?', 'Scusi, io sono la stazione.'] },
      { who: 'A', text: 'Vada dritto e poi giri a sinistra.', en: 'Go straight on and then turn left.', fr: 'Go straight on and then turn left.' },
      { who: 'B', text: 'È lontano?', en: 'Is it far?', fr: 'Is it far?', wrong: ['È buono?', 'È lunedì?'] },
      { who: 'A', text: 'No, sono cinque minuti a piedi.', en: 'No, it’s five minutes on foot.', fr: 'No, it’s five minutes on foot.' },
      { who: 'B', text: 'Grazie mille!', en: 'Thanks a lot!', fr: 'Thanks a lot!', wrong: ['Buon appetito!', 'Buonanotte!'] },
    ],
  },
  {
    id: 'it-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Buonasera, posso aiutarla?', en: 'Good evening, can I help you?', fr: 'Good evening, can I help you?' },
      { who: 'B', text: 'Ho una prenotazione a nome Smith.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['Ho mal di testa.', 'Un cappuccino, per favore.'] },
      { who: 'A', text: 'Una camera doppia per due notti. Un documento, per favore.', en: 'A double room for two nights. Some ID, please.', fr: 'A double room for two nights. Some ID, please.' },
      { who: 'B', text: 'Ecco il passaporto. A che ora è la colazione?', en: 'Here’s my passport. What time is breakfast?', fr: 'Here’s my passport. What time is breakfast?', wrong: ['Ecco il passaporto. Dov’è la spiaggia del passaporto?', 'No grazie, non ho fame.'] },
      { who: 'A', text: 'Dalle sette alle dieci. La camera è al terzo piano.', en: 'From seven to ten. The room is on the third floor.', fr: 'From seven to ten. The room is on the third floor.' },
      { who: 'B', text: 'Perfetto. Il wifi è gratis?', en: 'Perfect. Is the wifi free?', fr: 'Perfect. Is the wifi free?', wrong: ['Perfetto. Io sono gratis.', 'Perfetto. Ho trent’anni.'] },
    ],
  },
  {
    id: 'it-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Buongiorno. Cosa si sente?', en: 'Hello. What’s the matter?', fr: 'Hello. What’s the matter?' },
      { who: 'B', text: 'Ho mal di gola e la febbre.', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['Vorrei un gelato.', 'Ho una camera doppia.'] },
      { who: 'A', text: 'Da quanto tempo?', en: 'For how long?', fr: 'For how long?' },
      { who: 'B', text: 'Da tre giorni.', en: 'For three days.', fr: 'For three days.', wrong: ['Alle tre.', 'Tre euro, per favore.'] },
      { who: 'A', text: 'È un’influenza. Ecco la ricetta. Si riposi.', en: 'It’s flu. Here’s the prescription. Get some rest.', fr: 'It’s flu. Here’s the prescription. Get some rest.' },
      { who: 'B', text: 'Grazie, dottore.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Grazie, dov’è la stazione?', 'Salute!'] },
    ],
  },
  {
    id: 'it-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Cosa fai questo fine settimana?', en: 'What are you doing this weekend?', fr: 'What are you doing this weekend?' },
      { who: 'B', text: 'Niente di speciale. Hai un’idea?', en: 'Nothing special. Got an idea?', fr: 'Nothing special. Got an idea?', wrong: ['Ieri ho mangiato la pizza.', 'Sono nato a Bologna.'] },
      { who: 'A', text: 'Potremmo andare al lago in bicicletta.', en: 'We could cycle to the lake.', fr: 'We could cycle to the lake.' },
      { who: 'B', text: 'Che bella idea! Se fa bel tempo, vengo volentieri.', en: 'Lovely idea! If the weather’s nice, I’d love to come.', fr: 'Lovely idea! If the weather’s nice, I’d love to come.', wrong: ['Che bella idea! L’anno scorso ero malato.', 'No, non ho le scarpe.'] },
      { who: 'A', text: 'Ci vediamo alle dieci in stazione?', en: 'Shall we meet at ten at the station?', fr: 'Shall we meet at ten at the station?' },
      { who: 'B', text: 'Va bene! Porto io il pranzo al sacco.', en: 'OK! I’ll bring the packed lunch.', fr: 'OK! I’ll bring the packed lunch.', wrong: ['Va bene! Ho portato ieri.', 'No grazie, sono la stazione.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'it-s-market', level: 'A1', icon: '🧺', en: 'Giulia at the market', fr: 'Giulia au marché',
    sentences: [
      ['Giulia abita a Bologna.', 'Giulia lives in Bologna.', 'Giulia lives in Bologna.'],
      ['Il sabato va al mercato.', 'On Saturdays she goes to the market.', 'On Saturdays she goes to the market.'],
      ['Compra pomodori, formaggio e pane.', 'She buys tomatoes, cheese and bread.', 'She buys tomatoes, cheese and bread.'],
      ['Poi prende un caffè da Marco.', 'Then she has a coffee at Marco’s.', 'Then she has a coffee at Marco’s.'],
      ['Marco le regala un cornetto.', 'Marco gives her a croissant on the house.', 'Marco gives her a croissant on the house.'],
      ['Giulia è molto contenta.', 'Giulia is very happy.', 'Giulia is very happy.'],
    ],
    glossary: { abita: ['lives', 'lives'], sabato: ['Saturday', 'Saturday'], mercato: ['market', 'market'], compra: ['buys', 'buys'], pomodori: ['tomatoes', 'tomatoes'], formaggio: ['cheese', 'cheese'], poi: ['then', 'then'], regala: ['gives (as a gift)', 'gives (as a gift)'], contenta: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Giulia live?', fr: 'Where does Giulia live?', answer: 'Bologna', wrong: ['Roma', 'Napoli'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'pomodori, formaggio e pane', wrong: ['pesce e riso', 'scarpe'] },
      { en: 'What does Marco give her?', fr: 'What does Marco give her?', answer: 'un cornetto', wrong: ['un caffè', 'una mela'] },
    ],
  },
  {
    id: 'it-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Luca aveva un treno per Firenze alle otto.', 'Luca had a train to Florence at eight.', 'Luca had a train to Florence at eight.'],
      ['Ma si è svegliato alle sette e mezza.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Si è vestito in fretta ed è andato in bici.', 'He got dressed in a hurry and cycled.', 'He got dressed in a hurry and cycled.'],
      ['È arrivato in stazione alle otto e due.', 'He reached the station at two minutes past eight.', 'He reached the station at two minutes past eight.'],
      ['Il treno era già partito.', 'The train had already left.', 'The train had already left.'],
      ['Ha preso il treno dopo e ha letto un bel libro.', 'He took the next train and read a good book.', 'He took the next train and read a good book.'],
    ],
    glossary: { aveva: ['had', 'had'], svegliato: ['woke up', 'woke up'], vestito: ['got dressed', 'got dressed'], fretta: ['hurry', 'hurry'], arrivato: ['arrived', 'arrived'], già: ['already', 'already'], partito: ['left', 'left'], dopo: ['after / next', 'after / next'], letto: ['read', 'read'] },
    questions: [
      { en: 'Where was Luca going?', fr: 'Where was Luca going?', answer: 'Firenze', wrong: ['Roma', 'Milano'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'in bici', wrong: ['in taxi', 'a piedi'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'ha letto', wrong: ['ha dormito', 'ha mangiato'] },
    ],
  },
  {
    id: 'it-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Due anni fa, gli abitanti del nostro palazzo hanno avuto un’idea.', 'Two years ago, the residents of our building had an idea.', 'Two years ago, the residents of our building had an idea.'],
      ['Il tetto era vuoto e nessuno lo usava.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['La signora Bianchi ha proposto di fare un orto.', 'Mrs Bianchi suggested making a vegetable garden.', 'Mrs Bianchi suggested making a vegetable garden.'],
      ['All’inizio, non tutti erano convinti.', 'At first, not everyone was convinced.', 'At first, not everyone was convinced.'],
      ['Oggi ci crescono pomodori, basilico e fragole.', 'Today tomatoes, basil and strawberries grow there.', 'Today tomatoes, basil and strawberries grow there.'],
      ['E ogni domenica tutti pranzano insieme sul tetto.', 'And every Sunday everyone has lunch together on the roof.', 'And every Sunday everyone has lunch together on the roof.'],
    ],
    glossary: { abitanti: ['residents', 'residents'], palazzo: ['building', 'building'], tetto: ['roof', 'roof'], vuoto: ['empty', 'empty'], nessuno: ['nobody', 'nobody'], orto: ['vegetable garden', 'vegetable garden'], convinti: ['convinced', 'convinced'], crescono: ['grow', 'grow'], insieme: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'la signora Bianchi', wrong: ['Giulia', 'Luca'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'pomodori, basilico e fragole', wrong: ['mele e pere', 'patate'] },
      { en: 'When does everyone have lunch together?', fr: 'When does everyone have lunch together?', answer: 'ogni domenica', wrong: ['ogni lunedì', 'una volta all’anno'] },
    ],
  },
];

export const ITALIAN_FULL: FullCourse = { topics, grammar, dialogues, stories };
