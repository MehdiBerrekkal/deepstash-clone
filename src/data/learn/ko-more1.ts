import type { Level, Topic, Word } from '@/data/learn/full';

/** Korean, pack 1: everyday verbs, adjectives, body, places, animals, expressions, time words, food, studies. Lines are "word|romanization|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
가다|gada|to go|🚶|학교에 가요.|I go to school.
오다|oda|to come|👋|내일 와요?|Are you coming tomorrow?
보다|boda|to see / watch|👀|영화를 봐요.|I watch a film.
듣다|deutda|to listen|🎧|음악을 들어요.|I listen to music.
말하다|malhada|to speak|🗣️|한국어로 말해요.|I speak in Korean.
읽다|ikda|to read|📖|매일 책을 읽어요.|I read a book every day.
쓰다|sseuda|to write|✍️|편지를 써요.|I write a letter.
자다|jada|to sleep|😴|열한 시에 자요.|I go to bed at eleven.
일어나다|ireonada|to get up|⏰|여섯 시에 일어나요.|I get up at six.
하다|hada|to do|🛠️|숙제를 해요.|I do my homework.
만나다|mannada|to meet|🤝|친구를 만나요.|I meet a friend.
기다리다|gidarida|to wait|⏳|잠깐만 기다려 주세요.|Please wait a moment.
알다|alda|to know|🧠|알아요.|I know.
모르다|moreuda|not to know|🤷|잘 몰라요.|I don’t really know.
걷다|geotda|to walk|🚶|역까지 걸어요.|I walk to the station.
뛰다|ttwida|to run|🏃|공원에서 뛰어요.|I run in the park.
만들다|mandeulda|to make|🧑‍🍳|케이크를 만들어요.|I make a cake.
열다|yeolda|to open|🔓|창문을 열어요.|I open the window.
닫다|datda|to close|🔒|문을 닫아요.|I close the door.
배우다|baeuda|to learn|🌱|한국어를 배워요.|I’m learning Korean.
`),
  t('A1', 'adjectives', '✨', 'Describing things', 'Décrire les choses', `
빠르다|ppareuda|fast|🚀|KTX는 빨라요.|The KTX train is fast.
느리다|neurida|slow|🐌|인터넷이 느려요.|The internet is slow.
어렵다|eoryeopda|difficult|🧗|한국어는 어려워요.|Korean is difficult.
쉽다|swipda|easy|👌|이 문제는 쉬워요.|This question is easy.
길다|gilda|long|📏|머리가 길어요.|Her hair is long.
짧다|jjalda|short|📐|영화가 짧아요.|The film is short.
무겁다|mugeopda|heavy|🏋️|가방이 무거워요.|The bag is heavy.
가볍다|gabyeopda|light|🪶|코트가 가벼워요.|The coat is light.
조용하다|joyonghada|quiet|🤫|도서관은 조용해요.|The library is quiet.
시끄럽다|sikkeureopda|noisy|🔊|거리가 시끄러워요.|The street is noisy.
달다|dalda|sweet|🍬|케이크가 달아요.|The cake is sweet.
짜다|jjada|salty|🧂|국이 짜요.|The soup is salty.
많다|manta|many / a lot|📦|사람이 많아요.|There are lots of people.
적다|jeokda|few / little|🤏|시간이 적어요.|There’s little time.
`),
  t('A1', 'body', '🧍', 'The body', 'Le corps', `
귀|gwi|ear|👂|귀가 아파요.|My ear hurts.
코|ko|nose|👃|코가 막혔어요.|My nose is blocked.
입|ip|mouth|👄|입을 벌리세요.|Open your mouth.
손|son|hand|✋|손을 씻어요.|I wash my hands.
발|bal|foot|🦶|발이 아파요.|My foot hurts.
다리|dari|leg|🦵|다리가 길어요.|He has long legs.
얼굴|eolgul|face|🙂|얼굴을 씻어요.|I wash my face.
치아|chia|tooth (formal)|🦷|치아가 건강해요.|My teeth are healthy.
허리|heori|lower back / waist|🧍|허리가 아파요.|My lower back hurts.
`),
  t('A1', 'places2', '🗺️', 'More places', 'Encore des lieux', `
학교|hakgyo|school|🏫|학교가 가까워요.|The school is close.
도서관|doseogwan|library|📚|도서관에서 공부해요.|I study at the library.
미술관|misulgwan|art gallery|🖼️|미술관에 가요.|I’m going to the art gallery.
식당|sikdang|restaurant|🍽️|이 식당은 맛있어요.|This restaurant is good.
마트|mateu|supermarket|🛒|마트에서 장을 봐요.|I do the shopping at the supermarket.
버스|beoseu|bus|🚌|버스를 기다려요.|I wait for the bus.
택시|taeksi|taxi|🚕|택시를 타요.|I take a taxi.
계단|gyedan|stairs|🪜|계단으로 올라가요.|I go up the stairs.
엘리베이터|ellibeiteo|lift|🛗|엘리베이터가 어디예요?|Where is the lift?
카페|kape|café|☕|카페에서 친구를 만나요.|I meet a friend at a café.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
강아지|gangaji|puppy / dog|🐕|강아지가 귀여워요.|The puppy is cute.
고양이|goyangi|cat|🐈|고양이가 자고 있어요.|The cat is sleeping.
새|sae|bird|🐦|새가 노래해요.|A bird is singing.
말|mal|horse|🐎|말이 빨라요.|The horse is fast.
소|so|cow|🐄|소가 풀을 먹어요.|The cow eats grass.
돼지|dwaeji|pig|🐖|돼지가 자요.|The pig is sleeping.
토끼|tokki|rabbit|🐇|토끼가 당근을 먹어요.|The rabbit eats a carrot.
곰|gom|bear|🐻|곰은 꿀을 좋아해요.|Bears like honey.
호랑이|horangi|tiger|🐯|호랑이는 무서워요.|Tigers are scary.
원숭이|wonsungi|monkey|🐒|원숭이가 바나나를 먹어요.|The monkey eats a banana.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
잘 먹겠습니다|jal meokgetseumnida|(said before eating)|🍽️|잘 먹겠습니다!|Let’s eat!
잘 먹었습니다|jal meogeotseumnida|thanks for the meal|🙏|잘 먹었습니다.|Thank you for the meal.
다녀오겠습니다|danyeoogetseumnida|I’m off (leaving home)|🚪|다녀오겠습니다!|I’m off!
다녀왔습니다|danyeowatseumnida|I’m back home|🏠|다녀왔습니다!|I’m home!
수고하셨습니다|sugohasyeotseumnida|thanks for your hard work|😮‍💨|오늘 수고하셨습니다.|Good work today.
화이팅|hwaiting|go for it!|💪|시험 화이팅!|Good luck with the exam!
축하해요|chukahaeyo|congratulations|🎉|생일 축하해요!|Happy birthday!
대박|daebak|awesome!|🤩|와, 대박!|Wow, awesome!
진짜요?|jinjjayo?|really?|😮|진짜요? 믿을 수 없어요!|Really? I can’t believe it!
그럼요|geureomyo|of course|✅|그럼요, 도와 드릴게요.|Of course, I’ll help you.
잠깐만요|jamkkanmanyo|just a moment|✋|잠깐만요!|Just a moment!
천천히|cheoncheonhi|slowly|🐢|천천히 말해 주세요.|Please speak slowly.
`),
  t('A2', 'time2', '⏱️', 'Time words', 'Mots du temps', `
매일|maeil|every day|📅|매일 한국어를 공부해요.|I study Korean every day.
다음 주|daeum ju|next week|➡️|다음 주에 부산에 가요.|Next week I’m going to Busan.
지난주|jinanju|last week|⬅️|지난주는 바빴어요.|Last week was busy.
내년|naenyeon|next year|🎆|내년에 한국에 가고 싶어요.|I want to go to Korea next year.
작년|jangnyeon|last year|🗓️|작년에 결혼했어요.|I got married last year.
항상|hangsang|always|♾️|항상 웃어요.|She always smiles.
가끔|gakkeum|sometimes|🔀|가끔 김치를 만들어요.|I sometimes make kimchi.
벌써|beolsseo|already|✔️|벌써 먹었어요.|I’ve already eaten.
아직|ajik|still / not yet|⌛|아직이에요.|Not yet.
나중에|najunge|later|⏭️|나중에 전화할게요.|I’ll call later.
빨리|ppalli|quickly|⚡|빨리 와요!|Come quickly!
`),
  t('A2', 'food2', '🍲', 'More food', 'Encore la cuisine', `
김밥|gimbap|gimbap (rice rolls)|🍙|김밥 한 줄 주세요.|One gimbap roll, please.
냉면|naengmyeon|cold noodles|🍜|여름에는 냉면!|Cold noodles in summer!
삼겹살|samgyeopsal|grilled pork belly|🥓|삼겹살을 구워요.|We grill pork belly.
치킨|chikin|fried chicken|🍗|치킨하고 맥주!|Fried chicken and beer!
된장찌개|doenjang jjigae|soybean paste stew|🍲|엄마의 된장찌개.|Mum’s soybean stew.
두부|dubu|tofu|🥢|두부가 부드러워요.|The tofu is soft.
만두|mandu|dumplings|🥟|만두를 만들어요.|We make dumplings.
귤|gyul|mandarin orange|🍊|제주도 귤이 맛있어요.|Jeju mandarins are delicious.
딸기|ttalgi|strawberry|🍓|딸기 우유.|Strawberry milk.
젓가락|jeotgarak|chopsticks|🥢|젓가락으로 먹어요.|I eat with chopsticks.
숟가락|sutgarak|spoon|🥄|숟가락 주세요.|A spoon, please.
`),
  t('B1', 'studies', '🎓', 'Studies and work life', 'Études et vie active', `
대학교|daehakgyo|university|🏛️|대학교에서 경제를 공부해요.|I study economics at university.
시험|siheom|exam|📝|내일 시험이 있어요.|I have an exam tomorrow.
숙제|sukje|homework|📓|숙제가 많아요.|There’s a lot of homework.
공부|gongbu|study|📚|매일 공부해요.|I study every day.
졸업|joreop|graduation|🎓|내년에 졸업해요.|I graduate next year.
취업|chwieop|getting a job|💼|취업했어요!|I got a job!
경험|gyeongheom|experience|🧭|좋은 경험이었어요.|It was a good experience.
목표|mokpyo|goal|🎯|제 목표는 TOPIK 3급이에요.|My goal is TOPIK level 3.
노력|noryeok|effort|💪|노력이 중요해요.|Effort is important.
성공|seonggong|success|🏆|프로젝트가 성공했어요.|The project succeeded.
실패|silpae|failure|💥|실패에서 배워요.|I learn from failure.
계획|gyehoek|plan|📋|계획을 세워요.|I make a plan.
`),
];
