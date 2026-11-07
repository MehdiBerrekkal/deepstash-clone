import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/**
 * Korean, A1 → B1, for English speakers. Original content written for this app. Lines are
 * "word|romanization|English|emoji|example|example in English".
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `ko-${id}`, level, icon, en, fr, words: w6(block) });

const topics: Topic[] = [
  // ---------- A1 ----------
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
안녕하세요|annyeonghaseyo|hello|👋|안녕하세요, 저는 지민이에요.|Hello, I’m Jimin.
안녕|annyeong|hi / bye (casual)|🙋|안녕, 준호야!|Hi, Junho!
감사합니다|gamsahamnida|thank you|🙏|도와주셔서 감사합니다.|Thank you for helping me.
고마워|gomawo|thanks (casual)|😊|선물 고마워!|Thanks for the present!
죄송합니다|joesonghamnida|I’m sorry|🙇|늦어서 죄송합니다.|I’m sorry I’m late.
괜찮아요|gwaenchanayo|it’s OK|👌|괜찮아요, 걱정 마세요.|It’s OK, don’t worry.
이름|ireum|name|🏷️|이름이 뭐예요?|What’s your name?
친구|chingu|friend|👫|지민은 제 친구예요.|Jimin is my friend.
선생님|seonsaengnim|teacher|👩‍🏫|선생님이 친절해요.|The teacher is kind.
학생|haksaeng|student|🧑‍🎓|저는 학생이에요.|I’m a student.
네|ne|yes|✅|네, 맞아요.|Yes, that’s right.
아니요|aniyo|no|❌|아니요, 괜찮아요.|No, I’m fine.
만나서 반가워요|mannaseo bangawoyo|nice to meet you|🤝|만나서 반가워요, 수아 씨.|Nice to meet you, Sua.
안녕히 가세요|annyeonghi gaseyo|goodbye (to someone leaving)|🫡|안녕히 가세요, 내일 봐요.|Goodbye, see you tomorrow.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
커피|keopi|coffee|☕|커피 한 잔 주세요.|A cup of coffee, please.
아메리카노|amerikano|americano|☕|아이스 아메리카노 주세요.|An iced americano, please.
차|cha|tea|🍵|녹차를 좋아해요.|I like green tea.
물|mul|water|💧|물 좀 주세요.|Some water, please.
우유|uyu|milk|🥛|우유를 넣어 주세요.|Please add milk.
주스|juseu|juice|🧃|오렌지 주스 하나요.|One orange juice.
케이크|keikeu|cake|🍰|이 케이크 맛있어요.|This cake is delicious.
빵|ppang|bread|🍞|아침에 빵을 먹어요.|I eat bread in the morning.
메뉴|menyu|menu|📋|메뉴 좀 보여 주세요.|Please show me the menu.
얼마예요?|eolmayeyo?|how much is it?|💴|이거 얼마예요?|How much is this?
주세요|juseyo|please give me|🙂|이거 주세요.|This one, please.
맛있어요|masisseoyo|it’s delicious|😋|정말 맛있어요!|It’s really delicious!
뜨거워요|tteugeowoyo|it’s hot|♨️|커피가 뜨거워요.|The coffee is hot.
차가워요|chagawoyo|it’s cold|🧊|물이 차가워요.|The water is cold.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
가족|gajok|family|👪|우리 가족은 네 명이에요.|There are four in my family.
아버지|abeoji|father|👨|아버지는 의사예요.|My father is a doctor.
어머니|eomeoni|mother|👩|어머니는 선생님이에요.|My mother is a teacher.
형|hyeong|older brother (of a male)|👦|형은 서울에 살아요.|My older brother lives in Seoul.
언니|eonni|older sister (of a female)|👧|언니는 노래를 잘해요.|My older sister sings well.
동생|dongsaeng|younger sibling|🧒|동생은 열 살이에요.|My younger sibling is ten.
할아버지|harabeoji|grandfather|👴|할아버지는 부산에 계세요.|My grandfather is in Busan.
할머니|halmeoni|grandmother|👵|할머니 김치가 최고예요.|Grandma’s kimchi is the best.
아이|ai|child|🧒|아이가 두 명 있어요.|I have two children.
아기|agi|baby|👶|아기가 자고 있어요.|The baby is sleeping.
남편|nampyeon|husband|🤵|남편은 요리를 좋아해요.|My husband likes cooking.
아내|anae|wife|👰|아내는 디자이너예요.|My wife is a designer.
`),
  t('A1', 'numbers', '🔢', 'Numbers', 'Les nombres', `
하나|hana|one (native)|1️⃣|사과 하나 주세요.|One apple, please.
둘|dul|two (native)|2️⃣|커피 두 잔 주세요.|Two coffees, please.
셋|set|three (native)|3️⃣|우리는 세 명이에요.|There are three of us.
넷|net|four (native)|4️⃣|고양이가 네 마리 있어요.|There are four cats.
다섯|daseot|five (native)|5️⃣|다섯 시에 만나요.|Let’s meet at five.
일|il|one (Sino-Korean)|1️⃣|일 월은 추워요.|January is cold.
이|i|two (Sino-Korean)|2️⃣|이 층에 살아요.|I live on the second floor.
삼|sam|three (Sino-Korean)|3️⃣|삼 분만 기다려 주세요.|Please wait just three minutes.
십|sip|ten (Sino-Korean)|🔟|십 분 걸려요.|It takes ten minutes.
백|baek|hundred|💯|백 미터 앞이에요.|It’s a hundred metres ahead.
천|cheon|thousand|💴|천 원이에요.|It’s a thousand won.
만|man|ten thousand|💰|만 원이에요.|It’s ten thousand won.
몇 살이에요?|myeot sarieyo?|how old are you?|🎂|동생은 몇 살이에요?|How old is your sibling?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
오늘|oneul|today|📅|오늘 날씨가 좋아요.|The weather is nice today.
내일|naeil|tomorrow|🌄|내일 봐요.|See you tomorrow.
어제|eoje|yesterday|⬅️|어제 영화를 봤어요.|I saw a film yesterday.
아침|achim|morning / breakfast|🌅|아침을 먹었어요?|Did you have breakfast?
점심|jeomsim|lunch / midday|☀️|점심 같이 먹어요.|Let’s have lunch together.
저녁|jeonyeok|evening / dinner|🌆|저녁에 뭐 해요?|What are you doing this evening?
밤|bam|night|🌃|밤에 잠을 못 자요.|I can’t sleep at night.
지금|jigeum|now|⏰|지금 몇 시예요?|What time is it now?
시간|sigan|time / hour|⌛|시간이 없어요.|I don’t have time.
월요일|woryoil|Monday|1️⃣|월요일에 일해요.|I work on Monday.
금요일|geumyoil|Friday|5️⃣|금요일 밤에 만나요.|Let’s meet on Friday night.
주말|jumal|weekend|🎉|주말에 뭐 했어요?|What did you do at the weekend?
`),
  t('A1', 'food', '🍲', 'Food', 'La nourriture', `
밥|bap|rice / meal|🍚|밥 먹었어요?|Have you eaten?
김치|gimchi|kimchi|🥬|김치는 매워요.|Kimchi is spicy.
불고기|bulgogi|bulgogi|🥩|불고기를 좋아해요.|I like bulgogi.
비빔밥|bibimbap|bibimbap|🍲|비빔밥 하나 주세요.|One bibimbap, please.
라면|ramyeon|instant noodles|🍜|밤에 라면을 먹었어요.|I ate ramyeon at night.
고기|gogi|meat|🍖|고기를 안 먹어요.|I don’t eat meat.
생선|saengseon|fish (food)|🐟|생선을 구워요.|I grill fish.
채소|chaeso|vegetables|🥦|채소를 많이 드세요.|Eat lots of vegetables.
계란|gyeran|egg|🥚|계란 두 개 주세요.|Two eggs, please.
사과|sagwa|apple|🍎|빨간 사과예요.|It’s a red apple.
떡볶이|tteokbokki|spicy rice cakes|🌶️|떡볶이가 너무 매워요!|The tteokbokki is so spicy!
먹다|meokda|to eat|🍽️|뭐 먹을래요?|What will you eat?
마시다|masida|to drink|🥤|매일 물을 마셔요.|I drink water every day.
맵다|maepda|spicy|🔥|안 매워요?|Isn’t it spicy?
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
집|jip|house / home|🏠|집에 가요.|I’m going home.
방|bang|room|🚪|제 방은 작아요.|My room is small.
부엌|bueok|kitchen|🍳|부엌에서 요리해요.|I cook in the kitchen.
화장실|hwajangsil|bathroom / toilet|🚽|화장실이 어디예요?|Where is the bathroom?
창문|changmun|window|🪟|창문 좀 열어 주세요.|Please open the window.
문|mun|door|🚪|문을 닫아 주세요.|Please close the door.
책상|chaeksang|desk|🖥️|책상 위에 책이 있어요.|There’s a book on the desk.
의자|uija|chair|🪑|의자에 앉으세요.|Please sit on the chair.
침대|chimdae|bed|🛏️|침대가 편해요.|The bed is comfortable.
열쇠|yeolsoe|key|🔑|열쇠를 잃어버렸어요.|I lost my key.
텔레비전|tellebijeon|television|📺|텔레비전을 봐요.|I watch television.
살다|salda|to live|🏡|서울에 살아요.|I live in Seoul.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
역|yeok|station|🚉|역이 가까워요.|The station is close.
지하철|jihacheol|subway|🚇|지하철로 가요.|I go by subway.
가게|gage|shop|🏪|이 가게는 싸요.|This shop is cheap.
편의점|pyeonuijeom|convenience store|🏪|편의점은 이십사 시간 열어요.|The convenience store is open 24 hours.
병원|byeongwon|hospital|🏥|병원에 가야 해요.|I have to go to the hospital.
은행|eunhaeng|bank|🏦|은행은 아홉 시에 열어요.|The bank opens at nine.
공원|gongwon|park|🌳|공원에서 산책해요.|I take a walk in the park.
시장|sijang|market|🧺|시장에서 과일을 샀어요.|I bought fruit at the market.
길|gil|road / way|🛣️|길을 잃었어요.|I’m lost.
오른쪽|oreunjjok|right|➡️|오른쪽으로 가세요.|Go to the right.
왼쪽|oenjjok|left|⬅️|역은 왼쪽에 있어요.|The station is on the left.
똑바로|ttokbaro|straight|⬆️|똑바로 가세요.|Go straight.
어디예요?|eodiyeyo?|where is it?|📍|공원이 어디예요?|Where is the park?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
빨간색|ppalgansaek|red|🔴|빨간색 차예요.|It’s a red car.
파란색|paransaek|blue|🔵|하늘이 파래요.|The sky is blue.
하얀색|hayansaek|white|⚪|하얀 고양이.|A white cat.
검은색|geomeunsaek|black|⚫|검은색 가방이에요.|It’s a black bag.
노란색|noransaek|yellow|🟡|노란 꽃이에요.|It’s a yellow flower.
크다|keuda|big|🐘|집이 커요.|The house is big.
작다|jakda|small|🐭|강아지가 작아요.|The puppy is small.
좋다|jota|good|👍|날씨가 좋아요.|The weather is good.
나쁘다|nappeuda|bad|👎|기분이 나빠요.|I’m in a bad mood.
비싸다|bissada|expensive|💎|이 시계는 비싸요.|This watch is expensive.
싸다|ssada|cheap|🏷️|여기는 싸요.|It’s cheap here.
예쁘다|yeppeuda|pretty|🌸|정말 예뻐요!|It’s really pretty!
`),
  t('A1', 'weather', '🌦️', 'Weather and seasons', 'Météo et saisons', `
날씨|nalssi|weather|🌤️|날씨가 어때요?|How’s the weather?
비|bi|rain|🌧️|비가 와요.|It’s raining.
눈|nun|snow / eye|❄️|눈이 와요.|It’s snowing.
바람|baram|wind|🌬️|바람이 많이 불어요.|It’s very windy.
덥다|deopda|hot (weather)|🥵|여름은 너무 더워요.|Summer is too hot.
춥다|chupda|cold (weather)|🥶|오늘 추워요.|It’s cold today.
봄|bom|spring|🌸|봄에는 벚꽃이 피어요.|Cherry blossoms bloom in spring.
여름|yeoreum|summer|🏖️|여름에 바다에 가요.|I go to the sea in summer.
가을|gaeul|autumn|🍁|가을 단풍이 예뻐요.|The autumn leaves are pretty.
겨울|gyeoul|winter|☃️|겨울에 스키를 타요.|I ski in winter.
우산|usan|umbrella|☂️|우산 가져가세요.|Take an umbrella.
맑다|makda|clear / sunny|☀️|내일은 맑아요.|Tomorrow will be clear.
`),
  // ---------- A2 ----------
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
여행|yeohaeng|trip|🧳|제주도로 여행 가요.|I’m taking a trip to Jeju.
비행기|bihaenggi|plane|✈️|비행기로 가요.|I’m going by plane.
공항|gonghang|airport|🛫|공항까지 버스를 타요.|I take the bus to the airport.
기차|gicha|train|🚆|기차표를 샀어요.|I bought a train ticket.
표|pyo|ticket|🎫|표 두 장 주세요.|Two tickets, please.
호텔|hotel|hotel|🏨|호텔을 예약했어요.|I booked a hotel.
여권|yeogwon|passport|🛂|여권을 잊지 마세요.|Don’t forget your passport.
가방|gabang|bag|🧳|가방이 무거워요.|The bag is heavy.
지도|jido|map|🗺️|지도를 보여 주세요.|Please show me the map.
바다|bada|sea|🌊|바다가 정말 예뻐요.|The sea is really beautiful.
산|san|mountain|⛰️|주말에 산에 가요.|I go to the mountains at the weekend.
사진|sajin|photo|📷|사진 찍어 주세요.|Please take a photo.
기념품|ginyeompum|souvenir|🎁|기념품을 샀어요.|I bought a souvenir.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
쇼핑|syoping|shopping|🛍️|명동에서 쇼핑해요.|I go shopping in Myeongdong.
사다|sada|to buy|🛒|새 옷을 샀어요.|I bought new clothes.
옷|ot|clothes|👕|이 옷이 잘 어울려요.|These clothes suit you.
신발|sinbal|shoes|👟|신발을 벗으세요.|Please take off your shoes.
사이즈|saijeu|size|📏|더 큰 사이즈 있어요?|Do you have a bigger size?
입어 보다|ibeo boda|to try on|🪞|입어 봐도 돼요?|Can I try it on?
카드|kadeu|card|💳|카드 돼요?|Do you take cards?
현금|hyeongeum|cash|💵|현금으로 낼게요.|I’ll pay in cash.
할인|harin|discount|🏷️|할인돼요?|Is there a discount?
영수증|yeongsujeung|receipt|🧾|영수증 주세요.|The receipt, please.
봉투|bongtu|bag (shop)|🛍️|봉투 필요하세요?|Do you need a bag?
선물|seonmul|present|🎁|엄마 선물이에요.|It’s a present for mum.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
아프다|apeuda|to be sick / to hurt|🤒|어디가 아파요?|Where does it hurt?
감기|gamgi|cold|🤧|감기에 걸렸어요.|I caught a cold.
열|yeol|fever|🌡️|열이 나요.|I have a fever.
머리|meori|head|🤕|머리가 아파요.|I have a headache.
배|bae|stomach|🤢|배가 아파요.|I have a stomach ache.
목|mok|throat / neck|🗣️|목이 아파요.|I have a sore throat.
약|yak|medicine|💊|약을 드세요.|Please take the medicine.
약국|yakguk|pharmacy|🏪|약국이 어디예요?|Where is the pharmacy?
의사|uisa|doctor|👨‍⚕️|의사 선생님을 만났어요.|I saw the doctor.
피곤하다|pigonhada|to be tired|🥱|오늘 너무 피곤해요.|I’m so tired today.
쉬다|swida|to rest|🛋️|푹 쉬세요.|Get plenty of rest.
건강|geongang|health|💪|건강이 제일 중요해요.|Health is the most important thing.
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
업무|eommu|work tasks|💼|업무가 많아요.|I have a lot of work to do.
회사|hoesa|company|🏢|회사는 강남에 있어요.|The company is in Gangnam.
회의|hoeui|meeting|👥|회의는 세 시예요.|The meeting is at three.
동료|dongnyo|colleague|🤝|동료들이 친절해요.|My colleagues are kind.
사장님|sajangnim|boss / owner|😎|사장님이 바빠요.|The boss is busy.
이메일|imeil|email|📧|이메일 보낼게요.|I’ll send an email.
야근|yageun|working late|🌙|오늘 야근해요.|I’m working late tonight.
월급|wolgeup|monthly salary|💵|월급날이에요!|It’s payday!
휴가|hyuga|holiday / leave|🏖️|다음 주에 휴가예요.|I’m on holiday next week.
일하다|ilhada|to work|🧑‍💻|은행에서 일해요.|I work at a bank.
바쁘다|bappeuda|busy|🏃|이번 주는 바빠요.|This week is busy.
면접|myeonjeop|job interview|🤝|내일 면접이 있어요.|I have a job interview tomorrow.
`),
  t('A2', 'hobbies', '🎤', 'Free time', 'Les loisirs', `
취미|chwimi|hobby|🎨|취미가 뭐예요?|What’s your hobby?
영화|yeonghwa|film|🎬|영화 보러 갈래요?|Want to go see a film?
음악|eumak|music|🎵|음악을 들어요.|I listen to music.
노래방|noraebang|karaoke room|🎤|노래방에 가요!|Let’s go to karaoke!
책|chaek|book|📕|책 읽는 걸 좋아해요.|I like reading books.
운동|undong|exercise|🏋️|매일 운동해요.|I exercise every day.
축구|chukgu|football|⚽|축구를 해요.|I play football.
게임|geim|video game|🎮|게임을 해요.|I play video games.
요리|yori|cooking|👩‍🍳|요리를 잘해요.|I’m good at cooking.
산책|sanchaek|walk|🚶|강아지랑 산책해요.|I walk the dog.
드라마|deurama|TV drama|📺|한국 드라마를 봐요.|I watch Korean dramas.
춤|chum|dance|💃|춤을 배워요.|I’m learning to dance.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
기쁘다|gippeuda|happy / glad|😊|만나서 기뻐요.|I’m glad to see you.
슬프다|seulpeuda|sad|😢|슬픈 영화였어요.|It was a sad film.
재미있다|jaemiitda|fun / interesting|🥳|정말 재미있어요!|It’s really fun!
무섭다|museopda|scary|😱|이 영화 무서워요.|This film is scary.
외롭다|oeropda|lonely|🥺|혼자라서 외로워요.|I’m lonely because I’m alone.
화나다|hwanada|to be angry|😠|왜 화났어요?|Why are you angry?
걱정|geokjeong|worry|😟|걱정하지 마세요.|Don’t worry.
놀라다|nollada|to be surprised|😮|깜짝 놀랐어요!|That surprised me!
좋아하다|joahada|to like|❤️|고양이를 좋아해요.|I like cats.
싫어하다|sileohada|to dislike|👎|비 오는 날을 싫어해요.|I dislike rainy days.
심심하다|simsimhada|to be bored|🥱|너무 심심해요.|I’m so bored.
행복하다|haengbokhada|to be happy|🥰|지금 정말 행복해요.|I’m really happy right now.
`),
  // ---------- B1 ----------
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
생각하다|saenggakhada|to think|💭|좋다고 생각해요.|I think it’s good.
의견|uigyeon|opinion|💬|당신의 의견은 뭐예요?|What’s your opinion?
찬성|chanseong|agreement|👍|그 계획에 찬성해요.|I agree with that plan.
반대|bandae|opposition|👎|저는 반대해요.|I’m against it.
그래서|geuraeseo|so / therefore|➡️|비가 와서 집에 있었어요.|It rained, so I stayed home.
하지만|hajiman|but|↔️|비싸요. 하지만 좋아요.|It’s expensive. But it’s good.
이유|iyu|reason|🧩|이유가 뭐예요?|What’s the reason?
문제|munje|problem|❗|문제없어요.|No problem.
아마|ama|probably|🤷|아마 괜찮을 거예요.|It’ll probably be fine.
꼭|kkok|definitely|💯|꼭 갈게요!|I’ll definitely go!
물론|mullon|of course|✅|물론이죠!|Of course!
사실|sasil|actually / fact|📌|사실 잘 몰라요.|Actually, I don’t really know.
`),
  t('B1', 'society', '🏙️', 'Life in Korea', 'La vie en Corée', `
사회|sahoe|society|🌐|한국 사회는 빨리 변해요.|Korean society changes fast.
문화|munhwa|culture|🎎|한국 문화에 관심이 있어요.|I’m interested in Korean culture.
전통|jeontong|tradition|🏮|전통을 지켜요.|We keep the traditions.
명절|myeongjeol|traditional holiday|🎑|명절에 가족을 만나요.|I see my family at the holidays.
한복|hanbok|hanbok (traditional dress)|👘|한복을 입어 봤어요.|I tried on a hanbok.
예의|yeui|manners|🙇|예의가 바른 사람이에요.|He’s a well-mannered person.
환경|hwangyeong|environment|🌍|환경을 보호해야 해요.|We must protect the environment.
재활용|jaehwaryong|recycling|♻️|병을 재활용해요.|I recycle bottles.
쓰레기|sseuregi|rubbish|🗑️|쓰레기를 분리해 주세요.|Please sort the rubbish.
뉴스|nyuseu|news|📰|오늘 뉴스 봤어요?|Did you see the news today?
인터넷|inteonet|internet|🌐|인터넷으로 찾아봤어요.|I looked it up online.
스마트폰|seumateupon|smartphone|📱|스마트폰을 잃어버렸어요.|I lost my smartphone.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'ko-g-ieyo', level: 'A1', icon: '🧩', en: 'Topic 은/는 and 이에요/예요', fr: 'Thème 은/는 et 이에요/예요',
    cards: [
      { en: '은/는 marks the topic: 은 after a consonant, 는 after a vowel. 이에요/예요 means "is": 이에요 after a consonant, 예요 after a vowel.', fr: '은/는 marque le thème ; 이에요/예요 = être.', examples: [['저는 학생이에요.', 'I’m a student.', 'I’m a student.'], ['이건 커피예요.', 'This is coffee.', 'This is coffee.']] },
      { en: 'Negative: 이/가 아니에요 = is not.', fr: 'Négation : 이/가 아니에요.', examples: [['저는 선생님이 아니에요.', 'I’m not a teacher.', 'I’m not a teacher.']] },
    ],
    drills: [
      { text: '저___ 지민이에요.', answer: '는', wrong: ['은', '를'], en: 'I’m Jimin.', fr: 'I’m Jimin.' },
      { text: '이건 커피___.', answer: '예요', wrong: ['이에요', '은'], en: 'This is coffee.', fr: 'This is coffee.' },
      { text: '저는 학생___.', answer: '이에요', wrong: ['예요', '는'], en: 'I’m a student.', fr: 'I’m a student.' },
      { text: '선생님___ 친절해요.', answer: '은', wrong: ['는', '를'], en: 'The teacher is kind.', fr: 'The teacher is kind.' },
    ],
  },
  {
    id: 'ko-g-object', level: 'A1', icon: '🔗', en: 'Object 을/를 and place 에/에서', fr: 'Objet 을/를, lieu 에/에서',
    cards: [
      { en: '을/를 marks the object: 을 after a consonant, 를 after a vowel. 밥을 먹어요, 커피를 마셔요.', fr: '을/를 marque l’objet.', examples: [['커피를 마셔요.', 'I drink coffee.', 'I drink coffee.']] },
      { en: '에 = to / at (destination, time). 에서 = at (where an action happens).', fr: '에 : destination, heure. 에서 : lieu de l’action.', examples: [['학교에 가요.', 'I go to school.', 'I go to school.'], ['카페에서 공부해요.', 'I study at a café.', 'I study at a café.']] },
    ],
    drills: [
      { text: '밥___ 먹어요.', answer: '을', wrong: ['를', '에'], en: 'I eat rice.', fr: 'I eat rice.' },
      { text: '커피___ 마셔요.', answer: '를', wrong: ['을', '에서'], en: 'I drink coffee.', fr: 'I drink coffee.' },
      { text: '서울___ 가요.', answer: '에', wrong: ['에서', '를'], en: 'I go to Seoul.', fr: 'I go to Seoul.' },
      { text: '도서관___ 공부해요.', answer: '에서', wrong: ['에', '을'], en: 'I study at the library.', fr: 'I study at the library.' },
    ],
  },
  {
    id: 'ko-g-ayo', level: 'A1', icon: '🔁', en: 'Polite present: 아요/어요', fr: 'Présent poli : 아요/어요',
    cards: [
      { en: 'Polite verbs end in 요. If the stem’s last vowel is ㅏ or ㅗ, add 아요 (가다 → 가요); otherwise 어요 (먹다 → 먹어요). 하다 → 해요.', fr: '아요 après ㅏ/ㅗ, sinon 어요 ; 하다 → 해요.', examples: [['학교에 가요.', 'I go to school.', 'I go to school.'], ['공부해요.', 'I study.', 'I study.']] },
      { en: 'Negative: put 안 before the verb: 안 가요 (I don’t go).', fr: 'Négation : 안 + verbe.', examples: [['고기를 안 먹어요.', 'I don’t eat meat.', 'I don’t eat meat.']] },
    ],
    drills: [
      { text: '저는 매일 운동___.', answer: '해요', wrong: ['하요', '해어요'], en: 'I exercise every day.', fr: 'I exercise every day.' },
      { text: '친구를 만___.', answer: '나요', wrong: ['나어요', '나해요'], en: 'I meet a friend.', fr: 'I meet a friend.' },
      { text: '책을 읽___.', answer: '어요', wrong: ['아요', '해요'], en: 'I read a book.', fr: 'I read a book.' },
      { text: '커피를 ___ 마셔요.', answer: '안', wrong: ['못', '을'], en: 'I don’t drink coffee.', fr: 'I don’t drink coffee.' },
    ],
  },
  {
    id: 'ko-g-past', level: 'A2', icon: '⏮️', en: 'Past tense: 았어요/었어요', fr: 'Passé : 았어요/었어요',
    cards: [
      { en: 'Past: stems with ㅏ/ㅗ take 았어요 (가다 → 갔어요), others 었어요 (먹다 → 먹었어요). 하다 → 했어요.', fr: 'Passé : 았어요 / 었어요 / 했어요.', examples: [['어제 영화를 봤어요.', 'I saw a film yesterday.', 'I saw a film yesterday.'], ['숙제를 했어요.', 'I did my homework.', 'I did my homework.']] },
    ],
    drills: [
      { text: '어제 친구를 만났___.', answer: '어요', wrong: ['아요', '해요'], en: 'I met a friend yesterday.', fr: 'I met a friend yesterday.' },
      { text: '아침을 먹___.', answer: '었어요', wrong: ['았어요', '했어요'], en: 'I had breakfast.', fr: 'I had breakfast.' },
      { text: '주말에 청소___.', answer: '했어요', wrong: ['하었어요', '해요'], en: 'I cleaned at the weekend.', fr: 'I cleaned at the weekend.' },
    ],
  },
  {
    id: 'ko-g-want', level: 'A2', icon: '🌠', en: 'Wanting and asking: 고 싶어요, 주세요', fr: 'Vouloir et demander',
    cards: [
      { en: 'Stem + 고 싶어요 = I want to: 가고 싶어요 (I want to go).', fr: 'Radical + 고 싶어요 = vouloir.', examples: [['한국에 가고 싶어요.', 'I want to go to Korea.', 'I want to go to Korea.']] },
      { en: 'Verb in 아/어 form + 주세요 = please do it for me: 도와 주세요 (please help me).', fr: '아/어 + 주세요 = faites-le pour moi.', examples: [['천천히 말해 주세요.', 'Please speak slowly.', 'Please speak slowly.']] },
    ],
    drills: [
      { text: '비빔밥을 먹고 ___.', answer: '싶어요', wrong: ['주세요', '했어요'], en: 'I want to eat bibimbap.', fr: 'I want to eat bibimbap.' },
      { text: '사진 좀 찍어 ___.', answer: '주세요', wrong: ['싶어요', '봐요'], en: 'Please take a photo.', fr: 'Please take a photo.' },
      { text: '제주도에 가___ 싶어요.', answer: '고', wrong: ['서', '요'], en: 'I want to go to Jeju.', fr: 'I want to go to Jeju.' },
    ],
  },
  {
    id: 'ko-g-future', level: 'B1', icon: '➡️', en: 'Future and plans: (으)ㄹ 거예요', fr: 'Futur : (으)ㄹ 거예요',
    cards: [
      { en: 'Stem + (으)ㄹ 거예요 = will / going to: 갈 거예요 (I will go), 먹을 거예요 (I will eat).', fr: 'Radical + (으)ㄹ 거예요 = futur.', examples: [['내일 친구를 만날 거예요.', 'I’ll meet a friend tomorrow.', 'I’ll meet a friend tomorrow.']] },
      { en: 'With 아마 it means "probably": 아마 비가 올 거예요.', fr: 'Avec 아마 : probablement.', examples: [['아마 비가 올 거예요.', 'It’ll probably rain.', 'It’ll probably rain.']] },
    ],
    drills: [
      { text: '내년에 한국에 갈 ___.', answer: '거예요', wrong: ['싶어요', '했어요'], en: 'I’ll go to Korea next year.', fr: 'I’ll go to Korea next year.' },
      { text: '저녁에 불고기를 먹___ 거예요.', answer: '을', wrong: ['ㄹ', '고'], en: 'I’ll eat bulgogi tonight.', fr: 'I’ll eat bulgogi tonight.' },
      { text: '___ 비가 올 거예요.', answer: '아마', wrong: ['꼭', '안'], en: 'It’ll probably rain.', fr: 'It’ll probably rain.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'ko-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: '어서 오세요! 뭐 드릴까요?', en: 'Welcome! What can I get you?', fr: 'Welcome! What can I get you?' },
      { who: 'B', text: '아이스 아메리카노 한 잔 주세요.', en: 'One iced americano, please.', fr: 'One iced americano, please.', wrong: ['영수증이 어디예요?', '저는 아메리카노예요.'] },
      { who: 'A', text: '드시고 가세요?', en: 'Will you have it here?', fr: 'Will you have it here?' },
      { who: 'B', text: '아니요, 가져갈게요.', en: 'No, I’ll take it away.', fr: 'No, I’ll take it away.', wrong: ['네, 열 살이에요.', '아니요, 추워요.'] },
      { who: 'A', text: '사천오백 원입니다.', en: 'That’s 4,500 won.', fr: 'That’s 4,500 won.' },
      { who: 'B', text: '카드 돼요?', en: 'Can I pay by card?', fr: 'Can I pay by card?', wrong: ['안녕히 주무세요.', '화장실 돼요?'] },
    ],
  },
  {
    id: 'ko-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: '실례합니다, 지하철역이 어디예요?', en: 'Excuse me, where is the subway station?', fr: 'Excuse me, where is the subway station?', wrong: ['실례합니다, 지하철역이 얼마예요?', '실례합니다, 저는 역이에요.'] },
      { who: 'A', text: '똑바로 가서 오른쪽으로 가세요.', en: 'Go straight, then turn right.', fr: 'Go straight, then turn right.' },
      { who: 'B', text: '멀어요?', en: 'Is it far?', fr: 'Is it far?', wrong: ['맛있어요?', '추워요?'] },
      { who: 'A', text: '아니요, 걸어서 오 분이에요.', en: 'No, it’s five minutes on foot.', fr: 'No, it’s five minutes on foot.' },
      { who: 'B', text: '감사합니다!', en: 'Thank you!', fr: 'Thank you!', wrong: ['잘 먹겠습니다!', '안녕히 주무세요!'] },
    ],
  },
  {
    id: 'ko-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: '안녕하세요. 예약하셨어요?', en: 'Hello. Do you have a booking?', fr: 'Hello. Do you have a booking?' },
      { who: 'B', text: '네, 스미스로 이 박 예약했어요.', en: 'Yes, two nights under Smith.', fr: 'Yes, two nights under Smith.', wrong: ['네, 열이 나요.', '아메리카노 주세요.'] },
      { who: 'A', text: '여권 보여 주시겠어요?', en: 'May I see your passport?', fr: 'May I see your passport?' },
      { who: 'B', text: '여기 있어요. 아침은 몇 시부터예요?', en: 'Here it is. What time is breakfast from?', fr: 'Here it is. What time is breakfast from?', wrong: ['여기 있어요. 역은 여권이에요?', '아니요, 고양이를 좋아해요.'] },
      { who: 'A', text: '일곱 시부터 열 시까지예요. 방은 삼 층이에요.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: '알겠습니다. 감사합니다.', en: 'Got it. Thank you.', fr: 'Got it. Thank you.', wrong: ['모르겠어요. 안녕히 가세요.', '잘 먹었습니다.'] },
    ],
  },
  {
    id: 'ko-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: '어디가 아프세요?', en: 'Where does it hurt?', fr: 'Where does it hurt?' },
      { who: 'B', text: '머리가 아프고 열이 나요.', en: 'I have a headache and a fever.', fr: 'I have a headache and a fever.', wrong: ['떡볶이를 먹고 싶어요.', '호텔을 예약했어요.'] },
      { who: 'A', text: '언제부터 아팠어요?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: '어제부터요.', en: 'Since yesterday.', fr: 'Since yesterday.', wrong: ['사천 원이에요.', '역 앞이에요.'] },
      { who: 'A', text: '감기예요. 이 약을 드시고 푹 쉬세요.', en: 'It’s a cold. Take this medicine and get plenty of rest.', fr: 'It’s a cold. Take this medicine and get plenty of rest.' },
      { who: 'B', text: '감사합니다, 선생님.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['어서 오세요, 선생님.', '잘 먹겠습니다.'] },
    ],
  },
  {
    id: 'ko-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: '이번 주말에 뭐 할 거예요?', en: 'What are you doing this weekend?', fr: 'What are you doing this weekend?' },
      { who: 'B', text: '아직 계획 없어요. 왜요?', en: 'No plans yet. Why?', fr: 'No plans yet. Why?', wrong: ['어제 라면을 먹었어요.', '저는 스무 살이에요.'] },
      { who: 'A', text: '한강에서 자전거 탈래요?', en: 'Want to go cycling by the Han River?', fr: 'Want to go cycling by the Han River?' },
      { who: 'B', text: '좋아요! 날씨가 좋으면 꼭 갈게요.', en: 'Great! If the weather’s nice I’ll definitely come.', fr: 'Great! If the weather’s nice I’ll definitely come.', wrong: ['좋아요! 어제 추웠어요.', '아니요, 신발이 없어요.'] },
      { who: 'A', text: '그럼 열 시에 역에서 만나요.', en: 'Then let’s meet at the station at ten.', fr: 'Then let’s meet at the station at ten.' },
      { who: 'B', text: '네, 김밥 싸 갈게요.', en: 'OK, I’ll bring some gimbap.', fr: 'OK, I’ll bring some gimbap.', wrong: ['네, 역을 먹을게요.', '아니요, 어제 갔어요.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'ko-s-market', level: 'A1', icon: '🧺', en: 'Jimin’s Saturday', fr: 'Le samedi de Jimin',
    sentences: [
      ['지민은 서울에 살아요.', 'Jimin lives in Seoul.', 'Jimin lives in Seoul.'],
      ['토요일 아침에 시장에 가요.', 'On Saturday morning she goes to the market.', 'On Saturday morning she goes to the market.'],
      ['과일하고 채소를 사요.', 'She buys fruit and vegetables.', 'She buys fruit and vegetables.'],
      ['그리고 민수 씨 카페에 가요.', 'Then she goes to Minsu’s café.', 'Then she goes to Minsu’s café.'],
      ['민수 씨가 케이크를 줬어요.', 'Minsu gave her a cake.', 'Minsu gave her a cake.'],
      ['지민은 정말 기뻐요.', 'Jimin is really happy.', 'Jimin is really happy.'],
    ],
    glossary: { 지민은: ['Jimin (topic)', 'Jimin (topic)'], 서울에: ['in Seoul', 'in Seoul'], 살아요: ['lives', 'lives'], 토요일: ['Saturday', 'Saturday'], 시장에: ['to the market', 'to the market'], 과일하고: ['fruit and', 'fruit and'], 채소를: ['vegetables (object)', 'vegetables (object)'], 사요: ['buys', 'buys'], 줬어요: ['gave', 'gave'], 기뻐요: ['is glad', 'is glad'] },
    questions: [
      { en: 'Where does Jimin live?', fr: 'Where does Jimin live?', answer: '서울', wrong: ['부산', '제주'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: '과일하고 채소', wrong: ['빵하고 우유', '옷하고 신발'] },
      { en: 'What did Minsu give her?', fr: 'What did Minsu give her?', answer: '케이크', wrong: ['커피', '사과'] },
    ],
  },
  {
    id: 'ko-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['준호는 여덟 시 기차를 타야 했어요.', 'Junho had to catch the eight o’clock train.', 'Junho had to catch the eight o’clock train.'],
      ['그런데 일곱 시 반에 일어났어요.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['급하게 택시를 타고 역에 갔어요.', 'He hurried to the station by taxi.', 'He hurried to the station by taxi.'],
      ['역에 도착했을 때 여덟 시 이 분이었어요.', 'When he arrived it was two minutes past eight.', 'When he arrived it was two minutes past eight.'],
      ['기차는 벌써 떠났어요.', 'The train had already left.', 'The train had already left.'],
      ['다음 기차에서 김밥을 먹으면서 갔어요.', 'He took the next train, eating gimbap on the way.', 'He took the next train, eating gimbap on the way.'],
    ],
    glossary: { 기차를: ['train (object)', 'train (object)'], 일어났어요: ['woke up', 'woke up'], 급하게: ['in a hurry', 'in a hurry'], 택시를: ['taxi (object)', 'taxi (object)'], 도착했을: ['arrived', 'arrived'], 벌써: ['already', 'already'], 떠났어요: ['left', 'left'], 다음: ['next', 'next'] },
    questions: [
      { en: 'What time did Junho wake up?', fr: 'What time did Junho wake up?', answer: '일곱 시 반', wrong: ['여덟 시', '여섯 시'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: '택시', wrong: ['자전거', '버스'] },
      { en: 'What did he eat on the next train?', fr: 'What did he eat on the next train?', answer: '김밥', wrong: ['라면', '빵'] },
    ],
  },
  {
    id: 'ko-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['이 년 전에 아파트 주민들이 아이디어를 냈어요.', 'Two years ago, the residents of the building had an idea.', 'Two years ago, the residents of the building had an idea.'],
      ['옥상은 아무도 쓰지 않았어요.', 'Nobody used the roof.', 'Nobody used the roof.'],
      ['박 할아버지가 채소를 키우자고 했어요.', 'Grandpa Park suggested growing vegetables.', 'Grandpa Park suggested growing vegetables.'],
      ['처음에는 반대하는 사람도 있었어요.', 'At first, some people were against it.', 'At first, some people were against it.'],
      ['지금은 토마토, 깻잎, 딸기가 자라요.', 'Now tomatoes, perilla leaves and strawberries grow there.', 'Now tomatoes, perilla leaves and strawberries grow there.'],
      ['매주 일요일에 모두 같이 밥을 먹어요.', 'Every Sunday everyone eats together.', 'Every Sunday everyone eats together.'],
    ],
    glossary: { 주민들이: ['residents', 'residents'], 옥상은: ['the roof', 'the roof'], 아무도: ['nobody', 'nobody'], 키우자고: ['let’s grow', 'let’s grow'], 처음에는: ['at first', 'at first'], 반대하는: ['opposing', 'opposing'], 자라요: ['grow', 'grow'], 같이: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: '박 할아버지', wrong: ['지민', '준호'] },
      { en: 'What grows there now?', fr: 'What grows there now?', answer: '토마토, 깻잎, 딸기', wrong: ['사과하고 배', '쌀'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: '매주 일요일', wrong: ['매주 월요일', '매일'] },
    ],
  },
];

export const KOREAN_FULL: FullCourse = { topics, grammar, dialogues, stories };
