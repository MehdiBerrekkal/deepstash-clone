import type { Level, Topic, Word } from '@/data/learn/full';

/** Brazilian Portuguese, pack 1: everyday verbs, routine, questions, animals, clothes, weather, school, kitchen, the past, expressions, linking words. Lines are "palavra|English|emoji|example|example in English". */
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

export const TOPICS: Topic[] = [
  t('A1', 'verbs1', '🏃', 'Everyday verbs', 'Verbes du quotidien', `
ir|to go|🚶|Vou ao trabalho de ônibus.|I go to work by bus.
vir|to come|👋|Você vem à festa?|Are you coming to the party?
fazer|to do / make|🛠️|O que você faz hoje à noite?|What are you doing tonight?
ver|to see|👀|Vejo o mar da janela.|I can see the sea from the window.
assistir|to watch|📺|Vamos assistir um filme.|Let’s watch a film.
ouvir|to hear / listen|🎧|Ouço música no carro.|I listen to music in the car.
falar|to speak|🗣️|Você fala inglês?|Do you speak English?
dizer|to say|💬|O que ele disse?|What did he say?
saber|to know (a fact)|🧠|Não sei.|I don’t know.
conhecer|to know (person)|🤝|Você conhece a Ana?|Do you know Ana?
querer|to want|🙏|Quero um café.|I want a coffee.
poder|can|💪|Posso ajudar?|Can I help?
precisar|to need|🆘|Preciso de ajuda.|I need help.
pegar|to take / catch|✋|Pego o metrô.|I take the metro.
dar|to give|🎁|Me dá a mão.|Give me your hand.
abrir|to open|🔓|Abre a janela.|Open the window.
fechar|to close|🔒|A loja fecha às oito.|The shop closes at eight.
procurar|to look for|🔍|Procuro minhas chaves.|I’m looking for my keys.
achar|to find / to think|💡|Achei um restaurante ótimo.|I found a great restaurant.
esperar|to wait|⏳|Te espero na estação.|I’ll wait for you at the station.
dormir|to sleep|😴|Durmo oito horas.|I sleep eight hours.
`),
  t('A1', 'routine', '⏰', 'Daily routine', 'La routine', `
acordar|to wake up|⏰|Acordo às sete.|I wake up at seven.
levantar|to get up|🛏️|Levanto cedo.|I get up early.
tomar banho|to have a shower|🚿|Tomo banho de manhã.|I shower in the morning.
se vestir|to get dressed|👔|Me visto rápido.|I get dressed quickly.
o almoço|lunch|🥗|O almoço é ao meio-dia.|Lunch is at noon.
o jantar|dinner|🍝|O jantar está pronto!|Dinner is ready!
escovar os dentes|to brush your teeth|🪥|Escova os dentes!|Brush your teeth!
ir dormir|to go to bed|🌙|Vou dormir às onze.|I go to bed at eleven.
sair|to go out / leave|🚪|Saio de casa às oito.|I leave home at eight.
voltar|to come back|↩️|Volto às seis.|I come back at six.
cedo|early|🌅|Cheguei cedo.|I arrived early.
tarde|late|🌆|Já está tarde!|It’s already late!
sempre|always|♾️|Sempre tomo café de manhã.|I always have coffee in the morning.
nunca|never|🚫|Nunca bebo álcool.|I never drink alcohol.
às vezes|sometimes|🔀|Às vezes vou à academia.|Sometimes I go to the gym.
geralmente|usually|📅|Geralmente vou de bicicleta.|I usually cycle.
`),
  t('A1', 'questions', '❓', 'Asking questions', 'Poser des questions', `
o que|what|❓|O que é isso?|What’s that?
quem|who|🕵️|Quem é ele?|Who is he?
onde|where|📍|Onde fica o banheiro?|Where is the bathroom?
quando|when|📆|Quando é seu aniversário?|When is your birthday?
por que|why|🤔|Por que você está triste?|Why are you sad?
como|how|🤷|Como vai?|How are you?
quantos|how many|🔢|Quantas pessoas vêm?|How many people are coming?
qual|which|☝️|Qual é seu filme favorito?|What’s your favourite film?
porque|because|💡|Estudo português porque amo o Brasil.|I study Portuguese because I love Brazil.
de onde|where from|🌍|De onde você é?|Where are you from?
`),
  t('A1', 'animals', '🐾', 'Animals', 'Les animaux', `
o cachorro|dog|🐕|Meu cachorro se chama Bolt.|My dog is called Bolt.
o gato|cat|🐈|O gato dorme no sofá.|The cat sleeps on the sofa.
o pássaro|bird|🐦|Um pássaro canta.|A bird is singing.
o cavalo|horse|🐎|O cavalo corre rápido.|The horse runs fast.
a vaca|cow|🐄|A vaca dá leite.|The cow gives milk.
o porco|pig|🐖|O porco está dormindo.|The pig is sleeping.
o coelho|rabbit|🐇|O coelho come cenoura.|The rabbit eats a carrot.
o macaco|monkey|🐒|O macaco come banana.|The monkey eats a banana.
a onça|jaguar|🐆|A onça vive na floresta.|The jaguar lives in the forest.
o papagaio|parrot|🦜|O papagaio fala!|The parrot talks!
a tartaruga|turtle|🐢|A tartaruga é lenta.|The turtle is slow.
a borboleta|butterfly|🦋|Uma borboleta azul.|A blue butterfly.
`),
  t('A1', 'clothes', '👕', 'Clothes', 'Les vêtements', `
a camisa|shirt|👔|Uma camisa branca.|A white shirt.
a camiseta|T-shirt|👕|Uma camiseta de algodão.|A cotton T-shirt.
a calça|trousers|👖|Essa calça está comprida.|These trousers are long.
o vestido|dress|👗|Ela usa um vestido vermelho.|She’s wearing a red dress.
a saia|skirt|🩳|Uma saia de verão.|A summer skirt.
os sapatos|shoes|👞|Preciso de sapatos novos.|I need new shoes.
o casaco|coat|🧥|Põe o casaco, está frio.|Put your coat on, it’s cold.
o chinelo|flip-flops|🩴|De chinelo na praia.|In flip-flops at the beach.
o boné|cap|🧢|Um boné para o sol.|A cap for the sun.
os óculos|glasses|👓|Cadê meus óculos?|Where are my glasses?
usar|to wear / use|🧥|Ele sempre usa gravata.|He always wears a tie.
`),
  t('A1', 'weather', '🌦️', 'Weather', 'La météo', `
o tempo|weather|🌤️|Como está o tempo?|What’s the weather like?
está sol|it’s sunny|☀️|Hoje está sol.|It’s sunny today.
está chovendo|it’s raining|🌧️|Está chovendo muito.|It’s raining a lot.
está calor|it’s hot|🥵|No verão está calor.|It’s hot in summer.
está frio|it’s cold|🥶|Hoje está frio.|It’s cold today.
a chuva|rain|☔|A chuva é forte.|The rain is heavy.
o vento|wind|🌬️|Está ventando muito.|It’s very windy.
a nuvem|cloud|☁️|O céu está cheio de nuvens.|The sky is full of clouds.
o guarda-chuva|umbrella|☂️|Leva o guarda-chuva.|Take the umbrella.
o verão|summer|🏖️|No verão vamos à praia.|In summer we go to the beach.
o inverno|winter|❄️|No sul o inverno é frio.|In the south winter is cold.
`),
  t('A1', 'school', '🏫', 'At school', 'À l’école', `
a escola|school|🏫|A escola fica perto.|The school is close.
a aula|class / lesson|🧑‍🏫|A aula começa às oito.|The class starts at eight.
o professor|teacher|👩‍🏫|O professor explica bem.|The teacher explains well.
o aluno|pupil / student|🧑‍🎓|Há vinte alunos.|There are twenty pupils.
o livro|book|📕|Abram o livro na página dez.|Open your books at page ten.
o caderno|exercise book|📓|Escreve no caderno.|Write in your exercise book.
o lápis|pencil|✏️|Você tem um lápis?|Do you have a pencil?
a caneta|pen|🖊️|Assina aqui com a caneta.|Sign here with the pen.
a lição de casa|homework|📝|Tenho muita lição de casa.|I have a lot of homework.
a pergunta|question|❓|Tenho uma pergunta.|I have a question.
a resposta|answer|💡|A resposta está certa.|The answer is right.
aprender|to learn|🌱|Aprendo dez palavras por dia.|I learn ten words a day.
entender|to understand|🤔|Não entendi.|I didn’t understand.
`),
  t('A2', 'kitchen', '🍳', 'In the kitchen', 'Dans la cuisine', `
o prato|plate|🍽️|Põe os pratos na mesa.|Put the plates on the table.
o copo|glass|🥛|Um copo d’água.|A glass of water.
a xícara|cup|☕|Uma xícara de café.|A cup of coffee.
a faca|knife|🔪|A faca corta bem.|The knife cuts well.
o garfo|fork|🍴|Preciso de um garfo.|I need a fork.
a colher|spoon|🥄|Toma a sopa com a colher.|Eat the soup with the spoon.
a panela|pot|🍲|O feijão está na panela.|The beans are in the pot.
o forno|oven|🔥|O bolo está no forno.|The cake is in the oven.
o sal|salt|🧂|Me passa o sal?|Can you pass me the salt?
a manteiga|butter|🧈|Pão com manteiga.|Bread and butter.
cortar|to cut|✂️|Corta os tomates.|Cut the tomatoes.
lavar a louça|to do the dishes|🧽|Eu lavo a louça.|I’ll do the dishes.
`),
  t('A2', 'past', '⏳', 'Talking about the past', 'Parler du passé', `
ontem à noite|last night|🌃|Ontem à noite fomos ao cinema.|Last night we went to the cinema.
semana passada|last week|🗓️|Semana passada eu estava doente.|Last week I was ill.
ano passado|last year|🎆|Ano passado fomos ao Chile.|Last year we went to Chile.
há dois dias|two days ago|⌛|Cheguei há dois dias.|I arrived two days ago.
fui|I went / I was|🚶|Fui à praia.|I went to the beach.
fiz|I did / made|🛠️|Fiz um bolo.|I made a cake.
comi|I ate|🍽️|Comi feijoada.|I ate feijoada.
vi|I saw|👀|Vi a Ana no centro.|I saw Ana in town.
comprei|I bought|🛍️|Comprei um casaco.|I bought a coat.
quando eu era criança|when I was a child|🧒|Quando eu era criança, morava no interior.|When I was a child, I lived in the countryside.
antigamente|in the old days|🕰️|Antigamente aqui tinha um cinema.|There used to be a cinema here.
`),
  t('A2', 'expressions', '💬', 'Everyday expressions', 'Expressions courantes', `
tudo bem|all good / how are you|👌|Tudo bem? — Tudo!|“All good?” “All good!”
claro|of course|✅|Claro que sim!|Of course!
beleza|cool / OK|😎|Às oito? Beleza!|At eight? Cool!
que pena|what a pity|😞|Que pena que você não vem!|What a pity you’re not coming!
não tem problema|no problem|😌|Não tem problema!|No problem!
boa sorte|good luck|🍀|Boa sorte na prova!|Good luck in the exam!
parabéns|congratulations / happy birthday|🎉|Parabéns!|Congratulations!
nossa|wow|😮|Nossa, que lindo!|Wow, how beautiful!
fica tranquilo|don’t worry|😊|Fica tranquilo, vai dar certo.|Don’t worry, it’ll work out.
até mais|see you later|👋|Tchau, até mais!|Bye, see you later!
saúde|cheers / bless you|🥂|Saúde!|Cheers!
valeu|thanks (casual)|🙌|Valeu, cara!|Thanks, mate!
`),
  t('B1', 'linking', '🔗', 'Linking ideas', 'Relier ses idées', `
também|also|➕|Também falo espanhol.|I also speak Spanish.
além disso|besides|📎|Além disso, é grátis.|Besides, it’s free.
por isso|that’s why|➡️|Choveu, por isso ficamos em casa.|It rained, so we stayed home.
enquanto|while|⏯️|Leio enquanto espero.|I read while I wait.
embora|although|🌗|Embora esteja cansado, vou.|Although I’m tired, I’ll go.
assim que|as soon as|⚡|Me liga assim que chegar.|Call me as soon as you arrive.
primeiro|first|1️⃣|Primeiro, obrigado por vir.|First, thanks for coming.
por fim|finally|🏁|Por fim, vamos falar do orçamento.|Finally, let’s talk about the budget.
por exemplo|for example|📌|Gosto de frutas, por exemplo manga.|I like fruit, for example mango.
apesar de|despite|🧱|Apesar da chuva, saímos.|Despite the rain, we went out.
`),
];
