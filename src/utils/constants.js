/**
 * Catfacts command
 * @type {string[]}
 */
const catfacts = [
    'Every year, nearly four million cats are eaten in Asia',
    'On average, cats spend 2/3 of every day sleeping',
    'Unlike dogs, cats do not have a sweet tooth',
    'When a cat chases its prey, it keeps its head level',
    'The technical term for a cat\'s hairball is a bezoar',
    'A group of cats is called a clowder',
    'Female cats tend to be right pawed, while male cats are more often left pawed',
    'A cat cannot climb head first down a tree because its claws are curved the wrong way',
    'Cats make about 100 different sounds',
    'A cat\'s brain is biologically more similar to a human brain than it is to a dog\'s',
    'There are more than 500 million domestic cats in the world',
    'Approximately 24 cat skins can make a coat',
    'During the Middle Ages, cats were associated with witchcraft',
    'Cats are the most popular pet in North American Cats are North America\'s most popular pets',
    'Approximately 40,000 people are bitten by cats in the U.S.',
    'A cat\'s hearing is better than a dog\'s',
    'A cat can travel at a top speed of approximately 31 mph (49 km) over a short distance',
    'A cat can jump up to five times its own height in a single bound',
    'Some cats have survived falls of over 20 meters',
    'Researchers are unsure exactly how a cat purrs',
    'When a family cat died in ancient Egypt, family members would mourn by shaving off their eyebrows',
    'In 1888, more than 300,000 mummified cats were found an Egyptian cemetery',
    'Most cats give birth to a litter of between one and nine kittens',
    'Smuggling a cat out of ancient Egypt was punishable by death',
    'The earliest ancestor of the modern cat lived about 30 million years ago',
    'The biggest wildcat today is the Siberian Tiger',
    'The smallest wildcat today is the Black-footed cat',
    'Many Egyptians worshipped the goddess Bast, who had a woman\'s body and a cat\'s head',
    'Mohammed loved cats and reportedly his favorite cat, Muezza, was a tabby',
    'The smallest pedigreed cat is a Singapura, which can weigh just 4 lbs',
    'Cats hate the water because their fur does not insulate well when it\'s wet',
    'The Egyptian Mau is probably the oldest breed of cat',
    'A cat usually has about 12 whiskers on each side of its face',
    'A cat\'s eyesight is both better and worse than humans',
    'A cat\'s jaw can\'t move sideways, so a cat can\'t chew large chunks of food',
    'A cat almost never meows at another cat, mostly just humans',
    'A cat\'s back is extremely flexible because it has up to 53 loosely fitting vertebrae',
    'Many cat owners think their cats can read their minds',
    'Two members of the cat family are distinct from all others: the clouded leopard and the cheetah',
    'In Japan, cats are thought to have the power to turn into super spirits when they die',
    'Most cats had short hair until about 100 years ago, when it became fashionable to own cats and experiment with breeding',
    'Cats have 32 muscles that control the outer ear',
    'Cats have about 20,155 hairs per square centimeter',
    'The first cat show was organized in 1871 in London',
    'A cat has 230 bones in its body',
    'Foods that should not be given to cats include onions, garlic, green tomatoes, raw potatoes, chocolate, grapes, and raisins',
    'A cat\'s heart beats nearly twice as fast as a human heart',
    'Cats spend nearly 1/3 of their waking hours cleaning themselves',
    'Grown cats have 30 teeth',
    'The largest cat breed by mean weight is the Savannah, at 10kg',
    'Cats are extremely sensitive to vibrations',
    'The cat who holds the record for the longest non-fatal fall is Andy',
    'The richest cat is Blackie who was left £15 million by his owner, Ben Rea',
    'Around the world, cats take a break to nap —a catnap— 425 million times a day',
    'In homes with more than one cat, it is best to have cats of the opposite sex. They tend to be better housemates.',
    'Cats are unable to detect sweetness in anything they taste',
    'Perhaps the oldest cat breed on record is the Egyptian Mau, which is also the Egyptian language\'s word for cat',
    'In one litter of kittens, there could be multiple father cats',
    'Teeth of cats are sharper when they\'re kittens. After six months, they lose their needle-sharp milk teeth',
    'Collectively, kittens yawn about 200 million time per hour',
    'According to the International Species Information Service, there are only three Marbled Cats still in existence worldwide.  One lives in the United States.',
    'Cats show affection and mark their territory by rubbing on people. Glands on their face, tail and paws release a scent to make its mark',
    'Maine Coons are the most massive breed of house cats. They can weigh up to around 24 pounds',
    'If you killed a cat in the ages of Pharaoh, you could\'ve been put to death',
    'Most cats will eat 7 to 20 small meals a day. This interesting fact is brought to you by Nature\'s Recipe®',
    'Most cats don\'t have eyelashes',
    'Call them wide-eyes: cats are the mammals with the largest eyes',
    'Cats who eat too much tuna can become addicted, which can actually cause a Vitamin E deficiency',
    'Cats can pick up on your tone of voice, so sweet-talking to your cat has more of an impact than you think',
    'Some cats can survive falls from as high up as 65 feet or more',
    'Genetically, cats\' brains are more similar to that of a human than a dog\'s brain',
    'If your cat\'s eyes are closed, it\'s not necessarily because it\'s tired. A sign of closed eyes means your cat is happy or pleased',
    'Cats CAN be lefties and righties, just like us. More than forty percent of them are, leaving some ambidextrous',
    'Cats have the skillset that makes them able to learn how to use a toilet',
    'Each side of a cat\'s face has about 12 whiskers',
    'Landing on all fours is something typical to cats thanks to the help of their eyes and special balance organs in their inner ear. These tools help them straighten themselves in the air and land upright on the ground.',
    'Eating grass rids a cats\' system of any fur and helps with digestion',
    'Cats have 24 more bones than humans',
    'Black cats aren\'t an omen of ill fortune in all cultures. In the UK and Australia, spotting a black cat is good luck',
    'The Maine Coon is appropriately the official State cat of its namesake state',
    'The world\'s most fertile cat, whose name was Dusty, gave birth to 420 kittens in her lifetime',
    'Sometimes called the Canadian Hairless, the Sphynx is the first cat breed that has lasted this long—the breed has been around since 1966',
    'Sir Isaac Newton, among his many achievements, invented the cat flap door',
    'In North America, cats are a more popular pet than dogs. Nearly 73 million cats and 63 million dogs are kept as household pets',
    'Today, cats are living twice as long as they did just 50 years ago',
    'Outdoor cats\' lifespan averages at about 3 to 5 years; indoor cats have lives that last 16 years or more',
    'Cats have the cognitive ability to sense a human\'s feelings and overall mood',
    'Cats prefer their food at room temperature—not too hot, not too cold',
    'Bobtails are known to have notably short tails -- about half or a third the size of the average cat',
    'A fingerprint is to a human as a nose is to a cat',
    'Cats have over 100 sounds in their vocal repertoire, while dogs only have 10',
    'Cats came to the Americas from Europe as pest controllers in the 1750s',
    'According to the Association for Pet Obesity Prevention (APOP), about 50 million of our cats are overweight',
    'Cats use their whiskers to measure openings, indicate mood and general navigation',
    'Blue-eyed cats have a high tendency to be deaf, but not all cats with blue eyes are deaf',
    'Ancient Egyptians first adored cats for their finesse in killing rodents—as far back as 4,000 years ago',
    'The color of York Chocolates becomes richer with age. Kittens are born with a lighter coat than the adults',
    'Because of widespread cat smuggling in ancient Egypt, the exportation of cats was a crime punishable by death',
    'Cats actually have dreams, just like us. They start dreaming when they reach a week old',
    'It is important to include fat in your cat\'s diet because they\'re unable to make the nutrient in their bodies on their own',
    'A cat\'s field of vision does not cover the area right under its nose',
    'Talk about Facetime: Cats greet one another by rubbing their noses together',
    'Cats sleep 16 hours of any given day',
    'Although it is known to be the tailless cat, the Manx can be born with a stub or a short tail',
    'A Selkirk slowly loses its naturally-born curly coat, but it grows again when the cat is around 8 months',
    'A cat\'s heart beats almost double the rate of a human heart, from 110 to 140 beats per minute',
    'Ragdoll cats live up to their name: they will literally go limp, with relaxed muscles, when lifted by a human',
    'Unlike most other cats, the Turkish Van breed has a water-resistant coat and enjoys being in water',
    'Webbed feet on a cat? The Peterbald\'s got \'em! They make it easy for the cat to get a good grip on things with skill',
    'Despite appearing like a wild cat, the Ocicat does not have an ounce of wild blood',
    'Cat\'s back claws aren\'t as sharp as the claws on their front paws',
    'A group of kittens is called a kindle, and clowder is a term that refers to a group of adult cats',
    'A third of cats\' time spent awake is usually spent cleaning themselves',
    'A female cat is also known to be called a queen or a molly',
    'Want to call a hairball by its scientific name? Next time, say the word bezoar',
    'Cats have a 5 toes on their front paws and 4 on each back paw',
    'In multi-pet households, cats are able to get along especially well with dogs if they\'re introduced when the cat is under 6 months old and the dog is under one year old',
    'Twenty-five percent of cat owners use a blow drier on their cats after bathing',
    'Rather than nine months, cats\' pregnancies last about nine weeks',
    'It has been said that the Ukrainian Levkoy has the appearance of a dog, due to the angles of its face',
    'A cat can reach up to five times its own height per jump',
    'Cats have a strong aversion to anything citrus',
    'Cats would rather starve themselves than eat something they don\'t like. This means they will refuse an unpalatable -- but nutritionally complete -- food for a prolonged period',
    'The Snow Leopard, a variety of the California Spangled Cat, always has blue eyes',
    'The two outer layers of a cat\'s hair are called, respectively, the guard hair and the awn hair',
    'When a household cat died in ancient Egypt, its owners showed their grief by shaving their eyebrows',
    'Caution during Christmas: poinsettias may be festive, but they’re poisonous to cats',
    'Most kittens are born with blue eyes, which then turn color with age',
    'A cat\'s meow is usually not directed at another cat, but at a human. To communicate with other cats, they will usually hiss, purr and spit.',
    'According to the Guinness World Records, the largest domestic cat litter totaled at 19 kittens, four of them stillborn',
    'As temperatures rise, so do the number of cats. Cats are known to breed in warm weather, which leads many animal advocates worried about the plight of cats under Global Warming.',
    'Cats\' rough tongues enable them to clean themselves efficiently and to lick clean an animal bone',
    'Most cat litters contain four to six kittens',
    'A Japanese cat figurine called Maneki-Neko is believed to bring good luck',
    'One of Muhammad\'s companions was nicknamed Abu Hurairah, or Father of the Kitten, because he loved cats',
    'Elvis Presley’s Chinese name is Mao Wong, or Cat King'
];

/**
 * Games
 * @type {string[]}
 */
const games = [
    'with Senpai',
    'with {USERS} users',
    'in {GUILDS} guilds',
    'watching anime',
    'with your waifus'
];

/**
 * Blacklisted nsfw words
 * @type {string[]}
 */
const blacklistedWords = [
    'loli',
    'shota',
    'child',
    'young',
    'lolicon',
    'shotacon'
];

/**
 * Funinsult command
 * @type {string[]}
 */
const fillerWords = [
    'burrito',
    'taco',
    'head',
    'big',
    'pillow lips',
    'boring',
    'bro eyes',
    'fooligan',
    'blubbie'
];

/**
 * Funinsult command
 * @type {string[]}
 */
const templates = [
    'Who are you to {{REPLACE}} {{REPLACE}}!',
    'Why is the back of your {{REPLACE}} so {{REPLACE}}?',
    'I love you {{REPLACE}}',
    'What is that on your {{REPLACE}}, a pringle?',
    'HISS',
    'Woah! From here your {{REPLACE}} looks like a {{REPLACE}}.'
];

/**
 * Insult command
 * @type {string[]}
 */
const pejorative = [
    'Holy mother of',
    'Holy',
    'Jumping',
    'Great',
    'Wanking',
    'Steaming',
    'Fabricated',
    'Buggering',
    'Colossal',
    'Divine',
    'Crazy',
    'Bat shit crazy',
    'Sweet',
    'Half-baked',
    'Cracked',
    'Suffering',
    'Hairy-arsed',
    'Righteous',
    'Fugly',
    'Moronic',
    'Retarded',
    'Sweet Mary mother of',
    'Crucified',
    'Fetid',
    'Free balling',
    'Butt naked',
    'Ginger',
    'Cheating',
    'Cheese sniffing',
    'arse sniffing',
    'Prick licking',
    'Butt munching',
    'Flying',
    'Teabagging',
    'Bollock naked',
    'Badly shaved',
    'Burning',
    'Spit roasted',
    'Deep fried',
    'Kentucky fried',
    'Pink oboe playing',
    'Fudge packing',
    'Bald',
    'Sweaty bollocked',
    'Juggling',
    'Pillow biting',
    'Skipping',
    'Disco dancing',
    'Yodeling'
];

/**
 * Insult command
 * @type {string[]}
 */
const deities = [
    'Christ',
    'Allah',
    'Mohammed',
    'Zeus',
    'Jesus',
    'Jehova',
    'Jesus H. Christ',
    'Brahma',
    'Krishna',
    'Odin',
    'Neptune',
    'Pan',
    'Rama',
    'Hades',
    'Gaia',
    'Ganesha',
    'Horus',
    'Janus',
    'Jeebus',
    'Moses',
    'Shiva',
    'Thor',
    'Venus',
    'Vishnu',
    'Yaweh',
    'Mercury',
    'Jesus and Mohammed',
    'Buddha',
    'Flying Spaghetti Monster'
];

/**
 * Insult command
 * @type {string[]}
 */
const taboo = [
    'almighty',
    'on a bike',
    'alive',
    'fuck-sticks',
    'on toast',
    'bollocks',
    'shite',
    'basher',
    'gobshite',
    'crap',
    'in a chicken basket',
    'piss',
    'breath',
    'arse kisser',
    'fidler',
    '\'s cock',
    '\'s bellend',
    '\'s wrinkled ballsack',
    '\'s tits',
    '\'s wet follow through',
    'n\' shit',
    'fart knocker',
    '\'s crusty jizz sock',
    'wazzock',
    'cock tickler',
    'on a moped',
    'spunk',
    'on a sunshine bus',
    'in Hell',
    'in Heaven',
    'turd polisher',
    'fluffer',
    'knickers',
    'undercrackers',
    'gravy',
    '\'s oversized codpiece',
    'jam',
    'jelly',
    'scuttler',
    'botter',
    'spanker',
    'in Asda',
    '\'s cock snot',
    '\'s dirtbox',
    'jugs',
    'fart catcher',
    'knockers',
    'oomlaaters',
    'bum tickler',
    'spanner',
    'spooge',
    'spanker'
];

/**
 * Oldinsult command
 * @type {string[]}
 */
const verbs = [
    'artless',
    'bawdy',
    'beslubbering',
    'bootless',
    'churlish',
    'cockered',
    'clouted',
    'craven',
    'currish',
    'dankish',
    'dissembling',
    'droning',
    'errant',
    'fawning',
    'fobbing',
    'froward',
    'frothy',
    'gleeking',
    'goatish',
    'gorbellied',
    'impertinent',
    'infectious',
    'jarring',
    'loggerheaded',
    'lumpish',
    'mammering',
    'mangled',
    'mewling',
    'paunchy',
    'pribbling',
    'puking',
    'puny',
    'qualling',
    'rank',
    'reeky',
    'roguish',
    'ruttish',
    'saucy',
    'spleeny',
    'spongy',
    'surly',
    'tottering',
    'unmuzzled',
    'vain',
    'venomed',
    'villainous',
    'warped',
    'wayward',
    'weedy',
    'yeasty'
];

/**
 * Oldinsult command
 * @type {string[]}
 */
const adjectives = [
    'base-court',
    'bat-fowling',
    'beef-witted',
    'beetle-headed',
    'boil-brained',
    'clapper-clawed',
    'clay-brained',
    'common-kissing',
    'crook-pated',
    'dismal-dreaming',
    'dizzy-eyed',
    'doghearted',
    'dread-bolted',
    'earth-vexing',
    'elf-skinned',
    'fat-kidneyed',
    'fen-sucked',
    'flap-mouthed',
    'fly-bitten',
    'folly-fallen',
    'fool-born',
    'full-gorged',
    'guts-griping',
    'half-faced',
    'hasty-witted',
    'hedge-born',
    'hell-hated',
    'idle-headed',
    'ill-breeding',
    'ill-nurtured',
    'knotty-pated',
    'milk-livered',
    'motley-minded',
    'onion-eyed',
    'plume-plucked',
    'pottle-deep',
    'pox-marked',
    'reeling-ripe',
    'rough-hewn',
    'rude-growing',
    'rump-fed',
    'shard-borne',
    'sheep-biting',
    'spur-galled',
    'swag-bellied',
    'tardy-gaited',
    'tickle-brained',
    'toad-spotted',
    'unchin-snouted',
    'weather-bitten'
];

/**
 * Oldinsult command
 * @type {string[]}
 */
const nouns = [
    'apple-john!',
    'baggage!',
    'barnacle!',
    'bladder!',
    'boar-pig!',
    'bugbear!',
    'bum-bailey!',
    'canker-blossom!',
    'clack-dish!',
    'clotpole!',
    'coxcomb!',
    'codpiece!',
    'death-token!',
    'dewberry!',
    'flap-dragon!',
    'flax-wench!',
    'flirt-gill!',
    'foot-licker!',
    'fustilarian!',
    'giglet!',
    'gudgeon!',
    'haggard!',
    'harpy!',
    'hedge-pig!',
    'horn-beast!',
    'hugger-mugger!',
    'joithead!',
    'lewdster!',
    'lout!',
    'maggot-pie!',
    'malt-worm!',
    'mammet!',
    'measle!',
    'minnow!',
    'miscreant!',
    'moldwarp!',
    'mumble-news!',
    'nut-hook!',
    'pigeon-egg!',
    'pignut!',
    'puttock!',
    'pumpion!',
    'ratsbane!',
    'scut!',
    'skainsmate!',
    'strumpet!',
    'varlot!',
    'vassal!',
    'whey-face!',
    'wagtail!'
];

/**
 * Puns command
 * @type {string[]}
 */
const puns = [
    'In Corning I walked along Argonne Street, and I noticed all the houses were vacant. The people Argonne.',
    'A Trinidadian family is one with three fathers.',
    'My friend is good at comforting people who are going off the deep end. He\'s very deep-endable.',
    'I visited the Corning Glass Museum and told them I could make Pyrex without hardly trying. I\'ve never done baking, so any pies I make will surely be wrecks.',
    'A naturalist saw a whale dribbling out food on the sea floor then tracing complex shapes in it with its tongue, and reported: Whale observed painting with a krill lick.',
    'In the cemetery, the dead were jamming but not playing in tune. It was a cacoffiny.',
    'When the nurse said I was not pretty enough for intra-Venus feeding, I pleaded that I had graduated from an IV-league school.',
    'Here are stallions for the stage hands and cameramen to ride, but the actors have to ride those geldings over there.\nThat\'s not fair. Why can\'t we actors ride stallions too?\nBecause they haven\'t been cast-rated.',
    'If you decide to take a bus, and by chance you have the required exact change, that\'s a coin-cidence.',
    'A geometer claimed he was carrying a divine message that people should be both Catholic and Baptist, and called himself the angel bisecter.',
    'Fossil-fool politicians in many countries are following Nero: playing the liar as Earth burns.',
    'What did the judge write while on the Space Shuttle?',
    'My girlfriend was named "Stacy" but she changed her name shortly before I met her. I am so glad I found my ex-Stacy.',
    'Making a pun on someone\'s name is called onomastication — and the victim usually says, or at least thinks, "Oh, no!".',
    'A Christian protester shouted to a woman who was entering an abortion clinic, "Don\'t be de-fetused! God will provide everything you need, unless he doesn\'t."',
    'How did you do on your French exam?',
    'Where do orchids come from?',
    'Why did they put the Royal College of Physicians (in Dublin) on Kildare Street?',
    '"Why can\'t you keep the ship from drifting?" asked the owner. "Is there a problem with some equipment?" The captain replied, "Cantankerous."',
    'Why did Popeye become a stunt pilot? Because he had a spin-itch.',
    'For a glider pilot to stay aloft for a long time, he must have the courage of his convections.',
    'Copa airlines carries a whale in every plane, just to make sure every flight is copa-cetic.',
    'Airplanes are spreading sonic and chemical pollution around Seattle; residents complain about pew-jet sound.',
    'I found my female sibling weeping, and asked her, "Having a cry, sis?"',
    'How broad are the effects of increased CO2 on the ocean? They stretch from cost to cost.',
    'A drunkard took shelter on a full moon night in a large windowless building. Alas for him, it was a werehouse.',
    'Why can\'t we grow new trees?',
    'My friend had a few acacia trees which flowered acacionally.',
    'Why is the English common law so concerned with property rights? Because the English gentry insisted on proper tea rites every afternoon.',
    'Bakers for the English nobility used cylindrical ovens descending into the ground so that their product would be well bread.',
    'There is a sign in Brooklyn that advertises the law firm of Held, Held, Held and Held. Don\'t call them to get you out of jail!',
    'In most of the world, gamblers use the poker face, but in Scranton they make do with the Poconos.',
    'I went to Paris and saw the Eiffel tower. What an eyeful!',
    'The Grand Canyon is deeply gorgeous.',
    'Does an Anarchist man have an antistate gland instead of a prostate gland?',
    'If you have trouble making decisions, you should get treated by an optician.',
    'Which elements are used in medicine? Helium and curium, and if those fail, barium.',
    'I asked a doctor when there would be a cure for the common cold, and he said it would happen when swine flu.',
    'My neighbor in 1967 got a medical deferment from the draft by presenting his doctor with a case of sham pain.',
    'How should a girl prevent boys from getting infatuated with her? Use a detergent regularly, and when that fails, apply the antidote.',
    'When he gets you alone in the back seat, it means he\'s in the mood for carpetting. And if one thing leads to another, it can be car-sin-ogenic.',
    'We discovered asbestos in the basement; what should we do? Clean it up asbestos we can.',
    'The Boston Celtics have a very frank name that indicates the organization\'s true purpose: sell tix.',
    'Finally, New York City has elected a day-mayor. Koch, Giuliani and Bloomberg were night-mayors.',
    '"The bees\' knees" is the plural of "the beanie".',
    'The crow is a very wise bird: whatever it does, it does with caws.',
    'The ancient Greek goddess of parking was Demeter. If you parked in an unpropitious place, you had to make an offering to Demeter.',
    'The word "procrastination" comes from the Greek myth of Procrastes, who would stretch every task to fit the time available.',
    'Which constellation is Irish? O\'Ryan.',
    'In anthropology, the way people in a group understand their behavior is called "emic"; an outsider\'s objective description of the behavior is called "etic". The relationship between the two is known as the "emetic" relationship.',
    'I met someone who said, "I study microfinance," so I asked if they were too fine to observe with the naked eye.',
    'A boy told me he wanted to spend a year studying abroad, so I told him that each one requires a whole life of study.',
    'A girl I adored found a Latin lover, so I accused her of getting off on a tan gent.',
    'Once when I was feeling sad I drove past an artificial lake and said, "I feel a dam sight better now."',
    'I met a man who was picking his clothing apart at the seams. I asked him why, and he told me, "It\'s my work — I am an auto-detailor."',
    'Which Jazz musician is most popular on the World Wide Web? Bix Baederbecke (known to some as Big Spider Becke).',
    'Did you hear about the free-lance magic advisor? He added consult to conjury.',
    'They are called contractors because their business keeps getting smaller.',
    'The great gothic cathedrals were built by men with hairy behinds, who used to climb to the top of the unfinished building and shake them. People came for miles to see the famous "flying butt-tresses".',
    'Composting is a very useful practice, but it never occurs to me to do it. I guess I\'m non compost mentis.',
    'Chinese gardens often have ponds filled with ornamental fish, and beautiful bridges over them. Watch out for those: if you stand on one, you can get carp-pool tunnel syndrome.',
    'How do you remove the fish from those ponds? With a de-koi.',
    'Why do those fish need less food than we need? They have an economy of scale.',
    'Harvard is built on vector calculus: it has grad students, div students, and girl (curl) students.',
    'You can tell a Cantabridgian because everything he writes is too long.',
    'Fordham university is going to open a very expensive branch in Cambridge, to be called Canta-Fordham.',
    'Two cells went to Las Vegas and formed a syncytial connection.',
    'Modern neurobiology has determined that drunkenness occurs primarily in the michel lobe.',
    'The Stata Center at MIT was infested by mice, and one of them often nibbled on my tea bags. I called it "my tea mouse".',
    'Daylight savings time was invented by a German politician. He was so proud that he changed his name to Adenauer.',
    'In the 1980s there were two students at the AI Lab named Nomi. We were binomial.',
    'I have a young relative named Noemi. I hope she doesn\'t go into TV.',
    'A flautist is a musician who disregards performance conventions.',
    'How do you seduce a cryptographer? Say you\'d like to visit his one-time pad.',
    'What do you say when your sweetheart needs the toilet so urgently that walking isn\'t fast enough?',
    'A company whose employees used pogo sticks to deliver bottled water was called "Pole and Spring Water."',
    'I broke the world record for lying in bed. Instead of a trophy, I got atrophy.',
    'For a few years, Dubya made himself the "teflon president" through religion: he practiced gnostic Christianity.',
    'The Bahai church invites people to join, but the Babai church encourages its members to convert to other faiths.',
    'The delta Jews were a community of Jews who lived in the New Orleans area in the 19th century. How did delta Jews greet each other?',
    'The US mainstream media had a stroke, and now suffer from left-wing hemineglect.',
    'My friend opened a tin of sardines and began eating them with very small bites. I said, "You can\'t do that! That\'s can-nibble-ism!"',
    'I had a great meal at a Moroccan restaurant. Some places are rockin\', and some are Moroccan.',
    'I went to a Nepalese restaurant and had a Nepalling dinner.',
    'Cooking that makes you sick is called queasine.',
    'MacDonald\'s sells "fast food", so called because it is made for not eating.',
    'A gourmet tricked a restaurant into giving him sushi rolls by means of a makiavellian scheme.',
    'Did you hear about the pirates that boarded a ship and stole a cargo of truffles? They were hypha-lootin\' pirates.',
    'A meat chef resigned because he was tired of getting lamb basted.',
    'In London Chinatown, we always used to eat at Poons, because we enjoyed their Lamb Poons.',
    'The waiters at an Ethiopian restaurant in Boston are nasty. They add insult to injera.',
    'What dish combines cocoa and eggplant? Chocolate moussaka.',
    'When Jimmy Carter was chosen as the chief official of the state of Georgia, was that a goobernatorial election?',
    'M&M\'s were invented in ancient Egypt, and were named after the pharaoh Amenemhet.',
    'How does a chemistry professor punish a grad student in the lab? By putting him on tight rations.',
    'Zucchini: a two-piece bathing suit for animals.',
    'Integrated circuit technology would have been lost during the middle ages if it hadn\'t been preserved by the chipmunks.',
    'How do you get a hacker to stop typing and go to sleep? Sing a lulzaby.',
    'Modern laptop monitor design: lengthwise and width foolish.',
    'How do you make a computer chip handle stress? Design it with angst-rom units.',
    'Despite asking over and over, I have been unable to convince the EFF to support my positions — for instance, that Digital Restrictions Management should be illegal, that software should be immune from patent lawsuits, and that digital systems must be redesigned not to collect dossiers about people in general.',
    'Basic is worse than C-sick.',
    'Apple\'s response to Google Glasses will be called iBrowse.',
    'The Pioneer Award I received is a lot nicer than the pie-in-face Award that Bill Gates received at about the same time.',
    'A pair of travelling exhibits on theory of computation was known as the Turing Circus. (Three meanings!)',
    'In the Greek myth of sysfs, every time the programmers thought it was working, they discovered they needed to rewrite it from scratch.',
    'When a monastery sells jams and jellies over the Internet, is that monk e-business?',
    'During the 1980s, millions of computers came to America through LSI-land.',
    'The computer designers who believe processor chips are obsolete must be high on gate-arrayed.',
    'To go with its AIX system (a variant of Unix), IBM redesigned the X Window System and called it Panes. Thus, users of the RT-PC could have AIX and Panes on their machine.',
    'My femmebot wanted an upgrade to be more attractive, so I gave her a sexy new core-set.',
    'In the 1980s, GNU included a program designed to fake the use of COFF format without really understanding it. The program was called Robotussin (COFF medicine for your computer).',
    'When a particularly nasty bug appears close to release time, is that regression to the mean?',
    'The most important point of any digital church is the apse.',
    'At dinner at a Japanese restaurant, the person next to me said she wanted to work with abused children. Since we had not yet received the tempura, I responded, "If battered shrimps are your interest, we should have some soon."',
    'Bento box: a shoe that isn\'t long enough.',
    'The cooks that make negimaki are rapscallions.',
    'In a Japanese restaurant, the waiter offered me sake. I declined the sake, saying, "No thanks, I\'m going to eat cold soba tonight."',
    'Did you know Senator Joe McCarthy was a Shintoist? He thought there were kamis everywhere.',
    'After some time in the rainy capital, I came to understand why Kiwis refer to rubber boots as "Wellingtons".',
    'I took the ferry to the South Island, and when I got off, the locals started mocking me. It wasn\'t that they were mean, though. They just wanted me to feel Picton.',
    'Then I saw that someone was selling chairs and tables made of punga wood. He called them "ferniture".',
    'If there is a Freddo Frog, is there a Semifreddo Salamander?',
    'In Mt Gambier, Australia, the prostitutes had so little custom that they had to moonlight looking after trucks parked in a large lot, while the drivers went to sleep or eat. Later the appreciative town commemorated them by converting the lot into Vansittart Park.',
    'People in Australia who get Alzheimer\'s disease apply for Adelaide.',
    'Kakadu National Park was named after the inbred feral chickens that couldn\'t manage all of "cockadoodle do".',
    'How the echidna got its name: The first naturalist who described this egg-laying mammal at a meeting encountered contemptuous disbelief from his colleagues. One of them even said, "\'e kiddin\' ya".',
    'Australians have domesticated the trolls, and use them to propel cars. So when a car gets low on energy, you take it to a pet-troll station.',
    'Is there a cure for Tasmania?'
];

/**
 * Reverse command constants
 * @type {Object}
 */
const opposites = {
    'b': 'd',
    'd': 'b',
    'z': 's',
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '<': '>',
    '>': '<',
    '/': '\\',
    '\\': '/'
};

/**
 * rps command constants
 * @type {string[]}
 */
const rps = [
    'rock',
    'paper',
    'scissors'
];

/**
 * Slots command constants
 * @type {string[]}
 */
const slots = [
    ':apple:',
    ':pear:',
    ':tangerine:',
    ':lemon:',
    ':banana:',
    ':watermelon:',
    ':grapes:',
    ':strawberry:',
    ':cherries:',
    ':peach:',
    ':cookie:'
];

/**
 * Throw command constants
 * @type {string[]}
 */
const emotes = [
    ':trophy:',
    ':blue_car:',
    ':knife:',
    ':wrench:',
    ':tv:',
    ':poop:',
    ':basketball:',
    ':hammer:',
    ':paperclip:',
    ':scissors:',
    ':key:',
    ':syringe:'
];

/**
 * Throw command constants
 * @type {string[]}
 */
const receiver = [
    'You lil cunt',
    'Whyy!!',
    'Please don\'t do that again',
    'Go away...',
    'Not again >.>',
    'JESUS, why?',
    'common bruh',
    'fek yuu'
];

/**
 * Throw command constants
 * @type {string[]}
 */
const thrower = [
    'Hehe :stuck_out_tongue:',
    'Cus I can!',
    'Ohh I will hehe',
    'tchh',
    'sowwy bby',
    ':yum:',
    'u wot',
    'Hm luv ya 2'
];

/**
 * Guild Whitelist
 * @type {string[]}
 */
const guildWhitelist = [
    '240059867744698368',
    '214966600770519041'
];

const guildNameKeywords = [
    'bot',
    'robot',
    'farm'
];

module.exports = {
    catfacts,
    games,
    blacklistedWords,
    fillerWords,
    templates,
    pejorative,
    deities,
    taboo,
    verbs,
    adjectives,
    nouns,
    puns,
    opposites,
    rps,
    slots,
    emotes,
    receiver,
    thrower,
    guildWhitelist,
    guildNameKeywords
};
