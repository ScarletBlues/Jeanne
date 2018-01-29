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

    async handle({msg, client}, responder) {
        if (!msg.args) {
            let cmdNames = uniq(client.commands.map((cmd) => cmd.name));
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    description: `\`\`\`fix\n${cmdNames.join(', ')}\`\`\``,
                    footer: {
                        text: `For more detail use j:help command_name`
                    }
                }
            });
        } else {
            const cmd = client.commands.find((c) => c.name === msg.args);
            if (!cmd) return msg.channel.createMessage(`❎ | No command found with the name **${msg.args}**`);
            let cmdUsage = '';
            if (cmd.usage.length >= 1) {
                for (let i = 0; i < cmd.usage.length; i++) {
                    cmdUsage += `\n   ${cmd.usage[i].name}: ${cmd.usage[i].type} (${cmd.usage[i].optional ? 'optional' : 'required'})`
                }
            } else {
                cmdUsage = 'None';
            }
            let cmdName = cmd.name ? `${cmd.name[0].toUpperCase()}${cmd.name.substring(1)}` : '-';
            responder.send(`\`\`\`fix\n` +
                `${cmdName}\n` +
                `Desc:          ${cmd.description ? cmd.description : 'None'}\n` +
                `Cooldown:      ${cmd.cooldown ? cmd.cooldown : 'None'}\n` +
                `Group:         ${cmd.group ? cmd.group : 'None'}\n` +
                `Arguments:     ${cmdUsage}\n` +
                `Permissions:   ${cmd.permissions ? cmd.permissions : 'None'}\n` +
                `\`\`\`` +
                `<https://jeannedarc.xyz/cmds/#${cmd.name ? `command-${cmd.name}` : ''}>`);
        }
    }
}

function uniq(a) {
    let prims = {'boolean': {}, 'number': {}, 'string': {}}, objs = [];
    return a.filter(function (item) {
        let type = typeof item;
        if (type in prims) {
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        } else {
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
        }
    });
}

module.exports = Help;