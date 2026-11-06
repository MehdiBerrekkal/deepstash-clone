import type { Level, Topic, Word } from '@/data/learn/full';

/** German, pack 1: everyday verbs, routine, questions, animals, clothes, school, kitchen, jobs, the past, expressions, linking words. Lines are "Wort|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `de-${id}`, level, icon, en, fr, words: w5(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
gehen|to go / walk|🚶|Ich gehe zur Arbeit.|I walk to work.
kommen|to come|👋|Kommst du zur Party?|Are you coming to the party?
machen|to do / make|🛠️|Was machst du heute Abend?|What are you doing tonight?
sehen|to see|👀|Ich sehe das Meer.|I can see the sea.
hören|to hear / listen|🎧|Ich höre gern Musik.|I like listening to music.
sprechen|to speak|🗣️|Sprichst du Englisch?|Do you speak English?
sagen|to say|💬|Was sagst du?|What are you saying?
wissen|to know (a fact)|🧠|Ich weiß es nicht.|I don’t know.
kennen|to know (person)|🤝|Kennst du Lena?|Do you know Lena?
wollen|to want|🙏|Ich will ein neues Fahrrad.|I want a new bike.
können|can|💪|Kannst du mir helfen?|Can you help me?
müssen|must|📌|Ich muss jetzt gehen.|I have to go now.
nehmen|to take|✋|Ich nehme den Bus.|I take the bus.
geben|to give|🎁|Gib mir bitte das Salz.|Please give me the salt.
öffnen|to open|🔓|Öffne bitte das Fenster.|Please open the window.
schließen|to close|🔒|Der Laden schließt um acht.|The shop closes at eight.
suchen|to look for|🔍|Ich suche meine Schlüssel.|I’m looking for my keys.
finden|to find|💡|Ich finde den Film toll.|I find the film great.
warten|to wait|⏳|Ich warte auf dich.|I’m waiting for you.
schlafen|to sleep|😴|Ich schlafe acht Stunden.|I sleep eight hours.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
aufwachen|to wake up|⏰|Ich wache um sieben auf.|I wake up at seven.
aufstehen|to get up|🛏️|Ich stehe früh auf.|I get up early.
duschen|to shower|🚿|Ich dusche morgens.|I shower in the mornings.
sich anziehen|to get dressed|👔|Ich ziehe mich schnell an.|I get dressed quickly.
frühstücken|to have breakfast|🥐|Wir frühstücken zusammen.|We have breakfast together.
das Mittagessen|lunch|🥗|Das Mittagessen ist um zwölf.|Lunch is at twelve.
das Abendessen|dinner|🍝|Das Abendessen ist fertig!|Dinner is ready!
Zähne putzen|to brush your teeth|🪥|Vergiss nicht, Zähne zu putzen!|Don’t forget to brush your teeth!
ins Bett gehen|to go to bed|🌙|Ich gehe um elf ins Bett.|I go to bed at eleven.
losfahren|to set off|🚗|Wir fahren um acht los.|We set off at eight.
nach Hause kommen|to come home|↩️|Ich komme um sechs nach Hause.|I come home at six.
früh|early|🌅|Ich bin früh angekommen.|I arrived early.
spät|late|🌆|Es ist schon spät.|It’s already late.
immer|always|♾️|Ich trinke immer Kaffee.|I always drink coffee.
nie|never|🚫|Ich trinke nie Alkohol.|I never drink alcohol.
manchmal|sometimes|🔀|Manchmal gehe ich ins Fitnessstudio.|Sometimes I go to the gym.
normalerweise|usually|📅|Normalerweise fahre ich mit dem Rad.|I usually cycle.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
was|what|❓|Was ist das?|What is that?
wer|who|🕵️|Wer ist das?|Who is that?
wo|where|📍|Wo ist die Toilette?|Where is the toilet?
wann|when|📆|Wann hast du Geburtstag?|When is your birthday?
warum|why|🤔|Warum bist du traurig?|Why are you sad?
wie|how|🤷|Wie geht’s?|How are you?
wie viele|how many|🔢|Wie viele Leute kommen?|How many people are coming?
welcher|which|☝️|Welcher Bus fährt zum Bahnhof?|Which bus goes to the station?
woher|where from|🌍|Woher kommst du?|Where are you from?
wohin|where to|🧭|Wohin gehst du?|Where are you going?
weil|because|💡|Ich lerne Deutsch, weil ich in Berlin wohne.|I’m learning German because I live in Berlin.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
der Hund|dog|🐕|Mein Hund heißt Bello.|My dog is called Bello.
die Katze|cat|🐈|Die Katze schläft auf dem Sofa.|The cat sleeps on the sofa.
der Vogel|bird|🐦|Ein Vogel singt im Baum.|A bird is singing in the tree.
das Pferd|horse|🐎|Das Pferd läuft schnell.|The horse runs fast.
die Kuh|cow|🐄|Die Kuh gibt Milch.|The cow gives milk.
das Schaf|sheep|🐑|Viele Schafe auf der Wiese.|Lots of sheep in the meadow.
das Kaninchen|rabbit|🐇|Das Kaninchen frisst eine Karotte.|The rabbit eats a carrot.
die Maus|mouse|🐁|Da ist eine Maus in der Küche!|There’s a mouse in the kitchen!
der Bär|bear|🐻|Der Bär mag Honig.|The bear likes honey.
der Löwe|lion|🦁|Der Löwe ist stark.|The lion is strong.
der Elefant|elephant|🐘|Der Elefant ist riesig.|The elephant is huge.
der Affe|monkey|🐒|Der Affe isst eine Banane.|The monkey eats a banana.
der Schmetterling|butterfly|🦋|Ein Schmetterling auf der Blume.|A butterfly on the flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
das Hemd|shirt|👔|Ein weißes Hemd für die Arbeit.|A white shirt for work.
das T-Shirt|T-shirt|👕|Ein T-Shirt aus Baumwolle.|A cotton T-shirt.
die Hose|trousers|👖|Die Hose ist zu lang.|The trousers are too long.
das Kleid|dress|👗|Sie trägt ein rotes Kleid.|She’s wearing a red dress.
der Rock|skirt|🩳|Ein Rock für den Sommer.|A skirt for the summer.
die Schuhe|shoes|👞|Ich brauche neue Schuhe.|I need new shoes.
die Jacke|jacket|🧥|Zieh deine Jacke an.|Put your jacket on.
der Pullover|jumper|🧶|Ein warmer Pullover.|A warm jumper.
die Mütze|woolly hat|🧢|Im Winter trage ich eine Mütze.|In winter I wear a hat.
der Schal|scarf|🧣|Ein Schal von Oma.|A scarf from Grandma.
die Brille|glasses|👓|Wo ist meine Brille?|Where are my glasses?
tragen|to wear / carry|🧳|Er trägt immer eine Krawatte.|He always wears a tie.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
die Schule|school|🏫|Die Schule ist neben dem Park.|The school is next to the park.
der Unterricht|lessons|🧑‍🏫|Der Unterricht beginnt um acht.|Lessons start at eight.
der Lehrer|teacher (m)|👨‍🏫|Der Lehrer erklärt sehr gut.|The teacher explains very well.
die Lehrerin|teacher (f)|👩‍🏫|Die Lehrerin ist nett.|The teacher is nice.
der Schüler|pupil|🧑‍🎓|In der Klasse sind zwanzig Schüler.|There are twenty pupils in the class.
das Buch|book|📕|Öffnet das Buch auf Seite zehn.|Open your books at page ten.
das Heft|exercise book|📓|Schreib in dein Heft.|Write in your exercise book.
der Bleistift|pencil|✏️|Hast du einen Bleistift?|Do you have a pencil?
der Kugelschreiber|pen|🖊️|Unterschreib hier mit dem Kugelschreiber.|Sign here with the pen.
die Hausaufgaben|homework|📝|Ich habe viele Hausaufgaben.|I have a lot of homework.
die Frage|question|❓|Ich habe eine Frage.|I have a question.
die Antwort|answer|💡|Die Antwort ist richtig.|The answer is correct.
lernen|to learn|🌱|Ich lerne jeden Tag zehn Wörter.|I learn ten words a day.
verstehen|to understand|🤔|Ich verstehe das nicht.|I don’t understand that.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
der Teller|plate|🍽️|Stell die Teller auf den Tisch.|Put the plates on the table.
das Glas|glass|🥛|Ein Glas Wasser.|A glass of water.
die Tasse|cup|☕|Meine Lieblingstasse.|My favourite cup.
das Messer|knife|🔪|Das Messer ist scharf.|The knife is sharp.
die Gabel|fork|🍴|Ich brauche eine Gabel.|I need a fork.
der Löffel|spoon|🥄|Iss die Suppe mit dem Löffel.|Eat the soup with the spoon.
der Topf|pot|🍲|Wasser im Topf kochen.|Boil water in the pot.
die Pfanne|frying pan|🍳|Eier in der Pfanne braten.|Fry eggs in the pan.
der Ofen|oven|🔥|Der Kuchen ist im Ofen.|The cake is in the oven.
das Salz|salt|🧂|Gibst du mir das Salz?|Can you pass me the salt?
die Butter|butter|🧈|Brot mit Butter.|Bread and butter.
schneiden|to cut|✂️|Schneid die Tomaten.|Cut the tomatoes.
abwaschen|to do the washing-up|🧽|Ich wasche heute ab.|I’ll do the washing-up today.
`),
  t('A2', 'jobs', '👷', 'Jobs', 'Les métiers', `
der Krankenpfleger|nurse|👩‍⚕️|Der Krankenpfleger arbeitet nachts.|The nurse works nights.
der Koch|cook|🧑‍🍳|Der Koch macht eine Suppe.|The cook is making soup.
der Polizist|police officer|👮|Der Polizist hilft uns.|The police officer helps us.
der Feuerwehrmann|firefighter|🧑‍🚒|Die Feuerwehr kam schnell.|The fire brigade came quickly.
der Anwalt|lawyer|⚖️|Meine Cousine ist Anwältin.|My cousin is a lawyer.
der Ingenieur|engineer|👷|Er arbeitet als Ingenieur.|He works as an engineer.
der Bauer|farmer|🧑‍🌾|Der Bauer erntet Kartoffeln.|The farmer harvests potatoes.
der Bäcker|baker|🥖|Der Bäcker beginnt um vier Uhr.|The baker starts at four.
der Verkäufer|shop assistant|🧑‍💼|Die Verkäuferin war sehr nett.|The shop assistant was very nice.
der Fahrer|driver|🧑‍✈️|Der Busfahrer ist freundlich.|The bus driver is friendly.
der Wissenschaftler|scientist|🧑‍🔬|Sie ist Wissenschaftlerin.|She’s a scientist.
in Rente gehen|to retire|🏖️|Mein Vater geht nächstes Jahr in Rente.|My father retires next year.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
gestern Abend|last night|🌃|Gestern Abend waren wir im Kino.|Last night we were at the cinema.
letzte Woche|last week|🗓️|Letzte Woche war ich krank.|Last week I was ill.
letztes Jahr|last year|🎆|Letztes Jahr waren wir in Spanien.|Last year we were in Spain.
vor zwei Tagen|two days ago|⌛|Ich bin vor zwei Tagen angekommen.|I arrived two days ago.
ich war|I was|📍|Ich war in München.|I was in Munich.
ich hatte|I had|🤲|Ich hatte einen langen Tag.|I had a long day.
ich bin gegangen|I went|🚶|Ich bin zum Markt gegangen.|I went to the market.
ich habe gegessen|I ate|🍽️|Ich habe Pizza gegessen.|I ate pizza.
ich habe gesehen|I saw|👀|Ich habe Lena gesehen.|I saw Lena.
ich habe gekauft|I bought|🛍️|Ich habe eine Jacke gekauft.|I bought a jacket.
als Kind|as a child|🧒|Als Kind wohnte ich auf dem Land.|As a child I lived in the country.
früher|in the past / formerly|🕰️|Früher war hier ein Kino.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
alles klar|all right / got it|👌|Alles klar, bis morgen!|Got it, see you tomorrow!
genau|exactly|🎯|Genau, so ist es.|Exactly, that’s how it is.
kein Problem|no problem|😌|Kein Problem, gern!|No problem, gladly!
schade|what a pity|😞|Schade, dass du nicht kommst.|What a pity you’re not coming.
egal|doesn’t matter|🤷|Pizza oder Pasta? Egal.|Pizza or pasta? Doesn’t matter.
viel Glück|good luck|🍀|Viel Glück bei der Prüfung!|Good luck with the exam!
herzlichen Glückwunsch|congratulations|🎉|Herzlichen Glückwunsch zum Geburtstag!|Happy birthday!
gute Besserung|get well soon|🤒|Gute Besserung!|Get well soon!
bis gleich|see you in a bit|👋|Bis gleich!|See you in a bit!
Prost|cheers|🍻|Prost, auf uns!|Cheers, to us!
na ja|well…|🤨|Na ja, es geht.|Well, it’s OK.
Mahlzeit|enjoy your lunch|🍽️|Mahlzeit, Kollegen!|Enjoy your lunch, everyone!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
auch|also|➕|Ich spreche auch Spanisch.|I also speak Spanish.
außerdem|besides|📎|Außerdem ist es zu teuer.|Besides, it’s too expensive.
also|so|➡️|Es regnet, also bleiben wir hier.|It’s raining, so we’re staying here.
während|while|⏯️|Ich lese, während ich warte.|I read while I wait.
obwohl|although|🌗|Obwohl ich müde bin, komme ich.|Although I’m tired, I’m coming.
sobald|as soon as|⚡|Ruf mich an, sobald du ankommst.|Call me as soon as you arrive.
zuerst|first|1️⃣|Zuerst essen wir, dann gehen wir aus.|First we eat, then we go out.
schließlich|finally|🏁|Schließlich haben wir es geschafft.|Finally we made it.
zum Beispiel|for example|📌|Ich mag Obst, zum Beispiel Äpfel.|I like fruit, for example apples.
nämlich|you see / namely|💡|Ich komme nicht, ich bin nämlich krank.|I’m not coming; I’m ill, you see.
dagegen|on the other hand|⚖️|Ich mag Berge, er dagegen das Meer.|I like mountains; he, on the other hand, the sea.
`),
];
