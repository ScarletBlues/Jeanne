const {Command} = require('sylphy');
const axios = require('axios');

class Avatar extends Command {
    constructor(...args) {
        super(...args, {
            name: 'avatar',
            description: 'Sends your or someone else\'s avatar',
            group: 'general',
            aliases: ['ava', 'pfp', 'avi']
        });
    }

    async handle({msg, client}, responder) {
        if (!msg.args) {
            const resp = await axios.get(msg.author.dynamicAvatarURL('', 1024), {
                headers: {'Accept': 'image/*'},
                responseType: 'arraybuffer'
            });
            const fileType = resp.headers['content-type'].replace('image/', '');
            responder.send('', {
                file: {
                    name: `${msg.author.username}.${fileType}`,
                    file: resp.data
                }
            });
        } else {
            const member = client.utils.findMember(msg, msg.args);
            if (!member) return responder.send(`Oops, it seems like I cound't find a member with \`${msg.args}\`\nPlease specify a name, ID or mention the user.`);
            const resp = await axios.get(member.dynamicAvatarURL('', 1024), {
                headers: {'Accept': 'image/*'},
                responseType: 'arraybuffer'
            });
            const fileType = resp.headers['content-type'].replace('image/', '');
            responder.send('', {
                file: {
                    name: `${member.username}.${fileType}`,
                    file: resp.data
                }
            });
        }
    }
}

module.exports = Avatar;