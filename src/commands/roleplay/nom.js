const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');
const axios = require('axios');

class Nom extends Command {
    constructor(...args) {
        super(...args, {
            name: 'nom',
            description: 'sends an anime character enjoying food.',
            group: 'roleplay'
        });
    }

    async handle({msg}) {
        const base_url = 'https://rra.ram.moe';
        const type = 'nom';
        const path = '/i/r?type=' + type;

        const res = await axios.get(base_url + path);
        if (res.data.error) return msg.channel.createMessage(`❎ | Something went wrong while requesting the image.\n\`\`\`${res.data.error}\`\`\``);
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                image: {
                    url: base_url + res.data.path
                }
            }
        });
    }
}

module.exports = Nom;