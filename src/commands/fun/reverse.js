const {Command} = require('sylphy');

class Reverse extends Command {
    constructor(...args) {
        super(...args, {
            name: 'reverse',
            description: 'Reverse text',
            group: 'fun',
            usage: [
                {name: 'text', type: 'string', optional: false}
            ]
        });
    }

    async handle({client, rawArgs}, responder) {
        if (!rawArgs[0]) return responder.send('Please give me something to reverse.');
        responder.send(client.utils.reverse(rawArgs[0]));
    }
}

module.exports = Reverse;