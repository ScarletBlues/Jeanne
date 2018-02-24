const {Command} = require('sylphy');
const axios = require('axios');
const findMember = require('../../utils/utils.js').findMember;
const utils = require('../../utils/utils');

class Hug extends Command {
    constructor(...args) {
        super(...args, {
            name: 'hug',
            description: 'give someone a hug.',
            group: 'roleplay'
        });
    }

    async handle({msg, client}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (!args) return msg.channel.createMessage('❎ | Please mention a member to hug');

        const member = findMember(msg, args);
        if (!member) return msg.channel.createMessage(`❎ | Couldn't find a member for **${args}**`);

        const base_url = 'https://rra.ram.moe';
        const type = 'hug';
        const path = '/i/r?type=' + type;

        const res = await axios.get(base_url + path);
        if (res.data.error) return msg.channel.createMessage(`❎ | Something went wrong while requesting the image.\n\`\`\`${res.data.error}\`\`\``);
        msg.channel.createMessage({
            embed: {
                color: utils.getDefaultColor(msg, client),
                title: `${msg.author.nickname ? msg.author.nickname : msg.author.username} gives ${member.nickname ? member.nickname : member.username} a tight hug`,
                image: {
                    url: base_url + res.data.path
                }
            }
        });
    }
}

module.exports = Hug;
