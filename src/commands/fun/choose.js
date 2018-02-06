const {Command} = require('sylphy');

const RESPONSES = [
    c => `I chose **${c}**`,
    c => `I pick ${c}`,
    c => `${c} is the best choice`,
    c => `${c} is my choice`,
    c => `${c} of course!`
];

class Choose extends Command {
    constructor(...args) {
        super(...args, {
            name: 'choose',
            description: 'Makes a choice for you',
            group: 'fun',
            aliases: ['c', 'pick', 'decide', 'choice'],
            usage: [
                {name: 'option1', type: 'string', optional: false},
                {name: 'option2', type: 'string', optional: false},
                {name: '...', type: 'string', optional: true}
            ]
        });
    }

    async handle({rawArgs}, responder) {
        const choices = rawArgs.filter(c => c !== '');
        if (choices.length < 2) return responder.send('You need to give me 2 or more choices.');
        let pick = ~~(Math.random() * choices.length);
        choices.forEach((c, i) => {
            if ((c.includes('homework') || c.includes('sleep') || c.includes('study') || c.includes('productiv')) && Math.random() < .3) pick = i;
            return pick;
        });
        responder.send(RESPONSES[~~(Math.random() * RESPONSES.length)](choices[pick]));
    }
}

module.exports = Choose;