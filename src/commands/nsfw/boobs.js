const {Command} = require('sylphy');
const axios = require('axios');

class Boobs extends Command {
    constructor(...args) {
        super(...args, {
            name: 'boobs',
            description: 'Sends a random boobs pic',
            group: 'nsfw',
            aliases: ['tits'],
            options: {
                botPermissions: ['attachFiles']
            }
        });
    }

    async handle({msg}, responder) {
        if (msg.channel.nsfw === false) return responder.send('❎ | NSFW is not enabled in this channel, enable NSFW in the channel settings.');
        const res = await axios.get('http://api.oboobs.ru/boobs/0/1/random');
        if (!res.data[0]) return responder.send(`❎ | No images were found, sorry!`);
        const img = await axios.get(`http://media.oboobs.ru/${res.data[0].preview}`, {
            headers: {'Accept': 'image/*'},
            responseType: 'arraybuffer'
        });
        const fileType = img.headers['content-type'].replace('image/', '');
        responder.send('', {
            file: {
                name: `boobs-${res.data[0].id}.${fileType}`,
                file: img.data
            }
        });
    }
}

module.exports = Boobs;