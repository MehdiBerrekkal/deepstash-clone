import type { Level, Topic, Word } from '@/data/learn/full';

/** Russian, pack 1: everyday verbs, routine, questions, animals, clothes, school, kitchen, the past, expressions, linking words. Lines are "word|romanization|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
идти|idti|to go (on foot)|🚶|Я иду на работу.|I’m walking to work.
ехать|yekhat’|to go (by transport)|🚌|Я еду на автобусе.|I’m going by bus.
делать|delat’|to do / make|🛠️|Что ты делаешь?|What are you doing?
видеть|videt’|to see|👀|Я вижу море.|I can see the sea.
смотреть|smotret’|to watch|📺|Мы смотрим фильм.|We’re watching a film.
слушать|slushat’|to listen|🎧|Я слушаю музыку.|I’m listening to music.
говорить|govorit’|to speak / say|🗣️|Вы говорите по-английски?|Do you speak English?
знать|znat’|to know|🧠|Я не знаю.|I don’t know.
хотеть|khotet’|to want|🙏|Я хочу кофе.|I want coffee.
мочь|moch’|can|💪|Я могу помочь.|I can help.
писать|pisat’|to write|✍️|Я пишу письмо.|I’m writing a letter.
спать|spat’|to sleep|😴|Я сплю восемь часов.|I sleep eight hours.
ждать|zhdat’|to wait|⏳|Я жду тебя.|I’m waiting for you.
брать|brat’|to take|✋|Возьми зонт.|Take an umbrella.
давать|davat’|to give|🎁|Дай мне руку.|Give me your hand.
открывать|otkryvat’|to open|🔓|Открой окно.|Open the window.
закрывать|zakryvat’|to close|🔒|Магазин закрывается в восемь.|The shop closes at eight.
искать|iskat’|to look for|🔍|Я ищу ключи.|I’m looking for my keys.
любить|lyubit’|to love / like|❤️|Я люблю шоколад.|I love chocolate.
понимать|ponimat’|to understand|💡|Я не понимаю.|I don’t understand.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
просыпаться|prosypat’sya|to wake up|⏰|Я просыпаюсь в семь.|I wake up at seven.
вставать|vstavat’|to get up|🛏️|Я встаю рано.|I get up early.
принимать душ|prinimat’ dush|to shower|🚿|Я принимаю душ утром.|I shower in the morning.
одеваться|odevat’sya|to get dressed|👔|Я быстро одеваюсь.|I get dressed quickly.
обед|obed|lunch|🥗|Обед в час.|Lunch is at one.
ужин|uzhin|dinner|🍝|Ужин готов!|Dinner is ready!
чистить зубы|chistit’ zuby|to brush teeth|🪥|Почисти зубы!|Brush your teeth!
ложиться спать|lozhit’sya spat’|to go to bed|🌙|Я ложусь спать в одиннадцать.|I go to bed at eleven.
рано|rano|early|🌅|Я пришёл рано.|I arrived early.
поздно|pozdno|late|🌆|Уже поздно.|It’s already late.
всегда|vsegda|always|♾️|Я всегда пью чай.|I always drink tea.
никогда|nikogda|never|🚫|Я никогда не курю.|I never smoke.
иногда|inogda|sometimes|🔀|Иногда я хожу в спортзал.|Sometimes I go to the gym.
обычно|obychno|usually|📅|Обычно я езжу на метро.|I usually take the metro.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
что|chto|what|❓|Что это?|What is this?
кто|kto|who|🕵️|Кто это?|Who is that?
где|gde|where|📍|Где туалет?|Where is the toilet?
когда|kogda|when|📆|Когда у тебя день рождения?|When is your birthday?
почему|pochemu|why|🤔|Почему ты грустный?|Why are you sad?
как|kak|how|🤷|Как дела?|How are you?
сколько|skol’ko|how much / many|🔢|Сколько стоит?|How much does it cost?
какой|kakoy|which / what kind|☝️|Какой твой любимый фильм?|What’s your favourite film?
откуда|otkuda|where from|🌍|Откуда ты?|Where are you from?
куда|kuda|where to|🧭|Куда ты идёшь?|Where are you going?
потому что|potomu chto|because|💡|Я учу русский, потому что люблю Чехова.|I’m learning Russian because I love Chekhov.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
собака|sobaka|dog|🐕|Моя собака — Шарик.|My dog is Sharik.
кошка|koshka|cat|🐈|Кошка спит на диване.|The cat sleeps on the sofa.
птица|ptitsa|bird|🐦|Птица поёт.|A bird is singing.
лошадь|loshad’|horse|🐎|Лошадь быстро бегает.|The horse runs fast.
корова|korova|cow|🐄|Корова даёт молоко.|The cow gives milk.
медведь|medved’|bear|🐻|Медведь любит мёд.|The bear loves honey.
волк|volk|wolf|🐺|Волк живёт в лесу.|The wolf lives in the forest.
лиса|lisa|fox|🦊|Рыжая лиса.|A red fox.
заяц|zayats|hare|🐇|Заяц быстро бегает.|The hare runs fast.
мышь|mysh’|mouse|🐁|На кухне мышь!|There’s a mouse in the kitchen!
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
рубашка|rubashka|shirt|👔|Белая рубашка.|A white shirt.
футболка|futbolka|T-shirt|👕|Хлопковая футболка.|A cotton T-shirt.
брюки|bryuki|trousers|👖|Брюки слишком длинные.|The trousers are too long.
платье|plat’ye|dress|👗|Она в красном платье.|She’s in a red dress.
юбка|yubka|skirt|🩳|Летняя юбка.|A summer skirt.
обувь|obuv’|shoes / footwear|👞|Мне нужна новая обувь.|I need new shoes.
пальто|pal’to|coat|🧥|Надень пальто, холодно.|Put your coat on, it’s cold.
шапка|shapka|winter hat|🧢|Зимой я ношу шапку.|In winter I wear a hat.
шарф|sharf|scarf|🧣|Тёплый шарф.|A warm scarf.
очки|ochki|glasses|👓|Где мои очки?|Where are my glasses?
носить|nosit’|to wear / carry|🧥|Он всегда носит галстук.|He always wears a tie.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
школа|shkola|school|🏫|Школа рядом.|The school is nearby.
урок|urok|lesson|🧑‍🏫|Урок начинается в восемь.|The lesson starts at eight.
учитель|uchitel’|teacher|👩‍🏫|Учитель хорошо объясняет.|The teacher explains well.
ученик|uchenik|pupil|🧑‍🎓|В классе двадцать учеников.|There are twenty pupils in the class.
книга|kniga|book|📕|Откройте книгу на странице десять.|Open your books at page ten.
тетрадь|tetrad’|exercise book|📓|Пиши в тетради.|Write in your exercise book.
ручка|ruchka|pen|🖊️|У тебя есть ручка?|Do you have a pen?
карандаш|karandash|pencil|✏️|Синий карандаш.|A blue pencil.
домашнее задание|domashneye zadaniye|homework|📝|У меня много домашнего задания.|I have a lot of homework.
вопрос|vopros|question|❓|У меня вопрос.|I have a question.
ответ|otvet|answer|💡|Правильный ответ.|The right answer.
учить|uchit’|to learn / study|🌱|Я учу десять слов в день.|I learn ten words a day.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
тарелка|tarelka|plate|🍽️|Поставь тарелки на стол.|Put the plates on the table.
стакан|stakan|glass|🥛|Стакан воды.|A glass of water.
чашка|chashka|cup|☕|Чашка чая.|A cup of tea.
нож|nozh|knife|🔪|Острый нож.|A sharp knife.
вилка|vilka|fork|🍴|Мне нужна вилка.|I need a fork.
ложка|lozhka|spoon|🥄|Ешь суп ложкой.|Eat the soup with a spoon.
кастрюля|kastryulya|saucepan|🍲|Вода в кастрюле.|Water in the saucepan.
сковородка|skovorodka|frying pan|🍳|Блины на сковородке.|Pancakes in the pan.
соль|sol’|salt|🧂|Передай соль, пожалуйста.|Pass the salt, please.
масло|maslo|butter / oil|🧈|Хлеб с маслом.|Bread and butter.
резать|rezat’|to cut|✂️|Нарежь помидоры.|Cut the tomatoes.
мыть посуду|myt’ posudu|to wash the dishes|🧽|Я мою посуду.|I’m washing the dishes.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
вчера вечером|vchera vecherom|last night|🌃|Вчера вечером мы были в кино.|Last night we were at the cinema.
на прошлой неделе|na proshloy nedele|last week|🗓️|На прошлой неделе я болел.|Last week I was ill.
в прошлом году|v proshlom godu|last year|🎆|В прошлом году мы были в Сочи.|Last year we were in Sochi.
два дня назад|dva dnya nazad|two days ago|⌛|Я приехал два дня назад.|I arrived two days ago.
я был|ya byl|I was (m)|📍|Я был в Москве.|I was in Moscow.
я ходил|ya khodil|I went (on foot)|🚶|Я ходил на рынок.|I went to the market.
я видел|ya videl|I saw|👀|Я видел Машу.|I saw Masha.
я купил|ya kupil|I bought|🛍️|Я купил пальто.|I bought a coat.
в детстве|v detstve|as a child|🧒|В детстве я жил в деревне.|As a child I lived in a village.
раньше|ran’she|before / in the past|🕰️|Раньше здесь был кинотеатр.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
ладно|ladno|OK|👌|Ладно, до завтра!|OK, see you tomorrow!
хорошо|khorosho|good / fine|👍|Хорошо, договорились.|Fine, it’s a deal.
ничего|nichego|it’s nothing / never mind|😌|Ничего, бывает.|Never mind, it happens.
жаль|zhal’|what a pity|😞|Жаль, что ты не придёшь.|What a pity you’re not coming.
удачи|udachi|good luck|🍀|Удачи на экзамене!|Good luck in the exam!
поздравляю|pozdravlyayu|congratulations|🎉|Поздравляю с днём рождения!|Happy birthday!
выздоравливай|vyzdoravlivay|get well|🤒|Выздоравливай скорее!|Get well soon!
давай|davay|come on / let’s|💪|Давай пойдём!|Come on, let’s go!
конечно|konechno|of course|✅|Конечно, помогу.|Of course I’ll help.
неважно|nevazhno|it doesn’t matter|🤷|Это неважно.|It doesn’t matter.
будьте здоровы|bud’te zdorovy|bless you|🤧|Будьте здоровы!|Bless you!
приятного аппетита|priyatnogo appetita|enjoy your meal|🍽️|Приятного аппетита!|Enjoy your meal!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
тоже|tozhe|also / too|➕|Я тоже говорю по-испански.|I also speak Spanish.
кроме того|krome togo|besides|📎|Кроме того, это бесплатно.|Besides, it’s free.
как только|kak tol’ko|as soon as|⚡|Позвони, как только приедешь.|Call as soon as you arrive.
во-первых|vo-pervykh|firstly|1️⃣|Во-первых, спасибо.|Firstly, thank you.
наконец|nakonets|finally|🏁|Наконец, поговорим о бюджете.|Finally, let’s talk about the budget.
например|naprimer|for example|📌|Я люблю фрукты, например яблоки.|I like fruit, for example apples.
несмотря на|nesmotrya na|despite|🧱|Несмотря на дождь, мы гуляли.|Despite the rain, we went for a walk.
`),
];
