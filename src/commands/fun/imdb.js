const {Command} = require('sylphy');
const imdb = require('imdb-api');
const config = require('../../../config');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class Imdb extends Command {
    constructor(...args) {
        super(...args, {
            name: 'imdb',
            description: 'Search for either a movie or serie on imdb',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'fun',
            usage: [
                {name: 'movie/serie', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        if (!rawArgs[0]) return responder.send('Oh no, you didn\'t give a movie or serie to search for.');
        let movie;
        try {
            movie = await imdb.get(rawArgs[0], {apiKey: config.tokens.imdb});
        } catch (e) {
            return logger.error(chalk.red.bold(e));
        }
        responder.send('', {
            embed: {
                color: utils.getDefaultColor(msg, client),
                title: movie.title,
                description: movie.plot,
                url: movie.imdburl,
                image: {url: movie.poster},
                fields: [
                    {name: 'Rated', value: movie.rated, inline: true},
                    {name: 'Runtime', value: movie.runtime, inline: true},
                    {name: 'Languages', value: movie.languages, inline: true},
                    {name: 'Awards', value: movie.awards, inline: true},
                    {name: 'Rating', value: movie.rating, inline: true},
                    {name: 'Type', value: movie.type, inline: true},
                    {name: 'Genres', value: movie.genres, inline: false},
                    {name: 'Released', value: movie.released, inline: false}
                ],
                footer: {icon_url: 'https://b.catgirlsare.sexy/xgTw.png', text: 'All information is provided by imdb'}
            }
        });
    }
}

module.exports = Imdb;
