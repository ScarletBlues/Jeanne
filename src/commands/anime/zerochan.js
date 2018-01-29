const {Command} = require('sylphy');
const axios = require('axios');
const reload = require('require-reload');
const config = reload('../../../config.json');

class Zerochan extends Command {
    constructor(...args) {
        super(...args, {
            name: 'zerochan',
            description: 'search for an image from zerochan.',
            group: 'anime',
            aliases: ['zc']
        });
    }

    async handle({msg}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');

        const search = args.replace(/ /g, '%2C');
        const res = await axios.get(`https://www.zerochan.net/${search}`, {
            headers: {
                'User-Agent': 'Kitsune - (https://github.com/KurozeroPB)',
                'Accept': 'application/json'
            },
            params: {
                json: true,
                s: 'random'
            }
        });
        const tags = res.data.tags;
        tags.splice(5);
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                title: res.data.primary,
                description: `Tags: ${tags.join(', ')}`,
                image: {
                    url: res.data.full
                }
            }
        });
    }
}

module.exports = Zerochan;