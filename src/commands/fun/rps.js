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
        const choice = rps[~~(Math.random() * rps.length)];
        const userChoice = rawArgs[0].toLowerCase();
        let message = '';
        if (choice === userChoice) {
            message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nRip it's a tied game...`;
            return responder.send('', {
                embed: {
                    color: client.utils.getDefaultColor(msg, client),
                    description: message
                }
            });
        }

        switch (choice) {
            case 'rock':
                switch (userChoice) {
                    case 'paper':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nYou won, goodjob!`;
                        break;
                    case 'scissors':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nI win yaay!`;
                        break;
                }
                break;
            case 'paper':
                switch (userChoice) {
                    case 'rock':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nI win yaay!`;
                        break;
                    case 'scissors':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nYou won, goodjob!`;
                        break;
                }
                break;
            case 'scissors':
                switch (userChoice) {
                    case 'rock':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nYou won, goodjob!`;
                        break;
                    case 'paper':
                        message = `You chose: \`${userChoice}\`\nI choose: \`${choice}\`\nI win yaay!`;
                        break;
                }
                break;
        }
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: message
            }
        });
    }
}

module.exports = Rps;