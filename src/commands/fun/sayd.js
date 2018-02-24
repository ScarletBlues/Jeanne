const {Command} = require('sylphy');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class Sayd extends Command {
    constructor(...args) {
        super(...args, {
            name: 'sayd',
            description: 'Tell the bot to say something and deletes the command message',
            options: {
                botPermissions: ['embedLinks', 'manageMessages']
            },
            cooldown: 10,
            group: 'fun',
            usage: [
                {name: 'text', type: 'string', optional: false},
                {name: 'channel', type: 'channel', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}) {
        const chan = msg.channelMentions[0] ? msg.channel.guild.channels.get(msg.channelMentions[0]) : msg.channel;
        try {
            await chan.createMessage({
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    description: `${rawArgs[0]}` || 'echo'
                }
            });
            await msg.delete();
        } catch (e) {
            logger.error(chalk.red.bold(e));
        }
    }
}

module.exports = Sayd;
