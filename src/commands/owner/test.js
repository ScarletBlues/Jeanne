const {Command} = require('sylphy');

class Test extends Command {
    constructor(...args) {
        super(...args, {
            name: 'test',
            description: 'abc',
            group: 'owner',
            usage: [
                {name: 'a', type: 'string', optional: false},
                {name: 'b', type: 'number', optional: true}
            ],
            options: {permissions: ['banMembers']},
            aliases: ['testing']
        });
    }

    async handle({msg, client}) {
        if (client.admins.indexOf(msg.author.id) === -1) return msg.channel.createMessage('❎ | Only my developer can execute this command.');

    }
}

module.exports = Test;