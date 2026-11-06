import { words, type Topic } from '@/data/learn/full';

/** Spanish A1, second pack: everyday verbs, routines, food, the kitchen, school, sport, places and more. Original content. */
const t = (id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level: 'A1', icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
ser|to be (who/what)|être (identité)|🪪|Soy profesora de música.|I am a music teacher.|Je suis professeure de musique.
estar|to be (where/how)|être (lieu, état)|📍|Estoy en casa.|I am at home.|Je suis à la maison.
tener|to have|avoir|🤲|Tengo dos hermanos.|I have two brothers.|J’ai deux frères.
hacer|to do / to make|faire|🛠️|¿Qué haces hoy?|What are you doing today?|Qu’est-ce que tu fais aujourd’hui ?
ir|to go|aller|🚶|Voy al trabajo en bici.|I go to work by bike.|Je vais au travail à vélo.
venir|to come|venir|👋|¿Vienes a la fiesta?|Are you coming to the party?|Tu viens à la fête ?
comer|to eat|manger|🍽️|Comemos a las dos.|We eat at two.|Nous mangeons à deux heures.
beber|to drink|boire|🥤|Bebo mucha agua.|I drink a lot of water.|Je bois beaucoup d’eau.
vivir|to live|habiter / vivre|🏡|Vivo cerca del mar.|I live near the sea.|J’habite près de la mer.
hablar|to speak|parler|🗣️|Hablo un poco de español.|I speak a little Spanish.|Je parle un peu espagnol.
trabajar|to work|travailler|💼|Trabajo en una oficina.|I work in an office.|Je travaille dans un bureau.
estudiar|to study|étudier|📚|Estudio por la noche.|I study at night.|J’étudie le soir.
leer|to read|lire|📖|Leo el periódico cada mañana.|I read the paper every morning.|Je lis le journal chaque matin.
escribir|to write|écrire|✍️|Escribo un mensaje a mi madre.|I’m writing a message to my mother.|J’écris un message à ma mère.
dormir|to sleep|dormir|😴|Duermo ocho horas.|I sleep eight hours.|Je dors huit heures.
querer|to want / to love|vouloir / aimer|💖|Quiero un café.|I want a coffee.|Je veux un café.
poder|can / to be able|pouvoir|💪|¿Puedo pasar?|May I come in?|Je peux entrer ?
saber|to know (a fact)|savoir|🧠|No sé la respuesta.|I don’t know the answer.|Je ne sais pas la réponse.
ver|to see / to watch|voir / regarder|👀|Vemos una película.|We’re watching a film.|Nous regardons un film.
abrir|to open|ouvrir|🔓|Abre la ventana, por favor.|Open the window, please.|Ouvre la fenêtre, s’il te plaît.
cerrar|to close|fermer|🔒|La tienda cierra a las nueve.|The shop closes at nine.|Le magasin ferme à neuf heures.
comprar|to buy|acheter|🛒|Compro fruta en el mercado.|I buy fruit at the market.|J’achète des fruits au marché.
`),
  t('routine', '⏰', 'Daily routine', 'La routine', `
despertarse|to wake up|se réveiller|⏰|Me despierto a las siete.|I wake up at seven.|Je me réveille à sept heures.
levantarse|to get up|se lever|🛏️|Me levanto muy temprano.|I get up very early.|Je me lève très tôt.
ducharse|to shower|se doucher|🚿|Me ducho por la mañana.|I shower in the morning.|Je me douche le matin.
vestirse|to get dressed|s’habiller|👔|Me visto rápido.|I get dressed quickly.|Je m’habille vite.
desayunar|to have breakfast|prendre le petit-déjeuner|🥐|Desayuno café y tostadas.|I have coffee and toast for breakfast.|Je prends un café et des tartines.
el desayuno|breakfast|le petit-déjeuner|🍳|El desayuno está listo.|Breakfast is ready.|Le petit-déjeuner est prêt.
la comida|lunch / food|le déjeuner / la nourriture|🍲|La comida es a las dos.|Lunch is at two.|Le déjeuner est à deux heures.
la cena|dinner|le dîner|🍝|La cena es a las nueve.|Dinner is at nine.|Le dîner est à neuf heures.
cocinar|to cook|cuisiner|👩‍🍳|Mi padre cocina muy bien.|My father cooks very well.|Mon père cuisine très bien.
lavarse los dientes|to brush your teeth|se brosser les dents|🪥|Me lavo los dientes después de comer.|I brush my teeth after eating.|Je me brosse les dents après manger.
acostarse|to go to bed|se coucher|🌙|Me acuesto a las once.|I go to bed at eleven.|Je me couche à onze heures.
salir|to go out / to leave|sortir / partir|🚪|Salgo de casa a las ocho.|I leave home at eight.|Je pars de chez moi à huit heures.
volver|to come back|revenir / rentrer|↩️|Vuelvo a casa a las seis.|I come home at six.|Je rentre à six heures.
temprano|early|tôt|🌅|Hoy he llegado temprano.|I arrived early today.|Je suis arrivé tôt aujourd’hui.
tarde|late|tard / en retard|🌆|Siempre llegas tarde.|You’re always late.|Tu arrives toujours en retard.
siempre|always|toujours|♾️|Siempre desayuno en casa.|I always have breakfast at home.|Je prends toujours le petit-déjeuner chez moi.
nunca|never|jamais|🚫|Nunca bebo café por la noche.|I never drink coffee at night.|Je ne bois jamais de café le soir.
a veces|sometimes|parfois|🔀|A veces voy al gimnasio.|Sometimes I go to the gym.|Parfois je vais à la salle de sport.
`),
  t('food', '🥗', 'Food', 'La nourriture', `
la manzana|apple|la pomme|🍎|Como una manzana cada día.|I eat an apple every day.|Je mange une pomme chaque jour.
el plátano|banana|la banane|🍌|El plátano está maduro.|The banana is ripe.|La banane est mûre.
la naranja|orange|l’orange|🍊|Quiero un zumo de naranja.|I want an orange juice.|Je veux un jus d’orange.
las uvas|grapes|le raisin|🍇|Las uvas son dulces.|The grapes are sweet.|Le raisin est sucré.
la fresa|strawberry|la fraise|🍓|Me encantan las fresas.|I love strawberries.|J’adore les fraises.
el tomate|tomato|la tomate|🍅|Una ensalada de tomate.|A tomato salad.|Une salade de tomates.
la patata|potato|la pomme de terre|🥔|La tortilla lleva patatas.|Tortilla has potatoes in it.|La tortilla contient des pommes de terre.
la cebolla|onion|l’oignon|🧅|Corta la cebolla, por favor.|Cut the onion, please.|Coupe l’oignon, s’il te plaît.
la zanahoria|carrot|la carotte|🥕|Los conejos comen zanahorias.|Rabbits eat carrots.|Les lapins mangent des carottes.
el arroz|rice|le riz|🍚|La paella se hace con arroz.|Paella is made with rice.|La paella se fait avec du riz.
la pasta|pasta|les pâtes|🍝|Hoy cenamos pasta.|We’re having pasta for dinner tonight.|Ce soir, on mange des pâtes.
el pollo|chicken|le poulet|🍗|El pollo está en el horno.|The chicken is in the oven.|Le poulet est au four.
el pescado|fish (food)|le poisson|🐟|Los viernes como pescado.|On Fridays I eat fish.|Le vendredi, je mange du poisson.
la carne|meat|la viande|🥩|No como carne.|I don’t eat meat.|Je ne mange pas de viande.
el huevo|egg|l’œuf|🥚|Dos huevos fritos, por favor.|Two fried eggs, please.|Deux œufs au plat, s’il vous plaît.
el queso|cheese|le fromage|🧀|Este queso es de Asturias.|This cheese is from Asturias.|Ce fromage vient des Asturies.
la sopa|soup|la soupe|🥣|La sopa está muy caliente.|The soup is very hot.|La soupe est très chaude.
la ensalada|salad|la salade|🥗|Una ensalada mixta para mí.|A mixed salad for me.|Une salade composée pour moi.
el helado|ice cream|la glace|🍦|Un helado de chocolate, por favor.|A chocolate ice cream, please.|Une glace au chocolat, s’il vous plaît.
el pastel|cake|le gâteau|🎂|El pastel de cumpleaños es enorme.|The birthday cake is huge.|Le gâteau d’anniversaire est énorme.
`),
  t('kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
la cocina|kitchen|la cuisine|🍳|La cocina es pequeña pero bonita.|The kitchen is small but nice.|La cuisine est petite mais jolie.
la nevera|fridge|le frigo|🧊|La leche está en la nevera.|The milk is in the fridge.|Le lait est dans le frigo.
el horno|oven|le four|🔥|El pan está en el horno.|The bread is in the oven.|Le pain est au four.
el plato|plate / dish|l’assiette / le plat|🍽️|Pon los platos en la mesa.|Put the plates on the table.|Mets les assiettes sur la table.
el vaso|glass|le verre|🥛|Un vaso de leche fría.|A glass of cold milk.|Un verre de lait froid.
la taza|cup / mug|la tasse|☕|Mi taza favorita es azul.|My favourite mug is blue.|Ma tasse préférée est bleue.
el cuchillo|knife|le couteau|🔪|Este cuchillo corta muy bien.|This knife cuts very well.|Ce couteau coupe très bien.
el tenedor|fork|la fourchette|🍴|Necesito un tenedor.|I need a fork.|J’ai besoin d’une fourchette.
la cuchara|spoon|la cuillère|🥄|Come la sopa con la cuchara.|Eat the soup with the spoon.|Mange la soupe avec la cuillère.
la botella|bottle|la bouteille|🍾|Una botella de agua, por favor.|A bottle of water, please.|Une bouteille d’eau, s’il vous plaît.
la sal|salt|le sel|🧂|¿Me pasas la sal?|Can you pass me the salt?|Tu me passes le sel ?
el aceite|oil|l’huile|🫒|Aceite de oliva, siempre.|Olive oil, always.|De l’huile d’olive, toujours.
la sartén|frying pan|la poêle|🍳|Calienta la sartén.|Heat the frying pan.|Fais chauffer la poêle.
cortar|to cut|couper|✂️|Corta el pan en trozos.|Cut the bread into pieces.|Coupe le pain en morceaux.
lavar|to wash|laver|🧽|Yo lavo los platos.|I’ll wash the dishes.|Je fais la vaisselle.
caliente|hot|chaud|♨️|El café está caliente.|The coffee is hot.|Le café est chaud.
frío|cold|froid|🧊|El agua está fría.|The water is cold.|L’eau est froide.
rico|tasty|délicieux|😋|¡Qué rico está esto!|This is so tasty!|C’est trop bon !
`),
  t('school', '🏫', 'At school', 'À l’école', `
la escuela|school|l’école|🏫|La escuela está al lado del parque.|The school is next to the park.|L’école est à côté du parc.
la clase|class / classroom|la classe / le cours|🧑‍🏫|La clase empieza a las nueve.|The class starts at nine.|Le cours commence à neuf heures.
el profesor|teacher (m)|le professeur|👨‍🏫|El profesor explica muy bien.|The teacher explains very well.|Le professeur explique très bien.
la profesora|teacher (f)|la professeure|👩‍🏫|La profesora es de Chile.|The teacher is from Chile.|La professeure vient du Chili.
el alumno|pupil / student|l’élève|🧑‍🎓|Hay veinte alumnos en clase.|There are twenty pupils in class.|Il y a vingt élèves en classe.
el libro|book|le livre|📕|Abrid el libro en la página diez.|Open your books at page ten.|Ouvrez le livre à la page dix.
el cuaderno|notebook|le cahier|📓|Escribe en tu cuaderno.|Write in your notebook.|Écris dans ton cahier.
el lápiz|pencil|le crayon|✏️|¿Tienes un lápiz?|Do you have a pencil?|Tu as un crayon ?
el bolígrafo|pen|le stylo|🖊️|Firma aquí con el bolígrafo.|Sign here with the pen.|Signe ici avec le stylo.
la mochila|backpack|le sac à dos|🎒|Mi mochila pesa mucho.|My backpack is very heavy.|Mon sac à dos est très lourd.
el examen|exam|l’examen|📝|Mañana tengo un examen.|I have an exam tomorrow.|Demain j’ai un examen.
la pregunta|question|la question|❓|Tengo una pregunta.|I have a question.|J’ai une question.
la respuesta|answer|la réponse|💡|La respuesta es correcta.|The answer is correct.|La réponse est correcte.
aprender|to learn|apprendre|🌱|Aprendo diez palabras al día.|I learn ten words a day.|J’apprends dix mots par jour.
entender|to understand|comprendre|🤔|No entiendo esta palabra.|I don’t understand this word.|Je ne comprends pas ce mot.
repetir|to repeat|répéter|🔁|¿Puede repetir, por favor?|Can you repeat, please?|Vous pouvez répéter, s’il vous plaît ?
`),
  t('places', '🗺️', 'Places in town', 'Les lieux en ville', `
el banco|bank / bench|la banque / le banc|🏦|El banco abre a las ocho y media.|The bank opens at half past eight.|La banque ouvre à huit heures et demie.
el hospital|hospital|l’hôpital|🏥|El hospital está lejos.|The hospital is far away.|L’hôpital est loin.
la farmacia|pharmacy|la pharmacie|💊|¿Hay una farmacia cerca?|Is there a pharmacy nearby?|Il y a une pharmacie près d’ici ?
el supermercado|supermarket|le supermarché|🛒|Voy al supermercado.|I’m going to the supermarket.|Je vais au supermarché.
la panadería|bakery|la boulangerie|🥖|La panadería huele muy bien.|The bakery smells great.|La boulangerie sent très bon.
la biblioteca|library|la bibliothèque|📚|Estudio en la biblioteca.|I study at the library.|J’étudie à la bibliothèque.
el museo|museum|le musée|🏛️|El museo es gratis los domingos.|The museum is free on Sundays.|Le musée est gratuit le dimanche.
el parque|park|le parc|🌳|Paseamos por el parque.|We walk in the park.|Nous nous promenons dans le parc.
la playa|beach|la plage|🏖️|Vamos a la playa en verano.|We go to the beach in summer.|Nous allons à la plage en été.
la iglesia|church|l’église|⛪|La iglesia es muy antigua.|The church is very old.|L’église est très ancienne.
el cine|cinema|le cinéma|🎬|¿Vamos al cine esta noche?|Shall we go to the cinema tonight?|On va au cinéma ce soir ?
el restaurante|restaurant|le restaurant|🍽️|Conozco un restaurante buenísimo.|I know a great restaurant.|Je connais un super restaurant.
la estación|station|la gare|🚉|La estación está en el centro.|The station is in the centre.|La gare est dans le centre.
el aeropuerto|airport|l’aéroport|🛫|Llegamos al aeropuerto a las seis.|We arrive at the airport at six.|Nous arrivons à l’aéroport à six heures.
la plaza|square|la place|⛲|Nos vemos en la plaza.|See you in the square.|On se voit sur la place.
la calle|street|la rue|🛣️|Vivo en esta calle.|I live on this street.|J’habite dans cette rue.
`),
  t('animals', '🐾', 'Animals', 'Les animaux', `
el perro|dog|le chien|🐕|Mi perro se llama Toby.|My dog is called Toby.|Mon chien s’appelle Toby.
el gato|cat|le chat|🐈|El gato duerme en el sofá.|The cat sleeps on the sofa.|Le chat dort sur le canapé.
el pájaro|bird|l’oiseau|🐦|Un pájaro canta en el árbol.|A bird is singing in the tree.|Un oiseau chante dans l’arbre.
el caballo|horse|le cheval|🐎|El caballo corre muy rápido.|The horse runs very fast.|Le cheval court très vite.
la vaca|cow|la vache|🐄|La vaca da leche.|The cow gives milk.|La vache donne du lait.
el cerdo|pig|le cochon|🐖|El cerdo está en la granja.|The pig is on the farm.|Le cochon est à la ferme.
la oveja|sheep|le mouton|🐑|Hay muchas ovejas en el campo.|There are lots of sheep in the field.|Il y a beaucoup de moutons dans le champ.
el conejo|rabbit|le lapin|🐇|El conejo tiene orejas largas.|The rabbit has long ears.|Le lapin a de longues oreilles.
el ratón|mouse|la souris|🐁|Hay un ratón en la cocina.|There’s a mouse in the kitchen.|Il y a une souris dans la cuisine.
el pez|fish (alive)|le poisson|🐠|El pez nada en el agua.|The fish swims in the water.|Le poisson nage dans l’eau.
el oso|bear|l’ours|🐻|El oso come miel.|The bear eats honey.|L’ours mange du miel.
el león|lion|le lion|🦁|El león es el rey de la selva.|The lion is the king of the jungle.|Le lion est le roi de la jungle.
el elefante|elephant|l’éléphant|🐘|El elefante es enorme.|The elephant is huge.|L’éléphant est énorme.
el mono|monkey|le singe|🐒|El mono come un plátano.|The monkey is eating a banana.|Le singe mange une banane.
la tortuga|turtle|la tortue|🐢|La tortuga es muy lenta.|The turtle is very slow.|La tortue est très lente.
la mariposa|butterfly|le papillon|🦋|Una mariposa en la flor.|A butterfly on the flower.|Un papillon sur la fleur.
`),
  t('sport', '⚽', 'Sport', 'Le sport', `
el fútbol|football|le football|⚽|Juego al fútbol los sábados.|I play football on Saturdays.|Je joue au foot le samedi.
el baloncesto|basketball|le basket|🏀|Mi hermano juega al baloncesto.|My brother plays basketball.|Mon frère joue au basket.
el tenis|tennis|le tennis|🎾|¿Jugamos al tenis mañana?|Shall we play tennis tomorrow?|On joue au tennis demain ?
nadar|to swim|nager|🏊|Nado en la piscina.|I swim in the pool.|Je nage à la piscine.
correr|to run|courir|🏃|Corro cinco kilómetros.|I run five kilometres.|Je cours cinq kilomètres.
la bicicleta|bicycle|le vélo|🚲|Voy en bicicleta al parque.|I ride my bike to the park.|Je vais au parc à vélo.
el equipo|team|l’équipe|👥|Nuestro equipo ha ganado.|Our team has won.|Notre équipe a gagné.
el partido|match / game|le match|🏟️|El partido empieza a las ocho.|The match starts at eight.|Le match commence à huit heures.
ganar|to win|gagner|🏆|Queremos ganar la copa.|We want to win the cup.|Nous voulons gagner la coupe.
perder|to lose|perdre|😞|Hemos perdido el partido.|We lost the match.|Nous avons perdu le match.
el gimnasio|gym|la salle de sport|🏋️|Voy al gimnasio tres veces por semana.|I go to the gym three times a week.|Je vais à la salle trois fois par semaine.
la piscina|swimming pool|la piscine|🏊‍♀️|La piscina está abierta en verano.|The pool is open in summer.|La piscine est ouverte en été.
el balón|ball|le ballon|🏐|Pásame el balón.|Pass me the ball.|Passe-moi le ballon.
esquiar|to ski|skier|⛷️|Esquiamos en los Pirineos.|We ski in the Pyrenees.|Nous skions dans les Pyrénées.
`),
  t('adjectives', '✨', 'Describing things', 'Décrire les choses', `
grande|big|grand|🐘|Es una casa muy grande.|It’s a very big house.|C’est une très grande maison.
pequeño|small|petit|🐭|Tengo un coche pequeño.|I have a small car.|J’ai une petite voiture.
nuevo|new|neuf / nouveau|🆕|Mi teléfono es nuevo.|My phone is new.|Mon téléphone est neuf.
viejo|old|vieux|🏚️|Este edificio es muy viejo.|This building is very old.|Ce bâtiment est très vieux.
bonito|pretty / nice|joli|🌸|¡Qué vestido tan bonito!|What a pretty dress!|Quelle jolie robe !
feo|ugly|laid / moche|👹|Este cuadro es un poco feo.|This painting is a bit ugly.|Ce tableau est un peu moche.
alto|tall / high|grand / haut|🦒|Mi hermano es muy alto.|My brother is very tall.|Mon frère est très grand.
bajo|short / low|petit / bas|📏|La mesa es demasiado baja.|The table is too low.|La table est trop basse.
rápido|fast|rapide|🚀|El tren es muy rápido.|The train is very fast.|Le train est très rapide.
lento|slow|lent|🐌|Internet está lento hoy.|The internet is slow today.|Internet est lent aujourd’hui.
fácil|easy|facile|👌|El ejercicio es fácil.|The exercise is easy.|L’exercice est facile.
difícil|difficult|difficile|🧗|El examen fue difícil.|The exam was difficult.|L’examen était difficile.
barato|cheap|bon marché|🏷️|Este hotel es barato.|This hotel is cheap.|Cet hôtel n’est pas cher.
caro|expensive|cher|💎|El reloj es muy caro.|The watch is very expensive.|La montre est très chère.
lleno|full|plein|🈵|El autobús está lleno.|The bus is full.|Le bus est plein.
vacío|empty|vide|🫙|El vaso está vacío.|The glass is empty.|Le verre est vide.
limpio|clean|propre|🧼|La habitación está limpia.|The room is clean.|La chambre est propre.
sucio|dirty|sale|🦠|Tus zapatos están sucios.|Your shoes are dirty.|Tes chaussures sont sales.
`),
  t('questions', '❓', 'Asking questions', 'Poser des questions', `
¿qué?|what?|quoi ? / que ?|❓|¿Qué es esto?|What is this?|Qu’est-ce que c’est ?
¿quién?|who?|qui ?|🕵️|¿Quién es tu profesor?|Who is your teacher?|Qui est ton professeur ?
¿dónde?|where?|où ?|📍|¿Dónde está el baño?|Where is the bathroom?|Où sont les toilettes ?
¿cuándo?|when?|quand ?|📆|¿Cuándo es tu cumpleaños?|When is your birthday?|C’est quand ton anniversaire ?
¿cómo?|how?|comment ?|🤷|¿Cómo te llamas?|What’s your name?|Comment tu t’appelles ?
¿por qué?|why?|pourquoi ?|🤔|¿Por qué estás triste?|Why are you sad?|Pourquoi tu es triste ?
¿cuánto?|how much?|combien ?|💰|¿Cuánto cuesta este libro?|How much is this book?|Combien coûte ce livre ?
¿cuántos?|how many?|combien de ?|🔢|¿Cuántos años tienes?|How old are you?|Quel âge as-tu ?
¿cuál?|which?|quel ? / lequel ?|☝️|¿Cuál es tu color favorito?|What’s your favourite colour?|Quelle est ta couleur préférée ?
¿adónde?|where to?|où (direction) ?|🧭|¿Adónde vas?|Where are you going?|Où vas-tu ?
¿de dónde?|where from?|d’où ?|🌍|¿De dónde eres?|Where are you from?|D’où viens-tu ?
porque|because|parce que|💡|Estudio español porque me gusta.|I study Spanish because I like it.|J’étudie l’espagnol parce que ça me plaît.
`),
  // More words for the first topics.
  t('people', '🙋', 'Meeting people', 'Faire connaissance', `
hola|hello|bonjour / salut|👋|¡Hola! ¿Qué tal?|Hi! How’s it going?|Salut ! Ça va ?
adiós|goodbye|au revoir|🫡|Adiós, hasta mañana.|Bye, see you tomorrow.|Au revoir, à demain.
hasta luego|see you later|à plus tard|🙋|Hasta luego, Marta.|See you later, Marta.|À plus tard, Marta.
gracias|thank you|merci|🙏|Muchas gracias por todo.|Thanks so much for everything.|Merci beaucoup pour tout.
de nada|you’re welcome|de rien|😊|—Gracias. —De nada.|“Thanks.” “You’re welcome.”|« Merci. » « De rien. »
por favor|please|s’il vous plaît|🥺|Un momento, por favor.|One moment, please.|Un instant, s’il vous plaît.
perdón|sorry / excuse me|pardon|😅|Perdón, no te he visto.|Sorry, I didn’t see you.|Pardon, je ne t’ai pas vu.
el vecino|neighbour|le voisin|🏘️|Mi vecino es muy simpático.|My neighbour is very nice.|Mon voisin est très sympa.
simpático|nice / friendly|sympathique|😄|Tu hermana es muy simpática.|Your sister is very friendly.|Ta sœur est très sympa.
`),
  t('family', '👪', 'Family', 'La famille', `
el abuelo|grandfather|le grand-père|👴|Mi abuelo tiene ochenta años.|My grandfather is eighty.|Mon grand-père a quatre-vingts ans.
la abuela|grandmother|la grand-mère|👵|La abuela hace la mejor tortilla.|Grandma makes the best tortilla.|Grand-mère fait la meilleure tortilla.
el tío|uncle|l’oncle|🧔|Mi tío vive en México.|My uncle lives in Mexico.|Mon oncle habite au Mexique.
la tía|aunt|la tante|👩‍🦱|Mi tía es enfermera.|My aunt is a nurse.|Ma tante est infirmière.
el primo|cousin (m)|le cousin|🧑|Mi primo juega al fútbol.|My cousin plays football.|Mon cousin joue au foot.
el bebé|baby|le bébé|👶|El bebé duerme.|The baby is sleeping.|Le bébé dort.
el marido|husband|le mari|🤵|Su marido es médico.|Her husband is a doctor.|Son mari est médecin.
la esposa|wife|l’épouse|👰|Mi esposa es de Sevilla.|My wife is from Seville.|Ma femme est de Séville.
los padres|parents|les parents|👨‍👩‍👧|Mis padres viven en el campo.|My parents live in the country.|Mes parents habitent à la campagne.
`),
  t('home', '🏠', 'At home', 'À la maison', `
el salón|living room|le salon|🛋️|Vemos la tele en el salón.|We watch TV in the living room.|Nous regardons la télé au salon.
el dormitorio|bedroom|la chambre|🛏️|Mi dormitorio es pequeño.|My bedroom is small.|Ma chambre est petite.
el baño|bathroom|la salle de bain|🛁|El baño está al fondo.|The bathroom is at the end.|La salle de bain est au fond.
la puerta|door|la porte|🚪|Cierra la puerta, por favor.|Close the door, please.|Ferme la porte, s’il te plaît.
la ventana|window|la fenêtre|🪟|Abre la ventana, hace calor.|Open the window, it’s hot.|Ouvre la fenêtre, il fait chaud.
la llave|key|la clé|🔑|¿Dónde están las llaves?|Where are the keys?|Où sont les clés ?
la lámpara|lamp|la lampe|💡|Enciende la lámpara.|Turn on the lamp.|Allume la lampe.
el espejo|mirror|le miroir|🪞|Hay un espejo en el baño.|There’s a mirror in the bathroom.|Il y a un miroir dans la salle de bain.
el jardín|garden|le jardin|🌷|Tenemos un jardín pequeño.|We have a small garden.|Nous avons un petit jardin.
`),
  t('clothes', '👕', 'Clothes', 'Les vêtements', `
el abrigo|coat|le manteau|🧥|Ponte el abrigo, hace frío.|Put your coat on, it’s cold.|Mets ton manteau, il fait froid.
el vestido|dress|la robe|👗|Llevo un vestido rojo.|I’m wearing a red dress.|Je porte une robe rouge.
la falda|skirt|la jupe|🩳|Esta falda es muy cómoda.|This skirt is very comfortable.|Cette jupe est très confortable.
los zapatos|shoes|les chaussures|👞|Necesito zapatos nuevos.|I need new shoes.|J’ai besoin de nouvelles chaussures.
el sombrero|hat|le chapeau|👒|Un sombrero para el sol.|A hat for the sun.|Un chapeau pour le soleil.
la bufanda|scarf|l’écharpe|🧣|Mi abuela me hizo esta bufanda.|My grandma made me this scarf.|Ma grand-mère m’a fait cette écharpe.
los guantes|gloves|les gants|🧤|Hace frío: lleva guantes.|It’s cold: wear gloves.|Il fait froid : mets des gants.
las gafas|glasses|les lunettes|👓|No encuentro mis gafas.|I can’t find my glasses.|Je ne trouve pas mes lunettes.
el bolso|handbag|le sac à main|👜|Mi bolso es negro.|My handbag is black.|Mon sac à main est noir.
`),
];
