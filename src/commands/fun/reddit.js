const {Command} = require('sylphy');
const Reddit = require("nraw");

class RedditCmd extends Command {
    constructor(...args) {
        super(...args, {
            name: 'reddit',
            description: 'Search for a random post of a certain subreddit',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'fun',
            usage: [
                {name: 'subreddit', type: 'string', optional: true}
            ]
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const reddit = new Reddit(client.userAgent);
        let data, posts, post;
        try {
            data = await reddit.subreddit(rawArgs[0]).exec();
        } catch (e) {
            return logger.error(client.chalk.red.bold(e));
        }
        if (typeof data === 'object' && data[1]) {
            posts = data[0].data.children;
            post = posts[0];
        } else {
            posts = data.data.children;
            post = posts[~~(Math.random() * posts.length)];
        }
        if (post.data.over_18 && !msg.channel.nsfw) return responder.send('Found a post that was marked NSFW by reddit, try again in an NSFW channel.');
        responder.send('', {
            embed: {
                color: client.utils.getDefaultColor(msg, client),
                title: `+${post.data.score} ${post.data.title}`,
                description: `[View image](${post.data.url})\n[View post](https://www.reddit.com${post.data.permalink})`,
                image: {
                    url: post.data.url
                }
            }
        });
    }
}

module.exports = RedditCmd;