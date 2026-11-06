import { words, type Level, type Topic } from '@/data/learn/full';

/** Spanish, pack 3: the most frequent verbs, little words that glue sentences, everyday objects, work tools, nature verbs. Original content. */
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level, icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs2', '🔁', 'More everyday verbs', 'Encore des verbes', `
dar|to give|donner|🎁|Dame la mano.|Give me your hand.|Donne-moi la main.
decir|to say / to tell|dire|🗨️|¿Qué dices?|What are you saying?|Qu’est-ce que tu dis ?
poner|to put|mettre|📥|Pon las llaves en la mesa.|Put the keys on the table.|Mets les clés sur la table.
traer|to bring|apporter|🧺|¿Qué traigo a la cena?|What shall I bring to dinner?|J’apporte quoi au dîner ?
llevar a|to take (someone/something) to|emmener / porter|🚙|Te llevo a la estación.|I’ll take you to the station.|Je t’emmène à la gare.
buscar a alguien|to pick someone up|aller chercher quelqu’un|🙋|Voy a buscar a los niños.|I’m going to pick up the kids.|Je vais chercher les enfants.
encontrar|to find|trouver|🔎|No encuentro mi móvil.|I can’t find my phone.|Je ne trouve pas mon portable.
mirar|to look at|regarder|👁️|Mira esa casa.|Look at that house.|Regarde cette maison.
escuchar|to listen|écouter|🎧|Escucho la radio en el coche.|I listen to the radio in the car.|J’écoute la radio en voiture.
oír|to hear|entendre|👂|¿Me oyes bien?|Can you hear me OK?|Tu m’entends bien ?
caminar|to walk|marcher|🚶|Camino una hora al día.|I walk an hour a day.|Je marche une heure par jour.
subir|to go up|monter|⬆️|Subimos a la torre.|We went up the tower.|Nous sommes montés à la tour.
bajar|to go down|descendre|⬇️|Bajo en la próxima parada.|I’m getting off at the next stop.|Je descends au prochain arrêt.
entrar|to go in|entrer|🚪|Entra, está abierto.|Come in, it’s open.|Entre, c’est ouvert.
esperar a|to wait for|attendre|⏳|Te espero en la puerta.|I’ll wait for you at the door.|Je t’attends à la porte.
ayudar|to help|aider|🆘|¿Te puedo ayudar?|Can I help you?|Je peux t’aider ?
necesitar|to need|avoir besoin de|🙏|Necesito un descanso.|I need a break.|J’ai besoin d’une pause.
gustar|to like (to please)|plaire / aimer|❤️|Me gusta el chocolate.|I like chocolate.|J’aime le chocolat.
preferir|to prefer|préférer|⚖️|Prefiero el té.|I prefer tea.|Je préfère le thé.
jugar|to play (a game)|jouer|🎲|Los niños juegan en el patio.|The children play in the yard.|Les enfants jouent dans la cour.
usar|to use|utiliser|🧰|¿Puedo usar tu ordenador?|Can I use your computer?|Je peux utiliser ton ordinateur ?
empezar|to begin|commencer|🏁|La película empieza a las diez.|The film starts at ten.|Le film commence à dix heures.
terminar|to finish|finir|🔚|¿Cuándo terminas de trabajar?|When do you finish work?|Tu finis le travail à quelle heure ?
llamarse|to be called|s’appeler|🏷️|Me llamo Lucía.|My name is Lucía.|Je m’appelle Lucía.
`),
  t('A1', 'little', '🧩', 'Little linking words', 'Petits mots utiles', `
y|and|et|➕|Pan y queso.|Bread and cheese.|Du pain et du fromage.
o|or|ou|🔀|¿Té o café?|Tea or coffee?|Thé ou café ?
pero|but|mais|↔️|Es caro, pero es bueno.|It’s expensive, but it’s good.|C’est cher, mais c’est bon.
con|with|avec|🤝|Café con leche.|Coffee with milk.|Café au lait.
sin|without|sans|🚫|Agua sin gas, por favor.|Still water, please.|De l’eau plate, s’il vous plaît.
muy|very|très|🔝|Está muy bueno.|It’s very good.|C’est très bon.
mucho|a lot / much|beaucoup|📦|Te quiero mucho.|I love you a lot.|Je t’aime beaucoup.
poco|little / few|peu|🤏|Hablo un poco de español.|I speak a little Spanish.|Je parle un peu espagnol.
también|also / too|aussi|🙌|Yo también quiero ir.|I want to go too.|Moi aussi, je veux y aller.
tampoco|neither / not either|non plus|🙅|Yo tampoco lo sé.|I don’t know either.|Moi non plus, je ne sais pas.
aquí|here|ici|📍|Estoy aquí.|I’m here.|Je suis ici.
allí|there|là-bas|👉|El hotel está allí.|The hotel is over there.|L’hôtel est là-bas.
ahora|now|maintenant|⏰|Ahora no puedo.|I can’t right now.|Je ne peux pas maintenant.
todavía|still / yet|encore|⌛|Todavía no he comido.|I haven’t eaten yet.|Je n’ai pas encore mangé.
ya|already|déjà|✔️|Ya he terminado.|I’ve already finished.|J’ai déjà fini.
otra vez|again|encore une fois|🔁|¿Puedes decirlo otra vez?|Can you say it again?|Tu peux le redire ?
juntos|together|ensemble|👫|Cenamos juntos.|We have dinner together.|Nous dînons ensemble.
solo|alone / only|seul / seulement|🧍|Vivo solo.|I live alone.|J’habite seul.
`),
  t('A1', 'things', '🧸', 'Everyday things', 'Objets du quotidien', `
el teléfono|telephone|le téléphone|☎️|El teléfono está sonando.|The phone is ringing.|Le téléphone sonne.
el reloj|watch / clock|la montre / l’horloge|⌚|Mi reloj va cinco minutos tarde.|My watch is five minutes slow.|Ma montre retarde de cinq minutes.
la cartera|wallet|le portefeuille|👛|He perdido la cartera.|I’ve lost my wallet.|J’ai perdu mon portefeuille.
el dinero en efectivo|cash money|l’argent liquide|💶|No llevo dinero en efectivo.|I don’t carry cash.|Je n’ai pas d’argent liquide.
la caja|box|la boîte|📦|Pon los libros en la caja.|Put the books in the box.|Mets les livres dans la boîte.
el papel|paper|le papier|📄|Necesito papel para escribir.|I need paper to write.|J’ai besoin de papier pour écrire.
las tijeras|scissors|les ciseaux|✂️|¿Dónde están las tijeras?|Where are the scissors?|Où sont les ciseaux ?
la vela|candle / sail|la bougie / la voile|🕯️|Encendemos una vela.|We light a candle.|Nous allumons une bougie.
el jabón|soap|le savon|🧼|Lávate las manos con jabón.|Wash your hands with soap.|Lave-toi les mains avec du savon.
el cepillo de dientes|toothbrush|la brosse à dents|🪥|Olvidé el cepillo de dientes.|I forgot my toothbrush.|J’ai oublié ma brosse à dents.
la almohada|pillow|l’oreiller|🛏️|Esta almohada es muy blanda.|This pillow is very soft.|Cet oreiller est très mou.
la manta|blanket|la couverture|🧶|Dame otra manta, tengo frío.|Give me another blanket, I’m cold.|Donne-moi une autre couverture, j’ai froid.
el sofá|sofa|le canapé|🛋️|Me quedé dormido en el sofá.|I fell asleep on the sofa.|Je me suis endormi sur le canapé.
la televisión en casa|the TV set|la télé|📺|Apaga la tele, por favor.|Turn off the TV, please.|Éteins la télé, s’il te plaît.
el juguete|toy|le jouet|🧸|Los juguetes están por el suelo.|The toys are all over the floor.|Les jouets traînent par terre.
la pelota|ball (small)|la balle|⚾|El perro juega con la pelota.|The dog plays with the ball.|Le chien joue avec la balle.
el globo|balloon|le ballon de baudruche|🎈|Compramos globos para la fiesta.|We bought balloons for the party.|Nous avons acheté des ballons pour la fête.
la cámara|camera|l’appareil photo|📷|Llevo la cámara a todas partes.|I take my camera everywhere.|J’emporte mon appareil photo partout.
`),
  t('A2', 'office', '🖇️', 'Office and tools', 'Bureau et outils', `
la impresora|printer|l’imprimante|🖨️|La impresora no tiene papel.|The printer is out of paper.|L’imprimante n’a plus de papier.
imprimir|to print|imprimer|🖨️|¿Puedes imprimir el informe?|Can you print the report?|Tu peux imprimer le rapport ?
el informe|report|le rapport|📊|Tengo que entregar el informe hoy.|I have to hand in the report today.|Je dois rendre le rapport aujourd’hui.
la carpeta|folder|le dossier|📁|Guarda el documento en la carpeta.|Save the document in the folder.|Enregistre le document dans le dossier.
el documento|document|le document|📄|Firma el documento aquí.|Sign the document here.|Signe le document ici.
la calculadora|calculator|la calculatrice|🧮|Usa la calculadora.|Use the calculator.|Utilise la calculatrice.
el calendario|calendar|le calendrier|📅|Lo apunto en el calendario.|I’ll put it in the calendar.|Je le note dans le calendrier.
el martillo|hammer|le marteau|🔨|Necesito un martillo y clavos.|I need a hammer and nails.|J’ai besoin d’un marteau et de clous.
la herramienta|tool|l’outil|🛠️|Guarda las herramientas en la caja.|Put the tools away in the box.|Range les outils dans la boîte.
el destornillador|screwdriver|le tournevis|🪛|¿Me pasas el destornillador?|Can you pass me the screwdriver?|Tu me passes le tournevis ?
la escoba|broom|le balai|🧹|La escoba está detrás de la puerta.|The broom is behind the door.|Le balai est derrière la porte.
el cubo|bucket|le seau|🪣|Llena el cubo de agua.|Fill the bucket with water.|Remplis le seau d’eau.
la bombilla|light bulb|l’ampoule|💡|Hay que cambiar la bombilla.|The light bulb needs changing.|Il faut changer l’ampoule.
el enchufe|plug / socket|la prise|🔌|El enchufe no funciona.|The socket doesn’t work.|La prise ne marche pas.
la pila|battery (small)|la pile|🔋|El mando necesita pilas.|The remote needs batteries.|La télécommande a besoin de piles.
el candado|padlock|le cadenas|🔐|Cierra la bici con candado.|Lock the bike with a padlock.|Attache le vélo avec un cadenas.
`),
  t('A2', 'beach', '🏖️', 'At the seaside', 'Au bord de la mer', `
la ola|wave|la vague|🌊|Hoy hay olas grandes.|There are big waves today.|Il y a de grosses vagues aujourd’hui.
el bañador|swimsuit|le maillot de bain|🩱|Olvidé el bañador.|I forgot my swimsuit.|J’ai oublié mon maillot de bain.
la crema solar|sun cream|la crème solaire|🧴|Ponte crema solar.|Put on some sun cream.|Mets de la crème solaire.
la sombrilla|beach umbrella|le parasol|⛱️|Ponemos la sombrilla aquí.|Let’s put the umbrella here.|On met le parasol ici.
la toalla de playa|beach towel|la serviette de plage|🏖️|Mi toalla de playa es de rayas.|My beach towel is striped.|Ma serviette de plage est à rayures.
el barco|boat|le bateau|⛵|Dimos un paseo en barco.|We took a boat trip.|Nous avons fait une balade en bateau.
el puerto|port / harbour|le port|⚓|El puerto está lleno de barcos.|The harbour is full of boats.|Le port est plein de bateaux.
la concha|shell|le coquillage|🐚|La niña recoge conchas.|The girl collects shells.|La fille ramasse des coquillages.
el cangrejo|crab|le crabe|🦀|Un cangrejo en la roca.|A crab on the rock.|Un crabe sur le rocher.
el delfín|dolphin|le dauphin|🐬|Vimos delfines desde el barco.|We saw dolphins from the boat.|Nous avons vu des dauphins depuis le bateau.
el tiburón|shark|le requin|🦈|No hay tiburones en esta playa.|There are no sharks on this beach.|Il n’y a pas de requins sur cette plage.
el socorrista|lifeguard|le maître-nageur|🛟|El socorrista vigila la playa.|The lifeguard watches the beach.|Le maître-nageur surveille la plage.
tomar el sol|to sunbathe|bronzer|😎|Me encanta tomar el sol.|I love sunbathing.|J’adore bronzer.
bucear|to dive / snorkel|plonger|🤿|Fuimos a bucear entre los peces.|We went diving among the fish.|Nous sommes allés plonger parmi les poissons.
quemarse|to get sunburnt|prendre un coup de soleil|🥵|Me quemé la espalda.|I got sunburnt on my back.|J’ai pris un coup de soleil dans le dos.
la costa|coast|la côte|🏝️|Vivimos en la costa.|We live on the coast.|Nous vivons sur la côte.
`),
  t('B1', 'mind', '🧠', 'Thinking and feeling', 'Penser et ressentir', `
la idea|idea|l’idée|💡|¡Qué buena idea!|What a good idea!|Quelle bonne idée !
la duda|doubt|le doute|🤔|Tengo una duda sobre el contrato.|I have a question about the contract.|J’ai un doute sur le contrat.
dudar|to doubt|douter|🤨|Dudo que llegue a tiempo.|I doubt he’ll arrive on time.|Je doute qu’il arrive à l’heure.
imaginar|to imagine|imaginer|🌈|Imagina una ciudad sin coches.|Imagine a city without cars.|Imagine une ville sans voitures.
decidir|to decide|décider|🎯|Todavía no he decidido.|I haven’t decided yet.|Je n’ai pas encore décidé.
la decisión|decision|la décision|⚖️|Fue una decisión difícil.|It was a hard decision.|Ce fut une décision difficile.
sentir|to feel / to be sorry|sentir / regretter|💗|Lo siento mucho.|I’m very sorry.|Je suis vraiment désolé.
sentirse|to feel (a way)|se sentir|🌡️|Me siento mucho mejor.|I feel much better.|Je me sens beaucoup mieux.
la esperanza|hope|l’espoir|🌅|Nunca pierdas la esperanza.|Never lose hope.|Ne perds jamais espoir.
la memoria|memory|la mémoire|🗃️|Tengo muy mala memoria.|I have a terrible memory.|J’ai une très mauvaise mémoire.
la mente|mind|l’esprit|🧠|Tengo la mente en blanco.|My mind has gone blank.|J’ai un trou de mémoire.
el sentimiento|feeling|le sentiment|💞|Es difícil expresar los sentimientos.|It’s hard to express your feelings.|C’est difficile d’exprimer ses sentiments.
la emoción|emotion / excitement|l’émotion|🥹|Lloró de emoción.|She cried with emotion.|Elle a pleuré d’émotion.
la culpa|blame / guilt|la faute / la culpabilité|😔|No es culpa tuya.|It’s not your fault.|Ce n’est pas ta faute.
arrepentirse|to regret|regretter|😞|No me arrepiento de nada.|I don’t regret anything.|Je ne regrette rien.
confiar|to trust|faire confiance|🤝|Confío en ti.|I trust you.|J’ai confiance en toi.
la paciencia|patience|la patience|🧘|Hay que tener paciencia.|You need to be patient.|Il faut être patient.
el humor|humour / mood|l’humour / l’humeur|😄|Hoy estoy de buen humor.|I’m in a good mood today.|Aujourd’hui, je suis de bonne humeur.
`),
  t('B1', 'nature3', '🌍', 'The natural world', 'Le monde naturel', `
el clima|climate|le climat|🌡️|El clima está cambiando.|The climate is changing.|Le climat change.
el desierto|desert|le désert|🏜️|El desierto de Tabernas está en Almería.|The Tabernas desert is in Almería.|Le désert de Tabernas est à Almería.
la selva|jungle / rainforest|la jungle / la forêt tropicale|🌴|La selva amazónica es enorme.|The Amazon rainforest is huge.|La forêt amazonienne est immense.
el volcán|volcano|le volcan|🌋|Canarias tiene volcanes activos.|The Canaries have active volcanoes.|Les Canaries ont des volcans actifs.
el terremoto|earthquake|le tremblement de terre|🫨|Hubo un terremoto en el sur.|There was an earthquake in the south.|Il y a eu un tremblement de terre dans le sud.
la inundación|flood|l’inondation|🌊|La inundación destruyó varias casas.|The flood destroyed several houses.|L’inondation a détruit plusieurs maisons.
el incendio|fire (blaze)|l’incendie|🔥|El incendio quemó mil hectáreas.|The fire burned a thousand hectares.|L’incendie a brûlé mille hectares.
la especie|species|l’espèce|🦎|Es una especie en peligro.|It’s an endangered species.|C’est une espèce menacée.
el lobo|wolf|le loup|🐺|El lobo vive en el norte.|The wolf lives in the north.|Le loup vit dans le nord.
el águila|eagle|l’aigle|🦅|Un águila vuela sobre la montaña.|An eagle flies over the mountain.|Un aigle vole au-dessus de la montagne.
la abeja|bee|l’abeille|🐝|Las abejas son esenciales.|Bees are essential.|Les abeilles sont essentielles.
la semilla|seed|la graine|🌰|Plantamos semillas en primavera.|We plant seeds in spring.|Nous plantons des graines au printemps.
crecer|to grow|grandir / pousser|🌱|Los tomates crecen rápido.|Tomatoes grow fast.|Les tomates poussent vite.
plantar|to plant|planter|🪴|Hemos plantado un olivo.|We’ve planted an olive tree.|Nous avons planté un olivier.
el paisaje|landscape|le paysage|🏞️|¡Qué paisaje tan bonito!|What a beautiful landscape!|Quel beau paysage !
la naturaleza|nature|la nature|🍃|Me encanta estar en la naturaleza.|I love being in nature.|J’adore être dans la nature.
`),
];
