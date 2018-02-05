const {Command} = require('sylphy');
const axios = require('axios');

class Nyan extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nyan',
            description: 'sends an anime cat, nyan~',
            group: 'anime'
        });
    }

    async handle({msg, client}) {
        const base_url = 'https://rra.ram.moe';
        const type = 'nyan';
        const path = '/i/r?type=' + type;

        const res = await axios.get(base_url + path);
        if (res.data.error) return msg.channel.createMessage(`❎ | Something went wrong while requesting the image.\n\`\`\`${res.data.error}\`\`\``);
        msg.channel.createMessage({
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                image: {
                    url: base_url + res.data.path
                }
            }
        });
    }
}

module.exports = Nyan;