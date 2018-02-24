const {Command} = require('sylphy');

class Eval extends Command {
    constructor(...args) {
        super(...args, {
            name: 'eval',
            description: 'evaluate js code',
            group: 'owner',
            options: {adminOnly: true},
            usage: [
                {name: 'eval', type: 'string', optional: false, last: true}
            ]
        });
    }

    async handle({msg, args, client}, responder) {
        let suffix, evaled;
        try {
            suffix = cleanCodeBlock(args.eval);
            evaled = eval(suffix);
        } catch (err) {
            return responder.send(
                '__**Input:**__\n```js\n' + evaled + '```\n' +
                '__**Error:**__\n```diff\n- ' + err + '```'
            );
        }
        if (typeof evaled === 'object') evaled = JSON.stringify(evaled);
        responder.send(
            '__**Input:**__\n```js\n' + suffix + '```\n' +
            '__**Result:**__\n```' + evaled + '```'
        );
    }
}

function cleanCodeBlock(string) {
    return string.replace(/^```.* ?/, '').replace(/```$/, '')
}

module.exports = Eval;
