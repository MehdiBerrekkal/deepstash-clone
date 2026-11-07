import type { Level, Topic, Word } from '@/data/learn/full';

/** Turkish, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "kelime|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
gitmek|to go|🚶|İşe otobüsle gidiyorum.|I go to work by bus.
gelmek|to come|👋|Partiye geliyor musun?|Are you coming to the party?
yapmak|to do / make|🛠️|Bu akşam ne yapıyorsun?|What are you doing tonight?
görmek|to see|👀|Pencereden denizi görüyorum.|I can see the sea from the window.
izlemek|to watch|📺|Film izliyoruz.|We’re watching a film.
dinlemek|to listen|🎧|Müzik dinliyorum.|I’m listening to music.
konuşmak|to speak|🗣️|İngilizce konuşuyor musun?|Do you speak English?
söylemek|to say|💬|Ne söyledi?|What did he say?
bilmek|to know|🧠|Bilmiyorum.|I don’t know.
istemek|to want|🙏|Bir kahve istiyorum.|I want a coffee.
yazmak|to write|✍️|Mektup yazıyorum.|I’m writing a letter.
okumak|to read|📖|Her gün kitap okurum.|I read a book every day.
uyumak|to sleep|😴|Sekiz saat uyurum.|I sleep eight hours.
beklemek|to wait|⏳|Seni istasyonda bekliyorum.|I’m waiting for you at the station.
almak|to take / buy|✋|Şemsiyeni al.|Take your umbrella.
vermek|to give|🎁|Elini ver.|Give me your hand.
açmak|to open|🔓|Pencereyi aç.|Open the window.
kapatmak|to close|🔒|Kapıyı kapat.|Close the door.
aramak|to look for / call|🔍|Anahtarlarımı arıyorum.|I’m looking for my keys.
anlamak|to understand|💡|Anlamıyorum.|I don’t understand.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
uyanmak|to wake up|⏰|Yedide uyanırım.|I wake up at seven.
kalkmak|to get up|🛏️|Erken kalkarım.|I get up early.
duş almak|to shower|🚿|Sabah duş alırım.|I shower in the morning.
giyinmek|to get dressed|👔|Hızlıca giyinirim.|I get dressed quickly.
öğle yemeği|lunch|🥗|Öğle yemeği saat birde.|Lunch is at one.
akşam yemeği|dinner|🍝|Akşam yemeği hazır!|Dinner is ready!
dişlerini fırçalamak|to brush your teeth|🪥|Dişlerini fırçala!|Brush your teeth!
yatmak|to go to bed|🌙|On birde yatarım.|I go to bed at eleven.
çıkmak|to go out|🚪|Sekizde evden çıkarım.|I leave home at eight.
dönmek|to come back|↩️|Altıda eve dönerim.|I come home at six.
erken|early|🌅|Erken geldim.|I came early.
geç|late|🌆|Geç kaldım!|I’m late!
her zaman|always|♾️|Her zaman çay içerim.|I always drink tea.
hiç|never / at all|🚫|Hiç sigara içmem.|I never smoke.
bazen|sometimes|🔀|Bazen spor salonuna giderim.|Sometimes I go to the gym.
genellikle|usually|📅|Genellikle yürüyerek giderim.|I usually walk.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
ne|what|❓|Bu ne?|What is this?
kim|who|🕵️|O kim?|Who is that?
nerede|where|📍|Tuvalet nerede?|Where is the toilet?
ne zaman|when|📆|Doğum günün ne zaman?|When is your birthday?
neden|why|🤔|Neden üzgünsün?|Why are you sad?
nasıl|how|🤷|Nasılsın?|How are you?
kaç|how many|🔢|Kaç kişi geliyor?|How many people are coming?
hangi|which|☝️|Hangi film?|Which film?
çünkü|because|💡|Türkçe öğreniyorum çünkü İstanbul’u seviyorum.|I’m learning Turkish because I love Istanbul.
nereli|where from|🌍|Nerelisin?|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
köpek|dog|🐕|Köpeğimin adı Karabaş.|My dog is called Karabaş.
kedi|cat|🐈|İstanbul’da çok kedi var.|There are lots of cats in Istanbul.
kuş|bird|🐦|Kuş ötüyor.|The bird is singing.
at|horse|🐎|At hızlı koşar.|The horse runs fast.
inek|cow|🐄|İnek süt verir.|The cow gives milk.
koyun|sheep|🐑|Tarlada koyunlar var.|There are sheep in the field.
tavşan|rabbit|🐇|Tavşan havuç yiyor.|The rabbit is eating a carrot.
ayı|bear|🐻|Ayı balı sever.|The bear loves honey.
aslan|lion|🦁|Aslan ormanın kralıdır.|The lion is the king of the jungle.
kelebek|butterfly|🦋|Çiçekte bir kelebek.|A butterfly on a flower.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
gömlek|shirt|👔|Beyaz bir gömlek.|A white shirt.
tişört|T-shirt|👕|Pamuklu bir tişört.|A cotton T-shirt.
pantolon|trousers|👖|Pantolon çok uzun.|The trousers are too long.
elbise|dress|👗|Kırmızı bir elbise giyiyor.|She’s wearing a red dress.
etek|skirt|🩳|Yazlık bir etek.|A summer skirt.
ayakkabı|shoes|👞|Yeni ayakkabıya ihtiyacım var.|I need new shoes.
mont|coat / jacket|🧥|Montunu giy, hava soğuk.|Put your coat on, it’s cold.
şapka|hat|👒|Güneş için bir şapka.|A hat for the sun.
atkı|scarf|🧣|Yün bir atkı.|A wool scarf.
gözlük|glasses|👓|Gözlüğüm nerede?|Where are my glasses?
giymek|to wear|🧥|Her zaman kravat giyer.|He always wears a tie.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
hava|weather / air|🌤️|Hava nasıl?|What’s the weather like?
güneş|sun|☀️|Güneş parlıyor.|The sun is shining.
yağmur|rain|🌧️|Yağmur yağıyor.|It’s raining.
kar|snow|❄️|Kar yağıyor.|It’s snowing.
rüzgâr|wind|🌬️|Çok rüzgâr var.|It’s very windy.
sıcak hava|hot weather|🥵|Yazın hava sıcak.|It’s hot in summer.
soğuk|cold|🥶|Bugün hava soğuk.|It’s cold today.
bulut|cloud|☁️|Gökyüzü bulutlu.|The sky is cloudy.
şemsiye|umbrella|☂️|Şemsiyeni unutma.|Don’t forget your umbrella.
yaz|summer|🏖️|Yazın denize gideriz.|In summer we go to the seaside.
kış|winter|☃️|Kış soğuk geçer.|Winter is cold.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
okul|school|🏫|Okul yakın.|The school is close.
ders|lesson|🧑‍🏫|Ders sekizde başlıyor.|The lesson starts at eight.
öğretmen|teacher|👩‍🏫|Öğretmen iyi anlatıyor.|The teacher explains well.
öğrenci|student|🧑‍🎓|Sınıfta yirmi öğrenci var.|There are twenty students in the class.
defter|exercise book|📓|Defterine yaz.|Write in your exercise book.
kalem|pen / pencil|🖊️|Kalemin var mı?|Do you have a pen?
ödev|homework|📝|Çok ödevim var.|I have a lot of homework.
soru|question|❓|Bir sorum var.|I have a question.
cevap|answer|💡|Cevap doğru.|The answer is correct.
öğrenmek|to learn|🌱|Her gün on kelime öğreniyorum.|I learn ten words every day.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
tabak|plate|🍽️|Tabakları masaya koy.|Put the plates on the table.
bardak|glass|🥛|Bir bardak su.|A glass of water.
fincan|cup|☕|Bir fincan Türk kahvesi.|A cup of Turkish coffee.
bıçak|knife|🔪|Bıçak keskin.|The knife is sharp.
çatal|fork|🍴|Bir çatala ihtiyacım var.|I need a fork.
kaşık|spoon|🥄|Çorbayı kaşıkla iç.|Eat the soup with the spoon.
tencere|pot|🍲|Pilav tencerede.|The pilaf is in the pot.
ocak|stove|🔥|Çaydanlık ocakta.|The teapot is on the stove.
tuz|salt|🧂|Tuzu uzatır mısın?|Can you pass the salt?
tereyağı|butter|🧈|Ekmek ve tereyağı.|Bread and butter.
kesmek|to cut|✂️|Domatesleri kes.|Cut the tomatoes.
bulaşık yıkamak|to wash the dishes|🧽|Bulaşıkları ben yıkarım.|I’ll wash the dishes.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
dün akşam|last night|🌃|Dün akşam sinemaya gittik.|Last night we went to the cinema.
geçen hafta|last week|🗓️|Geçen hafta hastaydım.|Last week I was ill.
geçen yıl|last year|🎆|Geçen yıl Kapadokya’ya gittik.|Last year we went to Cappadocia.
iki gün önce|two days ago|⌛|İki gün önce geldim.|I arrived two days ago.
gittim|I went|🚶|Pazara gittim.|I went to the market.
yaptım|I did / made|🛠️|Kek yaptım.|I made a cake.
yedim|I ate|🍽️|Kebap yedim.|I ate kebab.
gördüm|I saw|👀|Elif’i gördüm.|I saw Elif.
aldım|I bought|🛍️|Bir mont aldım.|I bought a coat.
çocukken|as a child|🧒|Çocukken köyde yaşardım.|As a child I lived in a village.
eskiden|in the past|🕰️|Eskiden burada sinema vardı.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
tamam|OK|👌|Tamam, yarın görüşürüz!|OK, see you tomorrow!
tabii|of course|✅|Tabii, yardım ederim.|Of course, I’ll help.
kolay gelsin|may it be easy (to someone working)|💪|Kolay gelsin!|Good luck with the work!
geçmiş olsun|get well soon / sorry to hear|🤒|Geçmiş olsun!|Get well soon!
afiyet olsun|enjoy your meal|🍽️|Afiyet olsun!|Enjoy your meal!
eline sağlık|well done (to the cook)|👩‍🍳|Yemek çok güzel, eline sağlık!|The food is lovely, well done!
maşallah|how wonderful|🤩|Maşallah, çok güzel!|How wonderful, very nice!
inşallah|hopefully / God willing|🤲|İnşallah yarın güneşli olur.|Hopefully it’ll be sunny tomorrow.
yazık|what a pity|😞|Yazık, gelemiyorsun.|What a pity you can’t come.
boş ver|never mind|🤷|Boş ver, önemli değil.|Never mind, it’s not important.
şerefe|cheers|🥂|Şerefe!|Cheers!
çok yaşa|bless you|🤧|Çok yaşa!|Bless you!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
de|also / too (de / da)|➕|Ben de İspanyolca konuşuyorum.|I speak Spanish too.
ayrıca|also / besides|📎|Ayrıca, ücretsiz.|Besides, it’s free.
o yüzden|so / that’s why|➡️|Yağmur yağıyor, o yüzden evdeyim.|It’s raining, so I’m at home.
iken|while|⏯️|Beklerken kitap okuyorum.|I read while I wait.
rağmen|despite|🧱|Yağmura rağmen dışarı çıktık.|Despite the rain, we went out.
hemen|right away|⚡|Hemen geliyorum!|I’m coming right away!
önce|first / before|1️⃣|Önce yemek yiyelim.|Let’s eat first.
sonunda|finally|🏁|Sonunda bitirdik.|We finally finished.
mesela|for example|📌|Meyve severim, mesela incir.|I like fruit, for example figs.
oysa|whereas|⚖️|Ben denizi severim, oysa o dağı.|I like the sea, whereas he likes the mountains.
`),
];
