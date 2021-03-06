const config = require('../../config.json');
const utils = require('../utils/utils.js');
const chalk = require('chalk');
const moment = require('moment');
const constants = require('../utils/constants');

module.exports = {
    name: 'guildCreate',
    events: {
        guildCreate: 'onGuildCreate'
    }, onGuildCreate: async (guild, jeanne) => {
        const bots = jeanne.guilds.get(guild.id).members.filter(user => user.user.bot).length;
        const total = jeanne.guilds.get(guild.id).memberCount;
        const humans = total - bots;
        const roles = guild.roles.map(c => c).length;
        const createdOn = moment(guild.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss') + ' UTC ' + '(' + moment(guild.createdAt).fromNow() + ')';
        const validate = `${createdOn === null ? 'n/a' : ''}${createdOn !== null ? createdOn : ''}`;
        const humanper = humans / total * 100;
        const botper = bots / total * 100;

        // if (botper >= 60 && guildWhitelist.indexOf(guild.id) === -1) return guild.leave();

        let possibleBotFarm = false;
        constants.guildNameKeywords.forEach((keyword) => {
            if (guild.name.toLocaleLowerCase().indexOf(keyword) !== -1) possibleBotFarm = true;
        });
        if (possibleBotFarm && botper >= 60 && constants.guildWhitelist.indexOf(guild.id) === -1) {
            const channel = guild.channels.find((c) => c.name.toLocaleLowerCase() === 'general');
            if (channel) {
                const check = channel.permissionsOf(jeanne.user.id).has('sendMessages');
                if (check) channel.createMessage('It looks like this server is a bot farming server so I\'m gonna have to leave.\n' +
                    'If this is incorrect you can join https://discord.gg/p895czC and ask my owner to be whitelisted.');
            }
            return guild.leave();
        }

        jeanne.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return jeanne.logger.error(chalk.red.bold(err));
            }
            conn.query('INSERT INTO guildSettings(guildID,welcomeMsg,lvlupMsg) VALUES (?,?,?)', [guild.id, 'Welcome to **{{SERVER}}** have a great time, {{MENTION}}', '{{MENTION}} levelup from level **{{OLDLEVEL}}** to level **{{NEWLEVEL}}**'], () => {
                conn.release();
            });
        });
        try {
            await jeanne.executeWebhook(config.webhooks.guildUpdateID, config.webhooks.guildUpdateToken, {
                embeds: [{
                    color: utils.getDefaultColor(jeanne.guilds.get(config.ownerGuilds[0]), jeanne, true),
                    title: 'Joined guild:',
                    description: `**${guild.name} (${guild.id})**`,
                    thumbnail: {url: guild.iconURL ? guild.iconURL : ''},
                    fields: [
                        {name: 'Owner', value: `${guild.members.get(guild.ownerID).tag}\n(${guild.ownerID})`, inline: true},
                        {name: 'Total members', value: total, inline: true},
                        {name: 'Humans', value: `${humans}, ${utils.round(humanper, 2)}%`, inline: true},
                        {name: 'Bots', value: `${bots}, ${utils.round(botper, 2)}%`, inline: true},
                        {name: 'Emotes', value: `${guild.emojis.length}`, inline: true},
                        {name: 'Roles', value: `${roles}`, inline: true},
                        {name: 'Created on', value: validate, inline: false}
                    ]
                }],
                username: `${jeanne.user.username}`,
                avatarURL: `${jeanne.user.dynamicAvatarURL('png', 2048)}`
            });
        } catch (e) {
            jeanne.logger.error(chalk.red.bold(e));
        }
    }
};
