const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');
const utils = require('../../utils/utils');
const chalk = require('chalk');

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
        const regex = new RegExp(/^https?:\/\/.*\.(?:png|jpe?g)$/i);
        const url = rawArgs[0];
        if (url.match(regex)) {
            let data;
            try {
                const resp = await axios.post('https://api.kairos.com/detect', {
                    'image': url
                }, {
                    headers: {
                        'User-Agent': client.userAgent,
                        'Content-Type': 'application/json',
                        'app_id': config.tokens.kairos.id,
                        'app_key': config.tokens.kairos.key
                    }
                });
                data = resp.data.images[0].faces[0].attributes;
            } catch (e) {
                return logger.error(chalk.red.bold(e));
            }
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    thumbnail: {url: url},
                    fields: [{
                        name: `Attributes`,
                        value: `\`\`\`fix\n` +
                        `Lips:      ${data.lips}\n` +
                        `Gender:    ${data.gender.type === 'F' ? 'Female' : 'Male'}\n` +
                        `Age:       ${data.age}\n` +
                        `Glasses:   ${data.glasses}\n` +
                        `Asian:     ${utils.round(data.asian * 100, 2)}%\n` +
                        `Hispanic:  ${utils.round(data.hispanic * 100, 2)}%\n` +
                        `Black:     ${utils.round(data.black * 100, 2)}%\n` +
                        `White:     ${utils.round(data.white * 100, 2)}%\n` +
                        `Other:     ${utils.round(data.other * 100, 2)}%\n` +
                        `\`\`\``,
                        inline: true
                    }]
                }
            });
        } else {
            responder.send('It seems like you provided an invalid image url, note that only png, jpg and jpeg are accepted');
        }
    }
}

module.exports = Kairos;
