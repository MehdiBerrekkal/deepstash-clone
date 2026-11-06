import { words, type Level, type Topic } from '@/data/learn/full';

/** Spanish, pack 2: dates and numbers, body, weather, phone and internet, the car, music, cooking, science, history. Original content. */
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level, icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('A1', 'dates', '📅', 'Months and dates', 'Mois et dates', `
enero|January|janvier|❄️|Mi cumpleaños es en enero.|My birthday is in January.|Mon anniversaire est en janvier.
febrero|February|février|💘|Febrero es el mes más corto.|February is the shortest month.|Février est le mois le plus court.
marzo|March|mars|🌱|En marzo empieza la primavera.|Spring starts in March.|Le printemps commence en mars.
abril|April|avril|🌧️|En abril llueve mucho.|It rains a lot in April.|Il pleut beaucoup en avril.
mayo|May|mai|🌷|Las flores salen en mayo.|Flowers come out in May.|Les fleurs sortent en mai.
junio|June|juin|☀️|El curso termina en junio.|The school year ends in June.|L’année scolaire se termine en juin.
julio|July|juillet|🏖️|En julio vamos a la playa.|In July we go to the beach.|En juillet, nous allons à la plage.
agosto|August|août|🌞|En agosto hace mucho calor.|It’s very hot in August.|Il fait très chaud en août.
septiembre|September|septembre|🍂|Las clases empiezan en septiembre.|Classes start in September.|Les cours commencent en septembre.
octubre|October|octobre|🎃|Octubre es mi mes favorito.|October is my favourite month.|Octobre est mon mois préféré.
noviembre|November|novembre|🍁|En noviembre hace frío.|It’s cold in November.|Il fait froid en novembre.
diciembre|December|décembre|🎄|En diciembre celebramos la Navidad.|In December we celebrate Christmas.|En décembre, nous fêtons Noël.
el jueves|Thursday|jeudi|4️⃣|El jueves tengo clase de yoga.|On Thursday I have yoga class.|Le jeudi, j’ai cours de yoga.
el sábado|Saturday|samedi|6️⃣|El sábado vamos al mercado.|On Saturday we go to the market.|Samedi, nous allons au marché.
el domingo|Sunday|dimanche|7️⃣|El domingo como con mi familia.|On Sunday I have lunch with my family.|Le dimanche, je déjeune avec ma famille.
el mes|month|le mois|🗓️|Voy al dentista una vez al mes.|I go to the dentist once a month.|Je vais chez le dentiste une fois par mois.
la semana|week|la semaine|📆|Trabajo cinco días a la semana.|I work five days a week.|Je travaille cinq jours par semaine.
el cumpleaños|birthday|l’anniversaire|🎂|¡Feliz cumpleaños!|Happy birthday!|Joyeux anniversaire !
el otoño|autumn|l’automne|🍂|En otoño caen las hojas.|In autumn the leaves fall.|En automne, les feuilles tombent.
la fecha|date|la date|📌|¿Qué fecha es hoy?|What’s the date today?|Quelle est la date aujourd’hui ?
`),
  t('A1', 'numbers2', '🔢', 'More numbers', 'Encore des nombres', `
cuatro|four|quatre|4️⃣|Tengo cuatro gatos.|I have four cats.|J’ai quatre chats.
seis|six|six|6️⃣|Son las seis de la tarde.|It’s six in the evening.|Il est six heures du soir.
siete|seven|sept|7️⃣|La semana tiene siete días.|The week has seven days.|La semaine a sept jours.
ocho|eight|huit|8️⃣|Trabajo ocho horas al día.|I work eight hours a day.|Je travaille huit heures par jour.
nueve|nine|neuf|9️⃣|Mi hija tiene nueve años.|My daughter is nine.|Ma fille a neuf ans.
once|eleven|onze|⚽|Un equipo de fútbol tiene once jugadores.|A football team has eleven players.|Une équipe de foot a onze joueurs.
doce|twelve|douze|🕛|Comemos a las doce.|We eat at twelve.|Nous mangeons à midi.
quince|fifteen|quinze|🕒|Te espero quince minutos.|I’ll wait fifteen minutes for you.|Je t’attends quinze minutes.
cuarenta|forty|quarante|🔟|Mi padre tiene cuarenta años.|My father is forty.|Mon père a quarante ans.
cincuenta|fifty|cinquante|💶|Son cincuenta euros.|That’s fifty euros.|Ça fait cinquante euros.
quinientos|five hundred|cinq cents|💯|El hotel está a quinientos metros.|The hotel is five hundred metres away.|L’hôtel est à cinq cents mètres.
un millón|a million|un million|💰|La ciudad tiene un millón de habitantes.|The city has a million inhabitants.|La ville compte un million d’habitants.
primero|first|premier|🥇|Es mi primer viaje a España.|It’s my first trip to Spain.|C’est mon premier voyage en Espagne.
segundo|second|deuxième|🥈|Vivo en el segundo piso.|I live on the second floor.|J’habite au deuxième étage.
tercero|third|troisième|🥉|Llegó en tercer lugar.|He came third.|Il est arrivé troisième.
la mitad|half|la moitié|🌓|Come la mitad de la pizza.|Eat half of the pizza.|Mange la moitié de la pizza.
el número|number|le numéro / le nombre|#️⃣|¿Cuál es tu número de teléfono?|What’s your phone number?|Quel est ton numéro de téléphone ?
contar hasta diez|to count to ten|compter jusqu’à dix|🔟|El niño sabe contar hasta diez.|The child can count to ten.|L’enfant sait compter jusqu’à dix.
`),
  t('A1', 'body2', '💪', 'Face and body', 'Visage et corps', `
la cara|face|le visage|🙂|Tiene una cara muy simpática.|She has a very friendly face.|Elle a un visage très sympathique.
la oreja|ear|l’oreille|👂|Me duele la oreja.|My ear hurts.|J’ai mal à l’oreille.
el diente|tooth|la dent|🦷|Me lavo los dientes tres veces al día.|I brush my teeth three times a day.|Je me brosse les dents trois fois par jour.
la lengua|tongue / language|la langue|👅|El español es una lengua bonita.|Spanish is a beautiful language.|L’espagnol est une belle langue.
el cuello|neck|le cou|🦒|La jirafa tiene el cuello largo.|The giraffe has a long neck.|La girafe a un long cou.
el hombro|shoulder|l’épaule|🤷|Me duele el hombro.|My shoulder hurts.|J’ai mal à l’épaule.
el dedo|finger|le doigt|☝️|Me corté el dedo.|I cut my finger.|Je me suis coupé le doigt.
la rodilla|knee|le genou|🦵|Se hizo daño en la rodilla.|He hurt his knee.|Il s’est fait mal au genou.
la piel|skin|la peau|🧴|Usa crema para la piel.|Use cream for your skin.|Mets de la crème pour la peau.
la sangre|blood|le sang|🩸|Voy a donar sangre.|I’m going to give blood.|Je vais donner mon sang.
el hueso|bone|l’os|🦴|El perro tiene un hueso.|The dog has a bone.|Le chien a un os.
el labio|lip|la lèvre|👄|Tengo los labios secos.|My lips are dry.|J’ai les lèvres sèches.
la barba|beard|la barbe|🧔|Mi padre lleva barba.|My father has a beard.|Mon père porte la barbe.
el cerebro|brain|le cerveau|🧠|El cerebro nunca descansa.|The brain never rests.|Le cerveau ne se repose jamais.
`),
  t('A1', 'weather2', '⛅', 'More weather', 'Encore la météo', `
hace buen tiempo|the weather is nice|il fait beau|🌤️|Hoy hace buen tiempo.|The weather is nice today.|Il fait beau aujourd’hui.
hace mal tiempo|the weather is bad|il fait mauvais|🌧️|Hace mal tiempo para salir.|The weather is too bad to go out.|Il fait trop mauvais pour sortir.
la tormenta|storm|l’orage|⛈️|Anoche hubo una tormenta.|There was a storm last night.|Il y a eu un orage hier soir.
el relámpago|lightning|l’éclair|⚡|Vi un relámpago enorme.|I saw a huge flash of lightning.|J’ai vu un énorme éclair.
la niebla|fog|le brouillard|🌫️|Hay niebla en la carretera.|There’s fog on the road.|Il y a du brouillard sur la route.
el arcoíris|rainbow|l’arc-en-ciel|🌈|¡Mira, un arcoíris!|Look, a rainbow!|Regarde, un arc-en-ciel !
el paraguas|umbrella|le parapluie|☂️|Coge el paraguas, va a llover.|Take the umbrella, it’s going to rain.|Prends le parapluie, il va pleuvoir.
nevar|to snow|neiger|🌨️|En la sierra nieva en invierno.|It snows in the mountains in winter.|Il neige en montagne en hiver.
el grado|degree|le degré|🌡️|Estamos a treinta grados.|It’s thirty degrees.|Il fait trente degrés.
húmedo|humid / damp|humide|💦|El clima aquí es muy húmedo.|The climate here is very humid.|Le climat ici est très humide.
seco|dry|sec|🏜️|El verano es seco en el sur.|Summer is dry in the south.|L’été est sec dans le sud.
el pronóstico|forecast|les prévisions|📺|El pronóstico dice que hará sol.|The forecast says it’ll be sunny.|Les prévisions annoncent du soleil.
`),
  t('A2', 'phone', '📱', 'Phone and internet', 'Téléphone et internet', `
llamar|to call|appeler|📞|Te llamo esta tarde.|I’ll call you this afternoon.|Je t’appelle cet après-midi.
el mensaje|message|le message|💬|Te he mandado un mensaje.|I’ve sent you a message.|Je t’ai envoyé un message.
contestar|to answer|répondre|↩️|No contesta al teléfono.|He’s not answering the phone.|Il ne répond pas au téléphone.
el correo electrónico|email|l’e-mail|📧|Te escribo un correo electrónico.|I’ll write you an email.|Je t’écris un e-mail.
la página web|website|le site web|🌐|La información está en la página web.|The information is on the website.|L’information est sur le site web.
buscar|to look for / search|chercher|🔍|Busca la dirección en internet.|Look up the address online.|Cherche l’adresse sur internet.
la foto de perfil|profile picture|la photo de profil|🤳|Cambié mi foto de perfil.|I changed my profile picture.|J’ai changé ma photo de profil.
el cargador|charger|le chargeur|🔌|¿Tienes un cargador?|Do you have a charger?|Tu as un chargeur ?
la videollamada|video call|l’appel vidéo|📹|Hacemos una videollamada cada domingo.|We do a video call every Sunday.|On fait un appel vidéo chaque dimanche.
el wifi|wifi|le wifi|📶|¿Cuál es la contraseña del wifi?|What’s the wifi password?|Quel est le mot de passe du wifi ?
enviar|to send|envoyer|📤|Envíame la foto, por favor.|Send me the photo, please.|Envoie-moi la photo, s’il te plaît.
recibir|to receive|recevoir|📥|¿Has recibido mi mensaje?|Did you get my message?|Tu as reçu mon message ?
borrar|to delete|effacer / supprimer|🗑️|Borré las fotos sin querer.|I deleted the photos by mistake.|J’ai supprimé les photos sans faire exprès.
el usuario|user|l’utilisateur|👤|Escribe tu nombre de usuario.|Type your username.|Saisis ton nom d’utilisateur.
conectarse|to connect / go online|se connecter|🔗|No me puedo conectar.|I can’t connect.|Je n’arrive pas à me connecter.
el ordenador portátil|laptop|l’ordinateur portable|💻|Trabajo con un ordenador portátil.|I work on a laptop.|Je travaille sur un ordinateur portable.
`),
  t('A2', 'car', '🚗', 'The car and the road', 'La voiture et la route', `
conducir|to drive|conduire|🚗|Aprendí a conducir a los dieciocho.|I learned to drive at eighteen.|J’ai appris à conduire à dix-huit ans.
el carné de conducir|driving licence|le permis de conduire|🪪|¿Tienes carné de conducir?|Do you have a driving licence?|Tu as le permis ?
la carretera|road|la route|🛣️|La carretera tiene muchas curvas.|The road has lots of bends.|La route a beaucoup de virages.
la autopista|motorway|l’autoroute|🛣️|Vamos por la autopista.|We’ll take the motorway.|On prend l’autoroute.
la gasolina|petrol|l’essence|⛽|Hay que echar gasolina.|We need to get petrol.|Il faut mettre de l’essence.
la rueda|wheel / tyre|la roue / le pneu|🛞|Tenemos una rueda pinchada.|We have a flat tyre.|Nous avons un pneu crevé.
aparcar|to park|se garer|🅿️|Es difícil aparcar aquí.|It’s hard to park here.|C’est difficile de se garer ici.
el accidente|accident|l’accident|💥|Hubo un accidente en la autopista.|There was an accident on the motorway.|Il y a eu un accident sur l’autoroute.
la velocidad|speed|la vitesse|🏎️|Reduce la velocidad.|Slow down.|Ralentis.
el taxi|taxi|le taxi|🚕|Cogemos un taxi al hotel.|We’ll take a taxi to the hotel.|On prend un taxi pour l’hôtel.
la moto|motorbike|la moto|🏍️|Va al trabajo en moto.|He rides his motorbike to work.|Il va au travail en moto.
el camión|lorry / truck|le camion|🚚|Un camión bloquea la calle.|A lorry is blocking the street.|Un camion bloque la rue.
el cinturón|seat belt / belt|la ceinture|🔒|Ponte el cinturón.|Put your seat belt on.|Mets ta ceinture.
girar|to turn|tourner|↪️|Gira a la izquierda en la rotonda.|Turn left at the roundabout.|Tourne à gauche au rond-point.
todo recto|straight ahead|tout droit|⬆️|Siga todo recto.|Go straight ahead.|Continuez tout droit.
el kilómetro|kilometre|le kilomètre|📏|Faltan diez kilómetros.|There are ten kilometres to go.|Il reste dix kilomètres.
`),
  t('A2', 'music', '🎵', 'Music and going out', 'Musique et sorties', `
la canción|song|la chanson|🎶|Esta canción me encanta.|I love this song.|J’adore cette chanson.
el cantante|singer|le chanteur|🎤|La cantante tiene una voz increíble.|The singer has an incredible voice.|La chanteuse a une voix incroyable.
la guitarra|guitar|la guitare|🎸|Toco la guitarra desde niño.|I’ve played the guitar since I was a kid.|Je joue de la guitare depuis tout petit.
el piano|piano|le piano|🎹|Mi hija aprende piano.|My daughter is learning piano.|Ma fille apprend le piano.
el tambor|drum|le tambour|🥁|El tambor marca el ritmo.|The drum keeps the beat.|Le tambour donne le rythme.
tocar|to play (an instrument) / to touch|jouer / toucher|🎻|¿Tocas algún instrumento?|Do you play an instrument?|Tu joues d’un instrument ?
cantar|to sing|chanter|🎙️|Cantamos en el coche.|We sing in the car.|Nous chantons dans la voiture.
el grupo|band / group|le groupe|👨‍🎤|Mi grupo favorito es de Bilbao.|My favourite band is from Bilbao.|Mon groupe préféré vient de Bilbao.
la entrada|ticket (show) / entrance|le billet / l’entrée|🎟️|Ya tengo las entradas.|I’ve already got the tickets.|J’ai déjà les billets.
el bar|bar|le bar|🍻|Quedamos en el bar de la esquina.|Let’s meet at the bar on the corner.|On se retrouve au bar du coin.
la discoteca|nightclub|la boîte de nuit|🪩|Fuimos a una discoteca.|We went to a nightclub.|Nous sommes allés en boîte.
el teatro|theatre|le théâtre|🎭|Vamos al teatro el viernes.|We’re going to the theatre on Friday.|Nous allons au théâtre vendredi.
pasarlo bien|to have a good time|bien s’amuser|🥳|¡Que lo pases bien!|Have a great time!|Amuse-toi bien !
el ritmo|rhythm|le rythme|💃|Esta música tiene mucho ritmo.|This music has a great beat.|Cette musique a beaucoup de rythme.
`),
  t('A2', 'cooking', '👩‍🍳', 'Cooking', 'Cuisiner', `
la receta de cocina|recipe|la recette|📖|Es la receta de mi abuela.|It’s my grandmother’s recipe.|C’est la recette de ma grand-mère.
hervir|to boil|bouillir|♨️|Hierve el agua para la pasta.|Boil the water for the pasta.|Fais bouillir l’eau pour les pâtes.
freír|to fry|frire|🍳|Fríe los huevos en aceite.|Fry the eggs in oil.|Fais frire les œufs dans l’huile.
mezclar|to mix|mélanger|🥣|Mezcla la harina con el azúcar.|Mix the flour with the sugar.|Mélange la farine avec le sucre.
añadir|to add|ajouter|➕|Añade un poco de sal.|Add a little salt.|Ajoute un peu de sel.
la harina|flour|la farine|🌾|Necesitamos harina para el pastel.|We need flour for the cake.|Il nous faut de la farine pour le gâteau.
la mantequilla|butter|le beurre|🧈|Tostadas con mantequilla.|Toast with butter.|Des tartines beurrées.
el ajo|garlic|l’ail|🧄|Esta salsa lleva mucho ajo.|This sauce has a lot of garlic.|Cette sauce contient beaucoup d’ail.
el limón|lemon|le citron|🍋|Un poco de limón en el pescado.|A little lemon on the fish.|Un peu de citron sur le poisson.
la pimienta|pepper (spice)|le poivre|🌶️|Sal y pimienta al gusto.|Salt and pepper to taste.|Sel et poivre selon le goût.
el pimiento|pepper (vegetable)|le poivron|🫑|Un pimiento rojo y uno verde.|One red pepper and one green.|Un poivron rouge et un vert.
la miel|honey|le miel|🍯|Té con miel para la garganta.|Tea with honey for your throat.|Du thé au miel pour la gorge.
el chocolate|chocolate|le chocolat|🍫|Un chocolate caliente, por favor.|A hot chocolate, please.|Un chocolat chaud, s’il vous plaît.
el bocadillo|sandwich (baguette)|le sandwich|🥪|Un bocadillo de jamón.|A ham sandwich.|Un sandwich au jambon.
el jamón|ham|le jambon|🍖|El jamón ibérico es famoso.|Iberian ham is famous.|Le jambon ibérique est célèbre.
la gamba|prawn|la crevette|🦐|Paella con gambas.|Paella with prawns.|Une paella aux crevettes.
dulce|sweet|sucré|🍬|Este pastel es muy dulce.|This cake is very sweet.|Ce gâteau est très sucré.
salado|salty|salé|🧂|La sopa está demasiado salada.|The soup is too salty.|La soupe est trop salée.
`),
  t('B1', 'science', '🔬', 'Science and discovery', 'Science et découvertes', `
la ciencia|science|la science|🔬|Me interesa mucho la ciencia.|I’m very interested in science.|La science m’intéresse beaucoup.
el experimento|experiment|l’expérience|🧪|El experimento salió bien.|The experiment worked.|L’expérience a réussi.
la investigación|research|la recherche|🔎|Trabaja en investigación médica.|She works in medical research.|Elle travaille dans la recherche médicale.
el descubrimiento|discovery|la découverte|💡|Fue un descubrimiento importante.|It was an important discovery.|Ce fut une découverte importante.
el planeta|planet|la planète|🪐|Marte es el planeta rojo.|Mars is the red planet.|Mars est la planète rouge.
el espacio|space|l’espace|🚀|Quiere viajar al espacio.|She wants to travel to space.|Elle veut voyager dans l’espace.
el universo|universe|l’univers|🌌|El universo es enorme.|The universe is huge.|L’univers est immense.
el microscopio|microscope|le microscope|🔬|Lo vimos con un microscopio.|We saw it with a microscope.|Nous l’avons vu au microscope.
el virus|virus|le virus|🦠|El virus se transmite por el aire.|The virus spreads through the air.|Le virus se transmet par l’air.
el robot|robot|le robot|🤖|Los robots trabajan en la fábrica.|Robots work in the factory.|Les robots travaillent dans l’usine.
la inteligencia artificial|artificial intelligence|l’intelligence artificielle|🧠|La inteligencia artificial cambia el trabajo.|AI is changing work.|L’intelligence artificielle change le travail.
el dato|piece of data|la donnée|📊|Los datos confirman la teoría.|The data confirm the theory.|Les données confirment la théorie.
la teoría|theory|la théorie|📐|Es solo una teoría.|It’s just a theory.|Ce n’est qu’une théorie.
demostrar|to prove / to show|démontrer|✅|Demostraron que el método funciona.|They proved the method works.|Ils ont démontré que la méthode fonctionne.
inventar|to invent|inventer|🛠️|¿Quién inventó el teléfono?|Who invented the telephone?|Qui a inventé le téléphone ?
el avance|advance / progress|l’avancée|📈|Un gran avance para la medicina.|A big advance for medicine.|Une grande avancée pour la médecine.
`),
  t('B1', 'history', '🏺', 'History and heritage', 'Histoire et patrimoine', `
la época|era / period|l’époque|⏳|En aquella época no había internet.|Back then there was no internet.|À cette époque, il n’y avait pas internet.
antiguo|ancient / old|ancien|🏛️|Es una ciudad muy antigua.|It’s a very old city.|C’est une ville très ancienne.
el castillo|castle|le château|🏰|Visitamos un castillo medieval.|We visited a medieval castle.|Nous avons visité un château médiéval.
el rey|king|le roi|🤴|El rey vivía en el palacio.|The king lived in the palace.|Le roi vivait au palais.
la reina|queen|la reine|👸|La reina Isabel apoyó el viaje.|Queen Isabella backed the voyage.|La reine Isabelle a soutenu le voyage.
la guerra|war|la guerre|⚔️|La guerra duró tres años.|The war lasted three years.|La guerre a duré trois ans.
la paz|peace|la paix|🕊️|Firmaron la paz en 1648.|They signed the peace in 1648.|Ils ont signé la paix en 1648.
el imperio|empire|l’empire|👑|El Imperio romano llegó a Hispania.|The Roman Empire reached Hispania.|L’Empire romain est arrivé en Hispanie.
las ruinas|ruins|les ruines|🏚️|Las ruinas romanas están cerca.|The Roman ruins are nearby.|Les ruines romaines sont tout près.
el monumento|monument|le monument|🗿|Es el monumento más visitado.|It’s the most visited monument.|C’est le monument le plus visité.
la catedral|cathedral|la cathédrale|⛪|La catedral tardó siglos en terminarse.|The cathedral took centuries to finish.|La cathédrale a mis des siècles à être achevée.
la independencia|independence|l’indépendance|🗽|Celebran el día de la independencia.|They celebrate independence day.|Ils fêtent le jour de l’indépendance.
la revolución|revolution|la révolution|🔥|La revolución cambió el país.|The revolution changed the country.|La révolution a changé le pays.
el patrimonio|heritage|le patrimoine|🏺|Es patrimonio de la humanidad.|It’s a World Heritage Site.|C’est un patrimoine de l’humanité.
conquistar|to conquer|conquérir|🛡️|Los romanos conquistaron la península.|The Romans conquered the peninsula.|Les Romains ont conquis la péninsule.
la leyenda|legend|la légende|📜|Hay una leyenda sobre este puente.|There’s a legend about this bridge.|Il y a une légende sur ce pont.
`),
];
