const {Command} = require('sylphy');
const axios = require('axios');
const reload = require('require-reload');
const config = reload('../../../config.json');
const blacklistedWords = reload('../../blacklisted_words.json');

class Yandere extends Command {
    constructor(...args) {
        super(...args, {
            name: 'yandere',
            description: 'search for an image from yandere.',
            group: 'nsfw',
            aliases: ['yd']
        });
    }

    async handle({msg}) {
        if (msg.channel.nsfw === false) return msg.channel.createMessage('❎ | NSFW is not enabled in this channel, enable NSFW in the channel settings.');

        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (!args) return msg.channel.createMessage('❎ | This command requires at least one argument.');

        let searchBoolean = false;
        blacklistedWords.forEach((w) => {
            if (args.includes(w)) searchBoolean = true;
        });
        if (searchBoolean === true) return msg.channel.createMessage('❎ | One or more of your search terms are globally blacklisted, this is probably because it\'s against Discord\'s ToS.');
        const res = await axios.get(`https://yande.re/post.json?tags=${args}+order:random&limit=1`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Kitsune - (https://github.com/KurozeroPB)'
            }
        });
        if (!res.data[0]) return msg.channel.createMessage(`❎ | Nothing found using the tag(s): **${args}**`);
        blacklistedWords.forEach((w) => {
            if (res.data[0].tag_string.includes(w)) searchBoolean = true;
        });
        if (searchBoolean === true) return msg.channel.createMessage('❎ | I can\'t show you this image, it is against Discord\'s ToS, please try again for an other image.');
        const sampleImage = res.data[0].sample_url;
        const post = `https://yande.re/post/show/${res.data[0].id}`;
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                description: `[View post](${post})\n` +
                `[View image](${sampleImage})`,
                image: {
                    url: sampleImage
                }
            }
        });
    }
}

module.exports = Yandere;