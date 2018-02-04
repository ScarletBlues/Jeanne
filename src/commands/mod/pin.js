const {Command} = require('sylphy');

class Pin extends Command {
    constructor(...args) {
        super(...args, {
            name: 'pin',
            description: 'Pin a message',
            options: {hidden: true, permissions: ['manageMessages']},
            group: 'mod'
        });
    }

    async handle({msg, rawArgs}, responder) {
        const idRegex = /^\d{17,18}$/.test(rawArgs[0]);
        if (idRegex === false) return responder.send('\\❌ Invalid message id.');
        msg.channel.pinMessage(rawArgs[0]);
    }
}

module.exports = Pin;