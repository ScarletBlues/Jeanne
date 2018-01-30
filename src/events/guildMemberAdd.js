const chalk = require('chalk');

module.exports = {
    handler(client, guild, member, settingsManager) {
        client.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return client.logger.error(chalk.red.bold(err));
            }
            conn.query('SELECT userID FROM userSettings WHERE userID=?', [member.id], (error, results) => {
                if (error) client.logger.error(chalk.red.bold(error));
                if (!results[0]) {
                    conn.query('INSERT INTO userSettings(userID,level,points,blacklisted) VALUES (?,?,?,?)', [member.id, 0, 0, false]);
                }
            });
            conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], (error, results) => {
                conn.release();
                if (error) return client.logger.error(chalk.red.bold(error));
                if (!results[0]) return;
                if (results[0].welcomeChannel && results[0].welcomeMsg && results[0].welcomeMsgEnabled === 1) {
                    let welcome = results[0].welcomeMsg;
                    welcome = welcome.replace(/{{MENTION}}/gi, member.mention)
                        .replace(/{{SERVER}}/gi, guild.name)
                        .replace(/{{USER}}/gi, member.username);
                    if (results[0].welcomeChannel.toUpperCase() === 'DM') {
                        member.user.getDMChannel().then((chan) => {
                            chan.createMessage(welcome)
                                .catch((error) => client.logger.error(chalk.red.bold(error)));
                        });
                    } else {
                        client.createMessage(results[0].welcomeChannel, welcome);
                    }
                }
                if (results[0].modlogChannel) {
                    let check = settingsManager.getEventSetting(guild.id, 'memberjoined');
                    if (check === true) {
                        client.createMessage(results[0].modlogChannel, `\`[${new Date().toLocaleString()}]\` **Member Joined:** ${member.user.username}`);
                    }
                }
            });
        });
        if (guild.id === '240059867744698368') {
            member.addRole('304266397947789322', 'New member')
                .catch((error) => client.logger.error(chalk.red.bold(error)));
        }
    }
};