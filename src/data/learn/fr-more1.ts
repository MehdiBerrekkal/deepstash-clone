import type { Level, Topic, Word } from '@/data/learn/full';

/** French, pack 1: everyday verbs, routine, questions, animals, school, kitchen, jobs, past, expressions, linking words, nature. Lines are "mot|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `fr-${id}`, level, icon, en, fr, words: w5(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
être|to be|🪪|Je suis professeur de musique.|I’m a music teacher.
avoir|to have|🤲|J’ai deux frères.|I have two brothers.
aller|to go|🚶|Je vais au travail en métro.|I go to work by underground.
venir|to come|👋|Tu viens à la fête ?|Are you coming to the party?
faire|to do / to make|🛠️|Qu’est-ce que tu fais ce soir ?|What are you doing tonight?
prendre|to take|✋|Je prends le bus à huit heures.|I take the bus at eight.
mettre|to put / to put on|📥|Mets ton manteau.|Put your coat on.
dire|to say|💬|Qu’est-ce qu’il dit ?|What is he saying?
parler|to speak|🗣️|Je parle un peu français.|I speak a little French.
voir|to see|👀|Je vois la mer depuis ma fenêtre.|I can see the sea from my window.
regarder|to watch / look at|📺|On regarde un film ce soir.|We’re watching a film tonight.
écouter|to listen|🎧|J’écoute la radio le matin.|I listen to the radio in the morning.
savoir|to know (a fact)|🧠|Je ne sais pas.|I don’t know.
connaître|to know (a person, a place)|🤝|Tu connais Camille ?|Do you know Camille?
vouloir|to want|🙏|Je veux un café.|I want a coffee.
pouvoir|can / to be able to|💪|Je peux t’aider ?|Can I help you?
devoir|must / to have to|📌|Je dois partir.|I have to go.
aimer|to like / to love|❤️|J’aime le chocolat.|I like chocolate.
ouvrir|to open|🔓|Ouvre la fenêtre, s’il te plaît.|Open the window, please.
fermer|to close|🔒|Le magasin ferme à vingt heures.|The shop closes at eight p.m.
donner|to give|🎁|Donne-moi la main.|Give me your hand.
chercher|to look for|🔍|Je cherche mes clés.|I’m looking for my keys.
trouver|to find|💡|J’ai trouvé un bon restaurant.|I found a good restaurant.
attendre|to wait|⏳|Je t’attends devant la gare.|I’ll wait for you outside the station.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
se réveiller|to wake up|⏰|Je me réveille à sept heures.|I wake up at seven.
se lever|to get up|🛏️|Je me lève tôt.|I get up early.
se doucher|to shower|🚿|Je me douche le matin.|I shower in the morning.
s’habiller|to get dressed|👔|Je m’habille vite.|I get dressed quickly.
le petit-déjeuner du matin|breakfast|🥐|Le petit-déjeuner est prêt !|Breakfast is ready!
le déjeuner|lunch|🥗|On déjeune à midi.|We have lunch at noon.
le dîner|dinner|🍝|Le dîner est à vingt heures.|Dinner is at eight p.m.
se brosser les dents|to brush your teeth|🪥|Brosse-toi les dents !|Brush your teeth!
se coucher|to go to bed|🌙|Je me couche à vingt-trois heures.|I go to bed at eleven p.m.
dormir|to sleep|😴|Je dors huit heures par nuit.|I sleep eight hours a night.
partir|to leave|🚪|Je pars de chez moi à huit heures.|I leave home at eight.
rentrer|to come home|↩️|Je rentre vers dix-huit heures.|I come home around six.
tôt|early|🌅|Je suis arrivé tôt.|I arrived early.
tard|late|🌆|Il est tard, je vais dormir.|It’s late, I’m going to sleep.
toujours|always|♾️|Je bois toujours un café le matin.|I always have a coffee in the morning.
jamais|never|🚫|Je ne bois jamais de café le soir.|I never drink coffee in the evening.
parfois|sometimes|🔀|Parfois je vais à la salle de sport.|Sometimes I go to the gym.
d’habitude|usually|📅|D’habitude, je vais au travail à vélo.|I usually cycle to work.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
qu’est-ce que|what|❓|Qu’est-ce que c’est ?|What is it?
qui|who|🕵️|Qui est ton professeur ?|Who is your teacher?
où|where|📍|Où sont les toilettes ?|Where is the toilet?
quand|when|📆|Quand est ton anniversaire ?|When is your birthday?
pourquoi|why|🤔|Pourquoi tu es triste ?|Why are you sad?
comment|how|🤷|Comment tu t’appelles ?|What’s your name?
combien de|how many|🔢|Combien de personnes ?|How many people?
quel|which / what|☝️|Quel est ton film préféré ?|What’s your favourite film?
parce que|because|💡|J’apprends le français parce que j’aime Paris.|I’m learning French because I love Paris.
est-ce que|(question marker)|🙋|Est-ce que tu viens ?|Are you coming?
d’où|where from|🌍|D’où viens-tu ?|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
le chien|dog|🐕|Mon chien s’appelle Filou.|My dog is called Filou.
le chat|cat|🐈|Le chat dort sur le canapé.|The cat sleeps on the sofa.
l’oiseau|bird|🐦|Un oiseau chante dans l’arbre.|A bird is singing in the tree.
le cheval|horse|🐎|Le cheval court vite.|The horse runs fast.
la vache|cow|🐄|La vache donne du lait.|The cow gives milk.
le mouton|sheep|🐑|Il y a des moutons dans le champ.|There are sheep in the field.
le lapin|rabbit|🐇|Le lapin mange une carotte.|The rabbit is eating a carrot.
la souris|mouse|🐁|Il y a une souris dans la cuisine !|There’s a mouse in the kitchen!
l’ours|bear|🐻|L’ours adore le miel.|The bear loves honey.
le lion|lion|🦁|Le lion est le roi de la jungle.|The lion is the king of the jungle.
l’éléphant|elephant|🐘|L’éléphant est énorme.|The elephant is huge.
le singe|monkey|🐒|Le singe mange une banane.|The monkey is eating a banana.
le papillon|butterfly|🦋|Un papillon sur une fleur.|A butterfly on a flower.
l’escargot|snail|🐌|L’escargot est très lent.|The snail is very slow.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
l’école|school|🏫|L’école est à côté du parc.|The school is next to the park.
la classe|class / classroom|🧑‍🏫|La classe commence à huit heures.|Class starts at eight.
le professeur|teacher|👨‍🏫|Le professeur explique très bien.|The teacher explains very well.
l’élève|pupil|🧑‍🎓|Il y a vingt élèves.|There are twenty pupils.
le livre|book|📕|Ouvrez le livre page dix.|Open your books at page ten.
le cahier|exercise book|📓|Écris dans ton cahier.|Write in your exercise book.
le crayon|pencil|✏️|Tu as un crayon ?|Do you have a pencil?
le stylo|pen|🖊️|Signe ici avec le stylo.|Sign here with the pen.
le sac à dos|backpack|🎒|Mon sac à dos est lourd.|My backpack is heavy.
les devoirs|homework|📝|J’ai beaucoup de devoirs.|I have a lot of homework.
la question|question|❓|J’ai une question.|I have a question.
la réponse|answer|💡|C’est la bonne réponse !|That’s the right answer!
apprendre|to learn|🌱|J’apprends dix mots par jour.|I learn ten words a day.
comprendre|to understand|🤔|Je ne comprends pas ce mot.|I don’t understand this word.
répéter|to repeat|🔁|Vous pouvez répéter ?|Can you repeat that?
`),
  t('A1', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
l’assiette|plate|🍽️|Mets les assiettes sur la table.|Put the plates on the table.
le verre|glass|🥛|Un verre d’eau fraîche.|A glass of cool water.
la tasse|cup|☕|Ma tasse préférée est bleue.|My favourite cup is blue.
le couteau|knife|🔪|Ce couteau coupe bien.|This knife cuts well.
la fourchette|fork|🍴|Il me faut une fourchette.|I need a fork.
la cuillère|spoon|🥄|Mange ta soupe avec la cuillère.|Eat your soup with the spoon.
la casserole|saucepan|🍲|Fais chauffer l’eau dans la casserole.|Heat the water in the saucepan.
la poêle|frying pan|🍳|Les crêpes dans la poêle.|Crêpes in the frying pan.
le four|oven|🔥|Le gâteau est au four.|The cake is in the oven.
le sel|salt|🧂|Tu me passes le sel ?|Can you pass me the salt?
l’huile|oil|🫒|Un peu d’huile d’olive.|A little olive oil.
le beurre|butter|🧈|Du pain avec du beurre.|Bread with butter.
couper|to cut|✂️|Coupe les tomates.|Cut the tomatoes.
faire la vaisselle|to do the washing-up|🧽|C’est mon tour de faire la vaisselle.|It’s my turn to do the washing-up.
`),
  t('A2', 'jobs', '👷', 'Jobs', 'Les métiers', `
l’infirmier|nurse|👩‍⚕️|L’infirmière travaille la nuit.|The nurse works nights.
le cuisinier|cook|🧑‍🍳|Le cuisinier prépare la sauce.|The cook is making the sauce.
le policier|police officer|👮|Le policier nous a aidés.|The police officer helped us.
le pompier|firefighter|🧑‍🚒|Les pompiers sont arrivés vite.|The firefighters arrived quickly.
l’avocat|lawyer|⚖️|Ma cousine est avocate.|My cousin is a lawyer.
l’ingénieur|engineer|👷|Il travaille comme ingénieur.|He works as an engineer.
l’agriculteur|farmer|🧑‍🌾|L’agriculteur récolte le blé.|The farmer harvests the wheat.
le boulanger|baker|🥖|Le boulanger commence à quatre heures.|The baker starts at four.
le vendeur|shop assistant|🧑‍💼|La vendeuse m’a conseillé.|The shop assistant advised me.
le chauffeur|driver|🧑‍✈️|Le chauffeur de bus est sympa.|The bus driver is nice.
le chercheur|researcher|🧑‍🔬|Elle est chercheuse en biologie.|She’s a biology researcher.
l’artiste|artist|🧑‍🎨|C’est une artiste célèbre.|She’s a famous artist.
prendre sa retraite|to retire|🏖️|Mon père prend sa retraite.|My father is retiring.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
hier soir|last night|🌃|Hier soir, on a dîné chez Hugo.|Last night we had dinner at Hugo’s.
la semaine dernière|last week|🗓️|La semaine dernière, j’étais malade.|Last week I was ill.
l’année dernière|last year|🎆|L’année dernière, on est allés en Italie.|Last year we went to Italy.
il y a deux jours|two days ago|⌛|Je suis arrivé il y a deux jours.|I arrived two days ago.
je suis allé|I went|🚶|Je suis allé au marché.|I went to the market.
j’ai fait|I did / made|🛠️|J’ai fait un gâteau.|I made a cake.
j’ai mangé|I ate|🍽️|J’ai mangé une crêpe.|I ate a crêpe.
j’ai vu|I saw|👀|J’ai vu Camille en ville.|I saw Camille in town.
j’ai eu|I had|🤲|J’ai eu une longue journée.|I had a long day.
j’ai acheté|I bought|🛍️|J’ai acheté un manteau.|I bought a coat.
quand j’étais petit|when I was little|🧒|Quand j’étais petit, j’habitais à la campagne.|When I was little, I lived in the country.
autrefois|in the past / formerly|🕰️|Autrefois, il y avait un cinéma ici.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
d’accord|OK / agreed|👌|D’accord, à demain !|OK, see you tomorrow!
bien sûr|of course|✅|Bien sûr, je t’aide.|Of course I’ll help you.
pas de souci|no problem|😌|Pas de souci, je comprends.|No problem, I understand.
c’est pas grave|it doesn’t matter|🙂|C’est pas grave, ça arrive.|It doesn’t matter, it happens.
tant pis|too bad / never mind|🤷|Il n’y a plus de place ? Tant pis.|No more seats? Never mind.
ça dépend|it depends|⚖️|Ça dépend du temps.|It depends on the weather.
volontiers|gladly|😊|Un café ? Volontiers !|A coffee? Gladly!
bon courage|good luck / hang in there|💪|Bon courage pour l’examen !|Good luck with the exam!
félicitations|congratulations|🎉|Félicitations pour ton nouveau travail !|Congratulations on your new job!
à tout à l’heure|see you later|👋|À tout à l’heure !|See you later!
ça marche|deal / that works|🤝|Huit heures ? Ça marche !|Eight o’clock? Deal!
n’importe quoi|nonsense|🙄|Il dit n’importe quoi.|He’s talking nonsense.
`),
  t('A2', 'nature', '🌳', 'In the countryside', 'À la campagne', `
la campagne|countryside|🌾|Le week-end, on va à la campagne.|At weekends we go to the countryside.
la rivière|river|🏞️|La rivière traverse le village.|The river runs through the village.
la forêt|forest|🌲|On se promène en forêt.|We go for walks in the forest.
l’arbre|tree|🌳|Cet arbre a cent ans.|This tree is a hundred years old.
la fleur|flower|🌼|Les fleurs sentent bon.|The flowers smell lovely.
la colline|hill|⛰️|On a monté la colline.|We climbed the hill.
le lac|lake|🏞️|On a nagé dans le lac.|We swam in the lake.
le champ|field|🌾|Des vaches dans le champ.|Cows in the field.
le village|village|🏘️|Ma grand-mère vit dans un village.|My grandmother lives in a village.
la ferme|farm|🚜|On a visité une ferme.|We visited a farm.
le ciel|sky|🌌|Le ciel est dégagé.|The sky is clear.
l’étoile|star|⭐|On voit les étoiles ici.|You can see the stars here.
la lune|moon|🌙|C’est la pleine lune.|It’s a full moon.
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
aussi|also|➕|Je parle aussi espagnol.|I also speak Spanish.
en plus|besides / what’s more|📎|En plus, c’est gratuit.|What’s more, it’s free.
donc|so / therefore|➡️|Il pleut, donc je reste ici.|It’s raining, so I’m staying here.
pendant que|while|⏯️|Je lis pendant que j’attends.|I read while I wait.
bien que|although|🌗|Bien qu’il soit tard, je travaille.|Although it’s late, I’m working.
dès que|as soon as|⚡|Appelle-moi dès que tu arrives.|Call me as soon as you arrive.
malgré|despite|🧱|Malgré la pluie, on est sortis.|Despite the rain, we went out.
tout d’abord|first of all|1️⃣|Tout d’abord, merci d’être venus.|First of all, thank you for coming.
enfin|finally|🏁|Enfin, parlons du budget.|Finally, let’s talk about the budget.
par exemple|for example|📌|J’aime les fruits, par exemple les fraises.|I like fruit, for example strawberries.
en fait|actually|💡|En fait, je n’y suis jamais allé.|Actually, I’ve never been there.
pourtant|yet / however|↔️|Il est riche, pourtant il n’est pas heureux.|He’s rich, yet he isn’t happy.
`),
];
