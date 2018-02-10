const {Command} = require('sylphy');
const config = require('../../../config');
const {promisifyAll} = require('tsubaki');
const hs = promisifyAll(require('hearthstone-mashape')(config.tokens.hearthstone, 'enUS'));

class Hearthstone extends Command {
    constructor(...args) {
        super(...args, {
            name: 'hearthstone',
            description: 'Search hearthstone cards by name',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'gaming',
            usage: [
                {name: 'card', type: 'string', optional: false},
                {name: 'gold', type: 'string', optional: true}
            ],
            aliases: ['hs']
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const card = rawArgs[0];
        const option = rawArgs[1] ? rawArgs[1].toLowerCase() : null;
        let data;
        try {
            data = await hs.cardAsync({name: card, collectible: 1});
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (!data[0]) return responder.send(`Ahhh, I couldn't find anything with \`${card}\`. Gomenasai!`);
        const image = option === 'gold' ? data[0].imgGold : data[0].img;
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                description: `Name: ${data[0].name}\n` +
                `Card Set: ${data[0].cardSet}\n` +
                `Type: ${data[0].type}\n` +
                `Rarity: ${data[0].rarity}\n` +
                `Flavor: ${data[0].flavor}\n` +
                `Artist: ${data[0].artist}`,
                image: {url: image}
            }
        });
    }
}

module.exports = Hearthstone;