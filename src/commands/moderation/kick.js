const {Command} = require('sylphy');
const config = require('../../../config');
const settingsManager = require('../../utils/settingsManager');

class Kick extends Command {
    constructor(...args) {
        super(...args, {
            name: 'kick',
            description: 'Kick a member from the guild',
            options: {permissions: ['kickMembers']},
            group: 'mod',
            usage: [
                {name: 'userToKick', type: 'member', optional: false},
                {name: 'reason', type: 'string', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const member = client.utils.findMember(msg, rawArgs[0]);
        if (!member) return responder.send(`Oops, it seems like I cound't find a member with \`${rawArgs}\`\nPlease specify a name, ID or mention the user.`);
        let reason;
        if (!rawArgs[1]) reason = 'No reason was provided';
        else reason = rawArgs[1];
        if (member.kickable) {
            client.kickGuildMember(msg.channel.guild.id, member.id, reason)
                .then(() => {
                    responder.send(`Successfully kicked \`${member.tag}\``);
                    let check = settingsManager.getEventSetting(msg.channel.guild.id, 'userkicked');
                    if (check === false) return;
                    client.db_pool.getConnection((err, conn) => {
                        if (err) {
                            conn.release();
                            return logger.error(client.chalk.red.bold(err));
                        }
                        conn.query('SELECT * FROM guildSettings WHERE guildID=?', [msg.channel.guild.id], (error, results) => {
                            conn.release();
                            if (error) return logger.error(client.chalk.red.bold(error));
                            if (!results[0]) return;
                            if (!results[0].modlogChannel) return;
                            client.createMessage(results[0].modlogChannel, {
                                embed: {
                                    color: config.colours.red,
                                    author: {name: `${member.tag} (${member.id})`, icon_url: `${member.avatarURL}`},
                                    fields: [
                                        {name: 'Type', value: 'Kick', inline: true},
                                        {name: 'Reason', value: reason, inline: true}
                                    ],
                                    footer: {text: `${new Date().toLocaleString()}`}
                                }
                            });
                        });
                    });
                }).catch((e) => logger.error(client.chalk.red.bold(`[command error] ${e}`)))
        } else {
            responder.send('It seems like I can\'t kick this member.');
        }
    }
}

module.exports = Kick;