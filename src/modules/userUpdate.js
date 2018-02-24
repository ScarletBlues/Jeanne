const chalk = require('chalk');

module.exports = {
    name: 'userUpdate',
    events: {
        userUpdate: 'onUserUpdate'
    }, onUserUpdate: (user, oldUser, jeanne) => {
        if (user.bot) return;
        if (oldUser && user.username !== oldUser.username) {
            jeanne.db_pool.getConnection((err, conn) => {
                if (err) {
                    conn.release();
                    return jeanne.logger.error(chalk.red.bold(err));
                }
                let guildArray = [];
                jeanne.guilds.forEach((guild) => {
                    if (guild.members.has(user.id)) {
                        let check = jeanne.settingsManager.getEventSetting(guild.id, 'namechanged');
                        if (check) guildArray.push(guild);
                    }
                });
                guildArray.forEach((guild) => {
                    conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], async (error, results) => {
                        conn.release();
                        if (error) return jeanne.logger.error(chalk.red.bold(error));
                        if (!results[0]) return;
                        if (!results[0].modlogChannel) return;
                        try {
                            await jeanne.createMessage(
                                results[0].modlogChannel,
                                `\`[${new Date().toLocaleString()}]\` **Name Change:** \`${oldUser.tag}\` is now \`${user.tag}\` **ID:** \`${user.id}\``
                            );
                        } catch (e) {
                            jeanne.logger.error(chalk.red.bold(e));
                        }
                    });
                });
            });
        }
    }
};
