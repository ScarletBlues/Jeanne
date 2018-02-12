const {Command} = require('sylphy');
const owjs = require('../../utils/overwatch');

class Overwatch extends Command {
    constructor(...args) {
        super(...args, {
            name: 'overwatch',
            description: 'Get overwatch data',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'gaming',
            aliases: ['ow'],
            usage: [
                {name: 'type', type: 'string', optional: false},
                {name: 'platform', type: 'string', optional: false},
                {name: 'region', type: 'string', optional: false},
                {name: 'username', type: 'string', optional: false}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const type = rawArgs[0].toLowerCase(); // profile, comp, quick
        const platform = rawArgs[1].toLowerCase(); // xbl, psn, pc
        const region = rawArgs[2].toLowerCase(); // eu, us, kr, cn
        const username = rawArgs[3];
        let fields, data;
        try {
            data = await owjs.getOverall(platform, region, username.replace("#", "-"));
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (!data) return responder.send(`I could not find any data for \`${username}\` on \`${platform}\` with region \`${region}\``);
        if (type === 'profile' || type === 'pf') {
            fields = [
                {name: 'Nick', value: data.profile.nick ? data.profile.nick : '-', inline: true},
                {name: 'Level', value: data.profile.level ? data.profile.level : '-', inline: true},
                {name: 'Rank', value: data.profile.rank ? data.profile.rank : '-', inline: true},
                {name: 'Season', value: `S: ${data.profile.season ? data.profile.season.id : '-'}\nR: ${data.profile.season ? data.profile.season.rank : '-'}`, inline: true},
                {name: 'Best Rank', value: data.profile.ranking ? data.profile.ranking : '-', inline: false}
            ];
        } else if (type === 'comp' || type === 'c' || type === 'competitive') {
            fields = [
                {
                    name: `Average`,
                    value: `**Eliminations:** ${data.competitive.global.eliminations_average ? data.competitive.global.eliminations_average : '-'}\n` +
                    `**Damage done:** ${data.competitive.global.damage_done_average ? data.competitive.global.damage_done_average : '-'}\n` +
                    `**Deaths:** ${data.competitive.global.deaths_average ? data.competitive.global.deaths_average : '-'}\n` +
                    `**Final blows:** ${data.competitive.global.final_blows_average ? data.competitive.global.final_blows_average : '-'}\n` +
                    `**Objective kills:** ${data.competitive.global.objective_kills_average ? data.competitive.global.objective_kills_average : '-'}\n` +
                    `**Solo kills:** ${data.competitive.global.solo_kills_average ? data.competitive.global.solo_kills_average : '-'}`,
                    inline: true
                },
                {
                    name: 'Total',
                    value: `**Solo kills:** ${data.competitive.global.solo_kills ? data.competitive.global.solo_kills : '-'}\n` +
                    `**Objective kills:** ${data.competitive.global.objective_kills ? data.competitive.global.objective_kills : '-'}\n` +
                    `**Final blows:** ${data.competitive.global.final_blows ? data.competitive.global.final_blows : '-'}\n` +
                    `**Damage done:** ${data.competitive.global.damage_done ? data.competitive.global.damage_done : '-'}\n` +
                    `**Eliminations:** ${data.competitive.global.eliminations ? data.competitive.global.eliminations : '-'}\n` +
                    `**Deaths:** ${data.competitive.global.deaths ? data.competitive.global.deaths : '-'}\n` +
                    `**Games played:** ${data.competitive.global.games_played ? data.competitive.global.games_played : '-'}\n` +
                    `**Games won:** ${data.competitive.global.games_won ? data.competitive.global.games_won : '-'}\n` +
                    `**Games lost:** ${data.competitive.global.games_lost ? data.competitive.global.games_lost : '-'}`,
                    inline: true
                },
                {
                    name: 'Most in game',
                    value: `**Eliminations:** ${data.competitive.global.eliminations_most_in_game ? data.competitive.global.eliminations_most_in_game : '-'}\n` +
                    `**Final blows:** ${data.competitive.global.final_blows_most_in_game ? data.competitive.global.final_blows_most_in_game : '-'}\n` +
                    `**Damage done:** ${data.competitive.global.damage_done_most_in_game ? data.competitive.global.damage_done_most_in_game : '-'}\n` +
                    `**Objective kills:** ${data.competitive.global.objective_kills_most_in_game ? data.competitive.global.objective_kills_most_in_game : '-'}\n` +
                    `**Solo kills:** ${data.competitive.global.solo_kills_most_in_game ? data.competitive.global.solo_kills_most_in_game : '-'}`,
                    inline: true
                },
                {
                    name: 'Medals',
                    value: `**Total:** ${data.competitive.global.medals ? data.competitive.global.medals : '-'}\n` +
                    `**Gold:** ${data.competitive.global.medals_gold ? data.competitive.global.medals_gold : '-'}\n` +
                    `**Silver:** ${data.competitive.global.medals_silver ? data.competitive.global.medals_silver : '-'}\n` +
                    `**Bronze:** ${data.competitive.global.medals_bronze ? data.competitive.global.medals_bronze : '-'}`,
                    inline: true
                }
            ]
        } else if (type === 'quick' || type === 'q' || type === 'quickplay') {
            fields = [
                {
                    name: 'Average',
                    value: `**Eliminations:** ${data.quickplay.global.eliminations_average ? data.quickplay.global.eliminations_average : '-'}\n` +
                    `**Damage done:** ${data.quickplay.global.damage_done_average ? data.quickplay.global.damage_done_average : '-'}\n` +
                    `**Deaths:** ${data.quickplay.global.deaths_average ? data.quickplay.global.deaths_average : '-'}\n` +
                    `**Final blows:** ${data.quickplay.global.final_blows_average ? data.quickplay.global.final_blows_average : '-'}\n` +
                    `**Healing done:** ${data.quickplay.global.healing_done_average ? data.quickplay.global.healing_done_average : '-'}\n` +
                    `**Objective kills:** ${data.quickplay.global.objective_kills_average ? data.quickplay.global.objective_kills_average : '-'}\n` +
                    `**Solo kills:** ${data.quickplay.global.solo_kills_average ? data.quickplay.global.solo_kills_average : '-'}`,
                    inline: true
                },
                {
                    name: 'Total',
                    value: `**Solo kills:** ${data.quickplay.global.solo_kills ? data.quickplay.global.solo_kills : '-'}\n` +
                    `**Objective kills:** ${data.quickplay.global.objective_kills ? data.quickplay.global.objective_kills : '-'}\n` +
                    `**Final blows:** ${data.quickplay.global.final_blows ? data.quickplay.global.final_blows : '-'}\n` +
                    `**Damage done:** ${data.quickplay.global.damage_done ? data.quickplay.global.damage_done : '-'}\n` +
                    `**Eliminations:** ${data.quickplay.global.eliminations ? data.quickplay.global.eliminations : '-'}\n` +
                    `**Healing done:** ${data.quickplay.global.healing_done ? data.quickplay.global.healing_done : '-'}\n` +
                    `**Deaths:** ${data.quickplay.global.deaths ? data.quickplay.global.deaths : '-'}\n` +
                    `**Games won:** ${data.quickplay.global.games_won ? data.quickplay.global.games_won : '-'}`,
                    inline: true
                },
                {
                    name: 'Most in game',
                    value: `**Eliminations:** ${data.quickplay.global.eliminations_most_in_game ? data.quickplay.global.eliminations_most_in_game : '-'}\n` +
                    `**Final blows:** ${data.quickplay.global.final_blows_most_in_game ? data.quickplay.global.final_blows_most_in_game : '-'}\n` +
                    `**Damage done:** ${data.quickplay.global.damage_done_most_in_game ? data.quickplay.global.damage_done_most_in_game : '-'}\n` +
                    `**Healing done:** ${data.quickplay.global.healing_done_most_in_game ? data.quickplay.global.healing_done_most_in_game : '-'}\n` +
                    `**Defensive assists:** ${data.quickplay.global.defensive_assists_most_in_game ? data.quickplay.global.defensive_assists_most_in_game : '-'}\n` +
                    `**Offensive assists:** ${data.quickplay.global.offensive_assists_most_in_game ? data.quickplay.global.offensive_assists_most_in_game : '-'}\n` +
                    `**Objective kills:** ${data.quickplay.global.objective_kills_most_in_game ? data.quickplay.global.objective_kills_most_in_game : '-'}\n` +
                    `**Solo kills:** ${data.quickplay.global.solo_kills_most_in_game ? data.quickplay.global.solo_kills_most_in_game : '-'}`,
                    inline: true
                },
                {
                    name: 'Medals',
                    value: `**Total:** ${data.quickplay.global.medals ? data.quickplay.global.medals : ''}\n` +
                    `**Gold:** ${data.quickplay.global.medals_gold ? data.quickplay.global.medals_gold : ''}\n` +
                    `**Silver:** ${data.quickplay.global.medals_silver ? data.quickplay.global.medals_silver : ''}\n` +
                    `**Bronze:** ${data.quickplay.global.medals_bronze ? data.quickplay.global.medals_bronze : ''}`,
                    inline: true
                }
            ]
        }
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                author: {
                    name: `Info for: ${username}`,
                    url: data.profile.url ? data.profile.url : '',
                    icon_url: data.profile.rankPicture ? data.profile.rankPicture : ''
                },
                thumbnail: {url: data.profile.avatar ? data.profile.avatar : ''},
                fields: fields
            }
        });
    }
}

module.exports = Overwatch;
