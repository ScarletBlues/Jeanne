const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');

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

    async handle({msg, client}) {
        const choice = RESPONSES[~~(Math.random() * RESPONSES.length)];
        const m = await msg.channel.createMessage({
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                author: {
                    name: `${choice}`,
                }
            }
        });
        m.edit({
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                author: {
                    name: `${choice}`,
                },
                description: `Took me ${m.timestamp - msg.timestamp}ms`
            }
        });
    }
}

module.exports = Ping;