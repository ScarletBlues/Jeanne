const chalk = require('chalk');

module.exports = {
    name: 'guildMemberAdd',
    events: {
        guildMemberAdd: 'onGuildMemberAdd'
    }, onGuildMemberAdd: async (guild, member, jeanne) => {
        jeanne.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return jeanne.logger.error(chalk.red.bold(err));
            }
            conn.query('SELECT userID FROM userSettings WHERE userID=?', [member.id], (error, results) => {
                if (error) jeanne.logger.error(chalk.red.bold(error));
                if (!results[0]) {
                    conn.query('INSERT INTO userSettings(userID,level,points,blacklisted) VALUES (?,?,?,?)', [member.id, 0, 0, false]);
                }
            });
            conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], async (error, results) => {
                conn.release();
                if (error) return jeanne.logger.error(chalk.red.bold(error));
                if (!results[0]) return;
                if (results[0].welcomeChannel && results[0].welcomeMsg && results[0].welcomeMsgEnabled === 1) {
                    let welcome = results[0].welcomeMsg;
                    welcome = welcome.replace(/{{MENTION}}/gi, member.mention)
                        .replace(/{{SERVER}}/gi, guild.name)
                        .replace(/{{USER}}/gi, member.username);
                    if (results[0].welcomeChannel.toUpperCase() === 'DM') {
                        try {
                            const chan = await member.user.getDMChannel();
                            await chan.createMessage(welcome);
                        } catch (e) {
                            jeanne.logger.error(chalk.red.bold(e));
                        }
                    } else {
                        try {
                            await jeanne.createMessage(results[0].welcomeChannel, welcome);
                        } catch (e) {
                            jeanne.logger.error(chalk.red.bold(e))
                        }
                    }
                }
                if (results[0].modlogChannel) {
                    let check = jeanne.settingsManager.getEventSetting(guild.id, 'memberjoined');
                    if (check) {
                        try {
                            await jeanne.createMessage(results[0].modlogChannel, `\`[${new Date().toLocaleString()}]\` **Member Joined:** ${member.user.username}`);
                        } catch (e) {
                            jeanne.logger.error(chalk.red.bold(e))
                        }
                    }
                }
            });
        });
        if (guild.id === '240059867744698368') {
            try {
                await member.addRole('304266397947789322', 'New member');
            } catch (e) {
                jeanne.logger.error(chalk.red.bold(e))
            }
        }
    }
};
