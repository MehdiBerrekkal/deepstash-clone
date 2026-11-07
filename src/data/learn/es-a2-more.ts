import { words, type Topic } from '@/data/learn/full';

/** Spanish A2 pack: past and plans, the body and the doctor, the house, jobs, travel, shopping, nature. Original content. */
const t = (id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level: 'A2', icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('jobs', '👷', 'Jobs', 'Les métiers', `
el médico|doctor|le médecin|👨‍⚕️|El médico me recetó un jarabe.|The doctor prescribed me a syrup.|Le médecin m’a prescrit un sirop.
la enfermera|nurse|l’infirmière|👩‍⚕️|La enfermera trabaja de noche.|The nurse works nights.|L’infirmière travaille de nuit.
el cocinero|cook / chef|le cuisinier|🧑‍🍳|El cocinero prepara la paella.|The chef is making the paella.|Le cuisinier prépare la paella.
el camarero|waiter|le serveur|🤵|El camarero trae la cuenta.|The waiter brings the bill.|Le serveur apporte l’addition.
el policía|police officer|le policier|👮|El policía nos ayudó.|The police officer helped us.|Le policier nous a aidés.
el bombero|firefighter|le pompier|🧑‍🚒|Los bomberos llegaron en cinco minutos.|The firefighters arrived in five minutes.|Les pompiers sont arrivés en cinq minutes.
el abogado|lawyer|l’avocat|⚖️|Mi prima es abogada.|My cousin is a lawyer.|Ma cousine est avocate.
el ingeniero|engineer|l’ingénieur|👷|Trabaja como ingeniero en Madrid.|He works as an engineer in Madrid.|Il travaille comme ingénieur à Madrid.
el agricultor|farmer|l’agriculteur|🧑‍🌾|El agricultor recoge las naranjas.|The farmer picks the oranges.|L’agriculteur cueille les oranges.
el artista|artist|l’artiste|🧑‍🎨|Es una artista muy famosa.|She’s a very famous artist.|C’est une artiste très célèbre.
el científico|scientist|le scientifique|🧑‍🔬|Los científicos estudian el clima.|Scientists study the climate.|Les scientifiques étudient le climat.
el conductor|driver|le conducteur|🧑‍✈️|El conductor del autobús es muy amable.|The bus driver is very kind.|Le chauffeur du bus est très aimable.
el periodista|journalist|le journaliste|🎙️|La periodista entrevista al alcalde.|The journalist interviews the mayor.|La journaliste interviewe le maire.
el dependiente|shop assistant|le vendeur|🧑‍💼|El dependiente me buscó otra talla.|The shop assistant found me another size.|Le vendeur m’a cherché une autre taille.
el jefe|boss|le chef / patron|😎|Mi jefe está de vacaciones.|My boss is on holiday.|Mon chef est en vacances.
el sueldo|salary|le salaire|💵|El sueldo no es muy alto.|The salary isn’t very high.|Le salaire n’est pas très élevé.
la entrevista|interview|l’entretien|🤝|Tengo una entrevista de trabajo.|I have a job interview.|J’ai un entretien d’embauche.
jubilarse|to retire|prendre sa retraite|🏖️|Mi padre se jubila el año que viene.|My father retires next year.|Mon père prend sa retraite l’an prochain.
`),
  t('past', '⏳', 'Talking about the past', 'Parler du passé', `
ayer|yesterday|hier|⬅️|Ayer fui al cine.|Yesterday I went to the cinema.|Hier je suis allé au cinéma.
anoche|last night|hier soir|🌃|Anoche cenamos en casa de Ana.|Last night we had dinner at Ana’s.|Hier soir, on a dîné chez Ana.
anteayer|the day before yesterday|avant-hier|📅|Anteayer llovió mucho.|It rained a lot the day before yesterday.|Avant-hier, il a beaucoup plu.
la semana pasada|last week|la semaine dernière|🗓️|La semana pasada estuve enfermo.|Last week I was ill.|La semaine dernière, j’étais malade.
el año pasado|last year|l’année dernière|🎆|El año pasado viajamos a Perú.|Last year we travelled to Peru.|L’année dernière, nous avons voyagé au Pérou.
hace dos días|two days ago|il y a deux jours|⌛|Llegué hace dos días.|I arrived two days ago.|Je suis arrivé il y a deux jours.
fui|I went / I was|je suis allé / j’ai été|🚶|Fui al mercado temprano.|I went to the market early.|Je suis allé au marché tôt.
hice|I did / I made|j’ai fait|🛠️|Hice los deberes después de cenar.|I did my homework after dinner.|J’ai fait mes devoirs après le dîner.
comí|I ate|j’ai mangé|🍽️|Comí paella en Valencia.|I ate paella in Valencia.|J’ai mangé une paella à Valence.
vi|I saw|j’ai vu|👀|Vi a Lucía en la calle.|I saw Lucía in the street.|J’ai vu Lucía dans la rue.
tuve|I had|j’ai eu|🤲|Tuve un día muy largo.|I had a very long day.|J’ai eu une très longue journée.
estuve|I was (somewhere)|j’ai été / je suis resté|📍|Estuve en Granada una semana.|I was in Granada for a week.|J’ai passé une semaine à Grenade.
llegué|I arrived|je suis arrivé|🛬|Llegué tarde a la reunión.|I arrived late to the meeting.|Je suis arrivé en retard à la réunion.
empecé|I started|j’ai commencé|🏁|Empecé a estudiar español en enero.|I started studying Spanish in January.|J’ai commencé l’espagnol en janvier.
terminé|I finished|j’ai fini|✅|Terminé el libro anoche.|I finished the book last night.|J’ai fini le livre hier soir.
de pequeño|as a child|quand j’étais petit|🧒|De pequeño vivía en el campo.|As a child I lived in the countryside.|Petit, je vivais à la campagne.
`),
  t('plans', '🗓️', 'Plans and the future', 'Projets et futur', `
mañana|tomorrow|demain|🌄|Mañana vamos a la playa.|Tomorrow we’re going to the beach.|Demain on va à la plage.
pasado mañana|the day after tomorrow|après-demain|📆|Pasado mañana es fiesta.|The day after tomorrow is a holiday.|Après-demain, c’est férié.
la semana que viene|next week|la semaine prochaine|➡️|La semana que viene empiezo un curso.|Next week I start a course.|La semaine prochaine, je commence un cours.
el fin de semana|the weekend|le week-end|🎉|¿Qué haces el fin de semana?|What are you doing at the weekend?|Tu fais quoi ce week-end ?
el plan|plan|le projet / plan|📝|Tengo un plan para el sábado.|I have a plan for Saturday.|J’ai un plan pour samedi.
quedar|to meet up|se retrouver|🤝|¿Quedamos a las siete?|Shall we meet at seven?|On se retrouve à sept heures ?
la cita|appointment / date|le rendez-vous|💌|Tengo cita con el dentista.|I have a dentist appointment.|J’ai rendez-vous chez le dentiste.
pensar|to think / to intend|penser / compter faire|💭|Pienso viajar en agosto.|I’m thinking of travelling in August.|Je compte voyager en août.
esperar|to hope / to wait|espérer / attendre|🤞|Espero verte pronto.|I hope to see you soon.|J’espère te voir bientôt.
el sueño|dream / sleepiness|le rêve / le sommeil|🌠|Mi sueño es vivir en Barcelona.|My dream is to live in Barcelona.|Mon rêve est de vivre à Barcelone.
pronto|soon|bientôt|⏱️|Nos vemos pronto.|See you soon.|À bientôt.
quizás|maybe|peut-être|🤷|Quizás vaya mañana.|Maybe I’ll go tomorrow.|Peut-être que j’irai demain.
seguro|sure / safe|sûr|👍|¿Estás seguro?|Are you sure?|Tu es sûr ?
el viaje|trip|le voyage|🧳|El viaje dura tres horas.|The trip takes three hours.|Le voyage dure trois heures.
celebrar|to celebrate|fêter|🥳|Vamos a celebrar tu cumpleaños.|We’re going to celebrate your birthday.|On va fêter ton anniversaire.
invitar|to invite / to treat|inviter|💌|Te invito a un café.|Let me buy you a coffee.|Je t’offre un café.
`),
  t('house2', '🏡', 'Housework and moving', 'Ménage et déménagement', `
alquilar|to rent|louer|🔑|Alquilamos un piso en el centro.|We rent a flat in the centre.|Nous louons un appartement dans le centre.
el piso|flat / floor|l’appartement / l’étage|🏢|Vivo en el tercer piso.|I live on the third floor.|J’habite au troisième étage.
el alquiler|rent|le loyer|💶|El alquiler sube cada año.|The rent goes up every year.|Le loyer augmente chaque année.
mudarse|to move house|déménager|📦|Nos mudamos en junio.|We’re moving in June.|Nous déménageons en juin.
la mudanza|house move|le déménagement|🚚|La mudanza fue agotadora.|The move was exhausting.|Le déménagement était épuisant.
limpiar|to clean|nettoyer|🧹|Limpio la casa los sábados.|I clean the house on Saturdays.|Je fais le ménage le samedi.
barrer|to sweep|balayer|🧹|Barre la cocina, por favor.|Sweep the kitchen, please.|Balaie la cuisine, s’il te plaît.
planchar|to iron|repasser|👔|Odio planchar camisas.|I hate ironing shirts.|Je déteste repasser les chemises.
la lavadora|washing machine|la machine à laver|🫧|Pon la lavadora, está llena.|Put the washing machine on, it’s full.|Lance la machine, elle est pleine.
la basura|rubbish|les poubelles / les ordures|🗑️|¿Quién saca la basura hoy?|Who’s taking the rubbish out today?|Qui sort les poubelles aujourd’hui ?
el ascensor|lift|l’ascenseur|🛗|El ascensor no funciona.|The lift isn’t working.|L’ascenseur ne marche pas.
la escalera|stairs|l’escalier|🪜|Subo por la escalera.|I take the stairs.|Je prends l’escalier.
la terraza|terrace / balcony|la terrasse|🪴|Cenamos en la terraza.|We have dinner on the terrace.|Nous dînons sur la terrasse.
el mueble|piece of furniture|le meuble|🪑|Compramos muebles nuevos.|We bought new furniture.|Nous avons acheté de nouveaux meubles.
la estantería|bookshelf|l’étagère|📚|La estantería está llena de libros.|The bookshelf is full of books.|L’étagère est pleine de livres.
arreglar|to fix / to tidy|réparer / ranger|🔧|Hay que arreglar el grifo.|The tap needs fixing.|Il faut réparer le robinet.
`),
  t('travel2', '🧳', 'On holiday', 'En vacances', `
las vacaciones|holidays|les vacances|🏝️|Estoy de vacaciones.|I’m on holiday.|Je suis en vacances.
la maleta|suitcase|la valise|🧳|Mi maleta pesa veinte kilos.|My suitcase weighs twenty kilos.|Ma valise pèse vingt kilos.
el pasaporte|passport|le passeport|🛂|No olvides el pasaporte.|Don’t forget your passport.|N’oublie pas ton passeport.
el billete|ticket|le billet|🎫|Compré los billetes por internet.|I bought the tickets online.|J’ai acheté les billets en ligne.
el vuelo|flight|le vol|✈️|El vuelo sale con retraso.|The flight is delayed.|Le vol part en retard.
la reserva|booking|la réservation|📋|Tengo una reserva para dos noches.|I have a booking for two nights.|J’ai une réservation pour deux nuits.
el mapa|map|la carte|🗺️|Mira el mapa, estamos aquí.|Look at the map, we’re here.|Regarde la carte, on est ici.
el turista|tourist|le touriste|📸|Hay muchos turistas en verano.|There are lots of tourists in summer.|Il y a beaucoup de touristes en été.
la montaña|mountain|la montagne|🏔️|Subimos a la montaña.|We climbed the mountain.|Nous sommes montés à la montagne.
el lago|lake|le lac|🏞️|Nadamos en el lago.|We swam in the lake.|Nous avons nagé dans le lac.
la isla|island|l’île|🏝️|Mallorca es una isla preciosa.|Mallorca is a beautiful island.|Majorque est une île magnifique.
el recuerdo|souvenir / memory|le souvenir|🎁|Compré un recuerdo para mi madre.|I bought a souvenir for my mother.|J’ai acheté un souvenir pour ma mère.
la foto|photo|la photo|📷|¿Nos haces una foto?|Could you take a photo of us?|Tu peux nous prendre en photo ?
el camping|campsite|le camping|🏕️|Dormimos en un camping.|We slept at a campsite.|Nous avons dormi dans un camping.
la tienda de campaña|tent|la tente|⛺|Montamos la tienda de campaña.|We put up the tent.|Nous avons monté la tente.
perderse|to get lost|se perdre|😵‍💫|Nos perdimos en el casco antiguo.|We got lost in the old town.|Nous nous sommes perdus dans la vieille ville.
`),
  t('shopping2', '🛍️', 'In the shop', 'Dans la boutique', `
la talla|size (clothes)|la taille|📏|¿Tiene una talla más grande?|Do you have a bigger size?|Vous avez une taille au-dessus ?
el probador|fitting room|la cabine d’essayage|🚪|El probador está al fondo.|The fitting room is at the back.|La cabine d’essayage est au fond.
probarse|to try on|essayer|👗|¿Puedo probarme esta chaqueta?|Can I try on this jacket?|Je peux essayer cette veste ?
quedar bien|to suit / to fit|aller bien|😍|Esa camisa te queda muy bien.|That shirt really suits you.|Cette chemise te va très bien.
las rebajas|sales|les soldes|🏷️|En enero hay rebajas.|There are sales in January.|En janvier, il y a les soldes.
el descuento|discount|la réduction|💸|Tiene un veinte por ciento de descuento.|It has twenty per cent off.|Il y a vingt pour cent de réduction.
la tarjeta|card|la carte|💳|¿Puedo pagar con tarjeta?|Can I pay by card?|Je peux payer par carte ?
el efectivo|cash|les espèces|💵|Solo aceptan efectivo.|They only take cash.|Ils n’acceptent que les espèces.
el recibo|receipt|le ticket de caisse|🧾|Guarde el recibo.|Keep the receipt.|Gardez le ticket.
devolver|to return (an item)|rendre / retourner|↩️|Quiero devolver estos zapatos.|I’d like to return these shoes.|Je voudrais rendre ces chaussures.
cambiar|to change / exchange|changer / échanger|🔄|¿Lo puedo cambiar por otro color?|Can I exchange it for another colour?|Je peux l’échanger contre une autre couleur ?
la bolsa|bag|le sac|🛍️|¿Necesita bolsa?|Do you need a bag?|Vous avez besoin d’un sac ?
el regalo|gift|le cadeau|🎁|Es un regalo, ¿me lo envuelve?|It’s a gift, could you wrap it?|C’est un cadeau, vous pouvez l’emballer ?
el centro comercial|shopping centre|le centre commercial|🏬|Quedamos en el centro comercial.|Let’s meet at the shopping centre.|On se retrouve au centre commercial.
gastar|to spend|dépenser|💰|Gasto demasiado en ropa.|I spend too much on clothes.|Je dépense trop en vêtements.
ahorrar|to save (money)|économiser|🐷|Estoy ahorrando para un viaje.|I’m saving for a trip.|J’économise pour un voyage.
`),
  t('health2', '🤒', 'Feeling unwell', 'Être malade', `
la cabeza|head|la tête|🤕|Me duele la cabeza.|I have a headache.|J’ai mal à la tête.
la garganta|throat|la gorge|🗣️|Me duele la garganta.|I have a sore throat.|J’ai mal à la gorge.
el estómago|stomach|l’estomac|🤢|Me duele el estómago.|I have a stomach ache.|J’ai mal au ventre.
la espalda|back|le dos|🧍|Tengo dolor de espalda.|I have back pain.|J’ai mal au dos.
la muela|tooth (molar)|la dent|🦷|Me duele una muela.|I have toothache.|J’ai mal à une dent.
la fiebre|fever|la fièvre|🤒|Tengo fiebre desde ayer.|I’ve had a fever since yesterday.|J’ai de la fièvre depuis hier.
la tos|cough|la toux|😷|Tengo tos por las noches.|I cough at night.|Je tousse la nuit.
el resfriado|cold|le rhume|🤧|Tengo un resfriado.|I have a cold.|J’ai un rhume.
la gripe|flu|la grippe|🦠|Está en la cama con gripe.|She’s in bed with flu.|Elle est au lit avec la grippe.
la pastilla|pill|le comprimé|💊|Tome una pastilla cada ocho horas.|Take one pill every eight hours.|Prenez un comprimé toutes les huit heures.
la receta|prescription / recipe|l’ordonnance / la recette|📃|Necesita receta para este medicamento.|You need a prescription for this medicine.|Il faut une ordonnance pour ce médicament.
la herida|wound|la blessure|🩹|Lava bien la herida.|Wash the wound well.|Lave bien la blessure.
cansado|tired|fatigué|🥱|Estoy muy cansado hoy.|I’m very tired today.|Je suis très fatigué aujourd’hui.
mareado|dizzy|étourdi|😵|Me siento mareado.|I feel dizzy.|J’ai la tête qui tourne.
mejorarse|to get better|aller mieux|🌤️|¡Que te mejores!|Get well soon!|Remets-toi vite !
la ambulancia|ambulance|l’ambulance|🚑|Llama a una ambulancia.|Call an ambulance.|Appelle une ambulance.
`),
  t('nature2', '🌿', 'In the countryside', 'À la campagne', `
el campo|countryside / field|la campagne / le champ|🌾|Los fines de semana vamos al campo.|At weekends we go to the countryside.|Le week-end, on va à la campagne.
el río|river|la rivière / le fleuve|🏞️|El río pasa por el pueblo.|The river runs through the village.|La rivière traverse le village.
el bosque|forest|la forêt|🌲|Paseamos por el bosque.|We walk in the forest.|Nous nous promenons dans la forêt.
el árbol|tree|l’arbre|🌳|Este árbol tiene cien años.|This tree is a hundred years old.|Cet arbre a cent ans.
la flor|flower|la fleur|🌼|Las flores huelen muy bien.|The flowers smell lovely.|Les fleurs sentent très bon.
la hoja|leaf / sheet|la feuille|🍂|En otoño caen las hojas.|In autumn the leaves fall.|En automne, les feuilles tombent.
la piedra|stone|la pierre|🪨|Una casa de piedra.|A stone house.|Une maison en pierre.
el pueblo|village / people|le village / le peuple|🏘️|Mi abuela vive en un pueblo.|My grandmother lives in a village.|Ma grand-mère habite dans un village.
la granja|farm|la ferme|🚜|Visitamos una granja con los niños.|We visited a farm with the kids.|Nous avons visité une ferme avec les enfants.
el sol|sun|le soleil|☀️|Hoy hace mucho sol.|It’s very sunny today.|Il y a beaucoup de soleil aujourd’hui.
la luna|moon|la lune|🌙|Esta noche hay luna llena.|There’s a full moon tonight.|Ce soir, c’est la pleine lune.
la estrella|star|l’étoile|⭐|En el campo se ven las estrellas.|In the countryside you can see the stars.|À la campagne, on voit les étoiles.
el cielo|sky|le ciel|🌌|El cielo está despejado.|The sky is clear.|Le ciel est dégagé.
la nube|cloud|le nuage|☁️|Hay nubes negras: va a llover.|There are dark clouds: it’s going to rain.|Il y a des nuages noirs : il va pleuvoir.
el mar|sea|la mer|🌊|El mar está tranquilo hoy.|The sea is calm today.|La mer est calme aujourd’hui.
la arena|sand|le sable|🏖️|La arena quema en agosto.|The sand burns in August.|Le sable brûle en août.
`),
  t('feelings2', '🎭', 'Character and moods', 'Caractère et humeur', `
contento|happy / pleased|content|😊|Estoy contento con el resultado.|I’m happy with the result.|Je suis content du résultat.
triste|sad|triste|😢|Está triste porque se va su amiga.|She’s sad because her friend is leaving.|Elle est triste parce que son amie s’en va.
enfadado|angry|fâché|😠|¿Por qué estás enfadado?|Why are you angry?|Pourquoi tu es fâché ?
nervioso|nervous|nerveux|😬|Estoy nervioso antes del examen.|I’m nervous before the exam.|Je suis nerveux avant l’examen.
tranquilo|calm|calme|😌|Tranquilo, todo va a salir bien.|Relax, it’ll all be fine.|Tranquille, tout va bien se passer.
aburrido|bored / boring|ennuyé / ennuyeux|🥱|La película es aburrida.|The film is boring.|Le film est ennuyeux.
sorprendido|surprised|surpris|😮|Me quedé sorprendido.|I was surprised.|J’ai été surpris.
preocupado|worried|inquiet|😟|Mi madre está preocupada.|My mother is worried.|Ma mère est inquiète.
orgulloso|proud|fier|🦚|Estoy orgulloso de ti.|I’m proud of you.|Je suis fier de toi.
tímido|shy|timide|🙈|De pequeño era muy tímido.|As a child I was very shy.|Petit, j’étais très timide.
divertido|fun / funny|amusant / drôle|😂|Tu hermano es muy divertido.|Your brother is very funny.|Ton frère est très drôle.
amable|kind|aimable|🤗|La recepcionista fue muy amable.|The receptionist was very kind.|La réceptionniste a été très aimable.
perezoso|lazy|paresseux|🦥|Los domingos soy muy perezoso.|On Sundays I’m very lazy.|Le dimanche, je suis très paresseux.
trabajador|hard-working|travailleur|🐝|Es la persona más trabajadora que conozco.|She’s the hardest-working person I know.|C’est la personne la plus travailleuse que je connaisse.
el miedo|fear|la peur|😱|Tengo miedo a los perros.|I’m afraid of dogs.|J’ai peur des chiens.
la vergüenza|embarrassment|la honte / la gêne|😳|¡Qué vergüenza!|How embarrassing!|Quelle honte !
`),
];
