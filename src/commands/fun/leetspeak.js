const {Command} = require('sylphy');
const Leetscript = require('leetscript');

class Leet extends Command {
    constructor(...args) {
        super(...args, {
            name: 'leetspeak',
            description: 'Convert text to leetspeak, option can be either "simple" or "advanced"',
            group: 'fun',
            usage: [
                {name: 'option', type: 'string', optional: false},
                {name: 'text', type: 'string', optional: false}
            ],
            aliases: ['leet'],
        });
    }

    async handle({client, rawArgs, logger}, responder) {
        if (!rawArgs[1]) return responder.send('Please provide something to encode.');
        const option = rawArgs[0].toLowerCase();
        const leet = option === 'simple' ? new Leetscript(true) : option === 'advanced' ? new Leetscript() : null;
        if (!leet) return responder.send('Option needs to either be "simple" or "advanced".');
        let encoded;
        try {
            encoded = await leet.encodePromise(rawArgs[1]);
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        responder.send(encoded);
    }
}

module.exports = Leet;