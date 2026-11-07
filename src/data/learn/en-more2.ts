import type { Level, Topic, Word } from '@/data/learn/full';

/** English, pack 2, for French speakers: kitchen, school, body, places, phone and internet, the car, music, cooking, expressions, emergencies, money, science, history. Lines are "word|French|emoji|example|example in French". */
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
  t('A1', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
the plate|l’assiette|🍽️|Put the plates on the table.|Mets les assiettes sur la table.
the glass|le verre|🥛|A glass of water, please.|Un verre d’eau, s’il te plaît.
the cup|la tasse|☕|A cup of tea.|Une tasse de thé.
the knife|le couteau|🔪|This knife is sharp.|Ce couteau est coupant.
the fork|la fourchette|🍴|I need a fork.|J’ai besoin d’une fourchette.
the spoon|la cuillère|🥄|Eat your soup with a spoon.|Mange ta soupe avec une cuillère.
the saucepan|la casserole|🍲|Boil the water in the saucepan.|Fais bouillir l’eau dans la casserole.
the frying pan|la poêle|🍳|Fry the eggs in the pan.|Fais cuire les œufs dans la poêle.
the oven|le four|🔥|The cake is in the oven.|Le gâteau est au four.
the fridge|le frigo|🧊|The milk is in the fridge.|Le lait est dans le frigo.
salt|le sel|🧂|Can you pass the salt?|Tu peux me passer le sel ?
butter|le beurre|🧈|Bread and butter.|Du pain et du beurre.
to cut|couper|✂️|Cut the tomatoes.|Coupe les tomates.
to do the washing-up|faire la vaisselle|🧽|It’s my turn to do the washing-up.|C’est mon tour de faire la vaisselle.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
the school|l’école|🏫|The school is next to the park.|L’école est à côté du parc.
the lesson|le cours|🧑‍🏫|The lesson starts at nine.|Le cours commence à neuf heures.
the pupil|l’élève|🧑‍🎓|There are thirty pupils in the class.|Il y a trente élèves dans la classe.
the book|le livre|📕|Open your books at page ten.|Ouvrez vos livres page dix.
the exercise book|le cahier|📓|Write in your exercise book.|Écris dans ton cahier.
the pencil|le crayon|✏️|Have you got a pencil?|Tu as un crayon ?
the pen|le stylo|🖊️|Sign here with the pen.|Signe ici avec le stylo.
homework|les devoirs|📝|I have a lot of homework.|J’ai beaucoup de devoirs.
the question|la question|❓|I have a question.|J’ai une question.
the answer|la réponse|💡|That’s the right answer!|C’est la bonne réponse !
to learn|apprendre|🌱|I learn ten words a day.|J’apprends dix mots par jour.
to understand|comprendre|🤔|I don’t understand this word.|Je ne comprends pas ce mot.
to repeat|répéter|🔁|Could you repeat that, please?|Pouvez-vous répéter, s’il vous plaît ?
`),
  t('A1', 'body', '🧍', 'The body', 'Le corps', `
the head|la tête|🤕|I’ve got a headache.|J’ai mal à la tête.
the eye|l’œil|👁️|She has green eyes.|Elle a les yeux verts.
the ear|l’oreille|👂|My ear hurts.|J’ai mal à l’oreille.
the nose|le nez|👃|My nose is running.|J’ai le nez qui coule.
the mouth|la bouche|👄|Open your mouth.|Ouvre la bouche.
the hand|la main|✋|Wash your hands.|Lave-toi les mains.
the arm|le bras|💪|He broke his arm.|Il s’est cassé le bras.
the leg|la jambe|🦵|My legs hurt after the run.|J’ai mal aux jambes après la course.
the foot|le pied|🦶|Let’s go on foot.|Allons-y à pied.
the back|le dos|🧍|I’ve got backache.|J’ai mal au dos.
the hair|les cheveux|💇|She has long hair.|Elle a les cheveux longs.
the tooth|la dent|🦷|I brush my teeth twice a day.|Je me brosse les dents deux fois par jour.
the heart|le cœur|❤️|He has a heart of gold.|Il a un cœur d’or.
`),
  t('A2', 'phone', '📱', 'Phone and internet', 'Téléphone et internet', `
to call|appeler|📞|I’ll call you tonight.|Je t’appelle ce soir.
the message|le message|💬|I sent you a message.|Je t’ai envoyé un message.
to text|envoyer un SMS|📲|Text me when you arrive.|Envoie-moi un SMS quand tu arrives.
the email|l’e-mail|📧|I’ll send you an email.|Je t’enverrai un e-mail.
the website|le site web|🌐|It’s on the website.|C’est sur le site web.
to search|chercher|🔍|Search for it online.|Cherche-le sur internet.
the charger|le chargeur|🔌|Have you got a charger?|Tu as un chargeur ?
the video call|l’appel vidéo|📹|We have a video call every Sunday.|On fait un appel vidéo chaque dimanche.
the wifi|le wifi|📶|What’s the wifi password?|Quel est le mot de passe du wifi ?
to download|télécharger|⬇️|Download the app.|Télécharge l’application.
to delete|supprimer|🗑️|I deleted the photos by mistake.|J’ai supprimé les photos par erreur.
the laptop|l’ordinateur portable|💻|I work on my laptop.|Je travaille sur mon portable.
the screen|l’écran|🖥️|The screen is broken.|L’écran est cassé.
the battery|la batterie|🔋|My battery is almost dead.|Ma batterie est presque vide.
`),
  t('A2', 'car', '🚗', 'The car and the road', 'La voiture et la route', `
to drive|conduire|🚗|I learned to drive at eighteen.|J’ai appris à conduire à dix-huit ans.
the driving licence|le permis de conduire|🪪|Have you got a driving licence?|Tu as le permis ?
the road|la route|🛣️|The road is very busy.|La route est très chargée.
the motorway|l’autoroute|🛣️|We took the motorway.|Nous avons pris l’autoroute.
petrol|l’essence|⛽|We need petrol.|On a besoin d’essence.
the tyre|le pneu|🛞|We’ve got a flat tyre.|On a un pneu crevé.
to park|se garer|🅿️|It’s hard to park here.|C’est difficile de se garer ici.
the accident|l’accident|💥|There was an accident on the motorway.|Il y a eu un accident sur l’autoroute.
the speed|la vitesse|🏎️|Slow down!|Ralentis !
the traffic jam|l’embouteillage|🚦|We were stuck in a traffic jam.|On était coincés dans un embouteillage.
the traffic lights|les feux|🚥|Turn left at the traffic lights.|Tourne à gauche au feu.
the roundabout|le rond-point|🔄|Take the second exit at the roundabout.|Prends la deuxième sortie au rond-point.
the seat belt|la ceinture|🔒|Put your seat belt on.|Mets ta ceinture.
`),
  t('A2', 'music', '🎵', 'Music and going out', 'Musique et sorties', `
the song|la chanson|🎶|I love this song!|J’adore cette chanson !
the singer|le chanteur, la chanteuse|🎤|The singer has an amazing voice.|La chanteuse a une voix incroyable.
the band|le groupe|👨‍🎤|My favourite band is from Manchester.|Mon groupe préféré vient de Manchester.
the concert|le concert|🎸|We’re going to a concert tonight.|On va à un concert ce soir.
the concert ticket|le billet de concert|🎟️|I’ve already got the tickets.|J’ai déjà les billets.
the pub|le pub|🍻|Let’s meet at the pub.|Retrouvons-nous au pub.
the club|la boîte de nuit|🪩|We went to a club.|On est allés en boîte.
the theatre|le théâtre|🎭|We’re going to the theatre on Friday.|On va au théâtre vendredi.
to have fun|s’amuser|🥳|Have fun tonight!|Amuse-toi bien ce soir !
the piano|le piano|🎹|My daughter is learning the piano.|Ma fille apprend le piano.
the drums|la batterie (instrument)|🥁|He plays the drums.|Il joue de la batterie.
`),
  t('A2', 'cooking', '👩‍🍳', 'Cooking', 'Cuisiner', `
the recipe|la recette|📖|It’s my grandmother’s recipe.|C’est la recette de ma grand-mère.
to boil|faire bouillir|♨️|Boil the water for the pasta.|Fais bouillir l’eau pour les pâtes.
to fry|faire frire|🍳|Fry the onions.|Fais revenir les oignons.
to mix|mélanger|🥣|Mix the flour and the sugar.|Mélange la farine et le sucre.
to add|ajouter|➕|Add a little salt.|Ajoute un peu de sel.
flour|la farine|🌾|We need flour for the cake.|Il nous faut de la farine pour le gâteau.
garlic|l’ail|🧄|This sauce has a lot of garlic.|Cette sauce contient beaucoup d’ail.
the lemon|le citron|🍋|A little lemon on the fish.|Un peu de citron sur le poisson.
pepper|le poivre|🌶️|Salt and pepper.|Sel et poivre.
honey|le miel|🍯|Tea with honey.|Du thé au miel.
chocolate|le chocolat|🍫|A hot chocolate, please.|Un chocolat chaud, s’il vous plaît.
sweet|sucré|🍬|This cake is too sweet.|Ce gâteau est trop sucré.
salty|salé|🧂|The soup is too salty.|La soupe est trop salée.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
no worries|pas de souci|😌|“Sorry!” “No worries.”|« Désolé ! » « Pas de souci. »
fair enough|c’est juste|🤝|Fair enough, you’re right.|C’est juste, tu as raison.
never mind|tant pis / laisse tomber|🤷|Never mind, it doesn’t matter.|Laisse tomber, ce n’est pas grave.
what a shame|quel dommage|😞|What a shame you can’t come!|Quel dommage que tu ne puisses pas venir !
good luck|bonne chance|🍀|Good luck with the exam!|Bonne chance pour l’examen !
congratulations|félicitations|🎉|Congratulations on your new job!|Félicitations pour ton nouveau travail !
get well soon|bon rétablissement|🤒|Get well soon!|Bon rétablissement !
see you later|à plus tard|👋|See you later!|À plus tard !
cheers|santé / merci|🥂|Cheers, mate!|Merci, mon pote !
bless you|à vos souhaits|🤧|Bless you!|À tes souhaits !
it depends|ça dépend|⚖️|It depends on the weather.|Ça dépend du temps.
I’m not sure|je ne suis pas sûr|🤔|I’m not sure, let me check.|Je ne suis pas sûr, je vérifie.
`),
  t('B1', 'emergency', '🚨', 'Emergencies', 'Les urgences', `
help!|au secours !|🆘|Help! Call an ambulance!|Au secours ! Appelez une ambulance !
the danger|le danger|⚠️|Careful, it’s dangerous!|Attention, c’est dangereux !
to steal|voler|🦹|Someone stole my bag.|Quelqu’un m’a volé mon sac.
the thief|le voleur|🥷|The police caught the thief.|La police a attrapé le voleur.
the police station|le commissariat|🚓|Where is the police station?|Où est le commissariat ?
the fire|le feu / l’incendie|🔥|Fire! Everybody out!|Au feu ! Tout le monde dehors !
the emergency exit|la sortie de secours|🚪|Use the emergency exit.|Utilisez la sortie de secours.
injured|blessé|🤕|Two people are injured.|Deux personnes sont blessées.
the first-aid kit|la trousse de secours|⛑️|Bring the first-aid kit.|Apporte la trousse de secours.
the embassy|l’ambassade|🏛️|Call your embassy.|Appelez votre ambassade.
to report|signaler / porter plainte|📝|I want to report a theft.|Je veux porter plainte pour un vol.
`),
  t('B1', 'money', '💷', 'Money', 'L’argent', `
the bank account|le compte bancaire|🏦|I opened a bank account.|J’ai ouvert un compte bancaire.
to spend|dépenser|💸|I spend too much on clothes.|Je dépense trop en vêtements.
to save|économiser|🐷|I’m saving for a trip.|J’économise pour un voyage.
the rent|le loyer|🏠|The rent is very high in London.|Le loyer est très élevé à Londres.
the bill|la facture|🧾|I paid the electricity bill.|J’ai payé la facture d’électricité.
to lend|prêter|🤲|Can you lend me ten pounds?|Tu peux me prêter dix livres ?
to borrow|emprunter|💳|I borrowed money from the bank.|J’ai emprunté de l’argent à la banque.
the loan|le prêt|📄|They took out a loan for the house.|Ils ont fait un prêt pour la maison.
tax|les impôts|🧾|We pay a lot of tax.|On paie beaucoup d’impôts.
the budget|le budget|📊|We’re on a tight budget.|On a un budget serré.
to earn|gagner (de l’argent)|💼|She earns a good salary.|Elle gagne un bon salaire.
the cash machine|le distributeur|🏧|Is there a cash machine near here?|Il y a un distributeur près d’ici ?
`),
  t('B1', 'science', '🔬', 'Science and history', 'Science et histoire', `
science|la science|🔬|I’m very interested in science.|La science m’intéresse beaucoup.
the experiment|l’expérience (scientifique)|🧪|The experiment worked.|L’expérience a réussi.
research|la recherche|🔎|She works in medical research.|Elle travaille dans la recherche médicale.
the discovery|la découverte|💡|It was an important discovery.|C’était une découverte importante.
the planet|la planète|🪐|Mars is the red planet.|Mars est la planète rouge.
space|l’espace|🚀|She wants to travel to space.|Elle veut voyager dans l’espace.
the century|le siècle|⏳|A church from the twelfth century.|Une église du douzième siècle.
the castle|le château|🏰|We visited a medieval castle.|Nous avons visité un château médiéval.
the king|le roi|🤴|The king lived in the palace.|Le roi vivait au palais.
the queen|la reine|👸|The queen visited the town.|La reine a visité la ville.
the war|la guerre|⚔️|The war lasted four years.|La guerre a duré quatre ans.
peace|la paix|🕊️|They signed the peace.|Ils ont signé la paix.
`),
];
