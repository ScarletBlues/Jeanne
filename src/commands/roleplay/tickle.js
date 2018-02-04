const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');
const axios = require('axios');
const findMember = require('../../utils/utils.js').findMember;

class Tickle extends Command {
    constructor(...args) {
        super(...args, {
            name: 'tickle',
            description: 'tickle someone.',
            group: 'roleplay'
        });
    }

    async handle({msg}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (!args) return msg.channel.createMessage('❎ | Please mention a member to tickle');

        const member = findMember(msg, args);
        if (!member) return msg.channel.createMessage(`❎ | Couldn't find a member for **${args}**`);

        const base_url = 'https://rra.ram.moe';
        const type = 'tickle';
        const path = '/i/r?type=' + type;

        const res = await axios.get(base_url + path);
        if (res.data.error) return msg.channel.createMessage(`❎ | Something went wrong while requesting the image.\n\`\`\`${res.data.error}\`\`\``);
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                title: `${msg.author.nickname ? msg.author.nickname : msg.author.username} tickles ${member.nickname ? member.nickname : member.username}`,
                image: {
                    url: base_url + res.data.path
                }
            }
        });
    }
}

module.exports = Tickle;