const {Command} = require('sylphy');

class Temp extends Command {
    constructor(...args) {
        super(...args, {
            name: 'temp',
            description: 'temp',
            options: {permissions: ['embedLinks']},
            cooldown: 30,
            group: 'temp',
            usage: [
                {name: 'temp', type: 'member', optional: true},
                {name: 'reason', type: 'string', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {

    }
}

module.exports = Temp;