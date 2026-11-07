import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Hindi, A1 → B1, for English speakers. Original content written for this app. Lines are "word|romanization|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `hi-${id}`, level, icon, en, fr, words: w6(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
नमस्ते|namaste|hello|🙏|नमस्ते, मैं प्रिया हूँ।|Hello, I’m Priya.
धन्यवाद|dhanyavaad|thank you|🙏|बहुत धन्यवाद!|Thank you very much!
शुक्रिया|shukriya|thanks|😊|शुक्रिया, दोस्त!|Thanks, friend!
माफ़ कीजिए|maaf kījiye|excuse me / sorry|😅|माफ़ कीजिए, स्टेशन कहाँ है?|Excuse me, where is the station?
आपसे मिलकर खुशी हुई|aapse milkar khushī huī|nice to meet you|🤝|आपसे मिलकर खुशी हुई, मैं राहुल हूँ।|Nice to meet you, I’m Rahul.
नाम|naam|name|🏷️|आपका नाम क्या है?|What’s your name?
दोस्त|dost|friend|👫|राहुल मेरा दोस्त है।|Rahul is my friend.
आदमी|aadmī|man|👨|आदमी अख़बार पढ़ रहा है।|The man is reading the paper.
औरत|aurat|woman|👩|औरत फ़ोन पर बात कर रही है।|The woman is talking on the phone.
बच्चा|bachchā|child|🧒|बच्चा पार्क में खेल रहा है।|The child is playing in the park.
हाँ|hā̃|yes|✅|हाँ, ज़रूर!|Yes, of course!
नहीं|nahī̃|no|❌|नहीं, धन्यवाद।|No, thank you.
फिर मिलेंगे|phir milenge|see you again|🫡|फिर मिलेंगे, कल!|See you again tomorrow!
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
चाय|chāy|tea|🍵|एक कप चाय, प्लीज़।|A cup of tea, please.
कॉफ़ी|kofī|coffee|☕|मुझे कॉफ़ी चाहिए।|I want coffee.
पानी|pānī|water|💧|एक गिलास पानी, प्लीज़।|A glass of water, please.
जूस|jūs|juice|🧃|संतरे का जूस।|Orange juice.
दूध|dūdh|milk|🥛|दूध वाली चाय।|Tea with milk.
चीनी|chīnī|sugar|🍬|बिना चीनी के।|Without sugar.
समोसा|samosā|samosa|🥟|दो समोसे, प्लीज़।|Two samosas, please.
रोटी|roṭī|flatbread|🫓|गरम रोटी।|Hot roti.
बिल|bil|the bill|🧾|बिल ले आइए।|Please bring the bill.
वेटर|veṭar|waiter|🤵|वेटर अभी आ रहा है।|The waiter is coming now.
मुझे चाहिए|mujhe chāhiye|I want / I need|🙂|मुझे एक चाय चाहिए।|I want a tea.
कितने का है|kitne kā hai|how much is it|💵|यह कितने का है?|How much is this?
स्वादिष्ट|svādiṣṭ|delicious|😋|बहुत स्वादिष्ट!|Very delicious!
गरम|garam|hot|♨️|ध्यान से, चाय गरम है।|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
परिवार|parivār|family|👪|मेरा परिवार बड़ा है।|My family is big.
माँ|mā̃|mother|👩|मेरी माँ टीचर हैं।|My mother is a teacher.
पिता|pitā|father|👨|मेरे पिता डॉक्टर हैं।|My father is a doctor.
भाई|bhāī|brother|👦|मेरे भाई का नाम राहुल है।|My brother’s name is Rahul.
बहन|bahan|sister|👧|मेरी एक बहन है।|I have a sister.
बेटा|beṭā|son|👦|उनका बेटा दस साल का है।|Their son is ten.
बेटी|beṭī|daughter|👧|मेरी बेटी को चित्र बनाना पसंद है।|My daughter likes drawing.
दादा|dādā|grandfather (paternal)|👴|दादा कहानियाँ सुनाते हैं।|Grandpa tells stories.
दादी|dādī|grandmother (paternal)|👵|दादी सबसे अच्छा खाना बनाती हैं।|Grandma cooks the best food.
पति|pati|husband|🤵|उसके पति इंजीनियर हैं।|Her husband is an engineer.
पत्नी|patnī|wife|👰|उसकी पत्नी आर्किटेक्ट है।|His wife is an architect.
`),
  t('A1', 'numbers', '🔢', 'Numbers', 'Les nombres', `
एक|ek|one|1️⃣|एक चाय, प्लीज़।|One tea, please.
दो|do|two|2️⃣|दो टिकट, प्लीज़।|Two tickets, please.
तीन|tīn|three|3️⃣|हम तीन हैं।|There are three of us.
चार|chār|four|4️⃣|उसके चार बच्चे हैं।|He has four children.
पाँच|pā̃ch|five|5️⃣|पाँच रुपये।|Five rupees.
छह|chhah|six|6️⃣|मैं छह बजे उठता हूँ।|I get up at six.
सात|sāt|seven|7️⃣|हफ़्ते में सात दिन होते हैं।|A week has seven days.
आठ|āṭh|eight|8️⃣|मैं आठ घंटे काम करता हूँ।|I work eight hours.
नौ|nau|nine|9️⃣|मेरी बेटी नौ साल की है।|My daughter is nine.
दस|das|ten|🔟|ट्रेन दस मिनट में है।|The train is in ten minutes.
सौ|sau|a hundred|💯|सौ रुपये।|A hundred rupees.
आपकी उम्र क्या है?|āpkī umr kyā hai?|how old are you?|🎂|आपकी उम्र क्या है?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
आज|āj|today|📅|आज मौसम अच्छा है।|The weather is nice today.
कल|kal|tomorrow / yesterday|🔁|कल मिलते हैं!|See you tomorrow!
सुबह|subah|morning|🌅|सुबह मैं चाय पीता हूँ।|I drink tea in the morning.
शाम|shām|evening|🌆|आज शाम क्या कर रहे हो?|What are you doing this evening?
रात|rāt|night|🌙|शुभ रात्रि!|Good night!
सोमवार|somvār|Monday|1️⃣|सोमवार को मैं काम करता हूँ।|On Monday I work.
शनिवार|shanivār|Saturday|6️⃣|शनिवार को बाज़ार जाता हूँ।|On Saturday I go to the market.
रविवार|ravivār|Sunday|7️⃣|रविवार को छुट्टी है।|Sunday is a holiday.
हफ़्ता|haftā|week|🗓️|मैं हफ़्ते में पाँच दिन काम करता हूँ।|I work five days a week.
समय|samay|time|⌛|मेरे पास समय नहीं है।|I don’t have time.
कितने बजे हैं?|kitne baje hain?|what time is it?|🕐|अभी कितने बजे हैं?|What time is it now?
`),
  t('A1', 'food', '🍛', 'Food', 'La nourriture', `
खाना|khānā|food / to eat|🍛|खाना तैयार है।|The food is ready.
चावल|chāval|rice|🍚|दाल और चावल।|Lentils and rice.
दाल|dāl|lentils|🥣|मुझे दाल पसंद है।|I like dal.
सब्ज़ी|sabzī|vegetables / curry|🥦|आलू की सब्ज़ी।|Potato curry.
आलू|ālū|potato|🥔|आलू पराठा।|Potato paratha.
पनीर|panīr|paneer (cheese)|🧀|पालक पनीर।|Spinach with paneer.
आम|ām|mango|🥭|आम बहुत मीठा है।|The mango is very sweet.
सेब|seb|apple|🍎|एक लाल सेब।|A red apple.
मछली|machhlī|fish|🐟|मैं मछली नहीं खाता।|I don’t eat fish.
अंडा|aṇḍā|egg|🥚|दो अंडे, प्लीज़।|Two eggs, please.
मसालेदार|masāledār|spicy|🌶️|यह बहुत मसालेदार है।|This is very spicy.
पीना|pīnā|to drink|🥤|मैं बहुत पानी पीता हूँ।|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
घर|ghar|house / home|🏠|हमारा घर पुराना है।|Our house is old.
कमरा|kamrā|room|🚪|मेरा कमरा छोटा है।|My room is small.
रसोई|rasoī|kitchen|🍳|माँ रसोई में हैं।|Mum is in the kitchen.
बाथरूम|bāthrūm|bathroom|🛁|बाथरूम दाईं तरफ़ है।|The bathroom is on the right.
दरवाज़ा|darvāzā|door|🚪|दरवाज़ा बंद करो।|Close the door.
खिड़की|khiṛkī|window|🪟|खिड़की खोलो, गर्मी है।|Open the window, it’s hot.
बिस्तर|bistar|bed|🛏️|बिस्तर आरामदायक है।|The bed is comfortable.
कुर्सी|kursī|chair|🪑|कुर्सी पर बैठिए।|Please sit on the chair.
चाबी|chābī|key|🔑|मेरी चाबी कहाँ है?|Where is my key?
छत|chhat|roof|🏘️|हम छत पर बैठते हैं।|We sit on the roof.
रहना|rahnā|to live / to stay|🏡|मैं मुंबई में रहता हूँ।|I live in Mumbai.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
सड़क|saṛak|road|🛣️|यह सड़क बहुत लंबी है।|This road is very long.
बाज़ार|bāzār|market|🧺|बाज़ार में बहुत भीड़ है।|The market is very crowded.
स्टेशन|sṭeshan|station|🚉|स्टेशन पास है।|The station is close.
दुकान|dukān|shop|🏪|दुकान दस बजे खुलती है।|The shop opens at ten.
अस्पताल|aspatāl|hospital|🏥|अस्पताल दूर है।|The hospital is far.
बैंक|baink|bank|🏦|बैंक बंद है।|The bank is closed.
मंदिर|mandir|temple|🛕|मंदिर बहुत सुंदर है।|The temple is very beautiful.
पार्क|pārk|park|🌳|चलो पार्क में घूमें।|Let’s walk in the park.
दाएँ|dāẽ|right|➡️|दाएँ मुड़िए।|Turn right.
बाएँ|bāẽ|left|⬅️|स्टेशन बाएँ है।|The station is on the left.
सीधे|sīdhe|straight|⬆️|सीधे जाइए।|Go straight.
दूर|dūr|far|🧭|क्या यह दूर है?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
लाल|lāl|red|🔴|लाल गाड़ी।|A red car.
नीला|nīlā|blue|🔵|आसमान नीला है।|The sky is blue.
हरा|harā|green|🟢|हरा पेड़।|A green tree.
पीला|pīlā|yellow|🟡|पीला फूल।|A yellow flower.
काला|kālā|black|⚫|काली बिल्ली।|A black cat.
सफ़ेद|safed|white|⚪|सफ़ेद कमीज़।|A white shirt.
बड़ा|baṛā|big|🐘|बड़ा घर।|A big house.
छोटा|chhoṭā|small|🐭|छोटा कुत्ता।|A small dog.
नया|nayā|new|🆕|मेरा नया फ़ोन।|My new phone.
पुराना|purānā|old|🏚️|पुराना शहर।|The old city.
सुंदर|sundar|beautiful|🌸|कितना सुंदर दिन है!|What a beautiful day!
महँगा|mahãgā|expensive|💎|होटल महँगा है।|The hotel is expensive.
सस्ता|sastā|cheap|🏷️|यह दुकान सस्ती है।|This shop is cheap.
`),
  t('A2', 'travel', '🚆', 'Travel', 'Voyager', `
यात्रा|yātrā|journey|🧳|आपकी यात्रा शुभ हो!|Have a good journey!
ट्रेन|ṭren|train|🚆|ट्रेन दिल्ली जाती है।|The train goes to Delhi.
हवाई जहाज़|havāī jahāz|plane|✈️|हवाई जहाज़ दस बजे उड़ेगा।|The plane leaves at ten.
हवाई अड्डा|havāī aḍḍā|airport|🛫|हम टैक्सी से हवाई अड्डे जा रहे हैं।|We’re taking a taxi to the airport.
टिकट|ṭikaṭ|ticket|🎫|मैंने टिकट ऑनलाइन खरीदे।|I bought the tickets online.
सामान|sāmān|luggage|🧳|मेरा सामान बहुत भारी है।|My luggage is very heavy.
पासपोर्ट|pāsporṭ|passport|🛂|पासपोर्ट मत भूलना!|Don’t forget your passport!
छुट्टी|chhuṭṭī|holiday / day off|🏝️|हम छुट्टी पर हैं।|We’re on holiday.
होटल|hoṭal|hotel|🏨|होटल समुद्र के पास है।|The hotel is near the sea.
नाश्ता|nāshtā|breakfast|🥐|क्या नाश्ता शामिल है?|Is breakfast included?
समुद्र|samudra|sea|🌊|समुद्र शांत है।|The sea is calm.
पहाड़|pahāṛ|mountain|🏔️|गर्मियों में हम पहाड़ जाते हैं।|In summer we go to the mountains.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
डॉक्टर|ḍākṭar|doctor|👨‍⚕️|मुझे डॉक्टर के पास जाना है।|I need to go to the doctor.
बीमार|bīmār|ill|🤒|मैं कल से बीमार हूँ।|I’ve been ill since yesterday.
बुखार|bukhār|fever|🌡️|मुझे बुखार है।|I have a fever.
ज़ुकाम|zukām|cold|🤧|मुझे ज़ुकाम है।|I have a cold.
खाँसी|khā̃sī|cough|😷|मुझे खाँसी है।|I have a cough.
सिरदर्द|sirdard|headache|🤕|मुझे सिरदर्द है।|I have a headache.
दवा|davā|medicine|💊|यह दवा लीजिए।|Take this medicine.
थका हुआ|thakā huā|tired|🥱|मैं बहुत थका हुआ हूँ।|I’m very tired.
आराम|ārām|rest|🛋️|आपको आराम चाहिए।|You need rest.
एम्बुलेंस|embulens|ambulance|🚑|एम्बुलेंस बुलाइए!|Call an ambulance!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
काम|kām|work|💼|मुझे अपना काम पसंद है।|I like my work.
दफ़्तर|daftar|office|🏢|दफ़्तर शहर के बीच में है।|The office is in the city centre.
सहकर्मी|sahkarmī|colleague|🤝|मेरे सहकर्मी अच्छे हैं।|My colleagues are nice.
मालिक|mālik|boss / owner|😎|मालिक मीटिंग में हैं।|The boss is in a meeting.
मीटिंग|mīṭiṅg|meeting|👥|मीटिंग नौ बजे है।|The meeting is at nine.
तनख़्वाह|tankhvāh|salary|💵|तनख़्वाह अच्छी है।|The salary is good.
इंटरव्यू|inṭarvyū|interview|🤝|कल मेरा इंटरव्यू है।|I have an interview tomorrow.
कंपनी|kampanī|company|🏢|वह एक बड़ी कंपनी में काम करती है।|She works for a big company.
व्यस्त|vyast|busy|🏃|मैं अभी व्यस्त हूँ।|I’m busy right now.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
खुश|khush|happy|😊|आपको देखकर बहुत खुश हूँ।|I’m very happy to see you.
उदास|udās|sad|😢|तुम उदास क्यों हो?|Why are you sad?
गुस्सा|gussā|anger|😠|वह आज गुस्से में है।|He’s angry today.
चिंता|chintā|worry|😟|चिंता मत करो!|Don’t worry!
गर्व|garv|pride|🦚|मुझे तुम पर गर्व है।|I’m proud of you.
हैरान|hairān|surprised|😮|मैं हैरान था।|I was surprised.
डर|ḍar|fear|😱|मुझे मकड़ियों से डर लगता है।|I’m scared of spiders.
याद आना|yād ānā|to miss|💌|मुझे तुम्हारी याद आती है।|I miss you.
प्यार|pyār|love|❤️|मुझे तुमसे प्यार है।|I love you.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
मेरे ख़याल से|mere khayāl se|in my opinion|💬|मेरे ख़याल से यह अच्छा विचार है।|In my opinion, it’s a good idea.
मुझे लगता है|mujhe lagtā hai|I think|💭|मुझे लगता है कि तुम सही हो।|I think you’re right.
सही|sahī|right / correct|✅|आप सही हैं।|You’re right.
सहमत|sahmat|agreed|🤝|मैं सहमत हूँ।|I agree.
लेकिन|lekin|but|↔️|महँगा है लेकिन अच्छा है।|It’s expensive but good.
इसलिए|isliye|that’s why|➡️|बारिश हो रही है, इसलिए मैं घर पर हूँ।|It’s raining, so I’m at home.
शायद|shāyad|maybe|🤷|शायद कल बारिश होगी।|Maybe it’ll rain tomorrow.
ज़रूर|zarūr|definitely|✅|मैं ज़रूर आऊँगा!|I’ll definitely come!
असल में|asal mẽ|actually|📌|असल में, मुझे नहीं पता।|Actually, I don’t know.
समस्या|samasyā|problem|❗|कोई समस्या नहीं!|No problem!
`),
  t('B1', 'society', '🌍', 'Culture and society', 'Culture et société', `
संस्कृति|sanskṛti|culture|🎭|भारतीय संस्कृति बहुत समृद्ध है।|Indian culture is very rich.
त्योहार|tyohār|festival|🪔|दिवाली रोशनी का त्योहार है।|Diwali is the festival of lights.
परंपरा|paramparā|tradition|🎎|यह पुरानी परंपरा है।|It’s an old tradition.
इतिहास|itihās|history|📜|मुझे इतिहास पसंद है।|I like history.
फ़िल्म|film|film|🎬|हम हिंदी फ़िल्म देख रहे हैं।|We’re watching a Hindi film.
संगीत|sangīt|music|🎵|मुझे भारतीय संगीत पसंद है।|I like Indian music.
पर्यावरण|paryāvaraṇ|environment|🌍|हमें पर्यावरण की रक्षा करनी चाहिए।|We must protect the environment.
ख़बर|khabar|news|📰|क्या आपने ख़बर देखी?|Did you see the news?
इंटरनेट|inṭarneṭ|internet|🌐|मैंने इंटरनेट पर देखा।|I saw it online.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'hi-g-hona', level: 'A1', icon: '🧩', en: 'To be: hai, hain, hū̃', fr: 'Être : hai, hain, hū̃',
    cards: [
      { en: 'The verb comes last. "To be": मैं हूँ (I am), तुम हो (you are, familiar), आप हैं (you are, polite), वह है (he/she is), हम हैं (we are).', fr: 'Le verbe en fin de phrase : हूँ, हो, है, हैं.', examples: [['मैं छात्र हूँ।', 'I’m a student.', 'I’m a student.'], ['आप कैसे हैं?', 'How are you?', 'How are you?']] },
    ],
    drills: [
      { text: 'मैं डॉक्टर ___।', answer: 'हूँ', wrong: ['है', 'हैं'], en: 'I’m a doctor.', fr: 'I’m a doctor.' },
      { text: 'वह मेरा भाई ___।', answer: 'है', wrong: ['हूँ', 'हो'], en: 'He’s my brother.', fr: 'He’s my brother.' },
      { text: 'हम दोस्त ___।', answer: 'हैं', wrong: ['है', 'हूँ'], en: 'We are friends.', fr: 'We are friends.' },
    ],
  },
  {
    id: 'hi-g-gender', level: 'A1', icon: '♀️', en: 'Gender and adjectives', fr: 'Genre et adjectifs',
    cards: [
      { en: 'Nouns are masculine or feminine. Adjectives ending in -ā change: बड़ा घर (big house, m), बड़ी गाड़ी (big car, f), बड़े घर (big houses).', fr: 'Les adjectifs en -ā s’accordent : -ā, -ī, -e.', examples: [['अच्छा लड़का', 'a good boy', 'a good boy'], ['अच्छी लड़की', 'a good girl', 'a good girl']] },
    ],
    drills: [
      { text: '___ लड़की।', answer: 'अच्छी', wrong: ['अच्छा', 'अच्छे'], en: 'A good girl.', fr: 'A good girl.' },
      { text: 'यह ___ घर है।', answer: 'बड़ा', wrong: ['बड़ी', 'बड़े'], en: 'This is a big house.', fr: 'This is a big house.' },
      { text: 'मेरी ___ गाड़ी।', answer: 'नई', wrong: ['नया', 'नए'], en: 'My new car.', fr: 'My new car.' },
    ],
  },
  {
    id: 'hi-g-present', level: 'A2', icon: '🔁', en: 'Present habitual', fr: 'Le présent d’habitude',
    cards: [
      { en: 'Habits: stem + -tā/-tī/-te + hai: मैं चाय पीता हूँ (I drink tea, said by a man), मैं चाय पीती हूँ (said by a woman).', fr: 'Habitude : radical + ता/ती/ते + être, selon le genre.', examples: [['वह हिंदी बोलती है।', 'She speaks Hindi.', 'She speaks Hindi.'], ['हम दिल्ली में रहते हैं।', 'We live in Delhi.', 'We live in Delhi.']] },
    ],
    drills: [
      { text: 'मैं (m) रोज़ चाय ___ हूँ।', answer: 'पीता', wrong: ['पीती', 'पीते'], en: 'I drink tea every day.', fr: 'I drink tea every day.' },
      { text: 'प्रिया हिंदी ___ है।', answer: 'बोलती', wrong: ['बोलता', 'बोलते'], en: 'Priya speaks Hindi.', fr: 'Priya speaks Hindi.' },
      { text: 'हम मुंबई में ___ हैं।', answer: 'रहते', wrong: ['रहता', 'रहती'], en: 'We live in Mumbai.', fr: 'We live in Mumbai.' },
    ],
  },
  {
    id: 'hi-g-postpositions', level: 'A2', icon: '📍', en: 'Postpositions: में, पर, का', fr: 'Postpositions : में, पर, का',
    cards: [
      { en: 'Where English uses prepositions, Hindi puts the word after: घर में (in the house), मेज़ पर (on the table), दिल्ली से (from Delhi).', fr: 'Les « prépositions » viennent après : में, पर, से.', examples: [['किताब मेज़ पर है।', 'The book is on the table.', 'The book is on the table.']] },
      { en: 'का / की / के = ’s (of), agreeing with the thing owned: राहुल का घर, राहुल की गाड़ी.', fr: 'का / की / के = de, accordé avec l’objet possédé.', examples: [['प्रिया का भाई', 'Priya’s brother', 'Priya’s brother'], ['प्रिया की बहन', 'Priya’s sister', 'Priya’s sister']] },
    ],
    drills: [
      { text: 'माँ रसोई ___ हैं।', answer: 'में', wrong: ['पर', 'का'], en: 'Mum is in the kitchen.', fr: 'Mum is in the kitchen.' },
      { text: 'किताब मेज़ ___ है।', answer: 'पर', wrong: ['में', 'की'], en: 'The book is on the table.', fr: 'The book is on the table.' },
      { text: 'राहुल ___ बहन।', answer: 'की', wrong: ['का', 'के'], en: 'Rahul’s sister.', fr: 'Rahul’s sister.' },
    ],
  },
  {
    id: 'hi-g-continuous', level: 'B1', icon: '⏯️', en: 'Doing now: rahā hai', fr: 'En train de : rahā hai',
    cards: [
      { en: 'Happening now: stem + रहा/रही/रहे + है: मैं खा रहा हूँ (I’m eating), वह पढ़ रही है (she’s reading).', fr: 'En cours : radical + रहा/रही/रहे + être.', examples: [['बारिश हो रही है।', 'It’s raining.', 'It’s raining.'], ['तुम क्या कर रहे हो?', 'What are you doing?', 'What are you doing?']] },
    ],
    drills: [
      { text: 'वह किताब पढ़ ___ है।', answer: 'रही', wrong: ['रहा', 'रहे'], en: 'She’s reading a book.', fr: 'She’s reading a book.' },
      { text: 'मैं (m) खाना खा ___ हूँ।', answer: 'रहा', wrong: ['रही', 'रहे'], en: 'I’m eating.', fr: 'I’m eating.' },
      { text: 'बच्चे खेल ___ हैं।', answer: 'रहे', wrong: ['रहा', 'रही'], en: 'The children are playing.', fr: 'The children are playing.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'hi-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a tea stall', fr: 'Commander un thé',
    lines: [
      { who: 'A', text: 'नमस्ते! क्या लेंगे?', en: 'Hello! What will you have?', fr: 'Hello! What will you have?' },
      { who: 'B', text: 'एक मसाला चाय और दो समोसे, प्लीज़।', en: 'A masala chai and two samosas, please.', fr: 'A masala chai and two samosas, please.', wrong: ['मैं समोसा हूँ।', 'बिल चाय है।'] },
      { who: 'A', text: 'यहीं खाएँगे या पैक करूँ?', en: 'Eat here or shall I pack it?', fr: 'Eat here or shall I pack it?' },
      { who: 'B', text: 'यहीं, धन्यवाद।', en: 'Here, thanks.', fr: 'Here, thanks.', wrong: ['मैं तीस साल का हूँ।', 'आज ठंड है।'] },
      { who: 'A', text: 'कुल पचास रुपये।', en: 'Fifty rupees in total.', fr: 'Fifty rupees in total.' },
      { who: 'B', text: 'क्या UPI चलेगा?', en: 'Can I pay with UPI?', fr: 'Can I pay with UPI?', wrong: ['शुभ रात्रि, रुपये!', 'समोसा कहाँ है?'] },
    ],
  },
  {
    id: 'hi-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'माफ़ कीजिए, स्टेशन कहाँ है?', en: 'Excuse me, where is the station?', fr: 'Excuse me, where is the station?', wrong: ['माफ़ कीजिए, स्टेशन कितने का है?', 'माफ़ कीजिए, मैं स्टेशन हूँ।'] },
      { who: 'A', text: 'सीधे जाइए, फिर बाएँ मुड़िए।', en: 'Go straight, then turn left.', fr: 'Go straight, then turn left.' },
      { who: 'B', text: 'क्या यह दूर है?', en: 'Is it far?', fr: 'Is it far?', wrong: ['क्या यह स्वादिष्ट है?', 'क्या आज सोमवार है?'] },
      { who: 'A', text: 'नहीं, पैदल पाँच मिनट।', en: 'No, five minutes on foot.', fr: 'No, five minutes on foot.' },
      { who: 'B', text: 'बहुत धन्यवाद!', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['शुभ रात्रि!', 'बधाई हो!'] },
    ],
  },
  {
    id: 'hi-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'नमस्ते! मैं आपकी क्या मदद कर सकती हूँ?', en: 'Hello! How can I help you?', fr: 'Hello! How can I help you?' },
      { who: 'B', text: 'स्मिथ के नाम से मेरी बुकिंग है।', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['मुझे सिरदर्द है।', 'एक चाय, प्लीज़।'] },
      { who: 'A', text: 'दो रातों के लिए डबल रूम। पासपोर्ट दिखाइए, प्लीज़।', en: 'A double room for two nights. Your passport, please.', fr: 'A double room for two nights. Your passport, please.' },
      { who: 'B', text: 'यह लीजिए। नाश्ता कितने बजे है?', en: 'Here you are. What time is breakfast?', fr: 'Here you are. What time is breakfast?', wrong: ['यह लीजिए। पासपोर्ट का समुद्र कहाँ है?', 'नहीं, मुझे भूख नहीं है।'] },
      { who: 'A', text: 'सात से दस बजे तक। आपका कमरा तीसरी मंज़िल पर है।', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'बढ़िया। क्या वाई-फ़ाई मुफ़्त है?', en: 'Great. Is the wifi free?', fr: 'Great. Is the wifi free?', wrong: ['बढ़िया। मैं मुफ़्त हूँ।', 'बढ़िया। मैं तीस साल का हूँ।'] },
    ],
  },
  {
    id: 'hi-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'नमस्ते। क्या तकलीफ़ है?', en: 'Hello. What’s the trouble?', fr: 'Hello. What’s the trouble?' },
      { who: 'B', text: 'मेरे गले में दर्द है और बुखार है।', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['मुझे समोसा चाहिए।', 'मेरा डबल रूम है।'] },
      { who: 'A', text: 'कब से?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'तीन दिन से।', en: 'For three days.', fr: 'For three days.', wrong: ['तीन बजे।', 'तीन रुपये।'] },
      { who: 'A', text: 'यह ज़ुकाम है। यह दवा लीजिए और आराम कीजिए।', en: 'It’s a cold. Take this medicine and rest.', fr: 'It’s a cold. Take this medicine and rest.' },
      { who: 'B', text: 'धन्यवाद, डॉक्टर साहब।', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['धन्यवाद, स्टेशन कहाँ है?', 'जन्मदिन मुबारक!'] },
    ],
  },
  {
    id: 'hi-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'इस वीकेंड क्या कर रही हो?', en: 'What are you doing this weekend?', fr: 'What are you doing this weekend?' },
      { who: 'B', text: 'अभी कुछ तय नहीं। क्यों?', en: 'Nothing decided yet. Why?', fr: 'Nothing decided yet. Why?', wrong: ['कल मैंने समोसा खाया।', 'मैं जयपुर में पैदा हुई।'] },
      { who: 'A', text: 'चलो मरीन ड्राइव पर घूमने चलते हैं?', en: 'Shall we go for a walk on Marine Drive?', fr: 'Shall we go for a walk on Marine Drive?' },
      { who: 'B', text: 'बढ़िया विचार! अगर बारिश नहीं हुई तो ज़रूर।', en: 'Great idea! If it doesn’t rain, definitely.', fr: 'Great idea! If it doesn’t rain, definitely.', wrong: ['बढ़िया विचार! पिछले साल मैं बीमार था।', 'नहीं, मेरे पास जूते नहीं हैं।'] },
      { who: 'A', text: 'तो शाम पाँच बजे स्टेशन पर मिलते हैं।', en: 'Then let’s meet at the station at five in the evening.', fr: 'Then let’s meet at the station at five in the evening.' },
      { who: 'B', text: 'ठीक है! मैं भुट्टा ले आऊँगी।', en: 'OK! I’ll bring roasted corn.', fr: 'OK! I’ll bring roasted corn.', wrong: ['ठीक है! मैं कल लाई।', 'नहीं, धन्यवाद, मैं स्टेशन हूँ।'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'hi-s-market', level: 'A1', icon: '🧺', en: 'Priya at the market', fr: 'Priya au marché',
    sentences: [
      ['प्रिया जयपुर में रहती है।', 'Priya lives in Jaipur.', 'Priya lives in Jaipur.'],
      ['शनिवार को वह बाज़ार जाती है।', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['वह आम, आलू और टमाटर खरीदती है।', 'She buys mangoes, potatoes and tomatoes.', 'She buys mangoes, potatoes and tomatoes.'],
      ['फिर वह विक्रम की दुकान पर चाय पीती है।', 'Then she has tea at Vikram’s stall.', 'Then she has tea at Vikram’s stall.'],
      ['विक्रम उसे एक समोसा देता है।', 'Vikram gives her a samosa.', 'Vikram gives her a samosa.'],
      ['प्रिया बहुत खुश है।', 'Priya is very happy.', 'Priya is very happy.'],
    ],
    glossary: { रहती: ['lives', 'lives'], शनिवार: ['Saturday', 'Saturday'], बाज़ार: ['market', 'market'], खरीदती: ['buys', 'buys'], फिर: ['then', 'then'], दुकान: ['stall / shop', 'stall / shop'], देता: ['gives', 'gives'], खुश: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Priya live?', fr: 'Where does Priya live?', answer: 'जयपुर', wrong: ['मुंबई', 'दिल्ली'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'आम, आलू और टमाटर', wrong: ['मछली और चावल', 'जूते'] },
      { en: 'What does Vikram give her?', fr: 'What does Vikram give her?', answer: 'एक समोसा', wrong: ['चाय', 'एक सेब'] },
    ],
  },
  {
    id: 'hi-s-train', level: 'A2', icon: '🚆', en: 'The missed train', fr: 'Le train raté',
    sentences: [
      ['रोहन की ट्रेन सुबह आठ बजे थी।', 'Rohan’s train was at eight in the morning.', 'Rohan’s train was at eight in the morning.'],
      ['लेकिन वह साढ़े सात बजे उठा।', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['उसने जल्दी कपड़े पहने और ऑटो लिया।', 'He dressed quickly and took an auto-rickshaw.', 'He dressed quickly and took an auto-rickshaw.'],
      ['वह आठ बजकर दो मिनट पर स्टेशन पहुँचा।', 'He reached the station at two minutes past eight.', 'He reached the station at two minutes past eight.'],
      ['ट्रेन जा चुकी थी।', 'The train had already gone.', 'The train had already gone.'],
      ['उसने अगली ट्रेन ली और रास्ते में किताब पढ़ी।', 'He took the next train and read a book on the way.', 'He took the next train and read a book on the way.'],
    ],
    glossary: { ट्रेन: ['train', 'train'], उठा: ['woke up', 'woke up'], जल्दी: ['quickly', 'quickly'], पहने: ['put on (clothes)', 'put on (clothes)'], पहुँचा: ['arrived', 'arrived'], चुकी: ['already (done)', 'already (done)'], अगली: ['next', 'next'], पढ़ी: ['read', 'read'] },
    questions: [
      { en: 'When did Rohan wake up?', fr: 'When did Rohan wake up?', answer: 'साढ़े सात बजे', wrong: ['आठ बजे', 'छह बजे'] },
      { en: 'How did he get to the station?', fr: 'How did he get to the station?', answer: 'ऑटो से', wrong: ['साइकिल से', 'पैदल'] },
      { en: 'What did he do on the next train?', fr: 'What did he do on the next train?', answer: 'किताब पढ़ी', wrong: ['सोया', 'खाना खाया'] },
    ],
  },
  {
    id: 'hi-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['दो साल पहले हमारी बिल्डिंग के लोगों को एक विचार आया।', 'Two years ago the people in our building had an idea.', 'Two years ago the people in our building had an idea.'],
      ['छत ख़ाली थी और कोई उसका इस्तेमाल नहीं करता था।', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['शर्मा आंटी ने सब्ज़ियाँ उगाने का सुझाव दिया।', 'Auntie Sharma suggested growing vegetables.', 'Auntie Sharma suggested growing vegetables.'],
      ['शुरू में सब लोग राज़ी नहीं थे।', 'At first not everyone agreed.', 'At first not everyone agreed.'],
      ['अब वहाँ टमाटर, पुदीना और मिर्च उगते हैं।', 'Now tomatoes, mint and chillies grow there.', 'Now tomatoes, mint and chillies grow there.'],
      ['और हर रविवार सब लोग छत पर साथ में खाना खाते हैं।', 'And every Sunday everyone eats together on the roof.', 'And every Sunday everyone eats together on the roof.'],
    ],
    glossary: { विचार: ['idea', 'idea'], छत: ['roof', 'roof'], ख़ाली: ['empty', 'empty'], कोई: ['anyone', 'anyone'], सुझाव: ['suggestion', 'suggestion'], शुरू: ['beginning', 'beginning'], राज़ी: ['agreed', 'agreed'], उगते: ['grow', 'grow'], साथ: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'शर्मा आंटी', wrong: ['प्रिया', 'रोहन'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'टमाटर, पुदीना और मिर्च', wrong: ['सेब और नाशपाती', 'आलू'] },
      { en: 'When does everyone eat together?', fr: 'When does everyone eat together?', answer: 'हर रविवार', wrong: ['हर सोमवार', 'साल में एक बार'] },
    ],
  },
];

export const HINDI_FULL: FullCourse = { topics, grammar, dialogues, stories };
