const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');
const chalk = require('chalk');

class Unsplash extends Command {
    constructor(...args) {
        super(...args, {
            name: 'unsplash',
            description: 'Get a beautiful picture from https://unsplash.com',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 60,
            group: 'fun'
        });
    }

    async handle({client, logger}, responder) {
        let resp;
        try {
            resp = await axios.get('https://api.unsplash.com/photos/random', {
                headers: {
                    'Authorization': `Client-ID ${config.tokens.unsplash}`,
                    'User-Agent': client.userAgent
                }
            });
        } catch (e) {
            return logger.error(chalk.red.bold(e));
        }
        if (resp.status !== 200) return responder.send('Oof, something went wrong while requesting an image.');
        const data = resp.data;
        let color = data.color.replace('#', '0x');
        color = parseInt(color);
        responder.send('', {
            embed: {
                color: color,
                title: `Photographer: ${data.user.name}`,
                url: `${data.user.links.html}?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit`,
                description: `[\`download image\`](${data.links.download}?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit)\n` +
                `\\👍 Likes: ${data.likes}\n` +
                `\\👀 Views: ${data.views}\n` +
                `\\🌇 Location: ${data.location ? data.location.title : 'n/a'}`,
                image: {url: data.urls.regular + '?utm_source=Jeanne%20Discord%20Bot&utm_medium=referral&utm_campaign=api-credit'},
                footer: {text: `Image from https://unsplash.com`, icon_url: `https://b.catgirlsare.sexy/7OSH.png`}
            }
        })
    }
}

module.exports = Unsplash;
