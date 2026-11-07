import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/**
 * French, A1 → B1, for English speakers. Original vocabulary, examples, grammar notes, dialogues and stories written
 * for this app. Lines are "mot|English|emoji|example|example in English" (the learner's French translation is the
 * English one: the course teaches French).
 */
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

const topics: Topic[] = [
  // ---------- A1 ----------
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
bonjour|hello / good morning|👋|Bonjour, je m’appelle Camille.|Hello, my name is Camille.
salut|hi / bye (casual)|🙋|Salut Hugo, ça va ?|Hi Hugo, how’s it going?
au revoir|goodbye|🫡|Au revoir et bonne journée !|Goodbye and have a nice day!
merci|thank you|🙏|Merci beaucoup, c’est gentil.|Thanks a lot, that’s kind.
s’il vous plaît|please (polite)|🥺|Un café, s’il vous plaît.|A coffee, please.
enchanté|nice to meet you|😊|Enchanté, je suis Julien.|Nice to meet you, I’m Julien.
ça va ?|how are you?|💬|Bonjour Madame Petit, ça va ?|Hello Madame Petit, how are you?
le prénom|first name|🏷️|Quel est ton prénom ?|What’s your first name?
l’ami|friend (m)|🤝|Julien est mon ami.|Julien is my friend.
l’amie|friend (f)|🤝|Camille est mon amie.|Camille is my friend.
l’homme|man|👨|Cet homme est très grand.|That man is very tall.
la femme|woman / wife|👩|La femme lit le journal.|The woman is reading the paper.
l’enfant|child|🧒|L’enfant joue dans le jardin.|The child plays in the garden.
pardon|sorry / excuse me|😅|Pardon, je ne vous ai pas vu.|Sorry, I didn’t see you.
de rien|you’re welcome|😄|— Merci ! — De rien.|“Thanks!” “You’re welcome.”
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
le café|coffee / café|☕|Un café, s’il vous plaît.|A coffee, please.
le thé|tea|🍵|Je préfère le thé vert.|I prefer green tea.
l’eau|water|💧|Une carafe d’eau, s’il vous plaît.|A jug of water, please.
le jus d’orange|orange juice|🧃|Un jus d’orange pressé.|A freshly squeezed orange juice.
le lait|milk|🥛|Un café au lait.|A white coffee.
le sucre|sugar|🍬|Avec ou sans sucre ?|With or without sugar?
le croissant|croissant|🥐|Deux croissants, s’il vous plaît.|Two croissants, please.
le pain|bread|🍞|Le pain est tout chaud.|The bread is still warm.
l’addition|the bill|🧾|L’addition, s’il vous plaît.|The bill, please.
le serveur|waiter|🤵|Le serveur arrive tout de suite.|The waiter is coming right away.
la table|table|🪑|Une table pour deux ?|A table for two?
la terrasse|terrace|⛱️|On s’assoit en terrasse ?|Shall we sit outside?
je voudrais|I would like|🙂|Je voudrais un chocolat chaud.|I’d like a hot chocolate.
combien ?|how much?|💶|C’est combien ?|How much is it?
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
la mère|mother|👩|Ma mère est professeure.|My mother is a teacher.
le père|father|👨|Mon père cuisine très bien.|My father cooks very well.
les parents|parents|👨‍👩‍👧|Mes parents habitent à Nantes.|My parents live in Nantes.
le frère|brother|👦|Hugo est le frère de Camille.|Hugo is Camille’s brother.
la sœur|sister|👧|J’ai une sœur et un frère.|I have a sister and a brother.
le fils|son|👦|Leur fils a dix ans.|Their son is ten.
la fille|daughter / girl|👧|Ma fille adore dessiner.|My daughter loves drawing.
le grand-père|grandfather|👴|Mon grand-père a quatre-vingts ans.|My grandfather is eighty.
la grand-mère|grandmother|👵|Ma grand-mère fait des crêpes.|My grandmother makes crêpes.
l’oncle|uncle|🧔|Mon oncle habite au Canada.|My uncle lives in Canada.
la tante|aunt|👩‍🦱|Ma tante est médecin.|My aunt is a doctor.
le cousin|cousin (m)|🧑|Mon cousin joue au rugby.|My cousin plays rugby.
le mari|husband|🤵|Son mari est italien.|Her husband is Italian.
le bébé|baby|👶|Le bébé dort.|The baby is asleep.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
un|one|1️⃣|J’ai un chat.|I have one cat.
deux|two|2️⃣|Deux cafés, s’il vous plaît.|Two coffees, please.
trois|three|3️⃣|Nous sommes trois.|There are three of us.
quatre|four|4️⃣|Il a quatre enfants.|He has four children.
cinq|five|5️⃣|Cinq euros, s’il vous plaît.|Five euros, please.
six|six|6️⃣|Je me lève à six heures.|I get up at six.
sept|seven|7️⃣|La semaine a sept jours.|The week has seven days.
huit|eight|8️⃣|Je travaille huit heures par jour.|I work eight hours a day.
neuf|nine|9️⃣|Ma fille a neuf ans.|My daughter is nine.
dix|ten|🔟|Le train part dans dix minutes.|The train leaves in ten minutes.
vingt|twenty|💶|Ça fait vingt euros.|That’s twenty euros.
cent|a hundred|💯|L’hôtel est à cent mètres.|The hotel is a hundred metres away.
l’âge|age|🎂|Quel âge as-tu ?|How old are you?
avoir … ans|to be … years old|🕯️|J’ai trente ans.|I’m thirty.
`),
  t('A1', 'colours', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
rouge|red|🔴|Une voiture rouge.|A red car.
bleu|blue|🔵|Le ciel est bleu.|The sky is blue.
vert|green|🟢|J’aime les olives vertes.|I like green olives.
jaune|yellow|🟡|Un citron jaune.|A yellow lemon.
noir|black|⚫|Un chat noir.|A black cat.
blanc|white|⚪|Une chemise blanche.|A white shirt.
grand|big / tall|🦒|Mon frère est très grand.|My brother is very tall.
petit|small|🐭|Un petit appartement.|A small flat.
beau|beautiful / handsome|🌸|Quel beau jardin !|What a beautiful garden!
nouveau|new|🆕|J’ai un nouveau téléphone.|I have a new phone.
vieux|old|🏚️|C’est une vieille maison.|It’s an old house.
joli|pretty|🌷|Une jolie robe.|A pretty dress.
cher|expensive / dear|💎|Ce restaurant est cher.|This restaurant is expensive.
facile|easy|👌|Le français, c’est facile !|French is easy!
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
lundi|Monday|1️⃣|Lundi, je travaille.|On Monday I work.
mardi|Tuesday|2️⃣|Mardi soir, je vais au cinéma.|On Tuesday evening I go to the cinema.
mercredi|Wednesday|3️⃣|Les enfants n’ont pas école le mercredi.|Children don’t have school on Wednesdays.
jeudi|Thursday|4️⃣|On se voit jeudi ?|See you on Thursday?
vendredi|Friday|5️⃣|Vendredi, c’est pizza.|Friday is pizza night.
samedi|Saturday|6️⃣|Samedi, je fais le marché.|On Saturday I go to the market.
dimanche|Sunday|7️⃣|Le dimanche, on déjeune en famille.|On Sundays we have lunch as a family.
aujourd’hui|today|📅|Aujourd’hui, il fait beau.|Today the weather is nice.
demain|tomorrow|🌄|À demain !|See you tomorrow!
hier|yesterday|⬅️|Hier, j’étais fatigué.|Yesterday I was tired.
l’heure|hour / time|🕐|Quelle heure est-il ?|What time is it?
le matin|morning|🌅|Je cours le matin.|I run in the morning.
le soir|evening|🌆|Ce soir, on dîne chez Camille.|Tonight we’re having dinner at Camille’s.
la semaine|week|🗓️|Je travaille cinq jours par semaine.|I work five days a week.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
la maison|house|🏠|Leur maison a un jardin.|Their house has a garden.
l’appartement|flat|🏢|J’habite dans un petit appartement.|I live in a small flat.
la cuisine|kitchen / cooking|🍳|La cuisine est petite mais pratique.|The kitchen is small but practical.
la chambre|bedroom|🛏️|Ma chambre donne sur la cour.|My bedroom looks onto the courtyard.
la salle de bain|bathroom|🛁|La salle de bain est au fond.|The bathroom is at the end.
le salon|living room|🛋️|On regarde la télé au salon.|We watch TV in the living room.
la porte|door|🚪|Ferme la porte, s’il te plaît.|Close the door, please.
la fenêtre|window|🪟|Ouvre la fenêtre, il fait chaud.|Open the window, it’s hot.
le lit|bed|🛌|Le lit est très confortable.|The bed is very comfortable.
la chaise|chair|🪑|Prends une chaise.|Take a chair.
la clé|key|🔑|Où sont mes clés ?|Where are my keys?
le jardin|garden|🌷|Les enfants jouent dans le jardin.|The children play in the garden.
le frigo|fridge|🧊|Le lait est dans le frigo.|The milk is in the fridge.
habiter|to live (somewhere)|🏡|J’habite à Lyon.|I live in Lyon.
`),
  t('A1', 'food', '🥖', 'Food', 'La nourriture', `
la baguette|baguette|🥖|Une baguette bien cuite.|A well-baked baguette.
le fromage|cheese|🧀|La France a des centaines de fromages.|France has hundreds of cheeses.
la pomme|apple|🍎|Une tarte aux pommes.|An apple tart.
la banane|banana|🍌|Une banane pour le goûter.|A banana for an afternoon snack.
la fraise|strawberry|🍓|Des fraises avec de la crème.|Strawberries and cream.
la tomate|tomato|🍅|Une salade de tomates.|A tomato salad.
la pomme de terre|potato|🥔|Des pommes de terre au four.|Baked potatoes.
le poulet|chicken|🍗|Poulet rôti le dimanche.|Roast chicken on Sundays.
le poisson|fish|🐟|Le vendredi, on mange du poisson.|On Fridays we eat fish.
la viande|meat|🥩|Je ne mange pas de viande.|I don’t eat meat.
l’œuf|egg|🥚|Une omelette avec trois œufs.|An omelette with three eggs.
le riz|rice|🍚|Du riz avec des légumes.|Rice with vegetables.
la soupe|soup|🥣|Une soupe à l’oignon.|An onion soup.
le gâteau|cake|🎂|Le gâteau au chocolat est délicieux.|The chocolate cake is delicious.
manger|to eat|🍽️|On mange à midi.|We eat at noon.
boire|to drink|🥤|Je bois beaucoup d’eau.|I drink a lot of water.
`),
  t('A1', 'body', '🧍', 'The body', 'Le corps', `
la tête|head|🤕|J’ai mal à la tête.|I have a headache.
l’œil|eye|👁️|Elle a les yeux verts.|She has green eyes.
la bouche|mouth|👄|Ouvre la bouche.|Open your mouth.
le nez|nose|👃|J’ai le nez qui coule.|I have a runny nose.
l’oreille|ear|👂|J’ai mal à l’oreille.|I have earache.
la main|hand|✋|Lave-toi les mains.|Wash your hands.
le bras|arm|💪|Il s’est cassé le bras.|He broke his arm.
la jambe|leg|🦵|J’ai mal aux jambes après la course.|My legs hurt after the run.
le pied|foot|🦶|On y va à pied.|Let’s walk there.
le dos|back|🧍|J’ai mal au dos.|I have backache.
le ventre|stomach / belly|🤢|J’ai mal au ventre.|I have a stomach ache.
les cheveux|hair|💇|Elle a les cheveux courts.|She has short hair.
la dent|tooth|🦷|Je me brosse les dents.|I brush my teeth.
le cœur|heart|❤️|Il a un cœur d’or.|He has a heart of gold.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
la chemise|shirt|👔|Une chemise blanche pour le travail.|A white shirt for work.
le t-shirt|T-shirt|👕|Un t-shirt en coton.|A cotton T-shirt.
le pantalon|trousers|👖|Ce pantalon est trop long.|These trousers are too long.
la robe|dress|👗|Elle porte une robe rouge.|She’s wearing a red dress.
la jupe|skirt|🩳|Une jupe pour l’été.|A skirt for the summer.
les chaussures|shoes|👞|J’ai besoin de chaussures neuves.|I need new shoes.
le manteau|coat|🧥|Mets ton manteau, il fait froid.|Put your coat on, it’s cold.
le pull|jumper|🧶|Un pull en laine.|A wool jumper.
le chapeau|hat|👒|Un chapeau contre le soleil.|A hat against the sun.
l’écharpe|scarf|🧣|Ma grand-mère m’a tricoté cette écharpe.|My grandmother knitted me this scarf.
les lunettes|glasses|👓|Je ne trouve pas mes lunettes.|I can’t find my glasses.
le sac|bag|👜|Ton sac est très joli.|Your bag is really nice.
porter|to wear / to carry|🧳|Il porte toujours une cravate.|He always wears a tie.
essayer|to try (on)|🪞|Je peux essayer cette veste ?|Can I try on this jacket?
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
il fait beau|the weather is nice|🌤️|Il fait beau aujourd’hui.|The weather is nice today.
il fait chaud|it’s hot|🥵|Il fait chaud en juillet.|It’s hot in July.
il fait froid|it’s cold|🥶|Il fait froid ce matin.|It’s cold this morning.
il pleut|it’s raining|🌧️|Il pleut depuis ce matin.|It’s been raining since this morning.
il neige|it’s snowing|🌨️|Il neige à la montagne.|It’s snowing in the mountains.
le soleil|sun|☀️|Le soleil brille.|The sun is shining.
la pluie|rain|☔|J’aime le bruit de la pluie.|I like the sound of rain.
le vent|wind|🌬️|Il y a beaucoup de vent.|It’s very windy.
le nuage|cloud|☁️|Le ciel est plein de nuages.|The sky is full of clouds.
l’orage|storm|⛈️|Il y a eu un orage cette nuit.|There was a storm last night.
le parapluie|umbrella|☂️|Prends ton parapluie.|Take your umbrella.
l’été|summer|🏖️|En été, on va à la mer.|In summer we go to the seaside.
l’hiver|winter|❄️|L’hiver est long dans l’Est.|Winter is long in the east.
le printemps|spring|🌱|Au printemps, les arbres fleurissent.|In spring the trees blossom.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
la rue|street|🛣️|J’habite dans cette rue.|I live on this street.
la place|square|⛲|Le marché est sur la place.|The market is on the square.
la boulangerie|bakery|🥖|La boulangerie ouvre à sept heures.|The bakery opens at seven.
la pharmacie|pharmacy|💊|Il y a une pharmacie près d’ici ?|Is there a pharmacy near here?
le supermarché|supermarket|🛒|Je vais au supermarché.|I’m going to the supermarket.
la banque|bank|🏦|La banque est fermée le dimanche.|The bank is closed on Sundays.
la gare|train station|🚉|La gare est en face.|The station is opposite.
le musée|museum|🏛️|Le musée est gratuit le premier dimanche.|The museum is free on the first Sunday.
l’église|church|⛪|L’église date du douzième siècle.|The church dates from the twelfth century.
le parc|park|🌳|On se promène au parc.|We go for a walk in the park.
la poste|post office|📮|Je dois passer à la poste.|I need to stop at the post office.
à droite|on the right|➡️|Tournez à droite.|Turn right.
à gauche|on the left|⬅️|La gare est à gauche.|The station is on the left.
tout droit|straight on|⬆️|Allez tout droit.|Go straight on.
près|near|📍|C’est tout près.|It’s very close.
loin|far|🧭|C’est loin d’ici ?|Is it far from here?
`),
  // ---------- A2 ----------
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
le voyage|trip|🧳|Bon voyage !|Have a good trip!
voyager|to travel|🌍|J’adore voyager seule.|I love travelling alone.
l’avion|plane|✈️|L’avion décolle à midi.|The plane takes off at noon.
l’aéroport|airport|🛫|On va à l’aéroport en taxi.|We’re taking a taxi to the airport.
le billet|ticket|🎫|J’ai acheté les billets en ligne.|I bought the tickets online.
la valise|suitcase|🧳|Ma valise est trop lourde.|My suitcase is too heavy.
le passeport|passport|🛂|N’oublie pas ton passeport.|Don’t forget your passport.
le vol|flight|🛬|Le vol a une heure de retard.|The flight is an hour late.
les vacances|holidays|🏝️|On part en vacances en août.|We’re going on holiday in August.
la plage|beach|🏖️|La plage est à cinq minutes.|The beach is five minutes away.
la montagne|mountains|🏔️|Cet hiver, on va à la montagne.|This winter we’re going to the mountains.
l’étranger|abroad|🗺️|Il travaille à l’étranger.|He works abroad.
la carte|map / card / menu|🗺️|Regarde la carte, on est ici.|Look at the map, we’re here.
le souvenir|souvenir / memory|🎁|J’ai acheté un souvenir pour ma mère.|I bought a souvenir for my mother.
`),
  t('A2', 'hotel', '🏨', 'At the hotel', 'À l’hôtel', `
la réservation|booking|📋|J’ai une réservation au nom de Martin.|I have a booking under the name Martin.
la chambre double|double room|🛏️|Une chambre double pour trois nuits.|A double room for three nights.
la réception|reception|🛎️|Demandez à la réception.|Ask at reception.
le petit-déjeuner|breakfast|🥐|Le petit-déjeuner est servi jusqu’à dix heures.|Breakfast is served until ten.
la douche|shower|🚿|La douche ne marche pas.|The shower doesn’t work.
la serviette|towel|🧺|Je peux avoir une autre serviette ?|Can I have another towel?
l’ascenseur|lift|🛗|L’ascenseur est au fond du couloir.|The lift is at the end of the corridor.
l’étage|floor|🏢|Votre chambre est au troisième étage.|Your room is on the third floor.
la nuit|night|🌙|C’est combien la nuit ?|How much is it per night?
complet|full / fully booked|🈵|Désolé, l’hôtel est complet.|Sorry, the hotel is fully booked.
le wifi|wifi|📶|Le mot de passe du wifi, s’il vous plaît ?|The wifi password, please?
libérer la chambre|to check out|🧳|Il faut libérer la chambre avant midi.|You have to check out before noon.
le bruit|noise|🔊|Il y a trop de bruit dans la rue.|There’s too much noise in the street.
la vue|view|🌅|Une chambre avec vue sur la mer.|A room with a sea view.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
le médecin|doctor|👨‍⚕️|J’ai rendez-vous chez le médecin.|I have a doctor’s appointment.
malade|ill|🤒|Je suis malade depuis hier.|I’ve been ill since yesterday.
la fièvre|fever|🌡️|J’ai de la fièvre.|I have a temperature.
le rhume|cold|🤧|J’ai attrapé un rhume.|I caught a cold.
la toux|cough|😷|Il a une toux sèche.|He has a dry cough.
l’ordonnance|prescription|📃|Voici votre ordonnance.|Here is your prescription.
le médicament|medicine|💊|Prenez ce médicament trois fois par jour.|Take this medicine three times a day.
avoir mal à|to have a pain in|🤕|J’ai mal à la gorge.|I have a sore throat.
la gorge|throat|🗣️|Un thé au miel pour la gorge.|A honey tea for your throat.
fatigué|tired|🥱|Je suis très fatigué ce soir.|I’m very tired tonight.
se reposer|to rest|🛋️|Reposez-vous quelques jours.|Rest for a few days.
les urgences|A&E / emergency room|🚑|Il est aux urgences.|He’s in A&E.
guérir|to recover / to cure|🌤️|Tu vas vite guérir.|You’ll get better soon.
en forme|fit / in good shape|💪|Je me sens en forme aujourd’hui.|I feel in good shape today.
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
le travail|work / job|💼|J’aime beaucoup mon travail.|I really like my job.
travailler|to work|🧑‍💻|Je travaille dans une banque.|I work in a bank.
le bureau|office / desk|🏢|Le bureau est au centre-ville.|The office is in the city centre.
le collègue|colleague|🤝|Mes collègues sont sympas.|My colleagues are nice.
le patron|boss|😎|Le patron est en réunion.|The boss is in a meeting.
la réunion|meeting|👥|La réunion commence à neuf heures.|The meeting starts at nine.
le salaire|salary|💵|Le salaire est correct.|The salary is decent.
l’entretien|interview|🤝|J’ai un entretien d’embauche demain.|I have a job interview tomorrow.
le métier|profession|🧑‍🔧|Quel est ton métier ?|What do you do for a living?
l’entreprise|company|🏢|Elle a créé son entreprise.|She started her own company.
le télétravail|working from home|🏠|Je fais du télétravail le lundi.|I work from home on Mondays.
les congés|time off|🏖️|Je prends trois semaines de congés.|I’m taking three weeks off.
le courriel|email|📧|Je t’envoie un courriel.|I’ll send you an email.
embaucher|to hire|✍️|Ils embauchent des ingénieurs.|They’re hiring engineers.
`),
  t('A2', 'hobbies', '🎸', 'Free time', 'Les loisirs', `
le sport|sport|⚽|Je fais du sport trois fois par semaine.|I do sport three times a week.
le football|football|⚽|Mon fils joue au football.|My son plays football.
la natation|swimming|🏊|La natation, c’est bon pour le dos.|Swimming is good for your back.
le vélo|bike / cycling|🚲|Hugo fait du vélo tous les jours.|Hugo cycles every day.
la randonnée|hiking|🥾|On fait une randonnée dans les Alpes.|We’re going hiking in the Alps.
la lecture|reading|📖|La lecture est ma passion.|Reading is my passion.
le cinéma|cinema|🎬|On va au cinéma ce soir ?|Shall we go to the cinema tonight?
la musique|music|🎵|J’écoute de la musique en travaillant.|I listen to music while I work.
jouer de la guitare|to play the guitar|🎸|Il joue de la guitare depuis dix ans.|He’s played the guitar for ten years.
la danse|dance|💃|Elle prend des cours de danse.|She takes dance classes.
la photographie|photography|📷|La photographie, c’est mon hobby.|Photography is my hobby.
le jeu de société|board game|🎲|On joue à un jeu de société ?|Shall we play a board game?
la cuisine|cooking|👩‍🍳|J’adore faire la cuisine le week-end.|I love cooking at the weekend.
le jardinage|gardening|🪴|Le jardinage me détend.|Gardening relaxes me.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
le magasin|shop|🏬|Le magasin ouvre à dix heures.|The shop opens at ten.
acheter|to buy|🛒|J’achète du pain tous les matins.|I buy bread every morning.
le prix|price|🏷️|Quel est le prix de ce pull ?|What’s the price of this jumper?
les soldes|the sales|🏷️|Les soldes commencent en janvier.|The sales start in January.
la taille|size (clothes)|📏|Vous avez la taille au-dessus ?|Do you have the next size up?
la cabine d’essayage|fitting room|🚪|La cabine d’essayage est au fond.|The fitting room is at the back.
payer|to pay|💳|Je peux payer par carte ?|Can I pay by card?
la carte bancaire|bank card|💳|Ma carte bancaire ne marche pas.|My card isn’t working.
les espèces|cash|💵|Vous payez en espèces ?|Are you paying in cash?
le ticket de caisse|receipt|🧾|Gardez le ticket de caisse.|Keep the receipt.
rendre|to give back / return|↩️|Je voudrais rendre ce pantalon.|I’d like to return these trousers.
le cadeau|present|🎁|C’est pour offrir ?|Is it a gift?
bon marché|cheap|💰|Ce marché est bon marché.|This market is cheap.
la boutique|small shop / boutique|👗|Une petite boutique de vêtements.|A little clothes shop.
`),
  t('A2', 'transport', '🚆', 'Getting around', 'Se déplacer', `
le train|train|🚆|Le train pour Paris part à huit heures.|The train to Paris leaves at eight.
le métro|underground|🚇|Je prends le métro pour aller au travail.|I take the underground to work.
le bus|bus|🚌|Le bus passe toutes les dix minutes.|The bus comes every ten minutes.
la voiture|car|🚗|On y va en voiture ?|Shall we go by car?
le taxi|taxi|🚕|Je vais appeler un taxi.|I’ll call a taxi.
le quai|platform|🚉|Le train part du quai numéro trois.|The train leaves from platform three.
l’arrêt|stop|🚏|Je descends au prochain arrêt.|I get off at the next stop.
le retard|delay|⏰|Le train a vingt minutes de retard.|The train is twenty minutes late.
la correspondance|connection|🔁|J’ai une correspondance à Lyon.|I have a connection in Lyon.
monter|to get on / go up|⬆️|Montez dans le train, s’il vous plaît.|Please get on the train.
descendre|to get off / go down|⬇️|On descend ici.|We get off here.
rater|to miss|😩|J’ai raté le bus.|I missed the bus.
le permis de conduire|driving licence|🪪|Elle vient d’avoir son permis de conduire.|She’s just got her driving licence.
l’embouteillage|traffic jam|🚦|On est coincés dans un embouteillage.|We’re stuck in a traffic jam.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
heureux|happy|😊|Je suis très heureux ici.|I’m very happy here.
triste|sad|😢|Elle est triste depuis son départ.|She’s been sad since he left.
en colère|angry|😠|Pourquoi tu es en colère ?|Why are you angry?
inquiet|worried|😟|Ma mère est toujours inquiète.|My mother is always worried.
content|pleased|🙂|Je suis content de te voir.|I’m pleased to see you.
fier|proud|🦚|Je suis fière de toi.|I’m proud of you.
surpris|surprised|😮|J’ai été très surpris.|I was very surprised.
la peur|fear|😱|J’ai peur des araignées.|I’m afraid of spiders.
s’ennuyer|to be bored|🥱|Je m’ennuie le dimanche.|I get bored on Sundays.
déçu|disappointed|😞|Il est déçu par le résultat.|He’s disappointed with the result.
stressé|stressed|😫|Je suis stressé avant les examens.|I’m stressed before exams.
détendu|relaxed|😌|En vacances, je suis détendue.|On holiday I’m relaxed.
la joie|joy|🥳|Quelle joie de vous revoir !|What a joy to see you again!
manquer|to miss (someone)|💌|Tu me manques.|I miss you.
`),
  t('A2', 'restaurant', '🍽️', 'At the restaurant', 'Au restaurant', `
le menu|set menu / menu|📋|Je prends le menu du jour.|I’ll have the set menu of the day.
l’entrée|starter|🥗|En entrée, une salade de chèvre.|For a starter, a goat’s cheese salad.
le plat principal|main course|🍲|Le plat principal est un bœuf bourguignon.|The main course is a beef bourguignon.
le dessert|dessert|🍮|Un dessert, ou juste un café ?|Dessert, or just a coffee?
commander|to order|📝|Vous avez choisi ? Je peux commander ?|Have you chosen? Can I order?
réserver|to book|📞|J’ai réservé une table pour huit heures.|I’ve booked a table for eight.
le vin|wine|🍷|Un verre de vin rouge.|A glass of red wine.
la bouteille|bottle|🍾|Une bouteille d’eau gazeuse.|A bottle of sparkling water.
saignant|rare (meat)|🥩|Le steak, saignant, s’il vous plaît.|The steak, rare, please.
délicieux|delicious|😋|C’était délicieux, merci !|That was delicious, thank you!
végétarien|vegetarian|🥦|Vous avez un plat végétarien ?|Do you have a vegetarian dish?
le pourboire|tip|💶|On laisse un petit pourboire.|We’ll leave a small tip.
l’allergie|allergy|🤧|J’ai une allergie aux noix.|I’m allergic to nuts.
bon appétit|enjoy your meal|🍽️|Bon appétit à tous !|Enjoy your meal, everyone!
`),
  // ---------- B1 ----------
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
à mon avis|in my opinion|💬|À mon avis, c’est une bonne idée.|In my opinion, it’s a good idea.
je pense que|I think that|💭|Je pense que tu as raison.|I think you’re right.
avoir raison|to be right|✅|Tu as raison, c’est trop cher.|You’re right, it’s too expensive.
avoir tort|to be wrong|❌|J’avoue que j’avais tort.|I admit I was wrong.
être d’accord|to agree|🤝|Je suis d’accord avec toi.|I agree with you.
cependant|however|↔️|C’est cher ; cependant, c’est de qualité.|It’s expensive; however, it’s good quality.
d’un côté|on one hand|⚖️|D’un côté, j’aime Paris…|On one hand, I like Paris…
de l’autre côté|on the other hand|⚖️|De l’autre côté, la vie y est chère.|On the other hand, life there is expensive.
l’avantage|advantage|👍|Le grand avantage, c’est le prix.|The big advantage is the price.
l’inconvénient|drawback|👎|Le seul inconvénient, c’est le bruit.|The only drawback is the noise.
selon|according to|📰|Selon les experts, ça va s’améliorer.|According to experts, it’ll improve.
le point de vue|point of view|👁️|Je comprends ton point de vue.|I understand your point of view.
convaincre|to convince|🗣️|Tu m’as convaincu.|You’ve convinced me.
il me semble que|it seems to me that|🤔|Il me semble que c’est fermé.|It seems to me it’s closed.
`),
  t('B1', 'media', '📰', 'News and media', 'Médias et actualités', `
les informations|the news|📺|Je regarde les informations à vingt heures.|I watch the eight o’clock news.
le journal|newspaper|📰|Je lis le journal le matin.|I read the paper in the morning.
l’article|article|📄|Tu as lu cet article ?|Have you read this article?
le journaliste|journalist|🎙️|La journaliste interviewe le ministre.|The journalist interviews the minister.
les réseaux sociaux|social media|📱|Il passe trop de temps sur les réseaux sociaux.|He spends too much time on social media.
publier|to publish / post|📤|Elle publie une photo par jour.|She posts a photo a day.
la publicité|advertising / advert|📣|Il y a trop de publicité à la télé.|There are too many adverts on TV.
l’émission|programme / show|📺|C’est mon émission préférée.|It’s my favourite programme.
la chaîne|channel|📡|Change de chaîne, s’il te plaît.|Change the channel, please.
le podcast|podcast|🎧|J’écoute un podcast en courant.|I listen to a podcast while running.
la fausse information|fake news|🕵️|Attention aux fausses informations.|Watch out for fake news.
la source|source|🔎|Quelle est la source de cette info ?|What’s the source of this information?
s’informer|to keep informed|🗞️|Je m’informe sur internet.|I keep up with the news online.
le titre|headline / title|🔠|Le titre est un peu exagéré.|The headline is a bit exaggerated.
`),
  t('B1', 'environment', '🌱', 'The environment', 'L’environnement', `
l’environnement|environment|🌍|Il faut protéger l’environnement.|We must protect the environment.
le réchauffement climatique|global warming|🌡️|Le réchauffement climatique s’accélère.|Global warming is speeding up.
la pollution|pollution|🏭|La pollution de l’air est un problème.|Air pollution is a problem.
recycler|to recycle|♻️|On recycle le verre et le papier.|We recycle glass and paper.
les déchets|waste|🗑️|Il faut réduire nos déchets.|We need to reduce our waste.
l’énergie renouvelable|renewable energy|🔋|L’énergie solaire est renouvelable.|Solar energy is renewable.
économiser|to save|💡|Économise l’eau !|Save water!
le plastique|plastic|🥤|Moins de plastique, s’il vous plaît.|Less plastic, please.
la sécheresse|drought|🏜️|La sécheresse touche le sud.|The drought is hitting the south.
la planète|planet|🪐|Nous n’avons qu’une planète.|We only have one planet.
durable|sustainable|🌿|Une mode plus durable.|More sustainable fashion.
la biodiversité|biodiversity|🦋|La biodiversité diminue.|Biodiversity is falling.
le vélo électrique|e-bike|🚲|Je vais au travail en vélo électrique.|I ride an e-bike to work.
gaspiller|to waste|🚮|Ne gaspille pas la nourriture.|Don’t waste food.
`),
  t('B1', 'tech', '💻', 'Technology', 'La technologie', `
l’ordinateur|computer|💻|Mon ordinateur est trop lent.|My computer is too slow.
le portable|mobile phone|📱|J’ai oublié mon portable.|I forgot my phone.
l’application|app|📲|Télécharge l’application.|Download the app.
le mot de passe|password|🔑|J’ai oublié mon mot de passe.|I forgot my password.
l’écran|screen|🖥️|Trop de temps devant les écrans.|Too much screen time.
télécharger|to download|⬇️|Le fichier se télécharge.|The file is downloading.
le fichier|file|📁|Envoie-moi le fichier.|Send me the file.
la batterie|battery|🔋|Ma batterie est presque vide.|My battery is almost dead.
le chargeur|charger|🔌|Tu as un chargeur ?|Do you have a charger?
mettre à jour|to update|🔄|Il faut mettre à jour le téléphone.|The phone needs updating.
l’intelligence artificielle|artificial intelligence|🤖|L’intelligence artificielle change nos métiers.|AI is changing our jobs.
en ligne|online|🌐|J’achète tout en ligne.|I buy everything online.
le réseau|network|📶|Il n’y a pas de réseau ici.|There’s no signal here.
sauvegarder|to save (a file) / back up|💾|N’oublie pas de sauvegarder.|Don’t forget to save.
`),
  t('B1', 'studies', '🎓', 'Studies', 'Les études', `
l’université|university|🏛️|Elle étudie à l’université de Lyon.|She studies at the University of Lyon.
les études|studies|📚|Il fait des études de médecine.|He’s studying medicine.
l’étudiant|student|🧑‍🎓|Les étudiants sont en vacances.|The students are on holiday.
le cours|class / lesson|🧑‍🏫|Le cours commence à huit heures.|The class starts at eight.
l’examen|exam|📝|J’ai réussi mon examen !|I passed my exam!
réussir|to succeed / to pass|🏆|Elle a réussi son bac.|She passed her baccalauréat.
échouer|to fail|📉|Il a échoué de peu.|He narrowly failed.
le diplôme|degree / diploma|📜|Elle a un diplôme d’ingénieur.|She has an engineering degree.
la bourse|grant / scholarship|💶|Il a obtenu une bourse.|He got a scholarship.
la bibliothèque|library|📚|On révise à la bibliothèque.|We revise at the library.
réviser|to revise|📖|Je révise pour l’examen.|I’m revising for the exam.
la note|mark / grade|💯|J’ai eu une bonne note.|I got a good mark.
le mémoire|dissertation|📑|Elle écrit son mémoire.|She’s writing her dissertation.
le stage|internship|🧑‍💼|Je fais un stage de six mois.|I’m doing a six-month internship.
`),
  t('B1', 'money', '💶', 'Money', 'L’argent', `
l’argent|money|💶|L’argent ne fait pas le bonheur.|Money doesn’t buy happiness.
le compte bancaire|bank account|🏦|J’ai ouvert un compte bancaire.|I opened a bank account.
dépenser|to spend|💸|Je dépense trop en sorties.|I spend too much on going out.
économiser de l’argent|to save money|🐷|J’économise pour un voyage.|I’m saving for a trip.
le loyer|rent|🏠|Le loyer est très cher à Paris.|Rent is very expensive in Paris.
la facture|bill|🧾|J’ai payé la facture d’électricité.|I paid the electricity bill.
prêter|to lend|🤲|Tu peux me prêter dix euros ?|Can you lend me ten euros?
emprunter|to borrow|💳|J’ai emprunté de l’argent à la banque.|I borrowed money from the bank.
le crédit|loan|📄|Ils ont pris un crédit pour la maison.|They took out a loan for the house.
les impôts|taxes|🧾|On paie les impôts en mai.|We pay taxes in May.
le budget|budget|📊|On a un petit budget ce mois-ci.|We’re on a tight budget this month.
rembourser|to pay back / refund|↩️|Je te rembourse demain.|I’ll pay you back tomorrow.
gagner sa vie|to earn a living|💼|Il gagne bien sa vie.|He earns a good living.
la monnaie|change (coins)|🪙|Vous avez de la monnaie ?|Do you have any change?
`),
  t('B1', 'relationships', '💞', 'Relationships', 'Les relations', `
le couple|couple|💑|C’est un couple très uni.|They’re a very close couple.
le copain|boyfriend / mate|💑|Elle est venue avec son copain.|She came with her boyfriend.
la copine|girlfriend / friend|👭|Je sors avec mes copines.|I’m going out with my friends.
tomber amoureux|to fall in love|😍|Ils sont tombés amoureux à Venise.|They fell in love in Venice.
se marier|to get married|💍|Ils se marient en juin.|They’re getting married in June.
le mariage|wedding / marriage|💒|Le mariage a lieu en Bretagne.|The wedding is in Brittany.
se disputer|to argue|🗯️|Ils se disputent souvent.|They often argue.
se réconcilier|to make up|🤝|Ils se sont réconciliés.|They made up.
faire confiance|to trust|🫶|Je te fais confiance.|I trust you.
l’amitié|friendship|🤗|Notre amitié dure depuis vingt ans.|Our friendship has lasted twenty years.
s’entendre bien|to get on well|😊|Je m’entends bien avec mes voisins.|I get on well with my neighbours.
le voisin|neighbour|🏘️|Notre voisine est adorable.|Our neighbour is lovely.
rencontrer|to meet|🙋|J’ai rencontré Camille à la fac.|I met Camille at uni.
le divorce|divorce|💔|Ses parents sont divorcés.|His parents are divorced.
`),
  t('B1', 'culture', '🎭', 'Culture', 'La culture', `
le théâtre|theatre|🎭|On va au théâtre samedi.|We’re going to the theatre on Saturday.
l’exposition|exhibition|🖼️|L’exposition sur Monet est superbe.|The Monet exhibition is superb.
le tableau|painting|🖼️|Ce tableau est au Louvre.|This painting is in the Louvre.
le roman|novel|📘|Je lis un roman de Zola.|I’m reading a Zola novel.
l’écrivain|writer|✒️|C’est un écrivain très connu.|He’s a very well-known writer.
le patrimoine|heritage|🏰|Le Mont-Saint-Michel fait partie du patrimoine.|Mont-Saint-Michel is part of the heritage.
la chanson|song|🎶|Une vieille chanson de Piaf.|An old Piaf song.
le festival|festival|🎪|Le festival d’Avignon a lieu en juillet.|The Avignon festival is in July.
le siècle|century|⏳|Une église du douzième siècle.|A twelfth-century church.
la tradition|tradition|🎎|C’est une tradition familiale.|It’s a family tradition.
la langue|language|🗣️|Le français est une langue riche.|French is a rich language.
l’histoire|history / story|📜|J’adore l’histoire de France.|I love French history.
célèbre|famous|⭐|Une actrice célèbre.|A famous actress.
le spectacle|show|🎟️|Le spectacle commence à vingt heures.|The show starts at eight p.m.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'fr-g-articles', level: 'A1', icon: '🔤', en: 'Gender and articles', fr: 'Genre et articles',
    cards: [
      { en: 'Every French noun is masculine or feminine. Learn each noun with its article.', fr: 'Chaque nom est masculin ou féminin. Apprenez chaque nom avec son article.', examples: [['le livre', 'the book', 'the book'], ['la table', 'the table', 'the table']] },
      { en: '"The": le (m), la (f), l’ (before a vowel), les (plural). "A": un (m), une (f), des (plural).', fr: '« The » : le, la, l’, les. « A » : un, une, des.', examples: [['l’école', 'the school', 'the school'], ['des pommes', 'some apples', 'some apples']] },
      { en: 'Some, any: du (m), de la (f), de l’ (vowel), des (plural). After a negative they all become de: pas de pain.', fr: 'Partitif : du, de la, de l’, des. Après une négation : pas de.', examples: [['du pain', 'some bread', 'some bread'], ['pas de lait', 'no milk', 'no milk']] },
    ],
    drills: [
      { text: '___ livre est sur la table.', answer: 'Le', wrong: ['La', 'Les'], en: 'The book is on the table.', fr: 'The book is on the table.' },
      { text: 'J’ai ___ voiture rouge.', answer: 'une', wrong: ['un', 'le'], en: 'I have a red car.', fr: 'I have a red car.' },
      { text: '___ école est fermée.', answer: 'L’', wrong: ['La', 'Le'], en: 'The school is closed.', fr: 'The school is closed.' },
      { text: 'Je voudrais ___ pain.', answer: 'du', wrong: ['de la', 'des'], en: 'I’d like some bread.', fr: 'I’d like some bread.' },
      { text: 'Il n’y a pas ___ lait.', answer: 'de', wrong: ['du', 'le'], en: 'There’s no milk.', fr: 'There’s no milk.' },
    ],
  },
  {
    id: 'fr-g-etre-avoir', level: 'A1', icon: '🧩', en: 'Être and avoir', fr: 'Être et avoir',
    cards: [
      { en: 'Être (to be): je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont.', fr: 'Être : je suis, tu es, il est, nous sommes, vous êtes, ils sont.', examples: [['Je suis fatigué.', 'I’m tired.', 'I’m tired.'], ['Nous sommes à Lyon.', 'We’re in Lyon.', 'We’re in Lyon.']] },
      { en: 'Avoir (to have): j’ai, tu as, il/elle a, nous avons, vous avez, ils/elles ont.', fr: 'Avoir : j’ai, tu as, il a, nous avons, vous avez, ils ont.', examples: [['J’ai deux frères.', 'I have two brothers.', 'I have two brothers.'], ['Elle a un chat.', 'She has a cat.', 'She has a cat.']] },
      { en: 'French uses avoir for age, hunger, thirst, cold and fear: j’ai 30 ans, j’ai faim, j’ai froid.', fr: 'Avoir pour l’âge, la faim, la soif, le froid, la peur.', examples: [['J’ai trente ans.', 'I’m thirty.', 'I’m thirty.'], ['Tu as faim ?', 'Are you hungry?', 'Are you hungry?']] },
    ],
    drills: [
      { text: 'Je ___ français.', answer: 'suis', wrong: ['es', 'ai'], en: 'I’m French.', fr: 'I’m French.' },
      { text: 'Nous ___ deux enfants.', answer: 'avons', wrong: ['sommes', 'avez'], en: 'We have two children.', fr: 'We have two children.' },
      { text: 'Ils ___ très gentils.', answer: 'sont', wrong: ['ont', 'est'], en: 'They are very kind.', fr: 'They are very kind.' },
      { text: 'Tu ___ quel âge ?', answer: 'as', wrong: ['es', 'a'], en: 'How old are you?', fr: 'How old are you?' },
      { text: 'Vous ___ en retard.', answer: 'êtes', wrong: ['avez', 'sont'], en: 'You are late.', fr: 'You are late.' },
    ],
  },
  {
    id: 'fr-g-er', level: 'A1', icon: '🔁', en: 'Present tense: -er verbs', fr: 'Le présent : verbes en -er',
    cards: [
      { en: 'Most verbs end in -er. Drop -er and add: -e, -es, -e, -ons, -ez, -ent. (Je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.)', fr: 'Verbes en -er : -e, -es, -e, -ons, -ez, -ent.', examples: [['Je parle français.', 'I speak French.', 'I speak French.'], ['Nous habitons ici.', 'We live here.', 'We live here.']] },
      { en: 'The -e, -es, -e and -ent endings are silent: parle, parles and parlent sound the same.', fr: 'Les terminaisons -e, -es, -ent ne se prononcent pas.', examples: [['Ils aiment le café.', 'They like coffee.', 'They like coffee.']] },
    ],
    drills: [
      { text: 'Tu ___ anglais ?', answer: 'parles', wrong: ['parle', 'parlez'], en: 'Do you speak English?', fr: 'Do you speak English?' },
      { text: 'Nous ___ à Paris.', answer: 'habitons', wrong: ['habitez', 'habitent'], en: 'We live in Paris.', fr: 'We live in Paris.' },
      { text: 'Elles ___ le cinéma.', answer: 'aiment', wrong: ['aime', 'aimons'], en: 'They love the cinema.', fr: 'They love the cinema.' },
      { text: 'Vous ___ ici ?', answer: 'travaillez', wrong: ['travaillons', 'travailles'], en: 'Do you work here?', fr: 'Do you work here?' },
      { text: 'Je ___ la radio.', answer: 'écoute', wrong: ['écoutes', 'écoutons'], en: 'I’m listening to the radio.', fr: 'I’m listening to the radio.' },
    ],
  },
  {
    id: 'fr-g-negation', level: 'A1', icon: '🚫', en: 'Saying no: ne … pas', fr: 'La négation',
    cards: [
      { en: 'Put ne before the verb and pas after it. Ne becomes n’ before a vowel: je ne sais pas, il n’aime pas.', fr: 'Ne + verbe + pas. N’ devant une voyelle.', examples: [['Je ne parle pas allemand.', 'I don’t speak German.', 'I don’t speak German.'], ['Il n’aime pas le café.', 'He doesn’t like coffee.', 'He doesn’t like coffee.']] },
      { en: 'Other negatives work the same way: ne … jamais (never), ne … plus (no longer), ne … rien (nothing).', fr: 'Ne … jamais, ne … plus, ne … rien.', examples: [['Je ne bois jamais d’alcool.', 'I never drink alcohol.', 'I never drink alcohol.'], ['Elle n’habite plus ici.', 'She doesn’t live here any more.', 'She doesn’t live here any more.']] },
    ],
    drills: [
      { text: 'Je ne mange ___ de viande.', answer: 'pas', wrong: ['ne', 'rien'], en: 'I don’t eat meat.', fr: 'I don’t eat meat.' },
      { text: 'Il ___ aime pas le sport.', answer: 'n’', wrong: ['ne', 'pas'], en: 'He doesn’t like sport.', fr: 'He doesn’t like sport.' },
      { text: 'Nous ne sortons ___ le lundi.', answer: 'jamais', wrong: ['rien', 'plus de'], en: 'We never go out on Mondays.', fr: 'We never go out on Mondays.' },
      { text: 'Je ne comprends ___.', answer: 'rien', wrong: ['jamais de', 'pas de'], en: 'I don’t understand anything.', fr: 'I don’t understand anything.' },
    ],
  },
  {
    id: 'fr-g-aller', level: 'A2', icon: '➡️', en: 'Aller and the near future', fr: 'Aller et le futur proche',
    cards: [
      { en: 'Aller (to go): je vais, tu vas, il va, nous allons, vous allez, ils vont.', fr: 'Aller : je vais, tu vas, il va, nous allons, vous allez, ils vont.', examples: [['Je vais au marché.', 'I’m going to the market.', 'I’m going to the market.']] },
      { en: 'Aller + infinitive = going to do something: je vais manger, nous allons partir.', fr: 'Aller + infinitif = futur proche.', examples: [['Je vais appeler Camille.', 'I’m going to call Camille.', 'I’m going to call Camille.'], ['Il va pleuvoir.', 'It’s going to rain.', 'It’s going to rain.']] },
    ],
    drills: [
      { text: 'Nous ___ partir demain.', answer: 'allons', wrong: ['allez', 'vont'], en: 'We’re going to leave tomorrow.', fr: 'We’re going to leave tomorrow.' },
      { text: 'Il ___ pleuvoir ce soir.', answer: 'va', wrong: ['vais', 'vas'], en: 'It’s going to rain tonight.', fr: 'It’s going to rain tonight.' },
      { text: 'Tu ___ venir à la fête ?', answer: 'vas', wrong: ['va', 'allez'], en: 'Are you going to come to the party?', fr: 'Are you going to come to the party?' },
      { text: 'Ils ___ au cinéma.', answer: 'vont', wrong: ['allons', 'va'], en: 'They’re going to the cinema.', fr: 'They’re going to the cinema.' },
    ],
  },
  {
    id: 'fr-g-pc-avoir', level: 'A2', icon: '⏮️', en: 'Passé composé with avoir', fr: 'Passé composé avec avoir',
    cards: [
      { en: 'For finished past actions: avoir (present) + past participle. -er verbs: parler → parlé.', fr: 'Avoir + participe passé. Verbes en -er : -é.', examples: [['J’ai mangé une crêpe.', 'I ate a crêpe.', 'I ate a crêpe.'], ['Nous avons visité Lyon.', 'We visited Lyon.', 'We visited Lyon.']] },
      { en: 'Common irregular participles: faire → fait, prendre → pris, voir → vu, boire → bu, avoir → eu, être → été.', fr: 'Participes irréguliers : fait, pris, vu, bu, eu, été.', examples: [['J’ai pris le train.', 'I took the train.', 'I took the train.'], ['Tu as vu ce film ?', 'Have you seen this film?', 'Have you seen this film?']] },
    ],
    drills: [
      { text: 'Hier, j’___ travaillé tard.', answer: 'ai', wrong: ['suis', 'as'], en: 'Yesterday I worked late.', fr: 'Yesterday I worked late.' },
      { text: 'Nous avons ___ le métro.', answer: 'pris', wrong: ['prendu', 'prendre'], en: 'We took the underground.', fr: 'We took the underground.' },
      { text: 'Tu as ___ tes devoirs ?', answer: 'fait', wrong: ['faire', 'faisé'], en: 'Have you done your homework?', fr: 'Have you done your homework?' },
      { text: 'Ils ont ___ un bon film.', answer: 'vu', wrong: ['voi', 'voir'], en: 'They saw a good film.', fr: 'They saw a good film.' },
    ],
  },
  {
    id: 'fr-g-pc-etre', level: 'B1', icon: '🚪', en: 'Passé composé with être', fr: 'Passé composé avec être',
    cards: [
      { en: 'Verbs of movement and change use être: aller, venir, partir, arriver, entrer, sortir, naître, mourir, rester, tomber… plus all reflexive verbs.', fr: 'Les verbes de mouvement et les verbes pronominaux utilisent être.', examples: [['Je suis allé à Paris.', 'I went to Paris.', 'I went to Paris.'], ['Elle s’est levée tôt.', 'She got up early.', 'She got up early.']] },
      { en: 'With être, the participle agrees with the subject: elle est partie, ils sont arrivés, elles sont venues.', fr: 'Avec être, le participe s’accorde avec le sujet.', examples: [['Camille est arrivée hier.', 'Camille arrived yesterday.', 'Camille arrived yesterday.']] },
    ],
    drills: [
      { text: 'Elle ___ partie à huit heures.', answer: 'est', wrong: ['a', 'ai'], en: 'She left at eight.', fr: 'She left at eight.' },
      { text: 'Nous sommes ___ en retard.', answer: 'arrivés', wrong: ['arrivé', 'arriver'], en: 'We arrived late.', fr: 'We arrived late.' },
      { text: 'Ils ___ restés à la maison.', answer: 'sont', wrong: ['ont', 'est'], en: 'They stayed at home.', fr: 'They stayed at home.' },
      { text: 'Je me suis ___ tôt.', answer: 'levé', wrong: ['lever', 'levais'], en: 'I got up early.', fr: 'I got up early.' },
    ],
  },
  {
    id: 'fr-g-imparfait', level: 'B1', icon: '🕰️', en: 'The imparfait', fr: 'L’imparfait',
    cards: [
      { en: 'For background, habits and descriptions in the past: take the nous form, drop -ons, add -ais, -ais, -ait, -ions, -iez, -aient.', fr: 'Imparfait : radical de nous + -ais, -ais, -ait, -ions, -iez, -aient.', examples: [['Quand j’étais petit, j’habitais à la campagne.', 'When I was little, I lived in the country.', 'When I was little, I lived in the country.']] },
      { en: 'Imparfait sets the scene; passé composé tells what happened: Il pleuvait quand je suis sorti.', fr: 'L’imparfait décrit, le passé composé raconte.', examples: [['Il pleuvait quand je suis sorti.', 'It was raining when I went out.', 'It was raining when I went out.']] },
    ],
    drills: [
      { text: 'Quand j’étais jeune, je ___ au foot.', answer: 'jouais', wrong: ['ai joué', 'joue'], en: 'When I was young, I used to play football.', fr: 'When I was young, I used to play football.' },
      { text: 'Il ___ beau ce jour-là.', answer: 'faisait', wrong: ['a fait', 'fait'], en: 'The weather was nice that day.', fr: 'The weather was nice that day.' },
      { text: 'Nous ___ souvent à la plage.', answer: 'allions', wrong: ['allons', 'sommes allés'], en: 'We often used to go to the beach.', fr: 'We often used to go to the beach.' },
      { text: 'Elle lisait quand le téléphone ___.', answer: 'a sonné', wrong: ['sonnait', 'sonne'], en: 'She was reading when the phone rang.', fr: 'She was reading when the phone rang.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'fr-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Bonjour ! Qu’est-ce que je vous sers ?', en: 'Hello! What can I get you?', fr: 'Hello! What can I get you?' },
      { who: 'B', text: 'Un café et un croissant, s’il vous plaît.', en: 'A coffee and a croissant, please.', fr: 'A coffee and a croissant, please.', wrong: ['L’addition, s’il vous plaît.', 'Je suis un croissant.'] },
      { who: 'A', text: 'Sur place ou à emporter ?', en: 'To have here or to take away?', fr: 'To have here or to take away?' },
      { who: 'B', text: 'Sur place, en terrasse.', en: 'Here, on the terrace.', fr: 'Here, on the terrace.', wrong: ['Il fait froid à Lyon.', 'Deux ans, merci.'] },
      { who: 'A', text: 'Très bien. Ça fait quatre euros cinquante.', en: 'Very good. That’s four fifty.', fr: 'Very good. That’s four fifty.' },
      { who: 'B', text: 'Voilà. Merci, bonne journée !', en: 'Here you are. Thanks, have a nice day!', fr: 'Here you are. Thanks, have a nice day!', wrong: ['Enchanté, je m’appelle euros.', 'Bonne nuit, à demain matin !'] },
    ],
  },
  {
    id: 'fr-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Excusez-moi, où est la gare, s’il vous plaît ?', en: 'Excuse me, where is the station, please?', fr: 'Excuse me, where is the station, please?', wrong: ['Excusez-moi, je suis la gare.', 'Excusez-moi, combien coûte la gare ?'] },
      { who: 'A', text: 'Allez tout droit, puis tournez à gauche.', en: 'Go straight on, then turn left.', fr: 'Go straight on, then turn left.' },
      { who: 'B', text: 'C’est loin d’ici ?', en: 'Is it far from here?', fr: 'Is it far from here?', wrong: ['C’est mon frère ?', 'Il fait beau ?'] },
      { who: 'A', text: 'Non, c’est à cinq minutes à pied.', en: 'No, it’s five minutes’ walk.', fr: 'No, it’s five minutes’ walk.' },
      { who: 'B', text: 'Merci beaucoup, madame !', en: 'Thank you very much, madam!', fr: 'Thank you very much, madam!', wrong: ['Pardon, j’ai faim.', 'Au revoir, monsieur le train !'] },
    ],
  },
  {
    id: 'fr-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Bonsoir, je peux vous aider ?', en: 'Good evening, can I help you?', fr: 'Good evening, can I help you?' },
      { who: 'B', text: 'Bonsoir, j’ai une réservation au nom de Smith.', en: 'Good evening, I have a booking under the name Smith.', fr: 'Good evening, I have a booking under the name Smith.', wrong: ['Bonsoir, j’ai mal à la tête.', 'Bonsoir, je voudrais un croissant.'] },
      { who: 'A', text: 'Oui, une chambre double pour deux nuits. Votre passeport, s’il vous plaît.', en: 'Yes, a double room for two nights. Your passport, please.', fr: 'Yes, a double room for two nights. Your passport, please.' },
      { who: 'B', text: 'Le voici. À quelle heure est le petit-déjeuner ?', en: 'Here it is. What time is breakfast?', fr: 'Here it is. What time is breakfast?', wrong: ['Le voici. Où est la plage du passeport ?', 'Non merci, je n’ai pas faim.'] },
      { who: 'A', text: 'De sept heures à dix heures. Vous êtes au troisième étage.', en: 'From seven to ten. You’re on the third floor.', fr: 'From seven to ten. You’re on the third floor.' },
      { who: 'B', text: 'Parfait. Le wifi est gratuit ?', en: 'Perfect. Is the wifi free?', fr: 'Perfect. Is the wifi free?', wrong: ['Parfait. Je suis gratuit.', 'Parfait. J’ai trente ans.'] },
    ],
  },
  {
    id: 'fr-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Bonjour. Qu’est-ce qui ne va pas ?', en: 'Hello. What’s wrong?', fr: 'Hello. What’s wrong?' },
      { who: 'B', text: 'J’ai mal à la gorge et j’ai de la fièvre.', en: 'I have a sore throat and a temperature.', fr: 'I have a sore throat and a temperature.', wrong: ['J’ai faim et je voudrais un café.', 'J’ai une réservation pour deux nuits.'] },
      { who: 'A', text: 'Depuis combien de temps ?', en: 'For how long?', fr: 'For how long?' },
      { who: 'B', text: 'Depuis trois jours.', en: 'For three days.', fr: 'For three days.', wrong: ['À trois heures et demie.', 'Trois euros, s’il vous plaît.'] },
      { who: 'A', text: 'C’est une angine. Voici une ordonnance. Reposez-vous bien.', en: 'It’s a throat infection. Here’s a prescription. Get plenty of rest.', fr: 'It’s a throat infection. Here’s a prescription. Get plenty of rest.' },
      { who: 'B', text: 'Merci, docteur. Je dois revenir ?', en: 'Thank you, doctor. Do I need to come back?', fr: 'Thank you, doctor. Do I need to come back?', wrong: ['Merci, docteur. Où est la gare ?', 'Merci, docteur. Une table pour deux ?'] },
    ],
  },
  {
    id: 'fr-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Qu’est-ce que tu fais ce week-end ?', en: 'What are you doing this weekend?', fr: 'What are you doing this weekend?' },
      { who: 'B', text: 'Rien de spécial. Tu as une idée ?', en: 'Nothing special. Got any ideas?', fr: 'Nothing special. Got any ideas?', wrong: ['J’ai mangé une pizza hier.', 'Je suis né à Lyon.'] },
      { who: 'A', text: 'On pourrait faire une randonnée dans les Monts d’Or.', en: 'We could go hiking in the Monts d’Or.', fr: 'We could go hiking in the Monts d’Or.' },
      { who: 'B', text: 'Bonne idée ! S’il fait beau, je viens avec plaisir.', en: 'Good idea! If the weather’s nice, I’d love to come.', fr: 'Good idea! If the weather’s nice, I’d love to come.', wrong: ['Bonne idée ! J’étais malade l’an dernier.', 'Non, je n’ai jamais de chaussures.'] },
      { who: 'A', text: 'Super. On se retrouve à la gare à neuf heures ?', en: 'Great. Shall we meet at the station at nine?', fr: 'Great. Shall we meet at the station at nine?' },
      { who: 'B', text: 'D’accord, j’apporterai le pique-nique.', en: 'OK, I’ll bring the picnic.', fr: 'OK, I’ll bring the picnic.', wrong: ['D’accord, j’ai apporté hier.', 'Non merci, je suis la gare.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'fr-s-market', level: 'A1', icon: '🧺', en: 'Camille at the market', fr: 'Camille au marché',
    sentences: [
      ['Camille habite à Lyon.', 'Camille lives in Lyon.', 'Camille lives in Lyon.'],
      ['Le samedi, elle va au marché.', 'On Saturdays she goes to the market.', 'On Saturdays she goes to the market.'],
      ['Elle achète des tomates, du fromage et une baguette.', 'She buys tomatoes, cheese and a baguette.', 'She buys tomatoes, cheese and a baguette.'],
      ['Après, elle prend un café chez Julien.', 'Afterwards she has a coffee at Julien’s.', 'Afterwards she has a coffee at Julien’s.'],
      ['Julien lui offre un croissant.', 'Julien gives her a croissant on the house.', 'Julien gives her a croissant on the house.'],
      ['Camille est très contente.', 'Camille is very happy.', 'Camille is very happy.'],
    ],
    glossary: { habite: ['lives', 'lives'], samedi: ['Saturday', 'Saturday'], marché: ['market', 'market'], achète: ['buys', 'buys'], fromage: ['cheese', 'cheese'], après: ['afterwards', 'afterwards'], prend: ['has / takes', 'has / takes'], offre: ['gives (as a gift)', 'gives (as a gift)'], contente: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Camille live?', fr: 'Where does Camille live?', answer: 'Lyon', wrong: ['Paris', 'Nantes'] },
      { en: 'When does she go to the market?', fr: 'When does she go to the market?', answer: 'le samedi', wrong: ['le lundi', 'le dimanche'] },
      { en: 'What does Julien give her?', fr: 'What does Julien give her?', answer: 'un croissant', wrong: ['une baguette', 'du fromage'] },
    ],
  },
  {
    id: 'fr-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Hugo avait un train pour Marseille à huit heures.', 'Hugo had a train to Marseille at eight.', 'Hugo had a train to Marseille at eight.'],
      ['Mais il s’est réveillé à sept heures et demie.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Il s’est habillé très vite et il a pris son vélo.', 'He got dressed very quickly and took his bike.', 'He got dressed very quickly and took his bike.'],
      ['Il est arrivé à la gare à huit heures deux.', 'He got to the station at two minutes past eight.', 'He got to the station at two minutes past eight.'],
      ['Le train était déjà parti.', 'The train had already left.', 'The train had already left.'],
      ['Finalement, il a pris le train suivant et il a lu un bon livre.', 'In the end he took the next train and read a good book.', 'In the end he took the next train and read a good book.'],
    ],
    glossary: { avait: ['had', 'had'], réveillé: ['woke up', 'woke up'], habillé: ['got dressed', 'got dressed'], vite: ['quickly', 'quickly'], arrivé: ['arrived', 'arrived'], déjà: ['already', 'already'], parti: ['left', 'left'], finalement: ['in the end', 'in the end'], suivant: ['next', 'next'] },
    questions: [
      { en: 'Where was Hugo going?', fr: 'Where was Hugo going?', answer: 'à Marseille', wrong: ['à Lyon', 'à Paris'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'à vélo', wrong: ['en taxi', 'à pied'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'il a lu', wrong: ['il a dormi', 'il a mangé'] },
    ],
  },
  {
    id: 'fr-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Il y a deux ans, les habitants de notre immeuble ont eu une idée.', 'Two years ago, the residents of our building had an idea.', 'Two years ago, the residents of our building had an idea.'],
      ['Le toit était vide et personne ne l’utilisait.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Madame Petit a proposé d’y faire un potager.', 'Madame Petit suggested making a vegetable garden there.', 'Madame Petit suggested making a vegetable garden there.'],
      ['Au début, certains voisins n’étaient pas convaincus.', 'At first, some neighbours weren’t convinced.', 'At first, some neighbours weren’t convinced.'],
      ['Aujourd’hui, on y cultive des tomates, des herbes et des fraises.', 'Today we grow tomatoes, herbs and strawberries there.', 'Today we grow tomatoes, herbs and strawberries there.'],
      ['Et chaque dimanche, tout le monde se retrouve là-haut pour partager un repas.', 'And every Sunday, everyone meets up there to share a meal.', 'And every Sunday, everyone meets up there to share a meal.'],
    ],
    glossary: { habitants: ['residents', 'residents'], immeuble: ['building', 'building'], toit: ['roof', 'roof'], vide: ['empty', 'empty'], personne: ['nobody', 'nobody'], potager: ['vegetable garden', 'vegetable garden'], convaincus: ['convinced', 'convinced'], cultive: ['grow', 'grow'], partager: ['to share', 'to share'], repas: ['meal', 'meal'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'Madame Petit', wrong: ['Camille', 'Hugo'] },
      { en: 'What do they grow?', fr: 'What do they grow?', answer: 'des tomates, des herbes et des fraises', wrong: ['des pommes et des poires', 'du blé'] },
      { en: 'When does everyone meet on the roof?', fr: 'When does everyone meet on the roof?', answer: 'chaque dimanche', wrong: ['chaque lundi', 'une fois par an'] },
    ],
  },
];

export const FRENCH_FULL: FullCourse = { topics, grammar, dialogues, stories };
