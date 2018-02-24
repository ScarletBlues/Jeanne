const {Command} = require('sylphy');
const {slots} = require('../../utils/constants');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class Spin extends Command {
    constructor(...args) {
        super(...args, {
            name: 'spin',
            description: 'Spin the slot machine and see what you get',
            options: {
                botPermissions: ['embedLinks']
            },
            cooldown: 10,
            group: 'fun',
            aliases: ['slot', 'slots', 'slotmachine']
        });
    }

    async handle({msg, client, logger}, responder) {
        const choice1 = slots[~~(Math.random() * slots.length)];
        const choice2 = slots[~~(Math.random() * slots.length)];
        const choice3 = slots[~~(Math.random() * slots.length)];
        const sentMsg = await responder.send('', {
            embed: {
                color: utils.getDefaultColor(msg, client),
                description: `**${msg.author.username}** spinned and got...`
            }
        });
        let colour, title, description;
        setTimeout(async () => {
            if (choice1 === choice2 && choice2 === choice3) {
                colour = 0x13c124;
                title = `You spinned: ${choice1} | ${choice2} | ${choice3}`;
                description = 'You won! Here\'s a cookie :cookie:';
            } else if ((choice1 === choice2) || (choice1 === choice3) || (choice2 === choice3)) {
                colour = 0xff8605;
                title = `You spinned: ${choice1} | ${choice2} | ${choice3}`;
                description = 'You almost got it!';
            } else {
                colour = 0xc11313;
                title = `You spinned: ${choice1} | ${choice2} | ${choice3}`;
                description = 'It\'s not even close...';
            }
            try {
                await sentMsg.edit({
                    embed: {
                        color: colour,
                        title: title,
                        description: description
                    }
                })
            } catch (e) {
                logger.error(chalk.red.bold(e))
            }
        }, 2000);
    }
}

module.exports = Spin;
