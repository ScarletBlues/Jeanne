const {Command} = require('sylphy');
const Nf = new Intl.NumberFormat('en-US');

class Roll extends Command {
    constructor(...args) {
        super(...args, {
            name: 'roll',
            description: 'Roll a number between the given range',
            group: 'fun',
            usage: [
                {name: 'range', type: 'string', optional: true}
            ]
        });
    }

    async handle({msg, rawArgs}, responder) {
        const args = rawArgs[0].match(/(?:(\d+)-)?(\d+)/);
        const roll = args === null ? [1, 10] : [parseInt(args[1]) || 1, parseInt(args[2])];
        responder.send(`${msg.author.username} rolled **${Nf.format(roll[0])}-${Nf.format(roll[1])}** and got **${Nf.format(~~((Math.random() * (roll[1] - roll[0] + 1)) + roll[0]))}**`);
    }
}

module.exports = Roll;