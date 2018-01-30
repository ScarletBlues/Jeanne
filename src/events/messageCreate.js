const chalk = require('chalk');

module.exports = {
    handler(client, msg) {
        if (msg.content.startsWith(client.prefix)) return;
        if (msg.author && msg.author.bot) return;
        client.db_pool.getConnection((err, conn) => {
            if (err) {
                conn.release();
                return client.logger.error(chalk.red.bold(err));
            }
            // Tries to get the user's data
            conn.query('SELECT * FROM userSettings WHERE userID=?', [msg.author.id], (error, results) => {
                if (error) {
                    conn.release();
                    client.logger.error(chalk.red.bold(error));
                } else {
                    if (!results[0]) {
                        // Add user to db if it doesn't exists
                        conn.query('INSERT INTO userSettings(userID, level, points, blacklisted) VALUES (?,?,?,?)', [msg.author.id, 0, 0, false], (error) => {
                            conn.release();
                            if (error) return client.logger.error(chalk.red.bold(error));
                        });
                    } else {
                        let userData = results[0];
                        let oldlevel = userData.level;
                        userData.points++;
                        let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
                        if (curLevel > userData.level) {
                            conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
                                if (!results[0]) return;
                                if (results[0].lvlupMsgEnabled === 0) return;
                                let levelup = results[0].lvlupMsg
                                    .replace(/{{MENTION}}/g, msg.author.mention)
                                    .replace(/{{NAME}}/g, msg.author.username)
                                    .replace(/{{NEWLEVEL}}/g, curLevel)
                                    .replace(/{{OLDLEVEL}}/g, oldlevel);
                                msg.channel.createMessage(levelup);
                            });
                            userData.level = curLevel;
                        }
                        // Updates user's data if it did exist
                        conn.query('UPDATE userSettings SET points=?,level=? WHERE userID=?', [userData.points, userData.level, msg.author.id], (error) => {
                            conn.release();
                            if (error) return client.logger.error(chalk.red.bold(error));
                        });
                    }
                }
            });
        });
    }
};