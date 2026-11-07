import type { Level, Topic, Word } from '@/data/learn/full';

/** Mandarin, pack 1: everyday verbs, adjectives, body, places, animals, clothes, expressions, time words, food, studies. Lines are "word|pinyin|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
去|qù|to go|🚶|我去学校。|I go to school.
来|lái|to come|👋|你明天来吗？|Are you coming tomorrow?
回家|huí jiā|to go home|🏠|我七点回家。|I go home at seven.
看|kàn|to look / watch / read|👀|我看电视。|I watch TV.
听|tīng|to listen|🎧|我听音乐。|I listen to music.
说|shuō|to speak / say|🗣️|你会说中文吗？|Can you speak Chinese?
写|xiě|to write|✍️|我写汉字。|I write characters.
睡觉|shuìjiào|to sleep|😴|我十一点睡觉。|I go to bed at eleven.
起床|qǐchuáng|to get up|⏰|我六点起床。|I get up at six.
做|zuò|to do / make|🛠️|你在做什么？|What are you doing?
等|děng|to wait|⏳|请等一下。|Please wait a moment.
知道|zhīdào|to know|🧠|我不知道。|I don’t know.
走|zǒu|to walk / leave|🚶|我们走吧。|Let’s go.
跑步|pǎobù|to run / jog|🏃|我每天跑步。|I run every day.
开|kāi|to open / drive|🔓|请开门。|Please open the door.
关|guān|to close / turn off|🔒|请关灯。|Please turn off the light.
学习|xuéxí|to study|📚|我在学习中文。|I’m studying Chinese.
`),
  t('A1', 'adjectives', '✨', 'Describing things', 'Décrire les choses', `
快|kuài|fast|🚀|高铁很快。|The high-speed train is fast.
慢|màn|slow|🐌|请说慢一点。|Please speak a bit slower.
难|nán|difficult|🧗|汉字很难。|Characters are difficult.
容易|róngyì|easy|👌|这个很容易。|This is very easy.
长|cháng|long|📏|她的头发很长。|Her hair is long.
短|duǎn|short|📐|这部电影很短。|This film is short.
重|zhòng|heavy|🏋️|这个包很重。|This bag is heavy.
轻|qīng|light|🪶|这件衣服很轻。|This garment is light.
安静|ānjìng|quiet|🤫|图书馆很安静。|The library is quiet.
热闹|rènao|lively|🎉|这条街很热闹。|This street is lively.
甜|tián|sweet|🍬|这个蛋糕很甜。|This cake is very sweet.
多|duō|many / much|📦|人很多。|There are lots of people.
少|shǎo|few / little|🤏|时间很少。|There’s little time.
`),
  t('A1', 'body', '🧍', 'The body', 'Le corps', `
眼睛|yǎnjing|eyes|👁️|她的眼睛很大。|She has big eyes.
耳朵|ěrduo|ear|👂|我耳朵疼。|My ear hurts.
鼻子|bízi|nose|👃|我的鼻子不舒服。|My nose doesn’t feel right.
嘴|zuǐ|mouth|👄|张开嘴。|Open your mouth.
手|shǒu|hand|✋|洗手。|Wash your hands.
脚|jiǎo|foot|🦶|我的脚疼。|My foot hurts.
腿|tuǐ|leg|🦵|他的腿很长。|He has long legs.
头发|tóufa|hair|💇|我剪头发了。|I had my hair cut.
牙|yá|tooth|🦷|我每天刷牙。|I brush my teeth every day.
脸|liǎn|face|🙂|洗脸。|Wash your face.
`),
  t('A1', 'places2', '🗺️', 'More places', 'Encore des lieux', `
学校|xuéxiào|school|🏫|学校很近。|The school is close.
图书馆|túshūguǎn|library|📚|我在图书馆学习。|I study in the library.
博物馆|bówùguǎn|museum|🏛️|博物馆周一不开。|The museum is closed on Mondays.
咖啡馆|kāfēiguǎn|café|☕|我们在咖啡馆见面。|We meet at the café.
公交车|gōngjiāochē|bus|🚌|我坐公交车上班。|I take the bus to work.
出租车|chūzūchē|taxi|🚕|我们打出租车吧。|Let’s take a taxi.
楼梯|lóutī|stairs|🪜|我走楼梯。|I take the stairs.
电梯|diàntī|lift|🛗|电梯在哪儿？|Where is the lift?
厕所|cèsuǒ|toilet|🚽|厕所在那边。|The toilet is over there.
大学|dàxué|university|🏛️|她在北京上大学。|She goes to university in Beijing.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
狗|gǒu|dog|🐕|我有一只狗。|I have a dog.
猫|māo|cat|🐈|猫在睡觉。|The cat is sleeping.
鸟|niǎo|bird|🐦|鸟在唱歌。|The bird is singing.
马|mǎ|horse|🐎|马跑得很快。|Horses run fast.
牛|niú|cow / ox|🐄|牛在吃草。|The cow is eating grass.
猪|zhū|pig|🐖|猪在睡觉。|The pig is sleeping.
兔子|tùzi|rabbit|🐇|兔子很可爱。|Rabbits are cute.
熊猫|xióngmāo|panda|🐼|熊猫吃竹子。|Pandas eat bamboo.
老虎|lǎohǔ|tiger|🐯|老虎很厉害。|Tigers are fierce.
猴子|hóuzi|monkey|🐒|猴子吃香蕉。|The monkey eats a banana.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
裤子|kùzi|trousers|👖|这条裤子太长了。|These trousers are too long.
裙子|qúnzi|skirt / dress|👗|她穿红裙子。|She’s wearing a red dress.
衬衫|chènshān|shirt|👔|一件白衬衫。|A white shirt.
外套|wàitào|coat / jacket|🧥|穿上外套，很冷。|Put on your coat, it’s cold.
帽子|màozi|hat|🧢|戴帽子。|Wear a hat.
眼镜|yǎnjìng|glasses|👓|我的眼镜在哪儿？|Where are my glasses?
穿|chuān|to wear|🧥|今天穿什么？|What shall I wear today?
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
没问题|méi wèntí|no problem|👌|没问题，我帮你。|No problem, I’ll help you.
当然|dāngrán|of course|✅|当然可以！|Of course!
加油|jiāyóu|come on! / go for it!|💪|考试加油！|Good luck with the exam!
慢走|màn zǒu|take care (to someone leaving)|👋|慢走！|Take care!
辛苦了|xīnkǔ le|thanks for your hard work|😮‍💨|今天辛苦了。|Good work today.
恭喜|gōngxǐ|congratulations|🎉|恭喜你！|Congratulations!
生日快乐|shēngrì kuàilè|happy birthday|🎂|生日快乐！|Happy birthday!
新年快乐|xīnnián kuàilè|happy new year|🧧|新年快乐！|Happy New Year!
真的吗|zhēn de ma|really?|😮|真的吗？太好了！|Really? Great!
随便|suíbiàn|whatever / as you like|🤷|吃什么？随便。|What shall we eat? Whatever you like.
小心|xiǎoxīn|careful|⚠️|小心！车来了！|Careful! A car’s coming!
干杯|gānbēi|cheers|🥂|干杯！|Cheers!
`),
  t('A2', 'time2', '⏱️', 'Time words', 'Mots du temps', `
每天|měitiān|every day|📅|我每天学中文。|I study Chinese every day.
下个星期|xià ge xīngqī|next week|➡️|下个星期我去上海。|Next week I’m going to Shanghai.
上个星期|shàng ge xīngqī|last week|⬅️|上个星期很忙。|Last week was busy.
明年|míngnián|next year|🎆|明年我想去中国。|Next year I want to go to China.
去年|qùnián|last year|🗓️|去年我结婚了。|I got married last year.
总是|zǒngshì|always|♾️|他总是迟到。|He’s always late.
有时候|yǒu shíhou|sometimes|🔀|我有时候做饭。|I sometimes cook.
已经|yǐjīng|already|✔️|我已经吃了。|I’ve already eaten.
还没|hái méi|not yet|⌛|我还没吃。|I haven’t eaten yet.
以后|yǐhòu|later / afterwards|⏭️|以后再说。|Let’s talk about it later.
马上|mǎshàng|right away|⚡|我马上来！|I’m coming right away!
`),
  t('A2', 'food2', '🍜', 'More food', 'Encore la cuisine', `
火锅|huǒguō|hot pot|🍲|冬天吃火锅。|Hot pot in winter.
北京烤鸭|Běijīng kǎoyā|Peking duck|🦆|北京烤鸭很有名。|Peking duck is famous.
豆腐|dòufu|tofu|🥢|麻婆豆腐很辣。|Mapo tofu is spicy.
炒饭|chǎofàn|fried rice|🍚|一份蛋炒饭。|A plate of egg fried rice.
汤|tāng|soup|🥣|这个汤很好喝。|This soup is delicious.
筷子|kuàizi|chopsticks|🥢|用筷子吃饭。|Eat with chopsticks.
勺子|sháozi|spoon|🥄|请给我一个勺子。|Please give me a spoon.
西瓜|xīguā|watermelon|🍉|夏天吃西瓜。|Watermelon in summer.
葡萄|pútao|grapes|🍇|葡萄很甜。|The grapes are sweet.
饮料|yǐnliào|drink|🥤|你要什么饮料？|What drink would you like?
啤酒|píjiǔ|beer|🍺|两瓶啤酒。|Two bottles of beer.
`),
  t('B1', 'studies', '🎓', 'Studies and work life', 'Études et vie active', `
考试|kǎoshì|exam|📝|明天有考试。|There’s an exam tomorrow.
作业|zuòyè|homework|📓|作业很多。|There’s a lot of homework.
毕业|bìyè|to graduate|🎓|明年我毕业。|I graduate next year.
找工作|zhǎo gōngzuò|to look for a job|🔍|我在找工作。|I’m looking for a job.
经验|jīngyàn|experience|🧭|他有很多经验。|He has a lot of experience.
目标|mùbiāo|goal|🎯|我的目标是通过HSK三级。|My goal is to pass HSK 3.
努力|nǔlì|to work hard|💪|他学习很努力。|He studies very hard.
成功|chénggōng|success / succeed|🏆|项目成功了。|The project succeeded.
失败|shībài|failure / fail|💥|失败是成功之母。|Failure is the mother of success.
计划|jìhuà|plan|📋|我们做个计划吧。|Let’s make a plan.
`),
];
