const reload = require('require-reload')(require);
const chalk = require('chalk');
const {Logger} = require('sylphy');
const logger = new Logger();
const {stopMoe} = require('./listenmoe');
let utils = require('./utils.js');
let genericSettings = reload('../db/genericSettings.json');
let updateGeneric = false;

setInterval(() => {
    if (updateGeneric === true) {
        utils.safeSave('db/genericSettings', '.json', JSON.stringify(genericSettings));
        updateGeneric = false;
    }
}, 20000);

function handleShutdown() {
    return new Promise((resolve, reject) => {
        utils.safeSave('db/genericSettings', '.json', JSON.stringify(genericSettings))
            .then(() => {
                stopMoe();
                resolve();
            }).catch((e) => reject(e));
    });
}

/////////// WELCOME MESSAGES ///////////

function welcome(suffix, msg, conn, results, bot) {
    if (suffix.toLowerCase() === 'disable') {
        if (results[0].welcomeMsgEnabled === 0) {
            conn.release();
            return msg.channel.createMessage('Welcome message is already disabled.');
        } else {
            conn.query('UPDATE guildSettings SET welcomeMsgEnabled=? WHERE guildID=?', [false, msg.channel.guild.id], (error) => {
                if (error) {
                    conn.release();
                    return bot.logger.error(chalk.red.bold(error));
                }
                msg.channel.createMessage('Welcome message has been disabled.');
                conn.release();
            });
        }
    } else if (suffix.toLowerCase() === 'check') {
        if (!results[0].welcomeChannel || !results[0].welcomeMsg) {
            conn.release();
            return msg.channel.createMessage('No welcome message has been set.');
        } else {
            conn.release();
            msg.channel.createMessage(`The current welcome message is: \n\`\`\`${results[0].welcomeMsg}\`\`\`\nIn channel: ${results[0].welcomeChannel === /DM/i ? 'DM' : `<#${results[0].welcomeChannel}>`}`);
        }
    } else {
        let newWelcome = suffix.replace(/(<#[0-9]+>|DM)/i, '').trim();
        if (suffix === '') {
            conn.release();
            msg.channel.createMessage('Please format your message in this format: `welcome <#channel | DM> <message>`');
        } else if (msg.channelMentions.length === 0 && !suffix.toLowerCase().startsWith('dm')) {
            conn.release();
            msg.channel.createMessage('Please specify a channel to send the welcome message to.');
        } else if (!newWelcome) {
            conn.release();
            msg.channel.createMessage('Please specify a welcome message.');
        } else if (newWelcome.length >= 1900) {
            conn.release();
            msg.channel.createMessage("Sorry, your welcome message needs to be under 1,900 characters.");
        } else {
            let welcomeChannel = suffix.toLowerCase().startsWith('dm') ? 'DM' : msg.channelMentions[0];
            conn.query('UPDATE guildSettings SET welcomeChannel=?,welcomeMsgEnabled=?,welcomeMsg=? WHERE guildID=?', [welcomeChannel, true, newWelcome, msg.channel.guild.id], (error) => {
                conn.release();
                if (error) return bot.logger.error(chalk.red.bold(error));
                msg.channel.createMessage(`⚙ Welcome message set to:\n${newWelcome} **in** ${suffix.toLowerCase().startsWith('dm') ? 'a DM' : '<#' + msg.channelMentions[0] + '>'}`);
            });
        }
    }
}

/////////// EVENT NOTIFICATIONS ///////////

const eventList = ['memberjoined', 'memberleft', 'userbanned', 'userunbanned', 'namechanged', 'nicknamechanged', 'userkicked'];

function eventHandler(suffix, msg, conn, results) {
    if (suffix.toLowerCase() === 'disable') {
        conn.query('UPDATE guildSettings SET modlogChannel=? WHERE guildID=?', [null, msg.channel.guild.id], (e) => {
            conn.release();
            logger.error(chalk.red.bold(e));
        });
        setEventChannel(msg.channel.guild.id);
        msg.channel.createMessage('⚙ Events disabled');
    } else if (suffix.toLowerCase() === 'check') {
        conn.release();
        let settings = getGuildsEvents(msg.channel.guild.id);
        msg.channel.createMessage(settings === null ? 'You do not have event logging enabled.' : `**Event settings for this server**\nChannel: <#${results[0].modlogChannel}>\n${eventList.map(e => `${e}: ${settings.subbed.includes(e) === true ? 'subscribed' : 'not subscribed'}`).join('\n')}`);
    } else {
        if (msg.channelMentions.length > 0) {
            conn.query('UPDATE guildSettings SET modlogChannel=? WHERE guildID=?', [msg.channelMentions[0], msg.channel.guild.id], (e) => {
                conn.release();
                logger.error(chalk.red.bold(e));
            });
            setEventChannel(msg.channel.guild.id, msg.channelMentions[0], results[0].modlogChannel);
            msg.channel.createMessage(`⚙ Events will be posted in <#${msg.channelMentions[0]}> now`);
        }
        if (/\+[^ ]/.test(suffix)) {
            subEvents(suffix.match(/(\+[^ ]+)/g), msg.channel)
                .then(events => {
                    msg.channel.createMessage(`Subscribed to: \`${events.join('` `')}\``);
                    conn.release();
                })
                .catch(e => {
                    msg.channel.createMessage(e);
                    conn.release();
                });
        }
        if (/-[^ ]/.test(suffix)) {
            unsubEvents(suffix.match(/(-[^ ]+)/g), msg.channel)
                .then(events => {
                    msg.channel.createMessage(`Unsubscribed from: \`${events.join('` `')}\``);
                    conn.release();
                })
                .catch(e => {
                    msg.channel.createMessage(e);
                    conn.release();
                });
        }
    }
}

function setEventChannel(guildId, channelId) {
    if (!channelId && genericSettings.hasOwnProperty[guildId] && genericSettings[guildId].hasOwnProperty('events')) {
        delete genericSettings[guildId].events; //Disable event notifications
        updateGeneric = true;
        removeIfEmpty(genericSettings, guildId);
    } else if (channelId) {
        if (!genericSettings.hasOwnProperty(guildId)) {
            genericSettings[guildId] = {
                'events': {
                    subbed: []
                }
            };
            updateGeneric = true;
        } else if (!genericSettings[guildId].hasOwnProperty('events')) {
            genericSettings[guildId].events = {
                subbed: []
            };
            updateGeneric = true;
        }
    }
}

function subEvents(eventArray, channel) {
    return new Promise((resolve, reject) => {
        if (!genericSettings.hasOwnProperty(channel.guild.id))
            genericSettings[channel.guild.id] = {};
        if (!genericSettings[channel.guild.id].hasOwnProperty('events'))
            setEventChannel(channel.guild.id, channel.id);
        eventArray = eventArray.map((i) => i.substr(1).toLowerCase());
        let subbedEvents = [];
        for (let e of eventList) {
            if (eventArray.includes(e) && !genericSettings[channel.guild.id].events.subbed.includes(e)) {
                genericSettings[channel.guild.id].events.subbed.push(e);
                subbedEvents.push(e);
            }
        }
        updateGeneric = true;
        if (subbedEvents.length > 0) {
            resolve(subbedEvents);
        } else {
            removeIfEmpty(genericSettings, channel.guild.id);
            reject('Subscribed to nothing');
        }
    });
}

function unsubEvents(eventArray, channel) {
    return new Promise((resolve, reject) => {
        if (!genericSettings.hasOwnProperty(channel.guild.id) || !genericSettings[channel.guild.id].hasOwnProperty('events'))
            return reject('You are not subscribed to any events');
        eventArray = eventArray.map((i) => i.substr(1).toLowerCase());
        let unsubbedEvents = [];
        for (let e of eventList) {
            if (eventArray.includes(e) && genericSettings[channel.guild.id].events.subbed.includes(e)) {
                genericSettings[channel.guild.id].events.subbed.splice(genericSettings[channel.guild.id].events.subbed.indexOf(e), 1);
                unsubbedEvents.push(e);
            }
        }
        if (genericSettings[channel.guild.id].events.subbed.length === 0) {
            delete genericSettings[channel.guild.id].events;
            removeIfEmpty(genericSettings, channel.guild.id);
        }
        updateGeneric = true;
        if (unsubbedEvents.length > 0)
            resolve(unsubbedEvents);
        else
            reject('Unsubscribed to nothing');
    });
}

function getEventSetting(guildId, eventQ) {
    return !!(genericSettingExistsFor(guildId, 'events') && genericSettings[guildId].events.subbed.includes(eventQ) === true);
}

function getGuildsEvents(guildId) {
    return genericSettingExistsFor(guildId, 'events') ? genericSettings[guildId].events : null;
}

////////// MISC ///////////

function handleDeletedChannel(channel, client) {
    client.db_pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return client.logger.error(chalk.red.blob(err));
        } else {
            conn.query('SELECT welcomeChannel,modlogChannel FROM guildSettings WHERE guildID=?', [channel.guild.id], (error, results) => {
                if (error) {
                    conn.release();
                    return client.logger.error(chalk.red.blob(error));
                } else if (!results[0]) {
                    return conn.release();
                } else {
                    if (channel.id === results[0].welcomeChannel && channel.id === results[0].modlogChannel) {
                        conn.query('UPDATE guildSettings SET welcomeChannel=?,modlogChannel=? WHERE guildID=?', [null, null, channel.guild.id], () => {
                            conn.release();
                        });
                    } else if (channel.id === results[0].welcomeChannel) {
                        conn.query('UPDATE guildSettings SET welcomeChannel=? WHERE guildID=?', [null, channel.guild.id], () => {
                            conn.release();
                        });
                    } else if (channel.id === results[0].modlogChannel) {
                        conn.query('UPDATE guildSettings SET modlogChannel=? WHERE guildID=?', [null, channel.guild.id], () => {
                            conn.release();
                        });
                    }
                }
            });
        }
    });
}

//Check if a guild has settings of a certain type
function genericSettingExistsFor(guildId, setting) {
    return genericSettings.hasOwnProperty(guildId) && genericSettings[guildId].hasOwnProperty(setting);
}

//Used to remove unneccesary keys.
function removeIfEmpty(obj, key, updater) {
    if (Object.keys(obj[key]).length === 0) {
        delete obj[key];
        if (updater !== undefined)
            updater = true;
    }
}

module.exports = {
    handleShutdown,
    welcome,
    handleDeletedChannel,
    eventList,
    eventHandler,
    getEventSetting
};
