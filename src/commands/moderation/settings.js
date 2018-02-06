const settingsManager = require('../../utils/settingsManager');
const {Command} = require('sylphy');
const chalk = require('chalk');

//Validates the message and updates the setting.
function updateWelcome(bot, msg, suffix) {
    bot.db_pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return bot.logger.error(chalk.red.bold(err));
        }
        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
            if (error) {
                conn.release();
                return bot.logger.error(chalk.red.bold(err));
            }
            if (!results[0]) {
                conn.query('INSERT INTO guildSettings(guildID,welcomeMsg,lvlupMsg) VALUES (?,?,?)', [msg.channel.guild.id, '', ''], (error) => {
                    if (error) {
                        conn.release();
                        return bot.logger.error(chalk.red.bold(err));
                    } else {
                        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
                            if (error) {
                                conn.release();
                                return bot.logger.error(chalk.red.bold(err));
                            }
                            settingsManager.welcome(suffix, msg, conn, results, bot);
                        });
                    }
                });
            } else {
                settingsManager.welcome(suffix, msg, conn, results, bot);
            }
        });
    });
}

function handleEventsChange(bot, msg, suffix) {
    bot.db_pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return bot.logger.error(chalk.red.bold(err));
        }
        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
            if (error) {
                conn.release();
                return bot.logger.error(chalk.red.bold(err));
            }
            if (!results[0]) {
                conn.query('INSERT INTO guildSettings(guildID,welcomeMsg,lvlupMsg) VALUES (?,?,?)', [msg.channel.guild.id, '', ''], (error) => {
                    if (error) {
                        conn.release();
                        return bot.logger.error(chalk.red.bold(err));
                    } else {
                        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
                            if (error) {
                                conn.release();
                                return bot.logger.error(chalk.red.bold(err));
                            }
                            settingsManager.eventHandler(suffix, msg, conn, results);
                        });
                    }
                });
            } else {
                settingsManager.eventHandler(suffix, msg, conn, results);
            }
        });
    });
}

class Settings extends Command {
    constructor(...args) {
        super(...args, {
            name: 'settings',
            description: 'Adjust a server\'s settings.\nhttps://jeannedarc.xyz/settings',
            usage: [
                {name: 'subcommand', type: 'string', optional: false},
                {name: 'subargs', type: 'string', optional: true}
            ],
            options: {permissions: ['manageGuild']},
            group: 'mod',
            aliases: ['set', 'config']
        });
    }

    async handle({msg, client}, responder) {
        let suffix = msg.content.split(' ');
        suffix.shift();
        suffix = suffix.join(' ');

        if (suffix) {
            if (suffix.startsWith('welcome')) {
                updateWelcome(client, msg, suffix.substr(7).trim());
            } else if (suffix.startsWith('events')) {
                handleEventsChange(client, msg, suffix.substr(6).trim());
            } else {
                responder.send('This subcommand does not exist. Please visit <\u200bhttps://jeannedarc.xyz/settings> for more info.')
            }
        }
    }
}

module.exports = Settings;