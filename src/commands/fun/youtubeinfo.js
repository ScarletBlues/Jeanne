const {Command} = require('sylphy');
const fetchVideoInfo = require('youtube-info');
const {formatYTSeconds, getYouTubeVideoId} = require('../../utils/utils');
const utils = require('../../utils/utils');
const chalk = require('chalk');

class YTInfo extends Command {
    constructor(...args) {
        super(...args, {
            name: 'youtubeinfo',
            description: 'Get info about a youtube video',
            options: {botPermissions: ['embedLinks']},
            group: 'fun',
            usage: [
                {name: 'yt_url/video_id', type: 'string', optional: false}
            ],
            aliases: ['ytinfo']
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        let videoInfo;
        try {
            const youtubeID = await getYouTubeVideoId(rawArgs[0]);
            videoInfo = await fetchVideoInfo(youtubeID);
        } catch (e) {
            return logger.error(chalk.red.bold(e));
        }
        if (!videoInfo) return responder.send('Could not get info for this video.');
        let desc = 'n/a';
        if (videoInfo.description) {
            desc = videoInfo.description.replace(/ ?<br> ?/g, '\n');
            if (desc.length > 500) desc = desc.slice(0, 500);
        }
        responder.send('', {
            embed: {
                color: utils.getDefaultColor(msg, client),
                title: videoInfo.title ? videoInfo.title : 'N/A',
                url: videoInfo.url ? videoInfo.url : '',
                thumbnail: {url: videoInfo.thumbnailUrl ? videoInfo.thumbnailUrl : ''},
                description: desc ? desc : '-',
                fields: [
                    {name: 'Owner', value: videoInfo.owner ? videoInfo.owner : '-', inline: true},
                    {name: 'Views', value: videoInfo.views ? videoInfo.views : '-', inline: true},
                    {name: 'Paid', value: videoInfo.paid ? videoInfo.paid : '-', inline: true},
                    {name: 'Publish Date', value: videoInfo.datePublished ? videoInfo.datePublished : '-', inline: true},
                    {name: 'Genre', value: videoInfo.genre ? videoInfo.genre : '-', inline: true},
                    {name: 'Family Friendly', value: videoInfo.isFamilyFriendly ? videoInfo.isFamilyFriendly : '-', inline: true},
                    {name: 'Duration', value: formatYTSeconds(videoInfo.duration ? videoInfo.duration : 0), inline: false},
                    {name: 'Channel', value: `https://www.youtube.com/channel/${videoInfo.channelId ? videoInfo.channelId : ''}`, inline: false}
                ]
            }
        });
    }
}

module.exports = YTInfo;
