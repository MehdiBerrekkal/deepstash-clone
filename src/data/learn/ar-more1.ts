import type { Level, Topic, Word } from '@/data/learn/full';

/** Modern Standard Arabic, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "word|romanization|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `ar-${id}`, level, icon, en, fr, words: w6(block) });

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
ذهب|dhahaba|to go|🚶|أذهب إلى العمل بالحافلة.|I go to work by bus.
جاء|jāʾa|to come|👋|هل تأتي إلى الحفلة؟|Are you coming to the party?
فعل|faʿala|to do|🛠️|ماذا تفعل الليلة؟|What are you doing tonight?
رأى|raʾā|to see|👀|أرى البحر من النافذة.|I can see the sea from the window.
شاهد|shāhada|to watch|📺|نشاهد فيلما.|We’re watching a film.
سمع|samiʿa|to hear / listen|🎧|أسمع الموسيقى.|I listen to music.
تكلم|takallama|to speak|🗣️|هل تتكلم الإنجليزية؟|Do you speak English?
قال|qāla|to say|💬|ماذا قال؟|What did he say?
عرف|ʿarafa|to know|🧠|لا أعرف.|I don’t know.
أراد|arāda|to want|🙏|أريد قهوة.|I want coffee.
استطاع|istaṭāʿa|to be able|💪|هل تستطيع مساعدتي؟|Can you help me?
كتب|kataba|to write|✍️|أكتب رسالة.|I’m writing a letter.
قرأ|qaraʾa|to read|📖|أقرأ كل يوم.|I read every day.
نام|nāma|to sleep|😴|أنام ثماني ساعات.|I sleep eight hours.
انتظر|intaẓara|to wait|⏳|أنتظرك في المحطة.|I’ll wait for you at the station.
أخذ|akhadha|to take|✋|خذ المظلة.|Take the umbrella.
فتح|fataḥa|to open|🔓|افتح الباب.|Open the door.
أغلق|aghlaqa|to close|🔒|يغلق المحل في الثامنة.|The shop closes at eight.
بحث|baḥatha|to look for|🔍|أبحث عن مفاتيحي.|I’m looking for my keys.
فهم|fahima|to understand|💡|لا أفهم.|I don’t understand.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
استيقظ|istayqaẓa|to wake up|⏰|أستيقظ في السابعة.|I wake up at seven.
استحم|istaḥamma|to shower|🚿|أستحم في الصباح.|I shower in the morning.
لبس|labisa|to put on (clothes)|👔|ألبس بسرعة.|I get dressed quickly.
غداء|ghadāʾ|lunch|🥗|الغداء في الواحدة.|Lunch is at one.
عشاء|ʿashāʾ|dinner|🍝|العشاء جاهز!|Dinner is ready!
فرشاة الأسنان|furshāt al-asnān|toothbrush|🪥|نسيت فرشاة الأسنان.|I forgot my toothbrush.
خرج|kharaja|to go out|🚪|أخرج من البيت في الثامنة.|I leave home at eight.
رجع|rajaʿa|to come back|↩️|أرجع في السادسة.|I come back at six.
مبكرا|mubakkiran|early|🌅|وصلت مبكرا.|I arrived early.
متأخرا|mutaʾakhkhiran|late|🌆|وصلت متأخرا.|I arrived late.
دائما|dāʾiman|always|♾️|أشرب الشاي دائما.|I always drink tea.
أبدا|abadan|never|🚫|لا أدخن أبدا.|I never smoke.
أحيانا|aḥyānan|sometimes|🔀|أحيانا أذهب إلى النادي.|Sometimes I go to the gym.
عادة|ʿādatan|usually|📅|عادة أمشي إلى العمل.|I usually walk to work.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
ماذا|mādhā|what|❓|ماذا تريد؟|What do you want?
من|man|who|🕵️|من هذا؟|Who is this?
أين|ayna|where|📍|أين الحمام؟|Where is the bathroom?
متى|matā|when|📆|متى عيد ميلادك؟|When is your birthday?
لماذا|limādhā|why|🤔|لماذا أنت حزين؟|Why are you sad?
كيف|kayfa|how|🤷|كيف حالك؟|How are you?
كم|kam|how many / how much|🔢|كم الساعة؟|What time is it?
أي|ayy|which|☝️|أي فيلم تفضل؟|Which film do you prefer?
لأن|li-anna|because|💡|أدرس العربية لأني أحب الشعر.|I study Arabic because I love poetry.
من أين|min ayna|where from|🌍|من أين أنت؟|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
كلب|kalb|dog|🐕|عندي كلب صغير.|I have a small dog.
قطة|qiṭṭa|cat|🐈|القطة نائمة على الكنبة.|The cat is asleep on the sofa.
طائر|ṭāʾir|bird|🐦|الطائر يغني.|The bird is singing.
حصان|ḥiṣān|horse|🐎|الحصان سريع.|The horse is fast.
جمل|jamal|camel|🐪|الجمل يعيش في الصحراء.|The camel lives in the desert.
بقرة|baqara|cow|🐄|البقرة تعطي الحليب.|The cow gives milk.
خروف|kharūf|sheep|🐑|خروف أبيض.|A white sheep.
أسد|asad|lion|🦁|الأسد ملك الغابة.|The lion is king of the jungle.
فيل|fīl|elephant|🐘|الفيل كبير جدا.|The elephant is very big.
فراشة|farāsha|butterfly|🦋|فراشة على زهرة.|A butterfly on a flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
قميص|qamīṣ|shirt|👔|قميص أبيض للعمل.|A white shirt for work.
بنطلون|banṭalūn|trousers|👖|البنطلون طويل.|The trousers are long.
فستان|fustān|dress|👗|تلبس فستانا أحمر.|She’s wearing a red dress.
حذاء|ḥidhāʾ|shoes|👞|أحتاج إلى حذاء جديد.|I need new shoes.
معطف|miʿṭaf|coat|🧥|البس المعطف، الجو بارد.|Put on your coat, it’s cold.
قبعة|qubbaʿa|hat|👒|قبعة للشمس.|A sun hat.
وشاح|wishāḥ|scarf|🧣|وشاح من الصوف.|A wool scarf.
نظارة|naẓẓāra|glasses|👓|أين نظارتي؟|Where are my glasses?
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
الطقس|aṭ-ṭaqs|the weather|🌤️|كيف الطقس اليوم؟|How’s the weather today?
شمس|shams|sun|☀️|الشمس مشرقة.|The sun is shining.
مطر|maṭar|rain|🌧️|ينزل المطر.|It’s raining.
رياح|riyāḥ|wind|🌬️|الرياح قوية.|The wind is strong.
حار|ḥārr|hot|🥵|الجو حار في الصيف.|It’s hot in summer.
بارد|bārid|cold|🥶|الجو بارد اليوم.|It’s cold today.
غيمة|ghayma|cloud|☁️|السماء مليئة بالغيوم.|The sky is full of clouds.
مظلة|miẓalla|umbrella|☂️|خذ المظلة.|Take an umbrella.
الصيف|aṣ-ṣayf|summer|🏖️|في الصيف نذهب إلى البحر.|In summer we go to the sea.
الشتاء|ash-shitāʾ|winter|☃️|الشتاء بارد.|Winter is cold.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
مدرسة|madrasa|school|🏫|المدرسة قريبة.|The school is close.
درس|dars|lesson|🧑‍🏫|الدرس يبدأ في الثامنة.|The lesson starts at eight.
معلم|muʿallim|teacher|👩‍🏫|المعلم يشرح جيدا.|The teacher explains well.
طالب|ṭālib|student|🧑‍🎓|في الصف عشرون طالبا.|There are twenty students in the class.
دفتر|daftar|exercise book|📓|اكتب في الدفتر.|Write in the exercise book.
قلم|qalam|pen|🖊️|هل عندك قلم؟|Do you have a pen?
واجب|wājib|homework|📝|عندي واجب كثير.|I have a lot of homework.
سؤال|suʾāl|question|❓|عندي سؤال.|I have a question.
جواب|jawāb|answer|💡|الجواب صحيح.|The answer is correct.
تعلم|taʿallama|to learn|🌱|أتعلم عشر كلمات كل يوم.|I learn ten words every day.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
صحن|ṣaḥn|plate|🍽️|ضع الصحون على الطاولة.|Put the plates on the table.
كأس|kaʾs|glass|🥛|كأس ماء.|A glass of water.
فنجان|finjān|cup|☕|فنجان قهوة.|A cup of coffee.
سكين|sikkīn|knife|🔪|السكين حاد.|The knife is sharp.
شوكة|shawka|fork|🍴|أحتاج إلى شوكة.|I need a fork.
ملعقة|milʿaqa|spoon|🥄|كل الشوربة بالملعقة.|Eat the soup with the spoon.
قدر|qidr|cooking pot|🍲|الأرز في القدر.|The rice is in the pot.
فرن|furn|oven|🔥|الخبز في الفرن.|The bread is in the oven.
ملح|milḥ|salt|🧂|أعطني الملح من فضلك.|Pass me the salt, please.
زيت زيتون|zayt zaytūn|olive oil|🫒|زيت زيتون من فلسطين.|Olive oil from Palestine.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
أمس مساء|ams masāʾan|last night|🌃|أمس مساء ذهبنا إلى السينما.|Last night we went to the cinema.
الأسبوع الماضي|al-usbūʿ al-māḍī|last week|🗓️|كنت مريضا الأسبوع الماضي.|I was ill last week.
السنة الماضية|as-sana al-māḍiya|last year|🎆|السنة الماضية زرنا المغرب.|Last year we visited Morocco.
قبل يومين|qabla yawmayn|two days ago|⌛|وصلت قبل يومين.|I arrived two days ago.
ذهبت|dhahabtu|I went|🚶|ذهبت إلى السوق.|I went to the market.
أكلت|akaltu|I ate|🍽️|أكلت المنسف.|I ate mansaf.
رأيت|raʾaytu|I saw|👀|رأيت ليلى في المدينة.|I saw Layla in town.
اشتريت|ishtaraytu|I bought|🛍️|اشتريت معطفا.|I bought a coat.
في طفولتي|fī ṭufūlatī|in my childhood|🧒|في طفولتي عشت في قرية.|In my childhood I lived in a village.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
إن شاء الله|in shāʾa llāh|God willing|🤲|أراك غدا إن شاء الله.|See you tomorrow, God willing.
الحمد لله|al-ḥamdu lillāh|thank God|🙏|الحمد لله، أنا بخير.|Thank God, I’m well.
ما شاء الله|mā shāʾa llāh|how wonderful (admiration)|🤩|ما شاء الله، بيت جميل!|How wonderful, a beautiful house!
يلا|yalla|come on / let’s go|💪|يلا نروح!|Come on, let’s go!
تفضل|tafaḍḍal|please, go ahead / here you are|🙂|تفضل، اجلس.|Please, have a seat.
مبروك|mabrūk|congratulations|🎉|مبروك على العمل الجديد!|Congratulations on the new job!
سلامتك|salāmtak|get well soon|🤒|سلامتك!|Get well soon!
لا بأس|lā baʾs|it’s fine / no harm|😌|لا بأس، يحدث.|It’s fine, it happens.
مع الأسف|maʿa l-asaf|unfortunately|😞|مع الأسف لا أستطيع.|Unfortunately I can’t.
بالتأكيد|bit-taʾkīd|certainly|✅|بالتأكيد سأساعدك.|Certainly I’ll help you.
صحتين|ṣaḥtayn|enjoy (your food)|🍽️|صحتين!|Enjoy your meal!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
أيضا|ayḍan|also|➕|أتكلم الفرنسية أيضا.|I also speak French.
بالإضافة إلى ذلك|bil-iḍāfa ilā dhālik|in addition|📎|بالإضافة إلى ذلك، هو مجاني.|In addition, it’s free.
بينما|baynamā|while|⏯️|أقرأ بينما أنتظر.|I read while I wait.
مع أن|maʿa anna|although|🌗|مع أني متعب، سأحضر.|Although I’m tired, I’ll come.
عندما|ʿindamā|when (conjunction)|📆|اتصل بي عندما تصل.|Call me when you arrive.
أولا|awwalan|first|1️⃣|أولا، شكرا لكم.|First, thank you.
أخيرا|akhīran|finally|🏁|أخيرا، لنتكلم عن الميزانية.|Finally, let’s talk about the budget.
مثلا|mathalan|for example|📌|أحب الفواكه، مثلا التين.|I love fruit, for example figs.
رغم|raghma|despite|🧱|رغم المطر، خرجنا.|Despite the rain, we went out.
`),
];
