import type { Level, Topic, Word } from '@/data/learn/full';

/** Hindi, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "word|romanization|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
जाना|jānā|to go|🚶|मैं बस से दफ़्तर जाता हूँ।|I go to the office by bus.
आना|ānā|to come|👋|क्या तुम पार्टी में आ रहे हो?|Are you coming to the party?
करना|karnā|to do|🛠️|आज शाम क्या कर रहे हो?|What are you doing this evening?
देखना|dekhnā|to see / watch|👀|हम फ़िल्म देख रहे हैं।|We’re watching a film.
सुनना|sunnā|to listen|🎧|मैं गाने सुनता हूँ।|I listen to songs.
बोलना|bolnā|to speak|🗣️|क्या आप अंग्रेज़ी बोलते हैं?|Do you speak English?
कहना|kahnā|to say|💬|उसने क्या कहा?|What did he say?
जानना|jānnā|to know|🧠|मुझे नहीं पता।|I don’t know.
चाहना|chāhnā|to want|🙏|मैं चाय चाहता हूँ।|I want tea.
सकना|saknā|can|💪|क्या मैं मदद कर सकता हूँ?|Can I help?
लिखना|likhnā|to write|✍️|मैं चिट्ठी लिख रहा हूँ।|I’m writing a letter.
पढ़ना|paṛhnā|to read / study|📖|मैं रोज़ पढ़ता हूँ।|I read every day.
सोना|sonā|to sleep|😴|मैं आठ घंटे सोता हूँ।|I sleep eight hours.
इंतज़ार करना|intazār karnā|to wait|⏳|मैं तुम्हारा इंतज़ार करूँगा।|I’ll wait for you.
लेना|lenā|to take|✋|छाता ले लो।|Take an umbrella.
देना|denā|to give|🎁|मुझे पानी दो।|Give me water.
खोलना|kholnā|to open|🔓|खिड़की खोलो।|Open the window.
बंद करना|band karnā|to close|🔒|दरवाज़ा बंद करो।|Close the door.
ढूँढना|ḍhū̃ḍhnā|to look for|🔍|मैं अपनी चाबी ढूँढ रहा हूँ।|I’m looking for my key.
समझना|samajhnā|to understand|💡|मैं नहीं समझा।|I didn’t understand.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
उठना|uṭhnā|to get up|⏰|मैं सात बजे उठता हूँ।|I get up at seven.
नहाना|nahānā|to bathe / shower|🚿|मैं सुबह नहाता हूँ।|I bathe in the morning.
कपड़े पहनना|kapṛe pahannā|to get dressed|👔|मैं जल्दी कपड़े पहनता हूँ।|I get dressed quickly.
दोपहर का खाना|dopahar kā khānā|lunch|🥗|दोपहर का खाना एक बजे है।|Lunch is at one.
रात का खाना|rāt kā khānā|dinner|🍛|रात का खाना तैयार है!|Dinner is ready!
दाँत साफ़ करना|dā̃t sāf karnā|to brush teeth|🪥|दाँत साफ़ करो!|Brush your teeth!
सोने जाना|sone jānā|to go to bed|🌙|मैं ग्यारह बजे सोने जाता हूँ।|I go to bed at eleven.
निकलना|nikalnā|to leave / go out|🚪|मैं आठ बजे घर से निकलता हूँ।|I leave home at eight.
लौटना|lauṭnā|to return|↩️|मैं छह बजे लौटता हूँ।|I come back at six.
जल्दी|jaldī|early / quickly|🌅|मैं जल्दी आया।|I came early.
देर से|der se|late|🌆|वह हमेशा देर से आता है।|He always comes late.
हमेशा|hameshā|always|♾️|मैं हमेशा चाय पीता हूँ।|I always drink tea.
कभी नहीं|kabhī nahī̃|never|🚫|मैं कभी शराब नहीं पीता।|I never drink alcohol.
कभी-कभी|kabhī-kabhī|sometimes|🔀|कभी-कभी मैं जिम जाता हूँ।|Sometimes I go to the gym.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
क्या|kyā|what|❓|यह क्या है?|What is this?
कौन|kaun|who|🕵️|वह कौन है?|Who is that?
कहाँ|kahā̃|where|📍|बाथरूम कहाँ है?|Where is the bathroom?
कब|kab|when|📆|तुम्हारा जन्मदिन कब है?|When is your birthday?
क्यों|kyõ|why|🤔|तुम उदास क्यों हो?|Why are you sad?
कैसे|kaise|how|🤷|आप कैसे हैं?|How are you?
कितना|kitnā|how much|🔢|यह कितना है?|How much is this?
कौन-सा|kaun-sā|which|☝️|कौन-सी फ़िल्म?|Which film?
क्योंकि|kyõki|because|💡|मैं हिंदी सीखता हूँ क्योंकि मुझे भारत पसंद है।|I learn Hindi because I like India.
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
कुत्ता|kuttā|dog|🐕|मेरा कुत्ता बहुत प्यारा है।|My dog is very sweet.
बिल्ली|billī|cat|🐈|बिल्ली सो रही है।|The cat is sleeping.
चिड़िया|chiṛiyā|bird|🐦|चिड़िया गा रही है।|The bird is singing.
घोड़ा|ghoṛā|horse|🐎|घोड़ा तेज़ दौड़ता है।|The horse runs fast.
गाय|gāy|cow|🐄|गाय दूध देती है।|The cow gives milk.
हाथी|hāthī|elephant|🐘|हाथी बहुत बड़ा है।|The elephant is very big.
शेर|sher|lion / tiger|🦁|शेर जंगल का राजा है।|The lion is the king of the jungle.
बंदर|bandar|monkey|🐒|बंदर केला खा रहा है।|The monkey is eating a banana.
मोर|mor|peacock|🦚|मोर भारत का राष्ट्रीय पक्षी है।|The peacock is India’s national bird.
तितली|titlī|butterfly|🦋|फूल पर तितली।|A butterfly on a flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
कमीज़|kamīz|shirt|👔|सफ़ेद कमीज़।|A white shirt.
पैंट|paiṇṭ|trousers|👖|यह पैंट बहुत लंबी है।|These trousers are too long.
साड़ी|sāṛī|sari|🥻|वह लाल साड़ी पहने है।|She’s wearing a red sari.
कुर्ता|kurtā|kurta|👘|दिवाली के लिए नया कुर्ता।|A new kurta for Diwali.
जूते|jūte|shoes|👞|मुझे नए जूते चाहिए।|I need new shoes.
कोट|koṭ|coat|🧥|कोट पहन लो, ठंड है।|Put on your coat, it’s cold.
टोपी|ṭopī|cap / hat|🧢|धूप के लिए टोपी।|A cap for the sun.
चश्मा|chashmā|glasses|👓|मेरा चश्मा कहाँ है?|Where are my glasses?
पहनना|pahannā|to wear|🧥|वह हमेशा टाई पहनता है।|He always wears a tie.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
मौसम|mausam|weather / season|🌤️|आज मौसम कैसा है?|How’s the weather today?
धूप|dhūp|sunshine|☀️|आज धूप है।|It’s sunny today.
बारिश|bāriś|rain|🌧️|बारिश हो रही है।|It’s raining.
हवा|havā|wind / air|🌬️|तेज़ हवा चल रही है।|A strong wind is blowing.
गर्मी|garmī|heat / summer|🥵|आज बहुत गर्मी है।|It’s very hot today.
ठंड|ṭhaṇḍ|cold|🥶|दिल्ली में सर्दी में ठंड होती है।|Delhi is cold in winter.
बादल|bādal|cloud|☁️|आसमान में बादल हैं।|There are clouds in the sky.
छाता|chhātā|umbrella|☂️|छाता ले जाओ।|Take an umbrella.
मानसून|mānsūn|monsoon|🌧️|जुलाई में मानसून आता है।|The monsoon comes in July.
सर्दी|sardī|winter / cold|☃️|सर्दी में रज़ाई चाहिए।|You need a quilt in winter.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
स्कूल|skūl|school|🏫|स्कूल पास में है।|The school is nearby.
कक्षा|kakṣā|class|🧑‍🏫|कक्षा आठ बजे शुरू होती है।|Class starts at eight.
अध्यापक|adhyāpak|teacher|👩‍🏫|अध्यापक अच्छा समझाते हैं।|The teacher explains well.
छात्र|chhātra|student|🧑‍🎓|कक्षा में बीस छात्र हैं।|There are twenty students in the class.
किताब|kitāb|book|📕|किताब का दसवाँ पन्ना खोलो।|Open the book at page ten.
कॉपी|kopī|exercise book|📓|कॉपी में लिखो।|Write in the exercise book.
पेन|pen|pen|🖊️|क्या तुम्हारे पास पेन है?|Do you have a pen?
गृहकार्य|gṛhakārya|homework|📝|मेरे पास बहुत गृहकार्य है।|I have a lot of homework.
सवाल|savāl|question|❓|मेरा एक सवाल है।|I have a question.
जवाब|javāb|answer|💡|जवाब सही है।|The answer is right.
सीखना|sīkhnā|to learn|🌱|मैं रोज़ दस शब्द सीखता हूँ।|I learn ten words every day.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
थाली|thālī|plate / platter|🍽️|थाली में दाल, चावल और रोटी।|Dal, rice and roti on the platter.
गिलास|gilās|glass|🥛|एक गिलास पानी।|A glass of water.
कप|kap|cup|☕|एक कप चाय।|A cup of tea.
चाकू|chākū|knife|🔪|चाकू तेज़ है।|The knife is sharp.
चम्मच|chammach|spoon|🥄|चम्मच से खाओ।|Eat with a spoon.
बर्तन|bartan|utensils / dishes|🍲|मैं बर्तन धोता हूँ।|I wash the dishes.
तवा|tavā|griddle|🫓|तवे पर रोटी।|Roti on the griddle.
नमक|namak|salt|🧂|नमक देना, प्लीज़।|Please pass the salt.
घी|ghī|ghee|🧈|रोटी पर घी।|Ghee on the roti.
काटना|kāṭnā|to cut|✂️|प्याज़ काटो।|Cut the onions.
पकाना|pakānā|to cook|👩‍🍳|माँ खाना पका रही हैं।|Mum is cooking.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
कल रात|kal rāt|last night|🌃|कल रात हम सिनेमा गए।|Last night we went to the cinema.
पिछले हफ़्ते|pichhle hafte|last week|🗓️|पिछले हफ़्ते मैं बीमार था।|Last week I was ill.
पिछले साल|pichhle sāl|last year|🎆|पिछले साल हम गोवा गए।|Last year we went to Goa.
दो दिन पहले|do din pahle|two days ago|⌛|मैं दो दिन पहले आया।|I arrived two days ago.
गया|gayā|went|🚶|मैं बाज़ार गया।|I went to the market.
खाया|khāyā|ate|🍽️|मैंने समोसा खाया।|I ate a samosa.
देखा|dekhā|saw|👀|मैंने प्रिया को देखा।|I saw Priya.
खरीदा|kharīdā|bought|🛍️|मैंने नया फ़ोन खरीदा।|I bought a new phone.
बचपन में|bachpan mẽ|in childhood|🧒|बचपन में मैं गाँव में रहता था।|As a child I lived in a village.
पहले|pahle|before / formerly|🕰️|पहले यहाँ सिनेमा था।|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
ठीक है|ṭhīk hai|OK|👌|ठीक है, कल मिलते हैं!|OK, see you tomorrow!
बिल्कुल|bilkul|absolutely|✅|बिल्कुल सही!|Absolutely right!
कोई बात नहीं|koī bāt nahī̃|no problem / never mind|😌|कोई बात नहीं, होता है।|Never mind, it happens.
अफ़सोस|afsos|what a pity|😞|अफ़सोस है कि तुम नहीं आ रहे।|It’s a pity you’re not coming.
शुभकामनाएँ|shubhkāmnāẽ|best wishes|🍀|परीक्षा के लिए शुभकामनाएँ!|Best wishes for the exam!
बधाई हो|badhāī ho|congratulations|🎉|बधाई हो!|Congratulations!
जन्मदिन मुबारक|janmadin mubārak|happy birthday|🎂|जन्मदिन मुबारक हो!|Happy birthday!
चलो|chalo|let’s go / come on|💪|चलो, चलते हैं!|Come on, let’s go!
अरे वाह|are vāh|wow!|🤩|अरे वाह, कितना सुंदर!|Wow, how beautiful!
जी|jī|yes (polite) / sir, madam|🙏|जी हाँ।|Yes, indeed.
भगवान का शुक्र है|bhagvān kā shukra hai|thank God|🙏|भगवान का शुक्र है, सब ठीक है।|Thank God, all is well.
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
भी|bhī|also|➕|मैं भी स्पेनिश बोलता हूँ।|I also speak Spanish.
इसके अलावा|iske alāvā|besides|📎|इसके अलावा, यह मुफ़्त है।|Besides, it’s free.
जब|jab|when (conjunction)|📆|जब तुम पहुँचो, फ़ोन करना।|Call when you arrive.
जबकि|jabki|whereas|⚖️|मुझे समुद्र पसंद है, जबकि उसे पहाड़।|I like the sea, whereas he likes the mountains.
हालाँकि|hālā̃ki|although|🌗|हालाँकि मैं थका हूँ, मैं आऊँगा।|Although I’m tired, I’ll come.
पहले तो|pahle to|first of all|1️⃣|पहले तो, धन्यवाद।|First of all, thank you.
आख़िर में|ākhir mẽ|finally|🏁|आख़िर में, बजट की बात करते हैं।|Finally, let’s talk about the budget.
जैसे|jaise|for example / like|📌|मुझे फल पसंद हैं, जैसे आम।|I like fruit, like mangoes.
फिर भी|phir bhī|still / even so|💪|बारिश थी, फिर भी हम गए।|It was raining; even so, we went.
`),
];
