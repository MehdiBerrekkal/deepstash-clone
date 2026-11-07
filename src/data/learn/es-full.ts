import { words, type FullCourse, type Topic } from '@/data/learn/full';

/** Spanish, A1 → B1. Original vocabulary, examples, grammar notes, dialogues and stories written for this app. */

const t = (id: string, level: Topic['level'], icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level, icon, en, fr, words: words(block) });

const topics: Topic[] = [
  // ---------- A1 ----------
  t('people', 'A1', '🙋', 'Meeting people', 'Faire connaissance', `
el nombre|name|le prénom|🏷️|¿Cuál es tu nombre?|What is your name?|Quel est ton prénom ?
el amigo|friend (m)|l’ami|🤝|Juan es mi amigo.|Juan is my friend.|Juan est mon ami.
la amiga|friend (f)|l’amie|🤝|Lucía es mi amiga.|Lucía is my friend.|Lucía est mon amie.
el señor|Mr / gentleman|monsieur|🎩|El señor García es médico.|Mr García is a doctor.|M. García est médecin.
la señora|Mrs / lady|madame|👒|La señora vive aquí.|The lady lives here.|La dame habite ici.
el hombre|man|l’homme|👨|Ese hombre es alto.|That man is tall.|Cet homme est grand.
la mujer|woman|la femme|👩|La mujer lee un libro.|The woman reads a book.|La femme lit un livre.
el niño|boy / child|le garçon / l’enfant|👦|El niño juega en el parque.|The boy plays in the park.|Le garçon joue au parc.
la niña|girl|la fille|👧|La niña tiene seis años.|The girl is six.|La fille a six ans.
mucho gusto|nice to meet you|enchanté|😊|Hola, soy Ana. Mucho gusto.|Hi, I’m Ana. Nice to meet you.|Salut, je suis Ana. Enchantée.
¿cómo estás?|how are you?|comment ça va ?|💬|Hola, Pedro, ¿cómo estás?|Hi Pedro, how are you?|Salut Pedro, comment ça va ?
bien|well / fine|bien|👍|Estoy bien, gracias.|I’m fine, thanks.|Je vais bien, merci.
`),
  t('cafe', 'A1', '☕', 'At the café', 'Au café', `
el café|coffee|le café|☕|Un café solo, por favor.|An espresso, please.|Un café noir, s’il vous plaît.
el té|tea|le thé|🍵|Prefiero el té verde.|I prefer green tea.|Je préfère le thé vert.
el agua|water|l’eau|💧|Un vaso de agua, por favor.|A glass of water, please.|Un verre d’eau, s’il vous plaît.
el zumo|juice|le jus|🧃|El zumo de naranja está frío.|The orange juice is cold.|Le jus d’orange est froid.
la leche|milk|le lait|🥛|Café con leche, por favor.|Coffee with milk, please.|Un café au lait, s’il vous plaît.
el azúcar|sugar|le sucre|🍬|¿Con azúcar o sin azúcar?|With or without sugar?|Avec ou sans sucre ?
el pan|bread|le pain|🍞|El pan está muy rico.|The bread is delicious.|Le pain est délicieux.
la tostada|toast|la tartine grillée|🍞|Quiero una tostada con tomate.|I want toast with tomato.|Je veux une tartine à la tomate.
el camarero|waiter|le serveur|🧑‍🍳|El camarero es muy simpático.|The waiter is very friendly.|Le serveur est très sympa.
la cuenta|the bill|l’addition|🧾|La cuenta, por favor.|The bill, please.|L’addition, s’il vous plaît.
la mesa|table|la table|🪑|Una mesa para dos, por favor.|A table for two, please.|Une table pour deux, s’il vous plaît.
quiero|I want|je veux|🙋|Quiero un café grande.|I want a large coffee.|Je veux un grand café.
`),
  t('family', 'A1', '👪', 'Family', 'La famille', `
la madre|mother|la mère|👩|Mi madre se llama Carmen.|My mother is called Carmen.|Ma mère s’appelle Carmen.
el padre|father|le père|👨|Mi padre trabaja en un banco.|My father works in a bank.|Mon père travaille dans une banque.
los padres|parents|les parents|👪|Mis padres viven en Sevilla.|My parents live in Seville.|Mes parents habitent à Séville.
el hermano|brother|le frère|👦|Tengo un hermano mayor.|I have an older brother.|J’ai un grand frère.
la hermana|sister|la sœur|👧|Mi hermana estudia medicina.|My sister studies medicine.|Ma sœur étudie la médecine.
el hijo|son|le fils|👶|Su hijo tiene diez años.|Her son is ten.|Son fils a dix ans.
la hija|daughter|la fille|👧|Tienen una hija pequeña.|They have a little daughter.|Ils ont une petite fille.
el abuelo|grandfather|le grand-père|👴|Mi abuelo cuenta historias.|My grandfather tells stories.|Mon grand-père raconte des histoires.
la abuela|grandmother|la grand-mère|👵|La abuela cocina muy bien.|Grandma cooks very well.|Grand-mère cuisine très bien.
el tío|uncle|l’oncle|🧔|Mi tío vive en México.|My uncle lives in Mexico.|Mon oncle habite au Mexique.
la tía|aunt|la tante|👩‍🦰|Mi tía es profesora.|My aunt is a teacher.|Ma tante est professeure.
el primo|cousin|le cousin|🧑|Mi primo juega al fútbol.|My cousin plays football.|Mon cousin joue au foot.
`),
  t('numbers', 'A1', '🔢', 'Numbers and age', 'Nombres et âge', `
uno|one|un|1️⃣|Tengo un perro.|I have one dog.|J’ai un chien.
dos|two|deux|2️⃣|Dos cafés, por favor.|Two coffees, please.|Deux cafés, s’il vous plaît.
tres|three|trois|3️⃣|Son las tres.|It’s three o’clock.|Il est trois heures.
cinco|five|cinq|5️⃣|Tengo cinco euros.|I have five euros.|J’ai cinq euros.
diez|ten|dix|🔟|Diez minutos, por favor.|Ten minutes, please.|Dix minutes, s’il vous plaît.
veinte|twenty|vingt|2️⃣|Tengo veinte años.|I’m twenty.|J’ai vingt ans.
treinta|thirty|trente|3️⃣|El libro cuesta treinta euros.|The book costs thirty euros.|Le livre coûte trente euros.
cien|one hundred|cent|💯|Hay cien personas.|There are a hundred people.|Il y a cent personnes.
mil|thousand|mille|🔢|Mil gracias.|A thousand thanks.|Mille mercis.
la edad|age|l’âge|🎂|¿Cuál es tu edad?|What is your age?|Quel est ton âge ?
el año|year|l’an / l’année|📅|Tiene treinta años.|He’s thirty years old.|Il a trente ans.
¿cuántos?|how many?|combien ?|❓|¿Cuántos años tienes?|How old are you?|Quel âge as-tu ?
`),
  t('colors', 'A1', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
rojo|red|rouge|🔴|Tengo un coche rojo.|I have a red car.|J’ai une voiture rouge.
azul|blue|bleu|🔵|El cielo está azul.|The sky is blue.|Le ciel est bleu.
verde|green|vert|🟢|Me gusta el té verde.|I like green tea.|J’aime le thé vert.
amarillo|yellow|jaune|🟡|El sol es amarillo.|The sun is yellow.|Le soleil est jaune.
negro|black|noir|⚫|Llevo zapatos negros.|I’m wearing black shoes.|Je porte des chaussures noires.
blanco|white|blanc|⚪|La casa es blanca.|The house is white.|La maison est blanche.
grande|big|grand|🐘|Es una ciudad grande.|It’s a big city.|C’est une grande ville.
pequeño|small|petit|🐭|Tengo un piso pequeño.|I have a small flat.|J’ai un petit appartement.
nuevo|new|nouveau|✨|Mi móvil es nuevo.|My phone is new.|Mon portable est neuf.
viejo|old|vieux|🏚️|Es un edificio viejo.|It’s an old building.|C’est un vieil immeuble.
bonito|pretty|joli|🌸|¡Qué vestido tan bonito!|What a pretty dress!|Quelle jolie robe !
alto|tall|grand (taille)|📏|Mi hermano es muy alto.|My brother is very tall.|Mon frère est très grand.
`),
  t('time', 'A1', '🕒', 'Days and time', 'Jours et heure', `
el lunes|Monday|lundi|📅|El lunes trabajo.|On Monday I work.|Lundi, je travaille.
el martes|Tuesday|mardi|📅|Tengo clase el martes.|I have class on Tuesday.|J’ai cours mardi.
el miércoles|Wednesday|mercredi|📅|El miércoles voy al gimnasio.|On Wednesday I go to the gym.|Mercredi, je vais à la salle.
el viernes|Friday|vendredi|🎉|El viernes salimos.|On Friday we go out.|Vendredi, on sort.
el fin de semana|weekend|le week-end|🏖️|¿Qué haces el fin de semana?|What do you do at the weekend?|Que fais-tu le week-end ?
hoy|today|aujourd’hui|📆|Hoy hace calor.|It’s hot today.|Il fait chaud aujourd’hui.
mañana|tomorrow|demain|🌅|Mañana tengo un examen.|Tomorrow I have an exam.|Demain, j’ai un examen.
ayer|yesterday|hier|⏪|Ayer fui al cine.|Yesterday I went to the cinema.|Hier, je suis allé au cinéma.
la hora|hour / time|l’heure|⏰|¿Qué hora es?|What time is it?|Quelle heure est-il ?
la mañana|morning|le matin|🌄|Corro por la mañana.|I run in the morning.|Je cours le matin.
la noche|night|la nuit|🌙|Buenas noches, hasta mañana.|Good night, see you tomorrow.|Bonne nuit, à demain.
temprano|early|tôt|🐓|Me levanto temprano.|I get up early.|Je me lève tôt.
`),
  t('home', 'A1', '🏠', 'At home', 'À la maison', `
la casa|house|la maison|🏠|Mi casa está cerca.|My house is nearby.|Ma maison est proche.
el piso|flat / floor|l’appartement / l’étage|🏢|Vivo en un piso en el centro.|I live in a flat in the centre.|J’habite un appartement au centre.
la cocina|kitchen|la cuisine|🍳|La cocina es muy luminosa.|The kitchen is very bright.|La cuisine est très lumineuse.
el baño|bathroom|la salle de bain|🛁|El baño está al fondo.|The bathroom is at the back.|La salle de bain est au fond.
el dormitorio|bedroom|la chambre|🛏️|Tengo dos dormitorios.|I have two bedrooms.|J’ai deux chambres.
el salón|living room|le salon|🛋️|Vemos la tele en el salón.|We watch TV in the living room.|On regarde la télé au salon.
la puerta|door|la porte|🚪|Cierra la puerta, por favor.|Close the door, please.|Ferme la porte, s’il te plaît.
la ventana|window|la fenêtre|🪟|Abro la ventana.|I open the window.|J’ouvre la fenêtre.
la cama|bed|le lit|🛏️|La cama es muy cómoda.|The bed is very comfortable.|Le lit est très confortable.
la silla|chair|la chaise|🪑|Hay cuatro sillas.|There are four chairs.|Il y a quatre chaises.
la llave|key|la clé|🔑|¿Dónde están mis llaves?|Where are my keys?|Où sont mes clés ?
vivir|to live|habiter / vivre|🏡|Vivo en Madrid.|I live in Madrid.|J’habite à Madrid.
`),
  t('body', 'A1', '🧍', 'The body', 'Le corps', `
la cabeza|head|la tête|🧠|Me duele la cabeza.|I have a headache.|J’ai mal à la tête.
el ojo|eye|l’œil|👁️|Tiene los ojos azules.|She has blue eyes.|Elle a les yeux bleus.
la boca|mouth|la bouche|👄|Abre la boca, por favor.|Open your mouth, please.|Ouvrez la bouche, s’il vous plaît.
la nariz|nose|le nez|👃|Tengo la nariz roja.|My nose is red.|J’ai le nez rouge.
la mano|hand|la main|✋|Lávate las manos.|Wash your hands.|Lave-toi les mains.
el brazo|arm|le bras|💪|Me duele el brazo.|My arm hurts.|J’ai mal au bras.
la pierna|leg|la jambe|🦵|Tiene las piernas largas.|He has long legs.|Il a de longues jambes.
el pie|foot|le pied|🦶|Voy a pie.|I’m going on foot.|J’y vais à pied.
el pelo|hair|les cheveux|💇|Tiene el pelo corto.|She has short hair.|Elle a les cheveux courts.
la espalda|back|le dos|🧍|Me duele la espalda.|My back hurts.|J’ai mal au dos.
el estómago|stomach|l’estomac|🫃|Tengo dolor de estómago.|I have a stomach ache.|J’ai mal à l’estomac.
el corazón|heart|le cœur|❤️|El corazón late rápido.|The heart beats fast.|Le cœur bat vite.
`),
  t('clothes', 'A1', '👕', 'Clothes', 'Les vêtements', `
la camisa|shirt|la chemise|👔|Llevo una camisa blanca.|I’m wearing a white shirt.|Je porte une chemise blanche.
la camiseta|T-shirt|le t-shirt|👕|Esta camiseta es barata.|This T-shirt is cheap.|Ce t-shirt est bon marché.
los pantalones|trousers|le pantalon|👖|Necesito unos pantalones nuevos.|I need new trousers.|J’ai besoin d’un nouveau pantalon.
el vestido|dress|la robe|👗|El vestido es precioso.|The dress is lovely.|La robe est magnifique.
los zapatos|shoes|les chaussures|👞|Estos zapatos son cómodos.|These shoes are comfortable.|Ces chaussures sont confortables.
el abrigo|coat|le manteau|🧥|Hace frío, lleva el abrigo.|It’s cold, take your coat.|Il fait froid, prends ton manteau.
la falda|skirt|la jupe|👗|Una falda azul.|A blue skirt.|Une jupe bleue.
el sombrero|hat|le chapeau|👒|El sombrero es para el sol.|The hat is for the sun.|Le chapeau, c’est pour le soleil.
la talla|size|la taille|📏|¿Qué talla usa?|What size do you wear?|Quelle taille faites-vous ?
llevar|to wear / carry|porter|🎒|Hoy llevo vaqueros.|Today I’m wearing jeans.|Aujourd’hui je porte un jean.
probarse|to try on|essayer|🪞|¿Puedo probarme esto?|Can I try this on?|Je peux essayer ça ?
barato|cheap|bon marché|💸|Es muy barato.|It’s very cheap.|C’est très bon marché.
`),
  t('weather', 'A1', '🌦️', 'Weather', 'La météo', `
el tiempo|weather / time|le temps|🌤️|¿Qué tiempo hace?|What’s the weather like?|Quel temps fait-il ?
el sol|sun|le soleil|☀️|Hace sol hoy.|It’s sunny today.|Il fait soleil aujourd’hui.
la lluvia|rain|la pluie|🌧️|Me gusta la lluvia.|I like the rain.|J’aime la pluie.
llover|to rain|pleuvoir|☔|Va a llover.|It’s going to rain.|Il va pleuvoir.
la nieve|snow|la neige|❄️|Hay nieve en la montaña.|There’s snow on the mountain.|Il y a de la neige à la montagne.
el viento|wind|le vent|🌬️|Hace mucho viento.|It’s very windy.|Il y a beaucoup de vent.
el calor|heat|la chaleur|🥵|Hace mucho calor en agosto.|It’s very hot in August.|Il fait très chaud en août.
el frío|cold|le froid|🥶|Tengo frío.|I’m cold.|J’ai froid.
la nube|cloud|le nuage|☁️|Hay muchas nubes.|There are lots of clouds.|Il y a beaucoup de nuages.
el verano|summer|l’été|🏖️|En verano vamos a la playa.|In summer we go to the beach.|L’été, on va à la plage.
el invierno|winter|l’hiver|⛄|El invierno es largo.|Winter is long.|L’hiver est long.
la primavera|spring|le printemps|🌷|En primavera hay flores.|In spring there are flowers.|Au printemps, il y a des fleurs.
`),
  t('market', 'A1', '🧺', 'At the market', 'Au marché', `
la manzana|apple|la pomme|🍎|Un kilo de manzanas.|A kilo of apples.|Un kilo de pommes.
el plátano|banana|la banane|🍌|Los plátanos están maduros.|The bananas are ripe.|Les bananes sont mûres.
la naranja|orange|l’orange|🍊|Zumo de naranja natural.|Fresh orange juice.|Du jus d’orange pressé.
el tomate|tomato|la tomate|🍅|Los tomates son de aquí.|The tomatoes are local.|Les tomates sont d’ici.
la patata|potato|la pomme de terre|🥔|Tortilla de patatas.|Potato omelette.|Omelette aux pommes de terre.
la cebolla|onion|l’oignon|🧅|Sin cebolla, por favor.|No onion, please.|Sans oignon, s’il vous plaît.
el queso|cheese|le fromage|🧀|Este queso es muy fuerte.|This cheese is very strong.|Ce fromage est très fort.
el pescado|fish (food)|le poisson|🐟|El pescado es fresco.|The fish is fresh.|Le poisson est frais.
la carne|meat|la viande|🥩|No como carne.|I don’t eat meat.|Je ne mange pas de viande.
el kilo|kilo|le kilo|⚖️|Medio kilo, por favor.|Half a kilo, please.|Un demi-kilo, s’il vous plaît.
¿cuánto cuesta?|how much is it?|combien ça coûte ?|💶|¿Cuánto cuesta el queso?|How much is the cheese?|Combien coûte le fromage ?
comprar|to buy|acheter|🛒|Compro fruta en el mercado.|I buy fruit at the market.|J’achète des fruits au marché.
`),
  t('city', 'A1', '🏙️', 'In the city', 'En ville', `
la calle|street|la rue|🛣️|Vivo en esta calle.|I live on this street.|J’habite dans cette rue.
la plaza|square|la place|⛲|Nos vemos en la plaza.|See you in the square.|On se voit sur la place.
el banco|bank / bench|la banque / le banc|🏦|El banco cierra a las dos.|The bank closes at two.|La banque ferme à deux heures.
la farmacia|pharmacy|la pharmacie|💊|La farmacia está abierta.|The pharmacy is open.|La pharmacie est ouverte.
el supermercado|supermarket|le supermarché|🛒|Voy al supermercado.|I’m going to the supermarket.|Je vais au supermarché.
el museo|museum|le musée|🏛️|El museo es gratis los domingos.|The museum is free on Sundays.|Le musée est gratuit le dimanche.
la estación|station|la gare|🚉|La estación está lejos.|The station is far.|La gare est loin.
el parque|park|le parc|🌳|Paseamos por el parque.|We walk in the park.|On se promène dans le parc.
cerca|near|près|📍|El hotel está cerca.|The hotel is near.|L’hôtel est près.
lejos|far|loin|🗺️|¿Está lejos el museo?|Is the museum far?|Le musée est loin ?
a la derecha|on the right|à droite|➡️|El baño está a la derecha.|The toilet is on the right.|Les toilettes sont à droite.
a la izquierda|on the left|à gauche|⬅️|Gira a la izquierda.|Turn left.|Tourne à gauche.
`),
  // ---------- A2 ----------
  t('travel', 'A2', '✈️', 'Travel', 'Voyager', `
el viaje|trip|le voyage|🧳|¡Buen viaje!|Have a good trip!|Bon voyage !
el avión|plane|l’avion|✈️|El avión sale a las ocho.|The plane leaves at eight.|L’avion part à huit heures.
el aeropuerto|airport|l’aéroport|🛫|Vamos al aeropuerto en taxi.|We go to the airport by taxi.|On va à l’aéroport en taxi.
el billete|ticket|le billet|🎫|Un billete de ida y vuelta.|A return ticket.|Un billet aller-retour.
la maleta|suitcase|la valise|🧳|Mi maleta es muy pesada.|My suitcase is very heavy.|Ma valise est très lourde.
el pasaporte|passport|le passeport|🛂|No olvides el pasaporte.|Don’t forget your passport.|N’oublie pas ton passeport.
el vuelo|flight|le vol|🛬|El vuelo llega con retraso.|The flight is arriving late.|Le vol arrive en retard.
la playa|beach|la plage|🏖️|Pasamos el día en la playa.|We spent the day at the beach.|On a passé la journée à la plage.
la montaña|mountain|la montagne|⛰️|Me encanta la montaña.|I love the mountains.|J’adore la montagne.
el extranjero|abroad / foreigner|l’étranger|🌍|Trabaja en el extranjero.|She works abroad.|Elle travaille à l’étranger.
viajar|to travel|voyager|🗺️|Viajo mucho por trabajo.|I travel a lot for work.|Je voyage beaucoup pour le travail.
las vacaciones|holidays|les vacances|🌴|¿Dónde vas de vacaciones?|Where are you going on holiday?|Où pars-tu en vacances ?
`),
  t('hotel', 'A2', '🏨', 'At the hotel', 'À l’hôtel', `
la habitación|room|la chambre|🛏️|Una habitación doble.|A double room.|Une chambre double.
la reserva|reservation|la réservation|📒|Tengo una reserva.|I have a reservation.|J’ai une réservation.
la recepción|reception|la réception|🛎️|Pregunta en recepción.|Ask at reception.|Demande à la réception.
el desayuno|breakfast|le petit-déjeuner|🥐|El desayuno está incluido.|Breakfast is included.|Le petit-déjeuner est inclus.
la noche|night (stay)|la nuit|🌙|Tres noches, por favor.|Three nights, please.|Trois nuits, s’il vous plaît.
la ducha|shower|la douche|🚿|La ducha no funciona.|The shower doesn’t work.|La douche ne marche pas.
la toalla|towel|la serviette|🧺|¿Me trae otra toalla?|Could you bring me another towel?|Pouvez-vous m’apporter une autre serviette ?
el ascensor|lift|l’ascenseur|🛗|El ascensor está a la izquierda.|The lift is on the left.|L’ascenseur est à gauche.
la planta|floor (level)|l’étage|🏢|Su habitación está en la tercera planta.|Your room is on the third floor.|Votre chambre est au troisième étage.
la tarjeta|card|la carte|💳|¿Puedo pagar con tarjeta?|Can I pay by card?|Je peux payer par carte ?
libre|free / available|libre|✅|¿Tienen habitaciones libres?|Do you have rooms available?|Vous avez des chambres libres ?
quedarse|to stay|rester|🏨|Nos quedamos una semana.|We’re staying a week.|On reste une semaine.
`),
  t('health', 'A2', '🩺', 'Health', 'La santé', `
el médico|doctor|le médecin|🧑‍⚕️|Tengo cita con el médico.|I have a doctor’s appointment.|J’ai rendez-vous chez le médecin.
el hospital|hospital|l’hôpital|🏥|Lo llevaron al hospital.|They took him to hospital.|On l’a emmené à l’hôpital.
la fiebre|fever|la fièvre|🤒|Tengo fiebre desde ayer.|I’ve had a fever since yesterday.|J’ai de la fièvre depuis hier.
el dolor|pain|la douleur|🤕|Tengo un dolor fuerte aquí.|I have a sharp pain here.|J’ai une forte douleur ici.
la tos|cough|la toux|😷|Esta tos no se va.|This cough won’t go away.|Cette toux ne passe pas.
la receta|prescription / recipe|l’ordonnance / la recette|📝|Necesita una receta.|You need a prescription.|Il vous faut une ordonnance.
la pastilla|pill|le comprimé|💊|Tome una pastilla cada ocho horas.|Take a pill every eight hours.|Prenez un comprimé toutes les huit heures.
enfermo|ill|malade|🤧|Hoy estoy enfermo.|I’m ill today.|Je suis malade aujourd’hui.
sano|healthy|en bonne santé|🥗|Comer sano es importante.|Eating healthily is important.|Bien manger est important.
cansado|tired|fatigué|😴|Estoy muy cansado.|I’m very tired.|Je suis très fatigué.
descansar|to rest|se reposer|🛌|Necesitas descansar.|You need to rest.|Tu as besoin de te reposer.
la urgencia|emergency|l’urgence|🚑|Es una urgencia.|It’s an emergency.|C’est une urgence.
`),
  t('work', 'A2', '💼', 'Work', 'Le travail', `
el trabajo|job / work|le travail|💼|Busco trabajo.|I’m looking for work.|Je cherche du travail.
la oficina|office|le bureau|🏢|Llego a la oficina a las nueve.|I get to the office at nine.|J’arrive au bureau à neuf heures.
el jefe|boss|le chef / le patron|🧑‍💼|Mi jefe es muy exigente.|My boss is very demanding.|Mon chef est très exigeant.
el compañero|colleague|le collègue|🤝|Mis compañeros son simpáticos.|My colleagues are nice.|Mes collègues sont sympas.
la reunión|meeting|la réunion|📅|Tengo una reunión a las diez.|I have a meeting at ten.|J’ai une réunion à dix heures.
el sueldo|salary|le salaire|💶|El sueldo no es malo.|The salary isn’t bad.|Le salaire n’est pas mal.
la empresa|company|l’entreprise|🏭|Trabajo en una empresa pequeña.|I work for a small company.|Je travaille dans une petite entreprise.
el correo|email / post|le courriel / le courrier|📧|Te mando un correo.|I’ll send you an email.|Je t’envoie un mail.
trabajar|to work|travailler|🛠️|Trabajo desde casa los viernes.|I work from home on Fridays.|Je télétravaille le vendredi.
ganar|to earn / win|gagner|🏆|Gana mucho dinero.|He earns a lot of money.|Il gagne beaucoup d’argent.
la entrevista|interview|l’entretien|🎤|Mañana tengo una entrevista.|I have an interview tomorrow.|Demain, j’ai un entretien.
el horario|schedule / hours|l’horaire|⏱️|Tengo un horario flexible.|I have flexible hours.|J’ai des horaires flexibles.
`),
  t('hobbies', 'A2', '🎸', 'Free time', 'Les loisirs', `
el deporte|sport|le sport|⚽|Hago deporte tres veces por semana.|I do sport three times a week.|Je fais du sport trois fois par semaine.
el fútbol|football|le football|⚽|Vemos el fútbol los domingos.|We watch football on Sundays.|On regarde le foot le dimanche.
nadar|to swim|nager|🏊|Nado en el mar.|I swim in the sea.|Je nage dans la mer.
correr|to run|courir|🏃|Corro cinco kilómetros.|I run five kilometres.|Je cours cinq kilomètres.
leer|to read|lire|📖|Me gusta leer novelas.|I like reading novels.|J’aime lire des romans.
la música|music|la musique|🎵|Escucho música en el tren.|I listen to music on the train.|J’écoute de la musique dans le train.
la película|film|le film|🎬|Vimos una película muy buena.|We saw a very good film.|On a vu un très bon film.
el cine|cinema|le cinéma|🍿|¿Vamos al cine esta noche?|Shall we go to the cinema tonight?|On va au cinéma ce soir ?
bailar|to dance|danser|💃|Bailamos toda la noche.|We danced all night.|On a dansé toute la nuit.
cocinar|to cook|cuisiner|🍳|Cocino los fines de semana.|I cook at weekends.|Je cuisine le week-end.
el juego|game|le jeu|🎲|Es un juego muy divertido.|It’s a very fun game.|C’est un jeu très amusant.
el tiempo libre|free time|le temps libre|🕰️|¿Qué haces en tu tiempo libre?|What do you do in your free time?|Que fais-tu pendant ton temps libre ?
`),
  t('shopping', 'A2', '🛍️', 'Shopping', 'Les achats', `
la tienda|shop|le magasin|🏪|La tienda abre a las diez.|The shop opens at ten.|Le magasin ouvre à dix heures.
el precio|price|le prix|🏷️|El precio es muy alto.|The price is very high.|Le prix est très élevé.
las rebajas|sales|les soldes|🔖|En enero hay rebajas.|There are sales in January.|En janvier, il y a les soldes.
pagar|to pay|payer|💳|¿Pago aquí?|Do I pay here?|Je paie ici ?
el efectivo|cash|l’espèces|💵|Solo aceptan efectivo.|They only take cash.|Ils n’acceptent que les espèces.
el cambio|change|la monnaie|🪙|Aquí tiene el cambio.|Here’s your change.|Voici votre monnaie.
caro|expensive|cher|💰|Ese reloj es muy caro.|That watch is very expensive.|Cette montre est très chère.
la bolsa|bag|le sac|🛍️|¿Necesita bolsa?|Do you need a bag?|Vous avez besoin d’un sac ?
el probador|fitting room|la cabine d’essayage|🪞|El probador está al fondo.|The fitting room is at the back.|La cabine d’essayage est au fond.
devolver|to return (an item)|rendre / retourner|↩️|Quiero devolver esto.|I want to return this.|Je voudrais rendre ceci.
el recibo|receipt|le reçu|🧾|Guarde el recibo.|Keep the receipt.|Gardez le reçu.
el regalo|gift|le cadeau|🎁|Es un regalo para mi madre.|It’s a gift for my mother.|C’est un cadeau pour ma mère.
`),
  t('transport', 'A2', '🚆', 'Getting around', 'Se déplacer', `
el tren|train|le train|🚆|El tren sale del andén dos.|The train leaves from platform two.|Le train part du quai deux.
el autobús|bus|le bus|🚌|Cojo el autobús todos los días.|I take the bus every day.|Je prends le bus tous les jours.
el metro|underground|le métro|🚇|El metro es rápido.|The underground is fast.|Le métro est rapide.
el coche|car|la voiture|🚗|Voy al trabajo en coche.|I drive to work.|Je vais au travail en voiture.
la bicicleta|bicycle|le vélo|🚲|Voy en bicicleta a la universidad.|I cycle to university.|Je vais à la fac à vélo.
la parada|stop|l’arrêt|🚏|¿Dónde está la parada?|Where is the stop?|Où est l’arrêt ?
el andén|platform|le quai|🛤️|Espera en el andén.|Wait on the platform.|Attends sur le quai.
el horario|timetable|l’horaire|🗓️|Mira el horario de trenes.|Check the train timetable.|Regarde l’horaire des trains.
salir|to leave|partir|🚪|El autobús sale a las seis.|The bus leaves at six.|Le bus part à six heures.
llegar|to arrive|arriver|🏁|Llegamos tarde.|We arrived late.|On est arrivés en retard.
el retraso|delay|le retard|⏳|Hay un retraso de veinte minutos.|There’s a twenty-minute delay.|Il y a vingt minutes de retard.
perder|to miss / lose|rater / perdre|😩|Perdí el tren.|I missed the train.|J’ai raté le train.
`),
  t('feelings', 'A2', '😊', 'Feelings', 'Les émotions', `
feliz|happy|heureux|😊|Estoy muy feliz hoy.|I’m very happy today.|Je suis très heureux aujourd’hui.
triste|sad|triste|😢|Está triste por la noticia.|She’s sad about the news.|Elle est triste à cause de la nouvelle.
enfadado|angry|fâché|😠|¿Por qué estás enfadado?|Why are you angry?|Pourquoi es-tu fâché ?
nervioso|nervous|nerveux|😬|Estoy nervioso por el examen.|I’m nervous about the exam.|Je suis nerveux pour l’examen.
tranquilo|calm|calme|😌|Tranquilo, todo va bien.|Relax, everything’s fine.|Tranquille, tout va bien.
contento|pleased|content|🙂|Estamos contentos con el piso.|We’re pleased with the flat.|On est contents de l’appartement.
el miedo|fear|la peur|😨|Tengo miedo a los perros.|I’m afraid of dogs.|J’ai peur des chiens.
preocupado|worried|inquiet|😟|Mi madre está preocupada.|My mother is worried.|Ma mère est inquiète.
sorprendido|surprised|surpris|😲|Me quedé sorprendido.|I was surprised.|J’ai été surpris.
aburrido|bored / boring|ennuyé / ennuyeux|🥱|La película es aburrida.|The film is boring.|Le film est ennuyeux.
el amor|love|l’amour|❤️|El amor lo cambia todo.|Love changes everything.|L’amour change tout.
echar de menos|to miss (someone)|manquer (à quelqu’un)|💭|Te echo de menos.|I miss you.|Tu me manques.
`),
  t('nature', 'A2', '🌳', 'Nature and animals', 'Nature et animaux', `
el árbol|tree|l’arbre|🌳|Hay un árbol enorme en el jardín.|There’s a huge tree in the garden.|Il y a un énorme arbre dans le jardin.
la flor|flower|la fleur|🌸|Estas flores huelen bien.|These flowers smell nice.|Ces fleurs sentent bon.
el río|river|la rivière / le fleuve|🏞️|El río pasa por la ciudad.|The river runs through the city.|Le fleuve traverse la ville.
el mar|sea|la mer|🌊|El mar está tranquilo hoy.|The sea is calm today.|La mer est calme aujourd’hui.
el bosque|forest|la forêt|🌲|Paseamos por el bosque.|We walk in the forest.|On se promène en forêt.
el perro|dog|le chien|🐕|Mi perro se llama Toby.|My dog is called Toby.|Mon chien s’appelle Toby.
el gato|cat|le chat|🐈|El gato duerme todo el día.|The cat sleeps all day.|Le chat dort toute la journée.
el pájaro|bird|l’oiseau|🐦|Los pájaros cantan por la mañana.|Birds sing in the morning.|Les oiseaux chantent le matin.
el caballo|horse|le cheval|🐎|Montamos a caballo en el campo.|We ride horses in the countryside.|On fait du cheval à la campagne.
el campo|countryside / field|la campagne / le champ|🌾|Mis abuelos viven en el campo.|My grandparents live in the countryside.|Mes grands-parents habitent à la campagne.
la tierra|earth / land|la terre|🌍|La tierra está seca.|The land is dry.|La terre est sèche.
el cielo|sky|le ciel|🌌|El cielo está lleno de estrellas.|The sky is full of stars.|Le ciel est plein d’étoiles.
`),
  t('restaurant', 'A2', '🍽️', 'At the restaurant', 'Au restaurant', `
el menú|menu|le menu|📋|¿Nos trae el menú?|Could you bring us the menu?|Vous nous apportez le menu ?
el plato|dish / plate|le plat / l’assiette|🍽️|El plato del día es paella.|The dish of the day is paella.|Le plat du jour, c’est la paella.
el primer plato|starter|l’entrée|🥗|De primer plato, sopa.|For the starter, soup.|En entrée, une soupe.
el postre|dessert|le dessert|🍰|¿Qué hay de postre?|What’s for dessert?|Qu’est-ce qu’il y a comme dessert ?
la bebida|drink|la boisson|🥤|¿Y de bebida?|And to drink?|Et comme boisson ?
pedir|to order / ask for|commander / demander|🙋|Vamos a pedir.|Let’s order.|On va commander.
la propina|tip|le pourboire|💶|Dejamos propina.|We left a tip.|On a laissé un pourboire.
rico|tasty|délicieux|😋|La comida está muy rica.|The food is really tasty.|La nourriture est délicieuse.
picante|spicy|épicé|🌶️|¿Es picante?|Is it spicy?|C’est épicé ?
vegetariano|vegetarian|végétarien|🥦|¿Tienen platos vegetarianos?|Do you have vegetarian dishes?|Vous avez des plats végétariens ?
la sal|salt|le sel|🧂|Le falta sal.|It needs salt.|Il manque du sel.
reservar|to book|réserver|📞|Quiero reservar una mesa.|I’d like to book a table.|Je voudrais réserver une table.
`),
  // ---------- B1 ----------
  t('opinions', 'B1', '💬', 'Opinions', 'Donner son avis', `
creo que|I think that|je crois que|🤔|Creo que tienes razón.|I think you’re right.|Je crois que tu as raison.
en mi opinión|in my opinion|à mon avis|🗣️|En mi opinión, es demasiado caro.|In my opinion, it’s too expensive.|À mon avis, c’est trop cher.
estar de acuerdo|to agree|être d’accord|🤝|Estoy de acuerdo contigo.|I agree with you.|Je suis d’accord avec toi.
la razón|reason / right|la raison|✅|No tiene razón.|He’s not right.|Il n’a pas raison.
sin embargo|however|cependant|↔️|Es caro; sin embargo, vale la pena.|It’s expensive; however, it’s worth it.|C’est cher ; cependant, ça vaut le coup.
por lo tanto|therefore|par conséquent|➡️|Llueve; por lo tanto, nos quedamos.|It’s raining, so we’re staying.|Il pleut ; par conséquent, on reste.
además|besides / also|de plus|➕|Además, es muy práctico.|Besides, it’s very practical.|De plus, c’est très pratique.
la ventaja|advantage|l’avantage|👍|Tiene muchas ventajas.|It has many advantages.|Ça a beaucoup d’avantages.
el inconveniente|drawback|l’inconvénient|👎|El único inconveniente es el precio.|The only drawback is the price.|Le seul inconvénient, c’est le prix.
depender de|to depend on|dépendre de|⚖️|Depende del tiempo.|It depends on the weather.|Ça dépend du temps.
parecer|to seem|sembler|🧐|Me parece una buena idea.|It seems like a good idea to me.|Ça me semble une bonne idée.
el punto de vista|point of view|le point de vue|👁️|Entiendo tu punto de vista.|I understand your point of view.|Je comprends ton point de vue.
`),
  t('media', 'B1', '📰', 'News and media', 'Médias et actualités', `
la noticia|piece of news|la nouvelle / l’info|📰|¿Has visto la noticia?|Have you seen the news?|Tu as vu l’info ?
el periódico|newspaper|le journal|🗞️|Leo el periódico en el móvil.|I read the paper on my phone.|Je lis le journal sur mon portable.
la radio|radio|la radio|📻|Escucho la radio en el coche.|I listen to the radio in the car.|J’écoute la radio en voiture.
la televisión|television|la télévision|📺|Ya no veo mucha televisión.|I don’t watch much TV any more.|Je ne regarde plus beaucoup la télé.
el artículo|article|l’article|📄|Escribió un artículo interesante.|She wrote an interesting article.|Elle a écrit un article intéressant.
el periodista|journalist|le journaliste|🎙️|El periodista hizo una pregunta difícil.|The journalist asked a hard question.|Le journaliste a posé une question difficile.
la entrevista|interview|l’interview|🎤|La entrevista salió en la radio.|The interview was on the radio.|L’interview est passée à la radio.
las redes sociales|social media|les réseaux sociaux|📱|Paso demasiado tiempo en las redes sociales.|I spend too much time on social media.|Je passe trop de temps sur les réseaux sociaux.
publicar|to publish / post|publier|📤|Publicó una foto ayer.|He posted a photo yesterday.|Il a publié une photo hier.
informar|to inform / report|informer|📢|Los medios informan cada hora.|The media report every hour.|Les médias informent toutes les heures.
el titular|headline|le gros titre|🔠|El titular es exagerado.|The headline is exaggerated.|Le titre est exagéré.
la fuente|source|la source|🔍|¿Cuál es la fuente?|What is the source?|Quelle est la source ?
`),
  t('environment', 'B1', '🌱', 'The environment', 'L’environnement', `
el medio ambiente|environment|l’environnement|🌍|Hay que proteger el medio ambiente.|We must protect the environment.|Il faut protéger l’environnement.
la contaminación|pollution|la pollution|🏭|La contaminación del aire es grave.|Air pollution is serious.|La pollution de l’air est grave.
el reciclaje|recycling|le recyclage|♻️|El reciclaje es obligatorio aquí.|Recycling is compulsory here.|Le recyclage est obligatoire ici.
la basura|rubbish|les ordures|🗑️|Saca la basura, por favor.|Take out the rubbish, please.|Sors les poubelles, s’il te plaît.
el cambio climático|climate change|le changement climatique|🌡️|El cambio climático nos afecta a todos.|Climate change affects us all.|Le changement climatique nous concerne tous.
la energía|energy|l’énergie|⚡|Usamos energía solar.|We use solar energy.|On utilise l’énergie solaire.
ahorrar|to save|économiser|💡|Hay que ahorrar agua.|We need to save water.|Il faut économiser l’eau.
el plástico|plastic|le plastique|🥤|Intento usar menos plástico.|I try to use less plastic.|J’essaie d’utiliser moins de plastique.
proteger|to protect|protéger|🛡️|Queremos proteger los bosques.|We want to protect the forests.|On veut protéger les forêts.
la sequía|drought|la sécheresse|🏜️|Este verano hubo sequía.|There was a drought this summer.|Il y a eu une sécheresse cet été.
sostenible|sustainable|durable|🌱|Es un turismo sostenible.|It’s sustainable tourism.|C’est un tourisme durable.
el futuro|future|l’avenir|🔮|Pensemos en el futuro.|Let’s think about the future.|Pensons à l’avenir.
`),
  t('tech', 'B1', '💻', 'Technology', 'La technologie', `
el ordenador|computer|l’ordinateur|💻|Mi ordenador es muy lento.|My computer is very slow.|Mon ordinateur est très lent.
el móvil|mobile phone|le portable|📱|Se me ha roto el móvil.|My phone has broken.|Mon portable est cassé.
la aplicación|app|l’application|📲|Descarga esta aplicación.|Download this app.|Télécharge cette application.
la contraseña|password|le mot de passe|🔐|He olvidado la contraseña.|I’ve forgotten the password.|J’ai oublié le mot de passe.
la pantalla|screen|l’écran|🖥️|La pantalla está rota.|The screen is broken.|L’écran est cassé.
descargar|to download|télécharger|⬇️|Descargué el archivo.|I downloaded the file.|J’ai téléchargé le fichier.
el archivo|file|le fichier|📁|Te envío el archivo por correo.|I’ll email you the file.|Je t’envoie le fichier par mail.
la red|network / internet|le réseau|🌐|No hay red aquí.|There’s no signal here.|Il n’y a pas de réseau ici.
cargar|to charge / load|charger|🔋|Tengo que cargar el móvil.|I need to charge my phone.|Je dois charger mon portable.
la batería|battery|la batterie|🪫|Me queda poca batería.|I’m low on battery.|Il me reste peu de batterie.
funcionar|to work (machines)|fonctionner|⚙️|El wifi no funciona.|The wifi isn’t working.|Le wifi ne marche pas.
actualizar|to update|mettre à jour|🔄|Tienes que actualizar la aplicación.|You need to update the app.|Tu dois mettre à jour l’application.
`),
  t('studies', 'B1', '🎓', 'Studies', 'Les études', `
la universidad|university|l’université|🎓|Estudio en la universidad de Granada.|I study at the University of Granada.|J’étudie à l’université de Grenade.
la carrera|degree / career|les études / la carrière|📜|Terminé la carrera el año pasado.|I finished my degree last year.|J’ai fini mes études l’an dernier.
la asignatura|subject|la matière|📚|Mi asignatura favorita es historia.|My favourite subject is history.|Ma matière préférée, c’est l’histoire.
el examen|exam|l’examen|📝|Aprobé el examen.|I passed the exam.|J’ai réussi l’examen.
aprobar|to pass|réussir (un examen)|✅|Espero aprobar.|I hope to pass.|J’espère réussir.
suspender|to fail|échouer / rater|❌|Suspendió matemáticas.|He failed maths.|Il a raté les maths.
la beca|scholarship|la bourse|💶|Tiene una beca para estudiar fuera.|She has a scholarship to study abroad.|Elle a une bourse pour étudier à l’étranger.
el profesor|teacher|le professeur|🧑‍🏫|El profesor explica muy bien.|The teacher explains very well.|Le professeur explique très bien.
los apuntes|notes|les notes de cours|🗒️|¿Me dejas tus apuntes?|Can I borrow your notes?|Tu me prêtes tes notes ?
aprender|to learn|apprendre|🧠|Aprendo algo nuevo cada día.|I learn something new every day.|J’apprends quelque chose de nouveau chaque jour.
la biblioteca|library|la bibliothèque|🏛️|Estudio en la biblioteca.|I study in the library.|J’étudie à la bibliothèque.
el título|degree certificate / title|le diplôme / le titre|🎓|Por fin tengo el título.|I finally have my degree.|J’ai enfin mon diplôme.
`),
  t('money', 'B1', '💶', 'Money', 'L’argent', `
el dinero|money|l’argent|💶|No tengo mucho dinero.|I don’t have much money.|Je n’ai pas beaucoup d’argent.
la cuenta bancaria|bank account|le compte bancaire|🏦|Abrí una cuenta bancaria.|I opened a bank account.|J’ai ouvert un compte bancaire.
ahorrar|to save (money)|économiser|🐷|Ahorro para un viaje.|I’m saving for a trip.|J’économise pour un voyage.
gastar|to spend|dépenser|💸|Gasto demasiado en ropa.|I spend too much on clothes.|Je dépense trop en vêtements.
el alquiler|rent|le loyer|🏠|El alquiler sube cada año.|The rent goes up every year.|Le loyer augmente chaque année.
la factura|bill / invoice|la facture|🧾|Pagué la factura de la luz.|I paid the electricity bill.|J’ai payé la facture d’électricité.
prestar|to lend|prêter|🤲|¿Me prestas diez euros?|Can you lend me ten euros?|Tu me prêtes dix euros ?
deber|to owe / must|devoir|📉|Te debo un café.|I owe you a coffee.|Je te dois un café.
el préstamo|loan|le prêt|📄|Pidieron un préstamo al banco.|They asked the bank for a loan.|Ils ont demandé un prêt à la banque.
el ahorro|savings|l’épargne|💰|Tengo algunos ahorros.|I have some savings.|J’ai quelques économies.
el impuesto|tax|l’impôt|🏛️|Los impuestos son altos.|Taxes are high.|Les impôts sont élevés.
barato|cheap|pas cher|🪙|Busco un piso más barato.|I’m looking for a cheaper flat.|Je cherche un appartement moins cher.
`),
  t('relationships', 'B1', '💞', 'Relationships', 'Les relations', `
la pareja|partner / couple|le couple / le partenaire|💑|Mi pareja es italiana.|My partner is Italian.|Mon/ma partenaire est italien(ne).
el novio|boyfriend / groom|le petit ami / le fiancé|🤵|Su novio es médico.|Her boyfriend is a doctor.|Son copain est médecin.
la novia|girlfriend / bride|la petite amie / la fiancée|👰|La novia llegó tarde a la boda.|The bride arrived late to the wedding.|La mariée est arrivée en retard au mariage.
la boda|wedding|le mariage|💒|La boda es en junio.|The wedding is in June.|Le mariage est en juin.
casarse|to get married|se marier|💍|Se casaron el año pasado.|They got married last year.|Ils se sont mariés l’an dernier.
conocer|to meet / know|rencontrer / connaître|🤝|Nos conocimos en un viaje.|We met on a trip.|On s’est rencontrés en voyage.
la confianza|trust|la confiance|🫂|La confianza es fundamental.|Trust is essential.|La confiance est essentielle.
discutir|to argue / discuss|se disputer / discuter|🗯️|Discutimos por tonterías.|We argue about silly things.|On se dispute pour des bêtises.
llevarse bien|to get on well|bien s’entendre|😊|Me llevo bien con mi hermano.|I get on well with my brother.|Je m’entends bien avec mon frère.
el vecino|neighbour|le voisin|🏘️|Mi vecino es muy amable.|My neighbour is very kind.|Mon voisin est très gentil.
la amistad|friendship|l’amitié|🤞|Nuestra amistad es muy larga.|Our friendship is very long.|Notre amitié dure depuis longtemps.
quedar|to meet up|se retrouver|📍|¿Quedamos el sábado?|Shall we meet up on Saturday?|On se retrouve samedi ?
`),
  t('culture', 'B1', '🎭', 'Culture', 'La culture', `
la fiesta|party / festival|la fête|🎉|La fiesta del pueblo es en agosto.|The village festival is in August.|La fête du village est en août.
la costumbre|custom / habit|la coutume / l’habitude|🗓️|Es una costumbre muy antigua.|It’s a very old custom.|C’est une coutume très ancienne.
el arte|art|l’art|🖼️|Me interesa el arte moderno.|I’m interested in modern art.|L’art moderne m’intéresse.
la obra|work (of art) / play|l’œuvre / la pièce|🎭|Vimos una obra de teatro.|We saw a play.|On a vu une pièce de théâtre.
el escritor|writer|l’écrivain|✍️|Es mi escritor favorito.|He’s my favourite writer.|C’est mon écrivain préféré.
la exposición|exhibition|l’exposition|🖼️|La exposición termina el domingo.|The exhibition ends on Sunday.|L’exposition se termine dimanche.
el idioma|language|la langue|🗣️|Hablo tres idiomas.|I speak three languages.|Je parle trois langues.
la tradición|tradition|la tradition|🪅|Es una tradición familiar.|It’s a family tradition.|C’est une tradition familiale.
el concierto|concert|le concert|🎶|El concierto fue increíble.|The concert was incredible.|Le concert était incroyable.
la historia|history / story|l’histoire|📜|Me encanta la historia de España.|I love Spanish history.|J’adore l’histoire de l’Espagne.
el siglo|century|le siècle|🏰|Es un castillo del siglo XII.|It’s a twelfth-century castle.|C’est un château du XIIe siècle.
famoso|famous|célèbre|⭐|Es un pintor muy famoso.|He’s a very famous painter.|C’est un peintre très célèbre.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'es-g-articles', level: 'A1', icon: '🔤', en: 'Gender and articles', fr: 'Genre et articles',
    cards: [
      { en: 'Every noun is masculine or feminine. Most nouns ending in -o are masculine, most ending in -a are feminine.', fr: 'Chaque nom est masculin ou féminin. La plupart des noms en -o sont masculins, ceux en -a féminins.', examples: [['el libro', 'the book', 'le livre'], ['la mesa', 'the table', 'la table']] },
      { en: '"The": el (masculine), la (feminine), los / las (plural). "A": un (masculine), una (feminine).', fr: '« Le/la » : el (masculin), la (féminin), los / las (pluriel). « Un/une » : un, una.', examples: [['un perro', 'a dog', 'un chien'], ['las casas', 'the houses', 'les maisons']] },
      { en: 'Watch out: some exceptions, like el día (the day) and la mano (the hand).', fr: 'Attention aux exceptions, comme el día (le jour) et la mano (la main).', examples: [['el día', 'the day', 'le jour'], ['la mano', 'the hand', 'la main']] },
    ],
    drills: [
      { text: '___ libro es nuevo.', answer: 'El', wrong: ['La', 'Los'], en: 'The book is new.', fr: 'Le livre est neuf.' },
      { text: 'Tengo ___ casa pequeña.', answer: 'una', wrong: ['un', 'el'], en: 'I have a small house.', fr: 'J’ai une petite maison.' },
      { text: '___ niñas juegan.', answer: 'Las', wrong: ['Los', 'La'], en: 'The girls are playing.', fr: 'Les filles jouent.' },
      { text: 'Es ___ día bonito.', answer: 'un', wrong: ['una', 'la'], en: 'It’s a nice day.', fr: 'C’est une belle journée.' },
      { text: '___ mano derecha.', answer: 'La', wrong: ['El', 'Un'], en: 'The right hand.', fr: 'La main droite.' },
    ],
  },
  {
    id: 'es-g-ser', level: 'A1', icon: '🪪', en: 'The verb ser (to be)', fr: 'Le verbe ser (être)',
    cards: [
      { en: 'Ser is for who or what someone is: name, job, origin, description.', fr: 'Ser sert à dire qui ou ce qu’est quelqu’un : nom, métier, origine, description.', examples: [['Soy Ana.', 'I’m Ana.', 'Je suis Ana.'], ['Es médico.', 'He’s a doctor.', 'Il est médecin.']] },
      { en: 'yo soy · tú eres · él/ella es · nosotros somos · vosotros sois · ellos son', fr: 'yo soy · tú eres · él/ella es · nosotros somos · vosotros sois · ellos son', examples: [['Somos de Francia.', 'We’re from France.', 'Nous sommes de France.'], ['¿Eres estudiante?', 'Are you a student?', 'Tu es étudiant ?']] },
    ],
    drills: [
      { text: 'Yo ___ estudiante.', answer: 'soy', wrong: ['eres', 'es'], en: 'I’m a student.', fr: 'Je suis étudiant.' },
      { text: 'Ella ___ de México.', answer: 'es', wrong: ['son', 'soy'], en: 'She’s from Mexico.', fr: 'Elle est du Mexique.' },
      { text: 'Nosotros ___ amigos.', answer: 'somos', wrong: ['son', 'sois'], en: 'We are friends.', fr: 'Nous sommes amis.' },
      { text: '¿Tú ___ español?', answer: 'eres', wrong: ['es', 'soy'], en: 'Are you Spanish?', fr: 'Tu es espagnol ?' },
      { text: 'Ellos ___ muy altos.', answer: 'son', wrong: ['es', 'somos'], en: 'They are very tall.', fr: 'Ils sont très grands.' },
    ],
  },
  {
    id: 'es-g-ar', level: 'A1', icon: '🔁', en: 'Present tense: -ar verbs', fr: 'Présent : verbes en -ar',
    cards: [
      { en: 'Take hablar (to speak): drop -ar and add the ending for the person.', fr: 'Prenez hablar (parler) : enlevez -ar et ajoutez la terminaison.', examples: [['hablo', 'I speak', 'je parle'], ['hablas', 'you speak', 'tu parles']] },
      { en: '-o · -as · -a · -amos · -áis · -an. Subject pronouns are often dropped, because the ending already says who.', fr: '-o · -as · -a · -amos · -áis · -an. On omet souvent le pronom : la terminaison suffit.', examples: [['Trabajamos aquí.', 'We work here.', 'Nous travaillons ici.'], ['Ellos cantan.', 'They sing.', 'Ils chantent.']] },
    ],
    drills: [
      { text: 'Yo ___ español. (hablar)', answer: 'hablo', wrong: ['hablas', 'habla'], en: 'I speak Spanish.', fr: 'Je parle espagnol.' },
      { text: 'Nosotros ___ en Madrid. (trabajar)', answer: 'trabajamos', wrong: ['trabajan', 'trabajo'], en: 'We work in Madrid.', fr: 'Nous travaillons à Madrid.' },
      { text: '¿Tú ___ café? (tomar)', answer: 'tomas', wrong: ['toma', 'tomo'], en: 'Do you drink coffee?', fr: 'Tu prends du café ?' },
      { text: 'Ella ___ muy bien. (cantar)', answer: 'canta', wrong: ['canto', 'cantan'], en: 'She sings very well.', fr: 'Elle chante très bien.' },
      { text: 'Ellos ___ inglés. (estudiar)', answer: 'estudian', wrong: ['estudia', 'estudiamos'], en: 'They study English.', fr: 'Ils étudient l’anglais.' },
    ],
  },
  {
    id: 'es-g-estar', level: 'A2', icon: '📍', en: 'Estar: where and how', fr: 'Estar : où et comment',
    cards: [
      { en: 'Estar is for location and for how someone is right now (states and feelings).', fr: 'Estar sert pour le lieu et l’état du moment (états, émotions).', examples: [['Estoy en casa.', 'I’m at home.', 'Je suis à la maison.'], ['Está cansado.', 'He’s tired.', 'Il est fatigué.']] },
      { en: 'estoy · estás · está · estamos · estáis · están. Compare: es aburrido (he’s boring) / está aburrido (he’s bored).', fr: 'estoy · estás · está · estamos · estáis · están. Comparez : es aburrido (il est ennuyeux) / está aburrido (il s’ennuie).', examples: [['El museo está cerca.', 'The museum is nearby.', 'Le musée est proche.'], ['Estamos contentos.', 'We’re pleased.', 'Nous sommes contents.']] },
    ],
    drills: [
      { text: 'Madrid ___ en España.', answer: 'está', wrong: ['es', 'son'], en: 'Madrid is in Spain.', fr: 'Madrid est en Espagne.' },
      { text: 'Hoy ___ muy cansada.', answer: 'estoy', wrong: ['soy', 'es'], en: 'Today I’m very tired.', fr: 'Aujourd’hui, je suis très fatiguée.' },
      { text: 'Mi hermano ___ médico.', answer: 'es', wrong: ['está', 'estás'], en: 'My brother is a doctor.', fr: 'Mon frère est médecin.' },
      { text: '¿Dónde ___ las llaves?', answer: 'están', wrong: ['son', 'está'], en: 'Where are the keys?', fr: 'Où sont les clés ?' },
      { text: 'Nosotros ___ en el parque.', answer: 'estamos', wrong: ['somos', 'están'], en: 'We’re in the park.', fr: 'Nous sommes au parc.' },
    ],
  },
  {
    id: 'es-g-gustar', level: 'A2', icon: '❤️', en: 'Gustar (to like)', fr: 'Gustar (aimer)',
    cards: [
      { en: 'Gustar works backwards: the thing liked is the subject. "Me gusta el café" = coffee pleases me.', fr: 'Gustar fonctionne à l’envers : ce qu’on aime est le sujet. « Me gusta el café » = le café me plaît.', examples: [['Me gusta el chocolate.', 'I like chocolate.', 'J’aime le chocolat.'], ['Te gustan los perros.', 'You like dogs.', 'Tu aimes les chiens.']] },
      { en: 'Use gusta for one thing or a verb, gustan for several things. me · te · le · nos · os · les.', fr: 'Gusta pour une chose ou un verbe, gustan pour plusieurs. me · te · le · nos · os · les.', examples: [['Nos gusta viajar.', 'We like travelling.', 'Nous aimons voyager.'], ['Le gustan las flores.', 'She likes flowers.', 'Elle aime les fleurs.']] },
    ],
    drills: [
      { text: 'Me ___ la música.', answer: 'gusta', wrong: ['gustan', 'gusto'], en: 'I like music.', fr: 'J’aime la musique.' },
      { text: 'Nos ___ los gatos.', answer: 'gustan', wrong: ['gusta', 'gustamos'], en: 'We like cats.', fr: 'Nous aimons les chats.' },
      { text: '¿Te ___ bailar?', answer: 'gusta', wrong: ['gustan', 'gustas'], en: 'Do you like dancing?', fr: 'Tu aimes danser ?' },
      { text: 'A ella ___ gusta el té.', answer: 'le', wrong: ['la', 'les'], en: 'She likes tea.', fr: 'Elle aime le thé.' },
      { text: 'A mis padres ___ gusta el campo.', answer: 'les', wrong: ['le', 'nos'], en: 'My parents like the countryside.', fr: 'Mes parents aiment la campagne.' },
    ],
  },
  {
    id: 'es-g-ira', level: 'A2', icon: '🔜', en: 'Ir a + verb (future plans)', fr: 'Ir a + verbe (futur proche)',
    cards: [
      { en: 'To talk about plans, use ir (to go) + a + infinitive: "I’m going to…".', fr: 'Pour un projet : ir (aller) + a + infinitif : « je vais… ».', examples: [['Voy a estudiar.', 'I’m going to study.', 'Je vais étudier.'], ['Vamos a cenar fuera.', 'We’re going to eat out.', 'On va dîner dehors.']] },
      { en: 'voy · vas · va · vamos · vais · van', fr: 'voy · vas · va · vamos · vais · van', examples: [['¿Vas a venir?', 'Are you going to come?', 'Tu vas venir ?'], ['Va a llover.', 'It’s going to rain.', 'Il va pleuvoir.']] },
    ],
    drills: [
      { text: 'Mañana ___ a trabajar.', answer: 'voy', wrong: ['va', 'vamos'], en: 'Tomorrow I’m going to work.', fr: 'Demain, je vais travailler.' },
      { text: 'Ellos ___ a viajar a Chile.', answer: 'van', wrong: ['vamos', 'va'], en: 'They’re going to travel to Chile.', fr: 'Ils vont voyager au Chili.' },
      { text: '¿Qué ___ a hacer tú?', answer: 'vas', wrong: ['voy', 'van'], en: 'What are you going to do?', fr: 'Qu’est-ce que tu vas faire ?' },
      { text: 'Nosotros ___ a cocinar.', answer: 'vamos', wrong: ['van', 'voy'], en: 'We’re going to cook.', fr: 'Nous allons cuisiner.' },
      { text: 'Voy ___ llamar a mi madre.', answer: 'a', wrong: ['de', 'en'], en: 'I’m going to call my mother.', fr: 'Je vais appeler ma mère.' },
    ],
  },
  {
    id: 'es-g-preterite', level: 'B1', icon: '⏪', en: 'The past: preterite', fr: 'Le passé : prétérit',
    cards: [
      { en: 'The preterite tells finished actions at a specific time. -ar verbs: -é, -aste, -ó, -amos, -asteis, -aron.', fr: 'Le prétérit raconte des actions terminées à un moment précis. Verbes en -ar : -é, -aste, -ó, -amos, -asteis, -aron.', examples: [['Ayer hablé con él.', 'Yesterday I spoke with him.', 'Hier, j’ai parlé avec lui.'], ['Compraron un coche.', 'They bought a car.', 'Ils ont acheté une voiture.']] },
      { en: '-er/-ir verbs: -í, -iste, -ió, -imos, -isteis, -ieron. Common irregulars: fui (I went / was), hice (I did), tuve (I had).', fr: 'Verbes en -er/-ir : -í, -iste, -ió, -imos, -isteis, -ieron. Irréguliers courants : fui (je suis allé / j’ai été), hice (j’ai fait), tuve (j’ai eu).', examples: [['Comí paella.', 'I ate paella.', 'J’ai mangé une paella.'], ['Fuimos a la playa.', 'We went to the beach.', 'On est allés à la plage.']] },
    ],
    drills: [
      { text: 'Ayer ___ al cine. (ir, yo)', answer: 'fui', wrong: ['voy', 'fue'], en: 'Yesterday I went to the cinema.', fr: 'Hier, je suis allé au cinéma.' },
      { text: 'Ella ___ una carta. (escribir)', answer: 'escribió', wrong: ['escribe', 'escribí'], en: 'She wrote a letter.', fr: 'Elle a écrit une lettre.' },
      { text: 'Nosotros ___ mucho. (bailar)', answer: 'bailamos', wrong: ['bailaron', 'bailé'], en: 'We danced a lot.', fr: 'Nous avons beaucoup dansé.' },
      { text: '¿Qué ___ el fin de semana? (hacer, tú)', answer: 'hiciste', wrong: ['haces', 'hizo'], en: 'What did you do at the weekend?', fr: 'Qu’as-tu fait le week-end ?' },
      { text: 'Ellos ___ tarde. (llegar)', answer: 'llegaron', wrong: ['llegamos', 'llegó'], en: 'They arrived late.', fr: 'Ils sont arrivés en retard.' },
    ],
  },
  {
    id: 'es-g-imperfect', level: 'B1', icon: '🕰️', en: 'Imperfect: how things used to be', fr: 'Imparfait : comment c’était',
    cards: [
      { en: 'The imperfect describes the past: habits, settings and ongoing situations. -ar: -aba; -er/-ir: -ía.', fr: 'L’imparfait décrit le passé : habitudes, décor, situations en cours. -ar : -aba ; -er/-ir : -ía.', examples: [['De niño jugaba al fútbol.', 'As a child I used to play football.', 'Enfant, je jouais au foot.'], ['Hacía sol.', 'It was sunny.', 'Il faisait beau.']] },
      { en: 'Background (imperfect) vs event (preterite): "Leía cuando sonó el teléfono."', fr: 'Décor (imparfait) contre événement (prétérit) : « Leía cuando sonó el teléfono. »', examples: [['Leía cuando sonó el teléfono.', 'I was reading when the phone rang.', 'Je lisais quand le téléphone a sonné.'], ['Vivíamos en Lima.', 'We used to live in Lima.', 'Nous habitions à Lima.']] },
    ],
    drills: [
      { text: 'Cuando era niño, ___ en el campo. (vivir)', answer: 'vivía', wrong: ['viví', 'vivo'], en: 'When I was a child, I lived in the countryside.', fr: 'Quand j’étais enfant, je vivais à la campagne.' },
      { text: '___ las ocho cuando llegó. (ser)', answer: 'Eran', wrong: ['Fueron', 'Son'], en: 'It was eight o’clock when she arrived.', fr: 'Il était huit heures quand elle est arrivée.' },
      { text: 'Mientras yo ___, él cocinaba. (estudiar)', answer: 'estudiaba', wrong: ['estudié', 'estudio'], en: 'While I was studying, he was cooking.', fr: 'Pendant que j’étudiais, il cuisinait.' },
      { text: 'Todos los veranos ___ a la playa. (ir, nosotros)', answer: 'íbamos', wrong: ['fuimos', 'vamos'], en: 'Every summer we used to go to the beach.', fr: 'Chaque été, nous allions à la plage.' },
      { text: 'Dormía cuando ___ el teléfono. (sonar)', answer: 'sonó', wrong: ['sonaba', 'suena'], en: 'I was sleeping when the phone rang.', fr: 'Je dormais quand le téléphone a sonné.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'es-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Buenos días, ¿qué le pongo?', en: 'Good morning, what can I get you?', fr: 'Bonjour, qu’est-ce que je vous sers ?' },
      { who: 'B', text: 'Un café con leche, por favor.', en: 'A coffee with milk, please.', fr: 'Un café au lait, s’il vous plaît.', wrong: ['La cuenta, por favor.', 'Me llamo café.'] },
      { who: 'A', text: '¿Algo para comer?', en: 'Anything to eat?', fr: 'Quelque chose à manger ?' },
      { who: 'B', text: 'Sí, una tostada con tomate.', en: 'Yes, toast with tomato.', fr: 'Oui, une tartine à la tomate.', wrong: ['Sí, tengo veinte años.', 'No, estoy en la playa.'] },
      { who: 'A', text: 'Muy bien. Son tres euros.', en: 'Very good. That’s three euros.', fr: 'Très bien. Ça fait trois euros.' },
      { who: 'B', text: 'Aquí tiene. Gracias.', en: 'Here you are. Thank you.', fr: 'Voici. Merci.', wrong: ['¿Dónde está la estación?', 'Buenas noches, hasta mañana.'] },
    ],
  },
  {
    id: 'es-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Perdone, ¿dónde está el museo?', en: 'Excuse me, where is the museum?', fr: 'Pardon, où est le musée ?', wrong: ['Perdone, ¿cuánto cuesta el museo?', 'Perdone, soy el museo.'] },
      { who: 'A', text: 'Siga recto y gire a la derecha.', en: 'Go straight on and turn right.', fr: 'Allez tout droit et tournez à droite.' },
      { who: 'B', text: '¿Está lejos?', en: 'Is it far?', fr: 'C’est loin ?', wrong: ['¿Está rico?', '¿Es mi amigo?'] },
      { who: 'A', text: 'No, a cinco minutos a pie.', en: 'No, five minutes on foot.', fr: 'Non, à cinq minutes à pied.' },
      { who: 'B', text: 'Muchas gracias.', en: 'Thank you very much.', fr: 'Merci beaucoup.', wrong: ['Mucho gusto, me llamo Ana.', 'Quiero una mesa para dos.'] },
    ],
  },
  {
    id: 'es-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Buenas tardes, ¿en qué puedo ayudarle?', en: 'Good afternoon, how can I help you?', fr: 'Bonjour, que puis-je pour vous ?' },
      { who: 'B', text: 'Tengo una reserva a nombre de Martín.', en: 'I have a reservation under the name Martín.', fr: 'J’ai une réservation au nom de Martín.', wrong: ['Tengo fiebre desde ayer.', 'Quiero devolver esta camiseta.'] },
      { who: 'A', text: 'Sí, una habitación doble para tres noches.', en: 'Yes, a double room for three nights.', fr: 'Oui, une chambre double pour trois nuits.' },
      { who: 'B', text: '¿El desayuno está incluido?', en: 'Is breakfast included?', fr: 'Le petit-déjeuner est inclus ?', wrong: ['¿El desayuno es mi hermano?', '¿Dónde está la playa de mi tía?'] },
      { who: 'A', text: 'Sí, de siete a diez, en la primera planta.', en: 'Yes, from seven to ten, on the first floor.', fr: 'Oui, de sept à dix heures, au premier étage.' },
      { who: 'B', text: 'Perfecto. ¿Puedo pagar con tarjeta?', en: 'Perfect. Can I pay by card?', fr: 'Parfait. Je peux payer par carte ?', wrong: ['Perfecto. Hace mucho viento.', 'Perfecto. Soy profesora.'] },
    ],
  },
  {
    id: 'es-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: '¿Qué le pasa?', en: 'What’s the matter?', fr: 'Qu’est-ce qui ne va pas ?' },
      { who: 'B', text: 'Me duele la cabeza y tengo fiebre.', en: 'I have a headache and a fever.', fr: 'J’ai mal à la tête et de la fièvre.', wrong: ['Me gusta la cabeza y tengo hambre.', 'Quiero un café con leche.'] },
      { who: 'A', text: '¿Desde cuándo?', en: 'Since when?', fr: 'Depuis quand ?' },
      { who: 'B', text: 'Desde ayer por la noche.', en: 'Since last night.', fr: 'Depuis hier soir.', wrong: ['Desde la plaza a la derecha.', 'Hasta el lunes, gracias.'] },
      { who: 'A', text: 'Tome esta pastilla cada ocho horas y descanse.', en: 'Take this pill every eight hours and rest.', fr: 'Prenez ce comprimé toutes les huit heures et reposez-vous.' },
      { who: 'B', text: 'De acuerdo, muchas gracias, doctora.', en: 'All right, thank you very much, doctor.', fr: 'D’accord, merci beaucoup, docteure.', wrong: ['De acuerdo, la cuenta, por favor.', 'De acuerdo, voy a la boda.'] },
    ],
  },
  {
    id: 'es-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec un ami',
    lines: [
      { who: 'A', text: '¿Qué vas a hacer este fin de semana?', en: 'What are you going to do this weekend?', fr: 'Qu’est-ce que tu vas faire ce week-end ?' },
      { who: 'B', text: 'Todavía no lo sé. ¿Tienes alguna idea?', en: 'I don’t know yet. Any ideas?', fr: 'Je ne sais pas encore. Tu as une idée ?', wrong: ['Ayer comí paella.', 'Soy de Valencia.'] },
      { who: 'A', text: 'Hay una exposición nueva en el museo.', en: 'There’s a new exhibition at the museum.', fr: 'Il y a une nouvelle expo au musée.' },
      { who: 'B', text: 'Me parece una buena idea. ¿Quedamos el sábado?', en: 'Sounds good. Shall we meet on Saturday?', fr: 'Bonne idée. On se retrouve samedi ?', wrong: ['Me parece que llueve en mi cocina.', 'No tengo pasaporte.'] },
      { who: 'A', text: 'Vale, a las once en la entrada.', en: 'OK, at eleven at the entrance.', fr: 'D’accord, à onze heures à l’entrée.' },
      { who: 'B', text: 'Perfecto, nos vemos allí.', en: 'Perfect, see you there.', fr: 'Parfait, on se voit là-bas.', wrong: ['Perfecto, me duele el estómago.', 'Perfecto, compro tomates.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'es-s-market', level: 'A1', icon: '🧺', en: 'Lucía at the market', fr: 'Lucía au marché',
    sentences: [
      ['Lucía vive en Valencia.', 'Lucía lives in Valencia.', 'Lucía habite à Valence.'],
      ['Los sábados va al mercado.', 'On Saturdays she goes to the market.', 'Le samedi, elle va au marché.'],
      ['Compra tomates, naranjas y pan.', 'She buys tomatoes, oranges and bread.', 'Elle achète des tomates, des oranges et du pain.'],
      ['El vendedor es su amigo Pablo.', 'The seller is her friend Pablo.', 'Le vendeur est son ami Pablo.'],
      ['Pablo le da una manzana gratis.', 'Pablo gives her a free apple.', 'Pablo lui donne une pomme gratuite.'],
      ['Lucía está muy contenta.', 'Lucía is very happy.', 'Lucía est très contente.'],
    ],
    glossary: { vive: ['lives', 'habite'], sábados: ['Saturdays', 'samedis'], mercado: ['market', 'marché'], compra: ['buys', 'achète'], vendedor: ['seller', 'vendeur'], da: ['gives', 'donne'], gratis: ['free', 'gratuit'], contenta: ['happy', 'contente'], naranjas: ['oranges', 'oranges'], tomates: ['tomatoes', 'tomates'] },
    questions: [
      { en: 'Where does Lucía live?', fr: 'Où habite Lucía ?', answer: 'Valencia', wrong: ['Madrid', 'Sevilla'] },
      { en: 'Who is Pablo?', fr: 'Qui est Pablo ?', answer: 'su amigo', wrong: ['su hermano', 'su padre'] },
      { en: 'What does Pablo give her?', fr: 'Que lui donne Pablo ?', answer: 'una manzana', wrong: ['un tomate', 'pan'] },
    ],
  },
  {
    id: 'es-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Marcos tenía un tren a las ocho.', 'Marcos had a train at eight.', 'Marcos avait un train à huit heures.'],
      ['Pero se despertó tarde.', 'But he woke up late.', 'Mais il s’est réveillé en retard.'],
      ['Corrió a la estación con su maleta.', 'He ran to the station with his suitcase.', 'Il a couru à la gare avec sa valise.'],
      ['Cuando llegó, el tren ya había salido.', 'When he arrived, the train had already left.', 'Quand il est arrivé, le train était déjà parti.'],
      ['Compró otro billete para las diez.', 'He bought another ticket for ten.', 'Il a acheté un autre billet pour dix heures.'],
      ['Mientras esperaba, leyó un libro en un café.', 'While he waited, he read a book in a café.', 'En attendant, il a lu un livre dans un café.'],
      ['Al final, fue un buen día.', 'In the end, it was a good day.', 'Finalement, ce fut une bonne journée.'],
    ],
    glossary: { tenía: ['had', 'avait'], despertó: ['woke up', 'réveillé'], tarde: ['late', 'tard'], corrió: ['ran', 'a couru'], estación: ['station', 'gare'], maleta: ['suitcase', 'valise'], llegó: ['arrived', 'est arrivé'], salido: ['left', 'parti'], billete: ['ticket', 'billet'], esperaba: ['was waiting', 'attendait'], leyó: ['read', 'a lu'] },
    questions: [
      { en: 'Why did Marcos miss the train?', fr: 'Pourquoi Marcos a-t-il raté le train ?', answer: 'Se despertó tarde', wrong: ['Perdió el billete', 'Estaba enfermo'] },
      { en: 'What time is his new train?', fr: 'À quelle heure est son nouveau train ?', answer: 'a las diez', wrong: ['a las ocho', 'a las doce'] },
      { en: 'What did he do while waiting?', fr: 'Qu’a-t-il fait en attendant ?', answer: 'Leyó un libro', wrong: ['Durmió', 'Fue al cine'] },
    ],
  },
  {
    id: 'es-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Hace dos años, los vecinos de mi edificio tuvieron una idea.', 'Two years ago, the neighbours in my building had an idea.', 'Il y a deux ans, les voisins de mon immeuble ont eu une idée.'],
      ['El tejado estaba vacío y nadie lo usaba.', 'The roof was empty and nobody used it.', 'Le toit était vide et personne ne l’utilisait.'],
      ['Decidimos convertirlo en un huerto.', 'We decided to turn it into a vegetable garden.', 'Nous avons décidé d’en faire un potager.'],
      ['Al principio, muchos pensaban que era imposible.', 'At first, many thought it was impossible.', 'Au début, beaucoup pensaient que c’était impossible.'],
      ['Sin embargo, ahora cultivamos tomates, lechugas y hierbas.', 'However, now we grow tomatoes, lettuces and herbs.', 'Pourtant, maintenant nous cultivons des tomates, des salades et des herbes.'],
      ['Además, nos conocemos mejor y compartimos lo que recogemos.', 'Besides, we know each other better and share what we harvest.', 'De plus, nous nous connaissons mieux et partageons ce que nous récoltons.'],
    ],
    glossary: { vecinos: ['neighbours', 'voisins'], edificio: ['building', 'immeuble'], tejado: ['roof', 'toit'], vacío: ['empty', 'vide'], nadie: ['nobody', 'personne'], huerto: ['vegetable garden', 'potager'], imposible: ['impossible', 'impossible'], cultivamos: ['we grow', 'nous cultivons'], compartimos: ['we share', 'nous partageons'], recogemos: ['we harvest', 'nous récoltons'] },
    questions: [
      { en: 'What was on the roof before?', fr: 'Qu’y avait-il sur le toit avant ?', answer: 'Nada, estaba vacío', wrong: ['Un huerto', 'Una piscina'] },
      { en: 'What do they grow?', fr: 'Que cultivent-ils ?', answer: 'Tomates, lechugas y hierbas', wrong: ['Flores y árboles', 'Patatas y cebollas'] },
      { en: 'What else changed?', fr: 'Qu’est-ce qui a changé d’autre ?', answer: 'Los vecinos se conocen mejor', wrong: ['El edificio es más alto', 'Ya no hay vecinos'] },
    ],
  },
];

export const SPANISH_FULL: FullCourse = { topics, grammar, dialogues, stories };
