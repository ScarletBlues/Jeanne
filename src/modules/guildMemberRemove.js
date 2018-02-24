const chalk = require('chalk');

module.exports = {
    name: 'guildMemberRemove',
    events: {
        guildMemberRemove: 'onGuildMemberRemove'
    }, onGuildMemberRemove: (guild, member, jeanne) => {
        let check = jeanne.settingsManager.getEventSetting(guild.id, 'memberleft');
        if (check) {
            if (member.user.bot === true) return;
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
                        await jeanne.createMessage(results[0].modlogChannel, `\`[${new Date().toLocaleString()}]\` **Member Left:** ${member.user.username}`);
                    } catch (e) {
                        jeanne.logger.error(chalk.red.bold(e));
                    }
                });
            });
        }
    }
};
