import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/**
 * Japanese, A1 → B1, for English speakers. Original content written for this app. Lines are
 * "word|romaji|English|emoji|example|example in English".
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `ja-${id}`, level, icon, en, fr, words: w6(block) });

const topics: Topic[] = [
  // ---------- A1 ----------
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
こんにちは|konnichiwa|hello|👋|こんにちは、ゆいです。|Hello, I’m Yui.
おはよう|ohayō|good morning|🌅|おはよう、レン。|Morning, Ren.
こんばんは|konbanwa|good evening|🌙|こんばんは、さとうさん。|Good evening, Mr Sato.
ありがとう|arigatō|thank you|🙏|ありがとう、ケンジさん。|Thank you, Kenji.
すみません|sumimasen|excuse me / sorry|🙇|すみません、えきはどこですか。|Excuse me, where is the station?
はじめまして|hajimemashite|nice to meet you|😊|はじめまして、アイコです。|Nice to meet you, I’m Aiko.
よろしく|yoroshiku|please treat me well|🤝|どうぞよろしく。|Pleased to meet you.
なまえ|namae|name|🏷️|おなまえは？|What’s your name?
ともだち|tomodachi|friend|👫|ゆいはともだちです。|Yui is my friend.
せんせい|sensei|teacher|👩‍🏫|せんせいはやさしいです。|The teacher is kind.
がくせい|gakusei|student|🧑‍🎓|わたしはがくせいです。|I’m a student.
はい|hai|yes|✅|はい、そうです。|Yes, that’s right.
いいえ|iie|no|❌|いいえ、ちがいます。|No, that’s wrong.
さようなら|sayōnara|goodbye|🫡|さようなら、またね。|Goodbye, see you.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
コーヒー|kōhī|coffee|☕|コーヒーをください。|A coffee, please.
おちゃ|ocha|green tea|🍵|おちゃをのみます。|I drink green tea.
みず|mizu|water|💧|みずをください。|Water, please.
ぎゅうにゅう|gyūnyū|milk|🥛|ぎゅうにゅうがすきです。|I like milk.
ジュース|jūsu|juice|🧃|オレンジジュースをひとつ。|One orange juice.
ケーキ|kēki|cake|🍰|このケーキはおいしい。|This cake is delicious.
パン|pan|bread|🍞|あさはパンをたべます。|I eat bread in the morning.
メニュー|menyū|menu|📋|メニューをください。|The menu, please.
おかいけい|okaikei|the bill|🧾|おかいけいをおねがいします。|The bill, please.
いくら|ikura|how much|💴|これはいくらですか。|How much is this?
ください|kudasai|please give me|🙂|これをください。|This one, please.
おいしい|oishii|delicious|😋|とてもおいしいです。|It’s very tasty.
あつい|atsui|hot (to touch)|♨️|コーヒーはあついです。|The coffee is hot.
つめたい|tsumetai|cold (to touch)|🧊|つめたいみずがほしい。|I want cold water.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
かぞく|kazoku|family|👪|かぞくはよにんです。|There are four in my family.
ちち|chichi|(my) father|👨|ちちはいしゃです。|My father is a doctor.
はは|haha|(my) mother|👩|はははせんせいです。|My mother is a teacher.
あに|ani|(my) older brother|👦|あにはとうきょうにすんでいます。|My older brother lives in Tokyo.
あね|ane|(my) older sister|👧|あねはピアノがじょうずです。|My older sister is good at piano.
おとうと|otōto|younger brother|🧒|おとうとはサッカーをします。|My younger brother plays football.
いもうと|imōto|younger sister|👧|いもうとはじゅっさいです。|My younger sister is ten.
そふ|sofu|(my) grandfather|👴|そふはきょうとにいます。|My grandfather is in Kyoto.
そぼ|sobo|(my) grandmother|👵|そぼのりょうりはおいしい。|My grandmother’s cooking is delicious.
こども|kodomo|child|🧒|こどもがふたりいます。|I have two children.
あかちゃん|akachan|baby|👶|あかちゃんがねています。|The baby is sleeping.
おっと|otto|(my) husband|🤵|おっとはりょうりがすきです。|My husband likes cooking.
つま|tsuma|(my) wife|👰|つまはデザイナーです。|My wife is a designer.
`),
  t('A1', 'numbers', '🔢', 'Numbers', 'Les nombres', `
いち|ichi|one|1️⃣|りんごをいっこください。|One apple, please.
に|ni|two|2️⃣|にじにあいましょう。|Let’s meet at two.
さん|san|three|3️⃣|さんにんできました。|Three of us came.
よん|yon|four|4️⃣|よんかいにすんでいます。|I live on the fourth floor.
ご|go|five|5️⃣|ごふんまってください。|Please wait five minutes.
ろく|roku|six|6️⃣|ろくじにおきます。|I get up at six.
なな|nana|seven|7️⃣|いっしゅうかんはなのかです。|A week has seven days.
はち|hachi|eight|8️⃣|はちじにでかけます。|I go out at eight.
きゅう|kyū|nine|9️⃣|きゅうじにねます。|I go to bed at nine.
じゅう|jū|ten|🔟|じゅうえんです。|It’s ten yen.
ひゃく|hyaku|a hundred|💯|ひゃくえんショップ。|A hundred-yen shop.
せん|sen|a thousand|💴|せんえんです。|It’s a thousand yen.
なんさい|nansai|how old|🎂|なんさいですか。|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
きょう|kyō|today|📅|きょうはいいてんきです。|The weather is nice today.
あした|ashita|tomorrow|🌄|あしたはやすみです。|Tomorrow is my day off.
きのう|kinō|yesterday|⬅️|きのうえいがをみました。|I saw a film yesterday.
あさ|asa|morning|🌅|あさごはんをたべます。|I eat breakfast.
ひる|hiru|noon / daytime|☀️|ひるにあいましょう。|Let’s meet at noon.
よる|yoru|night|🌃|よるはしずかです。|The night is quiet.
いま|ima|now|⏰|いまなんじですか。|What time is it now?
じかん|jikan|time / hour|⌛|じかんがありません。|I don’t have time.
げつようび|getsuyōbi|Monday|1️⃣|げつようびははたらきます。|I work on Mondays.
きんようび|kin’yōbi|Friday|5️⃣|きんようびのよる、のみにいきます。|On Friday night I go for a drink.
どようび|doyōbi|Saturday|6️⃣|どようびはやすみです。|Saturday is a day off.
にちようび|nichiyōbi|Sunday|7️⃣|にちようびにかぞくとあいます。|I see my family on Sunday.
しゅうまつ|shūmatsu|weekend|🎉|しゅうまつはなにをしますか。|What will you do at the weekend?
`),
  t('A1', 'food', '🍱', 'Food', 'La nourriture', `
ごはん|gohan|rice / meal|🍚|ごはんをたべましょう。|Let’s eat.
すし|sushi|sushi|🍣|すしがだいすきです。|I love sushi.
ラーメン|rāmen|ramen|🍜|このラーメンはからい。|This ramen is spicy.
さかな|sakana|fish|🐟|さかなをやきます。|I grill fish.
にく|niku|meat|🥩|にくはたべません。|I don’t eat meat.
やさい|yasai|vegetables|🥦|やさいをたくさんたべて。|Eat lots of vegetables.
たまご|tamago|egg|🥚|たまごをふたつください。|Two eggs, please.
りんご|ringo|apple|🍎|あかいりんごです。|It’s a red apple.
バナナ|banana|banana|🍌|バナナをいっぽんたべた。|I ate a banana.
みそしる|misoshiru|miso soup|🥣|みそしるはあたたかい。|The miso soup is warm.
おにぎり|onigiri|rice ball|🍙|コンビニでおにぎりをかった。|I bought a rice ball at the convenience store.
たべる|taberu|to eat|🍽️|なにをたべる？|What will you eat?
のむ|nomu|to drink|🥤|まいにちおちゃをのむ。|I drink tea every day.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
いえ|ie|house / home|🏠|いえにかえります。|I’m going home.
へや|heya|room|🚪|わたしのへやはちいさい。|My room is small.
だいどころ|daidokoro|kitchen|🍳|だいどころでりょうりする。|I cook in the kitchen.
おふろ|ofuro|bath|🛁|まいばんおふろにはいる。|I take a bath every night.
トイレ|toire|toilet|🚽|トイレはどこですか。|Where is the toilet?
まど|mado|window|🪟|まどをあけてください。|Please open the window.
ドア|doa|door|🚪|ドアをしめて。|Close the door.
つくえ|tsukue|desk|🖥️|つくえのうえにほんがある。|There’s a book on the desk.
いす|isu|chair|🪑|いすにすわってください。|Please sit on the chair.
ベッド|beddo|bed|🛏️|ベッドがおおきい。|The bed is big.
かぎ|kagi|key|🔑|かぎをなくしました。|I lost my key.
テレビ|terebi|television|📺|テレビをみます。|I watch TV.
すむ|sumu|to live (somewhere)|🏡|きょうとにすんでいます。|I live in Kyoto.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
えき|eki|station|🚉|えきはちかいです。|The station is close.
みせ|mise|shop|🏪|このみせはやすい。|This shop is cheap.
コンビニ|konbini|convenience store|🏪|コンビニはにじゅうよじかんあいています。|The convenience store is open 24 hours.
びょういん|byōin|hospital|🏥|びょういんにいきます。|I’m going to the hospital.
ぎんこう|ginkō|bank|🏦|ぎんこうはくじからです。|The bank opens at nine.
ゆうびんきょく|yūbinkyoku|post office|📮|ゆうびんきょくはどこですか。|Where is the post office?
こうえん|kōen|park|🌳|こうえんをさんぽします。|I take a walk in the park.
じんじゃ|jinja|shrine|⛩️|じんじゃでおまいりする。|I pray at the shrine.
おてら|otera|temple|🛕|きょうとにはおてらがおおい。|Kyoto has many temples.
みち|michi|road / way|🛣️|みちがわかりません。|I don’t know the way.
みぎ|migi|right|➡️|みぎにまがってください。|Please turn right.
ひだり|hidari|left|⬅️|ひだりにえきがあります。|The station is on the left.
まっすぐ|massugu|straight|⬆️|まっすぐいってください。|Please go straight.
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
あか|aka|red|🔴|あかいくるま。|A red car.
あお|ao|blue|🔵|そらはあおい。|The sky is blue.
しろ|shiro|white|⚪|しろいねこ。|A white cat.
くろ|kuro|black|⚫|くろいかばん。|A black bag.
きいろ|kiiro|yellow|🟡|きいろいはな。|A yellow flower.
みどり|midori|green|🟢|みどりがきれい。|The greenery is beautiful.
おおきい|ōkii|big|🐘|おおきいいえですね。|What a big house.
ちいさい|chiisai|small|🐭|ちいさいいぬ。|A small dog.
あたらしい|atarashii|new|🆕|あたらしいくつ。|New shoes.
ふるい|furui|old (things)|🏚️|ふるいおてら。|An old temple.
たかい|takai|expensive / tall|💎|このとけいはたかい。|This watch is expensive.
やすい|yasui|cheap|🏷️|このみせはやすい。|This shop is cheap.
きれい|kirei|pretty / clean|🌸|きれいなはなですね。|What pretty flowers.
`),
  t('A1', 'weather', '🌦️', 'Weather and seasons', 'Météo et saisons', `
てんき|tenki|weather|🌤️|いいてんきですね。|Nice weather, isn’t it?
あめ|ame|rain|🌧️|あめがふっています。|It’s raining.
ゆき|yuki|snow|❄️|ゆきがふりました。|It snowed.
かぜ|kaze|wind|🌬️|かぜがつよい。|The wind is strong.
くもり|kumori|cloudy|☁️|きょうはくもりです。|It’s cloudy today.
はれ|hare|sunny|☀️|あしたははれです。|Tomorrow will be sunny.
むしあつい|mushiatsui|hot and humid|🥵|にほんのなつはむしあつい。|Japanese summers are hot and humid.
さむい|samui|cold (weather)|🥶|ふゆはさむい。|Winter is cold.
はる|haru|spring|🌸|はるはさくらがきれい。|The cherry blossoms are pretty in spring.
なつ|natsu|summer|🏖️|なつやすみはうみにいく。|In the summer holidays I go to the sea.
あき|aki|autumn|🍁|あきはもみじがきれい。|The autumn leaves are beautiful.
ふゆ|fuyu|winter|☃️|ふゆはスキーをする。|In winter I ski.
かさ|kasa|umbrella|☂️|かさをもっていって。|Take an umbrella.
`),
  // ---------- A2 ----------
  t('A2', 'travel', '🚄', 'Travel', 'Voyager', `
りょこう|ryokō|trip|🧳|きょうとへりょこうします。|I’m taking a trip to Kyoto.
しんかんせん|shinkansen|bullet train|🚄|しんかんせんははやい。|The bullet train is fast.
でんしゃ|densha|train|🚃|でんしゃでかいしゃにいく。|I go to work by train.
きっぷ|kippu|ticket|🎫|きっぷをかいました。|I bought a ticket.
ひこうき|hikōki|plane|✈️|ひこうきでおきなわへ。|To Okinawa by plane.
くうこう|kūkō|airport|🛫|くうこうまでバスでいく。|I take the bus to the airport.
ホテル|hoteru|hotel|🏨|ホテルをよやくした。|I booked a hotel.
りょかん|ryokan|traditional inn|🏯|りょかんにとまりたい。|I want to stay at a ryokan.
おんせん|onsen|hot spring|♨️|おんせんはきもちいい。|The hot spring feels wonderful.
ちず|chizu|map|🗺️|ちずをみせてください。|Please show me the map.
にもつ|nimotsu|luggage|🧳|にもつがおもい。|The luggage is heavy.
パスポート|pasupōto|passport|🛂|パスポートをわすれないで。|Don’t forget your passport.
おみやげ|omiyage|souvenir gift|🎁|おみやげをかいました。|I bought souvenirs.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
かいもの|kaimono|shopping|🛍️|かいものにいきます。|I’m going shopping.
かう|kau|to buy|🛒|あたらしいふくをかう。|I’ll buy new clothes.
ふく|fuku|clothes|👕|このふくはにあう。|These clothes suit you.
くつ|kutsu|shoes|👟|くつをぬいでください。|Please take your shoes off.
かばん|kaban|bag|👜|かばんはどこ？|Where’s the bag?
サイズ|saizu|size|📏|もっとおおきいサイズはありますか。|Do you have a bigger size?
しちゃく|shichaku|trying on|🪞|しちゃくしてもいいですか。|May I try it on?
レジ|reji|checkout|🧾|レジはあちらです。|The checkout is over there.
カード|kādo|card|💳|カードでいいですか。|Is card OK?
げんきん|genkin|cash|💴|げんきんではらいます。|I’ll pay in cash.
ふくろ|fukuro|bag (shop)|🛍️|ふくろはいりますか。|Do you need a bag?
セール|sēru|sale|🏷️|いまセールちゅうです。|There’s a sale on now.
プレゼント|purezento|present|🎁|ははへのプレゼントです。|It’s a present for my mother.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
びょうき|byōki|illness|🤒|びょうきでやすみます。|I’m off sick.
かぜをひく|kaze o hiku|to catch a cold|🤧|かぜをひきました。|I caught a cold.
ねつ|netsu|fever|🌡️|ねつがあります。|I have a fever.
あたま|atama|head|🤕|あたまがいたいです。|I have a headache.
おなか|onaka|stomach|🤢|おなかがいたい。|My stomach hurts.
のど|nodo|throat|🗣️|のどがいたいです。|I have a sore throat.
いたい|itai|painful / it hurts|😣|あしがいたい。|My leg hurts.
くすり|kusuri|medicine|💊|くすりをのんでください。|Please take the medicine.
いしゃ|isha|doctor|👨‍⚕️|いしゃにみてもらう。|I’ll see a doctor.
けが|kega|injury|🩹|けがをしました。|I got hurt.
つかれた|tsukareta|tired|🥱|きょうはつかれた。|I’m tired today.
やすむ|yasumu|to rest|🛋️|ゆっくりやすんでください。|Please rest well.
げんき|genki|well / energetic|💪|おげんきですか。|How are you?
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
しごと|shigoto|work / job|💼|しごとはたのしいです。|Work is fun.
かいしゃ|kaisha|company|🏢|かいしゃはしぶやにある。|The company is in Shibuya.
かいぎ|kaigi|meeting|👥|かいぎはさんじからです。|The meeting is from three.
どうりょう|dōryō|colleague|🤝|どうりょうとひるごはんをたべる。|I have lunch with colleagues.
ぶちょう|buchō|department head|😎|ぶちょうはいそがしい。|The department head is busy.
めいし|meishi|business card|📇|めいしをどうぞ。|Here’s my business card.
メール|mēru|email|📧|メールをおくります。|I’ll send an email.
ざんぎょう|zangyō|overtime|🌙|きょうはざんぎょうです。|I’m working overtime today.
きゅうりょう|kyūryō|salary|💴|きゅうりょうびはにじゅうごにち。|Payday is the 25th.
やすみ|yasumi|day off / holiday|🏖️|あしたはやすみです。|Tomorrow is a day off.
はたらく|hataraku|to work|🧑‍💻|ぎんこうではたらいています。|I work at a bank.
いそがしい|isogashii|busy|🏃|こんしゅうはいそがしい。|This week is busy.
`),
  t('A2', 'hobbies', '🎮', 'Free time', 'Les loisirs', `
しゅみ|shumi|hobby|🎨|しゅみはなんですか。|What are your hobbies?
えいが|eiga|film|🎬|えいがをみにいこう。|Let’s go and see a film.
おんがく|ongaku|music|🎵|おんがくをきく。|I listen to music.
ほん|hon|book|📕|ほんをよむのがすき。|I like reading books.
スポーツ|supōtsu|sport|⚽|スポーツをしますか。|Do you play sports?
やきゅう|yakyū|baseball|⚾|やきゅうをみにいく。|I’m going to watch baseball.
ゲーム|gēmu|video game|🎮|ゲームをする。|I play video games.
しゃしん|shashin|photo|📷|しゃしんをとります。|I take photos.
りょうり|ryōri|cooking|👩‍🍳|りょうりがとくいです。|I’m good at cooking.
カラオケ|karaoke|karaoke|🎤|カラオケにいこう。|Let’s go to karaoke.
さんぽ|sanpo|walk|🚶|いぬとさんぽする。|I walk the dog.
およぐ|oyogu|to swim|🏊|うみでおよぐ。|I swim in the sea.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
うれしい|ureshii|happy / glad|😊|あえてうれしい。|I’m glad to see you.
かなしい|kanashii|sad|😢|かなしいニュース。|Sad news.
たのしい|tanoshii|fun / enjoyable|🥳|パーティーはたのしかった。|The party was fun.
こわい|kowai|scary / afraid|😱|くもがこわい。|I’m scared of spiders.
さびしい|sabishii|lonely|🥺|ひとりでさびしい。|I’m lonely on my own.
おこる|okoru|to get angry|😠|ちちがおこった。|My father got angry.
しんぱい|shinpai|worry|😟|しんぱいしないで。|Don’t worry.
びっくり|bikkuri|surprised|😮|びっくりした！|That surprised me!
はずかしい|hazukashii|embarrassed|😳|ちょっとはずかしい。|I’m a bit embarrassed.
すき|suki|liked / to like|❤️|ねこがすき。|I like cats.
きらい|kirai|disliked|👎|なっとうがきらい。|I don’t like natto.
つまらない|tsumaranai|boring|🥱|このほんはつまらない。|This book is boring.
`),
  t('A2', 'nature', '🗻', 'Nature', 'La nature', `
やま|yama|mountain|⛰️|やまにのぼる。|I climb the mountain.
かわ|kawa|river|🏞️|かわでつりをする。|I fish in the river.
うみ|umi|sea|🌊|うみがきれい。|The sea is beautiful.
もり|mori|forest|🌲|もりをあるく。|I walk in the forest.
はな|hana|flower|🌸|はながさいた。|The flowers bloomed.
き|ki|tree|🌳|おおきなき。|A big tree.
さくら|sakura|cherry blossom|🌸|さくらがさいています。|The cherry blossoms are out.
そら|sora|sky|🌌|そらがあおい。|The sky is blue.
つき|tsuki|moon|🌙|つきがきれいですね。|The moon is beautiful, isn’t it?
ほし|hoshi|star|⭐|ほしがたくさんみえる。|You can see lots of stars.
いぬ|inu|dog|🐕|いぬをかっています。|I have a dog.
ねこ|neko|cat|🐈|ねこがねています。|The cat is sleeping.
とり|tori|bird|🐦|とりがないている。|A bird is singing.
`),
  // ---------- B1 ----------
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
とおもう|to omou|I think that|💭|いいとおもいます。|I think it’s good.
いけん|iken|opinion|💬|あなたのいけんは？|What’s your opinion?
さんせい|sansei|agreement|👍|そのけいかくにさんせいです。|I agree with that plan.
はんたい|hantai|opposition|👎|わたしははんたいです。|I’m against it.
たしかに|tashika ni|certainly / indeed|✅|たしかにそうですね。|That’s certainly true.
でも|demo|but|↔️|たかい。でも、いい。|It’s expensive. But it’s good.
だから|dakara|so / therefore|➡️|あめだから、いえにいる。|It’s raining, so I’m staying in.
りゆう|riyū|reason|🧩|そのりゆうはなんですか。|What’s the reason?
もんだい|mondai|problem|❗|もんだいありません。|No problem.
ほうが いい|hō ga ii|had better|☝️|はやくねたほうがいい。|You’d better go to bed early.
ぜったい|zettai|absolutely|💯|ぜったいにいく！|I’m definitely going!
たぶん|tabun|probably|🤷|たぶんだいじょうぶ。|It’s probably fine.
`),
  t('B1', 'society', '🏙️', 'Life in Japan', 'La vie au Japon', `
しゃかい|shakai|society|🌐|にほんのしゃかい。|Japanese society.
ぶんか|bunka|culture|🎎|にほんのぶんかにきょうみがある。|I’m interested in Japanese culture.
でんとう|dentō|tradition|🏮|でんとうをまもる。|To preserve traditions.
まつり|matsuri|festival|🎆|なつまつりにいこう。|Let’s go to the summer festival.
きもの|kimono|kimono|👘|きものをきてみたい。|I’d like to try wearing a kimono.
れいぎ|reigi|manners|🙇|れいぎがただしい。|He has good manners.
おじぎ|ojigi|bow|🙇‍♂️|おじぎをする。|To bow.
ちきゅうおんだんか|chikyū ondanka|global warming|🌡️|ちきゅうおんだんかはしんこくだ。|Global warming is serious.
リサイクル|risaikuru|recycling|♻️|ペットボトルをリサイクルする。|To recycle plastic bottles.
ごみ|gomi|rubbish|🗑️|ごみをわけてください。|Please sort the rubbish.
じしん|jishin|earthquake|🫨|きのうじしんがあった。|There was an earthquake yesterday.
ニュース|nyūsu|news|📰|けさのニュースをみた？|Did you see this morning’s news?
`),
  t('B1', 'tech', '💻', 'Technology', 'La technologie', `
パソコン|pasokon|computer|💻|パソコンがこわれた。|My computer broke.
スマホ|sumaho|smartphone|📱|スマホをなくした。|I lost my smartphone.
アプリ|apuri|app|📲|このアプリはべんり。|This app is handy.
インターネット|intānetto|internet|🌐|インターネットでしらべる。|I look it up online.
パスワード|pasuwādo|password|🔑|パスワードをわすれた。|I forgot my password.
がめん|gamen|screen|🖥️|がめんがくらい。|The screen is dark.
じゅうでん|jūden|charging|🔋|スマホをじゅうでんする。|I charge my phone.
ダウンロード|daunrōdo|download|⬇️|ダウンロードしてください。|Please download it.
ロボット|robotto|robot|🤖|ロボットがはこぶ。|A robot carries it.
べんり|benri|convenient|👌|とてもべんりです。|It’s very convenient.
しらべる|shiraberu|to look up|🔍|ことばをしらべる。|I look up the word.
おくる|okuru|to send|📤|しゃしんをおくって。|Send me the photo.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'ja-g-desu', level: 'A1', icon: '🧩', en: 'X は Y です', fr: 'X は Y です',
    cards: [
      { en: 'は (pronounced "wa") marks the topic, です makes the sentence polite: わたしは がくせいです = I am a student.', fr: 'は marque le thème, です rend la phrase polie.', examples: [['わたしはゆいです。', 'I am Yui.', 'I am Yui.'], ['これはほんです。', 'This is a book.', 'This is a book.']] },
      { en: 'Add か to make a question: がくせいですか = Are you a student? Negative: ではありません / じゃないです.', fr: 'か pour une question. Négation : じゃないです.', examples: [['せんせいですか。', 'Are you a teacher?', 'Are you a teacher?'], ['がくせいじゃないです。', 'I’m not a student.', 'I’m not a student.']] },
    ],
    drills: [
      { text: 'わたし___ゆいです。', answer: 'は', wrong: ['を', 'に'], en: 'I am Yui.', fr: 'I am Yui.' },
      { text: 'これはほん___。', answer: 'です', wrong: ['ます', 'か'], en: 'This is a book.', fr: 'This is a book.' },
      { text: 'がくせいです___。', answer: 'か', wrong: ['は', 'を'], en: 'Are you a student?', fr: 'Are you a student?' },
      { text: 'せんせい___ないです。', answer: 'じゃ', wrong: ['です', 'が'], en: 'I’m not a teacher.', fr: 'I’m not a teacher.' },
    ],
  },
  {
    id: 'ja-g-particles', level: 'A1', icon: '🔗', en: 'Particles を, に, で', fr: 'Particules を, に, で',
    cards: [
      { en: 'を (wo, said "o") marks the object: パンをたべます = I eat bread.', fr: 'を marque l’objet.', examples: [['みずをのみます。', 'I drink water.', 'I drink water.']] },
      { en: 'に marks a destination or a time: がっこうにいきます (I go to school), ろくじにおきます (I get up at six).', fr: 'に : destination ou heure.', examples: [['えきにいきます。', 'I go to the station.', 'I go to the station.']] },
      { en: 'で marks where an action happens, or the means: こうえんであそぶ (play in the park), でんしゃでいく (go by train).', fr: 'で : lieu de l’action ou moyen.', examples: [['でんしゃでいきます。', 'I go by train.', 'I go by train.']] },
    ],
    drills: [
      { text: 'コーヒー___のみます。', answer: 'を', wrong: ['に', 'で'], en: 'I drink coffee.', fr: 'I drink coffee.' },
      { text: 'きょうと___いきます。', answer: 'に', wrong: ['を', 'で'], en: 'I go to Kyoto.', fr: 'I go to Kyoto.' },
      { text: 'バス___がっこうへいく。', answer: 'で', wrong: ['を', 'は'], en: 'I go to school by bus.', fr: 'I go to school by bus.' },
      { text: 'しちじ___おきます。', answer: 'に', wrong: ['で', 'を'], en: 'I get up at seven.', fr: 'I get up at seven.' },
    ],
  },
  {
    id: 'ja-g-masu', level: 'A1', icon: '🔁', en: 'Polite verbs: ます', fr: 'Verbes polis : ます',
    cards: [
      { en: 'The polite present ends in ます: たべます (eat), のみます (drink), いきます (go). Negative: ません.', fr: 'Présent poli en ます, négatif en ません.', examples: [['にくをたべません。', 'I don’t eat meat.', 'I don’t eat meat.']] },
      { en: 'Past: ました. Past negative: ませんでした. Let’s…: ましょう.', fr: 'Passé : ました. On y va : ましょう.', examples: [['きのうえいがをみました。', 'I saw a film yesterday.', 'I saw a film yesterday.'], ['いきましょう！', 'Let’s go!', 'Let’s go!']] },
    ],
    drills: [
      { text: 'あした、きょうとへいき___。', answer: 'ます', wrong: ['ました', 'ません'], en: 'Tomorrow I’ll go to Kyoto.', fr: 'Tomorrow I’ll go to Kyoto.' },
      { text: 'きのう、すしをたべ___。', answer: 'ました', wrong: ['ます', 'ましょう'], en: 'Yesterday I ate sushi.', fr: 'Yesterday I ate sushi.' },
      { text: 'おさけはのみ___。', answer: 'ません', wrong: ['ます', 'ました'], en: 'I don’t drink alcohol.', fr: 'I don’t drink alcohol.' },
      { text: 'いっしょにたべ___！', answer: 'ましょう', wrong: ['ません', 'ました'], en: 'Let’s eat together!', fr: 'Let’s eat together!' },
    ],
  },
  {
    id: 'ja-g-adjectives', level: 'A2', icon: '🎨', en: 'い and な adjectives', fr: 'Adjectifs en い et な',
    cards: [
      { en: 'い-adjectives end in い: たかい. Negative: たかくない. Past: たかかった.', fr: 'Adjectifs en い : たかくない, たかかった.', examples: [['このほんはたかくない。', 'This book isn’t expensive.', 'This book isn’t expensive.']] },
      { en: 'な-adjectives take な before a noun: きれいなはな. Negative: きれいじゃない.', fr: 'Adjectifs en な : きれいなはな.', examples: [['しずかなへや。', 'A quiet room.', 'A quiet room.']] },
    ],
    drills: [
      { text: 'きのうはさむ___。', answer: 'かった', wrong: ['いだった', 'くない'], en: 'Yesterday was cold.', fr: 'Yesterday was cold.' },
      { text: 'きれい___はなですね。', answer: 'な', wrong: ['い', 'の'], en: 'What pretty flowers.', fr: 'What pretty flowers.' },
      { text: 'このラーメンはから___。', answer: 'くない', wrong: ['じゃない', 'いない'], en: 'This ramen isn’t spicy.', fr: 'This ramen isn’t spicy.' },
      { text: 'しずか___へやがいい。', answer: 'な', wrong: ['い', 'に'], en: 'I’d like a quiet room.', fr: 'I’d like a quiet room.' },
    ],
  },
  {
    id: 'ja-g-te', level: 'A2', icon: '🙏', en: 'The て form: please, and doing now', fr: 'La forme て',
    cards: [
      { en: 'て-form + ください = please do: まってください (please wait), みてください (please look).', fr: 'て + ください = faites, s’il vous plaît.', examples: [['ちょっとまってください。', 'Please wait a moment.', 'Please wait a moment.']] },
      { en: 'て-form + います = doing now, or a lasting state: たべています (eating), すんでいます (living).', fr: 'て + います = en train de / état.', examples: [['いま、べんきょうしています。', 'I’m studying now.', 'I’m studying now.']] },
    ],
    drills: [
      { text: 'ここにすわっ___ください。', answer: 'て', wrong: ['た', 'に'], en: 'Please sit here.', fr: 'Please sit here.' },
      { text: 'いま、テレビをみて___。', answer: 'います', wrong: ['ください', 'でした'], en: 'I’m watching TV now.', fr: 'I’m watching TV now.' },
      { text: 'おおさかにすんで___。', answer: 'います', wrong: ['ます', 'ください'], en: 'I live in Osaka.', fr: 'I live in Osaka.' },
      { text: 'ゆっくりはなし___ください。', answer: 'て', wrong: ['た', 'ます'], en: 'Please speak slowly.', fr: 'Please speak slowly.' },
    ],
  },
  {
    id: 'ja-g-tai', level: 'B1', icon: '🌠', en: 'Wanting and plans: たい, つもり', fr: 'Envie et projets : たい, つもり',
    cards: [
      { en: 'Verb stem + たい = want to: たべたい (want to eat), いきたい (want to go).', fr: 'Radical + たい = vouloir.', examples: [['にほんにいきたいです。', 'I want to go to Japan.', 'I want to go to Japan.']] },
      { en: 'Dictionary form + つもり = intend to: らいねんにほんにいくつもりです.', fr: 'Forme dictionnaire + つもり = avoir l’intention de.', examples: [['らいねんけっこんするつもりです。', 'I intend to get married next year.', 'I intend to get married next year.']] },
    ],
    drills: [
      { text: 'すしがたべ___です。', answer: 'たい', wrong: ['ます', 'つもり'], en: 'I want to eat sushi.', fr: 'I want to eat sushi.' },
      { text: 'らいげつひっこす___です。', answer: 'つもり', wrong: ['たい', 'ました'], en: 'I plan to move next month.', fr: 'I plan to move next month.' },
      { text: 'ふじさんにのぼり___。', answer: 'たい', wrong: ['つもり', 'ません'], en: 'I want to climb Mount Fuji.', fr: 'I want to climb Mount Fuji.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'ja-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'いらっしゃいませ！ごちゅうもんは？', en: 'Welcome! What would you like?', fr: 'Welcome! What would you like?' },
      { who: 'B', text: 'コーヒーとケーキをください。', en: 'A coffee and a cake, please.', fr: 'A coffee and a cake, please.', wrong: ['おかいけいはえきです。', 'わたしはケーキです。'] },
      { who: 'A', text: 'こちらでめしあがりますか。', en: 'Will you eat in?', fr: 'Will you eat in?' },
      { who: 'B', text: 'はい、ここでたべます。', en: 'Yes, I’ll eat here.', fr: 'Yes, I’ll eat here.', wrong: ['いいえ、さむいです。', 'はい、にじゅっさいです。'] },
      { who: 'A', text: 'ぜんぶでごひゃくえんです。', en: 'That’s five hundred yen altogether.', fr: 'That’s five hundred yen altogether.' },
      { who: 'B', text: 'はい、ありがとうございます。', en: 'Here you go, thank you.', fr: 'Here you go, thank you.', wrong: ['おはよう、ごひゃくえん。', 'すみません、トイレはごひゃくえんです。'] },
    ],
  },
  {
    id: 'ja-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'すみません、えきはどこですか。', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['すみません、えきはいくらですか。', 'すみません、わたしはえきです。'] },
      { who: 'A', text: 'まっすぐいって、みぎにまがってください。', en: 'Go straight, then turn right.', fr: 'Go straight, then turn right.' },
      { who: 'B', text: 'とおいですか。', en: 'Is it far?', fr: 'Is it far?', wrong: ['おいしいですか。', 'さむいですか。'] },
      { who: 'A', text: 'いいえ、あるいてごふんです。', en: 'No, it’s five minutes on foot.', fr: 'No, it’s five minutes on foot.' },
      { who: 'B', text: 'ありがとうございました！', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['いただきます！', 'おやすみなさい！'] },
    ],
  },
  {
    id: 'ja-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'いらっしゃいませ。ごよやくのおなまえは？', en: 'Welcome. The name on the booking?', fr: 'Welcome. The name on the booking?' },
      { who: 'B', text: 'スミスです。にはくよやくしています。', en: 'Smith. I’ve booked two nights.', fr: 'Smith. I’ve booked two nights.', wrong: ['スミスです。ねつがあります。', 'コーヒーをください。'] },
      { who: 'A', text: 'パスポートをおねがいします。', en: 'Your passport, please.', fr: 'Your passport, please.' },
      { who: 'B', text: 'はい、どうぞ。あさごはんはなんじからですか。', en: 'Here you are. What time is breakfast from?', fr: 'Here you are. What time is breakfast from?', wrong: ['はい、どうぞ。えきはパスポートですか。', 'いいえ、いぬがすきです。'] },
      { who: 'A', text: 'しちじからくじまでです。おへやはさんがいです。', en: 'From seven to nine. Your room is on the third floor.', fr: 'From seven to nine. Your room is on the third floor.' },
      { who: 'B', text: 'わかりました。ありがとうございます。', en: 'Understood. Thank you.', fr: 'Understood. Thank you.', wrong: ['わかりません。さようなら。', 'いただきます。'] },
    ],
  },
  {
    id: 'ja-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'どうしましたか。', en: 'What seems to be the problem?', fr: 'What seems to be the problem?' },
      { who: 'B', text: 'あたまがいたくて、ねつがあります。', en: 'I have a headache and a fever.', fr: 'I have a headache and a fever.', wrong: ['すしがたべたいです。', 'ホテルをよやくしました。'] },
      { who: 'A', text: 'いつからですか。', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'きのうからです。', en: 'Since yesterday.', fr: 'Since yesterday.', wrong: ['ごひゃくえんです。', 'えきのまえです。'] },
      { who: 'A', text: 'かぜですね。このくすりをのんで、ゆっくりやすんでください。', en: 'It’s a cold. Take this medicine and rest well.', fr: 'It’s a cold. Take this medicine and rest well.' },
      { who: 'B', text: 'ありがとうございます、せんせい。', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['いってきます、せんせい。', 'いらっしゃいませ。'] },
    ],
  },
  {
    id: 'ja-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'しゅうまつ、なにかよていある？', en: 'Got any plans for the weekend?', fr: 'Got any plans for the weekend?' },
      { who: 'B', text: 'とくにないよ。どうして？', en: 'Nothing in particular. Why?', fr: 'Nothing in particular. Why?', wrong: ['きのうラーメンをたべた。', 'わたしはにじゅっさい。'] },
      { who: 'A', text: 'あらしやまにさくらをみにいかない？', en: 'Want to go see the cherry blossoms in Arashiyama?', fr: 'Want to go see the cherry blossoms in Arashiyama?' },
      { who: 'B', text: 'いいね！はれたらいきたい。', en: 'Sounds great! I’d love to go if it’s sunny.', fr: 'Sounds great! I’d love to go if it’s sunny.', wrong: ['いいね！きのうさむかった。', 'いいえ、くつがありません。'] },
      { who: 'A', text: 'じゃあ、じゅうじにえきであおう。', en: 'Then let’s meet at the station at ten.', fr: 'Then let’s meet at the station at ten.' },
      { who: 'B', text: 'うん、おべんとうをもっていくね。', en: 'OK, I’ll bring a bento.', fr: 'OK, I’ll bring a bento.', wrong: ['うん、えきをたべるね。', 'ううん、きのういった。'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'ja-s-market', level: 'A1', icon: '🧺', en: 'Yui’s Saturday', fr: 'Le samedi de Yui',
    sentences: [
      ['ゆいはきょうとにすんでいます。', 'Yui lives in Kyoto.', 'Yui lives in Kyoto.'],
      ['どようびのあさ、いちばにいきます。', 'On Saturday morning she goes to the market.', 'On Saturday morning she goes to the market.'],
      ['やさいとさかなをかいます。', 'She buys vegetables and fish.', 'She buys vegetables and fish.'],
      ['それから、ケンジさんのカフェにいきます。', 'Then she goes to Kenji’s café.', 'Then she goes to Kenji’s café.'],
      ['ケンジさんはケーキをくれました。', 'Kenji gave her a cake.', 'Kenji gave her a cake.'],
      ['ゆいはとてもうれしいです。', 'Yui is very happy.', 'Yui is very happy.'],
    ],
    glossary: {},
    questions: [
      { en: 'Where does Yui live?', fr: 'Where does Yui live?', answer: 'きょうと', wrong: ['とうきょう', 'おおさか'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'やさいとさかな', wrong: ['パンとみず', 'くつとかばん'] },
      { en: 'What did Kenji give her?', fr: 'What did Kenji give her?', answer: 'ケーキ', wrong: ['おちゃ', 'りんご'] },
    ],
  },
  {
    id: 'ja-s-train', level: 'A2', icon: '🚄', en: 'The missed bullet train', fr: 'Le shinkansen raté',
    sentences: [
      ['レンははちじのしんかんせんにのるよていでした。', 'Ren was supposed to take the eight o’clock bullet train.', 'Ren was supposed to take the eight o’clock bullet train.'],
      ['でも、しちじはんにおきました。', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['いそいでタクシーでえきにいきました。', 'He hurried to the station by taxi.', 'He hurried to the station by taxi.'],
      ['えきについたのは、はちじにふんでした。', 'He reached the station at two minutes past eight.', 'He reached the station at two minutes past eight.'],
      ['しんかんせんはもうでていました。', 'The bullet train had already left.', 'The bullet train had already left.'],
      ['つぎのしんかんせんで、べんとうをたべながらいきました。', 'He took the next one, eating a bento on the way.', 'He took the next one, eating a bento on the way.'],
    ],
    glossary: {},
    questions: [
      { en: 'What time did Ren wake up?', fr: 'What time did Ren wake up?', answer: 'しちじはん', wrong: ['はちじ', 'ろくじ'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'タクシー', wrong: ['じてんしゃ', 'バス'] },
      { en: 'What did he eat on the next train?', fr: 'What did he eat on the next train?', answer: 'べんとう', wrong: ['ラーメン', 'すし'] },
    ],
  },
  {
    id: 'ja-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['にねんまえ、マンションのじゅうにんがアイデアをだしました。', 'Two years ago, the residents of the building had an idea.', 'Two years ago, the residents of the building had an idea.'],
      ['おくじょうはだれもつかっていませんでした。', 'Nobody was using the roof.', 'Nobody was using the roof.'],
      ['さとうさんが「やさいをそだてよう」といいました。', 'Mr Sato said, “Let’s grow vegetables.”', 'Mr Sato said, “Let’s grow vegetables.”'],
      ['さいしょは、はんたいするひともいました。', 'At first, some people were against it.', 'At first, some people were against it.'],
      ['いまは、トマトやしそやいちごがそだっています。', 'Now tomatoes, shiso and strawberries grow there.', 'Now tomatoes, shiso and strawberries grow there.'],
      ['まいしゅうにちようびに、みんなでごはんをたべます。', 'Every Sunday, everyone eats together.', 'Every Sunday, everyone eats together.'],
    ],
    glossary: {},
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'さとうさん', wrong: ['ゆい', 'レン'] },
      { en: 'What grows there now?', fr: 'What grows there now?', answer: 'トマトやしそやいちご', wrong: ['さくらとうめ', 'こめ'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: 'にちようび', wrong: ['げつようび', 'まいにち'] },
    ],
  },
];

export const JAPANESE_FULL: FullCourse = { topics, grammar, dialogues, stories };
