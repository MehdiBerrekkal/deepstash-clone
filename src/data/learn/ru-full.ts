import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Russian, A1 → B1, for English speakers. Original content written for this app. Lines are "word|romanization|English|emoji|example|example in English". */
function w6(block: string): Word[] {
  return block
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [text, roman, en, emoji, ex, exEn] = l.split('|').map((x) => x.trim());
      return { text, roman, en, fr: en, emoji: emoji || '•', ...(ex ? { ex, exEn, exFr: exEn } : {}) };
    });
}
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `ru-${id}`, level, icon, en, fr, words: w6(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
привет|privet|hi|👋|Привет, я Маша!|Hi, I’m Masha!
здравствуйте|zdravstvuyte|hello (polite)|🙂|Здравствуйте, Иван Петрович.|Hello, Ivan Petrovich.
пока|poka|bye|🫡|Пока, до завтра!|Bye, see you tomorrow!
до свидания|do svidaniya|goodbye|👋|До свидания, хорошего дня!|Goodbye, have a nice day!
спасибо|spasibo|thank you|🙏|Большое спасибо!|Thank you very much!
пожалуйста|pozhaluysta|please / you’re welcome|🥺|Кофе, пожалуйста.|A coffee, please.
извините|izvinite|excuse me / sorry|😅|Извините, где вокзал?|Excuse me, where is the station?
очень приятно|ochen’ priyatno|nice to meet you|🤝|Очень приятно, Дима.|Nice to meet you, Dima.
имя|imya|name|🏷️|Как вас зовут?|What is your name?
друг|drug|friend (m)|👫|Дима — мой друг.|Dima is my friend.
подруга|podruga|friend (f)|👭|Маша — моя подруга.|Masha is my friend.
мужчина|muzhchina|man|👨|Мужчина читает газету.|The man is reading the paper.
женщина|zhenshchina|woman|👩|Женщина говорит по телефону.|The woman is on the phone.
ребёнок|rebyonok|child|🧒|Ребёнок играет в парке.|The child is playing in the park.
да|da|yes|✅|Да, конечно!|Yes, of course!
нет|net|no|❌|Нет, спасибо.|No, thank you.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
кофе|kofe|coffee|☕|Один кофе, пожалуйста.|One coffee, please.
чай|chay|tea|🍵|Чай с лимоном.|Tea with lemon.
вода|voda|water|💧|Стакан воды, пожалуйста.|A glass of water, please.
сок|sok|juice|🧃|Апельсиновый сок.|Orange juice.
молоко|moloko|milk|🥛|Кофе с молоком.|Coffee with milk.
сахар|sakhar|sugar|🍬|Без сахара, пожалуйста.|No sugar, please.
торт|tort|cake|🍰|Этот торт очень вкусный.|This cake is very tasty.
хлеб|khleb|bread|🍞|Свежий хлеб.|Fresh bread.
счёт|schyot|the bill|🧾|Счёт, пожалуйста.|The bill, please.
официант|ofitsiant|waiter|🤵|Официант сейчас придёт.|The waiter is coming now.
я хочу|ya khochu|I want|🙂|Я хочу чай.|I want tea.
сколько стоит|skol’ko stoit|how much is|💵|Сколько это стоит?|How much is this?
вкусно|vkusno|tasty|😋|Очень вкусно!|Very tasty!
горячий|goryachiy|hot|♨️|Осторожно, горячий чай.|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
семья|sem’ya|family|👪|У меня большая семья.|I have a big family.
мама|mama|mum|👩|Моя мама — врач.|My mum is a doctor.
папа|papa|dad|👨|Мой папа хорошо готовит.|My dad cooks well.
родители|roditeli|parents|👨‍👩‍👧|Мои родители живут в Казани.|My parents live in Kazan.
брат|brat|brother|👦|Мой брат — студент.|My brother is a student.
сестра|sestra|sister|👧|У меня есть сестра.|I have a sister.
сын|syn|son|👦|Их сыну десять лет.|Their son is ten.
дочь|doch’|daughter|👧|Моя дочь любит рисовать.|My daughter loves drawing.
дедушка|dedushka|grandfather|👴|Дедушка живёт на даче.|Grandpa lives at the country house.
бабушка|babushka|grandmother|👵|Бабушка печёт пироги.|Grandma bakes pies.
муж|muzh|husband|🤵|Её муж — инженер.|Her husband is an engineer.
жена|zhena|wife|👰|Его жена — архитектор.|His wife is an architect.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
один|odin|one|1️⃣|Один билет, пожалуйста.|One ticket, please.
два|dva|two|2️⃣|Два кофе, пожалуйста.|Two coffees, please.
три|tri|three|3️⃣|Нас трое.|There are three of us.
четыре|chetyre|four|4️⃣|У него четыре ребёнка.|He has four children.
пять|pyat’|five|5️⃣|Пять рублей.|Five roubles.
шесть|shest’|six|6️⃣|Я встаю в шесть.|I get up at six.
семь|sem’|seven|7️⃣|В неделе семь дней.|There are seven days in a week.
восемь|vosem’|eight|8️⃣|Я работаю восемь часов.|I work eight hours.
девять|devyat’|nine|9️⃣|Дочери девять лет.|My daughter is nine.
десять|desyat’|ten|🔟|Поезд через десять минут.|The train is in ten minutes.
сто|sto|a hundred|💯|Сто метров отсюда.|A hundred metres from here.
сколько тебе лет?|skol’ko tebe let?|how old are you?|🎂|Сколько тебе лет?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
понедельник|ponedel’nik|Monday|1️⃣|В понедельник я работаю.|On Monday I work.
пятница|pyatnitsa|Friday|5️⃣|В пятницу вечером мы гуляем.|On Friday evening we go out.
суббота|subbota|Saturday|6️⃣|В субботу я иду на рынок.|On Saturday I go to the market.
воскресенье|voskresen’ye|Sunday|7️⃣|В воскресенье мы обедаем вместе.|On Sunday we have lunch together.
сегодня|segodnya|today|📅|Сегодня хорошая погода.|The weather is nice today.
завтра|zavtra|tomorrow|🌄|До завтра!|See you tomorrow!
вчера|vchera|yesterday|⬅️|Вчера я устал.|Yesterday I was tired.
утро|utro|morning|🌅|Доброе утро!|Good morning!
вечер|vecher|evening|🌆|Добрый вечер!|Good evening!
ночь|noch’|night|🌙|Спокойной ночи!|Good night!
время|vremya|time|⌛|У меня нет времени.|I don’t have time.
неделя|nedelya|week|🗓️|Я работаю пять дней в неделю.|I work five days a week.
`),
  t('A1', 'food', '🥟', 'Food', 'La nourriture', `
борщ|borshch|borscht|🥣|Бабушкин борщ — самый вкусный.|Grandma’s borscht is the best.
пельмени|pel’meni|dumplings|🥟|Пельмени со сметаной.|Dumplings with sour cream.
блины|bliny|pancakes|🥞|На Масленицу едят блины.|People eat pancakes at Maslenitsa.
сыр|syr|cheese|🧀|Бутерброд с сыром.|A cheese sandwich.
яблоко|yabloko|apple|🍎|Зелёное яблоко.|A green apple.
картошка|kartoshka|potatoes|🥔|Жареная картошка.|Fried potatoes.
мясо|myaso|meat|🥩|Я не ем мясо.|I don’t eat meat.
рыба|ryba|fish|🐟|Рыба с рисом.|Fish with rice.
яйцо|yaytso|egg|🥚|Два яйца, пожалуйста.|Two eggs, please.
суп|sup|soup|🥣|Суп очень горячий.|The soup is very hot.
есть|yest’|to eat|🍽️|Что ты хочешь есть?|What do you want to eat?
пить|pit’|to drink|🥤|Я пью много воды.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
дом|dom|house / home|🏠|Наш дом старый.|Our house is old.
квартира|kvartira|flat|🏢|Я живу в маленькой квартире.|I live in a small flat.
кухня|kukhnya|kitchen|🍳|Мы пьём чай на кухне.|We drink tea in the kitchen.
комната|komnata|room|🚪|Моя комната светлая.|My room is bright.
ванная|vannaya|bathroom|🛁|Ванная справа.|The bathroom is on the right.
дверь|dver’|door|🚪|Закрой дверь, пожалуйста.|Close the door, please.
окно|okno|window|🪟|Открой окно, жарко.|Open the window, it’s hot.
кровать|krovat’|bed|🛏️|Кровать очень удобная.|The bed is very comfortable.
стул|stul|chair|🪑|Возьми стул.|Take a chair.
ключ|klyuch|key|🔑|Где мой ключ?|Where’s my key?
дача|dacha|country house|🏡|Летом мы живём на даче.|In summer we live at the dacha.
жить|zhit’|to live|🏙️|Я живу в Москве.|I live in Moscow.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
улица|ulitsa|street|🛣️|Я живу на этой улице.|I live on this street.
площадь|ploshchad’|square|⛲|Красная площадь.|Red Square.
вокзал|vokzal|railway station|🚉|Вокзал недалеко.|The station isn’t far.
метро|metro|metro|🚇|Я еду на метро.|I’m going by metro.
магазин|magazin|shop|🏪|Магазин открыт до десяти.|The shop is open until ten.
аптека|apteka|pharmacy|💊|Где аптека?|Where is the pharmacy?
банк|bank|bank|🏦|Банк закрыт.|The bank is closed.
музей|muzey|museum|🏛️|Эрмитаж — большой музей.|The Hermitage is a big museum.
парк|park|park|🌳|Погуляем в парке?|Shall we walk in the park?
направо|napravo|to the right|➡️|Поверните направо.|Turn right.
налево|nalevo|to the left|⬅️|Вокзал налево.|The station is to the left.
прямо|pryamo|straight on|⬆️|Идите прямо.|Go straight on.
далеко|daleko|far|🧭|Это далеко?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
красный|krasnyy|red|🔴|Красная машина.|A red car.
синий|siniy|blue|🔵|Синее море.|A blue sea.
зелёный|zelyonyy|green|🟢|Зелёный парк.|A green park.
жёлтый|zhyoltyy|yellow|🟡|Жёлтый цветок.|A yellow flower.
чёрный|chyornyy|black|⚫|Чёрный кот.|A black cat.
белый|belyy|white|⚪|Белый снег.|White snow.
большой|bol’shoy|big|🐘|Большой город.|A big city.
маленький|malen’kiy|small|🐭|Маленькая собака.|A small dog.
новый|novyy|new|🆕|У меня новый телефон.|I have a new phone.
старый|staryy|old|🏚️|Старый дом.|An old house.
красивый|krasivyy|beautiful|🌸|Какой красивый город!|What a beautiful city!
дорогой|dorogoy|expensive / dear|💎|Ресторан дорогой.|The restaurant is expensive.
`),
  t('A1', 'weather', '❄️', 'Weather and seasons', 'Météo et saisons', `
погода|pogoda|weather|🌤️|Какая сегодня погода?|What’s the weather like today?
снег|sneg|snow|❄️|Идёт снег.|It’s snowing.
дождь|dozhd’|rain|🌧️|Идёт дождь.|It’s raining.
солнце|solntse|sun|☀️|Светит солнце.|The sun is shining.
холодно|kholodno|it’s cold|🥶|Сегодня очень холодно.|It’s very cold today.
тепло|teplo|it’s warm|🌡️|Летом тепло.|It’s warm in summer.
зима|zima|winter|☃️|Зима в Сибири длинная.|Winter in Siberia is long.
лето|leto|summer|🏖️|Летом мы едем на море.|In summer we go to the seaside.
осень|osen’|autumn|🍁|Осенью листья жёлтые.|In autumn the leaves are yellow.
весна|vesna|spring|🌸|Весной всё цветёт.|In spring everything blooms.
зонт|zont|umbrella|☂️|Возьми зонт.|Take an umbrella.
`),
  t('A2', 'travel', '🚆', 'Travel', 'Voyager', `
поездка|poyezdka|trip|🧳|Хорошей поездки!|Have a good trip!
путешествовать|puteshestvovat’|to travel|🌍|Я люблю путешествовать на поезде.|I love travelling by train.
поезд|poyezd|train|🚆|Поезд в Петербург.|The train to St Petersburg.
самолёт|samolyot|plane|✈️|Самолёт вылетает в десять.|The plane leaves at ten.
аэропорт|aeroport|airport|🛫|Едем в аэропорт на такси.|We’re taking a taxi to the airport.
билет|bilet|ticket|🎫|Я купил билеты онлайн.|I bought the tickets online.
чемодан|chemodan|suitcase|🧳|Чемодан слишком тяжёлый.|The suitcase is too heavy.
паспорт|pasport|passport|🛂|Не забудь паспорт!|Don’t forget your passport!
отпуск|otpusk|holiday (from work)|🏝️|В августе у меня отпуск.|I’m on holiday in August.
гостиница|gostinitsa|hotel|🏨|Гостиница в центре.|The hotel is in the centre.
бронь|bron’|booking|📋|У меня бронь на имя Смит.|I have a booking under the name Smith.
завтрак|zavtrak|breakfast|🥐|Завтрак включён?|Is breakfast included?
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
врач|vrach|doctor|👨‍⚕️|Мне нужно к врачу.|I need to see a doctor.
больной|bol’noy|ill|🤒|Я болею с понедельника.|I’ve been ill since Monday.
температура|temperatura|temperature|🌡️|У меня температура.|I have a temperature.
насморк|nasmork|runny nose|🤧|У меня насморк.|I have a runny nose.
кашель|kashel’|cough|😷|У меня сильный кашель.|I have a bad cough.
голова болит|golova bolit|head hurts|🤕|У меня болит голова.|I have a headache.
лекарство|lekarstvo|medicine|💊|Примите это лекарство.|Take this medicine.
рецепт|retsept|prescription|📃|Вот ваш рецепт.|Here’s your prescription.
устал|ustal|tired|🥱|Я очень устал.|I’m very tired.
отдыхать|otdykhat’|to rest|🛋️|Вам нужно отдыхать.|You need to rest.
скорая|skoraya|ambulance|🚑|Вызовите скорую!|Call an ambulance!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
работа|rabota|work / job|💼|Мне нравится моя работа.|I like my job.
работать|rabotat’|to work|🧑‍💻|Я работаю в банке.|I work in a bank.
офис|ofis|office|🏢|Офис в центре.|The office is in the centre.
коллега|kollega|colleague|🤝|Мои коллеги дружелюбные.|My colleagues are friendly.
начальник|nachal’nik|boss|😎|Начальник на совещании.|The boss is in a meeting.
совещание|soveshchaniye|meeting|👥|Совещание в девять.|The meeting is at nine.
зарплата|zarplata|salary|💵|Зарплата хорошая.|The salary is good.
собеседование|sobesedovaniye|job interview|🤝|Завтра у меня собеседование.|I have an interview tomorrow.
компания|kompaniya|company|🏢|Она работает в IT-компании.|She works for an IT company.
занят|zanyat|busy|🏃|Я сейчас занят.|I’m busy right now.
`),
  t('A2', 'hobbies', '🎻', 'Free time', 'Les loisirs', `
свободное время|svobodnoye vremya|free time|🎨|Что ты делаешь в свободное время?|What do you do in your free time?
футбол|futbol|football|⚽|Я играю в футбол.|I play football.
хоккей|khokkey|ice hockey|🏒|Мы смотрим хоккей.|We watch hockey.
плавать|plavat’|to swim|🏊|Я плаваю по утрам.|I swim in the mornings.
читать|chitat’|to read|📖|Я читаю Чехова.|I’m reading Chekhov.
кино|kino|cinema|🎬|Пойдём в кино?|Shall we go to the cinema?
музыка|muzyka|music|🎵|Я слушаю музыку.|I listen to music.
театр|teatr|theatre|🎭|Мы идём в театр.|We’re going to the theatre.
шахматы|shakhmaty|chess|♟️|Дедушка играет в шахматы.|Grandpa plays chess.
танцевать|tantsevat’|to dance|💃|Она хорошо танцует.|She dances well.
готовить|gotovit’|to cook|👩‍🍳|Я готовлю по выходным.|I cook at weekends.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
счастливый|schastlivyy|happy|😊|Я очень счастлив.|I’m very happy.
грустный|grustnyy|sad|😢|Почему ты грустная?|Why are you sad?
злой|zloy|angry|😠|Он очень злой сегодня.|He’s very angry today.
волноваться|volnovat’sya|to worry|😟|Не волнуйся!|Don’t worry!
рад|rad|glad|🙂|Рад тебя видеть!|Glad to see you!
гордиться|gordit’sya|to be proud|🦚|Я горжусь тобой.|I’m proud of you.
удивлён|udivlyon|surprised|😮|Я был удивлён.|I was surprised.
страх|strakh|fear|😱|Я боюсь пауков.|I’m afraid of spiders.
скучно|skuchno|boring / bored|🥱|Мне скучно.|I’m bored.
скучать|skuchat’|to miss|💌|Я скучаю по тебе.|I miss you.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
по-моему|po-moyemu|in my opinion|💬|По-моему, это хорошая идея.|In my opinion, it’s a good idea.
я думаю, что|ya dumayu, chto|I think that|💭|Я думаю, что ты прав.|I think you’re right.
согласен|soglasen|agreed|🤝|Я согласен с тобой.|I agree with you.
но|no|but|↔️|Дорого, но хорошо.|Expensive, but good.
поэтому|poetomu|that’s why|➡️|Идёт дождь, поэтому я дома.|It’s raining, so I’m at home.
хотя|khotya|although|🌗|Хотя я устал, я приду.|Although I’m tired, I’ll come.
наверное|navernoye|probably|🤷|Наверное, завтра будет дождь.|It’ll probably rain tomorrow.
конечно|konechno|of course|✅|Конечно, помогу!|Of course I’ll help!
на самом деле|na samom dele|actually|📌|На самом деле, я не знаю.|Actually, I don’t know.
проблема|problema|problem|❗|Нет проблем!|No problem!
`),
  t('B1', 'society', '🌍', 'Culture and society', 'Culture et société', `
культура|kul’tura|culture|🎭|Русская культура очень богатая.|Russian culture is very rich.
литература|literatura|literature|📚|Я люблю русскую литературу.|I love Russian literature.
писатель|pisatel’|writer|✒️|Толстой — великий писатель.|Tolstoy is a great writer.
балет|balet|ballet|🩰|Мы были на балете в Большом.|We saw a ballet at the Bolshoi.
традиция|traditsiya|tradition|🎎|Это старая традиция.|It’s an old tradition.
история|istoriya|history|📜|Я изучаю историю.|I study history.
природа|priroda|nature|🌲|Я люблю природу.|I love nature.
экология|ekologiya|ecology|🌍|Экология — важная тема.|Ecology is an important topic.
интернет|internet|internet|🌐|Я нашёл это в интернете.|I found it online.
новости|novosti|news|📰|Ты смотрел новости?|Did you watch the news?
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'ru-g-gender', level: 'A1', icon: '🔤', en: 'Gender, and no "to be"', fr: 'Le genre, et pas de « être »',
    cards: [
      { en: 'There are no articles. Nouns are masculine (often a consonant: дом), feminine (-а/-я: мама) or neuter (-о/-е: окно).', fr: 'Pas d’articles. Masculin (consonne), féminin (-а/-я), neutre (-о/-е).', examples: [['дом', 'house (m)', 'house (m)'], ['мама', 'mum (f)', 'mum (f)'], ['окно', 'window (n)', 'window (n)']] },
      { en: 'In the present, "to be" is left out: Я студент = I (am a) student. A dash can stand for it: Москва — столица.', fr: 'Au présent, « être » disparaît : Я студент.', examples: [['Я врач.', 'I’m a doctor.', 'I’m a doctor.']] },
    ],
    drills: [
      { text: 'Это мой ___.', answer: 'дом', wrong: ['мама', 'окно'], en: 'This is my house.', fr: 'This is my house.' },
      { text: 'Это моя ___.', answer: 'мама', wrong: ['дом', 'окно'], en: 'This is my mum.', fr: 'This is my mum.' },
      { text: 'Это моё ___.', answer: 'окно', wrong: ['мама', 'дом'], en: 'This is my window.', fr: 'This is my window.' },
    ],
  },
  {
    id: 'ru-g-present', level: 'A1', icon: '🔁', en: 'Present tense', fr: 'Le présent',
    cards: [
      { en: 'Verbs like читать: я читаю, ты читаешь, он читает, мы читаем, вы читаете, они читают.', fr: 'читать : читаю, читаешь, читает, читаем, читаете, читают.', examples: [['Я читаю книгу.', 'I’m reading a book.', 'I’m reading a book.']] },
      { en: 'Verbs like говорить: я говорю, ты говоришь, он говорит, мы говорим, вы говорите, они говорят.', fr: 'говорить : говорю, говоришь, говорит, говорим, говорите, говорят.', examples: [['Вы говорите по-английски?', 'Do you speak English?', 'Do you speak English?']] },
    ],
    drills: [
      { text: 'Ты ___ по-русски?', answer: 'говоришь', wrong: ['говорю', 'говорят'], en: 'Do you speak Russian?', fr: 'Do you speak Russian?' },
      { text: 'Мы ___ в Москве.', answer: 'живём', wrong: ['живёт', 'живу'], en: 'We live in Moscow.', fr: 'We live in Moscow.' },
      { text: 'Они ___ газету.', answer: 'читают', wrong: ['читаю', 'читаем'], en: 'They’re reading the paper.', fr: 'They’re reading the paper.' },
    ],
  },
  {
    id: 'ru-g-have', level: 'A2', icon: '🤲', en: 'У меня есть: having', fr: 'У меня есть : avoir',
    cards: [
      { en: 'To say "I have": у меня есть + the thing. Literally "by me there is". у тебя (you), у него (him), у неё (her).', fr: '« J’ai » : у меня есть.', examples: [['У меня есть брат.', 'I have a brother.', 'I have a brother.'], ['У тебя есть время?', 'Do you have time?', 'Do you have time?']] },
      { en: '"I don’t have": у меня нет + genitive: у меня нет времени.', fr: '« Je n’ai pas » : у меня нет + génitif.', examples: [['У меня нет машины.', 'I don’t have a car.', 'I don’t have a car.']] },
    ],
    drills: [
      { text: 'У ___ есть сестра.', answer: 'меня', wrong: ['я', 'мне'], en: 'I have a sister.', fr: 'I have a sister.' },
      { text: 'У тебя ___ собака?', answer: 'есть', wrong: ['нет', 'был'], en: 'Do you have a dog?', fr: 'Do you have a dog?' },
      { text: 'У меня ___ времени.', answer: 'нет', wrong: ['есть', 'не'], en: 'I don’t have time.', fr: 'I don’t have time.' },
    ],
  },
  {
    id: 'ru-g-past', level: 'A2', icon: '⏮️', en: 'Past tense', fr: 'Le passé',
    cards: [
      { en: 'Past tense agrees with the gender of the subject: он читал, она читала, они читали.', fr: 'Le passé s’accorde en genre : читал, читала, читали.', examples: [['Вчера я смотрел фильм.', 'Yesterday I watched a film (said by a man).', 'Yesterday I watched a film (said by a man).'], ['Она была в Москве.', 'She was in Moscow.', 'She was in Moscow.']] },
    ],
    drills: [
      { text: 'Маша ___ книгу.', answer: 'читала', wrong: ['читал', 'читали'], en: 'Masha was reading a book.', fr: 'Masha was reading a book.' },
      { text: 'Дима ___ дома.', answer: 'был', wrong: ['была', 'были'], en: 'Dima was at home.', fr: 'Dima was at home.' },
      { text: 'Мы ___ в кино.', answer: 'ходили', wrong: ['ходил', 'ходила'], en: 'We went to the cinema.', fr: 'We went to the cinema.' },
    ],
  },
  {
    id: 'ru-g-prepositional', level: 'B1', icon: '📍', en: 'Where: в / на + prepositional', fr: 'Où : в / на + prépositionnel',
    cards: [
      { en: 'To say where you are, use в or на and change the ending, usually to -е: Москва → в Москве, парк → в парке, работа → на работе.', fr: 'Lieu : в / на + terminaison -е.', examples: [['Я живу в Москве.', 'I live in Moscow.', 'I live in Moscow.'], ['Он на работе.', 'He’s at work.', 'He’s at work.']] },
    ],
    drills: [
      { text: 'Я живу в ___.', answer: 'Москве', wrong: ['Москва', 'Москву'], en: 'I live in Moscow.', fr: 'I live in Moscow.' },
      { text: 'Мы гуляем в ___.', answer: 'парке', wrong: ['парк', 'парка'], en: 'We’re walking in the park.', fr: 'We’re walking in the park.' },
      { text: 'Мама на ___.', answer: 'работе', wrong: ['работа', 'работу'], en: 'Mum is at work.', fr: 'Mum is at work.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'ru-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Здравствуйте! Что будете заказывать?', en: 'Hello! What would you like to order?', fr: 'Hello! What would you like to order?' },
      { who: 'B', text: 'Чай с лимоном и блины, пожалуйста.', en: 'Tea with lemon and pancakes, please.', fr: 'Tea with lemon and pancakes, please.', wrong: ['Я блины.', 'Счёт — это чай.'] },
      { who: 'A', text: 'С собой или здесь?', en: 'To take away or here?', fr: 'To take away or here?' },
      { who: 'B', text: 'Здесь, спасибо.', en: 'Here, thanks.', fr: 'Here, thanks.', wrong: ['Мне тридцать лет.', 'Сегодня холодно.'] },
      { who: 'A', text: 'С вас пятьсот рублей.', en: 'That’s five hundred roubles.', fr: 'That’s five hundred roubles.' },
      { who: 'B', text: 'Можно картой?', en: 'Can I pay by card?', fr: 'Can I pay by card?', wrong: ['Спокойной ночи, рубли!', 'Где блины?'] },
    ],
  },
  {
    id: 'ru-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Извините, как пройти к метро?', en: 'Excuse me, how do I get to the metro?', fr: 'Excuse me, how do I get to the metro?', wrong: ['Извините, сколько стоит метро?', 'Извините, я метро.'] },
      { who: 'A', text: 'Идите прямо, потом налево.', en: 'Go straight on, then left.', fr: 'Go straight on, then left.' },
      { who: 'B', text: 'Это далеко?', en: 'Is it far?', fr: 'Is it far?', wrong: ['Это вкусно?', 'Это понедельник?'] },
      { who: 'A', text: 'Нет, пять минут пешком.', en: 'No, five minutes on foot.', fr: 'No, five minutes on foot.' },
      { who: 'B', text: 'Большое спасибо!', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['Приятного аппетита!', 'Спокойной ночи!'] },
    ],
  },
  {
    id: 'ru-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Добрый вечер! Чем могу помочь?', en: 'Good evening! How can I help?', fr: 'Good evening! How can I help?' },
      { who: 'B', text: 'У меня бронь на имя Смит.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['У меня болит голова.', 'Чай, пожалуйста.'] },
      { who: 'A', text: 'Двухместный номер на две ночи. Ваш паспорт, пожалуйста.', en: 'A double room for two nights. Your passport, please.', fr: 'A double room for two nights. Your passport, please.' },
      { who: 'B', text: 'Вот, пожалуйста. Во сколько завтрак?', en: 'Here you are. What time is breakfast?', fr: 'Here you are. What time is breakfast?', wrong: ['Вот паспорт. Где пляж паспорта?', 'Нет, спасибо, я не голоден.'] },
      { who: 'A', text: 'С семи до десяти. Ваш номер на третьем этаже.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'Отлично. Вай-фай бесплатный?', en: 'Great. Is the wifi free?', fr: 'Great. Is the wifi free?', wrong: ['Отлично. Я бесплатный.', 'Отлично. Мне тридцать лет.'] },
    ],
  },
  {
    id: 'ru-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Здравствуйте. На что жалуетесь?', en: 'Hello. What’s the problem?', fr: 'Hello. What’s the problem?' },
      { who: 'B', text: 'У меня болит горло и температура.', en: 'I have a sore throat and a temperature.', fr: 'I have a sore throat and a temperature.', wrong: ['Я хочу борщ.', 'У меня двухместный номер.'] },
      { who: 'A', text: 'Как давно?', en: 'For how long?', fr: 'For how long?' },
      { who: 'B', text: 'Уже три дня.', en: 'For three days now.', fr: 'For three days now.', wrong: ['В три часа.', 'Три рубля, пожалуйста.'] },
      { who: 'A', text: 'Это простуда. Вот рецепт. Отдыхайте.', en: 'It’s a cold. Here’s a prescription. Rest.', fr: 'It’s a cold. Here’s a prescription. Rest.' },
      { who: 'B', text: 'Спасибо, доктор.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Спасибо, где вокзал?', 'Будьте здоровы!'] },
    ],
  },
  {
    id: 'ru-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Что ты делаешь в выходные?', en: 'What are you doing at the weekend?', fr: 'What are you doing at the weekend?' },
      { who: 'B', text: 'Пока ничего. А что?', en: 'Nothing yet. Why?', fr: 'Nothing yet. Why?', wrong: ['Вчера я ел пельмени.', 'Я родился в Казани.'] },
      { who: 'A', text: 'Поедем на дачу? Там очень красиво.', en: 'Shall we go to the dacha? It’s really beautiful there.', fr: 'Shall we go to the dacha? It’s really beautiful there.' },
      { who: 'B', text: 'С удовольствием! Если не будет дождя.', en: 'I’d love to! If it doesn’t rain.', fr: 'I’d love to! If it doesn’t rain.', wrong: ['С удовольствием! В прошлом году я болел.', 'Нет, у меня нет обуви.'] },
      { who: 'A', text: 'Тогда встретимся на вокзале в девять.', en: 'Then let’s meet at the station at nine.', fr: 'Then let’s meet at the station at nine.' },
      { who: 'B', text: 'Договорились! Я возьму пирожки.', en: 'Deal! I’ll bring some pies.', fr: 'Deal! I’ll bring some pies.', wrong: ['Договорились! Я взял вчера.', 'Нет, спасибо, я вокзал.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'ru-s-market', level: 'A1', icon: '🧺', en: 'Masha’s Saturday', fr: 'Le samedi de Macha',
    sentences: [
      ['Маша живёт в Петербурге.', 'Masha lives in St Petersburg.', 'Masha lives in St Petersburg.'],
      ['В субботу она идёт на рынок.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['Она покупает яблоки, сыр и хлеб.', 'She buys apples, cheese and bread.', 'She buys apples, cheese and bread.'],
      ['Потом она пьёт кофе у Саши.', 'Then she has a coffee at Sasha’s.', 'Then she has a coffee at Sasha’s.'],
      ['Саша дарит ей пирожок.', 'Sasha gives her a little pie.', 'Sasha gives her a little pie.'],
      ['Маша очень рада.', 'Masha is very happy.', 'Masha is very happy.'],
    ],
    glossary: { живёт: ['lives', 'lives'], субботу: ['Saturday', 'Saturday'], рынок: ['market', 'market'], покупает: ['buys', 'buys'], яблоки: ['apples', 'apples'], сыр: ['cheese', 'cheese'], потом: ['then', 'then'], дарит: ['gives (as a gift)', 'gives (as a gift)'], рада: ['glad', 'glad'] },
    questions: [
      { en: 'Where does Masha live?', fr: 'Where does Masha live?', answer: 'в Петербурге', wrong: ['в Москве', 'в Казани'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'яблоки, сыр и хлеб', wrong: ['рыбу и рис', 'обувь'] },
      { en: 'What does Sasha give her?', fr: 'What does Sasha give her?', answer: 'пирожок', wrong: ['кофе', 'яблоко'] },
    ],
  },
  {
    id: 'ru-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['У Димы был поезд в Москву в восемь.', 'Dima had a train to Moscow at eight.', 'Dima had a train to Moscow at eight.'],
      ['Но он проснулся в половине восьмого.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Он быстро оделся и взял такси.', 'He got dressed quickly and took a taxi.', 'He got dressed quickly and took a taxi.'],
      ['Он приехал на вокзал в восемь ноль две.', 'He got to the station at two minutes past eight.', 'He got to the station at two minutes past eight.'],
      ['Поезд уже ушёл.', 'The train had already left.', 'The train had already left.'],
      ['Он сел на следующий поезд и читал книгу.', 'He took the next train and read a book.', 'He took the next train and read a book.'],
    ],
    glossary: { поезд: ['train', 'train'], проснулся: ['woke up', 'woke up'], быстро: ['quickly', 'quickly'], оделся: ['got dressed', 'got dressed'], приехал: ['arrived', 'arrived'], уже: ['already', 'already'], ушёл: ['left', 'left'], следующий: ['next', 'next'], читал: ['read', 'read'] },
    questions: [
      { en: 'Where was Dima going?', fr: 'Where was Dima going?', answer: 'в Москву', wrong: ['в Петербург', 'в Казань'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'на такси', wrong: ['на велосипеде', 'пешком'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'читал книгу', wrong: ['спал', 'ел'] },
    ],
  },
  {
    id: 'ru-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Два года назад у жителей нашего дома появилась идея.', 'Two years ago the residents of our building had an idea.', 'Two years ago the residents of our building had an idea.'],
      ['Крыша была пустой, и никто ей не пользовался.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Анна Петровна предложила сделать огород.', 'Anna Petrovna suggested making a vegetable garden.', 'Anna Petrovna suggested making a vegetable garden.'],
      ['Сначала не все были согласны.', 'At first, not everyone agreed.', 'At first, not everyone agreed.'],
      ['Сейчас там растут помидоры, укроп и клубника.', 'Now tomatoes, dill and strawberries grow there.', 'Now tomatoes, dill and strawberries grow there.'],
      ['И каждое воскресенье все обедают вместе на крыше.', 'And every Sunday everyone has lunch together on the roof.', 'And every Sunday everyone has lunch together on the roof.'],
    ],
    glossary: { жителей: ['residents', 'residents'], крыша: ['roof', 'roof'], пустой: ['empty', 'empty'], никто: ['nobody', 'nobody'], предложила: ['suggested', 'suggested'], огород: ['vegetable garden', 'vegetable garden'], сначала: ['at first', 'at first'], растут: ['grow', 'grow'], вместе: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'Анна Петровна', wrong: ['Маша', 'Дима'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'помидоры, укроп и клубника', wrong: ['яблоки и груши', 'картошка'] },
      { en: 'When does everyone have lunch together?', fr: 'When does everyone have lunch together?', answer: 'каждое воскресенье', wrong: ['каждый понедельник', 'раз в год'] },
    ],
  },
];

export const RUSSIAN_FULL: FullCourse = { topics, grammar, dialogues, stories };
