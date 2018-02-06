const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');

class Weeb extends Command {
    constructor(...args) {
        super(...args, {
            name: 'weeb',
            description: 'Get weeb types',
            cooldown: 30,
            group: 'weeb'
        });
    }

    async handle({client, logger}, responder) {
        try {
            const resp = await axios.get('https://api.weeb.sh/images/types', {
                headers: {
                    'Authorization': `Wolke ${config.tokens.weeb}`,
                    'User-Agent': client.userAgent
                }
            });
            responder.send(resp.data.types.join(', '));
        } catch (e) {
            responder.send('Oops it seems like an error occured.');
            logger.error(client.chalk.red.bold(e));
        }
    }
}

module.exports = Weeb;