const {Command} = require('sylphy');
const {emotes, receiver, thrower} = require('../../utils/constants');
const utils = require('../../utils/utils');

class Throw extends Command {
    constructor(...args) {
        super(...args, {
            name: 'throw',
            description: 'Throw stuff at someone',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'fun',
            usage: [
                {name: 'user', type: 'member', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        const emote = emotes[~~(Math.random() * emotes.length)];
        const num = ~~(Math.random() * receiver.length);
        const received = receiver[num];
        const give = thrower[num];
        const member = utils.findMember(msg, rawArgs[0]);
        if (!member) return responder.send(`Oops, it seems like I cound't find a member with \`${rawArgs[0]}\`\nPlease specify a name, ID or mention the user.`);
        let description = `**${msg.author.username}** threw ${emote} at **${member.username}**\n\n` +
            `${member.username}: ${received}\n` +
            `${msg.author.username}: ${give}`;
        if (msg.author.id === member.id) description = 'Why do you want to throw stuff at yourself!?';
        if (member.id === client.user.id) description = 'Noo don\'t throw stuff at me!';
        if (member.id === client.admins[0]) description = 'NO! Don\'t hurt my master you meany ;-;';
        responder.send('', {
            embed: {
                color: utils.getDefaultColor(msg, client),
                description: description
            }
        });
    }
}

module.exports = Throw;
