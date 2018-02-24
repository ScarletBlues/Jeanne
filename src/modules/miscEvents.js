const chalk = require('chalk');
const utils = require('../utils/utils');

module.exports = {
    name: 'miscEvents',
    events: {
        channelDelete: 'onChannelDelete',
        shardReady: 'onShardReady',
        shardDisconnect: 'onShardDisconnect',
        shardResume: 'onShardResume',
        error: 'onError',
        warn: 'onWarn'
    }, onChannelDelete: (channel, jeanne) => {
        jeanne.settingsManager.handleDeletedChannel(channel, jeanne);
    }, onShardReady: (id, jeanne) => {
        jeanne.logger.info(chalk.green.bold(`Shard [${id}] ready`));
    }, onShardDisconnect: (id, jeanne) => {
        jeanne.logger.info(chalk.red.bold(`Shard [${id}] disconnected`));
    }, onShardResume: (id, jeanne) => {
        jeanne.logger.info(chalk.green.bold(`Shard [${id}] resumed`));
    }, onError: (err, jeanne) => {
        utils.errorWebhook(jeanne, err, 'ERROR');
    }, onWarn: (msg, jeanne) => {
        utils.errorWebhook(jeanne, msg, 'WARN');
    }
};
