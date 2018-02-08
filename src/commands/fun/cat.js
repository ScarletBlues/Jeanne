const {Command} = require('sylphy');
const axios = require('axios');

class Cat extends Command {
    constructor(...args) {
        super(...args, {
            name: 'cat',
            description: 'Sends a random cat image',
            options: {
                botPermissions: ['attachFiles']
            },
            group: 'fun'
        });
    }

    async handle({client, logger}, responder) {
        let cat;
        try {
            const resp = await axios.get('http://random.cat/meow', {
                headers: {'User-Agent': client.userAgent}
            });
            cat = await axios.get(resp.data.file, {
                headers: {'Accept': 'image/*', 'User-Agent': client.userAgent},
                responseType: 'arraybuffer'
            });
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        const fileType = cat.headers['content-type'].replace('image/', '');
        responder.send('', {
            file: {
                name: `cat.${fileType}`,
                file: cat.data
            }
        });
    }
}

module.exports = Cat;