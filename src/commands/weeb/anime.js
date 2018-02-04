const {Command} = require('sylphy');

class Anime extends Command {
    constructor(...args) {
        super(...args, {
            name: 'anime',
            description: 'Shows info about an anime.',
            options: {/* Options: hidden, permissions... */},
            cooldown: 10,
            group: 'anime'
        });
    }

    async handle({msg}) {
        msg.channel.createMessage('Nothing');
    }
}

module.exports = Anime;
