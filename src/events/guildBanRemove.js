const chalk = require('chalk');

module.exports = (client, settingsManager, guild, user) => {
    let check = settingsManager.getEventSetting(guild.id, 'userunbanned');
    if (check === false) return;
    client.db_pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return client.logger.error(chalk.red.bold(err));
        }
        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], (error, results) => {
            conn.release();
            if (error) return client.logger.error(chalk.red.bold(error));
            if (!results[0]) return conn.release();
            if (!results[0].modlogChannel) return conn.release();
            client.createMessage(results[0].modlogChannel, {
                embed: {
                    color: 0x42f442,
                    author: {
                        name: `${user.username}#${user.discriminator} (${user.id})`,
                        icon_url: `${user.avatarURL}`
                    },
                    title: 'Type:',
                    description: 'Unban',
                    footer: {
                        text: `${new Date().toLocaleString()}`
                    }
                }
            });
        });
    });
};