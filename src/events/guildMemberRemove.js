const chalk = require('chalk');

module.exports = (client, settingsManager, guild, member) => {
    let check = settingsManager.getEventSetting(guild.id, 'memberleft');
    if (check === false) return;
    if (member.user.bot === true) return;
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
            client.createMessage(results[0].modlogChannel, `\`[${new Date().toLocaleString()}]\` **Member Left:** ${member.user.username}`);
        });
    });
};