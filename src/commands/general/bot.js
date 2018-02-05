const {Command} = require('sylphy');
const axios = require('axios');
const config = require('../../../config');

class Bot extends Command {
    constructor(...args) {
        super(...args, {
            name: 'bot',
            description: 'Get info about a bot from bots.discord.pw',
            group: 'general',
            cooldown: 30
        })
    }

    async handle({msg, client, rawArgs}, responder) {
        if (!config.tokens.botspw) return;
        const user = msg.mentions[0] ? msg.mentions[0] : rawArgs[0].isValidID ? client.users.get(rawArgs[0]) : undefined;
        if (!user) return responder.send('❌ Something went wrong, make sure it\'s a valid user.');
        if (user.bot === false) return responder.send('❌ This is not a bot.');
        const resp = await axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
            headers: {
                'Authorization': config.tokens.botspw,
                'User-Agent': client.userAgent
            }
        });
        const data = resp.data;
        if (resp.status !== 200) return responder.send(`Could not fetch the data,\n${resp.status}: ${resp.message}`);
        const inv = data.invite_url.replace(/ /g, '%20');
        const owners = data.owner_ids.map((o) => `<@!${o}>`);
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                author: {name: data.name, url: data.website, icon_url: ''},
                thumbnail: {url: `${user.avatarURL}`},
                description: `**ID:** ${data.client_id}\n` +
                `**Desc:** ${data.description}\n` +
                `**Library:** ${data.library}\n` +
                `**Owners:** ${owners}\n` +
                `**Prefix:** ${data.prefix}\n` +
                `**Invite:** [\`Click here\`](${inv})\n` +
                `**Website:** ${data.website}`,
                footer: {text: `Data from bots.discord.pw`, icon_url: ''}
            }
        });
    }
}

module.exports = Bot;
