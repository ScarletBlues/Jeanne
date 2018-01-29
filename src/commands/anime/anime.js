const {Command} = require('sylphy');
const reload = require('require-reload');
const config = reload('../../../config.json');
const anime = require('malapi').Anime;

class Anime extends Command {
    constructor(...args) {
        super(...args, {
            name: 'anime',
            description: 'Shows info about an anime.',
            options: {/* Options: hidden, permissions... */},
            cooldown: 10,
            group: 'anime'
        });
    }

    async handle({msg}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join('');

        const ani = await anime.fromName(args);

        const genres = ani.genres.join(', ');
        let japanese = '';
        if (ani.alternativeTitles.japanese) japanese = ani.alternativeTitles.japanese[0] + '\n';
        if (!ani.alternativeTitles.synoynms) japanese = japanese + '\n';
        let synonyms = '';
        if (ani.alternativeTitles.synoynms) {
            if (ani.alternativeTitles.synoynms.length === 1) {
                synonyms = ani.alternativeTitles.synoynms[0];
            } else {
                for (let i = 0; i < ani.alternativeTitles.synoynms.length; i++) {
                    synonyms = synonyms.concat(`${ani.alternativeTitles.synoynms[i]}, `);
                }
            }
            synonyms = synonyms + '\n\n';
        }
        msg.channel.createMessage({
            embed: {
                color: config.defaultColor,
                title: `${ani.title}`,
                url: `${ani.detailsLink}`,
                description: `${japanese}` +
                `${synonyms}` +
                `${ani.synopsis.split('\r')[0]}`,
                thumbnail: {
                    url: `${ani.image}`
                },
                fields: [{
                    name: 'Type',
                    value: `${ani.type}`,
                    inline: true
                },
                    {
                        name: 'Episodes',
                        value: `${ani.episodes}`,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: `${ani.status}`,
                        inline: true
                    },
                    {
                        name: 'Score',
                        value: `${ani.statistics.score.value}`,
                        inline: true
                    },
                    {
                        name: 'Genres',
                        value: `${genres}`,
                        inline: false
                    }]
            }
        });
    }
}

module.exports = Anime;