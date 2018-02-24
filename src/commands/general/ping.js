const {Command} = require('sylphy');
const utils = require('../../utils/utils');

const RESPONSES = [
    'pong',
    'It\'s not like I wanted to say pong or anything b-baka!',
    'pong!',
    'what!?',
    'E-ehh pong?',
    'No...'
];

class Ping extends Command {
    constructor(...args) {
        super(...args, {
            name: 'ping',
            description: 'pong!',
            group: 'general',
            aliases: ['pong']
        });
    }

    async handle({msg, client}, responder) {
        const choice = RESPONSES[~~(Math.random() * RESPONSES.length)];
        const m = await responder.send('', {
            embed: {
                color: utils.getDefaultColor(msg, client),
                author: {name: choice}
            }
        });
        m.edit({
            embed: {
                color: utils.getDefaultColor(msg, client),
                author: {name: choice},
                description: `Took me ${m.timestamp - msg.timestamp}ms`
            }
        });
    }
}

module.exports = Ping;
