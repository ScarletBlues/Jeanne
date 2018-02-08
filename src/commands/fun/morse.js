const {Command} = require('sylphy');
const morse = require('morse-node').create();

class Morse extends Command {
    constructor(...args) {
        super(...args, {
            name: 'morse',
            description: 'Encode or decode morse code',
            group: 'fun',
            usage: [
                {name: 'encode/decode', type: 'string', optional: false},
                {name: 'text/morse', type: 'string', optional: false}
            ]
        });
    }

    async handle({rawArgs}, responder) {
        if (!rawArgs[1]) return responder.send('Please provide something to encode/decode.');
        const option = rawArgs[0].toLowerCase();
        const morseCode = option === 'encode' ? morse.encode(rawArgs[1]) : option === 'decode' ? morse.decode(rawArgs[1]) : null;
        if (!morseCode) return responder.send('First argument needs to either be "encode" or "decode"');
        responder.send(morseCode);
    }
}

module.exports = Morse;