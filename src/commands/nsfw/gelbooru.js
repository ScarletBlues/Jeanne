const {Command} = require('sylphy');
const axios = require('axios');
const reload = require('require-reload');
const config = reload('../../../config.json');
const blacklistedWords = reload('../../blacklisted_words.json');

class Gelbooru extends Command {
    constructor(...args) {
        super(...args, {
            name: 'gelbooru',
            description: 'search for an image from gelbooru.',
            group: 'nsfw',
            aliases: ['gb']
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
        const res = await axios.get(`https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=100&tags=${args}`, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Kitsune - (https://github.com/KurozeroPB)'
            }
        });
        if (!res.data[0]) return msg.channel.createMessage(`❎ | Nothing found using the tag(s): **${args}**`);
        const img = shuffle(res.data).slice(0, 1);
        blacklistedWords.forEach((w) => {
            if (img[0].tags.includes(w)) searchBoolean = true;
        });
        if (searchBoolean === true) return msg.channel.createMessage('❎ | I can\'t show you this image, it is against Discord\'s ToS, please try again for an other image.');
        const imageUrl = img[0].file_url;
        const post = `https://gelbooru.com/index.php?page=post&s=view&id=${img[0].id}`;
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                description: `[View post](${post})\n` +
                `[View image](${imageUrl})`,
                image: {
                    url: imageUrl
                }
            }
        });
    }
}

module.exports = Gelbooru;

// tfw gelbooru doesn't have a random function in the api
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}