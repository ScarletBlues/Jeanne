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

    async handle({msg, client}, responder) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');
        if (client.admins.indexOf(msg.author.id) !== -1) {
            exec(args, {maxBuffer: Infinity}, (err, stdout, stderr) => {
                if (err) return responder.send(`\`\`\`glsl\n${err}\`\`\``);
                if (stderr) return responder.send(`\`\`\`glsl\n${stderr}\`\`\``);
                responder.send(`\`\`\`glsl\n${stdout}\`\`\``);
            });
        } else {
            responder.send('❎ | Only my developer can execute this command.');
        }
    }
}

module.exports = Exec;