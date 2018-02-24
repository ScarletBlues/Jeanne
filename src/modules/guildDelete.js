const config = require('../../config.json');
const utils = require('../utils/utils.js');
const chalk = require('chalk');

module.exports = {
    name: 'guildDelete',
    events: {
        guildDelete: 'onGuildDelete'
    }, onGuildDelete: async (guild, jeanne) => {
        const bots = guild.members.filter(u => u.user.bot).length;
        const total = guild.memberCount;
        const humans = total - bots;
        const humanper = humans / total * 100;
        const botper = bots / total * 100;
        if (botper >= 60) return;

        jeanne.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return jeanne.logger.error(chalk.red.bold(err));
            }
            conn.query('DELETE FROM guildSettings WHERE guildID=?', [guild.id], () => {
                conn.release();
            });
        });

        try {
            await jeanne.executeWebhook(config.webhooks.guildUpdateID, config.webhooks.guildUpdateToken, {
                embeds: [{
                    color: config.colours.red,
                    title: 'Left guild:',
                    description: `**${guild.name} (${guild.id})**`,
                    thumbnail: {url: guild.iconURL ? guild.iconURL : ''},
                    fields: [
                        {name: 'Owner', value: `${guild.members.get(guild.ownerID).tag}\n(${guild.ownerID})`, inline: true},
                        {name: 'Total members', value: total, inline: true},
                        {name: 'Humans', value: `${humans}, ${utils.round(humanper, 2)}%`, inline: true},
                        {name: 'Bots', value: `${bots}, ${utils.round(botper, 2)}%`, inline: true},
                    ]
                }],
                username: jeanne.user.username,
                avatarURL: jeanne.user.dynamicAvatarURL('png', 2048)
            });
        } catch (e) {
            jeanne.logger.error(chalk.red.bold(e));
        }
    }
};
