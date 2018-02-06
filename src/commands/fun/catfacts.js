const {Command} = require('sylphy');
const axios = require('axios');
const catfacts = require('../../utils/constants').catfacts;

class Catfact extends Command {
    constructor(...args) {
        super(...args, {
            name: 'catfact',
            description: 'Sends a fact about a cat',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'fun'
        });
    }

    async handle({msg, client, logger}, responder) {
        const rand = client.utils.getRandomInt(0, catfacts.length - 1);
        const fact = catfacts[rand()];
        try {
            const resp = await axios.get('http://random.cat/meow', {
                headers: {'User-Agent': client.userAgent}
            });
            responder.send('', {
                embed: {
                    color: client.utils.getDefaultColor(msg, client),
                    title: 'Cat Fact',
                    url: resp.data.file,
                    description: fact,
                    thumbnail: {
                        url: resp.data.file
                    }
                }
            });
        } catch (e) {
            logger.error(client.chalk.red.bold(e));
        }
    }
}

module.exports = Catfact;