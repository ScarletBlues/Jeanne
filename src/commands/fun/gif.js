const {Command} = require('sylphy');
const axios = require('axios');

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
                headers: {'User-Agent': client.userAgent},
                params: {
                    'api_key': 'dc6zaTOxFJmzC',
                    'tag': rawArgs[0] ? rawArgs[0] : '',
                    'fmt': 'json'
                }
            });
            if (resp.status === 200) {
                image = await axios.get(resp.data.data.image_url, {
                    headers: {
                        'Accept': 'image/*',
                        'User-Agent': client.userAgent
                    },
                    responseType: 'arraybuffer'
                });
            }
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
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