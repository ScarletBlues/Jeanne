const chalk = require('chalk');
const games = require('../utils/constants').games;

module.exports = {
    handler(client, firstShardID, lastShardID) {
        const guilds = client.guilds.size;
        const users = client.users.size;
        const channels = Object.keys(client.channelGuildMap).length;

        client.logger.info(`${chalk.red.bold(client.user.username)} - ${firstShardID === lastShardID ? `Shard ${firstShardID} is ready!` : `Shards ${firstShardID} to ${lastShardID} are ready!`}`);
        client.logger.info(`G: ${chalk.green.bold(guilds)} | C: ${chalk.green.bold(channels)} | U: ${chalk.green.bold(users)}`);
        client.logger.info(`Prefix: ${chalk.cyan.bold(client.prefix)}`);
        client.shards.forEach((shard) => {
            // TODO: Change playing statuses to work with "Listening to" and "Watching"
            let game = games[~~(Math.random() * games.length)];
            game = game.replace(/{GUILDS}/g, guilds)
                    .replace(/{USERS}/g, users);
            shard.editStatus({name: game, type: 1, url: 'https://twitch.tv/twitch/'});
        });
    }
};