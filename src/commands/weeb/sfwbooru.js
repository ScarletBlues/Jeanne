const {Command} = require('sylphy');
const sfwbooru = require('sfwbooru');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class Sfwbooru extends Command {
    constructor(...args) {
        super(...args, {
            name: 'sfwbooru',
            description: 'Sends a sfw image from a booru site with the given tags. Use "list" as site to see the sites that can be used. Tags are separated by comma!',
            options: {permissions: ['embedLinks']},
            group: 'weeb',
            usage: [
                {name: 'site', type: 'string', optional: false},
                {name: 'tags', type: 'string', optional: true}
            ],
            aliases: ['sfw']
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const site = rawArgs[0].toLowerCase();
        const tags = rawArgs[1].split(/, ?/);

        if (!site) return responder.send('No site was given');

        if (site === 'list') {
            responder.send('', {
                embed: {
                    color: utils.getDefaultColor(msg, client),
                    author: {name: `${msg.author.username}`, icon_url: `${msg.author.avatarURL}`},
                    description: 'konachan.net, aliases: ["kn","konan","knet"]\n' +
                    'safebooru.org, aliases: ["sb","safe","safebooru"]\n' +
                    'dollbooru.org, aliases: ["do","doll","dollbooru"]'
                }
            });
        } else {
            try {
                let resp = tags
                    ? await sfwbooru.search(site, [...tags, 's'], {limit: 1, random: true})
                    : await sfwbooru.search(site, ['s'], {limit: 1, random: true});
                const images = await sfwbooru.commonfy(resp);
                for (const image of images) {
                    const imageURL = image.common.file_url.replace(/ /g, '%20');
                    responder.send('', {
                        embed: {
                            color: utils.getDefaultColor(msg, client),
                            title: 'Click here for the direct image url',
                            url: imageURL,
                            description: `Searched tags: ${tags.join(', ')}\nScore: ${image.common.score}\nRating: ${image.common.rating}`,
                            image: {url: imageURL}
                        }
                    });
                }
            } catch (e) {
                if (e.name && e.name === 'booruError') {
                    if (e.message === 'You didn\'t give any images') return responder.send(`No images were found using \`${tags.join(', ')}\``);
                    return responder.send(e.message);
                } else {
                    logger.error(chalk.red.bold(e))
                }
            }
        }
    }
}

module.exports = Sfwbooru;
