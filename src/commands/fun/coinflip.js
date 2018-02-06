const {Command} = require('sylphy');

class Coinflip extends Command {
    constructor(...args) {
        super(...args, {
            name: 'coinflip',
            description: 'Flip a coin',
            aliases: ['coin', 'flip'],
            cooldown: 1,
            group: 'fun'
        });
    }

    async handle({msg}, responder) {
        responder.send(`${msg.author.username} flipped a coin and it landed on ${Math.random() < .5 ? '**heads**' : '**tails**'}`);
    }
}

module.exports = Coinflip;