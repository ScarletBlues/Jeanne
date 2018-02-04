const {Command} = require('sylphy');
const answers = [
    'Yes!',
    'No way!',
    'Obviously',
    'Try again next time',
    'Probably not',
    'Probably',
    'Think harder and try again!',
    'Idk u tell me..',
    'Keep on dreaming!',
    'Without a doubt',
    'My sources say no',
    'Very doubtful',
    'It is decidedly so..',
    'My reply is no',
    'Better not tell you now..',
    'Don\'t count on it..',
    'Cannot predict now..'
];

class EightBall extends Command {
    constructor(...args) {
        super(...args, {
            name: '8ball',
            description: 'ya know, 8ball does 8ball things',
            group: 'fun',
            usage: [
                {name: 'question', type: 'string', optional: false}
            ]
        });
    }

    async handle({}, responder) {
        const choice = answers[~~(Math.random() * answers.length)];
        responder.send('🎱 | ' + choice);
    }
}

module.exports = EightBall;