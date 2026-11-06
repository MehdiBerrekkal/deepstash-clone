import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Modern Standard Arabic, A1 → B1, for English speakers. Original content written for this app. Lines are "word|romanization|English|emoji|example|example in English". */
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

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
مرحبا|marḥaban|hello|👋|مرحبا، أنا ليلى.|Hello, I’m Layla.
السلام عليكم|as-salāmu ʿalaykum|peace be upon you (hello)|🙂|السلام عليكم يا عمر.|Hello, Omar.
مع السلامة|maʿa s-salāma|goodbye|🫡|مع السلامة، إلى الغد.|Goodbye, see you tomorrow.
شكرا|shukran|thank you|🙏|شكرا جزيلا!|Thank you very much!
عفوا|ʿafwan|you’re welcome / excuse me|😊|عفوا، لا مشكلة.|You’re welcome, no problem.
من فضلك|min faḍlik|please|🥺|قهوة من فضلك.|A coffee, please.
آسف|āsif|sorry|😅|آسف، أنا متأخر.|Sorry, I’m late.
تشرفنا|tasharrafnā|nice to meet you|🤝|تشرفنا، أنا كريم.|Nice to meet you, I’m Karim.
اسم|ism|name|🏷️|ما اسمك؟|What’s your name?
صديق|ṣadīq|friend (m)|👫|كريم صديقي.|Karim is my friend.
صديقة|ṣadīqa|friend (f)|👭|ليلى صديقتي.|Layla is my friend.
رجل|rajul|man|👨|الرجل يقرأ الجريدة.|The man is reading the paper.
امرأة|imraʾa|woman|👩|المرأة تتكلم في الهاتف.|The woman is on the phone.
طفل|ṭifl|child|🧒|الطفل يلعب في الحديقة.|The child plays in the garden.
نعم|naʿam|yes|✅|نعم، طبعا!|Yes, of course!
لا|lā|no|❌|لا، شكرا.|No, thank you.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
قهوة|qahwa|coffee|☕|قهوة عربية من فضلك.|Arabic coffee, please.
شاي|shāy|tea|🍵|شاي بالنعناع.|Mint tea.
ماء|māʾ|water|💧|كأس ماء من فضلك.|A glass of water, please.
عصير|ʿaṣīr|juice|🧃|عصير برتقال.|Orange juice.
حليب|ḥalīb|milk|🥛|قهوة بالحليب.|Coffee with milk.
سكر|sukkar|sugar|🍬|بدون سكر من فضلك.|No sugar, please.
كعكة|kaʿka|cake|🍰|هذه الكعكة لذيذة.|This cake is delicious.
خبز|khubz|bread|🍞|خبز طازج.|Fresh bread.
الحساب|al-ḥisāb|the bill|🧾|الحساب من فضلك.|The bill, please.
نادل|nādil|waiter|🤵|النادل قادم.|The waiter is coming.
أريد|urīd|I want|🙂|أريد شايا.|I want tea.
بكم|bikam|how much|💵|بكم هذا؟|How much is this?
لذيذ|ladhīdh|delicious|😋|لذيذ جدا!|Very delicious!
ساخن|sākhin|hot|♨️|انتبه، الشاي ساخن.|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
عائلة|ʿāʾila|family|👪|عائلتي كبيرة.|My family is big.
أم|umm|mother|👩|أمي معلمة.|My mother is a teacher.
أب|ab|father|👨|أبي طبيب.|My father is a doctor.
والدان|wālidān|parents|👨‍👩‍👧|والداي يسكنان في عمّان.|My parents live in Amman.
أخ|akh|brother|👦|أخي اسمه عمر.|My brother is called Omar.
أخت|ukht|sister|👧|عندي أخت صغيرة.|I have a little sister.
ابن|ibn|son|👦|ابنهم عمره عشر سنوات.|Their son is ten.
بنت|bint|daughter / girl|👧|بنتي تحب الرسم.|My daughter loves drawing.
جد|jadd|grandfather|👴|جدي يحكي القصص.|My grandfather tells stories.
جدة|jadda|grandmother|👵|جدتي تطبخ أحسن طعام.|My grandmother cooks the best food.
زوج|zawj|husband|🤵|زوجها مهندس.|Her husband is an engineer.
زوجة|zawja|wife|👰|زوجته مهندسة معمارية.|His wife is an architect.
`),
  t('A1', 'numbers', '🔢', 'Numbers', 'Les nombres', `
واحد|wāḥid|one|1️⃣|قهوة واحدة من فضلك.|One coffee, please.
اثنان|ithnān|two|2️⃣|تذكرتان من فضلك.|Two tickets, please.
ثلاثة|thalātha|three|3️⃣|نحن ثلاثة.|There are three of us.
أربعة|arbaʿa|four|4️⃣|عنده أربعة أولاد.|He has four children.
خمسة|khamsa|five|5️⃣|خمسة دنانير.|Five dinars.
ستة|sitta|six|6️⃣|أستيقظ في الساعة السادسة.|I wake up at six.
سبعة|sabʿa|seven|7️⃣|في الأسبوع سبعة أيام.|There are seven days in a week.
ثمانية|thamāniya|eight|8️⃣|أعمل ثماني ساعات.|I work eight hours.
تسعة|tisʿa|nine|9️⃣|بنتي عمرها تسع سنوات.|My daughter is nine.
عشرة|ʿashara|ten|🔟|القطار بعد عشر دقائق.|The train is in ten minutes.
مئة|miʾa|a hundred|💯|الفندق على بعد مئة متر.|The hotel is a hundred metres away.
كم عمرك؟|kam ʿumruk?|how old are you?|🎂|كم عمرك؟|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
اليوم|al-yawm|today|📅|الطقس جميل اليوم.|The weather is nice today.
غدا|ghadan|tomorrow|🌄|إلى اللقاء غدا!|See you tomorrow!
أمس|ams|yesterday|⬅️|كنت متعبا أمس.|I was tired yesterday.
صباح|ṣabāḥ|morning|🌅|صباح الخير!|Good morning!
مساء|masāʾ|evening|🌆|مساء الخير!|Good evening!
ليل|layl|night|🌙|تصبح على خير.|Good night.
الساعة|as-sāʿa|the hour / clock|🕐|كم الساعة؟|What time is it?
الجمعة|al-jumʿa|Friday|5️⃣|يوم الجمعة عطلة.|Friday is a day off.
السبت|as-sabt|Saturday|6️⃣|يوم السبت أذهب إلى السوق.|On Saturday I go to the market.
الأحد|al-aḥad|Sunday|7️⃣|يوم الأحد أعمل.|On Sunday I work.
أسبوع|usbūʿ|week|🗓️|أعمل خمسة أيام في الأسبوع.|I work five days a week.
وقت|waqt|time|⌛|ليس عندي وقت.|I don’t have time.
`),
  t('A1', 'food', '🥙', 'Food', 'La nourriture', `
طعام|ṭaʿām|food|🍲|الطعام جاهز.|The food is ready.
أرز|aruzz|rice|🍚|أرز مع دجاج.|Rice with chicken.
دجاج|dajāj|chicken|🍗|دجاج مشوي.|Grilled chicken.
لحم|laḥm|meat|🥩|لا آكل اللحم.|I don’t eat meat.
سمك|samak|fish|🐟|سمك مع ليمون.|Fish with lemon.
بيض|bayḍ|eggs|🥚|بيضتان من فضلك.|Two eggs, please.
جبن|jubn|cheese|🧀|خبز وجبن.|Bread and cheese.
تفاح|tuffāḥ|apples|🍎|تفاحة حمراء.|A red apple.
تمر|tamr|dates|🌴|تمر وقهوة.|Dates and coffee.
حمص|ḥummuṣ|chickpeas / hummus|🥣|حمص مع خبز.|Hummus with bread.
فلافل|falāfil|falafel|🧆|سندويشة فلافل.|A falafel sandwich.
أكل|akala|to eat|🍽️|ماذا تريد أن تأكل؟|What do you want to eat?
شرب|shariba|to drink|🥤|أشرب الكثير من الماء.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
بيت|bayt|house / home|🏠|بيتنا قديم.|Our house is old.
شقة|shaqqa|flat|🏢|أسكن في شقة صغيرة.|I live in a small flat.
مطبخ|maṭbakh|kitchen|🍳|المطبخ كبير.|The kitchen is big.
غرفة|ghurfa|room|🚪|غرفتي هادئة.|My room is quiet.
حمام|ḥammām|bathroom|🛁|الحمام على اليمين.|The bathroom is on the right.
باب|bāb|door|🚪|أغلق الباب من فضلك.|Close the door, please.
نافذة|nāfidha|window|🪟|افتح النافذة، الجو حار.|Open the window, it’s hot.
سرير|sarīr|bed|🛏️|السرير مريح.|The bed is comfortable.
كرسي|kursī|chair|🪑|خذ كرسيا.|Take a chair.
مفتاح|miftāḥ|key|🔑|أين المفتاح؟|Where’s the key?
سكن|sakana|to live|🏡|أسكن في القاهرة.|I live in Cairo.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
شارع|shāriʿ|street|🛣️|أسكن في هذا الشارع.|I live on this street.
سوق|sūq|market|🧺|السوق مزدحم.|The market is busy.
محطة|maḥaṭṭa|station|🚉|المحطة قريبة.|The station is close.
مخبز|makhbaz|bakery|🥖|المخبز يفتح مبكرا.|The bakery opens early.
صيدلية|ṣaydaliyya|pharmacy|💊|أين الصيدلية؟|Where is the pharmacy?
بنك|bank|bank|🏦|البنك مغلق.|The bank is closed.
متحف|matḥaf|museum|🏛️|المتحف كبير جدا.|The museum is very big.
مسجد|masjid|mosque|🕌|المسجد قديم وجميل.|The mosque is old and beautiful.
حديقة|ḥadīqa|park / garden|🌳|نتمشى في الحديقة.|We walk in the park.
يمين|yamīn|right|➡️|اذهب يمينا.|Go right.
يسار|yasār|left|⬅️|المحطة على اليسار.|The station is on the left.
على طول|ʿalā ṭūl|straight on|⬆️|امش على طول.|Walk straight on.
بعيد|baʿīd|far|🧭|هل هو بعيد؟|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
أحمر|aḥmar|red|🔴|سيارة حمراء.|A red car.
أزرق|azraq|blue|🔵|البحر أزرق.|The sea is blue.
أخضر|akhḍar|green|🟢|شجرة خضراء.|A green tree.
أصفر|aṣfar|yellow|🟡|زهرة صفراء.|A yellow flower.
أسود|aswad|black|⚫|قطة سوداء.|A black cat.
أبيض|abyaḍ|white|⚪|قميص أبيض.|A white shirt.
كبير|kabīr|big|🐘|بيت كبير.|A big house.
صغير|ṣaghīr|small|🐭|كلب صغير.|A small dog.
جديد|jadīd|new|🆕|عندي هاتف جديد.|I have a new phone.
قديم|qadīm|old|🏚️|مدينة قديمة.|An old city.
جميل|jamīl|beautiful|🌸|يوم جميل!|A beautiful day!
غال|ghālin|expensive|💎|المطعم غال.|The restaurant is expensive.
رخيص|rakhīṣ|cheap|🏷️|هذا الفندق رخيص.|This hotel is cheap.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
سفر|safar|travel|🧳|أحب السفر.|I love travelling.
طائرة|ṭāʾira|plane|✈️|الطائرة تقلع في العاشرة.|The plane takes off at ten.
مطار|maṭār|airport|🛫|نذهب إلى المطار بالتاكسي.|We go to the airport by taxi.
تذكرة|tadhkira|ticket|🎫|اشتريت التذاكر على الإنترنت.|I bought the tickets online.
حقيبة|ḥaqība|bag / suitcase|🧳|حقيبتي ثقيلة جدا.|My suitcase is very heavy.
جواز سفر|jawāz safar|passport|🛂|لا تنس جواز السفر!|Don’t forget your passport!
عطلة|ʿuṭla|holiday|🏝️|نحن في عطلة.|We’re on holiday.
فندق|funduq|hotel|🏨|الفندق قريب من البحر.|The hotel is near the sea.
حجز|ḥajz|booking|📋|عندي حجز باسم سميث.|I have a booking under the name Smith.
فطور|fuṭūr|breakfast|🥐|هل الفطور مشمول؟|Is breakfast included?
بحر|baḥr|sea|🌊|البحر هادئ اليوم.|The sea is calm today.
صحراء|ṣaḥrāʾ|desert|🏜️|رحلة إلى الصحراء.|A trip to the desert.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
طبيب|ṭabīb|doctor|👨‍⚕️|أحتاج إلى طبيب.|I need a doctor.
مريض|marīḍ|ill|🤒|أنا مريض منذ أمس.|I’ve been ill since yesterday.
حرارة|ḥarāra|fever / heat|🌡️|عندي حرارة.|I have a fever.
زكام|zukām|cold|🤧|عندي زكام.|I have a cold.
سعال|suʿāl|cough|😷|عندي سعال.|I have a cough.
صداع|ṣudāʿ|headache|🤕|عندي صداع.|I have a headache.
دواء|dawāʾ|medicine|💊|خذ هذا الدواء.|Take this medicine.
وصفة|waṣfa|prescription|📃|هذه الوصفة.|Here’s the prescription.
متعب|mutʿab|tired|🥱|أنا متعب جدا.|I’m very tired.
استراحة|istirāḥa|rest|🛋️|تحتاج إلى استراحة.|You need rest.
إسعاف|isʿāf|ambulance|🚑|اتصل بالإسعاف!|Call an ambulance!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
عمل|ʿamal|work|💼|أحب عملي.|I love my work.
مكتب|maktab|office|🏢|المكتب في وسط المدينة.|The office is in the city centre.
زميل|zamīl|colleague|🤝|زملائي لطفاء.|My colleagues are kind.
مدير|mudīr|manager|😎|المدير في اجتماع.|The manager is in a meeting.
اجتماع|ijtimāʿ|meeting|👥|الاجتماع في التاسعة.|The meeting is at nine.
راتب|rātib|salary|💵|الراتب جيد.|The salary is good.
مقابلة|muqābala|interview|🤝|عندي مقابلة عمل غدا.|I have a job interview tomorrow.
شركة|sharika|company|🏢|تعمل في شركة كبيرة.|She works for a big company.
مشغول|mashghūl|busy|🏃|أنا مشغول الآن.|I’m busy now.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
سعيد|saʿīd|happy|😊|أنا سعيد برؤيتك.|I’m happy to see you.
حزين|ḥazīn|sad|😢|لماذا أنت حزين؟|Why are you sad?
غاضب|ghāḍib|angry|😠|هو غاضب اليوم.|He’s angry today.
قلق|qaliq|worried|😟|لا تقلق!|Don’t worry!
فخور|fakhūr|proud|🦚|أنا فخور بك.|I’m proud of you.
متفاجئ|mutafājiʾ|surprised|😮|كنت متفاجئا.|I was surprised.
خوف|khawf|fear|😱|عندي خوف من العناكب.|I’m afraid of spiders.
مشتاق|mushtāq|missing someone|💌|أنا مشتاق إليك.|I miss you.
مرتاح|murtāḥ|relaxed|😌|أنا مرتاح في العطلة.|I’m relaxed on holiday.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
في رأيي|fī raʾyī|in my opinion|💬|في رأيي، هذه فكرة جيدة.|In my opinion, it’s a good idea.
أعتقد أن|aʿtaqid anna|I think that|💭|أعتقد أنك على حق.|I think you’re right.
موافق|muwāfiq|agreed|🤝|أنا موافق.|I agree.
لكن|lākin|but|↔️|غال لكنه جيد.|Expensive but good.
لذلك|lidhālika|that’s why|➡️|تمطر، لذلك سأبقى في البيت.|It’s raining, so I’ll stay home.
ربما|rubbamā|maybe|🤷|ربما تمطر غدا.|Maybe it’ll rain tomorrow.
طبعا|ṭabʿan|of course|✅|طبعا سأساعدك.|Of course I’ll help you.
في الحقيقة|fī l-ḥaqīqa|actually|📌|في الحقيقة، لا أعرف.|Actually, I don’t know.
مشكلة|mushkila|problem|❗|لا مشكلة!|No problem!
`),
  t('B1', 'society', '🌍', 'Culture and society', 'Culture et société', `
ثقافة|thaqāfa|culture|🎭|الثقافة العربية غنية.|Arab culture is rich.
تاريخ|tārīkh|history|📜|أحب التاريخ.|I love history.
لغة|lugha|language|🗣️|العربية لغة جميلة.|Arabic is a beautiful language.
كتاب|kitāb|book|📕|أقرأ كتابا جديدا.|I’m reading a new book.
شعر|shiʿr|poetry|📜|الشعر مهم في الثقافة العربية.|Poetry is important in Arab culture.
تقاليد|taqālīd|traditions|🎎|هذه من تقاليدنا.|This is one of our traditions.
بيئة|bīʾa|environment|🌍|يجب أن نحمي البيئة.|We must protect the environment.
أخبار|akhbār|news|📰|هل شاهدت الأخبار؟|Did you watch the news?
إنترنت|internet|internet|🌐|وجدته على الإنترنت.|I found it online.
هاتف|hātif|phone|📱|نسيت هاتفي.|I forgot my phone.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'ar-g-article', level: 'A1', icon: '🔤', en: 'The article al-, and no "to be"', fr: 'L’article al- et pas de « être »',
    cards: [
      { en: '"The" is ال (al-), joined to the word: كتاب (a book) → الكتاب (the book). There is no word for "a".', fr: '« Le » : ال attaché au mot ; pas d’article indéfini.', examples: [['كتاب', 'a book', 'a book'], ['الكتاب', 'the book', 'the book']] },
      { en: 'In the present, "to be" is left out: البيت كبير = the house (is) big. أنا طالب = I (am) a student.', fr: 'Au présent, pas de verbe « être ».', examples: [['البيت كبير.', 'The house is big.', 'The house is big.'], ['أنا طالب.', 'I’m a student.', 'I’m a student.']] },
    ],
    drills: [
      { text: '___كتاب على الطاولة.', answer: 'ال', wrong: ['و', 'ب'], en: 'The book is on the table.', fr: 'The book is on the table.' },
      { text: 'البيت ___.', answer: 'كبير', wrong: ['الكبير', 'كبيرة'], en: 'The house is big.', fr: 'The house is big.' },
      { text: '___ طالبة.', answer: 'أنا', wrong: ['أنت', 'هو'], en: 'I’m a student (f).', fr: 'I’m a student (f).' },
    ],
  },
  {
    id: 'ar-g-gender', level: 'A1', icon: '♀️', en: 'Masculine and feminine', fr: 'Masculin et féminin',
    cards: [
      { en: 'Most feminine nouns end in ة (-a). Adjectives agree: بيت كبير (a big house), غرفة كبيرة (a big room).', fr: 'Féminin en ة ; l’adjectif s’accorde.', examples: [['طالب / طالبة', 'student (m) / (f)', 'student (m) / (f)'], ['سيارة جديدة', 'a new car', 'a new car']] },
    ],
    drills: [
      { text: 'غرفة ___.', answer: 'كبيرة', wrong: ['كبير', 'الكبير'], en: 'A big room.', fr: 'A big room.' },
      { text: 'هو ___.', answer: 'طالب', wrong: ['طالبة', 'طلاب'], en: 'He’s a student.', fr: 'He’s a student.' },
      { text: 'سيارة ___.', answer: 'حمراء', wrong: ['أحمر', 'الأحمر'], en: 'A red car.', fr: 'A red car.' },
    ],
  },
  {
    id: 'ar-g-possessive', level: 'A1', icon: '🤲', en: 'My, your: endings', fr: 'Mon, ton : les terminaisons',
    cards: [
      { en: 'Possession is an ending: كتابي (my book), كتابك (your book), كتابه (his book), كتابها (her book).', fr: 'La possession se marque par une terminaison : -ī, -ka/-ki, -hu, -hā.', examples: [['اسمي ليلى.', 'My name is Layla.', 'My name is Layla.'], ['ما اسمك؟', 'What’s your name?', 'What’s your name?']] },
      { en: '"I have" is عندي (literally "with me"): عندي أخ = I have a brother.', fr: '« J’ai » : عندي.', examples: [['عندي سيارة.', 'I have a car.', 'I have a car.']] },
    ],
    drills: [
      { text: 'اسم___ ليلى.', answer: 'ي', wrong: ['ك', 'ه'], en: 'My name is Layla.', fr: 'My name is Layla.' },
      { text: '___ أخت.', answer: 'عندي', wrong: ['أنا', 'هو'], en: 'I have a sister.', fr: 'I have a sister.' },
      { text: 'هذا بيت___ (his).', answer: 'ه', wrong: ['ي', 'ها'], en: 'This is his house.', fr: 'This is his house.' },
    ],
  },
  {
    id: 'ar-g-present', level: 'A2', icon: '🔁', en: 'Present tense', fr: 'Le présent',
    cards: [
      { en: 'Present verbs use prefixes: أكتب (I write), تكتب (you write), يكتب (he writes), نكتب (we write).', fr: 'Présent par préfixes : أ- (je), ت- (tu), ي- (il), ن- (nous).', examples: [['أشرب القهوة.', 'I drink coffee.', 'I drink coffee.'], ['هو يدرس العربية.', 'He studies Arabic.', 'He studies Arabic.']] },
    ],
    drills: [
      { text: 'أنا ___ الشاي.', answer: 'أشرب', wrong: ['يشرب', 'تشرب'], en: 'I drink tea.', fr: 'I drink tea.' },
      { text: 'هو ___ في بنك.', answer: 'يعمل', wrong: ['أعمل', 'نعمل'], en: 'He works in a bank.', fr: 'He works in a bank.' },
      { text: 'نحن ___ في عمّان.', answer: 'نسكن', wrong: ['يسكن', 'أسكن'], en: 'We live in Amman.', fr: 'We live in Amman.' },
    ],
  },
  {
    id: 'ar-g-past', level: 'B1', icon: '⏮️', en: 'Past tense', fr: 'Le passé',
    cards: [
      { en: 'Past verbs use endings: كتبتُ (I wrote), كتبتَ (you wrote), كتب (he wrote), كتبت (she wrote), كتبنا (we wrote).', fr: 'Passé par terminaisons : -tu, -ta, -a, -at, -nā.', examples: [['ذهبت إلى السوق.', 'I went to the market.', 'I went to the market.'], ['شربنا الشاي.', 'We drank tea.', 'We drank tea.']] },
    ],
    drills: [
      { text: 'أمس ___ إلى السوق (I went).', answer: 'ذهبت', wrong: ['يذهب', 'أذهب'], en: 'Yesterday I went to the market.', fr: 'Yesterday I went to the market.' },
      { text: 'هو ___ كتابا (he read).', answer: 'قرأ', wrong: ['يقرأ', 'قرأنا'], en: 'He read a book.', fr: 'He read a book.' },
      { text: 'نحن ___ العشاء (we ate).', answer: 'أكلنا', wrong: ['نأكل', 'أكل'], en: 'We ate dinner.', fr: 'We ate dinner.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'ar-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'أهلا وسهلا! ماذا تريد؟', en: 'Welcome! What would you like?', fr: 'Welcome! What would you like?' },
      { who: 'B', text: 'شاي بالنعناع وكعكة من فضلك.', en: 'Mint tea and a cake, please.', fr: 'Mint tea and a cake, please.', wrong: ['أنا كعكة.', 'الحساب شاي.'] },
      { who: 'A', text: 'هنا أم سفري؟', en: 'Here or to take away?', fr: 'Here or to take away?' },
      { who: 'B', text: 'هنا، شكرا.', en: 'Here, thanks.', fr: 'Here, thanks.', wrong: ['عمري ثلاثون سنة.', 'الجو بارد.'] },
      { who: 'A', text: 'المجموع ثلاثة دنانير.', en: 'That’s three dinars in total.', fr: 'That’s three dinars in total.' },
      { who: 'B', text: 'تفضل. شكرا!', en: 'Here you go. Thanks!', fr: 'Here you go. Thanks!', wrong: ['تصبح على خير يا دنانير!', 'أين الكعكة؟'] },
    ],
  },
  {
    id: 'ar-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'عفوا، أين المحطة؟', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['عفوا، بكم المحطة؟', 'عفوا، أنا المحطة.'] },
      { who: 'A', text: 'امش على طول ثم اذهب يسارا.', en: 'Walk straight on, then go left.', fr: 'Walk straight on, then go left.' },
      { who: 'B', text: 'هل هي بعيدة؟', en: 'Is it far?', fr: 'Is it far?', wrong: ['هل هي لذيذة؟', 'هل هو يوم الجمعة؟'] },
      { who: 'A', text: 'لا، خمس دقائق مشيا.', en: 'No, five minutes on foot.', fr: 'No, five minutes on foot.' },
      { who: 'B', text: 'شكرا جزيلا!', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['بالهناء والشفاء!', 'تصبح على خير!'] },
    ],
  },
  {
    id: 'ar-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'مساء الخير! كيف أساعدك؟', en: 'Good evening! How can I help you?', fr: 'Good evening! How can I help you?' },
      { who: 'B', text: 'عندي حجز باسم سميث.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['عندي صداع.', 'شاي من فضلك.'] },
      { who: 'A', text: 'غرفة لشخصين لليلتين. جواز السفر من فضلك.', en: 'A double room for two nights. Your passport, please.', fr: 'A double room for two nights. Your passport, please.' },
      { who: 'B', text: 'تفضل. متى الفطور؟', en: 'Here you are. When is breakfast?', fr: 'Here you are. When is breakfast?', wrong: ['تفضل. أين بحر الجواز؟', 'لا شكرا، لست جائعا.'] },
      { who: 'A', text: 'من السابعة إلى العاشرة. غرفتك في الطابق الثالث.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'ممتاز. هل الإنترنت مجاني؟', en: 'Excellent. Is the internet free?', fr: 'Excellent. Is the internet free?', wrong: ['ممتاز. أنا مجاني.', 'ممتاز. عمري ثلاثون.'] },
    ],
  },
  {
    id: 'ar-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'أهلا. ماذا تشعر؟', en: 'Hello. How are you feeling?', fr: 'Hello. How are you feeling?' },
      { who: 'B', text: 'عندي ألم في الحلق وحرارة.', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['أريد فلافل.', 'عندي غرفة لشخصين.'] },
      { who: 'A', text: 'منذ متى؟', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'منذ ثلاثة أيام.', en: 'For three days.', fr: 'For three days.', wrong: ['في الساعة الثالثة.', 'ثلاثة دنانير.'] },
      { who: 'A', text: 'هذا زكام. هذه الوصفة. استرح جيدا.', en: 'It’s a cold. Here’s the prescription. Rest well.', fr: 'It’s a cold. Here’s the prescription. Rest well.' },
      { who: 'B', text: 'شكرا يا دكتور.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['شكرا، أين المحطة؟', 'مبروك!'] },
    ],
  },
  {
    id: 'ar-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'ماذا ستفعل في عطلة نهاية الأسبوع؟', en: 'What will you do at the weekend?', fr: 'What will you do at the weekend?' },
      { who: 'B', text: 'لا شيء بعد. هل عندك فكرة؟', en: 'Nothing yet. Do you have an idea?', fr: 'Nothing yet. Do you have an idea?', wrong: ['أكلت فلافل أمس.', 'ولدت في القاهرة.'] },
      { who: 'A', text: 'نذهب إلى البحر الميت؟', en: 'Shall we go to the Dead Sea?', fr: 'Shall we go to the Dead Sea?' },
      { who: 'B', text: 'فكرة رائعة! إن شاء الله.', en: 'Great idea! God willing.', fr: 'Great idea! God willing.', wrong: ['فكرة رائعة! كنت مريضا السنة الماضية.', 'لا، ليس عندي حذاء.'] },
      { who: 'A', text: 'نلتقي في المحطة في التاسعة؟', en: 'Shall we meet at the station at nine?', fr: 'Shall we meet at the station at nine?' },
      { who: 'B', text: 'اتفقنا! سأحضر الطعام.', en: 'Deal! I’ll bring the food.', fr: 'Deal! I’ll bring the food.', wrong: ['اتفقنا! أحضرت أمس.', 'لا شكرا، أنا المحطة.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'ar-s-market', level: 'A1', icon: '🧺', en: 'Layla at the market', fr: 'Layla au marché',
    sentences: [
      ['ليلى تسكن في عمّان.', 'Layla lives in Amman.', 'Layla lives in Amman.'],
      ['يوم السبت تذهب إلى السوق.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['تشتري تفاحا وجبنا وخبزا.', 'She buys apples, cheese and bread.', 'She buys apples, cheese and bread.'],
      ['ثم تشرب قهوة عند كريم.', 'Then she has a coffee at Karim’s.', 'Then she has a coffee at Karim’s.'],
      ['كريم يعطيها كعكة.', 'Karim gives her a cake.', 'Karim gives her a cake.'],
      ['ليلى سعيدة جدا.', 'Layla is very happy.', 'Layla is very happy.'],
    ],
    glossary: { تسكن: ['lives', 'lives'], السبت: ['Saturday', 'Saturday'], السوق: ['the market', 'the market'], تشتري: ['buys', 'buys'], تفاحا: ['apples', 'apples'], ثم: ['then', 'then'], يعطيها: ['gives her', 'gives her'], سعيدة: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Layla live?', fr: 'Where does Layla live?', answer: 'عمّان', wrong: ['القاهرة', 'بيروت'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'تفاحا وجبنا وخبزا', wrong: ['سمكا وأرزا', 'حذاء'] },
      { en: 'What does Karim give her?', fr: 'What does Karim give her?', answer: 'كعكة', wrong: ['قهوة', 'تمر'] },
    ],
  },
  {
    id: 'ar-s-train', level: 'A2', icon: '🚌', en: 'The missed bus', fr: 'Le bus raté',
    sentences: [
      ['كان عند عمر حافلة إلى العقبة في الثامنة.', 'Omar had a bus to Aqaba at eight.', 'Omar had a bus to Aqaba at eight.'],
      ['لكنه استيقظ في السابعة والنصف.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['لبس ملابسه بسرعة وأخذ تاكسي.', 'He got dressed quickly and took a taxi.', 'He got dressed quickly and took a taxi.'],
      ['وصل إلى المحطة في الثامنة ودقيقتين.', 'He reached the station at two minutes past eight.', 'He reached the station at two minutes past eight.'],
      ['كانت الحافلة قد غادرت.', 'The bus had already left.', 'The bus had already left.'],
      ['أخذ الحافلة التالية وقرأ كتابا.', 'He took the next bus and read a book.', 'He took the next bus and read a book.'],
    ],
    glossary: { حافلة: ['bus', 'bus'], استيقظ: ['woke up', 'woke up'], بسرعة: ['quickly', 'quickly'], وصل: ['arrived', 'arrived'], غادرت: ['had left', 'had left'], التالية: ['next', 'next'], قرأ: ['read', 'read'] },
    questions: [
      { en: 'Where was Omar going?', fr: 'Where was Omar going?', answer: 'العقبة', wrong: ['عمّان', 'القاهرة'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'تاكسي', wrong: ['دراجة', 'مشيا'] },
      { en: 'What did he do on the next bus?', fr: 'What did he do on the next bus?', answer: 'قرأ كتابا', wrong: ['نام', 'أكل'] },
    ],
  },
  {
    id: 'ar-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['قبل سنتين، كانت عند سكان عمارتنا فكرة.', 'Two years ago, the residents of our building had an idea.', 'Two years ago, the residents of our building had an idea.'],
      ['كان السطح فارغا ولا أحد يستعمله.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['اقترح أبو سمير أن نزرع خضارا.', 'Abu Samir suggested we grow vegetables.', 'Abu Samir suggested we grow vegetables.'],
      ['في البداية، لم يوافق الجميع.', 'At first, not everyone agreed.', 'At first, not everyone agreed.'],
      ['اليوم تنمو هناك الطماطم والنعناع والفراولة.', 'Today tomatoes, mint and strawberries grow there.', 'Today tomatoes, mint and strawberries grow there.'],
      ['وكل يوم جمعة يأكل الجميع معا على السطح.', 'And every Friday everyone eats together on the roof.', 'And every Friday everyone eats together on the roof.'],
    ],
    glossary: { سكان: ['residents', 'residents'], عمارتنا: ['our building', 'our building'], السطح: ['the roof', 'the roof'], فارغا: ['empty', 'empty'], اقترح: ['suggested', 'suggested'], نزرع: ['we grow / plant', 'we grow / plant'], البداية: ['the beginning', 'the beginning'], تنمو: ['grow', 'grow'], معا: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'أبو سمير', wrong: ['ليلى', 'عمر'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'الطماطم والنعناع والفراولة', wrong: ['التفاح والإجاص', 'البطاطا'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: 'كل يوم جمعة', wrong: ['كل يوم أحد', 'مرة في السنة'] },
    ],
  },
];

export const ARABIC_FULL: FullCourse = { topics, grammar, dialogues, stories };
