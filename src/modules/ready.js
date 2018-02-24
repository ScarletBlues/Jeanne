const chalk = require('chalk');
const games = require('../utils/constants').games;

module.exports = {
    name: 'ready',
    events: {
        ready: 'onReady'
    }, onReady: async (jeanne) => {
        const guilds = jeanne.guilds.size;
        const users = jeanne.users.size;
        const channels = Object.keys(jeanne.channelGuildMap).length;

        jeanne.logger.info(`${chalk.red.bold(jeanne.user.username)} - ${jeanne.options.firstShardID === jeanne.options.lastShardID ? `Shard ${jeanne.options.firstShardID} is ready!` : `Shards ${jeanne.options.firstShardID} to ${jeanne.options.lastShardID} are ready!`}`);
        jeanne.logger.info(`G: ${chalk.green.bold(string(guilds))} | C: ${chalk.green.bold(string(channels))} | U: ${chalk.green.bold(string(users))}`);
        jeanne.logger.info(`Prefix: ${chalk.cyan.bold(jeanne.prefix)}`);
        jeanne.shards.forEach((shard) => {
            // TODO: Change playing statuses to work with "Listening to" and "Watching"
            let game = games[~~(Math.random() * games.length)];
            game = game.replace(/{GUILDS}/g, guilds)
                .replace(/{USERS}/g, users);
            shard.editStatus({name: game, type: 1, url: 'https://twitch.tv/twitch/'});
        });
        jeanne.listenmoe.start(jeanne.logger);
        try {
            await jeanne.mongo.load(jeanne);
        } catch (e) {
            jeanne.logger.error(chalk.red.bold(`[Mongoose load]: ${e}`))
        }
    }
};
