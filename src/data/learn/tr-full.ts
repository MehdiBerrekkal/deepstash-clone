import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Turkish, A1 → B1, for English speakers. Original content written for this app. Lines are "kelime|English|emoji|example|example in English". */
function w5(block: string): Word[] {
  return block
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [text, en, emoji, ex, exEn] = l.split('|').map((x) => x.trim());
      return { text, en, fr: en, emoji: emoji || '•', ...(ex ? { ex, exEn, exFr: exEn } : {}) };
    });
}
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `tr-${id}`, level, icon, en, fr, words: w5(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
merhaba|hello|👋|Merhaba, ben Elif.|Hello, I’m Elif.
günaydın|good morning|🌅|Günaydın, Ahmet Bey!|Good morning, Mr Ahmet!
iyi akşamlar|good evening|🌆|İyi akşamlar, hoş geldiniz.|Good evening, welcome.
güle güle|goodbye (to someone leaving)|🫡|Güle güle, yarın görüşürüz.|Goodbye, see you tomorrow.
teşekkürler|thanks|🙏|Çok teşekkürler!|Thanks a lot!
lütfen|please|🥺|Bir çay, lütfen.|A tea, please.
özür dilerim|I’m sorry|😅|Özür dilerim, geç kaldım.|I’m sorry, I’m late.
memnun oldum|nice to meet you|🤝|Memnun oldum, ben Can.|Nice to meet you, I’m Can.
isim|name|🏷️|Adınız ne?|What’s your name?
arkadaş|friend|👫|Can benim arkadaşım.|Can is my friend.
adam|man|👨|Adam gazete okuyor.|The man is reading the paper.
kadın|woman|👩|Kadın telefonda konuşuyor.|The woman is talking on the phone.
çocuk|child|🧒|Çocuk parkta oynuyor.|The child is playing in the park.
evet|yes|✅|Evet, tabii!|Yes, of course!
hayır|no|❌|Hayır, teşekkürler.|No, thanks.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
çay|tea|🍵|İki çay, lütfen.|Two teas, please.
kahve|coffee|☕|Bir Türk kahvesi, lütfen.|A Turkish coffee, please.
su|water|💧|Bir şişe su, lütfen.|A bottle of water, please.
meyve suyu|fruit juice|🧃|Portakal suyu.|Orange juice.
süt|milk|🥛|Sütlü kahve.|Coffee with milk.
şeker|sugar|🍬|Şekersiz, lütfen.|Without sugar, please.
simit|sesame bread ring|🥯|Bir simit ve bir çay.|A simit and a tea.
ekmek|bread|🍞|Taze ekmek.|Fresh bread.
hesap|the bill|🧾|Hesap, lütfen.|The bill, please.
garson|waiter|🤵|Garson hemen geliyor.|The waiter is coming right away.
istiyorum|I want|🙂|Bir çay istiyorum.|I want a tea.
ne kadar|how much|💵|Bu ne kadar?|How much is this?
lezzetli|delicious|😋|Çok lezzetli!|Very delicious!
sıcak|hot|♨️|Dikkat, çay sıcak.|Careful, the tea is hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
aile|family|👪|Ailem büyük.|My family is big.
anne|mother|👩|Annem öğretmen.|My mother is a teacher.
baba|father|👨|Babam doktor.|My father is a doctor.
kardeş|sibling|🧒|İki kardeşim var.|I have two siblings.
abla|older sister|👧|Ablam İzmir’de yaşıyor.|My older sister lives in İzmir.
ağabey|older brother|👦|Ağabeyim mühendis.|My older brother is an engineer.
oğul|son|👦|Oğulları on yaşında.|Their son is ten.
kız|daughter / girl|👧|Kızım resim yapmayı seviyor.|My daughter loves drawing.
dede|grandfather|👴|Dedem hikâye anlatıyor.|My grandfather tells stories.
nine|grandmother|👵|Ninem en güzel böreği yapar.|My grandmother makes the best börek.
eş|spouse|💑|Eşim mimar.|My spouse is an architect.
bebek|baby|👶|Bebek uyuyor.|The baby is sleeping.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
bir|one|1️⃣|Bir çay, lütfen.|One tea, please.
iki|two|2️⃣|İki bilet, lütfen.|Two tickets, please.
üç|three|3️⃣|Üç kişiyiz.|There are three of us.
dört|four|4️⃣|Dört çocuğu var.|He has four children.
beş|five|5️⃣|Beş lira.|Five lira.
altı|six|6️⃣|Altıda kalkarım.|I get up at six.
yedi|seven|7️⃣|Haftada yedi gün var.|There are seven days in a week.
sekiz|eight|8️⃣|Günde sekiz saat çalışırım.|I work eight hours a day.
dokuz|nine|9️⃣|Kızım dokuz yaşında.|My daughter is nine.
on|ten|🔟|Tren on dakika sonra kalkıyor.|The train leaves in ten minutes.
yüz|a hundred|💯|Otel yüz metre ileride.|The hotel is a hundred metres ahead.
kaç yaşındasın?|how old are you?|🎂|Kaç yaşındasın?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
pazartesi|Monday|1️⃣|Pazartesi çalışıyorum.|On Monday I work.
cuma|Friday|5️⃣|Cuma akşamı dışarı çıkıyoruz.|On Friday evening we go out.
cumartesi|Saturday|6️⃣|Cumartesi pazara gidiyorum.|On Saturday I go to the market.
pazar|Sunday / market|7️⃣|Pazar günü kahvaltı yapıyoruz.|On Sunday we have a big breakfast.
bugün|today|📅|Bugün hava güzel.|The weather is nice today.
yarın|tomorrow|🌄|Yarın görüşürüz!|See you tomorrow!
dün|yesterday|⬅️|Dün çok yorgundum.|Yesterday I was very tired.
sabah|morning|🌅|Sabah çay içerim.|I drink tea in the morning.
akşam|evening|🌆|Bu akşam ne yapıyorsun?|What are you doing this evening?
saat|hour / clock|🕐|Saat kaç?|What time is it?
hafta|week|🗓️|Haftada beş gün çalışırım.|I work five days a week.
zaman|time|⌛|Zamanım yok.|I don’t have time.
`),
  t('A1', 'food', '🥙', 'Food', 'La nourriture', `
yemek|food / meal|🍲|Yemek hazır.|The food is ready.
kebap|kebab|🥙|Adana kebap çok acı.|Adana kebab is very spicy.
börek|börek (savoury pastry)|🥧|Peynirli börek.|Cheese börek.
peynir|cheese|🧀|Kahvaltıda beyaz peynir.|White cheese at breakfast.
zeytin|olive|🫒|Siyah zeytin severim.|I like black olives.
domates|tomato|🍅|Domates salatası.|Tomato salad.
elma|apple|🍎|Kırmızı bir elma.|A red apple.
et|meat|🥩|Et yemiyorum.|I don’t eat meat.
balık|fish|🐟|Balık ekmek, lütfen.|A fish sandwich, please.
yumurta|egg|🥚|İki yumurta, lütfen.|Two eggs, please.
pilav|rice pilaf|🍚|Tavuklu pilav.|Rice with chicken.
çorba|soup|🥣|Mercimek çorbası.|Lentil soup.
yemek yemek|to eat|🍽️|Ne yemek istersin?|What would you like to eat?
içmek|to drink|🥤|Çok su içerim.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
ev|house / home|🏠|Evimiz eski.|Our house is old.
daire|flat|🏢|Küçük bir dairede oturuyorum.|I live in a small flat.
mutfak|kitchen|🍳|Mutfak çok aydınlık.|The kitchen is very bright.
oda|room|🚪|Odam sessiz.|My room is quiet.
banyo|bathroom|🛁|Banyo sağda.|The bathroom is on the right.
kapı|door|🚪|Kapıyı kapat, lütfen.|Close the door, please.
pencere|window|🪟|Pencereyi aç, sıcak.|Open the window, it’s hot.
yatak|bed|🛏️|Yatak çok rahat.|The bed is very comfortable.
sandalye|chair|🪑|Bir sandalye al.|Take a chair.
anahtar|key|🔑|Anahtarım nerede?|Where’s my key?
balkon|balcony|🪴|Balkonda çay içiyoruz.|We drink tea on the balcony.
oturmak|to live / to sit|🏡|İstanbul’da oturuyorum.|I live in Istanbul.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
sokak|street|🛣️|Bu sokakta oturuyorum.|I live on this street.
meydan|square|⛲|Meydanda buluşalım.|Let’s meet in the square.
istasyon|station|🚉|İstasyon yakın.|The station is close.
fırın|bakery|🥖|Fırın altıda açılıyor.|The bakery opens at six.
eczane|pharmacy|💊|Yakında eczane var mı?|Is there a pharmacy nearby?
market|grocery shop|🛒|Markete gidiyorum.|I’m going to the shop.
banka|bank|🏦|Banka kapalı.|The bank is closed.
müze|museum|🏛️|Müze pazartesi kapalı.|The museum is closed on Mondays.
cami|mosque|🕌|Cami çok güzel.|The mosque is very beautiful.
park|park|🌳|Parkta yürüyelim.|Let’s walk in the park.
sağ|right|➡️|Sağa dönün.|Turn right.
sol|left|⬅️|İstasyon solda.|The station is on the left.
düz|straight|⬆️|Düz gidin.|Go straight.
uzak|far|🧭|Uzak mı?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
kırmızı|red|🔴|Kırmızı bir araba.|A red car.
mavi|blue|🔵|Deniz mavi.|The sea is blue.
yeşil|green|🟢|Yeşil bir park.|A green park.
sarı|yellow|🟡|Sarı bir çiçek.|A yellow flower.
siyah|black|⚫|Siyah bir kedi.|A black cat.
beyaz|white|⚪|Beyaz bir gömlek.|A white shirt.
büyük|big|🐘|Büyük bir ev.|A big house.
küçük|small|🐭|Küçük bir köpek.|A small dog.
yeni|new|🆕|Yeni bir telefonum var.|I have a new phone.
eski|old|🏚️|Eski bir bina.|An old building.
güzel|beautiful|🌸|Ne güzel bir gün!|What a beautiful day!
pahalı|expensive|💎|Restoran pahalı.|The restaurant is expensive.
ucuz|cheap|🏷️|Bu otel ucuz.|This hotel is cheap.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
seyahat|travel / trip|🧳|İyi yolculuklar!|Have a good trip!
uçak|plane|✈️|Uçak onda kalkıyor.|The plane takes off at ten.
havalimanı|airport|🛫|Havalimanına taksiyle gidiyoruz.|We’re taking a taxi to the airport.
bilet|ticket|🎫|Biletleri internetten aldım.|I bought the tickets online.
bavul|suitcase|🧳|Bavulum çok ağır.|My suitcase is very heavy.
pasaport|passport|🛂|Pasaportunu unutma!|Don’t forget your passport!
tatil|holiday|🏝️|Ağustosta tatildeyiz.|We’re on holiday in August.
otel|hotel|🏨|Otel denize yakın.|The hotel is near the sea.
rezervasyon|booking|📋|Smith adına rezervasyonum var.|I have a booking under the name Smith.
kahvaltı|breakfast|🍳|Kahvaltı dahil mi?|Is breakfast included?
deniz|sea|🌊|Deniz bugün sakin.|The sea is calm today.
vapur|ferry|⛴️|Vapurla karşıya geçiyoruz.|We cross by ferry.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
doktor|doctor|👨‍⚕️|Doktora gitmem lazım.|I need to go to the doctor.
hasta|ill|🤒|Dünden beri hastayım.|I’ve been ill since yesterday.
ateş|fever|🌡️|Ateşim var.|I have a fever.
nezle|cold|🤧|Nezle oldum.|I’ve caught a cold.
öksürük|cough|😷|Öksürüğüm var.|I have a cough.
baş ağrısı|headache|🤕|Başım ağrıyor.|I have a headache.
ilaç|medicine|💊|Bu ilacı alın.|Take this medicine.
reçete|prescription|📃|İşte reçeteniz.|Here’s your prescription.
yorgun|tired|🥱|Çok yorgunum.|I’m very tired.
dinlenmek|to rest|🛋️|Dinlenmeniz lazım.|You need to rest.
ambulans|ambulance|🚑|Ambulans çağırın!|Call an ambulance!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
iş|work / job|💼|İşimi seviyorum.|I love my job.
çalışmak|to work|🧑‍💻|Bankada çalışıyorum.|I work in a bank.
ofis|office|🏢|Ofis merkezde.|The office is in the centre.
iş arkadaşı|colleague|🤝|İş arkadaşlarım çok iyi.|My colleagues are very nice.
patron|boss|😎|Patron toplantıda.|The boss is in a meeting.
toplantı|meeting|👥|Toplantı dokuzda.|The meeting is at nine.
maaş|salary|💵|Maaş iyi.|The salary is good.
mülakat|job interview|🤝|Yarın mülakatım var.|I have an interview tomorrow.
şirket|company|🏢|Büyük bir şirkette çalışıyor.|She works for a big company.
meşgul|busy|🏃|Şu an meşgulüm.|I’m busy right now.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
mutlu|happy|😊|Seni gördüğüme çok mutluyum.|I’m very happy to see you.
üzgün|sad|😢|Neden üzgünsün?|Why are you sad?
kızgın|angry|😠|Bugün çok kızgın.|He’s very angry today.
endişeli|worried|😟|Sınav için endişeliyim.|I’m worried about the exam.
gururlu|proud|🦚|Seninle gurur duyuyorum.|I’m proud of you.
şaşkın|surprised|😮|Çok şaşırdım.|I was very surprised.
korku|fear|😱|Örümceklerden korkarım.|I’m afraid of spiders.
sıkılmak|to be bored|🥱|Sıkıldım.|I’m bored.
özlemek|to miss|💌|Seni özledim.|I miss you.
rahat|relaxed / comfortable|😌|Tatilde çok rahatım.|I’m very relaxed on holiday.
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
bence|in my opinion|💬|Bence bu iyi bir fikir.|In my opinion, it’s a good idea.
sanırım|I think|💭|Sanırım haklısın.|I think you’re right.
haklı|right|✅|Haklısın.|You’re right.
katılmak|to agree|🤝|Sana katılıyorum.|I agree with you.
ama|but|↔️|Pahalı ama güzel.|Expensive, but nice.
bu yüzden|that’s why|➡️|Yağmur yağıyor, bu yüzden evdeyim.|It’s raining, so I’m at home.
belki|maybe|🤷|Belki yarın yağmur yağar.|Maybe it’ll rain tomorrow.
tabii ki|of course|✅|Tabii ki yardım ederim!|Of course I’ll help!
aslında|actually|📌|Aslında bilmiyorum.|Actually, I don’t know.
sorun|problem|❗|Sorun değil!|No problem!
`),
  t('B1', 'society', '🌍', 'Culture and society', 'Culture et société', `
kültür|culture|🎭|Türk kültürü çok zengin.|Turkish culture is very rich.
tarih|history|📜|Tarihi çok seviyorum.|I love history.
gelenek|tradition|🎎|Bu eski bir gelenek.|It’s an old tradition.
bayram|festival / holiday|🎉|Bayramda aileyi ziyaret ediyoruz.|At the holiday we visit family.
kitap|book|📕|Yeni bir kitap okuyorum.|I’m reading a new book.
müzik|music|🎵|Türk müziği dinliyorum.|I listen to Turkish music.
çevre|environment|🌍|Çevreyi korumalıyız.|We must protect the environment.
haber|news|📰|Haberleri izledin mi?|Did you watch the news?
internet|internet|🌐|İnternette buldum.|I found it online.
cep telefonu|mobile phone|📱|Cep telefonumu unuttum.|I forgot my phone.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'tr-g-harmony', level: 'A1', icon: '🎶', en: 'Vowel harmony', fr: 'L’harmonie vocalique',
    cards: [
      { en: 'Turkish adds endings to words, and the ending’s vowel matches the word’s last vowel. Plural: -ler after e, i, ö, ü; -lar after a, ı, o, u.', fr: 'Les suffixes s’accordent avec la dernière voyelle : -ler / -lar.', examples: [['ev → evler', 'house → houses', 'house → houses'], ['kitap → kitaplar', 'book → books', 'book → books']] },
    ],
    drills: [
      { text: 'ev___', answer: 'ler', wrong: ['lar', 'lır'], en: 'houses', fr: 'houses' },
      { text: 'kitap___', answer: 'lar', wrong: ['ler', 'lır'], en: 'books', fr: 'books' },
      { text: 'çocuk___', answer: 'lar', wrong: ['ler', 'lür'], en: 'children', fr: 'children' },
    ],
  },
  {
    id: 'tr-g-to-be', level: 'A1', icon: '🧩', en: '"To be" as an ending', fr: '« Être » comme suffixe',
    cards: [
      { en: '"To be" is an ending: öğretmenim (I’m a teacher), öğretmensin (you are), öğretmen (he/she is), öğretmeniz (we are).', fr: '« Être » se met en suffixe : -im, -sin, -iz…', examples: [['Ben öğrenciyim.', 'I’m a student.', 'I’m a student.'], ['Yorgunum.', 'I’m tired.', 'I’m tired.']] },
    ],
    drills: [
      { text: 'Ben doktor___.', answer: 'um', wrong: ['sun', 'uz'], en: 'I’m a doctor.', fr: 'I’m a doctor.' },
      { text: 'Sen yorgun___.', answer: 'sun', wrong: ['um', 'uz'], en: 'You are tired.', fr: 'You are tired.' },
      { text: 'Biz öğrenci___.', answer: 'yiz', wrong: ['yim', 'sin'], en: 'We are students.', fr: 'We are students.' },
    ],
  },
  {
    id: 'tr-g-present', level: 'A2', icon: '🔁', en: 'Present continuous: -iyor', fr: 'Le présent : -iyor',
    cards: [
      { en: 'For now and for habits: verb stem + -iyor + person ending: geliyorum (I’m coming), okuyorsun (you’re reading), çalışıyor (he’s working).', fr: 'Présent : radical + -iyor + personne.', examples: [['İstanbul’da yaşıyorum.', 'I live in Istanbul.', 'I live in Istanbul.'], ['Ne yapıyorsun?', 'What are you doing?', 'What are you doing?']] },
    ],
    drills: [
      { text: 'Ben kitap okuyor___.', answer: 'um', wrong: ['sun', 'uz'], en: 'I’m reading a book.', fr: 'I’m reading a book.' },
      { text: 'O bankada çalış___.', answer: 'ıyor', wrong: ['ıyorum', 'ıyorsun'], en: 'She works at a bank.', fr: 'She works at a bank.' },
      { text: 'Biz Ankara’da yaşıyor___.', answer: 'uz', wrong: ['um', 'sun'], en: 'We live in Ankara.', fr: 'We live in Ankara.' },
    ],
  },
  {
    id: 'tr-g-var', level: 'A2', icon: '🤲', en: 'Var / yok: there is, I have', fr: 'Var / yok : il y a, j’ai',
    cards: [
      { en: 'var = there is / exists, yok = there isn’t. With a possessive ending it means "have": arabam var (I have a car), zamanım yok (I don’t have time).', fr: 'var / yok ; avec possessif = avoir.', examples: [['Evde süt var.', 'There’s milk at home.', 'There’s milk at home.'], ['Kardeşim yok.', 'I don’t have siblings.', 'I don’t have siblings.']] },
    ],
    drills: [
      { text: 'Arabam ___.', answer: 'var', wrong: ['yok mu', 'değil'], en: 'I have a car.', fr: 'I have a car.' },
      { text: 'Zamanım ___.', answer: 'yok', wrong: ['var', 'değil'], en: 'I don’t have time.', fr: 'I don’t have time.' },
      { text: 'Burada eczane ___ mı?', answer: 'var', wrong: ['yok', 'değil'], en: 'Is there a pharmacy here?', fr: 'Is there a pharmacy here?' },
    ],
  },
  {
    id: 'tr-g-past', level: 'B1', icon: '⏮️', en: 'Past tense: -di', fr: 'Le passé : -di',
    cards: [
      { en: 'Past: stem + -di (with harmony: -di, -dı, -du, -dü, or -ti after hard consonants) + person: geldim (I came), gittin (you went), aldı (she bought).', fr: 'Passé : -di / -dı / -du / -dü (+ personne).', examples: [['Dün sinemaya gittim.', 'Yesterday I went to the cinema.', 'Yesterday I went to the cinema.']] },
    ],
    drills: [
      { text: 'Dün çok çalış___.', answer: 'tım', wrong: ['ıyorum', 'acağım'], en: 'Yesterday I worked a lot.', fr: 'Yesterday I worked a lot.' },
      { text: 'Elif markete git___.', answer: 'ti', wrong: ['tim', 'ıyor'], en: 'Elif went to the shop.', fr: 'Elif went to the shop.' },
      { text: 'Biz pizza ye___.', answer: 'dik', wrong: ['dim', 'di'], en: 'We ate pizza.', fr: 'We ate pizza.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'tr-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Hoş geldiniz! Ne alırsınız?', en: 'Welcome! What will you have?', fr: 'Welcome! What will you have?' },
      { who: 'B', text: 'Bir çay ve bir simit, lütfen.', en: 'A tea and a simit, please.', fr: 'A tea and a simit, please.', wrong: ['Ben bir simitim.', 'Hesap bir çay.'] },
      { who: 'A', text: 'Burada mı, paket mi?', en: 'Here or takeaway?', fr: 'Here or takeaway?' },
      { who: 'B', text: 'Burada, teşekkürler.', en: 'Here, thanks.', fr: 'Here, thanks.', wrong: ['Otuz yaşındayım.', 'Hava soğuk.'] },
      { who: 'A', text: 'Toplam altmış lira.', en: 'Sixty lira altogether.', fr: 'Sixty lira altogether.' },
      { who: 'B', text: 'Kartla ödeyebilir miyim?', en: 'Can I pay by card?', fr: 'Can I pay by card?', wrong: ['İyi geceler, lira!', 'Simit nerede?'] },
    ],
  },
  {
    id: 'tr-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Affedersiniz, metro nerede?', en: 'Excuse me, where is the metro?', fr: 'Excuse me, where is the metro?', wrong: ['Affedersiniz, metro ne kadar?', 'Affedersiniz, ben metroyum.'] },
      { who: 'A', text: 'Düz gidin, sonra sola dönün.', en: 'Go straight, then turn left.', fr: 'Go straight, then turn left.' },
      { who: 'B', text: 'Uzak mı?', en: 'Is it far?', fr: 'Is it far?', wrong: ['Lezzetli mi?', 'Pazartesi mi?'] },
      { who: 'A', text: 'Hayır, yürüyerek beş dakika.', en: 'No, five minutes on foot.', fr: 'No, five minutes on foot.' },
      { who: 'B', text: 'Çok teşekkür ederim!', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['Afiyet olsun!', 'İyi geceler!'] },
    ],
  },
  {
    id: 'tr-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'İyi akşamlar! Nasıl yardımcı olabilirim?', en: 'Good evening! How can I help?', fr: 'Good evening! How can I help?' },
      { who: 'B', text: 'Smith adına rezervasyonum var.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['Başım ağrıyor.', 'Bir çay, lütfen.'] },
      { who: 'A', text: 'İki gece, çift kişilik oda. Pasaportunuz, lütfen.', en: 'Two nights, double room. Your passport, please.', fr: 'Two nights, double room. Your passport, please.' },
      { who: 'B', text: 'Buyurun. Kahvaltı saat kaçta?', en: 'Here you are. What time is breakfast?', fr: 'Here you are. What time is breakfast?', wrong: ['Buyurun. Pasaportun denizi nerede?', 'Hayır, aç değilim.'] },
      { who: 'A', text: 'Yediden ona kadar. Odanız üçüncü katta.', en: 'From seven to ten. Your room is on the third floor.', fr: 'From seven to ten. Your room is on the third floor.' },
      { who: 'B', text: 'Harika. İnternet ücretsiz mi?', en: 'Great. Is the internet free?', fr: 'Great. Is the internet free?', wrong: ['Harika. Ben ücretsizim.', 'Harika. Otuz yaşındayım.'] },
    ],
  },
  {
    id: 'tr-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Merhaba. Şikâyetiniz nedir?', en: 'Hello. What’s the problem?', fr: 'Hello. What’s the problem?' },
      { who: 'B', text: 'Boğazım ağrıyor ve ateşim var.', en: 'My throat hurts and I have a fever.', fr: 'My throat hurts and I have a fever.', wrong: ['Kebap istiyorum.', 'Çift kişilik odam var.'] },
      { who: 'A', text: 'Ne zamandan beri?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'Üç gündür.', en: 'For three days.', fr: 'For three days.', wrong: ['Saat üçte.', 'Üç lira, lütfen.'] },
      { who: 'A', text: 'Grip olmuşsunuz. İşte reçete. İyi dinlenin.', en: 'You have the flu. Here’s the prescription. Rest well.', fr: 'You have the flu. Here’s the prescription. Rest well.' },
      { who: 'B', text: 'Teşekkürler, doktor bey.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Teşekkürler, istasyon nerede?', 'Şerefe!'] },
    ],
  },
  {
    id: 'tr-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'Hafta sonu ne yapıyorsun?', en: 'What are you doing at the weekend?', fr: 'What are you doing at the weekend?' },
      { who: 'B', text: 'Henüz bir planım yok. Neden?', en: 'No plans yet. Why?', fr: 'No plans yet. Why?', wrong: ['Dün kebap yedim.', 'İzmir’de doğdum.'] },
      { who: 'A', text: 'Vapurla Adalar’a gidelim mi?', en: 'Shall we take the ferry to the Islands?', fr: 'Shall we take the ferry to the Islands?' },
      { who: 'B', text: 'Harika fikir! Hava güzel olursa gelirim.', en: 'Great idea! If the weather’s nice, I’ll come.', fr: 'Great idea! If the weather’s nice, I’ll come.', wrong: ['Harika fikir! Geçen yıl hastaydım.', 'Hayır, ayakkabım yok.'] },
      { who: 'A', text: 'O zaman saat onda iskelede buluşalım.', en: 'Then let’s meet at the pier at ten.', fr: 'Then let’s meet at the pier at ten.' },
      { who: 'B', text: 'Anlaştık! Ben simit getiririm.', en: 'Deal! I’ll bring simit.', fr: 'Deal! I’ll bring simit.', wrong: ['Anlaştık! Dün getirdim.', 'Hayır teşekkürler, ben iskeleyim.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'tr-s-market', level: 'A1', icon: '🧺', en: 'Elif at the market', fr: 'Elif au marché',
    sentences: [
      ['Elif İstanbul’da oturuyor.', 'Elif lives in Istanbul.', 'Elif lives in Istanbul.'],
      ['Cumartesi günü pazara gidiyor.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['Domates, peynir ve ekmek alıyor.', 'She buys tomatoes, cheese and bread.', 'She buys tomatoes, cheese and bread.'],
      ['Sonra Mehmet’in kafesinde çay içiyor.', 'Then she has tea at Mehmet’s café.', 'Then she has tea at Mehmet’s café.'],
      ['Mehmet ona bir simit ikram ediyor.', 'Mehmet offers her a simit.', 'Mehmet offers her a simit.'],
      ['Elif çok mutlu.', 'Elif is very happy.', 'Elif is very happy.'],
    ],
    glossary: { oturuyor: ['lives', 'lives'], cumartesi: ['Saturday', 'Saturday'], pazara: ['to the market', 'to the market'], alıyor: ['buys', 'buys'], sonra: ['then', 'then'], içiyor: ['drinks', 'drinks'], ikram: ['offering', 'offering'], mutlu: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Elif live?', fr: 'Where does Elif live?', answer: 'İstanbul', wrong: ['Ankara', 'İzmir'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'domates, peynir ve ekmek', wrong: ['balık ve pilav', 'ayakkabı'] },
      { en: 'What does Mehmet offer her?', fr: 'What does Mehmet offer her?', answer: 'bir simit', wrong: ['bir kahve', 'bir elma'] },
    ],
  },
  {
    id: 'tr-s-train', level: 'A2', icon: '⛴️', en: 'The missed ferry', fr: 'Le ferry raté',
    sentences: [
      ['Can’ın sabah sekizde bir vapuru vardı.', 'Can had a ferry at eight in the morning.', 'Can had a ferry at eight in the morning.'],
      ['Ama yedi buçukta uyandı.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Hızlıca giyindi ve taksiye bindi.', 'He got dressed quickly and took a taxi.', 'He got dressed quickly and took a taxi.'],
      ['İskeleye sekizi iki geçe vardı.', 'He reached the pier at two minutes past eight.', 'He reached the pier at two minutes past eight.'],
      ['Vapur çoktan kalkmıştı.', 'The ferry had already left.', 'The ferry had already left.'],
      ['Bir sonraki vapura bindi ve kitap okudu.', 'He took the next ferry and read a book.', 'He took the next ferry and read a book.'],
    ],
    glossary: { vapuru: ['his ferry', 'his ferry'], uyandı: ['woke up', 'woke up'], hızlıca: ['quickly', 'quickly'], giyindi: ['got dressed', 'got dressed'], vardı: ['arrived / there was', 'arrived / there was'], çoktan: ['already', 'already'], kalkmıştı: ['had left', 'had left'], sonraki: ['next', 'next'], okudu: ['read', 'read'] },
    questions: [
      { en: 'What time did Can wake up?', fr: 'What time did Can wake up?', answer: 'yedi buçukta', wrong: ['sekizde', 'altıda'] },
      { en: 'How did he get to the pier?', fr: 'How did he get to the pier?', answer: 'taksiyle', wrong: ['bisikletle', 'yürüyerek'] },
      { en: 'What did he do on the next ferry?', fr: 'What did he do on the next ferry?', answer: 'kitap okudu', wrong: ['uyudu', 'yemek yedi'] },
    ],
  },
  {
    id: 'tr-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['İki yıl önce apartmanımızın sakinleri bir fikir buldu.', 'Two years ago the residents of our building came up with an idea.', 'Two years ago the residents of our building came up with an idea.'],
      ['Çatı boştu ve kimse kullanmıyordu.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Ayşe Teyze bir bostan yapmayı önerdi.', 'Auntie Ayşe suggested making a vegetable garden.', 'Auntie Ayşe suggested making a vegetable garden.'],
      ['Başta herkes ikna olmadı.', 'At first not everyone was convinced.', 'At first not everyone was convinced.'],
      ['Şimdi orada domates, nane ve çilek yetişiyor.', 'Now tomatoes, mint and strawberries grow there.', 'Now tomatoes, mint and strawberries grow there.'],
      ['Ve her pazar herkes çatıda birlikte kahvaltı yapıyor.', 'And every Sunday everyone has breakfast together on the roof.', 'And every Sunday everyone has breakfast together on the roof.'],
    ],
    glossary: { sakinleri: ['residents', 'residents'], çatı: ['roof', 'roof'], boştu: ['was empty', 'was empty'], kimse: ['nobody', 'nobody'], bostan: ['vegetable garden', 'vegetable garden'], önerdi: ['suggested', 'suggested'], başta: ['at first', 'at first'], yetişiyor: ['grow', 'grow'], birlikte: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'Ayşe Teyze', wrong: ['Elif', 'Can'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'domates, nane ve çilek', wrong: ['elma ve armut', 'patates'] },
      { en: 'When does everyone have breakfast together?', fr: 'When does everyone have breakfast together?', answer: 'her pazar', wrong: ['her pazartesi', 'yılda bir kez'] },
    ],
  },
];

export const TURKISH_FULL: FullCourse = { topics, grammar, dialogues, stories };
