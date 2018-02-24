const chalk = require('chalk');

module.exports = {
    name: 'guildBanRemove',
    events: {
        guildBanRemove: 'onGuildBanRemove'
    }, onGuildBanRemove: (guild, user, jeanne) => {
        console.log('triggered');
        let check = jeanne.settingsManager.getEventSetting(guild.id, 'userunbanned');
        if (check) {
            jeanne.db_pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    return jeanne.logger.error(chalk.red.bold(err));
                }
                conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], async (error, results) => {
                    conn.release();
                    if (error) return jeanne.logger.error(chalk.red.bold(error));
                    if (!results[0]) return;
                    if (!results[0].modlogChannel) return;
                    try {
                        await jeanne.createMessage(results[0].modlogChannel, {
                            embed: {
                                color: 0x42f442,
                                author: {
                                    name: `${user.tag} (${user.id})`,
                                    icon_url: `${user.avatarURL}`
                                },
                                title: 'Type:',
                                description: 'Unban',
                                footer: {
                                    text: `${new Date().toLocaleString()}`
                                }
                            }
                        });
                    } catch (e) {
                        jeanne.logger.error(chalk.red.bold(e));
                    }
                });
            });
        }
    }
};
