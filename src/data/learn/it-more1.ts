import type { Level, Topic, Word } from '@/data/learn/full';

/** Italian, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "parola|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
andare|to go|🚶|Vado al lavoro in autobus.|I go to work by bus.
venire|to come|👋|Vieni alla festa?|Are you coming to the party?
fare|to do / make|🛠️|Cosa fai stasera?|What are you doing tonight?
vedere|to see|👀|Vedo il mare dalla finestra.|I can see the sea from the window.
guardare|to watch / look at|📺|Guardiamo un film.|We’re watching a film.
ascoltare|to listen|🎧|Ascolto la radio.|I listen to the radio.
parlare|to speak|🗣️|Parli inglese?|Do you speak English?
dire|to say|💬|Cosa dice?|What is he saying?
sapere|to know (a fact)|🧠|Non lo so.|I don’t know.
conoscere|to know (person)|🤝|Conosci Giulia?|Do you know Giulia?
volere|to want|🙏|Voglio un gelato.|I want an ice cream.
potere|can|💪|Posso aiutarti?|Can I help you?
dovere|must|📌|Devo andare.|I have to go.
prendere|to take|✋|Prendo il treno.|I take the train.
dare|to give|🎁|Dammi la mano.|Give me your hand.
aprire|to open|🔓|Apri la finestra.|Open the window.
chiudere|to close|🔒|Il negozio chiude alle otto.|The shop closes at eight.
cercare|to look for|🔍|Cerco le chiavi.|I’m looking for the keys.
trovare|to find|💡|Ho trovato un bel ristorante.|I found a nice restaurant.
aspettare|to wait|⏳|Ti aspetto davanti alla stazione.|I’ll wait for you outside the station.
dormire|to sleep|😴|Dormo otto ore.|I sleep eight hours.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
svegliarsi|to wake up|⏰|Mi sveglio alle sette.|I wake up at seven.
alzarsi|to get up|🛏️|Mi alzo presto.|I get up early.
farsi la doccia|to have a shower|🚿|Mi faccio la doccia la mattina.|I have a shower in the morning.
vestirsi|to get dressed|👔|Mi vesto in fretta.|I get dressed quickly.
il pranzo|lunch|🥗|Il pranzo è all’una.|Lunch is at one.
la cena|dinner|🍝|La cena è pronta!|Dinner is ready!
lavarsi i denti|to brush your teeth|🪥|Lavati i denti!|Brush your teeth!
andare a letto|to go to bed|🌙|Vado a letto alle undici.|I go to bed at eleven.
uscire|to go out|🚪|Esco di casa alle otto.|I leave home at eight.
tornare|to come back|↩️|Torno a casa alle sei.|I come home at six.
presto|early|🌅|Sono arrivato presto.|I arrived early.
tardi|late|🌆|È tardi!|It’s late!
sempre|always|♾️|Bevo sempre un caffè.|I always have a coffee.
mai|never|🚫|Non bevo mai alcol.|I never drink alcohol.
a volte|sometimes|🔀|A volte vado in palestra.|Sometimes I go to the gym.
di solito|usually|📅|Di solito vado in bici.|I usually cycle.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
che cosa|what|❓|Che cos’è?|What is it?
chi|who|🕵️|Chi è?|Who is it?
dove|where|📍|Dov’è il bagno?|Where is the bathroom?
quando|when|📆|Quando è il tuo compleanno?|When is your birthday?
perché|why / because|🤔|Perché sei triste?|Why are you sad?
come|how|🤷|Come stai?|How are you?
quanti|how many|🔢|Quanti anni hai?|How old are you?
quale|which|☝️|Qual è il tuo film preferito?|What’s your favourite film?
di dove|where from|🌍|Di dove sei?|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
il cane|dog|🐕|Il mio cane si chiama Fido.|My dog is called Fido.
il gatto|cat|🐈|Il gatto dorme sul divano.|The cat sleeps on the sofa.
l’uccello|bird|🐦|Un uccello canta.|A bird is singing.
il cavallo|horse|🐎|Il cavallo corre veloce.|The horse runs fast.
la mucca|cow|🐄|La mucca dà il latte.|The cow gives milk.
la pecora|sheep|🐑|Ci sono molte pecore.|There are lots of sheep.
il coniglio|rabbit|🐇|Il coniglio mangia una carota.|The rabbit eats a carrot.
il topo|mouse|🐁|C’è un topo in cucina!|There’s a mouse in the kitchen!
l’orso|bear|🐻|L’orso ama il miele.|The bear loves honey.
il leone|lion|🦁|Il leone è il re della giungla.|The lion is king of the jungle.
l’elefante|elephant|🐘|L’elefante è enorme.|The elephant is huge.
la farfalla|butterfly|🦋|Una farfalla su un fiore.|A butterfly on a flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
la camicia|shirt|👔|Una camicia bianca.|A white shirt.
la maglietta|T-shirt|👕|Una maglietta di cotone.|A cotton T-shirt.
i pantaloni|trousers|👖|I pantaloni sono lunghi.|The trousers are long.
il vestito|dress / suit|👗|Porta un vestito rosso.|She’s wearing a red dress.
la gonna|skirt|🩳|Una gonna estiva.|A summer skirt.
le scarpe|shoes|👞|Ho bisogno di scarpe nuove.|I need new shoes.
il cappotto|coat|🧥|Mettiti il cappotto.|Put your coat on.
il maglione|jumper|🧶|Un maglione caldo.|A warm jumper.
il cappello|hat|👒|Un cappello per il sole.|A sun hat.
la sciarpa|scarf|🧣|Una sciarpa di lana.|A wool scarf.
gli occhiali|glasses|👓|Dove sono i miei occhiali?|Where are my glasses?
portare|to wear / carry|🧳|Porta sempre la cravatta.|He always wears a tie.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
il tempo|weather|🌤️|Che tempo fa?|What’s the weather like?
fa bel tempo|the weather is nice|☀️|Oggi fa bel tempo.|The weather is nice today.
piove|it’s raining|🌧️|Piove da stamattina.|It’s been raining since this morning.
nevica|it’s snowing|🌨️|In montagna nevica.|It’s snowing in the mountains.
fa caldo|it’s hot|🥵|D’estate fa caldo.|It’s hot in summer.
fa freddo|it’s cold|🥶|Oggi fa freddo.|It’s cold today.
il sole|sun|☀️|C’è il sole.|It’s sunny.
la pioggia|rain|☔|Amo il suono della pioggia.|I love the sound of rain.
il vento|wind|🌬️|C’è molto vento.|It’s very windy.
l’ombrello|umbrella|☂️|Prendi l’ombrello.|Take an umbrella.
l’estate|summer|🏖️|D’estate andiamo al mare.|In summer we go to the seaside.
l’inverno|winter|☃️|L’inverno è freddo.|Winter is cold.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
la scuola|school|🏫|La scuola è vicina.|The school is close.
la lezione|lesson|🧑‍🏫|La lezione comincia alle otto.|The lesson starts at eight.
l’insegnante|teacher|👩‍🏫|L’insegnante spiega bene.|The teacher explains well.
lo studente|student|🧑‍🎓|Ci sono venti studenti.|There are twenty students.
il libro|book|📕|Aprite il libro a pagina dieci.|Open your books at page ten.
il quaderno|exercise book|📓|Scrivi nel quaderno.|Write in your exercise book.
la matita|pencil|✏️|Hai una matita?|Do you have a pencil?
la penna|pen|🖊️|Firma qui con la penna.|Sign here with the pen.
i compiti|homework|📝|Ho molti compiti.|I have a lot of homework.
la domanda|question|❓|Ho una domanda.|I have a question.
la risposta|answer|💡|La risposta è giusta.|The answer is right.
imparare|to learn|🌱|Imparo dieci parole al giorno.|I learn ten words a day.
capire|to understand|🤔|Non capisco.|I don’t understand.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
il piatto|plate|🍽️|Metti i piatti in tavola.|Put the plates on the table.
il bicchiere|glass|🥛|Un bicchiere d’acqua.|A glass of water.
la tazza|cup|☕|Una tazza di tè.|A cup of tea.
il coltello|knife|🔪|Il coltello taglia bene.|The knife cuts well.
la forchetta|fork|🍴|Mi serve una forchetta.|I need a fork.
il cucchiaio|spoon|🥄|Mangia la zuppa col cucchiaio.|Eat the soup with the spoon.
la pentola|pot|🍲|L’acqua bolle nella pentola.|The water is boiling in the pot.
il forno|oven|🔥|La torta è in forno.|The cake is in the oven.
il sale|salt|🧂|Mi passi il sale?|Can you pass me the salt?
il burro|butter|🧈|Pane e burro.|Bread and butter.
tagliare|to cut|✂️|Taglia i pomodori.|Cut the tomatoes.
lavare i piatti|to wash the dishes|🧽|Lavo io i piatti.|I’ll wash the dishes.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
ieri sera|last night|🌃|Ieri sera siamo andati al cinema.|Last night we went to the cinema.
la settimana scorsa|last week|🗓️|La settimana scorsa ero malato.|Last week I was ill.
l’anno scorso|last year|🎆|L’anno scorso siamo stati in Grecia.|Last year we were in Greece.
due giorni fa|two days ago|⌛|Sono arrivato due giorni fa.|I arrived two days ago.
sono andato|I went|🚶|Sono andato al mercato.|I went to the market.
ho fatto|I did / made|🛠️|Ho fatto una torta.|I made a cake.
ho mangiato|I ate|🍽️|Ho mangiato una pizza.|I ate a pizza.
ho visto|I saw|👀|Ho visto Marco in centro.|I saw Marco in town.
ho comprato|I bought|🛍️|Ho comprato un cappotto.|I bought a coat.
da piccolo|as a child|🧒|Da piccolo abitavo in campagna.|As a child I lived in the country.
una volta|once / in the past|🕰️|Una volta qui c’era un cinema.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
va bene|OK|👌|Va bene, a domani!|OK, see you tomorrow!
certo|of course|✅|Certo, ti aiuto.|Of course I’ll help you.
figurati|don’t mention it|😊|Grazie! — Figurati!|“Thanks!” “Don’t mention it!”
che peccato|what a pity|😞|Che peccato che non vieni!|What a pity you’re not coming!
non importa|it doesn’t matter|🤷|Non importa, succede.|It doesn’t matter, it happens.
in bocca al lupo|good luck|🍀|In bocca al lupo per l’esame!|Good luck with the exam!
auguri|best wishes|🎉|Tanti auguri!|Happy birthday!
dai|come on|💪|Dai, andiamo!|Come on, let’s go!
magari|if only / maybe|🤞|Magari domani!|Maybe tomorrow!
boh|no idea|🤷|Boh, non lo so.|No idea, I don’t know.
a presto|see you soon|👋|Ciao, a presto!|Bye, see you soon!
salute|bless you / cheers|🥂|Salute!|Cheers!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
anche|also|➕|Parlo anche spagnolo.|I also speak Spanish.
inoltre|furthermore|📎|Inoltre, è gratis.|Furthermore, it’s free.
allora|so / then|➡️|Allora, cosa facciamo?|So, what shall we do?
mentre|while|⏯️|Leggo mentre aspetto.|I read while I wait.
anche se|even if|🌗|Anche se sono stanco, vengo.|Even if I’m tired, I’m coming.
appena|as soon as|⚡|Chiamami appena arrivi.|Call me as soon as you arrive.
prima di tutto|first of all|1️⃣|Prima di tutto, grazie.|First of all, thank you.
infine|finally|🏁|Infine, parliamo del budget.|Finally, let’s talk about the budget.
per esempio|for example|📌|Amo la frutta, per esempio le fragole.|I love fruit, for example strawberries.
invece|instead / on the other hand|⚖️|Io amo il mare, lui invece la montagna.|I love the sea; he, on the other hand, the mountains.
nonostante|despite|🧱|Nonostante la pioggia, siamo usciti.|Despite the rain, we went out.
`),
];
