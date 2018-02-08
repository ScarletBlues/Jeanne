const {Command} = require('sylphy');

const fillerWords = [
    "burrito",
    "taco",
    "head",
    "big",
    "pillow lips",
    "boring",
    "bro eyes",
    "fooligan",
    "blubbie"
];

const templates = [
    "Who are you to {{REPLACE}} {{REPLACE}}!",
    "Why is the back of your {{REPLACE}} so {{REPLACE}}?",
    "I love you {{REPLACE}}",
    "What is that on your {{REPLACE}}, a pringle?",
    "HISS",
    "Woah! From here your {{REPLACE}} looks like a {{REPLACE}}."
];

class Funinsult extends Command {
    constructor(...args) {
        super(...args, {
            name: 'funinsult',
            description: 'Generate fun insults',
            group: 'fun',
            aliases: ['finsult'],
            usage: [
                {name: 'userToInsult', type: 'member', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        const insult = () => {
            const getRandomWord = () => {
                return fillerWords[~~(Math.random() * fillerWords.length)];
            };
            return templates[~~(Math.random() * templates.length)].replace(/{{REPLACE}}/g, getRandomWord);
        };
        const member = rawArgs[0] ? client.utils.findMember(msg, rawArgs[0]) : null;
        member ? responder.send(`${member.username}, ${insult()}`) : responder.send(insult());
    }
}

module.exports = Funinsult;