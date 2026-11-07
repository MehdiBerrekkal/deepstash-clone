import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** German, A1 → B1, for English speakers. Original content written for this app. Lines are "Wort|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `de-${id}`, level, icon, en, fr, words: w5(block) });

const topics: Topic[] = [
  // ---------- A1 ----------
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
hallo|hello|👋|Hallo, ich bin Lena.|Hello, I’m Lena.
guten Morgen|good morning|🌅|Guten Morgen, Herr Weber!|Good morning, Mr Weber!
guten Tag|good day / hello|☀️|Guten Tag, wie geht es Ihnen?|Hello, how are you?
tschüss|bye|🫡|Tschüss, bis morgen!|Bye, see you tomorrow!
danke|thank you|🙏|Danke schön!|Thank you very much!
bitte|please / you’re welcome|🙂|Einen Kaffee, bitte.|A coffee, please.
Entschuldigung|excuse me / sorry|😅|Entschuldigung, wo ist der Bahnhof?|Excuse me, where is the station?
der Name|name|🏷️|Wie ist Ihr Name?|What’s your name?
der Freund|friend (m)|🤝|Felix ist mein Freund.|Felix is my friend.
die Freundin|friend (f)|🤝|Lena ist meine Freundin.|Lena is my friend.
der Mann|man / husband|👨|Der Mann liest Zeitung.|The man is reading the paper.
die Frau|woman / wife / Mrs|👩|Frau Schmidt ist Ärztin.|Mrs Schmidt is a doctor.
das Kind|child|🧒|Das Kind spielt im Garten.|The child is playing in the garden.
ja|yes|✅|Ja, gerne!|Yes, gladly!
nein|no|❌|Nein, danke.|No, thanks.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
der Kaffee|coffee|☕|Einen Kaffee mit Milch, bitte.|A coffee with milk, please.
der Tee|tea|🍵|Ich trinke lieber Tee.|I prefer tea.
das Wasser|water|💧|Ein Glas Wasser, bitte.|A glass of water, please.
der Saft|juice|🧃|Ein Apfelsaft, bitte.|An apple juice, please.
die Milch|milk|🥛|Mit Milch und Zucker?|With milk and sugar?
der Zucker|sugar|🍬|Ohne Zucker, bitte.|Without sugar, please.
der Kuchen|cake|🍰|Der Apfelkuchen ist lecker.|The apple cake is delicious.
das Brötchen|bread roll|🥯|Zwei Brötchen, bitte.|Two rolls, please.
die Rechnung|the bill|🧾|Die Rechnung, bitte.|The bill, please.
der Kellner|waiter|🤵|Der Kellner kommt gleich.|The waiter is coming right away.
ich möchte|I would like|🙂|Ich möchte ein Wasser.|I’d like a water.
wie viel kostet|how much is|💶|Wie viel kostet das?|How much is that?
lecker|tasty|😋|Das ist sehr lecker!|That’s very tasty!
heiß|hot|♨️|Vorsicht, der Tee ist heiß.|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
die Familie|family|👪|Meine Familie wohnt in Hamburg.|My family lives in Hamburg.
die Mutter|mother|👩|Meine Mutter ist Lehrerin.|My mother is a teacher.
der Vater|father|👨|Mein Vater kocht gern.|My father likes cooking.
die Eltern|parents|👨‍👩‍👧|Meine Eltern sind im Urlaub.|My parents are on holiday.
der Bruder|brother|👦|Mein Bruder heißt Felix.|My brother is called Felix.
die Schwester|sister|👧|Ich habe eine Schwester.|I have a sister.
der Sohn|son|👦|Ihr Sohn ist zehn.|Her son is ten.
die Tochter|daughter|👧|Meine Tochter malt gern.|My daughter likes painting.
der Opa|grandpa|👴|Mein Opa ist achtzig.|My grandpa is eighty.
die Oma|grandma|👵|Oma backt den besten Kuchen.|Grandma bakes the best cake.
der Onkel|uncle|🧔|Mein Onkel lebt in Wien.|My uncle lives in Vienna.
die Tante|aunt|👩‍🦱|Meine Tante ist Ärztin.|My aunt is a doctor.
das Baby|baby|👶|Das Baby schläft.|The baby is sleeping.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
eins|one|1️⃣|Ich habe eine Katze.|I have one cat.
zwei|two|2️⃣|Zwei Kaffee, bitte.|Two coffees, please.
drei|three|3️⃣|Wir sind drei.|There are three of us.
vier|four|4️⃣|Er hat vier Kinder.|He has four children.
fünf|five|5️⃣|Das kostet fünf Euro.|That costs five euros.
sechs|six|6️⃣|Ich stehe um sechs auf.|I get up at six.
sieben|seven|7️⃣|Die Woche hat sieben Tage.|The week has seven days.
acht|eight|8️⃣|Ich arbeite acht Stunden.|I work eight hours.
neun|nine|9️⃣|Meine Tochter ist neun.|My daughter is nine.
zehn|ten|🔟|Der Zug kommt in zehn Minuten.|The train comes in ten minutes.
zwanzig|twenty|💶|Das macht zwanzig Euro.|That’s twenty euros.
hundert|hundred|💯|Das Hotel ist hundert Meter weiter.|The hotel is a hundred metres further.
wie alt|how old|🎂|Wie alt bist du?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
Montag|Monday|1️⃣|Am Montag arbeite ich.|On Monday I work.
Dienstag|Tuesday|2️⃣|Am Dienstag gehe ich schwimmen.|On Tuesday I go swimming.
Mittwoch|Wednesday|3️⃣|Mittwoch ist mein freier Tag.|Wednesday is my day off.
Donnerstag|Thursday|4️⃣|Sehen wir uns am Donnerstag?|Shall we meet on Thursday?
Freitag|Friday|5️⃣|Freitagabend gehen wir aus.|On Friday evening we go out.
Samstag|Saturday|6️⃣|Am Samstag gehe ich auf den Markt.|On Saturday I go to the market.
Sonntag|Sunday|7️⃣|Am Sonntag essen wir zusammen.|On Sunday we eat together.
heute|today|📅|Heute ist das Wetter schön.|The weather is nice today.
morgen|tomorrow|🌄|Bis morgen!|See you tomorrow!
gestern|yesterday|⬅️|Gestern war ich müde.|Yesterday I was tired.
die Uhr|clock / o’clock|🕐|Wie viel Uhr ist es?|What time is it?
der Morgen|morning|🌅|Am Morgen trinke ich Kaffee.|In the morning I drink coffee.
der Abend|evening|🌆|Heute Abend essen wir bei Lena.|Tonight we’re eating at Lena’s.
die Woche|week|🗓️|Ich arbeite fünf Tage pro Woche.|I work five days a week.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
das Haus|house|🏠|Das Haus hat einen Garten.|The house has a garden.
die Wohnung|flat|🏢|Meine Wohnung ist klein.|My flat is small.
die Küche|kitchen|🍳|Die Küche ist hell.|The kitchen is bright.
das Schlafzimmer|bedroom|🛏️|Das Schlafzimmer ist ruhig.|The bedroom is quiet.
das Badezimmer|bathroom|🛁|Das Badezimmer ist rechts.|The bathroom is on the right.
das Wohnzimmer|living room|🛋️|Wir sehen im Wohnzimmer fern.|We watch TV in the living room.
die Tür|door|🚪|Mach bitte die Tür zu.|Please close the door.
das Fenster|window|🪟|Mach das Fenster auf.|Open the window.
das Bett|bed|🛌|Das Bett ist bequem.|The bed is comfortable.
der Stuhl|chair|🪑|Nimm einen Stuhl.|Take a chair.
der Schlüssel|key|🔑|Wo ist mein Schlüssel?|Where’s my key?
der Garten|garden|🌷|Die Kinder spielen im Garten.|The children play in the garden.
der Kühlschrank|fridge|🧊|Die Milch ist im Kühlschrank.|The milk is in the fridge.
wohnen|to live (somewhere)|🏡|Ich wohne in Berlin.|I live in Berlin.
`),
  t('A1', 'food', '🥨', 'Food', 'La nourriture', `
das Brot|bread|🍞|Deutsches Brot ist berühmt.|German bread is famous.
die Brezel|pretzel|🥨|Eine Brezel mit Butter.|A pretzel with butter.
der Käse|cheese|🧀|Ein Käsebrot, bitte.|A cheese sandwich, please.
die Wurst|sausage|🌭|Eine Bratwurst mit Senf.|A bratwurst with mustard.
der Apfel|apple|🍎|Ein Apfel am Tag.|An apple a day.
die Banane|banana|🍌|Die Banane ist reif.|The banana is ripe.
die Kartoffel|potato|🥔|Kartoffeln mit Quark.|Potatoes with quark.
das Fleisch|meat|🥩|Ich esse kein Fleisch.|I don’t eat meat.
der Fisch|fish|🐟|Freitags gibt es Fisch.|On Fridays there’s fish.
das Ei|egg|🥚|Zum Frühstück ein Ei.|An egg for breakfast.
die Suppe|soup|🥣|Die Suppe ist heiß.|The soup is hot.
das Gemüse|vegetables|🥦|Iss mehr Gemüse!|Eat more vegetables!
essen|to eat|🍽️|Wir essen um zwölf.|We eat at twelve.
trinken|to drink|🥤|Ich trinke viel Wasser.|I drink a lot of water.
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
rot|red|🔴|Ein rotes Auto.|A red car.
blau|blue|🔵|Der Himmel ist blau.|The sky is blue.
grün|green|🟢|Die Wiese ist grün.|The meadow is green.
gelb|yellow|🟡|Eine gelbe Blume.|A yellow flower.
schwarz|black|⚫|Eine schwarze Katze.|A black cat.
weiß|white|⚪|Ein weißes Hemd.|A white shirt.
groß|big / tall|🦒|Mein Bruder ist sehr groß.|My brother is very tall.
klein|small|🐭|Ein kleiner Hund.|A small dog.
neu|new|🆕|Ich habe ein neues Handy.|I have a new phone.
alt|old|🏚️|Das Haus ist sehr alt.|The house is very old.
schön|beautiful / nice|🌸|Was für ein schöner Tag!|What a beautiful day!
teuer|expensive|💎|Das Restaurant ist teuer.|The restaurant is expensive.
billig|cheap|🏷️|Das Hotel ist billig.|The hotel is cheap.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
das Wetter|weather|🌤️|Wie ist das Wetter?|What’s the weather like?
die Sonne|sun|☀️|Die Sonne scheint.|The sun is shining.
der Regen|rain|🌧️|Es regnet seit heute Morgen.|It’s been raining since this morning.
der Schnee|snow|❄️|Im Winter liegt viel Schnee.|There’s lots of snow in winter.
der Wind|wind|🌬️|Es ist sehr windig.|It’s very windy.
die Wolke|cloud|☁️|Der Himmel ist voller Wolken.|The sky is full of clouds.
warm|warm|🌡️|Heute ist es warm.|It’s warm today.
kalt|cold|🥶|Es ist kalt draußen.|It’s cold outside.
der Sommer|summer|🏖️|Im Sommer fahren wir an die Ostsee.|In summer we go to the Baltic.
der Winter|winter|☃️|Der Winter ist lang.|Winter is long.
der Frühling|spring|🌱|Im Frühling blühen die Bäume.|In spring the trees blossom.
der Herbst|autumn|🍂|Im Herbst fallen die Blätter.|In autumn the leaves fall.
der Regenschirm|umbrella|☂️|Nimm einen Regenschirm mit.|Take an umbrella.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
die Straße|street|🛣️|Ich wohne in dieser Straße.|I live on this street.
der Platz|square|⛲|Der Markt ist auf dem Platz.|The market is on the square.
der Bahnhof|train station|🚉|Der Bahnhof ist gleich da.|The station is just there.
die Bäckerei|bakery|🥖|Die Bäckerei öffnet um sechs.|The bakery opens at six.
die Apotheke|pharmacy|💊|Gibt es hier eine Apotheke?|Is there a pharmacy here?
der Supermarkt|supermarket|🛒|Ich gehe zum Supermarkt.|I’m going to the supermarket.
die Bank|bank / bench|🏦|Die Bank ist am Samstag zu.|The bank is closed on Saturday.
das Museum|museum|🏛️|Das Museum ist montags geschlossen.|The museum is closed on Mondays.
die Kirche|church|⛪|Die Kirche ist sehr alt.|The church is very old.
der Park|park|🌳|Wir gehen im Park spazieren.|We go for a walk in the park.
rechts|right|➡️|Gehen Sie nach rechts.|Go right.
links|left|⬅️|Der Bahnhof ist links.|The station is on the left.
geradeaus|straight on|⬆️|Immer geradeaus.|Keep going straight.
weit|far|🧭|Ist es weit?|Is it far?
`),
  // ---------- A2 ----------
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
die Reise|trip|🧳|Gute Reise!|Have a good trip!
reisen|to travel|🌍|Ich reise gern allein.|I like travelling alone.
das Flugzeug|plane|✈️|Das Flugzeug landet um zwölf.|The plane lands at twelve.
der Flughafen|airport|🛫|Wir fahren mit dem Taxi zum Flughafen.|We take a taxi to the airport.
die Fahrkarte|ticket|🎫|Ich kaufe eine Fahrkarte.|I’m buying a ticket.
der Koffer|suitcase|🧳|Mein Koffer ist zu schwer.|My suitcase is too heavy.
der Reisepass|passport|🛂|Vergiss deinen Reisepass nicht!|Don’t forget your passport!
der Urlaub|holiday|🏝️|Wir machen Urlaub in Italien.|We’re on holiday in Italy.
der Strand|beach|🏖️|Der Strand ist ganz nah.|The beach is very close.
die Berge|mountains|🏔️|Im Winter fahren wir in die Berge.|In winter we go to the mountains.
das Ausland|abroad|🗺️|Sie arbeitet im Ausland.|She works abroad.
die Karte|map / card|🗺️|Schau auf die Karte!|Look at the map!
das Souvenir|souvenir|🎁|Ich kaufe ein Souvenir.|I’m buying a souvenir.
`),
  t('A2', 'hotel', '🏨', 'At the hotel', 'À l’hôtel', `
die Reservierung|booking|📋|Ich habe eine Reservierung.|I have a booking.
das Doppelzimmer|double room|🛏️|Ein Doppelzimmer für zwei Nächte.|A double room for two nights.
die Rezeption|reception|🛎️|Fragen Sie an der Rezeption.|Ask at reception.
das Frühstück|breakfast|🥐|Das Frühstück ist von sieben bis zehn.|Breakfast is from seven to ten.
die Dusche|shower|🚿|Die Dusche funktioniert nicht.|The shower doesn’t work.
das Handtuch|towel|🧺|Kann ich noch ein Handtuch haben?|Can I have another towel?
der Aufzug|lift|🛗|Der Aufzug ist links.|The lift is on the left.
der Stock|floor|🏢|Ihr Zimmer ist im dritten Stock.|Your room is on the third floor.
die Nacht|night|🌙|Was kostet eine Nacht?|How much is one night?
das WLAN|wifi|📶|Wie ist das WLAN-Passwort?|What’s the wifi password?
ruhig|quiet|🤫|Ein ruhiges Zimmer, bitte.|A quiet room, please.
laut|loud / noisy|🔊|Die Straße ist sehr laut.|The street is very noisy.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
der Arzt|doctor (m)|👨‍⚕️|Ich muss zum Arzt.|I have to go to the doctor.
die Ärztin|doctor (f)|👩‍⚕️|Die Ärztin ist sehr nett.|The doctor is very nice.
krank|ill|🤒|Ich bin krank.|I’m ill.
das Fieber|fever|🌡️|Ich habe Fieber.|I have a fever.
die Erkältung|cold|🤧|Ich habe eine Erkältung.|I have a cold.
der Husten|cough|😷|Der Husten ist schlimm.|The cough is bad.
die Kopfschmerzen|headache|🤕|Ich habe Kopfschmerzen.|I have a headache.
das Rezept|prescription / recipe|📃|Hier ist Ihr Rezept.|Here’s your prescription.
die Tablette|tablet|💊|Nehmen Sie zwei Tabletten.|Take two tablets.
müde|tired|🥱|Ich bin so müde.|I’m so tired.
sich ausruhen|to rest|🛋️|Ruhen Sie sich aus.|Get some rest.
gesund|healthy|💪|Obst ist gesund.|Fruit is healthy.
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
die Arbeit|work|💼|Die Arbeit macht Spaß.|Work is fun.
arbeiten|to work|🧑‍💻|Ich arbeite bei einer Bank.|I work at a bank.
das Büro|office|🏢|Das Büro ist in der Stadt.|The office is in town.
der Kollege|colleague|🤝|Meine Kollegen sind nett.|My colleagues are nice.
der Chef|boss|😎|Der Chef ist im Meeting.|The boss is in a meeting.
die Besprechung|meeting|👥|Die Besprechung beginnt um neun.|The meeting starts at nine.
das Gehalt|salary|💵|Das Gehalt ist gut.|The salary is good.
das Vorstellungsgespräch|job interview|🤝|Morgen habe ich ein Vorstellungsgespräch.|Tomorrow I have a job interview.
der Beruf|profession|🧑‍🔧|Was sind Sie von Beruf?|What do you do for a living?
die Firma|company|🏢|Sie hat eine eigene Firma.|She has her own company.
das Homeoffice|working from home|🏠|Montags mache ich Homeoffice.|On Mondays I work from home.
der Feierabend|end of the working day|🍻|Endlich Feierabend!|Finally finished for the day!
`),
  t('A2', 'hobbies', '🚴', 'Free time', 'Les loisirs', `
das Hobby|hobby|🎨|Was sind deine Hobbys?|What are your hobbies?
Fußball spielen|to play football|⚽|Ich spiele Fußball im Verein.|I play football in a club.
schwimmen|to swim|🏊|Ich schwimme jeden Morgen.|I swim every morning.
Rad fahren|to cycle|🚴|Felix fährt jeden Tag Rad.|Felix cycles every day.
wandern|to hike|🥾|Wir wandern in den Alpen.|We hike in the Alps.
lesen|to read|📖|Ich lese gern Krimis.|I like reading crime novels.
das Kino|cinema|🎬|Gehen wir heute ins Kino?|Shall we go to the cinema today?
die Musik|music|🎵|Ich höre Musik beim Arbeiten.|I listen to music while working.
Gitarre spielen|to play guitar|🎸|Er spielt seit Jahren Gitarre.|He’s played guitar for years.
tanzen|to dance|💃|Wir tanzen am Samstag.|We’re dancing on Saturday.
kochen|to cook|👩‍🍳|Ich koche am Wochenende.|I cook at the weekend.
das Brettspiel|board game|🎲|Spielen wir ein Brettspiel?|Shall we play a board game?
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
das Geschäft|shop|🏬|Das Geschäft öffnet um zehn.|The shop opens at ten.
kaufen|to buy|🛒|Ich kaufe jeden Morgen Brötchen.|I buy rolls every morning.
der Preis|price|🏷️|Was ist der Preis?|What’s the price?
die Größe|size|📏|Haben Sie eine Nummer größer?|Do you have a size bigger?
die Umkleidekabine|fitting room|🚪|Die Umkleidekabine ist hinten.|The fitting room is at the back.
bezahlen|to pay|💳|Kann ich mit Karte bezahlen?|Can I pay by card?
bar|in cash|💵|Ich zahle bar.|I’ll pay cash.
der Kassenbon|receipt|🧾|Brauchen Sie den Kassenbon?|Do you need the receipt?
umtauschen|to exchange|🔁|Kann ich das umtauschen?|Can I exchange this?
das Geschenk|present|🎁|Das ist ein Geschenk für meine Mutter.|It’s a present for my mother.
die Tüte|bag|🛍️|Brauchen Sie eine Tüte?|Do you need a bag?
der Schlussverkauf|sale|🏷️|Im Januar ist Schlussverkauf.|The sales are in January.
`),
  t('A2', 'transport', '🚆', 'Getting around', 'Se déplacer', `
der Zug|train|🚆|Der Zug nach München fährt um acht.|The train to Munich leaves at eight.
die U-Bahn|underground|🚇|Ich fahre mit der U-Bahn.|I take the underground.
der Bus|bus|🚌|Der Bus kommt alle zehn Minuten.|The bus comes every ten minutes.
das Auto|car|🚗|Fahren wir mit dem Auto?|Shall we go by car?
das Fahrrad|bicycle|🚲|Mein Fahrrad ist kaputt.|My bike is broken.
das Gleis|platform|🚉|Der Zug fährt von Gleis drei.|The train leaves from platform three.
die Haltestelle|stop|🚏|An der nächsten Haltestelle steige ich aus.|I get off at the next stop.
die Verspätung|delay|⏰|Der Zug hat zwanzig Minuten Verspätung.|The train is twenty minutes late.
umsteigen|to change (trains)|🔁|In Köln muss ich umsteigen.|I have to change in Cologne.
einsteigen|to get on|⬆️|Bitte einsteigen!|All aboard!
aussteigen|to get off|⬇️|Wir steigen hier aus.|We get off here.
verpassen|to miss|😩|Ich habe den Bus verpasst.|I missed the bus.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
glücklich|happy|😊|Ich bin sehr glücklich hier.|I’m very happy here.
traurig|sad|😢|Sie ist traurig.|She’s sad.
wütend|angry|😠|Warum bist du wütend?|Why are you angry?
nervös|nervous|😬|Ich bin nervös vor der Prüfung.|I’m nervous before the exam.
froh|glad|🙂|Ich bin froh, dich zu sehen.|I’m glad to see you.
stolz|proud|🦚|Ich bin stolz auf dich.|I’m proud of you.
überrascht|surprised|😮|Ich war sehr überrascht.|I was very surprised.
die Angst|fear|😱|Ich habe Angst vor Spinnen.|I’m afraid of spiders.
langweilig|boring|🥱|Der Film ist langweilig.|The film is boring.
enttäuscht|disappointed|😞|Er ist enttäuscht.|He’s disappointed.
entspannt|relaxed|😌|Im Urlaub bin ich entspannt.|On holiday I’m relaxed.
vermissen|to miss (someone)|💌|Ich vermisse dich.|I miss you.
`),
  // ---------- B1 ----------
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
meiner Meinung nach|in my opinion|💬|Meiner Meinung nach ist das richtig.|In my opinion that’s right.
ich finde|I think / I find|💭|Ich finde die Idee gut.|I think the idea is good.
Recht haben|to be right|✅|Du hast Recht.|You’re right.
einverstanden|agreed|🤝|Ich bin einverstanden.|I agree.
aber|but|↔️|Es ist teuer, aber gut.|It’s expensive, but good.
deshalb|that’s why|➡️|Es regnet, deshalb bleibe ich zu Hause.|It’s raining, so I’m staying home.
trotzdem|nevertheless|💪|Es war kalt, trotzdem sind wir gewandert.|It was cold; we hiked anyway.
der Vorteil|advantage|👍|Der Vorteil ist der Preis.|The advantage is the price.
der Nachteil|disadvantage|👎|Der Nachteil ist der Lärm.|The disadvantage is the noise.
überzeugen|to convince|🗣️|Du hast mich überzeugt.|You’ve convinced me.
wahrscheinlich|probably|🤷|Wahrscheinlich regnet es morgen.|It’ll probably rain tomorrow.
eigentlich|actually|📌|Eigentlich habe ich keine Zeit.|Actually, I don’t have time.
`),
  t('B1', 'environment', '🌱', 'The environment', 'L’environnement', `
die Umwelt|environment|🌍|Wir müssen die Umwelt schützen.|We must protect the environment.
der Klimawandel|climate change|🌡️|Der Klimawandel ist ein großes Problem.|Climate change is a big problem.
der Müll|rubbish|🗑️|Wir trennen den Müll.|We sort our rubbish.
recyceln|to recycle|♻️|Glas kann man recyceln.|Glass can be recycled.
die Energie|energy|🔋|Erneuerbare Energie ist die Zukunft.|Renewable energy is the future.
sparen|to save|💡|Spar Wasser!|Save water!
das Plastik|plastic|🥤|Weniger Plastik, bitte.|Less plastic, please.
nachhaltig|sustainable|🌿|Nachhaltig einkaufen.|Shopping sustainably.
die Natur|nature|🍃|Ich bin gern in der Natur.|I like being in nature.
der Wald|forest|🌲|Der Schwarzwald ist berühmt.|The Black Forest is famous.
die Luft|air|💨|Die Luft ist hier sauber.|The air here is clean.
verschwenden|to waste|🚮|Verschwende kein Essen.|Don’t waste food.
`),
  t('B1', 'tech', '💻', 'Technology', 'La technologie', `
der Computer|computer|💻|Mein Computer ist langsam.|My computer is slow.
das Handy|mobile phone|📱|Ich habe mein Handy vergessen.|I forgot my phone.
die App|app|📲|Lade die App herunter.|Download the app.
das Passwort|password|🔑|Ich habe mein Passwort vergessen.|I forgot my password.
der Bildschirm|screen|🖥️|Zu viel Zeit vor dem Bildschirm.|Too much screen time.
herunterladen|to download|⬇️|Die Datei wird heruntergeladen.|The file is downloading.
die Datei|file|📁|Schick mir die Datei.|Send me the file.
der Akku|battery|🔋|Mein Akku ist fast leer.|My battery is almost empty.
das Ladegerät|charger|🔌|Hast du ein Ladegerät?|Do you have a charger?
aktualisieren|to update|🔄|Das Handy muss aktualisiert werden.|The phone needs updating.
die künstliche Intelligenz|artificial intelligence|🤖|Künstliche Intelligenz verändert die Arbeit.|AI is changing work.
online|online|🌐|Ich kaufe viel online.|I buy a lot online.
`),
  t('B1', 'culture', '🎭', 'Culture', 'La culture', `
das Theater|theatre|🎭|Wir gehen am Samstag ins Theater.|We’re going to the theatre on Saturday.
die Ausstellung|exhibition|🖼️|Die Ausstellung ist toll.|The exhibition is great.
das Gemälde|painting|🖼️|Das Gemälde hängt im Museum.|The painting hangs in the museum.
der Roman|novel|📘|Ich lese einen Roman von Kafka.|I’m reading a Kafka novel.
der Schriftsteller|writer|✒️|Er ist ein bekannter Schriftsteller.|He’s a well-known writer.
das Konzert|concert|🎻|Das Konzert beginnt um acht.|The concert starts at eight.
das Fest|festival / party|🎪|Das Oktoberfest ist in München.|Oktoberfest is in Munich.
die Tradition|tradition|🎎|Das ist eine alte Tradition.|It’s an old tradition.
die Geschichte|history / story|📜|Ich interessiere mich für Geschichte.|I’m interested in history.
das Jahrhundert|century|⏳|Eine Kirche aus dem zwölften Jahrhundert.|A twelfth-century church.
berühmt|famous|⭐|Eine berühmte Schauspielerin.|A famous actress.
die Sprache|language|🗣️|Deutsch ist eine schöne Sprache.|German is a beautiful language.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'de-g-articles', level: 'A1', icon: '🔤', en: 'Der, die, das', fr: 'Der, die, das',
    cards: [
      { en: 'German nouns have three genders: der (masculine), die (feminine), das (neuter). Plural is always die. Learn each noun with its article.', fr: 'Trois genres : der, die, das ; pluriel : die.', examples: [['der Tisch', 'the table', 'the table'], ['die Lampe', 'the lamp', 'the lamp'], ['das Buch', 'the book', 'the book']] },
      { en: '"A": ein (m, n), eine (f). "No / not a": kein, keine.', fr: '« Un » : ein, eine. « Pas de » : kein, keine.', examples: [['ein Hund', 'a dog', 'a dog'], ['keine Zeit', 'no time', 'no time']] },
    ],
    drills: [
      { text: '___ Kaffee ist heiß.', answer: 'Der', wrong: ['Die', 'Das'], en: 'The coffee is hot.', fr: 'The coffee is hot.' },
      { text: '___ Milch ist im Kühlschrank.', answer: 'Die', wrong: ['Der', 'Das'], en: 'The milk is in the fridge.', fr: 'The milk is in the fridge.' },
      { text: '___ Kind spielt.', answer: 'Das', wrong: ['Der', 'Die'], en: 'The child is playing.', fr: 'The child is playing.' },
      { text: 'Ich habe ___ Zeit.', answer: 'keine', wrong: ['kein', 'nicht'], en: 'I have no time.', fr: 'I have no time.' },
    ],
  },
  {
    id: 'de-g-sein-haben', level: 'A1', icon: '🧩', en: 'Sein and haben', fr: 'Sein et haben',
    cards: [
      { en: 'sein (to be): ich bin, du bist, er/sie/es ist, wir sind, ihr seid, sie/Sie sind.', fr: 'sein : bin, bist, ist, sind, seid, sind.', examples: [['Ich bin müde.', 'I’m tired.', 'I’m tired.']] },
      { en: 'haben (to have): ich habe, du hast, er hat, wir haben, ihr habt, sie haben.', fr: 'haben : habe, hast, hat, haben, habt, haben.', examples: [['Hast du Zeit?', 'Do you have time?', 'Do you have time?']] },
    ],
    drills: [
      { text: 'Ich ___ Lena.', answer: 'bin', wrong: ['ist', 'habe'], en: 'I’m Lena.', fr: 'I’m Lena.' },
      { text: 'Du ___ einen Bruder.', answer: 'hast', wrong: ['bist', 'hat'], en: 'You have a brother.', fr: 'You have a brother.' },
      { text: 'Wir ___ in Berlin.', answer: 'sind', wrong: ['seid', 'haben'], en: 'We’re in Berlin.', fr: 'We’re in Berlin.' },
      { text: 'Er ___ Hunger.', answer: 'hat', wrong: ['ist', 'habt'], en: 'He’s hungry.', fr: 'He’s hungry.' },
    ],
  },
  {
    id: 'de-g-present', level: 'A1', icon: '🔁', en: 'Present tense and word order', fr: 'Présent et ordre des mots',
    cards: [
      { en: 'Regular verbs: stem + -e, -st, -t, -en, -t, -en. (ich wohne, du wohnst, er wohnt, wir wohnen…)', fr: 'Terminaisons : -e, -st, -t, -en, -t, -en.', examples: [['Ich wohne in Hamburg.', 'I live in Hamburg.', 'I live in Hamburg.']] },
      { en: 'The verb is always the second element: Heute gehe ich ins Kino (Today go I to the cinema).', fr: 'Le verbe est toujours en deuxième position.', examples: [['Morgen arbeite ich nicht.', 'Tomorrow I’m not working.', 'Tomorrow I’m not working.']] },
    ],
    drills: [
      { text: 'Du ___ sehr gut Deutsch.', answer: 'sprichst', wrong: ['spreche', 'sprecht'], en: 'You speak German very well.', fr: 'You speak German very well.' },
      { text: 'Wir ___ in München.', answer: 'wohnen', wrong: ['wohnt', 'wohnst'], en: 'We live in Munich.', fr: 'We live in Munich.' },
      { text: 'Heute ___ ich ins Kino.', answer: 'gehe', wrong: ['geht', 'gehen'], en: 'Today I’m going to the cinema.', fr: 'Today I’m going to the cinema.' },
      { text: 'Er ___ jeden Tag.', answer: 'arbeitet', wrong: ['arbeite', 'arbeiten'], en: 'He works every day.', fr: 'He works every day.' },
    ],
  },
  {
    id: 'de-g-accusative', level: 'A2', icon: '🎯', en: 'The accusative', fr: 'L’accusatif',
    cards: [
      { en: 'The direct object goes in the accusative. Only masculine changes: der → den, ein → einen.', fr: 'Accusatif : seul le masculin change (den, einen).', examples: [['Ich kaufe den Kuchen.', 'I’m buying the cake.', 'I’m buying the cake.'], ['Ich habe einen Bruder.', 'I have a brother.', 'I have a brother.']] },
    ],
    drills: [
      { text: 'Ich trinke ___ Kaffee.', answer: 'einen', wrong: ['ein', 'eine'], en: 'I drink a coffee.', fr: 'I drink a coffee.' },
      { text: 'Siehst du ___ Hund?', answer: 'den', wrong: ['der', 'dem'], en: 'Do you see the dog?', fr: 'Do you see the dog?' },
      { text: 'Ich kaufe ___ Zeitung.', answer: 'die', wrong: ['den', 'der'], en: 'I’m buying the newspaper.', fr: 'I’m buying the newspaper.' },
    ],
  },
  {
    id: 'de-g-perfekt', level: 'A2', icon: '⏮️', en: 'The perfect tense', fr: 'Le parfait (Perfekt)',
    cards: [
      { en: 'Spoken past: haben or sein + past participle at the end. Most verbs use haben: Ich habe gekocht.', fr: 'Perfekt : haben/sein + participe à la fin.', examples: [['Ich habe Pizza gegessen.', 'I ate pizza.', 'I ate pizza.']] },
      { en: 'Verbs of movement or change use sein: Ich bin nach Berlin gefahren.', fr: 'Mouvement ou changement : sein.', examples: [['Wir sind ins Kino gegangen.', 'We went to the cinema.', 'We went to the cinema.']] },
    ],
    drills: [
      { text: 'Ich ___ einen Film gesehen.', answer: 'habe', wrong: ['bin', 'hat'], en: 'I saw a film.', fr: 'I saw a film.' },
      { text: 'Wir ___ nach Wien gefahren.', answer: 'sind', wrong: ['haben', 'seid'], en: 'We went to Vienna.', fr: 'We went to Vienna.' },
      { text: 'Hast du schon ___?', answer: 'gegessen', wrong: ['essen', 'geesst'], en: 'Have you eaten yet?', fr: 'Have you eaten yet?' },
    ],
  },
  {
    id: 'de-g-modal', level: 'B1', icon: '🧭', en: 'Modal verbs', fr: 'Les verbes de modalité',
    cards: [
      { en: 'können (can), müssen (must), wollen (want), dürfen (may), sollen (should), möchten (would like). The second verb goes to the end in the infinitive.', fr: 'Modaux : le second verbe à l’infinitif en fin de phrase.', examples: [['Ich muss heute arbeiten.', 'I have to work today.', 'I have to work today.'], ['Kannst du mir helfen?', 'Can you help me?', 'Can you help me?']] },
    ],
    drills: [
      { text: 'Ich ___ heute nicht kommen.', answer: 'kann', wrong: ['kannst', 'können'], en: 'I can’t come today.', fr: 'I can’t come today.' },
      { text: 'Wir ___ morgen früh aufstehen.', answer: 'müssen', wrong: ['muss', 'müsst'], en: 'We have to get up early tomorrow.', fr: 'We have to get up early tomorrow.' },
      { text: 'Hier ___ man nicht rauchen.', answer: 'darf', wrong: ['will', 'kann'], en: 'You’re not allowed to smoke here.', fr: 'You’re not allowed to smoke here.' },
      { text: 'Ich möchte einen Kaffee ___.', answer: 'trinken', wrong: ['trinke', 'getrunken'], en: 'I’d like to drink a coffee.', fr: 'I’d like to drink a coffee.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'de-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Guten Tag! Was darf es sein?', en: 'Hello! What can I get you?', fr: 'Hello! What can I get you?' },
      { who: 'B', text: 'Einen Kaffee und ein Stück Apfelkuchen, bitte.', en: 'A coffee and a slice of apple cake, please.', fr: 'A coffee and a slice of apple cake, please.', wrong: ['Die Rechnung ist ein Apfel.', 'Ich bin ein Kuchen.'] },
      { who: 'A', text: 'Mit Sahne?', en: 'With cream?', fr: 'With cream?' },
      { who: 'B', text: 'Ja, gerne.', en: 'Yes, please.', fr: 'Yes, please.', wrong: ['Nein, ich wohne in Berlin.', 'Ja, zwanzig Jahre.'] },
      { who: 'A', text: 'Das macht sechs Euro fünfzig.', en: 'That’s six fifty.', fr: 'That’s six fifty.' },
      { who: 'B', text: 'Hier, bitte. Stimmt so!', en: 'Here you go. Keep the change!', fr: 'Here you go. Keep the change!', wrong: ['Gute Nacht, Euro!', 'Entschuldigung, wo ist der Kuchen?'] },
    ],
  },
  {
    id: 'de-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Entschuldigung, wo ist der Bahnhof?', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['Entschuldigung, was kostet der Bahnhof?', 'Entschuldigung, ich bin der Bahnhof.'] },
      { who: 'A', text: 'Gehen Sie geradeaus und dann links.', en: 'Go straight on and then left.', fr: 'Go straight on and then left.' },
      { who: 'B', text: 'Ist es weit?', en: 'Is it far?', fr: 'Is it far?', wrong: ['Ist es lecker?', 'Ist es Montag?'] },
      { who: 'A', text: 'Nein, nur fünf Minuten zu Fuß.', en: 'No, only five minutes on foot.', fr: 'No, only five minutes on foot.' },
      { who: 'B', text: 'Vielen Dank!', en: 'Thanks a lot!', fr: 'Thanks a lot!', wrong: ['Guten Appetit!', 'Gute Nacht!'] },
    ],
  },
  {
    id: 'de-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Guten Abend. Kann ich Ihnen helfen?', en: 'Good evening. Can I help you?', fr: 'Good evening. Can I help you?' },
      { who: 'B', text: 'Ich habe eine Reservierung auf den Namen Smith.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['Ich habe Kopfschmerzen.', 'Einen Kaffee, bitte.'] },
      { who: 'A', text: 'Ein Doppelzimmer für zwei Nächte. Ihren Ausweis, bitte.', en: 'A double room for two nights. Your ID, please.', fr: 'A double room for two nights. Your ID, please.' },
      { who: 'B', text: 'Bitte schön. Wann gibt es Frühstück?', en: 'Here you are. When is breakfast?', fr: 'Here you are. When is breakfast?', wrong: ['Bitte schön. Wo ist der Strand vom Ausweis?', 'Nein danke, ich habe keinen Hunger.'] },
      { who: 'A', text: 'Von sieben bis zehn Uhr. Ihr Zimmer ist im dritten Stock.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'Super. Ist das WLAN kostenlos?', en: 'Great. Is the wifi free?', fr: 'Great. Is the wifi free?', wrong: ['Super. Ich bin kostenlos.', 'Super. Ich bin dreißig.'] },
    ],
  },
  {
    id: 'de-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Guten Tag. Was fehlt Ihnen?', en: 'Hello. What’s the problem?', fr: 'Hello. What’s the problem?' },
      { who: 'B', text: 'Ich habe Halsschmerzen und Fieber.', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['Ich möchte einen Apfelkuchen.', 'Ich habe ein Doppelzimmer.'] },
      { who: 'A', text: 'Seit wann?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'Seit drei Tagen.', en: 'For three days.', fr: 'For three days.', wrong: ['Um drei Uhr.', 'Drei Euro, bitte.'] },
      { who: 'A', text: 'Das ist eine Erkältung. Hier ist ein Rezept. Ruhen Sie sich aus.', en: 'It’s a cold. Here’s a prescription. Get some rest.', fr: 'It’s a cold. Here’s a prescription. Get some rest.' },
      { who: 'B', text: 'Danke, Frau Doktor.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Danke, wo ist der Bahnhof?', 'Prost!'] },
    ],
  },
  {
    id: 'de-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Was machst du am Wochenende?', en: 'What are you doing at the weekend?', fr: 'What are you doing at the weekend?' },
      { who: 'B', text: 'Noch nichts. Hast du eine Idee?', en: 'Nothing yet. Got an idea?', fr: 'Nothing yet. Got an idea?', wrong: ['Gestern habe ich Pizza gegessen.', 'Ich bin in Hamburg geboren.'] },
      { who: 'A', text: 'Wir könnten am See Rad fahren.', en: 'We could cycle by the lake.', fr: 'We could cycle by the lake.' },
      { who: 'B', text: 'Gute Idee! Wenn das Wetter schön ist, komme ich gern mit.', en: 'Good idea! If the weather’s nice, I’d love to come.', fr: 'Good idea! If the weather’s nice, I’d love to come.', wrong: ['Gute Idee! Letztes Jahr war ich krank.', 'Nein, ich habe keine Schuhe.'] },
      { who: 'A', text: 'Treffen wir uns um zehn am Bahnhof?', en: 'Shall we meet at the station at ten?', fr: 'Shall we meet at the station at ten?' },
      { who: 'B', text: 'Abgemacht! Ich bringe das Picknick mit.', en: 'Deal! I’ll bring the picnic.', fr: 'Deal! I’ll bring the picnic.', wrong: ['Abgemacht! Ich habe gestern mitgebracht.', 'Nein danke, ich bin der Bahnhof.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'de-s-market', level: 'A1', icon: '🧺', en: 'Lena at the market', fr: 'Lena au marché',
    sentences: [
      ['Lena wohnt in Berlin.', 'Lena lives in Berlin.', 'Lena lives in Berlin.'],
      ['Am Samstag geht sie auf den Markt.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['Sie kauft Äpfel, Käse und Brot.', 'She buys apples, cheese and bread.', 'She buys apples, cheese and bread.'],
      ['Dann trinkt sie einen Kaffee bei Jonas.', 'Then she has a coffee at Jonas’s.', 'Then she has a coffee at Jonas’s.'],
      ['Jonas schenkt ihr ein Stück Kuchen.', 'Jonas gives her a slice of cake.', 'Jonas gives her a slice of cake.'],
      ['Lena ist sehr froh.', 'Lena is very happy.', 'Lena is very happy.'],
    ],
    glossary: { wohnt: ['lives', 'lives'], samstag: ['Saturday', 'Saturday'], markt: ['market', 'market'], kauft: ['buys', 'buys'], äpfel: ['apples', 'apples'], käse: ['cheese', 'cheese'], trinkt: ['drinks', 'drinks'], schenkt: ['gives (as a gift)', 'gives (as a gift)'], froh: ['glad', 'glad'] },
    questions: [
      { en: 'Where does Lena live?', fr: 'Where does Lena live?', answer: 'Berlin', wrong: ['München', 'Hamburg'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'Äpfel, Käse und Brot', wrong: ['Fisch und Reis', 'Schuhe'] },
      { en: 'What does Jonas give her?', fr: 'What does Jonas give her?', answer: 'Kuchen', wrong: ['Kaffee', 'Brot'] },
    ],
  },
  {
    id: 'de-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['Felix hatte einen Zug um acht Uhr.', 'Felix had a train at eight.', 'Felix had a train at eight.'],
      ['Aber er ist um halb acht aufgewacht.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Er hat sich schnell angezogen und ist mit dem Rad gefahren.', 'He got dressed quickly and cycled.', 'He got dressed quickly and cycled.'],
      ['Um acht Uhr zwei war er am Bahnhof.', 'At two minutes past eight he was at the station.', 'At two minutes past eight he was at the station.'],
      ['Der Zug war schon weg.', 'The train had already gone.', 'The train had already gone.'],
      ['Er hat den nächsten Zug genommen und ein Buch gelesen.', 'He took the next train and read a book.', 'He took the next train and read a book.'],
    ],
    glossary: { hatte: ['had', 'had'], aufgewacht: ['woke up', 'woke up'], schnell: ['quickly', 'quickly'], angezogen: ['got dressed', 'got dressed'], rad: ['bike', 'bike'], schon: ['already', 'already'], weg: ['gone', 'gone'], nächsten: ['next', 'next'], gelesen: ['read', 'read'] },
    questions: [
      { en: 'When did Felix wake up?', fr: 'When did Felix wake up?', answer: 'um halb acht', wrong: ['um acht', 'um sechs'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'mit dem Rad', wrong: ['mit dem Taxi', 'zu Fuß'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'ein Buch gelesen', wrong: ['geschlafen', 'gegessen'] },
    ],
  },
  {
    id: 'de-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Vor zwei Jahren hatten die Bewohner unseres Hauses eine Idee.', 'Two years ago the residents of our building had an idea.', 'Two years ago the residents of our building had an idea.'],
      ['Das Dach war leer und niemand benutzte es.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Herr Weber schlug vor, einen Gemüsegarten anzulegen.', 'Mr Weber suggested planting a vegetable garden.', 'Mr Weber suggested planting a vegetable garden.'],
      ['Am Anfang waren nicht alle überzeugt.', 'At first not everyone was convinced.', 'At first not everyone was convinced.'],
      ['Heute wachsen dort Tomaten, Kräuter und Erdbeeren.', 'Today tomatoes, herbs and strawberries grow there.', 'Today tomatoes, herbs and strawberries grow there.'],
      ['Und jeden Sonntag essen alle zusammen auf dem Dach.', 'And every Sunday everyone eats together on the roof.', 'And every Sunday everyone eats together on the roof.'],
    ],
    glossary: { bewohner: ['residents', 'residents'], dach: ['roof', 'roof'], leer: ['empty', 'empty'], niemand: ['nobody', 'nobody'], schlug: ['suggested', 'suggested'], gemüsegarten: ['vegetable garden', 'vegetable garden'], überzeugt: ['convinced', 'convinced'], wachsen: ['grow', 'grow'], zusammen: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'Herr Weber', wrong: ['Lena', 'Felix'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'Tomaten, Kräuter und Erdbeeren', wrong: ['Äpfel und Birnen', 'Kartoffeln'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: 'jeden Sonntag', wrong: ['jeden Montag', 'einmal im Jahr'] },
    ],
  },
];

export const GERMAN_FULL: FullCourse = { topics, grammar, dialogues, stories };
