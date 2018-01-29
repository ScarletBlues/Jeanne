const exec = require('child_process').exec;
const {Command} = require('sylphy');

class Exec extends Command {
    constructor(...args) {
        super(...args, {
            name: 'exec',
            description: 'execute shell command',
            group: 'owner'
        });
    }

    async handle({msg, client}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (client.admins.indexOf(msg.author.id) !== -1) {
            exec(args, {
                maxBuffer: Infinity
            }, (err, stdout, stderr) => {
                if (err) return msg.channel.createMessage(`
\`\`\`glsl
${err}
\`\`\``);

                if (stderr) return msg.channel.createMessage(`
\`\`\`glsl
${stderr}
\`\`\``);

                msg.channel.createMessage(`
\`\`\`glsl
${stdout}
\`\`\``);
            });
        } else {
            msg.channel.createMessage('❎ | Only my developer can execute this command.');
        }
    }
}

module.exports = Exec;