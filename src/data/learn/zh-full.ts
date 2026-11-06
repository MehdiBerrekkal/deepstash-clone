import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/**
 * Mandarin Chinese, A1 → B1 (roughly HSK 1–3), for English speakers. Original content written for this app. Lines are
 * "word|pinyin|English|emoji|example|example in English".
 */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `zh-${id}`, level, icon, en, fr, words: w6(block) });

const topics: Topic[] = [
  // ---------- A1 ----------
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
你好|nǐ hǎo|hello|👋|你好，我叫小美。|Hello, I’m Xiaomei.
谢谢|xièxie|thank you|🙏|谢谢你！|Thank you!
不客气|bú kèqi|you’re welcome|😊|不客气，没问题。|You’re welcome, no problem.
对不起|duìbuqǐ|sorry|🙇|对不起，我来晚了。|Sorry, I’m late.
没关系|méi guānxi|it doesn’t matter|👌|没关系，别担心。|It’s fine, don’t worry.
再见|zàijiàn|goodbye|🫡|明天见，再见！|See you tomorrow, bye!
名字|míngzi|name|🏷️|你叫什么名字？|What’s your name?
朋友|péngyou|friend|👫|小美是我的朋友。|Xiaomei is my friend.
老师|lǎoshī|teacher|👩‍🏫|王老师很好。|Teacher Wang is very nice.
学生|xuésheng|student|🧑‍🎓|我是学生。|I’m a student.
是|shì|to be|✅|我是英国人。|I’m British.
不|bù|not / no|❌|我不是老师。|I’m not a teacher.
认识你很高兴|rènshi nǐ hěn gāoxìng|nice to meet you|🤝|认识你很高兴！|Nice to meet you!
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
咖啡|kāfēi|coffee|☕|我要一杯咖啡。|I’d like a coffee.
茶|chá|tea|🍵|我喜欢喝绿茶。|I like drinking green tea.
水|shuǐ|water|💧|请给我一杯水。|A glass of water, please.
牛奶|niúnǎi|milk|🥛|咖啡加牛奶。|Coffee with milk.
果汁|guǒzhī|juice|🧃|一杯橙汁。|A glass of orange juice.
蛋糕|dàngāo|cake|🍰|这个蛋糕很好吃。|This cake is delicious.
面包|miànbāo|bread|🍞|早上我吃面包。|I eat bread in the morning.
菜单|càidān|menu|📋|请给我菜单。|The menu, please.
买单|mǎidān|pay the bill|🧾|服务员，买单！|Waiter, the bill please!
多少钱|duōshao qián|how much|💴|这个多少钱？|How much is this?
要|yào|to want|🙂|我要这个。|I want this one.
好吃|hǎochī|delicious|😋|真好吃！|So tasty!
热|rè|hot|♨️|咖啡很热。|The coffee is hot.
冷|lěng|cold|🧊|水太冷了。|The water is too cold.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
家|jiā|family / home|👪|我家有四口人。|There are four people in my family.
爸爸|bàba|dad|👨|我爸爸是医生。|My dad is a doctor.
妈妈|māma|mum|👩|我妈妈是老师。|My mum is a teacher.
哥哥|gēge|older brother|👦|我哥哥在上海工作。|My older brother works in Shanghai.
姐姐|jiějie|older sister|👧|姐姐喜欢唱歌。|My older sister likes singing.
弟弟|dìdi|younger brother|🧒|弟弟十岁。|My younger brother is ten.
妹妹|mèimei|younger sister|👧|妹妹很可爱。|My younger sister is very cute.
爷爷|yéye|grandfather (paternal)|👴|爷爷每天打太极拳。|Grandpa does tai chi every day.
奶奶|nǎinai|grandmother (paternal)|👵|奶奶做的饺子最好吃。|Grandma’s dumplings are the best.
孩子|háizi|child|🧒|他们有两个孩子。|They have two children.
儿子|érzi|son|👦|我儿子喜欢踢足球。|My son likes playing football.
女儿|nǚ'ér|daughter|👧|她女儿会弹钢琴。|Her daughter can play the piano.
`),
  t('A1', 'numbers', '🔢', 'Numbers', 'Les nombres', `
一|yī|one|1️⃣|我有一只猫。|I have one cat.
二|èr|two|2️⃣|二月很冷。|February is cold.
三|sān|three|3️⃣|我们三个人。|There are three of us.
四|sì|four|4️⃣|我住在四楼。|I live on the fourth floor.
五|wǔ|five|5️⃣|五点见。|See you at five.
六|liù|six|6️⃣|我六点起床。|I get up at six.
七|qī|seven|7️⃣|一个星期有七天。|A week has seven days.
八|bā|eight|8️⃣|我每天工作八个小时。|I work eight hours a day.
九|jiǔ|nine|9️⃣|女儿九岁。|My daughter is nine.
十|shí|ten|🔟|等十分钟。|Wait ten minutes.
两|liǎng|two (of something)|✌️|两杯咖啡。|Two coffees.
百|bǎi|hundred|💯|一百块。|A hundred yuan.
几岁|jǐ suì|how old (for children)|🎂|你几岁？|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
今天|jīntiān|today|📅|今天天气很好。|The weather is nice today.
明天|míngtiān|tomorrow|🌄|明天见！|See you tomorrow!
昨天|zuótiān|yesterday|⬅️|昨天我看了电影。|I saw a film yesterday.
早上|zǎoshang|morning|🌅|早上好！|Good morning!
中午|zhōngwǔ|noon|☀️|中午一起吃饭吧。|Let’s have lunch together.
晚上|wǎnshang|evening|🌃|晚上你做什么？|What are you doing this evening?
现在|xiànzài|now|⏰|现在几点？|What time is it now?
点|diǎn|o’clock|🕐|我八点上班。|I start work at eight.
星期一|xīngqīyī|Monday|1️⃣|星期一我很忙。|I’m busy on Monday.
星期五|xīngqīwǔ|Friday|5️⃣|星期五晚上见。|See you Friday evening.
周末|zhōumò|weekend|🎉|周末你去哪儿？|Where are you going at the weekend?
时间|shíjiān|time|⌛|我没有时间。|I don’t have time.
`),
  t('A1', 'food', '🥟', 'Food', 'La nourriture', `
米饭|mǐfàn|cooked rice|🍚|我要一碗米饭。|I’d like a bowl of rice.
面条|miàntiáo|noodles|🍜|我喜欢吃面条。|I like eating noodles.
饺子|jiǎozi|dumplings|🥟|过年吃饺子。|We eat dumplings at New Year.
包子|bāozi|steamed bun|🥟|早饭吃包子。|Steamed buns for breakfast.
鸡蛋|jīdàn|egg|🥚|两个鸡蛋。|Two eggs.
鱼|yú|fish|🐟|我不吃鱼。|I don’t eat fish.
肉|ròu|meat|🥩|这个菜有肉吗？|Does this dish have meat?
蔬菜|shūcài|vegetables|🥦|多吃蔬菜。|Eat more vegetables.
苹果|píngguǒ|apple|🍎|一个红苹果。|A red apple.
水果|shuǐguǒ|fruit|🍇|我每天吃水果。|I eat fruit every day.
吃|chī|to eat|🍽️|你吃饭了吗？|Have you eaten?
喝|hē|to drink|🥤|我喝茶。|I drink tea.
辣|là|spicy|🌶️|四川菜很辣。|Sichuan food is very spicy.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
房子|fángzi|house|🏠|他们的房子很大。|Their house is big.
房间|fángjiān|room|🚪|我的房间很小。|My room is small.
厨房|chúfáng|kitchen|🍳|妈妈在厨房做饭。|Mum is cooking in the kitchen.
洗手间|xǐshǒujiān|bathroom / toilet|🚽|洗手间在哪儿？|Where is the toilet?
窗户|chuānghu|window|🪟|请开窗户。|Please open the window.
门|mén|door|🚪|请关门。|Please close the door.
桌子|zhuōzi|table|🪑|书在桌子上。|The book is on the table.
椅子|yǐzi|chair|🪑|请坐这把椅子。|Please sit on this chair.
床|chuáng|bed|🛏️|床很舒服。|The bed is comfortable.
钥匙|yàoshi|key|🔑|我的钥匙不见了。|My keys are gone.
电视|diànshì|television|📺|晚上看电视。|I watch TV in the evening.
住|zhù|to live|🏡|我住在北京。|I live in Beijing.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
地铁站|dìtiě zhàn|metro station|🚇|地铁站很近。|The metro station is close.
商店|shāngdiàn|shop|🏪|这家商店很便宜。|This shop is cheap.
超市|chāoshì|supermarket|🛒|我去超市买东西。|I’m going to the supermarket to shop.
医院|yīyuàn|hospital|🏥|医院在前面。|The hospital is ahead.
银行|yínháng|bank|🏦|银行九点开门。|The bank opens at nine.
公园|gōngyuán|park|🌳|我们去公园散步。|We go for a walk in the park.
饭馆|fànguǎn|restaurant|🍽️|这家饭馆很有名。|This restaurant is famous.
路|lù|road|🛣️|我迷路了。|I’m lost.
左边|zuǒbian|left side|⬅️|银行在左边。|The bank is on the left.
右边|yòubian|right side|➡️|往右边走。|Go to the right.
一直走|yìzhí zǒu|go straight|⬆️|一直走就到了。|Go straight and you’re there.
在哪儿|zài nǎr|where is|📍|地铁站在哪儿？|Where is the metro station?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
红色|hóngsè|red|🔴|红色代表好运。|Red stands for good luck.
蓝色|lánsè|blue|🔵|天空是蓝色的。|The sky is blue.
白色|báisè|white|⚪|一只白色的猫。|A white cat.
黑色|hēisè|black|⚫|黑色的包。|A black bag.
绿色|lǜsè|green|🟢|我喜欢绿色。|I like green.
大|dà|big|🐘|这个房子很大。|This house is big.
小|xiǎo|small|🐭|一只小狗。|A small dog.
好|hǎo|good|👍|很好！|Very good!
新|xīn|new|🆕|新手机。|A new phone.
贵|guì|expensive|💎|太贵了！|Too expensive!
便宜|piányi|cheap|🏷️|便宜一点吧。|Make it a bit cheaper.
漂亮|piàoliang|pretty|🌸|这里真漂亮！|It’s really pretty here!
`),
  t('A1', 'weather', '🌦️', 'Weather and seasons', 'Météo et saisons', `
天气|tiānqì|weather|🌤️|今天天气怎么样？|How’s the weather today?
下雨|xià yǔ|to rain|🌧️|外面在下雨。|It’s raining outside.
下雪|xià xuě|to snow|❄️|北京冬天下雪。|It snows in Beijing in winter.
刮风|guā fēng|to be windy|🌬️|今天刮大风。|It’s very windy today.
晴天|qíngtiān|sunny day|☀️|明天是晴天。|Tomorrow will be sunny.
春天|chūntiān|spring|🌸|春天花开了。|The flowers bloom in spring.
夏天|xiàtiān|summer|🏖️|夏天很热。|Summer is hot.
秋天|qiūtiān|autumn|🍁|秋天最舒服。|Autumn is the most pleasant.
冬天|dōngtiān|winter|☃️|冬天很冷。|Winter is cold.
雨伞|yǔsǎn|umbrella|☂️|带雨伞吧。|Take an umbrella.
`),
  // ---------- A2 ----------
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
旅游|lǚyóu|to travel / tourism|🧳|我想去云南旅游。|I want to travel to Yunnan.
飞机|fēijī|plane|✈️|坐飞机去上海。|Fly to Shanghai.
机场|jīchǎng|airport|🛫|机场很远。|The airport is far.
火车|huǒchē|train|🚆|坐火车去西安。|Take the train to Xi’an.
高铁|gāotiě|high-speed train|🚄|高铁很快。|The high-speed train is fast.
票|piào|ticket|🎫|买两张票。|Buy two tickets.
酒店|jiǔdiàn|hotel|🏨|我订了一家酒店。|I booked a hotel.
护照|hùzhào|passport|🛂|别忘了带护照。|Don’t forget your passport.
行李|xíngli|luggage|🧳|行李太重了。|The luggage is too heavy.
地图|dìtú|map|🗺️|看一下地图。|Have a look at the map.
山|shān|mountain|⛰️|我们去爬山。|We’re going hiking.
海|hǎi|sea|🌊|海边很美。|The seaside is beautiful.
照片|zhàopiàn|photo|📷|帮我拍张照片。|Take a photo of me.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
买|mǎi|to buy|🛒|我想买一件衣服。|I want to buy some clothes.
衣服|yīfu|clothes|👕|这件衣服很好看。|This piece of clothing looks great.
鞋|xié|shoes|👟|这双鞋太小了。|These shoes are too small.
大小|dàxiǎo|size|📏|有大一点的吗？|Do you have a bigger one?
试试|shìshi|to try|🪞|我可以试试吗？|Can I try it?
付钱|fù qián|to pay|💳|在哪儿付钱？|Where do I pay?
现金|xiànjīn|cash|💵|可以用现金吗？|Can I use cash?
手机支付|shǒujī zhīfù|mobile payment|📱|中国人常用手机支付。|People in China often pay by phone.
打折|dǎzhé|discount|🏷️|今天打八折。|It’s 20% off today.
礼物|lǐwù|gift|🎁|这是给妈妈的礼物。|This is a gift for mum.
袋子|dàizi|bag|🛍️|要袋子吗？|Do you need a bag?
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
生病|shēngbìng|to get ill|🤒|我生病了。|I’m ill.
感冒|gǎnmào|cold|🤧|我感冒了。|I have a cold.
发烧|fāshāo|to have a fever|🌡️|她发烧了。|She has a fever.
头疼|tóu téng|headache|🤕|我头疼。|I have a headache.
肚子疼|dùzi téng|stomach ache|🤢|我肚子疼。|I have a stomach ache.
药|yào|medicine|💊|吃药吧。|Take some medicine.
医生|yīshēng|doctor|👨‍⚕️|你应该去看医生。|You should see a doctor.
累|lèi|tired|🥱|今天我很累。|I’m very tired today.
休息|xiūxi|to rest|🛋️|好好休息。|Rest well.
身体|shēntǐ|body / health|💪|身体最重要。|Health comes first.
舒服|shūfu|comfortable / well|😌|我不太舒服。|I don’t feel very well.
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
工作|gōngzuò|work / to work|💼|我在银行工作。|I work at a bank.
公司|gōngsī|company|🏢|公司在市中心。|The company is in the city centre.
开会|kāihuì|to have a meeting|👥|下午三点开会。|There’s a meeting at three this afternoon.
同事|tóngshì|colleague|🤝|我的同事很友好。|My colleagues are friendly.
老板|lǎobǎn|boss|😎|老板很忙。|The boss is busy.
加班|jiābān|to work overtime|🌙|今天要加班。|I have to work late today.
工资|gōngzī|salary|💵|工资不错。|The salary is decent.
面试|miànshì|interview|🤝|明天我有面试。|I have an interview tomorrow.
放假|fàngjià|to be on holiday|🏖️|下周放假。|We’re off next week.
忙|máng|busy|🏃|这个星期很忙。|This week is busy.
电脑|diànnǎo|computer|💻|我的电脑坏了。|My computer is broken.
`),
  t('A2', 'hobbies', '🎮', 'Free time', 'Les loisirs', `
爱好|àihào|hobby|🎨|你的爱好是什么？|What’s your hobby?
电影|diànyǐng|film|🎬|我们去看电影吧。|Let’s go see a film.
音乐|yīnyuè|music|🎵|我喜欢听音乐。|I like listening to music.
唱歌|chànggē|to sing|🎤|周末去唱歌。|Let’s go singing at the weekend.
跳舞|tiàowǔ|to dance|💃|她跳舞跳得很好。|She dances very well.
运动|yùndòng|sport / exercise|🏋️|每天运动一小时。|I exercise an hour a day.
打篮球|dǎ lánqiú|to play basketball|🏀|他喜欢打篮球。|He likes playing basketball.
游泳|yóuyǒng|to swim|🏊|夏天去游泳。|We go swimming in summer.
看书|kàn shū|to read|📖|我晚上看书。|I read in the evening.
做饭|zuò fàn|to cook|👩‍🍳|我会做饭。|I can cook.
玩游戏|wán yóuxì|to play games|🎮|弟弟在玩游戏。|My little brother is playing games.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
高兴|gāoxìng|happy|😊|见到你很高兴。|I’m happy to see you.
难过|nánguò|sad|😢|她很难过。|She’s very sad.
生气|shēngqì|angry|😠|你为什么生气？|Why are you angry?
担心|dānxīn|to worry|😟|别担心。|Don’t worry.
害怕|hàipà|to be afraid|😱|我害怕狗。|I’m afraid of dogs.
喜欢|xǐhuan|to like|❤️|我喜欢猫。|I like cats.
爱|ài|to love|💗|我爱你。|I love you.
无聊|wúliáo|bored / boring|🥱|这个电影很无聊。|This film is boring.
开心|kāixīn|happy / cheerful|🥳|今天很开心！|Today was great fun!
累死了|lèi sǐ le|exhausted|😫|我累死了。|I’m exhausted.
`),
  // ---------- B1 ----------
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
觉得|juéde|to think / feel|💭|我觉得很好。|I think it’s good.
认为|rènwéi|to consider|🧠|我认为他是对的。|I believe he’s right.
同意|tóngyì|to agree|👍|我同意你的看法。|I agree with your view.
反对|fǎnduì|to oppose|👎|很多人反对。|Many people are against it.
但是|dànshì|but|↔️|很贵，但是很好。|It’s expensive, but good.
所以|suǒyǐ|so|➡️|下雨了，所以我在家。|It rained, so I stayed home.
因为|yīnwèi|because|🧩|因为忙，所以没去。|I didn’t go because I was busy.
问题|wèntí|question / problem|❗|没问题！|No problem!
可能|kěnéng|maybe / possible|🤷|他可能不来了。|He might not come.
一定|yídìng|definitely|💯|我一定去！|I’ll definitely go!
其实|qíshí|actually|📌|其实我不知道。|Actually, I don’t know.
`),
  t('B1', 'society', '🏮', 'Life in China', 'La vie en Chine', `
文化|wénhuà|culture|🎎|我对中国文化感兴趣。|I’m interested in Chinese culture.
传统|chuántǒng|tradition|🏮|这是一个传统节日。|It’s a traditional festival.
春节|Chūnjié|Spring Festival|🧧|春节是最重要的节日。|Spring Festival is the most important holiday.
红包|hóngbāo|red envelope|🧧|过年给孩子红包。|Children get red envelopes at New Year.
环境|huánjìng|environment|🌍|我们要保护环境。|We must protect the environment.
垃圾|lājī|rubbish|🗑️|请把垃圾分类。|Please sort the rubbish.
网上|wǎngshang|online|🌐|我在网上买东西。|I shop online.
手机|shǒujī|mobile phone|📱|我的手机没电了。|My phone’s battery is dead.
新闻|xīnwén|news|📰|你看新闻了吗？|Did you see the news?
城市|chéngshì|city|🏙️|上海是一个大城市。|Shanghai is a big city.
发展|fāzhǎn|development|📈|中国发展得很快。|China has developed very fast.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'zh-g-shi', level: 'A1', icon: '🧩', en: '是 and simple sentences', fr: '是 et phrases simples',
    cards: [
      { en: 'Chinese verbs never change: 我是, 你是, 他是 (I am, you are, he is). Put 不 before the verb to negate: 我不是.', fr: 'Les verbes ne se conjuguent pas ; 不 pour nier.', examples: [['我是学生。', 'I’m a student.', 'I’m a student.'], ['他不是老师。', 'He isn’t a teacher.', 'He isn’t a teacher.']] },
      { en: 'Add 吗 at the end to ask a yes/no question: 你是学生吗？', fr: '吗 en fin de phrase pour une question.', examples: [['你好吗？', 'How are you?', 'How are you?']] },
    ],
    drills: [
      { text: '我___学生。', answer: '是', wrong: ['吗', '的'], en: 'I’m a student.', fr: 'I’m a student.' },
      { text: '你是老师___？', answer: '吗', wrong: ['是', '不'], en: 'Are you a teacher?', fr: 'Are you a teacher?' },
      { text: '他___是中国人。', answer: '不', wrong: ['吗', '很'], en: 'He isn’t Chinese.', fr: 'He isn’t Chinese.' },
    ],
  },
  {
    id: 'zh-g-de', level: 'A1', icon: '🔗', en: 'Possession with 的', fr: 'La possession avec 的',
    cards: [
      { en: '的 links an owner to a thing: 我的书 (my book), 妈妈的车 (mum’s car). With close family it’s often dropped: 我妈妈.', fr: '的 relie le possesseur à l’objet.', examples: [['这是我的手机。', 'This is my phone.', 'This is my phone.']] },
    ],
    drills: [
      { text: '这是我___书。', answer: '的', wrong: ['是', '吗'], en: 'This is my book.', fr: 'This is my book.' },
      { text: '老师___名字是什么？', answer: '的', wrong: ['吗', '了'], en: 'What’s the teacher’s name?', fr: 'What’s the teacher’s name?' },
    ],
  },
  {
    id: 'zh-g-measure', level: 'A1', icon: '📏', en: 'Measure words', fr: 'Les classificateurs',
    cards: [
      { en: 'Between a number and a noun goes a measure word: 一个人 (one person), 两杯咖啡 (two cups of coffee), 三本书 (three books).', fr: 'Un classificateur entre le nombre et le nom.', examples: [['一个苹果', 'one apple', 'one apple'], ['两杯茶', 'two cups of tea', 'two cups of tea']] },
      { en: '个 is the general one; 杯 for cups, 本 for books, 只 for many animals, 张 for flat things like tickets.', fr: '个 général ; 杯, 本, 只, 张.', examples: [['一只猫', 'a cat', 'a cat'], ['两张票', 'two tickets', 'two tickets']] },
    ],
    drills: [
      { text: '我要两___咖啡。', answer: '杯', wrong: ['本', '只'], en: 'I’d like two coffees.', fr: 'I’d like two coffees.' },
      { text: '我有三___书。', answer: '本', wrong: ['杯', '张'], en: 'I have three books.', fr: 'I have three books.' },
      { text: '她养了一___猫。', answer: '只', wrong: ['本', '杯'], en: 'She has a cat.', fr: 'She has a cat.' },
      { text: '买两___票。', answer: '张', wrong: ['只', '个'], en: 'Buy two tickets.', fr: 'Buy two tickets.' },
    ],
  },
  {
    id: 'zh-g-le', level: 'A2', icon: '⏮️', en: 'Completed actions with 了', fr: 'L’action accomplie avec 了',
    cards: [
      { en: '了 after a verb shows the action is done: 我吃了 (I’ve eaten). The negative uses 没 and drops 了: 我没吃.', fr: '了 = action accomplie ; négation 没.', examples: [['我买了一本书。', 'I bought a book.', 'I bought a book.'], ['我还没吃饭。', 'I haven’t eaten yet.', 'I haven’t eaten yet.']] },
    ],
    drills: [
      { text: '我昨天看___一部电影。', answer: '了', wrong: ['的', '吗'], en: 'I saw a film yesterday.', fr: 'I saw a film yesterday.' },
      { text: '我还___吃饭。', answer: '没', wrong: ['不', '了'], en: 'I haven’t eaten yet.', fr: 'I haven’t eaten yet.' },
      { text: '他去___上海。', answer: '了', wrong: ['吗', '的'], en: 'He went to Shanghai.', fr: 'He went to Shanghai.' },
    ],
  },
  {
    id: 'zh-g-xiang', level: 'A2', icon: '🌠', en: 'Wanting and abilities: 想, 会, 可以', fr: 'Vouloir et pouvoir : 想, 会, 可以',
    cards: [
      { en: '想 = would like to, 会 = can (learned skill), 可以 = may / can (allowed).', fr: '想 = vouloir, 会 = savoir faire, 可以 = pouvoir (permis).', examples: [['我想去中国。', 'I’d like to go to China.', 'I’d like to go to China.'], ['我会说中文。', 'I can speak Chinese.', 'I can speak Chinese.'], ['这里可以拍照吗？', 'May I take photos here?', 'May I take photos here?']] },
    ],
    drills: [
      { text: '我___喝咖啡。', answer: '想', wrong: ['会', '了'], en: 'I’d like a coffee.', fr: 'I’d like a coffee.' },
      { text: '她___游泳。', answer: '会', wrong: ['想', '的'], en: 'She can swim.', fr: 'She can swim.' },
      { text: '我___坐这儿吗？', answer: '可以', wrong: ['会', '是'], en: 'May I sit here?', fr: 'May I sit here?' },
    ],
  },
  {
    id: 'zh-g-bi', level: 'B1', icon: '⚖️', en: 'Comparisons with 比', fr: 'La comparaison avec 比',
    cards: [
      { en: 'A 比 B + adjective = A is more … than B: 他比我高 (he’s taller than me). Never put 很 in a 比 sentence.', fr: 'A 比 B + adjectif ; jamais 很.', examples: [['今天比昨天冷。', 'Today is colder than yesterday.', 'Today is colder than yesterday.']] },
      { en: 'Add 一点 for "a bit" or 多了 for "much": 便宜一点, 好多了.', fr: '一点 = un peu, 多了 = beaucoup.', examples: [['这个比那个便宜一点。', 'This one is a bit cheaper than that one.', 'This one is a bit cheaper than that one.']] },
    ],
    drills: [
      { text: '哥哥___我高。', answer: '比', wrong: ['很', '的'], en: 'My brother is taller than me.', fr: 'My brother is taller than me.' },
      { text: '上海比北京___。', answer: '热', wrong: ['很热', '比热'], en: 'Shanghai is hotter than Beijing.', fr: 'Shanghai is hotter than Beijing.' },
      { text: '这个好___了。', answer: '多', wrong: ['很', '比'], en: 'This one is much better.', fr: 'This one is much better.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'zh-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: '你好！你要什么？', en: 'Hello! What would you like?', fr: 'Hello! What would you like?' },
      { who: 'B', text: '我要一杯咖啡和一个蛋糕。', en: 'I’d like a coffee and a cake.', fr: 'I’d like a coffee and a cake.', wrong: ['我是一杯咖啡。', '买单在哪儿？'] },
      { who: 'A', text: '在这儿喝还是带走？', en: 'Drink here or take away?', fr: 'Drink here or take away?' },
      { who: 'B', text: '带走，谢谢。', en: 'To take away, thanks.', fr: 'To take away, thanks.', wrong: ['我二十岁。', '今天很冷。'] },
      { who: 'A', text: '一共四十五块。', en: 'That’s forty-five yuan altogether.', fr: 'That’s forty-five yuan altogether.' },
      { who: 'B', text: '可以用手机支付吗？', en: 'Can I pay by phone?', fr: 'Can I pay by phone?', wrong: ['再见，四十五块！', '洗手间多少钱？'] },
    ],
  },
  {
    id: 'zh-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: '请问，地铁站在哪儿？', en: 'Excuse me, where is the metro station?', fr: 'Excuse me, where is the metro station?', wrong: ['请问，地铁站多少钱？', '请问，我是地铁站。'] },
      { who: 'A', text: '一直走，然后往右拐。', en: 'Go straight, then turn right.', fr: 'Go straight, then turn right.' },
      { who: 'B', text: '远吗？', en: 'Is it far?', fr: 'Is it far?', wrong: ['好吃吗？', '冷吗？'] },
      { who: 'A', text: '不远，走路五分钟。', en: 'Not far, five minutes’ walk.', fr: 'Not far, five minutes’ walk.' },
      { who: 'B', text: '太谢谢了！', en: 'Thanks so much!', fr: 'Thanks so much!', wrong: ['晚安！', '我吃饱了！'] },
    ],
  },
  {
    id: 'zh-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: '您好，有预订吗？', en: 'Hello, do you have a booking?', fr: 'Hello, do you have a booking?' },
      { who: 'B', text: '有，我订了两个晚上，名字是史密斯。', en: 'Yes, two nights under the name Smith.', fr: 'Yes, two nights under the name Smith.', wrong: ['有，我发烧了。', '我要一杯咖啡。'] },
      { who: 'A', text: '请给我您的护照。', en: 'Your passport, please.', fr: 'Your passport, please.' },
      { who: 'B', text: '给您。早饭几点开始？', en: 'Here you are. What time does breakfast start?', fr: 'Here you are. What time does breakfast start?', wrong: ['给您。护照在哪儿吃？', '不，我喜欢猫。'] },
      { who: 'A', text: '七点到十点。您的房间在三楼。', en: 'Seven to ten. Your room is on the third floor.', fr: 'Seven to ten. Your room is on the third floor.' },
      { who: 'B', text: '好的，谢谢！', en: 'OK, thank you!', fr: 'OK, thank you!', wrong: ['不客气，再见！', '我吃饱了。'] },
    ],
  },
  {
    id: 'zh-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: '你哪儿不舒服？', en: 'What’s wrong?', fr: 'What’s wrong?' },
      { who: 'B', text: '我头疼，还发烧。', en: 'I have a headache and a fever.', fr: 'I have a headache and a fever.', wrong: ['我想吃饺子。', '我订了一家酒店。'] },
      { who: 'A', text: '从什么时候开始的？', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: '从昨天开始。', en: 'Since yesterday.', fr: 'Since yesterday.', wrong: ['四十五块。', '在地铁站。'] },
      { who: 'A', text: '是感冒。吃这个药，多喝水，好好休息。', en: 'It’s a cold. Take this medicine, drink plenty of water and rest.', fr: 'It’s a cold. Take this medicine, drink plenty of water and rest.' },
      { who: 'B', text: '谢谢医生。', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['欢迎光临。', '干杯！'] },
    ],
  },
  {
    id: 'zh-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: '这个周末你有什么安排？', en: 'Any plans this weekend?', fr: 'Any plans this weekend?' },
      { who: 'B', text: '还没有。怎么了？', en: 'Not yet. Why?', fr: 'Not yet. Why?', wrong: ['我昨天吃了面条。', '我二十岁。'] },
      { who: 'A', text: '我们去西湖骑自行车吧？', en: 'Shall we go cycling around West Lake?', fr: 'Shall we go cycling around West Lake?' },
      { who: 'B', text: '好主意！如果天气好，我一定去。', en: 'Great idea! If the weather’s good, I’ll definitely come.', fr: 'Great idea! If the weather’s good, I’ll definitely come.', wrong: ['好主意！去年很冷。', '不，我没有鞋。'] },
      { who: 'A', text: '那我们十点在地铁站见。', en: 'Then let’s meet at the metro station at ten.', fr: 'Then let’s meet at the metro station at ten.' },
      { who: 'B', text: '好的，我带点心。', en: 'OK, I’ll bring snacks.', fr: 'OK, I’ll bring snacks.', wrong: ['好的，我吃地铁站。', '不，我昨天去了。'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'zh-s-market', level: 'A1', icon: '🧺', en: 'Xiaomei’s Saturday', fr: 'Le samedi de Xiaomei',
    sentences: [
      ['小美住在杭州。', 'Xiaomei lives in Hangzhou.', 'Xiaomei lives in Hangzhou.'],
      ['星期六早上，她去市场。', 'On Saturday morning she goes to the market.', 'On Saturday morning she goes to the market.'],
      ['她买了水果和蔬菜。', 'She bought fruit and vegetables.', 'She bought fruit and vegetables.'],
      ['然后她去阿明的咖啡店。', 'Then she goes to Ah Ming’s café.', 'Then she goes to Ah Ming’s café.'],
      ['阿明送给她一个蛋糕。', 'Ah Ming gives her a cake.', 'Ah Ming gives her a cake.'],
      ['小美很开心。', 'Xiaomei is very happy.', 'Xiaomei is very happy.'],
    ],
    glossary: {},
    questions: [
      { en: 'Where does Xiaomei live?', fr: 'Where does Xiaomei live?', answer: '杭州', wrong: ['北京', '上海'] },
      { en: 'What did she buy?', fr: 'What did she buy?', answer: '水果和蔬菜', wrong: ['面包和牛奶', '衣服和鞋'] },
      { en: 'What did Ah Ming give her?', fr: 'What did Ah Ming give her?', answer: '蛋糕', wrong: ['咖啡', '苹果'] },
    ],
  },
  {
    id: 'zh-s-train', level: 'A2', icon: '🚄', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['小龙要坐八点的高铁。', 'Xiaolong was supposed to catch the eight o’clock fast train.', 'Xiaolong was supposed to catch the eight o’clock fast train.'],
      ['可是他七点半才起床。', 'But he only got up at half past seven.', 'But he only got up at half past seven.'],
      ['他很快地打车去火车站。', 'He quickly took a taxi to the station.', 'He quickly took a taxi to the station.'],
      ['到车站的时候，已经八点零二分了。', 'When he arrived it was already two minutes past eight.', 'When he arrived it was already two minutes past eight.'],
      ['高铁已经开走了。', 'The train had already left.', 'The train had already left.'],
      ['他坐了下一班车，在车上吃了包子。', 'He took the next one and ate steamed buns on board.', 'He took the next one and ate steamed buns on board.'],
    ],
    glossary: {},
    questions: [
      { en: 'When did Xiaolong get up?', fr: 'When did Xiaolong get up?', answer: '七点半', wrong: ['八点', '六点'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: '打车', wrong: ['骑自行车', '走路'] },
      { en: 'What did he eat on the train?', fr: 'What did he eat on the train?', answer: '包子', wrong: ['面条', '饺子'] },
    ],
  },
  {
    id: 'zh-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['两年前，我们楼里的邻居们有了一个想法。', 'Two years ago, the neighbours in our building had an idea.', 'Two years ago, the neighbours in our building had an idea.'],
      ['楼顶是空的，没有人用。', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['王爷爷说："我们种菜吧！"', 'Grandpa Wang said, “Let’s grow vegetables!”', 'Grandpa Wang said, “Let’s grow vegetables!”'],
      ['一开始，有的人不同意。', 'At first, some people disagreed.', 'At first, some people disagreed.'],
      ['现在楼顶上有西红柿、葱和草莓。', 'Now there are tomatoes, spring onions and strawberries on the roof.', 'Now there are tomatoes, spring onions and strawberries on the roof.'],
      ['每个星期天，大家一起在楼顶吃饭。', 'Every Sunday, everyone eats together on the roof.', 'Every Sunday, everyone eats together on the roof.'],
    ],
    glossary: {},
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: '王爷爷', wrong: ['小美', '小龙'] },
      { en: 'What grows there now?', fr: 'What grows there now?', answer: '西红柿、葱和草莓', wrong: ['苹果和梨', '米'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: '每个星期天', wrong: ['每个星期一', '每天'] },
    ],
  },
];

export const CHINESE_FULL: FullCourse = { topics, grammar, dialogues, stories };
