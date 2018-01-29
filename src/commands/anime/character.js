const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');
const AniListAPI = require('anilist-api-pt');
const anilistApi = new AniListAPI({
    client_id: config.anilist_clientID,
    client_secret: config.anilist_clientSecret
});

class Character extends Command {
    constructor(...args) {
        super(...args, {
            name: 'character',
            description: 'search for an anime character by name.',
            group: 'anime',
            aliases: ['char']
        });
    }

    async handle({msg}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join('');
        const ani = await anilistApi.auth();
        const res = await ani.characters.searchCharacters(`${args}`);
        const char = res[~~(Math.random() * res.length)];
        ;
        if (!char) return msg.channel.createMessage('❎ | No character found.');
        let info = char.info.replace(/&#039;/g, '\'');
        info = info.slice(0, 500);
        let readMore = '';
        if (char.info.length > 500) readMore = `\n\nRead the full info [**here**](https://anilist.co/character/${char.id})`;
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                author: {
                    name: `${char.name_first} ${char.name_last}`,
                    url: `https://anilist.co/character/${char.id}`,
                },
                description: `**Info:**\n${info}${readMore}`,
                thumbnail: {
                    url: `${char.image_url_med}`
                },
                fields: [{
                    name: 'Alternative Names',
                    value: `Japanese: ${!char.name_japanese ? '' : char.name_japanese}\n` +
                    `${!char.name_alt ? '' : char.name_alt}`,
                    inline: false
                }],
                footer: {
                    icon_url: 'https://b.catgirlsare.sexy/wj6g.png',
                    text: 'All information is provided by AniList'
                }
            }
        });
    }
}

module.exports = Character;