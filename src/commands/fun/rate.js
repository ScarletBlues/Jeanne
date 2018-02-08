const {Command} = require('sylphy');

class Rate extends Command {
    constructor(...args) {
        super(...args, {
            name: 'rate',
            description: 'Rates your waifu',
            group: 'fun',
            aliases: ['rw', 'rwaifu'],
            usage: [
                {name: 'name', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        if (!rawArgs[0]) return responder.send('Who should I rate?');
        const checkMe = rawArgs[0].toLowerCase();
        let respString = `**${rawArgs[0]}** is a ${~~(Math.random() * 10)}/10 waifu`;
        if (checkMe === 'kurozero') respString = 'My master is always a 10/10!';
        if (msg.mentions.length >= 1 && msg.mentions[0].id === client.admins[0]) respString = 'My master is always a 10/10!';
        responder.send(respString);
    }
}

module.exports = Rate;