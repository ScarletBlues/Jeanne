const {Command} = require('sylphy');
const axios = require('axios');
const discordpw_key = require('../../../config').abalBotsKey;
// temp useragent
const USERAGENT = 'Jeanne/v4.0.0 (https://github.com/Chaldea-dev/Jeanne)';

class Bot extends Command {
    constructor(...args) {
        super(...args, {
            name: 'bot',
            description: 'Get info about a bot from bots.discord.pw',
            group: 'general',
            cooldown: 30
        })
    }

    async handle({msg, client}, responder) {
        if (!discordpw_key) return;
        if (msg.mentions[0]) {
            const user = msg.mentions[0];
            if (user.bot === false) return responder.send('❌ This is not a bot.');
            const resp = await axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
                headers: {
                    'Authorization': discordpw_key,
                    'User-Agent': USERAGENT
                }
            });
            const data = resp.data;
            if (resp.status !== 200) return responder.send(`Could not fetch the data,\n${resp.status}: ${resp.message}`);
            const inv = data.invite_url.replace(/ /g, '%20');
            const owners = data.owner_ids.map((o) => `<@!${o}>`);
            responder.send('', {
                embed: {
                    color: client.utils.getDefaultColor(msg, client),
                    author: {name: data.name, url: data.website, icon_url: ``},
                    thumbnail: {url: `${user.avatarURL}`},
                    description: `**ID:** ${data.client_id}\n` +
                    `**Desc:** ${data.description}\n` +
                    `**Library:** ${data.library}\n` +
                    `**Owners:** ${owners}\n` +
                    `**Prefix:** ${data.prefix}\n` +
                    `**Invite:** [\`Click here\`](${inv})\n` +
                    `**Website:** ${data.website}`,
                    footer: {text: `Data from bots.discord.pw`, icon_url: ``}
                }
            });
        } else {
            const idRegex = /^\d{17,18}$/.test(msg.args);
            if (idRegex === false) return 'wrong usage';
            const user = client.users.get(msg.args);
            if (!user) return responder.send('❌ Something went wrong, make sure it\'s a valid user.');
            if (user.bot === false) return responder.send('❌ This is not a bot.');
            const resp = await axios.get(`https://bots.discord.pw/api/bots/${user.id}`, {
                headers: {
                    'Authorization': discordpw_key,
                    'User-Agent': USERAGENT
                }
            });
            const data = resp.data;
            if (resp.status !== 200) return responder.send(`Could not fetch the data,\n${resp.status}: ${resp.message}`);
            const inv = data.invite_url.replace(/ /g, '%20');
            const owners = data.owner_ids.map((o) => `<@!${o}>`);
            responder.send('', {
                embed: {
                    color: client.utils.getDefaultColor(msg, client),
                    author: {name: data.name, url: data.website, icon_url: ``},
                    thumbnail: {url: `${user.avatarURL}`},
                    description: `**ID:** ${data.client_id}\n` +
                    `**Desc:** ${data.description}\n` +
                    `**Library:** ${data.library}\n` +
                    `**Owners:** ${owners}\n` +
                    `**Prefix:** ${data.prefix}\n` +
                    `**Invite:** [\`Click here\`](${inv})\n` +
                    `**Website:** ${data.website}`,
                    footer: {text: `Data from bots.discord.pw`, icon_url: ``}
                }
            });
        }
    }
}

module.exports = Bot;