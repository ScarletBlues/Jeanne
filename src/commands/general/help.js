const {Command} = require('sylphy');
const utils = require('../../utils/utils');

class Help extends Command {
    constructor(...args) {
        super(...args, {
            name: 'help',
            description: 'show this message.',
            usage: [
                {name: 'command_name', type: 'string', optional: true}
            ],
            group: 'general',
            aliases: ['cmds']
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        if (!rawArgs[0]) {
            const filteredCmds = client.commands.filter((cmd) => cmd.options.hidden === false || !cmd.options.hidden);
            const cmdNames = client.utils.unique(filteredCmds.map((cmd) => cmd.name));
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    description: `\`\`\`fix\n${cmdNames.join(', ')}\`\`\``,
                    footer: {
                        text: `For more detail use ${client.prefix}help command_name`
                    }
                }
            });
        } else {
            const cmd = client.commands.find((c) => c.name === rawArgs[0]);
            if (!cmd) return msg.channel.createMessage(`❎ | No command found with the name **${rawArgs[0]}**`);
            let cmdUsage = '';
            if (cmd.usage.length >= 1) {
                for (let i = 0; i < cmd.usage.length; i++) {
                    cmdUsage += `\n   ${cmd.usage[i].name}: ${cmd.usage[i].type} (${cmd.usage[i].optional ? 'optional' : 'required'})`
                }
            } else {
                cmdUsage = 'None';
            }
            responder.send(`\`\`\`fix\n` +
                `Name:          ${cmd.name ? cmd.name : 'None'}\n` +
                `Description:   ${cmd.description ? cmd.description : 'None'}\n` +
                `Cooldown:      ${cmd.cooldown ? cmd.cooldown : 'None'}\n` +
                `Group:         ${cmd.group ? cmd.group : 'None'}\n` +
                `Arguments:     ${cmdUsage}\n` +
                `Permissions:   ${cmd.options.permissions ? cmd.options.permissions : 'None'}\n` +
                `Website:       https://jeannedarc.xyz/cmds/#${cmd.name ? `command-${cmd.name}` : ''}\`\`\``);
        }
    }
}

module.exports = Help;