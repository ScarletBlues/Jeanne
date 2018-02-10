require('winston-daily-rotate-file');
require('moment-duration-format');
require('eris-additions')(require('eris'));

let events = {};
const path = require('path');
const chalk = require('chalk');
const winston = require('winston');
const moment = require('moment');
const {Client} = require('sylphy');
const mysql = require('mysql');
const {startMoe} = require('./utils/listenmoe');
const fs = require('fs');
const utils = require('./utils/utils.js');
const settingsManager = require('./utils/settingsManager');
const version = require('../package').version;
const reload = require('require-reload');

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

const cert = fs.readFileSync('/home/kurozero/.ssh/mysql-ca.pem');

const client = new Client({
    token: process.env['CLIENT_TOKEN'],
    prefix: process.env['CLIENT_PREFIX'],
    admins: (process.env['ADMINS'] || '').split(','),
    modules: resolve('modules'),
    messageLimit: 150,
    getAllUsers: true,
    disableEveryone: true,
    maxShards: processShards * parseInt(process.env['PROCESS_COUNT'], 10),
    firstShardID,
    lastShardID,
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

client
    .unregister('logger', 'console')  // use custom winston console transport
    .register('logger', 'winston', logger)
    .unregister('middleware', true)   // use custom middleware
    .register('middleware', resolve('middleware'))
    .register('commands', resolve('commands'), {groupedCommands: true});

client.db_pool = mysql.createPool({
    host: process.env['HOST'],
    port: process.env['PORT'],
    user: process.env['USER'],
    password: process.env['PASSWORD'],
    database: 'jeanne_1',
    ssl: {
        ca: cert.toString()
    }
});

client.chalk = chalk;
client.utils = utils;
client.userAgent = `Jeanne d'Arc - (https://github.com/Chaldea-devs/Jeanne) v${version}`;
client.commandsProcessed = 0;

function loadEvents() { // Load all events in events/
    return new Promise((resolve, reject) => {
        fs.readdir(`${__dirname}/events/`, (err, files) => {
            if (err) reject(`Error reading events directory: ${err}`);
            else if (!files) reject('No files in directory events/');
            else {
                for (let name of files) {
                    if (name.endsWith('.js')) {
                        name = name.replace(/\.js$/, '');
                        try {
                            events[name] = reload(`./events/${name}.js`);
                            initEvent(name);
                        } catch (e) {
                            client.logger.error(chalk.red.bold(`[Error loading ${name}] ${e}\n${e.stack}`));
                        }
                    }
                }
                resolve();
            }
        });
    });
}

function initEvent(name) { // Setup the event listener for each loaded event.
    if (name === 'messageCreate') {
        client.on('messageCreate', (msg) => {
            events['messageCreate'].handler(client, msg);
        });
    } else if (name === 'ready') {
        client.on('ready', () => {
            events['ready'].handler(client, firstShardID, lastShardID);
        });
    } else if (name === 'guildMemberAdd') {
        client.on('guildMemberAdd', (guild, member) => {
            events['guildMemberAdd'].handler(client, guild, member, settingsManager);
        });
    } else if (name === 'voiceChannelLeave') {
        client.on('voiceChannelLeave', (member, oldChannel) => {
            events['voiceChannelLeave'].handler(client, member, oldChannel);
        });
    } else if (name === 'voiceChannelSwitch') {
        client.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
            events['voiceChannelSwitch'].handler(client, member, newChannel, oldChannel);
        });
    } else {
        client.on(name, function e() { // MUST NOT BE ANNON/ARROW FUNCTION
            events[name](client, settingsManager, ...arguments);
        });
    }
}

function login() {
    client.logger.info(chalk.green.bold('Logging in...'));
    client.run().catch((err) => client.logger.error(chalk.red.bold(`[LOGIN ERROR] ${err}`)));
    startMoe(logger, chalk);
}

client.on('channelDelete', (channel) => {
    settingsManager.handleDeletedChannel(channel, client);
});

client.on('shardReady', (id) => {
    client.logger.info(chalk.green.bold(`Shard [${id}] ready`));
});

client.on('shardDisconnect', (err, id) => {
    client.logger.info(chalk.red.bold(`Shard [${id}] disconnected`));
});

client.on('shardResume', (id) => {
    client.logger.info(chalk.green.bold(`Shard [${id}] resumed`));
});

client.on('error', (err) => {
    utils.errorWebhook(client, err, 'ERROR');
});

client.on('warn', (msg) => {
    utils.errorWebhook(client, msg, 'WARN');
});

// Temporary events
client.db_pool.on('acquire', (conn) => {
    client.logger.info(chalk.green.bold(`[DB] Connection ${conn.threadId} acquired`));
});
client.db_pool.on('release', (conn) => {
    client.logger.info(chalk.green.bold(`[DB] Connection ${conn.threadId} released`));
});

loadEvents()
    .then(login)
    .catch((error) => logger.error(chalk.red.bold(`[ERROR IN INIT] ${error}`)));

process.on('SIGINT', () => {
    client.db_pool.end();
    client.editStatus('invisible', null);
    client.disconnect({reconnect: false});
    settingsManager.handleShutdown().then(() => {
        process.exit(0);
    }).catch((e) => {
        logger.error(chalk.red.bold(e));
        process.exit(0);
    });
    setTimeout(() => {
        process.exit(0);
    }, 5000);
});

process.on('uncaughtException', (err) => logger.error(err));
process.on('unhandledRejection', (err) => logger.error(err));