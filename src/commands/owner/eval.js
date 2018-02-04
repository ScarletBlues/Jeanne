const {Command} = require('sylphy');

class Eval extends Command {
    constructor(...args) {
        super(...args, {
            name: 'eval',
            description: 'evaluate js code',
            group: 'owner'
        });
    }

    async handle({msg, client}, responder) {
        if (client.admins.indexOf(msg.author.id) !== -1) {
            let toEval = msg.content.replace(/!!eval /g, '');
            let result = '~eval failed~';
            let lower = toEval.toLowerCase();
            if (lower.includes('client.token')) return responder.send('owo nothing to be found here.');
            try {
                result = eval(toEval);
            } catch (error) {
                responder.send(`__**Input:**__\n\`\`\`js\n${toEval}\`\`\`\n__**Error:**__\n\`\`\`diff\n- ${error}\`\`\``);
            }
            if (result !== '~eval failed~') {
                responder.send(`__**Input:**__\n\`\`\`js\n${toEval}\`\`\`\n__**Result:**__\n\`\`\`${result}\`\`\``);
            }
        } else {
            responder.send('❎ | Only my developer can execute this command.');
        }
    }
}

module.exports = Eval;