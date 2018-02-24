const {Command} = require('sylphy');
const axios = require('axios');
const utils = require('../../utils/utils');

class Pout extends Command {
    constructor(...args) {
        super(...args, {
            name: 'pout',
            description: 'sends a pouting anime character.',
            group: 'roleplay'
        });
    }

    async handle({msg, client}) {
        const base_url = 'https://rra.ram.moe';
        const type = 'pout';
        const path = '/i/r?type=' + type;

        const res = await axios.get(base_url + path);
        if (res.data.error) return msg.channel.createMessage(`❎ | Something went wrong while requesting the image.\n\`\`\`${res.data.error}\`\`\``);
        msg.channel.createMessage({
            embed: {
                color: utils.getDefaultColor(msg, client),
                image: {
                    url: base_url + res.data.path
                }
            }
        });
    }
}

module.exports = Pout;
