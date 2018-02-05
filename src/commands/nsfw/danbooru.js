const {Command} = require('sylphy');
const axios = require('axios');
const blacklistedWords = require('../../blacklisted_words.json');

class Danbooru extends Command {
    constructor(...args) {
        super(...args, {
            name: 'danbooru',
            description: 'search for an image from danbooru.',
            group: 'nsfw',
            aliases: ['db']
        });
    }

    async handle({msg, client}) {
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
        const res = await axios.get(`http://danbooru.donmai.us/posts.json?tags=${args}+order:random&limit=1`, {
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
        const imageUrl = 'http://danbooru.donmai.us' + res.data[0].file_url;
        const post = `http://danbooru.donmai.us/posts/${res.data[0].id}`;
        msg.channel.createMessage({
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: `[View post](${post})\n` +
                `[View image](${imageUrl})`,
                image: {
                    url: imageUrl
                }
            }
        });
    }
}

module.exports = Danbooru;