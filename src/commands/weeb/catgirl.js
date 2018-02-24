const {Command} = require('sylphy');
const axios = require('axios');
const utils = require('../../utils/utils');

class Catgirl extends Command {
    constructor(...args) {
        super(...args, {
            name: 'catgirl',
            description: 'Sends a cute catgirl image',
            options: {/* Options: hidden, permissions... */},
            group: 'anime'
        });
    }

    async handle({msg, client}) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join('');

        const sites = ['nekos.brussell', 'nekos.life'];
        const site = sites[Math.floor(Math.random() * sites.length)];

        if (!args || args === 'sfw') {
            if (site === 'nekos.brussell') {
                const res = await axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=false', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                });
                const data = res.data;
                msg.channel.createMessage({
                    embed: {
                        color: utils.getDefaultColor(msg, client),
                        description: `[ImageURL](https://nekos.brussell.me/image/${data.images[0].id})`,
                        image: {
                            url: `https://nekos.brussell.me/image/${data.images[0].id}`
                        }
                    }
                });
            } else if (site === 'nekos.life') {
                const res = await axios.get('https://nekos.life/api/neko', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                });
                const data = res.data;
                msg.channel.createMessage({
                    embed: {
                        color: utils.getDefaultColor(msg, client),
                        description: `[ImageURL](${data.neko})`,
                        image: {
                            url: data.neko
                        }
                    }
                });
            }
        } else if (args === 'nsfw') {
            if (msg.channel.nsfw === false) {
                const m = await msg.channel.createMessage('❎ | NSFW is not enabled in this channel, enable NSFW in the channel settings.');
                setTimeout(() => {
                    m.delete();
                }, 2000);
                return;
            }
            if (site === 'nekos.brussell') {
                const res = await axios.get('https://nekos.brussell.me/api/v1/random/image?nsfw=true', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                });
                const data = res.data;
                msg.channel.createMessage({
                    embed: {
                        color: utils.getDefaultColor(msg, client),
                        description: `[ImageURL](https://nekos.brussell.me/image/${data.images[0].id})`,
                        image: {
                            url: `https://nekos.brussell.me/image/${data.images[0].id}`
                        }
                    }
                });
            } else if (site === 'nekos.life') {
                const res = await axios.get('https://nekos.life/api/lewd/neko', {
                    headers: {
                        'User-Agent': client.userAgent
                    }
                });
                const data = res.data;
                msg.channel.createMessage({
                    embed: {
                        color: utils.getDefaultColor(msg, client),
                        description: `[ImageURL](${data.neko})`,
                        image: {
                            url: data.neko
                        }
                    }
                });
            }
        }
    }
}

module.exports = Catgirl;
