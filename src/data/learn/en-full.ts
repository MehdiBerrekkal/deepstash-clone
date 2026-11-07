import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/**
 * English, A1 → B1, for French speakers. Original content written for this app. Lines are
 * "word|French|emoji|example|example in French": meanings and translations are given in French.
 */
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

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
hello|bonjour|👋|Hello, I’m Emma.|Bonjour, je suis Emma.
hi|salut|🙋|Hi Tom, how are you?|Salut Tom, comment ça va ?
goodbye|au revoir|🫡|Goodbye, see you tomorrow!|Au revoir, à demain !
thank you|merci|🙏|Thank you very much!|Merci beaucoup !
please|s’il vous plaît|🥺|A coffee, please.|Un café, s’il vous plaît.
sorry|pardon / désolé|😅|Sorry, I’m late.|Désolé, je suis en retard.
excuse me|excusez-moi|🙇|Excuse me, where is the station?|Excusez-moi, où est la gare ?
nice to meet you|enchanté|🤝|Nice to meet you, I’m Tom.|Enchanté, je suis Tom.
the name|le nom / le prénom|🏷️|What’s your name?|Comment tu t’appelles ?
the friend|l’ami, l’amie|👫|Emma is my friend.|Emma est mon amie.
the man|l’homme|👨|The man is reading the paper.|L’homme lit le journal.
the woman|la femme|👩|The woman is on the phone.|La femme est au téléphone.
the child|l’enfant|🧒|The child is playing in the garden.|L’enfant joue dans le jardin.
yes|oui|✅|Yes, of course!|Oui, bien sûr !
no|non|❌|No, thanks.|Non, merci.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
coffee|le café|☕|A black coffee, please.|Un café noir, s’il vous plaît.
tea|le thé|🍵|Tea with milk, please.|Un thé au lait, s’il vous plaît.
water|l’eau|💧|A glass of water, please.|Un verre d’eau, s’il vous plaît.
juice|le jus|🧃|An orange juice, please.|Un jus d’orange, s’il vous plaît.
milk|le lait|🥛|With milk and sugar?|Avec du lait et du sucre ?
sugar|le sucre|🍬|No sugar, thanks.|Sans sucre, merci.
the cake|le gâteau|🍰|This chocolate cake is delicious.|Ce gâteau au chocolat est délicieux.
the sandwich|le sandwich|🥪|A cheese sandwich, please.|Un sandwich au fromage, s’il vous plaît.
the bill|l’addition|🧾|Could we have the bill, please?|L’addition, s’il vous plaît ?
I’d like|je voudrais|🙂|I’d like a cappuccino.|Je voudrais un cappuccino.
how much|combien|💷|How much is it?|C’est combien ?
delicious|délicieux|😋|That was delicious!|C’était délicieux !
hot|chaud|♨️|Careful, it’s hot.|Attention, c’est chaud.
cold|froid|🧊|The water is cold.|L’eau est froide.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
the family|la famille|👪|My family lives in Manchester.|Ma famille habite à Manchester.
the mother|la mère|👩|My mother is a nurse.|Ma mère est infirmière.
the father|le père|👨|My father loves cooking.|Mon père adore cuisiner.
the parents|les parents|👨‍👩‍👧|My parents are on holiday.|Mes parents sont en vacances.
the brother|le frère|👦|My brother is called Tom.|Mon frère s’appelle Tom.
the sister|la sœur|👧|I have one sister.|J’ai une sœur.
the son|le fils|👦|Their son is ten.|Leur fils a dix ans.
the daughter|la fille|👧|My daughter likes drawing.|Ma fille aime dessiner.
the grandfather|le grand-père|👴|My grandfather is eighty.|Mon grand-père a quatre-vingts ans.
the grandmother|la grand-mère|👵|My grandmother bakes the best scones.|Ma grand-mère fait les meilleurs scones.
the uncle|l’oncle|🧔|My uncle lives in Canada.|Mon oncle habite au Canada.
the aunt|la tante|👩‍🦱|My aunt is a doctor.|Ma tante est médecin.
the husband|le mari|🤵|Her husband is Irish.|Son mari est irlandais.
the wife|la femme (épouse)|👰|His wife is an architect.|Sa femme est architecte.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
one|un|1️⃣|One coffee, please.|Un café, s’il vous plaît.
two|deux|2️⃣|Two tickets, please.|Deux billets, s’il vous plaît.
three|trois|3️⃣|There are three of us.|Nous sommes trois.
four|quatre|4️⃣|He has four children.|Il a quatre enfants.
five|cinq|5️⃣|It’s five pounds.|Ça fait cinq livres.
six|six|6️⃣|I get up at six.|Je me lève à six heures.
seven|sept|7️⃣|A week has seven days.|Une semaine a sept jours.
eight|huit|8️⃣|I work eight hours a day.|Je travaille huit heures par jour.
nine|neuf|9️⃣|My daughter is nine.|Ma fille a neuf ans.
ten|dix|🔟|The train leaves in ten minutes.|Le train part dans dix minutes.
twenty|vingt|💷|That’s twenty pounds.|Ça fait vingt livres.
a hundred|cent|💯|The hotel is a hundred metres away.|L’hôtel est à cent mètres.
how old|quel âge|🎂|How old are you?|Quel âge as-tu ?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
Monday|lundi|1️⃣|I work on Monday.|Je travaille lundi.
Tuesday|mardi|2️⃣|I go swimming on Tuesdays.|Je vais nager le mardi.
Wednesday|mercredi|3️⃣|See you on Wednesday?|On se voit mercredi ?
Thursday|jeudi|4️⃣|Thursday is my day off.|Le jeudi est mon jour de repos.
Friday|vendredi|5️⃣|We go out on Friday night.|On sort le vendredi soir.
Saturday|samedi|6️⃣|On Saturday I go to the market.|Le samedi, je vais au marché.
Sunday|dimanche|7️⃣|We have a roast on Sunday.|On mange un rôti le dimanche.
today|aujourd’hui|📅|It’s sunny today.|Il fait beau aujourd’hui.
tomorrow|demain|🌄|See you tomorrow!|À demain !
yesterday|hier|⬅️|Yesterday I was tired.|Hier, j’étais fatigué.
the time|l’heure|🕐|What time is it?|Quelle heure est-il ?
the morning|le matin|🌅|I run in the morning.|Je cours le matin.
the evening|le soir|🌆|What are you doing this evening?|Tu fais quoi ce soir ?
the week|la semaine|🗓️|I work five days a week.|Je travaille cinq jours par semaine.
`),
  t('A1', 'food', '🍳', 'Food', 'La nourriture', `
bread|le pain|🍞|Toast with butter, please.|Des toasts beurrés, s’il vous plaît.
cheese|le fromage|🧀|A cheese and tomato sandwich.|Un sandwich fromage-tomate.
the apple|la pomme|🍎|An apple a day.|Une pomme par jour.
the banana|la banane|🍌|A banana for breakfast.|Une banane au petit-déjeuner.
the potato|la pomme de terre|🥔|Fish and chips are made with potatoes.|Les frites du fish and chips sont faites avec des pommes de terre.
meat|la viande|🥩|I don’t eat meat.|Je ne mange pas de viande.
fish|le poisson|🐟|Fish and chips on Friday.|Fish and chips le vendredi.
the chicken|le poulet|🍗|Roast chicken on Sunday.|Du poulet rôti le dimanche.
the egg|l’œuf|🥚|Two eggs, please.|Deux œufs, s’il vous plaît.
rice|le riz|🍚|Rice with vegetables.|Du riz aux légumes.
soup|la soupe|🥣|Tomato soup is my favourite.|La soupe à la tomate est ma préférée.
vegetables|les légumes|🥦|Eat more vegetables!|Mange plus de légumes !
to eat|manger|🍽️|What do you want to eat?|Tu veux manger quoi ?
to drink|boire|🥤|I drink a lot of water.|Je bois beaucoup d’eau.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
the house|la maison|🏠|The house has a small garden.|La maison a un petit jardin.
the flat|l’appartement|🏢|I live in a small flat.|J’habite dans un petit appartement.
the kitchen|la cuisine|🍳|The kitchen is bright.|La cuisine est lumineuse.
the bedroom|la chambre|🛏️|My bedroom is quiet.|Ma chambre est calme.
the bathroom|la salle de bain|🛁|The bathroom is upstairs.|La salle de bain est à l’étage.
the living room|le salon|🛋️|We watch TV in the living room.|On regarde la télé au salon.
the door|la porte|🚪|Please close the door.|Ferme la porte, s’il te plaît.
the window|la fenêtre|🪟|Open the window, it’s hot.|Ouvre la fenêtre, il fait chaud.
the bed|le lit|🛌|The bed is very comfortable.|Le lit est très confortable.
the chair|la chaise|🪑|Take a chair.|Prends une chaise.
the key|la clé|🔑|Where are my keys?|Où sont mes clés ?
the garden|le jardin|🌷|The children are in the garden.|Les enfants sont dans le jardin.
to live|habiter / vivre|🏡|I live in London.|J’habite à Londres.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
the street|la rue|🛣️|I live on this street.|J’habite dans cette rue.
the square|la place|⛲|Let’s meet in the square.|On se retrouve sur la place.
the station|la gare|🚉|The station is very close.|La gare est tout près.
the bakery|la boulangerie|🥖|The bakery opens at seven.|La boulangerie ouvre à sept heures.
the chemist’s|la pharmacie|💊|Is there a chemist’s near here?|Il y a une pharmacie près d’ici ?
the supermarket|le supermarché|🛒|I’m going to the supermarket.|Je vais au supermarché.
the bank|la banque|🏦|The bank closes at five.|La banque ferme à dix-sept heures.
the museum|le musée|🏛️|The museum is free.|Le musée est gratuit.
the church|l’église|⛪|The church is very old.|L’église est très ancienne.
the park|le parc|🌳|Let’s go for a walk in the park.|Allons nous promener au parc.
on the right|à droite|➡️|Turn right at the lights.|Tournez à droite au feu.
on the left|à gauche|⬅️|The station is on the left.|La gare est à gauche.
straight on|tout droit|⬆️|Go straight on.|Allez tout droit.
far|loin|🧭|Is it far?|C’est loin ?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
red|rouge|🔴|A red bus.|Un bus rouge.
blue|bleu|🔵|The sky is blue.|Le ciel est bleu.
green|vert|🟢|The park is very green.|Le parc est très vert.
yellow|jaune|🟡|A yellow taxi.|Un taxi jaune.
black|noir|⚫|A black cat.|Un chat noir.
white|blanc|⚪|A white shirt.|Une chemise blanche.
big|grand|🐘|A big house.|Une grande maison.
small|petit|🐭|A small dog.|Un petit chien.
new|nouveau / neuf|🆕|I have a new phone.|J’ai un nouveau téléphone.
old|vieux|🏚️|An old building.|Un vieux bâtiment.
beautiful|beau|🌸|What a beautiful day!|Quelle belle journée !
expensive|cher|💎|London is expensive.|Londres est cher.
cheap|bon marché|🏷️|This hotel is cheap.|Cet hôtel n’est pas cher.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
the trip|le voyage|🧳|Have a good trip!|Bon voyage !
to travel|voyager|🌍|I love travelling by train.|J’adore voyager en train.
the plane|l’avion|✈️|The plane lands at noon.|L’avion atterrit à midi.
the airport|l’aéroport|🛫|We’re taking a taxi to the airport.|On prend un taxi pour l’aéroport.
the ticket|le billet|🎫|I bought the tickets online.|J’ai acheté les billets en ligne.
the suitcase|la valise|🧳|My suitcase is too heavy.|Ma valise est trop lourde.
the passport|le passeport|🛂|Don’t forget your passport!|N’oublie pas ton passeport !
the holiday|les vacances|🏝️|We’re on holiday in August.|On est en vacances en août.
the beach|la plage|🏖️|The beach is five minutes away.|La plage est à cinq minutes.
the hotel|l’hôtel|🏨|The hotel has a lovely view.|L’hôtel a une jolie vue.
the booking|la réservation|📋|I have a booking under the name Martin.|J’ai une réservation au nom de Martin.
breakfast|le petit-déjeuner|🍳|Is breakfast included?|Le petit-déjeuner est compris ?
the souvenir|le souvenir|🎁|I bought a souvenir for my mum.|J’ai acheté un souvenir pour ma mère.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
the doctor|le médecin|👨‍⚕️|I need to see a doctor.|Je dois voir un médecin.
ill|malade|🤒|I’ve been ill since yesterday.|Je suis malade depuis hier.
a temperature|de la fièvre|🌡️|I’ve got a temperature.|J’ai de la fièvre.
a cold|un rhume|🤧|I’ve caught a cold.|J’ai attrapé un rhume.
a cough|une toux|😷|I’ve got a bad cough.|J’ai une mauvaise toux.
a headache|un mal de tête|🤕|I’ve got a headache.|J’ai mal à la tête.
the prescription|l’ordonnance|📃|Here’s your prescription.|Voici votre ordonnance.
the medicine|le médicament|💊|Take this medicine twice a day.|Prenez ce médicament deux fois par jour.
tired|fatigué|🥱|I’m really tired.|Je suis vraiment fatigué.
to rest|se reposer|🛋️|You need to rest.|Vous devez vous reposer.
A&E|les urgences|🚑|He’s in A&E.|Il est aux urgences.
to get better|aller mieux|🌤️|Get better soon!|Remets-toi vite !
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
the job|le travail / l’emploi|💼|I love my job.|J’adore mon travail.
to work|travailler|🧑‍💻|I work in a bank.|Je travaille dans une banque.
the office|le bureau|🏢|The office is in the city centre.|Le bureau est en centre-ville.
the colleague|le collègue|🤝|My colleagues are nice.|Mes collègues sont sympas.
the boss|le patron|😎|The boss is in a meeting.|Le patron est en réunion.
the meeting|la réunion|👥|The meeting starts at nine.|La réunion commence à neuf heures.
the salary|le salaire|💵|The salary is good.|Le salaire est bon.
the interview|l’entretien|🤝|I have a job interview tomorrow.|J’ai un entretien d’embauche demain.
the company|l’entreprise|🏢|She runs her own company.|Elle dirige sa propre entreprise.
to work from home|télétravailler|🏠|I work from home on Mondays.|Je télétravaille le lundi.
the deadline|la date limite|⏳|The deadline is Friday.|La date limite est vendredi.
busy|occupé|🏃|I’m very busy this week.|Je suis très occupé cette semaine.
`),
  t('A2', 'hobbies', '🎸', 'Free time', 'Les loisirs', `
the hobby|le loisir|🎨|What are your hobbies?|Quels sont tes loisirs ?
football|le football|⚽|My son plays football.|Mon fils joue au foot.
to swim|nager|🏊|I swim every morning.|Je nage tous les matins.
to cycle|faire du vélo|🚲|I cycle to work.|Je vais au travail à vélo.
to read|lire|📖|I love reading crime novels.|J’adore lire des romans policiers.
the cinema|le cinéma|🎬|Shall we go to the cinema?|On va au cinéma ?
music|la musique|🎵|I listen to music while I work.|J’écoute de la musique en travaillant.
to sing|chanter|🎤|She sings in a choir.|Elle chante dans une chorale.
to dance|danser|💃|We go dancing on Saturdays.|On va danser le samedi.
to cook|cuisiner|👩‍🍳|I cook at the weekend.|Je cuisine le week-end.
the guitar|la guitare|🎸|He plays the guitar.|Il joue de la guitare.
the board game|le jeu de société|🎲|Shall we play a board game?|On fait un jeu de société ?
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
the shop|le magasin|🏬|The shop opens at ten.|Le magasin ouvre à dix heures.
to buy|acheter|🛒|I buy bread every morning.|J’achète du pain tous les matins.
the price|le prix|🏷️|What’s the price?|Quel est le prix ?
the sales|les soldes|🏷️|The sales start in January.|Les soldes commencent en janvier.
the size|la taille|📏|Do you have a bigger size?|Vous avez une taille au-dessus ?
the changing room|la cabine d’essayage|🚪|The changing rooms are at the back.|Les cabines d’essayage sont au fond.
to pay|payer|💳|Can I pay by card?|Je peux payer par carte ?
cash|en liquide|💵|I’ll pay cash.|Je paie en liquide.
the receipt|le ticket de caisse|🧾|Here’s your receipt.|Voici votre ticket.
to try on|essayer|🪞|Can I try this on?|Je peux l’essayer ?
the present|le cadeau|🎁|It’s a present for my sister.|C’est un cadeau pour ma sœur.
the bag|le sac|🛍️|Do you need a bag?|Vous avez besoin d’un sac ?
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
happy|heureux|😊|I’m so happy to see you!|Je suis si content de te voir !
sad|triste|😢|She looks sad today.|Elle a l’air triste aujourd’hui.
angry|en colère|😠|Why are you angry?|Pourquoi tu es en colère ?
worried|inquiet|😟|I’m worried about the exam.|Je suis inquiet pour l’examen.
proud|fier|🦚|I’m proud of you.|Je suis fier de toi.
surprised|surpris|😮|I was really surprised.|J’ai été vraiment surpris.
scared|effrayé|😱|I’m scared of spiders.|J’ai peur des araignées.
bored|qui s’ennuie|🥱|I’m bored.|Je m’ennuie.
disappointed|déçu|😞|He’s disappointed.|Il est déçu.
relaxed|détendu|😌|I feel relaxed on holiday.|Je me sens détendu en vacances.
excited|impatient / ravi|🥳|I’m excited about the trip!|J’ai hâte de partir en voyage !
to miss|manquer à|💌|I miss you.|Tu me manques.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
in my opinion|à mon avis|💬|In my opinion, it’s a great idea.|À mon avis, c’est une excellente idée.
I think that|je pense que|💭|I think you’re right.|Je pense que tu as raison.
to be right|avoir raison|✅|You’re right.|Tu as raison.
to agree|être d’accord|🤝|I agree with you.|Je suis d’accord avec toi.
however|cependant|↔️|It’s expensive; however, it’s worth it.|C’est cher ; cependant, ça vaut le coup.
so|donc|➡️|It’s raining, so I’m staying in.|Il pleut, donc je reste à la maison.
although|bien que|🌗|Although I’m tired, I’ll come.|Bien que je sois fatigué, je viendrai.
the advantage|l’avantage|👍|The main advantage is the price.|Le principal avantage, c’est le prix.
the drawback|l’inconvénient|👎|The only drawback is the noise.|Le seul inconvénient, c’est le bruit.
to convince|convaincre|🗣️|You’ve convinced me.|Tu m’as convaincu.
probably|probablement|🤷|It’ll probably rain tomorrow.|Il pleuvra probablement demain.
actually|en fait|📌|Actually, I don’t know.|En fait, je ne sais pas.
`),
  t('B1', 'society', '🌍', 'The world today', 'Le monde d’aujourd’hui', `
the environment|l’environnement|🌍|We must protect the environment.|Nous devons protéger l’environnement.
climate change|le changement climatique|🌡️|Climate change affects everyone.|Le changement climatique touche tout le monde.
to recycle|recycler|♻️|We recycle glass and paper.|Nous recyclons le verre et le papier.
rubbish|les déchets|🗑️|Let’s reduce our rubbish.|Réduisons nos déchets.
the news|les informations|📰|Did you see the news?|Tu as vu les infos ?
social media|les réseaux sociaux|📱|He spends too much time on social media.|Il passe trop de temps sur les réseaux sociaux.
the app|l’application|📲|Download the app.|Télécharge l’application.
the password|le mot de passe|🔑|I forgot my password.|J’ai oublié mon mot de passe.
artificial intelligence|l’intelligence artificielle|🤖|AI is changing many jobs.|L’IA transforme beaucoup de métiers.
online|en ligne|🌐|I buy most things online.|J’achète presque tout en ligne.
the culture|la culture|🎭|British culture loves tea.|La culture britannique adore le thé.
famous|célèbre|⭐|A famous writer.|Un écrivain célèbre.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'en-g-be', level: 'A1', icon: '🧩', en: 'To be', fr: 'Le verbe to be',
    cards: [
      { en: 'To be: I am, you are, he/she/it is, we are, they are. Short forms: I’m, you’re, he’s, we’re, they’re.', fr: 'To be (être) : I am, you are, he/she/it is, we are, they are. Formes courtes : I’m, you’re, he’s…', examples: [['I’m French.', 'Je suis français.', 'Je suis français.'], ['They’re in London.', 'Ils sont à Londres.', 'Ils sont à Londres.']] },
      { en: 'Negative: add not (I’m not, she isn’t). Question: swap the order (Are you tired?).', fr: 'Négation : not (I’m not, she isn’t). Question : on inverse (Are you tired?).', examples: [['She isn’t here.', 'Elle n’est pas là.', 'Elle n’est pas là.'], ['Are you OK?', 'Ça va ?', 'Ça va ?']] },
    ],
    drills: [
      { text: 'I ___ a student.', answer: 'am', wrong: ['is', 'are'], en: 'Je suis étudiant.', fr: 'Je suis étudiant.' },
      { text: 'She ___ my sister.', answer: 'is', wrong: ['are', 'am'], en: 'C’est ma sœur.', fr: 'C’est ma sœur.' },
      { text: 'We ___ in Paris.', answer: 'are', wrong: ['is', 'am'], en: 'Nous sommes à Paris.', fr: 'Nous sommes à Paris.' },
      { text: '___ you tired?', answer: 'Are', wrong: ['Is', 'Am'], en: 'Tu es fatigué ?', fr: 'Tu es fatigué ?' },
    ],
  },
  {
    id: 'en-g-present', level: 'A1', icon: '🔁', en: 'Present simple', fr: 'Le présent simple',
    cards: [
      { en: 'Habits and facts: I work, you work, he/she works (add -s). Negative: don’t / doesn’t + verb. Question: Do / Does…?', fr: 'Habitudes et vérités : -s à la 3e personne (he works). Négation : don’t / doesn’t. Question : Do / Does…?', examples: [['She works in a bank.', 'Elle travaille dans une banque.', 'Elle travaille dans une banque.'], ['I don’t eat meat.', 'Je ne mange pas de viande.', 'Je ne mange pas de viande.'], ['Do you like tea?', 'Tu aimes le thé ?', 'Tu aimes le thé ?']] },
    ],
    drills: [
      { text: 'He ___ in London.', answer: 'lives', wrong: ['live', 'living'], en: 'Il habite à Londres.', fr: 'Il habite à Londres.' },
      { text: 'I ___ like coffee.', answer: 'don’t', wrong: ['doesn’t', 'not'], en: 'Je n’aime pas le café.', fr: 'Je n’aime pas le café.' },
      { text: '___ she speak French?', answer: 'Does', wrong: ['Do', 'Is'], en: 'Elle parle français ?', fr: 'Elle parle français ?' },
      { text: 'We ___ football on Sundays.', answer: 'play', wrong: ['plays', 'playing'], en: 'Nous jouons au foot le dimanche.', fr: 'Nous jouons au foot le dimanche.' },
    ],
  },
  {
    id: 'en-g-continuous', level: 'A1', icon: '⏯️', en: 'Present continuous', fr: 'Le présent continu',
    cards: [
      { en: 'Happening now: am / is / are + verb-ing. I’m reading, she’s cooking, they’re waiting.', fr: 'En train de : am/is/are + -ing.', examples: [['I’m reading a book.', 'Je suis en train de lire un livre.', 'Je suis en train de lire un livre.'], ['It’s raining.', 'Il pleut (en ce moment).', 'Il pleut (en ce moment).']] },
    ],
    drills: [
      { text: 'Look! It’s ___.', answer: 'snowing', wrong: ['snow', 'snows'], en: 'Regarde ! Il neige.', fr: 'Regarde ! Il neige.' },
      { text: 'They ___ watching TV.', answer: 'are', wrong: ['is', 'do'], en: 'Ils regardent la télé.', fr: 'Ils regardent la télé.' },
      { text: 'I’m ___ dinner now.', answer: 'cooking', wrong: ['cook', 'cooked'], en: 'Je prépare le dîner.', fr: 'Je prépare le dîner.' },
    ],
  },
  {
    id: 'en-g-past', level: 'A2', icon: '⏮️', en: 'Past simple', fr: 'Le prétérit',
    cards: [
      { en: 'Finished past actions: regular verbs add -ed (worked, played). Many common verbs are irregular: go → went, eat → ate, see → saw, have → had.', fr: 'Actions passées terminées : -ed, ou formes irrégulières (went, ate, saw, had).', examples: [['I watched a film yesterday.', 'J’ai regardé un film hier.', 'J’ai regardé un film hier.'], ['We went to Brighton.', 'Nous sommes allés à Brighton.', 'Nous sommes allés à Brighton.']] },
      { en: 'Negative and questions use did: I didn’t go. Did you see it?', fr: 'Négation et question avec did : I didn’t go. Did you see it?', examples: [['Did you like it?', 'Ça t’a plu ?', 'Ça t’a plu ?']] },
    ],
    drills: [
      { text: 'Yesterday I ___ to the cinema.', answer: 'went', wrong: ['go', 'goed'], en: 'Hier, je suis allé au cinéma.', fr: 'Hier, je suis allé au cinéma.' },
      { text: 'She ___ late last night.', answer: 'worked', wrong: ['works', 'work'], en: 'Elle a travaillé tard hier soir.', fr: 'Elle a travaillé tard hier soir.' },
      { text: '___ you see the match?', answer: 'Did', wrong: ['Do', 'Were'], en: 'Tu as vu le match ?', fr: 'Tu as vu le match ?' },
      { text: 'We didn’t ___ much.', answer: 'eat', wrong: ['ate', 'eaten'], en: 'Nous n’avons pas beaucoup mangé.', fr: 'Nous n’avons pas beaucoup mangé.' },
    ],
  },
  {
    id: 'en-g-future', level: 'B1', icon: '➡️', en: 'Going to and will', fr: 'Going to et will',
    cards: [
      { en: 'Going to = plans and things you can see coming: I’m going to visit Rome. Look at the clouds, it’s going to rain.', fr: 'Going to : projets, choses prévisibles.', examples: [['I’m going to learn to drive.', 'Je vais apprendre à conduire.', 'Je vais apprendre à conduire.']] },
      { en: 'Will = decisions made now, promises, predictions: I’ll call you. It will be fine.', fr: 'Will : décision sur le moment, promesse, prédiction.', examples: [['I’ll help you.', 'Je vais t’aider.', 'Je vais t’aider.']] },
    ],
    drills: [
      { text: 'Look at those clouds. It’s ___ to rain.', answer: 'going', wrong: ['will', 'go'], en: 'Regarde ces nuages, il va pleuvoir.', fr: 'Regarde ces nuages, il va pleuvoir.' },
      { text: 'The phone’s ringing. I ___ get it.', answer: '’ll', wrong: ['’m going', 'am'], en: 'Le téléphone sonne. Je réponds.', fr: 'Le téléphone sonne. Je réponds.' },
      { text: 'We’re going to ___ a house.', answer: 'buy', wrong: ['buying', 'bought'], en: 'Nous allons acheter une maison.', fr: 'Nous allons acheter une maison.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'en-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Hi there! What can I get you?', en: 'Bonjour ! Qu’est-ce que je vous sers ?', fr: 'Bonjour ! Qu’est-ce que je vous sers ?' },
      { who: 'B', text: 'A flat white and a croissant, please.', en: 'Un flat white et un croissant, s’il vous plaît.', fr: 'Un flat white et un croissant, s’il vous plaît.', wrong: ['I am a croissant.', 'The bill is a coffee.'] },
      { who: 'A', text: 'Eat in or take away?', en: 'Sur place ou à emporter ?', fr: 'Sur place ou à emporter ?' },
      { who: 'B', text: 'Take away, please.', en: 'À emporter, s’il vous plaît.', fr: 'À emporter, s’il vous plaît.', wrong: ['I’m thirty years old.', 'It’s cold in Paris.'] },
      { who: 'A', text: 'That’s five pounds twenty.', en: 'Ça fait cinq livres vingt.', fr: 'Ça fait cinq livres vingt.' },
      { who: 'B', text: 'Can I pay by card?', en: 'Je peux payer par carte ?', fr: 'Je peux payer par carte ?', wrong: ['Good night, pounds!', 'Where is the croissant?'] },
    ],
  },
  {
    id: 'en-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Excuse me, how do I get to the station?', en: 'Excusez-moi, comment aller à la gare ?', fr: 'Excusez-moi, comment aller à la gare ?', wrong: ['Excuse me, how much is the station?', 'Excuse me, I am the station.'] },
      { who: 'A', text: 'Go straight on, then take the second left.', en: 'Allez tout droit, puis prenez la deuxième à gauche.', fr: 'Allez tout droit, puis prenez la deuxième à gauche.' },
      { who: 'B', text: 'Is it far?', en: 'C’est loin ?', fr: 'C’est loin ?', wrong: ['Is it delicious?', 'Is it Monday?'] },
      { who: 'A', text: 'No, it’s about a five-minute walk.', en: 'Non, c’est à environ cinq minutes à pied.', fr: 'Non, c’est à environ cinq minutes à pied.' },
      { who: 'B', text: 'Thanks so much!', en: 'Merci beaucoup !', fr: 'Merci beaucoup !', wrong: ['Enjoy your meal!', 'Good night!'] },
    ],
  },
  {
    id: 'en-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Good evening. How can I help?', en: 'Bonsoir. Que puis-je faire pour vous ?', fr: 'Bonsoir. Que puis-je faire pour vous ?' },
      { who: 'B', text: 'Hi, I have a booking under the name Martin.', en: 'Bonjour, j’ai une réservation au nom de Martin.', fr: 'Bonjour, j’ai une réservation au nom de Martin.', wrong: ['Hi, I have a headache.', 'A coffee, please.'] },
      { who: 'A', text: 'Two nights in a double room. Could I see your passport?', en: 'Deux nuits en chambre double. Je peux voir votre passeport ?', fr: 'Deux nuits en chambre double. Je peux voir votre passeport ?' },
      { who: 'B', text: 'Here you are. What time is breakfast?', en: 'Le voici. À quelle heure est le petit-déjeuner ?', fr: 'Le voici. À quelle heure est le petit-déjeuner ?', wrong: ['Here you are. Where is the beach of the passport?', 'No thanks, I’m not hungry.'] },
      { who: 'A', text: 'From seven till ten. You’re on the third floor.', en: 'De sept à dix heures. Vous êtes au troisième étage.', fr: 'De sept à dix heures. Vous êtes au troisième étage.' },
      { who: 'B', text: 'Great. Is the wifi free?', en: 'Parfait. Le wifi est gratuit ?', fr: 'Parfait. Le wifi est gratuit ?', wrong: ['Great. I am free.', 'Great. I’m thirty.'] },
    ],
  },
  {
    id: 'en-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Hello. What seems to be the problem?', en: 'Bonjour. Qu’est-ce qui ne va pas ?', fr: 'Bonjour. Qu’est-ce qui ne va pas ?' },
      { who: 'B', text: 'I’ve got a sore throat and a temperature.', en: 'J’ai mal à la gorge et de la fièvre.', fr: 'J’ai mal à la gorge et de la fièvre.', wrong: ['I’d like a chocolate cake.', 'I’ve got a double room.'] },
      { who: 'A', text: 'How long have you had it?', en: 'Depuis combien de temps ?', fr: 'Depuis combien de temps ?' },
      { who: 'B', text: 'Since Monday.', en: 'Depuis lundi.', fr: 'Depuis lundi.', wrong: ['At three o’clock.', 'Three pounds, please.'] },
      { who: 'A', text: 'It’s a throat infection. Here’s a prescription. Get plenty of rest.', en: 'C’est une angine. Voici une ordonnance. Reposez-vous bien.', fr: 'C’est une angine. Voici une ordonnance. Reposez-vous bien.' },
      { who: 'B', text: 'Thank you, doctor.', en: 'Merci, docteur.', fr: 'Merci, docteur.', wrong: ['Thank you, where is the station?', 'Cheers!'] },
    ],
  },
  {
    id: 'en-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'What are you up to this weekend?', en: 'Tu fais quoi ce week-end ?', fr: 'Tu fais quoi ce week-end ?' },
      { who: 'B', text: 'Nothing much. Have you got any ideas?', en: 'Pas grand-chose. Tu as une idée ?', fr: 'Pas grand-chose. Tu as une idée ?', wrong: ['I ate pizza yesterday.', 'I was born in Lyon.'] },
      { who: 'A', text: 'We could go for a walk along the river and have lunch at a pub.', en: 'On pourrait se promener le long de la rivière et déjeuner dans un pub.', fr: 'On pourrait se promener le long de la rivière et déjeuner dans un pub.' },
      { who: 'B', text: 'Sounds lovely! If it doesn’t rain, I’m in.', en: 'Super idée ! S’il ne pleut pas, je viens.', fr: 'Super idée ! S’il ne pleut pas, je viens.', wrong: ['Sounds lovely! I was ill last year.', 'No, I haven’t got any shoes.'] },
      { who: 'A', text: 'Shall we meet at the station at ten?', en: 'On se retrouve à la gare à dix heures ?', fr: 'On se retrouve à la gare à dix heures ?' },
      { who: 'B', text: 'Perfect, see you there!', en: 'Parfait, à tout à l’heure !', fr: 'Parfait, à tout à l’heure !', wrong: ['Perfect, I saw you there yesterday.', 'No thanks, I am the station.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'en-s-market', level: 'A1', icon: '🧺', en: 'Emma’s Saturday', fr: 'Le samedi d’Emma',
    sentences: [
      ['Emma lives in Bristol.', 'Emma habite à Bristol.', 'Emma habite à Bristol.'],
      ['On Saturdays she goes to the market.', 'Le samedi, elle va au marché.', 'Le samedi, elle va au marché.'],
      ['She buys apples, cheese and bread.', 'Elle achète des pommes, du fromage et du pain.', 'Elle achète des pommes, du fromage et du pain.'],
      ['Then she has a coffee at Sam’s café.', 'Ensuite, elle prend un café chez Sam.', 'Ensuite, elle prend un café chez Sam.'],
      ['Sam gives her a free muffin.', 'Sam lui offre un muffin.', 'Sam lui offre un muffin.'],
      ['Emma is very happy.', 'Emma est très contente.', 'Emma est très contente.'],
    ],
    glossary: { lives: ['habite', 'habite'], saturdays: ['le samedi', 'le samedi'], market: ['marché', 'marché'], buys: ['achète', 'achète'], cheese: ['fromage', 'fromage'], then: ['ensuite', 'ensuite'], gives: ['donne', 'donne'], free: ['gratuit', 'gratuit'], happy: ['content', 'content'] },
    questions: [
      { en: 'Où habite Emma ?', fr: 'Où habite Emma ?', answer: 'Bristol', wrong: ['London', 'Leeds'] },
      { en: 'Qu’achète-t-elle ?', fr: 'Qu’achète-t-elle ?', answer: 'apples, cheese and bread', wrong: ['fish and rice', 'shoes'] },
      { en: 'Que lui offre Sam ?', fr: 'Que lui offre Sam ?', answer: 'a muffin', wrong: ['a coffee', 'an apple'] },
    ],
  },
  {
    id: 'en-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Jack had a train to Edinburgh at eight.', 'Jack avait un train pour Édimbourg à huit heures.', 'Jack avait un train pour Édimbourg à huit heures.'],
      ['But he woke up at half past seven.', 'Mais il s’est réveillé à sept heures et demie.', 'Mais il s’est réveillé à sept heures et demie.'],
      ['He got dressed quickly and jumped on his bike.', 'Il s’est habillé vite et a sauté sur son vélo.', 'Il s’est habillé vite et a sauté sur son vélo.'],
      ['He arrived at the station at two minutes past eight.', 'Il est arrivé à la gare à huit heures deux.', 'Il est arrivé à la gare à huit heures deux.'],
      ['The train had already left.', 'Le train était déjà parti.', 'Le train était déjà parti.'],
      ['He caught the next one and read a good book.', 'Il a pris le suivant et a lu un bon livre.', 'Il a pris le suivant et a lu un bon livre.'],
    ],
    glossary: { had: ['avait', 'avait'], woke: ['s’est réveillé', 's’est réveillé'], dressed: ['habillé', 'habillé'], quickly: ['vite', 'vite'], arrived: ['est arrivé', 'est arrivé'], already: ['déjà', 'déjà'], left: ['parti', 'parti'], caught: ['a pris', 'a pris'], next: ['suivant', 'suivant'] },
    questions: [
      { en: 'Où allait Jack ?', fr: 'Où allait Jack ?', answer: 'Edinburgh', wrong: ['London', 'Bristol'] },
      { en: 'Comment est-il allé à la gare ?', fr: 'Comment est-il allé à la gare ?', answer: 'by bike', wrong: ['by taxi', 'on foot'] },
      { en: 'Qu’a-t-il fait dans le train suivant ?', fr: 'Qu’a-t-il fait dans le train suivant ?', answer: 'he read a book', wrong: ['he slept', 'he ate'] },
    ],
  },
  {
    id: 'en-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Two years ago, the people in our building had an idea.', 'Il y a deux ans, les habitants de notre immeuble ont eu une idée.', 'Il y a deux ans, les habitants de notre immeuble ont eu une idée.'],
      ['The roof was empty and nobody used it.', 'Le toit était vide et personne ne l’utilisait.', 'Le toit était vide et personne ne l’utilisait.'],
      ['Mrs Patel suggested growing vegetables up there.', 'Mme Patel a proposé d’y cultiver des légumes.', 'Mme Patel a proposé d’y cultiver des légumes.'],
      ['At first, not everyone was convinced.', 'Au début, tout le monde n’était pas convaincu.', 'Au début, tout le monde n’était pas convaincu.'],
      ['Now tomatoes, herbs and strawberries grow on the roof.', 'Aujourd’hui, des tomates, des herbes et des fraises poussent sur le toit.', 'Aujourd’hui, des tomates, des herbes et des fraises poussent sur le toit.'],
      ['And every Sunday, everyone has lunch together up there.', 'Et chaque dimanche, tout le monde y déjeune ensemble.', 'Et chaque dimanche, tout le monde y déjeune ensemble.'],
    ],
    glossary: { building: ['immeuble', 'immeuble'], roof: ['toit', 'toit'], empty: ['vide', 'vide'], nobody: ['personne', 'personne'], suggested: ['a proposé', 'a proposé'], growing: ['cultiver', 'cultiver'], convinced: ['convaincu', 'convaincu'], grow: ['poussent', 'poussent'], together: ['ensemble', 'ensemble'] },
    questions: [
      { en: 'De qui venait l’idée du jardin ?', fr: 'De qui venait l’idée du jardin ?', answer: 'Mrs Patel', wrong: ['Emma', 'Jack'] },
      { en: 'Qu’est-ce qui pousse sur le toit ?', fr: 'Qu’est-ce qui pousse sur le toit ?', answer: 'tomatoes, herbs and strawberries', wrong: ['apples and pears', 'potatoes'] },
      { en: 'Quand déjeunent-ils ensemble ?', fr: 'Quand déjeunent-ils ensemble ?', answer: 'every Sunday', wrong: ['every Monday', 'once a year'] },
    ],
  },
];

export const ENGLISH_FULL: FullCourse = { topics, grammar, dialogues, stories };
