const chalk = require('chalk');

module.exports = (client, settingsManager, user, oldUser) => {
    if (user.bot === true) return;
    client.db_pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return client.logger.error(chalk.red.bold(err));
        }
        let guildArray = [];
        client.guilds.forEach((guild) => {
            if (guild.members.has(user.id)) {
                let check = settingsManager.getEventSetting(guild.id, 'namechanged');
                if (check === false) return;
                guildArray.push(guild);
            }
        });
        guildArray.forEach((guild) => {
            conn.query('SELECT * FROM guildSettings WHERE guildID=?', [guild.id], (error, results) => {
                conn.release();
                if (error) return client.logger.error(chalk.red.bold(error));
                if (!results[0]) return;
                if (!results[0].modlogChannel) return;
                if (oldUser && user.username !== oldUser.username) {
                    client.createMessage(results[0].modlogChannel, `\`[${new Date().toLocaleString()}]\` **Name Change:** \`\`${oldUser.username}#${oldUser.discriminator}\`\` is now \`\`${user.username}#${user.discriminator}\`\` **ID:** \`\`${user.id}\`\``);
                }
            });
        });
    });
};