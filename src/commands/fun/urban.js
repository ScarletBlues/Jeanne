const {Command} = require('sylphy');
const urban = require('urban.js');

class Urban extends Command {
    constructor(...args) {
        super(...args, {
            name: 'urban',
            description: 'Search for a definition on urban dictionary',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'fun',
            usage: [
                {name: 'word', type: 'string', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        let def;
        try {
            if (!rawArgs[0]) {
                def = await urban.random();
            } else {
                def = await urban.random(rawArgs[0]);
            }
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                title: def.word,
                description: def.definition,
                url: def.urbanURL,
                thumbnail: {url: 'https://b.catgirlsare.sexy/KAFl.jpg'},
                fields: [
                    {name: 'Example', value: def.example ? def.example : 'None', inline: true},
                    {name: 'Author', value: def.author ? def.author : 'None', inline: false},
                    {name: 'Thumbs Up', value: `\\👍 ${def.thumbsUp ? def.thumbsUp : '0'}`, inline: true},
                    {name: 'Thumbs Down', value: `\\👎 ${def.thumbsDown ? def.thumbsDown : '0'}`, inline: true}
                ]
            }
        });
    }
}

module.exports = Urban;