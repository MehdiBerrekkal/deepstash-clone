import type { Level, Topic, Word } from '@/data/learn/full';

/** Japanese, pack 1: everyday verbs, adjectives, body, clothes, school, places, time words, expressions, animals, food. Lines are "word|romaji|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `ja-${id}`, level, icon, en, fr, words: w6(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
いく|iku|to go|🚶|がっこうにいく。|I go to school.
くる|kuru|to come|👋|あしたくる？|Are you coming tomorrow?
かえる|kaeru|to go home|🏠|しちじにかえる。|I go home at seven.
みる|miru|to see / watch|👀|えいがをみる。|I watch a film.
きく|kiku|to listen / ask|🎧|おんがくをきく。|I listen to music.
はなす|hanasu|to speak|🗣️|にほんごをはなす。|I speak Japanese.
よむ|yomu|to read|📖|まいにちほんをよむ。|I read a book every day.
かく|kaku|to write|✍️|てがみをかく。|I write a letter.
ねる|neru|to sleep / go to bed|😴|じゅういちじにねる。|I go to bed at eleven.
おきる|okiru|to get up|⏰|ろくじにおきる。|I get up at six.
する|suru|to do|🛠️|しゅくだいをする。|I do my homework.
あう|au|to meet|🤝|ともだちにあう。|I meet a friend.
まつ|matsu|to wait|⏳|ちょっとまって。|Wait a moment.
わかる|wakaru|to understand|💡|わかりました。|I understand.
しる|shiru|to know|🧠|しっています。|I know.
あるく|aruku|to walk|🚶|えきまであるく。|I walk to the station.
はしる|hashiru|to run|🏃|こうえんではしる。|I run in the park.
つくる|tsukuru|to make|🧑‍🍳|ケーキをつくる。|I make a cake.
あける|akeru|to open|🔓|まどをあけて。|Open the window.
しめる|shimeru|to close|🔒|ドアをしめて。|Close the door.
`),
  t('A1', 'adjectives', '✨', 'Describing things', 'Décrire les choses', `
はやい|hayai|fast / early|🚀|しんかんせんははやい。|The bullet train is fast.
おそい|osoi|slow / late|🐌|バスはおそい。|The bus is slow.
むずかしい|muzukashii|difficult|🧗|かんじはむずかしい。|Kanji are difficult.
やさしい|yasashii|easy / kind|🤗|せんせいはやさしい。|The teacher is kind.
ながい|nagai|long|📏|ながいみち。|A long road.
みじかい|mijikai|short|📐|みじかいえいが。|A short film.
おもい|omoi|heavy|🏋️|このかばんはおもい。|This bag is heavy.
かるい|karui|light|🪶|かるいコート。|A light coat.
しずか|shizuka|quiet|🤫|しずかなへや。|A quiet room.
にぎやか|nigiyaka|lively|🎉|にぎやかなまち。|A lively town.
いい|ii|good|👍|いいてんきですね。|Nice weather, isn’t it?
わるい|warui|bad|👎|てんきがわるい。|The weather is bad.
あまい|amai|sweet|🍬|このケーキはあまい。|This cake is sweet.
からい|karai|spicy|🌶️|カレーはからい。|The curry is spicy.
`),
  t('A1', 'body', '🧍', 'The body', 'Le corps', `
め|me|eye|👁️|めがいたい。|My eyes hurt.
みみ|mimi|ear|👂|みみがいい。|He has good ears.
鼻|hana|nose|👃|はながあかい。|My nose is red.
くち|kuchi|mouth|👄|くちをあけて。|Open your mouth.
て|te|hand|✋|てをあらう。|I wash my hands.
あし|ashi|leg / foot|🦵|あしがいたい。|My leg hurts.
かお|kao|face|🙂|かおをあらう。|I wash my face.
かみ|kami|hair|💇|かみがながい。|Her hair is long.
は|ha|tooth|🦷|はをみがく。|I brush my teeth.
せなか|senaka|back|🧍|せなかがいたい。|My back hurts.
`),
  t('A1', 'places2', '🗺️', 'More places', 'Encore des lieux', `
がっこう|gakkō|school|🏫|がっこうはちかい。|The school is close.
としょかん|toshokan|library|📚|としょかんでべんきょうする。|I study at the library.
びじゅつかん|bijutsukan|art museum|🖼️|びじゅつかんにいく。|I’m going to the art museum.
レストラン|resutoran|restaurant|🍽️|このレストランはおいしい。|This restaurant is good.
スーパー|sūpā|supermarket|🛒|スーパーでかいものする。|I shop at the supermarket.
まち|machi|town|🏙️|まちをあるく。|I walk around town.
うち|uchi|home / my house|🏡|うちにかえる。|I go home.
かいだん|kaidan|stairs|🪜|かいだんをのぼる。|I climb the stairs.
エレベーター|erebētā|lift|🛗|エレベーターはどこ？|Where is the lift?
ちかてつ|chikatetsu|subway|🚇|ちかてつでいく。|I go by subway.
バス|basu|bus|🚌|バスをまつ。|I wait for the bus.
タクシー|takushī|taxi|🚕|タクシーをよぶ。|I call a taxi.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
うま|uma|horse|🐎|うまははやい。|Horses are fast.
うし|ushi|cow|🐄|うしがいる。|There’s a cow.
ぶた|buta|pig|🐖|ぶたがねている。|The pig is sleeping.
さる|saru|monkey|🐒|さるがバナナをたべる。|The monkey eats a banana.
くま|kuma|bear|🐻|くまはおおきい。|Bears are big.
うさぎ|usagi|rabbit|🐇|うさぎはかわいい。|Rabbits are cute.
ぞう|zō|elephant|🐘|ぞうのはながながい。|The elephant’s trunk is long.
きつね|kitsune|fox|🦊|きつねをみた。|I saw a fox.
かめ|kame|turtle|🐢|かめはおそい。|Turtles are slow.
ちょう|chō|butterfly|🦋|ちょうがとぶ。|A butterfly flies.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
いただきます|itadakimasu|(said before eating)|🍽️|いただきます！|Let’s eat!
ごちそうさま|gochisōsama|thanks for the meal|🙏|ごちそうさまでした。|Thank you for the meal.
いってきます|ittekimasu|I’m off (leaving home)|🚪|いってきます！|I’m off!
いってらっしゃい|itterasshai|see you later (to someone leaving)|👋|いってらっしゃい！|See you later!
ただいま|tadaima|I’m home|🏠|ただいま！|I’m home!
おかえり|okaeri|welcome home|🤗|おかえりなさい。|Welcome home.
おやすみなさい|oyasuminasai|good night|🌙|おやすみなさい。|Good night.
だいじょうぶ|daijōbu|OK / all right|👌|だいじょうぶですか。|Are you OK?
がんばって|ganbatte|good luck / do your best|💪|しけん、がんばって！|Good luck with the exam!
おめでとう|omedetō|congratulations|🎉|たんじょうびおめでとう！|Happy birthday!
おつかれさま|otsukaresama|thanks for your hard work|😮‍💨|おつかれさまでした。|Good work today.
そうですね|sō desu ne|that’s right / I see|🙂|そうですね、いいですね。|That’s right, sounds good.
`),
  t('A2', 'time2', '⏱️', 'Time words', 'Mots du temps', `
まいにち|mainichi|every day|📅|まいにちにほんごをべんきょうする。|I study Japanese every day.
まいあさ|maiasa|every morning|🌅|まいあさコーヒーをのむ。|I drink coffee every morning.
らいしゅう|raishū|next week|➡️|らいしゅう、きょうとにいく。|Next week I’m going to Kyoto.
せんしゅう|senshū|last week|⬅️|せんしゅうはいそがしかった。|Last week was busy.
らいねん|rainen|next year|🎆|らいねんにほんにいきたい。|I want to go to Japan next year.
きょねん|kyonen|last year|🗓️|きょねんけっこんした。|I got married last year.
いつも|itsumo|always|♾️|いつもげんきだね。|You’re always cheerful.
ときどき|tokidoki|sometimes|🔀|ときどきすしをたべる。|I sometimes eat sushi.
もう|mō|already|✔️|もうたべました。|I’ve already eaten.
まだ|mada|still / not yet|⌛|まだです。|Not yet.
あとで|ato de|later|⏭️|あとででんわする。|I’ll call later.
はやく|hayaku|early / quickly|⚡|はやくきて！|Come quickly!
`),
  t('A2', 'food2', '🍱', 'More food', 'Encore la cuisine', `
うどん|udon|udon noodles|🍜|あついうどん。|Hot udon.
そば|soba|soba noodles|🍜|ざるそばがすき。|I like cold soba.
てんぷら|tenpura|tempura|🍤|えびのてんぷら。|Prawn tempura.
カレー|karē|curry|🍛|カレーライス。|Curry and rice.
とうふ|tōfu|tofu|🥢|とうふのみそしる。|Miso soup with tofu.
なっとう|nattō|fermented soybeans|🫘|なっとうはにがて。|I’m not keen on natto.
おべんとう|obentō|packed lunch|🍱|おべんとうをつくる。|I make a bento.
とりにく|toriniku|chicken|🍗|とりにくをやく。|I grill chicken.
ぎゅうにく|gyūniku|beef|🥩|ぎゅうにくはたかい。|Beef is expensive.
みかん|mikan|mandarin orange|🍊|ふゆはみかん。|Winter means mandarins.
いちご|ichigo|strawberry|🍓|いちごのケーキ。|Strawberry cake.
はし|hashi|chopsticks|🥢|はしでたべる。|I eat with chopsticks.
`),
  t('B1', 'school2', '🎓', 'Studies and work life', 'Études et vie active', `
だいがく|daigaku|university|🏛️|だいがくでけいざいをべんきょうする。|I study economics at university.
しけん|shiken|exam|📝|あしたしけんがある。|I have an exam tomorrow.
しゅくだい|shukudai|homework|📓|しゅくだいがおおい。|There’s a lot of homework.
べんきょう|benkyō|study|📚|まいにちべんきょうする。|I study every day.
そつぎょう|sotsugyō|graduation|🎓|らいねんそつぎょうする。|I graduate next year.
しゅうしょく|shūshoku|getting a job|💼|しゅうしょくがきまった。|I got a job.
けいけん|keiken|experience|🧭|いいけいけんになった。|It was a good experience.
もくひょう|mokuhyō|goal|🎯|もくひょうはにほんごのN3です。|My goal is JLPT N3.
どりょく|doryoku|effort|💪|どりょくがだいじ。|Effort matters.
せいこう|seikō|success|🏆|プロジェクトはせいこうした。|The project was a success.
しっぱい|shippai|failure|💥|しっぱいからまなぶ。|I learn from failure.
けいかく|keikaku|plan|📋|けいかくをたてる。|I make a plan.
`),
];
