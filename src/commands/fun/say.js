const {Command} = require('sylphy');

class Say extends Command {
    constructor(...args) {
        super(...args, {
            name: 'say',
            description: 'Tell the bot to say something',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'fun',
            usage: [
                {name: 'text', type: 'string', optional: false},
                {name: 'channel', type: 'channel', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs}) {
        const chan = msg.channelMentions[0] ? msg.channel.guild.channels.get(msg.channelMentions[0]) : msg.channel;
        chan.createMessage({
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: `${rawArgs[0]}` || 'echo'
            }
        });
    }
}

module.exports = Say;