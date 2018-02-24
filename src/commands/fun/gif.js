const {Command} = require('sylphy');
const chalk = require('chalk');
const axios = require('axios');
const config = require('../../../config');

class Gif extends Command {
    constructor(...args) {
        super(...args, {
            name: 'gif',
            description: 'temp',
            options: {
                botPermissions: ['attachFiles']
            },
            group: 'fun',
            usage: [
                {name: 'tag', type: 'string', optional: true}
            ]
        });
    }

    async handle({client, rawArgs, logger}, responder) {
        let resp, image;
        try {
            resp = await axios.get('https://api.giphy.com/v1/gifs/random', {
                headers: {
                    'User-Agent': client.userAgent,
                    'Accept': 'application/json'
                }, params: {
                    'api_key': config.tokens.giphy,
                    'tag': rawArgs[0] ? rawArgs[0] : ''
                }
            });
            if (resp.status === 200) {
                console.log(resp.data);
                if (!resp.data.data) return responder.send('Aii it seems like I couldn\'t find any gifs. Maybe try again with a different tag.');
                image = await axios.get(resp.data.data.image_url, {
                    headers: {
                        'Accept': 'image/*',
                        'User-Agent': client.userAgent
                    },
                    responseType: 'arraybuffer'
                });
            }
        } catch (e) {
            return logger.error(chalk.red.bold(e));
        }
        if (image.status === 200) {
            const fileType = image.headers['content-type'].replace('image/', '');
            responder.send('', {
                file: {
                    name: `${resp.data.data.id}.${fileType}`,
                    file: image.data
                }
            });
        }
    }
}

module.exports = Gif;
