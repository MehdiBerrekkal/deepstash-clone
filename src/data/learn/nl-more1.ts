import type { Level, Topic, Word } from '@/data/learn/full';

/** Dutch, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "woord|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
gaan|to go|🚶|Ik ga met de bus naar mijn werk.|I go to work by bus.
komen|to come|👋|Kom je naar het feest?|Are you coming to the party?
doen|to do|🛠️|Wat doe je vanavond?|What are you doing tonight?
maken|to make|🧑‍🍳|Ik maak een taart.|I’m making a cake.
zien|to see|👀|Ik zie de zee.|I can see the sea.
kijken|to watch / look|📺|We kijken een film.|We’re watching a film.
luisteren|to listen|🎧|Ik luister naar muziek.|I listen to music.
spreken|to speak|🗣️|Spreek je Engels?|Do you speak English?
zeggen|to say|💬|Wat zegt hij?|What is he saying?
weten|to know (a fact)|🧠|Ik weet het niet.|I don’t know.
kennen|to know (person)|🤝|Ken je Sanne?|Do you know Sanne?
willen|to want|🙏|Ik wil een ijsje.|I want an ice cream.
kunnen|can|💪|Kun je me helpen?|Can you help me?
moeten|must|📌|Ik moet nu gaan.|I have to go now.
nemen|to take|✋|Ik neem de trein.|I take the train.
geven|to give|🎁|Geef me je hand.|Give me your hand.
openen|to open|🔓|Open het raam.|Open the window.
sluiten|to close|🔒|De winkel sluit om zes uur.|The shop closes at six.
zoeken|to look for|🔍|Ik zoek mijn sleutels.|I’m looking for my keys.
wachten|to wait|⏳|Ik wacht op je.|I’m waiting for you.
slapen|to sleep|😴|Ik slaap acht uur.|I sleep eight hours.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
wakker worden|to wake up|⏰|Ik word om zeven uur wakker.|I wake up at seven.
opstaan|to get up|🛏️|Ik sta vroeg op.|I get up early.
douchen|to shower|🚿|Ik douche ’s ochtends.|I shower in the morning.
zich aankleden|to get dressed|👔|Ik kleed me snel aan.|I get dressed quickly.
de lunch|lunch|🥪|De lunch is om twaalf uur.|Lunch is at twelve.
het avondeten|dinner|🍝|Het avondeten is klaar!|Dinner is ready!
tanden poetsen|to brush your teeth|🪥|Poets je tanden!|Brush your teeth!
naar bed gaan|to go to bed|🌙|Ik ga om elf uur naar bed.|I go to bed at eleven.
vertrekken|to leave|🚪|Ik vertrek om acht uur.|I leave at eight.
thuiskomen|to come home|↩️|Ik kom om zes uur thuis.|I come home at six.
vroeg|early|🌅|Ik was vroeg.|I was early.
laat|late|🌆|Het is al laat.|It’s already late.
altijd|always|♾️|Ik drink altijd koffie.|I always drink coffee.
nooit|never|🚫|Ik rook nooit.|I never smoke.
soms|sometimes|🔀|Soms ga ik naar de sportschool.|Sometimes I go to the gym.
meestal|usually|📅|Meestal fiets ik.|I usually cycle.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
wat|what|❓|Wat is dat?|What is that?
wie|who|🕵️|Wie is dat?|Who is that?
waar|where|📍|Waar is het toilet?|Where is the toilet?
wanneer|when|📆|Wanneer ben je jarig?|When is your birthday?
waarom|why|🤔|Waarom ben je verdrietig?|Why are you sad?
hoe|how|🤷|Hoe gaat het?|How are you?
hoeveel|how much / many|🔢|Hoeveel kost het?|How much does it cost?
welke|which|☝️|Welke trein gaat naar Utrecht?|Which train goes to Utrecht?
omdat|because|💡|Ik leer Nederlands omdat ik in Amsterdam woon.|I’m learning Dutch because I live in Amsterdam.
waar vandaan|where from|🌍|Waar kom je vandaan?|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
de hond|dog|🐕|Mijn hond heet Max.|My dog is called Max.
de kat|cat|🐈|De kat slaapt op de bank.|The cat sleeps on the sofa.
de vogel|bird|🐦|Een vogel zingt.|A bird is singing.
het paard|horse|🐎|Het paard rent hard.|The horse runs fast.
de koe|cow|🐄|De koe geeft melk.|The cow gives milk.
het schaap|sheep|🐑|Veel schapen op de dijk.|Lots of sheep on the dyke.
het konijn|rabbit|🐇|Het konijn eet een wortel.|The rabbit eats a carrot.
de eend|duck|🦆|Eenden in de gracht.|Ducks in the canal.
de muis|mouse|🐁|Er zit een muis in de keuken!|There’s a mouse in the kitchen!
de vlinder|butterfly|🦋|Een vlinder op een bloem.|A butterfly on a flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
het overhemd|shirt|👔|Een wit overhemd.|A white shirt.
het T-shirt|T-shirt|👕|Een katoenen T-shirt.|A cotton T-shirt.
de broek|trousers|👖|De broek is te lang.|The trousers are too long.
de jurk|dress|👗|Ze draagt een rode jurk.|She’s wearing a red dress.
de rok|skirt|🩳|Een zomerse rok.|A summer skirt.
de schoenen|shoes|👞|Ik heb nieuwe schoenen nodig.|I need new shoes.
de jas|coat|🧥|Doe je jas aan, het is koud.|Put your coat on, it’s cold.
de trui|jumper|🧶|Een warme trui.|A warm jumper.
de muts|woolly hat|🧢|In de winter draag ik een muts.|In winter I wear a hat.
de sjaal|scarf|🧣|Een wollen sjaal.|A wool scarf.
de bril|glasses|👓|Waar is mijn bril?|Where are my glasses?
dragen|to wear / carry|🧥|Hij draagt altijd een das.|He always wears a tie.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
het weer|weather|🌤️|Hoe is het weer?|What’s the weather like?
de zon|sun|☀️|De zon schijnt.|The sun is shining.
de regen|rain|🌧️|Het regent alweer.|It’s raining again.
de wind|wind|🌬️|Er staat veel wind.|It’s very windy.
de sneeuw|snow|❄️|Er ligt sneeuw.|There’s snow on the ground.
koud|cold|🥶|Het is koud vandaag.|It’s cold today.
de wolk|cloud|☁️|De lucht is vol wolken.|The sky is full of clouds.
de paraplu|umbrella|☂️|Neem een paraplu mee.|Take an umbrella.
de zomer|summer|🏖️|In de zomer gaan we naar het strand.|In summer we go to the beach.
de winter|winter|☃️|De winter is koud en donker.|Winter is cold and dark.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
de school|school|🏫|De school is dichtbij.|The school is close.
de les|lesson|🧑‍🏫|De les begint om acht uur.|The lesson starts at eight.
de leraar|teacher|👩‍🏫|De leraar legt goed uit.|The teacher explains well.
de leerling|pupil|🧑‍🎓|Er zijn twintig leerlingen.|There are twenty pupils.
het boek|book|📕|Doe je boek open op bladzijde tien.|Open your book at page ten.
het schrift|exercise book|📓|Schrijf in je schrift.|Write in your exercise book.
het potlood|pencil|✏️|Heb je een potlood?|Do you have a pencil?
de pen|pen|🖊️|Teken hier met de pen.|Sign here with the pen.
het huiswerk|homework|📝|Ik heb veel huiswerk.|I have a lot of homework.
de vraag|question|❓|Ik heb een vraag.|I have a question.
het antwoord|answer|💡|Het antwoord is goed.|The answer is right.
leren|to learn|🌱|Ik leer tien woorden per dag.|I learn ten words a day.
begrijpen|to understand|🤔|Ik begrijp het niet.|I don’t understand.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
het bord|plate|🍽️|Zet de borden op tafel.|Put the plates on the table.
het glas|glass|🥛|Een glas water.|A glass of water.
het kopje|cup|☕|Een kopje thee.|A cup of tea.
het mes|knife|🔪|Het mes is scherp.|The knife is sharp.
de vork|fork|🍴|Ik heb een vork nodig.|I need a fork.
de lepel|spoon|🥄|Eet de soep met een lepel.|Eat the soup with a spoon.
de pan|pan|🍳|Pannenkoeken in de pan.|Pancakes in the pan.
de oven|oven|🔥|De taart staat in de oven.|The cake is in the oven.
het zout|salt|🧂|Geef je het zout even door?|Can you pass the salt?
de boter|butter|🧈|Brood met boter.|Bread and butter.
snijden|to cut|✂️|Snijd de tomaten.|Cut the tomatoes.
afwassen|to do the washing-up|🧽|Ik was vandaag af.|I’ll do the washing-up today.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
gisteravond|last night|🌃|Gisteravond waren we in de bioscoop.|Last night we were at the cinema.
vorige week|last week|🗓️|Vorige week was ik ziek.|Last week I was ill.
vorig jaar|last year|🎆|Vorig jaar waren we in Italië.|Last year we were in Italy.
twee dagen geleden|two days ago|⌛|Ik kwam twee dagen geleden aan.|I arrived two days ago.
ik was|I was|📍|Ik was in Gent.|I was in Ghent.
ik ging|I went|🚶|Ik ging naar de markt.|I went to the market.
ik heb gegeten|I ate|🍽️|Ik heb friet gegeten.|I ate fries.
ik heb gezien|I saw|👀|Ik heb Daan gezien.|I saw Daan.
ik heb gekocht|I bought|🛍️|Ik heb een jas gekocht.|I bought a coat.
als kind|as a child|🧒|Als kind woonde ik op het platteland.|As a child I lived in the countryside.
vroeger|in the past|🕰️|Vroeger was hier een bioscoop.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
oké|OK|👌|Oké, tot morgen!|OK, see you tomorrow!
prima|fine / great|👍|Om acht uur? Prima!|At eight? Great!
graag gedaan|you’re welcome|😊|— Bedankt! — Graag gedaan.|“Thanks!” “You’re welcome.”
jammer|what a pity|😞|Jammer dat je niet komt.|What a pity you’re not coming.
geeft niet|never mind|😌|Geeft niet, het gebeurt.|Never mind, it happens.
succes|good luck|🍀|Succes met je examen!|Good luck with your exam!
gefeliciteerd|congratulations|🎉|Gefeliciteerd met je verjaardag!|Happy birthday!
beterschap|get well soon|🤒|Beterschap!|Get well soon!
tot straks|see you later|👋|Tot straks!|See you later!
proost|cheers|🍻|Proost!|Cheers!
eet smakelijk|enjoy your meal|🍽️|Eet smakelijk!|Enjoy your meal!
lekker belangrijk|who cares (ironic)|🙄|Lekker belangrijk!|As if that matters!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
ook|also|➕|Ik spreek ook Spaans.|I also speak Spanish.
bovendien|moreover|📎|Bovendien is het gratis.|Moreover, it’s free.
dus|so|➡️|Het regent, dus we blijven thuis.|It’s raining, so we’re staying home.
terwijl|while|⏯️|Ik lees terwijl ik wacht.|I read while I wait.
hoewel|although|🌗|Hoewel ik moe ben, kom ik.|Although I’m tired, I’m coming.
zodra|as soon as|⚡|Bel me zodra je aankomt.|Call me as soon as you arrive.
eerst|first|1️⃣|Eerst eten we, dan gaan we uit.|First we eat, then we go out.
ten slotte|finally|🏁|Ten slotte bespreken we het budget.|Finally, we’ll discuss the budget.
bijvoorbeeld|for example|📌|Ik hou van fruit, bijvoorbeeld appels.|I love fruit, for example apples.
ondanks|despite|🧱|Ondanks de regen gingen we fietsen.|Despite the rain, we went cycling.
`),
];
