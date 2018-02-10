const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');

class Votecheck extends Command {
    constructor(...args) {
        super(...args, {
            name: 'votecheck',
            description: 'Check if you upvoted Jeanne d\'Arc. (Test/example command)',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'fun'
        });
    }

    async handle({msg, client, logger}, responder) {
        let resp, description;
        try {
            resp = await axios.get('https://discordbots.org/api/bots/237578660708745216/votes', {
                headers: {
                    'Authorization': config.tokens.botsorg,
                    'User-Agent': client.userAgent
                }, params: {
                    onlyids: true
                }
            });
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (resp.status !== 200) return responder.send('Oof, something went wrong while requesting an image.');
        const users = resp.data;
        const check = users.includes(msg.author.id);
        if (check) description = 'Yaay it looks like you upvoted for me thank you so much!! \\💗';
        else description = 'Ohno it looks like you didn\'t upvote me \\😢\n' +
            'Please go to: [discordbots.org/bot/jeanne](https://discordbots.org/bot/jeanne) and click on upvote.'
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: description,
                footer: {text: 'https://discordbots.org/bot/jeanne'}
            }
        });
    }
}

module.exports = Votecheck;