const config = require('../../config.json');
const utils = require('../utils/utils.js');
moment = require('../../node_modules/moment');
const chalk = require('chalk');

module.exports = {
    name: 'onGuildCreate',
    events: {
        guildCreate: 'onGuildCreate'
    },
    onGuildCreate: (guild, client) => {
        const bots = client.guilds.get(guild.id).members.filter(user => user.user.bot).length;
        const total = client.guilds.get(guild.id).memberCount;
        const humans = total - bots;
        const roles = guild.roles.map(c => c).length;
        const createdOn = moment(guild.createdAt).utc().format('ddd MMM DD YYYY | kk:mm:ss') + ' UTC ' + '(' + moment(guild.createdAt).fromNow() + ')';
        const validate = `${createdOn === null ? 'n/a' : ''}${createdOn !== null ? createdOn : ''}`;
        const humanper = humans / total * 100;
        const botper = bots / total * 100;

        if (botper >= 60) {
            guild.leave();
        } else {
            client.db_pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    return client.logger.error(chalk.red.bold(err));
                }
                conn.query('INSERT INTO guildSettings(guildID,welcomeMsg,lvlupMsg) VALUES (?,?,?)', [guild.id, 'Welcome to **{{SERVER}}** have a great time, {{MENTION}}', '{{MENTION}} levelup from level **{{OLDLEVEL}}** to level **{{NEWLEVEL}}**'], () => {
                    conn.release();
                });
            });

            client.executeWebhook(config.join_leaveWebhookID, config.join_leaveWebhookToken, {
                embeds: [{
                    color: config.defaultColor,
                    title: 'Joined guild:',
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
                        {
                            name: 'Emotes',
                            value: `${guild.emojis.length}`,
                            inline: true
                        },
                        {
                            name: 'Roles',
                            value: `${roles}`,
                            inline: true
                        },
                        {
                            name: 'Created on',
                            value: `${validate}`,
                            inline: false
                        }
                    ]
                }],
                username: `${client.user.username}`,
                avatarURL: `${client.user.dynamicAvatarURL('png', 2048)}`
            });
        }
    }
};