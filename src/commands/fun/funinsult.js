const {Command} = require('sylphy');
const utils = require('../../utils/utils');
const {fillerWords, templates} = require('../../utils/constants');

const insult = () => {
    const getRandomWord = () => {
        return fillerWords[~~(Math.random() * fillerWords.length)];
    };
    return templates[~~(Math.random() * templates.length)].replace(/{{REPLACE}}/g, getRandomWord);
};

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

    async handle({msg, rawArgs}, responder) {
        const member = rawArgs[0] ? utils.findMember(msg, rawArgs[0]) : null;
        member ? responder.send(`${member.username}, ${insult()}`) : responder.send(insult());
    }
}

module.exports = Funinsult;
