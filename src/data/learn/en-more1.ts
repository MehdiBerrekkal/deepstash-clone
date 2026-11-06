import type { Level, Topic, Word } from '@/data/learn/full';

/** English, pack 1, for French speakers: everyday verbs, routine, describing, places, jobs, nature, phrasal verbs. Lines are "word|French|emoji|example|example in French". */
function w5(block: string): Word[] {
  return block
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [text, fr, emoji, ex, exFr] = l.split('|').map((x) => x.trim());
      return { text, en: fr, fr, emoji: emoji || '•', ...(ex ? { ex, exEn: exFr, exFr } : {}) };
    });
}
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `en-${id}`, level, icon, en, fr, words: w5(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
to go|aller|🚶|I go to work by bus.|Je vais au travail en bus.
to come|venir|👋|Are you coming to the party?|Tu viens à la fête ?
to have|avoir|🤲|I have two brothers.|J’ai deux frères.
to do|faire|🛠️|What are you doing tonight?|Tu fais quoi ce soir ?
to make|faire / fabriquer|🧑‍🍳|I’m making a cake.|Je fais un gâteau.
to see|voir|👀|I can see the sea!|Je vois la mer !
to look at|regarder|👁️|Look at this photo.|Regarde cette photo.
to watch|regarder (un écran)|📺|We watch a film every Friday.|On regarde un film tous les vendredis.
to listen to|écouter|🎧|I listen to podcasts.|J’écoute des podcasts.
to hear|entendre|👂|Can you hear me?|Tu m’entends ?
to speak|parler|🗣️|Do you speak English?|Tu parles anglais ?
to say|dire|💬|What did she say?|Qu’est-ce qu’elle a dit ?
to tell|raconter / dire à|🗨️|Tell me a story.|Raconte-moi une histoire.
to know|savoir / connaître|🧠|I don’t know the answer.|Je ne connais pas la réponse.
to think|penser|💭|I think it’s a good idea.|Je pense que c’est une bonne idée.
to want|vouloir|🙏|I want a new phone.|Je veux un nouveau téléphone.
to need|avoir besoin de|🆘|I need help.|J’ai besoin d’aide.
to like|aimer bien|👍|I like chocolate.|J’aime le chocolat.
to love|adorer / aimer|❤️|I love this song.|J’adore cette chanson.
to buy|acheter|🛒|I buy fruit at the market.|J’achète des fruits au marché.
to open|ouvrir|🔓|Open the window, please.|Ouvre la fenêtre, s’il te plaît.
to close|fermer|🔒|The shop closes at six.|Le magasin ferme à dix-huit heures.
to give|donner|🎁|Give me your hand.|Donne-moi la main.
to take|prendre|✋|Take an umbrella.|Prends un parapluie.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
to wake up|se réveiller|⏰|I wake up at seven.|Je me réveille à sept heures.
to get up|se lever|🛏️|I get up very early.|Je me lève très tôt.
to have a shower|se doucher|🚿|I have a shower in the morning.|Je me douche le matin.
to get dressed|s’habiller|👔|I get dressed quickly.|Je m’habille vite.
to have breakfast|prendre le petit-déjeuner|🥣|I have breakfast at home.|Je prends le petit-déjeuner à la maison.
lunch|le déjeuner|🥪|Lunch is at one o’clock.|Le déjeuner est à treize heures.
dinner|le dîner|🍝|Dinner is ready!|Le dîner est prêt !
to brush your teeth|se brosser les dents|🪥|Brush your teeth before bed.|Brosse-toi les dents avant de dormir.
to go to bed|aller se coucher|🌙|I go to bed at eleven.|Je me couche à vingt-trois heures.
to sleep|dormir|😴|I sleep eight hours.|Je dors huit heures.
to leave|partir / quitter|🚪|I leave home at eight.|Je pars de chez moi à huit heures.
to come back|revenir|↩️|I come back at six.|Je rentre à dix-huit heures.
early|tôt|🌅|I arrived early today.|Je suis arrivé tôt aujourd’hui.
late|tard / en retard|🌆|You’re always late!|Tu es toujours en retard !
always|toujours|♾️|I always drink tea in the morning.|Je bois toujours du thé le matin.
never|jamais|🚫|I never drink coffee at night.|Je ne bois jamais de café le soir.
sometimes|parfois|🔀|Sometimes I go to the gym.|Parfois, je vais à la salle de sport.
usually|d’habitude|📅|I usually walk to work.|D’habitude, je vais au travail à pied.
`),
  t('A1', 'adjectives', '✨', 'Describing things', 'Décrire les choses', `
fast|rapide|🚀|The train is very fast.|Le train est très rapide.
slow|lent|🐌|The internet is slow today.|Internet est lent aujourd’hui.
easy|facile|👌|The exercise is easy.|L’exercice est facile.
difficult|difficile|🧗|The exam was difficult.|L’examen était difficile.
full|plein|🈵|The bus is full.|Le bus est plein.
empty|vide|🫙|The glass is empty.|Le verre est vide.
clean|propre|🧼|The room is clean.|La chambre est propre.
dirty|sale|🦠|Your shoes are dirty.|Tes chaussures sont sales.
tall|grand (taille)|🦒|My brother is very tall.|Mon frère est très grand.
short|petit / court|📏|The film is short.|Le film est court.
long|long|📜|It was a long day.|C’était une longue journée.
heavy|lourd|🏋️|This bag is heavy.|Ce sac est lourd.
light|léger / clair|🪶|My jacket is very light.|Ma veste est très légère.
quiet|calme / silencieux|🤫|The library is quiet.|La bibliothèque est calme.
noisy|bruyant|🔊|The street is noisy.|La rue est bruyante.
young|jeune|🧒|She’s very young.|Elle est très jeune.
funny|drôle|😂|Your brother is so funny!|Ton frère est trop drôle !
kind|gentil|🤗|The receptionist was very kind.|La réceptionniste était très gentille.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
what|quoi / que|❓|What is this?|Qu’est-ce que c’est ?
who|qui|🕵️|Who is your teacher?|Qui est ton professeur ?
where|où|📍|Where is the toilet?|Où sont les toilettes ?
when|quand|📆|When is your birthday?|C’est quand ton anniversaire ?
why|pourquoi|🤔|Why are you sad?|Pourquoi tu es triste ?
how|comment|🤷|How are you?|Comment ça va ?
how many|combien de|🔢|How many people are there?|Combien de personnes y a-t-il ?
which|quel / lequel|☝️|Which one do you want?|Lequel tu veux ?
because|parce que|💡|I’m tired because I worked late.|Je suis fatigué parce que j’ai travaillé tard.
can I|est-ce que je peux|🙋|Can I sit here?|Je peux m’asseoir ici ?
could you|pourriez-vous|🙏|Could you help me, please?|Pourriez-vous m’aider, s’il vous plaît ?
do you mind|ça vous dérange|🙂|Do you mind if I open the window?|Ça vous dérange si j’ouvre la fenêtre ?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
the dog|le chien|🐕|My dog is called Max.|Mon chien s’appelle Max.
the cat|le chat|🐈|The cat sleeps on the sofa.|Le chat dort sur le canapé.
the bird|l’oiseau|🐦|A bird is singing.|Un oiseau chante.
the horse|le cheval|🐎|The horse runs fast.|Le cheval court vite.
the cow|la vache|🐄|The cow gives milk.|La vache donne du lait.
the sheep|le mouton|🐑|There are lots of sheep in Wales.|Il y a beaucoup de moutons au pays de Galles.
the rabbit|le lapin|🐇|The rabbit has long ears.|Le lapin a de longues oreilles.
the mouse|la souris|🐁|There’s a mouse in the kitchen!|Il y a une souris dans la cuisine !
the fish|le poisson (animal)|🐠|The fish swims in the water.|Le poisson nage dans l’eau.
the bear|l’ours|🐻|The bear loves honey.|L’ours adore le miel.
the lion|le lion|🦁|The lion is the king of the jungle.|Le lion est le roi de la jungle.
the elephant|l’éléphant|🐘|The elephant is huge.|L’éléphant est énorme.
the monkey|le singe|🐒|The monkey is eating a banana.|Le singe mange une banane.
the butterfly|le papillon|🦋|A butterfly on a flower.|Un papillon sur une fleur.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
the shirt|la chemise|👔|A white shirt for work.|Une chemise blanche pour le travail.
the T-shirt|le t-shirt|👕|A cotton T-shirt.|Un t-shirt en coton.
the trousers|le pantalon|👖|These trousers are too long.|Ce pantalon est trop long.
the dress|la robe|👗|She’s wearing a red dress.|Elle porte une robe rouge.
the skirt|la jupe|🩳|A summer skirt.|Une jupe d’été.
the shoes|les chaussures|👞|I need new shoes.|J’ai besoin de nouvelles chaussures.
the coat|le manteau|🧥|Put your coat on, it’s cold.|Mets ton manteau, il fait froid.
the jumper|le pull|🧶|A warm wool jumper.|Un pull en laine bien chaud.
the hat|le chapeau|👒|A hat for the sun.|Un chapeau pour le soleil.
the scarf|l’écharpe|🧣|My grandmother knitted this scarf.|Ma grand-mère a tricoté cette écharpe.
the glasses|les lunettes|👓|I can’t find my glasses.|Je ne trouve pas mes lunettes.
to wear|porter (un vêtement)|🧥|He always wears a tie.|Il porte toujours une cravate.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
the weather|le temps (météo)|🌤️|What’s the weather like?|Quel temps fait-il ?
sunny|ensoleillé|☀️|It’s sunny today.|Il fait soleil aujourd’hui.
rainy|pluvieux|🌧️|It’s a rainy day.|C’est un jour de pluie.
cloudy|nuageux|☁️|It’s cloudy this morning.|C’est nuageux ce matin.
windy|venteux|🌬️|It’s very windy.|Il y a beaucoup de vent.
the snow|la neige|❄️|There’s snow in the mountains.|Il y a de la neige à la montagne.
the storm|l’orage / la tempête|⛈️|There was a storm last night.|Il y a eu un orage cette nuit.
the umbrella|le parapluie|☂️|Take an umbrella.|Prends un parapluie.
summer|l’été|🏖️|In summer we go to the beach.|En été, on va à la plage.
winter|l’hiver|☃️|Winter is long and dark.|L’hiver est long et sombre.
spring|le printemps|🌸|In spring the trees blossom.|Au printemps, les arbres fleurissent.
autumn|l’automne|🍂|In autumn the leaves fall.|En automne, les feuilles tombent.
`),
  t('A2', 'jobs', '👷', 'Jobs', 'Les métiers', `
the nurse|l’infirmier, l’infirmière|👩‍⚕️|The nurse works nights.|L’infirmière travaille de nuit.
the teacher|le professeur|👩‍🏫|The teacher explains very well.|Le prof explique très bien.
the cook|le cuisinier|🧑‍🍳|The cook is making soup.|Le cuisinier prépare une soupe.
the waiter|le serveur|🤵|The waiter brings the menu.|Le serveur apporte la carte.
the police officer|le policier|👮|The police officer helped us.|Le policier nous a aidés.
the firefighter|le pompier|🧑‍🚒|The firefighters arrived quickly.|Les pompiers sont arrivés vite.
the lawyer|l’avocat|⚖️|My cousin is a lawyer.|Ma cousine est avocate.
the engineer|l’ingénieur|👷|He works as an engineer.|Il travaille comme ingénieur.
the farmer|l’agriculteur|🧑‍🌾|The farmer grows potatoes.|L’agriculteur cultive des pommes de terre.
the scientist|le scientifique|🧑‍🔬|Scientists study the climate.|Les scientifiques étudient le climat.
the driver|le conducteur, le chauffeur|🧑‍✈️|The bus driver is friendly.|Le chauffeur du bus est sympa.
the shop assistant|le vendeur|🧑‍💼|The shop assistant found my size.|Le vendeur a trouvé ma taille.
to retire|prendre sa retraite|🏖️|My dad retires next year.|Mon père prend sa retraite l’an prochain.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
last night|hier soir|🌃|Last night we had dinner at Emma’s.|Hier soir, on a dîné chez Emma.
last week|la semaine dernière|🗓️|Last week I was ill.|La semaine dernière, j’étais malade.
last year|l’année dernière|🎆|Last year we went to Scotland.|L’année dernière, on est allés en Écosse.
two days ago|il y a deux jours|⌛|I arrived two days ago.|Je suis arrivé il y a deux jours.
went|est allé (go)|🚶|I went to the market early.|Je suis allé au marché tôt.
did|a fait (do)|🛠️|I did my homework after dinner.|J’ai fait mes devoirs après le dîner.
ate|a mangé (eat)|🍽️|We ate fish and chips.|On a mangé du fish and chips.
saw|a vu (see)|👀|I saw Emma in town.|J’ai vu Emma en ville.
had|a eu (have)|🤲|I had a long day.|J’ai eu une longue journée.
bought|a acheté (buy)|🛍️|She bought a new coat.|Elle a acheté un nouveau manteau.
came|est venu (come)|👋|They came to the party.|Ils sont venus à la fête.
met|a rencontré (meet)|🤝|I met Tom at university.|J’ai rencontré Tom à la fac.
as a child|quand j’étais enfant|🧒|As a child, I lived in the country.|Enfant, je vivais à la campagne.
`),
  t('A2', 'phrasal', '🔗', 'Phrasal verbs', 'Verbes à particule', `
to get on|monter (dans un bus) / bien s’entendre|🚌|We get on very well.|On s’entend très bien.
to get off|descendre (d’un bus)|⬇️|Get off at the next stop.|Descends au prochain arrêt.
to look for|chercher|🔍|I’m looking for my keys.|Je cherche mes clés.
to look after|s’occuper de|🧸|She looks after her little brother.|Elle s’occupe de son petit frère.
to turn on|allumer|💡|Turn on the light, please.|Allume la lumière, s’il te plaît.
to turn off|éteindre|🔌|Turn off your phone.|Éteins ton téléphone.
to pick up|ramasser / aller chercher|🙋|I’ll pick you up at eight.|Je passe te chercher à huit heures.
to give up|abandonner / arrêter|🏳️|Don’t give up!|N’abandonne pas !
to find out|découvrir|💡|I found out the truth.|J’ai découvert la vérité.
to set up|installer / créer|🏗️|She set up her own company.|Elle a créé sa propre entreprise.
to run out of|ne plus avoir de|🫙|We’ve run out of milk.|On n’a plus de lait.
to carry on|continuer|➡️|Carry on, you’re doing great!|Continue, c’est super !
`),
  t('A2', 'nature', '🌳', 'In the countryside', 'À la campagne', `
the countryside|la campagne|🌾|We live in the countryside.|Nous vivons à la campagne.
the river|la rivière|🏞️|The river runs through the village.|La rivière traverse le village.
the forest|la forêt|🌲|We walk in the forest.|On se promène en forêt.
the tree|l’arbre|🌳|This tree is very old.|Cet arbre est très vieux.
the flower|la fleur|🌼|The flowers smell lovely.|Les fleurs sentent bon.
the hill|la colline|⛰️|We climbed the hill.|Nous avons monté la colline.
the lake|le lac|🏞️|We swam in the lake.|Nous avons nagé dans le lac.
the field|le champ|🌾|Cows in the field.|Des vaches dans le champ.
the village|le village|🏘️|My grandma lives in a village.|Ma grand-mère vit dans un village.
the farm|la ferme|🚜|We visited a farm.|Nous avons visité une ferme.
the sky|le ciel|🌌|The sky is clear tonight.|Le ciel est dégagé ce soir.
the star|l’étoile|⭐|You can see the stars here.|On voit les étoiles ici.
the moon|la lune|🌙|There’s a full moon.|C’est la pleine lune.
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
also|aussi|➕|I also speak Spanish.|Je parle aussi espagnol.
besides|en plus|📎|Besides, it’s too expensive.|En plus, c’est trop cher.
therefore|par conséquent|➡️|There are no trains, therefore we’ll drive.|Il n’y a pas de train, donc on prendra la voiture.
while|pendant que|⏯️|I read while I wait.|Je lis pendant que j’attends.
unless|à moins que|🚧|I’ll come unless it rains.|Je viens, à moins qu’il pleuve.
as soon as|dès que|⚡|Call me as soon as you arrive.|Appelle-moi dès que tu arrives.
in spite of|malgré|🧱|In spite of the rain, we went out.|Malgré la pluie, nous sommes sortis.
first of all|tout d’abord|1️⃣|First of all, thank you for coming.|Tout d’abord, merci d’être venus.
finally|enfin|🏁|Finally, let’s talk about money.|Enfin, parlons d’argent.
for example|par exemple|📌|I love fruit, for example mangoes.|J’adore les fruits, par exemple les mangues.
in fact|en fait|💡|In fact, I’ve never been there.|En fait, je n’y suis jamais allé.
on the other hand|d’un autre côté|⚖️|On the other hand, it’s very central.|D’un autre côté, c’est très central.
`),
  t('B1', 'mind', '🧠', 'Thinking and feeling', 'Penser et ressentir', `
the idea|l’idée|💡|What a great idea!|Quelle excellente idée !
the doubt|le doute|🤔|I have my doubts.|J’ai des doutes.
to decide|décider|🎯|I haven’t decided yet.|Je n’ai pas encore décidé.
to imagine|imaginer|🌈|Imagine a city without cars.|Imagine une ville sans voitures.
to remember|se souvenir|🧠|Do you remember that summer?|Tu te souviens de cet été-là ?
to forget|oublier|🫥|I forgot her name.|J’ai oublié son nom.
to feel|se sentir / ressentir|💗|I feel much better.|Je me sens beaucoup mieux.
the hope|l’espoir|🌅|Never lose hope.|Ne perds jamais espoir.
to trust|faire confiance|🤝|I trust you.|Je te fais confiance.
to regret|regretter|😞|I don’t regret anything.|Je ne regrette rien.
patience|la patience|🧘|You need patience.|Il faut de la patience.
the mood|l’humeur|😄|I’m in a good mood today.|Je suis de bonne humeur aujourd’hui.
`),
];
