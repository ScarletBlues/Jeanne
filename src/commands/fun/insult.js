const {Command} = require('sylphy');
const {pejorative, deities, taboo} = require('../../utils/constants');
const utils = require('../../utils/utils');

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

    async handle({msg, rawArgs}, responder) {
        const member = rawArgs[0] ? utils.findMember(msg, rawArgs[0]) : null;
        const msgString = `${randword(pejorative)} ${randword(deities)} ${randword(taboo)}`;
        member ? responder.send(`${member.username}, ${msgString}`) : responder.send(msgString);
    }
}

module.exports = Insult;
