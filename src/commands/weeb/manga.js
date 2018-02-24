const {Command} = require('sylphy');
const Kitsu = require('kawaii-kitsune');
const kitsu = new Kitsu();
const utils = require('../../utils/utils');

class Manga extends Command {
    constructor(...args) {
        super(...args, {
            name: 'manga',
            description: 'show info about a manga.',
            cooldown: 10,
            group: 'anime'
        });
    }

    async handle({msg, client}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (!args) return msg.channel.createMessage('❎ | Please tell me what manga to search for.');

        const manga = await kitsu.searchManga(args);
        if (!manga[0]) return msg.channel.createMessage(`❎ | No results found for **${args}**`);
        let endDate = '?';
        if (manga[0].endDate) endDate = manga[0].endDate;
        let ageRating = 'n/a';
        if (manga[0].ageRating) ageRating = manga[0].ageRating;
        let ageRatingGuide = 'n/a';
        if (manga[0].ageRatingGuide) ageRatingGuide = manga[0].ageRatingGuide;
        let chapterCount = 'n/a';
        if (manga[0].chapterCount) chapterCount = manga[0].chapterCount;

        msg.channel.createMessage({
            embed: {
                color: utils.getDefaultColor(msg, client),
                title: manga[0].titles.english ? manga[0].titles.english : '',
                description: `https://kitsu.io/manga/${manga[0].slug}\n\n${manga[0].synopsis}`,
                thumbnail: {url: manga[0].posterImage.original},
                fields: [
                    {name: 'Type', value: manga[0].mangaType, inline: true},
                    {name: 'Rank', value: manga[0].ratingRank, inline: true},
                    {name: 'Chapters', value: chapterCount, inline: true},
                    {name: 'Volumes', value: manga[0].volumeCount, inline: true},
                    {name: 'Readers', value: manga[0].userCount, inline: true},
                    {name: 'Avg Rating', value: manga[0].averageRating + '%', inline: true},
                    {name: 'Favorites', value: manga[0].favoritesCount, inline: true},
                    {name: 'Popularity Rank', value: manga[0].popularityRank, inline: true},
                    {name: 'Age Rating', value: ageRating, inline: true},
                    {name: 'Age Rating Guide', value: ageRatingGuide, inline: true},
                    {name: 'Alternative titles', value: `Romaji: ${manga[0].titles.romaji}\nJapanese: ${manga[0].titles.japanese}`, inline: true},
                    {name: 'Start/end date', value: `${manga[0].startDate} to ${endDate}`, inline: true}
                ],
                footer: {
                    text: 'All information is provided by kitsu.io',
                    icon_url: 'https://b.catgirlsare.sexy/RNne.png'
                }
            }
        });
    }
}

module.exports = Manga;
