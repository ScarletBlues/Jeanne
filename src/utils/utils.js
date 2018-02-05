const fs = require('fs');
const axios = require('axios');
const config = require('../../config.json');
const {Logger} = require('sylphy');
const logger = new Logger();
const chalk = require('chalk');
const WebSocket = require('ws');

/**
 *
 * @param file
 * @param ext
 * @param data
 * @param minSize
 * @param log
 * @return {Promise<any>}
 */
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

/**
 * Find a user
 * @param msg {object} The message object
 * @param str {string} Some id to find the user with
 * @return {*} Returns the user object if found else returns false
 */
exports.findUser = (msg, str) => {
    if (!str || str === '') return false;
    const guild = msg.channel.guild;
    if (!guild) return msg.mentions[0] ? msg.mentions[0] : false;
    if (str.isValidID || /^<@!?\d{17,18}>/.test(str)) {
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

/**
 * Find a user's member object for that guild
 * @param msg {object} The message object
 * @param str {string} The user's id
 * @return {*} Returns the member object if found else returns false
 */
exports.findMember = (msg, str) => {
    if (!str || str === '') return false;
    const guild = msg.channel.guild;
    if (!guild) return msg.mentions[0] ? msg.mentions[0] : false;
    if (str.isValidID || /^<@!?\d{17,18}>/.test(str)) {
        const member = guild.members.get(/^<@!?\d{17,18}>/.test(str) ? str.replace(/<@!?/, '').replace('>', '') : str);
        return member ? member : false;
    } else if (str.length <= 33) {
        const isMemberName = (name, str) => name === str || name.startsWith(str) || name.includes(str);
        const member = guild.members.find((m) => {
            if (m.nick && isMemberName(m.nick.toLowerCase(), str.toLowerCase())) return true;
            return isMemberName(m.user.username.toLowerCase(), str.toLowerCase());
        });
        return member ? member : false;
    } else return false;
};

/**
 * Update the guild count on bots.discord.pw
 * @param client {object} The client
 * @param id {string} The bot's id
 * @param key {string} The bots.pw api key
 * @param server_count {number} The bot's guild count
 */
exports.updateAbalBots = (client, id, key, server_count) => {
    if (!key || !server_count) return;
    axios.post(`https://bots.discord.pw/api/bots/${id}/stats`, {
        server_count
    }, {
        headers: {
            'Authorization': key,
            'User-Agent': client.userAgent
        }
    }).then((res) => {
        if (res.status !== 200) return logger.error(chalk.red.bold(`[ABAL BOT LIST UPDATE ERROR] ${res.status || res.data}`));
        logger.debug(chalk.blue.bold(`[ABAL BOT LIST UPDATE] Updated bot server count to ${server_count}`));
    }).catch((err) => logger.error(chalk.red.bold(`[ABAL BOT LIST UPDATE ERROR] ${err}\n${JSON.stringify(err.response.data)}`)));
};

/**
 * Update the guild/shard count on discordbots.org
 * @param client {object} The client
 * @param id {string} The bot's id
 * @param key {string} The bots.org api key
 * @param server_count {number} The bot's guild count
 * @param shard_count {number} The bot's shard count
 */
exports.updateDiscordBots = (client, id, key, server_count, shard_count) => {
    if (!key || !server_count) return;
    axios.post(`https://discordbots.org/api/bots/${id}/stats`, {
        server_count,
        shard_count
    }, {
        headers: {
            'Authorization': key,
            'User-Agent': client.userAgent
        }
    }).then((res) => {
        if (res.status !== 200) return logger.error(chalk.red.bold(`[BOTS .ORG LIST UPDATE ERROR] ${res.status || res.data}`));
        logger.debug(chalk.blue.bold(`[BOTS .ORG LIST UPDATE] Updated bot server count to ${server_count}`));
    }).catch((err) => logger.error(chalk.red.bold(`[BOTS .ORG LIST UPDATE ERROR] ${err}\n${JSON.stringify(err.response.data)}`)));
};

/**
 * Sets the bot's avatar
 * @param bot {object} The client
 * @param url {string} The avatar to set
 * @return {Promise<any>} The result
 */
exports.setAvatar = (bot, url) => {
    return new Promise((resolve, reject) => {
        if (bot !== undefined && typeof url === 'string') {
            axios.get(url, {
                headers: {
                    'User-Agent': bot.userAgent
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

/**
 * Format milliseconds to human readable time
 * @param milliseconds
 * @return {string}
 */
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

/**
 * Formats seconds to human readable time
 * @param time
 * @return {string}
 */
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

/**
 * Format the time returned by the spotify command
 * @param milliseconds
 * @return {string}
 */
exports.formatTimeForSpotify = (milliseconds) => {
    let s = milliseconds / 1000;
    let seconds = (s % 60).toFixed(0);
    s /= 60;
    let minutes = (s % 60).toFixed(0);

    return `${minutes}:${seconds}`;
};

/**
 * Formats the time returned from the youtube commands
 * @param time
 * @return {string}
 */
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

/**
 * Gets a random number between the specified min-max
 * @param min {number} Min number to get from
 * @param max {number} Max number to get from
 * @return {number}
 */
exports.getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Sort an array or object however you want
 * @param obj {object} The stuff to sort
 * @param sortedBy
 * @param isNumericSort
 * @param reverse {boolean}
 * @return {Array}
 */
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

/**
 * Requests song data from listen.moe
 * @param client {object} The client
 */
exports.startMoeWS = (client) => {
    const ws = new WebSocket('wss://listen.moe/api/v2/socket');
    ws.on('open', async () => {
        let resp;
        try {
            resp = await axios.post('https://listen.moe/api/authenticate', {
                username: config.listenmoe.username,
                password: config.listenmoe.password
            }, {
                headers: {
                    'User-Agent': client.userAgent,
                    'Accept': 'application/json',
                },
            });
        } catch (error) {
            throw new Error(error);
        }
        if (!resp.data.success) throw new Error(resp.data.message);
        const auth = JSON.stringify({token: resp.data.token});
        ws.send(auth, (e) => {
            if (e) {
                throw new Error(e);
            }
        });
    });
    ws.on('message', async (data) => {
        if (!data) {
            throw new Error('No data was returned');
        } else {
            return data;
        }
    });
    setTimeout(() => {
        ws.close();
        console.log('[ws] Closing listen.moe websocket');
    }, 5000);
};

/**
 * Executes the error webhook in my private guild
 * @param bot {object} The client
 * @param error {Error} The error
 * @param type {string} The type of "error", can be WARN or ERROR
 */
exports.errorWebhook = (bot, error, type) => {
    if (type === 'WARN') {
        bot.executeWebhook(config.webhooks.errorID, config.webhooks.errorToken, {
            embeds: [{
                title: 'WARNING',
                color: config.colours.yellow,
                description: `**${new Date().toLocaleString()}**\n\n${error}`,
            }],
            username: `${bot.user.username}`,
            avatarURL: `${bot.user.dynamicAvatarURL('png', 2048)}`
        }).catch((err) => {
            logger.error(chalk.red.bold(err));
        });
    } else if (type === 'ERROR') {
        bot.executeWebhook(config.webhooks.errorID, config.webhooks.errorToken, {
            embeds: [{
                title: 'ERROR',
                color: config.colours.red,
                description: `**${new Date().toLocaleString()}**\n\n${error.stack ? error.stack : ''}${!error.stack ? error : ''}`,
            }],
            username: `${bot.user ? bot.user.username : 'Jeanne d\'Arc'}`,
            avatarURL: `${bot.user ? bot.user.dynamicAvatarURL('png', 2048) : 'https://b.catgirlsare.sexy/d1mh.png'}`
        }).catch((err) => {
            logger.error(chalk.red.bold(err));
        });
    }
};

/**
 * Round a number with the specified precision
 * @param value {number} The value to round
 * @param precision {number} The precision to round
 * @return {number} The rounded value
 */
exports.round = (value, precision) => {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};

/**
 * Get the highest role colour if one exits else return 15277667 as defautl colour
 * @param obj {object} The message or guild object depending on if guild is true or false
 * @param client {object} The client object
 * @param guild {boolean} Wether obj is a guild object or not, defaults to false
 * @returns {number} The colour
 */
exports.getDefaultColor = (obj, client, guild = false) => {
    let user;
    if (guild) user = obj.members.get(client.user.id);
    else user = obj.channel.guild.members.get(client.user.id);

    if (user.roles.length >= 1) {
        if (user.highestRole.color === 0) return 15277667;
        else return user.highestRole.color;
    } else return 15277667
};

/**
 *
 * @param a {object} The stuff to filter
 * @returns {object} The filtered object
 */
exports.unique = (a) => {
    let prims = {'boolean': {}, 'number': {}, 'string': {}}, objs = [];
    return a.filter(function (item) {
        let type = typeof item;
        if (type in prims) {
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        } else {
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
        }
    });
};

/**
 * Checks if the user as all the permissions from the specified array
 * @param channel {object} The channel object
 * @param user {object} The user's object
 * @param perms {array} An array of permissions
 * @return {boolean}
 */
exports.hasPermissions = (channel, user, ...perms) => {
    const member = channel.guild.members.get(user.id);
    for (let perm of perms) {
        if (!member.permission.has(perm)) return false;
    }
    return true;
};

/**
 * Probably not best practice but just to make me have to do less later on owo
 */
Object.defineProperty(String.prototype, 'isValidID', {
    get: function () { // Do not make arrow function!
        return /^\d{17,18}$/.test(this);
    }
});