let antiSpam = {};
const axios = require('axios');
const chalk = require('chalk');

function spamCheck(userId, text) {
    if (!antiSpam.hasOwnProperty(userId)) {
        antiSpam[userId] = text;
        return true;
    }
    if (antiSpam[userId] === text)
        return false;
    antiSpam[userId] = text;
    return true;
}

function trimText(cleanContent, name) {
    return cleanContent.replace(`@${name}`, '').trim();
}

async function cleverbot(jeanne, msg) {
    const permCheck = jeanne.utils.hasPermissions(msg.channel, jeanne.user, ['sendMessages']);
    if (!permCheck) return;

    const owner = jeanne.users.get(jeanne.admins[0]);
    let text = msg.channel.guild === undefined ? msg.cleanContent : trimText(msg.cleanContent, msg.channel.guild.members.get(jeanne.user.id).nick || jeanne.user.username);
    if (spamCheck(msg.author.id, text)) {
        jeanne.logger.info(`${chalk.bold.magenta(msg.channel.guild === undefined ? '(in PMs)' : msg.channel.guild.name)} > ${chalk.bold.green(msg.author.username)}: ${chalk.bold.blue(`@${jeanne.user.username}`)} ${text}`);
        if (text === '') {
            await msg.channel.createMessage(`${msg.author.username}, What do you want to talk about?`);
        } else {
            msg.channel.sendTyping();
            try {
                const res = await axios.get(`http://api.program-o.com/v2/chatbot/?bot_id=12&say=${text}&convo_id=${msg.author.id}&format=json`);
                let answer = res.data.botsay;
                if (!answer) {
                    try {
                        return await msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`);
                    } catch (error) {
                        return;
                    }
                }
                answer = answer.replace(/Chatmundo/gi, jeanne.user.username)
                    .replace(/<br\/> ?/gi, '\n')
                    .replace(/Elizabeth/gi, `${owner.tag}`)
                    .replace(/elizaibeth/gi, `${owner.tag}`);
                await msg.channel.createMessage(`${msg.author.username}, ${answer}`);
            } catch (e) {
                jeanne.logger.error(chalk.red.bold(`[cleverbot error] ${e}`));
                msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`)
                    .catch((err) => jeanne.logger.error(chalk.red.bold(`[cleverbot error] ${err}`)));
            }
        }
    }
}

module.exports = cleverbot;
