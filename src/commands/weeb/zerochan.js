const {Command} = require('sylphy');
const axios = require('axios');

class Zerochan extends Command {
    constructor(...args) {
        super(...args, {
            name: 'zerochan',
            description: 'search for an image from zerochan.',
            group: 'anime',
            aliases: ['zc']
        });
    }

    async handle({msg, client, logger}, responder) {
        let args = msg.content.split(' ');
        args.shift();
        args = args.join(' ');

        let res;
        try {
            res = await axios.get(`https://www.zerochan.net/${encodeURIComponent(args)}`, {
                headers: {'User-Agent': client.userAgent, 'Accept': 'application/json'},
                params: {json: true, s: 'random'},
                maxRedirects: 0
            });
        } catch (e) {
            if (e.response && (e.response.status === 301 || e.response.status === 302)) {
                return responder.send(`It seems like zerochan tried to redirect, maybe try a different word for what you tried to search.\nFor example: \`neko\` should be \`cat\`.`);
            }
            logger.error(client.chalk.red.bold(e));
            return responder.send(`Could not get any images for \`${args}\``);
        }

        if (!res.data.items) return responder.send(`Could not get any images for \`${args}\``);

        const id = res.data.items[0].id;
        let imgResp;
        try {
            imgResp = await axios.get(`https://www.zerochan.net/${id}`, {
                headers: {'User-Agent': client.userAgent, 'Accept': 'application/json'},
                params: {json: true}
            });
        } catch (e) {
            logger.error(client.chalk.red.bold(e));
            return responder.send(`Could not get any images for \`${args}\``);
        }

        let tags = imgResp.data.tags;
        if (!tags) {
            tags = '';
        } else {
            tags.splice(5);
            tags = tags.join(', ');
        }

        let imgBuffer;
        try {
            imgBuffer = await axios.get(imgResp.data.full, {
                headers: {'User-Agent': client.userAgent, 'Accept': 'image/*'},
                responseType: 'arraybuffer'
            });
        } catch (e) {
            logger.error(client.chalk.red.bold(e));
            return responder.send(`Something went wrong while trying to get the image, please try again later.`);
        }

        const fileType = imgBuffer.headers['content-type'].replace('image/', '');
        responder.send(`**${imgResp.data.primary}**\nTags: ${tags}`, {
            file: {
                name: `${imgResp.data.primary}.${fileType}`,
                file: imgBuffer.data
            }
        });
    }
}

module.exports = Zerochan;