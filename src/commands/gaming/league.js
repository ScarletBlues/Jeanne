const {Command} = require('sylphy');
const config = require('../../../config');
const API = require('lol-riot-api-module');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class League extends Command {
    constructor(...args) {
        super(...args, {
            name: 'league',
            description: 'Get your profile info by name',
            options: {
                permissions: ['embedLinks'],
                botPermissions: ['attachFiles']
            },
            cooldown: 10,
            group: 'gaming',
            usage: [
                {name: 'region', type: 'string', optional: false},
                {name: 'name', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const region = rawArgs[0];
        const user = rawArgs[1];
        const api = new API({key: config.tokens.league, region: region});
        api.getSummoner({name: user}, (e, data) => {
            if (e) return logger.error(chalk.red.bold(e));
            const date = new Date(data.revisionDate);
            responder.send('More data comming soon™', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    title: `Info of ${data.name}`,
                    description: `ID: ${data.id}`,
                    fields: [
                        {name: `Account ID`, value: `${data.accountId}`, inline: true},
                        {name: `Summoner Level`, value: `${data.summonerLevel}`, inline: true}
                    ],
                    footer: {text: `revision date: ${date}`}
                }
            });
        });
    }
}

module.exports = League;
