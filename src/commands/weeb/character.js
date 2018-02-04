const {Command} = require('sylphy');

class Character extends Command {
    constructor(...args) {
        super(...args, {
            name: 'character',
            description: 'search for an anime character by name.',
            group: 'anime',
            aliases: ['char']
        });
    }

    async handle({msg}) {
        msg.channel.createMessage('Nothing');
    }
}

module.exports = Character;
