const {Command} = require('sylphy');
const mm = require('mario-maker');

class MarioMaker extends Command {
    constructor(...args) {
        super(...args, {
            name: 'mariomaker',
            description: 'Get info about a course',
            options: {
                botPermissions: ['embedLinks']
            },
            group: 'gaming',
            usage: [
                {name: 'courseID', type: 'string', optional: false}
            ],
            aliases: ['mm']
        });
    }

    async handle({msg, client, rawArgs, logger}, responder) {
        const courseID = rawArgs[0];
        const courseIDCheck = new RegExp(/^[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}$/);
        if (!courseID.match(courseIDCheck)) return responder.send(`${msg.author.mention}, That is **not** a valid course id.`);
        mm.getCourse(courseID, (error, response, json) => {
            if (error) return logger.error(client.chalk.red.bold(error));
            if (response.statusCode !== 200) return responder.send('Ohno, something went wrong while requesting the course data!');
            responder.send('', {
                embed: {
                    color: client.utils.getDefaultColor(msg, client),
                    title: json.course_title,
                    fields: [
                        {name: 'Difficulty', value: json.difficulty, inline: true},
                        {name: 'Clear rate', value: json.clear_rate + '%', inline: true},
                        {name: 'Clears', value: json.clears, inline: true},
                        {name: 'Attempts', value: json.attempts, inline: true},
                        {name: 'Stars', value: json.stars, inline: true},
                        {name: 'Tag', value: json.tag, inline: true},
                        {name: 'Creator name', value: json.creator_name, inline: true},
                        {name: 'Created at', value: json.created_at, inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: 'World record name', value: json.world_record.name, inline: true},
                        {name: 'World record time', value: json.world_record.time, inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: 'First clear', value: json.first_clear.name ? json.first_clear.name : '-', inline: true},
                        {name: 'Recent player', value: json.recent_players.user_name ? json.recent_players.user_name : '-', inline: true},
                        {name: '\u200b', value: '\u200b', inline: true}
                    ],
                    image: {url: json.course_img_full ? json.course_img_full : ''}
                }
            });
        });
    }
}

module.exports = MarioMaker;