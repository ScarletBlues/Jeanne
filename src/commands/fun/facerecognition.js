const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');

class Kairos extends Command {
    constructor(...args) {
        super(...args, {
            name: 'kairos',
            description: 'Can recognize a face in a picture',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 30,
            group: 'fun',
            usage: [
                {name: 'image_url', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const regex = new RegExp(/^https?:\/\/.*\.(?:png|jpg)$/i);
        const url = rawArgs[0];
        if (url.match(regex)) {
            try {
                const resp = await axios({
                    method: 'post',
                    url: 'https://api.kairos.com/detect',
                    data: JSON.stringify({'image': url}),
                    headers: {
                        'User-Agent': client.userAgent,
                        'Content-Type': 'application/json',
                        'app_id': config.tokens.kairos.id,
                        'app_key': config.tokens.kairos.key
                    }
                });
                const data = resp.data.images[0].faces[0].attributes;
                responder.send('', {
                    embed: {
                        color: client.utils.getDefaultColor(msg, client),
                        thumbnail: {url: url},
                        fields: [{
                            name: `Attributes`,
                            value: `\`\`\`fix\n` +
                            `Lips:      ${data.lips}\n` +
                            `Gender:    ${data.gender.type === 'F' ? 'Female' : 'Male'}\n` +
                            `Age:       ${data.age}\n` +
                            `Glasses:   ${data.glasses}\n` +
                            `Asian:     ${client.utils.round(data.asian * 100, 2)}%\n` +
                            `Hispanic:  ${client.utils.round(data.hispanic * 100, 2)}%\n` +
                            `Black:     ${client.utils.round(data.black * 100, 2)}%\n` +
                            `White:     ${client.utils.round(data.white * 100, 2)}%\n` +
                            `Other:     ${client.utils.round(data.other * 100, 2)}%\n` +
                            `\`\`\``,
                            inline: true
                        }]
                    }
                });
            } catch (e) {
                logger.error(client.chalk.red.bold(e));
            }
        }
    }
}

module.exports = Kairos;