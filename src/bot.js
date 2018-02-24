require('winston-daily-rotate-file');
require('moment-duration-format');
require('eris-additions')(require('eris'));

const path = require('path');
const chalk = require('chalk');
const winston = require('winston');
const moment = require('moment');
const JeanneClient = require('./structures/JeanneClient');

const resolve = (str) => path.join('src', str);

const processID = parseInt(process.env['PROCESS_ID'], 10);
const processShards = parseInt(process.env['SHARDS_PER_PROCESS'], 10);
const firstShardID = processID * processShards;
const lastShardID = firstShardID + processShards - 1;

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'silly',
            colorize: true,
            label: processShards > 1 ? `C ${firstShardID}-${lastShardID}` : `C ${processID}`,
            timestamp: () => `[${chalk.grey(moment().format('HH:mm:ss'))}]`
        })
    ]
});

const jeanne = new JeanneClient({
    token: process.env['CLIENT_TOKEN'],
    prefix: process.env['CLIENT_PREFIX'],
    admins: (process.env['ADMINS'] || '').split(','),
    modules: resolve('modules'),
    messageLimit: 150,
    getAllUsers: true,
    disableEveryone: true,
    maxShards: processShards * parseInt(process.env['PROCESS_COUNT'], 10),
    firstShardID: firstShardID,
    lastShardID: lastShardID,
    compress: true,
    restMode: true,
    disableEvents: {
        'TYPING_START': true,
        'MESSAGE_DELETE_BULK': true,
        'MESSAGE_DELETE': true
    },
    opusOnly: true,
    autoReconnect: true
});

jeanne
    .unregister('logger', 'console')  // use custom winston console transport
    .register('logger', 'winston', logger)
    .unregister('middleware', true)   // use custom middleware
    .register('middleware', resolve('middleware'))
    .register('commands', resolve('commands'), {groupedCommands: true});

// Temporary events
jeanne.db_pool.on('acquire', (conn) => {
    jeanne.logger.info(chalk.green.bold(`[DB] Connection ${conn.threadId} acquired`));
});
jeanne.db_pool.on('release', (conn) => {
    jeanne.logger.info(chalk.green.bold(`[DB] Connection ${conn.threadId} released`));
});

process.on('SIGINT', async () => await jeanne.shutdown());
process.on('uncaughtException', (err) => logger.error(err));
process.on('unhandledRejection', (err) => logger.error(err));

(async () => {
    jeanne.logger.info(chalk.green.bold('Logging in...'));
    try {
        await jeanne.run();
    } catch (e) {
        jeanne.logger.error(chalk.red.bold(`[LOGIN] ${e}`));
    }
})();
