import { words, type Topic } from '@/data/learn/full';

/** Spanish B1 pack: work life, society, the city, health habits, travel stories, connectors. Original content. */
const t = (id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `es-${id}`, level: 'B1', icon, en, fr, words: words(block) });

export const TOPICS: Topic[] = [
  t('worklife', '🏢', 'Working life', 'La vie professionnelle', `
la empresa|company|l’entreprise|🏢|Trabajo en una empresa pequeña.|I work for a small company.|Je travaille dans une petite entreprise.
el puesto|position / job|le poste|🪑|Ha conseguido un puesto de directora.|She got a director’s position.|Elle a obtenu un poste de directrice.
el contrato|contract|le contrat|📄|Firmé el contrato ayer.|I signed the contract yesterday.|J’ai signé le contrat hier.
la reunión|meeting|la réunion|👥|La reunión se ha alargado.|The meeting ran long.|La réunion s’est prolongée.
el compañero|colleague|le collègue|🤝|Mis compañeros son muy majos.|My colleagues are really nice.|Mes collègues sont très sympas.
el horario|schedule / hours|l’horaire|🕘|Tengo un horario flexible.|I have flexible hours.|J’ai des horaires flexibles.
teletrabajar|to work from home|télétravailler|🏠|Teletrabajo dos días a la semana.|I work from home two days a week.|Je télétravaille deux jours par semaine.
el paro|unemployment|le chômage|📉|Estuvo en el paro seis meses.|He was unemployed for six months.|Il a été au chômage six mois.
contratar|to hire|embaucher|✍️|Van a contratar a dos personas.|They’re going to hire two people.|Ils vont embaucher deux personnes.
despedir|to fire / to say goodbye|licencier / dire au revoir|🚪|Despidieron a medio equipo.|They fired half the team.|Ils ont licencié la moitié de l’équipe.
el ascenso|promotion|la promotion|📈|Le han dado un ascenso.|They’ve given her a promotion.|Elle a eu une promotion.
la experiencia|experience|l’expérience|🧭|Tengo cinco años de experiencia.|I have five years’ experience.|J’ai cinq ans d’expérience.
el currículum|CV / résumé|le CV|📑|Envía tu currículum por correo.|Send your CV by email.|Envoie ton CV par mail.
el plazo|deadline / term|le délai|⏳|El plazo termina el viernes.|The deadline is Friday.|Le délai se termine vendredi.
el cliente|client / customer|le client|🧑‍💼|Hay que llamar al cliente.|We need to call the client.|Il faut appeler le client.
negociar|to negotiate|négocier|🤝|Vamos a negociar el precio.|We’re going to negotiate the price.|Nous allons négocier le prix.
el éxito|success|le succès / la réussite|🏆|El proyecto fue un éxito.|The project was a success.|Le projet a été un succès.
el fracaso|failure|l’échec|💥|Aprendí mucho de ese fracaso.|I learned a lot from that failure.|J’ai beaucoup appris de cet échec.
`),
  t('society', '🏛️', 'Society', 'La société', `
el gobierno|government|le gouvernement|🏛️|El gobierno ha aprobado la ley.|The government has passed the law.|Le gouvernement a adopté la loi.
la ley|law|la loi|⚖️|La nueva ley entra en vigor en enero.|The new law comes into force in January.|La nouvelle loi entre en vigueur en janvier.
las elecciones|elections|les élections|🗳️|Las elecciones son en mayo.|The elections are in May.|Les élections ont lieu en mai.
votar|to vote|voter|🗳️|Siempre voto.|I always vote.|Je vote toujours.
el ciudadano|citizen|le citoyen|🧑‍🤝‍🧑|Los ciudadanos tienen derechos.|Citizens have rights.|Les citoyens ont des droits.
el derecho|right / law (field)|le droit|📜|La educación es un derecho.|Education is a right.|L’éducation est un droit.
la igualdad|equality|l’égalité|🟰|Luchamos por la igualdad.|We fight for equality.|Nous luttons pour l’égalité.
la pobreza|poverty|la pauvreté|🥀|La pobreza ha bajado este año.|Poverty has fallen this year.|La pauvreté a baissé cette année.
la manifestación|demonstration|la manifestation|📢|Hubo una manifestación en el centro.|There was a demonstration in the centre.|Il y a eu une manifestation dans le centre.
la huelga|strike|la grève|✊|Los profesores están en huelga.|The teachers are on strike.|Les professeurs sont en grève.
el impuesto|tax|l’impôt|🧾|Pagamos muchos impuestos.|We pay a lot of tax.|Nous payons beaucoup d’impôts.
la sanidad|health care|le système de santé|🏥|La sanidad pública es gratuita.|Public health care is free.|La santé publique est gratuite.
la vivienda|housing|le logement|🏘️|La vivienda es muy cara aquí.|Housing is very expensive here.|Le logement est très cher ici.
el voluntario|volunteer|le bénévole|🙌|Soy voluntario en una ONG.|I volunteer for an NGO.|Je suis bénévole dans une ONG.
la sociedad|society|la société|🌐|Vivimos en una sociedad diversa.|We live in a diverse society.|Nous vivons dans une société diverse.
el problema|problem|le problème|🧩|El tráfico es un gran problema.|Traffic is a big problem.|La circulation est un gros problème.
`),
  t('connectors', '🔗', 'Linking ideas', 'Relier ses idées', `
sin embargo|however|cependant|↔️|Es caro; sin embargo, merece la pena.|It’s expensive; however, it’s worth it.|C’est cher ; cependant, ça vaut le coup.
además|besides / also|de plus|➕|Además, el hotel tiene piscina.|Besides, the hotel has a pool.|De plus, l’hôtel a une piscine.
por eso|that’s why|c’est pourquoi|👉|Llovía, por eso no salimos.|It was raining, that’s why we didn’t go out.|Il pleuvait, c’est pourquoi on n’est pas sortis.
aunque|although / even if|bien que / même si|🌗|Aunque estoy cansado, voy a ir.|Although I’m tired, I’m going to go.|Même si je suis fatigué, je vais y aller.
mientras|while|pendant que|⏯️|Leo mientras espero el tren.|I read while I wait for the train.|Je lis pendant que j’attends le train.
en cambio|on the other hand|en revanche|🔄|Yo prefiero el mar; él, en cambio, la montaña.|I prefer the sea; he, on the other hand, the mountains.|Je préfère la mer ; lui, en revanche, la montagne.
por lo tanto|therefore|par conséquent|➡️|No hay billetes, por lo tanto iremos en coche.|There are no tickets, therefore we’ll drive.|Il n’y a pas de billets, donc nous irons en voiture.
de todas formas|anyway|de toute façon|🤷|De todas formas, gracias por avisar.|Anyway, thanks for letting me know.|De toute façon, merci de m’avoir prévenu.
en primer lugar|first of all|tout d’abord|1️⃣|En primer lugar, quiero daros las gracias.|First of all, I want to thank you.|Tout d’abord, je veux vous remercier.
por último|finally / lastly|enfin|🏁|Por último, hablaremos del presupuesto.|Lastly, we’ll talk about the budget.|Enfin, nous parlerons du budget.
es decir|that is to say|c’est-à-dire|💬|Vuelvo en dos semanas, es decir, el día quince.|I’m back in two weeks, that is, on the fifteenth.|Je reviens dans deux semaines, c’est-à-dire le quinze.
por ejemplo|for example|par exemple|📌|Me gustan las frutas, por ejemplo, el mango.|I like fruit, for example mango.|J’aime les fruits, par exemple la mangue.
a pesar de|despite|malgré|🧱|A pesar de la lluvia, el concierto siguió.|Despite the rain, the concert went on.|Malgré la pluie, le concert a continué.
en cuanto|as soon as|dès que|⚡|Te llamo en cuanto llegue.|I’ll call you as soon as I arrive.|Je t’appelle dès que j’arrive.
`),
  t('city2', '🌆', 'City life', 'La vie en ville', `
el barrio|neighbourhood|le quartier|🏘️|Mi barrio es muy tranquilo.|My neighbourhood is very quiet.|Mon quartier est très calme.
el tráfico|traffic|la circulation|🚗|A esta hora hay mucho tráfico.|There’s a lot of traffic at this time.|À cette heure-ci, il y a beaucoup de circulation.
el atasco|traffic jam|l’embouteillage|🚦|Estuvimos una hora en un atasco.|We were stuck in a jam for an hour.|Nous sommes restés une heure dans un embouteillage.
el ruido|noise|le bruit|🔊|No puedo dormir con tanto ruido.|I can’t sleep with so much noise.|Je ne peux pas dormir avec tout ce bruit.
la contaminación|pollution|la pollution|🏭|La contaminación es un problema serio.|Pollution is a serious problem.|La pollution est un problème sérieux.
el ayuntamiento|town hall|la mairie|🏛️|El ayuntamiento ha abierto un parque.|The town hall has opened a park.|La mairie a ouvert un parc.
el carril bici|cycle lane|la piste cyclable|🚴|Hay un carril bici nuevo.|There’s a new cycle lane.|Il y a une nouvelle piste cyclable.
la acera|pavement|le trottoir|🚶|Camina por la acera.|Walk on the pavement.|Marche sur le trottoir.
el semáforo|traffic light|le feu|🚥|Gira a la derecha en el semáforo.|Turn right at the traffic light.|Tourne à droite au feu.
el edificio|building|l’immeuble / le bâtiment|🏙️|El edificio tiene veinte plantas.|The building has twenty floors.|L’immeuble a vingt étages.
el puente|bridge|le pont|🌉|Cruzamos el puente a pie.|We crossed the bridge on foot.|Nous avons traversé le pont à pied.
la esquina|corner|le coin|📐|La farmacia está en la esquina.|The pharmacy is on the corner.|La pharmacie est au coin.
el vecindario|neighbourhood (people)|le voisinage|🏡|Todo el vecindario vino a la fiesta.|The whole neighbourhood came to the party.|Tout le voisinage est venu à la fête.
el transporte público|public transport|les transports en commun|🚌|Uso el transporte público cada día.|I use public transport every day.|J’utilise les transports en commun tous les jours.
el aparcamiento|car park|le parking|🅿️|No hay aparcamiento en el centro.|There’s no parking in the centre.|Il n’y a pas de parking dans le centre.
la multa|fine|l’amende|🎟️|Me pusieron una multa.|I got a fine.|J’ai eu une amende.
`),
  t('wellbeing', '🧘', 'Health and wellbeing', 'Santé et bien-être', `
la salud|health|la santé|❤️|La salud es lo más importante.|Health is the most important thing.|La santé, c’est le plus important.
el ejercicio|exercise|l’exercice|🏋️|Hago ejercicio todas las mañanas.|I exercise every morning.|Je fais du sport tous les matins.
la dieta|diet|le régime / l’alimentation|🥦|Sigo una dieta equilibrada.|I follow a balanced diet.|Je suis une alimentation équilibrée.
el estrés|stress|le stress|😫|El estrés afecta al sueño.|Stress affects sleep.|Le stress affecte le sommeil.
descansar|to rest|se reposer|🛋️|Necesitas descansar más.|You need to rest more.|Tu dois te reposer davantage.
relajarse|to relax|se détendre|🧘|Me relajo con música.|I relax with music.|Je me détends en musique.
la costumbre|habit / custom|l’habitude / la coutume|🔁|Es una buena costumbre.|It’s a good habit.|C’est une bonne habitude.
dejar de fumar|to quit smoking|arrêter de fumer|🚭|Mi padre dejó de fumar hace años.|My father quit smoking years ago.|Mon père a arrêté de fumer il y a des années.
sano|healthy|sain|🥗|Comer fruta es muy sano.|Eating fruit is very healthy.|Manger des fruits est très sain.
el peso|weight|le poids|⚖️|He perdido peso.|I’ve lost weight.|J’ai perdu du poids.
la vacuna|vaccine|le vaccin|💉|Me he puesto la vacuna.|I’ve had the vaccine.|Je me suis fait vacciner.
el síntoma|symptom|le symptôme|🌡️|¿Qué síntomas tiene?|What symptoms do you have?|Quels symptômes avez-vous ?
la alergia|allergy|l’allergie|🤧|Tengo alergia al polen.|I’m allergic to pollen.|Je suis allergique au pollen.
la meditación|meditation|la méditation|🕯️|La meditación me ayuda a concentrarme.|Meditation helps me focus.|La méditation m’aide à me concentrer.
el sueño reparador|restful sleep|un sommeil réparateur|😴|Un sueño reparador cambia el día.|Good sleep changes your day.|Un sommeil réparateur change la journée.
`),
  t('stories', '📚', 'Telling a story', 'Raconter une histoire', `
de repente|suddenly|soudain|⚡|De repente, se fue la luz.|Suddenly, the power went out.|Soudain, il y a eu une coupure de courant.
al principio|at first|au début|🌱|Al principio no entendía nada.|At first I didn’t understand anything.|Au début, je ne comprenais rien.
al final|in the end|à la fin|🏁|Al final todo salió bien.|In the end it all went well.|À la fin, tout s’est bien passé.
luego|then / later|ensuite / plus tard|⏭️|Primero cenamos y luego fuimos a bailar.|First we had dinner, then we went dancing.|D’abord on a dîné, puis on est allés danser.
mientras tanto|meanwhile|pendant ce temps|⏸️|Mientras tanto, Ana esperaba en el coche.|Meanwhile, Ana was waiting in the car.|Pendant ce temps, Ana attendait dans la voiture.
había una vez|once upon a time|il était une fois|🏰|Había una vez un rey muy viejo.|Once upon a time there was a very old king.|Il était une fois un très vieux roi.
ocurrir|to happen|se produire|💥|¿Qué ocurrió después?|What happened next?|Que s’est-il passé ensuite ?
darse cuenta|to realise|se rendre compte|💡|Me di cuenta de que había perdido las llaves.|I realised I had lost the keys.|Je me suis rendu compte que j’avais perdu les clés.
acordarse|to remember|se souvenir|🧠|¿Te acuerdas de aquel verano?|Do you remember that summer?|Tu te souviens de cet été-là ?
olvidar|to forget|oublier|🫥|Olvidé su nombre.|I forgot her name.|J’ai oublié son nom.
contar|to tell / to count|raconter / compter|🗨️|Mi abuelo cuenta historias increíbles.|My grandfather tells incredible stories.|Mon grand-père raconte des histoires incroyables.
el personaje|character|le personnage|🎭|El personaje principal es una detective.|The main character is a detective.|Le personnage principal est une détective.
la aventura|adventure|l’aventure|🗺️|Fue una aventura inolvidable.|It was an unforgettable adventure.|Ce fut une aventure inoubliable.
asustarse|to get scared|avoir peur|😱|Me asusté mucho con el ruido.|The noise really scared me.|Le bruit m’a fait très peur.
reírse|to laugh|rire|😆|Nos reímos toda la noche.|We laughed all night.|Nous avons ri toute la nuit.
`),
];
