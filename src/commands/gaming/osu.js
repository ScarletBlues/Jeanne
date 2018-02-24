const {Command} = require('sylphy');
const utils = require('../../utils/utils');
const NodeOsu = require('node-osu');
const osu = new NodeOsu.Api(require('../../../config').tokens.osu, {
    notFoundAsError: true,
    completeScores: false
});

class Osu extends Command {
    constructor(...args) {
        super(...args, {
            name: 'osu',
            description: 'Display osu! stats for a user',
            group: 'gaming',
            usage: [
                {name: 'subcommand', type: 'string', optional: false},
                {name: 'username', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs}, responder) {
        const type = rawArgs[0].toLowerCase();
        const user = rawArgs[1];
        if ((type === 'info') || (type === 'i')) {
            let osuUser;
            try {
                osuUser = await osu.getUser({u: user});
            } catch (e) {
                return responder.send(`Could not find a user with the name \`${user}\``);
            }
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    title: `osu! data from ${osuUser.name}`,
                    fields: [
                        {name: `ID`, value: `${osuUser.id}`, inline: true},
                        {name: `Name`, value: `${osuUser.name}`, inline: true},
                        {name: `Country`, value: `${osuUser.country}`, inline: true},
                        {name: `Level`, value: `${utils.round(osuUser.level, 1)}`, inline: true},
                        {name: `Accuracy`, value: `${utils.round(osuUser.accuracy, 1)}`, inline: true},
                        {name: `Scores`, value: `(ranked) ${osuUser.scores.ranked}\n(total) ${osuUser.scores.total}`, inline: true},
                        {name: `pp`, value: `(raw) ${utils.round(osuUser.pp.raw, 1)}\n(rank) ${osuUser.pp.rank}\n(country rank) ${osuUser.pp.countryRank}`, inline: true},
                        {name: `Counts`, value: `(SS) ${osuUser.counts.SS}\n(S) ${osuUser.counts.S}\n(A) ${osuUser.counts.A}\n(plays) ${osuUser.counts.plays}`, inline: true}
                    ]
                }
            });
        } else if ((type === 'best') || (type === 'b')) {
            let osuBest;
            try {
                osuBest = await osu.getUserBest({u: user});
            } catch (e) {
                return responder.send(`Could not find the best scores for the user \`${user}\``);
            }
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    title: `osu! data from ${osuBest[0].user.name}`,
                    fields: [
                        {name: `User ID`, value: `${osuBest[0].user.id}`, inline: true},
                        {name: `Name`, value: `${osuBest[0].user.name}`, inline: true},
                        {name: `Rank`, value: `${osuBest[0].rank}`, inline: true},
                        {name: `Max combo`, value: `${osuBest[0].maxCombo}`, inline: true},
                        {name: `pp`, value: `${utils.round(osuBest[0].pp, 1)}`, inline: true},
                        {name: `Date`, value: `${osuBest[0].raw_date}`, inline: true},
                        {name: `Counts`, value: `(geki) ${osuBest[0].counts.geki}\n(katu) ${osuBest[0].counts.katu}\n(miss) ${osuBest[0].counts.miss}`, inline: true}
                    ]
                }
            });
        } else if ((type === 'recent') || (type === 'r')) {
            responder.send('Function coming soon™, for now you can only use `info` and `best`.');
            /*
            osuApi.getUserRecent({ u: `${user}` }).then(s => {
                console.log(s[0].score);
            });
            */
        }
    }
}

module.exports = Osu;
