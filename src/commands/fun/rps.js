const {Command} = require('sylphy');
const {rps} = require('../../utils/constants');

class Rps extends Command {
    constructor(...args) {
        super(...args, {
            name: 'rps',
            description: 'Play rps against Jeanne d\'Arc',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'fun',
            usage: [
                {name: 'rock/paper/scissors', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        if (!rawArgs[0]) return responder.send('Please choose rock, paper or scissors.');
        const response = rps[~~(Math.random() * rps.length)];
        const choice = rawArgs[0].toLowerCase();
        let message = '';
        if (choice === response) message = `You: ${choice}\nJeanne d'Arc: ${response}\nRip it's a tied game...`;
        if (choice === 'rock' && response === 'scissors') message = 'You: rock\nJeanne d\'Arc: scissors\nRock beats scissors, you win';
        if (choice === 'rock' && response === 'paper') message = 'You: rock\nJeanne d\'Arc: paper\nPaper beats rock, Jeanne d\'Arc wins';
        if (choice === 'paper' && response === 'rock') message = 'You: paper\nJeanne d\'Arc: rock\nPaper beats rock, you win';
        if (choice === 'paper' && response === 'scissors') message = 'You: paper\nJeanne d\'Arc: scissors\nScissors beats paper, Jeanne d\'Arc wins';
        if (choice === 'scissors' && response === 'paper') message = 'You: scissors\nJeanne d\'Arc: paper\nScissor beats paper, you win';
        if (choice === 'scissors' && response === 'rock') message = 'You: scissors\nJeanne d\'Arc: rock\nRock beats scissors, Jeanne d\'Arc wins';
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: message
            }
        });
    }
}

module.exports = Rps;