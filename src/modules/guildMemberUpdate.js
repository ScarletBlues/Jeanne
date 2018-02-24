const chalk = require('chalk');

module.exports = {
    name: 'guildMemberUpdate',
    events: {
        guildMemberUpdate: 'onGuildMemberUpdate'
    }, onGuildMemberUpdate: (guild, member, oldMember, jeanne) => {
        let check = jeanne.settingsManager.getEventSetting(guild.id, 'nicknamechanged');
        if (check) {
            if (member.user.bot === true) return;
            if (oldMember && member.nick !== oldMember.nick) {
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
                        if (member.nick !== null) {
                            try {
                                await jeanne.createMessage(
                                    results[0].modlogChannel,
                                    `\`[${new Date().toLocaleString()}]\` **Nickname Change:** \`${member.user.username}\` is now nicknamed \`${member.nick}\``
                                );
                            } catch (e) {
                                jeanne.logger.error(chalk.red.bold(e));
                            }
                        } else {
                            try {
                                await jeanne.createMessage(
                                    results[0].modlogChannel,
                                    `\`[${new Date().toLocaleString()}]\` **Nickname Change:** \`${member.user.username}\` removed their nickname`
                                );
                            } catch (e) {
                                jeanne.logger.error(chalk.red.bold(e));
                            }
                        }
                    });
                });
            }
        }
    }
};
