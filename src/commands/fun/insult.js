const {Command} = require('sylphy');
const {pejorative, deities, taboo} = require('../../utils/constants');

function randword(arr) {
    return arr[~~(Math.random() * arr.length)];
}

class Insult extends Command {
    constructor(...args) {
        super(...args, {
            name: 'insult',
            description: 'Generate an actual insult',
            group: 'fun',
            usage: [
                {name: 'userToInsult', type: 'member', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        const member = rawArgs[0] ? client.utils.findMember(msg, rawArgs[0]) : null;
        const msgString = `${randword(pejorative)} ${randword(deities)} ${randword(taboo)}`;
        member ? responder.send(`${member.username}, ${msgString}`) : responder.send(msgString);
    }
}

module.exports = Insult;