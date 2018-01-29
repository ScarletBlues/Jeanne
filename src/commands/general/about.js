const {Command} = require('sylphy');
const botVersion = require('../../../package.json').version;
const libVersion = require('../../../node_modules/eris/package.json').version;
const fwVersion = require('../../../node_modules/sylphy/package.json').version;

class About extends Command {
    constructor(...args) {
        super(...args, {
            name: 'about',
            description: 'Info about the bot',
            group: 'general',
            aliases: ['info']
        });
    }

    async handle({msg, client}, responder) {
        const me = client.users.get('93973697643155456');
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                title: client.user.username,
                url: 'https://jeannedarc.xyz/',
                description: 'Jeanne is a fast and simple to use discord bot. It will make your discord experience much more fun!',
                fields: [
                    {name: 'Creator', value: me.mention, inline: false},
                    {name: 'Library', value: `Eris v${libVersion}`, inline: true},
                    {name: 'Framework', value: `Sylphy v${fwVersion}`, inline: true},
                    {name: 'Language', value: 'NodeJS', inline: true},
                    {name: 'Node Version', value: process.version, inline: true},
                    {name: 'Bot Version', value: `v${botVersion}`, inline: true},
                    {name: 'Prefix', value: client.prefix, inline: true},
                    {name: 'Website', value: 'https://jeannedarc.xyz/', inline: true},
                    {name: 'Support', value: 'https://discord.gg/Vf4ne5b', inline: true},
                ]
            }
        });
    }
}

module.exports = About;