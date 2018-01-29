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

    async handle({msg}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join('');
        const idRegex = /^\d{17,18}$/.test(args);
        if (idRegex === false) return msg.channel.createMessage('\\❌ Invalid message id.');
        msg.channel.pinMessage(args);
    }
}

module.exports = Pin;