import { words, type Level, type Topic } from '@/data/learn/full';

/** Spanish, pack 4: fruit and veg, drinks, people and looks, the street, emergencies, banking, the airport, the arts, verbs of change. Original content. */
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level, icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('A1', 'fruitveg', '🍉', 'Fruit and vegetables', 'Fruits et légumes', `
la sandía|watermelon|la pastèque|🍉|En verano comemos sandía.|In summer we eat watermelon.|En été, on mange de la pastèque.
el melón|melon|le melon|🍈|Este melón está muy dulce.|This melon is very sweet.|Ce melon est très sucré.
la piña|pineapple|l’ananas|🍍|Un zumo de piña, por favor.|A pineapple juice, please.|Un jus d’ananas, s’il vous plaît.
el melocotón|peach|la pêche|🍑|Los melocotones de Aragón son famosos.|Aragon peaches are famous.|Les pêches d’Aragon sont célèbres.
la pera|pear|la poire|🍐|Prefiero las peras a las manzanas.|I prefer pears to apples.|Je préfère les poires aux pommes.
la cereza|cherry|la cerise|🍒|Las cerezas del Jerte son riquísimas.|Jerte cherries are delicious.|Les cerises du Jerte sont délicieuses.
el coco|coconut|la noix de coco|🥥|Agua de coco bien fría.|Ice-cold coconut water.|De l’eau de coco bien fraîche.
el aguacate|avocado|l’avocat|🥑|Tostada con aguacate.|Avocado toast.|Une tartine à l’avocat.
el mango|mango|la mangue|🥭|El mango está maduro.|The mango is ripe.|La mangue est mûre.
el kiwi|kiwi|le kiwi|🥝|Un kiwi tiene mucha vitamina C.|A kiwi has lots of vitamin C.|Un kiwi contient beaucoup de vitamine C.
la lechuga|lettuce|la laitue|🥬|Lava bien la lechuga.|Wash the lettuce well.|Lave bien la laitue.
el pepino|cucumber|le concombre|🥒|El gazpacho lleva pepino.|Gazpacho has cucumber in it.|Le gaspacho contient du concombre.
el maíz|corn|le maïs|🌽|Una ensalada con maíz.|A salad with corn.|Une salade au maïs.
el brócoli|broccoli|le brocoli|🥦|Los niños no quieren brócoli.|The children don’t want broccoli.|Les enfants ne veulent pas de brocoli.
la berenjena|aubergine|l’aubergine|🍆|Berenjenas con miel, de Córdoba.|Aubergines with honey, from Córdoba.|Des aubergines au miel, de Cordoue.
la seta|mushroom|le champignon|🍄|En otoño buscamos setas.|In autumn we look for mushrooms.|En automne, on cherche des champignons.
los cacahuetes|peanuts|les cacahuètes|🥜|Unos cacahuetes con la cerveza.|Some peanuts with the beer.|Des cacahuètes avec la bière.
las aceitunas|olives|les olives|🫒|Una tapa de aceitunas.|A tapa of olives.|Une tapa d’olives.
`),
  t('A1', 'drinks', '🥤', 'Drinks', 'Les boissons', `
la cerveza|beer|la bière|🍺|Una cerveza bien fría.|An ice-cold beer.|Une bière bien fraîche.
el vino|wine|le vin|🍷|¿Vino tinto o blanco?|Red or white wine?|Vin rouge ou blanc ?
el refresco|soft drink|le soda|🥤|Un refresco de limón.|A lemon soda.|Un soda au citron.
el agua con gas|sparkling water|l’eau gazeuse|🫧|Prefiero agua con gas.|I prefer sparkling water.|Je préfère l’eau gazeuse.
el batido|milkshake|le milk-shake|🥤|Un batido de fresa.|A strawberry milkshake.|Un milk-shake à la fraise.
el hielo|ice|la glace / les glaçons|🧊|Con hielo, por favor.|With ice, please.|Avec des glaçons, s’il vous plaît.
el cava|cava (sparkling wine)|le cava|🥂|Brindamos con cava.|We toast with cava.|Nous trinquons au cava.
brindar|to toast|trinquer|🥂|¡Brindemos por los novios!|Let’s toast the bride and groom!|Trinquons aux mariés !
tener sed|to be thirsty|avoir soif|🥵|Tengo mucha sed.|I’m very thirsty.|J’ai très soif.
tener hambre|to be hungry|avoir faim|😋|¿Tienes hambre?|Are you hungry?|Tu as faim ?
el cóctel|cocktail|le cocktail|🍹|Un cóctel sin alcohol.|An alcohol-free cocktail.|Un cocktail sans alcool.
la jarra|jug|la carafe|🫗|Una jarra de agua para la mesa.|A jug of water for the table.|Une carafe d’eau pour la table.
`),
  t('A1', 'looks', '💇', 'What people look like', 'L’apparence', `
rubio|blond|blond|👱|Mi hermana es rubia.|My sister is blonde.|Ma sœur est blonde.
moreno|dark-haired / tanned|brun / bronzé|🧑🏽|Es moreno y lleva gafas.|He’s dark-haired and wears glasses.|Il est brun et porte des lunettes.
pelirrojo|red-haired|roux|👩‍🦰|El niño pelirrojo es mi sobrino.|The red-haired boy is my nephew.|Le garçon roux est mon neveu.
delgado|slim|mince|🧍|Es alto y delgado.|He’s tall and slim.|Il est grand et mince.
gordo|fat|gros|🍔|El gato está muy gordo.|The cat is very fat.|Le chat est très gros.
guapo|good-looking|beau|😍|¡Qué guapo estás hoy!|You look great today!|Tu es très beau aujourd’hui !
joven|young|jeune|🧒|Es muy joven para ser médico.|He’s very young to be a doctor.|Il est très jeune pour être médecin.
mayor|older / elderly|plus âgé / âgé|👵|Mi abuela es mayor, pero muy activa.|My grandmother is elderly but very active.|Ma grand-mère est âgée mais très active.
el pelo rizado|curly hair|les cheveux bouclés|👩‍🦱|Tiene el pelo rizado y largo.|She has long curly hair.|Elle a les cheveux longs et bouclés.
calvo|bald|chauve|👨‍🦲|Mi padre es calvo.|My father is bald.|Mon père est chauve.
los ojos azules|blue eyes|les yeux bleus|👁️|Tiene los ojos azules.|She has blue eyes.|Elle a les yeux bleus.
parecerse a|to look like|ressembler à|🪞|Te pareces mucho a tu madre.|You look a lot like your mother.|Tu ressembles beaucoup à ta mère.
`),
  t('A2', 'emergency', '🚨', 'Emergencies', 'Les urgences', `
¡socorro!|help!|au secours !|🆘|¡Socorro! ¡Ayúdenme!|Help! Help me!|Au secours ! Aidez-moi !
el peligro|danger|le danger|⚠️|Cuidado, hay peligro.|Careful, it’s dangerous.|Attention, c’est dangereux.
¡cuidado!|careful!|attention !|⚠️|¡Cuidado con el escalón!|Mind the step!|Attention à la marche !
robar|to steal / to rob|voler|🦹|Me han robado el bolso.|My bag has been stolen.|On m’a volé mon sac.
el ladrón|thief|le voleur|🥷|La policía detuvo al ladrón.|The police arrested the thief.|La police a arrêté le voleur.
la denuncia|police report|la plainte|📝|Quiero poner una denuncia.|I want to report a crime.|Je veux porter plainte.
la comisaría|police station|le commissariat|🚓|¿Dónde está la comisaría?|Where is the police station?|Où est le commissariat ?
el fuego|fire|le feu|🔥|¡Fuego! ¡Salgan todos!|Fire! Everybody out!|Au feu ! Sortez tous !
el extintor|fire extinguisher|l’extincteur|🧯|El extintor está junto a la puerta.|The extinguisher is by the door.|L’extincteur est près de la porte.
la salida de emergencia|emergency exit|la sortie de secours|🚪|Use la salida de emergencia.|Use the emergency exit.|Utilisez la sortie de secours.
herido|injured|blessé|🤕|Hay dos personas heridas.|Two people are injured.|Il y a deux blessés.
el botiquín|first-aid kit|la trousse de secours|⛑️|Trae el botiquín.|Bring the first-aid kit.|Apporte la trousse de secours.
la embajada|embassy|l’ambassade|🏳️|Llame a su embajada.|Call your embassy.|Appelez votre ambassade.
perder el pasaporte|to lose your passport|perdre son passeport|🛂|He perdido el pasaporte.|I’ve lost my passport.|J’ai perdu mon passeport.
`),
  t('A2', 'bank', '🏦', 'At the bank', 'À la banque', `
el cajero automático|cash machine|le distributeur|🏧|¿Hay un cajero automático cerca?|Is there a cash machine nearby?|Il y a un distributeur près d’ici ?
sacar dinero|to withdraw money|retirer de l’argent|💶|Necesito sacar dinero.|I need to withdraw money.|Je dois retirer de l’argent.
ingresar|to pay in|déposer|📥|Quiero ingresar este cheque.|I want to pay in this cheque.|Je voudrais déposer ce chèque.
la transferencia|bank transfer|le virement|🔁|Te hago una transferencia.|I’ll send you a bank transfer.|Je te fais un virement.
la moneda|coin / currency|la pièce / la monnaie|🪙|No tengo monedas.|I don’t have any coins.|Je n’ai pas de pièces.
el billete de banco|banknote|le billet de banque|💵|Un billete de veinte euros.|A twenty-euro note.|Un billet de vingt euros.
el saldo|balance|le solde|📊|Consulto el saldo en el móvil.|I check my balance on my phone.|Je consulte mon solde sur mon portable.
el pin|PIN|le code|🔢|Introduzca su pin.|Enter your PIN.|Saisissez votre code.
cobrar|to charge / to get paid|encaisser / toucher|💳|Cobro a final de mes.|I get paid at the end of the month.|Je suis payé à la fin du mois.
la comisión|fee / commission|les frais|💸|El banco cobra una comisión.|The bank charges a fee.|La banque prend des frais.
la hipoteca|mortgage|le prêt immobilier|🏠|Pagamos la hipoteca cada mes.|We pay the mortgage every month.|Nous remboursons le prêt chaque mois.
el cambio de moneda|currency exchange|le change|💱|¿Dónde hay un cambio de moneda?|Where can I change money?|Où y a-t-il un bureau de change ?
`),
  t('A2', 'airport', '🛫', 'At the airport', 'À l’aéroport', `
facturar|to check in (bags)|enregistrer|🧳|Tengo que facturar la maleta.|I have to check my suitcase.|Je dois enregistrer ma valise.
la tarjeta de embarque|boarding pass|la carte d’embarquement|🎫|Su tarjeta de embarque, por favor.|Your boarding pass, please.|Votre carte d’embarquement, s’il vous plaît.
la puerta de embarque|gate|la porte d’embarquement|🚪|Embarcamos por la puerta doce.|We board at gate twelve.|Nous embarquons porte douze.
despegar|to take off|décoller|🛫|El avión despega a las diez.|The plane takes off at ten.|L’avion décolle à dix heures.
aterrizar|to land|atterrir|🛬|Aterrizamos en Madrid.|We land in Madrid.|Nous atterrissons à Madrid.
el equipaje de mano|hand luggage|le bagage à main|👜|Solo llevo equipaje de mano.|I only have hand luggage.|Je n’ai qu’un bagage à main.
el control de seguridad|security check|le contrôle de sécurité|🛃|Hay mucha cola en el control de seguridad.|There’s a long queue at security.|Il y a beaucoup de queue au contrôle de sécurité.
la aduana|customs|la douane|🛃|¿Algo que declarar en la aduana?|Anything to declare at customs?|Quelque chose à déclarer à la douane ?
el asiento|seat|le siège|💺|¿Ventanilla o pasillo?|Window or aisle?|Hublot ou couloir ?
el piloto|pilot|le pilote|🧑‍✈️|El piloto habla por los altavoces.|The pilot speaks over the speakers.|Le pilote parle dans les haut-parleurs.
la escala|stopover|l’escale|🔁|Hacemos escala en Lisboa.|We have a stopover in Lisbon.|Nous faisons escale à Lisbonne.
cancelar|to cancel|annuler|❌|Han cancelado el vuelo.|They’ve cancelled the flight.|Ils ont annulé le vol.
la cola|queue|la file d’attente|🧍‍♂️|Hay mucha cola.|There’s a long queue.|Il y a beaucoup de monde dans la file.
`),
  t('B1', 'arts', '🎨', 'The arts', 'Les arts', `
la pintura|painting|la peinture|🖼️|Me encanta la pintura de Sorolla.|I love Sorolla’s painting.|J’adore la peinture de Sorolla.
el cuadro|picture / painting|le tableau|🖼️|El cuadro está en el Prado.|The painting is in the Prado.|Le tableau est au Prado.
el pintor|painter|le peintre|🧑‍🎨|Goya fue un gran pintor.|Goya was a great painter.|Goya fut un grand peintre.
la escultura|sculpture|la sculpture|🗿|Una escultura de bronce.|A bronze sculpture.|Une sculpture en bronze.
la novela|novel|le roman|📘|Estoy leyendo una novela negra.|I’m reading a crime novel.|Je lis un roman policier.
el poema|poem|le poème|📜|Lorca escribió poemas preciosos.|Lorca wrote beautiful poems.|Lorca a écrit de magnifiques poèmes.
el autor|author|l’auteur|✒️|¿Quién es el autor del libro?|Who’s the author of the book?|Qui est l’auteur du livre ?
el director de cine|film director|le réalisateur|🎬|Almodóvar es un director de cine famoso.|Almodóvar is a famous film director.|Almodóvar est un réalisateur célèbre.
el actor|actor|l’acteur|🎭|La actriz ganó un premio.|The actress won an award.|L’actrice a gagné un prix.
el premio|prize / award|le prix|🏅|Ganó el premio a la mejor película.|It won best film.|Il a gagné le prix du meilleur film.
el estreno|premiere / release|la première / la sortie|🎞️|El estreno es el viernes.|It comes out on Friday.|La sortie est vendredi.
la crítica|review / criticism|la critique|⭐|La película tuvo buenas críticas.|The film got good reviews.|Le film a eu de bonnes critiques.
el escenario|stage|la scène|🎪|Los músicos salen al escenario.|The musicians come out on stage.|Les musiciens montent sur scène.
el público|audience|le public|👏|El público aplaudió diez minutos.|The audience applauded for ten minutes.|Le public a applaudi dix minutes.
la galería|gallery|la galerie|🏛️|Inauguran una galería nueva.|A new gallery is opening.|Une nouvelle galerie ouvre.
inspirarse|to be inspired|s’inspirer|✨|Se inspiró en su infancia.|She was inspired by her childhood.|Elle s’est inspirée de son enfance.
`),
  t('B1', 'change', '🔄', 'Change and progress', 'Changement et progrès', `
cambiar de opinión|to change your mind|changer d’avis|🔄|He cambiado de opinión.|I’ve changed my mind.|J’ai changé d’avis.
mejorar|to improve|améliorer|📈|Quiero mejorar mi español.|I want to improve my Spanish.|Je veux améliorer mon espagnol.
empeorar|to get worse|empirer|📉|El tiempo va a empeorar.|The weather is going to get worse.|Le temps va se dégrader.
aumentar|to increase|augmenter|⬆️|Los precios han aumentado.|Prices have gone up.|Les prix ont augmenté.
disminuir|to decrease|diminuer|⬇️|El paro ha disminuido.|Unemployment has fallen.|Le chômage a diminué.
desarrollar|to develop|développer|🏗️|Desarrollan una app nueva.|They’re developing a new app.|Ils développent une nouvelle appli.
lograr|to achieve|réussir à / obtenir|🎯|Logró terminar la carrera.|She managed to finish her degree.|Elle a réussi à finir ses études.
el objetivo|goal / aim|l’objectif|🎯|Mi objetivo es hablar con fluidez.|My goal is to speak fluently.|Mon objectif est de parler couramment.
el reto|challenge|le défi|🧗|Aprender un idioma es un reto.|Learning a language is a challenge.|Apprendre une langue est un défi.
superar|to overcome|surmonter|🏔️|Superó el miedo a volar.|She overcame her fear of flying.|Elle a surmonté sa peur de l’avion.
adaptarse|to adapt|s’adapter|🦎|Me adapté rápido a la ciudad.|I adapted quickly to the city.|Je me suis vite adapté à la ville.
el cambio|change|le changement|🔁|Es un cambio positivo.|It’s a positive change.|C’est un changement positif.
la oportunidad|opportunity|l’occasion / l’opportunité|🚪|Es una gran oportunidad.|It’s a great opportunity.|C’est une belle opportunité.
el esfuerzo|effort|l’effort|💪|Con esfuerzo todo es posible.|With effort, anything is possible.|Avec de l’effort, tout est possible.
el progreso|progress|le progrès|🚀|Has hecho muchos progresos.|You’ve made a lot of progress.|Tu as fait beaucoup de progrès.
`),
];
