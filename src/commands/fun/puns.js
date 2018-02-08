const {Command} = require('sylphy');
const {puns} = require('../../utils/constants');

function randword(arr) {
    return arr[~~(Math.random() * arr.length)];
}

class Puns extends Command {
    constructor(...args) {
        super(...args, {
            name: 'pun',
            description: 'Sends a random pun',
            group: 'fun',
            aliases: ['puns']
        });
    }

    async handle({}, responder) {
        responder.send(randword(puns));
    }
}

module.exports = Puns;