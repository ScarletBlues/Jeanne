const {Command} = require('sylphy');

class Emote extends Command {
    constructor(...args) {
        super(...args, {
            name: 'emote',
            description: 'Sends a random emote Jeanne d\'Arc has access to',
            options: {
                botPermissions: ['externalEmojis']
            },
            cooldown: 30,
            group: 'fun',
        });
    }

    async handle({client}, responder) {
        const guilds = client.guilds.filter((g) => g.emojis.length > 0);
        const emotes = guilds[~~(Math.random() * guilds.length - 1)].emojis;
        const emote = emotes[~~(Math.random() * emotes.length - 1)];
        responder.send(`${emote.animated ? `<a:${emote.name}:${emote.id}>` : `<:${emote.name}:${emote.id}>`}`);
    }
}

module.exports = Emote;