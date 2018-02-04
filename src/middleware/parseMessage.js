module.exports = {
    priority: 2,
    process: container => {
        const {client, msg, commands} = container;
        const prefix = container.prefix = process.env.CLIENT_PREFIX;
        if (!msg.content.startsWith(prefix)) return Promise.resolve();
        const permCheck = client.utils.hasPermissions(msg.channel, client.user, ['sendMessages']);
        if (!permCheck) return Promise.resolve();
        const rawArgs = msg.content.substring(prefix.length).split(' ');
        const trigger = container.trigger = rawArgs[0].toLowerCase();

        const cmd = commands.find((cmd) => {
            if (cmd.name === trigger) {
                return cmd;
            } else {
                if (cmd.aliases) {
                    cmd.aliases.forEach((a) => {
                        if (a === trigger) {
                            return cmd;
                        }
                    });
                }
                return undefined;
            }
        });

        if (cmd && cmd.options && cmd.options.botPermissions && cmd.options.botPermissions !== []) {
            let permMessage = '';
            let missingPerms = false;
            cmd.options.botPermissions.forEach((p) => {
                const perm = msg.channel.permissionsOf(client.user.id).has(p);
                if (perm === false) {
                    permMessage += p + ', ';
                    missingPerms = true;
                }
            });
            permMessage = permMessage.slice(0, -2);
            if (missingPerms === true) {
                msg.channel.createMessage(`<:RedCross:373596012755025920> | I'm missing the \`${permMessage}\` permission(s) which is required for this command to work properly.`);
                return Promise.resolve();
            }
        }

        client.commands = commands;
        container.isPrivate = !msg.channel.guild;
        container.isCommand = commands.has(trigger);
        container.rawArgs = rawArgs.slice(1).filter(v => !!v).join(' ').split(/ ?\| ?/g);
        if (container.isCommand) client.commandsProcessed++;
        return Promise.resolve(container)
    }
};