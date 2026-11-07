import type { FullCourse, Level, Topic, Word } from '@/data/learn/full';

/** Brazilian Portuguese, A1 → B1, for English speakers. Original content written for this app. Lines are "palavra|English|emoji|example|example in English". */
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
const t = (level: Level, id: string, icon: string, en: string, fr: string, block: string): Topic => ({ id: `pt-${id}`, level, icon, en, fr, words: w5(block) });

const topics: Topic[] = [
  t('A1', 'people', '🙋', 'Meeting people', 'Faire connaissance', `
oi|hi|👋|Oi, eu sou a Ana!|Hi, I’m Ana!
bom dia|good morning|🌅|Bom dia, seu João!|Good morning, Mr João!
boa noite|good evening / good night|🌙|Boa noite, até amanhã.|Good night, see you tomorrow.
tchau|bye|🫡|Tchau, até logo!|Bye, see you later!
obrigado|thank you (said by a man)|🙏|Muito obrigado!|Thank you very much!
obrigada|thank you (said by a woman)|🙏|Obrigada pela ajuda.|Thanks for the help.
por favor|please|🥺|Um café, por favor.|A coffee, please.
desculpa|sorry / excuse me|😅|Desculpa, onde fica a estação?|Excuse me, where is the station?
prazer|nice to meet you|🤝|Prazer, eu sou o Pedro.|Nice to meet you, I’m Pedro.
o nome|name|🏷️|Qual é o seu nome?|What’s your name?
o amigo|friend (m)|🤝|O Pedro é meu amigo.|Pedro is my friend.
a amiga|friend (f)|🤝|A Ana é minha amiga.|Ana is my friend.
o homem|man|👨|O homem lê o jornal.|The man reads the paper.
a mulher|woman / wife|👩|A mulher está no telefone.|The woman is on the phone.
a criança|child|🧒|A criança brinca no parque.|The child plays in the park.
`),
  t('A1', 'cafe', '☕', 'At the café', 'Au café', `
o café|coffee|☕|Um cafezinho, por favor.|A little coffee, please.
o chá|tea|🍵|Prefiro chá gelado.|I prefer iced tea.
a água|water|💧|Uma água sem gás, por favor.|A still water, please.
o suco|juice|🧃|Um suco de laranja.|An orange juice.
o leite|milk|🥛|Café com leite, por favor.|Coffee with milk, please.
o açúcar|sugar|🍬|Sem açúcar, obrigado.|No sugar, thanks.
o pão de queijo|cheese bread|🧀|O pão de queijo está quentinho.|The cheese bread is nice and warm.
o pão|bread|🍞|Pão na chapa com manteiga.|Grilled bread with butter.
a conta|the bill|🧾|A conta, por favor.|The bill, please.
o garçom|waiter|🤵|O garçom já vem.|The waiter is coming.
eu queria|I would like|🙂|Eu queria um suco.|I’d like a juice.
quanto custa|how much is|💶|Quanto custa?|How much is it?
gostoso|tasty|😋|Que gostoso!|So tasty!
quente|hot|♨️|Cuidado, está quente.|Careful, it’s hot.
`),
  t('A1', 'family', '👪', 'Family', 'La famille', `
a família|family|👪|Minha família é grande.|My family is big.
a mãe|mother|👩|Minha mãe é professora.|My mother is a teacher.
o pai|father|👨|Meu pai cozinha muito bem.|My father cooks very well.
os pais|parents|👨‍👩‍👧|Meus pais moram em Recife.|My parents live in Recife.
o irmão|brother|👦|Meu irmão se chama Pedro.|My brother is called Pedro.
a irmã|sister|👧|Tenho uma irmã mais nova.|I have a younger sister.
o filho|son|👦|O filho deles tem dez anos.|Their son is ten.
a filha|daughter|👧|Minha filha adora desenhar.|My daughter loves drawing.
o avô|grandfather|👴|Meu avô conta histórias.|My grandfather tells stories.
a avó|grandmother|👵|A vovó faz o melhor bolo.|Grandma makes the best cake.
o tio|uncle|🧔|Meu tio mora em Lisboa.|My uncle lives in Lisbon.
a tia|aunt|👩‍🦱|Minha tia é médica.|My aunt is a doctor.
o marido|husband|🤵|O marido dela é argentino.|Her husband is Argentinian.
o bebê|baby|👶|O bebê está dormindo.|The baby is sleeping.
`),
  t('A1', 'numbers', '🔢', 'Numbers and age', 'Nombres et âge', `
um|one|1️⃣|Um café, por favor.|One coffee, please.
dois|two|2️⃣|Dois ingressos, por favor.|Two tickets, please.
três|three|3️⃣|Somos três.|There are three of us.
quatro|four|4️⃣|Ele tem quatro filhos.|He has four children.
cinco|five|5️⃣|São cinco reais.|That’s five reais.
seis|six|6️⃣|Acordo às seis.|I wake up at six.
sete|seven|7️⃣|A semana tem sete dias.|The week has seven days.
oito|eight|8️⃣|Trabalho oito horas por dia.|I work eight hours a day.
nove|nine|9️⃣|Minha filha tem nove anos.|My daughter is nine.
dez|ten|🔟|O ônibus sai em dez minutos.|The bus leaves in ten minutes.
vinte|twenty|💵|São vinte reais.|That’s twenty reais.
cem|a hundred|💯|O hotel fica a cem metros.|The hotel is a hundred metres away.
quantos anos você tem?|how old are you?|🎂|Quantos anos você tem?|How old are you?
`),
  t('A1', 'time', '🕒', 'Days and time', 'Jours et heure', `
segunda-feira|Monday|1️⃣|Segunda-feira eu trabalho.|On Monday I work.
terça-feira|Tuesday|2️⃣|Terça-feira vou à academia.|On Tuesday I go to the gym.
quarta-feira|Wednesday|3️⃣|A gente se vê quarta-feira?|See you on Wednesday?
quinta-feira|Thursday|4️⃣|Quinta-feira à noite eu saio.|On Thursday night I go out.
sexta-feira|Friday|5️⃣|Sexta-feira é dia de pizza.|Friday is pizza day.
sábado|Saturday|6️⃣|No sábado vou à feira.|On Saturday I go to the market.
domingo|Sunday|7️⃣|No domingo almoçamos juntos.|On Sunday we have lunch together.
hoje|today|📅|Hoje está fazendo sol.|It’s sunny today.
amanhã|tomorrow|🌄|Até amanhã!|See you tomorrow!
ontem|yesterday|⬅️|Ontem eu estava cansado.|Yesterday I was tired.
a hora|hour / time|🕐|Que horas são?|What time is it?
a manhã|morning|🌅|De manhã eu tomo café.|In the morning I have coffee.
a noite|night / evening|🌃|Hoje à noite vamos jantar fora.|Tonight we’re eating out.
a semana|week|🗓️|Trabalho cinco dias por semana.|I work five days a week.
`),
  t('A1', 'food', '🍲', 'Food', 'La nourriture', `
o arroz|rice|🍚|Arroz e feijão todo dia.|Rice and beans every day.
o feijão|beans|🫘|O feijão está pronto.|The beans are ready.
a feijoada|feijoada (bean stew)|🍲|Sábado tem feijoada.|There’s feijoada on Saturday.
o queijo|cheese|🧀|Queijo de Minas.|Minas cheese.
o tomate|tomato|🍅|Uma salada de tomate.|A tomato salad.
a banana|banana|🍌|Banana com aveia.|Banana with oats.
a fruta|fruit|🍍|Adoro frutas tropicais.|I love tropical fruit.
a carne|meat|🥩|Não como carne.|I don’t eat meat.
o peixe|fish|🐟|Peixe grelhado com limão.|Grilled fish with lime.
o frango|chicken|🍗|Frango assado no domingo.|Roast chicken on Sunday.
o ovo|egg|🥚|Dois ovos fritos.|Two fried eggs.
o bolo|cake|🎂|Um bolo de cenoura.|A carrot cake.
comer|to eat|🍽️|Vamos comer?|Shall we eat?
beber|to drink|🥤|Bebo muita água.|I drink a lot of water.
`),
  t('A1', 'home', '🏠', 'At home', 'À la maison', `
a casa|house / home|🏠|A casa tem um quintal.|The house has a yard.
o apartamento|flat|🏢|Moro num apartamento pequeno.|I live in a small flat.
a cozinha|kitchen|🍳|A cozinha é clara.|The kitchen is bright.
o quarto|bedroom|🛏️|Meu quarto é silencioso.|My bedroom is quiet.
o banheiro|bathroom|🛁|O banheiro fica no fim do corredor.|The bathroom is at the end of the corridor.
a sala|living room|🛋️|A gente vê TV na sala.|We watch TV in the living room.
a porta|door|🚪|Fecha a porta, por favor.|Close the door, please.
a janela|window|🪟|Abre a janela, está calor.|Open the window, it’s hot.
a cama|bed|🛌|A cama é confortável.|The bed is comfortable.
a cadeira|chair|🪑|Pega uma cadeira.|Grab a chair.
a chave|key|🔑|Cadê minhas chaves?|Where are my keys?
a varanda|balcony|🪴|Tomamos café na varanda.|We have breakfast on the balcony.
morar|to live (somewhere)|🏡|Moro em São Paulo.|I live in São Paulo.
`),
  t('A1', 'city', '🏙️', 'In town', 'En ville', `
a rua|street|🛣️|Moro nesta rua.|I live on this street.
a praça|square|⛲|A gente se encontra na praça.|We’ll meet in the square.
a estação|station|🚉|A estação fica perto.|The station is close.
a padaria|bakery|🥖|A padaria abre às seis.|The bakery opens at six.
a farmácia|pharmacy|💊|Tem uma farmácia aqui perto?|Is there a pharmacy nearby?
o mercado|supermarket / market|🛒|Vou ao mercado.|I’m going to the supermarket.
o banco|bank|🏦|O banco fecha às quatro.|The bank closes at four.
o museu|museum|🏛️|O museu é grátis às terças.|The museum is free on Tuesdays.
a igreja|church|⛪|A igreja é muito antiga.|The church is very old.
a praia|beach|🏖️|A praia fica a dez minutos.|The beach is ten minutes away.
à direita|on the right|➡️|Vire à direita.|Turn right.
à esquerda|on the left|⬅️|A estação fica à esquerda.|The station is on the left.
em frente|straight ahead|⬆️|Siga em frente.|Go straight ahead.
longe|far|🧭|É longe?|Is it far?
`),
  t('A1', 'describe', '🎨', 'Colours and descriptions', 'Couleurs et descriptions', `
vermelho|red|🔴|Um carro vermelho.|A red car.
azul|blue|🔵|O mar está azul.|The sea is blue.
verde|green|🟢|A bandeira é verde e amarela.|The flag is green and yellow.
amarelo|yellow|🟡|Uma flor amarela.|A yellow flower.
preto|black|⚫|Um gato preto.|A black cat.
branco|white|⚪|Uma camisa branca.|A white shirt.
grande|big|🐘|Uma casa grande.|A big house.
pequeno|small|🐭|Um cachorro pequeno.|A small dog.
novo|new|🆕|Tenho um celular novo.|I have a new phone.
velho|old|🏚️|Um prédio velho.|An old building.
bonito|beautiful|🌸|Que dia bonito!|What a beautiful day!
caro|expensive|💎|O restaurante é caro.|The restaurant is expensive.
barato|cheap|🏷️|Essa loja é barata.|This shop is cheap.
`),
  t('A2', 'travel', '✈️', 'Travel', 'Voyager', `
a viagem|trip|🧳|Boa viagem!|Have a good trip!
viajar|to travel|🌍|Adoro viajar de ônibus.|I love travelling by bus.
o avião|plane|✈️|O avião sai às dez.|The plane leaves at ten.
o aeroporto|airport|🛫|Vamos de táxi para o aeroporto.|We’re taking a taxi to the airport.
a passagem|ticket (travel)|🎫|Comprei as passagens on-line.|I bought the tickets online.
a mala|suitcase|🧳|Minha mala está pesada demais.|My suitcase is too heavy.
o passaporte|passport|🛂|Não esquece o passaporte!|Don’t forget your passport!
as férias|holidays|🏝️|Vamos tirar férias em janeiro.|We’re taking a holiday in January.
a montanha|mountains|🏔️|No inverno vamos para a serra.|In winter we go to the mountains.
o hotel|hotel|🏨|O hotel tem vista para o mar.|The hotel has a sea view.
a reserva|booking|📋|Tenho uma reserva em nome de Smith.|I have a booking under the name Smith.
o café da manhã|breakfast|🥐|O café da manhã está incluído?|Is breakfast included?
a lembrança|souvenir|🎁|Comprei uma lembrança para minha mãe.|I bought a souvenir for my mother.
`),
  t('A2', 'health', '🩺', 'Health', 'La santé', `
o médico|doctor|👨‍⚕️|Preciso ir ao médico.|I need to go to the doctor.
doente|ill|🤒|Estou doente desde ontem.|I’ve been ill since yesterday.
a febre|fever|🌡️|Estou com febre.|I have a fever.
o resfriado|cold|🤧|Peguei um resfriado.|I caught a cold.
a tosse|cough|😷|Estou com tosse.|I have a cough.
a dor de cabeça|headache|🤕|Estou com dor de cabeça.|I have a headache.
a receita|prescription / recipe|📃|Aqui está a receita.|Here’s the prescription.
o remédio|medicine|💊|Tome este remédio.|Take this medicine.
cansado|tired|🥱|Estou muito cansado.|I’m very tired.
descansar|to rest|🛋️|Você precisa descansar.|You need to rest.
o pronto-socorro|emergency room|🚑|Ele está no pronto-socorro.|He’s in the emergency room.
melhorar|to get better|🌤️|Melhoras!|Get well soon!
`),
  t('A2', 'work', '💼', 'Work', 'Le travail', `
o trabalho|work / job|💼|Gosto do meu trabalho.|I like my job.
trabalhar|to work|🧑‍💻|Trabalho num banco.|I work in a bank.
o escritório|office|🏢|O escritório fica no centro.|The office is in the centre.
o colega|colleague|🤝|Meus colegas são legais.|My colleagues are nice.
o chefe|boss|😎|O chefe está em reunião.|The boss is in a meeting.
a reunião|meeting|👥|A reunião começa às nove.|The meeting starts at nine.
o salário|salary|💵|O salário é bom.|The salary is good.
a entrevista|job interview|🤝|Amanhã tenho uma entrevista.|I have an interview tomorrow.
a empresa|company|🏢|Ela abriu a própria empresa.|She opened her own company.
o home office|working from home|🏠|Na segunda faço home office.|On Mondays I work from home.
as férias do trabalho|annual leave|🏖️|Tiro férias em julho.|I take my leave in July.
`),
  t('A2', 'hobbies', '⚽', 'Free time', 'Les loisirs', `
o tempo livre|free time|🎨|O que você faz no tempo livre?|What do you do in your free time?
o futebol|football|⚽|Jogo futebol com os amigos.|I play football with friends.
nadar|to swim|🏊|Nado todo dia de manhã.|I swim every morning.
a bicicleta|bicycle|🚲|Vou de bicicleta para o trabalho.|I cycle to work.
ler|to read|📖|Gosto de ler à noite.|I like reading at night.
o cinema|cinema|🎬|Vamos ao cinema hoje?|Shall we go to the cinema today?
a música|music|🎵|Ouço música enquanto trabalho.|I listen to music while I work.
dançar|to dance|💃|Dançamos forró no sábado.|We dance forró on Saturday.
cantar|to sing|🎤|Ela canta muito bem.|She sings very well.
cozinhar|to cook|👩‍🍳|Cozinho no fim de semana.|I cook at the weekend.
o violão|acoustic guitar|🎸|Ele toca violão.|He plays the guitar.
a praia no fim de semana|beach weekend|🏖️|Fim de semana é dia de praia.|Weekends are beach days.
`),
  t('A2', 'shopping', '🛍️', 'Shopping', 'Les achats', `
a loja|shop|🏬|A loja abre às dez.|The shop opens at ten.
comprar|to buy|🛒|Compro pão todo dia.|I buy bread every day.
o preço|price|🏷️|Qual é o preço?|What’s the price?
a promoção|sale / special offer|🏷️|Está em promoção.|It’s on sale.
o tamanho|size|📏|Tem um tamanho maior?|Do you have a bigger size?
o provador|fitting room|🚪|O provador fica no fundo.|The fitting room is at the back.
pagar|to pay|💳|Posso pagar com cartão?|Can I pay by card?
o Pix|Pix (instant payment)|📱|Aceita Pix?|Do you take Pix?
o dinheiro|money / cash|💵|Vou pagar em dinheiro.|I’ll pay in cash.
o recibo|receipt|🧾|Quer o recibo?|Do you want the receipt?
trocar|to exchange|🔁|Posso trocar?|Can I exchange it?
o presente|present|🎁|É um presente para a minha mãe.|It’s a present for my mother.
`),
  t('A2', 'feelings', '😊', 'Feelings', 'Les émotions', `
feliz|happy|😊|Estou feliz de te ver.|I’m happy to see you.
triste|sad|😢|Ela está triste hoje.|She’s sad today.
bravo|angry|😠|Por que você está bravo?|Why are you angry?
preocupado|worried|😟|Estou preocupada com a prova.|I’m worried about the exam.
contente|pleased|🙂|Estou contente com o resultado.|I’m pleased with the result.
orgulhoso|proud|🦚|Tenho orgulho de você.|I’m proud of you.
surpreso|surprised|😮|Fiquei muito surpreso.|I was very surprised.
o medo|fear|😱|Tenho medo de aranha.|I’m afraid of spiders.
entediado|bored|🥱|Fico entediado no domingo.|I get bored on Sundays.
a saudade|longing / missing someone|💌|Estou com saudade de você.|I miss you.
tranquilo|calm|😌|Fica tranquilo, vai dar certo.|Relax, it’ll work out.
animado|excited|🥳|Estou animada com a viagem!|I’m excited about the trip!
`),
  t('B1', 'opinions', '💬', 'Opinions', 'Donner son avis', `
na minha opinião|in my opinion|💬|Na minha opinião, é uma boa ideia.|In my opinion, it’s a good idea.
eu acho que|I think that|💭|Eu acho que você tem razão.|I think you’re right.
ter razão|to be right|✅|Você tem razão.|You’re right.
concordar|to agree|🤝|Concordo com você.|I agree with you.
mas|but|↔️|É caro, mas é bom.|It’s expensive, but good.
então|so|➡️|Está chovendo, então vou ficar em casa.|It’s raining, so I’m staying home.
mesmo assim|even so|💪|Estava frio; mesmo assim, saímos.|It was cold; we went out anyway.
a vantagem|advantage|👍|A vantagem é o preço.|The advantage is the price.
a desvantagem|disadvantage|👎|A desvantagem é o barulho.|The disadvantage is the noise.
convencer|to convince|🗣️|Você me convenceu.|You’ve convinced me.
talvez|maybe|🤷|Talvez chova amanhã.|Maybe it’ll rain tomorrow.
na verdade|actually|📌|Na verdade, não sei.|Actually, I don’t know.
`),
  t('B1', 'society', '🌎', 'Culture and environment', 'Culture et environnement', `
a cultura|culture|🎭|A cultura brasileira é muito rica.|Brazilian culture is very rich.
o carnaval|carnival|🎉|O carnaval do Rio é famoso.|Rio’s carnival is famous.
a tradição|tradition|🎎|É uma tradição de família.|It’s a family tradition.
a história|history / story|📜|Gosto da história do Brasil.|I like Brazilian history.
o livro|book|📕|Estou lendo um livro de Machado de Assis.|I’m reading a book by Machado de Assis.
o meio ambiente|environment|🌍|Precisamos proteger o meio ambiente.|We need to protect the environment.
a floresta|forest|🌳|A floresta amazônica é enorme.|The Amazon rainforest is huge.
reciclar|to recycle|♻️|A gente recicla vidro e papel.|We recycle glass and paper.
o lixo|rubbish|🗑️|Separe o lixo, por favor.|Please sort the rubbish.
sustentável|sustainable|🌿|Um turismo mais sustentável.|More sustainable tourism.
o celular|mobile phone|📱|Esqueci o celular em casa.|I left my phone at home.
a internet|internet|🌐|Pesquisei na internet.|I looked it up online.
`),
];

const grammar: FullCourse['grammar'] = [
  {
    id: 'pt-g-articles', level: 'A1', icon: '🔤', en: 'Gender and articles', fr: 'Genre et articles',
    cards: [
      { en: 'Nouns are masculine (often -o) or feminine (often -a). "The": o, a, os, as. "A": um, uma.', fr: 'Articles : o, a, os, as ; um, uma.', examples: [['o livro', 'the book', 'the book'], ['a casa', 'the house', 'the house']] },
      { en: 'Articles join prepositions: de + o = do, em + a = na, a + o = ao.', fr: 'Contractions : do, na, ao.', examples: [['Moro na praia.', 'I live at the beach.', 'I live at the beach.'], ['Vou ao mercado.', 'I go to the market.', 'I go to the market.']] },
    ],
    drills: [
      { text: '___ livro é novo.', answer: 'O', wrong: ['A', 'Os'], en: 'The book is new.', fr: 'The book is new.' },
      { text: 'Tenho ___ irmã.', answer: 'uma', wrong: ['um', 'a'], en: 'I have a sister.', fr: 'I have a sister.' },
      { text: 'Moro ___ cidade.', answer: 'na', wrong: ['no', 'em a'], en: 'I live in the city.', fr: 'I live in the city.' },
      { text: 'Vou ___ cinema.', answer: 'ao', wrong: ['à', 'no'], en: 'I’m going to the cinema.', fr: 'I’m going to the cinema.' },
    ],
  },
  {
    id: 'pt-g-ser-estar', level: 'A1', icon: '🧩', en: 'Ser and estar', fr: 'Ser et estar',
    cards: [
      { en: 'Ser for identity and lasting traits: eu sou, você é, nós somos, eles são.', fr: 'Ser : identité, caractéristiques durables.', examples: [['Eu sou brasileira.', 'I’m Brazilian.', 'I’m Brazilian.']] },
      { en: 'Estar for states and location: eu estou, você está, nós estamos, eles estão.', fr: 'Estar : états et lieu.', examples: [['Estou cansado.', 'I’m tired.', 'I’m tired.'], ['Ela está em casa.', 'She’s at home.', 'She’s at home.']] },
    ],
    drills: [
      { text: 'Eu ___ professor.', answer: 'sou', wrong: ['estou', 'é'], en: 'I’m a teacher.', fr: 'I’m a teacher.' },
      { text: 'Você ___ cansada?', answer: 'está', wrong: ['é', 'estou'], en: 'Are you tired?', fr: 'Are you tired?' },
      { text: 'Nós ___ no Rio.', answer: 'estamos', wrong: ['somos', 'estão'], en: 'We’re in Rio.', fr: 'We’re in Rio.' },
      { text: 'Eles ___ muito simpáticos.', answer: 'são', wrong: ['estão', 'é'], en: 'They’re very nice.', fr: 'They’re very nice.' },
    ],
  },
  {
    id: 'pt-g-present', level: 'A1', icon: '🔁', en: 'Present tense: -ar, -er, -ir', fr: 'Présent : -ar, -er, -ir',
    cards: [
      { en: 'In Brazil, "você" takes the same form as "ele/ela". -ar: eu falo, você fala, nós falamos, eles falam. -er: como, come, comemos, comem. -ir: abro, abre, abrimos, abrem.', fr: 'Terminaisons du présent ; você = il/elle.', examples: [['Eu falo português.', 'I speak Portuguese.', 'I speak Portuguese.']] },
    ],
    drills: [
      { text: 'Você ___ inglês?', answer: 'fala', wrong: ['falo', 'falam'], en: 'Do you speak English?', fr: 'Do you speak English?' },
      { text: 'Nós ___ às oito.', answer: 'comemos', wrong: ['comem', 'como'], en: 'We eat at eight.', fr: 'We eat at eight.' },
      { text: 'Eles ___ em Salvador.', answer: 'moram', wrong: ['mora', 'moramos'], en: 'They live in Salvador.', fr: 'They live in Salvador.' },
    ],
  },
  {
    id: 'pt-g-past', level: 'A2', icon: '⏮️', en: 'The past: pretérito perfeito', fr: 'Le passé',
    cards: [
      { en: 'Finished past actions: -ar → falei, falou, falamos, falaram. -er/-ir → comi, comeu, comemos, comeram.', fr: 'Passé simple : -ei/-ou ; -i/-eu.', examples: [['Ontem falei com a Ana.', 'Yesterday I spoke to Ana.', 'Yesterday I spoke to Ana.'], ['Você comeu?', 'Have you eaten?', 'Have you eaten?']] },
      { en: 'Common irregulars: ir/ser → fui, foi; fazer → fiz, fez; ter → tive, teve.', fr: 'Irréguliers : fui, fiz, tive.', examples: [['Fui à praia.', 'I went to the beach.', 'I went to the beach.']] },
    ],
    drills: [
      { text: 'Ontem eu ___ muito.', answer: 'trabalhei', wrong: ['trabalhou', 'trabalho'], en: 'Yesterday I worked a lot.', fr: 'Yesterday I worked a lot.' },
      { text: 'Ela ___ ao cinema.', answer: 'foi', wrong: ['fui', 'vai'], en: 'She went to the cinema.', fr: 'She went to the cinema.' },
      { text: 'Nós ___ pizza.', answer: 'comemos', wrong: ['comeu', 'comi'], en: 'We ate pizza.', fr: 'We ate pizza.' },
    ],
  },
  {
    id: 'pt-g-future', level: 'B1', icon: '➡️', en: 'Ir + infinitive', fr: 'Ir + infinitif',
    cards: [
      { en: 'Spoken future: ir (vou, vai, vamos, vão) + infinitive: vou viajar = I’m going to travel.', fr: 'Futur proche : ir + infinitif.', examples: [['Vou ligar para você.', 'I’ll call you.', 'I’ll call you.'], ['Vai chover.', 'It’s going to rain.', 'It’s going to rain.']] },
    ],
    drills: [
      { text: 'Amanhã ___ viajar.', answer: 'vou', wrong: ['vai', 'fui'], en: 'Tomorrow I’m going to travel.', fr: 'Tomorrow I’m going to travel.' },
      { text: 'Nós ___ jantar fora.', answer: 'vamos', wrong: ['vão', 'vou'], en: 'We’re going to eat out.', fr: 'We’re going to eat out.' },
      { text: 'Acho que ___ chover.', answer: 'vai', wrong: ['vou', 'foi'], en: 'I think it’s going to rain.', fr: 'I think it’s going to rain.' },
    ],
  },
];

const dialogues: FullCourse['dialogues'] = [
  {
    id: 'pt-d-cafe', level: 'A1', icon: '☕', en: 'Ordering at a café', fr: 'Commander au café',
    lines: [
      { who: 'A', text: 'Bom dia! O que vai ser?', en: 'Good morning! What will it be?', fr: 'Good morning! What will it be?' },
      { who: 'B', text: 'Um cafezinho e um pão de queijo, por favor.', en: 'A coffee and a cheese bread, please.', fr: 'A coffee and a cheese bread, please.', wrong: ['A conta é um pão.', 'Eu sou um café.'] },
      { who: 'A', text: 'Pra comer aqui ou pra viagem?', en: 'For here or to go?', fr: 'For here or to go?' },
      { who: 'B', text: 'Pra comer aqui.', en: 'For here.', fr: 'For here.', wrong: ['Tenho trinta anos.', 'Está frio em Lisboa.'] },
      { who: 'A', text: 'Deu oito reais.', en: 'That’s eight reais.', fr: 'That’s eight reais.' },
      { who: 'B', text: 'Aceita Pix?', en: 'Do you take Pix?', fr: 'Do you take Pix?', wrong: ['Boa noite, reais!', 'Onde fica o pão?'] },
    ],
  },
  {
    id: 'pt-d-directions', level: 'A1', icon: '🧭', en: 'Asking the way', fr: 'Demander son chemin',
    lines: [
      { who: 'B', text: 'Com licença, onde fica a estação de metrô?', en: 'Excuse me, where is the metro station?', fr: 'Excuse me, where is the metro station?', wrong: ['Com licença, quanto custa a estação?', 'Com licença, eu sou a estação.'] },
      { who: 'A', text: 'Siga em frente e vire à esquerda.', en: 'Go straight ahead and turn left.', fr: 'Go straight ahead and turn left.' },
      { who: 'B', text: 'É longe?', en: 'Is it far?', fr: 'Is it far?', wrong: ['É gostoso?', 'É segunda-feira?'] },
      { who: 'A', text: 'Não, uns cinco minutos a pé.', en: 'No, about five minutes on foot.', fr: 'No, about five minutes on foot.' },
      { who: 'B', text: 'Muito obrigada!', en: 'Thank you very much!', fr: 'Thank you very much!', wrong: ['Bom apetite!', 'Boa noite!'] },
    ],
  },
  {
    id: 'pt-d-hotel', level: 'A2', icon: '🏨', en: 'Checking in at a hotel', fr: 'Arriver à l’hôtel',
    lines: [
      { who: 'A', text: 'Boa tarde! Posso ajudar?', en: 'Good afternoon! Can I help?', fr: 'Good afternoon! Can I help?' },
      { who: 'B', text: 'Tenho uma reserva em nome de Smith.', en: 'I have a booking under the name Smith.', fr: 'I have a booking under the name Smith.', wrong: ['Estou com dor de cabeça.', 'Um suco, por favor.'] },
      { who: 'A', text: 'Um quarto duplo por duas noites. Seu passaporte, por favor.', en: 'A double room for two nights. Your passport, please.', fr: 'A double room for two nights. Your passport, please.' },
      { who: 'B', text: 'Aqui está. A que horas é o café da manhã?', en: 'Here it is. What time is breakfast?', fr: 'Here it is. What time is breakfast?', wrong: ['Aqui está. Onde fica a praia do passaporte?', 'Não, obrigado, não estou com fome.'] },
      { who: 'A', text: 'Das sete às dez. O quarto fica no terceiro andar.', en: 'From seven to ten. The room is on the third floor.', fr: 'From seven to ten. The room is on the third floor.' },
      { who: 'B', text: 'Perfeito. O wi-fi é grátis?', en: 'Perfect. Is the wifi free?', fr: 'Perfect. Is the wifi free?', wrong: ['Perfeito. Eu sou grátis.', 'Perfeito. Tenho trinta anos.'] },
    ],
  },
  {
    id: 'pt-d-doctor', level: 'A2', icon: '🩺', en: 'At the doctor’s', fr: 'Chez le médecin',
    lines: [
      { who: 'A', text: 'Bom dia. O que você está sentindo?', en: 'Good morning. What are you feeling?', fr: 'Good morning. What are you feeling?' },
      { who: 'B', text: 'Estou com dor de garganta e febre.', en: 'I have a sore throat and a fever.', fr: 'I have a sore throat and a fever.', wrong: ['Eu queria um bolo.', 'Tenho um quarto duplo.'] },
      { who: 'A', text: 'Desde quando?', en: 'Since when?', fr: 'Since when?' },
      { who: 'B', text: 'Desde anteontem.', en: 'Since the day before yesterday.', fr: 'Since the day before yesterday.', wrong: ['Às três horas.', 'Três reais, por favor.'] },
      { who: 'A', text: 'É uma gripe. Aqui está a receita. Descanse bastante.', en: 'It’s flu. Here’s the prescription. Get lots of rest.', fr: 'It’s flu. Here’s the prescription. Get lots of rest.' },
      { who: 'B', text: 'Obrigada, doutora.', en: 'Thank you, doctor.', fr: 'Thank you, doctor.', wrong: ['Obrigada, onde fica a estação?', 'Saúde!'] },
    ],
  },
  {
    id: 'pt-d-plans', level: 'B1', icon: '📅', en: 'Making plans with a friend', fr: 'Faire des projets avec une amie',
    lines: [
      { who: 'A', text: 'O que você vai fazer no fim de semana?', en: 'What are you doing at the weekend?', fr: 'What are you doing at the weekend?' },
      { who: 'B', text: 'Nada de especial. Tem alguma ideia?', en: 'Nothing special. Any ideas?', fr: 'Nothing special. Any ideas?', wrong: ['Ontem comi feijoada.', 'Nasci em Recife.'] },
      { who: 'A', text: 'A gente podia fazer uma trilha e ir à cachoeira.', en: 'We could go hiking to the waterfall.', fr: 'We could go hiking to the waterfall.' },
      { who: 'B', text: 'Boa ideia! Se fizer sol, eu topo.', en: 'Good idea! If it’s sunny, I’m in.', fr: 'Good idea! If it’s sunny, I’m in.', wrong: ['Boa ideia! Ano passado eu estava doente.', 'Não, não tenho sapatos.'] },
      { who: 'A', text: 'Então a gente se encontra às oito na estação?', en: 'So shall we meet at eight at the station?', fr: 'So shall we meet at eight at the station?' },
      { who: 'B', text: 'Combinado! Eu levo os lanches.', en: 'Deal! I’ll bring the snacks.', fr: 'Deal! I’ll bring the snacks.', wrong: ['Combinado! Eu levei ontem.', 'Não, obrigado, eu sou a estação.'] },
    ],
  },
];

const stories: FullCourse['stories'] = [
  {
    id: 'pt-s-market', level: 'A1', icon: '🧺', en: 'Ana at the market', fr: 'Ana au marché',
    sentences: [
      ['Ana mora em Salvador.', 'Ana lives in Salvador.', 'Ana lives in Salvador.'],
      ['No sábado, ela vai à feira.', 'On Saturday she goes to the market.', 'On Saturday she goes to the market.'],
      ['Ela compra manga, abacaxi e pão.', 'She buys mango, pineapple and bread.', 'She buys mango, pineapple and bread.'],
      ['Depois, toma um café com o Rafael.', 'Afterwards she has a coffee with Rafael.', 'Afterwards she has a coffee with Rafael.'],
      ['Rafael dá um pão de queijo para ela.', 'Rafael gives her a cheese bread.', 'Rafael gives her a cheese bread.'],
      ['Ana fica muito feliz.', 'Ana is very happy.', 'Ana is very happy.'],
    ],
    glossary: { mora: ['lives', 'lives'], sábado: ['Saturday', 'Saturday'], feira: ['street market', 'street market'], compra: ['buys', 'buys'], manga: ['mango', 'mango'], abacaxi: ['pineapple', 'pineapple'], depois: ['afterwards', 'afterwards'], dá: ['gives', 'gives'], feliz: ['happy', 'happy'] },
    questions: [
      { en: 'Where does Ana live?', fr: 'Where does Ana live?', answer: 'Salvador', wrong: ['São Paulo', 'Recife'] },
      { en: 'What does she buy?', fr: 'What does she buy?', answer: 'manga, abacaxi e pão', wrong: ['peixe e arroz', 'sapatos'] },
      { en: 'What does Rafael give her?', fr: 'What does Rafael give her?', answer: 'um pão de queijo', wrong: ['um café', 'uma banana'] },
    ],
  },
  {
    id: 'pt-s-train', level: 'A2', icon: '🚌', en: 'The missed bus', fr: 'Le bus raté',
    sentences: [
      ['Pedro tinha um ônibus para o Rio às oito.', 'Pedro had a bus to Rio at eight.', 'Pedro had a bus to Rio at eight.'],
      ['Mas ele acordou às sete e meia.', 'But he woke up at half past seven.', 'But he woke up at half past seven.'],
      ['Ele se vestiu correndo e pegou um táxi.', 'He got dressed in a rush and took a taxi.', 'He got dressed in a rush and took a taxi.'],
      ['Chegou à rodoviária às oito e dois.', 'He got to the bus station at two minutes past eight.', 'He got to the bus station at two minutes past eight.'],
      ['O ônibus já tinha saído.', 'The bus had already left.', 'The bus had already left.'],
      ['Ele pegou o próximo e leu um livro no caminho.', 'He took the next one and read a book on the way.', 'He took the next one and read a book on the way.'],
    ],
    glossary: { tinha: ['had', 'had'], ônibus: ['bus', 'bus'], acordou: ['woke up', 'woke up'], vestiu: ['got dressed', 'got dressed'], correndo: ['in a rush', 'in a rush'], chegou: ['arrived', 'arrived'], já: ['already', 'already'], próximo: ['next', 'next'], leu: ['read', 'read'] },
    questions: [
      { en: 'Where was Pedro going?', fr: 'Where was Pedro going?', answer: 'para o Rio', wrong: ['para Salvador', 'para Lisboa'] },
      { en: 'How did he get to the bus station?', fr: 'How did he get to the bus station?', answer: 'de táxi', wrong: ['de bicicleta', 'a pé'] },
      { en: 'What did he do on the next bus?', fr: 'What did he do on the next bus?', answer: 'leu um livro', wrong: ['dormiu', 'comeu'] },
    ],
  },
  {
    id: 'pt-s-garden', level: 'B1', icon: '🌱', en: 'A garden on the roof', fr: 'Un jardin sur le toit',
    sentences: [
      ['Há dois anos, os moradores do nosso prédio tiveram uma ideia.', 'Two years ago, the residents of our building had an idea.', 'Two years ago, the residents of our building had an idea.'],
      ['A laje estava vazia e ninguém usava.', 'The roof was empty and nobody used it.', 'The roof was empty and nobody used it.'],
      ['Dona Cida sugeriu fazer uma horta.', 'Dona Cida suggested making a vegetable garden.', 'Dona Cida suggested making a vegetable garden.'],
      ['No começo, nem todo mundo concordou.', 'At first, not everyone agreed.', 'At first, not everyone agreed.'],
      ['Hoje lá crescem tomates, manjericão e morangos.', 'Today tomatoes, basil and strawberries grow there.', 'Today tomatoes, basil and strawberries grow there.'],
      ['E todo domingo, todo mundo almoça junto na laje.', 'And every Sunday everyone has lunch together on the roof.', 'And every Sunday everyone has lunch together on the roof.'],
    ],
    glossary: { moradores: ['residents', 'residents'], prédio: ['building', 'building'], laje: ['flat roof', 'flat roof'], vazia: ['empty', 'empty'], ninguém: ['nobody', 'nobody'], horta: ['vegetable garden', 'vegetable garden'], começo: ['beginning', 'beginning'], crescem: ['grow', 'grow'], junto: ['together', 'together'] },
    questions: [
      { en: 'Whose idea was the garden?', fr: 'Whose idea was the garden?', answer: 'Dona Cida', wrong: ['Ana', 'Pedro'] },
      { en: 'What grows there?', fr: 'What grows there?', answer: 'tomates, manjericão e morangos', wrong: ['maçãs e peras', 'batatas'] },
      { en: 'When does everyone have lunch together?', fr: 'When does everyone have lunch together?', answer: 'todo domingo', wrong: ['toda segunda', 'uma vez por ano'] },
    ],
  },
];

export const PORTUGUESE_FULL: FullCourse = { topics, grammar, dialogues, stories };
