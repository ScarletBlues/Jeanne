const {Command} = require('sylphy');
const {verbs, adjectives, nouns} = require('../../utils/constants');

function randword(arr) {
    return arr[~~(Math.random() * arr.length)];
}

class Oldinsult extends Command {
    constructor(...args) {
        super(...args, {
            name: 'oldinsult',
            description: 'Generate old shakespeare-rified insults',
            group: 'fun',
            usage: [
                {name: 'userToInsult', type: 'member', optional: true}
            ],
            aliases: ['oinsult'],
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        const member = rawArgs[0] ? client.utils.findMember(msg, rawArgs[0]) : null;
        const msgString = `Thou ${randword(verbs)} ${randword(adjectives)} ${randword(nouns)}`;
        member ? responder.send(`${member.username}, ${msgString}`) : responder.send(msgString);
    }
}

module.exports = Oldinsult;