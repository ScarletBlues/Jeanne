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
            options: {hidden: true, permissions: ['banMembers']},
            aliases: ['testing']
        });
    }

    async handle({msg, client}) {
        // Stuffs
    }
}

module.exports = Test;