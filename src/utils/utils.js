const reload = require('require-reload');
const fs = require('fs');
const axios = require('axios');
let config = reload('../../config.json');
const {Logger} = require('sylphy');
const logger = new Logger();
const chalk = require('chalk');

const WebSocket = require('ws');

exports.safeSave = (file, ext, data, minSize = 5, log = true) => {
    return new Promise(async (resolve, reject) => {
        if (!file || !ext || !data)
            return reject(new Error('Invalid arguments'));
        if (file.startsWith('/')) file = file.substr(1);
        if (!ext.startsWith('.')) ext = '.' + ext;
        try {
            await fs.writeFileSync(`${__dirname}/../${file}-temp${ext}`, data);
        } catch (error) {
            logger.error(chalk.red.bold(`[SAFE SAVE WRITE] ${error}`));
            reject(error);
        }
        try {
            let stats = await fs.statSync(`${__dirname}/../${file}-temp${ext}`);
            if (stats['size'] < minSize) {
                logger.debug(chalk.blue.bold('[SAFE SAVE] Prevented file from being overwritten'));
                resolve(false);
            } else {
                try {
                    await fs.renameSync(`${__dirname}/../${file}-temp${ext}`, `${__dirname}/../${file}${ext}`);
                    resolve(true);
                    if (log === true) logger.debug(chalk.blue.bold(`[SAFE SAVE] Updated ${file}${ext}`));
                } catch (error) {
                    logger.error(chalk.red.bold(`[SAFE SAVE RENAME] ${error}`));
                    reject(error);
                }
            }
        } catch (error) {
            logger.error(chalk.red.bold(`[SAFE SAVE STAT] ${error}`));
            reject(error);
        }
    });
};

exports.findMember = (msg, str) => {
    if (!str || str === '') return false;
    const guild = msg.channel.guild;
    if (!guild) return msg.mentions[0] ? msg.mentions[0] : false;
    if (/^\d{17,18}/.test(str) || /^<@!?\d{17,18}>/.test(str)) {
        const member = guild.members.get(/^<@!?\d{17,18}>/.test(str) ? str.replace(/<@!?/, '').replace('>', '') : str);
        return member ? member.user : false;
    } else if (str.length <= 33) {
        const isMemberName = (name, str) => name === str || name.startsWith(str) || name.includes(str);
        const member = guild.members.find((m) => {
            if (m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase())) return true;
            return isMemberName(m.user.username.toLowerCase(), str.toLowerCase());
        });
        return member ? member.user : false;
    } else return false;
};

exports.findUserInGuild = (query, guild, exact = false) => {
    let found = null;
    if (query === undefined || guild === undefined)
        return found;
    query = query.toLowerCase();
    guild.members.forEach((m) => {
        if (m.user.username.toLowerCase() === query) found = m;
    });
    if (!found) guild.members.forEach((m) => {
        if (m.nick !== null && m.nick.toLowerCase() === query) found = m;
    });
    if (!found && exact === false) guild.members.forEach((m) => {
        if (m.user.username.toLowerCase().indexOf(query) === 0) found = m;
    });
    if (!found && exact === false) guild.members.forEach((m) => {
        if (m.nick !== null && m.nick.toLowerCase().indexOf(query) === 0) found = m;
    });
    if (!found && exact === false) guild.members.forEach((m) => {
        if (m.user.username.toLowerCase().includes(query)) found = m;
    });
    if (!found && exact === false) guild.members.forEach((m) => {
        if (m.nick !== null && m.nick.toLowerCase().includes(query)) found = m;
    });
    return found === null ? found : found.user;
};

exports.updateAbalBots = (id, key, server_count) => {
    if (!key || !server_count) return;
    axios.post(`https://bots.discord.pw/api/bots/${id}/stats`, {
        server_count
    }, {
        headers: {
            'Authorization': key,
            'User-Agent': USERAGENT
        }
    }).then((res) => {
        if (res.status !== 200) return logger.error(chalk.red.bold(`[ABAL BOT LIST UPDATE ERROR] ${res.status || res.data}`));
        logger.debug(chalk.blue.bold(`[ABAL BOT LIST UPDATE] Updated bot server count to ${server_count}`));
    }).catch((err) => logger.error(chalk.red.bold(`[ABAL BOT LIST UPDATE ERROR] ${err}\n${JSON.stringify(err.response.data)}`)));
};

exports.updateDiscordBots = (id, key, server_count, shard_count) => {
    if (!key || !server_count) return;
    axios.post(`https://discordbots.org/api/bots/${id}/stats`, {
        server_count,
        shard_count
    }, {
        headers: {
            'Authorization': key,
            'User-Agent': USERAGENT
        }
    }).then((res) => {
        if (res.status !== 200) return logger.error(chalk.red.bold(`[BOTS .ORG LIST UPDATE ERROR] ${res.status || res.data}`));
        logger.debug(chalk.blue.bold(`[BOTS .ORG LIST UPDATE] Updated bot server count to ${server_count}`));
    }).catch((err) => logger.error(chalk.red.bold(`[BOTS .ORG LIST UPDATE ERROR] ${err}\n${JSON.stringify(err.response.data)}`)));
};
exports.setAvatar = (bot, url) => {
    return new Promise((resolve, reject) => {
        if (bot !== undefined && typeof url === 'string') {
            axios.get(url, {
                headers: {
                    'User-Agent': USERAGENT
                },
                responseType: 'arraybuffer'
            }).then((res) => {
                if (res.status === 200) {
                    bot.editSelf({
                        avatar: `data:${res.headers['content-type']};base64,${res.data.toString('base64')}`
                    }).then(resolve)
                        .catch(reject);
                } else {
                    reject('Got status code ' + res.status || res.data);
                }
            }).catch((err) => reject(err.response.data.status + ', ' + err.response.data.message));
        } else {
            reject('Invalid parameters');
        }
    });
};

exports.formatTime = (milliseconds) => {
    let daysText = 'days';
    let hoursText = 'hours';
    let minutesText = 'minutes';
    let secondsText = 'seconds';

    let s = milliseconds / 1000;
    let seconds = (s % 60).toFixed(0);
    s /= 60;
    let minutes = (s % 60).toFixed(0);
    s /= 60;
    let hours = (s % 24).toFixed(0);
    s /= 24;
    let days = s.toFixed(0);

    if (days === 1) daysText = 'day';
    if (hours === 1) hoursText = 'hour';
    if (minutes === 1) minutesText = 'minute';
    if (seconds === 1) secondsText = 'second';

    return `${days} ${daysText}, ${hours} ${hoursText}, ${minutes} ${minutesText}, and ${seconds} ${secondsText}`;
};

exports.formatTimeForSpotify = (milliseconds) => {
    let s = milliseconds / 1000;
    let seconds = (s % 60).toFixed(0);
    s /= 60;
    let minutes = (s % 60).toFixed(0);

    return `${minutes}:${seconds}`;
};

exports.formatSeconds = (time) => {
    let days = Math.floor((time % 31536000) / 86400);
    let hours = Math.floor(((time % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
    days = days > 9 ? days : days;
    hours = hours > 9 ? hours : hours;
    minutes = minutes > 9 ? minutes : minutes;
    seconds = seconds > 9 ? seconds : seconds;
    return `${days} Days, ${hours} Hours, ${minutes} Minutes and ${seconds} Seconds`;
};

exports.formatYTSeconds = (time) => {
    let hoursText = 'hours';
    let minutesText = 'minutes';
    let secondsText = 'seconds';

    let hours = Math.floor(((time % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((time % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.round((((time % 31536000) % 86400) % 3600) % 60);
    hours = hours > 9 ? hours : hours;
    minutes = minutes > 9 ? minutes : minutes;
    seconds = seconds > 9 ? seconds : seconds;
    if (hours === 1) hoursText = 'hour';
    if (minutes === 1) minutesText = 'minute';
    if (seconds === 1) secondsText = 'second';

    return `${hours} ${hoursText}, ${minutes} ${minutesText} and ${seconds} ${secondsText}`;
};

exports.checkForUpdates = () => {
    let version = ~~(require('../../package.json').version.split('.').join(''));
    axios.get('https://raw.githubusercontent.com/kurozeroPB/Jeanne/master/package.json')
        .then((res) => {
            if (res.status !== 200) {
                logger.warn(chalk.yellow.bold(`Error checking for updates: ${res.data}`));
            } else {
                let latest = ~~(res.data.version.split('.').join(''));
                if (latest > version) logger.warn(chalk.yellow.bold('[OUT OF DATE] A new version of Jeanne is avalible'));
            }
        }).catch((err) => logger.warn(chalk.yellow.bold(`Error checking for updates:\n${err.response.data.status}, ${err.response.data.message}`)));
};

exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.sortProperties = (obj, sortedBy, isNumericSort, reverse) => {
    sortedBy = sortedBy || 1;
    isNumericSort = isNumericSort || false;
    reverse = reverse || false;

    let reversed = (reverse) ? -1 : 1;

    let sortable = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            sortable.push([key, obj[key]]);
        }
    }
    if (isNumericSort) {
        sortable.sort(function (a, b) {
            return reversed * (a[1][sortedBy] - b[1][sortedBy]);
        });
    } else {
        sortable.sort(function (a, b) {
            let x = a[1][sortedBy].toLowerCase(),
                y = b[1][sortedBy].toLowerCase();
            return x < y ? reversed * -1 : x > y ? reversed : 0;
        });
    }
    return sortable;
};

exports.startMoeWS = () => {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://listen.moe/api/v2/socket');
        ws.on('open', function open() {
            axios.post('https://listen.moe/api/authenticate', {
                username: config.listenmoe_username,
                password: config.listenmoe_password
            }, {
                headers: {
                    'User-Agent': USERAGENT,
                    'Accept': 'application/json',
                },
            }).then((res) => {
                if (res.data.success === false) return reject(res.data.message);
                const auth = JSON.stringify({
                    'token': res.data.token
                });
                ws.send(auth);
            }).catch((err) => reject(err));
        });
        ws.on('message', function incoming(data) {
            if (!data) {
                reject(new Error('No data was returned'));
            } else {
                resolve(data);
            }
        });
        setTimeout(() => {
            ws.close();
        }, 5000);
    });
};

exports.errorWebhook = (bot, error, type) => {
    if (type === 'WARN') {
        bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
            embeds: [{
                title: 'WARNING',
                color: config.warnColor,
                description: `**${new Date().toLocaleString()}**\n\n${error}`,
            }],
            username: `${bot.user.username}`,
            avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
        }).catch((err) => {
            logger.error(chalk.red.bold(err));
        });
    } else if (type === 'ERROR') {
        bot.executeWebhook(config.errWebhookID, config.errWebhookToken, {
            embeds: [{
                title: 'ERROR',
                color: config.errorColor,
                description: `**${new Date().toLocaleString()}**\n\n${error.stack ? error.stack : ''}${!error.stack ? error : ''}`,
            }],
            username: `${bot.user ? bot.user.username : 'Jeanne d\'Arc'}`,
            avatarURL: `${bot.user ? bot.user.dynamicAvatarURL('png', 2048) : 'https://b.catgirlsare.sexy/d1mh.png'}`
        }).catch((err) => {
            logger.error(chalk.red.bold(err));
        });
    }
};

exports.round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

exports.getDefaultColor = (msg, client) => {
    const user = msg.channel.guild.members.get(client.user.id);
    if (user.roles.length >= 1) return user.highestRole.color;
    else return 15277667
};