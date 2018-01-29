const config = require('../../config.json');
const utils = require('../utils/utils.js');
const chalk = require('chalk');
moment = require('../../node_modules/moment');

module.exports = {
    name: 'onGuildDelete',
    events: {
        guildDelete: 'onGuildDelete'
    },
    onGuildDelete: (guild, client) => {
        const bots = guild.members.filter(u => u.user.bot).length;
        const total = guild.memberCount;
        const humans = total - bots;
        const humanper = humans / total * 100;
        const botper = bots / total * 100;
        if (botper >= 60) return;

        client.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return client.logger.error(chalk.red.bold(err));
            }
            conn.query('DELETE FROM guildSettings WHERE guildID=?', [guild.id], () => {
                conn.release();
            });
        });
        client.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
            embeds: [{
                color: config.errorColor,
                title: 'Left guild:',
                description: `**${guild.name} (${guild.id})**`,
                thumbnail: {
                    url: `${guild.iconURL === null ? '' : ''}${guild.iconURL !== null ? guild.iconURL : ''}`
                },
                fields: [{
                    name: 'Owner',
                    value: `${guild.members.get(guild.ownerID).user.username}#${guild.members.get(guild.ownerID).user.discriminator}\n(${guild.ownerID})`,
                    inline: true
                },
                    {
                        name: 'Total members',
                        value: `${total}`,
                        inline: true
                    },
                    {
                        name: 'Humans',
                        value: `${humans}, ${utils.round(humanper, 2)}%`,
                        inline: true
                    },
                    {
                        name: 'Bots',
                        value: `${bots}, ${utils.round(botper, 2)}%`,
                        inline: true
                    },
                ]
            }],
            username: `${client.user.username}`,
            avatarURL: `${client.user.dynamicAvatarURL('png', 2048)}`
        });
    }
};