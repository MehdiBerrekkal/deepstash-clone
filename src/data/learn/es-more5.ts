import { words, type Level, type Topic } from '@/data/learn/full';

/** Spanish, pack 5: celebrations, travel trouble, everyday expressions, body actions, time words, crime and law, sport, shopping for food, home problems. Original content. */
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level, icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('A1', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
¿qué tal?|how’s it going?|ça va ?|👋|¡Hola, Ana! ¿Qué tal?|Hi Ana! How’s it going?|Salut Ana ! Ça va ?
vale|OK|d’accord|👌|—¿Nos vemos a las ocho? —Vale.|“See you at eight?” “OK.”|« On se voit à huit heures ? » « D’accord. »
claro|of course|bien sûr|✅|¡Claro que sí!|Of course!|Bien sûr !
genial|great|génial|🤩|¡Qué genial!|How great!|Génial !
¡qué pena!|what a shame!|quel dommage !|😞|¡Qué pena que no vengas!|What a shame you’re not coming!|Quel dommage que tu ne viennes pas !
no pasa nada|it’s fine / no worries|ce n’est pas grave|😌|No pasa nada, tranquilo.|No worries, relax.|Ce n’est pas grave, t’inquiète.
¡cuidado!|careful!|attention !|⚠️|¡Cuidado con el perro!|Careful with the dog!|Attention au chien !
¡enhorabuena!|congratulations!|félicitations !|🎉|¡Enhorabuena por el trabajo nuevo!|Congratulations on the new job!|Félicitations pour le nouveau travail !
¡buen viaje!|have a good trip!|bon voyage !|🧳|¡Buen viaje y escríbeme!|Have a good trip and write to me!|Bon voyage et écris-moi !
¡que aproveche!|enjoy your meal!|bon appétit !|🍽️|¡Que aproveche!|Enjoy your meal!|Bon appétit !
¡salud!|cheers! / bless you!|santé ! / à vos souhaits !|🥂|¡Salud por los novios!|Cheers to the newlyweds!|Santé aux mariés !
de acuerdo|agreed|d’accord|🤝|De acuerdo, mañana a las diez.|Agreed, tomorrow at ten.|D’accord, demain à dix heures.
¡ánimo!|keep going! / chin up!|courage !|💪|¡Ánimo, que tú puedes!|Keep going, you can do it!|Courage, tu peux le faire !
me da igual|I don’t mind|ça m’est égal|🤷|¿Pizza o pasta? Me da igual.|Pizza or pasta? I don’t mind.|Pizza ou pâtes ? Ça m’est égal.
`),
  t('A1', 'celebrations', '🎉', 'Celebrations', 'Les fêtes', `
la fiesta de cumpleaños|birthday party|la fête d’anniversaire|🎂|La fiesta de cumpleaños es el sábado.|The birthday party is on Saturday.|La fête d’anniversaire est samedi.
la Navidad|Christmas|Noël|🎄|En Navidad comemos en familia.|At Christmas we eat as a family.|À Noël, on mange en famille.
la Nochevieja|New Year’s Eve|le réveillon du Nouvel An|🎆|En Nochevieja comemos doce uvas.|On New Year’s Eve we eat twelve grapes.|Au réveillon, on mange douze raisins.
los Reyes Magos|the Three Kings|les Rois mages|👑|Los Reyes Magos traen regalos.|The Three Kings bring presents.|Les Rois mages apportent des cadeaux.
la boda|wedding|le mariage|💒|La boda es en junio.|The wedding is in June.|Le mariage est en juin.
la tarta|cake (celebration)|le gâteau|🎂|Una tarta de chocolate con velas.|A chocolate cake with candles.|Un gâteau au chocolat avec des bougies.
el invitado|guest|l’invité|🙋|Hay cincuenta invitados.|There are fifty guests.|Il y a cinquante invités.
los fuegos artificiales|fireworks|le feu d’artifice|🎇|Vimos los fuegos artificiales en la playa.|We watched the fireworks on the beach.|On a regardé le feu d’artifice sur la plage.
el desfile|parade|le défilé|🎊|El desfile pasa por la calle mayor.|The parade goes down the main street.|Le défilé passe dans la rue principale.
disfrazarse|to dress up|se déguiser|🎭|En carnaval nos disfrazamos.|At carnival we dress up.|Au carnaval, on se déguise.
brindar por|to toast to|trinquer à|🥂|Brindamos por la abuela.|We toast to grandma.|On trinque à la santé de grand-mère.
felicitar|to congratulate|féliciter|👏|Te llamo para felicitarte.|I’m calling to congratulate you.|Je t’appelle pour te féliciter.
`),
  t('A1', 'actions', '🤸', 'Body actions', 'Actions du corps', `
sentarse|to sit down|s’asseoir|🪑|Siéntate, por favor.|Sit down, please.|Assieds-toi, s’il te plaît.
caminar rápido|to walk fast|marcher vite|🚶|Camina rápido, llegamos tarde.|Walk fast, we’re late.|Marche vite, on est en retard.
saltar|to jump|sauter|🦘|Los niños saltan en la cama.|The children jump on the bed.|Les enfants sautent sur le lit.
levantar|to lift / raise|lever|🙋|Levanta la mano para preguntar.|Raise your hand to ask.|Lève la main pour poser une question.
tocar el timbre|to ring the bell|sonner|🔔|Toca el timbre dos veces.|Ring the bell twice.|Sonne deux fois.
sonreír|to smile|sourire|😊|¡Sonríe para la foto!|Smile for the photo!|Souris pour la photo !
llorar|to cry|pleurer|😭|El bebé llora por la noche.|The baby cries at night.|Le bébé pleure la nuit.
gritar|to shout|crier|🗣️|No grites, por favor.|Don’t shout, please.|Ne crie pas, s’il te plaît.
abrazar|to hug|serrer dans ses bras|🤗|Mi abuela me abraza fuerte.|My grandma hugs me tight.|Ma grand-mère me serre fort.
besar|to kiss|embrasser|😘|En España nos damos dos besos.|In Spain we greet with two kisses.|En Espagne, on se fait deux bises.
empujar|to push|pousser|👉|Empuja la puerta.|Push the door.|Pousse la porte.
tirar|to pull / throw|tirer / jeter|🗑️|Tira la basura, por favor.|Throw the rubbish away, please.|Jette les déchets, s’il te plaît.
coger|to take / catch|prendre / attraper|✋|Coge el autobús de las nueve.|Take the nine o’clock bus.|Prends le bus de neuf heures.
`),
  t('A2', 'foodshop', '🥬', 'Food shopping', 'Les courses', `
la lista de la compra|shopping list|la liste de courses|📝|¿Has hecho la lista de la compra?|Have you made the shopping list?|Tu as fait la liste de courses ?
el carrito|trolley|le chariot|🛒|Coge un carrito, compramos mucho.|Get a trolley, we’re buying a lot.|Prends un chariot, on achète beaucoup.
la caja|checkout|la caisse|🧾|Pague en la caja tres.|Pay at checkout three.|Payez à la caisse trois.
la cola|queue|la file|🧍|Hay mucha cola en la caja.|There’s a long queue at the checkout.|Il y a beaucoup de monde à la caisse.
la carnicería|butcher’s|la boucherie|🥩|Compro el pollo en la carnicería.|I buy chicken at the butcher’s.|J’achète le poulet à la boucherie.
la pescadería|fishmonger’s|la poissonnerie|🐟|La pescadería tiene gambas frescas.|The fishmonger’s has fresh prawns.|La poissonnerie a des crevettes fraîches.
la frutería|greengrocer’s|le primeur|🍊|Las naranjas de la frutería son dulces.|The greengrocer’s oranges are sweet.|Les oranges du primeur sont sucrées.
el litro|litre|le litre|🥛|Un litro de leche.|A litre of milk.|Un litre de lait.
medio kilo|half a kilo|une livre (500 g)|⚖️|Medio kilo de tomates, por favor.|Half a kilo of tomatoes, please.|Une livre de tomates, s’il vous plaît.
la docena|dozen|la douzaine|🥚|Una docena de huevos.|A dozen eggs.|Une douzaine d’œufs.
la lata|tin / can|la boîte de conserve|🥫|Una lata de atún.|A tin of tuna.|Une boîte de thon.
el paquete|packet|le paquet|📦|Un paquete de arroz.|A packet of rice.|Un paquet de riz.
fresco|fresh|frais|🌿|El pescado está muy fresco.|The fish is very fresh.|Le poisson est très frais.
caducado|out of date|périmé|📅|Este yogur está caducado.|This yogurt is out of date.|Ce yaourt est périmé.
`),
  t('A2', 'travelproblems', '🧳', 'Travel problems', 'Problèmes en voyage', `
el retraso del vuelo|flight delay|le retard du vol|⏳|Hay un retraso de dos horas.|There’s a two-hour delay.|Il y a un retard de deux heures.
perder el tren|to miss the train|rater le train|🚆|Perdí el tren por cinco minutos.|I missed the train by five minutes.|J’ai raté le train de cinq minutes.
la maleta perdida|lost suitcase|la valise perdue|🧳|Mi maleta se ha perdido.|My suitcase has been lost.|Ma valise a été perdue.
la oficina de objetos perdidos|lost property office|le bureau des objets trouvés|🗃️|Pregunta en objetos perdidos.|Ask at lost property.|Demande aux objets trouvés.
la huelga de transportes|transport strike|la grève des transports|✊|Mañana hay huelga de metro.|There’s a metro strike tomorrow.|Demain il y a grève du métro.
la habitación ruidosa|noisy room|la chambre bruyante|🔊|¿Puedo cambiar de habitación? Es ruidosa.|Can I change rooms? It’s noisy.|Je peux changer de chambre ? Elle est bruyante.
no funciona|it doesn’t work|ça ne marche pas|🚫|El aire acondicionado no funciona.|The air conditioning doesn’t work.|La clim ne marche pas.
quejarse|to complain|se plaindre|😤|Quiero quejarme del servicio.|I want to complain about the service.|Je veux me plaindre du service.
el reembolso|refund|le remboursement|💶|¿Me pueden dar un reembolso?|Can you give me a refund?|Vous pouvez me rembourser ?
el seguro de viaje|travel insurance|l’assurance voyage|🛡️|Siempre compro seguro de viaje.|I always buy travel insurance.|J’achète toujours une assurance voyage.
la embajada española|Spanish embassy|l’ambassade d’Espagne|🏛️|Llama a la embajada.|Call the embassy.|Appelle l’ambassade.
el cajero no funciona|the cash machine is broken|le distributeur est en panne|🏧|El cajero no funciona.|The cash machine isn’t working.|Le distributeur ne marche pas.
`),
  t('A2', 'homeproblems', '🔧', 'Problems at home', 'Problèmes à la maison', `
la gotera|leak (from the roof)|la fuite (du toit)|💧|Hay una gotera en el techo.|There’s a leak in the ceiling.|Il y a une fuite au plafond.
el grifo|tap|le robinet|🚰|El grifo gotea.|The tap is dripping.|Le robinet goutte.
el fontanero|plumber|le plombier|🔧|Llama al fontanero.|Call the plumber.|Appelle le plombier.
el electricista|electrician|l’électricien|⚡|El electricista viene mañana.|The electrician is coming tomorrow.|L’électricien vient demain.
se ha ido la luz|the power’s gone out|il y a une coupure de courant|🔦|Se ha ido la luz en todo el edificio.|The power’s gone out in the whole building.|Il y a une coupure de courant dans tout l’immeuble.
la calefacción|heating|le chauffage|🔥|La calefacción no calienta.|The heating isn’t warming up.|Le chauffage ne chauffe pas.
el aire acondicionado|air conditioning|la climatisation|❄️|Pon el aire acondicionado.|Turn on the air conditioning.|Mets la clim.
roto|broken|cassé|💔|La lavadora está rota.|The washing machine is broken.|La machine à laver est cassée.
atascado|blocked / stuck|bouché / coincé|🚧|El fregadero está atascado.|The sink is blocked.|L’évier est bouché.
el vecino de arriba|upstairs neighbour|le voisin du dessus|⬆️|El vecino de arriba hace mucho ruido.|The upstairs neighbour is very noisy.|Le voisin du dessus fait beaucoup de bruit.
el casero|landlord|le propriétaire|🔑|Tengo que llamar al casero.|I need to call the landlord.|Je dois appeler le propriétaire.
`),
  t('A2', 'sport2', '🏅', 'Sport and fitness', 'Sport et forme', `
el entrenamiento|training|l’entraînement|🏋️|Tengo entrenamiento a las siete.|I have training at seven.|J’ai entraînement à sept heures.
el entrenador|coach|l’entraîneur|📣|El entrenador es muy exigente.|The coach is very demanding.|L’entraîneur est très exigeant.
el jugador|player|le joueur|⚽|Es el mejor jugador del equipo.|He’s the best player on the team.|C’est le meilleur joueur de l’équipe.
el gol|goal|le but|🥅|¡Qué golazo!|What a goal!|Quel but !
el campeonato|championship|le championnat|🏆|Ganamos el campeonato.|We won the championship.|On a gagné le championnat.
el estadio|stadium|le stade|🏟️|El estadio está lleno.|The stadium is full.|Le stade est plein.
el árbitro|referee|l’arbitre|🧑‍⚖️|El árbitro pitó penalti.|The referee gave a penalty.|L’arbitre a sifflé un penalty.
empatar|to draw|faire match nul|🤝|Empatamos uno a uno.|We drew one all.|On a fait match nul un partout.
estirar|to stretch|s’étirer|🧘|Estira antes de correr.|Stretch before running.|Étire-toi avant de courir.
el maratón|marathon|le marathon|🏃|Voy a correr un maratón.|I’m going to run a marathon.|Je vais courir un marathon.
la medalla|medal|la médaille|🥇|Ganó una medalla de oro.|She won a gold medal.|Elle a gagné une médaille d’or.
en forma|fit|en forme|💪|Quiero ponerme en forma.|I want to get fit.|Je veux me mettre en forme.
`),
  t('B1', 'law', '⚖️', 'Crime and the law', 'Crime et justice', `
el delito|crime / offence|le délit|🚨|Robar es un delito.|Stealing is a crime.|Voler est un délit.
el robo|theft / robbery|le vol|🦹|Hubo un robo en el banco.|There was a robbery at the bank.|Il y a eu un braquage à la banque.
el juez|judge|le juge|🧑‍⚖️|El juez dictó sentencia.|The judge passed sentence.|Le juge a rendu son verdict.
el juicio|trial|le procès|⚖️|El juicio dura una semana.|The trial lasts a week.|Le procès dure une semaine.
la cárcel|prison|la prison|⛓️|Pasó dos años en la cárcel.|He spent two years in prison.|Il a passé deux ans en prison.
el testigo|witness|le témoin|👁️|Hay dos testigos.|There are two witnesses.|Il y a deux témoins.
culpable|guilty|coupable|👎|Lo declararon culpable.|He was found guilty.|Il a été déclaré coupable.
inocente|innocent|innocent|😇|Ella es inocente.|She’s innocent.|Elle est innocente.
detener|to arrest|arrêter|🚓|La policía detuvo al ladrón.|The police arrested the thief.|La police a arrêté le voleur.
la multa de tráfico|traffic fine|l’amende|📄|Me pusieron una multa por aparcar mal.|I got a fine for bad parking.|J’ai eu une amende pour stationnement gênant.
denunciar|to report (a crime)|porter plainte|📝|Voy a denunciar el robo.|I’m going to report the theft.|Je vais porter plainte pour le vol.
la víctima|victim|la victime|🩹|La víctima está bien.|The victim is fine.|La victime va bien.
`),
  t('B1', 'time2', '⏱️', 'Talking about time', 'Parler du temps', `
de momento|for now|pour le moment|⏸️|De momento, todo bien.|For now, all good.|Pour le moment, tout va bien.
dentro de poco|soon / shortly|bientôt|⏱️|Dentro de poco empieza la película.|The film starts shortly.|Le film commence bientôt.
a menudo|often|souvent|🔁|Voy a menudo al cine.|I often go to the cinema.|Je vais souvent au cinéma.
de vez en cuando|from time to time|de temps en temps|🔀|De vez en cuando como carne.|I eat meat from time to time.|De temps en temps, je mange de la viande.
cada vez más|more and more|de plus en plus|📈|Hay cada vez más turistas.|There are more and more tourists.|Il y a de plus en plus de touristes.
hace tiempo|a while ago / for a long time|il y a longtemps|🕰️|Hace tiempo que no te veo.|I haven’t seen you for a long time.|Ça fait longtemps que je ne t’ai pas vu.
desde hace|for (since)|depuis|⏳|Vivo aquí desde hace cinco años.|I’ve lived here for five years.|J’habite ici depuis cinq ans.
todavía no|not yet|pas encore|🚫|Todavía no he comido.|I haven’t eaten yet.|Je n’ai pas encore mangé.
ya no|no longer|ne… plus|🛑|Ya no fumo.|I don’t smoke any more.|Je ne fume plus.
al mismo tiempo|at the same time|en même temps|🔄|No puedo hacer dos cosas al mismo tiempo.|I can’t do two things at the same time.|Je ne peux pas faire deux choses en même temps.
a tiempo|on time|à l’heure|✅|Llegamos a tiempo.|We arrived on time.|Nous sommes arrivés à l’heure.
el plazo de entrega|delivery time|le délai de livraison|📦|El plazo de entrega es de tres días.|Delivery takes three days.|Le délai de livraison est de trois jours.
`),
];
