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

async function cleverbot(client, msg) {
    const owner = client.users.get(client.admins[0]);
    let text = msg.channel.guild === undefined ? msg.cleanContent : trimText(msg.cleanContent, msg.channel.guild.members.get(client.user.id).nick || client.user.username);
    if (spamCheck(msg.author.id, text)) {
        client.logger.info(`${chalk.bold.magenta(msg.channel.guild === undefined ? '(in PMs)' : msg.channel.guild.name)} > ${chalk.bold.green(msg.author.username)}: ${chalk.bold.blue(`@${client.user.username}`)} ${text}`);
        if (text === '') {
            try {
                await msg.channel.createMessage(`${msg.author.username}, What do you want to talk about?`);
            } catch (error) {
                return;
            }
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
                answer = answer.replace(/Chatmundo/gi, client.user.username)
                    .replace(/<br\/> ?/gi, '\n')
                    .replace(/Elizabeth/gi, `${owner.tag}`)
                    .replace(/elizaibeth/gi, `${owner.tag}`);
                await msg.channel.createMessage(`${msg.author.username}, ${answer}`);
            } catch (e) {
                client.logger.error(chalk.red.bold(`[cleverbot error] ${e}`));
                msg.channel.createMessage(`${msg.author.username}, I don't wanna talk right now :slight_frown:`)
                    .catch((err) => client.logger.error(chalk.red.bold(`[cleverbot error] ${err}`)));
            }
        }
    }
}

module.exports = cleverbot;